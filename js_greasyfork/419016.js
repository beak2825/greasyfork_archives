// ==UserScript==
// @name        Fuck Mikel Zorrilla 
// @namespace   https://github.com/LordVulkan/FckZorrilla
// @description Save Espinof from Mikel Zorrilla.
// @match       *://*.espinof.com/*
// @grant       none
// @version     1.2.0
// @author      jomai92@gmail.com
// @license     GPL-3.0-only
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@1,npm/@violentmonkey/ui@0.4
// @homepageURL https://github.com/LordVulkan/FckZorrilla
// @copyright 2020, LordVulkan (https://github.com/LordVulkan)
// @downloadURL https://update.greasyfork.org/scripts/419016/Fuck%20Mikel%20Zorrilla.user.js
// @updateURL https://update.greasyfork.org/scripts/419016/Fuck%20Mikel%20Zorrilla.meta.js
// ==/UserScript==

(function () {
'use strict';

function removeZorrillaPosts() {
  const articles = document.getElementsByClassName("abstract-article");

  for (const article of articles) {
    const authors = article.getElementsByClassName("abstract-author");
    console.log("test");
    let remove = false;

    for (const author of authors) if (author.getAttribute("href") == "/autor/mikel-zorrilla") remove = true;

    if (remove) article.remove();
  }
}
function deletePostersTitles() {
  const posters = document.getElementsByClassName("poster-title");

  for (const poster of posters) {
    const titles = poster.getElementsByTagName("a");

    for (const title of titles) {
      title.innerText = "";
    }
  }
}

removeZorrillaPosts();
deletePostersTitles();
removeZorrillaPosts();
deletePostersTitles();

}());
