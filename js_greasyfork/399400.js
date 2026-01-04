// ==UserScript==
// @name         屏蔽知乎浏览问题时的登录弹框
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  知乎浏览问题老是弹出烦人的登录弹框？不用怕，我来帮你解决它
// @author       vyy
// @match        https://www.zhihu.com/question/*
// @match        https://www.zhihu.com/search?*
// @match        https://zhuanlan.zhihu.com/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399400/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E6%B5%8F%E8%A7%88%E9%97%AE%E9%A2%98%E6%97%B6%E7%9A%84%E7%99%BB%E5%BD%95%E5%BC%B9%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/399400/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E6%B5%8F%E8%A7%88%E9%97%AE%E9%A2%98%E6%97%B6%E7%9A%84%E7%99%BB%E5%BD%95%E5%BC%B9%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timer = setInterval(function(){
        var closeBtn;
        if(!(closeBtn = document.querySelector('.signFlowModal button.Modal-closeButton'))){
            // 如果没有这个按钮，就不管
            return;
        }
        // 如果找到了这个按钮，就删掉定时器，并且点击一下按钮
        clearInterval(timer);
        closeBtn.click();
    },10);
    // Your code here...
})();