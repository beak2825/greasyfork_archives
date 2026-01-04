// ==UserScript==
// @name         1337X - Magnet/Torrent links everywhere
// @namespace    NotNeo
// @version      1.0.1
// @description  Adds magnet and torrent links everywere, e.g. directly to the torrent search results
// @author       NotNeo
// @contributor  darkred
// @license      MIT
// @include      /^https:\/\/(www\.)?1337x\.(to|st|ws|eu|se|is|gd|unblocked\.dk)((?!\/torrent)).*$/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373230/1337X%20-%20MagnetTorrent%20links%20everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/373230/1337X%20-%20MagnetTorrent%20links%20everywhere.meta.js
// ==/UserScript==
//Thanks to darkred for the improvement suggestions. You can find his version here: https://github.com/darkred/Userscripts/tree/master/1337x_-_torrent_and_magnet_links

(function() {
    'use strict';

    //true: Show the DL links as the last column
    //false: Show the DL links as the second column
    var ShowDLLinksAsLastColumn = false;

    //true: torrent = green, magnet = red
    //false: torrent = red, magnet = green
    var SwapDLLinkBUttonColors = false;



    $(function() {
		//If we are not on a page that has a list of torrents, don't run the script
        if($("table.table-list").length > 0) {
            InsertStyles();
            InsertColumns();
            InsertOnClickListeners();
        }
    });



    function InsertStyles()
    {
        addGlobalStyle(`
			main.container, div.container {
				max-width: 1600px;
			}
			table.table-list td.dl-buttons {
				padding-left: 2.5px;
				padding-right: 2.5px;
				text-align: center;
				position: relative;
				display: inline-block;
				width: 50px;
			}
			td.dl-buttons > a,
			td.dl-buttons > a:hover,
			td.dl-buttons > a:visited,
			td.dl-buttons > a:link,
			td.dl-buttons > a:active {
				color: inherit;
				text-decoration: none;
				cursor: pointer;
				display: inline-block;
				margin: 0 1.5px;
			}
			.list-dl-button-magnet > i.flaticon-magnet {
				font-size: 13px;
				color: `+(SwapDLLinkBUttonColors ? "#da3a04" : "#89ad19")+`;
			}
			.list-dl-button > i.flaticon-torrent-download {
				font-size: 13px;
				color: `+(SwapDLLinkBUttonColors ? "#89ad19" : "#da3a04")+`;
			}
			span.fetchNotifier {
				display: inline-block;
				position: absolute;
				z-index: 999;
				padding: 2px 8px;
				left: 45px;
				top: 0px;
				width: 140px;
				background-color: white;
				border: 1px black solid;
				border-radius: 20px;
			}
		`);
    }

    function InsertColumns()
    {
        let header = '<th class="coll-6" style="text-align: center;">dl</th>';
        let td = `<td class="coll-6 dl-buttons">
                      <a href="#" class="list-dl-button-magnet" title="Download via magnet"><i class="flaticon-magnet"></i></a>
                      <a href="#" class="list-dl-button" title="Download torrent file"><i class="flaticon-torrent-download"></i></a>
                  </td>`;
        if(ShowDLLinksAsLastColumn)
        {
            $("table.table-list > thead > tr").append(header);
            $("table.table-list > tbody > tr").append(td);
        }
        else
        {
            $("table.table-list > thead > tr > .name").after(header);
            $("table.table-list > tbody > tr > .name").after(td);
        }
    }

    function InsertOnClickListeners()
    {
        $("a.list-dl-button-magnet, a.list-dl-button").click(function(e) {
            let el = $(this);
            let isTorrent = el.hasClass("list-dl-button");
            let url = el.parent().parent().find("td.name > a[href^='/torrent/']").prop("href");
            if(el.prop("href").slice(-1) == "#")
            {
                e.preventDefault();
                e.stopPropagation();
                el.prop("title", "Fetching "+(isTorrent ? "torrent" : "magnet")+" link...");
                $.ajax({
                    method: "GET",
                    url: url,
                    timeout: 5000
                }).done(function(data){
                    let result = (isTorrent ?
                                  $(data).find("a[href*='itorrents.org/torrent/']").prop("href").replace('http:', 'https:') :
                                  $(data).find("a[href^='magnet:?']:first").prop("href"));
                    if(!result)
                        alert("Failed to get url from fetched page");
                    else
                    {
                        el.prop("href", result);
                        window.location.href = result;
                    }
                }).fail(function(qXHR, textStatus, errorThrown){
                    if(textStatus == "timeout")
                        alert("Fetching link timed out. Either 1337x is being slow, or something is wrong...");
                    else
                        alert("Fetching link failed: " + textStatus);
                }).always(function(){
                    el.prop("title", "Download "+(isTorrent ? "torrent file" : "via magnet"));
                });
            }
        });
    }
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
})();