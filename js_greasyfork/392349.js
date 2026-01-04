// ==UserScript==
// @name         DI Chart Upgrade
// @namespace    https://deepinsight.alipay.com
// @version      0.1
// @description  Change chart to old version.
// @author       You
// @match        https://deepinsight.alipay.com/*
// @grant        none
// @noframes
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/392349/DI%20Chart%20Upgrade.user.js
// @updateURL https://update.greasyfork.org/scripts/392349/DI%20Chart%20Upgrade.meta.js
// ==/UserScript==


(function() {
    'use strict';
    setInterval(() => {
        const ifr = document.querySelector('iframe[name=portal-page-container]');
        if (ifr) {
            if (ifr.src.indexOf('chartEngineType=echarts') === -1) {
                ifr.src = ifr.src.replace('pc.htm?reportId=', 'pc.htm?chartEngineType=echarts&reportId=');
            }
        }
    }, 100);
})();