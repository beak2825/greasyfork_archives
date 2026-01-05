// ==UserScript==
// @name        spiegel.de: entferne bento.de Promotions
// @description Entfernt Elemente von Spiegel Online, die auf bento.de verweisen
// @namespace   https://greasyfork.org/en/users/13300-littlepluto
// @match       *://www.spiegel.de/
// @match       *://www.spiegel.de/#*
// @match       *://www.spiegel.de/schlagzeilen/
// @noframes
// @version     1.13
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16986/spiegelde%3A%20entferne%20bentode%20Promotions.user.js
// @updateURL https://update.greasyfork.org/scripts/16986/spiegelde%3A%20entferne%20bentode%20Promotions.meta.js
// ==/UserScript==

var element;
//bento Box
(element = document.querySelector('section[data-area="block>Bento-Box"]')) && element.remove();
(element = document.querySelector('section[data-area="block>podlove:und_was_machst_du_so?_der_job-podcast_von_bento"]')) && element.remove();

document.querySelectorAll('a[href*="://www.bento.de/"]').forEach(
	elem => {
		var ancestor = elem.closest('article');
		if (ancestor)
			ancestor.remove();
		else
			elem.remove();
	}
)