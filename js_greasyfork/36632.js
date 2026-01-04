// ==UserScript==
// @name         AO2T:連携OGAR⇒AgarTool
// @name:ja      AO2T:連携OGAR⇒AgarTool
// @name:en      AO2T:Agar OtoT
// @version      0.14
// @namespace    http://tampermonkey.net/tannichi-ao2t
// @description   OGARio 上から Agar Tool へ情報連携します
// @description:ja   OGARio 上から Agar Tool へ情報連携します
// @description:en   link to Agar Tool on OGARio
// @author       tannichi
// @match        http://agar.io/*
// @grant        unsafeWindow
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/36632/AO2T%3AAgar%20OtoT.user.js
// @updateURL https://update.greasyfork.org/scripts/36632/AO2T%3AAgar%20OtoT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var global = unsafeWindow;
    var my = {
        "name": "Agar OtoT",
        "log": function(msg){ console.log(this.name + ":"+ msg); },
        "tool_symbol": "?"
    };
    var stat = {
		"lib_tgar_url": "http://tannichi.web.fc2.com/lib/lib-tgar_0.7.js",
        // ---- OGARio settings  -----
        "minimapNickFont": "700 11px Ubuntu",
        "minimapNickColor": "#ffffff",
        "minimapNickStrokeColor": "#000000",
        "minimapNickStrokeSize": 0x2,
        "minimapTop": 0x18,
        "minimapTeammatesSize": 5.5,
        //"minimapTeammatesColor": "#F03A17",
        //"minimapOffsetX": 0.5,
        //"minimapOffsetY": 0x18 + 9.5, // miniMapTop + 9.5
        "minimapOffsetX": 71,
        // -----  for OGARio Ver.4  ----
        "mapSize": 14142, // ogario.mapSize,
        "mapOffset": 7071, // ogario.mapOffset,
        // -----  other  -----
        "pi2": 0x2 * Math.PI,
        "messageBoxBottom": ["82px", "40%"],
        "keyCodeEnter": 13, // Enter
        "keyCodeA": 65, // 'A'
        "keyCodeR": 82 // 'R'
    };
    var cfg= {}, cfg_org = {
        "user_show": true,
        "minimap_show": true,
        "tgar_prefix": "?",
        "tgar_color": "#8C81C7",
        "update_interval": 1000,
        "ogar_user": true,
        "ogar_prefix": "?",
        "lmsa_teamtop": false,
        "lmsa_chat": false,
        "lmsa_toast": false,
        "chat_close": false,
        "chat_unpause": true,
        "chat_vcenter": false,
        "chat_alt": true,
        "chat_ctrlalt": true,
        "chat_ctrl": true,
        "skin_toggle_auto": false,
        "skin_toggle_interval": 10000
    };
    function pre_loop(){
        // この時点では jQuery は使えない
        if(! document.getElementById("top5-hud")){
            my.pre_loop_timeout = (my.pre_loop_timeout || 1000) + 1000;
            setTimeout(pre_loop, my.pre_loop_timeout);
            my.log("wait for OGARio load");
            return;
        }
        // 念のため、もう１wait入れる
        setTimeout(initialize, 1000);
    }
    pre_loop();

    function initialize(){
        $.extend(cfg, cfg_org, JSON.parse(GM_getValue("config", '{}')));
        global.ao2t = {my:my, stat:stat, cfg:cfg};
        var local_style = '';
        local_style += '#ao2t-hud {';
        local_style +=     ' font-size: 80%; pointer-events: auto;';
        local_style += '}';
        local_style += '#ao2t-hud * {';
        local_style +=     ' user-select: auto!important;';
        local_style += '}';
        local_style += '#ao2t-cfg-dlg {';
        local_style +=     ' border-radius:0; font-size: 80%; padding: 2px 10px; position: fixed;';
        local_style +=     ' pointer-events: auto; background-color: rgba(32,32,32,0.4); color: #ffffff;';
        local_style +=     ' overflow: hidden;';
        local_style += '}';
        local_style += '#ao2t-cfg-dlg * {';
        local_style +=     ' width: auto; user-select: auto!important; pointer-events: auto;';
        local_style +=     ' position: relative; float: initial;';
        //local_style +=     ' display: run-in;'; // NG
        local_style += '}';
        local_style += '#ao2t-cfg-dlg input {';
        local_style +=     ' background-color: rgba(0,0,0,0.4); color: #ffffff;';
        local_style += '}';
        $("head").append('<style>\n'+ local_style +'\n</style>');
        $("#top5-hud").append(''+
            '<div id="ao2t-hud">AO2T:'+
                 ' <span id="ao2t-capture">?</span>'+
                 ' <span id="ao2t-config">?</span>'+
                 '<div id="ao2t-top5" style="padding-left: 1em;"></div>'+
            '</div>');
        $("#ao2t-capture").click(function(event){
            my.log("capture_click");
            stat.capture = ! stat.capture;
            if(stat.capture){
				$("#ao2t-capture").text('⏳');
                my.capture_start();
            }else{
                my.capture_end();
                $("#ao2t-capture").text('?');
            }
        });
        $("#ao2t-config").click(my.config);
        // LMB-Mouse split 補正(ボタン上の左クリックで分離しないようにする)
        if(cfg.lmsa_teamtop){
            //$(".team-top-menu").mousedown(function(){return false;});
            $("#top5-hud").mousedown(function(){return false;});
        }else{
            $("#ao2t-hud").mousedown(function(event){ return false;});
        }
        if(cfg.lmsa_chat){
            $("#message-box").mousedown(function(){return false;});
        }
        if(cfg.lmsa_toast){
            $(document).on('mousedown', '#toast-container', function(){return false;});
        }
        // --- chat close ---
        if(cfg.chat_close){
            $("#message-menu").append('<a href="#" id="ao2t-chat-close" style="float:right;">X</a>');
            $("#ao2t-chat-close").click(function(){
                my.chatClose();
            });
        }
        if(cfg.chat_vcenter){
            $("#message-box").css("bottom", stat.messageBoxBottom[1]);
        }
        $("#message").keydown(function(event){
            var modify = (event.altKey ? "a" : "")+
                (event.ctrlKey ? "c" : "")+
                (event.metaKey ? "m" : "")+
                (event.shiftKey ? "s" : "");
            if(event.keyCode === stat.keyCodeEnter){
                if(modify === "a" && cfg.chat_alt){
                    my.chatSend();
                    return false;
                }else if(modify === "ac" && cfg.chat_ctrlalt){
                    my.chatSend({"ogar":true});
                    return false;
                }else if(modify === "c" && cfg.chat_ctrl){
                    my.chatClose();
                    return false;
                }
            }
        });
        // --- skin toggle ---
        my.skinToggle_start();
    }
    my.capture_start = function(){
        // まだならば、チャット送信ボタンを追加
        if($("#ao2t-message").length){
            $("#ao2t-message").show(); // .prop('disabled', false);
            $("#ao2t-minimap").show();
        }else{
            my.capture_init();
        }
        // 接続
		stat.tag = $('#tag').val();
		stat.nick =  $('#nick').val();
		stat.serverToken = $('#token').val();
        my.connect();
        stat.update_timerid = setInterval(my.update, cfg.update_interval);
    };
    my.capture_end = function(){
        $("#ao2t-message").hide(); // .prop('disabled', true);
        $('#ao2t-top5').html('');
        $("#ao2t-minimap").hide();
        my.disconnect();
        clearInterval(stat.update_timerid);
        stat.update_timerid = null;
    };
    my.capture_init = function(){
        $("#message-menu").append('<a href="#" id="ao2t-message" style="float:right;">'+ my.tool_symbol +'</a>');
        $("#ao2t-message").click(my.chatSend);
        // minimap
        var minimap = $("#minimap");
        var minimapWidth = minimap.attr('width');
        var minimapHeight = minimap.attr('height');
        minimap.before('<canvas id="ao2t-minimap"'+
                       ' style="position: absolute;"'+
                       ' width="'+ minimapWidth +'" height="'+ minimapHeight +'">');
        //stat.minimapOffsetX = stat.minimapOffsetY + minimapHeight - minimapWidth;
    };
    my.chatSend = function(flg_){
        var flg = flg_ || {};
        if(! stat.connected){
            global.toastr.error("AO2T: not connected");
            return;
        }
        var msg = $("#message").val();
        if(msg.length){
            stat.tgar.chatSend(msg);
            if(flg.ogar){
                $(document).trigger(jQuery.Event('keydown',{ keyCode: stat.keyCodeEnter, which: stat.keyCodeEnter } ));
            }else{
                $("#message-box").hide();
            }
        }
    };
    my.chatClose = function(){
        $("#message-box").css("display", "none");
        if(cfg.chat_unpause && $("#pause-hud").css("display") == "block"){ // PAUSE 中なら解除する
            $(document).trigger(jQuery.Event('keydown',{ keyCode: stat.keyCodeR, which: stat.keyCodeR } ));
            $(document).trigger(jQuery.Event('keyup',{ keyCode: stat.keyCodeR, which: stat.keyCodeR } ));
        }
    };
    my.update = function(){
        var ogarAlive = my.ogarIsAlive();
        if(ogarAlive != stat.alive){
            my.tgarAlive(ogarAlive);
        }
        if(stat.alive){
            my.tgarReposition();
        }
        my.ogarMinimapUpdate();
    };

    // -----  設定  -----
    my.config = function(){
        my.log("config_click2");
        if(!($('#ao2t-cfg-dlg').length)){
            my.config_init();
        }
        my.cfg_load(cfg);
        $("#ao2t-cfg-dlg").show();
        $("#overlays").show();
    };
    my.config_init = function(){
        $("#overlays").append('<div id="ao2t-cfg-dlg"'+
            '  style="width:400px; height:450px; top:150px; left:300px; display: none;'+
            '">'+
              my.name+
              '<div style="overflow: scroll; '+
                    'position: relative; top:1.5em; left:0.5em; right:0.5em; bottom:1.5em;">'+
                '<div id="ao2t-cfg-base">'+
                '</div>'+
              '</div>'+
              '&nbsp;<span id="ao2t-cfg-default" class="btn btn-primary">DEFAULT</span>'+
              '&nbsp;<span id="ao2t-cfg-ok" class="btn btn-success">OK</span>'+
              '&nbsp;<span id="ao2t-cfg-cancel" class="btn btn-danger">CANCEL</span>'+
            '</div>');
        $('#ao2t-cfg-base').append(''+
            '&nbsp;&nbsp;&nbsp;更新頻度[ミリ秒]:<input type="text" data-ao2t-config="update_interval" style="width:6em;"/>'+
            '<br/>Agar Tool から取得'+
            '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="user_show"/>user list</label>'+
            '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="minimap_show"/>minimap</label>'+
              '&nbsp;前置:<input type="text" data-ao2t-config="tgar_prefix" style="width:4em;"/>'+
              '&nbsp;&nbsp;<input type="text" data-ao2t-config="tgar_color" style="width:6em;"/>'+
            //    '<span class="input-group-addon"><i id="tgar_color" style="background-color: rgb(0, 0, 0);"></i></span>'+
            '<br/>Agar Tool へ送付'+
            '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="ogar_user"/>user info</label>'+
              '&nbsp;前置:<input type="text" data-ao2t-config="ogar_prefix" style="width:4em;"/>'+
            '<br/>LMB-Mouse split 補正'+
            '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="lmsa_teamtop"/>Team top</label>'+
              '&nbsp;<label><input type="checkbox" data-ao2t-config="lmsa_chat"/>chat</label>'+
              '&nbsp;<label><input type="checkbox" data-ao2t-config="lmsa_toast"/>toast</label>'+
            '<br/>Chat option'+
              '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="chat_close"/>close</label>'+
                '&nbsp;<label><input type="checkbox" data-ao2t-config="chat_unpause"/>unpause</label>'+
                '&nbsp;<label><input type="checkbox" data-ao2t-config="chat_vcenter"/>vcenter</label>'+
              '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="chat_alt"/>Alt→T</label>'+
                '&nbsp;<label><input type="checkbox" data-ao2t-config="chat_ctrlalt"/>Ctrl+Alt→O+T</label>'+
                '&nbsp;<label><input type="checkbox" data-ao2t-config="chat_ctrl"/>Ctrl→Close</label>'+
            '<br/>Other'+
              '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="skin_toggle_auto"/>skin auto toggle</label>'+
              '&nbsp;&nbsp;&nbsp;頻度[ミリ秒]:<input type="text" data-ao2t-config="skin_toggle_interval" style="width:6em;"/>'+
            '<br/>&nbsp;&nbsp;※変更は再起動後に反映されます'+
            '');
        $("#ao2t-cfg-default").click(function(){
            my.cfg_load(cfg_org);
        });
        $("#ao2t-cfg-ok").click(function(){
            cfg = my.cfg_save();
            GM_setValue("config", JSON.stringify(cfg));
            my.config_cancel();
            $("#message-box").css("bottom", stat.messageBoxBottom[cfg.chat_vcenter ? 1: 0]);
            my.skinToggle_start();
         });
        $("#ao2t-cfg-cancel").click(function(){
            my.config_cancel();
        });
        my.config_cancel = function(){
            $("#overlays").hide();
            $("#ao2t-cfg-dlg").hide();
        };
        //$("#tgar_color").colorpicker({'format': 'hex'}).on('changeColor.colorpicker', function(event){
        //    var id = event.target.id;
        //    $('[data-ao2t-config="'+ id +'"]').val(event.color.toHex());
        //    event.target.style.backgroundColor = event.color.toRGB();
        //});
    };
    // -----  skin toggle  -----
    my.skinToggle_start = function(){
        if(stat.skinToggle_timerid){
            clearInterval(stat.skinToggle_timerid);
            delete stat.skinToggle_timerid;
        }
        if(cfg.skin_toggle_auto && cfg.skin_toggle_interval > 0){
            stat.skinToggle_timerid = setInterval(my.skinToggle_update, cfg.skin_toggle_interval);
        }
    };
    my.skinToggle_update = function(){
        //my.log("skinToggle_update in");
        // --- check OGARio.v3 mode ---
        if(global.ogario && global.ogario.customSkins && global.ogario.vanillaSkins){
            //my.log("skinToggle_update hasBoth");
            stat.skinToggle_hasBoth = true;
        }
        my.skinToggle_update_sub();
        if(stat.skinToggle_hasBoth && global.ogario.customSkins && ! global.ogario.vanillaSkins){
            //my.log("skinToggle_update retry");
            my.skinToggle_update_sub();
        }
    };
    my.skinToggle_update_sub = function(){
        $(document).trigger($.Event('keydown',{ keyCode: stat.keyCodeA, which: stat.keyCodeA } ));
        $(document).trigger($.Event('keyup',{ keyCode: stat.keyCodeA, which: stat.keyCodeA } ));
    };
    // =====  Agar Tool 通信処理/接続  =====
    my.connect = function(){
		if(! global.lib_tgar){
			return loadScript(stat.lib_tgar_url, my.connect);
		}
        my.disconnect();
		let opt = {
			"tag": stat.tag,
			"nick": stat.nick,
			"serverToken": stat.serverToken,
		};
		stat.tgar = global.lib_tgar.create(opt);
		stat.tgar.onchat = my.onchat;
		stat.tgar.onconnect = my.onconnect;
		stat.tgar.ondisconnect = my.ondisconnect;
    };
    my.disconnect = function(){
		if(stat.connected && stat.alive){
			my.tgarAlive(false);
		}
		if(stat.tgar){
			stat.tgar.detach();
			delete stat.tgar;
		}
    };
    // =====  Agar Tool 通信処理/処理  =====
    my.onconnect = function(tgar){
		if(global.ogario){
			$("#ao2t-capture").text('?');
		}else{
			$("#ao2t-capture").text('?');
		}
		stat.connected = true;
	};
    my.ondisconnect = function(tgar){
		$("#ao2t-capture").text('⚠');
		delete stat.tgar;
		stat.connected = false;
	};
    my.tgarAlive = function(alive){
        stat.alive = alive;
        if(cfg.ogar_user){
			if(stat.tgar){
				stat.tgar.sendAlive(alive, {"nick": cfg.ogar_prefix + stat.nick});
			}else{
				stat.alive = false;
			}
        }
    };
    my.tgarReposition = function(){
        if(cfg.ogar_user && global.ogario && stat.tgar){
			let player_x = global.ogario.playerX + global.ogario.mapOffsetX;
			let player_y = global.ogario.playerY + global.ogario.mapOffsetY;
			stat.tgar.sendPlayerPosition(player_x, player_y);
        }
    };

    // =====  OGARio処理  ======
    my.onchat = function(ev){
        var time_txt = new Date().toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1');
        var user_icon = my.tool_symbol;
        var chat_html = '<div class="message">'+
            '<span class="'+ (ev.isCommand ? 'command-time' : 'message-time')+ '">['+ time_txt +'] </span>'+
            '<span style="color:'+ cfg.tgar_color +'; font-weight:700;'+
					(ev.isCommand ? 'background-color:rgba(255,0,0,0.4);' : '')
				+'">'+ user_icon +' '+ escapeHtml(ev.nick) +'</span>: '+
            '<span class="'+ (ev.isCommand ? 'command-text' : 'message-text') +'">'
				+ escapeHtml(ev.message) + '</span>'+
            '</div>';
        $("#chat-box").append(chat_html);
        $("#chat-box").perfectScrollbar('update');
        $('#chat-box').animate({
            'scrollTop': $("#chat-box").prop("scrollHeight")
        }, 0x1f4);
	};
    my.ogarMinimapUpdate = function(){
        var minimap_elem = document.getElementById("ao2t-minimap");
        var minimapWidth = minimap_elem.width;
        var minimapHeight = minimap_elem.height;
        var minimapMulti = (minimapWidth - 0x12) / my.ogarGetMapSize();
        var mapOffset = my.ogarGetMapOffset();
        //var mapOffsetX = ogario.mapOffset - ogario.mapOffsetX;
        //var mapOffsetY = ogario.mapOffset - ogario.mapOffsetY;
        stat.minimapOffsetX = 0x12 / 2;
        stat.minimapOffsetY = stat.minimapOffsetX + (minimapHeight - minimapWidth);
        var mapOffsetX = stat.minimapOffsetX;
        var mapOffsetY = stat.minimapOffsetY;
        var mapOffsetT = -(0x2 * stat.minimapTeammatesSize + 2);
        var ctx = minimap_elem.getContext('2d');
        ctx.clearRect(0, 0, minimapWidth, minimapHeight);
        ctx.font = stat.minimapNickFont;
        var user_txt = '';
        var sep = '';
        //var keys = Object.keys(stat.minimapBalls).sort();
		let players = stat.tgar.getPlayerList();
        if(players.length === 0){
            user_txt = "no tgar user";
        }
        for(let player; (player = players.shift()); ){
            user_txt += sep + escapeHtml(player.nick);
            sep = '<br/>';
            if(cfg.minimap_show){
                var name = cfg.tgar_prefix + player.nick;
                var mapX = (player.x + mapOffset) * minimapMulti + mapOffsetX;
                var mapY = (player.y + mapOffset) * minimapMulti + mapOffsetY;
                ctx.textAlign = 'center';
                ctx.lineWidth = stat.minimapNickStrokeSize;
                ctx.strokeStyle = stat.minimapNickStrokeColor;
                ctx.strokeText(name, mapX, mapY + mapOffsetT);
                ctx.fillStyle = cfg.tgar_color; // stat.minimapNickColor
                ctx.fillText(name, mapX, mapY + mapOffsetT);
                ctx.beginPath();
                ctx.arc(mapX, mapY, stat.minimapTeammatesSize, 0x0, stat.pi2, !0x1);
                ctx.closePath();
                ctx.fillStyle = player.color;
                ctx.fill();
            }
        }
        if(cfg.user_show){
            $('#ao2t-top5').html(user_txt);
        }
    };
    // --- for OGARio Ver.4 ----
    my.ogarIsAlive = function(){
        return global.ogario ? global.ogario.play : false;
    };
    my.ogarGetMapSize = function(){
        return global.ogario ? global.ogario.mapSize : stat.mapSize;
    };
    my.ogarGetMapOffset = function(){
        return global.ogario ? global.ogario.mapOffset : stat.mapOffset;
    };

    // =====  その他処理  ======
    my.cfg_save = function(){
        var cfg_new = {};
        $('[data-ao2t-config]').each(function(){
            var elem = $(this);
            var type = elem.prop('type');
            var name = elem.attr('data-ao2t-config');
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
        $('[data-ao2t-config]').each(function(){
            var elem = $(this);
            var type = elem.prop('type');
            var name = elem.attr('data-ao2t-config');
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
