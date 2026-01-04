// ==UserScript==
// @name         Facebook delete Fbclid Link when scrolling (johanb)
// @version      0.1
// @description  Automatically detect and remove fuck Fbclid links when scrolling
// @author       johanb
// @match        https://*.facebook.com/*
// @grant        none
// @namespace https://greasyfork.org/users/126569
// @downloadURL https://update.greasyfork.org/scripts/406804/Facebook%20delete%20Fbclid%20Link%20when%20scrolling%20%28johanb%29.user.js
// @updateURL https://update.greasyfork.org/scripts/406804/Facebook%20delete%20Fbclid%20Link%20when%20scrolling%20%28johanb%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

	excute()
})();


function excute() {
	const fbclidLinkList = document.querySelectorAll('a[href*="fbclid"]')
	if (!fbclidLinkList || fbclidLinkList.length === 0) {
		setTimeout(excute, 500)
		return
	}
	window.addEventListener("scroll", deleteFbclidLink)
	deleteFbclidLink()
}

function deleteFbclidLink() {
    const fbclidLinkList = document.querySelectorAll('a[href*="fbclid"]')
	if (!fbclidLinkList || fbclidLinkList.length === 0) {
        return
    }
	for (const fbclidLink of fbclidLinkList) {
        const fbclidURL = new URL(fbclidLink.href)
        if (fbclidURL.host === "l.facebook.com" && fbclidURL.searchParams.get("u")) {
            fbclidLink.href = decodeURI(fbclidURL.searchParams.get("u"))
        } else {
            fbclidURL.searchParams.delete("fbclid")
            fbclidLink.href = fbclidURL.href
        }
    }
}