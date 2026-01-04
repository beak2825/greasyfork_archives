// ==UserScript==
// @name        4 18
// @icon        https://www.eyny.com/favicon.ico?iLj
// @namespace   eyny
// @match       https://www.eyny.com/forum-*
// @match       https://www.eyny.com/thread-*
// @match       https://www.eyny.com/forum.php?mod=*
// @grant       none
// @version     2024-09-04 10:26
// @author      qq
// @description 點擊按鈕。error 500 重整
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/506803/4%2018.user.js
// @updateURL https://update.greasyfork.org/scripts/506803/4%2018.meta.js
// ==/UserScript==
setTimeout(function(){
  let thx = document.querySelector('input[value*="Yes, I am."]');
  if (!!thx) {
    thx.click();

  }

  let title = document.querySelector('head title');
  title.innerHTML= title.innerHTML.replace('H', '-');

  let error500 = document.querySelector('head title');
  if (error500.innerHTML.includes('500')) {
    location.reload();
  }

}, 1500);