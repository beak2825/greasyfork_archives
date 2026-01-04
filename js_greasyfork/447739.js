// ==UserScript==
// @name         掘金一键点赞
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  为掘金沸点一键点赞
// @author       You
// @match        https://juejin.cn/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447739/%E6%8E%98%E9%87%91%E4%B8%80%E9%94%AE%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/447739/%E6%8E%98%E9%87%91%E4%B8%80%E9%94%AE%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let latestOffsetHeight = document.body.offsetHeight;
    let counter = 0;
    const sleep = (t) => new Promise(resolve => setTimeout(resolve, t));
    const clickLike = async () => {
        const btns = document.querySelectorAll('.like:not(.active)');
        if(btns?.length) {
            for await(const node of btns) {
                console.log(node);
                await sleep(300);
                node.click();
            }
        }
        scrollTo(0, document.body.offsetHeight);
        await sleep(1000);
        if(document.body.offsetHeight === latestOffsetHeight) {
            counter++;
        } else {
            counter = 0;
        }
        latestOffsetHeight = document.body.offsetHeight;
        if(counter < 3) await clickLike();
    }
    const handleClick = async () => {
        btn.disabled = true;
        btn.innerText = '点赞中...';
        await clickLike();
        btn.disabled = false;
        btn.innerText = '已完成';
    }
    const btn = document.createElement('button');
    btn.innerText = '一键点赞';
    btn.className = 'btn';
    btn.style = 'position: fixed;left: 0;bottom: 10%;';
    btn.addEventListener('click', handleClick);
    document.body.appendChild(btn);
})();