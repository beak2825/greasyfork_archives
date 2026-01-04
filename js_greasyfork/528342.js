// ==UserScript==
// @name         Blocca Reindirizzamenti Fastidiosi
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blocca reindirizzamenti causati da schermate invisibili con timer.
// @author       Flejta
// @match        :///*
// @exclude     https://app.pbapi.xyz/*
// @exclude     https://web.whatsapp.com/*
// @exclude     https://www.facebook.com/*
// @exclude     https://claude.ai/*
// @exclude     https://chat.openai.com/*
// @exclude     https://deepseek.ai/*
// @exclude     https://console.anthropic.com/*
// @exclude     https://www.mistral.ai/*
// @exclude     https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528342/Blocca%20Reindirizzamenti%20Fastidiosi.user.js
// @updateURL https://update.greasyfork.org/scripts/528342/Blocca%20Reindirizzamenti%20Fastidiosi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const excludedDomains = [
        // Social e Comunicazione
        'whatsapp.com',
        'facebook.com',
        'twitter.com',
        'instagram.com',
        'linkedin.com',
        'reddit.com',
        'discord.com',
        'telegram.org',

        // Video e Streaming
        'youtube.com',
        'netflix.com',
        'twitch.tv',
        'vimeo.com',

        // AI e Chat
        'claude.ai',
        'openai.com',
        'deepseek.ai',
        'perplexity.ai',
        'anthropic.com',
        'mistral.ai',
        'llama.ai',
        'gemini.google.com',

        // Google Services
        'google.com',
        'gmail.com',
        'drive.google.com',
        'docs.google.com',
        'meet.google.com',

        // Microsoft
        'outlook.live.com',
        'outlook.office.com',
        'office.com',
        'microsoft.com',

        // Media e API
        'pexels.com',
        'unsplash.com',
        'elevenlabs.io',

        // Altri servizi comuni
        'github.com',
        'amazon.com',
        'amazon.it',
        'wikipedia.org',
        'stackoverflow.com',
        'pbapi.xyz'
    ];

    // Controlla se siamo su un dominio escluso
    const currentDomain = window.location.hostname;
    if (excludedDomains.some(domain => currentDomain.endsWith(`.${domain}`) || currentDomain === domain)) {
        console.log('Script non eseguito su dominio escluso:', currentDomain);
        return;
    }

    // Blocca reindirizzamenti fastidiosi
    window.onbeforeunload = function() {
        return false;
    };

    // Blocca click su elementi invisibili
    document.addEventListener('click', function(event) {
        const target = event.target;
        if (target.style.display === 'none' ||
            target.style.visibility === 'hidden' ||
            target.style.opacity === '0') {
            event.preventDefault();
            event.stopPropagation();
            console.log('Click su elemento invisibile bloccato!');
        }
    }, true);

    // Blocca timer con ritardo superiore a 10 secondi
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(callback, delay) {
        if (delay < 10000) {
            return originalSetTimeout(callback, delay);
        }
        console.log('Timer bloccato:', callback);
        return null;
    };
})();