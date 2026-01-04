// ==UserScript==
// @name         洛谷 UID 颜色显示
// @namespace    http://tampermonkey.net/
// @version      2024-11-5
// @description  将用户名显示成其 UID 对应色
// @author       normal-pcer
// @match        https://www.luogu.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515659/%E6%B4%9B%E8%B0%B7%20UID%20%E9%A2%9C%E8%89%B2%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/515659/%E6%B4%9B%E8%B0%B7%20UID%20%E9%A2%9C%E8%89%B2%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const brighten = true;

    /**
     * @param {string} uid
     */
    function UidToColor(uid) {
        // 规则如下：
        // 对于一个 6 位的 UID，将其看成十六进制颜色的字符串
        // 对于一个超过 6 位的 UID，取后六位
        // 如果 UID 小于 6 位，则前面补 0
        // 进一步地，如果 UID 小于 3 位，则看成三位的十六进制颜色；不足三位的补到三位
        if (uid.length > 6) {
            uid = uid.slice(-6);
        } else if (uid.length < 6 && uid.length > 3) {
            uid = uid.padStart(6, "0");
        } else if (uid.length < 3) {
            uid = uid.padStart(3, "0");
        }

        // console.log(`uid1: ${uid}`)
        if (brighten) {
            // 提取成 RGB 格式
            if (uid.length === 3) {
                uid = uid
                    .split("")
                    .map((c) => c.repeat(2))
                    .join("");
            }
            // console.log(`uid2: ${uid}`)
            for (let i = 0; i < 6; i += 2) {
                let hex = parseInt(uid.slice(i, i + 2), 16);
                hex = Math.min(180, Math.max(0, Math.round(hex*1.4)));
                uid = uid.slice(0, i) + hex.toString(16).padStart(2, "0") + uid.slice(i + 2);
                // console.log(`uid_i: ${uid}`)
            }
        }
        return `#${uid}`;
    }

    function work() {
        const links = document.querySelectorAll("a[href^='/user/']");

        for (let link of links) {
            const uid = link.href.split("/").pop();
            const color = UidToColor(uid);
            // console.log(`${uid} -> ${color}`);

            link.style.setProperty("color", color, "important");
            if (link.children) {
                for (let child of link.children) {
                    child.style.setProperty("color", color, "important");
                }
            }
        }
    }

    // Your code here...
    console.log("'UID 颜色显示'脚本开始运行");

    setInterval(work, 1000);
})();
