// ==UserScript==
// @name         Telia chatt-ljud
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Spela upp ljud när kundtjänst skriver på chatten när fliken inte är aktiv
// @author       You
// @match        https://www.telia.se/*
// @icon        data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432366/Telia%20chatt-ljud.user.js
// @updateURL https://update.greasyfork.org/scripts/432366/Telia%20chatt-ljud.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (new MutationObserver(bodyMutation)).observe(document.body,{childList: true});
    var audioCooldown=false;
    function bodyMutation(mutationsList, observer) {
        const chatWindow=document.querySelector("body>.humany-widget");
        if (!chatWindow)
            return;
        observer.disconnect();
        (new MutationObserver(chatMutation)).observe(chatWindow, {childList: true, subtree: true });
    }

    function chatMutation() {
        if (!audioCooldown&&document.hidden) {
            beep();
            audioCooldown=true;
            setTimeout(()=>audioCooldown=false,2000);
        }
    }

    function beep(){
        var ctxClass = window.audioContext ||window.AudioContext || window.AudioContext || window.webkitAudioContext;
        var ctx = new ctxClass();
        var osc = ctx.createOscillator();
        osc.frequency.value = 420;
        osc.type = "triangle";
        osc.connect(ctx.destination);
        osc.noteOn?.(0)||osc.start();
        setTimeout(()=> {
            osc.frequency.value = 720;
            setTimeout(()=>{
               osc.noteOff?.(0)||osc.stop();
            },100);
        }, 30);
    }
})();