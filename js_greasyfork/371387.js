// ==UserScript==
// @name 		MAM - Advanced Book Listings
// @author 		WIRLYWIRLY
// @namespace 		https://github.com/WirlyWirlyPool
// @version 		0.8

// @match 		https://www.myanonamouse.net/tor/browse.ph*
// @match 		https://www.myanonamouse.net/index.php
// @match 		https://www.myanonamouse.net/

// @icon 		https://www.myanonamouse.net/favicon.ico
// @homepage 		https://gist.github.com/WirlyWirlyPool/d018ef17c54aa3c37dbdfeba35566d1d
// @description 		This script will display book covers and summaries in various areas across the site.
// @grant 		none
// @run-at 		document-end
// @downloadURL https://update.greasyfork.org/scripts/371387/MAM%20-%20Advanced%20Book%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/371387/MAM%20-%20Advanced%20Book%20Listings.meta.js
// ==/UserScript==

function bookposters(torrentpage) {
	var torrentrow = torrentpage.getElementsByTagName("tr")
	for (var i = 0, l = torrentrow.length; i < torrentrow.length; i++) {
		if (torrentrow[i].id.length === 0) {
        	continue
        }
        const titlecolumn = torrentrow[i].getElementsByTagName("td")[2]
        const bklink = torrentrow[i].getElementsByClassName("title")[0].getAttribute('href')
        const bkcolumn = torrentrow[i].getElementsByTagName("td")[1]
        // Clean Icons
        try{
        	span = bkcolumn.getElementsByTagName("span")[0]
        	span.parentElement.removeChild(span)
        } catch(e) {
        	nope = "nope"
        }
        try{
        	breaks = bkcolumn.getElementsByTagName("br")[0]
        	breaks.parentElement.removeChild(breaks)
        } catch(e) {
        	nope = "nope"
        }
        if (bkcolumn.getElementsByTagName("img").length != 0) {
        	var br = document.createElement("br")
		    bkcolumn.appendChild(br)
        }
		$.get("https://www.myanonamouse.net" + bklink, function(dlpage){
		    var dl_page = dlpage
		    // Cover Image
		    try {
		    	var img_link = dl_page.match("id=\"torDetPoster\".*src=\"(http.+?[?=\"])")[1]
			    var a = document.createElement("a")
			    a.href = "https://www.myanonamouse.net" + bklink
			    var img = document.createElement("img")
			    img.className = "normal"
			    img.src = img_link
			    img.setAttribute("style","max-width: 100px; max-height: 150px")
			//    img.setAttribute("onmouseover", "this.className = \"torDetPosterBig torDetHover\"; style=\"max-width: 500px; max-height: 500px; left: 1px; right: 0px; border: 2px solid #000\"")
			 //   img.setAttribute("onmouseout", "this.className = \"normal\"; style=\"max-width: 100px; max-height: 150px\"")
			    a.appendChild(img)
			    bkcolumn.appendChild(a)
		    } catch(e) {
			    var a = document.createElement("a")
			    a.href = "https://www.myanonamouse.net" + bklink
			    var img = document.createElement("img")
			    img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFwmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0wNS0xOFQyMDozNDozMy0wNzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMDUtMThUMjA6NDc6NTAtMDc6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMDUtMThUMjA6NDc6NTAtMDc6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjJmYTVjNDhjLTQ5ZjEtNDk0MS1iZDEwLWM0NjZiZjkwMjVlMCIgeG1wTU06RG9jdW1lbnRJRD0iYWRv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"
			    img.setAttribute("style","max-width: 100px; max-height: 100px")
                a.appendChild(img)
			    bkcolumn.appendChild(a)
		    }
		    // Summary
		//    try {
		//	    var book_desc = dl_page.substring(dl_page.lastIndexOf("\<div id\=\"torDesc\"")+45,dl_page.lastIndexOf("\<div id\=\"torDetCom\"")-12)
		//	    var book_summary = book_desc.replace(/<br\s*\/?>/mg,"\n").replace(/(<\/?[^>]+>)/gi, '')
		//	    var summary = document.createElement("textarea")
		//	    summary.className = "book_summary"
		//	    summary.setAttribute("readonly","")
		//	    if (document.URL == "https://www.myanonamouse.net/" || document.URL == "https://www.myanonamouse.net/index.php") {
		//	    	var summarysize = "width: 379px; height: 50px"
		//	    } else {
		//	    	var summarysize = "max-width: 900px; width: -moz-available; height: inherit"
		//	    }
		//	    summary.setAttribute("style", "border-top: 2px solid #333; border-left: 1px solid #3330; border-right: 1px solid #3330; border-bottom: 3px solid #3330; background: bottom;" + summarysize)
		//	    summary.innerHTML = book_summary
		//	    var br = document.createElement("br")
		//	    var br2 = document.createElement("br")
		//	    titlecolumn.appendChild(br)
		//	    titlecolumn.appendChild(br2)
		//	    titlecolumn.appendChild(summary)
		//	} catch(e) {
		//		var summary = document.createElement("textarea")
		//	    summary.className = "book_summary"
		//	    summary.setAttribute("readonly","")
		//	    if (document.URL == "https://www.myanonamouse.net/" || document.URL == "https://www.myanonamouse.net/index.php") {
		//	    	var summarysize = "width: 379px; height: 50px"
		//	    } else {
		//	    	var summarysize = "max-width: 900px; width: -moz-available; height: inherit"
		//	    }
		//	    summary.setAttribute("style", "border-top: 2px solid #333; border-left: 1px solid #3330; border-right: 1px solid #3330; border-bottom: 3px solid #3330; background: bottom;" + summarysize)
		//	    summary.innerHTML = "No Description Found"
		//	    var br = document.createElement("br")
		//	    var br2 = document.createElement("br")
		//	    titlecolumn.appendChild(br)
		//	    titlecolumn.appendChild(br2)
		//	    titlecolumn.appendChild(summary)
		//	}
		}
		)
	}
}

if (document.URL == "https://www.myanonamouse.net/" || document.URL == "https://www.myanonamouse.net/index.php") {
	bookposters(document.getElementsByTagName("tbody")[1])
}
else{
// Load More
var target = document.getElementById("searchResults");
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        var addedList = mutation.addedNodes;
        var i = 0
        if (i < addedList.length) {
            try {
            bookposters(document.getElementsByTagName("tbody")[1])
        } catch(e) {
        	nope = "nope"
        }
        }
    });
});
var config = { childList: true };
observer.observe(target, config);
}