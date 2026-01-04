// ==UserScript==
// @name         Youtube hotkey for voicesearch
// @namespace    https://greasyfork.org/scripts/446088-youtube-hotkey-for-voicesearch
// @version      0.2
// @description  Добавляет горячие клавиши для голосового поиска и запуска видео
// @author       Anton Kokarev (net-files@yandex.ru)
// @license      MIT
// @match        https://www.youtube.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446088/Youtube%20hotkey%20for%20voicesearch.user.js
// @updateURL https://update.greasyfork.org/scripts/446088/Youtube%20hotkey%20for%20voicesearch.meta.js
// ==/UserScript==


function clickVoiceSearchButton() {
    document.getElementById('voice-search-button').firstChild.click();
}

function clickFirstVideo() {
    document.querySelector('#contents > ytd-item-section-renderer > div#contents > ytd-video-renderer > div#dismissible > ytd-thumbnail > a#thumbnail').click();
}


function doc_keyUp(e) {
    switch (e.keyCode) {
        case 90:
            //z
            clickVoiceSearchButton();
            break;
        case 88:
            //x
            clickFirstVideo();
            break;

        default:
            break;
    }
}
document.addEventListener('keyup', doc_keyUp, false);
console.log('yhfv: loaded');
