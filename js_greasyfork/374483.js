// ==UserScript==
// @name         kukudm 漫画左右键翻页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://comic.kukudm.com/*
// @match        http://comic2.kukudm.com/*
// @match        http://comic3.kukudm.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374483/kukudm%20%E6%BC%AB%E7%94%BB%E5%B7%A6%E5%8F%B3%E9%94%AE%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/374483/kukudm%20%E6%BC%AB%E7%94%BB%E5%B7%A6%E5%8F%B3%E9%94%AE%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.onkeydown=function(event){
    var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==39){ // 按右键
            document.getElementsByTagName('a')[1].click();
        }else if(e && e.keyCode==37){
            document.getElementsByTagName('a')[0].click();
        }
    }
})();