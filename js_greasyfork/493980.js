// ==UserScript==
// @name         Galaxy CSS (Beta!)
// @namespace    http://tampermonkey.net/
// @version      0.2(Beta)
// @description  Applies a video background to the splash-ui element on suroi.io and changes the color of various elements to shades of blue
// @author       You
// @match        https://suroi.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493980/Galaxy%20CSS%20%28Beta%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/493980/Galaxy%20CSS%20%28Beta%21%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('splash-ui').style.backgroundImage = 'none';

    var video = document.createElement('video');
    video.src = 'https://cdn.discordapp.com/attachments/1129277020661100605/1228264588596744263/vecteezy_small-particles-and-stars-moving-on-galaxy_2017224.mp4?ex=662b6989&is=6618f489&hm=81319591c10452d2c6f274c13a0db2fc1c4e8535e3cdd0e8493bd8b5b592b29e';
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    video.style.position = 'fixed';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.zIndex = '-1';
    video.style.pointerEvents = 'none';

    document.getElementById('splash-ui').appendChild(video);

    var normalColor = '#0077cc';
    var settingsColor = '#006699';

    function applyButtonStyles(btn) {
        btn.style.backgroundColor = normalColor;
        btn.style.color = '#ffffff';
        btn.style.borderColor = normalColor;

        btn.addEventListener('mousedown', function() {
            btn.style.backgroundColor = normalColor;
        });

        btn.addEventListener('mouseup', function() {
            btn.style.backgroundColor = normalColor;
        });
    }

    var btnPlaySolo = document.getElementById('btn-play-solo');
    var btnPlayDuo = document.getElementById('btn-play-duo');
    var btnSettings = document.getElementById('btn-settings');
    var btnCustomize = document.getElementById('btn-customize');

    applyButtonStyles(btnPlaySolo);
    applyButtonStyles(btnPlayDuo);
    applyButtonStyles(btnSettings);
    applyButtonStyles(btnCustomize);

    applyButtonStyles(btnSettings);

    var dialogHeader = document.querySelector('.dialog-header');
    dialogHeader.style.backgroundColor = settingsColor;

    // Define the colors for the health bar based on health percentage
    function updateHealthBarColor() {
        var healthBar = document.getElementById('health-bar');
        var healthPercentage = document.getElementById('health-bar-percentage');
        var percentage = parseInt(healthPercentage.textContent);
        var healthBarColor;

        if (percentage <= 25) { // Dark blue for low health
            healthBarColor = '#00204d';
        } else if (percentage <= 50) { // Medium dark blue for moderate health
            healthBarColor = '#003366';
        } else { // Light blue for full health
            healthBarColor = '#0077cc';
        }

        healthBar.style.backgroundColor = healthBarColor;
    }

    updateHealthBarColor();

})();
