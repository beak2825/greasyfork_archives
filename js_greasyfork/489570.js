// ==UserScript==
// @name         销售易打开链接
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2024-04-16
// @description  一键打开活动记录列表的数据进行手动审核
// @author       You
// @match        https://crm.xiaoshouyi.com/*
// @grant        GM_registerMenuCommand
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/489570/%E9%94%80%E5%94%AE%E6%98%93%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/489570/%E9%94%80%E5%94%AE%E6%98%93%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let open = XMLHttpRequest.prototype.open;
    let tempLinks = [];
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener('load', function () {
            if (this.responseURL.startsWith('https://crm.xiaoshouyi.com/json/crm_commonList/search.action')) {
                tempLinks = []
                let responseData = JSON.parse(this.responseText);
                responseData.data.entities.forEach(function (v) {
                    let dataType = JSON.parse(v.activityRecordFrom_compound)
                    if (dataType.activityRecordFrom == 1) {
                        tempLinks.unshift('https://crm.xiaoshouyi.com/final/account.action?id=' + v.activityRecordFrom_data)
                    }
                    if (dataType.activityRecordFrom == 2) {
                        tempLinks.unshift('https://crm.xiaoshouyi.com/final/contact.action?id=' + v.activityRecordFrom_data)
                    }
                    if (dataType.activityRecordFrom == 11) {
                        tempLinks.unshift('https://crm.xiaoshouyi.com/final/lead.action?id=' + v.activityRecordFrom_data)
                    }
                })
            }
        });
        open.apply(this, arguments);
    };
    GM_registerMenuCommand("打开链接", function () {
        tempLinks.forEach(function (url) {
            window.open(url);
        })
tempLinks = []
    })
})();