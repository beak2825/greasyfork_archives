// ==UserScript==
// @name        9Gag Image Post Only
// @namespace   Violentmonkey Scripts
// @match       https://9gag.com/*
// @match       https://9gag.com/*/*
// @grant       none
// @version     1.1
// @author      -
// @description 10/1/2023, 10:36:51 PM
// @downloadURL https://update.greasyfork.org/scripts/476506/9Gag%20Image%20Post%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/476506/9Gag%20Image%20Post%20Only.meta.js
// ==/UserScript==

(function(){
  function purgeVideoPosts() {
    const articleNodes = document.querySelectorAll('article');
    for (let i = 0; i < articleNodes.length; ++i) {
      const articleNode = articleNodes[i];
      if (articleNode.dataset.hasOwnProperty('processed')) {
        continue;
      }

      articleNode.dataset.processed = true;
      const videoNode = articleNode.querySelector('video');
      if (videoNode) {;
        articleNode.style.display = 'none';
      }
    }
  }

  setTimeout(purgeVideoPosts, 500);
  addEventListener('scroll', purgeVideoPosts);
})();