// ==UserScript==
// @name         AniListStaff过滤
// @namespace    http://tampermonkey.net/
// @version      2024-04-06
// @description  在AniList的staff页面增加一个一键过滤"on my list"的按钮
// @author       You
// @match        https://anilist.co/staff/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491801/AniListStaff%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/491801/AniListStaff%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    let btn = document.createElement("input");
    btn.type = "button";
    btn.value = "过滤";
    btn.style.position = "fixed";
    btn.style.bottom = "40px"; // 控制按钮距离页面顶部的距离
    btn.style.right = "40px"; // 控制按钮距离页面左侧的距离
    btn.style.width = "50px";
    btn.style.height = "50px";
    btn.style.zIndex = 1000;

    document.body.appendChild(btn);
    btn.onclick = function() {
        let list = document.querySelectorAll(".role-card");
        for (let index in list) {
            if (list[index].children && list[index].children.length >= 2) {
                console.log(list[index].children[1].children[0]);
                let childWithStatus = list[index].children[1].children[0].children[0];
                if (childWithStatus != null) {
                    list[index].style.display = 'none';
                }
            }
        }
    };
})();