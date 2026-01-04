// ==UserScript==
// @name         豆瓣隐私
// @namespace    https://greasyfork.org/users/2646
// @version      0.1
// @description  默认将添加的收藏都设置为私有状态，并禁止发布广播！
// @author       CLE
// @match        http://*.douban.com/*
// @match        https://*.douban.com/*
// @grant        none
// @contributionURL http://clso.tk/donate/
// @contributionAmount 6.66
// @downloadURL https://update.greasyfork.org/scripts/367947/%E8%B1%86%E7%93%A3%E9%9A%90%E7%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/367947/%E8%B1%86%E7%93%A3%E9%9A%90%E7%A7%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

	$("body").bind("DOMNodeInserted", function(e) {
		$(e.target).find("#dlg-opt-share").attr("value","0").prop("checked", false);
		$(e.target).find("#inp-private").attr("value","0").prop("checked", true);
	});
})();