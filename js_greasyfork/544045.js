// ==UserScript==
// @name         Chub.AI Timeline Improvements
// @description  Make timeline easier to use
// @match        https://chub.ai/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_registerMenuCommand
// @version      2025.09.13c
// @author       anden3
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/url#sha384-MW/Hes7CLT6ZD4zwzTUVdtXL/VaIDQ3uMFVuOx46Q0xILNG6vEueFrCaYNKw+YE3
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @namespace    https://greasyfork.org/users/1499640
// @downloadURL https://update.greasyfork.org/scripts/544045/ChubAI%20Timeline%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/544045/ChubAI%20Timeline%20Improvements.meta.js
// ==/UserScript==

/* globals VM */
/* jshint esversion: 11 */

let API_KEY = "YOUR API KEY HERE";
const HIDE_RECOMMENDED_CARDS = false;

const API_BASE = "https://inference.chub.ai/api";
const INTERNAL_API_BASE = "https://gateway.chub.ai";

const HIDDEN_CARDS_KEY = "hiddenCards";

(async function() {
  'use strict';

  // Acquire API key. First check localStorage, next cache, and last the hardcoded value.
  const localStorageAPIKey = localStorage.getItem("URQL_TOKEN");

  if (localStorageAPIKey !== null) {
    API_KEY = localStorageAPIKey;
    await GM.setValue("API_KEY", API_KEY);
  } else {
    const possiblyCachedAPIKey = await GM.getValue("API_KEY", null) ?? null;

    if (possiblyCachedAPIKey !== null) {
      API_KEY = possiblyCachedAPIKey;
    } else if (API_KEY !== "YOUR API KEY HERE") {
      await GM.setValue("API_KEY", API_KEY);
    } else {
      throw new Error("No API key could be located, please log in.");
    }
  }

  const { onNavigate } = VM;

  async function queryApi(url, queryParams = {}, method = "GET") {
    const searchParams = new URLSearchParams(queryParams);
    console.log(`${url}?${searchParams}`);

    const response = await fetch(`${url}?${searchParams}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "CH-API-KEY": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();

    if (result.error !== undefined) {
      console.error(`API Query failed: ${result}`);
      throw new Error(result);
    }

    return result;
  }

  async function queryPublicApi(endpoint, queryParams = {}, method = "GET") {
    return await queryApi(`${API_BASE}/${endpoint}`, queryParams, method);
  }

  async function queryInternalApi(endpoint, queryParams = {}, method = "GET") {
    return await queryApi(`${INTERNAL_API_BASE}/${endpoint}`, queryParams, method);
  }


  async function getProfile() {
    return await queryInternalApi("api/account");
  }

  async function fetchCharacter(author, character) {
    const data = await queryInternalApi(`api/characters/${author}/${character}`, { full: true });
    return data?.node ?? null;
  }

  async function fetchTimeline(page) {
    const cards = await queryInternalApi("api/timeline/v1", { page, count: false });

    return cards.data.nodes.map(card => {
      const author = card.fullPath.split("/")[0];

      return {
        ...card,
        author,
      };
    });
  }

  async function fetchSearchResults(searchParams, extraKeys = {}) {
    const items = await queryInternalApi("search", searchParams, "POST");
    return items.data.nodes.map(card => {
      return {
        ...card,
        ...extraKeys,
      };
    });
  }

  async function fetchAuthorCards(author, page) {
    const PAGE_SIZE = 50;

    return await fetchSearchResults({
      page,
      username: author,
      first: PAGE_SIZE,
      namespace: 'characters',
      nsfw: true,
      nsfl: true,
      chub: true,
      count: true,
      exclude_mine: true,
      include_forks: true,
      sort: 'created_at',
      min_tokens: 0,
    }, { author });
  }

  async function fetchFavorites() {
    return await queryPublicApi("favorites");
  }

  async function fetchFollows() {
    const profile = await getProfile();

    if (profile.user_name === "You") {
      alert("The API key provided to this userscript (Chub.AI Timeline Improvements) is invalid.\nDisable this userscript if this alert is annoying.");
      throw new Error("API key failed to authenticate user, most likely invalid.");
    }

    let follows = {
      users: [],
      tags: [],
    };

    let page = 1;

    while (true) {
      let followData = await queryInternalApi(`api/follows/${profile.user_name}`, { page: page });

      if (followData.follows.length + followData.tag_follows.length === 0) {
        break;
      }

      follows.users.push(...followData.follows);
      follows.tags.push(...followData.tag_follows);

      page += 1;
      // Sleep
      await new Promise(r => setTimeout(r, 1000));
    }

    return follows;
  }

  async function getVisibleCards() {
    // Wait for cards to exist.
    try {
      await waitForElement("#chara-list", 5000);
    } catch {
      return [];
    }

    return Array.from(document.querySelectorAll("#chara-list > a"))
      .map(node => {
      const path = node.attributes.href.value;
      const forkUrl = node.querySelector("a:has(.anticon-fork)")?.attributes?.href?.value ?? null;
      const fork = forkUrl?.replace(/^\/characters\//, "") ?? null;

      return {
        node,
        path,
        fork,
      };
    });
  }

  function modifyCard(element, isFavorited, forkOfFave, isNew, isHidden, highlightUser, tagsToHighlight, onHideButtonClick, onHiddenCardClick) {
    const cardBody = element.querySelector(".ant-card-body");

    // Add hide button.
    const moreButton = element.querySelector("button:has(span.anticon-more)");
    const buttonRow = moreButton.parentElement;

    let hideButton = document.createElement("button");
    hideButton.style = moreButton.style;
    hideButton.type = "button";
    hideButton.classList = moreButton.classList;
    hideButton.innerText = "🗑";

    moreButton.style.display = "none";
    buttonRow.appendChild(hideButton);

    hideButton.addEventListener("click", evt => {
      evt.stopPropagation();
      evt.preventDefault();

      cardBody.style.display = "none";
      isHidden = true;
      onHideButtonClick();
    });

    element.addEventListener("click", evt => {
      if (isHidden) {
        evt.stopImmediatePropagation();
        evt.stopPropagation();
        evt.preventDefault();

        cardBody.style.display = "unset";
        isHidden = false;

        onHiddenCardClick();
      }
    });

    if (isFavorited) {
      element.style.setProperty("border-top", "thick solid pink", "important");
      isHidden = true;
    }

    if (isHidden) {
      cardBody.style.display = "none";
    }

    if (!isNew) {
      element.style.opacity = "0.5";
    }

    if (highlightUser) {
      const userLink = element.querySelector(".ant-row > p > a");
      userLink.style.color = "cyan";
    }

    if (forkOfFave) {
      const fork = element.querySelector("a:has(.anticon-fork)");
      fork.style.color = "cyan";
    }

    if (tagsToHighlight.length > 0) {
      const lowercaseTags = tagsToHighlight.map(tag => tag.toLowerCase());
      let tagsNotInContainer = tagsToHighlight;

      const tagContainer = element.querySelector(".ant-row > div:has(> span.cursor-pointer > .ant-tag)");
      const tags = Array.from(
        tagContainer.querySelectorAll("span.cursor-pointer > .ant-tag > span:first-child")
      );

      if (tags.length === 0) {
        // Need to create our own tag elements.
        return;
      }

      const tagToCopy = tags[0].parentElement.parentElement;

      const existingTags = new Map(tags.map(tag => [tag.textContent.toLowerCase(), [tag.parentElement.parentElement, tag]]));

      let tagElementsToHighlight = [];

      for (let i = tagsToHighlight.length - 1; i >= 0; i--) {
        if (existingTags.has(lowercaseTags[i])) {
          tagsNotInContainer.splice(i, 1);

          const [tagElement, tagTextElement] = existingTags.get(lowercaseTags[i]);
          tagElementsToHighlight.push([tagElement, tagTextElement]);

        } else {
          const clonedTag = tagToCopy.cloneNode(true);
          const clonedTagText = clonedTag.querySelector(".ant-tag > span:first-child");
          clonedTagText.textContent = tagsToHighlight[i];
          tagElementsToHighlight.push([clonedTag, clonedTagText]);
        }
      }

      tagElementsToHighlight.sort((a, b) => a[1].textContent.toLowerCase() < b[1].textContent.toLowerCase() ? -1 : 1);


      for (let i = tagElementsToHighlight.length - 1; i >= 0; i--) {
        const [tagElement, tagTextElement] = tagElementsToHighlight[i];
        tagTextElement.style.color = "cyan";
        tagContainer.insertBefore(tagElement, tagContainer.children[0]);
      }
    }
  }

  async function modifyCharacterPage(author, rating, highlightDiscussion, hideGallery, publicChatCount, forkCount, highlightUser, tagsToHighlight) {
    let element;
    try {
      element = await waitForElement(".ant-row-center", 5000);
    } catch {
      console.error("no character elements found");
      return;
    }

    if (HIDE_RECOMMENDED_CARDS) {
      const characterList = document.querySelector("#chara-list");
      if (characterList) {
        characterList.style.display = "none";
      }
    }

    const headers = element.querySelectorAll(".ant-collapse-header-text");

    for (const header of headers) {
      switch (header.textContent) {
        case "Discussion":
          if (highlightDiscussion) {
            header.style.color = "cyan";
            header.appendChild(document.createTextNode(` - Rating ${rating.toFixed(1)}/5.0`));
          }
          break;
        case "Shared public chats":
          if (publicChatCount == 0) {
            header.parentElement.style.display = "none";
          } else {
            header.appendChild(document.createTextNode(` - ${publicChatCount}`));
          }
          break;
        case "Gallery":
          if (hideGallery) {
            header.parentElement.style.display = "none";
          }
          break;
        case "Forks":
          if (forkCount == 0) {
            header.parentElement.style.display = "none";
          } else {
            header.appendChild(document.createTextNode(` - ${forkCount}`));
          }
          break;
        default:
          break;
      }
    }

    const authorLink = element.querySelector(`i > a[href="/users/${author}"]`);
    if (authorLink) {
      authorLink.style.color = "cyan";
    }

    const existingTags = new Map(
      Array.from(element.querySelectorAll(".ant-tag"))
      .map(tag => [tag.textContent.toLowerCase(), tag])
    );

    for (const followedTag of tagsToHighlight.map(tag => tag.toLowerCase())) {
      const matchingTagElement = existingTags.get(followedTag);

      if (matchingTagElement !== undefined) {
        matchingTagElement.style.color = "cyan";
      }
    }
  }

  async function cacheIsStale(key, thresholdMs = 60 * 1000) {
    const lastCacheUpdate = await GM.getValue(key, null);

    if (lastCacheUpdate === null) {
      return true;
    }

    const msSinceUpdate = Math.max(new Date() - new Date(lastCacheUpdate), 0);
    return msSinceUpdate >= thresholdMs;
  }

  const DEFAULT_CACHE_OPTIONS = {
    staleThresholdMs: 60 * 1000,
    mappingFn: foo => foo,
  };

  // Tries from cache if fresh, else fetches values.
  async function getCachedCollection(
   cacheKey,
   fetchFn,
   cacheOptions,
   lastUpdateKey = `last${cacheKey}Update`,
  ) {
    const cache_options = {
      ...DEFAULT_CACHE_OPTIONS,
      ...cacheOptions,
    };

    const _cmd = GM_registerMenuCommand(`Update ${cacheKey}`, async _ev => {
      const values = cache_options.mappingFn(await fetchFn);
      await GM.setValue(cacheKey, values);
      await GM.setValue(lastUpdateKey, new Date().toISOString());
    }, {
      title: `Update Chub.AI ${cacheKey} cache`
    });

    const cachedValues = await GM.getValue(cacheKey, null) ?? null;

    if (cachedValues === null || await cacheIsStale(lastUpdateKey, cache_options.staleThresholdMs)) {
      const values = cache_options.mappingFn(await fetchFn());

      await GM.setValue(cacheKey, values);
      await GM.setValue(lastUpdateKey, new Date().toISOString());

      return values;
    } else {
      return cachedValues;
    }
  }


  async function getFavorites() {
    const favorites = await getCachedCollection(
      "favorites", fetchFavorites, { mappingFn: faves => faves.nodes }, "lastFavoriteUpdate"
    );

    return {
      ids: new Set(favorites.map(fave => fave.id)),
      paths: new Set(favorites.map(fave => fave.fullPath)),
    };
  }

  async function getFollows() {
    let followsData = await getCachedCollection("follows", fetchFollows, { staleThresholdMs: 60 * 60 * 1000 });

    return {
      users: new Set(followsData.users.map(u => u.username)),
      tags: new Set(followsData.tags.map(t => t.tagname.toLowerCase())),
    };
  }

  async function getHidden() {
    const hiddenCards = await GM.getValue(HIDDEN_CARDS_KEY, []) ?? [];
    return new Set(hiddenCards);
  }

  async function saveHidden(hiddenCards) {
    const hiddenCardsArray = Array.from(hiddenCards);
    await GM.setValue(HIDDEN_CARDS_KEY, hiddenCardsArray);
  }

  async function isTimelineSelected() {
    let selectedItem;
    // Wait for labels to exist.
    try {
      selectedItem = await waitForElement(".ant-select-selection-item", 2000);
    } catch {
      return false;
    }

    const selectedCategory = selectedItem?.title ?? "";
    return selectedCategory === "Timeline";
  }

  async function getCurrentListPage() {
    let activePage;

    try {
      activePage = await waitForElement(".ant-pagination-item-active", 2000);
    } catch {
      throw new Error("could not find active page");
    }

    return parseInt(activePage.title);
  }

  async function characterListLoaded(dataFn) {
    await new Promise(r => setTimeout(r, 2000));

    const [favorites, follows, currentHiddenCards, cards, cardElements] =
          await Promise.all([getFavorites(), getFollows(), getHidden(), dataFn, getVisibleCards()]);

    let hiddenCards = currentHiddenCards;

    // Match up card with element.
    const cardsWithElements = new Map();
    const elements = new Map(
      cardElements
      .filter(e => e !== null && e !== undefined)
      .map(e => [e.path.split('/')[3], e])
    );

    for (const card of cards) {
      if (card === null || card === undefined) {
        continue;
      }

      const cardName = card.fullPath.split('/')[1];
      const foundElement = elements.get(cardName);

      if (foundElement !== undefined) {
        elements.delete(cardName);
        cardsWithElements.set(card, foundElement);
      }
    }

    for (const [card, element] of cardsWithElements) {
      const msSinceUpdate = new Date(card.lastActivityAt) - new Date(card.createdAt);
      const hoursSinceUpdate = msSinceUpdate / (1000 * 60 * 60);

      const followedTags = card.topics.filter(tag => follows.tags.has(tag.toLowerCase()));
      const followingUser = follows.users.has(card.author);
      const isFavorited = favorites.ids.has(card.id);
      const forkOfFave = (element?.fork !== null) ? favorites.paths.has(element.fork) : false;
      const isNew = hoursSinceUpdate <= 24;
      const isHidden = hiddenCards.has(card.id);

      try {
        modifyCard(element.node, isFavorited, forkOfFave, isNew, isHidden, followingUser, followedTags, () => {
          if (!isFavorited) {
            hiddenCards.add(card.id);
            saveHidden(hiddenCards);
          }
        }, () => {
          hiddenCards.delete(card.id);
          saveHidden(hiddenCards);
        });
      } catch (e) {
        console.error(`failed to modify card: ${e}`);
      }
    }
  }

  async function timelineLoaded(page) {
    await characterListLoaded(fetchTimeline(page));
  }

  async function userLoaded(username) {
    async function userListChanged() {
      const currentPage = await getCurrentListPage();
      await characterListLoaded(fetchAuthorCards(username, currentPage));
    }

    let charList;
    try {
      charList = await waitForElement("#chara-list", 5000);
    } catch {
      return;
    }

    userListChanged();

    while (true) {
      try {
        await waitForListRehydration(charList);
        userListChanged();
      } catch {
        break;
      }
    }
  }

  async function characterLoaded(author, char) {
    const [favorites, follows, charData] =
          await Promise.all([getFavorites(), getFollows(), fetchCharacter(author, char)]);

    const rating = charData.rating;
    const highlightDiscussion = charData.ratingCount > 0;
    const hideGallery = !charData.hasGallery;
    const publicChatCount = charData.n_public_chats;
    const forkCount = charData.forksCount;

    const followingUser = follows.users.has(author);
    const followedTags = charData.topics.filter(tag => follows.tags.has(tag.toLowerCase()));

    await modifyCharacterPage(author, rating, highlightDiscussion, hideGallery, publicChatCount, forkCount, followingUser, followedTags);
  }

  async function tagLoaded(tag, searchParams = null) {
    let search;

    if (searchParams !== null) {
      search = searchParams;
    } else {
      search = {
        topics: tag,
        page: 1,
        first: 20,
        namespace: "*",
        asc: false,
        sort: "default",
        min_tags: 2,
        include_forks: true,
        nsfw: true,
        nsfl: true,
        chub: true,
        nsfw_only: false,
        min_ai_rating: 0,
        min_tokens: 50,
        max_tokens: 100000,
        exclude_mine: false,
      };
    }

    const BAD_KEYS = new Set([
      "special_mode", "name_like", "only_mine", "inclusive_or", "max_days_ago", "min_users_chatted"
    ]);
    const OVERRIDES = {
      exclude_mine: false,
    }

    search = Object.keys(search).filter(key => !BAD_KEYS.has(key)).reduce((obj, key) => {
      obj[key] = search[key];
      return obj;
    }, {});

    await characterListLoaded(fetchSearchResults({ ...search, ...OVERRIDES }));
  }

  async function handleNavigate() {
    console.log(window.location);
    const urlParams = new URLSearchParams(window.location.search);
    const path = window.location.pathname;

    // Check if on timeline.
    if (path == "/") {
      if ((urlParams.size === 0 && await isTimelineSelected()) || urlParams.get("segment") === "timeline") {
        timelineLoaded(parseInt(urlParams.get("page") ?? "1"));
      } else {
        return;
      }
    }
    // Check if on character page.
    else if (path.startsWith("/characters/")) {
      const authorAndChar = path.replace(/^\/characters\//, "").split('/');
      characterLoaded(...authorAndChar);
    } else if (path.startsWith("/users/")) {
      const username = path.replace(/^\/users\//, "");
      userLoaded(username);
    } else if (path.startsWith("/tags/")) {
      const tag = path.replace(/^\/tags\//, "");
      tagLoaded(tag, (urlParams.size > 0) ? Object.fromEntries(urlParams) : null);
    }
  }

  addEventListener("popstate", (event) => {
    handleNavigate();
  });

  // Watch route change
  VM.onNavigate(handleNavigate);

  // Call it once for the initial state
  handleNavigate();

  // Source: https://stackoverflow.com/a/61511955
  function waitForElement(selector, timeout = -1) {
    return new Promise((resolve, reject) => {
      let existingElement = document.querySelector(selector);
      if (existingElement) {
        return resolve(existingElement);
      }

      let timeoutPid;

      if (timeout >= 0) {
        timeoutPid = setTimeout(() => {
          observer.disconnect();
          reject(`Timed out after ${timeout} ms.`);
        }, timeout);
      }

      const observer = new MutationObserver(mutations => {
        let foundElement = document.querySelector(selector);
        if (foundElement) {
          if (timeoutPid) {
            clearTimeout(timeoutPid);
          }

          observer.disconnect();
          resolve(foundElement);
        }
      });

      // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  function waitForListRehydration(element, timeout = -1, debounceMs = 100, onlyDirectChildren = true) {
    return new Promise((resolve, reject) => {
      let timeoutPid;

      if (timeout >= 0) {
        timeoutPid = setTimeout(() => {
          observer.disconnect();
          reject(`Timed out after ${timeout} ms.`);
        }, timeout);
      }

      const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          if (mutation.addedNodes.length > 0) {
            if (timeoutPid) {
              clearTimeout(timeoutPid);
            }

            timeoutPid = setTimeout(() => {
              observer.disconnect();
              resolve();
            }, debounceMs);
          }
        }
      });

      observer.observe(element, {
        childList: true,
        subtree: !onlyDirectChildren
      });
    });
  }
})();
