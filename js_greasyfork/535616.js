// ==UserScript==
// @name         GitHub Compatibility for Legacy Browser
// @name:zh-CN   GitHub 旧版浏览器兼容性优化
// @namespace    https://jasongzy.com
// @version      1.0.0
// @description  improve legacy browser compatibility for github.com
// @description:zh-cn  为 github.com 提升旧版浏览器兼容性
// @author       jasongzy
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535616/GitHub%20Compatibility%20for%20Legacy%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/535616/GitHub%20Compatibility%20for%20Legacy%20Browser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        .prc-Checkbox-Checkbox-gIwWX:before {
            -webkit-mask-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSI5IiBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMTIgOSI+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTEuNzguMjJhLjc1Ljc1IDAgMCAxIDAgMS4wNjFsLTcuMjYgNy4yNmEuNzUuNzUgMCAwIDEtMS4wNjIgMEwuMjAyIDUuMjg1YS43NS43NSAwIDAgMSAxLjA2MS0xLjA2MWwyLjcyNSAyLjcyM0wxMC43MTguMjJhLjc1Ljc1IDAgMCAxIDEuMDYyIDAiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==");
            -webkit-mask-position: center;
            -webkit-mask-repeat: no-repeat;
            -webkit-mask-size: 75%;
        }
        .sr-only {
            display: none !important;
        }
    `;

    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);
    }
})();
