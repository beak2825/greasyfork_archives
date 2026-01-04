// ==UserScript==
// @name         nodejs中文网广告隐藏
// @namespace
// @include      *://nodejs.cn/*
// @version      0.0.1
// @description  简单的nodejs中文网广告隐藏
// @author       ymzhao
// @namespace 
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/510285/nodejs%E4%B8%AD%E6%96%87%E7%BD%91%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/510285/nodejs%E4%B8%AD%E6%96%87%E7%BD%91%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==
GM_addStyle(`
    [id*=pagead]
    {
        display: none !important;
    }
`);