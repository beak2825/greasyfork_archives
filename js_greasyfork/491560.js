// 感谢@1523789353贡献的代码
// ==UserScript==
// @name         qtmdBili
// @description  哔哩哔哩营销号屏蔽
// @author       xvhuan
// @namespace    xvhuan
// @version      0.0.1
// @create       2024-04-03
// @lastmodified 2024-04-03
// @note         首次更新
// @charset      UTF-8
// @match        *://*.bilibili.com/*
// @connect      localhost
// @connect      qaq.al
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @compatible   chrome
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491560/qtmdBili.user.js
// @updateURL https://update.greasyfork.org/scripts/491560/qtmdBili.meta.js
// ==/UserScript==
(async function () {
    const bili_jct = (await cookieStore.get('bili_jct')).value;

    function sleep(ms) {
        return new Promise(res => setTimeout(res, ms));
    }

    async function getUidList() {
        const { promise, resolve, reject } = Promise.withResolvers();
        // 油猴提供的跨域请求方法
        GM_xmlhttpRequest({
            url: 'https://qaq.al/x.txt',
            method: 'GET',
            onload: res => resolve(res.responseText),
            onerror: reject
        });
        return promise;
    }

    async function addToBlackList(uid) {
        return fetch('https://api.bilibili.com/x/relation/modify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            credentials: 'include',
            body: `fid=${uid}&act=5&csrf=${bili_jct}`
        })
            .then(async res => void console.log('请求成功, 响应体: ', await res.text()))
            .catch(err => void console.error('请求错误', err));
    }

    async function updateBlackList() {
        const reqText = await getUidList();
        const uidList = reqText.split('^');

        for (let uid of uidList) {
            console.log('正在拉黑: ', uid);
            await addToBlackList(uid);
            await sleep(200);
        }
        console.log('ok了老铁');
    }

    GM_registerMenuCommand("更新营销号黑名单", updateBlackList);
})();