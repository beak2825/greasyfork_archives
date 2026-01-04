// ==UserScript==
// @name         Enable Songsterr Plus
// @version      1.0
// @description  Enable songsterr Plus
// @author       CageistArc
// @grant        none
// @include *songsterr.com*
// @include songsterr.com*
// @include *songsterr.com
// @include songsterr.com
// @include www.songsterr.com*
// @include http://songsterr.com/*
// @include https://songsterr.com/*
// @include http://*.songsterr.com/*
// @include https://*.songsterr.com/*
// @namespace https://greasyfork.org/users/1403103
// @downloadURL https://update.greasyfork.org/scripts/519027/Enable%20Songsterr%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/519027/Enable%20Songsterr%20Plus.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const a = document.body.querySelector('#state');
    a.textContent = a.textContent.replace('hasPlus":false', 'hasPlus":true');

    //window.addEventListener('load', () => {
        //const b = document.body.querySelector(navigator.userAgentData.mobile ? '#showroom_header' : '#showroom');
        //b?.removeAttribute('id');
        //b?.removeAttribute('class');
    //});

    setTimeout(function() {
        const tablatureElement = document.body.querySelector('#showroom > #tablature');
        const apptabElement = document.body.querySelector('#apptab');

        if (tablatureElement && apptabElement) {
            apptabElement.prepend(tablatureElement);
        }
    }, 2000);
})();