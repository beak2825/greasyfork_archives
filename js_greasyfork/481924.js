/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

// ==UserScript==
// @name               Hikarinoakari direct links
// @namespace          PY-DNG userscripts
// @version            0.1.1
// @description        bypass hikarinoakari.com/out?... , go to ouo.io/... directly
// @author             PY-DNG
// @license            Do What The F*ck You Want To Public License
// @match              *://*.hikarinoakari.com/*
// @match              *://hikarinoakari.com/*
// @require            https://update.greasyfork.org/scripts/456034/1282804/Basic%20Functions%20%28For%20userscripts%29.js
// @icon               data:image/png;base64,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
// @grant              none
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/481924/Hikarinoakari%20direct%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/481924/Hikarinoakari%20direct%20links.meta.js
// ==/UserScript==

/* global LogLevel DoLog Err $ $All $CrE $AEL $$CrE addStyle detectDom destroyEvent copyProp copyProps parseArgs escJsStr replaceText getUrlArgv dl_browser dl_GM AsyncManager */

(function __MAIN__() {
    'use strict';
	const jumper = /https?:\/\/(www\.)?hikarinoakari\.com\/out\/?[a-zA-Z0-9\\\/\+=]+/;
	const toURL = link => atob(link.match(/out\/\?(.+)\/?/)[1]).replace('&amp;', '&').replace('%C3%83%C2%AD', 'í').replace('&amp;', '&');

	// Jump current page
	jumper.test(location.href) &&
		(location.href = toURL(document.location.href));

	// Modify links in page
	detectDom({
		selector: 'a[href*="hikarinoakari.com/out/"]',
		callback: a => jumper.test(a.href) && (a.href = toURL(a.href)),
		once: false
	});
})();