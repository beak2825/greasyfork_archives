// ==UserScript==
// @name         Zotac Auto-Login
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Keeps you logged in at the Zotac store.
// @author       You
// @match        https://www.zotacstore.com/us/customer/account/
// @icon         https://www.google.com/s2/favicons?domain=zotacstore.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424992/Zotac%20Auto-Login.user.js
// @updateURL https://update.greasyfork.org/scripts/424992/Zotac%20Auto-Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the constants that we need.
    const btnStyle = 'padding: 20px; background: #de191f; color: #fff; border: none; border-radius: 5px; display: block; margin-bottom: 40px; margin-left: 10px;';
    const spanStyle = 'color: red; text-align: center; font-family: Verdana; font-size: 13px;';
    const divStyle = 'position: absolute; z-index: 1; top: 10%; left: 50%; transform: translate(-50%, -50%); background: #000; padding: 12px;';
    const refreshEvery = 60; // Number of seconds to do each refresh.
    let refreshIn = refreshEvery;

    // Create the button, but only if not in an iframe already.
    if(window === window.parent){
        let btn = document.createElement('button');
        btn.classList.add('daves-btn-al');
        btn.setAttribute('style', btnStyle);
        btn.innerHTML = 'Start Auto-Login';
        document.querySelector('.header-row').appendChild(btn);
    }

    // Don't continue if the button doesn't exist.
    if(!document.querySelector('.daves-btn-al')){
        return;
    }

    // Create the event listener.
    document.querySelector('.daves-btn-al').addEventListener('click', function(event){
        event.preventDefault();
        document.querySelector('.daves-btn-al').style.display = 'none';
        let email = prompt('Enter your Zotacstore email');
        let password = prompt('Enter your Zotacstore password');

        // Inject the refreshing iframe.
        document.querySelector('html').innerHTML = `
            <div style="${divStyle}">
                <span style="${spanStyle}">This page refreshes every ${refreshEvery} seconds.<br>Next refresh is in <span class="countdown">${refreshIn}</span> seconds.</span>
            </div>
            <iframe id="refreshFrame" src="${window.location.toString()}" style="position: absolute; top:0; left:0; right:0; bottom:0; width:100%; height:100%;"></iframe>
        `;

        // Refresh the page every 60 seconds.
        setInterval(function(){
            refreshIn = refreshEvery;
            document.getElementById('refreshFrame').src = document.getElementById('refreshFrame').src;
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

            if(frame.contentDocument.querySelectorAll('#login-form').length > 0){
                frame.contentDocument.querySelectorAll('#email')[0].value = email;
                frame.contentDocument.querySelectorAll('#pass')[0].value = password;
                frame.contentDocument.querySelectorAll('#login-form')[0].submit()
            }
        }, 10000);
    });
})();