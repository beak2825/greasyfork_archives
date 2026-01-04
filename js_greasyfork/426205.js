// ==UserScript==
// @name         巴哈姆特動畫瘋 - 靜音廣告
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  muted video ad
// @author       Rplus
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @downloadURL https://update.greasyfork.org/scripts/426205/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B%20-%20%E9%9D%9C%E9%9F%B3%E5%BB%A3%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/426205/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B%20-%20%E9%9D%9C%E9%9F%B3%E5%BB%A3%E5%91%8A.meta.js
// ==/UserScript==

(function() {
  window.addEventListener('load', checkAd);

  let counter = 0;
  let advideo;

  function checkAd() {
    counter += 1;
    advideo = document.querySelector('video[title="Advertisement"]');
    if (advideo) {
      advideo.addEventListener('canplay', muteAd);
      addStyle();
    } else if (counter < 50) {
      setTimeout(checkAd, 100);
    }
  }

  function muteAd() {
    advideo.controls = true;
    advideo.muted = true;
    advideo.volume = .2;
    advideo.removeEventListener('canplay', muteAd);
  }

  function addStyle() {
    let style = document.createElement('style');
    style.textContent = `.video-google-AD iframe, video[title="Advertisement"] + div { pointer-events: none; }`;
    advideo.parentElement.appendChild(style);
  }
})();