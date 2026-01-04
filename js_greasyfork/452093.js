// ==UserScript==
// @name         MEST ProcessReport Helper
// @namespace    joyings.com.cn
// @version      0.2.0
// @description  美尔斯通派工报工筛选
// @author       zmz125000
// @match       http://112.74.92.133/mest/*
// @icon          http://www.google.com/s2/favicons?domain=openwrt.org
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/452093/MEST%20ProcessReport%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/452093/MEST%20ProcessReport%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    var url = new URL(window.location.href);
    var scd = url.searchParams.get("scd");
    var process = url.searchParams.get("process");
    var order = url.searchParams.get("order");

    if (scd) {
        const scdbox = waitForElm('[placeholder="生产单号"]');
        scdbox.then((elm) => elm.value = scd);
        scdbox.then((elm) => elm.dispatchEvent(new Event('input', {
            bubbles: true
        })));
        scdbox.then(() => {
            document.querySelector('.el-icon-search').parentElement.click()
        })
    }

    const pbox = waitForElm('[placeholder="工序名称"]');
    pbox.then((elm) => elm.value = process);
    pbox.then((elm) => elm.dispatchEvent(new Event('input', {
        bubbles: true
    })));
    pbox.then(() => {
        document.querySelector('.el-icon-search').parentElement.click()
    })

    const obox = waitForElm('[placeholder="订单号"]');
    obox.then((elm) => elm.value = order);
    obox.then((elm) => elm.dispatchEvent(new Event('input', {
        bubbles: true
    })));
    obox.then(() => {
        document.querySelector('.el-icon-search').parentElement.click()
    })
})();