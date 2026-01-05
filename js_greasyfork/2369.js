// ==UserScript==
// @name           Feedly Hide Read Items When Done
// @version        1.2
// @namespace      geekrunner
// @include        *cloud.feedly.com/*
// @include        *feedly.com/*
// @description    Hide the read items list when you have finished reading unread items.
// @downloadURL https://update.greasyfork.org/scripts/2369/Feedly%20Hide%20Read%20Items%20When%20Done.user.js
// @updateURL https://update.greasyfork.org/scripts/2369/Feedly%20Hide%20Read%20Items%20When%20Done.meta.js
// ==/UserScript==

// VERSION HISTORY
// 1.2 - A nicer way to handle hiding the list of articles, doesn't completely remove them from the DOM.
// 1.1.5.1 - Bugfix for last update.
// 1.1.5 - Updated element to check for due to Feedly's August 2017 update removing the magic string.
// 1.1.4 - Updated magic string from "No unread articles" to "No unread stories".
// 1.1.3 - Reference one fewer element from DOM in hopes of having less DOM-based bugs.
// 1.1.2 - Fix for Feedly's update to DOM.
// 1.1.1 - Fix issue where the page refreshes while you're still reading the last article.
// 1.1 - Fix for updated version of feedly.
// 1.0 - Initial Release.
(function() {
	console.debug("[FHRIWD] - running");
	
	var tweakXHR = function () {
		console.debug("[FHRIWD] Customizing XMLHttpRequest.");
		try {
			XMLHttpRequest.prototype.open_old = XMLHttpRequest.prototype.open;
			XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
				this.addEventListener("readystatechange", function() {
					try {
						var unreadCountSpan = document.querySelector("div.mark-as-read-button-group.button.secondary button span");
						if (unreadCountSpan === null || Number(unreadCountSpan.textContent.trim()) === 0) {
                            if (document.querySelector("div.inlineFrame.read.selected") !== null) { //Don't hide when still reading the last article.
                                console.info("[FHRIWD] Still reading last item, doing nothing.");
                            } else {
								console.info("[FHRIWD] All items read - hiding timeline.");
                                var divsToHide = document.querySelectorAll("div.list-entries");

                                for (var i=0; i<divsToHide.length; i++) {
                                	if (divsToHide[i].parentNode.style.display != "none") {
                                        divsToHide[i].parentNode.style.display = "none";
                                    }

									if (i===0 && document.getElementById("noUnreadItems") === null) {
                                        var noUnreadPara = document.createElement("p");
                                        noUnreadPara.id = "noUnreadItems";
                                        noUnreadPara.appendChild(document.createTextNode("No Unread Items"));
                                        divsToHide[i].parentNode.parentNode.appendChild(noUnreadPara);
									}
								}
                            }
						} else {
							var noUnreadPara2 = document.getElementById("noUnreadItems");
                            if (noUnreadPara2 !== null) {
                                noUnreadPara2.parentNode.removeChild(noUnreadPara2);
							}
						}
					} catch (e) {
						console.error("[FHRIWD] " + e.message);
					}
				}, false);
				this.open_old.call(this, method, url, async, user, pass);
			};
		} catch (e) {
			console.error("[FHRIWD] " + e.message);
		}
		console.debug("[FHRIWD] Finished customizing XMLHttpRequest.");
	};
	
	//Inject the script into the page.
	var script = document.createElement('script');
	script.setAttribute('type','application/javascript');
	script.textContent = '(' + tweakXHR + ')();';
	document.body.appendChild(script); //run the script
	document.body.removeChild(script); //cleanup
	
	console.debug("[FHRIWD] - complete");
}());