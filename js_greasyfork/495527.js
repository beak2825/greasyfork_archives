// ==UserScript==
// @name         Theater Mode
// @namespace    http://tampermonkey.net/
// @version      2024-05-19
// @description  Allow the video to occupy the whole webpage
// @author       Nobody
// @match        http*://*.oculus.com/casting
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oculus.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495527/Theater%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/495527/Theater%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const customCss = `
        video {
            position: fixed;
            left: 0;
            top; 0;
            width: 100%;
            height: 100%;
        }

        #top-nav-ssr {
            display: none;
        }

        body {
            overflow: hidden;
        }
    `;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'theater-mode-style';
    style.innerHTML = customCss;

    const theaterMode = (toggle) => {
        switch (toggle) {
            case true:
                document.getElementById('theater-mode-style') || document.head.appendChild(style);
                alert('Press ESC to exit theater mode');
                break;
            case false:
                document.getElementById('theater-mode-style')?.remove();
                break;
        }
    }

    document.onkeydown = (e) => {
        e = e || window.event;
        const isEscape = e?.key === "Escape" || e?.key === "Esc" || e?.keyCode === 27;
        isEscape && theaterMode(false);
        console.info('Exit theater mode');
    };

    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'theater-mode-btn';
    button.style.cssText = 'background-color: transparent; border: none; cursor: pointer; width: 40px; height: 28px;';
    button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 384.97 384.97" xml:space="preserve" style="fill: white; height: 20px;">
        <g>
            <path d="M372.939,216.545c-6.123,0-12.03,5.269-12.03,12.03v132.333H24.061V24.061h132.333c6.388,0,12.03-5.642,12.03-12.03S162.409,0,156.394,0H24.061C10.767,0,0,10.767,0,24.061v336.848c0,13.293,10.767,24.061,24.061,24.061h336.848c13.293,0,24.061-10.767,24.061-24.061V228.395C384.97,221.731,380.085,216.545,372.939,216.545z"></path>
            <path d="M372.939,0H252.636c-6.641,0-12.03,5.39-12.03,12.03s5.39,12.03,12.03,12.03h91.382L99.635,268.432c-4.668,4.668-4.668,12.235,0,16.903c4.668,4.668,12.235,4.668,16.891,0L360.909,40.951v91.382c0,6.641,5.39,12.03,12.03,12.03s12.03-5.39,12.03-12.03V12.03l0,0C384.97,5.558,379.412,0,372.939,0z"></path>
        </g>
    </svg>
    `;
    button.addEventListener('click', () => theaterMode(true));

    new MutationObserver((mut, obs) => {
        const videoElem = document.querySelector('video');
        if (!videoElem) return;
        obs.disconnect();
        document.querySelector('theater-mode-btn') || videoElem.nextElementSibling?.firstChild?.appendChild(button);
    })
        .observe(document, {
        childList: true,
        subtree: true
    });

    console.info('Theater Mode script loaded');
})();