// ==UserScript==
// @name         Wenku365 Never Reject
// @namespace    https://7sdre.am/
// @version      0.1
// @description  Make Webku365 rejected document viewable
// @author       7sDream
// @license      GPLv3
// @include      /^https?:\/\/www\.wenku365\.com\/p-\d+\.html$/
// @require      https://unpkg.com/xhook@1.4.9/dist/xhook.min.js
// @run-at       document-start
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/438751/Wenku365%20Never%20Reject.user.js
// @updateURL https://update.greasyfork.org/scripts/438751/Wenku365%20Never%20Reject.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(function() {
    'use strict';
    const log = str => {
        console.log(`Wenku365NR::[${str}]`);
    };
    const appendInfo = (str) => {
        const container = document.querySelector(".detail-con-info");
        const info = document.createElement("p");
        info.appendChild(document.createTextNode(str));
        "font-12 text-secondary mb-0 mr-3 d-none d-lg-inline-block".split(" ").forEach(cls => info.classList.add(cls));
        container.insertBefore(info, container.firstChild);
    }
    xhook.after(function(request, response) {
        log(`hook request: ${request.url}`);
        if (request.url.match(/\/api\/getinfo\/get_check_info$/)) {
            log(`rewrite check result`);
            let checkResultJson = null;
            try {
                checkResultJson = JSON.parse(response.text);
            } catch (e) {}
            const checkResult = checkResultJson?.data?.result;
            const checkMessage = checkResultJson?.msg;
            if (typeof checkResult ==="string" && checkResult !== "pass") {
                appendInfo(`WNR:${checkMessage}`);
                response.text = '{"code": 200,"data":{"result":"pass"},"msg":"\u5408\u89c4\u6587\u6863"}';
            }
        }
    });
    log("xhook installed");
})();