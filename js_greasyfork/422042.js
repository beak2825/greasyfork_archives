// ==UserScript==
// @name         路由自动识别IP
// @namespace    http://tampermonkey.net/
// @version      1.2.7
// @description  轻松管理路由器IP准入策略
// @author       Kumirei
// @include      http://bunpro.jp/*
// @include      https://bunpro.jp/*
// @include      http://www.bunpro.jp/*
// @include      https://www.bunpro.jp/*
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422042/%E8%B7%AF%E7%94%B1%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%ABIP.user.js
// @updateURL https://update.greasyfork.org/scripts/422042/%E8%B7%AF%E7%94%B1%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%ABIP.meta.js
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

	waitForKeyElements('.profile-jlpt-level', function(e) {
		if (!$('.profile-jlpt-level.total').length) {
			var bar = $('.profile-jlpt-level')[0].cloneNode(true);
			bar.className += ' total';
			$(bar).find('.percentage').remove();
			bar.childNodes[1].innerText = "Total";
			var barelem = $(bar).find('.progress-bar');
			var total = 0;
			var learned = 0;
			$('.row > .progress-count').each(function(i, e) {
				var counts = e.childNodes[0].textContent.split("/");
				total += Number(counts[1]);
				learned += Number(counts[0]);
			});
			barelem.attr('aria-valuenow', learned/total*100);
			barelem.attr('style', 'width: ' + learned/total*100 + '%;');
			$(bar).find('.progress-count')[0].innerText = String(learned) + '/' + String(total);
			var lastbar = $('.profile-jlpt-level');
			$(lastbar[lastbar.length-1]).after(bar);
		}
	});
})();