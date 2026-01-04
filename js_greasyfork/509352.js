// ==UserScript==
// @name         刷客刷客
// @namespace    http://tampermonkey.net/
// @version      2024-09-20
// @description  刷客刷客刷客
// @author       oldkingOK
// @match        https://www.gxela.gov.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509352/%E5%88%B7%E5%AE%A2%E5%88%B7%E5%AE%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/509352/%E5%88%B7%E5%AE%A2%E5%88%B7%E5%AE%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.send = function(body) {
        if (body) {
            try {
                let jsonBody = JSON.parse(body);

                if ('progress' in jsonBody) {
                    jsonBody.progress = 100;
                }
                body = JSON.stringify(jsonBody);
            } catch (e) {
                console.log('无法解析请求体或修改 progress 值');
            }
        }
        console.log('XML Send Intercepted Request data:', body);
        var result = originalSend.call(this, body);
        return result;
    };
})();
