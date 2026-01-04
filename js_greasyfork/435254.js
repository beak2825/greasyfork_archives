// ==UserScript==
// @name         盖亚工单辅助小工具_4PX专用
// @namespace    https://home.i4px.com
// @version      1.0.1
// @description  添加自动刷新、弹窗消息通知、钉钉消息通知等功能
// @author       ZRF
// @match        https://desk.wt.cainiao.com/unified/myTask/pendingTask
// @match        https://desk.wt.cainiao.com/
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @icon         https://img.alicdn.com/tfs/TB1CZ0ARpXXXXX7XXXXXXXXXXXX-32-32.png
// @note         https://www.cainiao.com/favicon.ico
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @connect      oapi.dingtalk.com
// @connect      wt.cainiao.com
// @downloadURL https://update.greasyfork.org/scripts/435254/%E7%9B%96%E4%BA%9A%E5%B7%A5%E5%8D%95%E8%BE%85%E5%8A%A9%E5%B0%8F%E5%B7%A5%E5%85%B7_4PX%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/435254/%E7%9B%96%E4%BA%9A%E5%B7%A5%E5%8D%95%E8%BE%85%E5%8A%A9%E5%B0%8F%E5%B7%A5%E5%85%B7_4PX%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==


(function() {
    'use strict';



	/* ---小工具--- */
	let tools = {
		init: function () {
			this.initUI();
			this.cacheElements();
			this.initEvents();
			this.initDate();
			this.initSet();
		},

		// 初始化界面
		initUI: function () {
			// 添加到顶栏
    		$(".coneProtal-col:first").append(toolsHtml.first);
    		// 通知设置框
    		$("body").append(toolsHtml.set);

    		// 给文本输入框添加焦点特效
    		$(".manager-system-header .next-input input,#notice_set_room .next-input input").focus(function () {
    			$(this).parent().addClass("next-focus");
    		}).blur(function () {
    			$(this).parent().removeClass("next-focus");
    		});
		},

		// 缓存选择器对象
		cacheElements: function () {
			// this.$myTask = $(".cn-navfold-title");// 左侧栏按钮
			this.$refresh_switch = $("#refresh_switch");// 开始按钮
			this.$notice_switch = $("#notice_switch");// 通知按钮
			this.$notice_set = $("#notice_set");// 通知设置按钮
			this.$refresh_time = $("#refresh_time");// 刷新倒计时输入框
			this.$notice_set_room = $("#notice_set_room");// 通知设置弹窗
			this.$popup_switch = $("#popup_switch");// 弹窗通知开关
			this.$ding_switch = $("#ding_switch");// 钉钉通知开关
			this.$popup_click = $("#popup_click_room .next-radio-group label");// 弹窗点击-单选按钮组
			this.$popup_times = $("#popup_times_room .next-radio-group label");// 弹窗次数-单选按钮组
			this.$popup_again_time = $("#popup_again_time");// 再次弹窗间隔时间输入框
			this.$popup_time = $("#popup_time");// 弹窗显示时间输入框
			this.$popup_icon = $("#popup_icon");// 弹窗图片
			this.$notice_title = $("#notice_title");// 通知标题
			this.$ding_at_who = $("#ding_at_who .next-radio-group label");// 钉钉消息@的对象
			this.$ding_webhook = $("#ding_webhook");// 钉钉webhook
			this.$set_close = $("#set_close");// 通知设置弹窗关闭
			this.$set_submit = $("#set_submit");// 通知设置提交
			this.$handled_button = $(".cardItem:first");// "待处理任务总量" 按钮
			this.$header = $(".manager-system-header");// 顶栏层
		},

		// 初始化数据
		initDate: function () {
			// 默认通知设置
			this.defaultNoticeConfig = {
				"isEnabled": !1,// 是否启用通知
				"title": "待我处理的工单",// 通知标题
				"subtitle": "",// 通知副标题
				"popup": {
					"isEnabled": !1,// 是否启用弹窗通知
					"time": 5,// 弹窗通知时间
					"icon": "https://img.alicdn.com/tfs/TB1CZ0ARpXXXXX7XXXXXXXXXXXX-32-32.png",// 弹窗通知图片
					"onclick": "close",// 点击弹窗的事件代码
					"timeAgain": 1800,// 同一工单再次弹窗提醒时间
					"times": "once"// 弹窗次数：once单次，again多次
				},
				"ding": {
					"isEnabled": !1,// 是否启用钉钉通知
					"webhook": "",// 钉钉通知webhook
					"atWho": "",// 钉钉通知艾特谁
					"waitTime": 200,// 等待发送的时间（超出发送频率用）
					"mobile": ""// 手机号，@自己用
				}
			};

			// 读取通知设置
			this.noticeConfig = local.get("tools_noticeConfig") || this.defaultNoticeConfig;

			// 屏蔽通知的工单编号taskId，防重复推送
			this.blockedId = local.get("tools_blockedId") || {
				"popup": "",// 不再弹窗
				"ding": "",// 不再钉钉通知
				"popupRemindAgain": "",// 间隔时间后，再次弹窗通知
				"waitDing": ""// 等待钉钉发送（超出发送频率使用）
			};

			// 自动刷新设置
			this.refresh = local.get("tools_refresh") || {
				"time": "",// 倒计时时间
				"isEnabled": false// 是否启用自动刷新
			};

			// 获取手机号
			tools.getMobile();

			// 登陆失效通知
			this.isLogoutNotice = false;
		},

		// 绑定事件
		initEvents: function () {
			let _this = this;

			// 【待我处理的】按钮
			// _this.$myTask.click(function () {
			// 	if ("待我处理的" == $(this).text() && 0 == $("#refresh_switch").length) {// 如果是其他页面进来的，则开始加载
			// 		this.init();
			// 	}
			// });

			// 刷新倒计时时间，弹窗间隔时间，只能输入正整数
			$("#refresh_time, #popup_again_time").keyup(function(){
			    $(this)[0].value = $(this)[0].value.replace(/^(0+)|[^\d]+/g,'');
			});

			// 开始按钮
		    _this.$refresh_switch.click(function () {
		    	if ($(this).attr("class").indexOf("coneProtal-switch-off") > -1) {// 开启
		    		let time = _this.$refresh_time.val();// 倒计时输入框时间
		    		time > 0 ? tools.refreshStart(time) : cssFn.error(_this.$refresh_time, 1);
		    	} else {// 关闭
		    		tools.refreshStop();
		    	}
		    });

			// 通知按钮
		    _this.$notice_switch.click(function () {
		    	if ($(this).attr("class").indexOf("coneProtal-switch-off") > -1) {// 开启
		    		tools.noticeOpen();
		    	} else {// 关闭
		    		tools.noticeClosed();
		    	}
		    });

		    // 通知设置按钮
		    _this.$notice_set.click(()=> {
		    	if("none" == _this.$notice_set_room.css("display")) {// 下拉展示
		    		this.noticeConfig.popup.isEnabled ? cssFn.switch(_this.$popup_switch, true) : cssFn.switch(_this.$popup_switch, false);// 弹窗通知
		    		this.noticeConfig.ding.isEnabled ? cssFn.switch(_this.$ding_switch, true) : cssFn.switch(_this.$ding_switch, false);// 钉钉通知
		    		_this.$popup_click.find(`input[value="${this.noticeConfig.popup.onclick}"]`).click();// 点击弹窗方式
		    		_this.$popup_times.find(`input[value="${this.noticeConfig.popup.times}"]`).click();// 弹窗次数
		    		_this.$popup_again_time.val(this.noticeConfig.popup.timeAgain);// 再次提醒时间
		    		_this.$popup_time.val(this.noticeConfig.popup.time);// 弹窗时间
		    		_this.$popup_icon.val(this.noticeConfig.popup.icon);// 弹窗图片
		    		_this.$notice_title.val(this.noticeConfig.title);// 通知标题
		    		_this.$ding_at_who.find(`input[value="${this.noticeConfig.ding.atWho}"]`).click();// 钉钉消息艾特谁
		    		_this.$ding_webhook.val(this.noticeConfig.ding.webhook);// 钉钉webhook

		    		// _this.$notice_set_room.css("top", _this.$header.offset().top + 48).css("left", _this.$header.offset().left + 20).slideDown("fast");// show
		    		_this.$notice_set_room.slideDown("fast");// show
		    	} else {// 上滑隐藏
		    		_this.saveNoticeConfig();
		    		_this.$notice_set_room.slideUp();
		    	}
		    	
		    });

		    // 弹窗通知开关
		    _this.$popup_switch.click(function () {
		    	if ($(this).attr("class").indexOf("coneProtal-switch-off") > -1) {// 开启
		    		_this.popupOpen();
		    	} else {// 关闭
		    		_this.popupClosed();
		    	}
		    });

		    // 钉钉通知开关
		    _this.$ding_switch.click(function () {
		    	if ($(this).attr("class").indexOf("coneProtal-switch-off") > -1) {// 开启
		    		_this.dingOpen();
		    	} else {// 关闭
		    		_this.dingClosed();
		    	}
		    });

		    // 弹窗点击-单选按钮
		    _this.$popup_click.click(function () {
		    	cssFn.radio(_this.$popup_click, false);
		    	cssFn.radio($(this), true);
		    });

		    // 弹窗次数-单选按钮
		    _this.$popup_times.click(function () {
		    	cssFn.radio(_this.$popup_times, false);
		    	cssFn.radio($(this), true);
		    });

			// 弹窗显示时间，只能输入正整数和零
			_this.$popup_time.keyup(function(){
			    $(this)[0].value = $(this)[0].value.replace(/^0(0+)|[^\d]+/g,'');
			});

		    // 钉钉消息-@的对象（多选框）
		    // _this.$ding_at_who.click(function () {
		    // 	if (-1 == $(this).attr("class").indexOf("checked")) {// 开启
		    // 		cssFn.radio(_this.$ding_at_who, false);
		    // 		cssFn.radio($(this), true);
		    // 	} else {// 关闭
		    // 		cssFn.radio($(this), false);
		    // 	}
		    // });

		    // 钉钉消息-@的对象
		    _this.$ding_at_who.click(function () {
		    	cssFn.radio(_this.$ding_at_who, false);
		    	cssFn.radio($(this), true);
		    });

		    // 钉钉webhook输入框，失去焦点时
		    _this.$ding_webhook.blur(function () {
		    	let webhook = $(this).val();
		    	// 如果数值发生变化
		    	if(webhook != tools.noticeConfig.ding.webhook) {
		    		// 不为空，则校验地址是否有效；为空，则直接保存
		    		!!webhook ? _this.noticeDing(true, webhook, tools.defaultNoticeConfig.title, "钉钉机器人设置成功") : (_this.saveWebhook(""), _this.dingClosed());
		    	}
		    });

		    // 确认按钮
		    _this.$set_submit.click(function () {
		    	_this.saveNoticeConfig();
		    	_this.$notice_set_room.slideUp();
		    });

		    // X按钮，隐藏弹窗
		    _this.$set_close.click(function () {
		    	_this.$notice_set_room.slideUp();
		    });
		    
		},

		// 初始化设置
		initSet: function () {
			let _this = this;
			// 重新开启清理屏蔽工单的计时器
			_this.clearPopupRemindAgain(_this.blockedId.popupRemindAgain);
			// 清空等待钉钉发送的工单
			!!_this.blockedId.waitDing && (_this.blockedId.waitDing = "", local.set("tools_blockedId", _this.blockedId));
			// 输入刷新倒计时时间
			_this.refresh.time > 0 && _this.$refresh_time.val(_this.refresh.time);
			// 开启刷新
			_this.refresh.isEnabled && _this.refresh.time > 0 && _this.refreshStart(_this.refresh.time);
			// 开启通知
			_this.noticeConfig.isEnabled && _this.noticeOpen();
		},

		// 开始自动刷新倒计时
		refreshStart: function (time) {
			let _this = this;
			if (time > 0) {
				// 保存数据
				_this.refresh.time = time;
				_this.refresh.isEnabled = true;
				local.set("tools_refresh", _this.refresh);

				// 倒计时
				let countdown = time;
				!!this.countdownTimer && clearInterval(this.countdownTimer);// 防止重复
				this.countdownTimer = setInterval(()=>{
					setTimeout(()=>{// setInterval似乎有点弊端，嵌入一个setTimeout
						countdown --;
						_this.$refresh_time.val(countdown);
						if (countdown <= 0) {
							_this.$handled_button.length > 0 && _this.$handled_button.click();// 刷新页面工单
							this.noticeConfig.isEnabled && _this.getDate();
							countdown = time;// 重置倒计时时间
						}
					}, 0);
				}, 1e3);

				// 打开开关
				cssFn.switch(_this.$refresh_switch, true);
			} else {
				cssFn.error(_this.$refresh_time, 1);
			}
		},

		// 停止自动刷新
		refreshStop: function () {
			let _this = this;
			clearInterval(_this.countdownTimer);
			_this.$refresh_time.val(_this.refresh.time);

			// 移除保存的数据
			local.remove("tools_refresh");

			// 关闭开关
    		cssFn.switch(_this.$refresh_switch, false);
		},

		// 通知开启
		noticeOpen: function () {
			// let _this = this;
			this.noticeConfig.isEnabled = true;
			this.checkNoticeDate();
			this.refresh.isEnabled && this.getDate();

			local.set("tools_noticeConfig", this.noticeConfig);
			cssFn.switch(this.$notice_switch, true);
		},

		// 通知关闭
		noticeClosed: function () {
			// let _this = this;
			this.noticeConfig.isEnabled = false;
			local.set("tools_noticeConfig", this.noticeConfig);
			cssFn.switch(this.$notice_switch, false);
		},

		// 弹窗通知开启
		popupOpen: function () {
			this.noticeConfig.popup.isEnabled = true;
			local.set("tools_noticeConfig", this.noticeConfig);
			cssFn.switch(this.$popup_switch, true);
		},

		// 弹窗通知关闭
		popupClosed: function () {
			this.noticeConfig.popup.isEnabled = false;
			local.set("tools_noticeConfig", this.noticeConfig);
			cssFn.switch(this.$popup_switch, false);
		},

		// 钉钉通知开启
		dingOpen: function () {
			if (!!this.noticeConfig.ding.webhook) {// webhook有值
				this.noticeConfig.ding.isEnabled = true;
				local.set("tools_noticeConfig", this.noticeConfig);
				cssFn.switch(this.$ding_switch, true);
			} else {// webhook为空
				this.dingClosed();
				this.noticePopup("请先填写钉钉机器人", "未填写webhook", 5);
				cssFn.focus(this.$ding_webhook, 1);
			}
		},

		// 钉钉通知关闭
		dingClosed: function () {
			this.noticeConfig.ding.isEnabled = false;
			local.set("tools_noticeConfig", this.noticeConfig);
			cssFn.switch(this.$ding_switch, false);
		},

		// 保存钉钉webhook
		saveWebhook: function (webhook) {
			this.noticeConfig.ding.webhook = webhook;
			local.set("tools_noticeConfig", this.noticeConfig);
		},

		// 获取手机号，钉钉@自己用，待更新
		getMobile: function () {
			GM_xmlhttpRequest({
				method: "GET",
				url: "https://gaea-admin.wt.cainiao.com/servicer_info",
				headers: {
		    		"Content-Type": "application/json"
		    	},
				onload: function(res) {
					// console.log(res);
					// console.log(res.response);
					let data = res.response && JSON.parse(res.response);
					if (data.success) {
						tools.noticeConfig.ding.mobile = data.data.attributeMap.mobile;
						local.set("tools_noticeConfig", tools.noticeConfig);
					}
				},
				onerror: function(res) {
					console.error("error");
					console.error(res);
					console.error(res.response);
				}
			});
		},

		// 获取待处理工单数据
		getDate: function () {
			$.ajax({
				url: "https://desk.wt.cainiao.com/taskQuery/query",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify({
					"searches": [{
						"type": "START_HITS",
						"params": [0, 50]
					}, {
						"type": "SORT",
						"params": [1],
						"field": "taskInfo.expectTime"
					}, {
						"type": "EQUALS_QUERY",
						"field": "taskInfo.status",
						"params": [2]
					}],
					"entry": "PENDING_CASE",
					"matchLoginDealer": true
				}),
				success: function (res) {
					// console.log(res);
					if (!!res.data[0] && tools.noticeConfig.isEnabled) {// 有返回数据，且已开启通知
						let subtitle = "";// 待更新
						let blockedId = local.get("tools_blockedId") || tools.blockedId;
						tools.checkNoticeDate();

						// 遍历工单
						$.each(res.data, function (i, val) {
							let gmtModified = new Date(val.taskInfo.gmtModified).getTime(),// 获取修改时间的时间戳（如果工单再次转交到自己，修改时间gmtModified会发生变化）
								blockedIdVal = val.taskInfo.id + "#" + gmtModified + ",";// 屏蔽的格式

							// 弹窗通知：开启了弹窗通知，非屏蔽的工单，且非再次提醒内的工单
							if (tools.noticeConfig.popup.isEnabled && (-1 == blockedId.popup.indexOf(blockedIdVal)) && (-1 == blockedId.popupRemindAgain.indexOf(blockedIdVal))) {
								// 单次或多次提醒
								"again" != tools.noticeConfig.popup.times ? blockedId.popup += blockedIdVal : (blockedId.popupRemindAgain += blockedIdVal, tools.clearPopupRemindAgain(blockedIdVal));
								
								local.set("tools_blockedId", blockedId);

								tools.noticePopup(tools.noticeConfig.title + " " + subtitle, val.caseInfo.memo, tools.noticeConfig.popup.time, tools.popupOnclick, val.caseInfo.id, val.taskInfo.id, blockedIdVal);
							}

							// 钉钉通知：开启了钉钉通知，非屏蔽的工单，非等待发送的工单
							if(tools.noticeConfig.ding.isEnabled && (-1 == blockedId.ding.indexOf(blockedIdVal)) && (-1 == blockedId.waitDing.indexOf(blockedIdVal))) {
								let text = "工单编号：[" + val.caseInfo.id + "](" + document.location.protocol + "//" + document.location.host + `/unified/ticketManage/ticketDetail?caseId=${val.caseInfo.id}&taskId=${val.taskInfo.id})`
										+ "  \n业务状态：" + val.caseInfo.bizStatusName
										+ "  \n业务类型：" + val.caseInfo.categoryIdName
										+ "  \n创建人/时间：" + val.caseInfo.creatorName + " " + new Date(val.taskInfo.gmtCreate).format("yyyy-MM-dd hh:mm:ss")
										+ "  \n剩余处理时间：" + val.taskInfo.expectTimeExport
										+ "  \n工单描述：" + val.caseInfo.memo
									;
								tools.noticeDing(false, tools.noticeConfig.ding.webhook, tools.noticeConfig.title + " " + subtitle, text, blockedIdVal, tools.noticeConfig.ding.atWho);
							}
						});
					}
					// 登陆状态正常
					tools.isLogoutNotice = false;
				},
				error: function (res) {
					console.error(res);
					!tools.isLogoutNotice && tools.noticePopup("菜鸟工单登陆可能已失效", "请刷新页面", 0);
					tools.isLogoutNotice = true;
				}
			});
		},

		// 弹窗通知
		noticePopup: function (title, text, timeout, onclick, caseId, taskId, blockedIdVal) {
			GM_notification({
		    	text: text,
		        title: title,
		        image: tools.noticeConfig.popup.icon,
		        // highlight: highlight,// 是否高亮标签
		        // silent: silent,// 通知声音
		        timeout: timeout * 1e3,// 通知显示时间，0表示一直显示
		        ondone: null,// 通知被关闭时，无论是被点击还是超时，执行的函数
		        onclick: function () {
			        "function" == typeof onclick && onclick(caseId, taskId, blockedIdVal);
		        }
	        })
		},

		// 点击弹窗事件
		popupOnclick: function (caseId, taskId, blockedIdVal) {
			switch(tools.noticeConfig.popup.onclick) {
				case "open":
					if(!!caseId && !!taskId) {
						// 新建标签：active 新的tab是否被聚焦，insert 插入一个新的tab在当前的tab后面，setParent 在tab关闭后重新聚焦当前tab，incognito 是否在隐私窗口中打开
						GM_openInTab(`https://desk.wt.cainiao.com/unified/ticketManage/ticketDetail?caseId=${caseId}&taskId=${taskId}`, {active: true, insert: true, setParent: true, incognito: false});
					} else {
						tools.noticePopup("获取链接参数有误", "请检查", 5);
					}
					break;
				case "block":
					let blockedId = local.get("tools_blockedId") || tools.blockedId;
					blockedId.popup += blockedIdVal;
					local.set("tools_blockedId", blockedId);
					break;
				default: ;// 默认是close
			}
		},

		// 清除弹窗间隔的工单ID（即间隔时间后，再次弹窗通知此工单）
		clearPopupRemindAgain: function (val) {
			!!val && setTimeout(()=>{
				let blockedId = local.get("tools_blockedId") || this.blockedId;
				blockedId.popupRemindAgain = blockedId.popupRemindAgain.replace(new RegExp(val, "g"), "");
				local.set("tools_blockedId", blockedId);
			}, this.noticeConfig.popup.timeAgain * 1e3);
		},

		// 钉钉通知
		noticeDing: function (isTest, webhook, title, text, blockedIdVal, atWho) {// isTest：是否是测试webhook地址
			!!webhook && GM_xmlhttpRequest({
				method: "POST",
				url: webhook,
				data: JSON.stringify({
				    "msgtype": "markdown",
				    "markdown": {
		                "title": title,
				        "text": ("atMe" == atWho ? "[@" + tools.noticeConfig.ding.mobile + "]()  \n": "") + ("atAll" == atWho ? "[@所有人]()  \n" : "") + text
				    },
				    "at": {
					    "atMobiles": [tools.noticeConfig.ding.mobile],
					    "isAtAll": "atAll" == atWho ? true : false
					}
				}),
				headers: {
		    		"Content-Type": "application/json"
		    	},
				onload: function(res) {
					// console.log("sendSuccess");
					// console.log(res);
					// console.log(res.response);
					let data = res.response && JSON.parse(res.response);
					let blockedId = local.get("tools_blockedId") || tools.blockedId;
					if (!!data) {
						switch (data.errcode) {
							// 成功发送
							case 0: 
								if(!!isTest) {// 是测试webhook地址
									tools.saveWebhook(webhook);
									tools.dingOpen();
									tools.noticePopup("钉钉机器人设置成功", "webhook链接正确", 5);
								} else {// 钉钉通知成功
									blockedId.ding += blockedIdVal;
									local.set("tools_blockedId", blockedId);
								}
								break;

							// 自定义关键词有误
							case 310000: tools.noticePopup("机器人的自定义关键词请设置为：工单", "报错信息：" + data.errmsg, 5);
								break;

							// 超出1分钟内20条的通知频率
							case 130101: 
								blockedId.waitDing += blockedIdVal;
								local.set("tools_blockedId", blockedId);
								tools.resendDing(isTest, webhook, title, text, blockedIdVal, atWho);
								break;

							// 超出字数限制
							case 460101: tools.noticeDing(isTest, webhook, title, "超出字数限制", blockedIdVal, atWho);
								break;

							// 其他
							default: tools.noticePopup("钉钉通知发送失败", "报错信息：" + data.errmsg, 5);
						}
						
					} else {
						tools.noticePopup(!!isTest ? "钉钉机器人Webhook链接设置有误" : "钉钉通知发送失败，请打开控制台查看报错信息", "报错信息：" + data.errmsg, 5);
					}
				},
				onerror: function(res) {
					console.error("error");
					console.error(res);
					console.error(res.response);
					tools.noticePopup(isTest ? "钉钉机器人Webhook链接设置有误" : "钉钉通知发送失败，请打开控制台查看报错信息", "请检查", 5);
				}
			})
		},

		// 重推钉钉通知（发送频率过快，1分钟超过20条）
		resendDing: function (isTest, webhook, title, text, blockedIdVal, atWho) {
			!tools.noticeConfig.ding.waitTime && (tools.noticeConfig.ding.waitTime = 90);

			setTimeout(()=>{
				console.log(text);
				// console.log(this);
				let blockedId = local.get("tools_blockedId") || tools.blockedId;
				if(tools.noticeConfig.isEnabled && tools.noticeConfig.ding.isEnabled && (-1 == blockedId.ding.indexOf(blockedIdVal))) {
					tools.noticeDing(isTest, webhook, title, text, blockedIdVal, atWho);
				}
			}, tools.noticeConfig.ding.waitTime * 1e3);
		},

		// 保存通知设置（webhook走独立保存）
		saveNoticeConfig: function () {
			let _this = this;
			let popup_click = _this.$popup_click.siblings(".checked").find("input").val(),// 点击弹窗
				popup_times = _this.$popup_times.siblings(".checked").find("input").val(),// 弹窗次数
	    		popup_again_time = _this.$popup_again_time.val(),// 再次提醒时间
	    		popup_time = _this.$popup_time.val(),// 弹窗时间
	    		popup_icon = _this.$popup_icon.val(),// 弹窗图片
	    		notice_title = _this.$notice_title.val(),// 通知标题
	    		ding_at_who = _this.$ding_at_who.siblings(".checked").find("input").val();// 钉钉消息艾特谁

    		this.noticeConfig.popup.onclick = popup_click;// 点击弹窗
    		this.noticeConfig.popup.times = popup_times;// 弹窗次数
    		popup_again_time > 0 ? (this.noticeConfig.popup.timeAgain = popup_again_time) : (this.noticeConfig.popup.timeAgain = _this.defaultNoticeConfig.popup.timeAgain);// 再次提醒时间
    		("0" == popup_time || popup_time >= 0) ? (this.noticeConfig.popup.time = popup_time) : (this.noticeConfig.popup.time = _this.defaultNoticeConfig.popup.time);// 弹窗时间
    		!!popup_icon ? (this.noticeConfig.popup.icon = popup_icon) : (this.noticeConfig.popup.icon = _this.defaultNoticeConfig.popup.icon);// 弹窗图片
    		!!notice_title ? (this.noticeConfig.title = notice_title) : (this.noticeConfig.title = _this.defaultNoticeConfig.title);// 通知标题
    		this.noticeConfig.ding.atWho = ding_at_who;

    		_this.checkNoticeDate(true);
    		local.set("tools_noticeConfig", this.noticeConfig);
		},

		// 检查通知开启情况
		checkNoticeDate: function (isSave) {
			// 开启通知状态下
			if(this.noticeConfig.isEnabled) {
				// 弹窗通知和钉钉通知，如都未开启，保存时，关闭通知；非保存时，默认开启弹窗通知
				!this.noticeConfig.popup.isEnabled && !this.noticeConfig.ding.isEnabled && (isSave ? this.noticeClosed() : this.popupOpen());
				// 钉钉通知开启，但webhook为空，则关闭钉钉通知
				this.noticeConfig.ding.isEnabled && !this.noticeConfig.ding.webhook && this.dingClosed();
			}
		}
		
	};


	/* ---自定义css效果--- */
	let cssFn = {
		// 开关
		switch: function (ele, status) {// ele: 元素; status: 开关状态
			status ? ele.removeClass("coneProtal-switch-off").addClass("coneProtal-switch-on") : ele.removeClass("coneProtal-switch-on").addClass("coneProtal-switch-off");
		},
		// 单选框
		radio: function (ele, status) {// ele: 元素; status: 开关状态
			status ? ele.addClass("checked") : ele.removeClass("checked");
		},
		// 多选框
		checkbox: function (ele, status) {// ele: 元素; status: 开关状态
			status ? ele.addClass("checked") : ele.removeClass("checked");
		},
		// 错误红框
		error: function (ele, time) {// ele: 元素; time: 恢复时间
			ele.parent().addClass("next-error").addClass("next-focus");
			setTimeout(()=>{
				ele.parent().removeClass("next-error");
				!ele.is(":focus") && ele.parent().removeClass("next-focus");
			}, time * 1e3);
		},
		// 添加临时焦点
		focus: function (ele, time) {
			ele.parent().addClass("next-focus");
			setTimeout(()=>{
				!ele.is(":focus") && ele.parent().removeClass("next-focus");
			}, time * 1e3);
		}
	};



	/* ---localStorage--- */
	let local = {
		get: function (key) {
			return JSON.parse(localStorage.getItem(key))
		},
		set: function (key, val) {
			return localStorage.setItem(key, JSON.stringify(val))
		},
		remove: function (key) {
			return localStorage.removeItem(key)
		}
	};


	/* ---小工具Html--- */
	let toolsHtml = {
		"first": `
<!-- 下次改css -->
<button id="notice_set" type="button" class="next-btn next-medium next-btn-normal cdesk-lp-button-group-item" style="margin-left: 30px;">
	<i class="next-icon next-icon-set next-xs next-btn-icon next-icon-first"></i>
	<span class="next-btn-helper">通知设置</span>
</button>
<div class="next-col-fixed-5 next-form-item-label" style="line-height: 48px;"><label>设置自动刷新</label></div>
<span class="next-number-picker next-number-picker-normal next-medium" style="line-height: 48px;"><span class="next-input next-medium">
		<input id="refresh_time" type="number" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" placeholder="秒">
</span></span>
<div id="refresh_switch" role="switch" tabindex="0" class="coneProtal-switch coneProtal-switch-off coneProtal-switch-medium" style="min-width: 62px;margin-left: 10px;top: 6px;/* line-height: 48px; */">
	<div class="coneProtal-switch-children">开始</div>
</div>
<div id="notice_switch" role="switch" tabindex="0" class="coneProtal-switch coneProtal-switch-off coneProtal-switch-medium" style="min-width: 62px;margin-left: 10px;top: 6px;/* line-height: 48px; */">
	<div class="coneProtal-switch-children">通知</div>
</div>
`,



		"set": `
<!-- 下次改css -->
<div class="next-overlay-wrapper">
	<div id="notice_set_room" class="next-overlay-inner crui-simple-table-preference-overlay" style="position: fixed;left: 260px;top: 48px;width: 420px;display: none;">
		<div class="crui-simple-table-preference-overlay-title" style="height: 15px;">
			<p></p>
			<i id="set_close" class="next-icon next-icon-close next-small crui-simple-table-preference-overlay-close"></i>
		</div>
		<div class="crui-simple-table-preference-overlay-body" style="max-height: none;margin-bottom: 10px;">
			<!-- 通知方式1 -->
			<div dir="ltr" role="gridcell" class="next-col">
				<div dir="ltr" role="row" class="next-row next-form-item has-success next-medium next-form-item-fullwidth">
					<div dir="ltr" role="gridcell" class="next-col next-col-fixed-4 next-form-item-label">
						<label>通知方式：</label>
					</div>
					<div dir="ltr" role="gridcell" class="next-col next-form-item-control next-col-fixed-5">
						<div id="popup_switch" role="switch" tabindex="0" class="coneProtal-switch coneProtal-switch-medium coneProtal-switch-on" style="min-width: 62px;/* margin-left: 5px; */top: 8px;/* line-height: 48px; */margin-right: 10px;">
							<div class="coneProtal-switch-children">弹窗</div>
						</div>
					</div>
					<div dir="ltr" role="gridcell" class="next-col next-form-item-control next-col-fixed-5">
						<div id="ding_switch" role="switch" tabindex="0" class="coneProtal-switch coneProtal-switch-medium coneProtal-switch-off" style="min-width: 62px;/* margin-left: 5px; */top: 8px;/* line-height: 48px; */margin-right: 10px;">
							<div class="coneProtal-switch-children">钉钉</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 通知方式2 -->
			<!-- <div dir="ltr" role="gridcell" class="next-col"><div dir="ltr" role="row" class="next-row next-form-item has-success next-medium next-form-item-fullwidth"><div dir="ltr" role="gridcell" class="next-col next-col-fixed-4 next-form-item-label"><label>通知方式：</label></div><div dir="ltr" role="gridcell" class="next-col next-form-item-control next-col-fixed-7"><div id="" role="switch" tabindex="0" class="coneProtal-switch coneProtal-switch-medium coneProtal-switch-off" style="/* min-width: 90px; *//* margin-left: 5px; */top: 8px;/* line-height: 48px; *//* margin-right: 10px; */"><div class="coneProtal-switch-children"></div></div><div dir="ltr" role="gridcell" class="next-col next-form-item-label" style="padding-right: 0;margin-left: 5px;"><label>弹窗通知</label></div></div><div dir="ltr" role="gridcell" class="next-col next-form-item-control next-col-fixed-7"><div id="" role="switch" tabindex="0" class="coneProtal-switch coneProtal-switch-medium coneProtal-switch-on" style="/* min-width: 90px; *//* margin-left: 5px; */top: 8px;/* line-height: 48px; *//* margin-right: 10px; */"><div class="coneProtal-switch-children"></div></div><div dir="ltr" role="gridcell" class="next-col next-form-item-label" style="padding-right: 0;margin-left: 5px;"><label>钉钉通知</label></div></div></div></div> -->
			<!-- 点击弹窗 -->
			<div dir="ltr" role="gridcell" class="next-col">
				<div dir="ltr" role="row" class="next-row next-form-item has-success next-medium next-form-item-fullwidth">
					<div dir="ltr" role="gridcell" class="next-col next-col-fixed-4 next-form-item-label">
						<label>点击弹窗：</label>
					</div>
					<div dir="ltr" role="gridcell" class="next-col next-form-item-control" id="popup_click_room">
						<div role="radiogroup" class="next-radio-group next-radio-group-hoz">
							<label dir="ltr" class="next-radio-wrapper checked ">
								<span class="next-radio">
									<span class="next-radio-inner"></span>
									<input type="radio" class="next-radio-input" value="close">
								</span>
								<span class="next-radio-label">关闭弹窗</span>
							</label>
							<label dir="ltr" class="next-radio-wrapper">
								<span class="next-radio">
									<span class="next-radio-inner "></span>
									<input type="radio" class="next-radio-input" value="open">
								</span>
								<span class="next-radio-label">打开工单</span>
							</label>
							<label id="popup_block" dir="ltr" class="next-radio-wrapper">
								<span class="next-radio">
									<span class="next-radio-inner "></span>
									<input type="radio" class="next-radio-input" value="block">
								</span>
								<span class="next-radio-label">不再提醒</span>
							</label>
							<label id="popup_again" dir="ltr" class="next-radio-wrapper" style="display: none;">
								<span class="next-radio">
									<span class="next-radio-inner "></span>
									<input type="radio" class="next-radio-input" value="again">
								</span>
								<span class="next-radio-label">再次提醒</span>
							</label>
						</div>
					</div>
				</div>
			</div>
			<!-- 弹窗次数 -->
			<div dir="ltr" role="gridcell" class="next-col">
				<div dir="ltr" role="row" class="next-row next-form-item has-success next-medium next-form-item-fullwidth">
					<div dir="ltr" role="gridcell" class="next-col next-col-fixed-4 next-form-item-label">
						<label>弹窗次数：</label>
					</div>
					<div dir="ltr" role="gridcell" class="next-col next-form-item-control" id="popup_times_room">
						<div role="radiogroup" class="next-radio-group next-radio-group-hoz">
							<label dir="ltr" class="next-radio-wrapper checked ">
								<span class="next-radio">
									<span class="next-radio-inner"></span>
									<input type="radio" class="next-radio-input" value="once">
								</span>
								<span class="next-radio-label">单次提醒</span>
							</label>
							<label dir="ltr" class="next-radio-wrapper">
								<span class="next-radio">
									<span class="next-radio-inner "></span>
									<input type="radio" class="next-radio-input" value="again">
								</span>
								<span class="next-radio-label">多次提醒</span>
							</label>
						</div>
					</div>
				</div>
			</div>
			<!-- 再次提醒 -->
			<div dir="ltr" role="gridcell" class="next-col">
				<div dir="ltr" role="row" class="next-row next-form-item has-success next-medium next-form-item-fullwidth">
					<div dir="ltr" role="gridcell" class="next-col next-col-fixed-4 next-form-item-label">
						<label>再次提醒：</label>
					</div>
					<div dir="ltr" role="gridcell" class="next-col next-col-fixed-4 next-form-item-control">
						<span class="next-number-picker next-number-picker-normal next-medium" style="/* line-height: 48px; */">
							<span class="next-input next-medium">
								<input id="popup_again_time" type="number" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" placeholder="秒">
							</span>
						</span>
					</div>
					<div dir="ltr" role="gridcell" class="next-col next-form-item-label" style="text-align: left;margin-left: 10px;color: #ccc;">
						<label>秒（同一工单再次提醒间隔时间）</label>
					</div>
				</div>
			</div>
			<!-- 弹窗时间 -->
			<div dir="ltr" role="gridcell" class="next-col">
				<div dir="ltr" role="row" class="next-row next-form-item has-success next-medium next-form-item-fullwidth">
					<div dir="ltr" role="gridcell" class="next-col next-col-fixed-4 next-form-item-label">
						<label>弹窗时间：</label>
					</div>
					<div dir="ltr" role="gridcell" class="next-col next-col-fixed-4 next-form-item-control">
						<span class="next-number-picker next-number-picker-normal next-medium" style="/* line-height: 48px; */">
							<span class="next-input next-medium">
								<input id="popup_time" type="number" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" placeholder="秒">
							</span>
						</span>
					</div>
					<div dir="ltr" role="gridcell" class="next-col next-form-item-label" style="text-align: left;margin-left: 10px;color: #ccc;">
						<label>秒（0表示一直显示）</label>
					</div>
				</div>
			</div>
			<!-- 弹窗图片 -->
			<div dir="ltr" role="gridcell" class="next-col">
				<div dir="ltr" role="row" class="next-row next-form-item has-success next-medium next-form-item-fullwidth">
					<div dir="ltr" role="gridcell" class="next-col next-col-fixed-4 next-form-item-label">
						<label>弹窗图片：</label>
					</div>
					<div dir="ltr" role="gridcell" class="next-col next-form-item-control next-col-fixed-14">
						<span data-meta="Field" class="next-input next-medium">
							<input id="popup_icon" placeholder="链接(清空则恢复默认)" height="100%" autocomplete="off" value="">
						</span>
					</div>
				</div>
			</div>
			<!-- 通知标题 -->
			<div dir="ltr" role="gridcell" class="next-col">
				<div dir="ltr" role="row" class="next-row next-form-item has-success next-medium next-form-item-fullwidth" style="">
					<div dir="ltr" role="gridcell" class="next-col next-col-fixed-4 next-form-item-label">
						<label>通知标题：</label>
					</div>
					<div dir="ltr" role="gridcell" class="next-col next-form-item-control next-col-fixed-7">
						<span data-meta="Field" class="next-input next-medium">
							<input id="notice_title" placeholder="标题(清空则恢复默认)" height="100%" autocomplete="off" value="">
						</span>
					</div>
					<div dir="ltr" role="gridcell" class="next-col next-form-item-label" style="padding-right: 7px;max-width: 20px;">
						<label>+</label>
					</div>
					<div dir="ltr" role="gridcell" class="next-col next-form-item-control next-col-fixed-6">
						<span data-meta="Field" class="next-select next-select-trigger next-select-multiple next-medium next-inactive next-no-search" >
							<span class="next-input next-medium next-select-inner">
								<span class="next-select-values next-input-text-field">
									<span class="next-select-trigger-search">
										<input role="combobox" tabindex="0" placeholder="暂无" readonly="" height="100%" size="1" autocomplete="off" value="">
										<span><span>请选择</span><span>&nbsp;</span></span>
									</span>
								</span>
								<span class="next-input-control">
									<span class="next-select-arrow">
										<i class="next-icon next-icon-arrow-down next-medium next-select-symbol-fold"></i>
									</span>
									<span class="next-select-clear">
										<i class="next-icon next-icon-delete-filling next-medium"></i>
									</span>
								</span>
							</span>
							<span class="next-sr-only"></span>
						</span>
					</div>
				</div>
			</div>
			<!-- 钉钉消息 -->
			<div dir="ltr" role="gridcell" class="next-col">
				<div dir="ltr" role="row" class="next-row next-form-item has-success next-medium next-form-item-fullwidth">
					<div dir="ltr" role="gridcell" class="next-col next-col-fixed-4 next-form-item-label">
						<label>钉钉消息：</label>
					</div>
					<!--
					<div dir="ltr" role="gridcell" class="next-col next-form-item-control next-col-fixed-14" id="ding_at_who">
						<label class="next-checkbox-wrapper " style="display: inline;margin-right: 24px;">
							<span class="next-checkbox">
								<span class="next-checkbox-inner">
									<i class="next-icon next-icon-select next-xs next-checkbox-select-icon"></i>
								</span>
								<input type="checkbox" class="next-checkbox-input" value="atMe">
							</span>
							<span class="next-checkbox-label">@自己</span>
						</label>
						<label class="next-checkbox-wrapper" style="display: inline;margin-right: 24px;">
							<span class="next-checkbox">
								<span class="next-checkbox-inner">
									<i class="next-icon next-icon-select next-xs next-checkbox-select-icon"></i>
								</span>
								<input type="checkbox" class="next-checkbox-input" value="atAll">
							</span>
							<span class="next-checkbox-label">@所有人</span>
						</label>
					</div>
					-->
					<div dir="ltr" role="gridcell" class="next-col next-form-item-control" id="ding_at_who">
						<div role="radiogroup" class="next-radio-group next-radio-group-hoz">
							<label dir="ltr" class="next-radio-wrapper checked">
								<span class="next-radio">
									<span class="next-radio-inner"></span>
									<input id="ding_no_at" type="radio" class="next-radio-input" value="">
								</span>
								<span class="next-radio-label">不用艾特</span>
							</label>
							<label dir="ltr" class="next-radio-wrapper">
								<span class="next-radio">
									<span class="next-radio-inner "></span>
									<input id="ding_at_me" type="radio" class="next-radio-input" value="atMe">
								</span>
								<span class="next-radio-label">@自己</span>
							</label>
							<label dir="ltr" class="next-radio-wrapper">
								<span class="next-radio">
									<span class="next-radio-inner "></span>
									<input id="ding_at_all" type="radio" class="next-radio-input" value="atAll">
								</span>
								<span class="next-radio-label">@所有人</span>
							</label>
						</div>
					</div>
				</div>
			</div>
			<!-- 钉钉机器人 -->
			<div dir="ltr" role="gridcell" class="next-col">
				<div dir="ltr" role="row" class="next-row next-form-item has-success next-medium next-form-item-fullwidth">
					<div dir="ltr" role="gridcell" class="next-col next-col-fixed-4 next-form-item-label">
						<label>钉钉机器人：</label>
					</div>
					<div dir="ltr" role="gridcell" class="next-col next-form-item-control next-col-fixed-14">
						<span data-meta="Field" class="next-input next-medium">
							<input id="ding_webhook" placeholder="Webhook链接（自定义关键词填“工单”）" height="100%" autocomplete="off" value="">
						</span>
					</div>
				</div>
			</div>
			<!-- 小提示 -->
			<div dir="ltr" role="gridcell" class="next-col">
		    	<div class="" style="text-align: right;">
		            <a href="https://4pxgroup.yuque.com/docs/share/7badb8be-14b6-45cd-8403-b9c9c8e59823" target="_blank" style="font-size: smaller;">如何启用钉钉机器人？</a>
		        </div>
			</div>
		</div>
		<div id="set_submit" class="crui-simple-table-preference-overlay-bottom">确定</div>
	</div>
</div>
`
	};



	setTimeout(()=>{ tools.init(); }, 3e3);
	


})();

