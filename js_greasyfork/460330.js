// ==UserScript==
// @name        Kaplan sözlük gereksiz enrty comic sanslayıcı
// @namespace   Violentmonkey Scripts
// @match       https://www.kaplansozluk.com/
// @grant       none
// @version     1.1
// @author      -
// @description 19.02.2023 23:26:45
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460330/Kaplan%20s%C3%B6zl%C3%BCk%20gereksiz%20enrty%20comic%20sanslay%C4%B1c%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/460330/Kaplan%20s%C3%B6zl%C3%BCk%20gereksiz%20enrty%20comic%20sanslay%C4%B1c%C4%B1.meta.js
// ==/UserScript==
setInterval(function() {
  const contentElements = document.querySelectorAll(".content");
  const contentArray = Array.from(contentElements);
  contentArray.forEach(element => {
    if (element.innerText.length > 200) {
      element.style.fontFamily = "Comic Sans MS";
    }
  });
}, 1000);