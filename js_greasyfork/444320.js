// ==UserScript==
// @license MIT
// @name         速卖通显示标题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  只显示速卖通商品列表的全部标题
// @author       You
// @match        https://www.aliexpress.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444320/%E9%80%9F%E5%8D%96%E9%80%9A%E6%98%BE%E7%A4%BA%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/444320/%E9%80%9F%E5%8D%96%E9%80%9A%E6%98%BE%E7%A4%BA%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var dom = document.getElementsByClassName('_1tu1Z');
    for(var i=0;i<dom.length;i++){
        dom[i].style.display = "block";
    }
    window.onscroll = function() {
        var dom = document.getElementsByClassName('_1tu1Z');
        for(var i=0;i<dom.length;i++){
            dom[i].style.display = "block";
        }
    }
})();