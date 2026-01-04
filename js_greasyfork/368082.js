// ==UserScript==
// @name Twitch FrankerFaceZ Emotes in VODs
// @namespace b4k
// @description Enables FrankerFaceZ emotes in VODs, requires FrankerFaceZ (obviously)
// @author Bakugo
// @version 1.0.0
// @match *://www.twitch.tv/*
// @run-at document-start
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/368082/Twitch%20FrankerFaceZ%20Emotes%20in%20VODs.user.js
// @updateURL https://update.greasyfork.org/scripts/368082/Twitch%20FrankerFaceZ%20Emotes%20in%20VODs.meta.js
// ==/UserScript==

(function () {
	var doMain;
	var doShouldRun;
	var doGetVodUser;
	var doProcessNode;
	var doProcessNodeCh;
	var doLoopUpdateRoom;
	var doLoopUpdateChat;
	var observer;
	var obsTarget;
	var emoteCache;
	
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
			
			emoteCache = new Map();
			
			window.setInterval(function () { doLoopUpdateRoom(); }, (1000*1));
			window.setInterval(function () { doLoopUpdateChat(); }, (1000*3));
		};
	
	doShouldRun =
		function () {
			return (
				unsafeWindow.ffz !== undefined &&
				window.location.pathname.match(/^\/videos\/(\d+?)/) !== null &&
				document.querySelector("[data-test-selector=\"video-player\"]") !== null
			);
		};
	
	doGetVodUser =
		function () {
			var tmp;
			
			tmp = document.querySelector(
				".video-player .player-streaminfo__name");
			
			if (tmp === null) {
				return null;
			}
			
			return tmp
				.textContent
				.toLowerCase();
		};
	
	doProcessNode =
		function (node) {
			var login;
			var ffzRoom;
			var emoteList;
			var eMessageCnt;
			
			if (!doShouldRun()) {
				return;
			}
			
			if (node.tagName !== "LI") {
				return;
			}
			
			login = doGetVodUser();
			
			if (login === null) {
				return;
			}
			
			ffzRoom = unsafeWindow.ffz.__modules.chat.rooms[login];
			
			if (
				ffzRoom === undefined ||
				ffzRoom._id === null ||
				emoteCache.has(login) === false
			) {
				(function () {
					var tmp;
					
					tmp = node;
					
					window.setTimeout(
						function () {
							doProcessNode(tmp);
						},
						
						(1000/3)
					);
				})();
				
				return;
			}
			
			eMessageCnt = node.querySelector(
				"[data-test-selector=\"comment-message-selector\"]");
			
			if (!eMessageCnt) {
				return;
			}
			
			emoteList = emoteCache.get(login);
			
			node.setAttribute("hidden", "");
			
			window.setTimeout(
				function () {
					node.removeAttribute("hidden");
					
					eMessageCnt.children[1]
						.childNodes
							.forEach(
								function (node) {
									doProcessNodeCh(
										node,
										emoteList
									);
								}
							);
				},
				
				(0)
			);
		};
	
	doProcessNodeCh =
		function (node, emoteList) {
			var nodeTmp;
			var nodeVal;
			
			if (!(
				node.nodeType === Node.TEXT_NODE ||
				node.nodeType === Node.ELEMENT_NODE
			)) {
				return;
			}
			
			if (node.nodeType === Node.ELEMENT_NODE) {
				if (
					node.tagName !== "SPAN" ||
					node.getAttribute("class") !== null
				) {
					return;
				}
				
				if (
					node.children.length > 0 ||
					node.childNodes.length > 1
				) {
					node.childNodes
						.forEach(
							function (node) {
								doProcessNodeCh(node, emoteList);
							}
						)
					
					return;
				}
			}
			
			if (node.nodeType === Node.TEXT_NODE) {
				nodeTmp = document.createElement("span");
				nodeTmp.textContent = node.textContent;
				node.after(nodeTmp);
				node.textContent = "";
				node = nodeTmp;
			}
			
			nodeVal = node.innerHTML;
			nodeVal = nodeVal.split(" ");
			
			emoteList
				.forEach(
					function (emote) {
						nodeVal.forEach(
							function (value, idx) {
								if (value === emote.name) {
									nodeVal[idx] = (
										"<img" +
										" alt=\"" + emote.name + "\"" +
										" title=\"FFZ: " + emote.name + "\"" +
										" src=\"" + emote.urls["1"] + "\"" +
										" srcset=\"" + emote.srcSet + "\"" +
										" class=\"chat-image chat-line__message--emote tw-inline-block\"" +
										" style=\"width: " + emote.width + "px; height: " + emote.height + "px;\"" +
										">"
									);
								}
							}
						);
					}
				);
			
			nodeVal = nodeVal.join(" ");
			
			if (node.innerHTML !== nodeVal) {
				node.innerHTML = nodeVal;
			}
		};
	
	doLoopUpdateRoom =
		function () {
			var login;
			var ffzRoom;
			var emoteSets;
			var emoteList;
			
			if (!doShouldRun()) {
				return;
			}
			
			login = doGetVodUser();
			
			if (login === null) {
				return;
			}
			
			ffzRoom = unsafeWindow.ffz.__modules.chat.getRoom(null, login);
			
			if (
				ffzRoom._id !== null &&
				emoteCache.has(login) === false &&
				unsafeWindow.ffz.__modules.chat.emotes.default_sets._cache.length > 0
			) {
				emoteSets = [];
				emoteSets = emoteSets.concat(unsafeWindow.ffz.__modules.chat.emotes.default_sets._cache);
				emoteSets = emoteSets.concat(unsafeWindow.ffz.__modules.chat.rooms[login].emote_sets._cache);
				
				emoteList = new Set();
				
				emoteSets.forEach(
					function (setId) {
						Object.values(unsafeWindow.ffz.__modules.chat.emotes.emote_sets[setId].emotes)
							.forEach(
								function (emote) {
									emoteList.add(emote);
								}
							);
					}
				);
				
				emoteCache.set(login, emoteList);
			}
		};
	
	doLoopUpdateChat =
		function () {
			var tmp;
			
			if (!doShouldRun()) {
				obsTarget = null;
				observer.disconnect();
				
				return;
			}
			
			tmp = document.querySelector(
				"[data-test-selector=\"video-chat-wrapper\"] ul");
			
			if (obsTarget === tmp) {
				return;
			}
			
			obsTarget = tmp;
			
			observer.disconnect();
			
			if (obsTarget !== null) {
				obsTarget.querySelectorAll("li")
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
