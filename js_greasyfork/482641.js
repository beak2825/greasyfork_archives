// ==UserScript==
// @name         石之家自动盖章
// @namespace    http://tampermonkey.net/
// @version      2023-12-19
// @description  自动完成石之家迎新庆典每日活动
// @author       luimnisward
// @match        https://ff14risingstones.web.sdo.com/*
// @icon         https://ff14risingstones.web.sdo.com/
// @grant        none
// @run-at       context-menu
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482641/%E7%9F%B3%E4%B9%8B%E5%AE%B6%E8%87%AA%E5%8A%A8%E7%9B%96%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/482641/%E7%9F%B3%E4%B9%8B%E5%AE%B6%E8%87%AA%E5%8A%A8%E7%9B%96%E7%AB%A0.meta.js
// ==/UserScript==

/* jshint esversion: 9 */

(async function () {
    "use strict";

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const corsFetch = (url, options = {}) =>
    fetch(url, {
        ...options,
        mode: "cors",
        credentials: "include",
    }).then((res) => res.json());

    /** 签到 */
    const signin = () =>
    corsFetch("https://apiff14risingstones.web.sdo.com/api/home/sign/signIn", {
        method: "POST",
    }).then((res) => {
        console.log(res.msg);
    });

    /** 点赞 */
    const like = async (id) => {
        const request = () =>
        corsFetch("https://apiff14risingstones.web.sdo.com/api/home/posts/like", {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
            body: `id=${id}&type=1`,
            method: "POST",
        }).then((res) => res.data);

        let likeResult = await request();
        while (likeResult !== 1) {
            await wait(3000);
            likeResult = await request();
        }
        console.log("id: " + id + " 点赞成功");
    };

    /** 跟帖 */
    const comment = (posts_id, content) =>
    corsFetch(
        "https://apiff14risingstones.web.sdo.com/api/home/posts/comment",
        {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
            body: `content=${encodeURIComponent(
                content
            )}&posts_id=${posts_id}&parent_id=0&root_parent=0&comment_pic=`,
            method: "POST",
        }
    );

    /** 盖章 */
    const doSeal = (type) =>
    corsFetch(
        "https://apiff14risingstones.web.sdo.com/api/home/active/online2312/doSeal",
        {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
            body: "type=" + type,
            method: "POST",
        }
    );

    await signin();

    for (let i = 0; i < 5; i++) {
        await like("16748");
        await wait(3000);
    }

    await comment("16748", '<p><span class="at-emo">[emo1]</span>&nbsp;</p>');

    await doSeal(1);
    await doSeal(2);
    await doSeal(3);

    alert("执行结束，请在活动页面检查是否已完成");
    window.open('https://ff14risingstones.web.sdo.com/project/ffstoneonline/pc/index.html#/index')
})();