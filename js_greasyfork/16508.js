// ==UserScript==
// @name        Rep Inverter
// @namespace   Dr.YeTii
// @include     http*://kickass.to/*
// @include     http*://kat.cr/*
// @description Inverts rep of all people + sets rep back to -127K for CoBane
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16508/Rep%20Inverter.user.js
// @updateURL https://update.greasyfork.org/scripts/16508/Rep%20Inverter.meta.js
// ==/UserScript==

var rep = {'full':-127652,'shortened':'-127.65K'};

var target = document.querySelector('body');
var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		updateRepValues();
	});
});
var config = { attributes: true, childList: true, characterData: true };
observer.observe(target, config);
function updateRepValues() {
	$('.repValue.positive').each(function() {
		$(this).toggleClass('positive negative');
		if ($(this).text().charAt(0) != '-')
			$(this).html('-'+$(this).html())
	});
	if (rep) {
		if (/^\/user\/cobane\//i.test(window.location.pathname))
			$('h1.nickname .repValue').removeClass('positive').addClass('negative').html(rep.full);
		$('.badgeInline, .badgeInfo').each(function() {
			if ($(this).find('a.plain').text()=='CoBane')
				$(this).find('.repValue').removeClass('positive').addClass('negative').html(rep.shortened);
		});
	}
}