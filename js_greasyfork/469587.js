// ==UserScript==
// @name         Reddit to Libreddit Redirect
// @namespace    https://kbin.social/u/LollerCorleone
// @version      1.2
// @description  Redirects Reddit links to randomly chosen Libreddit instances automatically and provides an option to reload in a different instance, if the user wishes to do so.
// @author       LollerCorleone
// @license      GNU GPLv3
// @match        *://www.reddit.com/*
// @match        *://old.reddit.com/*
// @match        https://libreddit.kavin.rocks/*
// @match        https://reddit.invak.id/*
// @match        https://reddit.simo.sh/*
// @match        https://lr.riverside.rocks/*
// @match        https://libreddit.strongthany.cc/*
// @match        https://libreddit.privacy.com.de/*
// @match        https://reddit.baby/*
// @match        https://libreddit.domain.glass/*
// @match        https://r.nf/*
// @match        https://libreddit.de/*
// @match        https://libreddit.pussthecat.org/*
// @match        https://libreddit.northboot.xyz/*
// @match        https://libreddit.hu/*
// @match        https://libreddit.totaldarkness.net/*
// @match        https://lr.vern.cc/*
// @match        https://libreddit.nl/*
// @match        https://reddi.tk/*
// @match        https://r.walkx.fyi/*
// @match        https://libreddit.kylrth.com/*
// @match        https://libreddit.tiekoetter.com/*
// @match        https://reddit.rtrace.io/*
// @match        https://libreddit.privacydev.net/*
// @match        https://r.ahwx.org/*
// @match        https://libreddit.dcs0.hu/*
// @match        https://reddit.dr460nf1r3.org/*
// @match        https://l.opnxng.com/*
// @match        https://libreddit.cachyos.org/*
// @match        https://rd.funami.tech/*
// @match        https://libreddit.projectsegfau.lt/*
// @match        https://lr.slipfox.xyz/*
// @match        https://libreddit.oxymagnesium.com/*
// @match        https://reddit.utsav2.dev/*
// @match        https://libreddit.freedit.eu/*
// @match        https://libreddit.mha.fi/*
// @match        https://libreddit.garudalinux.org/*
// @match        https://lr.4201337.xyz/*
// @match        https://lr.artemislena.eu/*
// @match        https://libreddit.pufe.org/*
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
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/469587/Reddit%20to%20Libreddit%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/469587/Reddit%20to%20Libreddit%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of Libreddit instances
    var libredditInstances = [
        'https://libreddit.kavin.rocks',
        'https://reddit.invak.id',
        'https://reddit.simo.sh',
        'https://lr.riverside.rocks',
        'https://libreddit.strongthany.cc',
        'https://libreddit.privacy.com.de',
        'https://reddit.baby',
        'https://libreddit.domain.glass',
        'https://r.nf',
        'https://libreddit.de',
        'https://libreddit.pussthecat.org',
        'https://libreddit.northboot.xyz',
        'https://libreddit.hu',
        'https://libreddit.totaldarkness.net',
        'https://lr.vern.cc',
        'https://libreddit.nl',
        'https://reddi.tk',
        'https://r.walkx.fyi',
        'https://libreddit.kylrth.com',
        'https://libreddit.tiekoetter.com',
        'https://reddit.rtrace.io',
        'https://libreddit.privacydev.net',
        'https://r.ahwx.org',
        'https://libreddit.dcs0.hu',
        'https://reddit.dr460nf1r3.org',
        'https://l.opnxng.com',
        'https://libreddit.cachyos.org',
        'https://rd.funami.tech',
        'https://libreddit.projectsegfau.lt',
        'https://lr.slipfox.xyz',
        'https://libreddit.oxymagnesium.com',
        'https://reddit.utsav2.dev',
        'https://libreddit.freedit.eu',
        'https://libreddit.mha.fi',
        'https://libreddit.garudalinux.org',
        'https://lr.4201337.xyz',
        'https://lr.artemislena.eu',
        'https://libreddit.pufe.org',
        'https://lr.aeong.one',
        'https://reddit.smnz.de',
        'https://libreddit.bus-hit.me',
        'https://reddit.leptons.xyz',
        'https://libreddit.lunar.icu',
        'https://reddit.moe.ngo',
        'https://r.darklab.sh',
        'https://snoo.habedieeh.re',
        'https://libreddit.kutay.dev',
        'https://libreddit.tux.pizza'
    ];

    // Get the current URL
    var currentUrl = window.location.href;

    // Check if the URL matches the Reddit homepage
    if (currentUrl === 'https://www.reddit.com/' || currentUrl === 'https://old.reddit.com/') {
        // Redirect to a random Libreddit instance's homepage
        var randomInstance = libredditInstances[Math.floor(Math.random() * libredditInstances.length)];
        window.location.replace(randomInstance + '/r/all');
        return; // Stop further script execution
    } else if (currentUrl.match(/https?:\/\/(?:www|old|libreddit)\.reddit\.com\/r\/\w+\//)) {
        // Construct the Libreddit subreddit URL
        var libredditUrl = currentUrl.replace(/https?:\/\/(?:www|old|libreddit)\.reddit\.com/, function(match) {
            return libredditInstances[Math.floor(Math.random() * libredditInstances.length)];
        });

        // Redirect to the Libreddit subreddit URL
        window.location.replace(libredditUrl);
        return; // Stop further script execution
    } else if (currentUrl.match(/https?:\/\/(?:www|old|libreddit)\.reddit\.com\/r\/\w+\/comments\/\w+\//)) {
        // Construct the Libreddit post URL
        var libredditUrl = currentUrl.replace(/https?:\/\/(?:www|old|libreddit)\.reddit\.com/, function(match) {
            return libredditInstances[Math.floor(Math.random() * libredditInstances.length)];
        });

        // Redirect to the Libreddit post URL
        window.location.replace(libredditUrl);
        return; // Stop further script execution
    }

    // Create the reload button
    var reloadButton = document.createElement('button');
    reloadButton.textContent = 'Reload in Another Instance';
    reloadButton.style.position = 'fixed';
    reloadButton.style.bottom = '10px';
    reloadButton.style.right = '10px';
    reloadButton.style.zIndex = '9999';
    reloadButton.style.padding = '8px 12px';
    reloadButton.style.fontSize = '14px';
    reloadButton.style.fontWeight = 'bold';
    reloadButton.style.color = '#fff';
    reloadButton.style.backgroundColor = '#0079d3';
    reloadButton.style.border = 'none';
    reloadButton.style.borderRadius = '4px';
    reloadButton.style.cursor = 'pointer';

    // Add event listener to reload button
    reloadButton.addEventListener('click', function() {
        // Redirect to a random Libreddit instance
        var randomInstance = libredditInstances[Math.floor(Math.random() * libredditInstances.length)];
        window.location.href = randomInstance + window.location.pathname + window.location.search + window.location.hash;
    });

    // Append the reload button to the document body
    document.body.appendChild(reloadButton);
})();