// ==UserScript==
// @name         Nova Hill Flashbang
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Change all text on Nova Hill to Montserrat Bold and apply a blinding white theme that destroys your vision slowly.
// @author       You
// @match        https://nova-hill.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527235/Nova%20Hill%20Flashbang.user.js
// @updateURL https://update.greasyfork.org/scripts/527235/Nova%20Hill%20Flashbang.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.style.fontFamily = 'Montserrat, sans-serif';
    document.body.style.fontWeight = 'bold';
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#000000';

    let elements = document.querySelectorAll('*');
    elements.forEach(el => {
        el.style.backgroundColor = '#ffffff';
        el.style.color = '#000000';
        el.style.fontFamily = 'Montserrat, sans-serif';
        el.style.fontWeight = 'bold';
    });

    let buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.style.background = 'linear-gradient(0deg, #f1f1f1 0%, #e1e1e1 100%)';
        btn.style.color = '#000000';
    });

    const iconReplacer = (iconClass, iconName) => {
        let iconElements = document.querySelectorAll(`.${iconClass}`);
        iconElements.forEach(icon => {
            icon.classList.replace(icon.classList[0], iconName);
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
