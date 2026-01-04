// ==UserScript==
// @name         b站显示楼层(lchzh ver.)
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  网页端视频、番剧、动态、专栏显示评论区楼层
// @author       lchzh3473
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/bangumi/play/*
// @match        *://*.bilibili.com/read/*
// @match        *://t.bilibili.com/*
// @match        *://www.bilibili.com/opus/*
// @match        *://h.bilibili.com/*
// @icon         https://app.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431474/b%E7%AB%99%E6%98%BE%E7%A4%BA%E6%A5%BC%E5%B1%82%28lchzh%20ver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/431474/b%E7%AB%99%E6%98%BE%E7%A4%BA%E6%A5%BC%E5%B1%82%28lchzh%20ver%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const mname = ".reply-wrap:not(.lchzhrel)";
    if (location.hostname == "t.bilibili.com") {
        const tid = location.href.match(/t.bilibili.com\/(\d{18})/)[1];
        const xhr = new XMLHttpRequest();
        xhr.open("get", `//api.bilibili.com/x/polymer/web-dynamic/v1/detail?id=${tid}`);
        xhr.responseType = "json";
        xhr.withCredentials = true;
        xhr.send();
        xhr.onload = () => {
            const basic = xhr.response.data.item.basic;
            console.log(basic);
            execInterval(basic.comment_type, basic.comment_id_str);
        };
    } else if (location.hostname == "www.bilibili.com"&&location.href.includes('opus')) {
        const tid = location.href.match(/www.bilibili.com\/opus\/(\d{18})/)[1];
        const xhr = new XMLHttpRequest();
        xhr.open("get", `//api.bilibili.com/x/polymer/web-dynamic/v1/detail?id=${tid}`);
        xhr.responseType = "json";
        xhr.withCredentials = true;
        xhr.send();
        xhr.onload = () => {
            const basic = xhr.response.data.item.basic;
            console.log(basic);
            execInterval(basic.comment_type, basic.comment_id_str);
        };
    } else if (location.hostname == "h.bilibili.com") {
        const tid = location.href.match(/h.bilibili.com\/(\d+)/)[1];
        execInterval(11,tid);
    } else {
        if (window.__INITIAL_STATE__.cvid) execInterval(12, window.__INITIAL_STATE__.cvid);
        else execInterval(1, window.__INITIAL_STATE__.aid || window.__INITIAL_STATE__.epInfo.aid);
    }

    function execInterval(type, oid) {
        setInterval(() => {
            if (document.querySelector(mname)) {
                for (const i of document.querySelectorAll(mname)) {
                    i.classList.add("lchzhrel");
                    const xhr = new XMLHttpRequest();
                    xhr.open("get", `//api.bilibili.com/x/v2/reply/detail?type=${type}&oid=${oid}&root=${i.attributes["data-id"].value}`);
                    xhr.responseType = "json";
                    xhr.withCredentials = true;
                    xhr.send();
                    xhr.onload = () => {
                        const data = xhr.response.data;
                        const emote = data?.root?.content?.emote||{};
                        for(const j in emote)localStorage.setItem(j,JSON.stringify(emote[j]));
                        console.log(i);
                        const qwq = i.querySelector(".info");
                        const qwqwq = document.createElement("span");
                        qwqwq.innerHTML = `#${data.root.floor}&nbsp;`;
                        qwq.insertBefore(qwqwq, qwq.children[0]);
                        console.log(data.root.floor);
                    };
                }
            }
        }, 500);
    }
})();