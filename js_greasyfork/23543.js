// ==UserScript==
// @name         Change style background
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Change style background for website http://valvrareteam.com/
// @author       Nguyen Huu Tien
// @include      http://valvrareteam.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23543/Change%20style%20background.user.js
// @updateURL https://update.greasyfork.org/scripts/23543/Change%20style%20background.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var interval = setInterval(function(){
        if(window.jQuery) {
            clearInterval(interval);
            jQuery(document).ready(function($){
                var $fbComment = $('.fb-comments');

                var handleStyles = {
                    black: function() {
                        $('.article, .single_post').css({backgroundColor: 'black', color: 'white'});
                        $fbComment.find('> span').css({backgroundColor: 'black', color: 'white'});
                    },
                    white: function() {
                        $('.article, .single_post').css({backgroundColor: 'white', color: 'black'});
                        $fbComment.find('> span').css({backgroundColor: 'black', color: 'white'});
                    },
                };
                var $body = $('body');

                var $controllerContainer = $('<div title="Skin" class="controller-container"><div style="background-color: black;" data-handle-style-name="black" class="styles style-black"></div><div style="background-color: white;" data-handle-style-name="white" class="styles style-white"></div></div>');
                $controllerContainer.css({
                    position: 'fixed',
                    width: 30,
                    right: 5,
                    top: 50,
                    border: 'black solid 1px',
                    zIndex: 1000,
                    backgroundColor: '#19B753',
                    padding: 2
                });
                var $handleStylesElement = $controllerContainer.find('.styles');
                $handleStylesElement.css({
                    width: '100%',
                    height: 20,
                    cursor: 'pointer'
                });

                $handleStylesElement.on('click', function(){
                    var handle = handleStyles[$(this).data('handle-style-name')];
                    if(typeof handle === 'function') {
                        handle();
                    }
                });

                $controllerContainer.appendTo($body);

                handleStyles.white();
                $('#content_box h1.title').css({color: '#339966'});
                var interval = setInterval(function() {
                    var $span = $fbComment.find('> span');
                    if($span.length) {
                        $span.css({backgroundColor: 'black', color: 'white'});
                        clearInterval(interval);
                    }
                }, 100);
            });
        }

    }, 500);

})();