// ==UserScript==
// @name         189自动广告
// @namespace    Cutemon
// @version      1.52
// @description  偷偷给我狐打个广告岂不美哉_(¦3」∠)_
// @author       Cutemon
// @match        http://live.bilibili.com/h5/189/ad
// @require      http://static.hdslb.com/live-static/libs/jquery/jquery-1.11.3.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37144/189%E8%87%AA%E5%8A%A8%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/37144/189%E8%87%AA%E5%8A%A8%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
	var is_live = 0;
	var pause = 0;
    var i = 0;
    var intervalTime = 20;
	var color = 16777215;
	var danmu = [
			"喜欢狐妖的新人宝宝们可以点一波关注呦~(。•ω•。)",
			"关注了的狐宝每周六下午三点可以参加抽奖~大家不要忘记！",
			"想成为狐妖家的小狐宝吗，一个B克拉，狐宝勋章带回家~",
			"喜欢狐妖的话欢迎加群哦~群号屏幕上方和简介里都有！",
			"加群不仅可以接到直播通知，还可以和狐妖聊天哦~",
			"微博@爱吃橘子的狐妖，有想推荐给狐妖的歌评论在置顶微博噢~",
			"想让你的勋章变得与众不同吗，加入友爱社①狐宝风暴 ②狐妖神教",
			"新人请看下方简介，能了解UP主信息及避免违规被禁哦",
			"简介在网页最下方，手机端、PAD端点房间标题查看",
			"上船的大佬们在有效期内可以承包一首专属歌曲，享有优先点歌权",
			"船员可进入舰长群，13级勋章可进入真爱群，私聊房管获取群号",
			"一直没点到歌的狐宝试试投喂宝点歌？",
			"招募剪辑师画师各种师【可有偿】，只要你有技能，欢迎私戳房管哦",
			"左边淡粉字是已唱歌单哦，唱过的歌就不要再点了~",
			"春节活动结束后，新春榜前十可以获得up真人台历哟~",
		];
	var html = `<!DOCTYPE html>
				<html>
					<head>
						<meta charset="UTF-8">
						<title></title>
						<style type="text/css">
							.color {
								display: inline-block;
								vertical-align: middle;
								cursor: pointer;
								box-sizing: border-box-box;
								border: 1px solid #d0d7dd;
								border-radius: 50%;
								width: 20px;
								height: 20px;
							}
							div {
								margin: 20px 0 0 20px;
							}
						</style>
					</head>
					<body>
						<div>
							发送间隔：<input style="width: 50px;" type="number" id="intervalTime" value="20"> 秒 <span id="setTime" style="color: #EB3941; margin-left: 10px;">默认发送间隔为20秒</span><br /><br />
						</div>
						
						<div>
							弹幕颜色：
							<span class="color white" color="16777215" style="background-color: rgb(255, 255, 255);"></span>
							<span class="color red" color="16738408" style="background-color: rgb(255, 104, 104);"></span>
							<span class="color blue" color="6737151" style="background-color: rgb(102, 204, 255);"></span>
							<span class="color purple" color="14893055" style="background-color: rgb(227, 63, 255);"></span>
							<span class="color cyan" color="65532" style="background-color: rgb(0, 255, 252);"></span>
							<span class="color green" color="8322816" style="background-color: rgb(126, 266, 0);"></span>
							<span class="color yellow" color="16772431" style="background-color: rgb(255, 237, 79);"></span>
							<span class="color orange" color="16750592" style="background-color: rgb(255, 152, 0);"></span>
							<span class="color pink" color="16741274" style="background-color: rgb(255, 115, 154);"></span>
							<span id="setColor" style="color: #EB3941; margin-left: 10px;">默认弹幕颜色为 <span class="color" style="background-color: rgb(255, 255, 255);"></span></span><br /><br />
						</div>
						<div>
							<button id="start">弹幕开启</button> 
							<button id="clear">发送终止</button>
							<span id="switch"></span><br /><br />
						</div>
						<div>
							<button id="danmuadd">新增</button>
						</div>
						<div id="danmuarr">
							
						</div>
						<div id="log" style="position: absolute; left: 45%; top: 0; margin: 0;">
						
						</div>
					</body>
				
				</html>`;
	
	$('body').html(html);
	console.log(danmu.length);
	function live_status(){
		$.ajax({
			type:"get",
			url:"//api.live.bilibili.com/room/v1/Room/room_init?id=189",
			success: function(response){
				console.log(pause);
				is_live = response.data.live_status;
				if(is_live){
					$('#switch').html('<span style="color: #00BE00; margin-left: 10px;">弹幕发射已启用，我狐正在直播中_(¦3」∠)_</span>');
					if(pause == 1){
						pause = 0;
						set_time();
					}
					clock();
				} else{
					$('#switch').html('<span style="color: #FF9800; margin-left: 10px;">弹幕发射已启用，但是我狐并没有开播，发射暂停，将在开播5分钟内重新开启_(¦3」∠)_</span>');
					if(pause == 0){
						pause = 1;
						intervalTime = 300;
						start();
					}
				}
			},
			error: function(){
				$('#switch').html('<span style="color: #EB3941; margin-left: 10px;">似乎遇到了网络错误……</span>');
			}
		});
	}
	function getDanmu(){
		$('#danmuarr').empty();
		for(var i = 1; i <= danmu.length; i++){
			$('#danmuarr').append(i + '、<input style="width: 500px; margin-bottom: 5px;" type="text" index="' + [i - 1] + '" value="' + danmu[i - 1] + '" maxlength="30"/> <button class="danmudel" index="' + [i - 1] + '">删除</button><br />');
		}
		$('.danmudel').click(delDanmu);
		$('#danmuarr input').blur(function(){
			console.log($(this).attr('value'), $(this).attr('index'), $(this).val());
			let index = $(this).attr('index');
			let val = $(this).val();
			danmu[index] = val;
		});
	}
	getDanmu();
	
	function addDanmu(){
		$('#danmuarr').empty();
		danmu[danmu.length] = "我狐美如画，我狐音如诗_(¦3」∠)_";
//		console.log(danmu[danmu.length-1]);
		getDanmu();
	}
	function delDanmu(){
		let index = $(this).attr('index');
		console.log(index);
		danmu.splice(index, 1);
		getDanmu();
	}
    function clock() {
            // 获取时间戳
        var now = new Date(),
            timestamp = now.getTime();
        // 定义弹幕发送
        $.ajax({
            type: "POST",
            url: "//live.bilibili.com/msg/send",
            data: {
            	// 字体颜色：默认白色：16777215 | 姥爷红：16738408 | 姥爷蓝：6737151 | 青色：65532 | 绿色：8322816 | 黄色：16772431 | 橙色：16750592
                color: color,
                fontsize: 25,
                mode: 1,
                msg: danmu[i],
                rnd: timestamp,
                roomid: 70270
            },
            success: function(){
            	if(i === 0){
            		$("p").remove();
            	}
            	var danmuok = $("<p></p>").html('<span style="color: #00BE00; margin-left: 10px;">【发送成功】</span>' + danmu[i]); // 以 jQuery 创建新元素
            	$("#log").append(danmuok); // 追加新元素
            	i == danmu.length - 1 ? i = 0 : i++;
            },
            error: function(){
            	if(i === 0){
            		$("p").remove();
            	}
            	var danmufail = $("<p></p>").html('<span style="color: #EB3941; margin-left: 10px;">【发送失败】</span>' + danmu[i]); // 以 jQuery 创建新元素
            	$("#log").append(danmufail); // 追加新元素
            	i == danmu.length - 1 ? i = 0 : i++;
            },
        });
    }

    // 定义定时器以及开关函数
    var send = 0;
    var sendStart = 0;

    function start() {
    	clearInterval(send); // 消除定时器的叠加
    	console.log("发送间隔：" + intervalTime);
        send = setInterval(live_status, intervalTime * 1e3); // 自动发送间隔，1秒=1000，默认20秒，可自行修改
        sendStart = 1;
    }

    function clear() {
        clearInterval(send);
        i = 0;
        sendStart = 0;
        $('#switch').html('<span style="color: #EB3941; margin-left: 10px;">弹幕发射已关闭_(¦3」∠)_</span>');
    }
    
    // 设定发送间隔和弹幕颜色
    function set_time() {
    	intervalTime = document.getElementById('intervalTime').value;
    	$('#setTime').html('<span style="color: #00BE00;">发射间隔已设置为' + intervalTime + '秒</span>');
    	if(sendStart == 1){
    		start();
    	}
    }
    
    function set_color(e) {
    	color = $(this).attr('color');
    	//			console.log($(this)[0].outerHTML);
    	$('#setColor').html('<span style="color: #00BE00;">弹幕颜色已设置为 ' + $(this)[0].outerHTML + ' ，如果你没有该颜色的弹幕，弹幕颜色会被设为默认白色</span>');
    }

    $('#start').click(function(){
    	set_time();
    	start();
    });
    $('#clear').click(clear);
    $('#intervalTime').blur(set_time);
    $('.color').click(set_color);
    $('#danmuadd').click(addDanmu);
    
    
})();