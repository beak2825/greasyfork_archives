// ==UserScript==
// @name         "Open Link in New Tab" Button
// @namespace    openlinkinnewtab
// @version      1.1.1
// @description  Adds an "Open link in new tab" button
// @author       Who cares
// @license      GPLv3
// @match        *://*/*
// @exclude      *://tesla.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480394/%22Open%20Link%20in%20New%20Tab%22%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/480394/%22Open%20Link%20in%20New%20Tab%22%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addOpenInNewTabButton(link) {
        const button = document.createElement('button');
        button.style.position = 'absolute';
        button.style.display = 'inline-block';
        button.style.zIndex = '9999';
        button.style.padding = '3px';
        button.style.background = 'white';
        button.style.color = 'black';
        button.style.border = '1px solid #555555';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.margin = '5px';
        button.style.opacity = '0';

        const icon1 = document.createElement('img');
        icon1.src = 'https://i.ibb.co/b71mV9V/new-tab-dark.png';
        icon1.style.width = '15px';

        const icon2 = document.createElement('img');
        icon2.src = 'https://i.ibb.co/b71mV9V/new-tab-dark.png';
        icon2.style.width = '20px';
        icon2.style.display = 'none';

        button.appendChild(icon1);
        button.appendChild(icon2);

        button.addEventListener('click', function(event) {
            event.stopPropagation();
            window.open(link.href, '_blank', 'noopener,noreferrer');
        });

        button.addEventListener('mouseover', function() {
            button.style.opacity = '1';
            button.style.border = '1px solid #777777';
            button.style.background = '#ffff00';
            button.style.color = 'white';
            icon1.style.display = 'none';
            icon2.style.display = 'inline';
        });

        button.addEventListener('mouseout', function() {
            button.style.opacity = '0';
            button.style.border = '1px solid #555555';
            button.style.background = 'white';
            button.style.color = 'black';
            icon1.style.display = 'inline';
            icon2.style.display = 'none';
        });

        link.addEventListener('mouseover', function() {
            button.style.opacity = '1';
        });

        link.addEventListener('mouseout', function() {
            button.style.opacity = '0';
        });

        link.parentNode.appendChild(button);
    }

    document.querySelectorAll('a').forEach(function(link) {
        addOpenInNewTabButton(link);
    });
})();
