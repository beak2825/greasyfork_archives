// ==UserScript==
// @name         ThemifyInvites
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make the Invites link theme friendly by reducing it to just a number
// @author       lippy
// @include      http*://*redacted.ch/*
// @include      http*://*apollo.rip/*
// @include      http*://*notwhat.cd/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31934/ThemifyInvites.user.js
// @updateURL https://update.greasyfork.org/scripts/31934/ThemifyInvites.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var main = document.getElementById('nav_invite');

    var invites = main.children[0].innerHTML.match(/[0-9]+/g);
    main.children[0].innerHTML = invites;
})();