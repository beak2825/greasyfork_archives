// ==UserScript==
// @name         AJR log Youtube
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Crea un botón para guardar logs para AJR
// @author       Pedrubik 🦙
// @license      GPL-3.0-or-later
// @match        https://www.youtube.com/feed/history
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_setClipboard
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/475848/AJR%20log%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/475848/AJR%20log%20Youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function howManyColons(timeString){
        let count = (timeString.match(/:/g) || []).length
        return count
    }
    function timeToMinutes(timeString){
        let numberOfColons = howManyColons(timeString);
        let numbersTime = timeString.split(":")
        if (numberOfColons === 1){
            if(numbersTime[1] > 30){
                return parseInt(numbersTime[0]) + 1
            } else {
                return parseInt(numbersTime[0])
            }
        } else if (numberOfColons === 2){
            if(numbersTime[2] > 30){
                return parseInt(numbersTime[0])*60 + parseInt(numbersTime[1]) + 1
            } else {
                return parseInt(numbersTime[0])*60 + parseInt(numbersTime[1])
            }
        }
    }
    function progressTime(time, progress){
        return Math.round(time*progress/100)
    }
    function addButtonAndCopyText(element) {
        console.log(element)
        if (!element.querySelector('.copy-button')) {
            const button = document.createElement('span');
            button.innerText = 'Copiar log';
            button.className = 'copy-button';
            button.style.background = 'transparent';
            button.style.border="none";
            button.style.color="var(--color-text-lighter)";
            button.style.fontWeight=800;
            button.style.fontSize="1.1rem";
            button.style.cursor="pointer";
            button.style.fontFamily="Overpass,-apple-system,BlinkMacSystemFont,Segoe UI,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif";
            button.style.marginLeft="10px";
            element.appendChild(button);

            button.addEventListener('click', () => {
                let time = timeToMinutes(element.querySelector("#time-status").innerText)
                let videoTitle = "https://www.youtube.com" + element.querySelector("#thumbnail").getAttribute("href")
                const progress = element.querySelector("#progress").getAttribute("style").replace("width:","").replace("%","").replace(";","")
                time = progressTime(time, progress)
                videoTitle = videoTitle.replace(/(&t=\d+s)/, '');
                GM_setClipboard('.log video '+ time + " " + videoTitle, 'text');
            });
        }
    };
    function myscript() {
        console.log("start")
        let containers = document.querySelectorAll("#dismissible")
        containers.forEach(addButtonAndCopyText)
        };
    setTimeout(myscript, 4000);
})();