// ==UserScript==
// @name        CSDN Full Article
// @namespace   https://greasyfork.org/
// @match       *://*.csdn.net/*
// @grant       none
// @version     0.01
// @author      T4Tea
// @description Show full article on CSDN mobile version.
// @downloadURL https://update.greasyfork.org/scripts/392831/CSDN%20Full%20Article.user.js
// @updateURL https://update.greasyfork.org/scripts/392831/CSDN%20Full%20Article.meta.js
// ==/UserScript==

function showFullArticle() {
  var articleStyle = document.querySelector("div.article_content").style;
  articleStyle.maxHeight = "99999px";
  articleStyle.overflow = "auto";
  articleStyle.height = "";
  // hide some ads
  ads = document.querySelectorAll(".btn_mod, #btn-detail, .jump_comment_page_button, .app-open-box")
  for (i=0;i<ads.length;i++) {
    ads[i].hidden = true;
  }      
}

setInterval(showFullArticle, 16);