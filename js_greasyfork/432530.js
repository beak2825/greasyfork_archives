// ==UserScript==
// @name         テスト2
// @namespace    http://www.youtube.com/
// @version      1.2
// @description  自動コメントツール
// @author       豆
// @match        https://www.youtube.com/watch?v=jG6fg8csDM4
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432530/%E3%83%86%E3%82%B9%E3%83%882.user.js
// @updateURL https://update.greasyfork.org/scripts/432530/%E3%83%86%E3%82%B9%E3%83%882.meta.js
// ==/UserScript==
 

(function() {
    'use strict';
    setTimeout (function() {
 
    var a = prompt("Enter the comment to make: ");
    },20000);
 
    setInterval (function() {
        document.querySelector("div#input").textContent=a;
        document.querySelector("div#input").dispatchEvent(new Event('input',{bubles:true,cancelable:true}));
        document.getElementById("mybutton").click();
    },5000);
 
})();