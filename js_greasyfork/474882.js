// ==UserScript==
// @name        优化微信文章
// @name:en         FuckweixinArticle
// @namespace    https://greasyfork.org/en/users/572221-alan636
// @description       修复了一些微信文章问题
// @description:en    Open target link in a new tab without confirmation dialog and close the original dialog
// @description:zh       修复了一些微信文章问题
// @match        https://mp.weixin.qq.com/*
// @author alan636
// @icon //res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico
// @version      4.0
// @license Mozilla
// @downloadURL https://update.greasyfork.org/scripts/474882/%E4%BC%98%E5%8C%96%E5%BE%AE%E4%BF%A1%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/474882/%E4%BC%98%E5%8C%96%E5%BE%AE%E4%BF%A1%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var semaphore = false;
    var observer = new MutationObserver(function(mutationsList) {
        mutationsList.forEach(function(mutation) {
            if (mutation.target.id === 'js_link_dialog_body' && mutation.target.style.display === '' && !semaphore) {
                semaphore = true;
                preventOriginalPageRedirect();
                simulateAllowButtonClick();
                setTimeout(function() { semaphore = false; }, 1000);
            }
        });
    });
    var targetNode = document.body;
    var config = { childList: true, subtree: true };
    observer.observe(targetNode, config);

    function simulateAllowButtonClick() {
        var allowButton = document.getElementById('js_link_dialog_ok');
        if (allowButton) allowButton.click();
    }

    function preventOriginalPageRedirect() {
        var linkDialogCancel = document.getElementById('js_link_dialog_cancel');
        if (linkDialogCancel) linkDialogCancel.addEventListener('click', function(event) { event.preventDefault(); });
    }
})();

