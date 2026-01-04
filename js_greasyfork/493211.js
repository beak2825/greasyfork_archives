// ==UserScript==
// @name         mark-selected-genres-porno_island
// @namespace    http://tampermonkey.net/
// @version      2024-04-19
// @description  Подсвечивает избранные и антиизбранные жанры на страницах игр на сайте island-of-pleasure. Жанры нужно перечислить в самом скрипте.
// @author       Vlad Apostol
// @license      MIT
// @match        htt*://island-of-pleasure.site/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=island-of-pleasure.site
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493211/mark-selected-genres-porno_island.user.js
// @updateURL https://update.greasyfork.org/scripts/493211/mark-selected-genres-porno_island.meta.js
// ==/UserScript==

// Перечислите через запятую теги, которые вам нравятся, они будут выделены зелёным цветом.
let white_find_tags = "exhibitionism,voyeurism,stripping,corruption,incest,prostitution";
// Перечислите через запятую теги, которые вам не нравятся, они будут выделены красным цветом.
let black_find_tags = "ntr,real porn,trans,trap,sissification";

function check_tags(find_tags, backcolor, color){
     find_tags = find_tags.split(",")
     let process_find_tags = [];
     find_tags.forEach(function (tag) {
         process_find_tags.push(tag.replace(" ", "%20") + "/");
     });
     find_tags = process_find_tags;

     let elements = document.querySelectorAll('div[class="finfo-text"] a[href^="https://island-of-pleasure.site/tags/"]');
      elements.forEach(function (e) {
      let check_href = e.href
      find_tags.forEach((find_tag) => {
          if(check_href.endsWith(find_tag)){
              e.style.backgroundColor = backcolor;
              e.style.color = color;
          }
      });
    });
}
function start() {
    console.log("porno-island filter genry loaded.");
    check_tags(white_find_tags, "", "green");
    check_tags(black_find_tags, "", "red"); //#453e34
}


(function() {
    window.addEventListener("load", start);
    if (document.readyState !== 'loading') {
        start();
        window.removeEventListener('load', start);
    }
})();

