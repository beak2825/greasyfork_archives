// ==UserScript==
// @name         Zanoab's Torn Forum Blocker
// @version      0.5.1
// @description  Blocks forum communication from users
// @author       Zanoab [1877054]
// @run-at       document-begin
// @namespace    TornCity
// @match        http://www.torn.com/forums.php*
// @match        https://www.torn.com/forums.php*
// @match        http://www.torn.com/laptop.php*
// @match        https://www.torn.com/laptop.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38826/Zanoab%27s%20Torn%20Forum%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/38826/Zanoab%27s%20Torn%20Forum%20Blocker.meta.js
// ==/UserScript==

(function() {
	var LS_KEY_BLOCK_LIST = "block_list";
	
	var blocked;
	var mapCount = 0;
	var entryCount = 0;
	
	function saveBlockList() {
		var data = JSON.stringify(blocked);
		localStorage[LS_KEY_BLOCK_LIST] = data;
	}
	
	function loadBlockList() {
		blocked = null;
		try {
			blocked = JSON.parse(localStorage[LS_KEY_BLOCK_LIST]);
		} catch(e) {}
		if (!blocked) {
			blocked = {user:{}, faction:{}};
		}
	}
	
	function injectForumWatcher() {
		var A = {
			forum_wrap: "#forums-page-wrap",
			top_links_list: "#top-page-links-list",
			
			hide_entry_message_var: {
				thread: "hide_entry_thread",
				post: "hide_entry_post",
			},
			hide_entry_message: {
				true: "Show block messages",
				false: "Hide block messages",
			},
		};
		
		var forumEle = document.querySelector(A.forum_wrap);
		if (!forumEle) return;
		
		var blockMap, linkBar;
		var _styleSheet, styleSheet;
		
		_styleSheet = document.createElement("style");
		_styleSheet.title = this.title;
		document.body.append(_styleSheet);
		styleSheet = _styleSheet.sheet;
		
		function _updateLinkBar() {
			if (!linkBar || !blockMap) return;
			
			var a, b, c, d;
			
			a = linkBar.querySelector(A.top_links_list);
			if (!a.querySelector(".block-hide-entry")) {
				b = document.createElement("a");
				a.insertBefore(b, a.querySelector(".links-footer"));
				b.classList.add("t-clear");
				b.classList.add("h");
				b.classList.add("c-pointer");
				b.classList.add("line-h24");
				b.classList.add("right");
				b.classList.add("m-icon");
				b.onclick = function(evt) {
					var a = !blocked[A.hide_entry_message_var[blockMap.type]];
					blocked[A.hide_entry_message_var[blockMap.type]] = a;
					c.innerText = A.hide_entry_message[a];
					for (var b of blockMap.entries) {
						if (a) {
							b.message.style.display = "none";
						} else {
							b.message.style.display = null;
						}
					}
					saveBlockList();
				};
				c = document.createElement("span");
				d = blocked[A.hide_entry_message_var[blockMap.type]] || false;
				c.innerText = A.hide_entry_message[d];
				b.append(c);
			}
		}
		
		function processThread(main) {
			function PostEntry(blockMap) {
				var entry = this;
				
				var a;
				
				this.blockMap = blockMap;
				this.id = entryCount++;
				blockMap.entries.push(this);
				this.posts = [];
				this.names = [];
				
				// Assign style rule
				// Create new style rule
				a = styleSheet.insertRule(["[block-id='", this.id, "'] {}"].join(""), styleSheet.rules.length);
				this.style = styleSheet.rules[a];
				
				// Create show/hide hidden posts message
				this.message = document.createElement("li");
				this.message.setAttribute("block-entry", this.id);
				if (blocked[A.hide_entry_message_var[blockMap.type]]) {
					this.message.style.display = "none";
				}
				a = document.createElement("div");
				a.classList.add("column-wrap");
				a.classList.add("white-grad");
				a.style.padding = "10px";
				a.style.fontWeight = "bold";
				a.innerHTML = "<div><span class='block-count'>N/A</span> <span class='block-noun'>posts</span> hidden from <span class='block-names'>users</span></div><div>Click here to <span class='block-state'>show</span> hidden <span class='block-noun'>posts</span>.</div>";
				this.message.append(a);
				a = document.createElement("div");
				a.classList.add("post-delimiter");
				this.message.append(a);
				this.message.onclick = function(evt) {
					entry.style.disabled = !entry.style.disabled;
					entry.updateStyle();
				};
				
				this.updateStyle();
			}
			
			PostEntry.prototype.updateStyle = function() {
				var rule = this.style;
				if (rule.disabled) {
					// console.debug("Style disabled");
					rule.style = {};
					this.message.querySelector(".block-state").innerText = "hide";
				} else {
					// console.debug("Style enabled");
					rule.style.display = "none";
					this.message.querySelector(".block-state").innerText = "show";
				}
			};
			
			PostEntry.prototype.addPost = function(post) {
				var a, b;
				this.posts.push(post);
				
				post.setAttribute("block-id", this.id);
				
				var name = post.getAttribute("user-name");
				if (name && !this.names.includes(name)) {
					this.names.push(name);
					this.message.querySelector(".block-names").innerText = this.names.join(", ");
				}
				
				this.message.querySelector(".block-count").innerText = this.posts.length;
				a = this.posts.length == 1;
				this.message.querySelectorAll(".block-noun").forEach(function(ele) {
					ele.innerText = a ? "post" : "posts";
				});
				// if (this.posts.length == 1) {
				// 	this.message.querySelector(".block-noun").innerText = "post";
				// } else {
				// 	this.message.querySelector(".block-noun").innerText = "posts";
				// }
			};

			function PostBlockMap(main) {
				var a;
				
				this.id = mapCount++;
				this.type = "post";
				this.title = ["block-id-", this.id].join("");
				this.main = main;
				this.postList = main.querySelector(".thread-list");
				this.entries = [];
				
				this.evaluate();
			}
			
			PostBlockMap.prototype.updateLinkBar = _updateLinkBar;
			
			PostBlockMap.prototype.updateUserBlocks = function(userId) {
				var userBlock = blocked.user[userId];
				var a = userBlock.block_forum_post;
				for (var b of [...this.postList.querySelectorAll(["[user-id='", userId, "'] .post-wrap .action-wrap .block-user .value"].join(""))]) {
					if (a) {
						b.innerText = "Unblock User";
					} else {
						b.innerText = "Block User";
					}
				}
			};
			
			PostBlockMap.prototype.evaluate = function() {
				// console.debug("Evaluating block map...");
				while(styleSheet.rules.length) {
					styleSheet.removeRule(0);
				}
				
				var a;
				a = this.main.querySelector("#top-page-links-button");
				
				this.entries = [];
				var posts = [...this.postList.children];
				
				var blockMap = this;
				var entry;
				posts.forEach(function(post) {
					if (post.getAttribute("block-entry") != null) {
						// Delete previous block entries
						post.remove();
						return;
					}
					
					if (post.classList.contains("parent-post")) {
						// Ignore original post
						return;
					}
					
					var userId, factionId, userName;
					var a, b;
					// Clean-up previous block
					post.removeAttribute("block-id");
					
					if (post.getAttribute("block-prepped") == null) {
						// Prepare post metadata
						// Extract user id
						userId = "";
						for (a of post.querySelectorAll(".poster > a.user.name[href^='/profiles.php?']")) {
							b = a.getAttribute("href").match(/[?&]XID=(\d+)/);
							if (b) {
								userId = b[1];
								break;
							}
						}
						post.setAttribute("user-id", userId);
						
						// Extract faction Id
						factionId = "";
						for (a of post.querySelectorAll(".poster > a.user.faction[href^='/factions.php?']")) {
							b = a.getAttribute("href").match(/[?&]ID=(\d+)/);
							if (b) {
								factionId = b[1];
								break;
							}
						}
						post.setAttribute("faction-id", factionId);
						
						// Extract user name
						userName = "";
						for (a of post.querySelectorAll(".poster > .user.name [alt]")) {
							b = a.getAttribute("alt").match(/(.*) \[\d+\]/);
							if (b) {
								userName = b[1];
								break;
							}
						}
						post.setAttribute("user-name", userName);
						
						post.setAttribute("block-prepped", "");
					} else {
						// Pull prepped metadata
						userId = post.getAttribute("user-id");
						factionId = post.getAttribute("faction-id");
					}
					
					// Check if blocked
					var userBlock = blocked.user[userId];
					if (!userBlock) {
						userBlock = {
							id: userId,
							name: userName,
						};
						blocked.user[userId] = userBlock;
					}
					var factionBlock = blocked.faction[factionId];
					if (!factionBlock) {
						factionBlock = {
							id: factionId,
						};
						blocked.faction[factionId] = factionBlock;
					}
					
					var block = userBlock.block_forum_post || factionBlock.block_forum_post;
					
					if (!post.querySelector(".block-user")) {
						// Add (un)block user button
						var actionBar = post.querySelector(".post-wrap .action-wrap .right-part > ul");
						a = document.createElement("li");
						a.classList.add("forum-button");
						a.classList.add("block-user");
						a.style.width = "auto";
						a.style.padding = "5px";
						a.style.lineHeight = "22px";
						b = document.createElement("span");
						b.classList.add("value");
						b.innerText = (userBlock && userBlock.block_forum_post) ? "Unblock Posts" : "Block Posts";
						a.append(b);
						var lastClick;
						a.onclick = function(evt) {
							console.debug("Click!");
							var b;
							b = blocked.user[userId];
							
							if (b.block_forum_post) {
								// Unblock posts
								console.debug("Unblocking posts");
								b.block_forum_post = false;
							} else {
								// Block posts
								console.debug("Blocking posts");
								b.block_forum_post = true;
							}
							
							blockMap.updateUserBlocks(userId);
							saveBlockList();
						};
						actionBar.prepend(a);
					}
					
					if (block) {
						// Block post
						if (!entry) {
							entry = new PostEntry(blockMap);
							// console.debug(post);
							blockMap.postList.insertBefore(entry.message, post);
						}
						entry.addPost(post);
					} else {
						// Flush existing entry
						entry = null;
					}
				});
			};
			
			blockMap = new PostBlockMap(main);
		}
		
		function processBoard(main) {
			function ThreadEntry(blockMap) {
				var entry = this;
				
				var a;
				
				this.blockMap = blockMap;
				this.id = entryCount++;
				blockMap.entries.push(this);
				this.threads = [];
				this.names = [];
				
				// Assign style rule
				// Create new style rule
				a = styleSheet.insertRule(["[block-id='", this.id, "'] {}"].join(""), styleSheet.rules.length);
				this.style = styleSheet.rules[a];
				
				// Create show/hide hidden threads message
				this.message = document.createElement("li");
				this.message.setAttribute("block-entry", this.id);
				if (blocked[A.hide_entry_message_var[blockMap.type]]) {
					this.message.style.display = "none";
				}
				a = document.createElement("div");
				a.style.padding = "10px";
				a.style.paddingTop = "5px";
				a.style.paddingBottom = "5px";
				// a.style.fontWeight = "bold";
				a.innerHTML = "<div><span class='block-count'>N/A</span> <span class='block-noun'>threads</span> hidden from <span class='block-names'>users</span></div>";
				this.message.append(a);
				this.message.onclick = function(evt) {
					entry.style.disabled = !entry.style.disabled;
					entry.updateStyle();
				};
				
				this.updateStyle();
			}
			
			ThreadEntry.prototype.addThread = function(thread) {
				var a, b;
				this.threads.push(thread);
				
				thread.setAttribute("block-id", this.id);
				
				var name = thread.getAttribute("user-name");
				if (name && !this.names.includes(name)) {
					this.names.push(name);
					this.message.querySelector(".block-names").innerText = this.names.join(", ");
				}
				
				this.message.querySelector(".block-count").innerText = this.threads.length;
				a = this.threads.length == 1;
				this.message.querySelectorAll(".block-noun").forEach(function(ele) {
					ele.innerText = a ? "thread": "threads";
				});
			};
			
			ThreadEntry.prototype.updateStyle = function() {
				var rule = this.style;
				if (rule.disabled) {
					// console.debug("Style disabled");
					rule.style = {};
					// this.message.querySelector(".block-state").innerText = "hide";
				} else {
					// console.debug("Style enabled");
					rule.style.display = "none";
					// this.message.querySelector(".block-state").innerText = "show";
				}
			};
			
			function ThreadBlockMap(main) {
				var a;
				
				this.id = mapCount++;
				this.type = "thread";
				this.title = ["block-id-", this.id].join("");
				this.main = main;
				this.threadList = main.querySelector(".threads-list");
				this.entries = [];
				
				this.evaluate();
			}
			
			ThreadBlockMap.prototype.updateLinkBar = _updateLinkBar;
			
			ThreadBlockMap.prototype.updateUserBlocks = function(userId) {
				// var userBlock = blocked.user[userId];
				// var a = userBlock.block_forum_post;
				// for (var b of [...this.postList.querySelectorAll(["[user-id='", userId, "'] .post-wrap .action-wrap .block-user .value"].join(""))]) {
				// 	if (a) {
				// 		b.innerText = "Unblock User";
				// 	} else {
				// 		b.innerText = "Block User";
				// 	}
				// }
			};
			
			ThreadBlockMap.prototype.evaluate = function() {
				while(styleSheet.rules.length) {
					styleSheet.removeRule(0);
				}
				
				this.entries = [];
				var threads = [...this.threadList.children];
				
				var blockMap = this;
				var entry;
				threads.forEach(function(thread) {
					if (thread.getAttribute("block-entry") != null) {
						// Delete previous block entries
						thread.remove();
						return;
					}
					
					var userId, userName;
					var a, b, c;
					// Clean-up previous block
					thread.removeAttribute("block-id");
					
					if (thread.getAttribute("block-prepped") == null) {
						// Prepare thread metadata
						// Extract user id and name
						userId = "";
						userName = "";
						a = thread.querySelector(".thread .starter > .user.name[href^='/profiles.php?']");
						if (a) {
							b = a.getAttribute("href").match(/[?&]XID=(\d+)/);
							if (b) {
								userId = b[1];
							}
							a = a.querySelector("[alt]");
							if (a) {
								b = a.getAttribute("alt").match(/(.*) \[\d+\]/);
								if (b) {
									userName = b[1];
								}
							}
						}
						thread.setAttribute("user-id", userId);
						thread.setAttribute("user-name", userName);
						
						thread.setAttribute("block-prepped", "");
					} else {
						// Pull prepped metadata
						thread.getAttribute("user-id");
						thread.getAttribute("user-name");
					}
					
					var userBlock = blocked.user[userId];
					if (!userBlock) {
						userBlock = {
							id: userId,
							name: userName,
						};
						blocked.user[userId] = userBlock;
					}
					
					var block = userBlock.block_forum_thread;
					
					if (!thread.querySelector(".block-user")) {
						// Add (un)block user button
						a = thread.querySelector(".thread-name-wrap");
						b = document.createElement("div");
						b.classList.add("icon-wrap");
						c = document.createElement("i");
						b.append(c);
						// c.setAttribute("title", "Block User");
						c.style.height = "15px";
						c.style.width = "16px";
						a.insertBefore(b, a.querySelector(".arrow-999"));
						b.onclick = function(evt) {
							console.debug("Click!");
							var b;
							b = blocked.user[userId];
							
							if (b.block_forum_thread) {
								// Unblock threads
								console.debug("Unblocking threads");
								b.block_forum_thread = false;
							} else {
								// Block threads
								console.debug("Blocking threads");
								b.block_forum_thread = true;
							}
							
							blockMap.updateUserBlocks(userId);
							saveBlockList();
						};
					}
					
					if (block) {
						// Block thread
						if (!entry) {
							entry = new ThreadEntry(blockMap);
							blockMap.threadList.insertBefore(entry.message, thread);
						}
						entry.addThread(thread);
					} else {
						// Flush existing entry
						entry = null;
					}
				});
			};
			
			blockMap = new ThreadBlockMap(main);
		}
		
		var mainObserver = new MutationObserver(function(evts) {
			evts.forEach(function(evt) {
				// console.debug(evt);
				if (evt.addedNodes.length && evt.addedNodes[0].nodeName == "TITLE") {
					// Filter out loading screen and minor changes
					// console.debug("Content load detected! Ponies!");
					
					loadBlockList();
					
					linkBar = null;
					blockMap = null;
					
					var a;
					for (a of [...evt.addedNodes]) {
						// console.debug(a);
						if (a.nodeType != 1) {
							// Not an element node
							continue;
						}
						
						if (a.classList.contains("content-title")) {
							// Link bar
							linkBar = a;
							if (blockMap) {
								blockMap.updateLinkBar();
							}
							continue;
						}
						if (a.classList.contains("forums-thread-wrap")) {
							// Forum thread view
							processThread(a);
							if (linkBar) {
								blockMap.updateLinkBar();
							}
							continue;
						}
						if (a.classList.contains("forums-committee-wrap")) {
							// Forum board view
							processBoard(a);
							if (linkBar) {
								blockMap.updateLinkBar();
							}
							continue;
						}
						if (a.classList.contains("forums-main-wrap")) {
							// Forum main view
							continue;
						}
					}
				}
			});
		});
		
		mainObserver.observe(forumEle, {
			"childList": true,
		});
	}
	
	function injectLaptopWatcher() {
		var laptopEle = document.querySelector("#computer-content-wrapper");
		if (!laptopEle) return;
		
		var mainObserver = new MutationObserver(function(evts) {
			evts.forEach(function(evt) {
				// console.debug(evt);
				if (evt.addedNodes.length) {
					// Filter out loading screen and minor changes
					if (evt.addedNodes[0].getAttribute && evt.addedNodes[0].getAttribute("id") == "forums-page-wrap") {
						console.debug("Trying to inject forum watcher");
						// Try injecting forum watcher
						injectForumWatcher();
					}
				}
			});
		});
		
		mainObserver.observe(laptopEle, {
			"childList": true,
		});
	}
	
	if (document.querySelector("#forums-page-wrap")) {
		injectForumWatcher();
	}
	if (document.querySelector("#computer-content-wrapper")) {
		injectLaptopWatcher();
	}
})();