// ==UserScript==
// @name     		Ad Enabler
// @namespace       https://aleksuuu.github.io/
// @version  		1
// @grant    		none
// @description     Skip the boring videos on YouTube and enjoy all the ads!
// @include         https://www.youtube.com/watch* 
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/483907/Ad%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/483907/Ad%20Enabler.meta.js
// ==/UserScript==

setInterval(function () { clickNextIfNoAd() }, 20);

function clickNextIfNoAd() {
  if (!document.querySelector("div.ad-showing")) {
    let nextArr = document.getElementsByClassName("ytp-next-button");
    nextArr[nextArr.length - 1].click();
  }
}