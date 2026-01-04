// ==UserScript==
// @author  wangkai
// @name showAnswer
// @namespace Violentmonkey Scripts
// @match *://*.ksbao.com/*
// @description  自动展开隐藏的答案，方便查看背题。
// @version      0.1.1
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/392979/showAnswer.user.js
// @updateURL https://update.greasyfork.org/scripts/392979/showAnswer.meta.js
// ==/UserScript==
(function(){
   var css = '.showAnswer { display:block !important;}',
        head = document.getElementsByTagName('head')[0],
        style = document.createElement('style');
        style.type = 'text/css';
        if(style.styleSheet){
        style.styleSheet.cssText = css;
        }else{
        style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
})()