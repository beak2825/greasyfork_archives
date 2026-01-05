// ==UserScript==
// @name         Hentai Haven - Anti-Adblock Killer
// @version      0.2.2
// @description  Circumvents the Anti-Adblock on Hentai Haven.
// @author       EroKaylaN
// @match        http://hentaihaven.org/*
// @grant        GM_addStyle
// @run-at       document-body
// @namespace    https://greasyfork.org/users/12437
// @downloadURL https://update.greasyfork.org/scripts/17815/Hentai%20Haven%20-%20Anti-Adblock%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/17815/Hentai%20Haven%20-%20Anti-Adblock%20Killer.meta.js
// ==/UserScript==

GM_addStyle('\
	.download_feed_link .download-panel:hover {\
		width: 227px;\
	}\
	.download_feed_link .download-panel:hover .slide-toggle {\
    margin-right: 20px;\
	}\
	.download_feed_link .download-panel:hover a.btn {\
		display: inline-block !important;\
	}\
	.video-js-no-padding {\
		padding-top: none !important;\
	}\
	');

(function() {
	'use strict';

	var links = [];
	var timeout;
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
			console.log(mutation);
            if(mutation.attributeName === "href") {
				links.push({target: mutation.target, href: mutation.oldValue});
				clearTimeout(timeout);
				console.log('Attach links was run');
				timeout = setTimeout(attachLinks, 200);
			}
        });
    });

	if(document.querySelector('body.single')) observer.observe(document.querySelector('body'), { childList: true, subtree: true, attributes: true, attributeOldValue: true});

	function attachLinks() {
		observer.disconnect();
		links.forEach(function(link) {
			link.target.href = link.href;
		});

		var downloadBtn = document.querySelector('.download_feed_link');

		downloadBtn.appendChild(document.querySelector('.download-panel'));
		document.querySelector('.download_feed_link > span.tooltip-wrapper').remove();

	  // Clone to remove eventlistener preventing default action.
		var clone = document.querySelector('.download_feed_link').cloneNode(true);
		document.querySelector('.entry-content').insertBefore(clone, downloadBtn);
		downloadBtn.remove();

	  // Notify the success of the script
		document.querySelector('.download_feed_link > sup').textContent = 'Anti-adblock killer was successful';
	}
})();