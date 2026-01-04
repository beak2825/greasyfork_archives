// ==UserScript==
// @name         去除B站直播PK条
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动去除B站直播PK条
// @author       nox-410
// @match        https://live.bilibili.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/406856/%E5%8E%BB%E9%99%A4B%E7%AB%99%E7%9B%B4%E6%92%ADPK%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/406856/%E5%8E%BB%E9%99%A4B%E7%AB%99%E7%9B%B4%E6%92%ADPK%E6%9D%A1.meta.js
// ==/UserScript==

'use strict';

function main() {
    $("#chaos-pk-vm").hide();
}

main();