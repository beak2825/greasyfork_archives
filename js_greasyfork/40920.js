// ==UserScript==
// @name	ANWH:Agar通知Webhooks
// @name:ja	ANWH:Agar通知Webhooks
// @name:en	ANWH:Agar info⇒Webhooks
// @version	0.2
// @namespace	http://tampermonkey.net/tannichi-anwh
// @description		Agar サーバー情報を Webhooks(例えばDiscord) に通知します
// @description:ja	Agar サーバー情報を Webhooks(例えばDiscord) に通知します
// @description:en	notify Agar-server-info to Webhooks(e.g.Discord)
// @author	tannichi
// @match	http://agar.io/*
// @match	https://www.google.co.jp/uDV1b4P4
// @require	http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js
// @grant	unsafeWindow
// @grant	GM_xmlhttpRequest
// @grant	GM_setValue
// @grant	GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/40920/ANWH%3AAgar%E9%80%9A%E7%9F%A5Webhooks.user.js
// @updateURL https://update.greasyfork.org/scripts/40920/ANWH%3AAgar%E9%80%9A%E7%9F%A5Webhooks.meta.js
// ==/UserScript==

(function() {
    'use strict';
	const global = window.unsafeWindow || window;
	let my = {
		"name": "AgarNoticeWebhooks",
		"id": "anwh",
		"log": function(msg){ console.log(this.name + ":"+ msg); }
	};
    let stat = {
		"prof_num": 2,
		"config_url": "https://www.google.co.jp/uDV1b4P4",
		"symbol_empty": "?",
		"symbol_done": "?",
	};
    let cfg = {}, cfg_org = {
		"p1_use": true,
		"p1_msg": "@everyone come hear!",
	};

	// ===== 初期処理 ====
    function initialize(){
        global[my.id] = {my:my, stat:stat, cfg:cfg};
        var local_style = '';
        local_style += '#anwh-cfg-dlg {';
        //local_style +=     ' border-radius:0; font-size: 80%; padding: 2px 10px; position: fixed;';
        //local_style +=     ' pointer-events: auto; background-color: rgba(32,32,32,0.4); color: #ffffff;';
        //local_style +=     ' overflow: hidden;';
        local_style += '}';
        local_style += '#anwh-dialog input, #anwh-dialog label {';
        local_style +=     ' width: auto; user-select: auto!important; pointer-events: auto;';
		local_style +=     ' position: relative; float: initial;';
		local_style +=     ' color: initial; background-color: initial; border: initial;';
		//local_style +=     ' display: run-in;'; // NG
		local_style += '}';
        local_style += '#anwh-dialog input[type="text"] {';
		local_style +=     ' border: solid;';
		local_style += '}';
		$("head").append('<style>\n'+ local_style +'\n</style>');
		// --- コントローラーの挿入先を探す  ----
		let htmlSet = null;
		if($("#settingsButton").length){ // orginal+ AgarTool
			htmlSet = function(html){
				$("#settingsButton").before(html);
			};
		}else if($(".btn-play").length){ // OGARio
			htmlSet = function(html){
				$(".btn-play").before(html);
			};
		}else{ // unknown
			htmlSet = function(html){
				$("#nick")[0].after(html);
			};
		}
		let html = '';
		html += '<div id="anwh-controller">';
		html +=  '<span title="Agar Notice Webhooks">anwh:</span>';
		html +=  '<span id="anwh-notice">?</span>';
		html +=  '<span id="anwh-config">?</span>';
		html += '</div>';
		htmlSet(html);
		$("#anwh-notice").click(function(event){
			my.log("notice click");
			stat.notice = ! stat.notice;
			if(stat.notice){
				$("#anwh-notice").text('⏳');
				my.notice_start();
			}else{
				$("#anwh-notice").text('?');
				my.notice_stop();
			}
		});
		$("#anwh-config").click(my.config);
		my.config_apply();
	}

	// ===== 通知処理 ====
	my.notice_start = function(){
		// 画面からトークンが取得できれば、即送信する
		let tokenElem = $("#server-token,#server");
		if(tokenElem.length){
			my.notice_send(tokenElem.val());
			return;
		}
		my.notice_token_detect();
	};
	my.notice_stop = function(){
	};
	my.notice_send = function(token){
		let flg0 = {"token": token};
		let flg_list = [flg0];
		for(let name in cfg){
			let res = /^p(\d+)_(.*)/.exec(name);
			if(res){
				let prof_no = res[1];
				let prof_name = res[2];
				if(!(prof_no in flg_list)){
				   flg_list[prof_no] = {"no": prof_no};
				}
				flg_list[prof_no][prof_name] = cfg[name];
			}
		}
		if(cfg.leaderboard){
			if($("#leaderboard-positions").length){ // OGARio
				flg0.leaderboard = $("#leaderboard-positions").text();
			}else if($("#leaderboard").length){ // AgarTool
				flg0.leaderboard = $("#leaderboard").val();
			}
		}
		if(cfg.tag){
			flg0.tag = $('#clantag,#tag,#psk').val() || "<none>";
		}
		stat.send_count = 0;
		for(let prof_no = 1; prof_no < flg_list.length; prof_no ++){
			let flg = {};
			//Object.assign(flg, flg_list[0], flg_list[prof_no]);
			my.flg_merge(flg, flg_list[0]);
			my.flg_merge(flg, flg_list[prof_no]);
			my.notice_send_sub(flg);
		}
		if(stat.send_count === 0){
			$("#anwh-notice").text(stat.symbol_empty);
		}
	};
	my.flg_merge = function(dst, src){
		for(let name in src){
			let value = src[name];
			if(typeof value !== "string" || value){
				dst[name] = value;
			}
		}
	};
	my.notice_send_sub = function(flg){
		if(! flg.webhooksUrl || ! flg.use){
			return;
		}
		let dataObj = {};
		dataObj.content = (''+
			(flg.msg || "")+
			"\ntoken:"+ flg.token+
			(cfg.tag ? " tag:"+ flg.tag : "")+
			(cfg.leaderboard ? "\n"+"lb:"+ flg.leaderboard : ""))
				.replace(/^\n/, "")
				.replace(/\n\n/g, "\n");
		let nick = flg.nick || $("#nick").val();
		if(nick){
			dataObj.username = nick;
		}
		if(flg.avatar){
			dataObj.avatar_url = flg.avatar;
		}
		var dataStr = JSON.stringify(dataObj);
		my.log("notice data="+ dataStr);
		var xhr = new XMLHttpRequest();
		xhr.open("POST", flg.webhooksUrl, true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.onreadystatechange = function () {
			if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 204)) {
				//var json = JSON.parse(xhr.responseText);
				//console.log("OK email=" + json.email + ", pass=" + json.password);
				stat.send_count --;
				if(stat.send_count === 0){
					$("#anwh-notice").text(stat.symbol_done);
				}
			}
		};
		xhr.send(dataStr);
		stat.send_count ++;
	};
	// -----  画面に token が無い場合の処理   -----
	my.notice_token_detect = function(){
		let save_name = my.id +"_save_send";
		let SockProt = global.WebSocket.prototype;
		if(save_name in SockProt){
			my.log("WebSocket.send already hooked");
			return;
		}
		let save_send = SockProt[save_name] = global.WebSocket.prototype.send;
		let urlRe = /^ws:\/\/live-arena-(\w+)\.agar\.io/;
		global.WebSocket.prototype.send = function(data){
			save_send.apply(this, [data]);
			let res = urlRe.exec(this.url);
			my.log("catch send url="+ this.url +" res="+ res);
			if(res){
				global.WebSocket.prototype.send = save_send;
				delete SockProt[save_name];
				my.notice_send(res[1]);
			}
		};
	};

	// ===== 設定画面 ====
	my.config = function(){
		my.log("config clicked");
		if(! stat.config_show){
			my.config_sub();
		}
		stat.config_show();
	};
	my.config_sub = function(){
		let html = '';
		html += '<div id="anwh-cfg-parent" style="display:none;">';
		html +=   '<dialog id="anwh-dialog"></dialog>';
		html += '</div>';
		$("#anwh-config").after(html);
		let dlg = $("#anwh-dialog");
		if(dlg.length && dlg.get(0).showModal){
			stat.config_show = function(){
				my.cfg_init();
				my.cfg_load(cfg);
				dlg.get(0).showModal();
			};
		}else{
			stat.config_show = function(){
				my.cfg_init();
				my.cfg_load(cfg);
				window.open(stat.config_url);
			};
			return;
		}
		html = '';
		html += '<span id="anwh-cfg-before">Agar info⇒Webhooks</span>';
		dlg.append(html);
		my.config_init_sub($("#anwh-cfg-before"));
		my.config_cancel = function(){
			dlg.get(0).close();
		};
		$("#anwh-cfg-parent").show();
	};
	my.config_init_sub = function(before){
		//let html = '', spsp = '&nbsp;&nbsp;', brsp = '<br/>&nbsp;&nbsp;';
		let html = '', spsp = '　　', brsp = '<br/>　　';
		html += '<br/>共通設定 ※同名項目は個別設定で上書きされます';
		html += brsp +'with: <label><input type="checkbox" data-anwh-config="tag"/>tag</label>';
		html +=    ' <label><input type="checkbox" data-anwh-config="leaderboard"/>leaderboard</label>';
		html += brsp +'<input type="text" data-anwh-config="p0_nick" placeholder="Nick" style="width:15em;" />';
		html += brsp +'<input type="text" data-anwh-config="p0_msg" placeholder="Message" style="width:15em;" />';
		html += brsp +'<input type="text" data-anwh-config="p0_avatar" placeholder="avatar url" style="width:15em;" />';
		for(let prof_no = 1; prof_no <= stat.prof_num; prof_no ++){
			var prefix = "p"+ prof_no +"_";
			html += '<br/><label><input type="checkbox" data-anwh-config="'+ prefix +'use"/>profile'+ prof_no +'</label>';
			html +=   '&nbsp;<input type="text" data-anwh-config="'+ prefix +'title" placeholder="title" style="width:10em;" />';
			html += brsp +'<input type="text" data-anwh-config="'+ prefix +'webhooksUrl" placeholder="Webhooks URL" style="width:15em;" />';
			html += brsp +'<input type="text" data-anwh-config="'+ prefix +'nick" placeholder="Nick" style="width:15em;" />';
			html += brsp +'<input type="text" data-anwh-config="'+ prefix +'msg" placeholder="Message" style="width:15em;" />';
			html += brsp +'<input type="text" data-anwh-config="'+ prefix +'avatar" placeholder="avatar url" style="width:15em;" />';
		}
		html += '<br/>';
        html += spsp +'<button id="anwh-cfg-default" class="btn btn-primary">DEFAULT</button>';
        html += spsp +'<button id="anwh-cfg-ok" class="btn btn-success">OK</button>';
        html += spsp +'<button id="anwh-cfg-cancel" class="btn btn-danger">CANCEL</button>';
		before.after(html);
        $("#anwh-cfg-default").click(function(){
            my.cfg_load(cfg_org);
        });
        $("#anwh-cfg-ok").click(function(){
			cfg = my.cfg_save();
			my.storage_setValue("config", JSON.stringify(cfg));
			my.config_cancel();
			my.config_apply();
		});
		$("#anwh-cfg-cancel").click(function(){
			my.config_cancel();
		});
	};
	my.config_apply = function(){
	};

	// =====  その他共通処理  ======
	my.cfg_init = function(){
		$.extend(cfg, cfg_org, JSON.parse(my.storage_getValue("config",'{}')));
	};
	my.cfg_save = function(){
		var cfg_new = {};
		$('[data-anwh-config]').each(function(){
			var elem = $(this);
			var type = elem.prop('type');
			var name = elem.attr('data-anwh-config');
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
		$('[data-anwh-config]').each(function(){
			var elem = $(this);
			var type = elem.prop('type');
			var name = elem.attr('data-anwh-config');
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
		//return	global.localStorage[my.name +"_"+ name] || defval_;
		return GM_getValue(name, defval_);
		//return await GM.getValue(name, JSON.stringify(defval_));
	};
	my.storage_setValue = function(name, value){
		//global.localStorage[my.name +"_"+ name] = value;
		GM_setValue(name, value);
		//await GM.setValue(name, JSON.stringify(value));
	};
	// ===== 起動処理 ====
	my.cfg_init();
	if(/https:\/\/www\.google\.co\.jp\//.test(location.href)){
		$('body').html(''+
			'<span id="anwh-cfg-before">Agar info⇒Webhooks</span>'+
			'');
		my.config_init_sub($("#anwh-cfg-before"));
		my.cfg_load(cfg);
		my.config_cancel = function(){
			window.close();
		};
		return;
	}
    function pre_loop(){
        // この時点では jQuery は使えない
        if(! document.getElementById("nick")){
            my.pre_loop_timeout = (my.pre_loop_timeout || 1000) + 1000;
            setTimeout(pre_loop, my.pre_loop_timeout);
            my.log("wait for page load");
            return;
        }
        // 念のため、もう１wait入れる
        setTimeout(initialize, 1000);
		//loadScript("https://greasyfork.org/scripts/40408-lib-ogario/code/lib%20OGARio.user.js", initialize);
    }
    pre_loop();
})();
