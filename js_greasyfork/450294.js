// ==UserScript==
// @name         IG ChatPing
// @version      0.1.6
// @description  Otrzymujesz powiadomienie w momencie, gdy zostaniesz przez kogoś oznaczony: @{nick}, @all
// @include	https://*.the-west.*/game.php*
// @author       Igorajs
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/450294/IG%20ChatPing.user.js
// @updateURL https://update.greasyfork.org/scripts/450294/IG%20ChatPing.meta.js
// ==/UserScript==

(function() {
    IG_ChatPing = {
        rooms: {},
        pings: {},
        options:{
            sound_personal: true,
            sound_all: true,
            color_personal: true,
            color_all: true,
            cd: 15,
            default_soundlink_p: "https://ia601404.us.archive.org/30/items/tgtbtu-personal/tgtbtu-personal.mp3",
            default_soundlink_a: "https://ia601505.us.archive.org/17/items/tgtbtu-all/tgtbtu-all.mp3",
            soundlink_p: "https://ia601404.us.archive.org/30/items/tgtbtu-personal/tgtbtu-personal.mp3",
            soundlink_a: "https://ia601505.us.archive.org/17/items/tgtbtu-all/tgtbtu-all.mp3"
        },
        last_ping: 0,
        wr : null,
        blob : new Blob(["onmessage = function(e){setInterval(t,1000);}; t = function(){postMessage('IG');};"]),
        wrOn: function(){
            let blobURL = window.URL.createObjectURL(IG_ChatPing.blob);
            IG_ChatPing.wr = new Worker(blobURL);
            IG_ChatPing.wr.onmessage = function(e) {
                IG_ChatPing.check();
            };
            IG_ChatPing.wr.postMessage("IG");
        },
        init: function(){
            IG_ChatPing.build_html();
            IG_ChatPing.load_options();
            IG_ChatPing.check(true);
            IG_ChatPing.wrOn();
        },
        check: function(first = false){
            const name = Character.name.toLowerCase();
            let rooms = Object.values(IG_ChatPing.rooms);
            let opt = IG_ChatPing.options;
            $(rooms).each(function(ind,element){
                if(!isDefined(IG_ChatPing.pings[element.id])){
                    IG_ChatPing.pings[element.id]={"count": 0,"id":element.id};
                }
                $(element.history).each(function(index,elm){
                    if(elm.toLowerCase().includes("@"+name) || elm.toLowerCase().includes("@all")){
                        if(!elm.includes("ping_new") && !elm.includes("ping_old")){
                            const n = elm.toLowerCase().includes("@"+name);
                            const w = elm.toLowerCase().includes("@all");
                            //If @{nick} and @all is true
                            if(n && w){
                                //First load
                                if(first){
                                    //If pc and ac is true OR  pc = true and ac = false OR pc = false and ac = true
                                    if((opt.color_personal && opt.color_all)||(opt.color_personal && opt.color_all == false)||(opt.color_personal == false && opt.color_all)){
                                        IG_ChatPing.rooms[element.id].history[index] = elm.replace(`<table cellpadding='0' cellspacing='0'`,`<table cellpadding='0' cellspacing='0'`).replace("<tr>","<tr class='ping_old' style='background-color: rgb(221 221 221 / 50%);'>");
                                        if($(".chat_room."+element.id).length > 0){
                                            $(".chat_room."+element.id).find(".tw2gui_scrollpane_clipper_contentpane").eq(1).children().eq(index).find("tr").addClass("ping_old").css("background-color","rgb(\221 221 221 / 50%\)");
                                        }
                                    }
                                    //If pc and ac is false
                                    else{
                                        IG_ChatPing.rooms[element.id].history[index] = elm.replace(`<table cellpadding='0' cellspacing='0'`,`<table cellpadding='0' cellspacing='0'`).replace("<tr>","<tr class='ping_old'>");
                                    }
                                }
                                //Normal load
                                else{
                                    //If pc and ac is true OR  pc = true and ac = false OR pc = false and ac = true
                                    if((opt.color_personal && opt.color_all)||(opt.color_personal && opt.color_all == false)||(opt.color_personal == false && opt.color_all)){
                                        IG_ChatPing.rooms[element.id].history[index] = elm.replace(`<table cellpadding='0' cellspacing='0'`,`<table cellpadding='0' cellspacing='0' onmouseover='IG_ChatPing.conf(this,"${element.id}")'`).replace("<tr>","<tr class='ping_new' style='background-color: rgb(64 35 255 / 75%);'>");
                                        IG_ChatPing.pings[element.id]["count"]++;
                                        if($(".chat_room."+element.id).length > 0){
                                            $(".chat_room."+element.id).find(".tw2gui_scrollpane_clipper_contentpane").eq(1).children().eq(index).attr('onmouseover','IG_ChatPing.conf(this,"'+element.id+'")');
                                            $(".chat_room."+element.id).find(".tw2gui_scrollpane_clipper_contentpane").eq(1).children().eq(index).find("tr").addClass("ping_new").css("background-color","rgb(64 35 255 / 75%)")
                                        }
                                    }
                                    //If pc and ac is false
                                    else{
                                        IG_ChatPing.rooms[element.id].history[index] = elm.replace(`<table cellpadding='0' cellspacing='0'`,`<table cellpadding='0' cellspacing='0'`).replace("<tr>","<tr class='ping_old'>");
                                        if($(".chat_room."+element.id).length > 0){
                                            $(".chat_room."+element.id).find(".tw2gui_scrollpane_clipper_contentpane").eq(1).children().eq(index).find("tr").addClass("ping_old");
                                        }
                                    }
                                    //Play sound
                                    if(opt.sound_personal){
                                        IG_ChatPing.play_personal();
                                    }
                                    else if(opt.sound_all){
                                        IG_ChatPing.play_all();
                                    }
                                }
                            }
                            //If @{nick} is true
                            else if(n && w == false){
                                //First load
                                if(first){
                                    //If pc is true
                                    if(opt.color_personal){
                                        IG_ChatPing.rooms[element.id].history[index] = elm.replace(`<table cellpadding='0' cellspacing='0'`,`<table cellpadding='0' cellspacing='0'`).replace("<tr>","<tr class='ping_old' style='background-color: rgb(221 221 221 / 50%);'>");
                                        if($(".chat_room."+element.id).length > 0){
                                            $(".chat_room."+element.id).find(".tw2gui_scrollpane_clipper_contentpane").eq(1).children().eq(index).find("tr").addClass("ping_old").css("background-color","rgb(\221 221 221 / 50%\)");
                                        }
                                    }
                                    //If pc is false
                                    else{
                                        IG_ChatPing.rooms[element.id].history[index] = elm.replace(`<table cellpadding='0' cellspacing='0'`,`<table cellpadding='0' cellspacing='0'`).replace("<tr>","<tr class='ping_old'>");
                                    }
                                }
                                //Normal load
                                else{
                                    //If pc is true
                                    if((opt.color_personal)){
                                        IG_ChatPing.rooms[element.id].history[index] = elm.replace(`<table cellpadding='0' cellspacing='0'`,`<table cellpadding='0' cellspacing='0' onmouseover='IG_ChatPing.conf(this,"${element.id}")'`).replace("<tr>","<tr class='ping_new' style='background-color: rgb(64 35 255 / 75%);'>");
                                        IG_ChatPing.pings[element.id]["count"]++;
                                        if($(".chat_room."+element.id).length > 0){
                                            $(".chat_room."+element.id).find(".tw2gui_scrollpane_clipper_contentpane").eq(1).children().eq(index).attr('onmouseover','IG_ChatPing.conf(this,"'+element.id+'")');
                                            $(".chat_room."+element.id).find(".tw2gui_scrollpane_clipper_contentpane").eq(1).children().eq(index).find("tr").addClass("ping_new").css("background-color","rgb(64 35 255 / 75%)")
                                        }
                                    }
                                    //If pc is false
                                    else{
                                        IG_ChatPing.rooms[element.id].history[index] = elm.replace(`<table cellpadding='0' cellspacing='0'`,`<table cellpadding='0' cellspacing='0'`).replace("<tr>","<tr class='ping_old'>");
                                        if($(".chat_room."+element.id).length > 0){
                                            $(".chat_room."+element.id).find(".tw2gui_scrollpane_clipper_contentpane").eq(1).children().eq(index).find("tr").addClass("ping_old");
                                        }
                                    }
                                    //Play sound
                                    if(opt.sound_personal){
                                        IG_ChatPing.play_personal();
                                    }
                                }
                            }
                            //If @all is true
                            else{
                                //First load
                                if(first){
                                    //If ac is true
                                    if(opt.color_all){
                                        IG_ChatPing.rooms[element.id].history[index] = elm.replace(`<table cellpadding='0' cellspacing='0'`,`<table cellpadding='0' cellspacing='0'`).replace("<tr>","<tr class='ping_old' style='background-color: rgb(221 221 221 / 50%);'>");
                                        if($(".chat_room."+element.id).length > 0){
                                            $(".chat_room."+element.id).find(".tw2gui_scrollpane_clipper_contentpane").eq(1).children().eq(index).find("tr").addClass("ping_old").css("background-color","rgb(\221 221 221 / 50%\)");
                                        }
                                    }
                                    //If ac is false
                                    else{
                                        IG_ChatPing.rooms[element.id].history[index] = elm.replace(`<table cellpadding='0' cellspacing='0'`,`<table cellpadding='0' cellspacing='0'`).replace("<tr>","<tr class='ping_old'>");
                                    }
                                }
                                //Normal load
                                else{
                                    //If ac is true
                                    if((opt.color_all)){
                                        IG_ChatPing.rooms[element.id].history[index] = elm.replace(`<table cellpadding='0' cellspacing='0'`,`<table cellpadding='0' cellspacing='0' onmouseover='IG_ChatPing.conf(this,"${element.id}")'`).replace("<tr>","<tr class='ping_new' style='background-color: rgb(64 35 255 / 75%);'>");
                                        IG_ChatPing.pings[element.id]["count"]++;
                                        if($(".chat_room."+element.id).length > 0){
                                            $(".chat_room."+element.id).find(".tw2gui_scrollpane_clipper_contentpane").eq(1).children().eq(index).attr('onmouseover','IG_ChatPing.conf(this,"'+element.id+'")');
                                            $(".chat_room."+element.id).find(".tw2gui_scrollpane_clipper_contentpane").eq(1).children().eq(index).find("tr").addClass("ping_new").css("background-color","rgb(64 35 255 / 75%)")
                                        }
                                    }
                                    //If ac is false
                                    else{
                                        IG_ChatPing.rooms[element.id].history[index] = elm.replace(`<table cellpadding='0' cellspacing='0'`,`<table cellpadding='0' cellspacing='0'`).replace("<tr>","<tr class='ping_old'>");
                                        if($(".chat_room."+element.id).length > 0){
                                            $(".chat_room."+element.id).find(".tw2gui_scrollpane_clipper_contentpane").eq(1).children().eq(index).find("tr").addClass("ping_old");
                                        }
                                    }
                                    //Play sound
                                    if(opt.sound_all){
                                        IG_ChatPing.play_all();
                                    }
                                }
                            }
                            IG_ChatPing.ping_info();
                        }
                    }
                })
            })
       },
        conf: function(el,id){
            $(el).removeAttr("onmouseover","");
            $(el).find("tr").removeClass("ping_new").addClass("ping_old").css("background-color","rgb(221 221 221 / 50%)");
            let index = $(el).index();
            IG_ChatPing.rooms[id].history[index] = IG_ChatPing.rooms[id].history[index].replace(`<table cellpadding='0' cellspacing='0' onmouseover='IG_ChatPing.conf\(this,"${id}"\)'`,"<table cellpadding='0' cellspacing='0'").replace("ping_new","ping_old").replace(`style='background-color: rgb\(64 35 255 / 75%\);'`,`style='background-color: rgb\(221 221 221 / 50%\);'`)
            IG_ChatPing.pings[id]["count"]--;
            IG_ChatPing.ping_info();
        },
        ping_info: function(){
            const rooms = IG_ChatPing.rooms;
            const pings = IG_ChatPing.pings;
            $(Object.keys(pings)).each(function(ind,element){
                if(!isDefined(rooms[element])){
                    delete pings[element];
                }
            });
            $(Object.values(pings)).each(function(ind,element){
                if($("#"+element.id).find(".igchatspan").length == 0){
                    $("<span class='igchatspan' style='color:#e32525;font-weight:800;'></span>").insertBefore($("#"+element.id).find("strong"));
                    if(element.count > 0){
                        $("#"+element.id).find(".igchatspan").html("("+element.count+")");
                    }else{
                        $("#"+element.id).find(".igchatspan").html("");
                    }
                }else{
                    if(element.count > 0){
                        $("#"+element.id).find(".igchatspan").html("("+element.count+")");
                    }else{
                        $("#"+element.id).find(".igchatspan").html("");
                    }
                }
            });
        },
        play_personal: function(){
            if(IG_ChatPing.last_ping + IG_ChatPing.options.cd <= Math.floor(Date.now() / 1000)){
                new Audio(IG_ChatPing.options.soundlink_p).play();
                IG_ChatPing.last_ping = Math.floor(Date.now() / 1000);
            }
        },
        play_all: function(){
            if(IG_ChatPing.last_ping + IG_ChatPing.options.cd <= Math.floor(Date.now() / 1000)){
                new Audio(IG_ChatPing.options.soundlink_a).play();
                IG_ChatPing.last_ping = Math.floor(Date.now() / 1000);
            }
        },
        save_options: function(){
            IG_ChatPing.options.sound_personal = $("#op_ps").prop('checked');
            IG_ChatPing.options.sound_all = $("#op_as").prop('checked');
            IG_ChatPing.options.color_personal = $("#op_pc").prop('checked');
            IG_ChatPing.options.color_all = $("#op_ac").prop('checked');
            if($("#p_sound").val()!= ""){
                IG_ChatPing.options.soundlink_p = $("#p_sound").val();
            }else{
                IG_ChatPing.options.soundlink_p = IG_ChatPing.options.default_soundlink_p;
                $("#p_sound").attr("value", IG_ChatPing.options.default_soundlink_p);
            }
            if($("#a_sound").val()!= ""){
                IG_ChatPing.options.soundlink_a = $("#a_sound").val();
            }else{
                IG_ChatPing.options.soundlink_a = IG_ChatPing.options.default_soundlink_a;
                $("#a_sound").attr("value", IG_ChatPing.options.default_soundlink_a);
            }
            if(!isNaN($("#cd_value").val()) && !($("#cd_value").val() == "") && $("#cd_value").val() >= 0){
                IG_ChatPing.options.cd = parseInt($("#cd_value").val());
                $("#cd_value").attr("placeholder",$("#cd_value").val());
            }

            let tab = [];
                if(typeof(Storage) !== "undefined"){
                    tab.push($("#op_ps").prop('checked'));
                    tab.push($("#op_as").prop('checked'));
                    tab.push($("#op_pc").prop('checked'));
                    tab.push($("#op_ac").prop('checked'));
                    tab.push(IG_ChatPing.options.soundlink_p);
                    tab.push(IG_ChatPing.options.soundlink_a);
                    if(!isNaN($("#cd_value").val()) && !($("#cd_value").val() == "") && $("#cd_value").val() >= 0){
                        tab.push(parseInt($("#cd_value").val()));
                    }
                    localStorage.setItem("IG_ChatPing", JSON.stringify(tab));
                }
        },
        load_options: function(){
            if(typeof(Storage) !== "undefined"){
                if(localStorage.getItem("IG_ChatPing"))
                {
                    let igchatping = JSON.parse(localStorage.getItem("IG_ChatPing"));

                    document.getElementById("op_ps").checked = igchatping[0];
                    document.getElementById("op_as").checked = igchatping[1];
                    document.getElementById("op_pc").checked = igchatping[2];
                    document.getElementById("op_ps").checked = igchatping[3];
                    $("#p_sound").attr("value", igchatping[4]);
                    $("#a_sound").attr("value", igchatping[5]);
                    IG_ChatPing.options.sound_personal = igchatping[0];
                    IG_ChatPing.options.sound_all = igchatping[1];
                    IG_ChatPing.options.color_personal = igchatping[2];
                    IG_ChatPing.options.color_all = igchatping[3];
                    IG_ChatPing.options.soundlink_p = igchatping[4];
                    IG_ChatPing.options.soundlink_a = igchatping[5];
                    if(typeof(igchatping[6])!== "undefined"){
                        IG_ChatPing.options.cd = igchatping[6];
                        $("#cd_value").attr("placeholder",igchatping[6]);
                    }
                }
            }
        },
        build_html: function(){
            var html = '<div id="ChatPingGUI" style="display: none;background-color: rgba(216, 221, 195, 0.89);height: 300px;width: 300px;position: absolute;z-index: 40;bottom: 170px;left: 5px;border: 2px solid black;border-radius: 20px;box-sizing: border-box;box-shadow: rgb(66, 68, 90) -1px 8px 24px 0px;overflow: hidden;"><div style="width: 100%;background-color: black;height: 25px;display: flex;align-items: center;box-shadow: -3px 22px 28px -8px rgb(66 68 90);"><div style="width: 100%;color: whitesmoke;text-align: center;font-size: 18px;">IG_ChatPing</div><div style="color: white; position: absolute; right: 0px; width: 37px; height: 25px; text-align: center; display: flex; background-color: rgb(255, 0, 48); align-items: center; justify-content: center; cursor: pointer;" onmouseover="IG_ChatPing.hover(this)" onmouseout="IG_ChatPing.out(this)" onclick="IG_ChatPing.open_gui()">X</div></div><div style="width: 100%;height: 30px;display: flex;flex-wrap: nowrap;align-content: center;justify-content: space-around;align-items: center;"><div style="width: 30%;display: flex;justify-content: center;align-items: center;"><input type="checkbox" id="op_ps" checked=""></div><div style="display: flex;width: 70%;align-content: center;justify-content: flex-start;align-items: center;"><span>Powiadomienia przy @nick</span></div></div><div style="width: 100%;height: 30px;display: flex;flex-wrap: nowrap;align-content: center;justify-content: space-around;align-items: center;"><div style="width: 30%;display: flex;justify-content: center;align-items: center;"><input type="checkbox" id="op_as" checked=""></div><div style="display: flex;width: 70%;align-content: center;justify-content: flex-start;align-items: center;"><span>Powiadomienia przy @all</span></div></div><div style="width: 100%;height: 30px;display: flex;flex-wrap: nowrap;align-content: center;justify-content: space-around;align-items: center;"><div style="width: 30%;display: flex;justify-content: center;align-items: center;"><input type="checkbox" id="op_pc" checked=""></div><div style="display: flex;width: 70%;align-content: center;justify-content: flex-start;align-items: center;"><span>Koloruj @nick</span></div></div><div style="width: 100%;height: 30px;display: flex;flex-wrap: nowrap;align-content: center;justify-content: space-around;align-items: center;"><div style="width: 30%;display: flex;justify-content: center;align-items: center;"><input type="checkbox" id="op_ac" checked=""></div><div style="display: flex;width: 70%;align-content: center;justify-content: flex-start;align-items: center;"><span>Koloruj @all</span></div></div><div style="width: 100%;height: 30px;display: flex;flex-wrap: nowrap;align-content: center;justify-content: space-around;align-items: center;"><div style="width: 100%;display: flex;justify-content: center;align-items: center;"><span>Maksymalnie 1 dźwięk na </span><input type="number" id="cd_value" style="width: 50px;text-align: center;" placeholder="4"><span>s.</span></div></div><div style="width: 100%;height: 40px;display: flex;flex-wrap: wrap;align-content: center;justify-content: space-around;align-items: center;"><div style="width: 100%;display: flex;justify-content: center;align-items: center;"><span>Dźwięk dla powiadomienia @nick</span></div><div style="width: 100%;display: flex;align-items: center;justify-content: center;"><input type="text" id="p_sound" title="Sprawdź czy strona akceptuje podany link. Jeżeli chcesz wrócić do wartości domyślnej, pozostaw pole puste i zapisz."><input type="submit" value="Sprawdź" onclick="IG_ChatPing.test_sound(1)"></div></div><div style="width: 100%;height: 40px;display: flex;flex-wrap: wrap;align-content: center;justify-content: space-around;align-items: center;"><div style="width: 100%;display: flex;justify-content: center;align-items: center;"><span>Dźwięk dla powiadomienia @all</span></div><div style="width: 100%;display: flex;align-items: center;justify-content: center;"><input type="text" id="a_sound" title="Sprawdź czy strona akceptuje podany link. Jeżeli chcesz wrócić do wartości domyślnej, pozostaw pole puste i zapisz."><input type="submit" value="Sprawdź" onclick="IG_ChatPing.test_sound(2)"></div></div><div style="width: 100%;height: 30px;margin-top: 5px;display: flex;flex-wrap: nowrap;align-content: center;justify-content: space-around;align-items: center;"><input type="submit" onclick="IG_ChatPing.save_options()" value="Zapisz"></div></div>'
            $(html).insertBefore("#ui_bottomleft");
            $(".general.active").append('<span style="display: block;float: right;cursor: pointer;" onclick="IG_ChatPing.open_gui()">IG_ChatPing</span>');
            $("#p_sound").attr("value",IG_ChatPing.options.soundlink_p);
            $("#a_sound").attr("value",IG_ChatPing.options.soundlink_a);
        },
        hover: function(el){
            $(el).css("background-color","#ff7575")
        },
        out: function(el){
            $(el).css("background-color","#ff0030")
        },
        open_gui: function(){
            $("#ChatPingGUI").toggle();
        },
        test_sound: function(nr){
            if(nr == 1){
                new Audio($("#p_sound").val()).play();
            }else{
                new Audio($("#a_sound").val()).play();
            }
        }
    }
    setTimeout(IG_ChatPing.init,7000);
    Chat.Resource.Manager = function() {
        var rooms = IG_ChatPing.rooms;
        var clients = {};
        var acquireRoom = function(roomData) {
            var room = rooms[roomData.id]
              , created = false;
            if (undefined === room) {
                room = Chat.Resource.RoomFactory(roomData);
                rooms[roomData.id] = room;
                created = true;
            }
            room.update(roomData);
            if (created) {
                EventHandler.signal("chat_room_added", [room]);
            }
            return room;
        };
        var acquireClient = function(clientData) {
            var client = clients[clientData.id];
            if (undefined === client) {
                if (Chat.MyId == clientData.id)
                    client = new Chat.Resource.LocalClient(clientData.id);
                else
                    client = new Chat.Resource.Client(clientData.id);
                clients[client.id] = client;
            }
            client.update(clientData);
            return client;
        };
        var getRoom = function(id) {
            return rooms[id] || null;
        };
        return {
            acquireRoom: acquireRoom,
            getRoom: getRoom,
            getRooms: function(asObj) {
                var tmp = {};
                for (var k in rooms)
                    tmp[k] = rooms[k];
                return tmp;
            },
            getGeneralRoom: function() {
                for (var k in rooms) {
                    if (rooms[k]instanceof Chat.Resource.RoomGeneral)
                        return rooms[k];
                }
                return null;
            },
            releaseRoom: function(id) {
                if (id instanceof Chat.Resource.Room)
                    id = id.id;
                if (undefined !== rooms[id]) {
                    var room = rooms[id];
                    if (0 != room.clients.length)
                        return false;
                    delete rooms[id];
                    EventHandler.signal("chat_room_removed", [room]);
                }
                return true;
            },
            hasRoom: function(id) {
                return null != getRoom(id);
            },
            acquireClient: acquireClient,
            getClient: function(id) {
                return clients[id] || null;
            },
            getClients: function() {
                var tmp = {};
                for (var k in clients)
                    tmp[k] = k;
                return tmp;
            },
            releaseClient: function(id) {
                if (id instanceof Chat.Resource.Client)
                    id = id.id;
                if (id == Chat.MyId || Chat.Friendslist.isFriend(id))
                    return false;
                if (undefined !== clients[id]) {
                    var client = clients[id];
                    if (!$.isEmptyObject(client.rooms))
                        return false;
                    delete clients[id];
                    client.setStatus(Chat.Resource.Client.STATUS_OFFLINE);
                    EventHandler.signal("chat_client_removed", [client]);
                }
                return true;
            }
        }
    }();
    })();