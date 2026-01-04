// ==UserScript==
// @name         taobao_union_adzone_data
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  一键拉取淘宝联盟推广位效果报表数据30天数据（含今天），取代一天天手动查询拉取
// @author       paperen
// @match        https://pub.alimama.com/portal/v2/pages/effect/account/channel/page/home/index.htm
// @icon         https://paperen.com/upload/thumbnail/bxjg_8.gif
// @grant        none
// @require https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463656/taobao_union_adzone_data.user.js
// @updateURL https://update.greasyfork.org/scripts/463656/taobao_union_adzone_data.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var data_api_url = 'https://pub.alimama.com/openapi/param2/1/gateway.unionpub/pub.rpt.lens.data.dws_list_effect.json?t={time}&_tb_token_={token}&pageNo=1&keyword=&pageSize=1000&start_date={date_start}&end_date={date_end}&period_id=1d&subType=adzone&type=channel';
    var data_today_api_url = 'https://pub.alimama.com/openapi/param2/1/gateway.unionpub/pub.rpt.lens.data.dws_list_effect.json?t={time}&_tb_token_={token}&pageNo=1&keyword=&pageSize=1000&start_date={date_start}&end_date={date_end}&period_id=realTime&subType=adzone&type=channel';
    var recv_api_url = 'https://dsp.adprod.cn/api/data/taobao_add';
    window.onload = function(){
        var button = $('<button>');
        button.css({
            'color': '#fff',
            'background': 'blue',
            'border': '1px solid #000',
            'float': 'right',
            'padding': '6px',
            'border-radius': '6px',
            'margin-top': '5px'
        });
        button.text('神奇按钮：一键爬取30天数据');
        button.on("click", function(){
			var today = getToday();
            var date_range = getDateRange(30);
            var cookie = document.cookie;
            try {
				var today_url = data_today_api_url.replace('{time}', Date.now()).replace('{token}', getCookie('_tb_token_')).replace('{date_start}', today).replace('{date_end}', today);
				$.getJSON(today_url, function(data){
					var post_data = {
						'date': today,
						'data': []
					};
					var total = data['data']['result'].length;
					// 按30一批次传给后端
					var tmp = [];
					for(var i=1;i<=total;i++) {
						tmp.push(data['data']['result'][i-1]);
						if (i%30 == 0) {
							post_data['data'] = tmp;
							sendData(post_data, today, tmp.length);
							tmp = [];
						}
					}
					if (tmp.length > 0) {
						post_data['data'] = tmp;
						sendData(post_data, today, tmp.length);
					}
				});
			
                date_range.forEach(d => {
                    var url = data_api_url.replace('{time}', Date.now()).replace('{token}', getCookie('_tb_token_')).replace('{date_start}', d).replace('{date_end}', d);
                    $.getJSON(url, function(data){
                        var post_data = {
                            'date': d,
                            'data': []
                        };
						var total = data['data']['result'].length;
						// 按30一批次传给后端
						var tmp = [];
						for(var i=1;i<=total;i++) {
							tmp.push(data['data']['result'][i-1]);
							if (i%30 == 0) {
								post_data['data'] = tmp;
								sendData(post_data, d, tmp.length);
								tmp = [];
							}
						}
						if (tmp.length > 0) {
							post_data['data'] = tmp;
							sendData(post_data, d, tmp.length);
						}
                    });
                });
				alert('爬取成功');
            } catch(e) {
                console.log('爬取异常' + e);
				alert('爬取失败');
            }
        });
 
        setTimeout(function(){
            $('.next-affix-top').after($(button));
        }, 1000);
    }
 
	function sendData(post_data, date, cnt) {
		$.ajax({
			type: "POST",
			dataType: "JSON",
			url: recv_api_url,
			data: post_data,
			success: function(res){
				console.log(`${date}爬取到${cnt}条记录`);
			}
		});
	}
    function getCookie(cookieName) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        for(var i = 0; i < arrCookie.length; i++){
            var arr = arrCookie[i].split("=");
            if(cookieName == arr[0]){
                return arr[1];
            }
        }
        return "";
    }
	
	function getToday() {
		let currentDate = new Date();
		let year = currentDate.getFullYear();
		let month = currentDate.getMonth() + 1;
		let day = currentDate.getDate();
		month = month < 10 ? '0' + month : month;
		day = day < 10 ? '0' + day : day;
		return `${year}-${month}-${day}`; 
	}
 
    function getDateRange(days) {
        var res = [];
        // 获取当前日期
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
 
        // 循环生成近30天的日期
        for (let i = 0; i < days; i++) {
            // 获取当前日期的年、月、日
            let year = currentDate.getFullYear();
            let month = currentDate.getMonth() + 1;
            let day = currentDate.getDate();
 
            // 格式化月份和日期为两位数
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            res.push(`${year}-${month}-${day}`);
 
            // 将日期减一天
            currentDate.setDate(currentDate.getDate() - 1);
        }
        return res;
    }
})();