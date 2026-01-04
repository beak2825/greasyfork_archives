// ==UserScript==
// @namespace   raina
// @name        OmaPosti keepalive
// @version     1.1.20200908
// @description Attempts to keep your OmaPosti session alive by auto-clicking on the expiry notification.
// @author      raina
// @match       https://oma.posti.fi/*
// @grant       none
// @runat       document-end
// @downloadURL https://update.greasyfork.org/scripts/410755/OmaPosti%20keepalive.user.js
// @updateURL https://update.greasyfork.org/scripts/410755/OmaPosti%20keepalive.meta.js
// ==/UserScript==
setTimeout(() => {

	const el = document.getElementById("modal");
	let timeout;

	const cb = function(mutations, observer) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			if (document.getElementById("sessionAboutToExpire_modal")) {
				console.log("OmaPosti keepalive is keeping your session from expiring.");
				document.getElementById("sessionAboutToExpire_modal").querySelector('button[mode="primary"]').click();

				setTimeout(() => location.reload(), 10000);
			}
	  }, 5000); 
  }

  if (el) {
		const mo = new MutationObserver(cb);
		mo.observe(el, {childList:true});
		console.log("OmaPosti keepalive is active.");
	}

}, 5000);
