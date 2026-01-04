// ==UserScript==
// @name         虫洞栈阅读破解
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  用于取消虫洞栈的阅读全文限制。
// @homepage     https://www.wangxingyang.com
// @author       You
// @match      *://bugstack.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bugstack.cn
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/455014/%E8%99%AB%E6%B4%9E%E6%A0%88%E9%98%85%E8%AF%BB%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/455014/%E8%99%AB%E6%B4%9E%E6%A0%88%E9%98%85%E8%AF%BB%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeTag(){
        if(document.getElementsByClassName("read-more-wrap").length > 0){
            console.log("移除阅读全文");
            document.getElementsByClassName("read-more-wrap").item(0).remove();
        }
        if(document.getElementsByClassName("lock").length > 0){
            if(document.getElementsByClassName("lock").item(0).hasAttribute("style")){
                console.log("移除高度限制限制");
                document.getElementsByClassName("lock").item(0).removeAttribute("style");
            }
        }
        setTimeout(removeTag,3000)
    }
    removeTag();

})();