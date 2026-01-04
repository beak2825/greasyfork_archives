// ==UserScript==
// @name         OGSO
// @name:ja     ＯＧＳＯ
// @namespace    https://twitter.com/tannichi1/
// @version      0.1.4
// @description  OGsSoO
// @description:ja  ＯＧのＳをＯ
// @author       tannichi
// @match        http://agar.io/*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/34201/OGSO.user.js
// @updateURL https://update.greasyfork.org/scripts/34201/OGSO.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var global = unsafeWindow;
    var scr_name = "OGSO";
    console.log(scr_name + ": start");
    var cfg = { // JSON.parse(GM_getValue("config", '{"capture_size":20}'));
        "capture_size":20,
        "skin_cat0":"敵", "skin_url0":"https://i.imgur.com/mvSgmI3.png",
        "skin_cat1":"日食","skin_url1":"https://i.imgur.com/LE0LE6X.png",
        "skin_cat2":"FAKE","skin_url2":"https://i.imgur.com/XuEi2LD.png",
        "skin_cat3":"翻訳","skin_url3":"https://i.imgur.com/FYVqKBf.png",
        "skin_cat4":"くま","skin_url4":"https://i.imgur.com/iBsgA9I.png",
        "pause_skin_use": true,
        "pause_skin_cycle":"2",
        "pause_skin_own": true,
        "pause_skin_url0":"https://i.imgur.com/T9NAq9T.png",
        "pause_skin_url1":"https://i.imgur.com/PoyjEP2.png",
    };
    var state = {
        "skin_num": 6,   // スキンの数
        "pause_skin_num": 2, // 停止時スキンの数
        "nick_seq": 0,
        "nick_list": [],
        "nick_hash": {},
        "msg_delay": 1000, // メッセージ遅延
    };
    var own = {};
    function initialize(){
        $.extend(cfg, JSON.parse(GM_getValue("config", '{}')));
        var idx, html;
        // 画面制御
        var local_style = '';
        local_style += '#ogso-hud,#ogso-opb,#ogso-cfdlg,#ogso-cfbase,#ogso-skin-img {';
        local_style +=     ' border-radius:0; font-size: 100%; padding: 2px 10px; position: fixed;';
        local_style +=     ' pointer-events: auto; background-color: rgba(32,32,32,0.4); color: #ffffff;';
        local_style +=     ' ';
        local_style +=     ' overflow: hidden;';
        //local_style +=     ' z-index: 9;';
        local_style += '}';
        local_style += '#ogso-hud *,#ogso-opb *,#ogso-cfdlg *,#ogso-cfbase *{';
        local_style +=     ' background-color: rgba(32,32,32,0.4); color: #ffffff;';
        local_style +=     ' width: auto; user-select: auto!important; pointer-events: auto;';
        local_style +=     ' display: run-in; float: initial';
        local_style += '}';
        $("head").append('<style>\n'+ local_style +'\n</style>');
        $("#overlays-hud").append('<div id="ogso-hud"'+
            '  style="width:7em; height:30px; bottom:20px; left:10px; display:block;'+
            '"></div>');
        $("#overlays").append('<div id="ogso-opb"'+
            '  style="width:500px; height:30px; bottom:20px; left:200px; display: none;'+
            '"></div>');
        $("#overlays").append('<div id="ogso-cfdlg"'+
            '  style="width:400px; height:300px; bottom:100px; left:300px; display: none;'+
            '"></div>');
        $("#overlays").append('<img id="ogso-skin-img"'+
            '  style="width:256px; height:256x; top:50px; right:50px; display: none;'+
            '"/>');
        $("#ogso-cfdlg").append('<div id="ogso-cfview"'+
            '  style="position: relative; overflow: scroll; top:5px; left:5px; right:5px;  height:250px;display: block;'+
            '"></div>');
        $("#ogso-cfview").append('<div id="ogso-cfbase"'+
            '  style="position: static; display: block;'+
            '"></div>');
        $("#overlays").on('mouseover', '.ogso-skin-url', function(event){
            var img_url = event.target.value;
            if(img_url){
                $("#ogso-skin-img").attr("src", img_url);
                $("#ogso-skin-img").show();
            }else{
                $("#ogso-skin-img").hide();
            }
        });        $("#overlays").on('mousout', '.ogso-skin-url', function(event){
            $("#ogso-skin-img").hide();
        });

        $("#overlays").on('mousout', '.ogso-skin-url', function(event){
            $("#ogso-skin-img").hide();
        });
        $("#ogso-hud").on('mousedown', function(event){
            return false; // マウスクリックが "LMB-Mouse split" と干渉しないようにする
        });
        var opb = $("#ogso-opb");
        var cfdlg = $("#ogso-cfdlg");
        opb.append('<span id="ogso-close">?</span>');
        $("#ogso-hud").append('<span id="ogso-capture">?</span>&nbsp;<span id="ogso-spread">OGSO</span>');
        state.capture = cfg.capture_inrun;
        if(state.capture){
            capture_update();
        }
        $("#ogso-capture").click(function(event){
            console.log(scr_name + ": capture click");
            state.capture = ! state.capture;
            capture_update();
        });
        function capture_update(){
            if(state.capture){
                own.capture_start();
                $("#ogso-capture").text('?');
            }else{
                own.capture_end();
                $("#ogso-capture").text('?');
            }
        }
        $("#ogso-spread").click(function(event){
            console.log(scr_name + ": spread click");
            $("#overlays").show();
            $("#ogso-opb").show();
            state.spread = true;
            namesel_update();
        });
        $("#ogso-close").click(function(event){
            console.log(scr_name + ": close click");
            $("#overlays").hide();
            $("#ogso-opb").hide();
            $("#ogso-cfdlg").hide();
            $("#ogso-skin-img").hide();
            state.spread = false;
        });
        opb.append('&nbsp;<span id="ogso-cfopen">?</span>');
        $("#ogso-cfopen").click(function(event){
            console.log(scr_name + ": config click");
            cfg_load(cfg);
            $("#ogso-clip").val("");
            cfdlg.show();
            return false;
        });
        cfdlg.append('<div style="position: absolute; right:10px; bottom: 10px;">'+
            '<span id="ogso-cfsave" class="btn btn-success">SAVE</span>'+
            '→<input type="text" id="ogso-clip" style="width:6em;"/>→'+
            '<span id="ogso-cfload" class="btn btn-success">LOAD</span>'+
            '&nbsp;<span id="ogso-cfok" class="btn btn-success">OK</span>'+
            '&nbsp;<span id="ogso-cfcancel" class="btn btn-danger">CANCEL</span>'+
            '&nbsp;</div>');
        $("#ogso-cfok").click(function(event){
            console.log(scr_name + ": config ok");
            cfg = cfg_save();
            GM_setValue("config", JSON.stringify(cfg));
            cfdlg.hide();
            opb_update();
        });
        $("#ogso-cfcancel").click(function(event){
            console.log(scr_name + ": config cancel");
            cfdlg.hide();
        });
        $("#ogso-cfsave").click(function(event){
            console.log(scr_name + ": config save");
            cfg = cfg_save();
            $("#ogso-clip").val(JSON.stringify(cfg));
            $("#ogso-clip").select();
        });
        $("#ogso-cfload").click(function(event){
            console.log(scr_name + ": config load");
            var elem = document.createElement("textarea");
            var cfg_json = $("#ogso-clip").val();
            try{
                var cfg_new = JSON.parse(cfg_json);
                cfg_load(cfg_new);
            }catch(e){
                alert("JSON,parse error"+ e);
            }
        });
        function cfg_save(){
            var cfg_new = {};
            $('[data-ogso-config]').each(function(){
                var elem = $(this);
                var type = elem.prop('type');
                var name = elem.attr('data-ogso-config');
                var value;
                if(type === "checkbox"){
                    value = elem.prop('checked');
                }else{
                    value = $(this).val();
                }
                cfg_new[name] = value;
            });
            return cfg_new;
        }
        function cfg_load(cfg_new){
            $('[data-ogso-config]').each(function(){
                var elem = $(this);
                var type = elem.prop('type');
                var name = elem.attr('data-ogso-config');
                if(cfg_new.hasOwnProperty(name)){
                    var value = cfg_new[name];
                    if(type === "checkbox"){
                        elem.prop('checked', value);
                    }else{
                        $(this).val(value);
                    }
                }
            });
        }
        // 設定画面の内容
        var cfbase = $("#ogso-cfbase");
        cfbase.append('キャプチャ: <label><input type="checkbox" data-ogso-config="capture_inrun" />起動時に開始</label>'+
            '&nbsp;履歴数:<input type="text" data-ogso-config="capture_size" style="width:5em;"/>');
        cfbase.append('<br/><label><input type="checkbox" data-ogso-config="msg_skinoverride" />更新メッセージを生成</label>');
        html = '<table border="1">';
        html += '<tr><th>分類</th><th>スキンURL</th><tr>';
        for(idx = 0; idx < state.skin_num; idx ++){
            html += '<tr>';
            html += '<td><input type="text" data-ogso-config="skin_cat'+ idx +'" style="width:5em"/></td>';
            html += '<td><input type="text" data-ogso-config="skin_url'+ idx +'" style="width:20em" class="ogso-skin-url"/></td>';
            html += '</tr>';
        }
        html += '</table>';
        cfbase.append('<br/>'+ html);
        // PAUSE
        cfbase.append('<br/><label><input type="checkbox" data-ogso-config="pause_skin_use" />停止時のスキン表示</label>'+
            '&nbsp;間隔[秒]:<input type="text" data-ogso-config="pause_skin_cycle" style="width:5em;" value="2"/>'+
            '&nbsp;<label><input type="checkbox" data-ogso-config="pause_skin_own" />自身を含む</label>');
        for(idx = 0; idx < state.pause_skin_num; idx ++){
            cfbase.append('<br/>&nbsp;&nbsp;スキン'+ idx +
                '<input type="text" data-ogso-config="pause_skin_url'+ idx +'" style="width:18em" class="ogso-skin-url"/>');
        }
        $("#ogso-hud").append('&nbsp;<span id="ogso-pause">?</span>');
        state.pause = false;
        $("#ogso-pause").click(function(event){
            console.log(scr_name + ": pause click");
            state.pause = ! state.pause;
            if(state.pause != global.ogario.pause){
                console.log(scr_name + ": pause trigger");
                var code = 82; // 'R'
                $(document).trigger(jQuery.Event('keydown',{ keyCode: code, which: code }));
                $(document).trigger(jQuery.Event('keyup',{ keyCode: code, which: code }));
            }
            connect_start();
            if(state.pause){
                $("#ogso-pause").text('?');
                pause_start();
            }else{
                $("#ogso-pause").text('?');
                fake.nick = $("#nick").val();
                fake.skinURL = $("#skin").val();
                own.sendPlayerUpdate();
            }
        });
        function pause_start(){
            // 設定値の収集
            var skin_list = [];
            for(var idx = 0; idx < state.pause_skin_num; idx ++){
                var skin_url = cfg["pause_skin_url" + idx];
                if(skin_url){
                    skin_list.push(skin_url);
                }
            }
            var skin_cycle = cfg.pause_skin_cycle || 2;
            if(! cfg.pause_skin_use || skin_list.length === 0){
                return; // しない
            }
            if(cfg.pause_skin_own){
                skin_list.push( $("#skin").val());
            }
            skin_change();
            function skin_change(){
                if(! state.pause || ! global.ogario.play){
                    return;
                }
                var skin_url = skin_list.shift();
                skin_list.push(skin_url);
                own.updateCustomSkin($("#nick").val(), skin_url);
                setTimeout(skin_change, skin_cycle * 1000);
            }
        }

        // 操作画面
        opb.append('&nbsp;<select id="ogso-namesel" class="form-control" style="display: inline;"></select>');
        var namesel = $("#ogso-namesel");
        namesel.append('<option value="1" selected>名前１</option>');
        namesel.append('<option value="2">名前２</option>');
        namesel.append('<option value="3">名前３</option>');
        //$("#ogso-namesel").change(function(event){
        //    console.log(scr_name + ": name change");
        //});
        function namesel_update(){
            state.nick_list.sort(function(x, y){
                return y.seq - x.seq;
            });
            var nick_list = state.nick_list;
            namesel.empty();
            for(var idx = 0; idx < nick_list.length; idx ++){
                var nick = nick_list[idx].nick;
                var elem = document.createElement("option");
                elem.value = nick;
                elem.innerText = nick;
                namesel[0].appendChild(elem);
            }
        }
        opb.append('&nbsp;<select id="ogso-catsel" class="form-control" style="display: inline;"></select>');
        var catsel = $("#ogso-catsel");
        opb_update();
        function opb_update(){
            catsel.empty();
            for(idx = 0; idx < state.skin_num; idx ++){
                var skin_cat = cfg["skin_cat"+ idx];
                var skin_url = cfg["skin_url"+ idx];
                if(skin_cat && skin_url){
                    var elem = document.createElement("option");
                    elem.value = skin_url;
                    elem.innerText = skin_cat;
                    catsel[0].appendChild(elem);
                }
            }
            //opb.append('<input type="text" id="ogso-text" class="form-control" style="display: inline;" size="5em">');
        }
        opb.append('&nbsp;<span id="ogso-skinset" class="btn btn-success">SET</span>');
        $("#ogso-skinset").click(function(event){
            var nick = namesel.val();
            var skin_url = catsel.val();
            var skin_cat = $("#ogso-catsel option:selected").text();
            console.log(scr_name + ": skin set name="+ nick +" skin="+ skin_cat +":"+ skin_url);
            //if(cfg.msg_skinoverride){
            //    msg_send();
            //    setTimeout(function(){
            //        skin_set();
            //    }, state.msg_delay);
            //}else{
            //    skin_set();
            //}
            skin_set();
            if(cfg.msg_skinoverride){
                msg_send();
            }
            function msg_send(){
                //fake.nick = $("#nick").val();
                //fake.skinURL = $("#skin").val();
                ////own.sendPlayerNick();
                //own.sendPlayerUpdate();
                own.updateCustomSkin($("#nick").val(), $("#skin").val());
                own.sendChatMessage(0x65, skin_cat +"→"+ nick);
            }
            function skin_set(){
                //fake.nick = nick;
                //fake.skinURL = skin_url;
                //// sendPlayerNick と sendPlayerSkinURL の組み合わせでは、うまく行かない
                //////own.sendPlayerNick();
                //////own.sendPlayerSkinURL();
                //own.sendPlayerUpdate();
                own.updateCustomSkin(nick, skin_url);
            }
        });
    }

    // ニックネームキャプチャ
    own.capture_start = function(){
        real.gameMode = $('#gamemode').val();
        state.nick_seq = 0;
        state.nick_list = [];
        state.nick_hash = {};
        if(! global.ogario.ogso_save_getCustomSkin){
            global.ogario.ogso_save_getCustomSkin = global.ogario.getCustomSkin;
            global.ogario.getCustomSkin = own.capture_hook;
        }
        connect_start();
    };
    own.capture_end = function(){
        //connect_end();
        if(global.ogario.getCustomSkin != own.capture_hook){
            return; // 別のフックが設定されていて、解除できない
        }
        global.ogario.getCustomSkin = global.ogario.ogso_save_getCustomSkin;
        delete global.ogario.ogso_save_getCustomSkin;
    };
    own.capture_hook = function(nick, color){
        var skin = global.ogario.ogso_save_getCustomSkin(nick, color);
        //console.log(scr_name + ": hook nick="+ nick +" color="+ color +" skin="+ (skin ? "ari" : "nashi"));
        var id = ":party" === real.gameMode ? nick + color : nick;
        var nick_obj = state.nick_hash[id];
        if(nick_obj){
            nick_obj.seq = (++ state.nick_seq);
            nick_obj.skin = skin;
        }else{
            nick_obj = { "id": id, "nick": nick, "color": color, "skin": skin, "seq": (++ state.nick_seq) };
            state.nick_list.push(nick_obj);
            state.nick_hash[id] = nick_obj;
            //console.log(scr_name + ": add nick="+ nick_obj.nick +" color="+ nick_obj.color);
            if(state.nick_list.length > cfg.capture_size){
                state.nick_list.sort(function(x, y){
                    return y.seq - x.seq;
                });
                for(; state.nick_list.length > cfg.capture_size; ){
                    var nick_del = state.nick_list.pop();
                    delete state.nick_hash[nick_del.id];
                    //console.log(scr_name + ": del nick="+ nick_del.nick +" color="+ nick_del.color);
                }
            }
        }
        return skin;
    };

    // OGario サーバー処理
    var real = { };
    var fake = { // fake OGARio connection
        'publicIP': "ws://164.132.227.101:3000",
        "soket": null,
        "nick": "fake",
        "skinURL": "",
        "color": "#01d9cc",
        //"playerColor": window.ogario.playerColor,
        "playerColor": "#01d9cc",
    };
    function connect_start(){
        if(fake.socket){
            real.gameMode = $('#gamemode').val();
        	own.sendPartyData();
            return false; // オープン済み
        }
		fake.socket = new WebSocket(fake.publicIP);
        fake.socket.onopen = function() {
            console.log(scr_name + ": fake Socket open");
			var buf = own.createView(0x3);
			buf.setUint8(0x0, 0x0);
			buf.setUint16(0x1, 0x191, !0x0);
			own.sendBuffer(buf);
			own.sendPartyData();
		};
		fake.socket.onmessage = function(event) {
			own.handleMessage(event);
		};
		fake.socket.onclose = function(event) {
			own.flushData();
            console.log(scr_name + ": fake Socket close");
		};
		fake.socket.onerror = function(event) {
			own.flushData();
            console.log(scr_name + ": fake Socket error");
            $("#ogso-capture").text('?');
		};
    }
    function connect_end(){
        if(fake.socket){
            fake.socket.close();
            delete fake.socket;
        }
    }
    // 受信ハンドラ
	own.handleMessage = function(event){
        //console.log(scr_name + ": handleMessage");
        //console.dir(event);
        //console.log(scr_name + ": event.data type="+ typeof event.data.constructor.name);
        //   ogario コードだと
        //          own.readMessage(new DataView(event.data));
        // だが、実際には Blob で帰る
        if(ArrayBuffer.prototype.isPrototypeOf(event.data)){
           return own.readMessage(new DataView(event.data));
        }// Blob とみなす
        var fr = new FileReader();
        fr.onload = function(){
            return own.readMessage(new DataView(fr.result));
        };
        fr.onerror = function(){
            console.log(scr_name + ": message convert error");
        };
        fr.readAsArrayBuffer(event.data);
	};
	own.readMessage = function(buf){
        var msgcode = buf.getUint8(0x0);
        //console.log(scr_name + ": message code=0x"+ msgcode.toString(16));
		switch (msgcode) {
		  case 0x0:
			fake.playerID = buf.getUint32(0x1, !0x0);
            console.log(scr_name + ": get playerID="+ fake.playerID);
			break;
		  case 0x1:
            console.log(scr_name + ": request sendPlayerUpdate");
			own.sendPlayerUpdate();
			break;
		  case 0x14:
			own.updateTeamPlayer(buf);
			break;
		  case 0x1e:
			own.updateTeamPlayerPosition(buf);
			break;
		  case 0x60:
			own.updateParties(buf);
			own.displayParties();
			break;
		  case 0x64:
            console.log(scr_name + ": readChatMessage");
			own.readChatMessage(buf);
			break;
          default:
            console.log(scr_name + ": unknown message code=0x"+ msgcode.toString(16));
			break;
		}
	};
	own.sendPlayerUpdate = function(){
        var bufsize = 0x29 + 2 * fake.nick.length + 2 * fake.skinURL.length;
        var buf = own.createView(bufsize);
        buf.setUint8(0x0, 0x14);
        buf.setUint32(0x1, fake.playerID, !0x0);
        var bufidx = 0x5;
        addString(fake.nick);
        addString(fake.skinURL);
        addString(fake.color);
        addString(fake.playerColor);
        own.sendBuffer(buf);
        function addString(value){
            for(var idx = 0; idx < value.length; idx ++){
                buf.setUint16(bufidx, value.charCodeAt(idx), !0x0);
                bufidx += 2;
            }
            buf.setUint16(bufidx, 0x0, !0x0);
            bufidx += 2;
        }
        console.log(scr_name + ": sendPlayerUpdate"+
            " nick='"+ fake.nick +"'"+
            " skinURL='"+ fake.skinURL +"'"+
            " color='"+ fake.color +"'"+
            " playerColor='"+ fake.playerColor +"'");
    };
	own.updateTeamPlayer = function(buf){
    };
	own.updateTeamPlayerPosition = function(buf){
    };
	own.updateParties = function(buf){
    };
	own.displayParties = function(){
    };
	own.readChatMessage = function(buf){
        var mcode = buf.getUint8(0x1);
        var senderID = buf.getUint32(0x2, !0x0);
        var hatenaID = buf.getUint32(0x6, !0x0);
        var msg = "";
        for(var idx = 0xa; idx < buf.byteLength; idx += 2){
            var ccode = buf.getUint16(idx, !0x0);
            if(0 === ccode){
                break;
            }
            msg += String.fromCharCode(ccode);
        }
        //own.displayChatMessage(date, mcode, senderID, msg);
        console.log(scr_name + ": readChatMessage msg="+ msg);
    };
    own.sendChatMessage = function(mcode, msg){ // code 0x65:一般, 0x66:コマンド
        msg = fake.nick +': '+ msg;
        var buf = own.createView(0xa + 2 * msg.length);
        buf.setUint8(0x0, 0x64);
        buf.setUint8(0x1, mcode);
        buf.setUint32(0x2, fake.playerID, !0x0);
        buf.setUint32(0x6, 0x0, !0x0);
        for(var idx = 0; idx < msg.length; idx ++){
            buf.setUint16(0xa + 2 * idx, msg.charCodeAt(idx), !0x0);
        }// 文字列終端がない
        own.sendBuffer(buf);
    };

    // 送信処理
	own.sendPartyData = function(){
		own.sendPlayerClanTag();
		own.sendPartyToken();
		own.sendServerToken();
		own.sendPlayerNick();
		own.sendPlayerSkinURL();
        console.log(scr_name + ": sendPartyData"+
            " clanTag='"+real.clanTag +"'"+
            " PartyToken='"+ real.PartyToken +"'"+
            " ServerToken='"+ real.ServerToken +"'"+
            " nick='"+ fake.nick +"'"+
            " skinURL='"+ fake.skinURL +"'");
    };
	own.sendPlayerClanTag = function(){
        real.clanTag = $("#clantag").val();
        own.sendPlayerData(0xb, "lastSentClanTag", real.clanTag);
    };
	own.sendPartyToken = function(){
        real.PartyToken = $("#party-token").val();
        own.sendPlayerData(0xf, "lastSentClanTag", real.PartyToken);
    };
	own.sendServerToken = function(){
        real.ServerToken = $("#server-token").val();
        own.sendPlayerData(0x10, "lastSentServerToken", real.ServerToken);
    };
	own.sendPlayerNick = function(){
        own.sendPlayerData(0xa, "lastSentNick", fake.nick);
    };
	own.sendPlayerSkinURL = function(){
        own.sendPlayerData(0xc, "lastSentSkinURL", fake.skinURL);
    };
	own.sendPlayerData = function(code, last, value){
        own.sendBuffer(own.strToBuff(code, value));
        fake[last] = value;
    };

    // 汎用通信処理
	own.flushData = function(){
	};
	own.strToBuff = function (code, value){
		var buf = own.createView(1 + 2 * value.length);
        buf.setUint8(0, code);
        for (var idx = 0; idx < value.length; idx ++){
            buf.setUint16(1 + 2 * idx, value.charCodeAt(idx), !0x0);
        }// 終端の NULL 文字は出力しないみたい
        return buf;
	};
	own.sendBuffer = function(buf){
		fake.socket.send(buf.buffer);
	};
	own.createView = function(bufsize){
		return new DataView(new ArrayBuffer(bufsize));
	};
    own.updateCustomSkin = function(nick, skinURL){
        if(! fake.socket || fake.socket.readyState != WebSocket.OPEN){
            console.log(scr_name + ": soket is not open");
            return false;
        }
        fake.nick = nick;
        fake.skinURL = skinURL;
        own.sendPlayerUpdate();
    };

    // Your code here...
    function pre_loop(){
        // この時点では jQuery は使えない
        if(! document.getElementById("message-box") || ! global.ogario || ! global.ogario.getCustomSkin){
            setTimeout(pre_loop, 1000);
            console.log(scr_name + ": wait for OGARio load");
            return;
        }
        return initialize();
    }
    //return pre_loop();
})();