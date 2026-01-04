// ==UserScript==
// @name         steal skin
// @namespace    http://tampermonkey.net/
// @version      1
// @description  right click a cell
// @author       jack
// @match        *://agma.io/*
// @icon         https://agma.io/agm3.ico
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495588/steal%20skin.user.js
// @updateURL https://update.greasyfork.org/scripts/495588/steal%20skin.meta.js
// ==/UserScript==
addEventListener('load', () => {
    const ctxSteal = $('<li>', {id: 'contextStealSkin', class: 'contextmenu-item'}).append('<div class="fa fa-download fa-2x context-icon"></div><p>Steal Skin</p>').insertAfter('#contextSpectate');
    $('#contextMenu').on('DOMSubtreeModified', () => setTimeout(() => ctxSteal.attr('class', `contextmenu-item ${$('#contextMute').hasClass('enabled') ? 'enabled' : ''}`)));
    ctxSteal.click(() => {
        const id = $('#contextPlayerSkin').css('background-image').match(/skins\/(\d+)_lo\.png\?u=\d+/)?.[1];
        id ? $('<a>', {href: `/skins/${id}.png`, download: `${id}.png`}).appendTo('body').get(0).click().remove() : $('#curser').text('No Skin on Cell').css('color', 'red').show().fadeOut(2e3);
    });
});
