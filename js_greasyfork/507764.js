// ==UserScript==
// @name         gsxjtu雨课堂
// @namespace    http://tampermonkey.net/
// @version      1900-01-10
// @description  0
// @author       0
// @license      MIT
// @match        https://gsxjtu.yuketang.cn/pro/lms/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507764/gsxjtu%E9%9B%A8%E8%AF%BE%E5%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/507764/gsxjtu%E9%9B%A8%E8%AF%BE%E5%A0%82.meta.js
// ==/UserScript==

(function () {
    'use strict';

    async function get_video_list() {
        let cookie_get = (key) => document.cookie.split("; ").map(s => s.split('=')).filter(p => p[0].indexOf(key) != -1)[0].slice(1).join("=")
        let cookie_token = cookie_get("csrftoken")
        let platform_id = cookie_get("platform_id")
        let university_id = cookie_get("university_id")
        let xtbz = cookie_get("xtbz")

        let seg = location.href.split("/");
        let cid = "cid=" + seg[6];
        let sign = "sign=" + seg[5];
        let url = "https://gsxjtu.yuketang.cn/mooc-api/v1/lms/learn/course/chapter?" + cid + "&" + sign + "&term=latest&uv_id=" + university_id;

        let res = await fetch(url, {
            "credentials": "include",
            "headers": {
                "User-Agent": navigator.userAgent,
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "en-US,en;q=0.5",
                "xtbz": xtbz,
                "university-id": university_id,
                "platform-id": platform_id,
                "X-CSRFToken": cookie_token,
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "Sec-GPC": "1"
            },
            "method": "GET",
            "mode": "cors"
        }).then(r => r.json());
        res = res.data.course_chapter;
        res = res.sort((a, b) => a.order > b.order).map(e => e.section_leaf_list);
        res = res.map(e => e.sort((a, b) => a.order > b.order));
        let video_list = [];

        for (let chapter of res)
            for (let e of chapter)
                if (e.leaf_list)
                    for (let ee of e.leaf_list)
                        if (ee.leaf_type === 0)
                            video_list.push(ee.id)

        return Array.from(new Set(video_list.sort()))
    }

    async function nextVideo() {
        let tmp = location.href.split('/');
        let cur_id = parseInt(tmp[tmp.length - 1]);
        let video_list = await get_video_list();
        let idx = video_list.indexOf(cur_id);
        if (idx + 1 != video_list.length) {
            tmp[tmp.length - 1] = video_list[idx + 1]
            return tmp.join('/');
        }
        return "https://gsxjtu.yuketang.cn"
    }

    function speedup() {
        const speedwrap = document.getElementsByTagName("xt-speedbutton")[0];
        const speedlist = document.getElementsByTagName("xt-speedlist")[0];
        const speedlistBtn = speedlist.firstElementChild.firstElementChild;
        speedlistBtn.setAttribute('data-speed', 2);

        const mousemove = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: 10,
            clientY: 10
        });
        speedwrap.dispatchEvent(mousemove);
        speedlistBtn.click();
    }

    setTimeout(() => {
        nextVideo().then(
            nxt => {
                console.log(nxt);
                let player = document.querySelector("video");
                player.pause = () => { console.log("pause") }; // 禁用自动暂停
                // document.hasFocus = ()=>true ; // 禁用自动暂停
                speedup(); // 开启二倍速
                setInterval(() => {
                    if (player.paused) { document.querySelector(".xt_video_player_mask").click(); } // 模拟点击 开始播放
                    if (player.currentTime + 3 > player.duration) { location.assign(nxt); } // 检测是否播放完毕, 自动跳转下一个视频
                }, 500);
            })
    }, 4500);
})();