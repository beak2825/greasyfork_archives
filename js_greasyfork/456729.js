// ==UserScript==
// @name        reddit - continue this thread inline
// @namespace   greasyfork.xops.in.net
// @match       https://www.reddit.com/r/*
// @grant       none
// @version     1.1
// @author      greasyfork.org@xops.in.net
// @description displays "continue this thread" links inline using async request
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/456729/reddit%20-%20continue%20this%20thread%20inline.user.js
// @updateURL https://update.greasyfork.org/scripts/456729/reddit%20-%20continue%20this%20thread%20inline.meta.js
// ==/UserScript==

document.addEventListener("click", e => {
	var deepthreadA = e.target.closest(".deepthread>a");
	if (deepthreadA) {
		e.stopPropagation();
		e.preventDefault();
    var deepthread = deepthreadA.parentNode;
		fetch(deepthreadA.href, {method: "get"}).then(resp => resp.text()).then(txt => {
	        var parser = new DOMParser();
	        var doc = parser.parseFromString(txt, "text/html");
	        var thing = doc.querySelector(".sitetable.nestedlisting .sitetable.listing");
	        if (thing) {
	        	var oldThing = deepthread.closest(".sitetable.listing");
	        	if (oldThing) oldThing.replaceWith(thing);
	        }
		}).catch(err => deepthread.innerHTML = "loading failed");
		deepthread.innerHTML = "loading...";
	}
}, true);