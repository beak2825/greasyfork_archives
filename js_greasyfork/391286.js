// ==UserScript==
// @name         【下厨房】手机网页版关闭app显示/提示
// @namespace    https://greasyfork.org
// @version      0.3.5
// @description  下厨房】手机网页版关闭app显示/提示，添加默认UA
// @author       cw
// @include        *://m.xiachufang.com/*
// @grant        none
// @run-at        document-body
// @downloadURL https://update.greasyfork.org/scripts/391286/%E3%80%90%E4%B8%8B%E5%8E%A8%E6%88%BF%E3%80%91%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%89%88%E5%85%B3%E9%97%ADapp%E6%98%BE%E7%A4%BA%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/391286/%E3%80%90%E4%B8%8B%E5%8E%A8%E6%88%BF%E3%80%91%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%89%88%E5%85%B3%E9%97%ADapp%E6%98%BE%E7%A4%BA%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    var customUserAgent = 'Mozilla/5.0 (Linux; U; Android 7.0; zh-CN; PRO 7-S Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 UCBrowser/11.9.4.974 UWS/2.13.2.46 Mobile Safari/537.36 AliApp(DingTalk/4.6.29) com.alibaba.android.rimet/11388461 Channel/10002068 language/zh-CN';
    try{
        Object.defineProperty(navigator, 'userAgent', {
            get: function () {
                return customUserAgent;
            }
        });
    }
    catch(error){
    }
    try{
        Object.defineProperty(navigator, 'userAgent', {
            value: customUserAgent,
            writable: true
        });
    }
    catch(error){
    }
    window.addEventListener('DOMContentLoaded', function () {

        var clickArr = ['.skip', '.continue'];
        var hiddenArr = ['.swipe.footer', '.open-app-button', '.open-app-btn', '.button.w-100.dib.tc', '.wrapper.pl20',
                         '.section-title.flex-grow-1.items-center+a', '#add-more-container+*', '.advertise',
                         '.footer-container.flex.items-center.footer', '.recipe-addon','.fixed-footer', ['.absolute.right-0', '将做法保存到手机']
                        ];
        clickArr.forEach(item => {
            let els = document.querySelectorAll(item);
            if (els.length) {
                els.forEach(el => {
                    el.click()
                })
            }
        })
        hiddenArr.forEach(item => {
            let tip;
            if (item.constructor == Array) {
                [item,tip]=item
            }
            let els = document.querySelectorAll(item);
            if (els.length) {
                els.forEach(el => {
                    if (tip && tip != el.innerText) return
                    el.style.display = 'none'
                })
            }
        })
    })
})();