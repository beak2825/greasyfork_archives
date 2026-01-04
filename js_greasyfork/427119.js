// ==UserScript==
// @name         Google 會議 自動點擊 Overlay 和 要求加入
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自動點擊 Overlay 和 要求加入
// @author       kaku
// @match        https://meet.google.com/*
// @grant        unsafeWindow
// @require https://code.jquery.com/jquery-3.4.1.slim.min.js#md5=d9b11ca4d877c327889805b73bb79edd,sha256=a5ab2a00a0439854f8787a0dda775dea5377ef4905886505c938941d6854ee4f
// @require https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @downloadURL https://update.greasyfork.org/scripts/427119/Google%20%E6%9C%83%E8%AD%B0%20%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%20Overlay%20%E5%92%8C%20%E8%A6%81%E6%B1%82%E5%8A%A0%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/427119/Google%20%E6%9C%83%E8%AD%B0%20%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%20Overlay%20%E5%92%8C%20%E8%A6%81%E6%B1%82%E5%8A%A0%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    waitForKeyElements('.llhEMd', overlay => {
        overlay.detach();
        overlay.promise().done(function() {
            setTimeout(function() {
                waitForKeyElements(".uArJ5e", btn => {
                    btn.click();
                    console.log("<info> clicked agree button.");
                }, true);
            }, 2000);
        });

    });
})();