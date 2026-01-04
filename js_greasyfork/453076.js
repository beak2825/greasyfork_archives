// ==UserScript==
// @name         知乎取消登录弹窗
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在五秒内点击以此取消登录按钮，否则不做出任何动作
// @description:en  click submit-close button during 5 second, otherwise no click
// @author       letsgo0
// @match        https://zhuanlan.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*/*
// @match        https://www.zhihu.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/453076/%E7%9F%A5%E4%B9%8E%E5%8F%96%E6%B6%88%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/453076/%E7%9F%A5%E4%B9%8E%E5%8F%96%E6%B6%88%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let stopFlag = false;
    let timer = setTimeout(close, 500);
    const stoper = setInterval( ()=>{stopFlag = true;}, 5000);

    function close(){
        const clsBtn = document.getElementsByClassName('Modal-closeButton')[0];
        if (clsBtn) {
            clsBtn.click && clsBtn.click();
        }
        else {
            if (stopFlag == false){
                timer = setTimeout(close, 500);
            }
        }
    }
})();