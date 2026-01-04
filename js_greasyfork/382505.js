// ==UserScript==
// @name         删除ip.cn广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  测试脚本
// @author       yiguihai
// @match        *://ip.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382505/%E5%88%A0%E9%99%A4ipcn%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/382505/%E5%88%A0%E9%99%A4ipcn%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

$('#result').css('display', 'block');
$('#tips').css('display', 'none');
$("#tp").remove();