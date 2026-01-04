// ==UserScript==
// @name         b站直播拉黑主播
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  用于具体某个分区页面下的屏蔽，仅使用css，非实际拉黑
// @author       You
// @match        https://live.bilibili.com/*
// @icon         http://bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/432744/b%E7%AB%99%E7%9B%B4%E6%92%AD%E6%8B%89%E9%BB%91%E4%B8%BB%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/432744/b%E7%AB%99%E7%9B%B4%E6%92%AD%E6%8B%89%E9%BB%91%E4%B8%BB%E6%92%AD.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    var blockList = getList();

    if (location.pathname.match(/^\/\d+/)) {
        GM_addStyle(".bili-block-btn>i.icon-report:before{content: '\\E00f' !important;}");

        var roomId = await getRealRoomId();
        let count = 100;
        let interval = setInterval(() => {
            if (document.querySelector(".right-ctnr")) {
                clearInterval(interval);
                initBtn();
            } else if (!count) {
                clearInterval(interval);
            }
            count++;
        }, 100);
    } else if (location.pathname.match(/\/all|p\/eden\/area-tags/)) {
        let css = "pronax";
        for (const i of blockList) {
            css += `,a[href*="com/${i}?"]`;
        }
        if (css) {
            css += "{display:none}";
            GM_addStyle(css);
        }
    }

    function add() {
        let list = getList();
        for (const i of roomId) {
            list.add(i);
        }
        saveList(list);
        window.close();
    }

    function remove() {
        let list = getList();
        for (const i of roomId) {
            list.delete(i);
        }
        blockList = list;
        saveList(list);
        initBtn();
    }

    function getList() {
        let list = GM_getValue("blockList");
        list = list ? list.split(",").map(Number) : [];
        return new Set(list);
    }

    function saveList(list) {
        GM_setValue("blockList", Array.from(list).toString());
    }

    function initBtn() {
        document.querySelector(".bili-block-btn") && document.querySelector(".bili-block-btn").remove();
        let has = hasRid();
        let div = document.createElement('div');
        div.innerHTML = `<div title="" class="bili-block-btn icon-ctnr live-skin-normal-a-text pointer" style="line-height: 16px;"><i class="v-middle icon-font icon-report" style="font-size: 16px;"></i><span class="action-text v-middle" style="margin-left: 8px;user-select: none;font-size: 12px;">${has ? "解除拉黑" : "拉黑"}</span></div>`;
        document.querySelector(".right-ctnr").prepend(div);
        if (!has) {
            document.querySelector(".bili-block-btn").onclick = () => {
                add();
            };
        } else {
            document.querySelector(".bili-block-btn").onclick = () => {
                remove();
            };
        }
    }

    async function getRealRoomId() {
        return new Promise((r, j) => {
            fetch(`https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${getRid()}`, {
                credentials: 'include',
            })
                .then(r => r.json())
                .then(json => {
                    let array = [];
                    array.push(json.data.room_id);
                    if (json.data.short_id != 0) {
                        array.push(json.data.short_id);
                    }
                    r(array);
                });
        });

        function getRid() {
            switch (true) {
                // 真实roomid
                case typeof (__NEPTUNE_IS_MY_WAIFU__) != 'undefined':
                    return __NEPTUNE_IS_MY_WAIFU__.roomInitRes.data.room_id;
                case document.querySelector("#iframe-popup-area>iframe") != null:
                    return document.querySelector("#iframe-popup-area>iframe").src.match(/roomid=(\d+)/)[1];
                // 下面的都是短位rid
                case location.href.match(/live.bilibili.com(\/blanc)?\/(\d+)/) != null:
                    return location.href.match(/live.bilibili.com(\/blanc)?\/(\d+)/)[2];
                case document.querySelector("#player-ctnr iframe"):
                    return document.querySelector("#player-ctnr iframe").src.match(/blanc\/(\d+)/)[1];
                case typeof (__initialState) != 'undefined' && __initialState["live-non-revenue-player"].length == 1:
                    return __initialState["live-non-revenue-player"][0].defaultRoomId;
                default:
                    alert("无法获得RID，请反馈给插件开发者");
            }
        }
    }

    function hasRid() {
        for (const i of roomId) {
            if (blockList.has(i)) {
                return true;
            }
        }
        return false;
    }

})();