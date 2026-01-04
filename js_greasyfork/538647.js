// ==UserScript==
// @name blfy
// @namespace    https://baolifanye.com/
// @version      0.1
// @description  暴力翻页
// @author       You
// @include      *

// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/538647/blfy.user.js
// @updateURL https://update.greasyfork.org/scripts/538647/blfy.meta.js
// ==/UserScript==

/*空白触屏翻页-暴力版*/var fycz=450;/*450即翻页滚动像素值，可按需修改*/document.body.addEventListener("click",function(e){var ecy=e.clientY,sah=window.screen.availHeight/3;if(ecy<sah){window.scrollBy(0,window.innerHeight*0.95)}else if(ecy>sah){window.scrollBy(0,window.innerHeight*0.6)}});