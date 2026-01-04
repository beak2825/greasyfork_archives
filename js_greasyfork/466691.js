// ==UserScript==
// @name         人才呀自动刷课
// @namespace    http://tampermonkey.net/
// @version      1.09
// @license      Every one
// @description  该脚本能够快速刷完人才呀平台的课！
// @author       不染伤痕
// @match        *://103.8.33.231/*
// @icon         http://brshfilesystem.kele.plus/chfs/shared/share/%E6%88%91%E7%9A%84%E9%A1%B9%E7%9B%AE%E8%B5%84%E6%BA%90/%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E7%B1%BB/%E4%BA%BA%E6%89%8D%E5%91%80%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC/%E5%9B%BE%E6%A0%87/icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466691/%E4%BA%BA%E6%89%8D%E5%91%80%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/466691/%E4%BA%BA%E6%89%8D%E5%91%80%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

window.onload = function(){

    let sourceAddress = "http://brshfilesystem.kele.plus/";

	var script = document.createElement('script');
	script.src = sourceAddress + 'chfs/shared/share/%E6%88%91%E7%9A%84%E9%A1%B9%E7%9B%AE%E8%B5%84%E6%BA%90/%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E7%B1%BB/%E4%BA%BA%E6%89%8D%E5%91%80%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC/%E8%84%9A%E6%9C%AC/rcyScript.js';
	document.head.appendChild(script);


}