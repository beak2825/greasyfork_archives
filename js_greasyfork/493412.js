// ==UserScript==
// @name         bilibili自动点赞投币
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  bilibili自动点赞投币，免费的赞，温暖up的心!
// @author       Iris Xe
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_removeValueChangeListener
// @grant        GM_addValueChangeListener
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493412/bilibili%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E6%8A%95%E5%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/493412/bilibili%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E6%8A%95%E5%B8%81.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const delay = 5000;
    function zan() {
        let button = document.querySelector(
            '.video-toolbar-left .toolbar-left-item-wrap [title=点赞（Q）]'
        );
        if (!button.className.includes('on')) {
            button.click();
        }
    }
    function verifyInit() {
        const jct = GM_getValue('jct') || prompt('输入cookie中的bili_jct：');
        const sessData = GM_getValue('sessData') || prompt('输入cookie中的SESSDATA：');
        const userId = GM_getValue('userId') || prompt('输入cookie中的DedeUserID：');

        let obj = {
            jct,
            sessData,
            userId,
            str: `bili_jct=${jct};SESSDATA=${sessData};DedeUserID=${userId};`,
        };

        if (jct && sessData && userId) {
            GM_setValue('jct', jct);
            GM_setValue('sessData', sessData);
            GM_setValue('userId', userId);
        }
        console.log(obj);
        return obj;
    }
    function coin(id, num = 2, like = 1) {
        const coinAddUrl = 'https://api.bilibili.com/x/web-interface/coin/add';
        const kv = {
            bvid: id,
            multiply: num,
            select_like: like,
            cross_domain: 'true',
            csrf: verifyInit().jct,
        };
        const body = new URLSearchParams();
        for (const k in kv) {
            body.append(k, kv[k]);
        }
        fetch(coinAddUrl, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Referer': 'https://www.bilibili.com/video/' + id,
                'Origin': 'https://www.bilibili.com',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body,
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.code !== 0) {
                    console.error(data);
                }
                if (data.code === -111) {
                    GM_deleteValue('jct');
                    GM_deleteValue('sessData');
                    GM_deleteValue('userId');
                    alert('cookie失效，请刷新页面后重新输入');
                } else {
                    console.log(data);
                }
            });
    }
    let pathname = location.pathname;
    let id = pathname.match(/video\/(.+)\//)[1] || '';

    setInterval(() => {
        let newPathname = location.pathname;
        if (newPathname !== pathname) {
            pathname = newPathname;
            id = pathname.match(/video\/(.+)\//)[1] || '';
            //防止误点视频
            setTimeout(() => {
                zan();
                coin(id);
            }, delay);
        }
    }, delay);

    //防止误点视频
    setTimeout(() => {
        zan();
        coin(id);
    }, delay);
})();
