// ==UserScript==
// @name         自动打开b站字幕
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  自动检测并打开b站的ai字幕，按键盘z键打开或关闭ai字幕,增加字幕状态的记忆功能
// @author       lhr3572651322
// @license      MIT
// @match       https://www.bilibili.com/video/*
// @match       https://www.bilibili.com/list/watchlater*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/537202/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80b%E7%AB%99%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/537202/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80b%E7%AB%99%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    let checkCount = 0;
const checkAndClick = setInterval(() => {
    const aiSub = document.querySelector('div[data-lan="ai-zh"]');
    const isOpened = GM_getValue('isOpened', false);
    const closeSub = document.querySelector('.bpx-player-ctrl-subtitle-close-switch');
        // 如果AI字幕不存在，直接返回
    if (!aiSub) return;
        // 事件监听器只需要绑定一次
    if (!aiSub.hasListener) {
        aiSub.addEventListener('click', () => {
            GM_setValue('isOpened', true);
        });
        aiSub.hasListener = true;
    }
        if (!closeSub?.hasListener) {
        closeSub?.addEventListener('click', () => {
            GM_setValue('isOpened', false);
        });
        if (closeSub) closeSub.hasListener = true;
    }
        // 如果之前字幕状态为打开，且当前字幕关闭，则打开字幕
    if (isOpened) {
        const isClosed = closeSub?.classList.contains('bpx-state-active');
        if (isClosed) {
            aiSub.click();
        }
    }
}, 100);


    document.addEventListener('keydown', function(e) { // 监听Z 键是否按下，按下就在AI字幕和关闭字幕之间切换
        if( (e.key === 'z' || e.key === 'Z' )&& !e.ctrlKey) {//按下z键且没按ctrl，以保证ctrl+z不受影响
            e.preventDefault();//阻止按键的默认功能
            const aiSub = document.querySelector('div[data-lan="ai-zh"]');//检测打开中文ai字幕的对象是否存在
            const closeSub = document.querySelector('.bpx-player-ctrl-subtitle-close-switch')//通过close寻找ai字幕的关闭按键是否存在
            if (aiSub) {//ai字幕存在再判断字幕状态
                const isopened = !closeSub.classList.contains('bpx-state-active');//关闭字幕时能搜索到bpx-state-active，开启时则不行
                if (isopened) {
                    closeSub.click();//关闭字幕
                  }
                else{
                    document.querySelector('div[data-lan="ai-zh"]').click();//打开字幕
                }
                GM_setValue('isopened', !isopened)//存储字幕状态
        }
    }
    });

})();