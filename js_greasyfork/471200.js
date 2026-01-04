// ==UserScript==
// @name         Find User
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  You can use /user/ztrztr to find the user called "ztrztr"!
// @author       ztrztr
// @match        *://*.www.luogu.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471200/Find%20User.user.js
// @updateURL https://update.greasyfork.org/scripts/471200/Find%20User.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;
    //User Finder
    var res = url.split("/");
    if (res[3] == "user") {
        fetch('https://www.luogu.com.cn/api/user/search?keyword=' + res[4])
            .then(response => response.json())
            .then(data => {
            console.log(data.users[0]);
            var dataa = data.users[0]
            console.log(dataa.uid);
            if (data.users.length == 0) window.location.replace("https://www.luogu.com.cn/");
            if (res[4] != dataa.uid.split("#")[0]) {
                window.location.replace("https://www.luogu.com.cn/user/" + dataa.uid);
            }
        });
    }
    //Auto-Message sender
    setInterval(function() {
        fetch('https://www.luogu.com.cn/chat?_contentOnly')
            .then(response => response.json())
            .then(data => {
                window.addEventListener("keydown", function(event) {
        if (event.ctrlKey && event.key === "'") {
                    fetch("https://www.luogu.com.cn/api/chat/clearUnread", {
                    headers: [
                        ["content-type", "application/json"],
                        ["referer", "https://www.luogu.com.cn/"],
                        ["x-csrf-token", document.querySelector("meta[name=csrf-token]").content],
                    ],
                    body: JSON.stringify({
                        user: data.currentData.latestMessages.result[0].sender.uid,
                        content: "[Auto-reply]This OIer was coding,pls conntect him or her later!",
                    }),
                    method: "POST",
                });
        }
    });
            if (localStorage.getItem("msgCnt") == 0) localStorage.setItem("msgCnt", data.currentData.latestMessages.result.length);

            if (data.currentData.latestMessages.result.length != localStorage.getItem("msgCnt")) {
                fetch("https://www.luogu.com.cn/api/chat/new", {
                    headers: [
                        ["content-type", "application/json"],
                        ["referer", "https://www.luogu.com.cn/"],
                        ["x-csrf-token", document.querySelector("meta[name=csrf-token]").content],
                    ],
                    body: JSON.stringify({
                        user: data.currentData.latestMessages.result[0].sender.uid,
                        content: "[Auto-reply]This OIer was coding,pls conntect him or her later!",
                    }),
                    method: "POST",
                });
            }
        });
    }, 1000);
})();