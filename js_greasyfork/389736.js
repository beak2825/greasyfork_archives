// ==UserScript==
// @name         [CT] Sound notification when someone talks to you
// @namespace    CyberTown
// @date         03/09/2019
// @version      1.1
// @description  Plays a sound when someone talks to you.
// @author       .1019
// @include      https://cybertown.fr/ingame.php
// @include      https://cybertown.fr/ingame.php?sidebar_menu
// @include     https://www.cybertown.fr/ingame.php
// @include      https://www.cybertown.fr/ingame.php?sidebar_menu
// @downloadURL https://update.greasyfork.org/scripts/389736/%5BCT%5D%20Sound%20notification%20when%20someone%20talks%20to%20you.user.js
// @updateURL https://update.greasyfork.org/scripts/389736/%5BCT%5D%20Sound%20notification%20when%20someone%20talks%20to%20you.meta.js
// ==/UserScript==

var targetNode = document.getElementById('chan');
var config = { attributes: false, childList: true };
var audio = {};
audio.notification = new Audio();
audio.notification.src = "https://www.cjoint.com/doc/19_07/IGxoIylVdEs_open-ended.mp3"

var callback = function(mutationsList) {
    for(var mutation of mutationsList) {
        if (mutation.type == 'childList') {
            audio.notification.play();
        }
    }
};

$('<input type="range" name="volume" min="0" max="1" step="0.1" id="volume-range" style="display: inline-block; margin: 14px 10px 14px 50px; box-shadow: none;"> <span id="slider_value" style="font-size: 12px; line-height: 18px;">Notification sonore : volume non défini.</span>').insertAfter('#logo');

$(document).on('input', '#volume-range', function() {
    $('#slider_value').html( "Notification sonore : volume de " + $(this).val() + "." );
    audio.notification.volume = $(this).val();
});

var observer = new MutationObserver(callback);
observer.observe(targetNode, config);