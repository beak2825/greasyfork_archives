// ==UserScript==
// @name         kill robin
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  删除百度热榜、广告
// @author       hankaibo
// @match        *://www.baidu.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/419130/kill%20robin.user.js
// @updateURL https://update.greasyfork.org/scripts/419130/kill%20robin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 删除首页热榜
    function deleteHomeHot(){
        let hotDom=document.querySelector('#s-hotsearch-wrapper');
        if(hotDom){
            hotDom.remove();
        }
    }

    // 删除搜索结果页热榜
    function deleteResultHot(){
        let hotDom=document.querySelector('#content_right');
        if(hotDom){
            hotDom.remove();
        }
    }


    // 首页热榜监听
    function homeEventer(){
        let parentHomeHotDom=document.querySelector('#head_wrapper');
        if(parentHomeHotDom){
            parentHomeHotDom.addEventListener('DOMNodeInserted',function(){
                deleteHomeHot();
            });
        }
    }


    // 结果页热榜监听
    function resultEventer(){
        let parentResultHotDom=document.querySelector('#container');
        if(parentResultHotDom){
            parentResultHotDom.addEventListener('DOMNodeInserted',function(){
                deleteResultHot();
            });
        }
    }

    // 注册监听
    deleteHomeHot();
    deleteResultHot();
    homeEventer();
    resultEventer();
})();