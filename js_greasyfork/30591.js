// ==UserScript==
// @name         YouAdmin
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.1
// @description  What you've always wanted
// @author       The
// @match        https://epicmafia.com/*
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/30591/YouAdmin.user.js
// @updateURL https://update.greasyfork.org/scripts/30591/YouAdmin.meta.js
// ==/UserScript==

(function() {
    'use strict';
	
	var actions;
	try {
		actions = JSON.parse(window.localStorage.youadmin_actions);
	}
	catch (e) {
		actions = {};
	}
	var actionKeys = ["comment_ban", "ban", "make_mod", "forum_ban", "chat_ban"];
	var userActions = {
		"Comment Ban": "comment_ban",
		"Ban": "ban",
		"Make Mod": "make_mod",
		"Forum Ban": "forum_ban",
		"Chat Ban": "chat_ban"
	};
	if (!actions.make_mod) {
		actions.make_mod = {};
		actions.mod_names = {};
		$.get("/moderator", function (data) {
			var div = $("<div></div>");
			var id;
			div.html(data);
			div.find(".mod .user img").each(function () {
				id = $(this).attr("src").split("/")[4].split("_")[0];
				actions.make_mod[id] = 1;
				actions.mod_names[id] = $(this).parent().text();
			});
			save();
		});
	}
    actionKeys.forEach(function (key) {
		if (!actions[key]) {
			actions[key] = {};
		}
	});
	if (!actions.name && $(".user.userteeny").length) {
		actions.name = $(".user.userteeny").first().text();
	}
	if (!actions.id && $(".user.userteeny").length) {
		actions.id = $(".user.userteeny").first().attr("href").split("/")[2];
	}
	
	var save = function () {
		window.localStorage.youadmin_actions = JSON.stringify(actions);
	};
	
    var commentModify = function (o) {
		var removals = [];
		o.data.forEach(function (comment, i) {
			if (actions.comment_ban[comment.user_id] || actions.ban[comment.user_id]) {
				removals.push(i);
			}
		});
		removals.forEach(function (index, j) {
			o.data.splice(index - j, 1);
		});
		return o;
    };
	
	var scanForums = function () {
		var name;
		$(".post").each(function () {
			name = $(this).find(".postuser [data-type='userinfo']").attr("href").split("/")[2];
			if (actions.forum_ban[name] || actions.ban[name]) {
				$(this).remove();
			}
		});
		
		$(".postuser [data-type='userinfo']").each(function () {
			if ($(this).text() == actions.name || (actions.make_mod[$(this).attr("href").split("/")[2]] && !$(this).parent().find(".icon-star.yellow").length)) {
				$(this).parent().prepend("<i class='icon-star yellow tt' data-title='Admin'></i>");
			}
			else {
				if ($(this).text() != actions.name && !actions.make_mod[$(this).attr("href").split("/")[2]] && $(this).parent().find(".icon-star.yellow").length) {
					$(this).parent().find(".icon-star.yellow").remove();
				}
			}
		});
	};
	
	var changeOwner = function () {
		if ($("[ng-class='{sel: lobby==1}']").hasClass("sel")) {
			$("#lobbyinfo-mods .block img").attr("src", "https://em-uploads.s3.amazonaws.com/avatars/" + actions.id + "_teeny.jpg");
			$("#lobbyinfo-mods .block a span").hide();
			$("#lobbyinfo-mods .block a").append("<span id='youOwner' class='normal blood ng-binding'>" + actions.name + "</span>");
		}
		else {
			$("#youOwner").remove();
			$("#lobbyinfo-mods .block a span").show();
		}
	};
	
	var pathname = window.location.pathname.split("/");
	if (actions.name && actions.id) {
		console.log("HERE " + pathname[1]);
		switch (pathname[1]) {
			case "moderator":
				var id;
				var found = {};
				var admin = $(".mod").first().clone();
				
				admin.find(".crown").first().parent().find(".user")[0].childNodes[1].textContent = actions.name;
				admin.find(".crown").first().parent().find(".user img").attr("src", "https://em-uploads.s3.amazonaws.com/avatars/" + actions.id + "_thumb.jpg");
				admin.prependTo(".all_mods");
				
				$(".mod").each(function () {
					id = $(this).find(".user img").attr("src").split("/")[4].split("_")[0];
					console.log(id);
					if (!actions.make_mod[id] && id != actions.id) {
						$(this).remove();
					}
					else {
						found[id] = 1;
					}
				});
				for (var mod in actions.make_mod) {
					if (!found[mod]) {
						$(".all_mods").append('<div class="mod"><div class="mod_name_comment"><div class="mod_username mod_getcomment"><div class="user user_thumb truncate"><img src="https://em-uploads.s3.amazonaws.com/avatars/' + mod + '_thumb.jpg">' + actions.mod_names[mod] + '</div></div></div></div>');
					}
				}
				break;
			case "topic":
				if (parseInt(pathname[2])) {
					scanForums();
					var forumObserver = new MutationObserver(function (muts) {
						muts.forEach(function (m) {
							if (m.addedNodes.length) {
								if (m.addedNodes[0].className == "pagenav") {
									scanForums();
								}
							}
						});
					});
					forumObserver.observe($("#threadmsg")[0], {childList: true, subtree: true, characterData: true});
				}
				break;
			case "forum":
				$(".forum_recent").each(function () {
					var id = $(this).find(".user").attr("href").split("/")[2];
					if (actions.forum_ban[id] || actions.ban[id]) {
						$(this).remove();
					}
				});
				$(".row").each(function () {
					var id;
					if ($(this).find("td").eq(3).find(".user").length) {
						id = $(this).find("td").eq(3).find(".user").first().attr("href").split("/")[2];
						if (actions.forum_ban[id] || actions.ban[id]) {
							$(this).remove();
						}
					}
					if ($(this).find("td").eq(4).find(".user").length) {
						id = $(this).find("td").eq(4).find(".user").attr("href").split("/")[2];
						if (actions.forum_ban[id] || actions.ban[id]) {
							$(this).find("td").eq(4).find(".lastpost").remove();
						}
					}
				});
				break;
			case "lobby":
				var chatObserver = new MutationObserver(function () {
					$(".talk").each(function () {
						var id = $(this).find(".avatar").attr("src").split("/")[5].split("_")[0];
						if (actions.chat_ban[id] || actions.ban[id]) {
							$(this).remove();
						}
					});
				});
				chatObserver.observe($("#window_i")[0], {childList: true, subtree: true});
				
				var lobbyObserver = new MutationObserver(function () {
					changeOwner();
				});
				lobbyObserver.observe($("#lobby-nav")[0], {childList: true, subtree: true, characterData: true});
				
				changeOwner();
				
				$(".recent_topic").each(function () {
					var id = $(this).find("img").attr("data-uid");
					if (actions.forum_ban[id] || actions.ban[id]) {
						$(this).remove();
					}
				});
				break;
			case "user":
			case "u":
				var id = $("[data-title='Player profile']").attr("href").split("/")[2];
				$("#finduserbox").append("<span class='lcontrols'><a href='/action/" + id + "'><i class='icon-cog'></i></a></span>");
				break;
			case "action":
				var id = pathname[2];
				if (parseInt(id)) {
					$("h1").text("Moderator Actions");
					$("h1").css({
						"font-size": "40px",
						"margin-bottom": "25px"
					});
					var html = "";
					for (var name in userActions) {
						html += "<div class='action' style='border: 1px solid #333; font-size: 20px; padding: 10px; width: 200px; margin-bottom: 20px; cursor: pointer;' data-action='" + userActions[name] + "'>" + name + "</div><br>";
					}
					$("#content_inner div").html(html);
					$(".action").each(function () {
						if (actions[$(this).attr("data-action")][id]) {
							$(this).css({
								"background-color": "#999",
								"color": "white"
							});
						}
					});
					$(".action").click(function () {
						var action = $(this).attr("data-action");
						if (actions[action][id]) {
							delete actions[action][id];
							$(this).css({
								"background-color": "white",
								"color": "black"
							});
						}
						else {
							actions[action][id] = 1;
							$(this).css({
								"background-color": "#999",
								"color": "white"
							});
							
							if (action == "make_mod" && !actions.mod_names[id]) {
								$.get("/user/" + id, function (data) {
									var div = $("<div></div>");
									div.html(data);
									var name = div.find("#usertitle").text().trim();
									actions.mod_names[id] = name;
									save();
								});
							}
						}
						save();
					});
				}
				break;
		}
		
		unsafeWindow.loadpage = function (original) {
			return function () {
				var oldArgs = arguments;
				unsafeWindow.fetch_template('comment.html', 'comment', function(tmpl) {
					if (oldArgs[1].indexOf("/comment/find/") == 0) {
						oldArgs[4] = function (o) {
							if (o.pagenav) {
								o.pagenav_bottom = $(o.pagenav).find('a').attr('data-scroll', true).end().clone()[0].outerHTML;
							}
							o = commentModify(o);
							return tmpl(o);
						};
					}
					else if (oldArgs[1].indexOf("/action/page") == 0) {
						
					}
					original.apply(this, oldArgs);
				});
			};
		}(unsafeWindow.loadpage);
		
		save();
	}
})();