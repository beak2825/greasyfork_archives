// ==UserScript==
// @name         YouTube Downloader - By Wígny Almeida
// @namespace    http://tampermonkey.net/
// @copyright    Wígny Almeida | wigny.github.io
// @homepageURL  https://goo.gl/qkTWvG
// @version      2.4.5
// @description  Download Audio and Video from Youtube
// @author       Wígny Almeida
// @date         11-29-2017
// @license      CC BY-NC-SA 4.0
// @match        https://www.youtube.com/*
// @include      http*://*.youtube.com/*
// @include      http*://youtube.com/*
// @include      http*://*.youtu.be/*
// @include      http*://youtu.be/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @icon         https://www.youtube.com/yts/img/favicon-vfl8qSV2F.ico




// @downloadURL https://update.greasyfork.org/scripts/35777/YouTube%20Downloader%20-%20By%20W%C3%ADgny%20Almeida.user.js
// @updateURL https://update.greasyfork.org/scripts/35777/YouTube%20Downloader%20-%20By%20W%C3%ADgny%20Almeida.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here..
    $(document).ready(function(){
        $('head').append('<link rel="stylesheet" type="text/css" media="all" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">');

        //Acesse https://wigny.github.io

        //Add clickable icon
        function add_btn_url_atual(){
            var parent = document.querySelector('#top-row');
            var url = window.location.href;
            var html =  '<div class="btn_mp3">'+
                            '<a style="background-color: #ff0000; border: solid 2px #ff0000; border-radius: 2px; color: white; padding: 0px 15px; font-size: 14px; cursor:pointer; height:33px;margin-right: 4px;margin-top: 7px;line-height: 33px;font-weight: 500; display:inline-block; text-decoration: none;" title="Download now in MP3 | YouTube Downloader - By Wígny Almeida" class="link_mp3" href="https://savetomp3.com/'+url+'">'+
                                'DOWNLOAD <span style="color:#ffcccc;">MP3</span>'+
                            '</a>'+
                        '</div>'+
                        '<div class="btn_mp4">'+
                            '<a style="background-color: #ff0000; border: solid 2px #ff0000; border-radius: 2px; color: white; padding: 0px 15px; font-size: 14px; cursor:pointer; height:33px;margin-right: 4px;margin-top: 7px;line-height: 33px;font-weight: 500; display:inline-block; text-decoration: none;" title="Download now in MP4 | YouTube Downloader - By Wígny Almeida" class="link_mp4" href="https://pt.savefrom.net/#url='+url+'">'+
                                'DOWNLOAD <span style="color:#ffcccc;">MP4</span>'+
                            '</a>'+
                        '</div>';
            parent.insertAdjacentHTML('beforeend', html);
        }
        setTimeout(function(){
            add_btn_url_atual();
        },1000);

        //By Wígny Almeida

        //Altera o href conforme cliques
        $(document).on('click',function(){
            console.log('clicou');
            $('.link_mp3').attr('href','https://savetomp3.com/'+window.location.href+'');
            $('.link_mp4').attr('href','https://pt.savefrom.net/#url='+window.location.href+'');
        }).trigger();
    });
})();