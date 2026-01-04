// ==UserScript==
// @name        Letterboxd++
// @namespace   https://github.com/shmup/lbpp
// @description Add customized search links with favicons to Letterboxd movie pages
// @author      Jared Miller (shmup)
// @license     GPL-3.0-or-later
// @match       https://letterboxd.com/film/*
// @grant       none
// @run-at      document-end
// @version     1.75
// @downloadURL https://update.greasyfork.org/scripts/510028/Letterboxd%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/510028/Letterboxd%2B%2B.meta.js
// ==/UserScript==
 
(function () {
  "use strict";
 
  const styles = `
  .link-container {
    margin-top: 10px;
    padding: 10px;
    display: inline-block;
  }
  .links-flex {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .custom-link {
    align-items: center;
    background-color: rgb(14, 116, 162);
    border-radius: 3px;
    color: #fff;
    display: flex;
    font-weight: bold;
    padding: 5px 10px;
    text-decoration: none;
    transition: background-color 0.3s;
  }
  .custom-link:hover {
    color: #fff;
    background-color: rgb(5, 85, 122);
  }
  .custom-link img {
    width: 16px;
    height: 16px;
    margin-right: 5px;
    vertical-align: middle;
  }
`;
 
  function addStyles(styles) {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }
 
  function getMovieTitle() {
    // Updated selector to match actual HTML structure
    const titleElement = document.querySelector(
      ".headline-1.primaryname .name"
    );
    return titleElement
      ? titleElement.textContent.trim().replace(/\s+/g, " ")
      : null;
  }
 
  function getReleaseYear() {
    // Updated selector to match actual HTML structure
    const yearElement = document.querySelector(".releasedate a");
    return yearElement ? yearElement.textContent.trim() : null;
  }
 
  function createLink(href, text, icon) {
    const domain = new URL(href).hostname;
    const faviconUrl =
      icon || `https://www.google.com/s2/favicons?domain=${domain}`;
 
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.classList.add("custom-link");
    link.title = `Search on ${domain}`;
 
    const img = document.createElement("img");
    img.src = faviconUrl;
    img.onerror = () => {
      link.textContent = `🔍 ${text}`;
    };
 
    link.appendChild(img);
 
    const span = document.createElement("span");
    span.textContent = text;
 
    link.appendChild(span);
 
    return link;
  }
 
  function addLinks(links) {
    // Updated to find a more reliable insertion point
    const productionInfo = document.querySelector(".productioninfo");
    if (!productionInfo) {
      console.error("Could not find productioninfo element");
      return;
    }
 
    const linkContainer = document.createElement("div");
    linkContainer.classList.add("link-container");
 
    const flexContainer = document.createElement("div");
    flexContainer.classList.add("links-flex");
 
    links.forEach(({ href, text, icon = "" }) => {
      const link = createLink(href, text, icon);
      flexContainer.appendChild(link);
    });
 
    linkContainer.appendChild(flexContainer);
    productionInfo.insertAdjacentElement('afterend', linkContainer);
  }
 
  function init() {
    // Add a small delay to ensure the page is fully loaded
    setTimeout(() => {
      const movieTitle = getMovieTitle();
      const releaseYear = getReleaseYear();
 
      console.debug("Movie title:", movieTitle);
      console.debug("Release year:", releaseYear);
 
      if (!movieTitle || !releaseYear) {
        console.error("Could not find movie title or release year");
        return;
      }
 
      const searchQueries = {
        BITSEARCH: `${movieTitle} ${releaseYear}`,
        BTDIG: `${movieTitle} ${releaseYear}`,
        TD: `${movieTitle} ${releaseYear}`,
        TPB: `${movieTitle} ${releaseYear}`,
        WIKI: `${movieTitle} (${releaseYear} film)`,
        YT: `${movieTitle} ${releaseYear} trailer`,
        IA: `title:(${movieTitle}) AND mediatype:(movies)`,
      };
 
      const links = [
        {
          text: "YT",
          href: `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQueries.YT)}`,
        },
        {
          text: "IA",
          href: `https://archive.org/search.php?query=${encodeURIComponent(searchQueries.IA)}`,
        },
        {
          text: "WIKI",
          href: `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(searchQueries.WIKI)}&ns0=1`,
        },
        {
          text: "TD",
          icon: "https://www.torrentday.com/favicon.ico",
          href: `https://www.torrentday.com/t?q=${encodeURIComponent(searchQueries.TD)};o=seeders&qf=#torrents`,
        },
        {
          text: "TPB",
          href: `https://thepiratebay.org/search.php?q=${encodeURIComponent(searchQueries.TPB)}&video=on&search=Pirate+Search&page=0&orderby=`,
        },
        {
          text: "BTDIG",
          href: `https://btdig.com/search?q=${encodeURIComponent(searchQueries.BTDIG)}`,
        },
        {
          text: "BITSEARCH",
          href: `https://bitsearch.to/search?q=${encodeURIComponent(searchQueries.BITSEARCH)}`,
        },
      ];
 
      addStyles(styles);
      addLinks(links);
    }, 1000); // 1 second delay to ensure DOM is ready
  }
 
  // Flag to prevent multiple executions
  let initialized = false;
  
  function safeInit() {
    if (initialized) return;
    initialized = true;
    init();
  }
  
  // Try multiple initialization approaches with duplicate prevention
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInit);
  } else {
    safeInit();
  }
})();