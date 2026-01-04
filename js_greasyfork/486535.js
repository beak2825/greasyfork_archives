// ==UserScript==
// @name         FixUpBalze
// @version      1.0.3
// @description  Improves your Balze experience
// @match        https://*.blazeapp.net/*
// @grant        none
// @license      MIT
// @compatible   chrome
// @compatible   firefox
// @namespace https://greasyfork.org/users/1253827
// @downloadURL https://update.greasyfork.org/scripts/486535/FixUpBalze.user.js
// @updateURL https://update.greasyfork.org/scripts/486535/FixUpBalze.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.title = document.title.replace(/Blaze/g, 'Balze');

    var favicon = document.querySelector("link[rel*='icon']");
    if (favicon) {
        favicon.href = 'https://i.ibb.co/hKbMN3J/balze.png';
    }

    document.body.innerHTML = document.body.innerHTML.replace(/Blaze/g, 'Balze');
    document.body.innerHTML = document.body.innerHTML.replace(/BLAZERS/g, 'BALZERS');
    document.body.innerHTML = document.body.innerHTML.replace(/Flame/g, 'Flop');
    document.body.innerHTML = document.body.innerHTML.replace(/flame/g, 'flop');
    document.body.innerHTML = document.body.innerHTML.replace(/excitement/g, 'boringness');
    document.body.innerHTML = document.body.innerHTML.replace(/thrill/g, 'disappointment');
    document.body.innerHTML = document.body.innerHTML.replace(/connection/g, 'disconnection');
    document.body.innerHTML = document.body.innerHTML.replace(/Meower/g, 'superior platform');
    document.body.innerHTML = document.body.innerHTML.replace(/spam posts that the spammers have created!/g, 'nice innocent posts that someone who was banned for no reason has created!');

    document.addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
            event.preventDefault();
            var randomDelay = Math.floor(Math.random() * (5700 - 3000 + 1) + 3000);
            setTimeout(function() {
                window.location.href = event.target.href;
            }, randomDelay);
        }
    });

    var blockedDomains = [
        'ipify.org',
        'synctrack.io',
        'geojs.io',
        'frog.wix.com',
        'wix-engage-visitors',
        'panorama.wixapps.net'
    ];

    var originalFetch = window.fetch;
    window.fetch = function(input, init) {
        var url = input;
        if (typeof input === 'object' && input.url) {
            url = input.url;
        }
        if (typeof url === 'string' && blockedDomains.some(function(domain) {
            return url.includes(domain);
        })) {
            return new Promise(function() {}); // Return an empty promise to block the request
        }
        return originalFetch.apply(this, arguments);
    };

    setTimeout(function() {
        setInterval(function() {
            var imgElements = document.getElementsByTagName('img');
            for (var i = 0; i < imgElements.length; i++) {
                var imgElement = imgElements[i];
                if (imgElement.src !== 'https://static.wixstatic.com/media/0a8e45_60ff7ca3bff3423584c62b64435f6fb5~mv2.jpg/v1/fill/w_106,h_56,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Screenshot%202024-01-13%20at%206_edited_edited.jpg' && imgElement.src !== 'https://i.ibb.co/rwtXcH7/Balze.png') {
                    imgElement.src = 'https://i.ibb.co/4dPHbWG/Screenshot-from-2024-01-14-13-52-02-485th-copy.png';
                    imgElement.srcset = 'https://i.ibb.co/4dPHbWG/Screenshot-from-2024-01-14-13-52-02-485th-copy.png';
                }
                if (imgElement.src == 'https://static.wixstatic.com/media/0a8e45_60ff7ca3bff3423584c62b64435f6fb5~mv2.jpg/v1/fill/w_106,h_56,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Screenshot%202024-01-13%20at%206_edited_edited.jpg') {
                    imgElement.src = 'https://i.ibb.co/rwtXcH7/Balze.png';
                    imgElement.srcset = 'https://i.ibb.co/rwtXcH7/Balze.png';
                }
            }
        }, 100); // 100 milliseconds = 0.1 seconds
    });
})();
