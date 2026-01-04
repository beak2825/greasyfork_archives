// ==UserScript==
// @name         Clean fbclid from Facebook links
// @namespace    https://greasyfork.org/scripts/396523-facebook-delete-fbclid-link
// @version      0.3
// @icon         https://www.facebook.com/favicon.ico
// @description  Removes the fbclid(= Facebook Click ID) parameter and Facebook redirect - (l.facebook.com?u=...) from all links in Facebook when scrolling.
// @author       Djamana
// @match        https://*.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400294/Clean%20fbclid%20from%20Facebook%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/400294/Clean%20fbclid%20from%20Facebook%20links.meta.js
// ==/UserScript==
// TestLinks:
// https://l.facebook.com/l.php?u=https%3A%2F%2Fsoundcloud.com%2Fnogenrejustart%2Fjesusismahomeboy%3Ffbclid%3DIwAR1fQdnurYrqM0THq62duexqMAhR25Hba4TkDPta5H4904ojleQw6wEVS5Y&h=AT1tFEugTN4GSRIAxggUBDCl7xdIz8T2nkJTsZC7y0GFSFJxUhVg2DW1jP2zaLMVcArsyL3896p-hYqWwhPE2JLmYITcQ3MCwTU1ZvQO3zFZsdH96DVzOJyTsugiD6WH3kPU623cq4Wo&__tn__=H-R&c[0]=AT0ngXoGgxIg0qsCiDl_5KcUn1Uy9te3oBdkJFqr2I79tqGoxYBS2IJh9AQJKDpWiwkn95CjM1nxs39PI8iF3prgCsxCfoMbyh-GcgPTWQQChGu_IsxxXhWyxc1ZTysJGz5SI4atYlLYiCoHzmD5UaQlwD8nRQ04Rao

(
    function() {
    'use strict';

    if (location.host === "l.facebook.com" ) {
        // ... location is a Facebook redirect

        var url_clean = cleanUrl(location.href)

        location = url_clean

//        // Rip Redirect
//        var url = new URL( new URLSearchParams( location.search ).get("u") )

//        // Rip fbclid
//        url.searchParams.delete("fbclid")

//        location = url.href

    } else {
        // ... location is a other Facebook page
        execute()

     }

})();


function execute() {

    const fbclid_Selector = 'a[href*="fbclid"]'
    const ERROR           = "Houston, we have a problem: "

//	const fbclidLinkList = document.querySelectorAll( fbclid_Selector )
//	if (!fbclidLinkList || fbclidLinkList.length === 0) {

     // ... No fbclid links found on the page ?
     // ... so cleanLinks() every 5 seconds
	//	setTimeout(execute, 5000)

//    } else {
        debugger
        window.addEventListener("DOMSubtreeModified", cleanLinks )
 //       window.addEventListener("click",              cleanLinks )

        // There are fbclid links on the page.
        // Install run-deleteFbclidLink()-when-scrolling handler ...
 //       window.addEventListener("scroll",             cleanLinks )
//	}
    // ... and remove them now ( = run cleanLinks() )
//    cleanLinks()
}

function cleanLinks() {

    const fbclid_Selector = 'a[href*="fbclid"]'
    const ERROR           = "Houston, we have a problem: "


    const fbclidLinkList = document.querySelectorAll( fbclid_Selector)
	if (!fbclidLinkList || fbclidLinkList.length === 0) {
        return
    }

	for (const fbclidLink of fbclidLinkList) {


        // 'Output cleared link
        fbclidLink.href = cleanUrl( fbclidLink.href )


    }
}
function cleanUrl( url ) {
            const fbclidURL = new URL(url)

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
           var url_cleaned = fbclidURL.href

        }  catch (e) {
           console.log( "Remove fbclid - " + ERROR + e)
        }

        console.log (url + " -> " + url_cleaned)
    return url_cleaned
}