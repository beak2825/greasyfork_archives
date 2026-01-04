// ==UserScript==
// @name         复制csdn内容
// @namespace    http://blog.csdn.net/undefined
// @license      MIT
// @version      0.8
// @description  一个很简单的小脚本，用于复制csdn内容
// @author       轮回
// @match        *://blog.csdn.net/*
// @match        *://link.juejin.cn/?target=*
// @match        *://www.jianshu.com/go-wild?ac=2&url=*
// @match        *://c.pc.qq.com/middlem.html?pfurl=*
// @match        *://gitee.com/link?target=*
// @match        *://link.csdn.net/?target=*

// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/450438/%E5%A4%8D%E5%88%B6csdn%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/450438/%E5%A4%8D%E5%88%B6csdn%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

function onInit(){
    document.querySelectorAll('*').forEach(function(n){
        n.style.cssText += 'user-select:text;height:auto;'
    })
}


(function() {
    'use strict';
    setTimeout(function(){
        onInit();
        window.onload = function(){
            onInit();
        }
    }, 1000)
})();