// ==UserScript==
// @name         WaPo Metal Taglines
// @namespace    http://schep.me/
// @version      0.1
// @description  Replaces WaPo's "Democracy Dies in Darkness" with metal songs from http://www.slate.com/blogs/the_slatest/2017/02/22/_15_classic_metal_albums_whose_titles_are_less_dark_than_the_washington.html
// @author       Daniel Schep
// @match        https://www.washingtonpost.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27767/WaPo%20Metal%20Taglines.user.js
// @updateURL https://update.greasyfork.org/scripts/27767/WaPo%20Metal%20Taglines.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var titles = [
        'Democracy Dies in Darkness',
        'Welcome to Hell',
        'Screaming for Vengeance',
        'Reign in Blood',
        'The Erosion of Sanity',
        'Altars of Madness',
        'Vulgar Display of Power',
        'Seasons in the Abyss',
        'Slowly We Rot',
        'Bonded by Blood',
        'Storm of the Light’s Bane',
        'Operation: Mindcrime',
        'The Downward Spiral',
        'All Hope Is Gone',
        'Kill ’Em All',
        'Peace Sells … but Who’s Buying?',
    ];
    var title = titles[Math.floor(Math.random() * titles.length)];
    Array.slice(document.querySelectorAll('.masthead-tagline a,.header-tagline')).map(function(element) {
        element.innerHTML = title;
    });
})();