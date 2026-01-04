// ==UserScript==
// @name         Jadisco Volume Slider
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a volume slider to jadisco.pl
// @author       Madatt
// @match        https://player.kick.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512050/Jadisco%20Volume%20Slider.user.js
// @updateURL https://update.greasyfork.org/scripts/512050/Jadisco%20Volume%20Slider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.top === window.self) return;

    var sliderBottom = 25;
    var sliderLeft = 70;

    var slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 1;
    slider.step = 0.01;
    slider.value = 1;

    slider.style.position = 'fixed';
    slider.style.bottom = sliderBottom + 'px';
    slider.style.left = sliderLeft + 'px';
    slider.style.zIndex = 1000;
    slider.style.opacity = 0;
    slider.style.transition = 'opacity 0.3s';

    document.body.appendChild(slider);

    function showSlider() {
        slider.style.opacity = 1;
    }

    function hideSlider() {
        slider.style.opacity = 0;
    }

    slider.addEventListener('mouseover', showSlider);
    slider.addEventListener('mouseout', hideSlider);

    slider.addEventListener('input', function() {
        var videoElement = document.querySelector('.vjs-tech');
        if (videoElement) {
            videoElement.volume = slider.value;
        }
    });


    var hoverArea = document.createElement('div');
    hoverArea.style.position = 'fixed';
    hoverArea.style.bottom = (sliderBottom - 10) + 'px';
    hoverArea.style.left = (sliderLeft - 20) + 'px';
    hoverArea.style.width = '130px';
    hoverArea.style.height = '60px';
    hoverArea.style.zIndex = 999;
    hoverArea.style.backgroundColor = 'transparent';

    document.body.appendChild(hoverArea);

    hoverArea.addEventListener('mouseover', showSlider);
    hoverArea.addEventListener('mouseout', hideSlider);
})();