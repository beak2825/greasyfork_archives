// ==UserScript==
// @name            GGBases | Thumbnails
// @namespace       http://tampermonkey.net/
// @version         1.0.2
// @description     Add images as thumbnails to the row items (on the end)
// @author          extra.lewd
// @match           https://www.ggbases.com/*
// @match           https://ggbases.dlgal.com/*
// @exclude         https://www.ggbases.com/view.so*
// @exclude         https://ggbases.dlgal.com/view.so*
// @icon            https://www.ggbases.com/favicon.ico
// @run-at          document-end
// @license         CC BY-NC-ND 4.0
// @license-url     https://creativecommons.org/licenses/by-nc-nd/4.0/
// @homepage        https://discord.gg/TcWrM6pXWD
// @homepageURL     https://discord.gg/TcWrM6pXWD
// @website         https://discord.gg/TcWrM6pXWD
// @source          https://discord.gg/TcWrM6pXWD
// @compatible      firefox
// @compatible      chrome
// @compatible      opera
// @compatible      safari
// @compatible      edge
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/509922/GGBases%20%7C%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/509922/GGBases%20%7C%20Thumbnails.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const observer = new MutationObserver(boostrap);
    observer.observe(document.querySelector("body"), {
        childList: true,
        subtree: true,
    });
    async function boostrap() {
        const elements = document.querySelectorAll("a[name='title']:not(.gay)");
        const [width, height] = await Promise.all([GM.getValue("img.width", 600), GM.getValue("img.height", 450)]);
        elements.forEach(e => {
            e.classList.add("gay"); // skip from adding img again
            const img = document.createElement("img");
            const src = parseSource(e.getAttribute("c"));
            if (!src)
                return;
            img.src = src;
            img.width = width;
            img.height = height;
            // todo: try use fragmentDocument somehow instead?
            // probably it has low performance due re-render on each append...
            e.parentElement.parentElement.append(img);
        });
    }
    // stealed from ggbases.com
    const r1 = new RegExp("^http"), r2 = new RegExp("^//");
    // init
    boostrap();
    registerCommands();
    function parseSource(src) {
        if (!src || src === "" || src === " ")
            return;
        if (/^d[0-9]{6,8}$/.test(src)) {
            // @ts-expect-error optional argument
            src = gendlcover(src.substr(1, src.length));
        }
        else if (/^RJ[0-9]{6,8}$/.test(src)) {
            // @ts-expect-error optional argument
            src = gendlcover(src.substr(2, src.length));
        }
        else if (/^v[0-9]{6,8}$/.test(src)) {
            src = gendlcover(src.substr(1, src.length), 1);
        }
        else if (/^VJ[0-9]{6,8}$/.test(src)) {
            src = gendlcover(src.substr(2, src.length), 1);
        }
        else if (/^g[0-9]{6,7}$/.test(src)) {
            src = gengccover(src.substr(1, src.length));
        }
        else if (/^gc[0-9]{6,7}$/.test(src)) {
            src = gengccover(src.substr(2, src.length));
        }
        else if (!r1.test(src) && !r2.test(src)) {
            src = coverurl(src);
        }
        return src;
    }
    // stealed from ggbases.com
    function gendlcover(did, type) {
        let pre0 = null, dpre0 = null, npre = null;
        if (did.indexOf('0') == 0 && did.length == 8)
            npre = '0';
        did = parseInt(did);
        let rid = Math.ceil(did / 1000) * 1000;
        if (did < 10) {
            pre0 = "00000";
        }
        else if (did < 100) {
            pre0 = "0000";
        }
        else if (did < 1000) {
            pre0 = "000";
        }
        else if (did < 10000) {
            pre0 = "00";
        }
        else if (did < 100000) {
            pre0 = "0";
        }
        if (rid < 10000) {
            dpre0 = "00";
        }
        else if (rid < 100000) {
            dpre0 = "0";
        }
        if (pre0) {
            did = pre0 + did;
        }
        if (dpre0) {
            rid = dpre0 + rid;
        }
        if (npre) {
            did = npre + did;
            rid = npre + rid;
        }
        let usecoverproxy = false;
        if (typeof Storage !== "undefined") {
            // @ts-expect-error Developer (I mean myself) is 🤡. Using already loaded on website lib of dayjs
            usecoverproxy = localStorage.getItem("usecoverproxy" + dayjs().format("YYYY-MM-DD"));
        }
        return (usecoverproxy ? "//cover.ydgal.com/_200_cover/".replace("/_200_cover/", "") : "//img.dlsite.jp") + "/modpub/images2/work/" + (!type ? "doujin/RJ" : "professional/VJ") + rid + "/" + (!type ? "RJ" : "VJ") + did + "_img_main.jpg";
    }
    // stealed from ggbases.com
    function gengccover(did) {
        return "//cover.ydgal.com/_200_cover/".replace("/_200_cover/", "/_300_cover/") + "/getchu/gc" + did + ".jpg";
        //return "//cover.ydgal.com/_200_cover/".replace("/_200_cover/", "") + "/brandnew/" + did + "/c" + did + "package_s.jpg";
    }
    // stealed from ggbases.com
    function coverurl(tid) {
        const num = tid.split("_")[0];
        const coverUrl = "//cover.ydgal.com/_200_cover/";
        if (parseInt(num) > 1360000) {
            return coverUrl + "new/" + tid;
        }
        else {
            return coverUrl + "old/" + tid;
        }
    }
    function registerCommands() {
        GM.registerMenuCommand("Set image width", () => {
            const value = parseInt(prompt("Input image width", "600"));
            if (!isNaN(value) && value > 0) {
                GM.setValue("img.width", value);
                alert("Success! Reload page to apply changes");
            }
        });
        GM.registerMenuCommand("Set image height", () => {
            const value = parseInt(prompt("Input image height", "450"));
            if (!isNaN(value) && value > 0) {
                GM.setValue("img.height", value);
                alert("Success! Reload page to apply changes");
            }
        });
    }
})();
