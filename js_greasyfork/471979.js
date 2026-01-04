// ==UserScript==
// @name         可信考试名额监控
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  监控可信考试报考名额，在有报名名额时发送系统提醒
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js
// @author       zxpluto
// @match        *://ilearning.huawei.com/iexam/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huawei.com
// @grant        GM_addStyle
// @grant        GM_notification
// @connect      */ilearning.huawei.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471979/%E5%8F%AF%E4%BF%A1%E8%80%83%E8%AF%95%E5%90%8D%E9%A2%9D%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/471979/%E5%8F%AF%E4%BF%A1%E8%80%83%E8%AF%95%E5%90%8D%E9%A2%9D%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

GM_addStyle('#startBtn{color:#ffffff;position:absolute;width:42px;top:6px;right:12px;z-index:2999;padding:2px6px;cursor:pointer;} #interDiv{ color:deepskyblue; position:absolute; border-left:1pxsoliddeepskyblue; padding-left:8px; vertical-align:middle; top:6px; right:60px; z-index:999; } #checkInterval{ color:#000000; width:30px; } #msgBoard{ color:#ffffff; position:fixed; width:300px; height:300px; bottom:6px; right:2px; z-index:2999; background-color:deepskyblue; padding:2px2px; opacity:0.8; display:none; } #msgBox{ width:296px; height:278px; background-color:#ffffff; padding:4px6px; overflow-y:scroll; } .highlight-msg{ color:firebrick; } .normal-msg{ color:#000000; } .start-btn{ background-color:deepskyblue; } .stop-btn{ background-color:firebrick; }');

(function() {
	console.log('ilearningReservation started');

	$("body").append(`<div id="interDiv">间隔<input id="checkInterval" class="check-int" value="30"></>秒</div><div id="startBtn" class="start-btn">Start</div>`);

	var logBoard = `<div id="msgBoard">Log
		<div id="msgBox">
		</div>
	</div>`
	$("body").append(logBoard);

	//var url = $(window).attr("location").href;
	var url = location.href;
	console.log(url);
	// 从URL中解析参数
	var arr_url = url.split('?');
	var arr_params = arr_url[1].split('&');
	var urlParams = {}
	for (var i=0; i<arr_params.length; i++)
	{
		var kv = arr_params[i].split('=');
		urlParams[kv[0]] = kv[1];
	}
	console.log(urlParams);

	var ilearningVersion = 0

	var checkingFlag = 0;
	var timers = [];

	var checkReservationUrl = '';
	var checkReservationData = {}

	// 新版ilearning2.0页面
	if (url.match('https://ilearning.huawei.com/*/examInfo') >= 0) {
		ilearningVersion = 2
		checkReservationUrl = 'https://ilearning.huawei.com/sxz/api/iexam/api/iexam/userexam/v1/exams/checkReservation';
		if (url.indexOf('examId=') >= 0) {
			var returnedFieldId = urlParams.examId;
			console.log('returnedFieldId',returnedFieldId);
			var timer1 = setInterval(function () {
				if ($(".examInfoSelect .filter-btn").length > 0) {
					clearInterval(timer1);
					$(".examInfoSelect .filter-btn").click();
					var timer2 = setInterval(function () {
						if ($(".ant-modal-wrap.ka-a-confirm .ant-modal-body .ka-a-confirm-body .recordTable .ant-radio-input[value='"+ returnedFieldId + "']").length > 0) {
							clearInterval(timer2);
							$(".ant-modal-wrap.ka-a-confirm .ant-modal-body .ka-a-confirm-body .recordTable .ant-radio-input[value='"+ returnedFieldId + "']").click();
							$(".ant-modal-wrap.ka-a-confirm .ant-modal-content .ant-modal-footer .ant-btn-primary").click();
						}
					},100)
				}
			},100);
		}
	}

	var checkRemainingQuota = function(){
		$.ajax({
			async:false,
			type:"POST",
			url: checkReservationUrl,
			data: JSON.stringify(checkReservationData),
			contentType: "application/json;charset=utf8",
			success: function(result,status,xhr){
				//console.log(status);
				if (status=='success'){
					var data = result.data;
					// console.log(data);
					var remainingQuota = data.remainingQuota;
					var now = new Date();
					var yea = now.getFullYear();
					var mon = now.getMonth()+1;
					var dat = now.getDate();
					var hou = now.getHours();
					var min = now.getMinutes();
					var sec = now.getSeconds();
					var dateStr = yea + '-' + (mon<10?'0'+mon:mon) +'-'+ (dat<10?'0'+dat:dat) +' '+ (hou<10?'0'+hou:hou) + ':' + (min<10?'0'+min:min) + ':' + (sec<10?'0'+sec:sec);
					// remainingQuota = 2; //for test
					var msg = "";
					var msgClass = ""
					if (remainingQuota > 0){

						var title = '';
						var examinationId = '';
						var fieldId;

						if (ilearningVersion == 1){
							title = $("[ng-bind-html='data.examination.examinationName']").text();
							examinationId = checkReservationData.examinationId;
							fieldId = checkReservationData.field;
						}
						if (ilearningVersion == 2){
							title = $(".exam-name.ellipsis-text>span").text();
							examinationId = checkReservationData.examId;
							fieldId = checkReservationData.id;
						}

						msg = '['+ dateStr +'] 发现 <b>' + remainingQuota + '</b> 个名额!';
						msgClass = "highlight-msg";
						console.log(checkReservationData)
						//发送通知消息
                        GM_notification({
                            "title": title,
                            "text": '发现 ' + remainingQuota + ' 个名额!',
                            "timeout": 10000,
                            highlight: true, //布尔值，是否突出显示发送通知的选项卡
                            silent: false,   //布尔值，是否播放声音
                        });
					}
					else{
						msg = '['+ dateStr +'] 没有发现名额。';
						msgClass = "normal-msg";
					}
					$("#msgBox").prepend(`<div class="`+ msgClass +`">`+msg+`</div>`);
					console.log(msg);
				}
			}
		});
	}

	$("#startBtn").click(function(){
		if (!checkingFlag){

			console.log('************** Checking started! **************');
			//校验输入的间隔时间
			var checkInterval = $("#checkInterval").val();
			console.log(checkInterval)
			if (checkInterval == null || checkInterval ==''){
				alert("时间间隔不能为空！");
				return;
			}
			else if (!(/(^[1-9]\d*$)/.test(checkInterval))){
				alert("时间间隔不是正整数！");
				return;
			}
			else if (parseInt(checkInterval) < 10){
				alert("时间间隔不能小于10秒！");
				return;
			}

			if (ilearningVersion == 2){
				// 新版ilearning, 从URL参数中获取examin Id，从场次列表中获取选中的field Id
				var fieldId = $(".session-select-overlay .selectTable .ant-table-body .ant-table-tbody>tr.selected-row").attr("data-row-key");
				if (!fieldId){
					fieldId = $(".ant-modal-wrap.ka-a-confirm .ant-modal-body .ka-a-confirm-body .recordTable .ant-table-tbody>tr.ant-table-row-selected").attr("data-row-key");
					if (!fieldId){
						alert("请选择场次！");
					    return;
					}

				}
				checkReservationData = {
					"examId": urlParams.examId,
					// "id": parseInt(fieldId)
					"id": fieldId
				};

			}

			console.log('checkReservationData', checkReservationData);

			checkingFlag = 1;
			$("#startBtn").text("Stop").removeClass("start-btn").addClass("stop-btn");
			$("#msgBoard").show();

			checkRemainingQuota();
			//定时轮询
			var timer3= setInterval(checkRemainingQuota, parseInt(checkInterval)*1000);
			timers.push(timer3);
		}
		else{
			if (timers.length >= 1){
				for (var i=0;i<timers.length;i++)
				{
					clearInterval(timers[i]);
				}
			}
			checkingFlag = 0;
			$("#startBtn").text("Start").removeClass("stop-btn").addClass("start-btn");;
			$("#msgBoard").hide();
			$("#msgBox").html("");

		}
	});
})();