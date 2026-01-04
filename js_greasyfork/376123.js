// ==UserScript==
// @name         Instagram Picture Content (Alt) Displayer
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  With this script you will be able to see the automatically recognized content of a picture (found in the alt attribute) by clicking on it.
// @author       torturtle
// @match        https://www.instagram.com/*
// @match        https://www.instagram.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376123/Instagram%20Picture%20Content%20%28Alt%29%20Displayer.user.js
// @updateURL https://update.greasyfork.org/scripts/376123/Instagram%20Picture%20Content%20%28Alt%29%20Displayer.meta.js
// ==/UserScript==


    var images = document.getElementsByClassName('FFVAD'),
        crap = document.getElementsByClassName('_9AhH0'),
        span = document.createElement('span'),
        fent = 0,i;
    span.style.position = 'fixed';
    span.style.padding = '10px';
    span.style.top = '0';
    span.style.left = '0';
    span.style.color = 'lime';
    span.style.backgroundColor = 'black';
    span.style.borderRadius = '0 0 15px 0';
    span.style.fontFamily = 'Monospace';
    span.innerHTML = 'Click on a picture to display it\'s content.<br>If its not working on a picture, spin your mousewheel a bit.';
    document.body.appendChild(span);
    function reset() {
        var images = document.getElementsByClassName('FFVAD');
        var crap = document.getElementsByClassName('_9AhH0');
        for (i = 0; i < crap.length; i++) {
            crap[i].style.zIndex = '-100';
        }
        for (i = 0; i < images.length; i++) {
            images[i].addEventListener('click',function(){
                fent = -30;
                span.style.top = fent + 'px';
                span.innerHTML = this.alt.indexOf('Image may contain:') == -1 ? 'No recognized content found.' : this.alt.substr(this.alt.indexOf('Image may contain:'));
            });
        }
    }
    window.addEventListener('wheel',function(){
        reset();
    });
    reset();
    var mozgj = setInterval(function() {
        if (fent <= 0) {
            span.style.top = fent + 'px';
            fent++;
        }
    },10);