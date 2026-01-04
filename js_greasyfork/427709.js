// ==UserScript==
// @name         河南省机关事业单位升级考核网络远程培训平台
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  http://hngk.hnhhlearning.com
// @author       You
// @match        http://hngk.hnhhlearning.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427709/%E6%B2%B3%E5%8D%97%E7%9C%81%E6%9C%BA%E5%85%B3%E4%BA%8B%E4%B8%9A%E5%8D%95%E4%BD%8D%E5%8D%87%E7%BA%A7%E8%80%83%E6%A0%B8%E7%BD%91%E7%BB%9C%E8%BF%9C%E7%A8%8B%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/427709/%E6%B2%B3%E5%8D%97%E7%9C%81%E6%9C%BA%E5%85%B3%E4%BA%8B%E4%B8%9A%E5%8D%95%E4%BD%8D%E5%8D%87%E7%BA%A7%E8%80%83%E6%A0%B8%E7%BD%91%E7%BB%9C%E8%BF%9C%E7%A8%8B%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

   setInterval(function(){ if(document.getElementsByClassName('pv-ask-modal').length==1)
			 {
				document.getElementsByClassName('pv-ask-modal')[0].remove();
				document.getElementsByClassName('pv-video')[0].click();
			}},1000)
})();