// ==UserScript==
// @name         虎牙自动最高画质
// @description  默认跳过部分直播间存在的HDR播放源，需要的同学自行将代码中hdr=false改为true
// @author       shopkeeperV
// @namespace    https://greasyfork.org/zh-CN/users/150069
// @version      0.3
// @match        *://*.huya.com/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/462555/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/462555/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

(function() {
    let hdr = false;
    let timer;
    let toggle = function() {
        const videotypes = document.querySelector('.player-videotype-list');
        if (!videotypes) return;
        let index = 0;
        for (let i = 0; i < videotypes.children.length; i++) {
            if (!hdr && videotypes.children[index].textContent.includes("HDR")) index++;
            else break;
        }
        let highest = videotypes.children[index];
        if (highest.className === 'on') return;
        highest.click();
        clearInterval(timer);
    };
    timer = setInterval(toggle, 1000);
})();