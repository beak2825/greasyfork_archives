// ==UserScript==
// @name        AO3: Reorder Fandoms by Size
// @namespace   adustyspectacle
// @description Sorts fandoms by no. of works on AO3's fandoms list.
// @version     1.2
// @history     1.2 - added exclude rule for the uncategorized fandoms page
// @history     1.1 - added another range because marvel broke 250k
// @history     1.0 - initial release
// @grant       none
// @include     *archiveofourown.org/media/*
// @exclude     *archiveofourown.org/media/Uncategorized*
// @downloadURL https://update.greasyfork.org/scripts/529959/AO3%3A%20Reorder%20Fandoms%20by%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/529959/AO3%3A%20Reorder%20Fandoms%20by%20Size.meta.js
// ==/UserScript==


function insertBefore(el, referenceNode) {
	referenceNode.parentNode.insertBefore(el, referenceNode);
}

function insertAfter(el, referenceNode) {
	referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function numShorten(i) {
	if (i >= 1000000000) return (i/1000000000).toLocaleString().replace(".", "_") + "b";
	else if (i >= 1000000) return (i/1000000).toLocaleString().replace(".", "_") + "m";
	else if (i >= 1000) return (i/1000).toLocaleString().replace(".", "_") + "k";
	else return i.toLocaleString();
}

function changeAlphabetNavId() {
	var alphabetNav = document.getElementById("alphabet");
	alphabetNav.setAttribute("id", "alphabet-nav");
}

function createReorderOptions() {
	var reorderOptionsForm = document.createElement("form");
	var reorderOptionsFieldset = document.createElement("fieldset");
	var reorderOptionsLegend = document.createElement("legend");
	
	insertAfter(reorderOptionsForm, document.querySelector("#main.fandoms-index p"));
	
	reorderOptionsForm.setAttribute("id", "reorder-options");
	reorderOptionsForm.setAttribute("class", "verbose");
	reorderOptionsLegend.innerHTML = "Sorting Options";
	
	reorderOptionsFieldset.appendChild(reorderOptionsLegend);
	reorderOptionsForm.appendChild(reorderOptionsFieldset);
}

var alphabetGroup = document.querySelectorAll("ol.fandom.index.group");
var numericalGroup = alphabetGroup[0].cloneNode(false);
numericalGroup.classList.add("sort-by-fandomsize")
insertAfter(numericalGroup, alphabetGroup[0]);

var fandomSizeRanges = [

    [1000000, 1250000],
    [750000, 1000000],
    [500000, 750000],
    [250000, 500000],
	[100000, 250000],
	[50000, 100000],
	[25000, 50000],
	[10000, 25000],
	[5000, 10000],
	[1000, 5000],
	[500, 1000],
	[100, 500],
	[50, 100],
	[25, 50],
	[10, 25],
	[5, 10],
	[2, 5],
	[1, 1]
]

if (alphabetGroup[0] != undefined && alphabetGroup[0].classList.contains("sort-by-alphabet") == false) {
		alphabetGroup[0].classList.add("sort-by-alphabet");
		var fandomList = document.querySelectorAll("ul.tags.index.group > li");
		var numericalList = [];

		function extractLinkcounts(e) {
				var t = fandomList[e].innerHTML;
				var n = t.indexOf("</a>") + 4;
				var r = fandomList[e].querySelector('a').getAttribute('href');
				var i = t.slice(t.indexOf(">") + 1, t.lastIndexOf("<"));
				var s = t.substr(n);
				var o = s.slice(s.indexOf("(") + 1, s.indexOf(")"));
				numericalList.push({
						href: r,
						text: i,
						count: +o
				})
		}
		for (var i = 0; i < fandomList.length; i++) {
				extractLinkcounts(i);
		}
		numericalList.sort(function(e, t) {
				return t.count - e.count
		});
		
		var alphabetElems = document.querySelectorAll("#alphabet, .sort-by-alphabet");
		for (var i = 0; i < alphabetElems.length; i++) {
				alphabetElems[i].setAttribute("style", "display: none");
		}
		
		var fandomNumericalGroup = [];
		
		for (var i = 0; i < fandomSizeRanges.length; i++) {
			var fandomNumerical = document.createElement("li");
			var numericalHeading = document.createElement("h3");
			var numericalToTop = document.querySelector("span.action.top").cloneNode(true);
			var numericalToTopLink = numericalToTop.querySelector("a");
			
			numericalToTop.setAttribute("style", "margin: 0 0.5em; vertical-align: 0.1em;");
			numericalToTopLink.setAttribute("href", "#numerical-nav");
			fandomNumerical.setAttribute("class", "letter listbox group");
			numericalHeading.setAttribute("class", "heading");
			fandomNumerical.setAttribute("id", "range-" + numShorten(fandomSizeRanges[i][0]) + "-" + numShorten(fandomSizeRanges[i][1]));
			
			if (fandomSizeRanges[i][0] == 1 && fandomSizeRanges[i][1] == 1) {
				numericalHeading.innerHTML = "1 Work";
			} else {
				numericalHeading.innerHTML =  fandomSizeRanges[i][0].toLocaleString() + " - " + fandomSizeRanges[i][1].toLocaleString() + " Works";
			}
			
			numericalHeading.appendChild(numericalToTop);
			fandomNumerical.appendChild(numericalHeading);
			
			var fandomIndex = document.createElement("ul");
			fandomIndex.setAttribute("class", "tags index group");
			fandomNumerical.appendChild(fandomIndex);
			
			fandomNumericalGroup.push(fandomNumerical);
		}
		
		for (var i = 0; i < fandomSizeRanges.length; i++) {
			numericalGroup.appendChild(fandomNumericalGroup[i]);
		}
		
		for (var i = 0; i < numericalList.length; i++) {
				var fandomItem = document.createElement("li");
				if (i % 2 == 0) {
						fandomItem.setAttribute("class", "odd")
				} else {
						fandomItem.setAttribute("class", "even")
				}
				var fandomAnchor = document.createElement("a");
				fandomAnchor.setAttribute("href", numericalList[i].href);
				fandomAnchor.setAttribute("class", "tag");
				fandomAnchor.innerHTML = numericalList[i].text;
				fandomItem.appendChild(fandomAnchor);
				if (numericalList[i].count > 0) {
						var fandomCount = document.createTextNode("  (" + numericalList[i].count + ")");
						fandomItem.appendChild(fandomCount);
				}
				
				var x = fandomSizeRanges.length - 1;
				while (!(numericalList[i].count >= fandomSizeRanges[x][0] && numericalList[i].count <= fandomSizeRanges[x][1])) {
					x--;
				}
				
				fandomNumericalGroup[x].querySelector('ul').appendChild(fandomItem);
		}
		
		var numericalNav = document.createElement("ul");
		numericalNav.setAttribute("id", "numerical-nav");
		numericalNav.setAttribute("class", "alphabet actions");
		numericalNav.setAttribute("role", "navigation");
		
		for (var i = 0; i < fandomSizeRanges.length; i++) {
			var numericalNavItem = document.querySelector("#alphabet li").cloneNode(true);
			var numericalNavItemLink = numericalNavItem.querySelector("a");
			
			numericalNavItem.setAttribute("style", "margin: 0 0.25em;");
			numericalNavItemLink.setAttribute("href", "#range-" + numShorten(fandomSizeRanges[i][0]) + "-" + numShorten(fandomSizeRanges[i][1]));
			
			if (fandomSizeRanges[i][0] == 1 && fandomSizeRanges[i][1] == 1) {
				numericalNavItemLink.innerHTML = "1";
			} else {
				numericalNavItemLink.innerHTML = numShorten(fandomSizeRanges[i][0]) + "-" + numShorten(fandomSizeRanges[i][1]);
			}
			
			numericalNavItem.appendChild(numericalNavItemLink);
			numericalNav.appendChild(numericalNavItem);
		}
		
		insertBefore(numericalNav, document.getElementById("alphabet"));
}