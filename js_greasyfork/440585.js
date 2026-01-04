// ==UserScript==
// @name         豆瓣自动保存到片单
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  保存到排序第一的豆列里
// @author       imzhi <yxz_blue@126.com>
// @match        https://movie.douban.com/subject/*
// @icon         https://img3.doubanio.com/f/movie/d59b2715fdea4968a450ee5f6c95c7d7a2030065/pics/movie/apple-touch-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440585/%E8%B1%86%E7%93%A3%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E5%88%B0%E7%89%87%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/440585/%E8%B1%86%E7%93%A3%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E5%88%B0%E7%89%87%E5%8D%95.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    document.querySelector("#content > div.grid-16-8.clearfix > div.article > div.indent.clearfix > div.gtleft > ul > li:nth-child(3) > div > a").click();
    await sleep(1500);
    document.querySelector(".dialog-doulist > div > div.bd > form > div.doulist-bd > div.doulist-content > div:nth-child(1) > div.dl-bd > div.dl-item.dl-item-exist > div > div:nth-child(1) > label").click();
    await sleep(500);
    document.querySelector(".dialog-doulist > div > div.bd > form > div.doulist-ft > span:nth-child(3) > input").click();

    function sleep(time) {
        return new Promise((resolve) => {
            const timeid = setTimeout(() => {
                clearTimeout(timeid);
                resolve();
            }, time);
        });
    }
})();