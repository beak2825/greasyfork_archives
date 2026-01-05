// ==UserScript==
// @name        Guardian Anti-Jock
// @namespace   http://xyxyx.org/
// @include     http://www.theguardian.com/*
// @version     0.5
// @description Remove sports stories from the Guardian frontpage, as well as links to the sports sections.  This requires that you use what is currently (Jun 2014) the "beta" version of the Guardian, although this will presumably one day become the main version.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2521/Guardian%20Anti-Jock.user.js
// @updateURL https://update.greasyfork.org/scripts/2521/Guardian%20Anti-Jock.meta.js
// ==/UserScript==

function getSection(sectionName) {
	var sections = document.getElementsByTagName("section");
	for (var i = 0; i < sections.length; i++) {
		if (sections.item(i).attributes.getNamedItem("data-component").value === sectionName) {
			return sections.item(i);
		}
	}
}

function getNavItem(name) {
	var navItems = document.getElementsByClassName("nav__item");
	for (var i = 0; i < navItems.length; i++) {
		var navItem = navItems.item(i);
		var link = navItem.children.item(0);
		if( link.attributes.getNamedItem('data-link-name').value === name) {
			navItem.parentNode.removeChild(navItem);
		}
	}
}

function removeFrontPageStory(pattern) {
    
    var frontPageItems = document.getElementsByClassName("item__container");
    for (var i = 0; i < frontPageItems.length; i++) {
        var frontPageItem = frontPageItems.item(i);
        var link = frontPageItem.children.item(0).href;
        if (link.match(pattern)) {
            console.log("Matches " + pattern + ":" + link)
            var container = frontPageItem.parentNode.parentNode;
            console.log("Container = " + container);    
            container.parentNode.removeChild(container);
        }
        
    }
    
    // TODO
    frontPageItems = document.getElementsByClassName("fromage__container");
    for (var i = 0; i < frontPageItems.length; i++) {
        var frontPageItem = frontPageItems.item(i);
        var link = frontPageItem.children.item(0).href;
        if (link.match(pattern)) {
            console.log("Matches " + pattern + ":" + link)
            var container = frontPageItem.parentNode.parentNode;
            console.log("Container = " + container);    
            container.parentNode.removeChild(container);
        }
        
    }
	
	frontPageItems = document.getElementsByClassName("headline-list__link");
	for (var i = 0; i < frontPageItems.length; i++) {
		var frontPageItem = frontPageItems.item(i);
		var link = frontPageItem.href;
		if (link.match(pattern)) {
            console.log("Popular item matches: " + pattern + ":" + link)
            var li = frontPageItem.parentNode;
			var container = li.parentNode;
            console.log("Container = " + container);    
            var result = container.removeChild(li);
			console.log("Removed: " + result);
        }
	}
}

function removeContainingObject(thing) {
	var container = thing.parentNode;
	var parent = container.parentNode;
	
	console.log("Removing link: " + thing);
	parent.removeChild(container);
}

function removeLinks() {
	console.log ("Removing links to jock stuff");
	
	var links = document.getElementsByTagName("a");
	var unhandled = {};
	for (var i = 0; i < links.length; i++) {
		var link = links.item(i);
		
		if (link.href.match(/\/football\//) || link.href.match(/\/sport\//)) {
			// console.log("Found matching link: " + link.href);
			var linkClass = link.getAttribute("class");
			// console.log("Class = " + linkClass);
			if (linkClass) {
				if (linkClass === "headline-list__link") {
					removeContainingObject(link);
				} else if (linkClass.match(/^item__link/)) {
					removeContainingObject(link);
				} else if (linkClass.match(/^linkslist__action/)) {
					removeContainingObject(link);
				} else if (linkClass.match(/^right-most-popular-item/)) {
					removeContainingObject(link);
                } else if (linkClass.match(/^fromage__link/)) {
					removeContainingObject(link);
				} else {
					if (linkClass in unhandled) {
						unhandled[linkClass].push(link.href);
					} else {
						unhandled[linkClass] = [link.href];
					}
				}
			}
		}
	}
	
	for(var propertyName in unhandled) {
		console.log("Unhandled class: " + propertyName + ": " + unhandled[propertyName].join("\n"));
	}
}

try {
	var section;

	section = getSection('sport');
	if (section) {
		section.style.visibility = 'hidden';
	}

	section = getSection('world-cup');
	if (section) {
		section.style.visibility = 'hidden';
	}

	var navItem = getNavItem("/sport");
	if (navItem) {
		navItem.style.visibility = 'hidden';
	}
	
	var navItem = getNavItem("/football");
	if (navItem) {
		navItem.style.visibility = 'hidden';
	}
	
	var navItem = getNavItem("/fashion");
	if (navItem) {
		navItem.style.visibility = 'hidden';
	}
	
    // removeFrontPageStory(/\/football\//);
    // removeFrontPageStory(/\/sport\//);
    
	removeLinks();
	setTimeout(removeLinks, 100);
	setTimeout(removeLinks, 1000);
	setTimeout(removeLinks, 5000);
	setTimeout(removeLinks, 10000);	
} catch (e) {
	console.log(e);
}