// ==UserScript==
// @name         Toggle Language Reactor subtitles / translations
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Allows the user to toggle the subs and translations created by the Language Reactor Extension with the G and T key respectively (netflix only)
// @author       Joshua Seckler
// @match        https://www.netflix.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468671/Toggle%20Language%20Reactor%20subtitles%20%20translations.user.js
// @updateURL https://update.greasyfork.org/scripts/468671/Toggle%20Language%20Reactor%20subtitles%20%20translations.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Trying to setup Toggle Language Reactor Translations...");
    //wait for things to be setup
    window.addEventListener('load', function() {
        console.log("Trying to setup Toggle Language Reactor Translations...");
        var translationState = new Boolean(true);
        var subtitleState = new Boolean(true);
        function set_translations(tr_state) {
            //console.log("Translation State: " + translationState);
            let lr_element = document.getElementById("lln-translations");
            if(typeof(lr_element) != 'undefined' && lr_element != null){
                if (!tr_state) {
                    lr_element.style.display = "none";
                } else {
                    lr_element.style.display = "";
                }
            }
        }
        function set_subtitles(sb_state) {
            //console.log("Subtitle State: " + subtitleState);
            let lr_element = document.getElementById("lln-subs");
            if(typeof(lr_element) != 'undefined' && lr_element != null){
                if (!sb_state) {
                    lr_element.style.display = "none";
                } else {
                    lr_element.style.display = "";
                }
            }
        }
        //keylistener t (toggles translation state)
        document.addEventListener('keyup', function doc_keyUp(e) {
            if ( e.keyCode == 84) {// T
                translationState = !translationState;
                set_translations(translationState);
            }
        }, false);
        //keylistener g (toggles subtitle state)
        document.addEventListener('keyup', function doc_keyUp(e) {
            if ( e.keyCode == 71) {// G
                subtitleState = !subtitleState;
                set_subtitles(subtitleState);
            }
        }, false);

        //drawComplete listener
        $(document).bind("lln_bottomPanelDrawComplete",function(e){
            set_translations(translationState);
            set_subtitles(subtitleState);
        });

        console.log("Now able to toggle Language Reactor Translations!");
    }, false);
})();

