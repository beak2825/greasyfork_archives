// ==UserScript==
// @name         AT2O:連携AgarTool⇒OGAR
// @name:ja      AT2O:連携AgarTool⇒OGAR
// @name:en      AT2O:Agar link OtoT
// @version      0.10
// @namespace    http://tampermonkey.net/tannichi-at2o
// @description      Agar Tool 上から OGARio へ情報連携します
// @description:ja   Agar Tool 上から OGARio へ情報連携します
// @description:en   link to OGARio on Agar Tool
// @author       tannichi
// @match        http://agar.io/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/40419/AT2O%3A%E9%80%A3%E6%90%BAAgarTool%E2%87%92OGAR.user.js
// @updateURL https://update.greasyfork.org/scripts/40419/AT2O%3A%E9%80%A3%E6%90%BAAgarTool%E2%87%92OGAR.meta.js
// ==/UserScript==
//// @grant GM_setValue
//// @grant GM_getValue

(function() {
	'use strict';
	var global = window.unsafeWindow || window;
	var my = {
		"name": "Agar TtoO",
		"log": function(msg){ console.log(this.name + ":"+ msg); },
		"tool_symbol": "?"
	};
	var stat = {
		"lib_ogar_url": "http://tannichi.web.fc2.com/lib/lib-ogar_0.7.js",
		// ---- AgarTool settings  -----
		//"minimapNickFont": "700 10px Ubuntu",
		"minimapNickColor": "#ffffff",
		"minimapNickStrokeColor": "#000000",
		"minimapNickStrokeSize": 2,
		//"minimapTeammatesColor": "#F03A17",
		"chatColorNorm": "#FFFF00",
		"chatColorCommand": "#FF4400",
		// -----  for OGARio  ----
		"CustomSkinRe": /^https?:\/\/i\.(?:imgur|hizliresim)\.com\/\w{6,8}\.(?:jpg|jpeg|png)\??\d*$/i,
		"CustomSkinIllegalUrl": "http://illustcut.com/box/mark/iroiro14/mark01_30.png",
        // -----  style  -----
		"darkThemeHudCss": {"color": "#C0C0C0"},
		"darkThemeControllerCss": {"color": "#E0E0E0"},
        "messageBoxCss": [{"bottom":"13px"},{"bottom": "40%"}],
		"chatTableSlimCss": [{"border-spacing":"0 8px"},{"border-spacing":"0 2px"}],
		"nickWrap_css": {"white-space":"normal","overflow":"auto"},
		// -----  other  -----
		"pi2": 0x2 * Math.PI,
		"keyCodeEnter": 13, // Enter
		"keyCodeA": 65, // 'A'
		"keyCodeR": 82, // 'R'
		"keyCodeS": 83, // 'S'
	};
	var cfg= {}, cfg_org = {
		"user_show": true,
		"minimap_show": true,
		"ogar_prefix": "?",
		"ogar_color": "#8C81C7",
		"update_interval": 1000,
		"tgar_prefix": "?",
		"tgar_user": true,
		"ogar_skinURL": "",
		"chat_close": false,
		"chat_unpause": true,
		"chat_vcenter": false,
		"chat_alt": true,
		"chat_ctrlalt": true,
		"chat_ctrl": true,
		"chat_slim": false,
		"chat_nickWrap": false,
		"chat_emoticon": true,
		"chat_image": true,
		"chat_video": false,
	};
	function pre_loop(){
		// この時点では jQuery は使えない
		if(! document.getElementById("chatMessagesContainer")
				|| ! document.getElementById("settingsButton")
				|| ! global.AgarTool
				|| ! global.AgarTool.settings
				|| ! global.AgarTool.settings.checkboxes){
			my.pre_loop_timeout = (my.pre_loop_timeout || 1000) + 1000;
			setTimeout(pre_loop, my.pre_loop_timeout);
			my.log("wait for AgarTool load");
			return;
		}
		// 念のため、もう１wait入れる
		setTimeout(initialize, 1000);
		//loadScript(stat.lib_ogar_url, initialize);
	}
	pre_loop();
	
	function initialize(){
		//$.extend(cfg, cfg_org, JSON.parse(GM_getValue("config", '{}')));
		$.extend(cfg, cfg_org, JSON.parse(my.storage_getValue("config",'{}')));
		global.at2o = {my:my, stat:stat, cfg:cfg};
		var local_style = '';
		local_style += '#at2o-hud {';
		local_style +=     ' font-size: 80%; pointer-events: auto;';
		local_style += '}';
		local_style += '#at2o-hud * {';
		local_style +=     ' user-select: auto!important;';
		local_style += '}';
		local_style += '#at2o-cfg-dlg {';
		//local_style +=     ' border-radius:0; font-size: 80%; padding: 2px 10px; position: fixed;';
		//local_style +=     ' pointer-events: auto; background-color: rgba(32,32,32,0.4); color: #ffffff;';
		//local_style +=     ' overflow: hidden;';
		local_style += '}';
		local_style += '#at2o-cfg-dlg * {';
		local_style +=     ' width: auto; user-select: auto!important; pointer-events: auto;';
		//local_style +=     ' position: relative; float: initial;';
		//local_style +=     ' display: run-in;'; // NG
		local_style += '}';
		local_style += '#at2o-cfg-dlg input {';
		//local_style +=     ' background-color: rgba(0,0,0,0.4); color: #ffffff;';
		local_style += '}';
		local_style += '.ogar-emoticon {';
		local_style +=     ' width: 1.25em; height: auto; vertical-align: middle;';
		local_style += '}';
		local_style += '.ogar-image {';
		local_style +=     ' width: 10em; height: border:none; vertical-align: middle;display: block;';
		local_style += '}';
		local_style += '.ogar-video {';
		local_style +=     ' width: 10em; height: border:none; vertical-align: middle; display: block;';
		local_style += '}';
		local_style += '.extract span {';
		local_style +=     ' display: none;';
		local_style += '}';
		$("head").append('<style>\n'+ local_style +'\n</style>');
		$("#messageTempContainer").append(''+
			'<div id="at2o-hud">'+
				'<div id="at2o-top5" style="padding-left: 1em;"></div>'+
			'</div>');
		$("#connect").after(''+
			'<div id="at2o-controller">at2o:'+
			  '<span id="at2o-capture">?</span>'+
			  '<span id="at2o-config">?</span>'+
			'</div>').css('width', '30%');
		// ダークテーマ
		try{
			if(global.AgarTool.settings.checkboxes.darkTheme){
				$("#at2o-hud").css(stat.darkThemeHudCss);
				//$("#at2o-controller").css(stat.darkThemeControllerCss);
			}
		}catch(e){}
		// マウスクリックが伝搬しないようにする
		$("#at2o-controller").mousedown(function(event){ return false;});
		$("#at2o-capture").click(function(event){
			my.log("capture_click");
			stat.capture = ! stat.capture;
			if(stat.capture){
				$("#at2o-capture").text('⏳');
				my.capture_start();
			}else{
				$("#at2o-capture").text('?');
				my.capture_end();
			}
		});
		$("#at2o-config").click(my.config);
		my.config_apply();
		// --- 再接続 ---
		//$("#settingsButton").after(''+	// $("#connect").before
		$("#server").after(''+
			'<button id="at2o-reconnect" class="btn btn-primary"'+
			' style="float:left;">?</button>'+
			'').css('width', '35%');
        $("#at2o-reconnect").click(function(event){
			my.log("reconnect_click");
	        if(global.MC && global.MC.reconnect){
				global.MC.reconnect();
			}
		});
		// --- chat close ---
		if(cfg.chat_close){
			$("#message-menu").append('<a href="#" id="at2o-chat-close" style="float:right;">X</a>');
			$("#at2o-chat-close").click(function(){
				my.chatClose();
			});
		}
		//$("#enterChatMsg").keydown(function(event){
		stat.initialized = true;
		//let chatElem = $("#enterChatMsg").get(0);
		//chatElem.addEventListener('keydown', function(event){
		//Element.prototype.addEventListener.call(chatElem, 'keydown', function(event){
		//document.addEventListener('keydown', function(event){
		$(".emojionearea-button").before(''+
			'<div style="position: absolute;right: 30px;top:4px;">'+
				'<span id="at2o-chat-close" title="emergency close">?</span>'+
				'&nbsp;'+
				'<span id="at2o-chat-send" title="Send to OGAR">?</span>'+
			'</div>');
		$("#at2o-chat-send").mousedown(function(event){
			my.chatSend({"clear": true});
		});
		$("#at2o-chat-close").mousedown(function(event){
			my.chatClose();
			return my.chatCancel(event);
		});
		// 試験
		//$(document).mousedown(function(ev){
		//	my.log("test mousedown");
		//	keyDownUp(stat.keyCodeS);
		//});
	}
	my.capture_start = function(){
		// まだならば、チャット送信ボタンを追加
		if($("#at2o-minimap").length){
			//$("#at2o-message").show(); // .prop('disabled', false);
			$("#at2o-minimap").show();
		}else{
			my.capture_init();
		}
		// 接続
		let tgar_prefix = (cfg.ogar_skinURL ? "" : cfg.tgar_prefix);
		stat.tag = $('#tag').val();
		stat.nick = tgar_prefix + $('#nick').val();
		stat.serverToken = $('#server').val();
		stat.skinURL = cfg.ogar_skinURL;
        my.connect();
		stat.update_timerid = setInterval(my.update, cfg.update_interval);
	};
	my.capture_end = function(){
		//$("#at2o-message").hide(); // .prop('disabled', true);
		$('#at2o-top5').html('');
		$("#at2o-minimap").hide();
        my.disconnect();
		clearInterval(stat.update_timerid);
		stat.update_timerid = null;
	};
	my.capture_init = function(){
		//$("#message-menu").append('<a href="#" id="at2o-message" style="float:right;">'+ my.tool_symbol +'</a>');
		//$("#at2o-message").click(my.chatSend);
		// minimap
	//	var minimap = $("#minimap");
	//	var minimapWidth = minimap.attr('width');
	//	var minimapHeight = minimap.attr('height');
	//	minimap.before('<canvas id="at2o-minimap"'+
	//		' style="position: absolute;bottom: 0px;right: 0px;"'+
	//		' width="'+ minimapWidth +'" height="'+ minimapHeight +'">');
	};
	my.update = function(){
		var tgarAlive = my.tgarIsAlive();
		if(tgarAlive != stat.alive){
			my.ogarAlive(tgarAlive);
		}
		if(stat.alive){
			my.ogarReposition();
		}
		my.tgarMinimapUpdate();
	};
	
	// -----  設定  -----
	my.config = function(){
		my.log("config_click2");
		if(!($('#at2o-cfg-start').length)){
			my.config_init();
		}
		my.cfg_load(cfg);
		//$("#at2o-cfg-dlg").show();
		//$("#overlays").show();
	};
	my.config_init = function(){
		//$("#overlays").append('<div id="at2o-cfg-dlg"'+
		$("#at2o-controller").after(''+
			'<hr id="at2o-cfg-start" />'+ my.name+ '<br/>'+
			''+
			'&nbsp;&nbsp;&nbsp;更新頻度[ミリ秒]:<input type="text" data-at2o-config="update_interval" style="width:6em;"/>'+
			'<br/>OGARio から取得'+
			'<br/>&nbsp;<label><input type="checkbox" data-at2o-config="user_show"/>user list</label>'+
			'<br/>&nbsp;<label><input type="checkbox" data-at2o-config="minimap_show"/>minimap</label>'+
			  '&nbsp;前置:<input type="text" data-at2o-config="ogar_prefix" style="width:4em;"/>'+
			  '&nbsp;&nbsp;色:<input type="text" data-at2o-config="ogar_color" style="width:6em;"/>'+
			//    '<span class="input-group-addon"><i id="tgar_color" style="background-color: rgb(0, 0, 0);"></i></span>'+
			'<br/>OGARio へ送付'+
			'<br/>&nbsp;<label><input type="checkbox" data-at2o-config="tgar_user"/>user info</label>'+
			  '&nbsp;前置:<input type="text" data-at2o-config="tgar_prefix" style="width:4em;"/>'+
			  '<br/>&nbsp;skin:<input type="text" class="at2o-skin-url" data-at2o-config="ogar_skinURL" style="width:20em;"/>'+
			'<br/>Chat option'+
			  '<br/>&nbsp;<label><input type="checkbox" data-at2o-config="chat_close"/>close</label>'+
			    '&nbsp;<label><input type="checkbox" data-at2o-config="chat_unpause"/>unpause</label>'+
			    '&nbsp;<label><input type="checkbox" data-at2o-config="chat_vcenter"/>vcenter</label>'+
			    '&nbsp;<label><input type="checkbox" data-at2o-config="chat_slim"/>slim</label>'+
			    '&nbsp;<label><input type="checkbox" data-at2o-config="chat_nickWrap"/>nick wrap</label>'+
			'<br/>&nbsp;<label><input type="checkbox" data-at2o-config="chat_emoticon"/>emoticon</label>'+
			  '&nbsp;<label><input type="checkbox" data-at2o-config="chat_image"/>image</label>'+
			  '&nbsp;<label><input type="checkbox" data-at2o-config="chat_video"/>video</label>'+
			'<br/>&nbsp;<label><input type="checkbox" data-at2o-config="chat_alt"/>Alt→T</label>'+
			  '&nbsp;<label><input type="checkbox" data-at2o-config="chat_ctrlalt"/>Ctrl+Alt→O+T</label>'+
			  '&nbsp;<label><input type="checkbox" data-at2o-config="chat_ctrl"/>Ctrl→Close</label>'+
			'<br/>&nbsp;&nbsp;※一部の変更は再起動後に反映されます'+
			''+
			'<br/>'+
			  '&nbsp;<span id="at2o-cfg-default" class="btn btn-primary">DEFAULT</span>'+
			  '&nbsp;<span id="at2o-cfg-ok" class="btn btn-success">OK</span>'+
			  '&nbsp;<span id="at2o-cfg-cancel" class="btn btn-danger">CANCEL</span>'+
			''+
		    '<hr id="at2o-cfg-end" />');
		//$("#at2o-cfg-dlg").mousedown(function(event){ return false;});
		$("#at2o-cfg-default").click(function(){
			my.cfg_load(cfg_org);
		});
		$("#at2o-cfg-ok").click(function(){
			cfg = my.cfg_save();
			//GM_setValue("config", JSON.stringify(cfg));
			my.storage_setValue("config", JSON.stringify(cfg));
			my.config_cancel();
			my.config_apply();
		});
		$("#at2o-cfg-cancel").click(function(){
			my.config_cancel();
		});
		$("#overlays").append('<img id="ogso-skin-img"'+
			'  style="width:256px; height:256x; position:absolute; bottom:50px; right:50px; display: none;"/>');
		$(".at2o-skin-url").mouseover(function(event){
			var img_url = event.target.value;
			if(! img_url){
				$("#ogso-skin-img").hide();
			}else{
				if(! stat.CustomSkinRe.test(img_url)){
					img_url = stat.CustomSkinIllegalUrl;
				}
				$("#ogso-skin-img").attr("src", img_url);
				$("#ogso-skin-img").show();
			}
		});
		$(".at2o-skin-url").mouseout(function(event){
			$("#ogso-skin-img").hide();
		});
		my.config_cancel = function(){
			//$("#overlays").hide();
			//$("#at2o-cfg-dlg").hide();
			let elem = $("#at2o-cfg-start").get(0);
			let elemParent = elem.parentNode;
			let delList = [elem];
			for(;;){
				elem = elem.nextSibling;
				if(!elem){
					return;
				}
				delList.push(elem);
				if(elem.id == "at2o-cfg-end"){
					delList.forEach(function(elemDel){
						elemParent.removeChild(elemDel);
					});
					return;
				}
			}
		};
		//$("#tgar_color").colorpicker({'format': 'hex'}).on('changeColor.colorpicker', function(event){
		//    var id = event.target.id;
		//    $('[data-at2o-config="'+ id +'"]').val(event.color.toHex());
		//    event.target.style.backgroundColor = event.color.toRGB();
		//});
	};
	my.config_apply = function(){
		$(".enterChatMsg").css(stat.messageBoxCss[cfg.chat_vcenter ? 1: 0]);
		$("#messageTableComplete, #messageTableTemp")
			.css(stat.chatTableSlimCss[cfg.chat_slim ? 1 : 0]);
		if(cfg.chat_slim || cfg.chat_nickWrap){
			my.chatObserver_start();
		}else{
			my.chatObserver_stop();
		}
	};
	
	// -----  チャット  -----
	my.document_keydown = function(event){
		if(! stat.initialized){
			return false;
		}
		var modify = (event.altKey ? "a" : "")+
			(event.ctrlKey ? "c" : "")+
			(event.metaKey ? "m" : "")+
			(event.shiftKey ? "s" : "");
		//my.log("keydown which="+ event.which +", modify="+ modify);
		if(event.which != stat.keyCodeEnter || !global.writeChatMessage){
			return;
		}
		if(event.keyCode === stat.keyCodeEnter){
			if(modify === "a" && cfg.chat_alt){
				my.chatSend();
				return my.chatCancel(event);
			}else if(modify === "ac" && cfg.chat_ctrlalt){
				//my.chatSend({"tgar":true});
				//return false;
				my.chatSend({"noClose": true});
				return;
			}else if(modify === "c" && cfg.chat_ctrl){
				my.chatClose();
				return my.chatCancel(event);
			}
		}
		return; // 他のハンドラに処理を渡す
	};
	document.addEventListener('keydown', my.document_keydown, true);
	my.chatSend = function(flg_){
		var flg = flg_ || {};
		if(! my.isConnected){
			//global.toastr.error("at2o: not connected");
			return;
		}
		//var msg = $("#enterChatMsg").val();
		var msg = global.emojiHandler[0].emojioneArea.getText();
		if(msg.length){
			stat.ogar.chatSend(msg);
			//if(flg.tgar){
			//	keyDownUp(stat.keyCodeEnter);
			//}else{
			//$("#enterChatMsg").hide();
			//}
			if(flg.clear){
				global.emojiHandler[0].emojioneArea.setText("");
			}
		}
		if(! flg.noClose){
			$("#chatInputHolder").hide();
		}
	};
	my.chatClose = function(){
		//$("#enterChatMsg").css("display", "none");
		$("#chatInputHolder").hide();
		if(cfg.chat_unpause && global.AgarTool.stopMovement){ // PAUSE 中なら解除する
			//keyDownUp(stat.keyCodeS);
			global.AgarTool.stopMovement = false;
		}
	};
	my.chatCancel = function(event){
		global.emojiHandler[0].emojioneArea.setText("");
		event.preventDefault();
		event.stopPropagation(); // 何故これが必要なのか不明
		return false;
	};
	my.chatObserver_start = function(){
		if(stat.obs_chat){
			return;
		}
		stat.obs_chat = new MutationObserver((mutations) => {
			my.log("hist changed");
			mutations.forEach((mutation) => {
				for(let node of mutation.addedNodes){
					if(cfg.chat_slim){
						$(node).css('height', '');
					}
					if(cfg.chat_nickWrap){
						$(node).find(".playerNameInMsg").css(stat.nickWrap_css);
					}
				}
				//$(mutation.target).children("tr").css('height', '');
			});
		});
		$("#messageTableComplete, #messageTableTemp")
			.each(function(){
			var table = this;
			stat.obs_chat.observe(table, {"childList": true});
			do_observe();
			function do_observe(){
				if(table.tBodies.length == 0){	// 未初期化
					setTimeout(do_observe, 5000);
				}else{
					let tbody = table.tBodies[0];
					stat.obs_chat.observe(tbody, {"childList": true});
					if(cfg.chat_slim){
						$(tbody).children("tr").css('height', '');
					}
					if(cfg.chat_nickWrap){
						$(tbody).find(".playerNameInMsg").css(stat.nickWrap_css);
					}
				}
			}
		});
	};
	my.chatObserver_stop = function(){
		if(stat.obs_chat){
			stat.obs_chat.disconnect();
			delete stat.obs_chat;
		}
	};
	
	// =====  OGARio 通信処理/接続  =====
    my.connect = function(){
		if(! global.lib_ogar){
			return loadScript(stat.lib_ogar_url, my.connect);
		}
        my.disconnect();
		let opt = {
			"tag": stat.tag,
			"nick": stat.nick,
			"serverToken": stat.serverToken,
			"skinURL": stat.skinURL,
		};
		stat.ogar = global.lib_ogar.create(opt);
		stat.ogar.onchat = my.onchat;
		stat.ogar.onconnect = my.onconnect;
		stat.ogar.ondisconnect = my.ondisconnect;
    };
    my.disconnect = function(){
		if(stat.connected && stat.alive){
			my.ogarAlive(false);
		}
		if(stat.ogar){
			stat.ogar.detach();
			delete stat.ogar;
		}
    };
	my.isConnected = function(){
		return	stat.ogar && stat.ogar.isConnected();
	};
	// =====  Agar Tool 通信処理/処理  =====
    my.onconnect = function(tgar){
		$("#at2o-capture").text('?');
		stat.connected = true;
	};
    my.ondisconnect = function(tgar){
		$("#at2o-capture").text('⚠');
		delete stat.ogar;
		stat.connected = false;
	};
	my.ogarAlive = function(alive){
		stat.alive = alive;
		if(cfg.tgar_user){
			//my.log("alive -> "+ stat.alive +" name="+ cfg.ogar_prefix + stat.nick);
			if(stat.alive){
			//	stat.alive = my.sendMinimapServerCommand({
			//		name: "alive",
			//		playerName: cfg.ogar_prefix + stat.nick
			//	});
			//	//my.log("alive >>"+ stat.alive);
			}else{
			//	my.sendMinimapServerCommand({
			//		name: "dead"
			//	});
				stat.ogar.sendPlayerPosition(0, 0, 0);
			}
		}
	};
	my.ogarReposition = function(){
		stat.ogar.sendPlayerPosition(AgarTool.realPlayerX, AgarTool.realPlayerY, 1);
	};

    // =====  OGARio処理  ======
    my.onchat = function(ev){
		stat.chatIdx = (stat.chatIdx ? stat.chatIdx + 1 : 1);
		let chatID = "at2o-chat-"+ stat.chatIdx;
		let chatBorderColor = (ev.isCommand ? stat.chatColorCommand : stat.chatColorNorm);
		let trStyle = 'color:#FFF;background-color:rgba(0,0,0,0.4);';
		if(! cfg.chat_slim){
			trStyle = 'height:40px;'+ trStyle;
		}
		let msg = stat.ogar.chatParse(ev.message, cfg);
		let htmlTd = '<td style="padding-left:8px;padding-right:8px">'
			+ '<b><span class="playerNameInMsg">' + escapeHtml(ev.nick)
			+ '</span></b></td>'
			+ '<td style="border-left: solid '+ chatBorderColor
				+';padding-left: 8px;padding-right:8px;'
				+'vertical-align:middle;width:260px;max-width:260px;'
				+'word-wrap: break-word;">'
				+ msg + '</td>';
		let htmlTmp = '<tr id="' + chatID + '" style="'+ trStyle +'">'
			+ htmlTd +'</tr>';
		let htmlCmp = '<tr style="'+ trStyle +'">'
			+ htmlTd +'</tr>';
		$("#messageTableTemp").append(htmlTmp);
		$("#messageTableComplete").append(htmlCmp);
		var scrollTop = $("#messageCompleteContainer")[0].scrollHeight
			- $("#messageCompleteContainer").height();
		$("#messageCompleteContainer")[0].scrollTop = scrollTop;
		$("#messageCompleteContainer").perfectScrollbar("update");
		setTimeout(function(){
			$("#" + chatID).fadeOut(100, function(){
				$("#" + chatID).remove();
			});
		}, 5e3);
    };
    my.tgarMinimapUpdate = function(){
		let ogar = stat.ogar;
		if(! ogar){
			return;
		}
		let minimap_elem = stat.minimap_elem;
		if(! minimap_elem){
			const minimap = $("#minimap");
			const minimapWidth = minimap.attr('width');
			const minimapHeight = minimap.attr('height');
			const minimapCss = minimap.css(["bottom", "right"]);
			minimap.before('<canvas id="at2o-minimap"'+
				' style="position: absolute;"'+
				' width="10" height="10">');
			minimap_elem = stat.minimap_elem
				= document.getElementById("at2o-minimap");
		}
		const unitPx = global.lastZoomOffset;
		const minimapViewSize = 300 * unitPx;
		const minimapMargin = 80 * unitPx;
		const minimapShellSize = minimapViewSize + minimapMargin;
		const minimapMulti = minimapViewSize / global.AgarTool.mapSize;
		const mapOffset = global.AgarTool.mapOffset;
		if(unitPx != stat.last_unitPx){	// サイズ変更
			stat.last_unitPx = unitPx;
			minimap_elem.width = minimapShellSize;
			minimap_elem.height = minimapShellSize;
			minimap_elem.style.bottom = -25 * unitPx + 'px';
			minimap_elem.style.right = -25 * unitPx + 'px';
		}
		var ctx = minimap_elem.getContext('2d');
		ctx.clearRect(0, 0, minimapShellSize, minimapShellSize);
		ctx.save();
		ctx.translate(minimapMargin / 2, minimapMargin / 2);
		const mapOffsetT = -10;
		//// --- debug ---
		//const lt = (-mapOffset + mapOffset) * minimapMulti;
		//const mm = (0          + mapOffset) * minimapMulti;
		//const rb = ( mapOffset + mapOffset) * minimapMulti;
		//ctx.rect(lt, lt, rb, rb);
		//ctx.strokeStyle = "red";
		//ctx.lineWidth = 1;
		//ctx.stroke();
		//ctx.beginPath();
		//ctx.rect(lt, lt, mm, mm);
		//ctx.strokeStyle = "blue";
		//ctx.lineWidth = 1;
		//ctx.stroke();
		// --- debug ---
		//ctx.font = stat.minimapNickFont;
		ctx.font = "700 "+ (15 * unitPx) + "px Ubuntu";
		var user_txt = '';
		var sep = '';
		let players = ogar.getPlayerList();
		if(players.length === 0){
			user_txt = "no ogar user";
		}
		for(let player; (player = players.shift()); ){
			user_txt += sep + player.mass +" "+ escapeHtml(player.nick);
			sep = '<br/>';
			if(cfg.minimap_show){
				var name = cfg.ogar_prefix + player.nick;
				var mapX = (player.x + mapOffset) * minimapMulti;
				var mapY = (player.y + mapOffset) * minimapMulti;
				ctx.textAlign = 'center';
				ctx.lineWidth = stat.minimapNickStrokeSize;
				ctx.strokeStyle = stat.minimapNickStrokeColor;
				ctx.strokeText(name, mapX, mapY + mapOffsetT);
				ctx.fillStyle = cfg.ogar_color;
				ctx.fillText(name, mapX, mapY + mapOffsetT);
				ctx.beginPath();
				ctx.arc(mapX, mapY, 6 * unitPx, 0x0, stat.pi2, !0x1);
				ctx.closePath();
				ctx.fillStyle = player.color;
				ctx.fill();
			}
		}
		ctx.restore();
		if(cfg.user_show){
			$('#at2o-top5').html(user_txt);
		}
	};
	// --- for Agar Tool ----
	my.tgarIsAlive = function(){
		return global.AgarTool ? global.AgarTool.isAlive : false;
	};

	// =====  その他処理  ======
	my.cfg_save = function(){
		var cfg_new = {};
		$('[data-at2o-config]').each(function(){
			var elem = $(this);
			var type = elem.prop('type');
			var name = elem.attr('data-at2o-config');
			var value;
			if(type === "checkbox"){
				value = elem.prop('checked');
			}else{
				value = $(this).val();
			}
			cfg_new[name] = value;
		});
		return cfg_new;
	};
	my.cfg_load = function(cfg_new){
		$('[data-at2o-config]').each(function(){
			var elem = $(this);
			var type = elem.prop('type');
			var name = elem.attr('data-at2o-config');
			if(cfg_new.hasOwnProperty(name)){
				var value = cfg_new[name];
				if(type === "checkbox"){
					elem.prop('checked', value);
				}else{
					$(this).val(value);
				}
			}
		});
	};
	my.storage_getValue = function(name, defval_){
		return	global.localStorage[my.name +"_"+ name] || defval_;
	};
	my.storage_setValue = function(name, value){
		global.localStorage[my.name +"_"+ name] = value;
	};

	function keyDownUp(keyCode){
		$(document).trigger(jQuery.Event('keydown',{ "keyCode": keyCode, "which": keyCode } ));
		$(document).trigger(jQuery.Event('keyup',{ "keyCode": keyCode, "which": keyCode } ));
		//$(document).trigger('keydown',{"keyCode":keyCode, "which":keyCode});
		//$(document).trigger('keyup',{"keyCode":keyCode, "which":keyCode});
	}
	function loadScript(url, callback){
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;
		if(typeof callback !== 'undefined'){
			script.onload = callback;
		}
		document.head.appendChild(script);
	}
	function escapeHtml(e) {
		return e.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}
})();
