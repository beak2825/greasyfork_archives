// ==UserScript==
// @name         gushiwen enhanced
// @name:zh-CN   古诗文网优化增强
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  +自动关闭弹出二维码 +自动全部展开全文 +右键点击页面右下空白处快速返回顶部
// @author       Hulu
// @match        *://so.gushiwen.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gushiwen.cn
// @grant        none
// @license      GPL-3.0 License
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/453528/gushiwen%20enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/453528/gushiwen%20enhanced.meta.js
// ==/UserScript==

// 回到顶部（监听点击事件，鼠标右键点击网页两侧空白处）
function backToTop(selectors) {
    document.querySelector(selectors).oncontextmenu = function(event){
        if (event.target == this) {
            event.preventDefault();
            window.scrollTo(0,0)
        }
    }
}

//点击展开全文
function clickQuan(selectors) {
    selectors.forEach(function(obj){
        let parentEl = obj.parentElement;
        let childEl = obj.firstElementChild;
        if (childEl.onclick != undefined) {
            //console.log(parentEl.nodeName + "需要点击展开阅读全文");
            childEl.onclick();
            return true;
        } else {
            return false;
        }
    });
}

(function() {
    'use strict';
    // 屏蔽微信登录弹窗
    var object = document.getElementById('hide-center2');
    if (object != null){
        object.parentNode.removeChild(object);
    }
    //复制时不弹出二维码
    document.getElementsByTagName("html")[0].oncopy = "";
    //自动展开全文
    clickQuan(document.querySelectorAll('.contyishang'));
    backToTop('.main3');
})();