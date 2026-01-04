// ==UserScript==
// @name         bing快速定位搜索框(Quick location search box)
// @namespace    none
// @license      MIT
// @version      0.1
// @description  按‘/’反斜杠快速定位到搜索框并全选(Press the '/' backslash to quickly navigate to the search box and select all)
// @author       Alex
// @match        https://cn.bing.com/*
// @match        https://www.bing.com/*
// @icon         https://ts3.cn.mm.bing.net/th?id=ODLS.87518fab-8fc1-4893-a7f1-c7d88283a35a
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467026/bing%E5%BF%AB%E9%80%9F%E5%AE%9A%E4%BD%8D%E6%90%9C%E7%B4%A2%E6%A1%86%28Quick%20location%20search%20box%29.user.js
// @updateURL https://update.greasyfork.org/scripts/467026/bing%E5%BF%AB%E9%80%9F%E5%AE%9A%E4%BD%8D%E6%90%9C%E7%B4%A2%E6%A1%86%28Quick%20location%20search%20box%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var search = document.getElementById('sb_form_q');
    document.addEventListener('keyup', function(e) {
        // console.log(e.keyCode);
        if (e.keyCode === 191) {
            if(search || "sb_form_q" == document.activeElement.id){
                if("sb_form_q" != document.activeElement.id){
                    search.focus();
                    search.select();
                }
            }else{
                document.getElementById('schWrapper').click();
            }

        }
    });
})();