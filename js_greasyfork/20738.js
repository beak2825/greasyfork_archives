// ==UserScript==
// @name FantasyLeagueExd
// @namespace http://tampermonkey.net/
// @version 0.1.3
// @description try to take over the world!
// @author Alexey Seklenkov
// @match https://www.sports.ru/fantasy/football/league/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/20738/FantasyLeagueExd.user.js
// @updateURL https://update.greasyfork.org/scripts/20738/FantasyLeagueExd.meta.js
// ==/UserScript==

var html_field_div = `
<div class="grace full-field">
<div class="forward-container">
</div>
<div class="halfback-container">
</div>
<div class="defender-container">
</div>
<div class="goalkeeper-container">
</div>
<div class="reserve-container">
</div>
</div>`;

var html_player = `
<ins data-id="[data-id]" data-amplua="[data-amplua]" class="player hold [player-class] ">
<img class="t-shirt" src="[t-shirt-url]" alt="[club]" title="[club]"><span class="name">[player-name]</span>
<span class="pl-descr">
<i class="ico point">[points]</i>
</span>	
<span class="role">[role]</span>
</ins>`;

var html_capitan_icon = '<i class="ico c"></i>';

var teams = [];
var team_ids = [];
var json_ids = [];

var team_url = "https://www.sports.ru/fantasy/football/team/points/[team_id].html";
var team_json_url = 'https://www.sports.ru/fantasy/football/team/points/[team_id]/[json_id].json';


(function() {
    'use strict';
    addFields();
    getJsonIds();
})();

function addFields() {
    var team_url = '';
    var team_name = '';
    var team_id = '';
    var new_tr = '';
    var new_td = '';
    var field_div = '';


    $(".players-rank > table > tbody > tr").each(function() {

        //собираем название команд и ссылки в массивы
        team_url = $(this).children('td').eq(2).children('a').attr('href'); //ссылка на команду
        team_name = $(this).children('td').eq(2).children('a').text(); //название команды
        var re = new RegExp("([0-9]*).html");
        team_id = re.exec(team_url)[1];
        teams.push(team_name);
        team_ids.push(team_id);

        //добавляем футбольное поле
        field_div = $(html_field_div); 
        $(field_div).attr("team", team_name);
        $(field_div).attr("team_id", team_id);
        $(field_div).css("padding-bottom", 10);
        $(field_div).css("line-height", "10px");
        $new_tr = $('<tr class="team_info" team_id = "'+team_id+'"><td/><td/></tr>'); 
        $new_td = $('<td colspan="4"></td>');
        $new_td.append(field_div);
        $new_tr.append($new_td);
        $new_tr.insertAfter($(this));
        $new_tr.toggle();
        
        //добавляем кнопку для сворачивания
        var $toggle_button = $('<button>+</button>');
        $toggle_button.addClass('toggle_button');
        $toggle_button.attr('team_id', team_id);
        $toggle_button.width("15px");
        $toggle_button.click(function(){
            $(".team_info[team_id = '"+ $(this).attr("team_id") +"' ]").toggle();
            if($(this).text() == '+') $(this).text('-');
            else $(this).text('+');
        });
        $(this).children(":first").prepend($toggle_button);
    });

}

function getJsonIds(){
    var temp_url = team_url.split('[team_id]').join(team_ids[0]);
    $.ajax({
        url: temp_url,
        type: 'get',
        dataType: 'html',
        success: function(data) {
            var $data = $(data);
            $(data).find('#fan_points_select > option').each(function (index, element) {
                var tour = $(element).text();
                var id = $(element).attr("value");
                json_ids[tour] = id;
            });

            var tour = $(".pager2.title-descr > b").text();
            $(".full-field").each(function() {
                addPlayers($(this).attr('team_id'), json_ids[tour]);
            });
        }
    });
}

function addPlayers(team_id, json_id){
    var temp_url = team_json_url.split('[team_id]').join(team_id);
    temp_url = temp_url.split('[json_id]').join(json_id);
    $.getJSON( temp_url, function( data ) {
        var players = data.players;
        for(var i = 0; i < players.length; i++){
            addPlayer(players[i], team_id);
        }
    });
}

function addPlayer(player, team_id){
    console.log(player);
    var player_class = 'player-base';
    var temp_html_player = html_player.split('[data-id]').join(player.id);
    temp_html_player = temp_html_player.split('[data-amplua]').join(player.amplua);
    temp_html_player = temp_html_player.split('[player-class]').join(player_class);
    temp_html_player = temp_html_player.split('[t-shirt-url]').join(player.img);
    temp_html_player = temp_html_player.split('[club]').join(player.club);
    temp_html_player = temp_html_player.split('[player-name]').join(player.name);
    temp_html_player = temp_html_player.split('[points]').join(player.points);
    var $player = $(temp_html_player);
    $player.css('padding', '0');
    if(player.isCaptain == 1){
        $player.append($(html_capitan_icon).css("top", "1px"));
    }
    if(player.row == 1){
        $(".full-field[team_id='"+team_id+"'] > .goalkeeper-container").each(function() {
            $(this).append($player);
        });
    }
    if(player.row == 2){
        $(".full-field[team_id='"+team_id+"'] > .defender-container").each(function() {
            $(this).append($player);
        });
    }
    if(player.row == 3){
        $(".full-field[team_id='"+team_id+"'] > .halfback-container").each(function() {
            $(this).append($player);
        });
    }
    if(player.row == 4){
        $(".full-field[team_id='"+team_id+"'] > .forward-container").each(function() {
            $(this).append($player);
        });
    }
    if(player.row == 0){
        $(".full-field[team_id='"+team_id+"'] > .reserve-container").each(function() {
            $(this).append($player);
        });
    }
}