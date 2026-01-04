// ==UserScript==
// @name        Twitch Persistant Tag - twitch.tv
// @namespace   Violentmonkey Scripts
// @match       https://www.twitch.tv/*
// @version     1.0
// @author      Zolpoid
// @description Keep the same tag across categories and across sessions.
// @grant GM_getValue
// @grant GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463449/Twitch%20Persistant%20Tag%20-%20twitchtv.user.js
// @updateURL https://update.greasyfork.org/scripts/463449/Twitch%20Persistant%20Tag%20-%20twitchtv.meta.js
// ==/UserScript==

// The shittiest piece of JS you ever saw.
let url = new URL(document.location.href);
let tag = GM_getValue("tag", null);
let lastVisited;
const visited = {};

function main() {
  // currently only supporting path with /game/ in them as others might need different ways to extract currentn tag from.
  if (url.pathname.indexOf("/game/") == -1) return;
  tag = GM_getValue("tag", null);
  // get tag search element.
  const el = document.getElementById("dropdown-search-input");
  if (el === null) {
    setTimeout(main, 100);
    return;
  }
  let currentTag = url.search.split('=')[1] || ''; // potenionally undefined
  if (tag === null) { // no stored tag, no tag set
    setTag(currentTag, el);
  } else {
    if (visited.hasOwnProperty(url.pathname) && url.pathname === lastVisited.pathname) { // If we changed tags in the same category.
      setTag(currentTag, el);
    } else {
        setTag(tag, el);
    }
  }
}

function setTag(tag, el) {
  el.value = tag;
  const ke = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });
  el.dispatchEvent(ke);
  GM_setValue("tag", tag);
  url = new URL(document.location.href);
  visited[url.pathname] = 1; // could be anything.
  lastVisited = new URL(url);
}

// check for url/tag change on every click.
function checkURL() {
  if (document.location.href != url.href) {
    url = new URL(document.location.href);
    main();
  }
}

document.addEventListener("click", checkURL);

main();
