// ==UserScript==
// @name           osu! pp for Scoreboard [Offline Ver.]
// @namespace      http://wa.vg/
// @author         JebwizOscar
// @icon           http://osu.ppy.sh/favicon.ico
// @include        http://osu.ppy.sh/b/*
// @include        https://osu.ppy.sh/b/*
// @include        http://osu.ppy.sh/s/*
// @include        https://osu.ppy.sh/s/*
// @include        http://osu.ppy.sh/p/beatmap?*
// @include        https://osu.ppy.sh/p/beatmap?*
// @include        https://osu.ppy.sh/p/api
// @include        http://osu.ppy.sh/p/api
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @copyright      2016, ieb
// @version        16.07.23.3
// @namespace      https://greasyfork.org/users/3079
// @require        https://code.jquery.com/jquery-1.8.3.min.js
// @description    a remake of https://greasyfork.org/en/scripts/3280-osu-pp-for-scoreboard (osu! pp for Scoreboard)
// @downloadURL https://update.greasyfork.org/scripts/21605/osu%21%20pp%20for%20Scoreboard%20%5BOffline%20Ver%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/21605/osu%21%20pp%20for%20Scoreboard%20%5BOffline%20Ver%5D.meta.js
// ==/UserScript==
key = GM_getValue("osu-api-key", "none");
url = document.location.href;

if (~url.indexOf('/api')) {
    if (typeof ($($('.feedback div')[2]).text().split(' ')[2]) !== 'undefined') {
        key = $($('.feedback div')[2]).text().split(' ')[2];
        GM_setValue("osu-api-key", key);
        alert("New Key Updated: " + key);
    }
} else {
    if (key !== "none") {
        endpoint = '/api/get_scores?k='+key;
        suf = $('.beatmapTab.active').attr("href").replace('/b/','&b=');
        mode = $('.beatmapTab.active').attr("href").replace(/.*&m=(\d+)/,'$1');
        leader = $($($('.scoreLeader')[0]).children(0).children(0).children(0).children(0)[1]).attr("href").replace('/u/','&u=');
        $.get(endpoint+suf+leader, {}, function(data) {
            for(var i in data){
                $($('.scoreLeader')[0]).children(0).append('<tr class="row2p"><td><strong>pp</strong></td><td>'+data[i].pp+' pp</td><td></td></tr>');
            }
        });
        if (typeof localUserId !== "undefined") {
            me = '&u=' + localUserId;
            if ($('.scoreLeader').size()==2){
                $.get(endpoint+suf+me, {}, function(data) {
                    for(var i in data){
                        $($('.scoreLeader')[1]).children(0).append('<tr class="row2p"><td><strong>pp</strong></td><td>'+data[i].pp+' pp</td><td></td></tr>');
                    }
                });
            }
        }
        $.get(endpoint+suf, {}, function(data) {
            for(var i in data){
                if (mode==3) $('[href="/u/'+data[i].user_id+'"]').last().parent().parent().append('<td></td>');
                $('[href="/u/'+data[i].user_id+'"]').last().parent().parent().append('<td>'+data[i].pp+'</td>');
            }
        });
        $('.titlerow').append('<th><strong>pp</strong></th>');
        unsafeWindow.delKey = function(){
            GM_deleteValue("osu-api-key");
            window.location.reload();
        };
        $('[name=scores]').after('<a href="/p/api"><strong>Current API Key: '+key.substr(0,8)+'</strong></a> &middot; <a onclick="delKey()"><strong>[remove]</strong></a>');
    } else {
        $('[name=scores]').after('<a href="/p/api"><strong>Get your API key for pp script here</strong></a>');
    }
}