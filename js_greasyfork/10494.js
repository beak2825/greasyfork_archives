// ==UserScript==
// @name         Fix Clarity Console Execution Archive
// @namespace    http://iamdav.in
// @version      1.0
// @description  This will fix the Clarity Console execution archive expanders for web standard compliant browsers.
// @author       Davin Studer
// @match        https://*/ManagementConsole/source/CRStatusBoardArchive.aspx
// @grant        none
// @require      https://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/10494/Fix%20Clarity%20Console%20Execution%20Archive.user.js
// @updateURL https://update.greasyfork.org/scripts/10494/Fix%20Clarity%20Console%20Execution%20Archive.meta.js
// ==/UserScript==

function fixClarityConsole() {
	$('#dgExecutions tr').each(function() {
		if ($(this).attr('id') !== '') {
			$(this).attr('name', $(this).attr('id'));
		}
	});
}

function myHandlePlus(doc, identifier) {
	var elements = doc.getElementsByName(identifier);
	var lenLimit = identifier.length + 7;
	var sublen = identifier.length + 1;
	var plusImages = new Array();
	var minusImages = new Array();
	for (i = 0; i < elements.length; i++) {
		if (elements[i].style.display == 'table-row') {
			elements[i].style.display = "none";
			SetToPlus(elements[i], identifier);
			var detailElement = elements[i].nextSibling;
			while (detailElement != null && detailElement.id.length >= sublen) {
				if (detailElement.id.substring(0, sublen) == identifier + "#") {
					detailElement.style.display = "none";
					SetToPlus(detailElement, identifier);
				} else if (detailElement.id.substring(0, lenLimit) == "details" + identifier) {
					detailElement.style.display = "none";
					var surfix = detailElement.id.substring(7, detailElement.id.length);
					plusImages.push("detailsImage" + surfix);
				} else if (detailElement.id.substring(0, sublen) == "_" + identifier) {
					detailElement.style.display = "none";
					var surfix = detailElement.id.substring(1, detailElement.id.length);
					minusImages.push("plus_" + surfix);
					var subDetailElement = detailElement.nextSibling;
					while (subDetailElement != null && subDetailElement.id.substring(0, lenLimit + 1) == "details_" + identifier) {
						subDetailElement.style.display = "none";
						var subSurfix = subDetailElement.id.substring(8, subDetailElement.id.length);
						plusImages.push("detailsImage_" + subSurfix);
						subDetailElement = subDetailElement.nextSibling;
					}
				}
				detailElement = detailElement.nextSibling;
			}
		} else {
			elements[i].style.display = "table-row";
			var detailElement = elements[i].nextSibling;
			while (detailElement != null && detailElement.id.substring(0, sublen) == "_" + identifier) {
				detailElement.style.display = "inline";
				var surfix = detailElement.id.substring(1, detailElement.id.length);
				minusImages.push("plus_" + surfix);
				detailElement = detailElement.nextSibling;
				while (detailElement != null && detailElement.id.substring(0, lenLimit + 1) == "details_" + identifier) {
					detailElement = detailElement.nextSibling;
				}
			}
		}
	}
	elements = doc.getElementsByName("plus" + identifier);
	for (i = 0; i < elements.length; i++) {
		if (elements[i].src.search("/images/plus.gif") != -1) {
			elements[i].src = "../images/minus.gif";
		} else {
			elements[i].src = "../images/plus.gif";
		}
	}
	for (i = 0; i < plusImages.length; i++) {
		elements = doc.getElementsByName(plusImages[i]);
		for (j = 0; j < elements.length; j++) {
			elements[j].src = "../images/plus.gif";
		}
	}
	for (i = 0; i < minusImages.length; i++) {
		elements = doc.getElementsByName(minusImages[i]);
		for (j = 0; j < elements.length; j++) {
			elements[j].src = "../images/minus.gif";
		}
	}
}

HandlePlus = myHandlePlus;

fixClarityConsole();