// ==UserScript==
// @name				Ταξινόμηση λίστας ΕΠΕΑ
// @author				Δρ. Παναγιώτης Ε. Παπάζογλου (Δασολόγος - Περιβαλλοντολόγος)
// @description			Ταξινομεί τη λίστα των ΕΠΕΑ αλφαβητικά και αριθμητικά
// @icon				data:image/png;base64,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
// @namespace			epeagreenpay
// @grant				unsafeWindow
//
// @match				https://epea.greenpay.gr/epitropes-eksetasis/
//
// @require				https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
//
// @license				GPL-3.0-or-later
//
// @version				1.0
//
// @downloadURL https://update.greasyfork.org/scripts/531943/%CE%A4%CE%B1%CE%BE%CE%B9%CE%BD%CF%8C%CE%BC%CE%B7%CF%83%CE%B7%20%CE%BB%CE%AF%CF%83%CF%84%CE%B1%CF%82%20%CE%95%CE%A0%CE%95%CE%91.user.js
// @updateURL https://update.greasyfork.org/scripts/531943/%CE%A4%CE%B1%CE%BE%CE%B9%CE%BD%CF%8C%CE%BC%CE%B7%CF%83%CE%B7%20%CE%BB%CE%AF%CF%83%CF%84%CE%B1%CF%82%20%CE%95%CE%A0%CE%95%CE%91.meta.js
// ==/UserScript==

(function($)
{
	var jQuery = $;
	if(typeof unsafeWindow.jQuery==='undefined')
	{
		return;
	}
	var isChrome = window.navigator.vendor.match(/Google/) ? true : false;
	if(!isChrome)
	{
		this.$ = this.jQuery = jQuery.noConflict(true);
	}
	const container = document.getElementById('grid-container');
	const observer = new MutationObserver(function(mutationsList)
	{
		for (const mutation of mutationsList)
		{
			if (mutation.type==='childList' && mutation.addedNodes.length>0)
			{
				observer.disconnect();
				const $divs = $(container).children('div');
                $divs.removeClass('active');
				$divs.sort(function(a,b)
				{
					const textA = $(a).text().trim();
					const textB = $(b).text().trim();
					const regex = /^(\d+)[ηος]*\s+(.+)$/i;
					const matchA = textA.match(regex);
					const matchB = textB.match(regex);
					if(!matchA||!matchB) return textA.localeCompare(textB);
					const numA = parseInt(matchA[1],10);
					const nameA = matchA[2];
					const numB = parseInt(matchB[1], 10);
					const nameB = matchB[2];
					const nameCompare = nameA.localeCompare(nameB,'el');
					if(nameCompare!==0)
					{
						return nameCompare;
					}
					return numA - numB;
				});
				$(container).append($divs);
				observer.observe(container,{childList:true});
			}
		}
	});
	observer.observe(container,{childList:true});
})(jQuery);