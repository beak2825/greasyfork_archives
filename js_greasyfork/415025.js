// ==UserScript==
// @name         ジョブカンログイン継続
// @namespace    https://greasyfork.org/users/5795
// @version      0.2
// @description  30分でセッションが切れる対策
// @author       ikeyan
// @match        https://ssl.jobcan.jp/employee
// @match        https://ssl.jobcan.jp/employee/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415025/%E3%82%B8%E3%83%A7%E3%83%96%E3%82%AB%E3%83%B3%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3%E7%B6%99%E7%B6%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/415025/%E3%82%B8%E3%83%A7%E3%83%96%E3%82%AB%E3%83%B3%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3%E7%B6%99%E7%B6%9A.meta.js
// ==/UserScript==

setInterval(() => {
    (async function() {
        'use strict';

        const response = await fetch("https://ssl.jobcan.jp/employee", {
            headers: {
                "accept": "text/html",
                "accept-language": "ja,en-US;q=0.9",
                "cache-control": "max-age=0",
                "upgrade-insecure-requests": "1"
            },
            referrer: "https://id.jobcan.jp/",
            referrerPolicy: "strict-origin-when-cross-origin",
            method: "GET",
            mode: "cors",
            credentials: "include"
        });
        if (response.url === "https://ssl.jobcan.jp/employee") {
            console.log("ログイン継続", response.url);
        } else {
            console.log("ログアウトされました", response.url);
        }
    })().catch(reason => console.log(reason))
}, 20 * 60 * 1000);