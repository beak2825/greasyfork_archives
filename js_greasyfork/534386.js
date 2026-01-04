// ==UserScript==
// @name         取消微博互相关注以外的关注者
// @namespace    http://tampermonkey.net/
// @version      2025-04-29
// @description  把微博互相关注以外的关注者取消关注
// @author       RaspberrYanagi
// @match        https://weibo.com/u/page/follow/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/534386/%E5%8F%96%E6%B6%88%E5%BE%AE%E5%8D%9A%E4%BA%92%E7%9B%B8%E5%85%B3%E6%B3%A8%E4%BB%A5%E5%A4%96%E7%9A%84%E5%85%B3%E6%B3%A8%E8%80%85.user.js
// @updateURL https://update.greasyfork.org/scripts/534386/%E5%8F%96%E6%B6%88%E5%BE%AE%E5%8D%9A%E4%BA%92%E7%9B%B8%E5%85%B3%E6%B3%A8%E4%BB%A5%E5%A4%96%E7%9A%84%E5%85%B3%E6%B3%A8%E8%80%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const link = document.createElement('a');
    link.href = 'javascript:void(0);';
    link.className = 'x_follow';
    link.textContent = '取消互相关注以外的关注';
    Object.assign(link.style, {
        position: 'fixed',
        right: '1%',
        bottom: '10%'
    });

    link.addEventListener('click', async (event) => {
        event.preventDefault();
        console.log('执行取消非互相关注操作');
        await loadFullList({ interval: 1500, maxRetries: 30 });
        const loadedFullList = document.querySelector('main').querySelector('[class^="ListTitle_tit_"],[class*=" ListTitle_tit_"]').parentElement.querySelector('.vue-recycle-scroller').__vue__.items;
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
        document.querySelector('main').querySelector('button[class^="FollowContent_stbtn"],button[class*=" FollowContent_stbtn"]').click();
        let groupChecklist = document.querySelector('main').querySelector('[class^="ListTitle_tit_"],[class*=" ListTitle_tit_"]').parentElement.parentElement.__vue__.groupCheckedList;
        for ( const i of loadedFullList) {
            const {idstr, follow_me} = i.item;
            if (groupChecklist.length >= 20 ) {
                await submitUnfollow();
                groupChecklist = [];
                groupChecklist = document.querySelector('main').querySelector('[class^="ListTitle_tit_"],[class*=" ListTitle_tit_"]').parentElement.parentElement.__vue__.groupCheckedList;
            } else {
                if (!follow_me) {
                    groupChecklist.push(idstr);
                }
            }
        }

        console.log("循环执行完了");
        console.log(groupChecklist);
        await delay(3000);
        if (groupChecklist.length > 0) {
            await submitUnfollow();
        }

    });

    document.documentElement.insertBefore(link, document.body);


})();

const submitUnfollow = async () => {
    document.querySelector('main').querySelector('div[class^="FollowContent_stbtn"],div[class*=" FollowContent_stbtn"]').querySelector('button').click();
    await delay(1000);
    document.querySelector('.woo-modal-main').querySelector('.woo-button-primary').click();
    await delay(5000);
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function loadFullList(options = {}) {
    const {
        maxRetries = 5,
        interval = 1000,
    } = options;

    let lastItemCount = 0;
    let retries = 0;

    const load = async () => {
        const currentItems = document.querySelector('main').querySelector('[class^="ListTitle_tit_"],[class*=" ListTitle_tit_"]').parentElement.querySelector('.vue-recycle-scroller').__vue__.items.length

        if (currentItems === lastItemCount) {
            if (retries++ > maxRetries) {
                console.log('列表已完全加载');
                return true;
            }
        } else {
            retries = 0;
            lastItemCount = currentItems;
        }

        window.scroll({
            top: document.body.scrollHeight - window.innerHeight - 96 * 5,
            behavior: 'smooth'
        });
        window.dispatchEvent(new Event('scroll'));

        await delay(1000)

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
        window.dispatchEvent(new Event('scroll'));

        await new Promise(r => setTimeout(r, interval));
        return load();
    };

    return load();
}
