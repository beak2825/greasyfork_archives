// ==UserScript==
// @name         bilibili直播间舰长在线人数统计
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  每5秒钟统计bilibili直播间舰长在线人数，显示在网页左上角
// @author       SHIFAN
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424679/bilibili%E7%9B%B4%E6%92%AD%E9%97%B4%E8%88%B0%E9%95%BF%E5%9C%A8%E7%BA%BF%E4%BA%BA%E6%95%B0%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/424679/bilibili%E7%9B%B4%E6%92%AD%E9%97%B4%E8%88%B0%E9%95%BF%E5%9C%A8%E7%BA%BF%E4%BA%BA%E6%95%B0%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function get_rid() {
        return window.location.href.split('?')[0].split('/').slice(-1)[0];
    }

    async function get_name(uid) {
        let datas = await fetch(`https://api.bilibili.com/x/space/acc/info?mid=${uid}`);
        datas = await datas.json();
        return datas.data.name;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function detect() {
        const aTag = document.getElementsByClassName('room-cover dp-i-block p-relative bg-cover')[0];
        if (aTag === undefined) return;
        const href = aTag.href;
        if (href === undefined) return;
        const ruid = href.split('/').slice(-2)[0];
        const rid = await get_rid();
        const name = await get_name(ruid);
        let result = [];
        let datas = await fetch(`https://api.live.bilibili.com/xlive/app-room/v2/guardTab/topList?roomid=${rid}&page=1&ruid=${ruid}&page_size=29`);
        datas = await datas.json();
        const info = datas.data.info;
        result = result.concat(datas.data.top3);
        result = result.concat(datas.data.list);
        for (let i=2; i<=info.page; i++) {
            await sleep(100);
            let datas = await fetch(`https://api.live.bilibili.com/xlive/app-room/v2/guardTab/topList?roomid=${rid}&page=${i}&ruid=${ruid}&page_size=29`);
            datas = await datas.json();
            result = result.concat(datas.data.list);
        }
        let count = 0;
        for (let i=0; i<result.length; i++) {
            if (result[i].is_alive > 0) {
                count += 1;
            }
        }
        // console.log(count)
        if (!document.getElementById('show-online')) {
            const newElement = document.createElement("div");
            newElement.setAttribute("id", "show-online");
            newElement.style.position = "absolute";
            newElement.style.zIndex = "9999";
            newElement.style.top = "5px";
            newElement.style.left = "5px";
            document.getElementsByTagName('body')[0].appendChild(newElement);
        }
        document.getElementById('show-online').innerText = `检测:${name} \t 在线:${count}`;
    }
    setInterval(detect, 5000);
    // Your code here...
})();