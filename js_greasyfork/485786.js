// ==UserScript==
// @name         Dokemon Hide/Unhide Button
// @namespace    https://greasyfork.org/en/scripts/485786-dokemon-hide-unhide-button
// @version      0.5.1
// @description  Adds a button to hide and unhide a specific div
// @icon         https://raw.githubusercontent.com/productiveops/dokemon/main/web/public/assets/images/favicon.png
// @author       D3F0NC3UR
// @match        http://*:9090/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485786/Dokemon%20HideUnhide%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/485786/Dokemon%20HideUnhide%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button
    const button = document.createElement('button');
    button.innerText = 'Toggle Div';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.left = '10px';
    button.style.zIndex = '9999';
    button.style.border = 'solid';

    // Add click event to toggle the visibility of the specified div
    button.addEventListener('click', function() {
        const targetDiv = document.querySelector('.fixed.inset-y-0.z-50.flex.w-72.flex-col');
        if (targetDiv) {
            targetDiv.style.display = (targetDiv.style.display === 'none') ? '' : 'none';
        }
    });

    // Append the button to the body
    document.body.appendChild(button);
})();