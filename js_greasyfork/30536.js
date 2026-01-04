// ==UserScript==
// @name         ewsw-cgylr
// @namespace    sucem
// @version      0.1
// @description  test the websocket server and clien
// @author       janken.wang@gmail.com
// @match        http://10.0.0.205/sl/cgylr.jsp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30536/ewsw-cgylr.user.js
// @updateURL https://update.greasyfork.org/scripts/30536/ewsw-cgylr.meta.js
// ==/UserScript==

(function() {
	'use strict';


	// Your code here...

	// set alert to null function
	window.alert = function(){};

	var ws = new WebSocket('ws://localhost:9988');

	// 判断状态，如果连接失败或者成功，都在网页的醒目位置提醒
	var result_area$ = $('<td><span id="result_area">');
	$('#minmax tr:first td:last').after(result_area$);

	// show the connecting message
	result_area$.text('Connecting...');

	// when connection closed
	ws.onclose = function(event) {
		var code = event.code;
		var reason = event.reason;

		result_area$.text('Connection is closed.The closed code is: ' + code + ' . The reason is: ' + reason);
	};

	// connection success
	ws.onopen = function() {
		result_area$.text('Connection is opened');
	};

	// 收到 服务端 发送的指令
	ws.onmessage = function(event) {
		var command = event.data.toString().split(" ");
		operationDiv(command);
	};

	/**
	根据传入的指令调用特定的方法
	**/
	function operationDiv(data) {
		if(data[0] != 'cgylr') {
			return false;
		}

		switch (data[1]) {
			case 'search':
				doSearchCgylr(data[2]);
				break;
			case 'update_ytb': //更新预录入
				//console.log('enter switch');
				doUpdateYtb();
				break;
			default:
				return false;
		}
	}


	/**
	查询车辆的 预录入 信息
	查询成功以后返回给 websocket
	**/
	function doSearchCgylr(tmh) {
		$('body').unbind('ajaxComplete');
		$('body').bind('ajaxComplete',function(){

			var result = {
				'op': 'display-data',
				'data': {
					'tmh': $('#cg_ylr_tmh').val(),
					'lsh': $('#cg_ylr_lsh').val(),
					'hphm': $('#cg_ylr_yhphm').val(),
					'cg_blzt': $('#zt').val(),
					'zw_blzt': $('#zw_ylr_blzt').val(),
					'ylr_blzt': $('#ylr_blzt').val(),
					'cg_ls': []
				}
			};

			$('#flowtable tr').each(function () {
				var flowtable_tmh = $(this).children('td:eq(0)').text();
				if (flowtable_tmh == $('#cg_ylr_lsh').val()) {
					result.data.cg_ls.push($(this).children('td:eq(15)').text());
				}
			});

			//console.log(result);
			ws.send(JSON.stringify(result));
		});

		$('#tmls').val(tmh);
		$('#cxBtn').click();
	}

	/**
	更新 预录入和专网的状态为 YTB
	退办业务时使用
	**/
	function doUpdateYtb() {
		//console.log('enter function');

		// 判断一下当前的状态是否正常
		//var tmls = $('tmls').val();
		//if( !tmls || tmls === '')
		//	return false;

		$('body').unbind('ajaxComplete');
		$('body').bind('ajaxComplete', function(){
			var result = {
				op: 'display-update-result',
				data: 'Update Success'
			};

			ws.send(JSON.stringify(result));
		});


		$('#cg_ylr_blzt').val('YTB');
		$('#zw_ylr_blzt').val('YTB');
		$('#button').click();
		$('#button2').click();
	}
})();