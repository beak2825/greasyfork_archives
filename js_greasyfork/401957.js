// ==UserScript==
// @name         Live IFBC
// @version      0.1
// @description  Meh
// @author       Thathanka
// @match        http*://ts1.events.the-west.net/game.php*
// @grant        none
// @namespace https://greasyfork.org/users/13941
// @downloadURL https://update.greasyfork.org/scripts/401957/Live%20IFBC.user.js
// @updateURL https://update.greasyfork.org/scripts/401957/Live%20IFBC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var fort_names = {};
    var incoming_fb = [];

    function sendData(channel,type,data){
        var json = {type:type,payload:data};
        $.post('https://ifbc.west-tools.info/sendData',{channel:channel,data:JSON.stringify(json)},function(res){console.log(res)});
    }

    function initLive(fortId,channel){
        EventHandler.listen('fort_battle_'+fortId + '_received_map_info', function(data){sendData(channel,'received_map_info',data)});
        EventHandler.listen('fort_battle_'+fortId + '_received_player_info', function(data){sendData(channel,'received_player_info',data)});
        EventHandler.listen('fort_battle_'+fortId + '_received_game_info', function(data){sendData(channel,'received_game_info',data)});
        EventHandler.listen('fort_battle_'+fortId + '_received_round_info', function(data){sendData(channel,'received_round_info',data)});
        EventHandler.listen('fort_battle_'+fortId + '_received_finish_msg', function(data){sendData(channel,'received_finish_msg',data)});
    }

    $.post('game.php?window=map&ajax=get_minimap',{},function(data){
        $.each(data.forts,function(i,x){
            $.each(x,function(j,y){
                if (y.fort){
                    var fort = y.fort;
                    fort_names[fort.fort_id]=fort.name;
                }
            });
        });
        Ajax.remoteCall('fort_overview','',{},function(json){
            var battles = json.js;
            for (var i =0;i<battles.length;i++){
                var fort_id = battles[i][0];
                var fort_name = fort_names[fort_id];
                incoming_fb.push({id:fort_id.toString(),name:fort_name});
            }
            openWindow();
        });
    },'json');

    function openWindow() {
        var content = $('<div style="padding:10px;"></div>');
        var combo1 = new west.gui.Combobox().addItem('null','none');
        var combo2 = new west.gui.Combobox().addItem('null','none');
        for (var i =0;i<incoming_fb.length;i++){
            var battle=incoming_fb[i];
            combo1.addItem(battle.id,battle.name);
            combo2.addItem(battle.id,battle.name);
        }
        var ready1 = false;
        var ready2 = false;
        if (localStorage.getItem('channel1')&&localStorage.getItem('channel1')!=='null'){
            initLive(localStorage.getItem('channel1'),'channel1');
            ready1=true;
            combo1.select(localStorage.getItem('channel1'));
        } else {
            combo1.select('null');
        }
        if (localStorage.getItem('channel2')&&localStorage.getItem('channel2')!=='null'){
            initLive(localStorage.getItem('channel2'),'channel2');
            ready2=true;
            combo2.select(localStorage.getItem('channel2'));
        } else {
            combo2.select('null');
        }
        content.append('<span>Channel 1: </span>').append(combo1.addListener(function(val) {
            $('#ready1').hide();
            localStorage.setItem('channel1',val);
        }).getMainDiv())
        content.append(ready1?'<span id="ready1"> Ready</span><br/>':'<br/>');
        content.append('<span>Channel 2: </span>').append(combo2.addListener(function(val) {
            $('#ready2').hide();
            localStorage.setItem('channel2',val);
        }).getMainDiv());
        content.append(ready2?'<span id="ready2"> Ready</span><br/><br/>':'<br/><br/>');
        content.append(new west.gui.Button('Apply and reload').click(function() {
            location.reload();
        }).getMainDiv());
        wman.open('west-live', null, 'west-live').setSize(350,220).setTitle("Live IFBC").setMiniTitle('Live IFBC').appendToContentPane(content);
    }

})();