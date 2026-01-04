// ==UserScript==
// @name         去你妈的绿网计划
// @namespace    https://www.fkj233.cn/
// @version      1.2
// @description  去除淘宝/天猫绿网计划跳转
// @author       FKJ
// @match        *://item.taobao.com/*
// @match        *://detail.tmall.com/*
// @icon         https://www.taobao.com/favicon.ico
// @grant        none
// @run-at       document-body
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/457285/%E5%8E%BB%E4%BD%A0%E5%A6%88%E7%9A%84%E7%BB%BF%E7%BD%91%E8%AE%A1%E5%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/457285/%E5%8E%BB%E4%BD%A0%E5%A6%88%E7%9A%84%E7%BB%BF%E7%BD%91%E8%AE%A1%E5%88%92.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        if (url.indexOf("mtop.taobao.pcdetail.data.get") !== -1) {
            const xhr = this;
            const getter = Object.getOwnPropertyDescriptor(
                XMLHttpRequest.prototype,
                "response"
            ).get;
            Object.defineProperty(xhr, "responseText", {
                get: () => {
                    let result = getter.call(xhr);
                    try {
                        const res = JSON.parse(result);
                        if (res.data.pcTrade.redirectReason === "teenagerGreenNetwork") delete res.data.pcTrade;
                        return JSON.stringify(res);
                    } catch (e) {
                        return result;
                    }
                },
            });
        }
        originOpen.apply(this, arguments);
    };
    const backup = window.onSibRequestSuccess;
    window.onSibRequestSuccess = function(res) {
        if (res.data.redirectUrl.indexOf("https://market.m.taobao.com/app/msd/m-activity-life/index.html") !== -1) delete res.data.redirectUrl;
        backup(res);
    }
})();