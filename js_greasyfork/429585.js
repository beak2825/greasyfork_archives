// ==UserScript==
	// @name          	Gulf News Article Unblocker
	// @description     Read Any Gulf News Article for Free
	// @author			ahmad199
	// @namespace       https://greasyfork.org/en/users/728226-ahmad199
	// @license         MIT
	// @match			https://*.gulfnews.com/*/*/*
	// @match			https://*.gulfnews.com/*/*
	// @version         3
	// @run-at			document-start
// @downloadURL https://update.greasyfork.org/scripts/429585/Gulf%20News%20Article%20Unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/429585/Gulf%20News%20Article%20Unblocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let int=setInterval(() => {
        let exists = document.querySelector(".tp-modal")
        if (exists) {
            document.body.setAttribute("style", "overflow:scroll!important")
            exists.remove();
            document.querySelector(".tp-backdrop.tp-active").remove()
            clearInterval(int)
        }
    }, 2000)
})();