// ==UserScript==
// @name         Flight Rising: Active Dragon to Bio
// @description  Instead of sifting through someones lair, clicking the active dragon on the forums or user profile will link directly to the dragon.
// @namespace    https://greasyfork.org/en/users/547396
// @author       https://greasyfork.org/en/users/547396
// @match        *.flightrising.com/main.php?p=*&tab=userpage*
// @match        *.flightrising.com/forums/*
// @icon         https://www.google.com/s2/favicons?domain=flightrising.com
// @grant        none
// @version      0.2
// @downloadURL https://update.greasyfork.org/scripts/444220/Flight%20Rising%3A%20Active%20Dragon%20to%20Bio.user.js
// @updateURL https://update.greasyfork.org/scripts/444220/Flight%20Rising%3A%20Active%20Dragon%20to%20Bio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.URL.includes('tab=userpage')) {
        const avatar = document.querySelector("#userdata > div:nth-child(1) > span:nth-child(5) > span:nth-child(1) > img");
        avatar.style.cursor = 'pointer';
        avatar.addEventListener('click', openDragonBio);
    } else {
        const avatars = document.querySelectorAll('.post-author-avatar > a > img');

        for (let avatar of avatars) {
            avatar.addEventListener('click', openDragonBio);
        }
    }

    function openDragonBio(e) {
        e.preventDefault();

        let avatarSrc = e.target.src.split('/'),
          dID = avatarSrc[avatarSrc.length - 1].split('p.png')[0],
          dURL = 'https://www1.flightrising.com/dragon/' + dID;

        window.location.href = dURL;

    }
})();