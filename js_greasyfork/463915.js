// ==UserScript==
// @name          Auto adjust YouTube video to Theater mode
// @description   Auto adjust YouTube video to Theater mode.
// @match         https://www.youtube.com/*
// @grant         none
// @version       0.7
// @license MIT
// @namespace https://greasyfork.org/users/836868
// @downloadURL https://update.greasyfork.org/scripts/463915/Auto%20adjust%20YouTube%20video%20to%20Theater%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/463915/Auto%20adjust%20YouTube%20video%20to%20Theater%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
  window.addEventListener('yt-navigate-finish', function () {
    var checkExist = setInterval(function() {
    var ytMeta = document.querySelector('.ytp-size-button.ytp-button');
    var text = ytMeta.getAttribute("data-title-no-tooltip");
    console.log("Theater mode ?"+text);
    if(ytMeta && "Theater mode" == ytMeta.getAttribute("data-title-no-tooltip")){
         console.log('Find Theater button!');
         clearInterval(checkExist);
         ytMeta.click();
         console.log('click Theater button!');
    }
    }, 1000);

  });
})();