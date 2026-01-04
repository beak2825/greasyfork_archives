// ==UserScript==
// @name         Close the login modal of Zhihu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动关闭知乎的登录弹窗
// @author       Kay
// @match        https://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446185/Close%20the%20login%20modal%20of%20Zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/446185/Close%20the%20login%20modal%20of%20Zhihu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function closeLoginModal(){
    var eleHTML = document.querySelector('html');
    var eleModal = document.querySelector('.Modal-wrapper');

        eleHTML.style="";//恢复页面滚动
        eleModal.parentNode.removeChild(eleModal);
        console.log('Removed Zhihu Login Modal');
    }

    var timer = window.setTimeout(closeLoginModal,300);
})();