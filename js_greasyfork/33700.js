// ==UserScript==
// @name         Tube in MP3
// @namespace    http://tampermonkey.net/
// @copyright 2017, Pedro Antônio
// @version      0.3
// @description  Download Audio from Youtube in MP3
// @author       Pedro Antônio
// @match        https://www.youtube.com/*
// @require https://code.jquery.com/jquery-3.2.1.min.js
// @icon https://www.youtube.com/yts/img/favicon-vfl8qSV2F.ico




// @downloadURL https://update.greasyfork.org/scripts/33700/Tube%20in%20MP3.user.js
// @updateURL https://update.greasyfork.org/scripts/33700/Tube%20in%20MP3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here..
    $(document).ready(function(){
        $('head').append('<link rel="stylesheet" type="text/css" media="all" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">');


        //Add clickable icon
        function add_btn_url_atual(){
            var parent = document.querySelector('#top-row');
            var url = window.location.href;
            var html = '<div class="btn_mp3"><a class="link_mp3" target="_blank" href="https://www.convertmp3.io/download/?video='+url+'"><img width="50" height="50" src="https://image.freepik.com/free-icon/mp3-audio-file_318-43704.jpg" /></a></div>';
            parent.insertAdjacentHTML('beforeend', html);
        }
        setTimeout(function(){
            add_btn_url_atual();
        },5000);

        //Altera o href conforme cliques
        $(document).on('click',function(){
            console.log('clicou');
            $('.link_mp3').attr('href','https://www.convertmp3.io/download/?video='+window.location.href+'');
        }).trigger();
    });
})();
