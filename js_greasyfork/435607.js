// ==UserScript==
// @name        pixiv ugoira fix
// @match       https://www.pixiv.net/en/artworks/*
// @description Makes broken Pixiv ugoira move.
// @grant unsafeWindow
// @license WTFPL
// @version 0.0.1.20211116235617
// @namespace https://greasyfork.org/users/839834
// @downloadURL https://update.greasyfork.org/scripts/435607/pixiv%20ugoira%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/435607/pixiv%20ugoira%20fix.meta.js
// ==/UserScript==

let oldFetch = fetch;

async function persistentFetch(url) {
  let attemptsRemaining = 3;
  let response;
  while (attemptsRemaining--) {
    response = await oldFetch(url);
    if (response.ok) {
      return response;
    }
  }
  throw response;
}

let ugoiraRegex = /^https:\/\/i\.pximg\.net\/img-zip-ugoira\/img\//;
unsafeWindow.fetch = function() {
  if (ugoiraRegex.test(arguments[0])) {
    return persistentFetch(arguments[0]);
  }
  return oldFetch.apply(this, arguments);
}