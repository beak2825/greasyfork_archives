// ==UserScript==
// @name         不要新标签打开
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  不要新页面(标签)打开
// @author       imgreasy
// @match        https://ourbits.club/*
// @require      https://code.jquery.com/jquery-latest.js
// @icon         https://ourbits.club/favicon.ico
// @grant        none
// @license      MIT
// @supportURL   https://greasyfork.org/zh-CN/scripts/457590
// @homepageURL  https://greasyfork.org/zh-CN/scripts/457590
// @downloadURL https://update.greasyfork.org/scripts/457590/%E4%B8%8D%E8%A6%81%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/457590/%E4%B8%8D%E8%A6%81%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function(){
		switch(window.location.host) {
			case "ourbits.club":
                $("#info_block .nowrap>a").attr("target", "_self");
				break;
			default:
                console.log("no match.");
				break;
		}

    });
})();