// ==UserScript==
// @name         取消超链接下划线
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  x浏览器取消超链接下划线
// @author       zhn
// @match        *://158.180.74.136/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505517/%E5%8F%96%E6%B6%88%E8%B6%85%E9%93%BE%E6%8E%A5%E4%B8%8B%E5%88%92%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/505517/%E5%8F%96%E6%B6%88%E8%B6%85%E9%93%BE%E6%8E%A5%E4%B8%8B%E5%88%92%E7%BA%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
     window.onload=function(){//do something

        var lists = document.getElementsByTagName("a");
        for(var i = 0;i < lists.length;i++)
        {
            lists[i].classList.remove('title-link');
        }
    }
})();