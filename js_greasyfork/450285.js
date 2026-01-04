// ==UserScript==
// @name         斗鱼lol简化
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  简化斗鱼lol分区!
// @author       Yue
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match        https://www.douyu.com/g_LOL
// @match        https://www.douyu.com/*
// @icon         https://www.douyu.com/favicon.ico
// @license      GNU General Public License v3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450285/%E6%96%97%E9%B1%BClol%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/450285/%E6%96%97%E9%B1%BClol%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
	$(document).ready(function(){
		var eleArr = ['#groupListBox > div.index-wrapperBox-fPzNk','#js-aside','body > section > main > section.layout-Customize','#listAll > div.layout-Module-head.ListHeader--customer','#js-header > div > div > div.Header-left > div > ul > li:nth-child(5)','#js-header > div > div > div.Header-left > div > ul > li:last-child','#js-room-activity > div','#js-player-toolbar','#js-player-title > div > div.Title-roomInfo > div:nth-child(3)'];
		eleArr.forEach(function (ele){
			if ($(ele)[0]) {
				$(ele).remove()
			} else {
				setTimeout(function () {
					$(ele).remove()
				}, 1000);
			}
		})
		$('.layout-Player-announce').remove()
		$('.layout-Player-rank').remove()
		$('#js-room-activity').remove()
		$('#js-player-barrage').css('top','15px')
		$('.layout-Player-video').css('bottom',0)
		$('#js-player-toolbar').remove()
	})
})();