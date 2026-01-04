// ==UserScript==
// @name         老男人助手
// @namespace    http://tampermonkey.net/
// @version      0.8.16
// @description  适用于老男人游戏论坛:https://bbs.oldmantvg.net/ 的小工具
// @author       rock128
// @match        https://bbs.oldmanemu.net/*
// @match        https://bbs.oldmantvg.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdnjs.webstatic.cn/ajax/libs/jscolor/2.4.7/jscolor.min.js
// @require      https://cdnjs.webstatic.cn/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.webstatic.cn/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdnjs.webstatic.cn/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @resource css https://cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.css
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/439275/%E8%80%81%E7%94%B7%E4%BA%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/439275/%E8%80%81%E7%94%B7%E4%BA%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
	'use strict';
	GM_addStyle(GM_getResourceText("css"));

	// 旋转图片
	// 自动组合云盘链接
	// 与佛论禅编解码

	var VERSION = 1;

	//所有的功能都在这里定义
	var settingObject = {
		autoSignIn: {
			// 和所属对象属性名保持一致
			id: "autoSignIn",
			// 显示在界面上的标题
			title: "自动签到",
			// 配置变化时是否需要重新加载页面
			needReload: false,
			// 所有用到的配置全部写在这里，config对象会持久化
			// 除 enable 属性外，其他属性要在 configKeyElementMaps 中定义一个同名属性来映射页面元素
			config: {
				enable: false,
				signTitle: "签到"
			},
			// 该功能用到的 config 属性名和 元素class/id的映射
			configKeyElementMaps: {
				// 这行含义是: config.signTitle  和页面上id为sign-key的标签值是对应着的
				signTitle: {
					element: "#sign-key"
				}
			},
			// 功能生效的前提条件检查
			matchCondition: function () {
				return Utils.isMatchPageCategory("index") || Utils.isIndexPage()
			},
			// 功能生效的逻辑代码
			doAction: function () {
				if ($("#sign_title").text() == this.config.signTitle) {
					$.xpost(xn.url("my-sign"), "", function (message) {
						$("#sign_title").text("已签")
					});
				}
			},
			// 功能配置的html代码
			contentHtml: function () {
				let html = `
                        <span class="setting-item-desc-text">保持和签到按钮上的文字完全一致<span></br>
                        <input type="text" id="sign-key" value="${this.config.signTitle}" />
                    `
				return Utils.createDivWithTitle("签到按钮文本", html)
			}
		},
		deng: {
			// 和所属对象属性名保持一致
			id: "deng",
			// 显示在界面上的标题
			title: "去掉节日灯笼",
			// 配置变化时是否需要重新加载页面
			needReload: false,
			// 所有用到的配置全部写在这里，config对象会持久化
			// 除 enable 属性外，其他属性要在 configKeyElementMaps 中定义一个同名属性来映射页面元素
			config: {
				enable: false
			},
			// 该功能用到的 config 属性名和 元素class/id的映射
			configKeyElementMaps: {},
			// 功能生效的前提条件检查
			matchCondition: function () {
				return true
			},
			// 功能生效的逻辑代码
			doAction: function () {
				$(".deng") && $(".deng").remove()
			},
			// 功能配置的html代码
			contentHtml: function () {
				return Utils.createMsgDiv("<h3>从所有页面移除节日灯笼</h3>")
			}
		},
		blacklist: {
			// 和所属对象属性名保持一致
			id: "blacklist",
			// 显示在界面上的标题
			title: "黑名单",
			// 配置变化时是否需要重新加载页面
			needReload: false,
			// 所有用到的配置全部写在这里，config对象会持久化
			// 除 enable 属性外，其他属性要在 configKeyElementMaps 中定义一个同名属性来映射页面元素
			config: {
				enable: false,
				blacklist: {}
			},
			// 该功能用到的 config 属性名和 元素class/id的映射
			configKeyElementMaps: {
				blacklist: {
					element: "#black-list",
					getVal: function () {
						let ret = {}
						if ($(this.element) && $(this.element).val().trim() != "") {
							let info = $(this.element).val().split("\n");
							for (let line of info) {
								let tmpArray = line.split("=")
								ret[tmpArray[0]] = {
									banType: tmpArray[1],
									username: tmpArray[2]
								}
							}
						}
						return ret
					}
				}
			},
			// 功能生效的前提条件检查
			matchCondition: function () {
				return Utils.isMatchPageCategory("") || Utils.isMatchPageCategory("index")
			},
			// 功能生效的逻辑代码
			doAction: function () {
				let configObject = this.config.blacklist
				let isBan = function (userId, type) {
					var blackUserObject = configObject[userId];
					if (!blackUserObject) {
						return false;
					}
					return blackUserObject.banType == type
				}
				let hideBlackListUserContent = function () {
					$(".media.thread.tap") && $(".media.thread.tap").each(function (i, item) {
						var id = $(item).children().eq(0).attr("href")
						id = id.replace("user-", "").replace(".htm", "")
						if (isBan(id, Utils.BLACK_TYPE_ALL) || isBan(id, Utils.BLACK_TYPE_THREAD)) {
							$(item).hide()
						}
					})
					$(".media.post") && $(".media.post").each(function (i, item) {
						var id = $(item).children().eq(0).attr("href")
						id = id.replace("user-", "").replace(".htm", "")
						if (isBan(id, Utils.BLACK_TYPE_ALL) || isBan(id, Utils.BLACK_TYPE_REPLY)) {
							$(item).hide()
						}
					})
				}
				hideBlackListUserContent()
				$(".avatar-3").mouseenter(function () {
					var href = $(this).parent().attr("href")
					var userId = href.split("-")[1].split(".")[0]
					var name = ""
					try {
						// 帖子列表页的路径
						var text = $(this).parent().next().find(".icon-user-o").parent().text()
						name = text.split("于")[0].trim()
						if (name == "") {
							// 帖子详情页的路径
							text = $(this).parent().next().find(".username").first().text()
							name = text.trim()
						}
					} catch (e) {
						console.log(e.message);
					}
					let clickCallBack = function () {
						var id = $(this).attr("user-id")
						var username = $(this).attr("user-name")
						var banType = $(this).attr("banType")
						configObject[id] = {
							banType: banType,
							username: username
						}
						hideBlackListUserContent()
						$("#user-operate-menu").hide();
						Utils.saveConfig(settingObject.blacklist.id)
					}
					let operateMenu = $("#user-operate-menu")
					operateMenu.empty()
					let buttons = [
						Utils.createBlackTypeButton(Utils.BLACK_TYPE_THREAD, userId, name, "屏蔽用户帖子", true),
						Utils.createBlackTypeButton(Utils.BLACK_TYPE_REPLY, userId, name, "屏蔽用户在帖子中的回复", true),
						Utils.createBlackTypeButton(Utils.BLACK_TYPE_ALL, userId, name, "全部屏蔽", true)
					]
					for (let button of buttons) {
						$(button).click(clickCallBack);
						operateMenu.append(button)
					}
					operateMenu.css("position", "absolute");
					operateMenu.css("top", $(this).offset().top);
					operateMenu.css("left", $(this).offset().left - 70);
					operateMenu.show();
					operateMenu.unbind()
					operateMenu.mouseleave(function () {
						operateMenu.hide();
					})
				})
				$('.avatar-3').mouseleave(function () {
					var href = $(this).parent().attr("href")
					var offset = $("#user-operate-menu").offset()
					var width = $("#user-operate-menu").outerWidth(true) + 10
					var height = $("#user-operate-menu").outerHeight(true) + 10
					if (window.__xx && window.__yy) {
						if (window.__xx > Math.ceil(offset.left + width) || window.__yy > Math.ceil(offset.top + height) || window.__xx < Math.ceil(offset.left) || window.__yy < Math.ceil(offset.height)) {
							$("#user-operate-menu").hide();
						}
					}
					//console.log("mouse:"+window.__xx+","+window.__yy+"   div:"+offset.left+","+offset.top+","+width+","+height+"  "+Math.ceil(offset.left + width)+","+Math.ceil(offset.top + height))        
				})
			},
			// 功能配置的html代码
			contentHtml: function () {
				let genBlackList = function () {
					var blackUserInfo = []
					for (let key in this.config.blacklist) {
						let blackUserObject = this.config.blacklist[key]
						blackUserInfo.push(key + "=" + blackUserObject.banType + "=" + blackUserObject.username)
					}
					return blackUserInfo.join("\n")
				}
				let html = `
            <textarea placeholder="要屏蔽的用户id，一行一条配置" class="setting-textarea" id="black-list">${genBlackList.bind(this)()}</textarea>
                    `
				return Utils.createDivWithTitle("名单", html)
			}
		},
		autoReply: {
			// 和所属对象属性名保持一致
			id: "autoReply",
			// 显示在界面上的标题
			title: "一键回复隐藏帖子",
			// 配置变化时是否需要重新加载页面
			needReload: false,
			// 所有用到的配置全部写在这里，config对象会持久化
			// 除 enable 属性外，其他属性要在 configKeyElementMaps 中定义一个同名属性来映射页面元素
			config: {
				enable: false,
				msgTemplates: []
			},
			// 该功能用到的 config 属性名和 元素class/id的映射
			configKeyElementMaps: {
				msgTemplates: {
					element: "#auto-reply",
					getVal: function () {
						let val = $(this.element).val().trim()
						return val == "" ? [] : val.split("\n")
					}
				}
			},
			// 功能生效的前提条件检查
			matchCondition: function () {
				return Utils.isMatchPageCategory("thread") && !Utils.hasElement("#oneKeyReplyButton")
			},
			// 功能生效的逻辑代码
			doAction: function () {
				let msgTemplates = this.config.msgTemplates
				if (msgTemplates.length == 0) {
					return
				}
				if (!$(".alert-warning") || $(".alert-warning").text().indexOf("此处隐藏内容请回复后再查看") == -1) {
					return
				}
				let randomMsg = msgTemplates[Math.floor(Math.random() * msgTemplates.length)];
				var button = $('<button id="oneKeyReplyButton" style="margin-left:10px;border-color: #ff8383;color: #ff8383;" class="btn btn-outline-secondary">一键回复隐藏</button>')
				button.click(function () {
					$(this).remove()
					$(".message .form-control").val(randomMsg)
					$("#quick_reply_form").submit()
				})
				$(".plugin.d-flex.justify-content-center.mt-3").append(button)
			},
			onClose: function () {
				let button = $("#oneKeyReplyButton")
				if (button.length > 0) {
					button.eq(0).remove()
				}
			},
			// 功能配置的html代码
			contentHtml: function () {
				let html = `
                        <div>
                            ${Utils.createDivWithTitle("一键回复消息模板", '<font style="color:red;"><b>为防止过多无意义水贴和减轻服务器压力，自动回复改为手动回复，当帖子存在隐藏内容时，在点赞收藏那一排按钮中加一个一键回复按钮，点击后随机选一条预设回复。<h5>如果帖子没有隐藏，或者没有在下面填写模板回复，按钮不会出现</h5></b><font></br>    <textarea placeholder="页面有隐藏内容时一键回复的消息，一行一条，将随机选一条回复" class="setting-textarea" id="auto-reply">' + this.config.msgTemplates.join("\n") + '</textarea>')}                            
                        </div>
                    `
				return html
			}
		},
		keyboardNavigation: {
			// 和所属对象属性名保持一致
			id: "keyboardNavigation",
			// 显示在界面上的标题
			title: "键盘翻页",
			// 配置变化时是否需要重新加载页面
			needReload: false,
			// 所有用到的配置全部写在这里，config对象会持久化
			// 除 enable 属性外，其他属性要在 configKeyElementMaps 中定义一个同名属性来映射页面元素
			config: {
				enable: false
			},
			// 该功能用到的 config 属性名和 元素class/id的映射
			configKeyElementMaps: {},
			// 功能生效的前提条件检查
			matchCondition: function () {
				return true
			},
			// 功能生效的逻辑代码
			doAction: function () {
				$("input,textarea").focus(function() {
					window.editing = true;
				});

				$("input,textarea").blur(function() {
					window.editing = false;
				});

				$(document).keydown(function (event) {
					if(window.editing){
						return;
					}
					if (event.keyCode == 37) {
						let preA = $(".page-link:contains('◀')")
						if (preA && preA.length > 0) {
							window.location.href = preA.attr("href")
						}
					} else if (event.keyCode == 39) {
						let nextA = $(".page-link:contains('▶')")
						if (nextA && nextA.length > 0) {
							window.location.href = nextA.attr("href")
						}
					}
				});
			},
			// 功能配置的html代码
			contentHtml: function () {
				return Utils.createMsgDiv("<h3>用键盘左右箭头翻页</h3>")
			}
		},
		readMode: {
			// 和所属对象属性名保持一致
			id: "readMode",
			// 显示在界面上的标题
			title: "阅读模式",
			// 配置变化时是否需要重新加载页面
			needReload: false,
			// 所有用到的配置全部写在这里，config对象会持久化
			// 除 enable 属性外，其他属性要在 configKeyElementMaps 中定义一个同名属性来映射页面元素
			config: {
				enable: false,
				backgroundColor: '#C7EDCC',
				fontColor: '#000000'
			},
			// 该功能用到的 config 属性名和 元素class/id的映射
			configKeyElementMaps: {
				backgroundColor: {
					element: "#background-color-input"
				},
				fontColor: {
					element: "#font-color-input"
				}
			},
			// 功能生效的前提条件检查
			matchCondition: function () {
				return true
			},
			// 功能生效的逻辑代码
			doAction: function () {
				let config = this.config
				$(document).find("*").each(function (i, item) {
					if ($(item).attr("id") == "setting-panel") {
						return
					}
					if ($(item).parents('#setting-panel').length > 0) {
						return
					}
					let oldCss = item.style.cssText || ""
					$(item).css("cssText", oldCss + "background-color:" + config.backgroundColor + "!important;color:" + config.fontColor + "!important;background-image:none!important;")
				})
			},
			// 功能配置的html代码
			contentHtml: function () {
				let html = `
                        <div>
                            ${Utils.createDivWithTitle("背景色", ' <input size="7" data-jscolor="{zIndex:9999}" id="background-color-input" value="' + this.config.backgroundColor + '" /> ')}

                            ${Utils.createDivWithTitle("文字颜色", '<input size="7" id="font-color-input" value="' + this.config.fontColor + '" data-jscolor="{zIndex:9999}">')}
                        </div>
                    `
				return html
			}
		},
		doubleClickScrollTop: {
			// 和所属对象属性名保持一致
			id: "doubleClickScrollTop",
			// 显示在界面上的标题
			title: "双击滚动到顶部",
			// 配置变化时是否需要重新加载页面
			needReload: false,
			// 所有用到的配置全部写在这里，config对象会持久化
			// 除 enable 属性外，其他属性要在 configKeyElementMaps 中定义一个同名属性来映射页面元素
			config: {
				enable: false
			},
			// 该功能用到的 config 属性名和 元素class/id的映射
			configKeyElementMaps: {},
			// 功能生效的前提条件检查
			matchCondition: function () {
				return true
			},
			// 功能生效的逻辑代码
			doAction: function () {
				$(document).dblclick("click", function () {
					$('html,body').animate({
						scrollTop: '0px'
					}, 300)
				});
			},
			// 功能配置的html代码
			contentHtml: function () {
				return Utils.createMsgDiv("<h3>在任意界面双击返回顶部</h3>")
			}
		},
		highlightAuthor: {
			// 和所属对象属性名保持一致
			id: "highlightAuthor",
			// 显示在界面上的标题
			title: "高亮楼主",
			// 配置变化时是否需要重新加载页面
			needReload: false,
			// 所有用到的配置全部写在这里，config对象会持久化
			// 除 enable 属性外，其他属性要在 configKeyElementMaps 中定义一个同名属性来映射页面元素
			config: {
				enable: false,
				backgroundColor: '#96a48b',
				quoteColor: '#b7b1a5'
			},
			// 该功能用到的 config 属性名和 元素class/id的映射
			configKeyElementMaps: {
				backgroundColor: {
					element: "#author-background-color-input"
				},
				quoteColor: {
					element: "#author-quote-background-color-input"
				}
			},
			// 功能生效的前提条件检查
			matchCondition: function () {
				return true
			},
			// 功能生效的逻辑代码
			doAction: function () {
				let config = this.config
				$(".badge.badge-secondary.small.haya-post-info-first-floor").each(function () {
					var block = $(this).parent().parent().parent().parent().get(0)
					let oldCss = block.style.cssText || ""
					$(block).css("cssText", oldCss + "background-color:" + config.backgroundColor + "!important;")
					var quote = $(block).find(".blockquote").get(0)
					if (quote) {
						oldCss = quote.style.cssText || ""
						$(quote).css("cssText", oldCss + "background-color:" + config.quoteColor + "!important;")
					}
				})
			},
			// 功能配置的html代码
			contentHtml: function () {
				let html = `
                        <div>
                            ${Utils.createDivWithTitle("背景色", ' <input size="7" data-jscolor="{zIndex:9999}" id="author-background-color-input" value="' + this.config.backgroundColor + '" /> ')}
                            ${Utils.createDivWithTitle("引用背景颜色", '<input size="7" id="author-quote-background-color-input" value="' + this.config.quoteColor + '" data-jscolor="{zIndex:9999}">')}
                        </div>
                    `
				return html
			}
		},
		emojisSupport: {
			// 和所属对象属性名保持一致
			id: "emojisSupport",
			// 显示在界面上的标题
			title: "表情",
			// 配置变化时是否需要重新加载页面
			needReload: false,
			// 所有用到的配置全部写在这里，config对象会持久化
			// 除 enable 属性外，其他属性要在 configKeyElementMaps 中定义一个同名属性来映射页面元素
			config: {
				enable: false
			},
			// 该功能用到的 config 属性名和 元素class/id的映射
			configKeyElementMaps: {},
			// 功能生效的前提条件检查
			matchCondition: function () {
				return Utils.isMatchPageCategory("thread") && !Utils.hasElement(".emojis-panel")
			},
			// 功能生效的逻辑代码
			doAction: function () {
				var emojisPanel = $('<div class="emojis-panel"></div>')
				$("body").append(emojisPanel)
				var emojRange = [
					[128513, 128591],
					[127744, 128511],
					[128640, 128704],
					[9986, 10160]
				];
				for (var i = 0; i < emojRange.length; i++) {
					var range = emojRange[i];
					for (var x = range[0]; x < range[1]; x++) {
						var d = $('<div>&#' + x + ';</div>');
						d.addClass("emoji-item")
						d.attr("code", "0x" + x.toString(16))
						d.click(function () {
							var code = $(this).attr("code")
							var msg = $("#message").val()
							var start = $("#message")[0].selectionStart
							var end = $("#message")[0].selectionEnd
							$("#message").val(msg.substring(0, start) + String.fromCodePoint(code) + msg.substring(end, msg.length))
						})
						emojisPanel.append(d)
					}
				}
				var button = $('<div class="open-emoji-panel">&#128516;</div>')
				$(button).click(function () {
					if ($(".emojis-panel").css("display") === 'none') {
						$(".emojis-panel").css("display", "flex");
						$(".emojis-panel").css("position", "absolute");
						$(".emojis-panel").css("top", $('#message').offset().top - 310);
						$(".emojis-panel").css("left", $('#message').offset().left);
						$(".emojis-panel").show(200);
					} else {
						$(".emojis-panel").hide(200)
					}
				})
				$("#message").focus(function () {
					if ($(".emojis-panel").css("display") != 'none') {
						$(".emojis-panel").hide(200)
					}
				})
				$("#submit").parent().css("display", "flex")
				$("#submit").parent().append(button)
			},
			// 功能配置的html代码
			contentHtml: function () {
				return Utils.createMsgDiv("<h3>表情支持</h3>")
			}
		},
		downloadThreadImages: {
			// 和所属对象属性名保持一致
			id: "downloadThreadImages",
			// 显示在界面上的标题
			title: "一键下载主题图片",
			// 配置变化时是否需要重新加载页面
			needReload: false,
			// 所有用到的配置全部写在这里，config对象会持久化
			// 除 enable 属性外，其他属性要在 configKeyElementMaps 中定义一个同名属性来映射页面元素
			config: {
				enable: false,
				grade: 0
			},
			// 该功能用到的 config 属性名和 元素class/id的映射
			configKeyElementMaps: {
				grade: {
					element: "#grade-input"
				}
			},
			// 功能生效的前提条件检查
			matchCondition: function () {
				return Utils.isMatchPageCategory("thread") && !Utils.hasElement(".package-download-image")
			},
			// 功能生效的逻辑代码
			doAction: function () {
				var grade = this.config.grade
				var title = "打包下载图片"
				var button = $('<button style="margin-left:10px;" class="btn btn-outline-secondary package-download-image">' + title + '</button>')
				button.click(function () {
					$(this).attr("disabled", true);
					if (grade != 0) {
						var jform = $("#reward_form");
						if (jform && jform.attr('action')) {
							$.xpost(jform.attr('action'), "credits1=" + grade);
						}
					}
					var array = [];
					$('.message.break-all').find('img').each(function () {
						let src = $(this).attr("src")
						if (src.indexOf("upload/avatar") == -1 && src.indexOf("view/img/avatar.png") == -1) {
							array.push(src)
						}
					})
					if (array.length == 0) {
						alert("没有图片可供下载!")
						$(this).attr("disabled", false);
						return
					}
					var progress = 0;

					function getBase64Image(images, callback) {
						var img = new Image();
						img.setAttribute("crossOrigin", 'anonymous')
						img.onload = function () {
							var canvas = document.createElement("canvas");
							canvas.width = img.width
							canvas.height = img.height
							canvas.getContext("2d").drawImage(img, 0, 0);
							var dataURL = canvas.toDataURL();
							callback ? callback(dataURL) : null;
						}
						img.src = images;
					}
					var zip = new JSZip()
					var file_name = '图片.zip';
					$(".package-download-image").text("打包进度:(" + progress + "/" + array.length + ")")
					array.forEach(item => {
						getBase64Image(item, function (dataURL) {
							var img_arr = dataURL.split(',');
							let name = progress + "-" + item.substring(item.lastIndexOf("/") + 1)
							zip.file(name, img_arr[1], {
								base64: true
							});
							progress++;
							$(".package-download-image").text("打包进度:(" + progress + "/" + array.length + ")")
							if (Object.keys(zip.files).length == array.length) {
								$(".package-download-image").text("打包完成准备下载")
								zip.generateAsync({
									type: "blob"
								}).then(function (content) {
									$(".package-download-image").attr("disabled", false);
									$(".package-download-image").text(title)
									saveAs(content, file_name);
								});
							}
						})
					})
				})
				$(".plugin.d-flex.justify-content-center.mt-3").append(button)
			},
			// 功能配置的html代码
			contentHtml: function () {
				return Utils.createDivWithTitle("自动打分", `
                            下载的同时自动给楼主帖子打 <input style="width:30px;" type="text" id="grade-input" value="${this.config.grade}" />分(填0或者不填表示不打分)</br>
                        `)
			}
		},
		openPageToNewTab: {
			// 和所属对象属性名保持一致
			id: "openPageToNewTab",
			// 显示在界面上的标题
			title: "新标签页打开帖子",
			// 配置变化时是否需要重新加载页面
			needReload: false,
			// 所有用到的配置全部写在这里，config对象会持久化
			// 除 enable 属性外，其他属性要在 configKeyElementMaps 中定义一个同名属性来映射页面元素
			config: {
				enable: false
			},
			// 该功能用到的 config 属性名和 元素class/id的映射
			configKeyElementMaps: {},
			// 功能生效的前提条件检查
			matchCondition: function () {
				return true
			},
			// 功能生效的逻辑代码
			doAction: function () {
				$('.subject.break-all a').each(function () {
					$(this).attr("target", "_blank")
				})
			},
			// 功能配置的html代码
			contentHtml: function () {
				return Utils.createMsgDiv("<h3>打开帖子时新开一个标签页</h3>")
			}
		},
		onlyViewAuthor: {
			// 和所属对象属性名保持一致
			id: "onlyViewAuthor",
			// 显示在界面上的标题
			title: "只看楼主",
			// 配置变化时是否需要重新加载页面
			needReload: false,
			// 所有用到的配置全部写在这里，config对象会持久化
			// 除 enable 属性外，其他属性要在 configKeyElementMaps 中定义一个同名属性来映射页面元素
			config: {
				enable: false
			},
			// 该功能用到的 config 属性名和 元素class/id的映射
			configKeyElementMaps: {},
			// 功能生效的前提条件检查
			matchCondition: function () {
				return Utils.isMatchPageCategory("thread") && !Utils.hasElement(".only-author-btn")
			},
			// 功能生效的逻辑代码
			doAction: function () {
				let open = "只看楼主"
				let close = "全部显示"
				var button = $('<button style="margin-left:10px;" class="btn btn-outline-secondary only-author-btn">' + open + '</button>')
				button.click(function () {
					if ($(this).text() == open) {
						$(".avatar-3").each(function () {
							let authorId = $("div.media").eq(0).find("a").eq(0).attr("href").replace("user-", "").replace(".htm", "")
							let uid = $(this).parent().attr("href").replace("user-", "").replace(".htm", "")
							if (authorId != uid) {
								$(this).parent().parent().addClass("only-author-btn-mark")
							}
						})
						$(".only-author-btn-mark").hide(100)
						button.text(close)
					} else {
						$(".only-author-btn-mark").show(100)
						$(".only-author-btn-mark").removeClass("only-author-btn-mark")
						button.text(open)
					}
				})
				$(".plugin.d-flex.justify-content-center.mt-3").append(button)
			},
			// 功能配置的html代码
			contentHtml: function () {
				return Utils.createMsgDiv("<h3>打开后帖子里会添加一个“只看楼主”按钮，点击后，当前页面只显示楼主的回复</h3>")
			}
		},
		replyAdditionNumber: {
			// 和所属对象属性名保持一致
			id: "replyAdditionNumber",
			// 显示在界面上的标题
			title: "回复楼层号",
			// 配置变化时是否需要重新加载页面
			needReload: false,
			// 所有用到的配置全部写在这里，config对象会持久化
			// 除 enable 属性外，其他属性要在 configKeyElementMaps 中定义一个同名属性来映射页面元素
			config: {
				enable: false
			},
			// 该功能用到的 config 属性名和 元素class/id的映射
			configKeyElementMaps: {},
			// 功能生效的前提条件检查
			matchCondition: function () {
				return Utils.isMatchPageCategory("thread") && !Utils.hasElement(".bindReplyAdditionNumberEventMark")
			},
			// 功能生效的逻辑代码
			doAction: function () {
				if (Utils.hasElement(".icon-reply")) {
					$(".icon-reply").eq(0).addClass("bindReplyAdditionNumberEventMark")
					$(".icon-reply").click(function () {
						let number = $(this).parent().next().text().trim()
						number = "回复" + number + ": "
						var msg = $("#message").val()
						if (!msg.startsWith(number)) {
							$("#message").val(number + msg)
						}
					})
				}
			},
			// 功能配置的html代码
			contentHtml: function () {
				return Utils.createMsgDiv("<h3>当你回复某一楼层时，回复中会自动附带楼层号码</h3>")
			}
		},
		baiduYunLink: {
			// 和所属对象属性名保持一致
			id: "baiduYunLink",
			// 显示在界面上的标题
			title: "百度云链接增强",
			// 配置变化时是否需要重新加载页面
			needReload: false,
			// 所有用到的配置全部写在这里，config对象会持久化
			// 除 enable 属性外，其他属性要在 configKeyElementMaps 中定义一个同名属性来映射页面元素
			config: {
				enable: false
			},
			// 该功能用到的 config 属性名和 元素class/id的映射
			configKeyElementMaps: {},
			// 功能生效的前提条件检查
			matchCondition: function () {
				return Utils.isMatchPageCategory("thread") && !Utils.hasElement(".parseBaiduYunLinkMark")
			},
			// 功能生效的逻辑代码
			doAction: function () {
				var linkpattern = /https?:\/\/pan\.baidu\.com\/s\/[a-zA-Z0-9?=_-]*/
				$(":contains(https://pan.baidu.com/s/)").filter(function () {
					return $(this).children().length === 0
				}).each(function () {
					let parent = $(this).parent()
					let text = parent.text()
					let url = linkpattern.exec(text)[0]
					let code = ""
					let finalUrl = url

					if (url.indexOf("pwd=") == -1) {
						var codepattern = new RegExp(url + ".*(提取码.*)?([a-zA-Z0-9]{4})");
						let match = codepattern.exec(text)
						if (!match || match.length == 0) {
							// 没有找到本链接对应的提取码，略过处理下一个
							return
						}
						code = match[0]
						code = code.replace(url, "")
						code = /[a-zA-Z0-9]{4}/.exec(code)[0]
						code = code.trim()
						finalUrl = finalUrl + "?pwd=" + code
					} else {
						code = /pwd=[a-zA-Z0-9]{4}/.exec(url)[0].replace("pwd=", "")
					}
					let html = parent.html()
					html = html.replace(new RegExp("链接[：:]?"), "")
					html = html.replace(new RegExp("提取码[:：]?"), "")
					html = html.replace(url, "")
					html = html.replace(code, "")
					html = html.replace(new RegExp("--来自百度网盘超级会员V\\d的分享"), "")
					parent.html(html)

					$('.message.break-all').eq(0).append(Utils.createDivWithTitle("老男人助手解析百度云链接结果", '<a class="baiduYunLink" target="_blank" href="' + finalUrl + '">' + finalUrl + '</a> <i url="' + finalUrl + '" style="font-size: 25px;" class="copy-link fa fa-copy"></i><span style="margin-left:5px;display:none;color:red;">链接已经复制到剪贴板</span>', true, "width:100%;border: 2px solid orange;border-style: dashed;", "background-color:#f8f9fa !important;"))

					$(".alert.alert-success").each(function () {
						if ($(this).text().trim() == "" && !Utils.hasElement("img", this)) {
							$(this).hide()
						}
					})

					$(".copy-link").click(function () {
						let url = $(this).attr("url")
						navigator.clipboard.writeText(url)
						let tip = $(this).next()
						tip.show();
						setTimeout(function () {
							tip.hide();
						}, 500)
					})
				})

				$("body").addClass("parseBaiduYunLinkMark")
			},
			// 功能配置的html代码
			contentHtml: function () {
				return Utils.createMsgDiv("<h3>把百度云链接和提取码组合成一个可直接访问的链接，免去手动输入提取码</h3>")
			}
		},
		insertHiddenContent: {
			// 和所属对象属性名保持一致
			id: "insertHiddenContent",
			// 显示在界面上的标题
			title: "插入隐藏内容优化",
			// 配置变化时是否需要重新加载页面
			needReload: false,
			// 所有用到的配置全部写在这里，config对象会持久化
			// 除 enable 属性外，其他属性要在 configKeyElementMaps 中定义一个同名属性来映射页面元素
			config: {
				enable: false
			},
			// 该功能用到的 config 属性名和 元素class/id的映射
			configKeyElementMaps: {},
			// 功能生效的前提条件检查
			matchCondition: function () {
				return Utils.isMatchPageCategory("thread-create") && !Utils.hasElement(".insertHiddenContentMark")
			},
			// 功能生效的逻辑代码
			doAction: function () {
				let loginDisplay = $(".btn.btn-primary").eq(0)
				let replyDisplay = $(".btn.btn-primary").eq(1)

				loginDisplay.attr("onclick", "")
				replyDisplay.attr("onclick", "")

				loginDisplay.unbind()
				replyDisplay.unbind()

				loginDisplay.click(function () {
					let c = prompt("以下填写内容其他人登录可见：")
					if (c && c.trim().length > 0) {
						try {
							UM.getEditor('message').setContent('[ttlogin]' + c + '[/ttlogin]', true)
						} catch (err) {
							document.getElementById('message').innerHTML += '[ttlogin]' + c + '[/ttlogin]';
						}
					}
				})

				replyDisplay.click(function () {
					let c = prompt("以下填写内容其他人回复可见：")
					if (c && c.trim().length > 0) {
						try {
							UM.getEditor('message').setContent('[ttreply]' + c + '[/ttreply]', true)
						} catch (err) {
							document.getElementById('message').innerHTML += '[ttreply]' + c + '[/ttreply]';
						}
					}
				})

				$("body").addClass("insertHiddenContentMark")
			},
			// 功能配置的html代码
			contentHtml: function () {
				return Utils.createMsgDiv("<h3>发帖页面插入隐藏内容按钮优化</h3>")
			}
		},
		replyFixed: {
			// 和所属对象属性名保持一致
			id: "replyFixed",
			// 显示在界面上的标题
			title: "回复框吸附",
			// 配置变化时是否需要重新加载页面
			needReload: false,
			// 所有用到的配置全部写在这里，config对象会持久化
			// 除 enable 属性外，其他属性要在 configKeyElementMaps 中定义一个同名属性来映射页面元素
			config: {
				enable: false
			},
			// 该功能用到的 config 属性名和 元素class/id的映射
			configKeyElementMaps: {},
			// 功能生效的前提条件检查
			matchCondition: function () {
				return Utils.isMatchPageCategory("thread") && !Utils.hasElement(".replyFixed")
			},
			// 功能生效的逻辑代码
			doAction: function () {
				$("#message").focus(function () {
					Utils.setFixedReplyState(true)
				})
				$("body").addClass("replyFixed")
			},
			// 功能配置的html代码
			contentHtml: function () {
				return Utils.createMsgDiv("<h3>功能打开后，当在帖子详情页面里，回复框获得焦点后，回复框会吸附在屏幕底部</h3>")
			}
		},
		InfiniteScrolling: {
			// 和所属对象属性名保持一致
			id: "InfiniteScrolling",
			// 显示在界面上的标题
			title: "瀑布流评论区",
			// 配置变化时是否需要重新加载页面
			needReload: false,
			// 所有用到的配置全部写在这里，config对象会持久化
			// 除 enable 属性外，其他属性要在 configKeyElementMaps 中定义一个同名属性来映射页面元素
			config: {
				enable: false
			},
			// 该功能用到的 config 属性名和 元素class/id的映射
			configKeyElementMaps: {},
			// 功能生效的前提条件检查
			matchCondition: function () {
				return Utils.isMatchPageCategory("thread") && !Utils.hasElement(".InfiniteScrolling")
			},
			// 功能生效的逻辑代码
			doAction: function () {
				// 分页区域
				$(".pagination.my-4.justify-content-center.flex-wrap").hide()
				let last = $(".pagination.my-4.justify-content-center.flex-wrap").eq(0).children().last()
				if (last.text() == "▶") {
					last = last.prev()
				}
				if (last.text() == "") {
					return
				}
				// 评论区域
				let replyZone = $(".card.card-postlist").find(".list-unstyled.postlist").eq(0).children()
				// 没有回复时，length是2
				if (!replyZone || replyZone.length <= 2) {
					return;
				}
				// 分页数
				let pageCount = parseInt(last.text());
				let lastReplyElement = null;
				let currentLoadPage = 1;
				// 获取评论区最后一条评论
				let getLastReplyElement = function () {
					return $(".card.card-postlist").find(".list-unstyled.postlist").eq(0).children().eq(-3)[0]
				}
				// 监听评论区最后一条评论
				let observeLastReplyElement = function () {
					if (lastReplyElement) {
						observer.unobserve(lastReplyElement);
					}
					if (currentLoadPage >= pageCount) {
						return
					}
					lastReplyElement = getLastReplyElement()
					if (!lastReplyElement) {
						return
					}
					observer.observe(lastReplyElement);
				}
				let nextPageUrl = function () {
					currentLoadPage++
					let href = window.location.pathname
					href = href.replace(".htm", "")
					href = href + "-" + currentLoadPage + ".htm"
					return href
				}
				const observer = new IntersectionObserver(entries => {
					entries.forEach(entry => {
						if (entry.isIntersecting) {
							// 这时滚动到本页最后一条回复位置了，加载下一页数据
							Utils.fetchHtml(nextPageUrl(), function (object) {
								let data = object.find(".card.card-postlist").find(".list-unstyled.postlist").eq(0).children()
								if (data && data.length > 2) {
									let index = 0
									let endIndex = data.length - 2
									while (index < endIndex) {
										data.eq(index).find(".floor.mr-0").text((currentLoadPage - 1) * 20 + index + 1)
										let last = getLastReplyElement()
										last.after(data[index])
										index++
									}
									// 加载了新内容，应用下高亮楼主逻辑
									Utils.applyFunction("highlightAuthor")
								}
								observeLastReplyElement()
							}, true)
						}
					});
				});
				observeLastReplyElement()

				// 打开回复框吸附
				Utils.setFixedReplyState(true)

				$("body").addClass("InfiniteScrolling")
			},
			// 功能配置的html代码
			contentHtml: function () {
				return Utils.createMsgDiv("<h6>在帖子详情页面，去掉了页码显示。如果有很多页，鼠标滚动到最后一条评论位置时，自动加载下一页评论，拼接在后面。<br><font style='color:red'>假设点进帖子时，评论有3页，那么最多自动加载页数会固定为3,在阅读评论期间且没刷新过页面时，评论已经到4页，该功能不会自动加载第4页的内容，此时需要手动刷新页面来重置自动加载页数。这么做是防止在最后一页时，滚动页面，导致反复触发请求服务器新数据，减轻服务器压力</font></h6>")
			}
		},
		cnTransverter: {
			// 和所属对象属性名保持一致
			id: "cnTransverter",
			// 显示在界面上的标题
			title: "中文简繁转换",
			// 配置变化时是否需要重新加载页面
			needReload: true,
			// 所有用到的配置全部写在这里，config对象会持久化
			// 除 enable 属性外，其他属性要在 configKeyElementMaps 中定义一个同名属性来映射页面元素
			config: {
				enable: false,
				mode: 0, // 0=手动  1=自动
				isTW: false, // 是否是台湾地区
				autoModeDelay: 500, // 自动转换模式下防抖函数时间参数，毫秒
				autoModeTransformType: 0, // 0=自动繁转简   1=自动简转繁
			},
			// 该功能用到的 config 属性名和 元素class/id的映射
			configKeyElementMaps: {
				mode: {
					getVal: function () {
						return $('input[type="radio"][name="mode"]:checked').val()
					}
				},
				isTW: {
					getVal: function () {
						let m = $('input[type="radio"][name="area"]:checked')
						return m && (m.val() == "true" || m.val() == true)
					}
				},
				autoModeDelay: {
					element: "#autoModeDelay-input"
				},
				autoModeTransformType: {
					element: "#autoModeTransformType"
				}
			},
			// 功能生效的前提条件检查
			matchCondition: function () {
				return !Utils.hasElement(".cnTransverter")
			},
			// 功能生效的逻辑代码
			doAction: function () {
				var simplified_chinese = '锕爱碍蔼皑剀嗳嫒暧瑷硙锿阂霭叆埯谙钳铵阴顸鹌腌袄奥翱嚣媪岙浇硗骜鳌罢坝钯鲅鲌摆败呗办颁绊坂辩钣帮绑镑谤岗纺报饱宝剥鲍鸨龅备贝辈钡狈惫鹎贲绷镚笔闭毕币毙哔复滗筚纰荜虑诐费赑跸铋闬鲾边变编贬辫拼笾缏鳊标镖镳飑飙骠骉鳔别鳖瘪别鳖濒宾摈滨频傧殡缤膑髌鬓并饼槟禀绠拨驳钵铂卜泼发袯钹镈饽馎鹁补扑钚钸碜财蚕残掺参惨惭灿戋浅骖鲹黪仓沧舱苍伧玱鸧艹册侧测厕帻恻栅层缯诧钗锸镲馇侪虿龇单产缠搀阐颤铲谗蝉馋刬啴冁团婵崭惮忏掸浐渐产禅胀蒇裣觇谄谶长场厂尝肠畅偿伥傥尝怅枨玚苌锠阊鲳鲿绰钞唠涛绉诌鼌车彻砗称尘沉陈衬栈榇渖谌闯龀撑诚惩骋枪柽蛏赪铛迟痴齿耻驰炽啸扦抬滞离饬鸱冲虫宠佣桩烛种冲铳丑绸筹踌畴俦帱梼诪雠处锄触橱础储厨雏憷恹绌刍诎诸蹰传创疮怆戗锤邮纯莼辁鹑缀辍镞龊词辞赐兹荠鹚从丛葱聪囱枞纵总苁骢凑薮辏窜蹿攒撺镩缞错营躜锉鹾达哒垯胆荙跶迭鞑带贷绐诒轪递隶叇骀驮担弹诞郸坛殚瘅箪赡当党挡档荡垱凼烫珰疡砀筜裆谠岛盗捣导祷焘鱽灯邓镫敌缔涤籴约莜觌诋谛适镝题点电淀颠垫巅癫钿钓调鸟粜赵轺铞鲷鸼叠谍绖轶鲽鳎钉顶订锭铤饤丢铥动东冻栋岽胨鸫斗读渎窦钭饾独镀赌犊枢椟牍笃锗阇黩断锻缎簖对队兑怼镦吨顿钝炖趸夺堕亸椭泽缍铎饳饿额鹅讹恶疴哑垭垩桠猡谔轭锇锷阏颚鳄鹗腭贰儿饵尔迩铒鲕鸸罚阀珐废酦饭烦贩范矾钒枫沨访钫鲂鳑飞诽绋绯鲱坟奋愤纷粪偾喷豮鲼风缝丰疯冯讽凤锋沣砜赗负缚赋辅妇抚辐肤讣呒绂幞赙锫韨驸鲋鳆凫麸轧夹钆该盖钙赅赶干赣秆尴绀鳡刚钢纲冈戆沟颃镐皋藁缟诰锆个搁阁鸽铬纥钾铪镉闸颌鲄给颈亘赓鲠鹒宫贡巩龚红唝够钩购构区缑觏诟钩鞴鸲顾蛊贾哌谷诂轱毂钴锢馉鲴鸪鹄鹘剐呙挂诖铦鸹哙关观馆惯贯纶掼权沦鳏鹳广扩横犷归贵轨规硅柜龟诡闺刽伪伪刿匦匮妫桧洼绘鲑鳜滚辊浑绲衮锟鲧过国锅涡划埚帼掴椁腘蜗蝈锞馃虾吓为还骇颏汉韩滩钤阚颔绗号灏胶蚝颢贺鹤呵缴蝎诃辂辖阖饸阋鹖龁鸻轰鸿纮荭讧闳闹黉后糇鲘鲎户壶护沪戏浒芦许轷鳠鹕鹱话画华哗婳桦浍狯铧骅坏怀换唤环缓欢涣焕痪奂缳锾镮阛鲩黄谎锽鳇会挥汇辉毁秽贿讳烩诲咴哕晖炜珲缋翚翙荟袆诙违阓韦颒溃荤愍缗诨阍馄伙货获祸钬镬几机鸡积记级极计挤纪际绩缉饥蓟辑剂济齐继击讥叽哜洁玑矶秸结羁蕲虮蚁觊讦迹跻霁骑骥鱾鲫鲚鹡赍齑价驾荚颊挟槚浃蛱郏铗颉见减间键贱检简歼监坚艰荐剑溅涧鉴践捡笺俭碱硷拣舰槛缄茧饯堑戬枧滥睑笕缣纤裥谏谮谫钘钱锏闲险鞯骞鳒鲣鹣咸将讲奖浆酱蒋强桨绛姜螀缰鳉脚较觉娇绞搅骄矫轿饺铰侥乔侨却学峤挢桥纠荞鲛鹪节届阶杰诫疖诘锴鲒进仅紧尽劲锦晋谨烬尽卺浕琎缙荩觐赆锓馑静惊经镜净竞径荆鲸茎痉刭弪泾烃胫迳陉靓颕垧滢荧颎蓥旧厩缪阄鸠鹫举锯剧惧驹据鉅屦榉窭篓蒌讵邹锔飓鲏龃鹃绢桊锩镌隽决绝诀珏谲镢阕阙鞒骙军骏钧匀皲馂鲪开凯垲恺忾岂铠锎闿莶馅龛钪闶铐鲓颗课壳缂轲钶骒恳垦龈硁铿抠妪殴眍库裤喾圣绔夸块侩脍蒉郐鲙宽髋矿况旷圹纩诓诳贶邝亏窥馈岿愦篑聩顷壸裈阃鲲鹍阔蜡腊蓝癞镴来赖莱厉崃徕懒梾涞濑睐籁赉铼兰烂拦篮栏揽缆阑谰澜览岚廪斓榄炼褴襕镧锒阆捞劳涝络崂痨耢铑铹乐饹鳓类泪垒镭缧颣诔里礼历丽砾沥鲤励篱俪呖坜栎枥泺洒牦疠砺粝缡莅苈蓠蚀蛎里跞轹逦郦酾锂铄雳飒骊疬鳢鲡鹂俩连联练莲恋脸链敛怜帘镰涟奁娈挛殓潋琏蔹裢鲢两辆凉粮谅唡蹒辌魉疗辽镣缭钌镠鹩猎临邻鳞赁凛懔檩渗蔺躏辚领铃灵岭龄凌棂绫鲮鸰陆刘馏偻游浏绺铆锍镏飗骝鹠鹨龙拢笼聋垄咙陇咔昽胧栊泷珑眬砻茏庞楼搂娄喽嵝溇瘘耧蝼镂髅录炉卢鲁卤颅庐掳绿虏赂禄噜垆撸摅橹栌氇渌滤泸箓胪舻辘轳镥鲈鹭鸬乱滦峦孪栾脔銮鸾药锊论轮抡伦仑囵罗锣骡箩萝骆逻啰椤烁荦脶镙驴闾榈吕侣铝屡缕褛稆吗妈马骂码玛蚂么么唛嬷杩犸蓦买卖迈麦脉劢荬满瞒蛮馒谩缦螨颟鳗鹲猫贸锚没务没镁霉谜鹛门们闷懑扪焖钔梦锰黾觅弥幂纟沵猕祢芈谧绵缅渑腼面庙纱缈鹋灭闽悯珉闵鳘鸣铭谬万殁无袜谟镆馍谋亩钼纳钠内镎难摊哝馕闹脑恼挠垴桡蛲铙讷馁拟腻泞滠鲵捻撵辇辗鲇酿袅茑镍聂镊啮嗫摄谂蹑陧颞宁拧柠狞咛宁聍苎纽钮浓农脓侬秾驽疟诺傩钕呕欧鸥沤怄瓯纡讴盘丬抛疱狍赔辔鹏苹罴铍骗谝骈飘朴缥贫嫔颦凭评鲆颇钋钷铺谱镤镨气启弃凄栖脐讫启桤渍碛绮蛴锜颀骐鲯鳍牵签铅钎迁谴谦潜佥悭椠缱羟肷荨鹐墙抢呛蔷嫱庆樯炝襁亲跄锖锵镪翘锹窍硚窑缲诮谯跷铫窃惬箧锲寝钦吣嵚揿骎请轻氢倾庼苘鲭穷琼茕巯虬赇鳅趋驱躯龋岖组觑阒驺劝颧绻诠铨鳈确鹊悫让镶饶绕扰娆荛热认韧纫纴讱轫饪驲绒荣镕嵘缛蝾颂铷颥软锐绥润闰萨杀钑赛鳃伞毵糁馓丧颡扫骚缫鳋涩啬穑铯厦赊鲨晒筛术闪删陕缮姗讪钐骟鳝鳣伤赏汤殇绱觞烧绍绡设慑畲厍叶谁婶肾审绅瘆诜声绳胜时师试识驶势释饰狮视实湿诗尸嘘埘浉绎莳谥贳轼铈铊鲺鲥鸤兽寿绶书树数输属赎竖纾纻镯鹬帅闩双骦鹴税说顺硕丝饲咝厮缌蛳锶飔饴驷鸶耸诵怂讼松擞锼飕馊诉苏肃缩稣谡骕鹔岁随虽谇孙损笋狲荪锁琐唢牺献獭挞沓阘闼态钛鲐谈叹贪瘫谭昙赕钽锬镗铴饧讨绦绦绹鼗韬职铽腾誊体锑屉绨缇跃锡鳀鹈觍阗条鲦龆铁贴听厅颋铜统恸鲖头绣谕图涂秃钍专抟砖颓蜕脱饨鲀驼鸵箨萚饦鼍娲污腽弯湾顽塆纨绾苋网辋为围伟卫维谓潍纬苇遗帏沩涠玮猬诿闱韪喂鲔鳂问闻稳温纹愠缊蕴辒阌韫鳁瓮鹟窝卧挝癯莴龌雾误钨呜吴乌诬芜坞于妩庑御怃邬铻骛鹀鹉鹜龉细袭习铣系屃玺绤胁觋诶郄饻饩鳛峡狭侠煅硖线县现显闲鲜衔锨贤宪羡娴岘崄挦猃狝痫籼藓蚬跹轩鹇项响乡厢详缃芗饷飨骧鲞销萧晓哓枭泶潇箫蟏骁鸮写谢泻协谐携撷绁缬亵锌寻衅兴慭镡荥铏骍汹讻诇锈馐鸺须虚续叙绪吁溆诩谞顼选悬绚癣碹璇谖铉镟馔峃嚯鳕讯训驯逊勋询埙浔鲟压鸭亚鸦讶厌娅挜札氩痖烟盐严验艳阉砚彦谚颜阎俨兖厣滟檐觃讠谳赝这酽闫靥颜餍魇黡鼹龂样养扬痒杨阳鸯旸炀锳钖飏摇谣遥瑶尧钥峣犹飖鳐鹞业爷页晔烨谒邺铘余馌亿医仪异译彝谊艺颐忆义诣议铱勚呓峄怿择瘗祎缢舣贻钇镒镱驿鹢鹝鹥银饮隐荫瘾铟骃应蝇赢鹰颖莹婴樱缨萤嘤茔撄颍潆璎瘿绬萦罂鸴莺鹦哟涌拥咏踊痈镛颙鲬鳙优铀忧诱莸铕鱿鲉与鱼语狱渔誉娱舆屿预驭俣伛嵛欤滪玙蓣觎谀钰阈饫郁鹆远员圆愿园缘渊鸳辕橼贠陨鸢鹓鼋阅岳悦粤彟钺云运晕韵酝郧恽殒氲涢纭赟郓杂扎臜灾载暂赞瓒赞趱錾脏赃脏驵灶枣凿唣则责啧箦谪赜贼鲗赠综锃诈铡咤揸鲊鲝齄债斋战盏毡绽斩谵飐骣鹯张帐涨账诏钊蛰辙詟辄鹧鸷阵镇针诊贞侦桢浈祯纼缜赈轸鸩帧睁争挣证郑狰峥筝诤钲铮纸质帜织执挚掷栀栉絷制觯志贽跖踯踬轵轾铚只骘钟肿众终冢众钟皱轴昼骤纣荮诹赒辀猪筑贮铸嘱驻瞩诛伫槠橥潴铢转赚啭颛装庄壮状妆坠锥赘缒骓谆准浊诼资咨眦缁谘赀辎锱镃鲻踪偬骔鲰诅钻缵鳟';
				var traditional_chinese = '錒愛礙藹皚剴噯嬡曖璦磑鎄閡靄靉垵諳鉗銨陰頇鵪醃襖奧翺囂媼嶴澆磽驁鼇罷壩鈀鮁鮊擺敗唄辦頒絆阪辯鈑幫綁鎊謗崗紡報飽寶剝鮑鴇齙備貝輩鋇狽憊鵯賁繃鏰筆閉畢幣斃嗶複潷篳紕蓽慮詖費贔蹕鉍閈鰏邊變編貶辮拚籩緶鯿標鏢鑣颮飆驃驫鰾別鼈癟彆鱉瀕賓擯濱頻儐殯繽臏髕鬢並餅檳稟綆撥駁缽鉑蔔潑發襏鈸鎛餑餺鵓補撲鈈鈽磣財蠶殘摻參慘慚燦戔淺驂鯵黲倉滄艙蒼傖瑲鶬艸冊側測廁幘惻柵層繒詫釵鍤鑔餷儕蠆齜單産纏攙闡顫鏟讒蟬饞剗嘽囅團嬋嶄憚懺撣滻漸產禪脹蕆襝覘諂讖長場廠嘗腸暢償倀儻嚐悵棖瑒萇錩閶鯧鱨綽鈔嘮濤縐謅鼂車徹硨稱塵沈陳襯棧櫬瀋諶闖齔撐誠懲騁槍檉蟶赬鐺遲癡齒恥馳熾嘯扡擡滯離飭鴟沖蟲寵傭樁燭種衝銃醜綢籌躊疇儔幬檮譸讎處鋤觸櫥礎儲廚雛怵懨絀芻詘諸躕傳創瘡愴戧錘郵純蓴輇鶉綴輟鏃齪詞辭賜茲薺鶿從叢蔥聰囪樅縱總蓯驄湊藪輳竄躥攢攛鑹縗錯營躦銼鹺達噠墶膽薘躂叠韃帶貸紿詒軑遞隸靆駘馱擔彈誕鄲壇殫癉簞贍當黨擋檔蕩壋氹燙璫瘍碭簹襠讜島盜搗導禱燾魛燈鄧鐙敵締滌糴約蓧覿詆諦適鏑題點電澱顛墊巔癲鈿釣調鳥糶趙軺銱鯛鵃疊諜絰軼鰈鰨釘頂訂錠鋌飣丟銩動東凍棟崠腖鶇鬥讀瀆竇鈄餖獨鍍賭犢樞櫝牘篤鍺闍黷斷鍛緞籪對隊兌懟鐓噸頓鈍燉躉奪墮嚲橢澤綞鐸飿餓額鵝訛惡屙啞埡堊椏玀諤軛鋨鍔閼顎鱷鶚齶貳兒餌爾邇鉺鮞鴯罰閥琺廢醱飯煩販範礬釩楓渢訪鈁魴鰟飛誹紼緋鯡墳奮憤紛糞僨噴豶鱝風縫豐瘋馮諷鳳鋒灃碸賵負縛賦輔婦撫輻膚訃嘸紱襆賻錇韍駙鮒鰒鳧麩軋夾釓該蓋鈣賅趕幹贛稈尷紺鱤剛鋼綱岡戇溝頏鎬臯槁縞誥鋯個擱閣鴿鉻紇鉀鉿鎘閘頜魺給頸亙賡鯁鶊宮貢鞏龔紅嗊夠鈎購構區緱覯詬鉤韝鴝顧蠱賈呱穀詁軲轂鈷錮餶鯝鴣鵠鶻剮咼掛詿銛鴰噲關觀館慣貫綸摜權淪鰥鸛廣擴橫獷歸貴軌規矽櫃龜詭閨劊僞偽劌匭匱媯檜窪繪鮭鱖滾輥渾緄袞錕鯀過國鍋渦劃堝幗摑槨膕蝸蟈錁餜蝦嚇為還駭頦漢韓灘鈐闞頷絎號灝膠蠔顥賀鶴嗬繳蠍訶輅轄闔餄鬩鶡齕鴴轟鴻紘葒訌閎鬨黌後餱鮜鱟戶壺護滬戲滸蘆許軤鱯鶘鸌話畫華嘩嫿樺澮獪鏵驊壞懷換喚環緩歡渙煥瘓奐繯鍰鐶闤鯇黃謊鍠鰉會揮匯輝毀穢賄諱燴誨噅噦暉煒琿繢翬翽薈褘詼違闠韋頮潰葷湣緡諢閽餛夥貨獲禍鈥鑊幾機雞積記級極計擠紀際績緝饑薊輯劑濟齊繼擊譏嘰嚌潔璣磯稭結羈蘄蟣蟻覬訐跡躋霽騎驥魢鯽鱭鶺齎齏價駕莢頰挾檟浹蛺郟鋏頡見減間鍵賤檢簡殲監堅艱薦劍濺澗鑒踐撿箋儉堿鹼揀艦檻緘繭餞塹戩梘濫瞼筧縑纖襇諫譖譾鈃錢鐧閒險韉騫鰜鰹鶼鹹將講獎漿醬蔣強槳絳薑螿韁鱂腳較覺嬌絞攪驕矯轎餃鉸僥喬僑卻學嶠撟橋糾蕎鮫鷦節屆階傑誡癤詰鍇鮚進僅緊盡勁錦晉謹燼儘巹濜璡縉藎覲贐鋟饉靜驚經鏡淨競徑荊鯨莖痙剄弳涇烴脛逕陘靚頴坰瀅熒熲鎣舊廄繆鬮鳩鷲舉鋸劇懼駒據钜屨櫸窶簍蔞詎鄒鋦颶鮍齟鵑絹棬錈鐫雋決絕訣玨譎钁闋闕鞽騤軍駿鈞勻皸餕鮶開凱塏愷愾豈鎧鐦闓薟餡龕鈧閌銬鮳顆課殼緙軻鈳騍懇墾齦硜鏗摳嫗毆瞘庫褲嚳聖絝誇塊儈膾蕢鄶鱠寬髖礦況曠壙纊誆誑貺鄺虧窺饋巋憒簣聵頃壼褌閫鯤鶤闊蠟臘藍癩鑞來賴萊厲崍徠懶棶淶瀨睞籟賚錸蘭爛攔籃欄攬纜闌讕瀾覽嵐廩斕欖煉襤襴鑭鋃閬撈勞澇絡嶗癆耮銠鐒樂餎鰳類淚壘鐳縲纇誄裏禮曆麗礫瀝鯉勵籬儷嚦壢櫟櫪濼灑犛癘礪糲縭蒞藶蘺蝕蠣裡躒轢邐酈釃鋰鑠靂颯驪鬁鱧鱺鸝倆連聯練蓮戀臉鏈斂憐簾鐮漣奩孌攣殮瀲璉蘞褳鰱兩輛涼糧諒啢蹣輬魎療遼鐐繚釕鏐鷯獵臨鄰鱗賃凜懍檁滲藺躪轔領鈴靈嶺齡淩欞綾鯪鴒陸劉餾僂遊瀏綹鉚鋶鎦飀騮鶹鷚龍攏籠聾壟嚨隴哢曨朧櫳瀧瓏矓礱蘢龐樓摟婁嘍嶁漊瘺耬螻鏤髏錄爐盧魯鹵顱廬擄綠虜賂祿嚕壚擼攄櫓櫨氌淥濾瀘籙臚艫轆轤鑥鱸鷺鸕亂灤巒孿欒臠鑾鸞藥鋝論輪掄倫侖圇羅鑼騾籮蘿駱邏囉欏爍犖腡鏍驢閭櫚呂侶鋁屢縷褸穭嗎媽馬罵碼瑪螞麼麽嘜嬤榪獁驀買賣邁麥脈勱蕒滿瞞蠻饅謾縵蟎顢鰻鸏貓貿錨冇務沒鎂黴謎鶥門們悶懣捫燜鍆夢錳黽覓彌冪糸濔獼禰羋謐綿緬澠靦麵廟紗緲鶓滅閩憫瑉閔鰵鳴銘謬萬歿無襪謨鏌饃謀畝鉬納鈉內鎿難攤噥饢鬧腦惱撓堖橈蟯鐃訥餒擬膩濘灄鯢撚攆輦輾鯰釀嫋蔦鎳聶鑷齧囁攝諗躡隉顳甯擰檸獰嚀寧聹苧紐鈕濃農膿儂穠駑瘧諾儺釹嘔歐鷗漚慪甌紆謳盤爿拋皰麅賠轡鵬蘋羆鈹騙諞駢飄樸縹貧嬪顰憑評鮃頗釙鉕鋪譜鏷鐠氣啓棄淒棲臍訖啟榿漬磧綺蠐錡頎騏鯕鰭牽簽鉛釺遷譴謙潛僉慳槧繾羥膁蕁鵮牆搶嗆薔嬙慶檣熗繈親蹌錆鏘鏹翹鍬竅礄窯繰誚譙蹺銚竊愜篋鍥寢欽唚嶔撳駸請輕氫傾廎檾鯖窮瓊煢巰虯賕鰍趨驅軀齲嶇組覷闃騶勸顴綣詮銓鰁確鵲愨讓鑲饒繞擾嬈蕘熱認韌紉紝訒軔飪馹絨榮鎔嶸縟蠑頌銣顬軟銳綏潤閏薩殺鈒賽鰓傘毿糝饊喪顙掃騷繅鰠澀嗇穡銫廈賒鯊曬篩術閃刪陝繕姍訕釤騸鱔鱣傷賞湯殤緔觴燒紹綃設懾佘厙葉誰嬸腎審紳瘮詵聲繩勝時師試識駛勢釋飾獅視實濕詩屍噓塒溮繹蒔諡貰軾鈰鉈鯴鰣鳲獸壽綬書樹數輸屬贖豎紓紵鐲鷸帥閂雙驦鸘稅說順碩絲飼噝廝緦螄鍶颸飴駟鷥聳誦慫訟鬆擻鎪颼餿訴蘇肅縮穌謖驌鷫歲隨雖誶孫損筍猻蓀鎖瑣嗩犧獻獺撻遝闒闥態鈦鮐談歎貪癱譚曇賧鉭錟鏜鐋餳討縧絛綯鞀韜職鋱騰謄體銻屜綈緹躍錫鯷鵜覥闐條鰷齠鐵貼聽廳頲銅統慟鮦頭繡諭圖塗禿釷專摶磚頹蛻脫飩魨駝鴕籜蘀飥鼉媧汙膃彎灣頑壪紈綰莧網輞爲圍偉衛維謂濰緯葦遺幃溈潿瑋蝟諉闈韙餵鮪鰃問聞穩溫紋慍縕蘊轀閿韞鰮甕鶲窩臥撾臒萵齷霧誤鎢嗚吳烏誣蕪塢於嫵廡禦憮鄔鋙騖鵐鵡鶩齬細襲習銑係屭璽綌脅覡誒郤餏餼鰼峽狹俠煆硤線縣現顯閑鮮銜鍁賢憲羨嫻峴嶮撏獫獮癇秈蘚蜆躚軒鷳項響鄉廂詳緗薌餉饗驤鯗銷蕭曉嘵梟澩瀟簫蠨驍鴞寫謝瀉協諧攜擷絏纈褻鋅尋釁興憖鐔滎鉶騂洶訩詗鏽饈鵂須虛續敘緒籲漵詡諝頊選懸絢癬镟璿諼鉉鏇饌嶨謔鱈訊訓馴遜勳詢塤潯鱘壓鴨亞鴉訝厭婭掗劄氬瘂煙鹽嚴驗豔閹硯彥諺顔閻儼兗厴灩簷覎訁讞贗這釅閆靨顏饜魘黶鼴齗樣養揚癢楊陽鴦暘煬鍈鍚颺搖謠遙瑤堯鑰嶢猶颻鰩鷂業爺頁曄燁謁鄴鋣餘饁億醫儀異譯彜誼藝頤憶義詣議銥勩囈嶧懌擇瘞禕縊艤貽釔鎰鐿驛鷁鷊鷖銀飲隱蔭癮銦駰應蠅贏鷹穎瑩嬰櫻纓螢嚶塋攖潁瀠瓔癭緓縈罌鴬鶯鸚喲湧擁詠踴癰鏞顒鯒鱅優鈾憂誘蕕銪魷鮋與魚語獄漁譽娛輿嶼預馭俁傴崳歟澦璵蕷覦諛鈺閾飫鬱鵒遠員圓願園緣淵鴛轅櫞貟隕鳶鵷黿閱嶽悅粵彠鉞雲運暈韻醞鄖惲殞氳溳紜贇鄆雜紮臢災載暫贊瓚讚趲鏨髒贓臟駔竈棗鑿唕則責嘖簀謫賾賊鰂贈綜鋥詐鍘吒摣鮓鮺齇債齋戰盞氈綻斬譫颭驏鸇張帳漲賬詔釗蟄轍讋輒鷓鷙陣鎮針診貞偵楨湞禎紖縝賑軫鴆幀睜爭掙證鄭猙崢箏諍鉦錚紙質幟織執摯擲梔櫛縶製觶誌贄蹠躑躓軹輊銍隻騭鍾腫衆終塚眾鐘皺軸晝驟紂葤諏賙輈豬築貯鑄囑駐矚誅佇櫧櫫瀦銖轉賺囀顓裝莊壯狀妝墜錐贅縋騅諄準濁諑資谘眥緇諮貲輜錙鎡鯔蹤傯騌鯫詛鑽纘鱒';
				simplified_chinese += '历布占恒致征折向舍千累困肮板表采杆琅狸刹台凶岩症注着锛镔铖钏镄擀睾镓钜镘麽铌鲶铩谑芸锺垅吒彷馀宁槔飚溜锘锝锪镅曲';
				traditional_chinese += '歷佈佔恆緻徵摺嚮捨仟纍睏骯闆錶採桿瑯貍剎臺兇巖癥註著錛鑌鋮釧鐨搟睪鎵鉅鏝麼鈮鯰鎩謔蕓鍾壠咤徬餘寧橰飈霤鍩鍀鍃鎇麯';

				//特定替换的词
				var words = {
					'干涸': '乾涸',
					'计划': '計畫',
					'台风': '颱风',
					'度假': '渡假',
					'头发': '頭髮',
					'通奸': '通姦',
					'强奸': '强姦',
					'激荡': '激盪',
					'复苏': '復甦'
				};
				//特定不替换的词
				var exception = ['皇后', '王后'];
				//地区惯用法
				var zh_TW = {
					'发布': 'PO',
					'社交网络': '社群网路',
					'堵塞': '壅塞',
					'缓解': '纾解',
					'圣诞': '耶诞',
					'熊猫': '猫熊',
					'美女': '正妹',
					'大爆炸': '大霹雳',
					'水平': '水准',
					'卫生巾': '卫生棉',
					'风筝': '风吹',
					'公元': '西元',
					'公历': '西历',
					'农历': '夏历',
					'老幼病残孕专座': '博爱座',
					'盒饭': '便当',
					'一次性': '免洗',
					'塑料瓶': '宝特瓶',
					'热门': '夯',
					'西伯利亚冷气团': '大陆冷气团',
					'等离子体': '电浆',
					'圆珠笔': '原子笔',
					'透明皂': '水晶肥皂',
					'洗发露': '洗发精',
					'塑料袋': '塑胶袋',
					'口才': '口条',
					'人字拖': '夹脚拖',
					'水龙头': '水喉',
					'传统': '古早',
					'本地': '在地',
					'吉尼斯世界纪录': '金氏世界纪录',
					'味精': '味素',
					'恐怖袭击': '恐怖攻击',
					'钥匙': '锁匙',
					'洗面奶': '洗面乳',
					'传统风味': '古早味',
					'燃气灶': '瓦斯炉',
					'创可贴': 'OK绷',
					'超声波': '超音波',
					'激光': '脉冲光',
					'集成电路': '积体电路',
					'转基因': '基因改造',
					'激光': '雷射',
					'乒乓球': '桌球',
					'台球': '撞球',
					'游泳': '游水',
					'花样游泳': '水上芭蕾',
					'分清': '厘清',
					'推迟': '延后',
					'出差': '公干',
					'纠结': '烦乱',
					'诈骗': '诈欺',
					'贴心': '窝心',
					'支持': '支援',
					'去世': '过身',
					'幸福': '福祉',
					'响应': '回响',
					'前景': '愿景',
					'暴雨': '豪雨',
					'雷阵雨': '西北雨',
					'滑坡': '山崩',
					'戈壁': '砾漠',
					'地震': '地动',
					'大陆架': '大陆棚',
					'冲积平原': '泛滥平原',
					'冰川': '冰河',
					'地下河': '伏流',
					'泥石流': '土石流',
					'蒸腾作用': '蒸散作用',
					'全球变暖': '全球暖化',
					'厄尔尼诺现象': '圣婴现象',
					'拉尼娜现象': '反圣婴现象',
					'可持续发展': '永续发展',
					'环境保护': '环境保育',
					'橙子': '柳丁',
					'青菜': '清江菜',
					'菠萝': '凤梨',
					'猕猴桃': '奇异果',
					'番石榴': '芭乐',
					'章鱼': '花枝',
					'金枪鱼': '鲔鱼',
					'三文鱼': '鲑鱼',
					'酸奶': '优格乳',
					'酸奶': '优格',
					'方便面': '快餐面',
					'方便面': '速食面',
					'河粉': '粿条',
					'西兰花': '花椰菜',
					'薯片': '洋芋片',
					'空心菜': '通菜',
					'巨无霸': '大麦克',
					'圣代': '新地',
					'奶酪': '起司',
					'甜菜': '红头菜',
					'扎啤': '生啤酒',
					'夜宵': '宵夜',
					'色拉油': '沙拉油',
					'绿色食品': '健康食品',
					'马铃薯': '番薯',
					'便捷酒店': '摩铁',
					'洗手间': '化妆室',
					'少年管教所': '辅育院',
					'小卖部': '福利社',
					'机场': '航空站',
					'停车位': '停车格',
					'发展中国家': '开发中国家',
					'知识产权': '智慧产权',
					'司法部': '法务部',
					'铁路局': '铁工局',
					'二手房': '中古屋',
					'房税': '屋税',
					'地方税务局': '税捐处',
					'国事访问': '国是访问',
					'情报机构': '情治单位',
					'上诉': '抗诉',
					'合约': '契约',
					'合同': '契约',
					'工程': '专案',
					'专案组': '特侦组',
					'声明': '宣告',
					'公交车': '公车',
					'大巴': '游览车',
					'自行车': '脚踏车',
					'地铁': '捷运',
					'摩托车': '机车',
					'的士': '计程车',
					'立交桥': '交流道',
					'旅游': '观光',
					'末班车': '尾班车',
					'航天': '航太',
					'太空船': '太空梭',
					'二手车': '中古车',
					'后视镜': '后照镜',
					'兄弟院校': '姊妹校',
					'托管班': '安亲班',
					'幼儿园': '幼稚园',
					'小学': '国小',
					'初中': '国中',
					'本科': '大学部',
					'研究生院': '研究所',
					'高考': '联考',
					'班主任': '班导',
					'班长': '班代',
					'纪律委员': '风纪股长',
					'文艺委员': '康乐股长',
					'留学': '游学',
					'百分比': '几趴',
					'概率': '机率',
					'变量': '变数',
					'语法': '文法',
					'语意': '意涵',
					'语境': '脉络',
					'普通话': '国语',
					'闽南语': '台语',
					'美式英语': '美语',
					'多选题': '复选题',
					'向量图': '矢量图',
					'最小公倍': '最低公倍',
					'递推': '递回',
					'正态分布': '常态分配',
					'宏观经济学': '总量经济学',
					'微观经济学': '个体经济学',
					'受众': '客群',
					'运营': '营运',
					'渠道': '通路',
					'繁体': '正体',
					'语文': '国文',
					'武术': '国术',
					'京剧': '国剧',
					'民乐': '国乐',
					'受众': '阅听人',
					'宣传': '文宣',
					'北京时间': '中原标准时间',
					'办公室': '事务室',
					'超声波': '超音波',
					'教导处': '训导处',
					'教导主任': '训导主任',
					'屏幕': '荧幕',
					'单反': '单眼',
					'宽带': '宽频',
					'硬盘': '硬碟',
					'硬件': '硬体',
					'鼠标': '滑鼠',
					'数码': '数位',
					'台式电脑': '桌上型电脑',
					'笔记本电脑': '笔记型电脑',
					'智能手机': '智慧手机',
					'移动设备': '行动设备',
					'移动电话': '行动电话',
					'优盘': '随身碟',
					'U盘': '随身碟',
					'内存': '记忆体',
					'空调': '冷气机',
					'打印机': '印表机',
					'调制解调器': '数据机',
					'电子计算器': '电子计数机',
					'打印': '列印',
					'复印': '影印',
					'网络': '网路',
					'博客': '部落格',
					'邮箱': '信箱',
					'短信': '简讯',
					'视频': '视讯',
					'软件': '软体',
					'程序': '程式',
					'上传': '上载',
					'死机': '当机',
					'窗口': '视窗',
					'默认': '预设',
					'设置': '设定',
					'图标': '图示',
					'后缀': '字尾',
					'光标': '游标',
					'模拟': '类比',
					'查看': '检视',
					'点击': '点选',
					'文件夹': '档案夹',
					'互联网': '网际网路',
					'快捷方式': '捷径',
					'打游戏': '打电动',
					'门户网站': '入口网站',
					'登录': '登入',
					'注销': '登出',
					'播放器': '播放软体',
					'比特': '位元',
					'IP地址': 'IP位址',
					'C盘': 'C糟',
					'D盘': 'D糟',
					'人工智能': '人工智慧',
					'士兵': '阿兵哥',
					'解放军': '革命军',
					'原子弹': '核子弹',
					'导弹': '飞弹',
					'核武器': '核子武器',
					'新西兰': '纽西兰',
					'新泽西': '纽泽西',
					'柬埔寨': '高棉',
					'老挝': '寮国',
					'新加坡': '星加坡',
					'朝鲜': '北韩',
					'沙特': '沙乌地',
					'迪拜': '杜拜',
					'蒙古国': '外蒙',
					'意大利': '义大利',
					'悉尼': '雪梨',
					'戛纳': '坎城',
					'卡塔尔': '卡达',
					'突尼斯': '突尼西亚',
					'尼日利亚': '奈及利亚',
					'马尔代夫': '马尔蒂夫',
					'莫桑比克': '莫三鼻给',
					'科特迪瓦': '象牙海岸',
					'塞拉利昂共和国': '狮子山共和国',
					'毛里求斯': '模里细斯',
					'佛罗伦萨': '翡冷翠',
					'赞比亚': '尚比亚',
					'硅谷': '矽谷',
					'澳大利亚': '澳洲',
					'巴布亚新几内亚': '巴巴新几内亚',
					'华盛顿': '华府',
					'马六甲海峡': '麻六甲海峡',
					'肯尼亚': '肯亚',
					'评委': '评审',
					'搭档': '拍档',
					'模特儿': '麻豆',
					'首席执行官': '执行长',
					'首席运营官': '运营长',
					'首席财务官': '财务长',
					'伊斯兰教': '回教',
					'外籍员工': '外劳',
					'工作人员': '从业人员',
					'工人': '劳工',
					'志愿者': '志工',
					'战友': '同袍',
					'儿童': '童子',
					'保安': '保全',
					'黑客': '骇客',
					'户主': '户长',
					'邮递员': '邮差',
					'尼姑': '比丘尼',
					'梵高': '梵谷',
					'毕加索': '毕卡索',
					'里根': '雷根',
					'尼克松': '尼克森',
					'撒切尔': '畲契尔',
					'布什': '布希',
					'奥巴马': '欧巴马',
					'希拉里': '希拉蕊',
					'克林顿': '柯林顿',
					'安吉丽娜茱莉': '安吉丽娜裘莉',
					'普京': '蒲亭',
					'大众汽车': '福斯汽车',
					'奔驰': '宾士',
					'宝马': 'BMW',
					'飘柔': '飞柔',
					'强生': '娇生',
					'海飞丝': '海伦仙度斯',
					'索尼': '新力',
					'爱立信': '易立信',
					'阿迪达斯': '爱迪达',
					'加勒比海盗': '神鬼奇航',
					'蜘蛛侠': '蜘蛛人',
					'无间道': '神鬼无间',
					'谍影重重': '神鬼认证',
					'虎胆龙威': '终极警探',
					'这个杀手不太冷': '终极追辑令',
					'憨豆先生': '豆豆先生',
					'铁臂阿童木': '原子小金刚',
					'想干什么': '你想怎样'
				};
				//单向关联
				var toSimplified = {
					'圜': '圆',
					'溼': '湿',
					'鋂': '镅',
					'甯': '宁',
					'妳': '你',
					'喦': '岩',
					'襬': '摆',
					'滷': '卤',
					'儘': '尽',
					'噹': '当',
					'彙': '汇',
					'滙': '汇',
					'檯': '台',
					'鞦': '秋',
					'鐘': '钟',
					'曏': '向',
					'糰': '团',
					'罎': '坛',
					'颳': '刮',
					'閤': '合',
					'鬍': '胡',
					'迴': '回',
					'穫': '获',
					'纔': '才',
					'纏': '缠',
					'鹸': '硷',
					'髒': '脏',
					'藉': '借',
					'衝': '冲',
					'齣': '出',
					'鼕': '冬',
					'復': '复',
					'傢': '家',
					'捲': '卷',
					'剋': '克',
					'瞭': '了',
					'矇': '蒙',
					'濛': '蒙',
					'懞': '蒙',
					'衊': '蔑',
					'闢': '辟',
					'僕': '仆',
					'韆': '千',
					'繫': '系',
					'鏇': '旋',
					'祗': '只',
					'衹': '只',
					'硃': '朱',
					'埰': '采'
				};

				function transverter(parameter) {
					let options = {
						type: 'simplified',
						str: '',
						language: ''
					};
					for (let p in parameter) {
						options[p] = parameter[p];
					}
					let source, target, result = '', hash = {};
					if (options['type'] == 'traditional') {
						source = simplified_chinese;
						target = traditional_chinese;
						for (let i in words) {  //固定词替换
							options['str'] = options['str'].replace(i, words[i]);
						}
						if (options['language'] == 'zh_TW') {  //惯用词替换：简->繁
							for (let i in zh_TW) {
								if (options['str'].indexOf(i) > -1) {
									options['str'] = options['str'].replace(new RegExp(i, 'g'), zh_TW[i]);
								}
							}
						}
					} else {
						source = traditional_chinese;
						target = simplified_chinese;
						for (let i in words) {  //固定词替换
							if (options['str'].indexOf(words[i]) > -1) {
								options['str'] = options['str'].replace(new RegExp(words[i], 'g'), i);
							}
						}
						for (let i in toSimplified) {	//单向替换：繁->简
							if (options['str'].indexOf(i) > -1) {
								options['str'] = options['str'].replace(new RegExp(i, 'g'), toSimplified[i]);
							}
						}
					}
					for (let i = 0, len = options['str'].length; i < len; i++) {
						let noReplace = false;
						let c = options['str'][i];
						for (let j = 0; j < exception.length; j++) {
							let index = options['str'].indexOf(exception[j]);
							if (i >= index && i < index + exception[j].length - 1) {
								c = exception[j];
								noReplace = true;
								break;
							}
						}
						if (!noReplace) {
							if (hash[c]) {
								c = hash[c];
							} else {
								let index = source.indexOf(c);
								if (index > -1) {
									c = hash[c] = target[index];
								}
							}
						}
						result += c;
						i += c.length - 1;
					}
					if (options['type'] == 'simplified') {
						if (options['language'] == 'zh_TW') {  //惯用词替换：繁->简
							for (let i in zh_TW) {
								if (result.indexOf(zh_TW[i]) > -1) {
									result = result.replace(new RegExp(zh_TW[i], 'g'), i);
								}
							}
						}
					}
					return result;
				}

				let config = this.config;

				function getRichTextEditorContent() {
					let e = $('div.form-control.edui-body-container').parent();
					if (e) {
						let len = e.children().length
						if (len == 2) {  // 发帖框富文本编辑器模式
							return $('div.form-control.edui-body-container').html()
						} else if (len == 3) {  // 发帖框源代码编辑器模式
							return e.children().eq(2).val()
						}
					}
				}
				function setRichTextEditorContent(content) {
					let e = $('div.form-control.edui-body-container').parent();
					if (e) {
						let len = e.children().length
						if (len == 2) {  // 发帖框富文本编辑器模式
							let editer = $('div.form-control.edui-body-container');
							editer.html(content);
							editer.setCursorToEnd();
						} else if (len == 3) {  // 发帖框源代码编辑器模式
							let editer = e.children().eq(2);
							editer.val(content);
							editer.setCursorToEnd();
						}
					}
				}

				if (config.mode == 0) { // 手动模式
					// 回帖输入框添加转换按钮
					let message = $('#message')
					if (message) {
						$("#submit").parent().css("display", "flex");
						let toSimplifiedButton = $('<a class="icon-mail-forward text-muted" href="javascript:void(0)"> 轉為簡體</a>&nbsp;')
						$(toSimplifiedButton).click(function () {
							message.val(transverter({
								type: 'simplified',
								str: message.val(),
								language: 'zh_TW'
							}));
							message.setCursorToEnd();
						})
						$("#advanced_reply").parent().prepend(toSimplifiedButton)
						let toTraditionalButton = $('<a class="icon-mail-forward text-muted" href="javascript:void(0)"> 转为繁体</a>&nbsp;')
						$(toTraditionalButton).click(function () {
							message.val(transverter({
								type: 'traditional',
								str: message.val(),
								language: 'zh_TW'
							}));
							message.setCursorToEnd();
						})
						$("#advanced_reply").parent().prepend(toTraditionalButton)
					}

					// 发帖页面输入框添加转换按钮
					let toolBar = $(".edui-btn-toolbar");
					if (toolBar) {
						let separator = $('<div class="edui-separator hidden-sm hidden-md" unselectable="on" onmousedown="return false"></div>')
						toolBar.append(separator)
						let toSimplifiedButton = $('<div class="edui-btn hidden-sm hidden-md" unselectable="on" data-original-title="轉為簡體"> 轉為簡體 </div>')
						$(toSimplifiedButton).click(function () {
							setRichTextEditorContent(transverter({
								type: 'simplified',
								str: getRichTextEditorContent(),
								language: 'zh_TW'
							}));
						})
						toolBar.append(toSimplifiedButton)
						toolBar.append(separator)
						let toTraditionalButton = $('<div class="edui-btn hidden-sm hidden-md" unselectable="on" data-original-title="转为繁体"> 转为繁体 </div>')
						$(toTraditionalButton).click(function () {
							setRichTextEditorContent(transverter({
								type: 'traditional',
								str: getRichTextEditorContent(),
								language: 'zh_TW'
							}));
						})
						toolBar.append(toTraditionalButton)
					}

					$(".transverter-btn").click(function () {
						let lastSelectInput = window.lastSelectInput;
						if (!lastSelectInput) {
							return
						}
						let type = $(this).attr("lang-type")
						if (type == 1) {
							$(lastSelectInput).val(transverter({
								type: 'simplified',
								str: $(lastSelectInput).val(),
								language: config && config.isTW ? 'zh_TW' : ''
							}));
						} else if (type == 2) {
							$(lastSelectInput).val(transverter({
								type: 'traditional',
								str: $(lastSelectInput).val(),
								language: config && config.isTW ? 'zh_TW' : ''
							}));
						}
						$(lastSelectInput).focus()
						$(lastSelectInput).setCursorToEnd();
					})
					let transverterMenu = $("#transverter-menu")
					$(transverterMenu).mouseenter(function () {
						window.enterTransverterMenu = true;
					})
					$(transverterMenu).mouseleave(function () {
						window.enterTransverterMenu = false;
					})
					// 所有input添加转换按钮
					$('input').each(function () {
						$(this).focus(function () {
							window.lastSelectInput = $(this)
							transverterMenu.css("position", "absolute");
							transverterMenu.css("top", $(this).offset().top + $(this).height() + 15);
							transverterMenu.css("left", $(this).offset().left);
							transverterMenu.show();
						});
						$(this).blur(function () {
							if (!window.enterTransverterMenu) {
								window.lastSelectInput = null
								transverterMenu.hide()
							}
						});
					})
				} else if (config.mode == 1) { // 自动模式
					let transverterFn = Utils.createDebounceFunc(function (str, callback) {
						let result = transverter({
							type: config.autoModeTransformType == 0 ? 'simplified' : 'traditional',
							str: str,
							language: config.isTW ? 'zh_TW' : ''
						});
						callback && callback(result);
					}, config.autoModeDelay || 1000)

					// 页面中所有输入框自动转换
					$('input').on('input', function () {
						let input = $(this);
						let inputValue = input.val();
						transverterFn(inputValue, function (result) {
							input.val(result);
							input.setCursorToEnd();
						})
					});

					// 发帖页面富文本编辑器自动转换
					function bindEvent() {
						let e = $('div.form-control.edui-body-container').parent();
						if (e) {
							let len = e.children().length
							if (len == 2) {  // 发帖框富文本编辑器模式
								var targetNode = $('div.form-control.edui-body-container').get(0);
								if (targetNode) {
									let lastMd5Hash = null;
									// 创建 MutationObserver 实例
									var observer = new MutationObserver(function (mutationsList, observer) {
										// 当目标节点发生变化时执行的回调
										mutationsList.forEach(function (mutation) {
											if (mutation.type === 'childList' || mutation.type === 'characterData') {
												let str = targetNode.innerHTML.replaceAll("&nbsp;","").replaceAll("<p>","").replaceAll("</p>","").replaceAll("<br/>","").replaceAll("<br>","").trim();
												let md5Hash = CryptoJS.MD5(str).toString();
												if (md5Hash != lastMd5Hash) {
													lastMd5Hash = md5Hash;
													transverterFn(targetNode.innerHTML, function (result) {
														targetNode.innerHTML = result
														$(targetNode).setCursorToEnd();
													})
												}
											}
										});
									});
									// 配置 MutationObserver，监听子节点和内容变化
									observer.observe(targetNode, {
										childList: true,  // 监听子节点的变化
										subtree: true,    // 监听后代节点的变化
										characterData: true // 监听文本节点内容的变化
									});
								}
							} else if (len == 3) {  // 发帖框源代码编辑器模式
								e.children().eq(2).on('input', function () {
									let input = $(this);
									let inputValue = input.val();
									transverterFn(inputValue, function (result) {
										input.val(result);
										input.setCursorToEnd();
									})
								});
							}
						}
					}

					bindEvent();
					$('.edui-icon-source.edui-icon').click(function () {
						setTimeout(function () {
							//使这个事件延后处理，先执行其他click事件，最后再来处理这个
							bindEvent();
						}, 10)
					})

					// 回帖输入框添加自动转换
					let message = $('#message')
					if (message) {
						$(message).on('input', function () {
							let input = $(this);
							let inputValue = input.val();
							transverterFn(inputValue, function (result) {
								input.val(result);
								input.setCursorToEnd();
							})
						})
					}
				}
				$("body").addClass("cnTransverter")
			},
			initScript: function () {
				$('input[type="radio"][name="mode"]').change(function () {
					var selectedValue = $(this).val();
					if (selectedValue == 1) {
						$('#autoModeArea').show()
					} else {
						$('#autoModeArea').hide()
					}
				});

				if ($('input[type="radio"][name="mode"]:checked').val() == 1) {
					$('#autoModeArea').show()
				}
			},
			// 功能配置的html代码
			contentHtml: function () {
				let config = this.config;
				return Utils.createMsgDiv(`
				<div>
					转换模式: <label> <input type="radio" name="mode" value="0" ${config.mode == 0 ? 'checked' : ''}> 手动 </label> <label> <input type="radio" name="mode" value="1" ${config.mode == 1 ? 'checked' : ''}> 自动 </label>
					</br>
					处于台湾地区: <label> <input type="radio" name="area" value="true" ${config.isTW ? 'checked' : ''}> 是 </label> <label> <input type="radio" name="area" value="false" ${config.isTW ? '' : 'checked'}> 否 </label>
					</br>
					<div id="autoModeArea" style="display:none;">
						自动转换延迟: <input style="width:30px;" type="text" id="autoModeDelay-input" value="${config.autoModeDelay}" /> 毫秒 </br>
						自动转换类型:  
						<select id="autoModeTransformType">
							<option value="1" ${config.autoModeTransformType == 1 ? 'selected' : ''}>简体转繁体</option>
							<option value="0" ${config.autoModeTransformType == 0 ? 'selected' : ''}>繁体转简体</option>
						</select>
					</div>
				</div>
				`)
			}
		}
	}
	// 所有的工具函数都放在这里
	var Utils = {
		configPrefix: "OldManHelperConfig",
		BLACK_TYPE_ALL: "全部",
		BLACK_TYPE_THREAD: "帖子",
		BLACK_TYPE_REPLY: "回复",
		//工具用到的所有css样式都定义在这里
		styles: `
                <style>
                    #setting_btn {
                        top: calc(75vh) !important;
                        left: 0 !important;
                        width: 32px;
                        height: 32px;
                        padding: 6px !important;
                        display: flex;
                        position: fixed !important;
                        opacity: 0.5;
                        transition: .2s;
                        z-index: 9999 !important;
                        cursor: pointer;
                        user-select: none !important;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        box-sizing: content-box;
                        border-radius: 0 50% 50% 0;
                        transform-origin: center !important;
                        transform: translateX(-8px);
                        background-color: #eee;
                        -webkit-tap-highlight-color: transparent;
                        box-shadow: 1px 1px 3px 0px #aaa !important;
                        color: #000 !important;
                        font-size: medium;
                    }
                    #Autopage_number:hover {
                        opacity: 0.9;
                        transform: translateX(0);
                    }
                    .setting-textarea {
                        width: 280px;
                        height: 200px;
                    }
                    #user-operate-menu {
                        display:none;
                        max-width:70px;
                        display:flex;
                        flex-direction:column;
                    }
					.fixed-reply {
						z-index:99999;
						position:fixed;
						bottom:6px;
						background-color:white;
						border-radius:8px;
						margin-left:-27.5px;
						box-shadow:5px 5px 5px #808080,5px -5px 5px #808080,-5px 5px 5px #808080,-5px -5px 5px #808080;
					}
                    .setting-item {
                        width: 100%;
                        height:30px;
                        max-width: 240px;
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        background-color: white !important;
                    }
                    .setting-block {
                        height:400px;
                        overflow-y:auto;            
                        border-width: 1px;
                        border-color: orange !important;
                    }
                    .setting-block::-webkit-scrollbar {
                        display:none;
                    }
                    .setting-item-list {
                        width: 240px;
                        border-radius: 15px 0px 0px 15px;
                    }
                    .setting-item-content {
                        width: 360px;
                        border-radius: 0px 15px 15px 0px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .split-line {
                        width: 100%;
                        height: 1px;
                        background-color: #ededed !important;
                    }
                    .select-item {
                        background-color: #e4e3e8 !important;
                    }

                    .ios-theme-switch-div{
                        position:relative;
                        width: 40px;
                        height: 24px;
                    }
                    .ios-theme-switch-div input.theHelper{
                        display:none;
                    }
                    .ios-theme-switch-div label{
                        position:relative;
                        display: block;
                        padding: 1px;
                        border-radius: 24px;
                        height: 22px;
                        background-color: #eee !important;
                        cursor: pointer;
                        vertical-align: top;
                        -webkit-user-select: none;
                        -webkit-transition: all 0.3s ease;
                    }
                    .ios-theme-switch-div label:before{
                        content: '';
                        display: block;
                        border-radius: 24px;
                        height: 22px;
                        background-color: white !important;
                        -webkit-transform: scale(1, 1);
                        -webkit-transition: all 0.3s ease;
                    }
                    .ios-theme-switch-div label:after{
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 22px;
                        height: 22px;
                        margin-top: -11px;
                        margin-left: -11px;
                        display: block;
                        border-radius: 100%;
                        background-color: white !important;
                        box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.08);
                        -webkit-transform: translateX(-9px);
                        -webkit-transition: all 0.3s ease;
                    }
                    input.theHelper:checked~label:after{
                        -webkit-transform: translateX(9px);
                    }
                    input.theHelper:checked~label:before{
                        background-color:#4cda64 !important;
                    }
                    .content {
                        width: 90%;
                        height: 350px;
                        /*border:2px solid #ffffff;
                        border-style: dashed;
                        border-radius: 5px;*/
                        overflow-y:auto;
                        padding: 10px;          
                    }
                    .content::-webkit-scrollbar {
                        display:none;
                    }
                    #setting-panel {
                        margin-top:10px;
                        width: 600px;
                        height: 400px;
                        border-radius: 15px;
                        background-color:#f1f0f5 !important;
                        display: none;
                        flex-direction: row;
                        border:1px solid #ddd;
                        z-index:999;
                        box-shadow:0 0 10px #eee;
                    }
                    #overlay-panel {
                        display:none;
                        position:fixed;
                        top:0;
                        right:0;
                        bottom:0;
                        left:0;
                        z-index:5;
                        background-color:rgba(0,0,0,.4) !important;
                        transition:all .3s;
                        opacity:0.5
                    }
                    .setting-item-section{
                        border:2px solid white;
                        border-style: dashed;
                        width: 305px;
                        border-radius: 5px;
                        margin-bottom:20px;
                    }
                    .setting-item-section-title {
                        margin-left: 10px;
                        margin-top: -10px;
                        height: 20px;
                        line-height: 20px;
                        font-size: 15px;
                    }
                    .setting-item-section-title span{
                        background-color: #f1f0f5 !important;
                    }
                    .section-content {
                        word-wrap: break-word;
                        word-break: break-all;
                        overflow: hidden;
                        padding-left: 10px;
                        padding-right: 10px;
                        padding-bottom: 10px;
                    }
                    .setting-item-desc-text {
                        color: #787878 !important;
                    }
                    .black-type-button {
                        font-size:10px;
                    }
                    .emoji-item {
                        width: 40px;
                        height: 40px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        cursor: default;
                        font-size: 20px;
                    }

                    .emojis-panel {
                        display: none;
                        height: 300px;
                        width: 300px;
                        overflow: auto;
                        background: #EEEEEE !important;
                        flex-direction: row;
                        flex-wrap: wrap;
                    }

                    .emojis::-webkit-scrollbar {
                        display: none;
                    }
                    .open-emoji-panel {
                        cursor:default;
                        display:flex;
                        justify-content:center;
                        align-items:center;
                        margin-left:5px;
                        width: 28px;
                        height: 28px;
                        font-size: 20px;
                    }
                    .msg-div {
                        width:100%;
                        height:100%;
                        display:flex;
                        justify-content:center;
                        align-items:center;
                    }
                    .quick-reply-button {
                    	width:40px;
                    	height:20px;
                    	border-radius:5px;
                    	color:white;
                    	background-color:#177f2e;
                    	display:flex;
                    	justify-content:center;
                    	align-items:center;
                    	font-size: 10px;
                    }
                    .batch-reply-div{
				        width: 270px;
				        height: 300px;      
				        border:3px solid orange;
				        border-radius: 16px;
				        position: relative;
				        padding: 10px;
				        display: none;
				        background-color: white;
				    }
				    .batch-reply-content {
				        height: 100%;
				        overflow-y:auto;  
				    }
				    .batch-reply-content::-webkit-scrollbar {
                        display: none;
                    }
				    .batch-reply-div::before{
				        content: '';
				        width: 0;
				        height: 0;
				        border: 20px solid;
				        position: absolute;
				        top: -43px;
				        left: 115px;
				        border-color: transparent transparent orange;
				    }
				    .batch-reply-div::after{
				        content: '';
				        width: 0;
				        height: 0;
				        border: 20px solid;
				        position: absolute;
				        top: -40px;
				        left: 115px;
				        border-color:  transparent transparent #fff;
				    }
				    .reply-item {
				        width: 100%;
				        font-size: 10px;
				    }
				    .batch-reply-textarea {
				        width: 90%;
				        height: 50px;
				        resize: none;
				    }                  
                </style>
            `,
		//设置按钮的html定义
		settingButtonHtml: `
              <div id="setting_btn">
               <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24" aria-labelledby="toolIconTitle">
                <path d="M9.74292939,13.7429294 C9.19135019,13.9101088 8.60617271,14 8,14 C4.6862915,14 2,11.3137085 2,8 C2,7.07370693 2.20990431,6.19643964 2.58474197,5.4131691 L6.94974747,9.77817459 L9.77817459,6.94974747 L5.4131691,2.58474197 C6.19643964,2.20990431 7.07370693,2 8,2 C11.3137085,2 14,4.6862915 14,8 C14,8.88040772 13.8103765,9.71652648 13.4697429,10.4697429 L20.5858636,17.5858636 C21.3669122,18.3669122 21.3669122,19.6332422 20.5858636,20.4142907 L19.9142907,21.0858636 C19.1332422,21.8669122 17.8669122,21.8669122 17.0858636,21.0858636 L9.74292939,13.7429294 Z"></path>
               </svg>
              </div> 
              <div id="user-operate-menu"></div>
			  <div id="transverter-menu" style="display:none;font-size:10px;">
					<button type="button" lang-type="1" class="transverter-btn">轉為簡體</button>
					<button type="button" lang-type="2" class="transverter-btn">转为繁体</button>
			  </div>

              <div class="batch-reply-div">
		        <div class="batch-reply-content">
		        </div>
		      </div>

		      <iframe name="hideIframe" style="display:none;"></iframe>
            `,
		// 插件初始化
		init: function () {
			var headHTML = document.getElementsByTagName('head')[0].innerHTML;
			headHTML = '<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">' + headHTML;
			document.getElementsByTagName('head')[0].innerHTML = headHTML;

			//加载配置
			this.loadConfig()
			//创建设置按钮以及加载css
			document.documentElement.insertAdjacentHTML('beforeend', this.styles + this.settingButtonHtml);
			//创建设置面板
			$('body').append(this.createSettingPanel(true))
			//绑定背景层事件
			$("#overlay-panel").click(function () {
				$("#setting-panel").hide(200)
				$("#overlay-panel").hide()
				Utils.saveConfig(window.currentFunctionKey)
				Utils.reloadPage(window.currentFunctionKey)
			})
			//创建功能列表
			this.createSettingItems(settingObject)
			//绑定设置按钮点击事件，点击后隐藏/显示设置面板
			window.openOldManHelper = function () {
				let settingPanel = $("#setting-panel");
				let overlayPanel = $("#overlay-panel");
				if (settingPanel.css("display") === 'none') {
					Utils.setCurrentContentHtml(Utils.getCurrentFunctionObject())
					var d = document.documentElement
					settingPanel.css("display", "flex");
					settingPanel.css("position", "absolute");
					settingPanel.css("top", d.scrollTop + (d.clientHeight - 400) / 2);
					settingPanel.css("left", d.scrollLeft + (d.clientWidth - 600) / 2);
					settingPanel.show(200);
					overlayPanel.show()
				} else {
					settingPanel.hide(200)
					overlayPanel.hide()
					Utils.saveConfig(window.currentFunctionKey)
					Utils.reloadPage(window.currentFunctionKey)
				}
			}
			$("#setting_btn").click(function () {
				window.openOldManHelper()
			})
			$('body').mousemove(function (e) {
				e = e || window.event;
				window.__xx = e.pageX || e.clientX + document.body.scroolLeft;
				window.__yy = e.pageY || e.clientY + document.body.scrollTop;
			});
			this.applyFunction()
		},
		saveConfig: function (functionKey) {
			if (!functionKey || !settingObject[functionKey]) {
				return
			}
			let functionObject = settingObject[functionKey]
			var config = {}
			// 如果设置页面处于显示状态，需要从设置页面读取值更新内存，最后再持久化存储
			// 如果设置页面没有显示，略过从设置页面读取值更新内存这一步，直接将内存配置持久化存储
			if (this.isSettingPanelShow()) {
				for (let configName of Object.keys(functionObject.config)) {
					let val = null
					//功能开关统一处理
					if (configName == "enable") {
						val = document.getElementById('switch-' + functionKey).checked
					} else {
						//拿到属性key的映射对象
						let mapObject = functionObject.configKeyElementMaps[configName]
						if (mapObject) {
							// 如果映射对象有getVal函数，那么就调用getVal函数取得值，如果没有，就默认调用 getElementVal 函数取值
							val = mapObject.getVal ? mapObject.getVal() : this.getElementVal(mapObject.element)
						}
					}
					functionObject.config[configName] = val
					config[configName] = val
				}
			} else {
				config = functionObject.config
			}
			//将window.Config对象数据保存到localStorage
			localStorage.setItem(this.configPrefix + "__" + functionKey, JSON.stringify(config));

			this.applyFunction(functionKey)
		},
		loadConfig: function () {
			for (let functionName of Object.keys(settingObject)) {
				let item = settingObject[functionName]
				let c = localStorage.getItem(this.configPrefix + "__" + functionName)
				if (!c) {
					console.log("加载[" + item.title + "]功能配置出错:未找到配置！将使用默认配置。")
					continue;
				}
				try {
					let cobj = JSON.parse(c)
					for (let key of Object.keys(cobj)) {
						item.config[key] = cobj[key]
					}
				} catch (e) {
					console.log("加载[" + item.title + "]功能配置出错:json解析错误！将使用默认配置。" + e.toString())
				}
			}
		},
		noticeSetRead: function (id) {
			$.xpost(xn.url('my-notice'), {
				act: 'readone',
				nid: id
			}, function (code, message) { });
		},
		parsePageIdAndQuoteId: function (href) {
			var tmp = href.replace("thread-", "")
			tmp = tmp.substring(0, tmp.lastIndexOf("."))
			return {
				pageId: tmp,
				quoteId: href.split("#")[1]
			}
		},
		quickReply: function (pageId, quoteId, content, successCallBack = null, errorCallBack = null) {
			try {
				$.ajax({
					type: "post",
					url: "post-create-" + pageId + "-1-" + quoteId + ".htm",
					data: "doctype=1&return_html=1&quotepid=" + quoteId + "&message=" + content,
					async: true,
					success: function (html) {
						successCallBack && successCallBack()
					},
					error: function (e) {
						errorCallBack && errorCallBack()
					}
				});
			} catch (e) {
				console.log(e)
			}
		},
		getCurrentPageThreadId: function () {
			return window.location.href.split("-")[1].replace(".htm", "")
		},
		hasElement: function (el, root = null) {
			return root ? $(root).find(el).length > 0 : $(el).length > 0
		},
		getCurrentFunctionObject: function () {
			if (!window.currentFunctionKey) {
				return null;
			}
			let object = settingObject[window.currentFunctionKey]
			return object ? object : null;
		},
		isSettingPanelShow: function () {
			return $("#setting-panel").css("display") != 'none'
		},
		reloadPage: function (functionKey) {
			if (!functionKey || !settingObject[functionKey]) {
				return
			}
			let functionObject = settingObject[functionKey]
			if (functionObject.needReload) {
				window.location.reload();
			}
		},
		loadJSColor: function () {
			var input = $("[data-jscolor]");
			for (var i = 0; i < input.length; i++) {
				var picker = new jscolor(input[i]);
				picker.hash = true;
			}
			jscolor.init();
		},
		// 判断页面地址是否有指定前缀
		isMatchPageCategory: function (pagePrefix) {
			return window.location.href.startsWith(window.location.protocol + "//" + window.location.host + "/" + pagePrefix)
		},
		// 判断当前页面是否为主页
		isIndexPage: function () {
			return window.location.href == 'https://bbs.oldmanemu.net/' || window.location.href == 'https://bbs.oldmantvg.net/'
		},
		getElementVal(idOrClass) {
			return $(idOrClass).val()
		},
		applyFunction: function (functionName = "") {
			let applyFn = function (fn) {
				if (fn && fn.config) {
					if (fn.config.enable) {
						if (!fn.matchCondition || (fn.matchCondition && fn.matchCondition())) {
							fn.doAction && fn.doAction();
						}
					} else {
						fn.onClose && fn.onClose();
					}
				}
			}
			if (functionName == "") {
				for (let functionName of Object.keys(settingObject)) {
					applyFn(settingObject[functionName])
				}
			} else {
				applyFn(settingObject[functionName])
			}
		},
		// 创建开关按钮
		createIosThemeSwitch: function (item, jqueryObject = false) {
			let checked = function (item) {
				return item.config.enable ? 'checked="checked"' : ''
			}
			let html = `
                      <div class="ios-theme-switch-div">
                        <input id="switch-${item.id}" type="checkbox" ${checked(item)} class="theHelper" />
                        <label for="switch-${item.id}"></label>
                      </div>
                `
			return jqueryObject ? $(html) : html
		},
		//创建功能div
		createSettingItem: function (functionKey, item, jqueryObject = false) {
			let html = `
                    <div class="setting-item" functionKey="${functionKey}">
                        <div style="flex-grow: 6;display: flex;margin-left:10px; align-items: center;max-width: 170px;">
                            ${item.title}
                        </div>
                        <div style="flex-grow: 2;display: flex;justify-content: center;align-items: center;max-width: 50px;">
                            ${this.createIosThemeSwitch(item)}
                        </div>
                    </div>
                `
			return jqueryObject ? $(html) : html
		},
		//创建设置面板
		createSettingPanel: function (jqueryObject = false) {
			let html = `
                    <div id="setting-panel">
                        <div class="setting-block setting-item-list"></div>
                        <div class="setting-block setting-item-content">
                            <div class="content">
                                ${this.createDefaultContentHtml()}
                            </div>
                        </div>
                    </div>
                    <div id="overlay-panel"></div>
                `
			return jqueryObject ? $(html) : html
		},
		createQuickReplyForm: function (pageId, quoteId, content, jqueryObject = false) {
			let html = `
                    <form style="display:none;" action="post-create-${pageId}.htm" method="post" target="hideIframe"> 
					    <input type="hidden" name="doctype" value="1">
					    <input type="hidden" name="return_html" value="0">
					    <input type="hidden" name="quotepid" value="${quoteId}">    
					    <textarea name="message">${content}</textarea>
					</form>
                `
			return jqueryObject ? $(html) : html
		},
		setCurrentContentHtml: function (functionObject, ifFnIsNullUseDefault = true) {
			$(".content").html(functionObject && functionObject.contentHtml ? functionObject.contentHtml() : ifFnIsNullUseDefault ? this.createDefaultContentHtml() : "")
			Utils.loadJSColor()
			functionObject && functionObject.initScript && functionObject.initScript();
		},
		// 创建功能列表
		createSettingItems: function (settingObject) {
			var list = $(".setting-item-list")
			let index = 0;
			let lastIndex = Object.keys(settingObject).length - 1
			for (let functionName of Object.keys(settingObject)) {
				let item = settingObject[functionName]
				let setting = this.createSettingItem(functionName, item, true)
				setting.click(function () {
					window.lastFunctionKey = window.currentFunctionKey
					window.currentFunctionKey = $(this).attr("functionKey")
					Utils.saveConfig(window.lastFunctionKey)
					$(".setting-item").removeClass("select-item")
					$(this).addClass("select-item")
					Utils.setCurrentContentHtml(item)
				})
				list.append(setting)
				if (index != lastIndex) {
					list.append($('<div class="split-line" />'))
				}
			}
		},
		createDivWithTitle: function (title, contentHtml, jqueryObject = false, styles = "", titleStyles = "") {
			let html = `
                    <div class="setting-item-section" style="${styles}">
                        <h1 class="setting-item-section-title"><span style="${titleStyles}">${title}</span></h1>
                        <div class="section-content">
                            ${contentHtml}
                        </div>
                    </div>
                `
			return jqueryObject ? $(html) : html
		},
		createDefaultContentHtml: function (jqueryObject = false) {
			let html = `
                    <span style="font-size:30px;">老男人助手</span><span style="font-size:15px;">by rock</span>   </br>                 
                    <p>有任何bug反馈或者功能建议，请在论坛回复<a href="https://bbs.oldmantvg.net/thread-13819.htm">我的帖子</a>，或者发送邮件给我 1099607871@qq.com</p>
                    <p>感谢使用</p>
                `
			return jqueryObject ? $(html) : html
		},
		createBlackTypeButton: function (banType, userId, username, text, jqueryObject = false) {
			let html = `
                    <button class='black-type-button' banType='${banType}' user-id='${userId}' user-name='${username}'>${text}</button>
                `
			return jqueryObject ? $(html) : html
		},
		createMsgDiv: function (msgHtml, jqueryObject = false) {
			let html = `
                    <div class="msg-div">
                        ${msgHtml}
                    <div>
                `
			return jqueryObject ? $(html) : html
		},
		createReplyItem: function (infoObject, jqueryObject = false) {
			let html = `
                    <div class="reply-item" pageId="${infoObject.pageId}" quoteId="${infoObject.quoteId}" nid="${infoObject.nid}">
                    ${this.createDivWithTitle(infoObject.username, '<div>' + infoObject.time + ' ' + infoObject.threadName + ' : <a href="' + this.getHost() + '/thread-' + infoObject.pageId + '.htm#' + infoObject.quoteId + '">' + infoObject.replyInfo + '</a></div><textarea class="batch-reply-textarea" placeholder="留空不回复"></textarea>', false, "width:240px;border: 2px solid gray;border-style:dashed;", "background-color: white !important;")}
		            </div>
                `
			return jqueryObject ? $(html) : html
		},
		getHost: function () {
			return window.location.protocol + "//" + window.location.host
		},
		fetchHtml: function (webPath, callback, jqueryObject = false) {
			$.ajax({
				type: "get",
				url: Utils.getHost() + webPath,
				dataType: "html",
				async: true,
				success: function (html) {
					callback && callback(jqueryObject ? $(html) : html)
				}
			});
		},
		createDebounceFunc: function (func, wait = 1000) {
			let timeout;
			return function (...args) {
				const context = this;
				clearTimeout(timeout);
				timeout = setTimeout(() => {
					func.apply(context, args);
				}, wait);
			};
		},
		setFixedReplyState: function (state) {
			let replyInput = $(".post.newpost.media")
			if (!replyInput) {
				return
			}
			function effect() {
				replyInput.addClass("fixed-reply")
				let width = replyInput.parent().parent().outerWidth()
				replyInput.css("width", (width + 20) + "px")
				$("#advanced_reply").parent().prepend('<a class="icon-mail-forward text-muted" href="javascript:void(0)" id="cancel-reply-fixed"> 取消吸附</a>')
				$("#cancel-reply-fixed").click(function () {
					cancel()
				})
				$(".fixed-reply").find(".mr-3").hide()
				$(".fixed-reply").find(".d-flex.justify-content-between.small.text-muted").css("cssText", "display:none !important")
				let o = $($($(".fixed-reply").children()[1]).children()[1])
				o.css("display", "flex")
				o.css("justify-content", "center")
				o.css("align-items", "center")
				$("#quick_reply_form").css("width", "98%")
			}
			function cancel() {
				$("#cancel-reply-fixed").remove()
				$(".fixed-reply").find(".mr-3").show()
				$(".fixed-reply").find(".d-flex.justify-content-between.small.text-muted").show()
				let o = $($($(".fixed-reply").children()[1]).children()[1])
				o.css("display", "")
				o.css("justify-content", "")
				o.css("align-items", "")
				$("#quick_reply_form").css("width", "")
				replyInput.removeClass("fixed-reply")
				replyInput.css("width", "")
			}
			if (state) {
				if (!replyInput.hasClass("fixed-reply")) {
					effect()
				}
			} else {
				if (replyInput.hasClass("fixed-reply")) {
					cancel()
				}
			}
		}
	}

	$.fn.setCursorToEnd = function () {
		var element = this[0]; // 获取 DOM 元素
		var range = document.createRange();
		var selection = window.getSelection();
		range.selectNodeContents(element);  // 选择整个元素的内容
		range.collapse(false);  // 将光标设置到末尾
		selection.removeAllRanges();  // 清空所有选择
		selection.addRange(range);  // 添加新的选择区域
		return this;
	};

	$(document).ready(function () {
		Utils.init()
	});

})();