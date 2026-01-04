// ==UserScript==
// @name         Exhentai Resource Han Rounded
// @author       100497
// @match        *://*.exhentai.org/*
// @match        *://*.hath.network/*
// @grant        none
// @namespace    Exhentai Resource Han Rounded
// @version      2024.08.14
// @description   更换资源圆体字体Ex
// @license MIT
// @icon        https://cdn-icons-png.flaticon.com/128/2584/2584606.png
// @downloadURL https://update.greasyfork.org/scripts/503360/Exhentai%20Resource%20Han%20Rounded.user.js
// @updateURL https://update.greasyfork.org/scripts/503360/Exhentai%20Resource%20Han%20Rounded.meta.js
// ==/UserScript==

(function() {
    const style = document.createElement('style');
    style.textContent = `
        /*字体名称*/
        * {
            font-family: "Resource Han Rounded CN" !important;
        }

        /*字体大小*/
        * {
            font-size: 16px !important;
        }

        /*字体颜色*/
        /*
        * {
            color: #000000 !important;
        }
        */

        /*字体加粗*/
        /*
        * {
            font-weight: bold !important;
        }
        */

        /*字体粗细（整百数字）*/
        * {
            font-weight: 600 !important;
        }
    `;
    document.head.append(style);
})();