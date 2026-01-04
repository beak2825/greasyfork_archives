// ==UserScript==
// @name         ShellGuy Client
// @namespace    http://tampermonkey.net/
// @version      V1
// @description  A Cheat Client For Shell Shockers
// @author       Ludum
// @match        *://shellshock.io/*
// @icon         none
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489888/ShellGuy%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/489888/ShellGuy%20Client.meta.js
// ==/UserScript==

(function() {
    'use strict';

     function createShellGuyClient() {
        var ShellGuyClient = document.createElement('div');
        ShellGuyClient.id = 'shellguy-clientV1';
        ShellGuyClient.style.position = 'fixed';
        ShellGuyClient.style.top = '20px';
        ShellGuyClient.style.middle = '20px';
        ShellGuyClient.style.zIndex = '9999';
        ShellGuyClient.style.background = '#fff';
        ShellGuyClient.style.border = '1px solid #000';
        ShellGuyClient.style.padding = '10px';

          var isDragging = false;
        var offsetX = 0;
        var offsetY = 0;

        ShellGuyClient.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - ShellGuyClient.getBoundingClientRect().left;
            offsetY = e.clientY - ShellGuyClient.getBoundingClientRect().top;
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                ShellGuyClient.style.left = e.clientX - offsetX + 'px';
                ShellGuyClient.style.top = e.clientY - offsetY + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });


        var title = document.createElement('h3');
        title.innerText = 'Shell Guy Client V1';
        ShellGuyClient.appendChild(title);

        var godModeButton = document.createElement('button');
        godModeButton.innerText = 'God Mode';
        godModeButton.addEventListener('click', function() {
            // Implement God Mode functionality here
            alert('God Mode Under Maintenance!');
        });
        ShellGuyClient.appendChild(godModeButton);

        var unlimitedAmmoButton = document.createElement('button');
        unlimitedAmmoButton.innerText = 'Unlimited Ammo';
        unlimitedAmmoButton.addEventListener('click', function() {
            // Implement Unlimited Ammo functionality here
            alert('Unlimited Ammo Activated!');
            var ammoAmount
            ammoAmount=99999999
        });
        ShellGuyClient.appendChild(unlimitedAmmoButton);

        document.body.appendChild(ShellGuyClient);
    }

    createShellGuyClient();
})();