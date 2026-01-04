// ==UserScript==
// @name         虎牙自动上电视/领宝箱
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  虎牙自动发上电视弹幕, 自动领六个宝箱
// @author       hldh214
// @match        https://www.huya.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443258/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E4%B8%8A%E7%94%B5%E8%A7%86%E9%A2%86%E5%AE%9D%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/443258/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E4%B8%8A%E7%94%B5%E8%A7%86%E9%A2%86%E5%AE%9D%E7%AE%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let $ = window.jQuery;
    let tvIconThread; // 打开上电视弹框
    let inputSendThread; // 发上电视弹幕
    let boxThread; // 百宝箱

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

    waitForElm('.duya-header-right > div').then((elm) => {
        $(elm).prepend('<label for="cbox1">脚本</label><input type="checkbox" name="cbox1" id="cbox1" style="margin-right: 1em;">');
        $('#cbox1').change((ev) => {
            if ($(ev.target).is(":checked")) {
                console.log('activate');

                tvIconThread = setInterval(() => {if(!$('.input-send').length) {$('.tv-icon').click();}}, 1000);
                inputSendThread = setInterval(() => {$('.item-big').click(); $('.input-send').click()}, 400);
                boxThread = setInterval(() => {$('.player-box-stat3').click()}, 1000);
            } else {
                console.log('deactivate');

                clearInterval(tvIconThread);
                clearInterval(inputSendThread);
                clearInterval(boxThread);
            }
        });
    });
})();