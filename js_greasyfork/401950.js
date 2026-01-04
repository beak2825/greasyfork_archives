// ==UserScript==
// @name         FB Live IFBC3
// @version      0.1
// @description  Meh
// @author       Thathanka
// @match        http*://ts1.events.the-west.net/game.php*
// @grant        none
// @namespace https://greasyfork.org/users/13941
// @downloadURL https://update.greasyfork.org/scripts/401950/FB%20Live%20IFBC3.user.js
// @updateURL https://update.greasyfork.org/scripts/401950/FB%20Live%20IFBC3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    FortOverviewWindow.CurrentBattles._initContent = function() {
        var maindiv = $('<div class="fortoverv" class="fortoverv-currentbattles"></div>');

        maindiv.append($("#fo_hiddenContent #incomingbattle", FortOverviewWindow.DOM).html());
        FortOverviewWindow.window.$('div.fortoverview-currentbattles', FortOverviewWindow.DOM).empty().append(maindiv).show();
        $('a.fo_fort_name', FortOverviewWindow.DOM).attr('title', '<span class="text_bold">' + _('Fort anzeigen') + '</span>');
        $('a.fo_town_name', FortOverviewWindow.DOM).attr('title', '<span class="text_bold">' + _('Town anzeigen') + '</span>');
        // enable selectable fortbattle names (WEST-5543)
        $('div.fortOverviewBox', FortOverviewWindow.DOM).addClass('selectable');
        $('div.fortOverviewBox').each(function(){
            var box = $(this);
            var fort_id = $(this).find('span[class^="fortBattle"]:first').attr('class').split(' ')[0].substring(10);
            $(this).append('<br/><span><strong>Fort id: </strong>'+fort_id+'</span>');
        })

    };

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

    initLive(115,'channel1');
    initLive(113,'channel2');
})();