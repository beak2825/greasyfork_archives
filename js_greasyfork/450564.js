// ==UserScript==
// @name         芯参数::xincanshu
// @namespace    https://greasyfork.org/
// @version      0.1
// @description  去除验证码限制
// @author       Cosil.C
// @match        http*://www.xincanshu.com/*
// @icon         https://www.xincanshu.com/favicon.ico
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/450564/%E8%8A%AF%E5%8F%82%E6%95%B0%3A%3Axincanshu.user.js
// @updateURL https://update.greasyfork.org/scripts/450564/%E8%8A%AF%E5%8F%82%E6%95%B0%3A%3Axincanshu.meta.js
// ==/UserScript==

(function() {
    jq("body").html().match(/jq.*?html\(\'<style>\.cack_jt_box \{display: block;\}<\/style>'\)/g)?.forEach(v => eval(v));
})();