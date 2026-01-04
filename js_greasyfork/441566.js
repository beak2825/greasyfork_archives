// ==UserScript==
// @name        HN Avatars in 396 bytes
// @description Annotated avatars on all HN comments.
// @author      tomxor (https://news.ycombinator.com/user?id=tomxor)
// @icon        https://news.ycombinator.com/favicon.ico
// @namespace   https://news.ycombinator.com/item?id=30668137
// @include     https://news.ycombinator.com/newcomments*
// @include     https://news.ycombinator.com/item*
// @include     https://news.ycombinator.com/user*
// @grant       none
// @version     1.0.6
// @compatible  firefox
// @compatible  chrome
// @compatible  edge
// @compatible  opera
// @downloadURL https://update.greasyfork.org/scripts/441566/HN%20Avatars%20in%20396%20bytes.user.js
// @updateURL https://update.greasyfork.org/scripts/441566/HN%20Avatars%20in%20396%20bytes.meta.js
// ==/UserScript==

for (u of document.querySelectorAll(".hnuser, #me"))
    for (
        u.prepend((c = document.createElement("canvas"))), x = c.getContext("2d"), c.width = 18, c.height = 14, c.style.imageRendering="pixelated", s = u.innerText, r = 1, i = 28 + s.length; i--;
        i < 28 ? r >>> 29 > (X * X) / 3 + Y / 2 && x.fillRect(6 + 2 * X, 2 * Y, 2, 2) & x.fillRect(6 - 2 * X, 2 * Y, 2, 2) : (r += s.charCodeAt(i - 28, (x.fillStyle = "#" + ((r >> 8) & 0xffffff).toString(16))))
    )
        (r ^= r << 13), (r ^= r >>> 17), (r ^= r << 5), (X = i & 3), (Y = i >> 2);