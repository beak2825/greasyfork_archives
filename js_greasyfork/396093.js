// ==UserScript==
// @name         [CT] Sound notification when a new log appears
// @namespace    CyberTown
// @date         03/09/2019
// @version      1.1
// @description  Plays a sound when you get a new log.
// @author       .1019
// @include      https://cybertown.fr/ingame.php
// @include      https://cybertown.fr/ingame.php?sidebar_menu
// @downloadURL https://update.greasyfork.org/scripts/396093/%5BCT%5D%20Sound%20notification%20when%20a%20new%20log%20appears.user.js
// @updateURL https://update.greasyfork.org/scripts/396093/%5BCT%5D%20Sound%20notification%20when%20a%20new%20log%20appears.meta.js
// ==/UserScript==

var log = document.getElementById('vuelog');
var configlog = { attributes: false, childList: true };
var audiolog = {};
audiolog.notification = new Audio();
audiolog.notification.src = "https://www.cjoint.com/doc/19_12/ILguIexm7xs_when.mp3"

var lognotif = function(mutationsList) {
    for(var mutation of mutationsList) {
        if (mutation.type == 'childList') {
            audiolog.notification.play();
        }
    }
};

$('<div style="text-align: center; height: 70px; line-height: 40px; border-bottom: 1px solid #171717;"><span id="sliderlog_value">Notification log : volume non défini.</span><input type="range" name="volume-log" min="0" max="1" step="0.1" id="volume-log" style="display: block; margin: 0 50%; transform: translateX(-50%); box-shadow: none;"></div>').insertAfter('a[title="Déconnexion"]');

$(document).on('input', '#volume-log', function() {
    $('#sliderlog_value').html( "Notification log : volume de " + $(this).val() + "." );
    audiolog.notification.volume = $(this).val();
});

var observerlog = new MutationObserver(lognotif);
observerlog.observe(log, configlog);