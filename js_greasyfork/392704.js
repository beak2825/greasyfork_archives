// ==UserScript==
// @name        Netease Full Article
// @namespace   https://greasyfork.org/
// @match       *://*163.com/*
// @grant       none
// @version     0.01
// @author      T4Tea
// @description Show full article on Netease mobile version.
// @downloadURL https://update.greasyfork.org/scripts/392704/Netease%20Full%20Article.user.js
// @updateURL https://update.greasyfork.org/scripts/392704/Netease%20Full%20Article.meta.js
// ==/UserScript==

function showFullArticle() {
  var articleStyle = document.querySelector("article").style;
  console.log("Show full article.");
  articleStyle.maxHeight = "99999px";
  articleStyle.overflow = "auto";
  document.querySelector("div.footer").hidden = true;
}

setTimeout(showFullArticle, 2000);