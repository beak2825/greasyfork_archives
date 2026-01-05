// ==UserScript==
// @name        Bajar MP3 YouTube
// @namespace   youtube.com
// @description Descarga MP3 desde YouTube con un solo clic / Download mp3 from YouTube with just one click
// @author      emilandi
// @match     http://www.youtube.com/*
// @match     https://www.youtube.com/*
// @version     1.0.4
// @grant       none
// @require https://code.jquery.com/jquery-2.2.3.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/22108/Bajar%20MP3%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/22108/Bajar%20MP3%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        console.clear();
        console.log(document.title);
        crearboton();
    });

    function crearboton(){
      
        var elem = document.querySelector('div#title.style-scope.ytd-watch-metadata');
        var btn = document.getElementById('idbtn');

        if (elem!==null && btn===null) {

            var div = document.createElement('button');

            div.id='idbtn';
            div.textContent='DESCARGAR';
            div.style.backgroundColor='red';
            div.style.border='solid 1px';
            div.style.padding='10px';
            div.style.fontSize='1.5em';
            div.style.cursor='pointer';

            elem.appendChild(div);

            div.addEventListener('click',function(){
                var id = getId();
                console.log('ID: ' + id);
                var url = 'https://www.y2mate.com/youtube-mp3/' + id;
                window.open(url);
            })
        }
    }

    function getId(){
        var data = document.getElementsByTagName('ytd-watch-flexy')[0];
        if(id != data.getAttribute('video-id')){
            var id = data.getAttribute('video-id');
        }
        return id;
    }

    document.addEventListener("mousemove", function() {
        var btn = document.getElementById('idbtn');
        if (btn===null){
            crearboton();
        }
    });

})();