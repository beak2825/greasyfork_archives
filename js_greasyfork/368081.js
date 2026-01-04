// ==UserScript==
// @name Twitch Restore Original LUL
// @namespace b4k
// @description Brings back the original version of the LUL emote
// @author Bakugo
// @version 1.0.0
// @match *://www.twitch.tv/*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/368081/Twitch%20Restore%20Original%20LUL.user.js
// @updateURL https://update.greasyfork.org/scripts/368081/Twitch%20Restore%20Original%20LUL.meta.js
// ==/UserScript==

(function () {
	var doMain;
	var doProcessNode;
	var doLoopUpdateChat;
	var observer;
	var obsTarget;
	
	doMain =
		function () {
			observer =
				new MutationObserver(
					function (mutations) {
						mutations.forEach(
							function (mutation) {
								if (mutation.type === "childList") {
									mutation.addedNodes.forEach(
										function (node) {
											doProcessNode(node);
										}
									);
								}
							}
						);
					}
				);
			
			obsTarget = null;
			
			window.setInterval(
				function () {
					doLoopUpdateChat();
				},
				
				(1000*3)
			);
		};
	
	doProcessNode =
		function (node) {
			if (node.matches(".chat-line__message") === false) {
				return;
			}
			
			node.querySelectorAll(".chat-line__message--emote[alt=\"LUL\"]")
				.forEach(
					function (emote) {
						if (emote.src.indexOf("/425618/") !== -1) {
							emote.src = "//cdn.betterttv.net/emote/567b00c61ddbe1786688a633/1x";
							emote.srcset = "//cdn.betterttv.net/emote/567b00c61ddbe1786688a633/2x 2x";
						}
					}
				);
		};
	
	doLoopUpdateChat =
		function () {
			var tmp;
			
			tmp = document.querySelector(
				".chat-list__lines [role=\"log\"]");
			
			if (obsTarget === tmp) {
				return;
			}
			
			obsTarget = tmp;
			
			observer.disconnect();
			
			if (obsTarget !== null) {
				obsTarget.querySelectorAll(".chat-line__message")
					.forEach(
						function (node) {
							doProcessNode(node);
						}
					);
				
				observer.observe(
					obsTarget,
					
					{
						childList: true
					}
				);
			}
		};
	
	doMain();
})();
