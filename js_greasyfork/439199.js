// ==UserScript==
// @name         深色模式
// @namespace    https://fcmsb250.github.io/
// @version      0.3
// @description  适合几乎所有网站
// @author       dsy
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @run-at       document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/439199/%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/439199/%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(() => {
    var 改变值 = (值, 默认值, 回调) => {
        if (GM_getValue(值, 默认值) == "1") {
            GM_setValue(值, "0");
        } else if (GM_getValue(值, 默认值) == "0") {
            GM_setValue(值, "1");
        } else {
            GM_setValue(值, 默认值);
        }
        if (回调) {
            回调();
        }
    };
    var 初始化值 = (值, 默认值, 回调) => {
        if (GM_getValue(值, "天知道是啥") == "天知道是啥") {
            GM_setValue(值, 默认值);
        }
        if (回调) {
            回调();
        }
    };
    初始化值("对图片视频等再次反色", "1");
    初始化值("去部分网站背景图片", "0");

    GM_registerMenuCommand("对图片视频等再次反色", () => {
        改变值("对图片视频等再次反色", "1", () => {
            alert("刷新后生效");
        });
    });
    GM_registerMenuCommand("去背景图片", () => {
        改变值("去背景图片", "0", () => {
            alert("刷新后生效");
        });
    });
    GM_registerMenuCommand("再来一次", () => {
        再来一次();

        if (GM_getValue("去背景图片") == "1") {
            document.body.style.backgroundImage = "none";
            document.documentElement.style.backgroundImage = "none";
        }

        document.querySelectorAll("*").forEach((element) => {
            if (
                getComputedStyle(element).backgroundImage.indexOf("url") >= 0 &&
                element != document.body &&
                element != document.documentElement &&
                对图片视频等再次反色
            ) {
                element.style.filter = "invert(1)";
            }
        });
    });
})();

var 再来一次 = () => {
    "use strict";
    var css1 = `
        ::selection {
            color: white !important;
            background-color: white !important;
        }
        ::-webkit-scrollbar {
            background-color: black !important;
        }
        ::-webkit-scrollbar-thumb {
            background: rgb(100, 100, 100) !important;
        }
        html {
            text-shadow: 0 0 0 !important;
            background-color: white !important;
        }
    `;
    var css2 = `
        img,
        video,
        svg,
        canvas {
            filter: invert(1) !important;
        }
    `;
    var 对图片视频等再次反色 = GM_getValue("对图片视频等再次反色") == "1";

    if (对图片视频等再次反色) {
        GM_addStyle(css2);
    }
    GM_addStyle(css1);

    if (self == top) {
        GM_addStyle("html{ filter: invert(100%) brightness(0.5) !important; }");
    }

    addEventListener("load", () => {
        if (GM_getValue("去背景图片") == "1") {
            document.body.style.backgroundImage = "none";
            document.documentElement.style.backgroundImage = "none";
        }

        document.querySelectorAll("*").forEach((element) => {
            if (
                getComputedStyle(element).backgroundImage.indexOf("url") >= 0 &&
                element != document.body &&
                element != document.documentElement &&
                对图片视频等再次反色
            ) {
                element.style.filter = "invert(1)";
            }
        });
    });
};

再来一次();
