// ==UserScript==
// @name        Remove spaces at the sides
// @namespace   https://greasyfork.org/en/users/434434-lagradost
// @match       https://isekaiscan.com/manga/*/*/
// @match       https://manhuas.net/manhua/*/*/
// @match       https://toonily.com/webtoon/*/*/
// @match       https://mangazuki.online/mangas/*/*/
// @grant       none
// @version     2.1
// @author      Ost
// @description Removes the empty space on shitty manga sites, also makes real zooming actually work
// @downloadURL https://update.greasyfork.org/scripts/403247/Remove%20spaces%20at%20the%20sides.user.js
// @updateURL https://update.greasyfork.org/scripts/403247/Remove%20spaces%20at%20the%20sides.meta.js
// ==/UserScript==

document.querySelector("div.content-area > div.container").classList.remove("container");
/*img = document.getElementsByClassName('img'); //Since all the sites are copy-pasted it works
for (var i = 0; i < img.length; i++) {
    console.log(img[i]);
    img[i].style.backgroundRepeat="no-repeat";
    img[i].style.backgroundSize="contain";
    img[i].style.width="100%";
}*/

var sheet = window.document.styleSheets[0];
sheet.insertRule('img { background-repeat: no-repeat; background-size: contain;width: 100%; } ', sheet.cssRules.length);
sheet.insertRule('.reading-manga .reading-content {padding: 0px !important;}', sheet.cssRules.length);