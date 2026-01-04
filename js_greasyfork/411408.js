// ==UserScript==
// @name           Mooncell备用评论区(Mooncell Alter Flowthread)
// @name:en        Mooncell Alter Flowthread
// @namespace      hydride
// @version        1.2.8
// @description    实现一个备用flowthread，拯救Mooncell wiki(fgo.wiki)被和谐的评论区！
// @description:en Alternative Flowthread for Mooncell(fgo.wiki) when native is unavailable.
// @author         Hydride K
// @license        FreeBSD
// @icon           https://fgo.wiki/images/f/fc/Garanplogo.gif
// @match          *://fgo.wiki/w/*
// @match          *://fgo.wiki/index.php?title=*
// @exclude        *://fgo.wiki/index.php?title=*&action=edit*
// @exclude        *://fgo.wiki/index.php?title=*&action=history*
// @exclude        *://fgo.wiki/index.php?title=*&action=delete*
// @exclude        *://fgo.wiki/index.php?title=*&action=purge*
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.28.0/moment-with-locales.js
// @run-at         document-idle
// @grant          unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/411408/Mooncell%E5%A4%87%E7%94%A8%E8%AF%84%E8%AE%BA%E5%8C%BA%28Mooncell%20Alter%20Flowthread%29.user.js
// @updateURL https://update.greasyfork.org/scripts/411408/Mooncell%E5%A4%87%E7%94%A8%E8%AF%84%E8%AE%BA%E5%8C%BA%28Mooncell%20Alter%20Flowthread%29.meta.js
// ==/UserScript==

"use strict";

function loadMAF()
{
	var mwloadcnt;
	if (mwloadcnt == undefined)
	{
		mwloadcnt = 0;
		console.log("Mooncell Alter Flowthread init");
	}
	if (
		"undefined" == typeof unsafeWindow.mw ||
		"undefined" == typeof unsafeWindow.mw.util
	)
	{
		//console.log("Mooncell Alter Flowthread waiting for mw...");
		if (mwloadcnt++ < 20) setTimeout(loadMAF, 500);
		else console.log("mw fails loading in 10s, Alter Flowthread load abort.");
		return;
	}
	//console.log("mw loaded after " + mwloadcnt + " trials.");
	var mw = unsafeWindow.mw;
	mw.config.values.canpost = true;
	mw.config.values.debug = true;
	mw.config.values.commentadmin = true;
	if (mw.loader.getState("ext.flowthread") == "ready")
	{
		//$(".comment-thread, .comment-container-top, .comment-container, .comment-paginator, .comment-replybox, .comment-bannotice")
		//	.css("cssText","display:block !important");
		var commentstyle =
			".comment-thread, .comment-container, .comment-paginator, .comment-replybox, .comment-bannotice {display:block !important}";
		$("style#addCommentStyle").html(commentstyle);
		console.log("Native Flowthread is loaded, Alter Flowthread load abort.");
		return;
	}
	if (mw.loader.getState("ext.flowthread_alter") == "ready")
	{
		console.log("Alter Flowthread is already loaded, load abort.");
		return;
	}
	console.log("Mooncell Alter Flowthread loading...");
	mw.loader.implement(
		"ext.flowthread_alter@blahblah",
		function ($, jQuery, require, module)
		{
			var config = mw.config.get("wgFlowThreadConfig");
			var replyBox = null;
			function getAvatar(id, username)
			{
				return "http://avatar.mooncell.wiki/mc/" + id + "/original.png";
			}
			function getTimeString(time)
			{
				var m = moment(time).locale(mw.config.get("wgUserLanguage"));
				var diff = Date.now() - time;
				if (0 < diff && diff < 24 * 3600 * 1000)
				{
					return m.fromNow();
				} else
				{
					return m.format("LL, HH:mm:ss");
				}
			}
			class Thread
			{
				constructor()
				{
					var template =
						'<div class="comment-thread"><div class="comment-post">' +
						'<div class="comment-avatar">' +
						'<img src=""></img>' +
						"</div>" +
						'<div class="comment-body">' +
						'<div class="comment-user"></div>' +
						'<div class="comment-text"></div>' +
						'<div class="comment-footer">' +
						'<span class="comment-time"></span>' +
						"</div>" +
						"</div></div></div>";
					var object = $(template);
					this.post = null;
					this.object = object;
					this.deletionLock = !1;
					$.data(object[0], "thread", this);
				}
				init(post)
				{
					var object = this.object;
					this.post = post;
					object.attr("id", "comment-" + post.id);
					var userlink;
					if (post.userid !== 0)
					{
						userlink = wrapPageLink("User:" + post.username, post.username);
					} else
					{
						userlink = wrapText(post.username);
					}
					if (post.title)
					{
						var pageLink = wrapPageLink(
							"Special:FlowThreadLink/" + post.id,
							post.title
						);
						userlink = mw.msg(
							"flowthread-ui-user-post-on-page",
							userlink,
							pageLink
						);
					}
					object.find(".comment-user").html(userlink);
					object
						.find(".comment-avatar img")
						.attr("src", getAvatar(post.userid, post.username));
					object.find(".comment-text").html(post.text);
					object
						.find(".comment-time")
						.text(getTimeString(post.timestamp * 1000))
						.siblings()
						.remove();
				}
				addButton(type, text, listener)
				{
					return $("<span>")
						.addClass("comment-" + type)
						.text(text)
						.click(listener)
						.appendTo(this.object.find(".comment-footer"));
				}
				appendChild(thread)
				{
					this.object.append(thread.object);
				}
				prependChild(thread)
				{
					this.object.children(".comment-post").after(thread.object);
				}
				reply()
				{
					if (replyBox)
					{
						replyBox.remove();
					}
					replyBox = createReplyBox(this);
					this.appendChild({ object: replyBox });
				}
				like()
				{
					var api = new mw.Api();
					api.post({
						action: "flowthread",
						type: "like",
						postid: this.post.id,
					});
					this.object.find(".comment-like").first().attr("liked", "");
					this.object.find(".comment-report").first().removeAttr("reported");
				}
				dislike()
				{
					var api = new mw.Api();
					api.post({
						action: "flowthread",
						type: "dislike",
						postid: this.post.id,
					});
					this.object.find(".comment-like").first().removeAttr("liked");
					this.object.find(".comment-report").first().removeAttr("reported");
				}
				report()
				{
					var api = new mw.Api();
					api.post({
						action: "flowthread",
						type: "report",
						postid: this.post.id,
					});
					this.object.find(".comment-like").first().removeAttr("liked");
					this.object.find(".comment-report").first().attr("reported", "");
				}
				delete()
				{
					if (!this.deletionLock)
					{
						this.deletionLock = !0;
						this.object
							.find(".comment-delete")
							.first()
							.text(mw.msg("flowthread-ui-delete_confirmation"));
						this.object
							.find(".comment-delete")
							.first()
							.css("color", "rgb(163, 31,8)");
						var _this = this;
						setTimeout(function ()
						{
							_this.deletionLock = !1;
							_this.object.find(".comment-delete").first().removeAttr("style");
							_this.object
								.find(".comment-delete")
								.first()
								.text(mw.msg("flowthread-ui-delete"));
						}, 1500);
					} else
					{
						var api = new mw.Api();
						api.post({
							action: "flowthread",
							type: "delete",
							postid: this.post.id,
						});
						this.deletionLock = !1;
						this.object.remove();
					}
				}
				markAsPopular()
				{
					this.object.addClass("comment-popular");
					this.object.removeAttr("id");
				}
				static fromId(id)
				{
					return $.data($("#comment-" + id)[0], "thread");
				}
			}
			function wrapText(text)
			{
				var span = $("<span/>");
				span.text(text);
				return span.wrapAll("<div/>").parent().html();
			}
			function wrapPageLink(page, name)
			{
				var link = $("<a/>");
				link.attr("href", mw.util.getUrl(page));
				link.text(name);
				return link.wrapAll("<div/>").parent().html();
			}
			function createReplyBox(thread)
			{
				var replyBox = new ReplyBox(thread);
				replyBox.onSubmit = function ()
				{
					var text = replyBox.getValue().trim();
					if (0 && !text)
					{
						showMsgDialog(mw.msg("flowthread-ui-nocontent"));
						return;
					}
					replyBox.setValue("");
					var api = new mw.Api();
					var req = {
						action: "flowthread",
						type: "post",
						pageid:
							(thread && thread.post.pageid) || mw.config.get("wgArticleId"),
						postid: thread && thread.post.id,
						content: text,
						wikitext: replyBox.isInWikitextMode(),
					};
					api
						.post(req)
						.done(reloadComments)
						.fail(function (error, obj)
						{
							if (obj.error) showMsgDialog(obj.error.info);
							else if (error === "http")
								showMsgDialog(mw.msg("flowthread-ui-networkerror"));
							else showMsgDialog(error);
						});
				};
				return replyBox.object;
			}
			class ReplyBox
			{
				constructor(thread)
				{
					var template =
						'<div class="comment-replybox">' +
						'<div class="comment-avatar">' +
						'<img src="' +
						getAvatar(mw.config.get("wgUserId"), mw.config.get("wgUserName")) +
						'"></img>' +
						"</div>" +
						'<div class="comment-body">' +
						'<textarea placeholder="' +
						mw.msg("flowthread-ui-placeholder") +
						'" style="color:red; font-weight:bold"></textarea>' +
						'<div class="comment-preview" style="display:none;"></div>' +
						'<div class="comment-toolbar">' +
						'<button class="flowthread-btn flowthread-btn-wikitext' +
						(localStorage.flowthread_use_wikitext === "true" ? " on" : "") +
						'" title="' +
						mw.msg("flowthread-ui-usewikitext") +
						'"></button>' +
						'<button class="flowthread-btn flowthread-btn-preview" title="' +
						mw.msg("flowthread-ui-preview") +
						'"></button>' +
						'<button class="comment-submit">' +
						mw.msg("flowthread-ui-submit") +
						"</button>" +
						"</div>" +
						"</div></div>";
					var self = this;
					var object = $(template);
					this.object = object;
					this.thread = thread;
					object.find("textarea").keyup(function (e)
					{
						if (e.ctrlKey && e.which === 13)
							object.find(".comment-submit").click();
						self.pack();
					});
					object.find(".flowthread-btn-preview").click(function ()
					{
						var obj = $(this);
						obj.toggleClass("on");
						var previewPanel = object.find(".comment-preview");
						if (obj.hasClass("on"))
						{
							object.find("textarea").hide();
							previewPanel.show();
							var val = self.getValue().trim();
							if (val)
							{
								var api = new mw.Api();
								api
									.get({
										action: "parse",
										title:
											(thread && thread.post.title) || mw.config.get("wgTitle"),
										prop: "text",
										preview: !0,
										text: val,
									})
									.done(function (result)
									{
										previewPanel.html(result.parse.text["*"]);
									})
									.fail(function (error, obj)
									{
										showErrorDialog(error, obj);
									});
							}
						} else
						{
							object.find("textarea").show();
							previewPanel.hide();
						}
					});
					object.find(".flowthread-btn-wikitext").click(function ()
					{
						var on = $(this).toggleClass("on").hasClass("on");
						if (!on)
						{
							object.find(".flowthread-btn-preview").removeClass("on");
							object.find("textarea").show();
							object.find(".comment-preview").hide();
						}
						localStorage.flowthread_use_wikitext = on;
					});
					object.find(".comment-submit").click(function ()
					{
						if (self.onSubmit) self.onSubmit();
					});
				}
				isInWikitextMode()
				{
					return this.object.find(".flowthread-btn-wikitext").hasClass("on");
				}
				getValue()
				{
					return this.object.find("textarea").val();
				}
				setValue(t)
				{
					return this.object.find("textarea").val(t);
				}
				pack()
				{
					var textarea = this.object.find("textarea");
					textarea.height(1).height(Math.max(textarea[0].scrollHeight, 60));
				}
			}
			function showMsgDialog(text)
			{
				alert(text);
			}
			function showErrorDialog(error, obj)
			{
				if (obj.error) showMsgDialog(obj.error.info);
				else if (error === "http")
					showMsgDialog(mw.msg("flowthread-ui-networkerror"));
				else showMsgDialog(error);
			}
			var canpost = 1 || mw.config.exists("canpost");
			var ownpage =
				1 ||
				mw.config.exists("commentadmin") ||
				(mw.config.get("wgNamespaceNumber") === 2 &&
					mw.config.get("wgTitle").replace("/$", "") ===
					mw.config.get("wgUserName"));
			function createThread(post)
			{
				var thread = new Thread();
				var object = thread.object;
				thread.init(post);
				if (canpost)
				{
					thread.addButton("reply", mw.msg("flowthread-ui-reply"), function ()
					{
						thread.reply();
					});
				}
				if (mw.config.get("wgUserId") !== 0)
				{
					var likeNum = post.like ? "(" + post.like + ")" : "";
					thread.addButton(
						"like",
						mw.msg("flowthread-ui-like") + likeNum,
						function ()
						{
							if (
								object.find(".comment-like").first().attr("liked") !== undefined
							)
							{
								thread.dislike();
							} else
							{
								thread.like();
							}
						}
					);
					thread.addButton(
						"report",
						mw.msg("flowthread-ui-report"),
						function ()
						{
							if (
								object.find(".comment-report").first().attr("reported") !==
								undefined
							)
							{
								thread.dislike();
							} else
							{
								thread.report();
							}
						}
					);
				} else if (post.like)
				{
					var likeMsg = mw.msg("flowthread-ui-like") + "(" + post.like + ")";
					$("<span>")
						.addClass("comment-like")
						.css("cursor", "text")
						.text(likeMsg)
						.appendTo(thread.object.find(".comment-footer"));
				}
				if (
					ownpage ||
					(post.userid && post.userid === mw.config.get("wgUserId"))
				)
				{
					thread.addButton(
						"delete",
						mw.msg("flowthread-ui-delete"),
						function ()
						{
							thread.delete();
							if (
								$(".comment-container-top").children(".comment-thread")
									.length === 0
							)
							{
								$(".comment-container-top").attr("disabled", "");
							}
						}
					);
				}
				if (post.myatt === 1)
				{
					object.find(".comment-like").attr("liked", "");
				} else if (post.myatt === 2)
				{
					object.find(".comment-report").attr("reported", "");
				}
				return thread;
			}
			function reloadComments(offset)
			{
				offset = offset || 0;
				var api = new mw.Api();
				api
					.get({
						action: "flowthread",
						type: "list",
						pageid: mw.config.get("wgArticleId"),
						offset: offset,
						utf8: "",
					})
					.done(function (data)
					{
						$(".comment-container-top")
							.html("<div>" + mw.msg("flowthread-ui-popular") + "</div>")
							.attr("disabled", "");
						$(".comment-container").html("");
						//var canpostbak = canpost;
						//canpost = !1;
						data.flowthread.popular.forEach(function (item)
						{
							var obj = createThread(item);
							obj.markAsPopular();
							$(".comment-container-top")
								.removeAttr("disabled")
								.append(obj.object);
						});
						//canpost = canpostbak;
						data.flowthread.posts.forEach(function (item)
						{
							var obj = createThread(item);
							if (item.parentid === "")
							{
								$(".comment-container").append(obj.object);
							} else
							{
								Thread.fromId(item.parentid).appendChild(obj);
							}
						});
						pager.current = Math.floor(offset / 10);
						pager.count = Math.ceil(data.flowthread.count / 10);
						pager.repaint();
						if (location.hash.substring(0, 9) === "#comment-")
						{
							var hash = location.hash;
							location.replace("#");
							location.replace(hash);
						}
					});
			}
			function setFollowUp(postid, follow)
			{
				var obj = $("#comment-" + postid + " > .comment-post");
				obj.after(follow);
			}
			class Paginator
			{
				constructor()
				{
					this.object = $('<div class="comment-paginator"></div>');
					this.current = 0;
					this.count = 1;
				}
				add(page)
				{
					var item = $("<span>" + (page + 1) + "</span>");
					if (page === this.current)
					{
						item.attr("current", "");
					}
					item.click(function ()
					{
						reloadComments(page * 10);
					});
					this.object.append(item);
				}
				addEllipse()
				{
					this.object.append("<span>...</span>");
				}
				repaint()
				{
					this.object.html("");
					if (this.count <= 1)
					{
						this.object.hide();
					} else
					{
						this.object.show();
					}
					var pageStart = Math.max(this.current - 2, 0);
					var pageEnd = Math.min(this.current + 4, this.count - 1);
					if (pageStart !== 0)
					{
						this.add(0);
					}
					if (pageStart > 1)
					{
						this.addEllipse();
					}
					for (var i = pageStart; i <= pageEnd; i++)
					{
						this.add(i);
					}
					if (this.count - pageEnd > 2)
					{
						this.addEllipse();
					}
					if (this.count - pageEnd !== 1)
					{
						this.add(this.count - 1);
					}
				}
			}
			var pager = new Paginator();
			$("#bodyContent").after(
				'<div class="comment-container-top" disabled></div>',
				'<div class="comment-container"></div>',
				pager.object,
				(function ()
				{
					if (canpost) return createReplyBox(null);
					var noticeContainer = $("<div>").addClass("comment-bannotice");
					noticeContainer.html(config.CantPostNotice);
					return noticeContainer;
				})()
			);
			if (mw.util.getParamValue("flowthread-page"))
			{
				reloadComments(
					(parseInt(mw.util.getParamValue("flowthread-page")) - 1) * 10
				);
			} else
			{
				reloadComments();
			}
		},
		{
			css: [
				'.comment-body textarea,.comment-preview{ margin:0px;padding:10px;resize:none;box-sizing:border-box;width:100%; display:block;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:13px;line-height:20px; border-width:1px 1px medium;border-style:solid solid none;border-color:#CCC #CCC #999;border-radius:3px 3px 0px 0px;background:white}.comment-body textarea{color:#999;height:60px}.comment-preview{min-height:70px;padding-top:0px}.comment-preview{background:#f8f8f8}.comment-toolbar{position:relative;height:32px;color:#555;padding-left:10px;font-size:12px;line-height:32px;border:1px solid #CCC;border-radius:0px 0px 3px 3px;background:white;box-sizing:border-box;margin-bottom:1em}.comment-submit{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;position:absolute;right:-1px;top:-1px;height:32px;width:100px;text-align:center;text-shadow:0px 1px 0px #FFF;color:#555;font-size:14px;font-weight:bold;border:1px solid #CCC;background-color:white;transition:all 0.3s ease-out;box-shadow:0px 0px 0px white inset,0px 0px 0px white;cursor:pointer;margin:0px;padding:0px;border-radius:0px 0px 3px 0px;outline:0}.comment-submit:hover{box-shadow:0px 0px 0px white inset,0 5px 11px 0 rgba(0,0,0,0.18)}.comment-submit:active{box-shadow:0px 2px 4px rgba(0,0,0,0.15) inset,0px 0px 0px white}.flowthread-btn{position:relative;top:-1px;float:left;width:24px;height:24px;margin:4px;padding:0px;border-radius:10%;outline:0;border:0 white;box-sizing:border-box;background-repeat:no-repeat;background-position:center;background-color:transparent;transition:all 0.3s ease-out}.flowthread-btn::-moz-focus-inner,.comment-submit::-moz-focus-inner{border:0}.flowthread-btn:hover{border:1px solid #CCC;box-shadow:0px 0px 0px white inset,0 5px 11px 0 rgba(0,0,0,0.18)}.flowthread-btn:active,.flowthread-btn.on{border:1px solid #CCC;box-shadow:0px 2px 4px rgba(0,0,0,0.15) inset,0px 0px 0px white}.flowthread-btn.on:hover{border:1px solid #CCC;box-shadow:0px 2px 4px rgba(0,0,0,0.15) inset,0 5px 11px 0 rgba(0,0,0,0.18)}.flowthread-btn.on:active{border:1px solid #CCC;box-shadow:0px 0px 0px white inset,0 0 0 0 white}.flowthread-btn-preview{width:0px;margin:4px 0;opacity:0;background-image:url(/extensions/FlowThread/assets/preview.svg?a181a)}.flowthread-btn-wikitext{background-image:url(/extensions/FlowThread/assets/wikitext.svg?e4407)}.flowthread-btn-wikitext.on+.flowthread-btn-preview{width:24px;margin:4px;opacity:1}.comment-reply::before,.comment-like::before,.comment-report::before,.comment-delete::before,.comment-recover::before{content:"";background:transparent url(/extensions/FlowThread/assets/sprites.png?e1980) no-repeat scroll 0% 0%;opacity:0.6;display:inline-block;width:15px;height:10px;transition:opacity 0.15s linear 0s;font-size:9px;vertical-align:middle}.comment-reply,.comment-like,.comment-report,.comment-delete{margin-left:5px;cursor:pointer;transition:color 0.15s linear 0s}.comment-reply:hover,.comment-like:hover,.comment-report:hover,.comment-delete:hover{opacity:1.0;color:#555}.comment-reply:hover::before,.comment-like:hover::before,.comment-report:hover::before,.comment-delete:hover::before{opacity:1.0}.comment-reply::before{background-position:0px 0px}.comment-like::before{background-position:0px -14px}.comment-like[liked]::before{background-position:0px -27px}.comment-report::before{background-position:0px -50px}.comment-report[reported]::before{background-position:0px -62px}.comment-delete::before{background-position:0px -40px}.comment-avatar img{width:50px;height:50px}.comment-thread \u003E div:not(:first-child) .comment-avatar img{width:30px;height:30px}.comment-thread \u003E div:not(:first-child) .comment-body{padding-left:40px}.comment-thread .comment-replybox{margin-left:50px}.comment-container-top,.comment-container,.comment-paginator,.comment-bannotice,.comment-replybox{margin:0 1em}.comment-avatar{float:left}.comment-thread{border-top:1px solid rgba(0,0,0,0.13)}.comment-post{padding:10px} .comment-container-top[disabled] + .comment-container{margin-top:2em}.comment-body{padding-left:60px}.comment-user,.comment-user a{color:#777;font-size:13px;margin-right:8px}.comment-text{font-size:13px;line-height:1.5em;margin:0.5em 0px;word-wrap:break-word; position:relative;overflow:hidden;min-height:1em}.comment-footer{font-size:12px;margin-right:8px;color:#999}.comment-post .comment-report,.comment-post .comment-delete{display:none}.comment-post:hover .comment-report,.comment-report[reported],.comment-post:hover .comment-delete{display:initial}.comment-thread .comment-thread{margin-left:40px}.comment-paginator{border-top:1px solid rgba(0,0,0,0.13);text-align:right;padding:0.5em}.comment-paginator span{color:#777;border-radius:3px;font-size:12px;margin:0 3px;padding:2px 5px;border:1px solid transparent;cursor:pointer}.comment-paginator span:hover{color:#333;background-color:rgba(0,0,0,0.03)}.comment-paginator span[current]{color:#d32;border:1px solid #ccc;background-color:rgba(0,0,0,0.03)}.comment-bannotice{border-top:1px solid rgba(0,0,0,0.13);font-size:13px;text-align:center;padding:1em;color:#777}.comment-container-top{border:1px #CCC solid;margin-top:2em;border-radius:5px}.comment-container-top[disabled]{display:none} .comment-container-top \u003E div:first-child{background:#f8f8f8;height:24px;line-height:24px;color:#555;text-indent:1em;font-size:small;border-radius:5px 5px 0 0}.comment-container-top \u003E div:last-child{border-radius:0 0 5px 5px}.comment-container-top:not([disabled]) + .comment-container \u003E div:first-child{border-top:0}',
			],
		},
		{
			"flowthread-ui-delete": "Delete",
			"flowthread-ui-delete_confirmation": "Conform Deletion",
			"flowthread-ui-like": "Like",
			"flowthread-ui-networkerror": "Cannot connect to the server.",
			"flowthread-ui-nocontent": "Content cannot be empty.",
			"flowthread-ui-placeholder":
				"This is a hint from the alternative flowthread. THINK TWICE before you post.",
			"flowthread-ui-popular": "Popular Posts",
			"flowthread-ui-preview": "Preview",
			"flowthread-ui-reply": "Reply",
			"flowthread-ui-report": "Report",
			"flowthread-ui-submit": "Submit",
			"flowthread-ui-useroptout":
				"Comments are disabled upon user request. Please go to discussion page instead.",
			"flowthread-ui-usewikitext": "Use Wikitext",
		}
	);
}

$(loadMAF);
