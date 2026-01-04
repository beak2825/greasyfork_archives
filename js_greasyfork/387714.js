// ==UserScript==
// @name         hao123
// @namespace    http://tampermonkey.net/
// @version      0.2
// @icon         https://www.hao123.com/favicon.ico
// @description  hao123导航精简
// @author       Mirror
// @match        https://www.hao123.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387714/hao123.user.js
// @updateURL https://update.greasyfork.org/scripts/387714/hao123.meta.js
// ==/UserScript==

(function() {
  var rigth = document.querySelector(".layout-right");
  var left = document.querySelector(".layout-left");
  var script = document.querySelectorAll("script");
  var hotsearchCon = document.querySelector(".hotsearchCon");
  var notice = document.querySelector(".notice");
  var suggest = document.querySelector(".suggest");
  var hotword = document.querySelector(".hotword");
  var spread = document.querySelector(".spread");
  left.parentNode.removeChild(left);
  rigth.parentNode.removeChild(rigth);
  hotsearchCon.parentNode.removeChild(hotsearchCon);
  hotword.parentNode.removeChild(hotword);
  notice.parentNode.removeChild(notice);
  spread.click();
  script.forEach( item => {
      item.parentNode.removeChild(item);
  });
})();