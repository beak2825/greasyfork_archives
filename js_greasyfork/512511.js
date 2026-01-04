// ==UserScript==
// @name         Happywheels Theatre mode
// @namespace    yes
// @version      2024-10-13
// @description  Adds a semi-fullscreen button that makes the game fill the page
// @author       pooiod7
// @match        https://totaljerkface.com/happy_wheels.tjf*
// @icon         https://i.ibb.co/r65myTd/nufeinwfeinfewininfew.png
// @license     GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512511/Happywheels%20Theatre%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/512511/Happywheels%20Theatre%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const iframe = document.querySelector('#game > iframe');
    let mobile = /Mobi|Android/i.test(navigator.userAgent);
    let isFullscreen = mobile;

    function requestFullscreen() {
        const iframe = document.querySelector('#game > iframe');
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.mozRequestFullScreen) { // Firefox
            iframe.mozRequestFullScreen();
        } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari, and Opera
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) { // IE/Edge
            iframe.msRequestFullscreen();
        }
    }

    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }

    function toggleFullscreen() {
        isFullscreen = !isFullscreen;
        const fadeOverlay = document.createElement('div');
        fadeOverlay.style.position = 'fixed';
        fadeOverlay.style.top = '0';
        fadeOverlay.style.left = '0';
        fadeOverlay.style.width = '100vw';
        fadeOverlay.style.height = '100vh';
        fadeOverlay.style.backgroundColor = 'black';
        fadeOverlay.style.opacity = '0';
        fadeOverlay.style.transition = 'opacity 0.5s';
        fadeOverlay.style.zIndex = '9999999999999999998';
        document.body.appendChild(fadeOverlay);

        requestAnimationFrame(() => {
            fadeOverlay.style.opacity = '1';
        });

        setTimeout(() => {
            if (isFullscreen) {
                document.body.style.overflow = 'hidden';
                iframe.style.position = 'fixed';
                iframe.style.top = '0';
                iframe.style.left = '0';
                iframe.style.width = '100vw';
                iframe.style.height = '100vh';
                iframe.style.zIndex = '9999999999999999999';
            } else {
                document.body.style.overflow = '';
                iframe.style.position = '';
                iframe.style.top = '';
                iframe.style.left = '';
                iframe.style.width = '';
                iframe.style.height = '';
                iframe.style.zIndex = '';
            }
            fadeOverlay.style.opacity = '0';
        }, 500);

        setTimeout(() => {
            document.body.removeChild(fadeOverlay);
        }, 1000);
    }

    const button = document.createElement('button');
    button.innerHTML = '&#x26F6;'; // Fullscreen icon
    button.style.position = 'fixed';
    button.style.zIndex = '10000000000000000000';
    button.style.padding = '5px 10px';
    button.style.border = 'none';
    button.style.borderRadius = '10px';
    button.style.backgroundColor = 'black';
    button.style.color = 'white';
    button.style.fontSize = '18px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    button.style.transition = 'background-color 0.3s';

    if (false) {
        button.style.top = '20px';
        button.style.left = '20px';
    } else {
        button.style.bottom = '20px';
        button.style.right = '20px';
    }

    button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#333';
    });

    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = 'black';
    });

    button.addEventListener('click', toggleFullscreen);
    document.body.appendChild(button);

    // Start fullscreen mode on mobile
    if (isFullscreen) {
        document.body.style.overflow = 'hidden';
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100vw';
        iframe.style.height = '100vh';
        iframe.style.zIndex = '9999999999999999999';
        if (mobile) {
            requestFullscreen();
        }
    }
})();