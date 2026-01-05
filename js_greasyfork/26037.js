// ==UserScript==
// @name         Zielonka Remover
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  It removes any content created by zielonka users in wykop.pl website
// @author       MeblujDom.pl
// @match        http://www.wykop.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26037/Zielonka%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/26037/Zielonka%20Remover.meta.js
// ==/UserScript==

	var zielonka = '';
			$('.showProfileSummary, .affect').each(function() {
				var zielonka = $(this).hasClass('color-0');
				if (zielonka == true) {
					$(this).closest('li').remove();
				}
			});