// ==UserScript==
// @name         B站点击logo查看banner图片
// @namespace    https://www.xmader.com/
// @version      0.2
// @description  点击banner上的logo查看banner图片
// @author       Xmader
// @match        https://www.bilibili.com/*
// @match        http://www.bilibili.com/*
// @homepageURL  https://www.xmader.com/
// @license      MIT
// @copyright    Copyright (c) 2018 Xmader
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372666/B%E7%AB%99%E7%82%B9%E5%87%BBlogo%E6%9F%A5%E7%9C%8Bbanner%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/372666/B%E7%AB%99%E7%82%B9%E5%87%BBlogo%E6%9F%A5%E7%9C%8Bbanner%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const init = async () => {
        let banner_img

        const head_logo = document.querySelector(".head-logo")

        if (!head_logo) return;

        try {
            const banner = document.getElementById("banner_link")
            const banner_bg = banner.style["background-image"]
            banner_img = banner_bg.split("\"")[1].replace("//", "https://")
        }
        catch (e) {
            const r = await fetch("https://api.bilibili.com/x/web-show/res/loc?id=142", { credentials: 'include' })
            const data = (await r.json()).data
            banner_img = data[0].pic
        }

        head_logo.href = banner_img
    }

    setTimeout(init, 100);

})();

