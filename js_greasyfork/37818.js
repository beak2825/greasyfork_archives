// ==UserScript==
// @name         NexusHD Torrent Status Tag
// @description  Add seeding, leeching and snatched tags to torrents
// @version      0.2
// @author       Secant(TYT@NexusHD)
// @include      http*://www.nexushd.org/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://code.jquery.com/jquery-migrate-1.0.0.js
// @grant        none
// @icon         http://www.nexushd.org/favicon.ico
// @namespace https://greasyfork.org/users/152136
// @downloadURL https://update.greasyfork.org/scripts/37818/NexusHD%20Torrent%20Status%20Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/37818/NexusHD%20Torrent%20Status%20Tag.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function progressBarGenerator(percentage, flag){
        var percent_unit_number = Math.min((percentage*100).toFixed(2),100);
        var div_1 = $('<div>');
        if(flag===0){
            div_1.attr({
                "style":"width:100%;border-radius:2.5px;height:5px;background-color:#f7f7f7",
                "title":"已下载"+percent_unit_number+"%"
            });
        }
        else{
            div_1.attr({
                "style":"border-radius:2.5px;height:5px;background-color:#f7f7f7;margin:0.5% 5%",
                "title":"已下载"+percent_unit_number+"%"
            });
        }
        var span_1 = $('<span>');
        span_1.attr({
            "style":"border-radius:2.5px;width:"+percent_unit_number+"%;float:left;height:100%;background-color:#ffd700"
        });
        div_1.append(span_1);
        return(div_1);
    }
    function tagGenerator(name){
        var span_1 = $('<span>');
        if(name === 'Seeding'){
            span_1.attr({
                "style":"background-color: #00ff00;border-radius:5px;margin-left:5px;padding:1px 5px;color:#fff",
            });
        }
        else if(name === 'Leeching'){
            span_1.attr({
                "style":"background-color: #ffd700;border-radius:5px;margin-left:5px;padding:1px 5px;color:#fff",
            });
        }
        else if(name === 'Snatched'){
            span_1.attr({
                "style":"background-color: #ff0000;border-radius:5px;margin-left:5px;padding:1px 5px;color:#fff",
            });
        }
        var strong_1 = $('<strong>');
        strong_1.append(name);
        span_1.append(strong_1);
        return span_1;
    }
    function unitConverter(member){
        var base = parseFloat(member.match(/\d+\.\d+/));
        var index = 1/1024/1024;
        if(member.match('M')){
            index = 1/1024;
        }
        else if(member.match('G')){
            index = 1;
        }
        else if(member.match('T')){
            index = 1024;
        }
        return(base*index);
    }
    if(window.location.href.match(/torrents\.php|details\.php/)){
        var user_id = $('#info_block>tbody>tr>td>table>tbody>tr>td:first-child>span.medium>span>a').attr('href').match(/id=(\d+)/)[1];
        var seeding_ids = ajax.gets('getusertorrentlistajax.php?userid='+user_id+'&type=seeding').match(/details\.php\?id=\d+/g);
        var leeching_matrix = ajax.gets('getusertorrentlistajax.php?userid='+user_id+'&type=leeching');
        var leeching_ids = leeching_matrix.match(/details\.php\?id=\d+/g);
        var percent_array = [];
        if(leeching_ids){
            var progress_array = $($(leeching_matrix)[4]).find('tbody>tr>td:nth-child(7)').text().match(/\d+\.\d+[KMGT]B/g);
            var total_size_array = $($(leeching_matrix)[4]).find('tbody>tr>td:nth-child(3)').text().match(/\d+\.\d+[KMGT]B/g);
            for(var i = 0; i < leeching_ids.length; i++){
                percent_array.push(unitConverter(progress_array[i])/unitConverter(total_size_array[i]));
            }
        }
        var snatched_ids = ajax.gets('getusertorrentlistajax.php?userid='+user_id+'&type=completed').match(/details\.php\?id=\d+/g);
        snatched_ids = snatched_ids.filter(function(el){
            return !seeding_ids.includes(el);
        });
        if(window.location.href.match(/torrents\.php/)){
            $('#outer table.torrents>tbody>tr>td:nth-child(2)>table.torrentname>tbody>tr>td:first-child>a').map(function(){
                var this_torrent_id = $(this).attr('href').match(/details\.php\?id=\d+/)[0];
                if(seeding_ids && seeding_ids.includes(this_torrent_id)){
                    $(this).parent().find('br').before(tagGenerator('Seeding'));
                }
                else if(leeching_ids && leeching_ids.includes(this_torrent_id)){
                    var leeching_index = leeching_ids.indexOf(this_torrent_id);
                    $(this).parent().find('br').before(tagGenerator('Leeching'));
                    $(this).parent().parent().after(progressBarGenerator(percent_array[leeching_index],0));
                }
                else if(snatched_ids && snatched_ids.includes(this_torrent_id)){
                    $(this).parent().find('br').before(tagGenerator('Snatched'));
                }
            });
        }
        else{
            var this_torrent_id = window.location.href.match(/details\.php\?id=\d+/)[0];
            if(seeding_ids && seeding_ids.includes(this_torrent_id)){
                $('#top').append(tagGenerator('Seeding'));
            }
            else if(leeching_ids && leeching_ids.includes(this_torrent_id)){
                var leeching_index = leeching_ids.indexOf(this_torrent_id);
                $('#top').append(tagGenerator('Leeching'));
                $('#top').append(progressBarGenerator(percent_array[leeching_index],1));
            }
            else if(snatched_ids && snatched_ids.includes(this_torrent_id)){
                $('#top').append(tagGenerator('Snatched'));
            }
        }
    }
})();