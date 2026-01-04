// ==UserScript==
// @name         NERD Inserter
// @namespace    nerd-inserter
// @homepageURL  https://c2g.at
// @description  just enable it and see what happens
// @author       c2g_at
// @match        *://*.wikipedia.org/*
// @match        *://*.google.com/search*
// @match        *://*.stackoverflow.com/*
// @match        *://*.serverfault.com/*
// @match        *://*.superuser.com/*
// @match        *://*.stackexchange.com/*
// @match        *://*.mathoverflow.net/*
// @match        *://*.stackapps.com/*
// @match        *://*.askubuntu.com/*
// @match        *://*.github.com/*
// @match        *://*.github.io/*
// @match        *://*.udemy.com/*
// @match        *://*.freecodecamp.org/*
// @match        *://developers.mozilla.org/*
// @match        *://*.sololearn.com/*


// @version 0.0.1.20240131234124
// @downloadURL https://update.greasyfork.org/scripts/486178/NERD%20Inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/486178/NERD%20Inserter.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var mouseX = 0;
    var mouseY = 0;
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function applyMouseForce(img) {
        var imgRect = img.getBoundingClientRect();
        var imgX = imgRect.left + imgRect.width / 2;
        var imgY = imgRect.top + imgRect.height / 2;
        var distX = mouseX - imgX;
        var distY = mouseY - imgY;
        var distance = Math.sqrt(distX * distX + distY * distY);
        var maxDistance = 100; // Max distance for interaction

        if (distance < maxDistance) {
            var forceX = (maxDistance - distance) * (distX / distance);
            var forceY = (maxDistance - distance) * (distY / distance);

            img.style.left = img.offsetLeft - forceX + 'px';
            img.style.bottom = parseInt(img.style.bottom, 10) - forceY + 'px';
        }
    }

    function createFloatingImage(src) {
        var img = document.createElement('img');
        img.src = src;

        var size = Math.random() * (120 - 50) + 50; // Size between 50px and 120px
        img.style.width = size + 'px';
        img.style.height = 'auto';

        img.style.position = 'fixed';
        img.style.bottom = '-150px'; 
        img.style.left = Math.random() * window.innerWidth + 'px'; 
        img.style.zIndex = 9999; 
        img.style.pointerEvents = 'none'; 
        var bottomPosition = -150;
        var leftPosition = parseInt(img.style.left, 10);
        var sway = 50; 
        var swayDirection = 1;

        var interval = setInterval(function() {
            bottomPosition += 2; 
            img.style.bottom = bottomPosition + 'px';

            if (leftPosition > window.innerWidth - size || leftPosition < 0) {
                swayDirection *= -1; 
            }
            leftPosition += 0.5 * swayDirection; 
            img.style.left = leftPosition + 'px';

            if (bottomPosition > window.innerHeight + 150) {
                clearInterval(interval);
                img.remove();
            }
            applyMouseForce(img);

        }, 50); 

        document.body.appendChild(img);
    }

    var imageUrl = 'https://i.imgur.com/jXsXO6T.png';

    // Create 25 floating images at random intervals
    for (var i = 0; i < 50; i++) {
        // Random delay between 0 to 10 seconds
        var delay = Math.random() * 10000;
        setTimeout(function() {
            createFloatingImage(imageUrl);
        }, delay);
    }
})();