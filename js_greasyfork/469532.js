// ==UserScript==
// @name         YouTube show/hide top header search bar
// @namespace   https://github.com/azizLIGHT
// @version     1.2
// @description  Hides the top masthead initially and shows it when mousing over the top of the page (excluding fullscreen mode).
// @match        https://www.youtube.com/watch?v=*
// @grant        GM_addStyle
// @author       azizLIGHT
// @homepageURL https://github.com/azizLIGHT/youtube-show-hide-top-bar
// @supportURL  https://github.com/azizLIGHT/youtube-show-hide-top-bar/issues
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469532/YouTube%20showhide%20top%20header%20search%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/469532/YouTube%20showhide%20top%20header%20search%20bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var delayTimer;
    var isFullscreen = false;
    var isLeavingFullscreen = false;

    function hideTop() {
        var mastheadContainer = document.getElementById('masthead-container');
        mastheadContainer.style.display = 'none';

        var header = document.querySelector('ytd-app');
        header.style.transitionDuration = isLeavingFullscreen ? '0s' : '0.3s';
        header.style.marginTop = isFullscreen ? '0' : '-50px';
    }

    function showTop() {
        var mastheadContainer = document.getElementById('masthead-container');
        mastheadContainer.style.display = ''; // Restores the default display property

        var header = document.querySelector('ytd-app');
        header.style.transitionDuration = '0.3s';
        header.style.marginTop = ''; // Resets the margin-top property
    }

    function checkFullscreen() {
        isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
        if (isFullscreen) {
            hideTop();
        } else if (isLeavingFullscreen) {
            hideTop();
            isLeavingFullscreen = false;
        }
    }

    setTimeout(function() {
        hideTop();
        checkFullscreen();

        document.addEventListener('mousemove', function(event) {
            if (isFullscreen) {
                return;
            }

            var target = event.target;
            var isSearchBox = target.closest('#masthead-container #search');
            if (isSearchBox) {
                return;
            }

            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var mouseY = event.clientY;

            if (scrollTop === 0 && mouseY <= 50) { // Adjust the threshold as needed
                clearTimeout(delayTimer);
                showTop();
            } else {
                clearTimeout(delayTimer);
                delayTimer = setTimeout(function() {
                    hideTop();
                }, 250); // after mousing away, delay 250 ms before hiding the top bar
            }
        });
    }, 5000); // Delay 5 seconds before initial hide happens

    // Add CSS for smooth transition
    var css = `
        ytd-app {
            transition: margin-top 0.3s ease;
        }
    `;

    var style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // Check fullscreen mode on resize
    window.addEventListener('resize', checkFullscreen);
    document.addEventListener('fullscreenchange', checkFullscreen);
    document.addEventListener('mozfullscreenchange', checkFullscreen);
    document.addEventListener('webkitfullscreenchange', checkFullscreen);
    document.addEventListener('msfullscreenchange', checkFullscreen);

    // Track leaving fullscreen mode
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' || event.key === 'F' || event.detail === 2) {
            isLeavingFullscreen = true;
            setTimeout(checkFullscreen, 0); // Check immediately after leaving fullscreen
        }
    });
})();
