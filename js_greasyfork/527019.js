// ==UserScript==
// @name         Kufirc 大图
// @namespace    Kufirc
// @version      2.0
// @description  在Kufirc的torrent列表显示大图
// @author       Ms Studio
// @match        https://kufirc.com/torrents.php*
// @match        https://kufirc.com/top10.php
// @icon         https://kufirc.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/jquery@2.1.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/527019/Kufirc%20%E5%A4%A7%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/527019/Kufirc%20%E5%A4%A7%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var torrents = function torrentlist(){
        $('tr.torrent').each(function(){
            $(this).find('td script').each(function(){
                var pattern = /src=([^>]+)>/;
                console.log($(this).html().match(pattern)[1])
                var imgsrc = $(this).html().match(pattern)[1].replace(/\\"/g, '').replace(/\/\//g,'/').replace(/(?!:)\\\//g,'/');
                //console.log(imgsrc);
                $(this).after('<td><img src="'+imgsrc+'" style="max-width:700px;height:auto;"></td>');
            });
        });
    };
    torrents();
})();