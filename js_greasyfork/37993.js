// ==UserScript==
// @name         Abandoned Torrents List
// @description  Add an abandoned torrent list
// @version      0.1
// @author       Secant(TYT@NexusHD)
// @include      http*://www.nexushd.org/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://code.jquery.com/jquery-migrate-1.0.0.js
// @grant        none
// @icon         http://www.nexushd.org/favicon.ico
// @namespace https://greasyfork.org/users/152136
// @downloadURL https://update.greasyfork.org/scripts/37993/Abandoned%20Torrents%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/37993/Abandoned%20Torrents%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function tableRowGenerator(abandoned_table, count){
        var div_1 = $('<div>');
        div_1.append('已撤种子');
        var td_1 = $('<td>');
        td_1.attr({
            "width":"%1",
            "class":"rowhead nowrap",
            "valign":"top",
            "align":"right"
        });
        td_1.append(div_1);
        var u_1 = $('<u>');
        u_1.append('[显示/隐藏]');
        var img_1 = $('<img>');
        img_1.attr({
            "class":"plus",
            "src":"pic/trans.gif",
            "id":"pictyt",
            "alt":"Show/Hide",
            "title":"显示/隐藏"
        });
        var a_1 = $('<a>');
        a_1.attr({
            "href":"javascript: klappe_news('tyt')"
        });
        a_1.append(img_1).append('   ').append(u_1);
        var b_1 = $('<b>');
        b_1.append(' '+count);
        var div_2 = $('<div>');
        div_2.attr({
            "id":"ktyt",
            "style":"display: none;"
        });
        div_2.append(b_1).append(" 条记录").append(abandoned_table);
        var div_3 = $('<div>');
        div_3.append(a_1).append(div_2);
        var td_2 = $('<td>');
        td_2.attr({
            "width":"%99",
            "class":"rowfollow",
            "valign":"top",
            "align":"left"
        });
        td_2.append(div_3);
        var tr_1 = $('<tr>');
        tr_1.append(td_1).append(td_2);
        return(tr_1);
    }
    if(window.location.href.match(/userdetails\.php/)){
        var user_id = $('#info_block>tbody>tr>td>table>tbody>tr>td:first-child>span.medium>span>a').attr('href').match(/id=(\d+)/)[1];
        if(window.location.href.match(user_id)){
            var uploaded_table = ajax.gets('getusertorrentlistajax.php?userid='+user_id+'&type=uploaded');
            var seeding_ids = ajax.gets('getusertorrentlistajax.php?userid='+user_id+'&type=seeding').match(/details\.php\?id=\d+/g);
            var count = parseInt($(uploaded_table)[0].innerText);
            var abandoned_table = $(uploaded_table)[4];
            $(abandoned_table).find('tbody>tr>td:nth-child(2)>a').map(function(){
                if(seeding_ids.includes($(this).attr('href').match(/details\.php\?id=\d+/)[0])){
                    $(this).parent().parent().remove();
                    count--;
                }
                else{
                    var new_href = $(this).attr('href').replace(/details/,"download");
                    $(this).attr('href',new_href);
                }
            });
            $('#ka').closest('tr').after(tableRowGenerator(abandoned_table, count));
        }
    }
})();