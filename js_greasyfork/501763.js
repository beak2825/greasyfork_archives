// ==UserScript==
// @name        Indexxx quick links
// @description Creates quick links to search other sites from indexxx.com
// @license     WTFPL
// @match       https://www.indexxx.com/*
// @match       https://vipergirls.to/*
// @match       https://kitty-kats.net/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addValueChangeListener
// @run-at      document-end
// @noframes
// @version     0.3.1
// @namespace https://greasyfork.org/users/1339655
// @downloadURL https://update.greasyfork.org/scripts/501763/Indexxx%20quick%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/501763/Indexxx%20quick%20links.meta.js
// ==/UserScript==

const { hostname, pathname } = window.location;

console.log("HOST", hostname);

const WINDOW_NAME = "userscript_501763";

const openTabs = {};

function openTab(url, windowName) {
  if (!openTabs[url] || openTabs[url].closed) {
    GM_setValue("opening", true);

    openTabs[url] = window.open(url, windowName);
  }
}

const HOME_CSS = `
/* RESET */

html {
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: inherit;
}

body, h1, h2, h3, h4, h5, h6, p, ol, ul {
  margin: 0;
  padding: 0;
  font-weight: normal;
}

ol, ul {
  list-style: none;
}

img {
  max-width: 100%;
  height: auto;
}

/* GLOBAL */

body {
  font-size: 16px;
  font-family: sans-serif;
  margin: 20px;
}

a {
  color: #444;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* HIDE CRAP */

#navCol,
#sidebar,
#header,
.d-flex:has(#googleSearch) {
  display: none;
}

/* RE-STYLE */

.d-flex:has(.pset) {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-end;
}

.pset {
  width: 320px;
  flex-grow: 1;
}

.pset img {
  display: block;
  margin: 0 auto;
  pointer-events: none;
}

.psetInfo {
  text-align: center;
}
`;

if (hostname === "www.indexxx.com") {
  if (pathname === "/home" || pathname.startsWith("/m/")) {
    const button = document.querySelector("h1").insertAdjacentElement("beforeend", document.createElement("button"));

    button.innerText = "📷";

    button.onclick = () => {
      document.querySelector("link[href^='/static/v2/css/joined.css']").remove();

      GM_addStyle(HOME_CSS);

      document.querySelectorAll(".photoSection img").forEach(img => {
        img.src = img.src.replace(/thumbs\/\d+x\d+\//, "");
      });

      document.querySelectorAll("#model-header > :not(:has([itemtype='http://schema.org/Photograph']))").forEach(el => {
        el.remove();
      });

      button.remove();
    }
  }

  function createLink(url, keywords) {
    const link = document.createElement("span");
    link.innerText = `🔍`;
    link.style.cursor = "pointer";
    link.title = keywords;
    link.onclick = () => {
      GM_setValue("search", keywords);
      openTab(url, WINDOW_NAME);
    };
    return link;
  }

  [...document.querySelectorAll("[itemtype='http://schema.org/Photograph']")].forEach(card => {
    const names = [...card.querySelectorAll("[itemprop='name']")];

    names.forEach(el => {
      const keywords = el.innerText;
      el.parentElement.insertAdjacentElement("afterend", createLink("https://vipergirls.to/forum.php", keywords));
      el.parentElement.insertAdjacentElement("afterend", createLink("https://kitty-kats.net/", keywords));
    });

    const allNames = names.map(el => el.innerText).join(" ");
    const link = card.querySelector("[itemprop='url']");
    const fullTitle = card.querySelector("img").alt;
    const keywords = cleanQuery(allNames + " " + (/(.*)\sin\s(?<title>.*),\s\sat\s/gm.exec(fullTitle)?.groups?.title || ''));

    link.insertAdjacentElement("afterend", createLink("https://vipergirls.to/forum.php", keywords));
    link.insertAdjacentElement("afterend", createLink("https://kitty-kats.net/", keywords));
  })
}

function handleSearch(targetHostname, performSearch) {
  if (hostname === targetHostname && window.name === WINDOW_NAME) {
    let lastKeywords = sessionStorage.getItem("search");

    const search = () => {
      const keywords = GM_getValue("search");

      if (keywords === lastKeywords) {
        return;
      }

      sessionStorage.setItem("search", keywords);

      console.log("SEARCH", targetHostname)

      if (keywords) {
        console.log("KEYWORDS", keywords)
        performSearch(keywords);
      }
    };

    GM_addValueChangeListener("search", search);

    search();
  }
}

handleSearch("kitty-kats.net", (keywords) => {
  document.querySelector("a[aria-label='Search']").click();
  document.querySelector("input[name='c[title_only]']").checked = true;
  document.querySelector("input[name='keywords']").value = keywords;
  document.querySelector("button.button--icon--search").click();
});

handleSearch("vipergirls.to", (keywords) => {
  document.querySelector("#navbar_search input[name='query']").click();
  document.querySelector("#navbar_search input[name='query']").value = keywords;
  document.querySelector("#cb_navsearch_titleonly").checked = true;
  document.querySelector("#cb_navsearch_showposts").checked = true;
  document.querySelector("#navbar_search input[name='submit']").click();
});

function cleanQuery(str) {
  const stopWords = "\\b(?:a|an|and|the|but|or|on|in|with|is|it|that|this|to|of|for|as|at|by|from|up|down|out|if|about|which|who|what|where|when|why|how)\\b";
  const regex = new RegExp(`\\b\\w*'\\w*\\b|${stopWords}`, 'gi');

  return str
    .replace(regex, '')
    .replace(/[^a-zA-Z0-9 ']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
