// ==UserScript==
// @name         知乎关闭登录提示框
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  关掉烦人的知乎乎登录弹窗！
// @author       hui-shao
// @license      GPLv3
// @match        https://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445120/%E7%9F%A5%E4%B9%8E%E5%85%B3%E9%97%AD%E7%99%BB%E5%BD%95%E6%8F%90%E7%A4%BA%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/445120/%E7%9F%A5%E4%B9%8E%E5%85%B3%E9%97%AD%E7%99%BB%E5%BD%95%E6%8F%90%E7%A4%BA%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function close(){
        var items = [];

        items = document.getElementsByClassName("Button Modal-closeButton Button--plain");
        if(items.length>0){
            items[0].click();
            console.log("\n获取按钮成功!已尝试执行关闭操作");
            return;
        }
    }

    console.info("脚本已加载 - 知乎关闭登录提示框");

    for(let i=0;i<50;i++){
        setTimeout(function(){close();}, 500);
    }

})();