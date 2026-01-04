// ==UserScript==
// @name         Chiphell Helper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license      GNU GPLv3
// @description  Chiphell 辅助，屏蔽帖子，拉黑用户
// @author       Ersic
// @match        http*://www.chiphell.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/460435/Chiphell%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/460435/Chiphell%20Helper.meta.js
// ==/UserScript==

(function () {
	"use strict";

	var pathname = unsafeWindow.location.pathname;

	// 帖子列表页
	if (pathname.indexOf("forum") != -1) {
		checkPost();
		// 添加屏蔽按钮
		document.querySelectorAll(".new").forEach((el, i) => {
            if (el.parentNode.parentNode.id.indexOf("normalthread_") != -1) {
                let pid = el.parentNode.parentNode.id.substring(13);
                let newEl = document.createElement("a");
                newEl.className = "closeprev y";
                newEl.href = "javascript:void(0);";
                newEl.setAttribute("pid", pid);
                newEl.title = "屏蔽";
                newEl.innerText = "屏蔽";
                newEl.onclick = function (event) {
                    if (confirm("确认屏蔽")) {
                        let pid = event.target.getAttribute("pid");
                        if (pid) {
                            let blockPost = JSON.parse(unsafeWindow.localStorage.getItem("blockPost"));
                            if (blockPost == null) {
                                blockPost = [];
                            }
                            blockPost.push(pid);
                            unsafeWindow.localStorage.setItem("blockPost", JSON.stringify(blockPost));
                            event.target.parentElement.parentElement.parentElement.remove();
                        }
                    }
                };
                el.querySelector(".tdpre").before(newEl);
            }
		});
		document.querySelectorAll(".common").forEach((el, i) => {
            if (el.parentNode.parentNode.id.indexOf("normalthread_") != -1) {
                let pid = el.parentNode.parentNode.id.substring(13);
                let newEl = document.createElement("a");
                newEl.className = "closeprev y";
                newEl.href = "javascript:void(0);";
                newEl.setAttribute("pid", pid);
                newEl.title = "屏蔽";
                newEl.innerText = "屏蔽";
                newEl.onclick = function (event) {
                    if (confirm("确认屏蔽")) {
                        let pid = event.target.getAttribute("pid");
                        if (pid) {
                            let blockPost = JSON.parse(unsafeWindow.localStorage.getItem("blockPost"));
                            if (blockPost == null) {
                                blockPost = [];
                            }
                            if (blockPost.indexOf(pid) == -1) {
                                blockPost.push(pid);
                                unsafeWindow.localStorage.setItem("blockPost", JSON.stringify(blockPost));
                            }
                            event.target.parentElement.parentElement.parentElement.remove();
                        }
                    }
                };
                el.querySelector(".tdpre").before(newEl);
            }
		});
	}

	// 帖子详情页
	if (pathname.indexOf("thread") != -1) {
		checkUser();
	}

	// 黑名单页
	if (unsafeWindow.location.href.indexOf("blacklist") != -1) {
        let blockUser = JSON.parse(unsafeWindow.localStorage.getItem("blockUser"));
		if (blockUser == null) {
			blockUser = [];
		}
		document.querySelectorAll(".buddy h4 .note").forEach((el, i) => {
			let uid = el.id.replace("friend_note_", "");
			if (blockUser.indexOf(uid) == -1) {
				blockUser.push(uid);
				unsafeWindow.localStorage.setItem("blockUser", JSON.stringify(blockUser));
			}
		});
	}

	function checkPost() {
		let blockPost = JSON.parse(unsafeWindow.localStorage.getItem("blockPost"));
		if (blockPost == null) {
			blockPost = [];
		}
		let blockUser = JSON.parse(unsafeWindow.localStorage.getItem("blockUser"));
		if (blockUser == null) {
			blockUser = [];
		}

		document.querySelectorAll("#threadlisttableid tbody").forEach((el, i) => {
            if (el.id.indexOf("normalthread_") != -1) {
                let pid = el.id.substring(el.id.indexOf("_") + 1);
                if (blockPost.indexOf(pid) != -1) {
                    el.remove();
                } else {
                    let linkEl = el.querySelectorAll(".by a");
                    if (linkEl.length > 0) {
                        let uid = linkEl[0].getAttribute("href").replace("space-uid-", "").replace(".html", "");
                        if (blockUser.indexOf(uid) != -1) {
                            el.remove();
                        }
                    }
                }
            }
		});
	}

	function checkUser() {
		let blockUser = JSON.parse(unsafeWindow.localStorage.getItem("blockUser"));
		if (blockUser != null) {
			// 删除回复
			document.querySelectorAll(".authi .xw1 ").forEach((el, i) => {
				let uid = el.getAttribute("href").replace("space-uid-", "").replace(".html", "");
				if (blockUser.indexOf(uid) != -1) {
					el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
				}
			});
			// 删除点评
			document.querySelectorAll(".pstl").forEach((el, i) => {
				let href = el.querySelectorAll(".xi2")[0].getAttribute("href");
				if (href) {
					let uid = href.replace("space-uid-", "").replace(".html", "");
					if (blockUser.indexOf(uid) != -1) {
						el.remove();
					}
				}
			});
		}
	}
})();
