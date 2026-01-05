// ==UserScript==
// @name         Google Redirect Remover
// @description  A very simple Google redirect remove
// @version      2.8.17012102
// @author       DanoR
// @namespace    http://weibo.com/zheung
// @grant        none
// @include      *://www.google.*/*
// @downloadURL https://update.greasyfork.org/scripts/4280/Google%20Redirect%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/4280/Google%20Redirect%20Remover.meta.js
// ==/UserScript==

(function() {
	console.log('Remover working!');

	const ws = ['irc_mil', '_Epb.irc_tas', 'irc_hl.irc_hol', 'irc_vpl.irc_but', 'irc_fsl.irc_but'];

	setInterval(function() {
		const allH3rA = document.querySelectorAll('h3.r>a');

		for(let i = 0; i < allH3rA.length; i++)
			allH3rA[i].removeAttribute('onmousedown');

		for(let i = 0; i < ws.length; i++) {
			const allIrc = document.querySelectorAll('a.' + ws[i]);

			for(let j = 0; j < allIrc.length; j++) {
				delete allIrc[j].__jsaction;
				allIrc[j].removeAttribute('jsaction');
			}

		}
	}, 1024);
})();