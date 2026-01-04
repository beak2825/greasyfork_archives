// ==UserScript==
// @name         Jojos EpikChat Viewers list fix
// @namespace    https://greasyfork.org/users/393739-jojoooooo
// @version      0.4
// @description  Fix for the viewers list issues on EpikChat
// @author       Jojoooooo
// @match        https://www.epikchat.com/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=epikchat.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445196/Jojos%20EpikChat%20Viewers%20list%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/445196/Jojos%20EpikChat%20Viewers%20list%20fix.meta.js
// ==/UserScript==

(function () {
	'use strict';

	var users = [];

	function addOrUpdateUser(userToAddOrUpdate) {
		if (!userToAddOrUpdate) {
			return;
		}
		var user = users.find(u => u.sid === userToAddOrUpdate.sid);
		if (!user) {
			users.push(userToAddOrUpdate);
		}
		else {
			if (userToAddOrUpdate.cam !== undefined && userToAddOrUpdate.cam !== null)
				user.cam = userToAddOrUpdate.cam;
			if (userToAddOrUpdate.idle !== undefined && userToAddOrUpdate.idle !== null)
				user.idle = userToAddOrUpdate.idle;
		}

	}

	var onJoinRoom = cApp.r_jo;
	cApp.r_jo = (roomId, laurietta, cresha) => {
		return onJoinRoom(roomId, laurietta, cresha)
			.then(x => {
				var roomUsers = listData?.roomUsers[roomId];
				roomUsers?.forEach(r => addOrUpdateUser({ sid: r.sid, cam: r.cam, idle: r.idle }));
			});
	}

	socket.on("userUpdate", userUpdate => {
		if (userUpdate?.user) {
			if ((userUpdate.user.cam != null & userUpdate.user.cam != undefined) ||
				(userUpdate.user.idle != null & userUpdate.user.idle != undefined)) {
				addOrUpdateUser(userUpdate.user);
				updateUserStates();
			}
		}
	});

	socket.on("userJoin", userJoin => {
		if (userJoin?.user) {
			addOrUpdateUser({ sid: userJoin.user.sid, cam: userJoin.user.cam, idle: userJoin.user.idle });
			updateUserStates();
		}
	});

	function findFirstRecursive(node, searchString) {
		if (node.childNodes) {
			for (var child of node.childNodes) {
				if (child.className?.startsWith(searchString)) {
					return child;
				}
				var childrenOfChild = findFirstRecursive(child, searchString);
				if (childrenOfChild) {
					return childrenOfChild;
				}
			}
		}
		return null;
	}

	function updateUserStates() {
		if ($('.viewers.btn-primary')[0]) {
			Array.from($('.user-item'))
				.forEach(userItem => {
					var userStatusIcon = findFirstRecursive(userItem, "user-status");
					if (!userStatusIcon) return;
					var camIcons = findFirstRecursive(userItem, "cam-icons");
					if (!camIcons) return;
					var sid = userItem.attributes["data-sid"].value;
					var userToUpdate = users.find(u => u.sid === sid);
					if (!userToUpdate) return;
					switch (userToUpdate?.cam) {
						case 0:
							camIcons.innerHTML = "</i><i class='fas fa-video'></i>";
							break;
						case 1:
							camIcons.innerHTML = "<i class='fas fa-lock'></i><i class='fas fa-video'></i>";
							break;
						case 99:
							camIcons.innerHTML = "";
							break;
					}
					switch (userToUpdate?.idle) {
						case 0: {
							userStatusIcon.className = "user-status online";
							break;
						}
						default: {
							userStatusIcon.className = "user-status idle";
							break;
						}
					}
				});
		}
	}

	var onListUpdated = listUpdate;
	listUpdate = function (delvaughn, jeanann, tekia, nadezhda, nagwa) {
		onListUpdated(delvaughn, jeanann, tekia, nadezhda, nagwa);
		updateUserStates();
	}

	var onReloadListHtml = reloadListHtml;
	reloadListHtml = function (jaxs) {
		onReloadListHtml(jaxs);
		updateUserStates();
	}


	var $ = window.jQuery;
})();