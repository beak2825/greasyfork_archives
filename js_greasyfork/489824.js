

    // ==UserScript==
    // @name         IPS display
    // @namespace    http://tampermonkey.net/
    // @version      2024-03-14-04
    // @description  inputs per second display for 2048verse
    // @author       cattodoameow
    // @match        https://2048verse.com/
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=2048verse.com
    // @grant        none
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489824/IPS%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/489824/IPS%20display.meta.js
    // ==/UserScript==

    (function() {
        'use strict';
        var date = new Date();
        var times = [];
        var i = 0;
        var IPSupdateTime = 10;
        var IPS = 0;
        setInterval(calculateIPS,IPSupdateTime);
        function initIPS(){
            var display = document.createElement("p");
            display.id = "IPS_DISPLAY";
            display.innerHTML = "IPS: " + IPS.toString();
            display.style.position = "fixed";
            display.style.right = "0%";
            display.style.top = "0%";
            document.body.insertBefore(display,document.body.childNodes[0]);
        }
        initIPS();
        function calculateIPS(){
           date = new Date();
           var time = date.getTime();
           // find the first input that's less than one second before now => all the ones after it are within the last second
           const withinLastSecond = (element) => time - element <= 1000;
           IPS = (i - times.findIndex(withinLastSecond));
           if(time - times[i - 1] > 1000){
               IPS = 0; // idfk
           }
           if(times.findIndex(withinLastSecond) == -1){ // if there's no inputs in the last second
               IPS = 0;
           }
           // remove old inputs
           for(var j = 0; j < times.findIndex(withinLastSecond); j++){
               times.shift();
               i--;
           }
           updateDisplay();
        }
        function updateDisplay(){
            var display = document.getElementById("IPS_DISPLAY");
            display.innerHTML = "IPS: " + IPS.toString();
        }
        document.addEventListener('keydown', (event) => {
           // add to the input arr
           date = new Date();
           times[i++] = date.getTime();
        });
    })();

