// ==UserScript==
// @name         Forum Scraper
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @license      MIT
// @description  Scrapes the forum for links and displays them on TMDb.
// @author       Michael Chen
// @match        https://fora.snahp.eu/*
// @match        https://www.themoviedb.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490132/Forum%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/490132/Forum%20Scraper.meta.js
// ==/UserScript==

(async function () {
  "use strict";
  const localTest = false;
  const host = localTest ? "http://localhost:5183" : "https://snahp.cnml.de";
  const snahpHost = "https://fora.snahp.eu";
  const autoScrapeKey = "autoScrape";
  let pageScraped = false;

  /**
   * @param {boolean} renew
   * @returns {string}
   */
  function getApiKey(renew = false) {
    const apiKeyKey = "apiKey";
    const key = localStorage.getItem(apiKeyKey);
    if (key !== null && !renew) return key;
    const newKey = prompt(
      `Please enter your API key for '${host}'!`,
      key ?? undefined
    );
    if (newKey === null) {
      localStorage.removeItem(apiKeyKey);
      throw new Error("User provided no api key, cancelling script!");
    }
    localStorage.setItem(apiKeyKey, newKey);
    return newKey;
  }

  /**
   * @param {"GET" | "POST"} method
   * @param {string} path
   * @param {BodyInit | null} body
   */
  async function fetchWrap(method, path, body = null) {
    var url = new URL(path, host);
    let renew = false;
    while (true) {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": getApiKey(renew),
        },
        body,
      });
      if (response.status === 401) {
        console.warn("Request was unauthorized!");
        renew = true;
        continue;
      }
      return response;
    }
  }

  /**
   * @param {URL} url
   * @param {string} name
   */
  function intParam(url, name) {
    const param = url.searchParams.get(name);
    if (param === null)
      throw new Error(`Required topic param ${JSON.stringify(name)} missing!`);
    return Number.parseInt(param);
  }

  /**
   * @param {Element} element
   * @param {string} name
   */
  function extractInteger(element, name) {
    const descriptor = element.querySelector(`.${name}`);
    if (descriptor === null)
      throw new Error(`Required topic descriptor with class ${name} missing!`);
    const text = descriptor.textContent;
    if (text === null)
      throw new Error(`No text in topic descriptor with class ${name}!`);
    return Number.parseInt(text);
  }

  /**
   * @param {Element} element
   * @returns {Author | null}
   */
  function parseAuthorElement(element) {
    const hrefUrl = element.getAttribute("href");
    if (hrefUrl === null) return null;
    const url = new URL(hrefUrl, window.location.href);

    if (url.searchParams.get("mode") !== "viewprofile")
      throw new Error("Author URL is invalid!");

    const id = intParam(url, "u");
    const name = element.textContent;
    if (name === null) throw new Error("No author name!");
    return { id, name };
  }

  /**
   * @param {Element} element
   */
  function parseDate(element) {
    const text = element.textContent;
    if (text === null) return null;
    const regex =
      /(?<day>\d+)\s+(?<month>jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(?<year>\d{4})\s*,\s*(?<hour>\d{1,2}):(?<minute>\d{1,2})/i;
    const m = regex.exec(text);
    if (m === null) return null;
    const parsed = Date.parse(m[0]);
    if (isNaN(parsed)) return null;
    return new Date(parsed);
  }

  /**
   * @param {Element} element
   * @returns {AuthorTopic}
   */
  function parseTopicElement(element) {
    const titleElement = element.querySelector(".topictitle");
    if (titleElement === null) throw new Error("No title element!");

    const name = titleElement.textContent;
    if (name === null) throw new Error("Title is null!");

    const hrefUrl = titleElement.getAttribute("href");
    if (hrefUrl === null) throw new Error("No post URL!");
    const url = new URL(hrefUrl, window.location.href);
    const forumId = intParam(url, "f");
    const topicId = intParam(url, "t");
    const postCount = extractInteger(element, "posts");
    const viewCount = extractInteger(element, "views");

    const authorElement = element.querySelector(
      ":is(.username, .username-coloured)"
    );
    if (authorElement === null)
      throw new Error("Poster has no author element!");

    const posterElement = authorElement.parentElement;
    if (posterElement === null) throw new Error("Topic has no poster element!");

    const timestamp = parseDate(posterElement);
    if (timestamp === null) throw new Error("Topic timestamp not found!");
    const author = parseAuthorElement(authorElement);

    return {
      name,
      forumId,
      id: topicId,
      postCount,
      viewCount,
      authorId: author?.id ?? null,
      authorName: author?.name ?? null,
      timestamp,
      movieId: null,
    };
  }

  /**
   * @param {number} id
   */
  async function getMovieInfo(id) {
    const request = await fetchWrap("GET", `/api/movie/${id}`);
    /** @type {Movie} */
    const movie = await request.json();
    return movie;
  }

  function getAutoScrapeState() {
    return localStorage.getItem(autoScrapeKey) !== null;
  }

  /**
   * @param {boolean} enabled
   * @returns
   */
  function setAutoScrapeState(enabled) {
    if (enabled) localStorage.setItem(autoScrapeKey, "true");
    else localStorage.removeItem(autoScrapeKey);
    return enabled;
  }

  function addAutoscrapeToggle() {
    const topBar = document.querySelector(".action-bar.bar-top");
    if (topBar === null) {
      console.error("Could not position the autoscrape toggle!");
      return;
    }

    const autoScrapeEnabled = getAutoScrapeState();
    const toggler = document.createElement("a");
    toggler.classList.add("button");
    toggler.title = autoScrapeEnabled
      ? "Disable AutoScrape"
      : "Enable AutoScrape";
    toggler.addEventListener("click", () => {
      let enabled = getAutoScrapeState();
      enabled = setAutoScrapeState(!enabled);
      toggler.title = enabled ? "Disable AutoScrape" : "Enable AutoScrape";
      textNode.textContent = enabled ? "Pause" : "Scrape";
      icon.classList.remove(!enabled ? "fa-pause" : "fa-play");
      icon.classList.add(enabled ? "fa-pause" : "fa-play");
      if (enabled && pageScraped) runAutoScrape();
    });
    const label = document.createElement("span");
    const textNode = document.createTextNode(
      autoScrapeEnabled ? "Pause" : "Scrape"
    );
    label.appendChild(textNode);

    const icon = document.createElement("i");
    icon.classList.add(
      "icon",
      "fa-fw",
      autoScrapeEnabled ? "fa-pause" : "fa-play"
    );
    label.appendChild(icon);
    toggler.appendChild(label);
    topBar.prepend(toggler);
  }

  function runAutoScrape() {
    const url = new URL(window.location.href);
    const isTopic = url.searchParams.get("t") !== null;
    if (isTopic) {
      console.log("Autoscrape disabled on topics.");
      return;
    }
    openNextPage();
  }

  function openNextPage() {
    /** @type {HTMLAnchorElement | null} */
    const nextButton = document.querySelector(
      "#page-body > div.action-bar.bar-top > div.pagination > ul > li.arrow.next > a"
    );
    if (nextButton === null)
      throw new Error("No next button found on this page!");
    nextButton.click();
  }

  /**
   * @param {Element} forumElement
   * @param {number | null} parentId
   * @returns {Forum}
   */
  function parseForumElement(forumElement, parentId) {
    const name = forumElement.textContent;
    if (name === null) throw new Error("Forum has no title!");
    const href = forumElement.getAttribute("href");
    if (href === null)
      throw new Error(`Forum ${JSON.stringify(name)} has no url!`);
    const url = new URL(href, window.location.href);
    const id = intParam(url, "f");
    return { id, name, parentId };
  }

  async function scrapeForums() {
    const forumElements = document.querySelectorAll("a.forumtitle");
    const parentIdStr = new URL(window.location.href).searchParams.get("f");
    const parentId = parentIdStr === null ? null : Number.parseInt(parentIdStr);

    /** @type {Forum[]} */
    const forums = [];
    for (const forumElement of forumElements)
      forums.push(parseForumElement(forumElement, parentId));

    if (forums.length === 0) {
      console.log("No forums found!");
      return;
    }

    const request = await fetchWrap(
      "POST",
      `/api/forums/scrape`,
      JSON.stringify(forums)
    );
    const text = await request.text();
    console.log(text);
  }

  async function scrapeTopics() {
    const topicElements = document.querySelectorAll(".topics > li > dl");
    const topics = [];
    for (const topicElement of topicElements)
      topics.push(parseTopicElement(topicElement));

    await uploadTopics(topics);
  }

  /**
   * @param {AuthorTopic[]} topics
   */
  async function uploadTopics(topics) {
    if (topics.length === 0) {
      console.log("No topics found!");
      return;
    }

    const request = await fetchWrap(
      "POST",
      `/api/topics/scrape`,
      JSON.stringify(topics)
    );
    const text = await request.text();
    console.log(text);
  }

  async function snahpForum() {
    addAutoscrapeToggle();

    await Promise.all([scrapeTopics(), scrapeForums()]);

    pageScraped = true;
    if (getAutoScrapeState()) runAutoScrape();
  }

  /**
   * @param {string[]} pathSegments
   */
  function getMovieId(pathSegments) {
    const [root, movieArea, identifier] = pathSegments;
    if (root !== "" || movieArea !== "movie" || identifier === undefined)
      throw new Error("Not a movie page!");
    let dash;
    return Number.parseInt(
      (dash = identifier.indexOf("-")) >= 0
        ? identifier.substring(0, dash)
        : identifier
    );
  }

  /**
   * @param {string} name
   * @returns {string}
   */
  function threeLetterWords(name) {
    const sep = " ";
    return name
      .split(sep)
      .filter((i) => i.length >= 3)
      .join(sep);
  }

  /**
   * @param {Topic[]} topics
   * @param {Movie} movieInfo
   * @returns {HTMLElement}
   */
  function createLinkSection(topics, movieInfo) {
    const sectionElement = document.createElement("section");
    sectionElement.setAttribute("class", "panel");

    const titleElement = document.createElement("h3");
    titleElement.setAttribute("dir", "auto");
    titleElement.appendChild(document.createTextNode("Snahp Forum Topics"));
    sectionElement.appendChild(titleElement);

    const watchedStateElementPar = document.createElement("p");
    const watchedStateElement = document.createElement("i");
    watchedStateElement.appendChild(
      document.createTextNode(
        `You have ${
          movieInfo.watched
            ? movieInfo.collected
              ? "already collected and watched"
              : "already watched, but not collected"
            : movieInfo.collected
            ? "already collected but not watched"
            : "neither watched nor collected"
        } this movie.`
      )
    );
    watchedStateElementPar.appendChild(watchedStateElement);
    sectionElement.appendChild(watchedStateElementPar);
    sectionElement.appendChild(document.createElement("br"));

    if (topics.length === 0) {
      const noTopics = document.createElement("i");
      noTopics.appendChild(document.createTextNode("No matching topics!"));
      sectionElement.appendChild(noTopics);
    } else {
      const listElement = document.createElement("ul");
      for (const topic of topics) {
        const listItemElement = document.createElement("li");

        const linkElement = document.createElement("a");
        const viewUrl = new URL("/viewtopic.php", snahpHost);
        viewUrl.searchParams.set("f", topic.forumId.toString());
        viewUrl.searchParams.set("t", topic.id.toString());
        linkElement.setAttribute("href", viewUrl.href);
        linkElement.appendChild(document.createTextNode(topic.name));
        listItemElement.appendChild(linkElement);

        listElement.appendChild(listItemElement);
      }
      sectionElement.appendChild(listElement);
    }

    const searchPar = document.createElement("p");
    searchPar.classList.add("new_button");

    const searchLink = document.createElement("a");
    const searchUrl = new URL("/search.php", snahpHost);
    searchUrl.searchParams.set(
      "keywords",
      `${threeLetterWords(movieInfo.name)} ${movieInfo.year}`
    );
    searchUrl.searchParams.set("sf", "titleonly");
    // searchUrl.searchParams.append("fid[]", "56"); // only search HEVC forum
    searchLink.setAttribute("href", searchUrl.href);
    searchLink.appendChild(document.createTextNode("Search For Posts"));
    searchPar.appendChild(searchLink);

    sectionElement.appendChild(document.createElement("br"));
    sectionElement.appendChild(searchPar);
    return sectionElement;
  }

  async function movieDb() {
    const url = window.location;
    const pathSegments = url.pathname.split("/");
    const movieInfo = await getMovieInfo(getMovieId(pathSegments));
    console.log(`Movie ID is ${movieInfo.id}`);
    if (pathSegments.length !== 3) return;

    const column = document.querySelector(".white_column");
    if (column === null) throw new Error("No main column found!");

    const result = await fetchWrap("GET", `/api/movie/${movieInfo.id}/topics`);
    /** @type {Topic[]} */
    const topics = await result.json();
    const section = createLinkSection(topics, movieInfo);
    column.prepend(section);
  }

  /** @type {Record<string, () => Promise<void>>} */
  const method = {
    "https://www.themoviedb.org": movieDb,
    [snahpHost]: snahpForum,
  };
  await (
    method[window.location.origin] ||
    (async () => console.log(`Unknown host '${window.location}'`))
  )();
})();
