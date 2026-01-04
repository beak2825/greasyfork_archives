// ==UserScript==
// @name         Photomath Desert Edition
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Photomath Expert autorefresher/reloader
// @author       You
// @match        https://portal.photomath.net/solve
// @icon         https://www.google.com/s2/favicons?sz=64&domain=photomath.net
// @grant        GM_xmlhttpRequest
// @connect      lasonotheque.org
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457259/Photomath%20Desert%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/457259/Photomath%20Desert%20Edition.meta.js
// ==/UserScript==

function playFromBuffer( context, buffer ) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect( context.destination );
    source.start( 0 );
}

function playAlarm() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    let context = new AudioContext();
    GM_xmlhttpRequest( {
        method: "GET",
        url: 'https://lasonotheque.org/UPLOAD/mp3/1685.mp3', // Some free alarm audio
        responseType: 'arraybuffer',
        onload: function( response ) {
            try {
                console.log("Here");
                context.decodeAudioData( response.response, buffer => playFromBuffer( context, buffer ), console.err );
            }
            catch( e ) {
                console.error( e );
            }
        }
    } );
}

(function() {
    'use strict';
    let loop = setInterval(() => {
        let refreshButton = document.getElementsByClassName("refresh-button")[0];
        if (refreshButton == undefined) {
            playAlarm(); // Play the alarm once a task appears...
            console.log("Button not found, so probably loading or taking a new task")
            clearInterval(loop);
        } else {
            refreshButton.click()
        }
    },5000) // Change the reload waiting time here

})();