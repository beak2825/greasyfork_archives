// ==UserScript==
// @name         B站哔哩哔哩删除动态右边标签话题新闻元素
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  哔哩哔哩右边的标签话题真是睿智，眼不见为净！
// @author       OrangePig
// @match        *://t.bilibili.com/*
// @match        *://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457571/B%E7%AB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%88%A0%E9%99%A4%E5%8A%A8%E6%80%81%E5%8F%B3%E8%BE%B9%E6%A0%87%E7%AD%BE%E8%AF%9D%E9%A2%98%E6%96%B0%E9%97%BB%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/457571/B%E7%AB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%88%A0%E9%99%A4%E5%8A%A8%E6%80%81%E5%8F%B3%E8%BE%B9%E6%A0%87%E7%AD%BE%E8%AF%9D%E9%A2%98%E6%96%B0%E9%97%BB%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==


(function () {
         'use strict';

    //顺便删了adblock提醒关闭tip
    var adblockTips = document.getElementsByClassName('adblock-tips')[0]
    if (adblockTips != null) {
        adblockTips.style.display = 'none';
    }

    //由于是异步加载，监测DOM删的
    const handleObserveEvent = (records) => {
        records
            .flatMap((r) => [...r.addedNodes])
            .filter((n) => n.classList?.contains('topic-panel'))
            .forEach((n) => n.remove());
    };

    const app = document.querySelector('#app');
    const ob = new MutationObserver(handleObserveEvent);

    ob.observe(app, {
        subtree: true,
        childList: true,
    });

    deleteShit();
    setTimeout(function () { deleteShit(); }, 100);
    setTimeout(function () { deleteShit(); }, 2000);
    //没有监测DOM，懒得注释掉了
    function deleteShit() {
        let bilibiliPanels = document.getElementsByClassName('relevant-topic')
        if (bilibiliPanels.length != 0) {
            for (let i = 0; i < bilibiliPanels.length; i++) {
                bilibiliPanels[i].style.display = 'none';
            }

        }

        var bilibiliPanel = document.getElementsByClassName('topic-panel')[0]
        if (bilibiliPanel != null) {
            bilibiliPanel.style.display = 'none';
        }

    };
})();
