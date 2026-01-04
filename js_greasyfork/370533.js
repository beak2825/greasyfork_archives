// ==UserScript==
// @name         移除 知乎隐私政策概要
// @name:en      Remove Zhihu Privacy Modal
// @namespace    https://www.zhihu.com/
// @version      0.1
// @description  移除 知乎隐私政策概要 弹出层
// @description:en Remove Zhihu Privacy Modal Summary
// @author       Michael
// @match        *://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370533/%E7%A7%BB%E9%99%A4%20%E7%9F%A5%E4%B9%8E%E9%9A%90%E7%A7%81%E6%94%BF%E7%AD%96%E6%A6%82%E8%A6%81.user.js
// @updateURL https://update.greasyfork.org/scripts/370533/%E7%A7%BB%E9%99%A4%20%E7%9F%A5%E4%B9%8E%E9%9A%90%E7%A7%81%E6%94%BF%E7%AD%96%E6%A6%82%E8%A6%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    function removePrivacyModal(){
        var modalNode = document.getElementsByClassName('PrivacyConfirm-modal')[0];
        if(modalNode !== undefined)
        {
            while (modalNode.parentNode !== document.body)
            {
                modalNode = modalNode.parentNode;
            }
            modalNode.remove();
            document.body.parentNode.style.overflow = '';
            window.clearInterval(removeInterval);
        }
    }

    var removeInterval = window.setInterval(removePrivacyModal, 500);
    removePrivacyModal();
})();