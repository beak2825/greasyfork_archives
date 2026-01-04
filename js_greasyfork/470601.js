// ==UserScript==
// @name          CSDN Enable Right Click & Copy
// @namespace     Absolute Right Click
// @description   绕过csdn烦人的复制限制
// @author        DM
// @version       1.0.0
// @match         *://*.csdn.net/*
// @grant         GM_registerMenuCommand
// @license       BSD
// @downloadURL https://update.greasyfork.org/scripts/470601/CSDN%20Enable%20Right%20Click%20%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/470601/CSDN%20Enable%20Right%20Click%20%20Copy.meta.js
// ==/UserScript==

(function() {
   var follow_text = document.getElementsByClassName('follow-text')[0];
   if (follow_text && follow_text.parentElement) {
       document.querySelector("#article_content").removeAttribute("style");
       follow_text.parentElement.parentElement.removeChild(follow_text.parentElement);
       var hide_article_box = document.getElementsByClassName(' hide-article-box')[0];
       hide_article_box.parentElement.removeChild(hide_article_box);
   }
   window.oncontextmenu = document.oncontextmenu = document.oncopy = null;
   [...document.querySelectorAll('body')].forEach(dom => {dom.outerHTML = dom.outerHTML});
   [...document.querySelectorAll('body, body *')].forEach(dom => {
       ['onselect', 'onselectstart', 'onselectend', 'ondragstart', 'ondragend', 'oncontextmenu', 'oncopy'].forEach(ev => dom.removeAttribute(ev));
       dom.style['user-select'] = 'auto';
   });
})();

