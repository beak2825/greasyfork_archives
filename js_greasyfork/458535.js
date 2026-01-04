// ==UserScript==
// @name         bilibili 动态自动点赞
// @run-at       document-start
// @match        *://*.bilibili.com/*
// @grant        none
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  动态自动点赞
// @author       share121
// @icon         https://www.bilibili.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458535/bilibili%20%E5%8A%A8%E6%80%81%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/458535/bilibili%20%E5%8A%A8%E6%80%81%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(() => {
    async function getAllDynamic(page = 1) {
        return (await fetch(`https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?timezone_offset=-480&type=all&page=${page}`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "sec-gpc": "1"
            },
            "referrer": "https://t.bilibili.com/",
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }))?.json?.();
    }
    async function newLike(dynamic_id, csrf = getCsrf()) {
        return (await fetch("https://api.vc.bilibili.com/dynamic_like/v1/dynamic_like/thumb", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "sec-gpc": "1"
            },
            "referrer": "https://t.bilibili.com/",
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": `dynamic_id=${dynamic_id}&up=1&csrf=${csrf}`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }))?.json?.();
    }
    function getCsrf() {
        return document?.cookie?.match?.(/bili_jct=([a-zA-Z0-9]+)/)?.[1];
    }
    setTimeout(async function createLike() {
        let allDynamic = (await getAllDynamic())?.data?.items;
        for (const e in allDynamic) {
            allDynamic?.[e]?.modules?.module_stat?.like?.status === false && newLike(allDynamic?.[e]?.id_str);
        }
        setTimeout(createLike);
    })
})()