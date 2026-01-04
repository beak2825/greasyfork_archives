// ==UserScript==
// @name         TU Graz Newsgroup Unicode Fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Unicode-Anzeigefehler beheben
// @author       o___o
// @match        https://news.tugraz.at/cgi-bin/usenet/post.csh?*
// @icon         https://icons.duckduckgo.com/ip2/tugraz.at.ico
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/490050/TU%20Graz%20Newsgroup%20Unicode%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/490050/TU%20Graz%20Newsgroup%20Unicode%20Fix.meta.js
// ==/UserScript==

const pre = document.querySelector('pre');
if (!pre) return;

pre.innerText = new TextDecoder().decode(
  new Uint8Array([
    ...pre.innerText
      .split("")
      .flatMap((c) => [c.charCodeAt(0) & 255, c.charCodeAt(0) >> 8]),
  ])
);