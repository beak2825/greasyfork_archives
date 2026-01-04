// ==UserScript==
// @name         赛尔号/小花仙/功夫派/摩尔庄园 强制32版本Flash加载
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  近期米叔不知道为什么把版本32的Flash禁止加载了。此脚本用于32版本的Flash也能正常加载游戏内容。
// @author       别问我是谁请叫我雷锋
// @match        hua.61.com/
// @match        hua.61.com/*
// @match        hua.61.com/play.shtml
// @match        seer.61.com/
// @match        seer.61.com/*
// @match        seer.61.com/play.shtml
// @match        gf.61.com/
// @match        gf.61.com/*
// @match        gf.61.com/play.shtml
// @match        xmole.61.com/
// @match        xmole.61.com/*
// @license      BSD-3-Clause
// @grant        none
// @incompatible edge Edge已经更新了88版本，已经不支持Flash了，请大家使用Chrome绿色版来运行Flash。
// @compatible   chrome Chrome已经更新了88版本，已经不支持Flash了，请大家使用Chrome绿色版来运行Flash。Chrome好像不会出现当前Flash版本过低的提示（测试用的是MyChrome 87便携版），可以先试试不装这个脚本看看，如果可以直接加载就不需要再装这个脚本了。
// @compatible   opera 注意打开站点权限的Flash
// @downloadURL https://update.greasyfork.org/scripts/420161/%E8%B5%9B%E5%B0%94%E5%8F%B7%E5%B0%8F%E8%8A%B1%E4%BB%99%E5%8A%9F%E5%A4%AB%E6%B4%BE%E6%91%A9%E5%B0%94%E5%BA%84%E5%9B%AD%20%E5%BC%BA%E5%88%B632%E7%89%88%E6%9C%ACFlash%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/420161/%E8%B5%9B%E5%B0%94%E5%8F%B7%E5%B0%8F%E8%8A%B1%E4%BB%99%E5%8A%9F%E5%A4%AB%E6%B4%BE%E6%91%A9%E5%B0%94%E5%BA%84%E5%9B%AD%20%E5%BC%BA%E5%88%B632%E7%89%88%E6%9C%ACFlash%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

window.onload = function () {
    'use strict';
    // document.querySelectorAll("script")[8].remove();
    if (deconcept.SWFObjectUtil.getPlayerVersion().major === 32 ||deconcept.SWFObjectUtil.getPlayerVersion().major === 33 ||deconcept.SWFObjectUtil.getPlayerVersion().major === 34)
        document.getElementById("flashContent").innerHTML = '<embed type="application/x-shockwave-flash" src="Client.swf?' + autoTimes.getTime() + '" width="100%" height="100%" style="undefined" id="Client" name="Client" bgcolor="#330033" quality="high" menu="false" wmode="opaque" allowfullscreen="true" allowscriptaccess="always" allowfullscreeninteractive="true">';
    // Your code here...
};