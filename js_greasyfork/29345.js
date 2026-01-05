// ==UserScript==
// @name         Steamgifts: Add SteamGifts Tools Links
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @author       Bisumaruko
// @description  Add Steamgifts Tools links to Steamgifts sidebar
// @include      http*://www.steamgifts.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29345/Steamgifts%3A%20Add%20SteamGifts%20Tools%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/29345/Steamgifts%3A%20Add%20SteamGifts%20Tools%20Links.meta.js
// ==/UserScript==

(function ($) {
    'use strict';

    if (!$('.sidebar').length) return;

    $('.sidebar').append(`
        <h3 class="sidebar__heading">SteamGifts Tools</h3>
        <ul class="sidebar__navigation">
            ${createLinks()}
        </ul>
    `);

    function createLinks() {
        var user = location.href.includes('/user/') ?
                    location.href.split('/').pop() :
                    $('.nav__avatar-outer-wrap').attr('href').slice(6),
            links = '',
            data = [{
                text: 'Real CV sent',
                url: 'http://www.sgtools.info/sent/' + user + '/newestfirst'
            }, {
                text: 'Real CV won',
                url: 'http://www.sgtools.info/won/' + user + '/newestfirst'
            }, {
                text: 'Not activated',
                url: 'http://www.sgtools.info/nonactivated/' + user
            }, {
                text: 'Multiple wins',
                url: 'http://www.sgtools.info/multiple/' + user
            }];

        for (let d of data) {
            links += `
                <li ="sidebar__navigation__item">
                    <a class="sidebar__navigation__item__link" href="${d.url}">
                        <div class="sidebar__navigation__item__name">${d.text}</div>
                        <div class="sidebar__navigation__item__underline"></div>
                    </a>
                </li>
            `;
        }

        return links;
    }

})(jQuery);