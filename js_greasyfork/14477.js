// ==UserScript==
// @name         Disable countdown in GorillaVid
// @namespace    Disable countdown in GorillaVid
// @version      0.5
// @description  Disable countdown button in GorillaVid.in
// @author       jscriptjunkie
// @match        http://gorillavid.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14477/Disable%20countdown%20in%20GorillaVid.user.js
// @updateURL https://update.greasyfork.org/scripts/14477/Disable%20countdown%20in%20GorillaVid.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var isPlaying = true;
if($('#btn_download').length > 0) {
    $('#btn_download').attr('disabled', false);
    $$('btn_download').value = 'Continue';
    $$('btn_download').click();
    countDown = function(){
    }
}

if(jwplayer('flvplayer')){
    jwplayer('flvplayer').play();

    $('body').keyup(function(e){
        if(e.keyCode == 32){
            if(isPlaying){
                jwplayer('flvplayer').pause();
                isPlaying = false;
            } else {
                jwplayer('flvplayer').play();
                isPlaying = true;
            }
        }
    });

    setInterval(function(){ 
        if((jwplayer('flvplayer').getDuration() - jwplayer('flvplayer').getPosition()) < 3){
            window.close();
        }
    }, 3000);
}