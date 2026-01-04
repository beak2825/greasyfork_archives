// ==UserScript==
// @name         bilibili v同传字幕辅助
// @version      20201225
// @description  连接弹幕服务器，按正则表达式过滤弹幕，将过滤后的弹幕在屏幕上显示
// @author       zmh
// @require      https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.10/pako.min.js
// @require      https://code.jquery.com/jquery-3.4.0.min.js
// @require      https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_info
// @match        http://live.bilibili.com/*
// @match        https://live.bilibili.com/*
// @namespace    https://greasyfork.org/users/705963
// @downloadURL https://update.greasyfork.org/scripts/416268/bilibili%20v%E5%90%8C%E4%BC%A0%E5%AD%97%E5%B9%95%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/416268/bilibili%20v%E5%90%8C%E4%BC%A0%E5%AD%97%E5%B9%95%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==


class SetMsg {
	constructor() {
		this.containerEl = document.body;
	}
	show({sign='caution',text = '异常显示',div,duration = 2000}) {
		let messageEl = document.createElement('div');
		messageEl.className = 'link-toast '+sign;
		messageEl.style = 'left: '+(div.offset().left+20)+'px; top: '+(div.offset().top+div.height())+'px;';
		messageEl.innerHTML = `<span class="toast-text">${text}</span>`;
		this.containerEl.appendChild(messageEl);
		setTimeout(() => {
			messageEl.className += ' out';
			setTimeout(() =>{this.containerEl.removeChild(messageEl);},100);
		}, duration);
	}
}
class Message {
	constructor() {
		const containerId = 'danmu';
		this.containerEl = document.getElementById(containerId);
	}
	show({text = '' ,duration = 2000}) {
		let messageEl = document.createElement('div');
		messageEl.className = 'message move-in';
		messageEl.innerHTML = `<div class="text">${text}</div>`;
		this.containerEl.appendChild(messageEl);
		setTimeout(() => {
			messageEl.className = messageEl.className.replace('move-in', '');
			messageEl.className += 'move-out';
			messageEl.addEventListener('animationend', () => {
				messageEl.setAttribute('style', 'height: 0; margin: 0');
			});
			messageEl.addEventListener('transitionend', () => {
				messageEl.remove();
			});
			setTimeout(() =>{this.containerEl.removeChild(messageEl);},600);
		}, duration);
	}
}

var processMatchedTxt=(original,regex,joinLetter)=>{
	var matchres = original.match(regex);
	if(matchres&&matchres.length>0)matchres=matchres.filter(a=>a && a.trim());
	if(matchres&&matchres.length>1)matchres=matchres.splice(1);
	if(matchres)matchres=matchres.join(joinLetter);
	return matchres || null;
}

var config={
	"zimuOnOff" : 0,
	"zimuFontSize":25,
	"zimuColor":"#00FF00",
	"zimuBottom":80,
	"zimuOpacity":100,
	"deltime":6000,
	"zimuShadow":1,
	"zimuShadowColor":"#FF0000",
	"IsSikiName":0,
	"SikiName":"",
};

(function() {
	'use strict';
	var reloadConfig=function(){
		Object.keys(config).forEach(function(key){
			var valuet=GM_getValue(key);
			if(valuet!=null){
				config[key]=valuet;
			}else {
				GM_setValue(key,config[key]);
			}
		});
	};
	var reloadaConfig=function(key){
		GM_setValue(key,config[key]);
	};
	var sikiname=[];
	var sikinamebool=true;
	var strtoval = function(){
		sikiname = config.SikiName.split(',');
		if(sikiname.length==1&&sikiname[0]=="")
			sikiname=[];
		else
			sikinamebool=false;
	}
	var valtostr = function(){
		if(sikiname.length==0)
			config.SikiName="";
		else
			config.SikiName=sikiname.toString();
	}
	if(!document.getElementById("live-player-ctnr")){
		console.log('当前页面:无播放器');
		return;
	}

	var main=setInterval(function () {
		if($(".icon-left-part").length==0)return;
		clearInterval(main);

		var zimuSetting = $('<span data-v-34b5b0e1="" id="zimuSettings" title="同传设置" class="icon-item icon-font icon-danmu-a"></span>');
		zimuSetting.appendTo($(".icon-left-part"));

		// 创建页面字幕元素
		var danmudiv=$('<div></div>');
		danmudiv.attr('id','danmu');
		danmudiv.css({
			"min-width":"100px",
			"width":$(".bilibili-live-player.relative").width(),
			"magin":"0 auto",
			"position":"absolute",
			"left":"0px",
			"bottom":config.zimuBottom+"px",
			"z-index":"14",
			"color":config.zimuColor,
			"font-size": config.zimuFontSize+"px",
			"opacity": (config.zimuOpacity*0.01),
			"text-align":"center",
			"font-weight": "bold",
			"pointer-events":"none",
			"text-shadow":"0 0 0.2em "+config.zimuShadowColor+", 0 0 0.2em "+config.zimuShadowColor,
		});
		//danmudiv.appendTo($("#live-player-ctnr"));   bilibili-live-player-video-area
		danmudiv.appendTo($(".bilibili-live-player-video-area"));

		document.addEventListener("visibilitychange", function() {
			if(!document.hidden){
				reloadConfig();
				strtoval();
				danmudiv.css({
					"width":$(".bilibili-live-player.relative").width(),
					"bottom":config.zimuBottom+"px",
					"color":config.zimuColor,
					"font-size": config.zimuFontSize+"px",
					"opacity": (config.zimuOpacity*0.01),
					"text-shadow":"0 0 0.2em "+config.zimuShadowColor+", 0 0 0.2em "+config.zimuShadowColor,
				});
			}else
			{
				if(zimuSetting.is('.active'))
					$("#zimuSettings").click();
			}
		});

		let statet = $(".bilibili-live-player.relative").width();
		let statetime = setInterval(function () {
			if($(".bilibili-live-player.relative").width() != statet){
				danmudiv.css({"width":$(".bilibili-live-player.relative").width(),});
				statet = $(".bilibili-live-player.relative").width();
			}
		},100);


		reloadConfig();
		strtoval();

		var f=0;
		var room_id=0;
		var uid=0;
		var url;
		var mytoken;
		var port;
		var rawHeaderLen = 16;
		var packetOffset = 0;
		var headerOffset = 4;
		var verOffset = 6;
		var opOffset = 8;
		var seqOffset = 12;
		var socket = null;
		var utf8decoder = new TextDecoder();
		var zimuRegex = new RegExp("(.*)【】(.*)|(.*)【(.*)】|(.*)【(.*)");
		var zimuJoinLetter = "：";

		if($(".area-text").attr('title')!="虚拟主播"){
			config.zimuOnOff=0;
		}
		if(config.zimuOnOff==1)
			connectline();

		var danmuControl = $(`<div data-v-c6378b8a="" data-v-34b5b0e1="" id="danmuControl1" class="border-box dialog-ctnr common-popup-wrap top-left a-scale-in-ease v-enter-to" style="transform-origin: 225px bottom;width: 245px;z-index: 799;">
<div data-v-c6378b8a="" class="arrow p-absolute" style="left: 135px;"></div>
<div data-v-569050c0="" data-v-ef94ec32="" class="player-setting-ctnr">
<div data-v-2e81dc40="">
<h1 data-v-2e81dc40="" class="title">同传辅助设置</h1>
<div data-v-2e81dc40="" class="block-setting-row">
<span data-v-2e81dc40="" id="tongchuanbool" class="setting-label">辅助未开启</span>
<div data-v-6b31df80="" data-v-2e81dc40="" id="checked1" class="bl-switch v-middle"><span data-v-6b31df80="" class="bl-switch-inner"></span></div>
</div>
</div>
</div>
</div>`);

		var danmuControlh1 = $(`<div data-v-2e81dc40="">
<h1 data-v-2e81dc40="" class="title">同传字幕设置</h1>
<div data-v-2e81dc40="" class="block-setting-row">
<span data-v-2e81dc40="" class="setting-label">字体大小</span>
<input data-v-262ea052="" data-v-2e81dc40="" id="input1" type="number" placeholder="" class="link-input t-center v-middle border-box level-input" min="20" max="50" style="width: 48px; height: 24px;">
<span data-v-2e81dc40="" class="v-middle level-hint-text">px</span>
</div>
<div data-v-2e81dc40="" class="block-setting-row">
<span data-v-2e81dc40="" class="setting-label">字幕颜色</span>
<input data-v-262ea052="" data-v-2e81dc40="" id="input2" type="color" placeholder="" class="link-input t-center v-middle border-box level-input" style="width: 24px; height: 24px;">
</div>
<div data-v-2e81dc40="" class="block-setting-row">
<span data-v-2e81dc40="" class="setting-label">字幕高度</span>
<input data-v-262ea052="" data-v-2e81dc40="" id="input3" type="number" placeholder="" class="link-input t-center v-middle border-box level-input" min="0" max="600" style="width: 48px; height: 24px;">
<span data-v-2e81dc40="" class="v-middle level-hint-text">px</span>
</div>
<div data-v-2e81dc40="" class="block-setting-row">
<span data-v-2e81dc40="" class="setting-label">字幕透明度</span>
<input data-v-262ea052="" data-v-2e81dc40="" id="input7" type="number" placeholder="" class="link-input t-center v-middle border-box level-input" min="1" max="100" style="width: 48px; height: 24px;">
<span data-v-2e81dc40="" class="v-middle level-hint-text">%</span>
</div>
<div data-v-2e81dc40="" class="block-setting-row">
<span data-v-2e81dc40="" class="setting-label">字幕存在时间</span>
<input data-v-262ea052="" data-v-2e81dc40="" id="input4" type="number" placeholder="" class="link-input t-center v-middle border-box level-input" min="1" max="20" step="0.1" style="width: 48px; height: 24px;">
<span data-v-2e81dc40="" class="v-middle level-hint-text">秒</span>
</div>
<div data-v-2e81dc40="" class="block-setting-row">
<span data-v-2e81dc40="" class="setting-label">字幕阴影</span>
<div data-v-6b31df80="" data-v-2e81dc40="" id="checked2" class="bl-switch v-middle"><span data-v-6b31df80="" class="bl-switch-inner"></span></div>
</div>
<div data-v-2e81dc40="" class="block-setting-row">
<span data-v-2e81dc40="" class="setting-label">字幕阴影颜色</span>
<input data-v-262ea052="" data-v-2e81dc40="" id="input5" type="color" placeholder="" class="link-input t-center v-middle border-box level-input" style="width: 24px; height: 24px;">
</div>
<div data-v-2e81dc40="" class="block-setting-row">
<span data-v-2e81dc40="" class="setting-label">同传过滤</span>
<div data-v-6b31df80="" data-v-2e81dc40="" id="checked3" class="bl-switch v-middle"><span data-v-6b31df80="" class="bl-switch-inner"></span></div>
</div>
</div>
`);

		var danmuControlh2 = $(`<div data-v-2e81dc40="">
<h1 data-v-2e81dc40="" class="title">同传Man设置</h1>
<div data-v-2e81dc40="" class="block-setting-row">
<input data-v-262ea052="" data-v-2e81dc40="" id="input6" type="text" placeholder="请输入同传Man的名字" maxlength="15" class="link-input border-box keyword-input v-middle" autocomplete="off" style="width: 138px; height: 24px;">
<button data-v-3a76d6ec="" data-v-2e81dc40="" id="button1" disabled="disabled" class="bl-button dp-i-block v-middle keyword-submit-btn bl-button--primary bl-button--small"><span data-v-3a76d6ec="" class="txt">添加</span></button>
<span data-v-2e81dc40=""></span>
</div>
<h2 data-v-2e81dc40="" class="sub-title">同传Man列表</h2>
<div data-v-b41528b4="" id="tchmlist" class="yan-ctnr ps" style="margin-top: 6px;">
</div>
</div>
`);



		Array.prototype.indexOf = function(val) {
			for (var i = 0; i < this.length; i++) {
				if (this[i] == val) return i;
			}
			return -1;
		};

		Array.prototype.remove = function(val) {
			var index = this.indexOf(val);
			if (index > -1) {
				this.splice(index, 1);
			}
		};
		const setmsg = new SetMsg();

		function spendadd(t) {
			let temp =$(`<span data-v-b41528b4="" class="yan-item dp-i-block ts-dot-4">`+t+`</span>`);
			temp.appendTo($("#tchmlist"));
			temp.click(function () {
				sikiname.remove(temp.text());
				valtostr();
				reloadaConfig("SikiName");
				setmsg.show({sign:"success",text:"同传Men # "+temp.text()+" # 移除成功",div:$("#input6")});
				temp.remove();
			});
		}
		function newspendadd(t) {
			if(sikiname.indexOf($("#input6").val())==-1){
				let temp =$(`<span data-v-b41528b4="" class="yan-item dp-i-block ts-dot-4">`+t+`</span>`);
				sikiname.push(t);
				valtostr();
				reloadaConfig("SikiName");
				temp.appendTo($("#tchmlist"));
				temp.click(function () {
					sikiname.remove(temp.text());
					valtostr();
					reloadaConfig("SikiName");
					setmsg.show({sign:"success",text:"同传Men # "+temp.text()+" # 移除成功",div:$("#input6")});
					temp.remove();
				});
			}
		}
		function tchminit(){
			if(!sikinamebool){
				sikiname.forEach(spendadd);
				sikinamebool=true;
			}
			$("#input6").bind("input propertychange",function(event){
				if($("#input6").val()!="")
					$("#button1").removeAttr("disabled");
				else
					$("#button1").attr("disabled","disabled");
			});
			$("#button1").click(function(){
				newspendadd($("#input6").val());
				setmsg.show({sign:"success",text:"同传Men # "+$("#input6").val()+" # 添加成功",div:$("#input6")});
				$("#input6").val("");
			});
		}
		function datainit() {
			$("#input1").val(config.zimuFontSize);
			$("#input2").val(config.zimuColor);
			$("#input3").val(config.zimuBottom);
			$("#input7").val(config.zimuOpacity);
			$("#input4").val(config.deltime);
			if(config.zimuShadow != 0){
				$("#checked2").addClass("bl-switch-checked");
			}else{
				$("#checked2").removeClass("bl-switch-checked");
			}
			$("#input5").val(config.zimuShadowColor);
			if(config.IsSikiName != 0){
				$("#checked3").addClass("bl-switch-checked");
				danmuControlh2.appendTo($('.player-setting-ctnr'));
				tchminit();
			}else{
				$("#input6").val("");
				$("#tchmlist").empty();
				sikinamebool=false;
				$("#checked3").removeClass("bl-switch-checked");
				danmuControlh2.remove();
			}
			$("#input1").blur(function(){
				if($("#input1").val()!=""&&$("#input1").val()>=20&&$("#input1").val()<=50){
					config.zimuFontSize=$("#input1").val();
					reloadaConfig("zimuFontSize");
					setmsg.show({sign:"success",text:"设置成功",div:$("#input1")});
					danmudiv.css({"font-size": config.zimuFontSize+"px",});
				}else{
					$("#input1").val(config.zimuFontSize);
					setmsg.show({sign:"caution",text:"参数有误",div:$("#input1")});
				}
			});
			$("#input2").blur(function(){
				config.zimuColor=$("#input2").val();
				reloadaConfig("zimuColor");
				setmsg.show({sign:"success",text:"设置成功",div:$("#input2")});
				danmudiv.css({"color":config.zimuColor,});
			});
			$("#input3").blur(function(){
				if($("#input3").val()!=""&&$("#input3").val()>=0&&$("#input3").val()<=600){
					config.zimuBottom=$("#input3").val();
					reloadaConfig("zimuBottom");
					setmsg.show({sign:"success",text:"设置成功",div:$("#input3")});
					danmudiv.css({"bottom":config.zimuBottom+"px",});
				}else{
					$("#input3").val(config.zimuBottom);
					setmsg.show({sign:"caution",text:"参数有误",div:$("#input3")});
				}
			});
			$("#input7").blur(function(){
				if($("#input7").val()!=""&&$("#input7").val()>0&&$("#input7").val()<=100){
					config.zimuOpacity=$("#input7").val();
					reloadaConfig("zimuOpacity");
					setmsg.show({sign:"success",text:"设置成功",div:$("#input1")});
					danmudiv.css({"opacity": config.zimuOpacity*0.01,});
				}else{
					$("#input1").val(config.zimuFontSize);
					setmsg.show({sign:"caution",text:"参数有误",div:$("#input1")});
				}
			});
			$("#input4").blur(function(){
				if($("#input4").val()!=""&&$("#input4").val()>=1&&$("#input4").val()<=20){
					config.deltime=$("#input4").val();
					reloadaConfig("deltime");
					setmsg.show({sign:"success",text:"设置成功",div:$("#input4")});
				}else{
					$("#input4").val(config.deltime);
					setmsg.show({sign:"caution",text:"参数有误",div:$("#input4")});
				}
			});
			$("#checked2").click(function () {
				if(!$("#checked2").is('.bl-switch-checked')){
					config.zimuShadow = 1;
					reloadaConfig("zimuShadow");
					$("#checked2").addClass("bl-switch-checked");
					danmudiv.css({"text-shadow":"0 0 0.2em "+config.zimuShadowColor+", 0 0 0.2em "+config.zimuShadowColor,});
				}else{
					config.zimuShadow = 0;
					reloadaConfig("zimuShadow");
					$("#checked2").removeClass("bl-switch-checked");
					danmudiv.css({"text-shadow":"0 0 0",});
				}
				setmsg.show({sign:"success",text:"设置成功",div:$("#checked2")});
			});
			$("#input5").blur(function(){
				config.zimuShadowColor=$("#input5").val();
				reloadaConfig("zimuShadowColor");
				setmsg.show({sign:"success",text:"设置成功",div:$("#input5")});
				danmudiv.css({"text-shadow":"0 0 0.2em "+config.zimuShadowColor+", 0 0 0.2em "+config.zimuShadowColor,});
			});
			$("#checked3").click(function () {
				if(!$("#checked3").is('.bl-switch-checked')){
					config.IsSikiName = 1;
					reloadaConfig("IsSikiName");
					danmuControlh2.appendTo($('.player-setting-ctnr'));
					$("#checked3").addClass("bl-switch-checked");
					tchminit();
				}else{
					config.IsSikiName = 0;
					reloadaConfig("IsSikiName");
					$("#input6").val("");
					$("#tchmlist").empty();
					sikinamebool=false;
					$("#checked3").removeClass("bl-switch-checked");
					danmuControlh2.remove();
				}
				setmsg.show({sign:"success",text:"设置成功",div:$("#checked3")});
			});
		}

		function connectline(){
			f = 0;
			//获取当前房间编号
			var UR = window.top.document.location.toString();
			var arrUrl = UR.split("//");
			var start = arrUrl[1].indexOf("/");
			var relUrl = arrUrl[1].substring(start+1);//stop省略，截取从start开始到结尾的所有字符
			if(relUrl.indexOf("?") != -1){
				relUrl = relUrl.split("?")[0];
			}
			room_id=parseInt(relUrl);

			//获取你的uid
			$.ajax({
				url: 'https://api.live.bilibili.com/xlive/web-ucenter/user/get_user_info',
				type: 'GET',
				dataType: 'json',
				success: function (data) {
					//console.log(data.data);
					uid=data.data.uid;
					//console.log(uid);
				},
				xhrFields: {
					withCredentials: true // 这里设置了withCredentials
				},
			});
			//获取真实房间号
			$.ajax({
				url: '//api.live.bilibili.com/room/v1/Room/room_init?id=' + room_id,
				type: 'GET',
				dataType: 'json',
				success: function (data) {
					room_id=data.data.room_id;
				}
			});

			//获取弹幕连接和token //live.bilibili.com/blanc/21919321?liteVersion=true  https://live.bilibili.com/blanc/1?liteVersion=true   protocol
			$.ajax({
				url: '//api.live.bilibili.com/room/v1/Danmu/getConf?room_id='+room_id+'&platform=pc&player=web',
				type: 'GET',
				dataType: 'json',
				success: function (data) {
					url = data.data.host_server_list[1].host;
					port = data.data.host_server_list[1].wss_port;
					mytoken = data.data.token;
					DanmuSocket();
				},
				xhrFields: {withCredentials: true}
			})
			// 蜜汁字符转换
			function txtEncoder(str){
				var buf = new ArrayBuffer(str.length);
				var bufView = new Uint8Array(buf);
				for (var i = 0, strlen = str.length; i < strlen; i++) {
					bufView[i] = str.charCodeAt(i);
				}
				return bufView;
			}
			// 合并
			function mergeArrayBuffer(ab1, ab2) {
				var u81 = new Uint8Array(ab1),
					u82 = new Uint8Array(ab2),
					res = new Uint8Array(ab1.byteLength + ab2.byteLength);
				res.set(u81, 0);
				res.set(u82, ab1.byteLength);
				return res.buffer;
			}

			//发送心跳包
			function heartBeat() {
				var headerBuf = new ArrayBuffer(rawHeaderLen);
				var headerView = new DataView(headerBuf, 0);
				var ob="[object Object]";
				var bodyBuf = txtEncoder(ob);
				headerView.setInt32(packetOffset, rawHeaderLen + bodyBuf.byteLength);
				headerView.setInt16(headerOffset, rawHeaderLen);
				headerView.setInt16(verOffset, 1);
				headerView.setInt32(opOffset, 2);
				headerView.setInt32(seqOffset, 1);
				//console.log('发送信条');
				socket.send(mergeArrayBuffer(headerBuf, bodyBuf));
			};
			const message = new Message();

			//数据包解析 感谢https://github.com/lovelyyoshino/Bilibili-Live-API/blob/master/API.WebSocket.md
			const textEncoder = new TextEncoder('utf-8');
			const textDecoder = new TextDecoder('utf-8');

			const readInt = function(buffer,start,len){
				let result = 0
				for(let i=len - 1;i >= 0;i--){
					result += Math.pow(256,len - i - 1) * buffer[start + i]
				}
				return result
			}

			const writeInt = function(buffer,start,len,value){
				let i=0
				while(i<len){
					buffer[start + i] = value/Math.pow(256,len - i - 1)
					i++
				}
			}

			function encode(str,op){
				let data = textEncoder.encode(str);
				let packetLen = 16 + data.byteLength;
				let header = [0,0,0,0,0,16,0,1,0,0,0,op,0,0,0,1]
				writeInt(header,0,4,packetLen)
				return (new Uint8Array(header.concat(...data))).buffer
			}
			function decode(blob) {
				let buffer = new Uint8Array(blob)
				let result = {}
				result.packetLen = readInt(buffer, 0, 4)
				result.headerLen = readInt(buffer, 4, 2)
				result.ver = readInt(buffer, 6, 2)
				result.op = readInt(buffer, 8, 4)
				result.seq = readInt(buffer, 12, 4)
				if (result.op === 5) {
					result.body = []
					let offset = 0;
					while (offset < buffer.length) {
						let packetLen = readInt(buffer, offset + 0, 4)
						let headerLen = 16// readInt(buffer,offset + 4,4)
						if (result.ver == 2) {
							let data = buffer.slice(offset + headerLen, offset + packetLen);
							let newBuffer =pako.inflate(new Uint8Array(data));
							const obj = decode(newBuffer);
							const body = obj.body;
							result.body = result.body.concat(body);
						} else {
							let data = buffer.slice(offset + headerLen, offset + packetLen);
							let body = textDecoder.decode(data);
							if (body) {
								result.body.push(JSON.parse(body));
							}
						}
						offset += packetLen;
					}
				} else if (result.op === 3) {
					result.body = {
						count: readInt(buffer, 16, 4)
					};
				}
				return result;
			}

			// socket连接
			function DanmuSocket() {
				if(f>=6){
					$("#tongchuanbool").text("备用辅助已开启");
					DanmuSpare();
					return;
				}
				var ws = 'wss';
				var Id;
				socket = new WebSocket(ws + '://' + url + ':' + port + '/sub');
				socket.binaryType = 'arraybuffer';

				// Connection opened
				socket.addEventListener('open', function (event) {
					console.log('Danmu WebSocket Server Connected.');
					var token = JSON.stringify({
						'uid': uid,
						'roomid': room_id,
						'key': mytoken,
						'protover':1,
					});
					var headerBuf = new ArrayBuffer(rawHeaderLen);
					var headerView = new DataView(headerBuf, 0);
					var bodyBuf = txtEncoder(token);
					headerView.setInt32(packetOffset, rawHeaderLen + bodyBuf.byteLength);
					headerView.setInt16(headerOffset, rawHeaderLen);
					headerView.setInt16(verOffset, 1);
					headerView.setInt32(opOffset, 7);
					headerView.setInt32(seqOffset, 1);
					socket.send(mergeArrayBuffer(headerBuf, bodyBuf));
					// heartBeat();
					Id = setInterval(function () {
						heartBeat();
					}, 30*1000);
				});

				socket.addEventListener('error', function (event) {
					console.log('WebSocket 错误: ', event);
					socket.close();
					// 					clearInterval(Id);
					// 					console.log('WebSocket 重连 ');
					// 					f++;
					// 					DanmuSocket();
				});

				socket.addEventListener('close', function (event) {
					console.log('WebSocket 关闭 ');
					clearInterval(Id);
					if(config.zimuOnOff==1){
						console.log('WebSocket 重连 ');
						f++;
						DanmuSocket();
					}
				});

				// Listen for messages
				socket.addEventListener('message', function (msgEvent) {
					const packet = decode(msgEvent.data);
					switch (packet.op) {
						case 8:
							//console.log('加入房间');
							break;
						case 3:
							//console.log(`人气`);
							break;
						case 5:
							packet.body.forEach((body)=>{
								switch (body.cmd) {
									case 'DANMU_MSG':
										var danmumsg= body.info[1];
										var manName=body.info[2][1];
										var tongchuan = processMatchedTxt(danmumsg,zimuRegex,zimuJoinLetter);
										if(!config.IsSikiName){
											if(tongchuan != null && tongchuan != ""){
												message.show({
													text: tongchuan,
													duration: config.deltime*1000,
												});
											}
										}else if((sikiname.indexOf(manName)>-1)){
											if(tongchuan != null && tongchuan != ""){
												message.show({
													text: tongchuan,
													duration:config.deltime*1000,
												});
											}else{
												message.show({
													text: danmumsg,
													duration:config.deltime*1000,
												});
											}
										}
										//console.log(`${body.info[2][1]}: ${body.info[1]}`);
										break;
									case 'SEND_GIFT':
										//console.log(`${body.data.uname} ${body.data.action} ${body.data.num} 个 ${body.data.giftName}`);
										break;
									case 'WELCOME':
										//console.log(`欢迎 ${body.data.uname}`);
										break;
										// 此处省略很多其他通知类型
									default:
										//console.log(body);
								}
							})
							break;
					}
				});
			}
			function DanmuSpare() {
				var tt = "";
				var intervalID = setInterval(function () {
					var danmukulist = $("#chat-items").children().last();
					if(!(tt!=""&&tt==danmukulist.attr("data-uid"))){
						tt=""+danmukulist.attr("data-uid");
						var danmumsg = ""+danmukulist.attr("data-danmaku");
						var tongchuan = processMatchedTxt(danmumsg,zimuRegex,zimuJoinLetter);
						if(!config.IsSikiName){
							if(tongchuan != null && tongchuan != ""){
								message.show({
									text: tongchuan,
									duration: config.deltime*1000,
								});
							}
						}else if((sikiname.indexOf(manName)>-1)){
							if(tongchuan != null && tongchuan != ""){
								message.show({
									text: tongchuan,
									duration:config.deltime*1000,
								});
							}else{
								message.show({
									text: danmumsg,
									duration:config.deltime*1000,
								});
							}
						}
					}
					if(config.zimuOnOff==0){
						clearInterval(intervalID);
						return;
					}
				},10);
			}

		}

		function init() {
			if(config.zimuOnOff != 0){
				$("#checked1").addClass("bl-switch-checked");
				danmuControlh1.appendTo($('.player-setting-ctnr'));
				if(f<6)
					$("#tongchuanbool").text("辅助已开启");
				else
					$("#tongchuanbool").text("备用辅助已开启");
				datainit();
			}else
			{
				$("#checked1").removeClass("bl-switch-checked");
				$("#tongchuanbool").text("辅助未开启");
				if(config.IsSikiName == 1){
					$("#input6").val("");
					$("#tchmlist").empty();
					sikinamebool=false;
					danmuControlh2.remove()
				}
				danmuControlh1.remove();
				if(socket!=null)
					socket.close();
			}
			$("#checked1").click(function () {
				if(!$("#checked1").is('.bl-switch-checked')){
					config.zimuOnOff=1;
					reloadaConfig("zimuOnOff");
					$("#checked1").addClass("bl-switch-checked");
					danmuControlh1.appendTo($('.player-setting-ctnr'));
					$("#tongchuanbool").text("辅助已开启");
					datainit();
					connectline();
				}else{
					config.zimuOnOff=0;
					reloadaConfig("zimuOnOff");
					$("#checked1").removeClass("bl-switch-checked");
					$("#tongchuanbool").text("辅助未开启");
					if(config.IsSikiName == 1){
						$("#input6").val("");
						$("#tchmlist").empty();
						sikinamebool=false;
						danmuControlh2.remove()
					}
					danmuControlh1.remove();
					socket.close();
				}
				setmsg.show({sign:"success",text:"设置成功",div:$("#checked1")});
			});
		}

		$("#zimuSettings").click(function () {
			if(!zimuSetting.is('.active')){
				zimuSetting.addClass("active");
				danmuControl.appendTo($('.control-panel-ctnr'));
				setTimeout(() =>{$("#danmuControl1").removeClass("v-enter-to");setTimeout(() =>{$("#danmuControl1").removeClass("a-scale-in-ease");},200);},200);
				init();
				$("#danmuControl1").mouseleave(function(){
					zimuSetting.removeClass("active");
					$("#danmuControl1").addClass("a-scale-out");
					$("#danmuControl1").addClass("v-leave-to");
					setTimeout(() =>{
						$("#danmuControl1").removeClass("v-leave-to");
						$("#danmuControl1").removeClass("a-scale-out");
						$("#danmuControl1").addClass("a-scale-in-ease");
						$("#danmuControl1").addClass("v-enter-to");
						if(config.zimuOnOff == 1){
							if(config.IsSikiName == 1){
								$("#input6").val("");
								$("#tchmlist").empty();
								sikinamebool=false;
								danmuControlh2.remove()
							}
						}
						danmuControl.remove();
					},100);
				});
			}else{
				zimuSetting.removeClass("active");
				$("#danmuControl1").addClass("a-scale-out");
				$("#danmuControl1").addClass("v-leave-to");
				setTimeout(() =>{
					$("#danmuControl1").removeClass("v-leave-to");
					$("#danmuControl1").removeClass("a-scale-out");
					$("#danmuControl1").addClass("a-scale-in-ease");
					$("#danmuControl1").addClass("v-enter-to");
					if(config.zimuOnOff == 1){
							if(config.IsSikiName == 1){
								$("#input6").val("");
								$("#tchmlist").empty();
								sikinamebool=false;
								danmuControlh2.remove()
							}
						}
					danmuControl.remove();
				},100);
			}
		});



		// 导入css

		var style = document.createElement("style");
		style.type = "text/css";
		var text = document.createTextNode(`#danmu .message {
transition: height 0.2s ease-in-out, margin 0.2s ease-in-out;
}

#danmu .message .text {
text-align:center;
font-weight: bold;
pointer-events:none;
}

@keyframes message-move-in {
0% {
opacity: 0;
transform: translateY(100%);
}
100% {
opacity: 1;
transform: translateY(0);
}
}

#danmu .message.move-in {
animation: message-move-in 0.3s ease-in-out;
}


@keyframes message-move-out {
0% {
opacity: 1;
transform: translateY(0);
}
100% {
opacity: 0;
transform: translateY(-100%);
}
}
#danmu .message.move-out {
animation: message-move-out 0.3s ease-in-out;
animation-fill-mode: forwards;
}`
										  );
		style.appendChild(text);
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(style);

	}, 100);
})();
