// ==UserScript==
// @name           osu! pp for Scoreboard
// @description    pp for Top 50 Scoreboard
// @author         JebwizOscar
// @icon           http://osu.ppy.sh/favicon.ico
// @include        http://osu.ppy.sh/b/*
// @include        https://osu.ppy.sh/b/*
// @include        http://osu.ppy.sh/s/*
// @include        https://osu.ppy.sh/s/*
// @include        http://osu.ppy.sh/p/beatmap?*
// @include        https://osu.ppy.sh/p/beatmap?*
// @copyright      2014, Jeb
// @version	       1.3.3.7
// @namespace https://greasyfork.org/users/3079
// @downloadURL https://update.greasyfork.org/scripts/3280/osu%21%20pp%20for%20Scoreboard.user.js
// @updateURL https://update.greasyfork.org/scripts/3280/osu%21%20pp%20for%20Scoreboard.meta.js
// ==/UserScript==

$(function() {
    suf = $('.beatmapTab.active').attr("href").replace('/b/','?b=');
    mode = $('.beatmapTab.active').attr("href").replace(/.*&m=(\d+)/,'$1');
    leader = $($($('.scoreLeader')[0]).children(0).children(0).children(0).children(0)[1]).attr("href").replace('/u/','&u=');
    me = '&u=' + localUserId;
    $.get("https://wa.vg/apis/scores.php"+suf+leader, {}, function(data) {
        for(i in data){
            $($('.scoreLeader')[0]).children(0).append('<tr class="row2p"><td><strong>pp</strong></td><td>'+data[i].pp+' pp</td><td></td></tr>');
        }
    });
    
    if ($('.scoreLeader').size()==2){
         $.get("https://wa.vg/apis/scores.php"+suf+me, {}, function(data) {
            for(i in data){
   				$($('.scoreLeader')[1]).children(0).append('<tr class="row2p"><td><strong>pp</strong></td><td>'+data[i].pp+' pp</td><td></td></tr>');
            }
        });
    }
    $.get("https://wa.vg/apis/scores.php"+suf, {}, function(data) {
        for(i in data){
            if (mode==3) $('[href="/u/'+data[i].user_id+'"]').last().parent().parent().append('<td></td>');
            $('[href="/u/'+data[i].user_id+'"]').last().parent().parent().append('<td>'+data[i].pp+'</td>');
        }
    });
    $('.titlerow').append('<th><strong>pp</strong></th>');
});
