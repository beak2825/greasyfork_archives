// ==UserScript==
// @name         清理开源中国封面人物
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://gitee.com/*
// @match        http://www.oschina.net/*
// @match        https://www.oschina.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38935/%E6%B8%85%E7%90%86%E5%BC%80%E6%BA%90%E4%B8%AD%E5%9B%BD%E5%B0%81%E9%9D%A2%E4%BA%BA%E7%89%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/38935/%E6%B8%85%E7%90%86%E5%BC%80%E6%BA%90%E4%B8%AD%E5%9B%BD%E5%B0%81%E9%9D%A2%E4%BA%BA%E7%89%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function remove(className){
        var items = document.getElementsByClassName(className);
        if(items != null && items.length >0){
            var item = items[0];
            if(item != null )
            {
                item.remove();
            }
        }
    }
    remove('float-left-box');
    remove('float_adbox');

    // Your code here...
})();
