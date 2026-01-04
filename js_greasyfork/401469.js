// ==UserScript==
// @name         添加自动刷新功能--4PX工单系统
// @namespace    https://greasyfork.org/scripts/392634
// @note         https://greasyfork.org/zh-CN/scripts/401469
// @version      7.3.2.1
// @description  添加自动刷新工单，桌面提醒功能，4PX工单系统专用
// @note         V4.0 添加弹窗提醒，支持多浏览器
// @note         V5.0 可自定义通知设置，包括弹窗显示时间、弹窗标题、弹窗图标、弹窗点击事件等；添加需求反馈功能
// @note         V6.0 添加钉钉机器人通知、弹窗间隔时间
// @note         V7.0 添加多个工单详情页功能，包括工单类型修改、待完结激活、处理人分配、处理录入编辑等；添加登录失效通知；
// @note              选择处理人时页面高度自适应；提示未填问题类型或高优先级；兼容HTTPS
// @author       ZRF
// @match        *://ticket.i4px.com/workorder/handle/list*
// @match        *://ticket.i4px.com/workorder/claim/list*
// @match        *://ticket.i4px.com/workorder/handle?workorderId=*
// @match        *://ticket.i4px.com/workorder/handle/detail/*
// @icon         http://static.4px.com/logo/favicon.ico
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @connect      oapi.dingtalk.com
// @downloadURL https://update.greasyfork.org/scripts/401469/%E6%B7%BB%E5%8A%A0%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E5%8A%9F%E8%83%BD--4PX%E5%B7%A5%E5%8D%95%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/401469/%E6%B7%BB%E5%8A%A0%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E5%8A%9F%E8%83%BD--4PX%E5%B7%A5%E5%8D%95%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==



(function() {

	/* --------自动刷新功能栏-------- */
	function initHandle () {
		var page = !!document.getElementById("waitingHandleTotal") ? "workOrderHandled" : "workOrderBeClaimed";// 判断是哪个页面

		// localStorage
		function localGet (key) {
		    return JSON.parse(localStorage.getItem(key))
		}
		function localSet (key, val) {
		    return localStorage.setItem(key, JSON.stringify(val))
		}
		function localRemove (key) {
		    return localStorage.removeItem(key)
		}

		var noticeTime = localGet(page + "NoticeTime") || 5;// 浏览器通知自动消失时间
		var noticeIcon = localGet(page + "NoticeIcon") || ("workOrderHandled" == page ? "https://sso.4px.com/images/4px_logo.png" : "https://static.4px.com/logo/favicon.ico");// 通知图标
		var countdownInterval = null;// 刷新倒计时Interval
		var userTime = localGet(page + "Time") || "";// 保存设定的倒计时时间
		var noticeStart = localGet(page + "Notice") || !1;// 是否启用通知
		var noticeClick = localGet(page + "NoticeClick") || "close";// close：点击通知 关闭弹窗，open：点击通知 打开工单
		var workOrderID = localGet(page + "WorkOrderID") || "";// 记录工单ID，屏蔽用
	    var noticeTitle = localGet(page + "NoticeTitle") || ("workOrderHandled" == page ? "待处理工单" : "待认领工单");// 通知标题
	    var noticeSubtitle = localGet(page + "NoticeSubtitle") || "select";// 通知副标题
	    var noticeBrowserStatus = localGet(page + "NoticeBrowserStatus") || "true";// 浏览器通知开启状态
	    var noticeDingStatus = localGet(page + "NoticeDingStatus") || !1;// 钉钉通知开启状态
	    var dingWebhook = localGet(page + "DingWebhook") || "";// 钉钉通知Webhook
	    var dingNotifiedID = localGet(page + "DingNotifiedID") || "";// 记录已钉钉通知的工单ID，屏蔽用，防止重复推送
	    var noticeIntervalTime = localGet(page + "NoticeIntervalTime") || 1800;// 同一个弹窗重复提醒间隔时间
	    var repeatedID = localGet(page + "RepeatedID") || "";// 记录已经弹窗的工单ID
	    var noticeDingAtMe = localGet(page + "NoticeDingAtMe") || !1;// 钉钉通知@自己
	    var noticeDingAtAll = localGet(page + "NoticeDingAtAll") || !1;// 钉钉通知@所有人
	    // var userName = $(".user-info .message span:first").text();// 用户名
	    var unLoginNotice = !1;// 登录失效通知
		var countdown;// 倒计时间
	    var html = `
<div class='col-md-5 form-horizontal auto-refresh-room'>
	<label class='control-label' style="padding-top: 0;">设置自动刷新</label>
	<input class='form-control' id='seconds' type='number' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' role='textbox' placeholder='秒' value="${userTime}">
	<div class='form-horizontal'>
		<input type='button' id='auto_refresh' class='btn btn-success' value='开始'>
		<input type="button" id="notice" class="btn btn-success" value="启用通知">
		<input type="button" id="notice_set" class="btn btn-default" value="通知设置">
	</div>
</div>
`;
		var setStyle = `
<style>
.auto-refresh-room {
	display:flex;
	align-items:center;
	width: 500px;
    float: left;
}
#seconds {
 	width: 80px;
 	line-height: 25px;
    margin: 0 12px;
 }
.fpx .fpx-sticky .pull-right .control-label {
	color: #fff;
}
.set-div, .demand-div{
	position: absolute;
	height: auto;
	border: 2px solid rgb(238, 238, 238);
	border-radius: 7px;
	background: #fff;
	padding: 20px 0px 15px;
	display: none;
	width: 475px;
}
.set-row {
	margin-bottom: 15px;
    height: auto;
    overflow: auto;
}
.set-button {
	padding: 0;
}
.set-button input {
	margin-right: 15px;
}
#notice_time, #notice_interval_time {
	width: 82px;
    float: left;
}
#notice_icon, #notice_ding_url {
	width: 320px;
}
#notice_title {
	width: 162px;
}
#setWorkOrderID {
	padding: 0;
}
.set-text {
    color: #888;
    padding: 7px 0 0 10px;
    text-align: center;
}
.setCenter {
	text-align: center;
}
#clear_workOrderID {
	margin-left: 64px;
}
#demand_button {
	margin-left: 60px;
}
</style>
`;
		var setHtml = `
<div class="form-horizontal set-div">
	<div class="set-row">
	    <label class="control-label col-md-3">通知方式：</label>
	    <div class="col-md-9 form-horizontal set-button">
	        <input type="button" id="notice_browser_button" class="btn btn-default" value="弹窗通知">
	        <input type="button" id="notice_ding_button" class="btn btn-default" value="钉钉通知">
	    </div>
	</div>
    <div class="set-row">
	    <label class="control-label col-md-3">点击弹窗：</label>
		<div class="col-md-9 form-horizontal set-button">
			<input type="button" id="notice_close" class="btn btn-default" value="关闭弹窗">
			<input type="button" id="notice_open" class="btn btn-default" value="打开工单">
			<input type="button" id="notice_block" class="btn btn-default" value="屏蔽该工单">
		</div>
	</div>
    <div class="set-row">
		<label class="control-label col-md-3">通知标题：</label>
		<input class="form-control col-md-5" id="notice_title" type="text" autocapitalize="off" spellcheck="false" placeholder="标题(清空则恢复默认)" role="textbox">
		<label class="col-md-1 set-text" style="width: 25px;padding: 5px;">+</label>
		<div class="form-inline">
			<select class="form-control col-md-4" id="notice_subtitle">
                <option value="select">==请选择==</option>
                <option value="workOrderID">工单号</option>
                <!-- 
                <option value="creator">创建人</option>
				<option value="priority">紧急程度</option>
				-->
		    </select>
		</div>
    </div>
    <div class="set-row">
		<label class="control-label col-md-3">弹窗图片：</label>
		<input class="form-control col-md-7" id="notice_icon" type="text" autocapitalize="off" spellcheck="false" placeholder="链接(清空则恢复默认)" role="textbox">
    </div>
    <div class="set-row">
		<label class="control-label col-md-3">弹窗显示：</label>
		<!-- 等Tampermonkey4.9版本后才修复timeout最多7秒的问题，0秒将不隐藏 -->
		<input class="form-control" id="notice_time" type="number" role="textbox" placeholder="秒">
		<label class="set-text">秒（0表示一直显示）</label>
    </div>
    <div class="set-row">
		<label class="control-label col-md-3">弹窗间隔：</label>
		<input class="form-control" id="notice_interval_time" type="number" role="textbox" placeholder="秒">
		<label class="set-text">秒（同一工单重复提醒间隔时间）</label>
    </div>
    <div class="set-row">
	    <label class="control-label col-md-3">钉钉消息：</label>
	    <div class="col-md-9 form-horizontal set-button" id="notice_at_button">
	        <input type="button" id="notice_at_me" class="btn btn-default" value="@自己">
	        <input type="button" id="notice_at_all" class="btn btn-default" value="@所有人">
	    </div>
	</div>
    <div class="set-row">
		<label class="control-label col-md-3">钉钉机器人：</label>
		<input class="form-control col-md-7" id="notice_ding_url" type="text" autocapitalize="off" spellcheck="false" placeholder="Webhook链接（自定义关键词填“工单”）" role="textbox">
    	<a class="col-md-10 set-text" href="https://4pxgroup.yuque.com/docs/share/7badb8be-14b6-45cd-8403-b9c9c8e59823" target="_blank">如何启用钉钉机器人？</a>
    </div>
    <div class="set-row" style="margin-top: 25px;">
	        <input type="button" id="clear_workOrderID" class="btn btn-primary" value="清空屏蔽工单记录">
	        <input type="button" id="demand_button" class="btn btn-primary" value="需求建议反馈点我">
	</div>
</div>
`;
		var demandHtml = `
<div class="form-horizontal demand-div">
    <div style="margin: 0 20px;">
	<textarea rows="9" id="demand_text" placeholder="提一提建议" class="form-control"></textarea>
	</div>
	<div class="set-row" style="margin-top: 25px;">
        <input type="button" id="go_back" class="btn btn-default" value="返回" style="margin-left: 120px;">
	        <input type="button" id="demand_submit" class="btn btn-success" value="提交" style="margin-left: 100px;">
	</div>
</div>
`;

	    // 添加html样式
	    $("head").append(setStyle);
	    $("#batchDeal").after(html);
	    $(".pull-right > .btn-group").after(html);
	    $("body").append(setHtml);
	    $("body").append(demandHtml);

	    var userPhone = $(".user-info .phone span").text();// 用户手机号码
	    // var userPhone = document.querySelector('.user-info .phone span').innerText;// 用户手机号码

	    // 申请通知权限 （停用，改用Tampermonkey自带的通知）
	    // Notification.requestPermission();

	    // 自动刷新按钮
	    $("#auto_refresh").click(function(){
	        if("开始" == $(this).val()){// 开始事件
	            autoRefresh();
	        } else {// 结束事件
	            clearInterval(countdownInterval);
	            localRemove(page + "Time");
	            $("#seconds").val(userTime);
	            $("#auto_refresh").removeClass("btn-warning").addClass("btn-success").val("开始");
	        }
	    });

	    // 通知按钮
	    $("#notice").click(function(){
	        if("启用通知" == $(this).val()){
	        	noticeStart = !0;
	    		"true" == noticeBrowserStatus && notice();// 浏览器通知
				noticeDingStatus && noticeDing();// 钉钉通知
				"true" != noticeBrowserStatus && !noticeDingStatus && $("#notice_browser_button").click();// 防止数据问题，默认开启浏览器通知
	            localSet(page + "Notice", true);
	            $("#notice").removeClass("btn-success").addClass("btn-warning").val("取消通知");
	        } else {
	            noticeStart = !1;
	            localRemove(page + "Notice");
	            $("#notice").removeClass("btn-warning").addClass("btn-success").val("启用通知");
	        }
	    });

	    // 通知设置
	    $("#notice_set").click(function() {
	    	if("通知设置" == $(this).val()) {
	    		$("#notice_time").val(noticeTime);
	    		$("#notice_icon").val(noticeIcon);
	    		$("#notice_title").val(noticeTitle);
	    		$("#notice_subtitle").val(noticeSubtitle);
	    		$("#notice_ding_url").val(dingWebhook);
				$("#notice_interval_time").val(noticeIntervalTime);
				"close" == noticeClick ? $("#notice_close").click() : "open" == noticeClick ? $("#notice_open").click() : $("#notice_block").click();// 点击弹窗事件
				"true" == noticeBrowserStatus && $("#notice_browser_button").removeClass("btn-default").addClass("btn-info");// 浏览器通知
				noticeDingStatus && $("#notice_ding_button").removeClass("btn-default").addClass("btn-info");// 钉钉通知
				noticeDingAtMe && $("#notice_at_me").removeClass("btn-default").addClass("btn-info");// @自己
				noticeDingAtAll && $("#notice_at_all").removeClass("btn-default").addClass("btn-info");// @所有人

	    		$(".set-div").slideDown("fast").css("left", $(".pull-right .control-label").offset().left - 26).css("top", $(".pull-right .control-label").offset().top + 50);
	    		$(this).removeClass("btn-default").addClass("btn-warning").val("保存设置");
	    	} else {
	    		"关闭弹窗" == $("#notice_close").parent().find(".btn-info").val() ? noticeClick = "close" : ("打开工单" == $("#notice_close").parent().find(".btn-info").val() ? noticeClick = "open" : noticeClick = "block");
	    		$("#notice_time").val() > 0 ? noticeTime = $("#notice_time").val() : noticeTime = 5;
	    		!!$("#notice_icon").val() ? noticeIcon = $("#notice_icon").val().replace(/\s*/g, "") : noticeIcon = ("workOrderHandled" == page ? "https://sso.4px.com/images/4px_logo.png" : "https://static.4px.com/logo/favicon.ico");
	    		!!$("#notice_title").val() ? noticeTitle = $("#notice_title").val() : noticeTitle = ("workOrderHandled" == page ? "待处理工单" : "待认领工单");
	    		noticeSubtitle = $("#notice_subtitle").val();
	    		checkUrl(noticeIcon);
	    		$("#notice_interval_time").val() > 0 ? noticeIntervalTime = $("#notice_interval_time").val() : noticeIntervalTime = 1800;
	    		$("#notice_at_me").attr("class").indexOf("btn-info") > -1 ? noticeDingAtMe = !0 : noticeDingAtMe = !1;// @自己
	    		$("#notice_at_all").attr("class").indexOf("btn-info") > -1 ? noticeDingAtAll = !0 : noticeDingAtAll = !1;// 所有人
	    		
	    		// 通知方式至少得有1种，如果都没有，则默认为浏览器通知
	    		"true" != noticeBrowserStatus && !noticeDingStatus && $("#notice_browser_button").click();

				localSet(page + "NoticeClick", noticeClick);
				localSet(page + "NoticeTime", noticeTime);
				localSet(page + "NoticeIcon", noticeIcon);
				localSet(page + "NoticeTitle", noticeTitle);
				localSet(page + "NoticeSubtitle", noticeSubtitle);
				localSet(page + "NoticeIntervalTime", noticeIntervalTime);
				localSet(page + "NoticeDingAtMe", noticeDingAtMe);
				localSet(page + "NoticeDingAtAll", noticeDingAtAll);

	    		$(".set-div").slideUp("normal");
	    		$("#clear_workOrderID").removeClass("btn-info");
	    		$(this).removeClass("btn-warning").addClass("btn-default").val("通知设置");
	    	}
	    	
	    });

	    // 点击通知事件按钮
	    $("#notice_close, #notice_open, #notice_block").click(function() {
	        $("#notice_close, #notice_open, #notice_block").removeClass("btn-info");
	        $(this).addClass("btn-info");
	    });

	    // 清空屏蔽工单记录
	    $("#clear_workOrderID").click(function() {
			workOrderID = "";
			dingNotifiedID = "";
			repeatedID = "";
			localRemove(page + "WorkOrderID");
			localRemove(page + "DingNotifiedID");
			localRemove(page + "RepeatedID");
			UED.Noty.success({ text: '清空成功！', timeout: 2e3 });
	    });

	    // 需求界面
	    $("#demand_button").click(function() {
	    	$(".demand-div").css("height", $(".set-div").height() + 39).css("left", $(".set-div").offset().left).css("top", $(".set-div").offset().top).slideDown("fast");
	    });

	    // 需求界面返回
	    $("#go_back").click(function() {
	    	$(".demand-div").slideUp("normal");
	    });

	    // 需求提交
	    $("#demand_submit").click(function() {
	    	var demandText = $("#demand_text").val();
	    	if(!!demandText) {
	    		$(".demand-div").slideUp("normal");
	    		demandDingSend(demandText);
	    		$("#demand_text").val("");
	    	} else {
	    		$("#demand_text").addClass("error");
	    		setTimeout(()=> {
	    			$("#demand_text").removeClass("error");
	    		}, 1e3);
	    	}
	    });
	    

		// 查询按钮
		$("#selectBtn").click(()=>{
		    countdown = userTime;// 重新开始计时
		    // "workOrderHandled" == page && selectStatistics();// 刷新“我处理的”查询统计
		    selectStatistics();
		    if (noticeStart) {
		    	"true" == noticeBrowserStatus && setTimeout(() => { notice(); }, 2 * 1e3);
		    	noticeDingStatus && noticeDing();
		    }
		});

		// 处理状态按钮
		$(".handleStatusTab li").click(function () {
			countdown = userTime;// 重新开始计时
		});

		// 浏览器通知按钮
		$("#notice_browser_button").click(function () {
			if ($(this).attr("class").indexOf("btn-default") > -1) {// 开启
				noticeStart && notice();
				noticeBrowserStatus = "true";
				localSet(page + "NoticeBrowserStatus", noticeBrowserStatus);
				$(this).removeClass("btn-default").addClass("btn-info");
			} else {// 关闭
				noticeBrowserStatus = "false";
				localSet(page + "NoticeBrowserStatus", noticeBrowserStatus);
				$(this).removeClass("btn-info").addClass("btn-default");
			}
		});

		// 钉钉通知按钮
		$("#notice_ding_button").click(function () {
			if (!!dingWebhook && $(this).attr("class").indexOf("btn-default") > -1) {// 开启
				noticeStart && noticeDing();
				noticeDingStatus = !0;
				localSet(page + "NoticeDingStatus", noticeDingStatus);
				$(this).removeClass("btn-default").addClass("btn-info");
			} else {// 关闭
				noticeDingStop();
				!dingWebhook && UED.Noty.warning({ text: '请先设置钉钉机器人Webhook', timeout: 2e3 });
			}
		});

		// webhook链接输入框，失去焦点时，判断链接是否有效
		$("#notice_ding_url").blur(function () {
			var testWebhook = $(this).val().replace(/\s*/g, "");
			if (!!testWebhook && testWebhook != dingWebhook) {// 测试Webhook是否有效
				noticeDing(testWebhook)
			} else if (!testWebhook){// 清空
				testWebhook = "";
				dingWebhook = testWebhook;
				localSet(page + "DingWebhook", dingWebhook);
				$("#notice_ding_button").attr("class").indexOf("btn-info") > -1 && noticeDingStop();// 取消钉钉通知
			}
		});

		// @自己、@所有人按钮
	    $("#notice_at_button input").click(function() {
	    	$(this).siblings().removeClass("btn-info").addClass("btn-default");
	        $(this).attr("class").indexOf("btn-default") > -1 ? $(this).removeClass("btn-default").addClass("btn-info") : $(this).removeClass("btn-info").addClass("btn-default");
	    });



		// 开始刷新
		function autoRefresh() {
	        userTime = $("#seconds").val();
	        if(userTime > 0) {
	        	localSet(page + "Time", userTime);
	            countdownIntervalFn();
	            $("#auto_refresh").removeClass("btn-success").addClass("btn-warning").val("结束");
	        }else {
	            $("#seconds").addClass("error");
	            setTimeout(function(){
	                $("#seconds").removeClass("error");
	            }, 1e3);
	        }
		}

		// 刷新倒计时
		function countdownIntervalFn() {
			countdown = userTime;
			countdownInterval = setInterval(function(){
	            countdown--;
	            $("#seconds").val(countdown);
	            if(countdown <= 0){
	                countdown = userTime;
	                // 重置并刷新
	                $("#resetBtn").click();
	                $("#waitingHandleTotal").click();
	                $("#selectBtn").click();
	            }
	        }, 1e3);
		}

		// 刷新“我处理的”查询统计
		function selectStatistics() {
			FPX.ajax(FPX.CTX + "/workorder/handle/count.json", {
				method: "POST",
				data: $("#queryForm").serializeJson(),
			}).done(function (data) {
				if ("unLogin" == data['Auth-Status']) {// 登录掉了
					// window.location.reload()
					!unLoginNotice && browserNotice("工单系统登录已失效", "建议刷新工单页面", 0);
					unLoginNotice = !0;// 防重复通知
				} else if (data && !data.hasError) {
					unLoginNotice = !1;

					$("#waitingHandleTotal").css("display", "block");
					$("#waitingHandleTotal").html(data.data.waitingHandleTotal);

					$("#handlingTotal").css("display", "block");
					$("#handlingTotal").html(data.data.handlingTotal);

					$("#hadHandleTotal").css("display", "block");
					$("#hadHandleTotal").html(data.data.hadHandleTotal);

					$("#rejectTotal").css("display", "block");
					$("#rejectTotal").html(data.data.rejectTotal);

					$("#transferTotal").css("display", "block");
					$("#transferTotal").html(data.data.transferTotal);
				} else {
					console.error("统计消息报错");
					console.error(data.message);
				}
			});

			// 未读消息统计
			FPX.ticket.ajax(FPX.CTX + "/resultReadStatus/count", {
				method: "POST",
				succeed: function(data) {
					$("#notReadMsgTicket").css("display", "block");
					$("#notReadMsgTicket").html(data.data);
				}
			});
		}

		// 浏览器通知模块
		function notice() {
		    var workOrder = "workOrderHandled" == page ? $('.handle') : $('.claim-btn');
		    var noticeUrl = $("a[href*='/workorder/handle/detail']");
		    var noticeText = $("p[style='word-break:break-all;']").parent();// 获取工单内容
		    for (let i = 0; i < workOrder.length; i++) {
		        let tag = workOrder[i].getAttribute("data-id");
		        let body = noticeText[i].innerText;
		        if(-1 == workOrderID.indexOf(tag) && -1 == repeatedID.indexOf(tag)) {
		        	GM_notification({
			        	text: body,
			            title: noticeTitle + ("workOrderID" == noticeSubtitle ? " " + noticeUrl.eq(i)[0].innerText : ""),
			            image: noticeIcon,
			            highlight: false,// 是否高亮标签
			            silent: true,// 通知声音
			            timeout: noticeTime * 1e3,// 通知显示时间，0表示一直显示
			            ondone: null,// 通知被关闭时，无论是被点击还是超时，执行的函数
			            onclick: function () {
			            	switch (noticeClick) {
			            		case "open":
			            			"workOrderHandled" == page ? workOrder[i].click() : GM_openInTab(noticeUrl.eq(i)[0].href, {active: true, insert: true, setParent: true, incognito: false});
			            			break;
			            		case "block":
			            			workOrderID += tag + ",";
			            			localSet(page + "WorkOrderID", workOrderID);
			            			break;
			            		default: ;
			            	}
			            }
			        });
			        repeatedID += tag;
			        localSet(page + "RepeatedID", repeatedID);
			        clearRepeatedID(tag);
		        }
		    }
		}

		// 检查图片地址是否有效
		function checkUrl(url) {
			var ImgObj = new Image();
			ImgObj.src = url;
			setTimeout(()=> {
				if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
					// console.log("通知图片url有效");
				} else {
					UED.Noty.warning({ text: '弹窗图片url可能无效', timeout: 2e3});
				}
			}, 2e3);
		}

		// 发送需求(钉钉方式)
		function demandDingSend(demandText) {
			var sender = $(".fpx-account")[0].innerText;
			var sendData = {
			    "msgtype": "markdown",
			    "markdown": {
			        "title": "来需求啦", 
			        "text": sender + ".：  \n" + demandText
			    }, 
			    "at": {
				    "atMobiles": [], 
				    "isAtAll": false
				}
			};
			GM_xmlhttpRequest({
				method: "POST",
				url: "https://oapi.dingtalk.com/robot/send?access_token=69cfd3ed5267e49d71d2086178e7594401b4b6cb345b268c65d7859b082f7234",
				data: JSON.stringify(sendData),
				headers: {
		    		"Content-Type": "application/json"
		    	},
				onload: function(res) {
					// console.log("sendSuccess");
					// console.log(res);
					// console.log(res.response);
					0 == JSON.parse(res.response).errcode ? UED.Noty.success({ text: '提交成功，感谢反馈！', timeout: 2e3 }) : demandWorkOrderSend(demandText +  "<br>钉钉设置有误：" + JSON.parse(res.response).errmsg);
					demandWorkOrderSend(demandText);// 测试用
				},
				onerror: function(res) {
					console.error("error");
					console.error(res);
					console.error(res.response);
					demandWorkOrderSend(demandText +  "<br>钉钉提交失败：" + JSON.parse(res.response).errmsg);
					// UED.Noty.error({
	    //                 text: "提交失败 " + res.response,
	    //                 timeout: 2e3
	    //             });
				}
			})
		}

		// 发送需求(工单方式)
		function demandWorkOrderSend(demandText) {
			var sendData = {
				"workorderId": "495425",
				"handleOpinion": demandText,
				"noticeTypesStr": "INNER,DING_NOTICE",
				"receiveUserCodes": "S16027"
			};
			FPX.ticket.ajax(FPX.CTX + "/workorder/handle/addRecord", {
				method: "POST",
				data: sendData,
				succeed: function(data) {
					// console.log(data);
					// console.log("提交成功(工单)");
					// UED.Noty.success({ text: '提交成功，感谢反馈！', timeout: 2e3 })
				},
				fail: function(data) {
					console.error(data);
					// FPX.msg.error(data.message);
				}
			});
		}

		// 比较tampermonkey版本号（4.9版本修复浏览器通知的时间问题），小于4.9版本返回true
		function compareVersion () {
			var version = GM_info.version.split(".");
			if (4 == version[0] && version[1] >= 9) {
				return false
			} else if (version[0] > 4) {
				return false
			} else {
				return true
			}
		}

		// 钉钉通知
		function noticeDing (testWebhook) {

			// 区域
			function getRegion(region) {
				switch (region) {
					case 0: return "中国";
					case 1: return "欧洲";
					case 2: return "澳洲";
					case 3: return "美洲";
					case 4: return "日本";
					default: return "";
				}
			}

			// 紧急程度
			function getPriority(priority) {
				switch (priority) {// #00A65A,#F39C12,#DD4B39
					case 0: return "<font color='#00A65A'>低</font>"
					case 1: return "<font color='#F39C12'>中</font>"
					case 2: return "<font color='#DD4B39'>高</font>"
					default: return ""
				}
			}

			// 获取工单数据
			function getWorkorderData () {
				$.ajax({
					url: FPX.CTX + ("workOrderHandled" == page ? "/workorder/handle/list.json" : "/workorder/claim/list.json"),
					type: "POST",
					data: {
						"pageSize": 100,
						"pageNumber": 1,
						"sortOrder": "asc",
						"pageNo": 1,
						"readStatus": 0
					},
					success: function(res) {
						// console.log(res);
						if (res.total > 0) {
							$.each(res.rows, function (i, value) {
								var sendText = "工单号：[" + value.workorderNo + "](" + document.location.protocol + "//" + document.location.host + "/workorder/handle?workorderId=" + value.workorderId + ")"
											+ "  \n创建人：" + value.createUserName + "（" + value.createUserCode + "，" + getRegion(value.regionResource) + "）"
											+ "  \n创建时间：" + FPX.ticket.formatTime(value.createTime)
											+ "  \n紧急程度：" + getPriority(value.priority)
											+ "  \n当前处理人：" + ("workOrderHandled" == page ? value.handleUserName : value.handleGroupName)
											+ "  \n问题描述：" + value.description
								;
								// console.log(sendText);
								var noticeID = value.workorderId + "+" + value.handleNodes[0].startTime;// 转交或激活同一工单记为不同
								// var noticeID = value.workorderId;// 转交记为相同
								dingNotifiedID.indexOf(noticeID) < 0 && sendDing(dingWebhook, noticeTitle, sendText, noticeID, noticeDingAtMe);
							})
						} else if (1 == res.result) {
							console.error("sendError");
							console.error(res);
						}
					},
					error: function(res) {
						console.error("error");
						console.error(res);
					}
				})
			}

			// 钉钉机器人
			function sendDing(url, title, text, noticeID, atMe) {
				GM_xmlhttpRequest({
					method: "POST",
					url: url,
					data: JSON.stringify({
					    "msgtype": "markdown",
					    "markdown": {
			                "title": title,
					        "text": (!!atMe ? "@" + userPhone + "  \n": "") + (noticeDingAtAll ? "@所有人  \n" : "") + text
					    },
					    "at": {
						    "atMobiles": [userPhone],
						    "isAtAll": noticeDingAtAll ? true : false
						}
					}),
					headers: {
			    		"Content-Type": "application/json"
			    	},
					onload: function(res) {
						// console.log("sendSuccess");
						// console.log(res);
						// console.log(res.response);
						// 0 == JSON.parse(res.response).errcode ? UED.Noty.success({ text: '发送成功', timeout: 2e3 }) : (UED.Noty.error({ text: "发送失败，钉钉机器人安全设置有误 " + res.response, timeout: 60 * 60e3 }), GM_notification({highlight: true}));
						if (0 == JSON.parse(res.response).errcode) {
							// console.log("钉钉发送成功");
							if (!!testWebhook) {
								dingWebhook = testWebhook;
								localSet(page + "DingWebhook", dingWebhook);
								UED.Noty.success({ text: '钉钉机器人设置成功', timeout: 2e3 })
							} else {
								dingNotifiedID += noticeID + ",";
								localSet(page + "DingNotifiedID", dingNotifiedID);
							}
							
						} else {
							// console.warn(res);
							var response = JSON.parse(res.response);
							console.warn(response);
							UED.Noty.warning({
								text: (!!testWebhook ? "钉钉机器人Webhook链接设置有误<br/>" : "钉钉通知发送失败<br/>") + (310000 == response.errcode ? "机器人的自定义关键词请设置为：工单<br/><br/>报错信息：" : "报错信息：") + response.errmsg,
								timeout: 60 * 60e3
							});
							GM_notification({highlight: true});
						}
					},
					onerror: function(res) {
						console.error("error");
						console.error(res);
						// console.error(res.response);
						UED.Noty.error({
		                    text: !!testWebhook ? "钉钉机器人Webhook链接设置有误" : "钉钉通知发送失败，请打开控制台查看报错信息",
		                    timeout: 60 * 60e3
		                });
		                GM_notification({highlight: true});
					}
				})
			}

			if (!!testWebhook) {
				return sendDing(testWebhook, noticeTitle, "钉钉工单通知设置成功")
			} else if (!!dingWebhook) {
				return getWorkorderData()
			} else if (noticeDingStatus && !dingWebhook) {
				return noticeDingStop()
			} else {
				return UED.Noty.warning({ text: '请先设置钉钉机器人Webhook', timeout: 2e3 })
			}

		}
		
		// 停止钉钉通知
		function noticeDingStop () {
			noticeDingStatus = !1;
			localRemove(page + "NoticeDingStatus");
			$("#notice_ding_button").removeClass("btn-info").addClass("btn-default");
		}

		// 倒计时清空间隔弹窗的工单ID
		function clearRepeatedID (tag) {
			setTimeout(()=>{
	        	repeatedID = repeatedID.replace(new RegExp(tag, "g"), "");
	        	localSet(page + "RepeatedID", repeatedID);
	        }, noticeIntervalTime * 1e3);
		}

		// 浏览器通知
	    function browserNotice (title, text, timeout) {
	    	GM_notification({
		    	text: text,
		        title: title,
		        // image: image,
		        // highlight: highlight,// 是否高亮标签
		        // silent: silent,// 通知声音
		        timeout: timeout * 1e3,// 通知显示时间，0表示一直显示
		        ondone: function () {
		        	// minimizeNoticeStatus = !0;
		        },// 通知被关闭时，无论是被点击还是超时，执行的函数
		        // onclick: null
	        })
	    }

		// 输入框只能输入正整数
		$('#seconds').keyup(function(){
		    $(this)[0].value = $(this)[0].value.replace(/^(0+)|[^\d]+/g,'')
		})

		// 输入框只能输入正整数和零
		$('#notice_time, #notice_interval_time').keyup(function(){
		    $(this)[0].value = $(this)[0].value.replace(/^0(0+)|[^\d]+/g,'')
		})
		


		// 加载页面后
		!!userTime && $("#auto_refresh").click();// 有倒计时时间，则自动开始

		// noticeDingStatus && !dingWebhook && noticeDingStop();// 确认无Webhook，则取消钉钉通知

		noticeStart && $("#notice").click();// 启用通知

		!!compareVersion() && $("#notice_time+.set-text").text("秒（最长7秒）");// 浏览器通知时间显示提示，小于4.9版本的修改提示

		!!repeatedID && clearRepeatedID(repeatedID);// 清空未释放的弹窗工单ID（解决工单时，“我处理的”页面会自动刷新，为防间隔时间不到就二次弹窗提醒，需保存变量，再重新读取清空）
	}
	/* --------END(自动刷新功能栏)-------- */




	/* --------小工具-------- */
	function initTools () {
		var workorderId = $('[name="workorderId"]').val();
		var workorderNo = $("#newItem").attr("data-no");

		var layerHtml = `
<div class="row">
	<div class="col-md-12 form-horizontal">
			<div class="form-group">
				<label class="control-label col-md-3" style="padding-right: 0;">处理人：</label>
				<div class="col-md-6">
					<input id="emp_code" class="form-control" placeholder="请填写工号，可手动输入">
				</div>
				<button id="select_handleUser_btn" type="button" class="btn btn-primary">选择</button>
			</div>
			<div class="form-group">
				<div class="col-md-12 text-center">
					<button id="layer_btn" type="button" class="btn btn-primary">确定</button>
				</div>
			</div>
	</div>
</div>
`;

		// 修改工单分类按钮
		!$("#changeType").length && $("#ticketMsg .col-md-8 .control-label").eq(1).after(`<a type="button" class="btn btn-primary pull-right btn-sm" data-id="${workorderId}" data-no="${workorderNo}" id="change_type">修改</a>`);

		// 激活工单按钮
		$("#ticketMsg .col-md-8 .control-label").eq(2).after(`<a type="button" class="btn btn-primary pull-right btn-sm" data-id="${workorderId}" data-no="${workorderNo}" id="change_status">激活</a>`);
		
		// 分配工单按钮
		$("#ticketMsg .col-md-8 .control-label").eq(4).after(`<a type="button" class="btn btn-primary pull-right btn-sm" data-id="${workorderId}" data-no="${workorderNo}" id="change_handleUser">分配</a>`);

		// “处理录入”的编辑按钮，非草稿状态可用
		!$("#editHandle").length && "草稿" != $("#ticketMsg .col-md-8 .control-label").eq(2).text() && $("#handleForm").before(`<button href="#" class="btn btn-primary pull-right" id="edit_handle"">编辑</button>`);





		// 激活待完结工单
		function activateWorkOrder (workorderId, handleUserCode, handleRegion, activateReson) {// 工单ID，选择处理人，区域（中国是0），激活原因
			FPX.ticket.ajax(FPX.CTX + "/workorderItem/activate", {
                method: "POST",
				data: {
					"workorderId": workorderId,
					"handleUserCode": handleUserCode,
					"handleRegion": handleRegion,
					"activateReson": activateReson
				},
				succeed: function (res) {
					if(0 == res.result) {
						FPX.msg.success(LANGUAGE.i18n['js.common.operate.success'], function () {
							window.location.reload();
						});
					} else {
						FPX.msg.error(res.message);
					}
				},
                fail: function(data) {
                    FPX.msg.error(data.message);
                }
			});
		}

		// 分配处理人
		function distributionWorkOrder (workorderNo, handleUserCode) {
			FPX.ticket.ajax(FPX.CTX + "/distribution/updateBatchDistributionStatusByPks", {
                method: "POST",
				data: {
					"orderNos": workorderNo,
					"empCode": handleUserCode
				},
				succeed: function (res) {
					if(0 == res.result) {
						FPX.msg.success(LANGUAGE.i18n['js.common.operate.success'], function () {
							window.location.reload();
						});
					} else {
						FPX.msg.error(res.message);
					}
				},
				fail: function (data) {
                    FPX.msg.error(data.message);
                }
			});
		}


		// 弹层
		function openLayer (content, titleStr, width, height) {
			layer.closeAll();
			if(width == null){
				width = '500px'
			}
			if(height == null){
				height = '550px';
			}
			layer.open({
				title: titleStr,
				type: 1,
				area: [width, height],
				content: content
			});
			
			// 点击确定按钮
			$("#layer_btn").on("click", function () {
				// 点击确定按钮，给1秒无法点击效果
				$(this).addClass("disabled");
            	setTimeout(()=> { $("#layer_btn").removeClass("disabled") }, 1e3);

            	// 获取工号，并去除空格
				var handleUserCode = $("#emp_code").val().replace(/\s*/g, "");

				// 工号是否为空，并执行对应功能函数
				if (!!handleUserCode) {
					switch (titleStr) {
						case "激活": activateWorkOrder(workorderId, handleUserCode, 0, "");
							break;
						case "分配": distributionWorkOrder(workorderNo, handleUserCode);
							break;
						default: FPX.msg.error("判断功能失败");
					}
				} else {
					$("#emp_code").addClass("error");
		            setTimeout(()=>{ $("#emp_code").removeClass("error") }, 1e3);
				}
			});

			// 点击选择按钮
			$("#select_handleUser_btn").on("click", function () {
				UED.Tree.loadTreeName({
					title: "请选择处理人",
					type: 5,//1:组织 2:虚拟组织及以上  3:部门及以上  4:虚拟部门及以上  5:员工及以上
					nodeType: 5,//可选择的类型限制,默认null为无限制,多个类型则以数组形式传递
					multiple: 1,//最多可选择的数量,默认10个
					orgTreeCode: 'WORKORDERGROUP',//当只有一颗组织树时传入可以辨识组织树的编码或者组织树ID，orgTreeCode或者treeId不为空时，urlOrg无效
					isInternational: true,
					//回调函数
					getNodes: function (nodes) {
						$("#emp_code").val(nodes[0].nodeRefCode)
					}
				})
				$('#tree').height($('#container_org').parent().parent().height() - 188);// 重新对组织树弹窗的内部div高度自适应
			});
		}



		// 点击工单分类修改按钮
		$("#change_type").on("click", function() {
			// var workorderId = $(this).data("id");
			// var workorderNo = $(this).data("no");
			FPX.ticket.ajax(FPX.CTX + "/workorderItem/changeTypePage", {
				method: "POST",
				data:{
					"workorderId":workorderId,
					"workorderNo":workorderNo
				},
				dataType: "html",
				htmlResp : function(data) {
					openLayer(data, LANGUAGE.i18n['ticket.type.change.title'], "800px", "250px");
				}
			});
		});

		// 点击激活按钮
		$("#change_status").on("click", ()=> {
			// 待完结才可以激活
			if ("待完结" == $("#ticketMsg .col-md-8 .control-label").eq(2).text()) {
				openLayer(layerHtml, "激活", "470px", "170px");
			} else {
				FPX.msg.warn("激活是将“待完结”激活至“待受理”状态");
			}
		});

		// 点击分配按钮
		$("#change_handleUser").on("click", ()=> {
			var orderStatus = $("#ticketMsg .col-md-8 .control-label").eq(2).text();// 工单状态
			switch (orderStatus) {
				case "待受理": case "受理中": 
					openLayer(layerHtml, "分配", "470px", "170px");
					break;

				case "草稿": case "已退回": case "已完结":
					FPX.msg.warn(orderStatus + "状态无法使用分配");
					break;

				case "待完结":
					FPX.msg.warn("待完结状态<br/>请使用“激活”按钮分配处理人");
					break;

				default: FPX.msg.error("判断工单状态失败");
			}
		});
		
		// 处理录入的编辑按钮
        $("#edit_handle").on("click", function() {
        	$("#edit_handle").parent().prepend('<button href="#" class="btn btn-default pull-right" id="exitBtn">'+LANGUAGE.i18n['js.common.cancel']+'</button>');
			$("#edit_handle").parent().prepend('<button href="#" class="btn btn-primary pull-right" id="saveHandleForm" style="margin-left: 5px;">'+LANGUAGE.i18n['js.common.save']+'</button>');

			$(this).css("display","none");

        	$("#handleForm input").removeAttr("readonly");
        	$("#handleForm select").removeAttr("readonly");
        	$("#handleForm textarea").removeAttr("readonly");

			$(".multiple-select-handle, #handleForm .multiple-select").prop("disabled", false);

        	$("#saveHandleForm").on("click", function() {
				if (!$("#handleForm").validate().form()) {
					return;
				}

				var fieldStr = JSON.stringify($("#handleForm").serializeArray());

				FPX.ticket.ajax(FPX.CTX + "/workorder/handle/add", {
					method: "POST",
					data: {
						"workorderId": $("#workorderId").val(),
						"fieldStr": fieldStr
					},
					succeed: function(data) {
						FPX.msg.success(LANGUAGE.i18n['js.common.operate.success'], function() {
							window.location.reload();
						});
					},
					fail: function() {
						FPX.msg.error(data.message);
					}
				});
			});

        	$("#exitBtn").on("click", function() {
				$("#handleForm input").attr("readonly", "readonly");
				$("#handleForm select").attr("readonly", "readonly");
				$("#handleForm textarea").attr("readonly", "readonly");
				$(".multiple-select-handle, #handleForm .multiple-select").prop("disabled", true);

        		$("#edit_handle").css("display", "block");
        		$("#saveHandleForm").remove();
        		$(this).remove();
			})

		});



        // 点击“解决”、“转交”按钮，未录入问题类型或高优先级则提示
        $("#passBtn, #transferBtn").on("click", function () {
        	// 有问题类型框，且没有录入问题类型，或高优先级
        	if ((!!$(".multiple-select-handle").length && !$(".multiple-select-handle").val()) || ("2" == $(".status-change").val()) ) {
        		layer.tips('未录入问题类型，或高优先级', '.layui-layer-title', {
					tips: 2// 上1，右2，下3，左4
				});
        	}
        });


        // 点击“转交”、“通知选择”按钮，重新对组织树弹窗的内部div高度自适应
        $("#transferBtn").on("click", function () {
        	$("#selectHandleUserBtn").on("click", function () {
        		$('#tree').height($('#container_org').parent().parent().height() - 188);
        	});
        });
        $("#btnNotificateCodes").on("click", function () {
        	$('#tree').height($('#container_org').parent().parent().height() - 188);
        });



	}
	/* --------END(小工具)-------- */



	/* --------init-------- */
	function init () {
		!!document.getElementById("closeBtn") && initTools();// 关闭按钮
		// 延迟2秒加载
		setTimeout(() => {
			!!document.getElementById("selectBtn") && initHandle();// 查询按钮
		}, 2e3);	
	}
	
	init();

})();






/*
//判断浏览器现在是否支持桌面通知，需https
Notification.requestPermission(function (status) {
  if (status === "granted") {
    var n = new Notification("已同意");
  }else if (status === "default") {
      alert("确认中");
  }else {
      alert('被阻止了');
  }
});

// 浏览器自带通知
// var n = new Notification('你有新的工单', {
//     body: body,
//     tag: tag
// });
// //关闭通知
// setTimeout(n.close.bind(n), time * 1e3);
*/


