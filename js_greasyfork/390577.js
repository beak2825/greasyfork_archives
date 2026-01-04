// ==UserScript==
// @name           [kp] fix
// @description    Remove annoying ads and other crap from KupujemProdajem.com (kupujem prodajem, kupujemprodajem, kp)
// @author         Nemanja Cosovic
// @match          *://*.kupujemprodajem.com/*
// @namespace      https://greasyfork.org/users/380247
// @version        1.3
// @downloadURL https://update.greasyfork.org/scripts/390577/%5Bkp%5D%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/390577/%5Bkp%5D%20fix.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
	var maxRetry = 10;
	var kpSpamSelect = [
		"#bodyTag > div[style*='bottom: 0']",
		".bnrBox31",
        ".fc-consent-root"
	]
    var bodyTag = window.document.querySelector('#bodyTag');

    function removeSpam() {
    	for (var i = kpSpamSelect.length - 1; i >= 0; i--) {
			var kpSpamLock = document.querySelector(kpSpamSelect[i]);

			if (kpSpamLock) {
				kpSpamLock.parentNode.removeChild(kpSpamLock);
			}

            if (bodyTag.getAttribute("style") === "overflow: hidden;") {
                bodyTag.setAttribute("style", "overflow: initial;");
            }
		}
	}

	setTimeout( function() {
		for (maxRetry; maxRetry > 0; maxRetry--) {
			removeSpam();
		}
	}, 100);
}, false);