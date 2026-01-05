// ==UserScript==
// @name         Uni FM96.7 Player Updater
// @name:zh-TW   FM96.7 環宇廣播電台線上收聽播放器調整
// @namespace    http://www.twsiyuan.com/
// @version      0.4
// @description:zh-TW  產生下載連結，修改 Flash Player 為 HTML5 內鍵撥放器
// @author       Siyuan
// @match        http://www.uni967.com/newweb/AOD*
// @match        http://www.uni967.com/newweb/index.php*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @description 產生下載連結，修改 Flash Player 為 HTML5 內鍵撥放器
// @downloadURL https://update.greasyfork.org/scripts/20335/Uni%20FM967%20Player%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/20335/Uni%20FM967%20Player%20Updater.meta.js
// ==/UserScript==

$(document).ready(function() {
    if (window.location.pathname.toString().startsWith('/newweb/AOD2_no')) {
        doPlayer();
    } else {
        doTable();
    }
});

var analysisCallback = function(embed, url, callback) {
    if (!embed) {
        return;
    }
    
    var flashvars = embed.attr("flashvars");
    if (!flashvars) {
         return;
    }
        
    // 音源位置
    var vars = /son=([^&]+)/.exec(flashvars);
    if (!vars){
        return;
    }

    var audioUrl = vars[1];

    // 節目資料網頁位置
    var ids = /ID=([0-9]+)$/.exec(url);
    if (!ids){
        return;
    }
    
    var id = ids[1];
    var dataUrl = "http://www.uni967.com/newweb/index.php?menu=2&page=2_1&ID=" + id;

    $.get(dataUrl, function(data) {
        // 分析資料網頁，抓取節目名稱
        var title = $(data).find("span.news_title_blue").text();

        callback(audioUrl, title);
    });
};

var doPlayer = function() {
    var embed = $("embed");
    analysisCallback(embed, window.location.href, function(audioUrl, title) {
         // 產生下載連結
        var download = $('<a href="' + audioUrl + '" download="' + title + '">Download (' + title + ')</a>');

        // 產生音源播放 (HTML5 標準)
        var paramSaveName = "ui967Volume";
        var volumeChanged = "if(typeof(Storage) !== 'undefined'){localStorage.setItem('" + paramSaveName + "', this.volume);}";
        var loadStart = "if(typeof(Storage) !== 'undefined'){this.volume=localStorage.getItem('" + paramSaveName + "');}";
        var playbackRateChanged = "var a = document.getElementById('audioPlayer'); a.playbackRate = this.value;";
        
        var player = $('<audio controls="true" autoplay="true" playbackRate="1.0" src="' + audioUrl + '" onvolumechange="javascript:' + volumeChanged + '" onloadstart="javascript:' + loadStart + '" style="width:100%;" id="audioPlayer">Your browser does not support the audio tag.</audio>');
        var playbackRate = $('<select onchange="javascript:' + playbackRateChanged + '"><option value="0.5">x 0.5</option><option value="0.6">x 0.6</option><option value="0.7">x 0.7</option><option value="0.8">x 0.8</option><option value="0.9">x 0.9</option><option value="1.0" selected="true">x 1.0</option><option value="1.1">x 1.1</option><option value="1.2">x 1.2</option><option value="1.3">x 1.3</option><option value="1.4">x 1.4</option><option value="1.5">x 1.5</option><option value="1.6">x 1.6</option><option value="1.7">x 1.7</option><option value="1.8">x 1.8</option><option value="1.9">x 1.9</option><option value="2.0">x 2.0</option></select>');
        var parent = embed.parent();
        
        parent.append(player);
        parent.append(playbackRate);
        parent.append(download);

        embed.remove();
    });
};

var doTable = function() {
    var links = $("a");
    links.each(function(){
        var link = $(this);
        var onclick = link.attr('onclick');
        if (onclick) {
            var arr = /window.open\('([^']+)'/.exec(onclick);
            if (arr) {
                var uri = arr[1];
                var dataUrl = "http://www.uni967.com/newweb/" + uri;

                $.get(dataUrl, function(data) {
                    var embed = /<embed(.+)<\/embed>/.exec(data);
                    if (embed) {
                        analysisCallback($(embed[0]), dataUrl, function(audioUrl, title) {
                            var parent = link.parent();
                            var download = $('<a href="' + audioUrl + '" download="' + title + '">下載</a>');

                            parent.append($('<br/>'));
                            parent.append(download);
                        });
                    }
                });
            }
        }
    });
};
