// ==UserScript==
// @name         Custom Tinychat YouTube player
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Resizable/Draggable YouTube player to enhance TinyChat rooms. The active video will be changed when the room owner's account writes "Youtube: videoId" or ".youtube https://www.youtube.com/watch?v=" in the main chat. Eg: "Youtube: dMH0bHeiRNg" or ".youtube https://www.youtube.com/watch?v=dMH0bHeiRNg"
// @author       https://github.com/jonathdb93
// @match        https://tinychat.com/*
// @icon         https://www.google.com/s2/favicons?domain=tinychat.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430575/Custom%20Tinychat%20YouTube%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/430575/Custom%20Tinychat%20YouTube%20player.meta.js
// ==/UserScript==

(function () {
	'use strict';

	var player;
	var resizing = false;
	var moving = false;
	var playerHeight = "240px";
	var ownerHandle = undefined;
	var roomName = undefined;
	const youtubeElementId = 'youtubeelement';

	var maximized = false;

	var popupStyleElement = document.createElement('style');
	popupStyleElement.textContent = `
    		.popup * {
    		  -webkit-touch-callout: none; /* iOS Safari */
    		  -webkit-user-select: none; /* Safari */
    		  -khtml-user-select: none; /* Konqueror HTML */
    		  -moz-user-select: none; /* Firefox */
    		  -ms-user-select: none; /* Internet Explorer/Edge */
    		  user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
    		}
        `;
	document.getElementsByTagName('head')[0].appendChild(popupStyleElement);

	var youtubeElement = document.createElement('div');
	youtubeElement.id = 'youtubeelement';
	youtubeElement.style = 'position: absolute; z-index: 99999999999; background-color: rgba(255, 255, 255, 0.5); text-align: center; border: 1px solid #d3d3d3; width:30%; top:0px; left:0px; width: 420px; min-height: 17px;';
	youtubeElement.class = 'popup';
	var youtubeElementHeader = document.createElement('div');
	youtubeElementHeader.id = 'youtubeelementheader';
	youtubeElementHeader.ondblclick = toggleMaximizedState;

	var youtubeClose = document.createElement('div');
	youtubeClose.textContent = '✕';
	youtubeClose.style = 'font-weight: bold; float: right; cursor: pointer; margin-left: 5px;';
	youtubeClose.onclick = () => youtubeElement.remove();
	youtubeElementHeader.appendChild(youtubeClose);

	var youtubeMaximize = document.createElement('div');
	youtubeMaximize.textContent = '❐';
	youtubeMaximize.style = 'font-weight: bold; float: right; cursor: pointer; margin-left: 5px;';
	youtubeElementHeader.appendChild(youtubeMaximize);

	var youtubeMinimize = document.createElement('div');
	youtubeMinimize.textContent = '—';
	youtubeMinimize.style = 'font-weight: bold; float: right; cursor: pointer; margin-left: 5px;';
	youtubeMinimize.onclick = toggleMaximizedState;
	youtubeMaximize.onclick = toggleMaximizedState;
	youtubeElementHeader.appendChild(youtubeMinimize);

	var youtubeElementTitle = document.createElement('div');
	youtubeElementTitle.textContent = 'Youtube player';
	youtubeElementHeader.appendChild(youtubeElementTitle);
	youtubeElementHeader.style = 'z-index: 99999999999; cursor: move; background-color: #2196F3; color:#fff; font-size: 13px; padding-top: 1px; padding-bottom: 6px; padding-left: 3px; padding-right: 3px; height: 10px;';
	youtubeElement.appendChild(youtubeElementHeader);

	var youtubePlayerContainer = document.createElement('div');
	youtubePlayerContainer.style = 'height: calc(100% - 17px);';

	var youtubePlayer = document.createElement('div');
	youtubePlayer.id = 'youtubePlayer';
	if (maximized) {
		youtubePlayer.width = "100%";
		youtubePlayer.height = playerHeight;
		youtubeMaximize.style.display = "none";
		youtubeMinimize.style.display = "block";
	} else {
		youtubePlayer.width = 0;
		youtubePlayer.height = 0;
		youtubeMinimize.style.display = "none";
		youtubeMaximize.style.display = "block";
	}

	youtubePlayerContainer.appendChild(youtubePlayer);
	youtubeElement.appendChild(youtubePlayerContainer);

	var seconds = 0;
	window.onYouTubeIframeAPIReady = function startYt() {
		console.log("player");
		// player = new YT.Player('youtubePlayer', {
		// 	events: {
		// 		'onReady': onPlayerReady
		// 	}
		// });
	}

	function onPlayerReady(event) {
		console.log('palyer ready');
		event.target.playVideo();
	}
	function seek(sec) {
		if (player) {
			seconds += sec;
			player.seekTo(seconds, true);
		}
	}

	let tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	tag.id = "iframe_api";
	let firstScriptTagh = document.getElementsByTagName('head')[0];
	firstScriptTagh.insertBefore(tag, firstScriptTagh.firstChild);

	document.body.appendChild(youtubeElement);

	initResizeElement(youtubeElement, youtubePlayer, youtubeElementHeader);
	dragElement(youtubeElement);

	const handler = {
		set: function (target, prop, receiver) {
			if (prop == "onmessage") {
				var oldMessage = receiver;
				receiver = function (event) {
					const data = JSON.parse(event.data);
					switch (data.tc) {
						case "joined": {
							roomName = data.room.name;
							break;
						}
						case "userlist": {
							for (const user of data.users) {
								if (user.username === roomName) {
									ownerHandle = user.handle;
								}
							}
							break;
						}
						case "join": {
							if (data.username === roomName) {
								ownerHandle = data.handle;
							}
							break;
						}
						case "msg": {
							if (maximized && youtubePlayer) {
								if (!data.handle === ownerHandle) break;
								var filterString = ".youtube https://www.youtube.com/watch?v=";
								if (data.text.startsWith(filterString)) {
									const youtubeCode = data.text.substring(filterString.length);
									// youtubePlayer.src = 'https://www.youtube.com/embed/' + youtubeCode + '?enablejsapi=1&origin=https://www.youtube.com';
									if (!player) {
										player = new YT.Player('youtubePlayer', {
											videoId: youtubeCode,
											height: '100%',
											width: '100%',
											events: {
												'onReady': onPlayerReady
											}
										});
									} else {
										player.loadVideoById(youtubeCode);
									}
								}
								filterString = "Youtube: ";
								if (data.text.startsWith(filterString)) {
									const youtubeCode = data.text.substring(filterString.length);
									// youtubePlayer.src = 'https://www.youtube.com/embed/' + youtubeCode + '?enablejsapi=1&origin=https://www.youtube.com';
									if (!player) {
										player = new YT.Player('youtubePlayer', {
											videoId: youtubeCode,
											height: '100%',
											width: '100%',
											events: {
												'onReady': onPlayerReady
											}
										});
									} else {
										player.loadVideoById(youtubeCode);
									}
								}
								filterString = "Youtube seek: ";
								if (data.text.startsWith(filterString)) {
									const seekSeconds = parseInt(data.text.substring(filterString.length), 10);
									if (!player) break;
									player.seekTo(seekSeconds, true);
								}
							}
							break;
						}
					}
					oldMessage(event);
				}
			}
			return (target[prop] = receiver);
		},
		get: function (target, prop) {
			var value = target[prop];
			if (prop == "send") {
				value = function (event) {
					target.send(event);
				};
			} else if (typeof value == 'function') {
				value = value.bind(target);
			}
			return value;
		}
	};

	var WebSocketProxy = new window.Proxy(window.WebSocket, {
		construct: function (Target, args) {
			const target = new Target(args[0]);
			return new window.Proxy(target, handler);
		}
	});
	window.WebSocket = WebSocketProxy;

	const proxy = new Proxy(window.WebSocket, handler);

	function toggleMaximizedState() {
		if (maximized) {
			playerHeight = youtubePlayer.height;
			youtubePlayer.width = 0;
			youtubePlayer.height = 0;
			document.getElementById('youtubeelement').style.height = '17px';
			youtubeMaximize.style.display = "block";
			youtubeMinimize.style.display = "none";
		} else {
			youtubePlayer.width = "100%";
			youtubePlayer.height = playerHeight;
			document.getElementById('youtubeelement').style.height = (17 + parseInt(youtubePlayer.height, 10)) + 'px';
			youtubeMaximize.style.display = "none";
			youtubeMinimize.style.display = "block";
		}
		maximized = !maximized;
	}

	function dragElement(elmnt) {
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
		if (document.getElementById(elmnt.id + "header")) {
			// if present, the header is where you move the DIV from:
			document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
		} else {
			// otherwise, move the DIV from anywhere inside the DIV:
			elmnt.onmousedown = dragMouseDown;
		}

		function dragMouseDown(e) {
			moving = true;
			e = e || window.event;
			e.preventDefault();
			// get the mouse cursor position at startup:
			pos3 = e.clientX;
			pos4 = e.clientY;
			document.onmouseup = closeDragElement;
			// call a function whenever the cursor moves:
			document.onmousemove = elementDrag;
		}

		function elementDrag(e, offsetLeft = 0, offsetTop = 0) {
			e = window.event;
			e.preventDefault();
			// calculate the new cursor position:
			pos1 = pos3 - (e.clientX + offsetLeft);
			pos2 = pos4 - (e.clientY + offsetTop);
			pos3 = (e.clientX + offsetLeft);
			pos4 = (e.clientY + offsetTop);
			// set the element's new position:
			elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
			elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
		}

		youtubePlayer.addEventListener("mousemove", (e) => {
			if (moving) {
				elementDrag(e);
				return;
			}
		});

		// youtubePlayer.contentWindow.addEventListener("mousemove", (e) => {
		// 	if (moving) {
		// 		var offset = youtubePlayer.getBoundingClientRect();
		// 		elementDrag(e, offset.left, offset.top);
		// 		return;
		// 	}
		// }, {});

		function closeDragElement() {
			// stop moving when mouse button is released:
			moving = false;
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}

	function initResizeElement(popupElement, youtubePlayer, youtubeElementHeader) {
		var element = null;
		var startX, startY, startWidth, startHeight;

		//Add resizer right
		var right = document.createElement("div");
		right.className = "resizer-right";
		popupElement.appendChild(right);
		right.addEventListener("mousedown", initDrag, false);
		right.parentPopup = popupElement;
		right.style = `
        	  width: 5px;
        	  height: 100%;
        	  background: transparent;
        	  position: absolute;
        	  right: 0;
        	  bottom: 0;
        	  cursor: e-resize;`;

		//Add resizer bottom
		var bottom = document.createElement("div");
		bottom.className = "resizer-bottom";
		popupElement.appendChild(bottom);
		bottom.addEventListener("mousedown", initDrag, false);
		bottom.parentPopup = popupElement;
		bottom.style = `
        	  width: 100%;
    		  height: 5px;
    		  background: transparent;
    		  position: absolute;
    		  right: 0;
    		  bottom: 0;
    		  cursor: n-resize;`;

		//Add resizer both
		var both = document.createElement("div");
		both.className = "resizer-both";
		popupElement.appendChild(both);
		both.addEventListener("mousedown", initDrag, false);
		both.parentPopup = popupElement;
		both.style = `
    		  width: 5px;
    		  height: 5px;
    		  background: transparent;
    		  z-index: 10;
    		  position: absolute;
    		  right: 0;
    		  bottom: 0;
    		  cursor: nw-resize;`;

		function initDrag(e) {
			e.preventDefault();
			resizing = true;
			element = this.parentPopup;

			startX = e.clientX;
			startY = e.clientY;
			startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
			startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
			document.documentElement.addEventListener("mousemove", doDrag, false);
			document.documentElement.addEventListener("mouseup", stopDrag, false);
		}

		function doDrag(e, offsetLeft = 0, offsetTop = 0) {
			e.preventDefault();
			element.style.width = startWidth + (e.clientX + offsetLeft) - startX + "px";
			if (maximized) {
				element.style.height = startHeight + (e.clientY + offsetTop) - startY + "px";
			}
			youtubePlayer.width = element.style.width;
			if (maximized) {
				var elementHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
				var youtubeElementHeaderHeight = parseInt(document.defaultView.getComputedStyle(youtubeElementHeader).height, 10);
				youtubePlayer.height = elementHeight - youtubeElementHeaderHeight - 7 + "px";
			}
		}

		youtubePlayer.addEventListener("mousemove", (e) => {
			if (resizing) {
				e.preventDefault();
				doDrag(e);
				return;
			}
		});

		// youtubePlayer.contentWindow.addEventListener("mousemove", (e) => {
		// 	if (resizing) {
		// 		var offset = youtubePlayer.getBoundingClientRect();
		// 		e.preventDefault();
		// 		doDrag(e, offset.left, offset.top);
		// 		return;
		// 	}
		// });

		function stopDrag() {
			resizing = false;
			document.documentElement.removeEventListener("mousemove", doDrag, false);
			document.documentElement.removeEventListener("mouseup", stopDrag, false);
		}
	}
})();