// ==UserScript==
// @name         ByeTrackers
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Block most trackers
// @description:es Bloquear la mayoría de los rastreadores
// @description:fr Bloquer la plupart des trackers
// @description:pt Bloquear a maioria dos rastreadores
// @description:pl Blokowanie większości trackerów
// @description:ru блокировать большинство трекеров
// @description:ko 블록 대부분의 추적기
// @description:uk блокувати більшість трекерів
// @author       Electric
// @match        *://*/*
// @icon         https://i.ibb.co/39njPKnw/Projekt-bez-nazwy-1.png
// @grant        none
// @license      CC BY-NC 4.0
// @downloadURL https://update.greasyfork.org/scripts/529628/ByeTrackers.user.js
// @updateURL https://update.greasyfork.org/scripts/529628/ByeTrackers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const trackers = [
        'doubleclick.net', 'ads.google.com', 'googlesyndication.com', '2mdn.net', 'googletagservices.com',
        'googletagmanager.com', 'googleadservices.com', 'adform.net', 'adlucent.com', 'adobe.demdex.net',
        'everesttech.net', 'adora-ai.com', 'adosiz.net', 'adrecord.com', 'adsplusmetrics.com', 'adsplustracker.com',
        'adsplusgrowth.com', 'octotracker.com', 'bemob.com', 'zeustrack.io', 'binom.org', 'redtrack.io',
        'voluum.com', 'keitaro.io', 'adspect.ai', 'adsbridge.com', 'peerclick.com', 'cpatracker.ru',
        'criteo.com', 'taboola.com', 'rubiconproject.com', 'pubmatic.com', 'appnexus.com', 'adsrvr.org',
        'advertising.com', 'outbrain.com', 'revcontent.com', 'mediavine.com', 'adroll.com', 'openx.net',
        'smartadserver.com', 'bidr.io', 'contextweb.com', 'gumgum.com', 'lijit.com', 'moatads.com',
        'nativo.net', 'sharethrough.com', 'spotxchange.com', 'teads.tv', 'yieldmo.com', 'bidswitch.net',
        'connatix.com', 'districtm.io', 'fyber.com', 'indexexchange.com', 'lockerdome.com', 'myvisualiq.net',
        'onetag-sys.com', 'parrable.com', 'quantcast.com', 'rfihub.com', 'simpli.fi', 'sonobi.com',
        'stackadapt.com', 'triplelift.com', 'unrulymedia.com', 'varickmedia.com', 'vizu.com', 'widespace.com',
        'zemanta.com', 'zqtk.net', 'scorecardresearch.com'
    ];

    const observer = new MutationObserver(() => {
        trackers.forEach(tracker => {
            document.querySelectorAll(`iframe[src*='${tracker}'], script[src*='${tracker}']`).forEach(el => el.remove());
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();