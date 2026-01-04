// ==UserScript==
// @name         Inkapelis & openload
// @namespace    niIdea
// @version      0.1
// @description  En inkapelis cambia el ifram del video por un enlace, y en openload abre directamente el mp4. Podrás dar botón derecho y guardar como
// @author       Mnt
// @match        http*://www.inkapelis.com/*
// @match        http*://oload.stream/*
// @match        http*://*.oloadcdn.net/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/35292/Inkapelis%20%20openload.user.js
// @updateURL https://update.greasyfork.org/scripts/35292/Inkapelis%20%20openload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        console.log(location.hostname);


        if(location.hostname=='oload.stream'){
            window.open = function() {};
            //$('body div')[2].click();
            $('div#videooverlay').click();
            let enlace=$('#olvideo_html5_api').attr('src');
            console.log(location.hostname+enlace);
            if(enlace!== undefined){
                window.location.replace('http://'+location.hostname+enlace);
                console.log('redirct');
            }
        }

        if(location.hostname=='www.inkapelis.com'){
            $("iframe").each(function() {
                let url = $(this).attr('src');
                let enlace  = $('<a href='+url+'>Iframe: '+url+'</a>');
                $(this).replaceWith(enlace);
            });
            console.log("cambiado");
        }

        if(location.hostname.search("oloadcdn.net")>0){

            var vid = $("video")[0];
            if (vid.requestFullscreen) {
                vid.requestFullscreen();
            } else if (vid.mozRequestFullScreen) {
                vid.mozRequestFullScreen();
            } else if (vid.webkitRequestFullscreen) {
                vid.webkitRequestFullscreen();
    }
        }

    });
})();