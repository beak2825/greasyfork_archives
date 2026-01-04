// ==UserScript==
// @name         Clean fbclid from Facebook links (johanb)
// @namespace    https://greasyfork.org/scripts/396523-facebook-delete-fbclid-link
// @version      0.2
// @description  Removes the fbclid(= Facebook Click ID) parameter and Facebook redirect - (l.facebook.com?u=...) from all links in Facebook when scrolling.
// @author       JohanB
// @match        https://*.facebook.com/*
// @match        https://*.fbcdn.net/*
// @match        https://*.facebook.net/*
// @match        https://*.fb.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406467/Clean%20fbclid%20from%20Facebook%20links%20%28johanb%29.user.js
// @updateURL https://update.greasyfork.org/scripts/406467/Clean%20fbclid%20from%20Facebook%20links%20%28johanb%29.meta.js
// ==/UserScript==


(
    function() {
    'use strict';

	excute()
})();



function excute() {

    const fbclid_Selector = 'a[href*="fbclid"]'
    const ERROR           = "Houston, we have a problem: "

	const fbclidLinkList = document.querySelectorAll( fbclid_Selector )
	if (!fbclidLinkList || fbclidLinkList.length === 0) {
        debugger

     // ... No fbclid links found on the page ?
     // ... so run-deleteFbclidLink() every 5 seconds
		setTimeout(excute, 5000)

    } else {

        // There are fbclid links on the page.
        // Install run-deleteFbclidLink()-when-scrolling handler ...
        window.addEventListener("scroll", deleteFbclidLink)

        // ... and remove them now ( = run deleteFbclidLink() )
        deleteFbclidLink()
	}
}

function deleteFbclidLink() {

    const fbclid_Selector = 'a[href*="fbclid"]'
    const ERROR           = "Houston, we have a problem: "


    const fbclidLinkList = document.querySelectorAll( fbclid_Selector)
	if (!fbclidLinkList || fbclidLinkList.length === 0) {
        debugger
        return
    }

	for (const fbclidLink of fbclidLinkList) {
        const fbclidURL = new URL(fbclidLink.href)

        // Remove Facebook redirect - l.facebook.com?u=
        try {
            if ( fbclidURL.host === "l.facebook.com" ) {
                fbclidURL.href = decodeURI( fbclidURL.searchParams.get("u") )
            }

        }  catch (e) {
           console.log( "Remove redirect - " +  ERROR + e)
        }

        // Remove '...&fbclid=...' parameter
        try {

           fbclidURL.searchParams.delete("fbclid")

        }  catch (e) {
           console.log( "Remove fbclid - " + ERROR + e)
        }
        debugger
        console.log (fbclidLink.href + " -> " + fbclidURL.href)

        // 'Output cleared link
        fbclidLink.href = fbclidURL.href


    }
}