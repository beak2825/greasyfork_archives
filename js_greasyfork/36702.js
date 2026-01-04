// ==UserScript==
// @name         大众点评无法访问Workaround
// @namespace    https://github.com/MirrorCubeSquare
// @version      0.2a
// @description  A Current workaround for 403 pages in Dianping
// @author       MirrorCubeSquare
// @match        *://www.dianping.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36702/%E5%A4%A7%E4%BC%97%E7%82%B9%E8%AF%84%E6%97%A0%E6%B3%95%E8%AE%BF%E9%97%AEWorkaround.user.js
// @updateURL https://update.greasyfork.org/scripts/36702/%E5%A4%A7%E4%BC%97%E7%82%B9%E8%AF%84%E6%97%A0%E6%B3%95%E8%AE%BF%E9%97%AEWorkaround.meta.js
// ==/UserScript==

(function() {
	'use strict';
	navigator.__defineGetter__('userAgent', function() {
		return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36 Edge/87.0.664.41';
	});
	
})();