// ==UserScript==
// @name        fdesouche.com popup ad remover
// @namespace   http://userscripts.org/users/useridnumber
// @description This script remove ad and anti adblock popups on fdesouche.com
// @include     http://*.fdesouche.com/*
// @include     http://fdesouche.com/*
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14834/fdesouchecom%20popup%20ad%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/14834/fdesouchecom%20popup%20ad%20remover.meta.js
// ==/UserScript==

var removeads = function removeads () {
    var items = {};
    var selects = jQuery("body>div>div>a[target='_blank']");
    selects.each(function (_, e) {
        var pNode = e.parentNode
        while (pNode.parentNode.nodeName === "DIV" && pNode.parentNode.className !== "") {
		pNode = pNode.parentNode;
	}
	pNode.parentNode.removeChild(pNode);
    });
}

removeads();

// Create an observer instance
var observer = new MutationObserver(function( mutations ) {
	mutations.forEach(function( mutation ) {
	var newNodes = mutation.addedNodes; // DOM NodeList
	if( newNodes !== null ) { // If there are new nodes added
		removeads();
		var selects = jQuery("body>div>h1");
		if (selects.length !== 0) {
			var node = selects[0];
			if (node.innerHTML.indexOf("Adblock") !== -1) {
				node = node.parentNode;
				node.style.visibility="hidden";
				document.__fds_popupClassName = node.className + "-bg";
				console.info("CAP:" + document.__fds_popupClassName);
			}
		}
		var selects = jQuery("body>div." + document.__fds_popupClassName);
		if (selects.length !== 0) {
			selects[0].style.visibility="hidden";
		}
	}
	});    
});

// Configuration of the observer:
var config = { 
	attributes: true, 
	childList: true, 
	characterData: true 
};
 
// Pass in the target node, as well as the observer options
observer.observe(document.body, config);
