// ==UserScript==
// @name         kufirc大图
// @namespace    kufirc
// @version      0.1.3
// @description  kufirc大图浏览
// @author       Afan
// @match        https://kufirc.com/torrents.php*
// @match        https://kufirc.com/top10.php
// @grant        GM_xmlhttpRequest
// @require     https://cdn.bootcss.com/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/391021/kufirc%E5%A4%A7%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/391021/kufirc%E5%A4%A7%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var torrents = function torrentlist(){
        $('tr.torrent').each(function(){
            //console.log($(this).children('td')[1]);
            //var scriptTag = $($($(this).children('td')[1]).children('script')[0]);
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