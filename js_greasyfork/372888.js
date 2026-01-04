// ==UserScript==
// @name         Pepper image enlarger
// @namespace    https://app.pepper.nl
// @version      0.1
// @description  Pepper is a Dutch dating website, but all images are microscopically small. This script makes the images larger on hover. You're welcome.
// @author       Rick van der Staaij
// @include      https://app.pepper.nl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372888/Pepper%20image%20enlarger.user.js
// @updateURL https://update.greasyfork.org/scripts/372888/Pepper%20image%20enlarger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addPreviewPane(){
        $('body').append('<div style="position:fixed; z-index:9999; min-width: 200px; min-height: 200px; background-image: url(https://loading.io/spinners/lava-lamp/index.lava-lamp-preloader.svg); background-color: #FFFFFF; background-repeat: no-repeat; background-position: center center; border: 5px solid #FB1D6C; bottom: 20px; right: 20px; display: none; border-radius: 10px;" id="preview-pane"><img src="" style="border-radius: 3px;" id="preview-image" /></a>');
    }

    function setImageHovers() {
        $('img:not([pimped="true"])').attr('pimped', 'true').hover(function() {
            var URL = $(this).attr('src');

            var widthRegex = /width=([\d]+)/gi;
            var heightRegex = /height=([\d]+)&crop=true/gi;

            URL = URL.replace(widthRegex, 'width=600');
            URL = URL.replace(heightRegex, 'height=600');

            if (event.clientX > Math.round($(window).width() / 2)) {
                $('#preview-pane').css('left', '20px');
                $('#preview-pane').css('right', 'auto');
            } else {
                $('#preview-pane').css('right', '20px');
                $('#preview-pane').css('left', 'auto');
            }

            $('#preview-pane').css('display', 'block');
            $('#preview-image').attr('src', URL);

        }, function() {
            $('#preview-pane').css('display', 'none');
        });
    }

    $(document).ready(function(){
        addPreviewPane();
    });

    setInterval(function(){
        setImageHovers();
    }, 1000);

    console.log('[PepperPimper] All images will be enlarged, kthnxbai');
})();