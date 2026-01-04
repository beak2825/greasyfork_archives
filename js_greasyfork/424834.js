// ==UserScript==
// @name         Zotac Error 1020 Detector
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Sounds an alarm once it detects that the Zotacstore is throwing error 1020, which might indicate a drop is coming.
// @author       You
// @match        https://www.zotacstore.com/us/*
// @icon         https://www.google.com/s2/favicons?domain=zotacstore.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424834/Zotac%20Error%201020%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/424834/Zotac%20Error%201020%20Detector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the constants that we need.
    const btnStyle = 'padding: 20px; background: #de191f; color: #fff; border: none; border-radius: 5px; display: block; margin-bottom: 40px;';
    const spanStyle = 'color: red; text-align: center; font-family: Verdana; font-size: 13px;';
    const divStyle = 'position: absolute; z-index: 1; top: 15px; left: 50%; transform: translate(-50%, -50%); background: #000; padding: 12px;';
    const alarm = new Audio('https://www.e2s.com/system/1/assets/files/000/000/423/423/854c33e83/original/TF050.WAV');
    const refreshEvery = 30; // Number of seconds to do each refresh.
    let clicked = false;
    let detected = false;
    let refreshIn = refreshEvery;

    // Create the button, but only if not in an iframe already.
    if(window === window.parent){
        let btn = document.createElement('button');
        btn.classList.add('daves-btn');
        btn.setAttribute('style', btnStyle);
        btn.innerHTML = 'Start 1020 Detector';
        document.querySelector('.header-row').appendChild(btn);
    }

    // Don't continue if the button doesn't exist.
    if(!document.querySelector('.daves-btn')){
        return;
    }

    // Create the event listener.
    document.querySelector('.daves-btn').addEventListener('click', function(event){
        event.preventDefault();
        document.querySelector('.daves-btn').style.display = 'none';

        // Inject the refreshing iframe.
        document.querySelector('html').innerHTML = `
            <div style="${divStyle}">
                <span style="${spanStyle}">This page refreshes every ${refreshEvery} seconds.<br>Next refresh is in <span class="countdown">${refreshIn}</span> seconds.</span>
            </div>
            <iframe id="refreshFrame" src="${window.location.toString()}" style="position: absolute; top:0; left:0; right:0; bottom:0; width:100%; height:100%;"></iframe>
        `;

        // Refresh the page every 10 seconds.
        setInterval(function(){
            if(!detected){
                refreshIn = refreshEvery;
                document.getElementById('refreshFrame').src = document.getElementById('refreshFrame').src;
            }
        }, refreshEvery * 1000);

        // Determine if error code 1020 is displayed on the screen, along with the string Cloudflare.
        setInterval(function(){

            // Update countdown.
            refreshIn -= 1;
            document.querySelector('.countdown').innerHTML = refreshIn;

            // Frame must be present.
            let frame = document.querySelector('#refreshFrame');
            if(!frame){
                return;
            }

            // Detect if error 1020 is displayed on the screen.
            if(frame.contentDocument.querySelector('html').innerHTML.includes('1020') && frame.contentDocument.querySelector('html').innerHTML.includes('cferror')){
                detected = true;
                alarm.play();
            }
        }, 1000);
    });
})();