// ==UserScript==
// @name        Baidu Full Article
// @namespace   https://greasyfork.org/
// @match       *://*.baidu.com/*
// @grant       none
// @version     0.1
// @author      T4Tea
// @description Show full article on Baidu mobile version.
// @downloadURL https://update.greasyfork.org/scripts/392994/Baidu%20Full%20Article.user.js
// @updateURL https://update.greasyfork.org/scripts/392994/Baidu%20Full%20Article.meta.js
// ==/UserScript==

function showFullArticle() {
  var articleStyle = document.querySelector(".detail-content-main,.mainContent").style;
  articleStyle.maxHeight = "99999px";
  articleStyle.overflow = "auto";
  articleStyle.height = "";
  // hide some ads
  ads = document.querySelectorAll(".packupButton,.openImg,.commentEmbed-backHomeCard")
  for (i=0;i<ads.length;i++) {
    ads[i].hidden = true;
  }
}

setInterval(showFullArticle, 200);