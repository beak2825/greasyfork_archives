// ==UserScript==
// @name         Amazon强制幸运
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  try to take over the world!
// @author       You
// @match        https://www.amazon.cn/b?node=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420226/Amazon%E5%BC%BA%E5%88%B6%E5%B9%B8%E8%BF%90.user.js
// @updateURL https://update.greasyfork.org/scripts/420226/Amazon%E5%BC%BA%E5%88%B6%E5%B9%B8%E8%BF%90.meta.js
// ==/UserScript==

function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * ( maxNum - minNum + 1 ) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
}

var buttons=document.getElementsByClassName("a-section redeem-button block-display-item redeem-button-bg-normal");
for (var i=0;i<buttons.length;i++){
    buttons[i].click();
}
setTimeout(function(){window.location.reload();}, randomNum(1000,2000));