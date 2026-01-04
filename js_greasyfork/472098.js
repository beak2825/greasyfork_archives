// ==UserScript==
// @name         Libre Frontend Redirect
// @namespace    https://kolektiva.social/@helios97
// @version      1.3
// @description  Gives buttom to redirect from a Libre Frontend instance to another instance to counter rate-limiting. (Currently Supported: Reddit, Quora. Planned: Youtube, github, etc)
// @author       Helios97
// @license      GNU GPLv3

// @match        https://safereddit.com/*
// @match        https://libreddit.kavin.rocks/*
// @match        https://libreddit.privacy.com.de/*
// @match        https://reddit.baby/*
// @match        https://libreddit.domain.glass/*
// @match        https://libreddit.northboot.xyz/*
// @match        https://libreddit.privacydev.net/*
// @match        https://l.opnxng.com/*
// @match        https://rd.funami.tech/*
// @match        https://libreddit.oxymagnesium.com/*
// @match        https://libreddit.freedit.eu/*
// @match        https://lr.4201337.xyz/*
// @match        https://lr.artemislena.eu/*
// @match        https://lr.aeong.one/*
// @match        https://reddit.smnz.de/*
// @match        https://libreddit.bus-hit.me/*
// @match        https://reddit.leptons.xyz/*
// @match        https://libreddit.lunar.icu/*
// @match        https://reddit.moe.ngo/*
// @match        https://r.darklab.sh/*
// @match        https://snoo.habedieeh.re/*
// @match        https://libreddit.kutay.dev/*
// @match        https://libreddit.tux.pizza/*

// @match        https://quetre.iket.me/*
// @match        https://quora.vern.cc/*
// @match        https://quetre.pussthecat.org/*
// @match        https://quetre.tokhmi.xyz/*
// @match        https://quetre.projectsegfau.lt/*
// @match        https://quetre.odyssey346.dev/*
// @match        https://quetre.privacydev.net/*
// @match        https://ask.habedieeh.re/*
// @match        https://quetre.blackdrgn.nl/*
// @match        https://quetre.lunar.icu/*
// @match        https://que.wilbvr.me/*
// @match        https://quora.femboy.hu/*
// @match        https://questions.whateveritworks.org/*
// @match        https://quetre.fascinated.cc/*
// @match        https://quetre.frontendfriendly.xyz/*

// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/472098/Libre%20Frontend%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/472098/Libre%20Frontend%20Redirect.meta.js
// ==/UserScript==

// Credit to https://greasyfork.org/en/scripts/469587-reddit-to-libreddit-redirect
// Refactored for general purpose redirect logic, cosmetic changes for mobile friendliness.

(function() {
    'use strict';

    // List of Libreddit instances
    var libredditInstances = [
        'safereddit.com',
        'libreddit.kavin.rocks',
        'libreddit.privacy.com.de',
        'reddit.baby',
        'libreddit.domain.glass',
        'libreddit.northboot.xyz',
        'libreddit.privacydev.net',
        'l.opnxng.com',
        'rd.funami.tech',
        'libreddit.oxymagnesium.com',
        'libreddit.freedit.eu',
        'lr.4201337.xyz',
        'lr.artemislena.eu',
        'lr.aeong.one',
        'reddit.smnz.de',
        'libreddit.bus-hit.me',
        'reddit.leptons.xyz',
        'libreddit.lunar.icu',
        'reddit.moe.ngo',
        'r.darklab.sh',
        'snoo.habedieeh.re',
        'libreddit.kutay.dev',
        'libreddit.tux.pizza'
    ];

    // List of Quetre instances
    var quetreInstances = [
        'quetre.iket.me',
        'quora.vern.cc',
        'quetre.pussthecat.org',
        'quetre.tokhmi.xyz',
        'quetre.projectsegfau.lt',
        'quetre.odyssey346.dev',
        'quetre.privacydev.net',
        'ask.habedieeh.re',
        'quetre.blackdrgn.nl',
        'quetre.lunar.icu',
        'que.wilbvr.me',
        'quora.femboy.hu',
        'questions.whateveritworks.org',
        'quetre.fascinated.cc',
        'quetre.frontendfriendly.xyz'
    ];

    // Get the current instance
    var currentInstance = window.location.hostname;

    // Check for kind of instance
    let instances;

    if (libredditInstances.includes(currentInstance)) {
        instances = libredditInstances;
    } else if (quetreInstances.includes(currentInstance)) {
        instances = quetreInstances;
    }


    // Create the reload button
    var reloadButton = document.createElement('button');
    reloadButton.textContent = '⇄';
    reloadButton.style.position = 'fixed';
    reloadButton.style.bottom = '20px';
    reloadButton.style.right = '20px';
    reloadButton.style.zIndex = '9999';
    reloadButton.style.padding = '8px 12px';
    reloadButton.style.fontSize = '20px';
    reloadButton.style.fontWeight = 'bold';
    reloadButton.style.color = '#fff';
    reloadButton.style.backgroundColor = '#0079d3';
    reloadButton.style.border = 'none';
    reloadButton.style.borderRadius = '4px';
    reloadButton.style.cursor = 'pointer';

    // Add event listener to reload button
    reloadButton.addEventListener('click', function() {
        // Redirect to a random instance
        var randomInstance = instances[Math.floor(Math.random() * instances.length)];
        window.location.href = 'https://' + randomInstance + window.location.pathname + window.location.search + window.location.hash;
    });

    // Append the reload button to the document body
    document.body.appendChild(reloadButton);
})();