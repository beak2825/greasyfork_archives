// ==UserScript==
// @name         简书去广告, 优化布局
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  【非自动关注】【自用】【(持续增加)功能有】1. 简书去广告，简书的广告越来越影响阅读了，没办法已经忍不了了，只能将其去除了，也希望简书早日回归初心
// @author       lgb
// @match        *://*.jianshu.com/p/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464513/%E7%AE%80%E4%B9%A6%E5%8E%BB%E5%B9%BF%E5%91%8A%2C%20%E4%BC%98%E5%8C%96%E5%B8%83%E5%B1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/464513/%E7%AE%80%E4%B9%A6%E5%8E%BB%E5%B9%BF%E5%91%8A%2C%20%E4%BC%98%E5%8C%96%E5%B8%83%E5%B1%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.onload = function () {
        delAd()
        setLayout()
    }

    function delAd () {
        let dom = document.querySelectorAll('div[style*="z-index"]')
        dom.forEach(item => {
            if (item.style.zIndex > 10000) {
                console.log('dom', item)
                // 拿到父节点:
                let parent = item.parentElement;
                // 删除:
                let removed = parent.removeChild(item);
            }
        })
    }

    function setLayout () {
        let dianzan = document.getElementsByClassName('_3Pnjry')[0]
        let main = document.getElementsByClassName('_gp-ck')[0]
        dianzan.style.left = '30px'
        main.style.width = '1000px'
    }
})();
