// ==UserScript==
// @name          LOLBeans.io Idler
// @description   Get LOLBeans colors and accessories while doing absolutely nothing
// @author        https://github.com/abbydiode
// @version       2021.02.09a
// @match         https://lolbeans.io/*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @namespace https://greasyfork.org/users/875843
// @downloadURL https://update.greasyfork.org/scripts/463088/LOLBeansio%20Idler.user.js
// @updateURL https://update.greasyfork.org/scripts/463088/LOLBeansio%20Idler.meta.js
// ==/UserScript==

function startIdler() {
    let idleTime = sessionStorage.idleTime ?? 0;
    let playButton = $('#btn-play')[0];
    console.log('LOLBeans Idler Started');
    sessionStorage.idling = true;
    playButton.click();

    setInterval(() => {
        sessionStorage.idleTime = ++idleTime;
        $('#idle-info')[0].textContent = 'You\'ve idled for ' + idleTime + ' seconds';

        $('.continue-btn.visible')[0].click();
        $('.new-game-btn.visible')[0].click();
    }, 1000);
}

function loadUI() {
    $('#btn-play').after('<button id="btn-idle" class="cta" style="font-size:large;margin-top: 16px;">Start Idling</button>');
    $('#btn-idle').click(() => startIdler());
    $('#death-screen-quit-btn').click(() => {
        console.log('LOLBeans Idler Stopped');
        sessionStorage.idling = false;
    		sessionStorage.idleTime = 0;
        location.reload();
    });
    let idleTime = 0;
    $('#fps').after('<div id="idle-info" style="font-family: Arial; position: absolute; bottom: 22px; left: 16px; z-index: 100; font-size: 12px; color: #fff; background-color: rgba(0,0,0,.2);">Idler Disabled</div>')
}

$(() => {
    loadUI();
    if (sessionStorage.idling === "true") { setTimeout(() => startIdler(), 1000); }
});