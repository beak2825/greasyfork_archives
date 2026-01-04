// ==UserScript==
// @name         Google Search remove icons and undo breadcrumbs
// @version      0.0.4
// @description  fuck breadcrumbs and icons in Google search result.
// @author       Starduster
// @match        https://*.google.com/search?*
// @include     /^https?://(?:www|encrypted|ipv[46])\.google\.[^/]+/(?:$|[#?]|search|webhp)/
// @grant        none
// @namespace https://greasyfork.org/users/355044
// @downloadURL https://update.greasyfork.org/scripts/391162/Google%20Search%20remove%20icons%20and%20undo%20breadcrumbs.user.js
// @updateURL https://update.greasyfork.org/scripts/391162/Google%20Search%20remove%20icons%20and%20undo%20breadcrumbs.meta.js
// ==/UserScript==


var results = document.querySelectorAll(".r");

if (results) {
    var urllist=document.getElementsByClassName(results[0].querySelector(".r cite").className)
    var citeclassname=results[0].querySelector(".r cite").className
    var divclassname=urllist[0].parentElement.className
    var divclassname2=urllist[1].parentElement.className

    for (let i = 0; i < urllist.length; i++) {
        document.getElementsByClassName(citeclassname)[i].style.maxHeight = '1.5em';
        document.getElementsByClassName(citeclassname)[i].style.whiteSpace = 'nowrap';
        document.getElementsByClassName(citeclassname)[i].style.maxWidth = '500px';
        document.getElementsByClassName(citeclassname)[i].style.overflow = 'hidden';
        document.getElementsByClassName(citeclassname)[i].style.textOverflow = 'ellipsis';
        document.getElementsByClassName(citeclassname)[i].style.display = 'inline-block';
    }

}

if (results) {
	for (let i = 0; i < results.length; i++) {
		try {
			var link = results[i].querySelector(".r img").getAttribute("alt");
			var path = results[i].querySelector(".r cite").innerHTML.split("›")
            //urldiv.style.overflow = 'hidden'
            //urldiv.style.textOverflow = 'ellipsis'
            //urldiv.parentElement.style.whiteSpace = 'nowrap'
            //urldiv.parentElement.style.maxWidth = '500px'
            //urldiv.parentElement.style.overflow = 'hidden'
            //urldiv.parentElement.style.textOverflow = 'ellipsis'

			//path[0] = link.slice(0,-1) + " "
			//for (j=0; j < 2; j++) {
			//	results[i].querySelectorAll(".r cite")[j].innerHTML = path.join("›")
			//}
			results[i].querySelector(".r img").remove()
			results[i].querySelector(".r img").remove()
		}

		catch(e){
			console.log("Google Search restore URLs - ERROR @: " + i + ": " + e.message);
			continue;
		}
	}
}
