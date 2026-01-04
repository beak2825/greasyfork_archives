// ==UserScript==
// @name        Qbittorrent QuickClick
// @author      nameForgotten
// @license     MIT
// @namespace   nameForgotten
// @match       http://*.lan:8081/
// @version     0.2.7
// @description Click to Open File
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/386868/Qbittorrent%20QuickClick.user.js
// @updateURL https://update.greasyfork.org/scripts/386868/Qbittorrent%20QuickClick.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    function get_open_url(full_path)
    {
    	var format_map = {"${host}": window.location.hostname, "${port}": window.location.port};

        var format_str;
        if(typeof GM_getValue === 'undefined' || GM_getValue === null ||
           typeof GM_getValue('format_str') === 'undefined')
        {
            format_str = "http://${host}:8080";
        }
        else
        {
            format_str = GM_getValue('format_str');
        }

        // replace windows path to linux path
        if(full_path.match(/^[A-Z]:\\/i))
        {
           full_path = full_path.replace(/^[A-Z]:/i, function(match) {
               return "/" + match[0].toUpperCase();
           }).replace(/\\/g,"/");
        }

    	var raw_open_url = format_str.replace(/\$\{\w+\}/g, function(all) {
   			return format_map[all] || all;
		}) + full_path;

        var open_url = encodeURI(raw_open_url);
		console.log("Open URL:" + open_url);
		return open_url;
    }

    (function() {

        $('body').one('DOMNodeInserted', '#filesTable',function(){
            var evt_name = 'dblclick';
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
            {
                evt_name = 'click';
            }

            $('#filesTable').on(evt_name, 'tr > td:nth-child(2)', function(evt) {

                var rel_path = $(this).text();

                var current_hash = torrentsTable.getCurrentTorrentHash();

				if (current_hash === "") {
					alert('Qbittorrent QuickClick: Torrent Hash not Found!');
				    return;
				}

				var url = encodeURI('api/v2/torrents/properties?hash=' + current_hash);

				$.ajax({
				    url: url,
				    cache: true,
				    method: 'GET',
				}).
				done(function(data) {
				        if (data) {
				            // Update Torrent data
				            var full_path = data.save_path + rel_path;
				            console.log('Full Path:' + full_path);

                            var win = window.open(get_open_url(full_path), '_blank');
							if (win) {
							    //Browser has allowed it to be opened
							    win.focus();
							} else {
							    //Browser has blocked it
							    alert('Please allow popups for this website');
							}
				        }
				        else
				        {
				        	alert('Qbittorrent QuickClick: data is empty' + url);
				        }
				    }).
				fail(function() {
			        alert('Qbittorrent QuickClick: 无法获取种子保存路径, Hash ' + current_hash);
			    });
            });
        });
    })();

})(jQuery.noConflict(true));