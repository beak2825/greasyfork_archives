// ==UserScript==
// @name			kongfree
// @description		useful junk for kongregate
// @match			www.kongregate.com/games/*
// @version 0.0.1.20140830171912
// @namespace https://greasyfork.org/users/4723
// @downloadURL https://update.greasyfork.org/scripts/4502/kongfree.user.js
// @updateURL https://update.greasyfork.org/scripts/4502/kongfree.meta.js
// ==/UserScript==
window.addEventListener("load", function(event) {
	swfobject.embedSWF=function(initial) {
		return function(url, element) {
			if(element==="gamediv") {
				var	a=document.createElement("a"),
					li=document.createElement("li");
				a.textContent=".swf";
				a.href=url;
				li.appendChild(a);
				document.getElementById("quicklinks").appendChild(li);
				CinematicMode.activateCinematicMode=function(initial) {
					return function() {
						initial.apply(this, arguments);
						document.gamediv.parentElement.scrollIntoView();
						}
					}(CinematicMode.activateCinematicMode);
				holodeck._event_dispatcher._callbacks.handle_item_checkout_request=[
					function() {
						dispatchToKonduit({
							type: "purchase_result",
							data: {
								success: true
								}
							});
						}
					];
				swfobject.embedSWF=initial;
				}
			initial.apply(initial, arguments);
			};
		}(swfobject.embedSWF);
	document.getElementById("maingame").scrollIntoView();
	});
window.addEventListener("mousewheel", function(event) {
	if(CinematicMode._cinematic_mode_active) {
		event.preventDefault();
		}
	});