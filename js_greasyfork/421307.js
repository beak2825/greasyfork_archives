// ==UserScript==
// @name         库存管理方案总结
// @namespace    http://tampermonkey.net/
// @version      1.2.7
// @description  快速管理库存方案
// @author       Kumirei
// @include      http://bunpro.jp/*
// @include      https://bunpro.jp/*
// @include      http://www.bunpro.jp/*
// @include      https://www.bunpro.jp/*
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421307/%E5%BA%93%E5%AD%98%E7%AE%A1%E7%90%86%E6%96%B9%E6%A1%88%E6%80%BB%E7%BB%93.user.js
// @updateURL https://update.greasyfork.org/scripts/421307/%E5%BA%93%E5%AD%98%E7%AE%A1%E7%90%86%E6%96%B9%E6%A1%88%E6%80%BB%E7%BB%93.meta.js
// ==/UserScript==

(function() {
	$('head').append('<style id="BunProPercentageScript">' +
					 '    .profile-jlpt-level .progress .percentage {' +
					 '        position: absolute; '+
					 '        left: 50%;' +
					 '        line-height: 15px;' +
					 '        transform: translate(-50%,0);' +
					 '        text-shadow: 1px 0px black;' +
					 '    }' +
					 '</style>');
	waitForKeyElements('.profile-jlpt-level .progress-bar', function(e) {
		var percentage = String(Math.round(e.attr('aria-valuenow')*10)/10) + "%";
		$(e[0].parentNode).append('<span class="percentage">' + percentage + '</span>');
	});
})();