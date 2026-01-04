// ==UserScript==
// @name         Google Search restore URLs (undo breadcrumbs)
// @namespace    https://greasyfork.org/en/users/27283-mutationobserver
// @version      2019.11.14v1
// @description  Brings back the full URLs in results.
// @author       MutationObserver
// @match        https://*.google.com/search?*
// @include     /^https?://(?:www|encrypted|ipv[46])\.google\.[^/]+/(?:$|[#?]|search|webhp)/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392445/Google%20Search%20restore%20URLs%20%28undo%20breadcrumbs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/392445/Google%20Search%20restore%20URLs%20%28undo%20breadcrumbs%29.meta.js
// ==/UserScript==

var results = document.querySelectorAll(".r");

if (results) {
	var linkFontSize;
	var originalWidths = [];
	for (i=0; i < results.length; i++) {
		try {
			var oldWidth = results[i].offsetWidth;
			originalWidths.push(oldWidth);

            /* MY EDIT: */
			var link = results[i].querySelector(".r > a:last-child").getAttribute("href");
            console.log(link);
			var linkElems = results[i].querySelectorAll("cite");

            for(j = 0; j < linkElems.length; j++)
                linkElems[j].innerHTML = link;

            results[i].firstElementChild.style.width = "1000px";

            for(j = 0; j < linkElems.length; j++){
                if (!linkFontSize) linkFontSize = window.getComputedStyle(linkElems[j], null).getPropertyValue('font-size');
                linkElems[j].setAttribute("data-full-link", link);
            }

            /* END EDIT */
		}
		catch(e){
			console.log("Google Search restore URLs - ERROR @: " + i + ": " + e.message);
			continue;
		}
	}
	
	setTimeout(function () {
		for (i=0; i < results.length; i++) {
			var linkElems = results[i].querySelectorAll("cite");

            for(j = 0; j < linkElems.length; j++){
                var currentWidth = linkElems[j].offsetWidth;
                if (currentWidth > originalWidths[i]) {
                    linkElems[j].innerHTML = linkTruncate(linkElems[j].innerHTML);
                    linkElems[j].classList.add("userscript-truncated");
                    results[i].classList.add("userscript-truncated");
                }
            }
		}
	}, 100);
	
	document.querySelector("body").insertAdjacentHTML("afterbegin", `
		<style id="breadcrumb-removal-userscript">
			.r cite {
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.r.userscript-truncated:hover > a ~ span {
				position: absolute;
				right: 0;
				top: 5px;
			}
			
			cite.userscript-truncated:hover {
				font-size: 0;
			}
			cite.userscript-truncated:hover:before {
				content: attr(data-full-link);
				position: relative;
				left: 0;
				z-index: 50;
				font-size: ` + linkFontSize + `;
				background: white;
			}
		</style>
	`);
}

function linkTruncate(str) {
  if (str.length > 80) {
    return str.substr(0, 37) + '...' + str.substr(str.length-40, str.length);
  }
  return str;
}