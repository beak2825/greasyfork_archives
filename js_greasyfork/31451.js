// ==UserScript==
// @name         ArmorGame - Fullscreen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  allows switching to fullscreen with a button or escape key
// @author       You
// @match        http://armorgames.com/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31451/ArmorGame%20-%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/31451/ArmorGame%20-%20Fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('afs : started');

    function switchFullscreen() {
        console.log('afs : switching fullscreen mode');
        var game = document.querySelector('#gamefileEmbed');
        if(game) {
            document.body.classList.toggle('afs-fullscreened');
            game.classList.toggle('afs-fullscreened');
        } else {
            console.error('afs : did not find game :(');
        }
    }

    function insertButton() {
        console.log('afs : inserting button');
        var header = document.querySelector('.game-header');
        if(header) {
            header.innerHTML += '<button class="afs-go-full tag-category">Go Fullscreen</button><button class="afs-quit-full tag-category">x</button>';
            var btnSwitch = header.querySelector('.afs-go-full');
            btnSwitch.addEventListener('click', switchFullscreen);
            var btnExit = header.querySelector('.afs-quit-full');
            btnExit.addEventListener('click', switchFullscreen);
        } else {
            console.error('afs : did not find header :(');
        }
    }

    function detectEscape() {
        document.onkeydown = function(evt) {
            evt = evt || window.event;
            if (evt.keyCode == 27) {
                console.log('afs : esc key pressed');
                switchFullscreen();
            }
        };
    }

    function insertStyle() {
        var style = `<style class="afsStyles">
body.p3 .game-header .tag-category.afs-go-full , body.p3 .game-header .tag-category.afs-quit-full {
position: absolute;
right: 0;
top: 10px;
padding: 10px 15px;
font-size: 14px;
border-radius: 40px;
outline: none;
}
body.p3 .game-header .tag-category.afs-quit-full {
display:none;
}
body.p3.afs-fullscreened .game-header .tag-category.afs-quit-full {
display:block;
z-index: 2000;
position: fixed;
right: 10px;
padding: 7px 10px;
}
.afs-fullscreened {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
z-index: 1000;
}
body.afs-fullscreened #ag3-header #primary-nav li.quests.dropdown , body.afs-fullscreened #arrowchat_show_bar_button , body.p3.afs-fullscreened #gamearea a.related-tab {
z-index:inherit;
display:none !important;
}
body#page-game.afs-fullscreened {
height: 100%;
overflow: hidden;
}
</style>`;
        $('body').append($(style));
    }

    // init
    detectEscape();
    insertButton();
    insertStyle();

})();