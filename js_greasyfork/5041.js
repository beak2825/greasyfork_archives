// ==UserScript==
// @name           Reddit hover override on touch devices
// @description    Some subreddit specific CSS features rely on hovering your mouse over an object (like spoiler tags or comment faces). This can be quite problematic on touch devices like tablets or phones. This userscript overrides this and you can simply click an object and it should show a message that's hiding under the mouse-pver.
// @namespace      https://greasyfork.org/users/98-jonnyrobbie
// @author         JonnyRobbie
// @include        http://*.reddit.com/*
// @version        1.0.2
// @downloadURL https://update.greasyfork.org/scripts/5041/Reddit%20hover%20override%20on%20touch%20devices.user.js
// @updateURL https://update.greasyfork.org/scripts/5041/Reddit%20hover%20override%20on%20touch%20devices.meta.js
// ==/UserScript==


function main() {
	console.log("reddit click alert");
	var links = document.getElementsByTagName("a");
	for (var i=0; i<links.length; i++) {
		if (links[i].title && links[i].href!="http://www.reddit.com/message/inbox/" && links[i].href!="http://www.reddit.com/message/unread/") {
			//links[i].title = "test";
			if (links[i].innerHTML == "") {
				links[i].addEventListener('click', function(){if (confirm(this.title + "\nContinue to the link?")){window.location.href=this.href;};}, false);
				links[i].onclick = function(){return false;};
			}
			if (links[i].innerHTML != "") {
				//links[i].addEventListener('click', function(){alert(this.innerHTML + ": " + this.title);}, false);
				links[i].addEventListener('click', function(){if (confirm(this.innerHTML + ": " + this.title + "\nContinue to the link?")){window.location.href=this.href;};}, false);
				links[i].onclick = function(){return false;};
			}
		}
		else if (links[i].href == "http://www.reddit.com/spoiler" || links[i].href == "http://www.reddit.com/s") {
			links[i].addEventListener('click', function(){if (confirm("Spoiler: " + this.innerHTML + "\nContinue to the link?")){window.location.href=this.href;};}, false);
			links[i].onclick = function(){return false;};
		}
	}
}
main();