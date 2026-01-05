// ==UserScript==
// @name         InfoQ Speed Controls
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  More speed
// @author       Jeremy tymes
// @match        https://www.infoq.com/presentations/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27916/InfoQ%20Speed%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/27916/InfoQ%20Speed%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var speeds = [1, 1.25, 1.5, 1.75, 2];
    var containerFrag = document.createDocumentFragment();
    var linkContainer = document.createElement('div');
    linkContainer.classList.add('download_presentation');
    var linkList = document.createElement('ul');
    var player = document.querySelector('#video');
    var playerContainer = document.querySelector('#playerContainer');
    if (!playerContainer) return;
    
    speeds.forEach(function(speed, i) {
        var li = document.createElement('li');
        var link = document.createElement('a');
        link.href = '#';
        link.textContent = speed + 'x';
        link.style.paddingLeft = '5px';
        link.style.paddingRight = '5px';
        link.addEventListener('click', function(e) {
            e.preventDefault();
            player.playbackRate = speed;
        });
        li.appendChild(link);
        linkList.appendChild(li);
        if (i !== speeds.length -1) {
            var spacer = document.createElement('li');
            spacer.textContent = '|';
            linkList.appendChild(spacer);
        }
    });
    linkContainer.appendChild(linkList);
    containerFrag.appendChild(linkContainer);
    playerContainer.after(containerFrag);
    
    player.addEventListener('click', function() {
        if (this.paused) {
            this.play();
        } else {
            this.pause();
        }
    });
})();