// ==UserScript==
// @name         Stack Chat Volume Control
// @namespace    http://rossipedia.com/
// @version      0.1
// @description  Volume Control for Stack Exchange and Stack Overflow Chat Room Notifications
// @author       Bryan Ross
// @match        *://chat.meta.stackexchange.com/rooms/*
// @match        *://chat.stackexchange.com/rooms/*
// @match        *://chat.stackoverflow.com/rooms/*
// @grant        none
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/16359/Stack%20Chat%20Volume%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/16359/Stack%20Chat%20Volume%20Control.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';


(() => {
    const soundButton = document.getElementById('sound');
    if (!soundButton)
        return;

    const jPlayer = $('#jplayer');    
    if (!(jPlayer && jPlayer.jPlayer))
        return;
    
      
    // restore volume level
    const initialVolume = localStorage.getItem('chat:volume') || 0.5;
    jPlayer.jPlayer('volume', initialVolume);   

    function addComponents() {
        const popup = $('.popup');
        if (!popup || popup.length === 0) {
            setTimeout(addComponents, 20);
            return;
        }

        popup.append('<br>');
        popup.append($('<h2>').text('Volume'));
        
        const $ul = $('<ul>').addClass('no-bullets').appendTo(popup);
        
        const $li = $('<li>').appendTo($ul);
        
        const $slider = $('<input type="range" min="0" max="1" step="0.01">').css('width', '100px').val(initialVolume);
        const $display = $('<span>').text(initialVolume);
        const $play = $('<a>').css('cursor', 'pointer').text(String.fromCharCode(9654));
        
        $li.append($slider).append(' ').append($display).append(' ').append($play);
        
        $slider.on('input', e => {
            jPlayer.jPlayer('volume', e.target.value);
            localStorage.setItem('chat:volume', e.target.value);
            $display.text(e.target.value);
        });
        
        $play.on('click', e => {
            e.preventDefault();
            e.stopPropagation();
            jPlayer.jPlayer('play');
        });
    }
    
    soundButton.addEventListener('click', e => addComponents());
})();