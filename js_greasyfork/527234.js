// ==UserScript==
// @name         Nova Hill Obsidian
// @namespace     https://nova-hill.com/
// @version      1.5
// @description  Makes the Nova-Hill theme extra dark so its easy on your eyes.
// @author       fajay
// @match        https://nova-hill.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527234/Nova%20Hill%20Obsidian.user.js
// @updateURL https://update.greasyfork.org/scripts/527234/Nova%20Hill%20Obsidian.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.style.fontFamily = 'Montserrat, sans-serif';
    document.body.style.fontWeight = 'bold';
    document.body.style.backgroundColor = '#0b0b0b';
    document.body.style.color = '#ffffff';

    let elements = document.querySelectorAll('*');
    elements.forEach(el => {
        el.style.backgroundColor = '#0b0b0b';
        el.style.color = '#ffffff';
        el.style.fontFamily = 'Montserrat, sans-serif';
        el.style.fontWeight = 'bold';
    });

    let buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.style.background = 'linear-gradient(0deg, #151416 0%, #474747 100%)';
        btn.style.color = '#ffffff';
    });

    const iconReplacer = (iconClass, iconName) => {
        let iconElements = document.querySelectorAll(`.${iconClass}`);
        iconElements.forEach(icon => {
            icon.classList.add(iconName);
            icon.style.fontSize = '20px';
            icon.style.background = 'none';
            icon.style.border = 'none';
            icon.style.display = 'inline-block';
            icon.style.verticalAlign = 'middle';
        });
    };

    iconReplacer('bucks-icon', 'icon-bucks');
    iconReplacer('bits-icon', 'icon-bits');
    iconReplacer('messages-icon', 'icon-messages');
    iconReplacer('friends-icon', 'icon-friends');
    iconReplacer('candy-icon', 'icon-candy');
    iconReplacer('special-e-icon', 'icon-special');
    iconReplacer('special-icon', 'icon-special2');
    iconReplacer('arrow-down', 'icon-arrow-down');
})();
