// ==UserScript==
// @name         mhy直播奖励领取脚本
// @namespace
// @version      1.2测试版
// @description  用于领取mhy直播奖励
// @author       fuchenhqh
// @match        *://www.bilibili.com/blackboard/era/*.html*
// @match        *://www.bilibili.com/blackboard/new-award-exchange.html*
// @match        *://www.bilibili.com/blackboard/activity-*.html*
// @match        *://zt.huya.com/*/pc/index.html*
// @match        *://www.douyu.com/topic*
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @license      MIT
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/468113/mhy%E7%9B%B4%E6%92%AD%E5%A5%96%E5%8A%B1%E9%A2%86%E5%8F%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/468113/mhy%E7%9B%B4%E6%92%AD%E5%A5%96%E5%8A%B1%E9%A2%86%E5%8F%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// 功能点载体#########################################################################################################################################################################################
	/*
	* 创建元素的快捷方法:
	* 1. type, props, children
	* 2. type, props, innerHTML
	* 3. 'text', text
	* @param type string, 标签名; 特殊的, 若为text, 则表示创建文字, 对应的t为文字的内容
	* @param props object, 属性; 特殊的属性名有: className, 类名; style, 样式, 值为(样式名, 值)形式的object; event, 值为(事件名, 监听函数)形式的object;
	* @param children array, 子元素; 也可以直接是html文本;
	*/
	function createElement(type, props, children) {
		let elem = null;
		if (type === "text") {
			return document.createTextNode(props);
		}
		else {
			elem = document.createElement(type);
		}
		for (let n in props) {
			if (n === "style") {
				for (let x in props.style) {
					elem.style[x] = props.style[x];
				}
			}
			else if (n === "className") {
				elem.className = props[n];
			}
			else if (n === "event") {
				for (let x in props.event) {
					elem.addEventListener(x, props.event[x]);
				}
			}
			else {
				// 用undefined表示不设置这个属性
				props[n] !== undefined && elem.setAttribute(n, props[n]);
			}
		}
		if (children) {
			if (typeof children === 'string') {
				elem.innerHTML = children;
			}
			else {
				for (let i = 0; i < children.length; i++) {
					if (children[i] != null)
						elem.appendChild(children[i]);
				}
			}
		}
		return elem;
	}

	function addSettingsButton() {
		let indexNav = document.querySelector('.fuchen1');
		const createBtnStyle = (size, diffCss) => {
			diffCss = diffCss || `
										#balh-settings-btn {
												bottom: 110px;
												border: 1px solid #e5e9ef;
												border-radius: 4px;
												background: #f6f9fa;
												margin-top: 4px;
										}
										#balh-settings-btn .btn-gotop {
												text-align: center;
										}
								`;
			return createElement('style', {}, [createElement('text', `
										${diffCss}
										#balh-settings-btn {
												width: ${size};
												height: ${size};
												cursor: pointer;
										}
										#balh-settings-btn:hover {
												background: #00a1d6;
												border-color: #00a1d6;
										}
										#balh-settings-btn .icon-saturn {
												width: 30px;
												height: ${size};
												fill: rgb(153,162,170);
										}
										#balh-settings-btn:hover .icon-saturn {
												fill: white;
										}
						`)]);
		};
		document.body.appendChild(createBtnStyle('44px', `
												#balh-settings-btn {
														float: left;
														margin: 3px 0 0 20px;
														background: #FFF;
														border-radius: 10px;
												}
												#balh-settings-btn>:first-child {
														text-align: center;
														height: 100%;
												}
										`));
		document.body.appendChild(createElement('div', { style: { position: 'fixed', right: '6px', bottom: '45px', zIndex: '129', textAlign: 'center', display: 'none' }, id }));
	}

	function createWindow() {
		document.head.appendChild(createElement('style', { id: 'AHP_Notice_style' }, [createElement('text', `
	#drag{z-index:2147483647;position:fixed;display:flex;flex-direction:column;bottom:0px;right:0px;width:529px;height:300px;background: url("https://s3.bmp.ovh/imgs/2022/07/22/4689a30beb77ab7f.jpg") no-repeat center center;
	border:1px solid #444;border-radius:5px;box-shadow:0 1px 3px 2px #666;}
	#drag .title{position:relative;height:60px;;margin:5px;}
	#drag .title h2{font-size:14px;height:60px;line-height:60px;border-bottom:1px solid #A1B4B0;}
	#drag .title div{position:absolute;height:19px;top:2px;right:0;}
	#drag .title a,a.open{float:left;width:50px;height:19px;display:block;margin-left:5px;font-family: 微软雅黑;color: #634225;font-size: 12px;}
	a.open{position:absolute;top:10px;left:50%;margin-left:-10px;background-position:0 0;}
	a.open:hover{background-position:0 -29px;}
	#drag .title a.min{background-position:-29px 0;}
	#drag .title a.min:hover{background-position:-29px -29px;}
	#drag .title a.max{background-position:-60px 0;}
	#drag .title a.max:hover{background-position:-60px -29px;}
	#drag .title a.revert{background-position:-149px 0;display:none;}
	#drag .title a.revert:hover{background-position:-149px -29px;}
	#drag .title a.close{background-position:-89px 0;}
	#drag .title a.close:hover{background-position:-89px -29px;}
	#drag .content{overflow:auto;margin:0 5px;flex-grow:1;}
	#drag .resizeBR{position:absolute;width:14px;height:14px;right:0;bottom:0;overflow:hidden;cursor:nw-resize;}
	#drag .resizeL,#drag .resizeT,#drag .resizeR,#drag .resizeB,#drag .resizeLT,#drag .resizeTR,#drag .resizeLB{position:absolute;background:#000;overflow:hidden;opacity:0;filter:alpha(opacity=0);}
	#drag .resizeL,#drag .resizeR{top:0;width:5px;height:100%;cursor:w-resize;}
	#drag .resizeR{right:0;}
	#drag .resizeT,#drag .resizeB{width:100%;height:5px;cursor:n-resize;}
	#drag .resizeT{top:0;}
	#drag .resizeB{bottom:0;}
	#drag .resizeLT,#drag .resizeTR,#drag .resizeLB{width:8px;height:8px;background:#FF0;}
	#drag .resizeLT{top:0;left:0;cursor:nw-resize;}
	#drag .resizeTR{top:0;right:0;cursor:ne-resize;}
	#drag .fuchen1{border:1px solid  #444 !important;border-radius:2px;}
	#drag .resizeLB{left:0;bottom:0;cursor:ne-resize;}`)]));
		document.body.appendChild(createElement('div', { id: 'drag' }))
		$('#drag').append(`<div class="title" style="cursor: move;">
	<h2 style="font-size: 18px;font-family: 微软雅黑;color:#FF5C7C">直播奖励领取</h2>
	<div>
	<a class="min" href="javascript:;" title="最小化">最小化</a>
	<a class="revert" href="javascript:;" title="还原">还原</a>

	</div>
	</div>
	<div class="resizeL"></div>
	<div class="resizeT"></div>
	<div class="resizeR"></div>
	<div class="resizeB"></div>
	<div class="resizeLT"></div>
	<div class="resizeTR"></div>
	<div class="resizeBR"></div>
	<div class="resizeLB"></div>

	<div class="flag1-button"></div>
	<div class="content flag1-data"></div>`)
	// console.log($('#drag'))
	}
	/*-------------------------- +
		拖拽函数
	 +-------------------------- */
	function drag(oDrag, handle) {
		var get = {
			byId: function (id) {
				return typeof id === "string" ? document.getElementById(id) : id
			},
			byClass: function (sClass, oParent) {
				var aClass = [];
				var reClass = new RegExp("(^| )" + sClass + "( |$)");
				var aElem = this.byTagName("*", oParent);
				for (var i = 0; i < aElem.length; i++) reClass.test(aElem[i].className) && aClass.push(aElem[i]);
				return aClass
			},
			byTagName: function (elem, obj) {
				return (obj || document).getElementsByTagName(elem)
			}
		};
		var dragMinWidth = 250;
		var dragMinHeight = 124;
		var disX = 0;
		var dixY = 0;
		var oMin = get.byClass("min", oDrag)[0];
		var oRevert = get.byClass("revert", oDrag)[0];

		handle = handle || oDrag;
		handle.style.cursor = "move";
		handle.onmousedown = function (event) {
			var disX = event.clientX - handle.offsetLeft;
			var disY = event.clientY - handle.offsetTop;
			disX = event.clientX - oDrag.offsetLeft;
			disY = event.clientY - oDrag.offsetTop;

			document.onmousemove = function (event) {
				let events = event || window.event;
				var iL = events.clientX - disX;
				var iT = events.clientY - disY;
				var maxL = document.documentElement.clientWidth - oDrag.offsetWidth;
				var maxT = document.documentElement.clientHeight - oDrag.offsetHeight;

				iL <= 0 && (iL = 0);
				iT <= 0 && (iT = 0);
				iL >= maxL && (iL = maxL);
				iT >= maxT && (iT = maxT);

				oDrag.style.left = iL + "px";
				oDrag.style.top = iT + "px";

				return false
			};

			document.onmouseup = function () {
				document.onmousemove = null;
				document.onmouseup = null;
				this.releaseCapture && this.releaseCapture()
			};
			this.setCapture && this.setCapture();
			return false
		};
		//还原按钮
		oRevert.onclick = function () {
			oDrag.style.width = 531 + "px";
			oDrag.style.height = 300 + "px";
			oDrag.style.bottom = "0px";
			oDrag.style.right = "0px";
			this.style.display = "none";
			oMin.style.display = "block";
			scrollCont();
		};
		//最小化按钮
		oMin.onclick = function () {
			oDrag.style.width = 300 + "px";
			oDrag.style.height = 150 + "px";
			oDrag.style.bottom = "0px";
			oDrag.style.right = "0px";
			this.style.display = "none";
			oRevert.style.display = "block";
			scrollCont();
		};
		//阻止冒泡
		oMin.onmousedown = function (event) {
			this.onfocus = function () { this.blur() };
			(event || window.event).cancelBubble = true
		};
	}
	// 主体内容滚动函数
	function scrollCont() {
		// 获取当前元素高度
		var newH = document.getElementById("drag").offsetHeight;
		// 设置表格最大高度
		var taskTable = document.getElementsByClassName("flag1-data")[0];
		taskTable.setAttribute('style', `max-height: ${newH - 75}px !important;overflow:auto`);
	}
	/*-------------------------- +
		改变大小函数
	 +-------------------------- */
	function resize(oParent, handle, isLeft, isTop, lockX, lockY) {
		var dragMinWidth = 100;
		var dragMinHeight = 50;
		handle.onmousedown = function (event) {
			var eve = event || window.event;
			var disX = event.clientX - handle.offsetLeft;
			var disY = event.clientY - handle.offsetTop;
			var iParentTop = oParent.offsetTop;
			var iParentLeft = oParent.offsetLeft;
			var iParentWidth = oParent.offsetWidth;
			var iParentHeight = oParent.offsetHeight;

			document.onmousemove = function (event) {
				let ev = event || window.event;
				var iL = ev.clientX - disX;
				var iT = ev.clientY - disY;
				var maxW = document.documentElement.clientWidth - oParent.offsetLeft - 2;
				var maxH = document.documentElement.clientHeight - oParent.offsetTop - 2;
				var iW = isLeft ? iParentWidth - iL : handle.offsetWidth + iL;
				var iH = isTop ? iParentHeight - iT : handle.offsetHeight + iT;

				isLeft && (oParent.style.left = iParentLeft + iL + "px");
				isTop && (oParent.style.top = iParentTop + iT + "px");

				iW < dragMinWidth && (iW = dragMinWidth);
				iW > maxW && (iW = maxW);
				lockX || (oParent.style.width = iW + "px");

				iH < dragMinHeight && (iH = dragMinHeight);
				iH > maxH && (iH = maxH);
				lockY || (oParent.style.height = iH + "px");
				scrollCont();
				if ((isLeft && iW == dragMinWidth) || (isTop && iH == dragMinHeight)) document.onmousemove = null;
				return false;
			};
			document.onmouseup = function () {
				document.onmousemove = null;
				document.onmouseup = null;
			};
			return false;
		}
	};

	// 自定义逻辑函数################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################
	// 监听标签是否加载完毕
	jQuery.fn.wait = function (func, times, interval) {
		var _times = times || -1, //100次
			_interval = interval || 20, //20毫秒每次
			_self = this,
			_selector = this.selector, //选择器
			_iIntervalID; //定时器id
		if (this.length) { //如果已经获取到了，就直接执行函数
			func && func.call(this);
		} else {
			_iIntervalID = setInterval(function () {
				if (!_times) { //是0就退出
					clearInterval(_iIntervalID);
				}
				_times <= 0 || _times--; //如果是正数就 --

				_self = $(_selector); //再次选择
				if (_self.length) { //判断是否取到
					func && func.call(_self);
					clearInterval(_iIntervalID);
				}
			}, _interval);
		}
		return this;
	}

	// 自定义样式
	// $("head").append("<style> .flag1{overflow-y: scroll;}</style>");
	$("head").append("<style> .fuchen-p{text-shadow: 2px 2px 4px #66ccff;}</style>");
	$("head").append("<style>table {border: 1px solid black;border-collapse: collapse; /* 合并边框 */} th,td {border: 1px solid black;padding: 10px;background-color: rgba(255, 255, 255, 0.8);}</style>");




	// main###############################################################################################################################################################################
	$(document).ready(function () {
		console.log("导入成功");

		createWindow();
		var get = {
			byId: function (id) {
				return typeof id === "string" ? document.getElementById(id) : id
			},
			byClass: function (sClass, oParent) {
				var aClass = [];
				var reClass = new RegExp("(^| )" + sClass + "( |$)");
				var aElem = this.byTagName("*", oParent);
				for (var i = 0; i < aElem.length; i++) reClass.test(aElem[i].className) && aClass.push(aElem[i]);
				return aClass
			},
			byTagName: function (elem, obj) {
				return (obj || document).getElementsByTagName(elem)
			}
		};
		var oDrag = document.getElementById("drag");
		var oTitle = get.byClass("title", oDrag)[0];
		var oL = get.byClass("resizeL", oDrag)[0];
		var oT = get.byClass("resizeT", oDrag)[0];
		var oR = get.byClass("resizeR", oDrag)[0];
		var oB = get.byClass("resizeB", oDrag)[0];
		var oLT = get.byClass("resizeLT", oDrag)[0];
		var oTR = get.byClass("resizeTR", oDrag)[0];
		var oBR = get.byClass("resizeBR", oDrag)[0];
		var oLB = get.byClass("resizeLB", oDrag)[0];

		drag(oDrag, oTitle);
		//四角
		resize(oDrag, oLT, true, true, false, false);
		resize(oDrag, oTR, false, true, false, false);
		resize(oDrag, oBR, false, false, false, false);
		resize(oDrag, oLB, true, false, false, false);
		//四边
		resize(oDrag, oL, true, false, false, true);
		resize(oDrag, oT, false, true, true, false);
		resize(oDrag, oR, false, false, false, true);
		resize(oDrag, oB, false, false, true, false);

		oDrag.style.bottom = "0px";
		oDrag.style.right = "0px";

		// 变量
		var f1 = false;
		
		
		// 阶段数组，不定
		var jd = [3, 5, 10, 20, 30, 40];



		/** 预期实现功能
		 * 1、（简单）快捷导航，b站奖励直播首页定位，点击按钮到达大概位置
		 *	开局定位到直播赛道
		 *	星铁：https://www.bilibili.com/blackboard/activity-NJHgRB8RXx.html
		 *	原神：https://www.bilibili.com/blackboard/activity-QEEZ1nL6Jv.html
		 * 2、（困难）获取直播活动完成情况，获取直播天数
		 *	参考手机端的天数请求链接，用Ajax拉取天数和直播活动完成情况
		 * 3、正常循环抢奖励功能，可询问意见是否加自动刷新，判断开始抢奖励再停止刷新开抢
		 *	判断没奖励则自动刷新（可能会导致使用原查看奖励时会被刷新烦到。。吧）
		 *	
		 *
		 * 其他：
		 * location.hostname获取域名，window.location.href获取完整网址
		 * 文字加阴影，css：text-shadow: 2px 2px 4px #66ccff;
		 */
		// b站逻辑	=====================================================================================
		if (location.hostname.indexOf("bilibili") >= 0) {
			// 首页	-------------------------------------------------------------------------------------
			if ((window.location.href.indexOf("activity-award-exchange") < 0)&&(window.location.href.indexOf("new-award-exchange") < 0)) {
				// 滚动函数
				scrollCont();
				// 声明变量
				var intervalId;
				// 快捷导航，四个按钮
				$(".flag1-button").append("<button id='buttonf-zbsd' style='opacity: 0.7;'>直播赛道定位</button>");
				$(".flag1-button").append("<button id='buttonf-ztsjdq' style='opacity: 0.7;'>任务完成情况</button>");
				$(".flag1-button").append("<button id='buttonf-xdrw' style='opacity: 0.7;' disabled>限定任务</button>");
				$(".flag1-button").append("<button id='buttonf-mrrw' style='opacity: 0.7;' disabled>每日任务</button>");
				$(".flag1-button").append("<button id='buttonf-lcrw' style='opacity: 0.7;' disabled>里程任务</button>");
				// 预设表格标签，信息
				$(".flag1-data").append("<table id='flag_xx_table' style='display:none;'><tr><th>任务名称</th><th>完成情况</th><th>今日剩余</th><th>整体剩余</th></tr></table>");
				// 快捷导航，功能实现
				// 开局定位
				$(".activity-navigator-list").wait(function () { $(".activity-navigator-list .activity-navigator-item:eq(2) .activity-navigator-item-active-image").click(); });
				// 四个按钮
				$("#buttonf-zbsd").click(function () {
					$(".activity-navigator-list .activity-navigator-item:eq(2) .activity-navigator-item-active-image").click();
				});
				$("#buttonf-xdrw").click(function () {
					
				});
				$("#buttonf-mrrw").click(function () {

				});
				$("#buttonf-lcrw").click(function () {
				});
				// 获取直播任务完成情况
				/**
				 * 每次点击	$('[data-module="ogv-dialog-pc"][layout="\[object Object\]"]')	时
				 * 获得body最后一个div的信息，且有a标签 $('body div:last a')
				 * if($('body div:last a').length > 0){}	用来判断选择器是否选择到元素
				 * 有匹配到则分析a标签herf里的链接是否包含	activity-award-exchange.html?task_id=
				 * 接上，可直接用$('body div:last a[href*="activity-award-exchange.html?task_id="]')
				 * 使用jquery的ajax发起请求
				 */

				// $('[data-module="ogv-dialog-pc"][layout="\[object Object\]"]').click(function () {
					
				// });
				
				// $("button#buttonf-ztsjdq").click(function () {
				// 	console.log("点击了暂停数据读取的按钮，停止");
				// 	clearInterval(intervalId);
				// });
				// 切换状态的函数
				$("button#buttonf-ztsjdq").click(function(){
					if($("button#buttonf-ztsjdq").text().indexOf("暂停") !== -1){
						clearInterval(intervalId);
						$("button#buttonf-ztsjdq").text("任务完成情况");
					}else if($("button#buttonf-ztsjdq").text().indexOf("任务") !== -1){
						$("button#buttonf-ztsjdq").text("暂停数据读取");
						// 点击后将table显示
						$("#flag_xx_table").show();
						// 清除表格内容
						$('#flag_xx_table tr').not(':first').remove();

						// 完成情况二维数组，储存ajax返回并筛选的数据
						var wcqk_arr = [];
						var a_href_task_id = [];
						if ($('body div:last a[href*="activity-award-exchange.html?task_id="]').length > 0) {
							// 获取cookie里的bili_jct，作为请求的csrf
							var bili_jct = document.cookie.match(/bili_jct=([^;]+)/)[1];
							// console.log(bili_jct);
							// 遍历目标a标签链接，作为ajax的参数
							$('body div:last a[href*="activity-award-exchange.html?task_id="]').each(function () {
								var bili_id = $(this).attr('href').match(/\?task_id=([a-zA-Z0-9]*)/);
								// console.log(bili_id[1]);
								a_href_task_id.push(bili_id[1]);
							});
							console.log('a_href_task_id:'+a_href_task_id);
							
							// 下面是发起ajax请求使用setInterval来设置延迟
							var index_f = 0;
							// 加定时循环
							intervalId = setInterval(function () {
								// 判断是否达到停止条件
								if ((index_f >= a_href_task_id.length)) {
									clearInterval(intervalId);
									$("button#buttonf-ztsjdq").text("任务完成情况");
									return;
								}
								// 发起请求获取数据
								$.ajax({
									url: "https://api.bilibili.com/x/activity/mission/single_task", // 替换成实际的 API URL
									// 设置超时
									// timeout: 5000,
									type: 'GET', // 使用 GET、POST、PUT、DELETE 等 HTTP 方法
									data: {
										csrf: bili_jct,
										id: a_href_task_id[index_f++]
									},
									// 返回的数据为json。
									dataType: "json",
									headers: {
										Accept: "application/json, text/plain, */*",
									},
									xhrFields: {
										// 附带cookie的ajax方式
										withCredentials: true
									},
									success: function (Jdata, status) { // 成功响应的回调函数
										/**
										 * .data.task_info.task_name							task_name任务名,0
										 * .data.task_info.reward_info.reward_name				reward_name 任务奖励,1
										 * .data.task_info.group_list[0].group_base_num			group_base_num ：任务要求天数,2
										 * .data.task_info.group_list[0].group_complete_num		group_complete_num : 完成天数,3
										 * .data.task_info.receive_status						receive_status : 0-未完成任务,1-已完成任务,2-不知道,3-没奖励,4
										 * .data.task_info.reward_stock_configs[1].total		reward_period_stock_num : 当日总量,5
										 * .data.task_info.reward_stock_configs[1].consumed		reward_stock_configs.consumed 当日已领,6
										 * .data.task_info.reward_stock_configs[0].total		reward_period_stock_num : 整体总量,7
										 * .data.task_info.reward_stock_configs[0].consumed		reward_stock_configs.consumed 整体已领,8
										 *
										 * */

										// 局部变量数组
										var sz = [];
										// 将数据压入数组
										if (Jdata.code === 0) {
											sz.push(Jdata.data.task_info.task_name);
											sz.push(Jdata.data.task_info.reward_info.reward_name);
											sz.push(Jdata.data.task_info.group_list[0].group_base_num);
											sz.push(Jdata.data.task_info.group_list[0].group_complete_num);
											sz.push(Jdata.data.task_info.receive_status);
											sz.push(Jdata.data.task_info.reward_stock_configs[1].total);
											sz.push(Jdata.data.task_info.reward_stock_configs[1].consumed);
											sz.push(Jdata.data.task_info.reward_stock_configs[0].total);
											sz.push(Jdata.data.task_info.reward_stock_configs[0].consumed);
											// console.log(sz);
											// sz.push("task_name:"+Jdata.data.task_info.task_name);
											// sz.push("reward_name:"+Jdata.data.task_info.reward_info.reward_name);
											// sz.push("group_base_num:"+Jdata.data.task_info.group_list[0].group_base_num);
											// sz.push("group_complete_num:"+Jdata.data.task_info.group_list[0].group_complete_num);
											// sz.push("receive_status:"+Jdata.data.task_info.receive_status);
											// sz.push("total-1:"+Jdata.data.task_info.reward_stock_configs[1].total);
											// sz.push("consumed1:"+Jdata.data.task_info.reward_stock_configs[1].consumed);
											// sz.push("total_0:"+Jdata.data.task_info.reward_stock_configs[0].total);
											// sz.push("consumed0:"+Jdata.data.task_info.reward_stock_configs[0].consumed);

											wcqk_arr.push(sz);

											// 输出数据，任务名，任务完成情况，今日奖励剩余 整体奖励剩余
											$("#flag_xx_table").append("<tr><td>" + sz[0] + "</td><td>" + sz[3] + "/" + sz[2] + "</td><td>" + (sz[5] - sz[6]) + "/" + sz[5] + "</td><td>" + (sz[7] - sz[8]) + "/" + sz[7] + "</td></tr>");

										}
										else {
											wcqk_arr.push("bug!");
										}
									},
									error: function (xhr, status, error) { // 失败响应的回调函数
										console.log('错误：' + error);
									}
								});
							}, 1100);
							// 以上，循环结束
							// 外部循环停止条件，点击叉了的按钮
							$("body > div:last > div:first").click(function () {
								console.log("点击了叉掉奖励框的按钮，停止");
								clearInterval(intervalId);
								$("button#buttonf-ztsjdq").text("任务完成情况");
							});
						}
						else{
							$("#flag_xx_table").append("<tr><td colspan='4' style='text-align:center;'>未选择模块，无法获取数据</td></tr>");
							$("button#buttonf-ztsjdq").text("任务完成情况");
						}
						console.log(wcqk_arr);
					}else{
						console.log("出bug咯~");
					}
				});
			}
			// 奖励页	----------------------------------------------------------------------------------
			else {
				console.log("奖励页");
				$(".flag1-button").append("<button class='fuchen1' style='opacity: 0.7;'>开始抢奖励</button>");
				$(".tool-wrap").before('<section class="tool-wrap"><div class="button fuchen1">开始抢奖励</div><!----></section>');
				// 自动抢奖励，开局判断内容 无“无”且有“领”
				$(".button.exchange-button").wait(function () { 
					if (($(".button.exchange-button").text().indexOf("无") < 0)&&($(".button.exchange-button").text().indexOf("领") >= 0)){
						$("button.fuchen1").click();
					}
				});

				// 手动抢奖励
				$(".fuchen1").click(function () {
					// 此if用以更改按钮的状态，改变按钮文字，控制启停
					if (f1 = !f1) {
						// 判断内容无“无”且有“领”
						window.ount1 = setInterval(function () {
							// 加判断，自动停止
							if($('.v-dialog__wrap').css('display') === "block"){
								$("button.fuchen1").click();
							}
							// 抢奖励的判断
							else if (($(".button.exchange-button").text().indexOf("无") < 0)&&($(".button.exchange-button").text().indexOf("领") >= 0)){
								$(".button.exchange-button").click();
								console.log("抢");
							}
						}, 30);  //改这边速率，100为每秒10次，1000为每秒1次，10为每秒100次。
						$(".fuchen1").text("暂停抢奖励");
					} else {
						$(".fuchen1").text("开始抢奖励");
						clearInterval(ount1);
						console.log("停止");
					}
				});
			}
		}
		// b站逻辑=====================================================================================


		/** 预期实现功能
		 * 1、简化斗鱼页面，删除直播画面
		 * 2、自动定位	算了有点复杂不想写了
		 * 2、日常功能，自动领取奖励，高间隔刷新（可加个随机函数）
		 * 3、关键功能，列出奖励，领取奖励
		 */
		// 斗鱼逻辑	=====================================================================================
		if (window.location.href.indexOf("douyu") >= 0) {
			// 初始化数据
			var f2 = false;

			// 简化页面----------------------------------------------------------------------------------
			/**
			 * 1、有问题，画面没了但有声音
			 */
			//  开局删除斗鱼直播画面
			$(".layout-Player").remove();
			// 判断目标标签加载完成后，删除直播标签
			$(".wm-tabv2-body").wait(function() {$(".layout-Main").parents(".wm-general").remove();});
			// 滚动函数
			scrollCont();
			// 大框架
			$(".flag1-button").append("<button class='fuchen1'>开始抢奖励</button>");
			$(".flag1-data").append("<div class='anwzkj'></div>");

			// 定位位置----------------------------------------------------------------------------------
			/**
			 * 1、算了有点复杂，不想写了
			 */

			// 日常功能----------------------------------------------------------------------------------
			/**
			 * 1、自动领取每日
			 */

			// 关键功能----------------------------------------------------------------------------------
			/**
			 * 1、获取所有奖励模块
			 * 	大模块：$(".wm-tabv2-header-content")原穹有区别，原的每日和奖励在同一页面，穹不是
			 * 		判断点击，刷新奖励内容
			 * 	中模块：$("div.wmTaskV3")
			 * 	小模块：$("div.wmTaskV3Item")
			 *  	其中，刷新为$("div.wmTaskV3Reload")	奖励为wmTaskV3Item
			 * 2、体现所有奖励模块
			 * 3、操作所有奖励模块
			 * 其他：
			 * 	奖励数据：https://www.douyu.com/japi/carnival/nc/roomTask/getStatus?taskIds=215754%2C215755%2C215756%2C215757%2C215758%2C215759%2C215760%2C215761%2C215841
			 * 		其中%2C为英文逗号，用于拼接多个请求
			 * 	taskId和id对应关系 https://butterfly.douyucdn.cn/api/page/loadPage?name=pageData2&pageId=44557&ver=yza4odfknz&view=0
			 */
			// 初始化，其实也就先获取一次当前大中模块的奖励
			$("div.wm-tabv2-body-content > div.wm-view > div").wait(function(){
				// 设置默认阶段
				var i = 0;
				var y = 0;
				console.log("模块显示初始化");
				$("div.wmTaskV3").each(function () {
					var z = 0;
					$(".anwzkj").append("<p class=mkxx mk"+(i)+">模块"+(i+1)+"</p>");
					$(".anwzkj").append("<p class='anj an"+(i)+"'></p>");
					$(this).find('.wmTaskV3Item').each(function(){
						console.log("太难了");
						$("p.an"+(i)).append((z+1)+"<input type='radio' name='anj"+(i+1)+"' value='"+(y+1)+"'>");
						y = y+1;
						z = z+1;
					});
					i=i+1;
				});
			});

			// 切换大模块点击响应，使用on动态绑定click事件，由于点击切换模块会导致dom树的改变，从而使选择器原有的事件失效
			$(".wm-general-wrapper.bc-wrapper > .wm-view > div > .wm-tabv2").wait(function(){
				$(".wm-general-wrapper.bc-wrapper > .wm-view > div > .wm-tabv2").on('click', '.wm-tabv2-header-content,.wmTaskV3Reload', function(){
					var i = 0;
					var y = 0;
					setTimeout(function () {
						console.log("点击了大模块");
						// 将原有的内容删掉
						$(".flag1-data p").remove();
						// 显示新的内容
						$("div.wmTaskV3").each(function () {
							var z = 0;
							$(".anwzkj").append("<p class=mkxx mk"+(i)+">模块"+(i+1)+"</p>");
							$(".anwzkj").append("<p class='anj an"+(i)+"'></p>");
							$(this).find('.wmTaskV3Item').each(function(){
								console.log("太难了");
								$("p.an"+(i)).append((z+1)+"<input type='radio' name='anj"+(i+1)+"' value='"+(y+1)+"'>");
								y = y+1;
								z = z+1;
							});
							i=i+1;
						});
					}, 200);
				});
			});
			// // 单选按钮再点击可以取消，卡壳了
			// $('.anwzkj').on('click',"input",function() {
			// 	console.log("点了一下单选");
			// 	if ($(this).prop('checked')) {
			// 	  	$(this).prop('checked', false); // 取消选中状态
			// 	}
			// 	else{
			// 		$(this).prop('checked', true);
			// 	}
			// });
			

			// 获取奖励模块，小模块
			$(".fuchen1").click(function () {
				if (f2 = !f2) {

					//暂时试试不点刷新了，稳一点
					// // 点刷新，循环1
					// window.ount2_1 = setInterval(function () {
					// 	// 点刷新
					// 	$("#bc626 .wmTaskV3Reload").click();
					// }, 1000);// 刷新速率


					// 抢奖励，循环2
					window.ount2_2 = setInterval(function () {
						// 领取阶段性奖励
						/**
						 * 先获取选中按钮的状态，然后再内个领取奖励
						 * 标签的第二个class $('.anj').attr('class').split(' ')[1]
						 * 
						 */
						var f = 0;
						$(".anj").each(function(){
							// 判断有没有选中
							$("div.wmTaskV3 div.wmTaskV3Item:eq("+($("[name='anj"+(f+1)+"']:checked").val()-1)+") button").click();
							f++;
						});
						
						// $("div.wmTaskV3 div.wmTaskV3Item:eq("+(dy_dqjd-1)+") button").click();

						// 取消提示
						if ($(".dy-Modal-content").length > 0) {
							$(".dy-btn").click();
						}

						// 取消验证码1
						if ($("a.geetest_close").length > 0) {
							$("a.geetest_close").click();
						}
					}, 100);// 抢奖励速率

					$(".fuchen1").text("暂停抢奖励");
				} else {
					// clearInterval(ount2_1);
					clearInterval(ount2_2);
					$(".fuchen1").text("开始抢奖励");
				}
			});
			
		}
		// 斗鱼逻辑=====================================================================================

		// 虎牙逻辑=====================================================================================
		/** 
		 * 预期实现功能
		 * 1、原始抢奖励功能
		 * 2、自动领取每日功能
		 * 3、
		 * 
		 * 后续实现
		 * 1、开局自动切换模块，定位到奖励模块
		 */
		if (window.location.href.indexOf("huya") >= 0) {
			// 初始化-----------------------------------------------------
			// 定义函数
			// function mr_auto(){};
			let ount3_3;
			// 设置默认阶段
			var hy_dqjd = 1;
			
			// 刷新开关
			var hy_sx = true;
			
			// 滚动函数
			scrollCont();
			// 大框架
			$(".flag1-button").append("<button class='qiangjl' style='opacity:0.7;' disabled>未定位到直播奖励</button>");
			$(".flag1-button").append("<button class='automr' style='opacity:0.7;' disabled>未定位到直播奖励</button>");
			$(".flag1-data").append("<div class='anwzkj'></div>");
			$(".flag1-data").append("<p class='flag-p'>当前阶段："+hy_dqjd+"</p>");
			// 在脚本窗口输出，按钮，文字等
			$(".anwzkj").before("<div>1<input type='radio' name='zzzka' value='1'> 2<input type='radio' name='zzzka' value='2'> 3<input type='radio' name='zzzka' value='3'> 4<input type='radio' name='zzzka' value='4'> 5<input type='radio' name='zzzka' value='5'> 6<input type='radio' name='zzzka' value='6'> 7<input type='radio' name='zzzka' value='7'>8<input type='radio' name='zzzka' value='8'> 9<input type='radio' name='zzzka' value='9'> 10<input type='radio' name='zzzka' value='10'> 11<input type='radio' name='zzzka' value='11'> 12<input type='radio' name='zzzka' value='12'> 13<input type='radio' name='zzzka' value='13'> 14<input type='radio' name='zzzka' value='14'></div>");
			// 选中默认阶段
			$("[name='zzzka'][value='"+hy_dqjd+"']").click();

			//选择单选按钮时，触发更改阶段
			$("[name='zzzka']").click(function() {
				hy_dqjd = $("[name='zzzka']:checked").val();
				console.log("当前阶段：%d",hy_dqjd);
				$(".flag-p").text("当前阶段："+hy_dqjd);
			});

			// 功能性代码--------------------------------------------------
			/**	功能1 切换模块判断功能点是否可用，玩家手动切换至正确功能点
			 * 	设计：
			 * 		切换到正确模块后，按钮自动变绿，变成可点击的状态
			 * 			判断是否切换模块
			 * 		可通过判断有没有加10经验或特定刷新按钮来定，特定刷新按钮比较合适，可能得加延迟
			 * 	逻辑：
			 * 		1 判断是否切换模块
			 * 			1.1 延迟执行
			 * 				1.1.1 判断刷新按钮是否存在
			 * 					存在
			 * 						删除切换模块响应
			 * 						按钮变为可用
			 * 						切换按钮文字
			 * 				
			 */
			// 1 判断是否切换模块
			$("div.item.J_item").click(function del_click(){
				// 1.1 延迟执行
				setTimeout(function() {
					// 1.1.1 判断刷新按钮是否存在
					if ($(".mod-level .reload.J_reload").length) {
						console.log("存在");
						// 删除切换模块响应
						$("div.item.J_item").off("click",del_click);
						// 按钮变为可用
						$(".qiangjl").prop("disabled", false);
						$(".automr").prop("disabled", false);
						mr_auto(true);
						// 切换按钮文字
						$(".qiangjl").text("开始抢奖励");
					} else {
						console.log("不存在");
					}
				  }, 500); 
			});

			// 按钮代码-------------------------------------------------
			// 抢奖励按钮
			var zt_qjl = false;
			$(".qiangjl").click(function () {		
				if (zt_qjl = !zt_qjl) {
					// 重置刷新开关
					hy_sx = true;

					// 控制台输出信息
					console.log("抢");

					// 点刷新模块，循环
					window.ount3_1 = setInterval(function () {
						// 点刷新
						$(".mod-level .reload.J_reload").click();
					}, 1000);// 刷新速率


					// 抢+10经验，抢奖励，取消提示，循环
					window.ount3_2 = setInterval(function () {

						// 点击+10经验
						// 遍历所有对应的li标签下的task-name
						$(".diy-exp-box .J_contrainer .list-tasks.J_slideBox li .task-name").each(function(){
							// 定位“+10经验任务”
							if ($(this).text().indexOf("+10") >= 0){
								// 无“未”就抢
								if ($(this).siblings(".do-task-btn").text().indexOf("未")){
									$(this).siblings(".do-task-btn").click();
								}
							}
						});

						// 遍历每个里程碑奖励
						$(".awrad-list.J_listBox li h4").each(function(){
							// 阶段判断
							if ($(this).text().indexOf(hy_dqjd) >= 0){
								// 无“未”就抢
								if ($(this).siblings("p").children("button").text().indexOf("未")){
									// 自动关闭刷新
									if (hy_sx){
										clearInterval(ount3_1);
										hy_sx = false;
									}
									// 点击抢奖励
									$(this).siblings("p").children("button").click();
								}
							}
						});

						// 取消提示
						if ($(".dcp-title").length > 0) {
							$(".dcp-title").siblings("div").children("button").click();
						}

					}, 100); // 抢奖励速率

					$(".qiangjl").text("暂停抢奖励");
				} else {
					$(".qiangjl").text("开始抢奖励");
					// 为true才关刷新
					if (hy_sx){
						clearInterval(ount3_1);
					}
					clearInterval(ount3_2);
					console.log("停止");
				}
			});
			
			/**	功能2 关键奖励领取							摸了
			 * 	设计：
			 * 		1 点击开始抢奖励，则循环抢奖励
			 * 		2 如果奖励已领取则提醒，将按钮改回来 	
			 * 		3 自动点击刷新按钮
			 * 		4 领取完毕后自动暂停
			 * 				
			 */
			// function mr_auto(zt_mr){
			// 	if (zt_mr){
			// 		$(".automr").text("暂停领每日");
					
			// 	} else{
			// 		$(".automr").text("开始领每日");

			// 	}
			// };
			
			// // 切换状态的函数
			// $("button.automr").click(function(){
			// 	if($(".automr").text().indexOf("暂停") !== -1){
			// 		mr_auto(false);
			// 	}else if($(".automr").text().indexOf("开始") !== -1){
			// 		mr_auto(true);
			// 	}else{
			// 		console.log("出bug咯~");
			// 	}
			// });

			/**	功能3 每日奖励领取				
			 * 	设计：
			 * 		1 点刷新，一分钟循环一次
			 * 		2 领取每日的奖励，每次只点一次
			 * 		3 刷新后的关闭一次领取每日的各种弹窗
			 * 		4 每日领取的按钮手动关闭功能
			 * 		5 +10经验领取后自动关闭每日奖励领取功能
			 * 		6 利用函数传参
			 */
			function mr_auto(zt_mr){
				if (zt_mr){
					// 改文字显示状态......................................................
					$(".automr").text("暂停领每日");
					// 刷新循环开始........................................................
					ount3_3 = setInterval(function () {
						// 点刷新
						$(".mod-level .reload.J_reload").click();
						// 点击刷新后，延迟领取一次奖励
						console.log("点刷新");
						setTimeout(function(){
							for (var i = 0; i < 3; i++) {
								// 循环3次执行某个操作
								console.log("点奖励");
								// +10经验单独点
								// 遍历所有对应的li标签下的task-name
								$(".diy-exp-box .J_contrainer .list-tasks.J_slideBox li .task-name").each(function(){
									// 定位“+10经验任务”
									if ($(this).text().indexOf("+10") >= 0){
										// 无“未”就抢
										if ($(this).siblings(".do-task-btn").text().indexOf("未")){
											$(this).siblings(".do-task-btn").click();
										}
									}
								});
								// 其他奖励
								$(".diy-exp-box .J_contrainer .list-tasks.J_slideBox li .do-task-btn").each(function(){
									if($(this).text().indexOf("未")){
										$(this).click();
									}
								})
							}
							// 等两秒把所有弹窗关闭
							setTimeout(function(){
								console.log("点关闭弹窗");
								if($(".diy-com-pop").length > 0){
									$(".dcp-close.J_dcpClose").click();
								}
							}, 500);
						}, 2000);
					}, 60000);// 刷新速率，6w为60秒1次
				} else{
					// 改文字显示状态......................................................
					$(".automr").text("开始领每日");
					// 刷新循环开始........................................................
					clearInterval(ount3_3);
				}
			};
			
			// 切换状态的函数
			$("button.automr").click(function(){
				if($(".automr").text().indexOf("暂停") !== -1){
					mr_auto(false);
				}else if($(".automr").text().indexOf("开始") !== -1){
					mr_auto(true);
				}else{
					console.log("出bug咯~");
				}
			});

			// // 功能3，自动
			// $("button.automr").click(function(){
			// 	if($(".automr").text().indexOf("暂停") !== -1){
			// 		mr_auto(false);
			// 	}else if($(".automr").text().indexOf("开始") !== -1){
			// 		mr_auto(true);
			// 	}else{
			// 		console.log("出bug咯~");
			// 	}
			// });

		}
		// 虎牙逻辑=====================================================================================
	});

	// Your code here...
})();