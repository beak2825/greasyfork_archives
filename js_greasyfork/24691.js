// ==UserScript==
// @name         SportsTeamHighlighter
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       Alexey Seklenkov
// @match        http://www.sports.ru/fantasy/basketball/team/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24691/SportsTeamHighlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/24691/SportsTeamHighlighter.meta.js
// ==/UserScript==
/* jshint -W097 */

var teams = [];
var odd_color = "#f9f9f7";
var even_color = "#eaeae8";
var my_team_color = "rgba(179, 205, 166, 0.4)";

$(window).load(function(){

    //выделяем игровые дни
    var prev_date = "";
    var color = odd_color;
    $(".stat.mB20 > .stat-table > tbody > tr").each(function() {
        var date = $(this).children().first().text().split(" ")[0];
        if(prev_date !== date){
            if(color === even_color) color = odd_color;
            else color = even_color;
        }
        $(this).css('background-color', color);
        $(this).children().each(function() {
            $(this).css('background-color', color);
        });
        prev_date = date;
    });

    //отмечаем наши команды
    $(".basket-field > .player > .t-shirt").each(function() {
        teams.push($(this).attr("title"));
    });
    $(".rel > .player").each(function() {
        if (teams.indexOf($(this).text()) != -1){
            $(this).parent().parent().css('background-color', my_team_color);
            $(this).parent().children(".fader").css('display', 'none');
        }
    });

    //убераем лишнее
    $(".rel > .fader").each(function() {
        $(this).css('display', 'none');
    });
});


