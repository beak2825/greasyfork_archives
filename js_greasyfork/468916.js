// ==UserScript==
// @name         ttsdemoDL
// @version      0.1
// @namespace    https://www.oddcast.com
// @description  Add download button to ttsdemo.com
// @author       EdaCha
// @match        https://www.oddcast.com/ttsdemo/*
// @grant        none
// @license      CC0
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/468916/ttsdemoDL.user.js
// @updateURL https://update.greasyfork.org/scripts/468916/ttsdemoDL.meta.js
// ==/UserScript==

(function () {
    window.onload = function(){
        $("#play-speaking").after('<div><button id="button" type="button">Download</button></div>');
        $("#button").click(function() {
            const eid = $("#voiceBtn").attr('data-eng');
            const lid = $("#languageBtn").attr('data-val');
            const vid = $("#voiceBtn").attr('data-val');
            const fxt = $("#effectBtn").attr('data-val');
            const fxl = $("#levelBtn").attr('data-val');
            const txt = $("#flash-speck-area").val();
            const url = "https://cache-a.oddcast.com/tts/genB.php?EID="+eid+"&LID="+lid+"&VID="+vid+"&TXT="+txt+"&EXT=mp3&FNAME=&ACC=15679&SceneID=2692826&FX_TYPE="+fxt+"&FX_LEVEL="+fxl+"&HTTP_ERR=";
            window.open(url);
        });
    }
})()
