// ==UserScript==
// @name         webtoons.com: Load All Images
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       You
// @match        http://www.webtoons.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20515/webtoonscom%3A%20Load%20All%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/20515/webtoonscom%3A%20Load%20All%20Images.meta.js
// ==/UserScript==

for (var e of document.querySelectorAll('img._images')) {
    e.setAttribute('src', e.getAttribute('data-url'));
}
