// ==UserScript==
// @name            护眼模式
// @name:zh-CN      护眼模式
// @name:en         EyesCareMode
// @version         0.1
// @description     简单的护眼模式，减低 10% 的亮度
// @description:en  Easy EyesCare Mode, Reduce luminance for 10%
// @author          RunningCheese
// @namespace       https://www.runningcheese.com
// @license         MIT
// @match           *://*/*
// @grant           GM_addStyle
// @run-at          document-start
// @icon            data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M12 21q-1.65 0-2.825-1.175Q8 18.65 8 17H5q-.825 0-1.413-.587Q3 15.825 3 15q0-3.5 2.3-6.037Q7.6 6.425 11 6.05V3h2v3.05q3.4.375 5.7 2.913Q21 11.5 21 15q0 .825-.587 1.413Q19.825 17 19 17h-3q0 1.65-1.175 2.825Q13.65 21 12 21Zm-7-6h14q0-2.9-2.05-4.95Q14.9 8 12 8q-2.9 0-4.95 2.05Q5 12.1 5 15Zm7 4q.825 0 1.413-.587Q14 17.825 14 17h-4q0 .825.588 1.413Q11.175 19 12 19Zm0-2Z"%2F%3E%3C%2Fsvg%3E
// @downloadURL https://update.greasyfork.org/scripts/456902/%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/456902/%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

    (function() {
        GM_addStyle("html{filter: brightness(0.9);}");
    })();
