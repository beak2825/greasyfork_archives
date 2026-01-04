// ==UserScript==
// @name         MDN自动切换中文
// @match        https://developer.mozilla.org/*
// @description  支持最新版MDN
// @license MIT
// @run-at document-start
// @version 0.0.1.20220302032403
// @namespace https://greasyfork.org/users/100760
// @downloadURL https://update.greasyfork.org/scripts/440798/MDN%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/440798/MDN%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==
(() => {
    if(window.location.pathname.match(/(?<=\/)(?<language>.+?)(?=\/)/).groups.language!=='zh-CN')
    window.location.pathname=window.location.pathname.replace(/(?<=\/).+?(?=\/)/,'zh-CN');
}
)();