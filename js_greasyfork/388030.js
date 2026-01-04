// ==UserScript==
// @name         http://ptwx.xmjdt.com
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  monitor xianyou bus ticket
// @author       leilight
// @match        http://ptwx.xmjdt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388030/http%3Aptwxxmjdtcom.user.js
// @updateURL https://update.greasyfork.org/scripts/388030/http%3Aptwxxmjdtcom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('title').html('时刻提醒');
    $('body div').remove();
    var now=new Date();
    var sunday=new Date(now.setDate(now.getDate()+(7-now.getDay())%7));
    $('body').append('<input type="text" id="txt_date" placeholder="例如：2020-01-01" value="'+(sunday.getFullYear()+'-'+(sunday.getMonth()+1)+'-'+sunday.getDate())+'"/><input type="text" id="txt_no" value="50" placeholder="目标座位号"/><button type="button" id="btn_listen">监听</button><button id="btn_cancel">取消</button><br /><div id="div_content" style="width:98%;height:98%;border:1px solid black;font-size:14px;"></div>');
	var myTicketIntervalId = 0;
	var log = function (freeSeats, msg) {
		if (!isLogExsit(freeSeats)) {
			$('#div_content').append('<span data-freeSeats=' + freeSeats + '>' + msg + '</span><br/>')
		} else {
			$('span[data-freeSeats=' + freeSeats + ']').html(msg);
		}
	}
	var isLogExsit = function (freeSeats) {
		return $('span[data-freeSeats=' + freeSeats + ']').length > 0;
	}
	var postTicket = function (time) {
		if (!time) time = 10;
		var date = $('#txt_date').val();
		var no = parseInt($('#txt_no').val());
		$('#txt_date,#txt_no').attr('disabled', 'disabled');
		myTicketIntervalId && clearInterval(myTicketIntervalId);
		myTicketIntervalId = setInterval(function(){myTicketIntervalIdFunc();}, time * 1000);
        var myTicketIntervalIdFunc=function () {
			$.post('http://ptwx.xmjdt.com/Coach/GetCoachInfo', { 'StartSite': '仙游', 'EndSite': '厦门', 'ExecuteDate': date, '_': Math.random() }).done(function (datas) {
				debugger
                datas = JSON.parse(datas);
				var data = datas.find(function (d) {
					return d.SetoutTimeDesc == '17:30';
				});

                var coachSeatNumber=data.CoachSeatNumber-4;
				var nextTikectNo = coachSeatNumber - data.FreeSeats + 1;
				if (nextTikectNo >= no) {
					$('#btn_cancel').click();
					var altermsg='下一票座位是：' + nextTikectNo+'号';
					sendPhoneMsg(altermsg);
					clearInterval(myTicketIntervalId);
					alert(altermsg);
				}
                var goodTickects="";
                if(data.PlanCoachCardNumber=="闽BY2389黄"){
                    goodTickects="17、18、21、22号";
                }else if(data.PlanCoachCardNumber=="闽BY2388黄"){
                    goodTickects="13、14、21、22号";
                }else{
                    goodTickects="21、22号";
                }
				var now = new Date();

				var year = now.getFullYear().toString();
				var month = (now.getMonth() + 1).toString();
				var day = now.getDate().toString();
				var hour = now.getHours().toString();
				var minute = now.getMinutes().toString();
				var second = now.getSeconds().toString();

				month = month.length == 1 ? '0' + month : month;
				day = day.length == 1 ? '0' + day : day;
				hour = hour.length == 1 ? '0' + hour : hour;
				minute = minute.length == 1 ? '0' + minute : minute;
				second = second.length == 1 ? '0' + second : second;

				var msg = '更新时间:'+year + '-' + month + '-' + day + ' '+'<b style="color:red;weight:600;font-size:16px;">' + hour + ':' + minute + ':' + second+'</b> 消息：'
					+ date + ' 17:30 '
					+ data.LineName + ' '
					+ data.CoachGradeName
					+ ' '
					+ data.PlanCoachCardNumber
                    + ' '
                    +goodTickects
					+ ' 总票数：' + coachSeatNumber + ' 张'
					+ ' 剩于票数：' + data.FreeSeats + ' 张'
					+ '  下一票座号：<b style="color:red;weight:600;font-size:20px;">' + nextTikectNo + '</b>号'
					+ '<hr style="height:1px;">';
				log(data.FreeSeats, msg);
			});
		}
        myTicketIntervalIdFunc();
	}
	var sendPhoneMsg=function(msg){
		var apiRoot='http://api.smsbao.com/sms?u=leilighet&p=a07ec40b79b08620471f0950de0b4eca&m=18950180118&c=';
		var content=encodeURI(msg);
		var api=apiRoot+content;
		$.get(api).done(function(result){
			if(result=='0'){
				console.log('短信发送成功：'+result);
			}else{
				console.log('短信发送失败：'+result);
			}
		})
		.always(function(){
			console.log('发送短信：'+api);
			
		});
	}
	$('#btn_listen').click(function () {
		postTicket();
		$(this).attr('disabled','disabled');
	});
	$('#btn_cancel').click(function () {
            $('#txt_date,#txt_no,#btn_listen').removeAttr('disabled', 'disabled');
            myTicketIntervalId && clearInterval(myTicketIntervalId);
        });
})();