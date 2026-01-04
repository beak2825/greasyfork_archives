	// ==UserScript==
	// @name         春节活动兑换
	// @namespace    Cutemon
	// @version      0.45
	// @description  春节活动换不到东西只好……_(¦3」∠)_
	// @author       Cutemon
	// @match        http://live.bilibili.com/h5/189/spring
	// @require      http://static.hdslb.com/live-static/libs/jquery/jquery-1.11.3.min.js
	// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37627/%E6%98%A5%E8%8A%82%E6%B4%BB%E5%8A%A8%E5%85%91%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/37627/%E6%98%A5%E8%8A%82%E6%B4%BB%E5%8A%A8%E5%85%91%E6%8D%A2.meta.js
	// ==/UserScript==

	(function() {
		var html = (function() {/*
					<!DOCTYPE html>
					<html>
						<head>
							<link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
							<script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
							<meta charset="UTF-8">
							<title></title>
							<style type="text/css">
								body{
									margin: 0;
									padding: 0;
								}
								div {
									border: 1px dashed black;
								}
								span {
									display: inline-block;
								}
								.margin-style{
									margin: 20px 0 0 20px;
								}
								button {
									margin: 10px 10px 0 0;
								}
								#div-left{
									border: 0;
									position: relative;
									display: inline-block;
									vertical-align: top;
									width: 43%;
								}
								.poolTable{
									position: relative;
									display: inline-block;
									width: 50%;
									box-sizing: content-box;
								}
								#log-box {
									position: relative;
									display: inline-block;
									width: 100%;
									margin-top: 20px;
									height: 400px;
									font-size: 18px;
									overflow: auto;
								}
							</style>
						</head>
						<body>
							<div id="div-left" class="margin-style">
								<div id="btn" class="btn-group" role="group" aria-label="兑换池" style="text-align: center;">
									<span>
										<button type="button" class="btn btn-default" award_id="gift-109">红灯笼（15红包）</button>
										<button type="button" class="btn btn-default" award_id="gift-4">喵娘（233红包）</button>
										<button type="button" class="btn btn-default" award_id="gift-3">B坷垃（450红包）</button>
										<button type="button" class="btn btn-default" award_id="silver-100">银瓜子 × 100（10红包）</button>
										<button type="button" class="btn btn-default" award_id="guard-3">舰长1个月（6699红包）</button>
										<button type="button" class="btn btn-default" award_id="title-140">秋田君头衔（666红包）</button>
										<button type="button" class="btn btn-default" award_id="title-89">爆竹头衔（888红包）</button>
										<button type="button" class="btn btn-default" award_id="title-92">年兽头衔（999红包）</button>
										<button type="button" class="btn btn-default" award_id="danmu-gold">金色弹幕1天（2233红包）</button>
										<button type="button" class="btn btn-default" award_id="uname-gold">金色昵称1天（8888红包）</button>
										<button type="button" class="btn btn-default" award_id="gift-113">新春抽奖（23333红包）</button>
										<button type="button" class="btn btn-default" award_id="award-calendar">2018新年台历（8888红包）</button>
										<button type="button" class="btn btn-default" award_id="stuff-3">贤者之石（1888红包）</button>
										<button type="button" class="btn btn-default" award_id="stuff-2">经验曜石（233红包）</button>
										<button type="button" class="btn btn-default" award_id="stuff-1">经验原石（30红包）</button>
										<button type="button" class="btn btn-default" award_id="award-master">首页推荐卡1小时（66666红包）</button>
									</span>
									<div style="margin-top: 20px">
										姥爷需要换几个：<input style="width: 50px;" type="number" id="num" value="1" min="1" />个
										<span id="award_name"></span><br />
										<span>(这里是每次执行兑换的数量，不是总数！如果开启自动兑换，则会在设定的时间内反复执行)</span><br />
										<button id="exchange" class="btn btn-info">立即兑换</button>
										<span id="text"></span>
									</div>
									<div style="margin-top: 20px;">
										开启时段：每小时<input style="width: 50px;" type="number" name="" id="start_min" value="58" min="0" max="59" />分<input style="width: 50px;" type="number" name="" id="start_sec" value="40" max="59"/>秒开始，<input style="width: 50px;" type="number" name="" id="end_min" value="0" min="0" max="59" />分<input style="width: 50px;" type="number" name="" id="end_sec" value="30" max="59" />秒结束，每<input style="width: 50px;" type="number" name="" id="exe_interval" value="200" min="100"/>毫秒兑换1次（1秒=1000毫秒）<br />
										<button id="auto_exchange" class="btn btn-success" style="margin-right: 50px;">整点自动兑换</button>
										<button id="stop_exchange" class="btn btn-danger">停止整点兑换</button>
									</div>
								</div>
								
								<div id="log-box" style="border: 0;">
									<div id="log" style="border-bottom: 0;">
										<span class="margin-style" style="color: #EB3941;">
											<span id="auto1">整点自动兑换未开启</span><br />
											<span id="auto2">兑换池自动刷新未开启</span><br />
											<span id="daily-gift" style="margin-top: -10px;"></span><br />
										</span><br />
									</div>
									<div style="position: absolute; width: 100%; text-align: center;">
										<button id="clear_log" class="btn btn-info">清除日志</button>
									</div>
								</div>
							</div>	
							
							<div class="poolTable margin-style">
								<span id="pool_num" style="color: #EB3941; margin-left: 10px;"></span><br />
								<span id="red_bag_num" style="color: #EB3941; margin-left: 10px;"></span>
								<div style="text-align: center;">
									<table class="table table-striped">
										<tr>
											<td>奖品</td>
											<td>奖池剩余</td>
											<td>单价</td>
											<td>兑换总上限</td>
											<td>您的兑换剩余</td>
										</tr>
									</table>
										<button id="refresh_now" class="btn btn-info">立即刷新</button>
									<div>
										自动刷新间隔：<input style="width: 50px;" type="number" name="" id="refresh_auto_time" value="5" min="1" />秒<br />
										<button id="auto_refresh" class="btn btn-success" style="margin-right: 50px;">定时自动刷新</button>
										<button id="stop_refresh" class="btn btn-danger">停止自动刷新</button>
									</div>
								</div>	
							</div>
							
						</body>
					</html>
					*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
		$('body').html(html);

		$.ajaxSetup({
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			}
		});
		function get_gift(){
			$.ajax({
				type: "get",
				url: "//api.live.bilibili.com/activity/v1/NewSpring/index",
				success: function(response) {
					var bucketRoom = response.data.bucketRoom;
					if(bucketRoom) {
						var gift_roomid = bucketRoom.roomid;
						$.ajax({
							type: "get",
							url: "//api.live.bilibili.com/activity/v1/Common/getReceiveGift?roomid=" + gift_roomid,
							success: function(response) {
//								console.log($(this));
								$('#daily-gift').append('每日灯笼：<span style="padding-left: 10px;">' + response.msg + '，房间号是：' + gift_roomid + '</span>');
							}
						});
					} else {
						$('#daily-gift').append('每日灯笼：<span style="padding-left: 10px;">房间未开启</span> <button id="retry_btn" class="btn btn-info" style="vertical-align: baseline;">重试</button>');
						$('#retry_btn').click(function() {
							$('#daily-gift').empty();
							get_gift()();
						});
					}
				},
				error: function() {
					$('#daily-gift').html('每日灯笼：<span style="padding-left: 10px;">请求失败</span>');
				}
			});
		}
		get_gift();

		function get_time(){
			// 获取时分秒
			var	now = new Date();
			hours = now.getHours();
			minutes = now.getMinutes();
			seconds = now.getSeconds();
			timestamp = now.getTime();

			// 小于10数字补0
			hours = hours < 10 ? "0" + hours : hours;
			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;
			time = hours + ":" + minutes + ":" + seconds;
		}

		var award = 0;
		var num = 1;
		var start_min = 58;
		var end_min = 0;
		var start_sec = 40;
		var end_sec = 30;
		var exe_interval = 200;
		$(".btn-default").click(function() {
			//			console.log($(this).attr("award_id"));
			award = $(this).attr("award_id");
	//		console.log($(this)[0].outerText);
			$("#award_name").html('<span style="color: #00BE00; margin-left: 10px;">当前需要兑换的是【' + $(this)[0].outerText + '】</span>');
		});
		$("#exchange").click(fun_exchange);

		var do_exchange;
		var msg_num = 1;
		var msg_same = 0;
		function fun_exchange() {
			num = $("#num").val();
            get_time();
			$.ajax({
				type: "post",
				url: "//api.live.bilibili.com/activity/v1/NewSpring/redBagExchange",
				data: {
					award_id: award,
					exchange_num: num
				},
				complete: function(result) {
					//				console.log(result.responseText);
					var msg = eval('(' + result.responseText + ')');
					console.log(msg.msg);
					if(msg.code !== 0) {
						if(msg_same != msg.msg){
							$('#log').append('<p style="padding-left: 20px; margin: 0;">' + time + '<span style="padding-left: 20px;">' + msg.msg + '</span></p>');
							$('#log-box').scrollTop( $('#log-box')[0].scrollHeight );
							msg_same = msg.msg;
							msg_num = 1;
						} else{
							msg_num++;
							$('#log p:last').html(time + '<span style="padding-left: 20px;">' + msg.msg + '</span> <span style="color: #FFF; background-color: rgb(128, 151, 189); border-radius: 50%; padding: 2px 8px;">' + msg_num + '</span>');
							$('#log-box').scrollTop( $('#log-box')[0].scrollHeight );
						}
					} else{
						$('#log').append('<p style="padding-left: 20px; margin: 0;">' + time + '<span style="padding-left: 20px;">兑换成功</span></p>');
						$('#log-box').scrollTop( $('#log-box')[0].scrollHeight );
						msg_same = msg.msg;
					}
				}
			});
		}
		function clock() {
			get_time();
			if(end_min > start_min){
				if(minutes == start_min && seconds >= start_sec || minutes > start_min && minutes < end_min || minutes == end_min && seconds <= end_sec){
//					console.log(time);
					clearInterval(do_exchange);
					do_exchange = setInterval(fun_exchange, exe_interval);
				} else{
					clearInterval(do_exchange);
				}
			} else if(end_min < start_min) {
				if(minutes == start_min && seconds >= start_sec || minutes > start_min || minutes < end_min || minutes == end_min && seconds <= end_sec){
//					console.log(time);
					clearInterval(do_exchange);
					do_exchange = setInterval(fun_exchange, exe_interval);
				} else{
					clearInterval(do_exchange);
				}
			} else if(end_min == start_min && minutes == end_min){
				if(seconds >= start_sec && seconds <= end_sec){
//					console.log(time);
					clearInterval(do_exchange);
					do_exchange = setInterval(fun_exchange, exe_interval);
				} else{
					clearInterval(do_exchange);
				}
			}
		}

		var send;

		function start() {
			start_min = $("#start_min").val();
			end_min = $("#end_min").val();
			start_sec = $("#start_sec").val();
			end_sec = $("#end_sec").val();
			exe_interval = $("#exe_interval").val();
			clearInterval(do_exchange);
			clearInterval(send);
			send = setInterval(clock, 1e3);
			$('#auto1').html('<span style="color: #00BE00;">整点自动兑换已启用，将从' + start_min + '分' + start_sec + '秒开始，' + end_min + '分' + end_sec + '秒结束，每' + exe_interval + '毫秒兑换一次</span>');
		}

		function clear() {
			clearInterval(do_exchange);
			clearInterval(send);
			$('#auto1').html('<span style="color: #EB3941;">整点自动兑换未开启</span>');
		}

		$('#auto_exchange').click(start);
		$('#stop_exchange').click(clear);

		var pool_round = 0;
		function get_pool(){
			$('#pool_num').html('数据获取中...');
			$('#red_bag_num').html('');
			$('table').html('');
            get_time();
			$.ajax({
				type: "get",
				url: "//api.live.bilibili.com/activity/v1/NewSpring/redBagPool",
				success: function(response) {
					var pool_list = response.data.pool_list;
					if(pool_round === 0){
						pool_round = response.data.round;
					} else if(pool_round !== 0 && pool_round < response.data.round){
						pool_round = response.data.round;
						$('#log').append('<p style="padding-left: 20px; margin: 0;">' + time + '<span style="padding-left: 20px;">兑换池刷新了！</span></p>');
						$('#log-box').scrollTop( $('#log-box')[0].scrollHeight );
						fun_exchange();
						msg_same = 0;
					}
//					console.log(pool_round);
					$('#pool_num').text('当前奖池是第' + response.data.round + '个兑换池');
					$('#red_bag_num').text('您当前拥有小红包：' + response.data.red_bag_num + '个');
					get_time();

					$('table').append('<tr><td>奖品</td><td>奖池剩余</td><td>单价</td><td>兑换总上限</td><td>您的兑换剩余</td></tr>');
//					console.log(pool_list);
					for(var pool = 0; pool < pool_list.length; pool++) {
						if(pool_list[pool].exchange_limit === 0){
							pool_list[pool].exchange_limit = "无限制";
							pool_list[pool].user_exchange_count = "无限制";
						}
						if(pool_list[pool].stock_num > 0){
							pool_list[pool].stock_num = '<span style="color: #00BE00;">' + pool_list[pool].stock_num + '</span>';
						} else{
							pool_list[pool].stock_num = '<span style="color: #EB3941;">' + pool_list[pool].stock_num + '</span>';
						}
						$('table').append('<tr><td>' + pool_list[pool].award_name + '</td><td>' + pool_list[pool].stock_num + '</td><td>' + pool_list[pool].price + '</td><td>' + pool_list[pool].exchange_limit + '</td><td>' + pool_list[pool].user_exchange_count + '</td></tr>');
					}
				}
			});
		}
		get_pool();

		var do_refresh;

		function start_refresh() {
			var refresh_auto_time = $("#refresh_auto_time").val();
			clearInterval(do_refresh);
			do_refresh = setInterval(get_pool, refresh_auto_time * 1e3);
			$('#auto2').html('<span style="color: #00BE00;">兑换池自动刷新已启用，每' + refresh_auto_time + '秒刷新一次</span>');
		}

		function clear_refresh() {
			clearInterval(do_refresh);
			$('#auto2').html('<span style="color: #EB3941;">兑换池自动刷新未开启</span>');
		}
		
		function clear_log(){
			msg_same = 0;
			$('#log').children('p').remove();
		}
		
		
		$('#refresh_now').click(get_pool);
		$('#auto_refresh').click(start_refresh);
		$('#stop_refresh').click(clear_refresh);
		$('#clear_log').click(clear_log);
	})();