// ==UserScript==
// @name         Dead Frontier Mini Window
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Dead Frontier-Adds a button to the Dead Frontier page that when clicked shows or hides a mini-window containing the DF Profiler Boss map and a timer
// @author       SHUNHK
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=0
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=21
// @icon         https://i.imgur.com/jSofZbc.jpeg
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/512165/Dead%20Frontier%20Mini%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/512165/Dead%20Frontier%20Mini%20Window.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var button = document.createElement('button');
    button.innerHTML = 'BOSS mini MAP';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    document.body.appendChild(button);

    var timer = document.createElement('div');
    timer.innerHTML = 'Timer: 0s';
    timer.style.position = 'fixed';
    timer.style.top = '40px';
    timer.style.right = '10px';
    timer.style.zIndex = '1000';
    document.body.appendChild(timer);

    var miniWindow = document.createElement('div');
    miniWindow.style.display = 'none';
    miniWindow.style.position = 'fixed';
    miniWindow.style.top = '70px';
    miniWindow.style.right = '10px';
    miniWindow.style.width = '900px';
    miniWindow.style.height = '500px';
    miniWindow.style.backgroundColor = 'white';
    miniWindow.style.border = '1px solid black';
    miniWindow.style.zIndex = '1000';
    miniWindow.innerHTML = '<iframe id="bossMapIframe" src="https://www.dfprofiler.com/bossmap" style="width:100%; height:100%; border:none;"></iframe>';
    document.body.appendChild(miniWindow);

    var interval;
    var lastClosedTime = Date.now();

    function updateTimer() {
        var elapsedTime = Math.floor((Date.now() - lastClosedTime) / 1000);
        timer.innerHTML = 'Timer: ' + elapsedTime + 's';
    }

    setInterval(updateTimer, 1000);

    button.addEventListener('click', function() {
        var iframe = document.getElementById('bossMapIframe');
        iframe.src = iframe.src; //

        if (miniWindow.style.display === 'none') {
            miniWindow.style.display = 'block';
            lastClosedTime = Date.now();
        } else {
            miniWindow.style.display = 'none';
        }
    });
})();
