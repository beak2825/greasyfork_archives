// ==UserScript==
// @name         rule 34 direct image links
// @namespace    heck
// @version      0.1
// @description  gives direct links to images on rule 34.xxx, useful for mouseover addons
// @author       You
// @match        https://rule34.xxx/index.php?page=post&s=list*
// @exclude      https://rule34.xxx/index.php?page=post&s=view*
// @require      https://code.jquery.com/jquery-3.3.1.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467131/rule%2034%20direct%20image%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/467131/rule%2034%20direct%20image%20links.meta.js
// ==/UserScript==

Array.prototype.forEach.call($(".thumb"), function(el) {
    let newSpan = document.createElement("span");
    let currentLink = el.children[0].children[0].src;
    // newSpan.style.padding-bottom = "3px";
    let mp4Version = currentLink.replace("us.rule34", "nymp4.rule34").replace("thumbnails", "\/images").replace("thumbnail_", "").replace(/\.jpg\?\d+/, ".mp4");
    newSpan.innerHTML = `<br> <a href=${mp4Version}>mp4</a>`;
    el.children[0].after(newSpan);
});