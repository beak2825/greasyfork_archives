// ==UserScript==
// @name         盖亚工单播报
// @namespace    https://desk.wt.cainiao.com/
// @version      1.0
// @description  4PX专用
// @author       ZRF
// @match        https://desk.wt.cainiao.com/unified/ticketManage/queryTicket
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_xmlhttpRequest
// @connect      oapi.dingtalk.com
// @grant        GM_notification
// @license      ZRF
// @downloadURL https://update.greasyfork.org/scripts/435387/%E7%9B%96%E4%BA%9A%E5%B7%A5%E5%8D%95%E6%92%AD%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/435387/%E7%9B%96%E4%BA%9A%E5%B7%A5%E5%8D%95%E6%92%AD%E6%8A%A5.meta.js
// ==/UserScript==

(function() {
	'use strict';

/**
 * 新建数：caseInfo的gmtCreate创建日期为今天
 * 处理中：01234状态的，
 * 研发等处理中：上方处理中的，且taskInfo的dealerIdName不是技术支持
 * 已处理：taskInfo的gmtModified是今天的
 */
// 播报时间：大促期间 （11号---20号）默认每天定时播报时间，1点， 9点， 12点，15点，18点， 21点


	let count = {
		init: function () {
			this.initUI();
			this.cacheElements();
			this.initEvent();
		},
		initUI: function () {
			let html = `<button id="count_btn" type="button" class="next-btn next-medium next-btn-primary cdesk-lp-button-group-item" style="margin-right: 12px;"><span class="next-btn-helper">播报</span></button>`;
			$(".cdesk-lp-table-area .crui-simple-table-preference-trigger").before(html);
		},
		cacheElements: function () {
			this.$count_btn = $("#count_btn");// 播报按钮
		},
		initEvent: function () {
			let _this = this;
			// 播报按钮
			_this.$count_btn.click(function () {
				if(!count.isLoading) {// 上次的请求统计已结束
					_this.initDate();
					$.each(_this.business, function (i, val) {
						_this.getData(val.name, val.type);
					});
				} else {// 上次的请求统计未结束
					notice.popup("正在统计中", "loading", 5);
					console.log("loading");
				}
			});
		},
		initDate: function () {
			this.isLoading = true;
			this.$count_btn.addClass("next-btn-loading");

			this.business = [{
				"type": ["55001", "54001", "54002", "53001", "53002", "52001", "52002", "50003", "50004", "49005", "49006", "49007", "48004", "48005"],
				"name": "XMS直发"
			},{
				"type": ["79001", "78001", "75003", "75002", "73004"],
				"name": "AE业务"
			},{
				"type": ["47001", "47002", "47003", "47004", "47005", "46003", "46004", "46005", "45004", "45005", "44002", "44003", "44004", "44005", "44006", "44007", "44008", "44009", "44010"],
				"name": "国家C站"
			},{
				"type": ["63005", "62005", "61001", "60001", "59001", "59002", "57001", "56003", "71001"],
				"name": "FB4海外仓"
			},{
				"type": ["60007", "59008", "56010"],
				"name": "CSS计费结算"
			},{
				"type": ["56009", "70002", "69005"],
				"name": "CRM客户关系"
			},{
				"type": ["63004", "62003", "61009", "60006", "57007", "56008", "74004", "73002", "68008"],
				"name": "数据导出"
			}];
			this.jszcName = "袁锐茂,王皓文,夏林斌,莫建英,詹锐峰,李勇,李炳樽,王通,韦廷娟,曹泽嘉,贾磊,师露雨";// 技术支持
			this.nowTime = new Date().getTime();
			// this.beginTime = new Date().getTime() - 7 * 24 * 60 * 60 * 1e3;// 7天前
			this.getTimes = 0;// 请求次数
			this.todayDate = new Date().format("yyyy-MM-dd hh:mm");// 今日日期
			this.today0time = new Date(new Date().toDateString()).getTime();// 获取当天零点时间戳
			this.today0Date = new Date(this.today0time).format("yyyy-MM-dd hh:mm");// 当天零点日期
			this.defaultData = {// 默认数据格式
				"newToday": 0,
				"processing": 0,
				"processingNotJszc": 0,
				"processed": 0
			};
			this.result = {// 发送通知的文本
				"total": $.extend({}, count.defaultData)
			};
			$.each(this.business, function (i, val) {
				count.result[val.name] = $.extend({}, count.defaultData);
			});
			console.log(this.result);
		},
		// 获取统计数据
		// 业务状态：0跟进中，1待处理，2待升级处理，3待二次升级处理，4待三次升级处理，5取消，6完结待确认，7完结
		getData: function (businessName, businessType) {// business业务名称, businessType所有的工单类型
			$.ajax({
				url: "https://desk.wt.cainiao.com/taskQuery/query",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify({
					"searches": [{
						"field": "caseInfo.gmtCreate",
						"params": [count.today0time, count.nowTime],
						"type": "TIME_RANGE_FILTER"
					}, {
						"field": "caseInfo.caseType",
						"params": ["1"],
						"type": "IN_QUERY"
					}, {
						"field": "caseInfo.categoryId",
						"params": businessType,
						"type": "IN_QUERY"
					}, {
						"type": "DISTINCT",
						"field": "caseInfo.id"
					}, {
						"type": "START_HITS",
						"params": [0, 3000]
					}, {
						"type": "SORT",
						"params": [2],
						"field": "caseInfo.gmtCreate"
					}],
					"entry": "CASE_QUERY"
				}),
				success: function (res) {
					console.log(res);
					if (res.success && !!res.data[0]) {
						$.each(res.data, function (i, val) {
							// 新建数
							new Date(val.caseInfo.gmtCreate).getTime() - count.today0time > 0 && count.newTodayFn(businessName, val);
							// 处理中的状态
							val.caseInfo.bizStatus <= 4 && count.processingFn(businessName, val);
							// 已处理的状态
							val.caseInfo.bizStatus >= 6 && count.processedTodayFn(businessName, val);
						});
					} 
					count.getTimes + 1 == count.business.length ? count.output() : count.getTimes ++;
				},
				error: function (res) {
					console.error(res);
				}
			});
		},

		// 新建的工单量
		newTodayFn: function (businessName, data) {
			// 不记录已取消的工单
			data.caseInfo.bizStatus != 5 && this.result[businessName].newToday ++;
		},

		// 处理中的工单量
		processingFn: function (businessName, data) {
			this.result[businessName].processing ++;
			// 非技术支持处理中的工单
			-1 == this.jszcName.indexOf(data.taskInfo.dealerIdName) && this.result[businessName].processingNotJszc ++;
		},

		// 已处理的工单量
		processedTodayFn: function (businessName, data) {
			this.result[businessName].processed ++;
		},

		// 输出结果
		output: function () {
			let text = "【工单播报】 " 
					+ "  \n开始时间：" + this.today0Date
					+ "  \n结束时间：" + this.todayDate
					+ "  \n> ###### 处理中 = 跟进中 + 待处理 + 待一二三次升级"
					+ "  \n> ###### 已处理 = 完结待确认 + 完结"
					;

			// 各个业务数据
			for (var businessName in this.result) {
				if (this.result[businessName].newToday > 0) {// 今日工单量大于0的业务
					text += "  \n+ [" + businessName + "]()"
						+ "  \n###### **新  建：" + this.result[businessName].newToday + " 个**"
						+ "  \n###### **处理中：" + this.result[businessName].processing + " 个**"
						+ (this.result[businessName].processingNotJszc > 0 ? "  \n> ###### 其中研发处理中：" + this.result[businessName].processingNotJszc + " 个" : "")
						+ "  \n###### **已处理：" + this.result[businessName].processed + " 个**"
						;
				}
				// 合计计算
				this.result.total.newToday += this.result[businessName].newToday;
				this.result.total.processing += this.result[businessName].processing;
				this.result.total.processingNotJszc += this.result[businessName].processingNotJszc;
				this.result.total.processed += this.result[businessName].processed;
			}

			// 合计
			text += "  \n---"
				+ "  \n+ <font color='#FF0000'>合计：</font>"
				+ "  \n###### **新  建：" + this.result.total.newToday + " 个**"
				+ "  \n###### **处理中：" + this.result.total.processing + " 个**"
				+ "  \n> ###### 其中研发处理中：" + this.result.total.processingNotJszc + " 个"
				+ "  \n###### **已处理：" + this.result.total.processed + " 个**"

			notice.ding("工单播报", text);
			console.log(this.result);
			console.log(text);
			this.isLoading = false;
			this.$count_btn.removeClass("next-btn-loading");
		}
	};




	

	

	// 通知
	let notice = {
		// 钉钉通知
		ding: function (title, text) {
		// "open" == sendDingStatus && 
			GM_xmlhttpRequest({
				method: "POST",
				url: "https://oapi.dingtalk.com/robot/send?access_token=a0d8095765c9c0e58b2ea6a31edad8e065c462193907dd58f426a441e9c1e7d8",
				data: JSON.stringify({
					"msgtype": "markdown",
					"markdown": {
						"title": title,
						"text": text
					},
					"at": {
						"atMobiles": [],
						"isAtAll": false
					}
				}),
				headers: {
					"Content-Type": "application/json"
				},
				onload: function(res) {
					// console.log("sendSuccess");
					// console.log(res);
					console.log(res.response);
					0 == JSON.parse(res.response).errcode ? notice.popup("发送成功", "ok", 5) : notice.popup("发送失败，钉钉机器人安全设置有误", res.response, 5);
				},
				onerror: function(res) {
					console.error("error");
					console.error(res);
					console.error(res.response);
				}
			})
		},
		// 浏览器弹窗通知
		popup: function (title, text, timeout) {
			GM_notification({
			text: text,
			title: title,
			// image: image,
			// highlight: highlight,// 是否高亮标签
			// silent: silent,// 通知声音
			timeout: timeout * 1e3,// 通知显示时间，0表示一直显示
			// ondone: null,// 通知被关闭时，无论是被点击还是超时，执行的函数
			// onclick: null
			// window.location.reload();
			})
		}
	};



	setTimeout(()=>{
		count.init();
	}, 3e3);
	


	// 按键触发
	$(document).keydown(function(e) {
		// Alt + C
		if(67 == e.keyCode && e.altKey) {
			console.log("Alt + C");
			count.output();
		}
		// Alt + X
		if(88 == e.keyCode && e.altKey) {
			console.log("Alt + X");
			// count.init();
		}
	});


})();
