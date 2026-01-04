// ==UserScript==
// @name         石之家PC版
// @namespace    ff14risingstones
// @version      0.3
// @description  在电脑上逛石之家
// @author       editit
// @match        *://ff14risingstones.web.sdo.com/*
// @icon         https://ff.web.sdo.com/favicon.ico
// @run-at       document-start
// @grant        GM_addStyle
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/474760/%E7%9F%B3%E4%B9%8B%E5%AE%B6PC%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/474760/%E7%9F%B3%E4%B9%8B%E5%AE%B6PC%E7%89%88.meta.js
// ==/UserScript==

Object.defineProperty(navigator, 'userAgent', {
    value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1'
});

GM_addStyle ( `
    html{
        font-size: 50px !important;
    }
    .mescroll{
        position: absolute !important;
        top: 60px !important;
        bottom: 84px !important;
    }
` );