// ==UserScript==
// @name         Sunshine Patcher
// @namespace    http://sunshine.skailar.net/
// @version      1.0
// @description  Patches the Discord client to use sunshine servers.
// @author       Koru
// @match        https://discord.com/*
// @run-at document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475144/Sunshine%20Patcher.user.js
// @updateURL https://update.greasyfork.org/scripts/475144/Sunshine%20Patcher.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const oldGlobalEnv = window.GLOBAL_ENV;
    const newGlobalEnv = {
        API_ENDPOINT: '//sunshine.skailar.net/api',
        API_VERSION: oldGlobalEnv.API_VERSION,
        GATEWAY_ENDPOINT: 'wss://sunshine.skailar.net',
        WEBAPP_ENDPOINT: '//sunshine.skailar.net',
        CDN_HOST: 'sunshine.skailar.net',
        ASSET_ENDPOINT: '//sunshine.skailar.net',
        MEDIA_PROXY_ENDPOINT: '//sunshine.skailar.net',
        WIDGET_ENDPOINT: '//sunshine.skailar.net/widget',
        INVITE_HOST: 'sunshine.skailar.net',
        GUILD_TEMPLATE_HOST: 'sunshine.skailar.net',
        GIFT_CODE_HOST: 'sunshine.skailar.net',
        RELEASE_CHANNEL: oldGlobalEnv.RELEASE_CHANNEL,
        DEVELOPERS_ENDPOINT: '//sunshine.skailar.net',
        MARKETING_ENDPOINT: '//sunshine.skailar.net',
        BRAINTREE_KEY: oldGlobalEnv.BRAINTREE_KEY,
        STRIPE_KEY: oldGlobalEnv.STRIPE_KEY,
        NETWORKING_ENDPOINT: '//sunshine.skailar.net',
        RTC_LATENCY_ENDPOINT: '//sunshine.skailar.net/rtc',
        ACTIVITY_APPLICATION_HOST: 'sunshine.skailar.net',
        PROJECT_ENV: 'production',
        REMOTE_AUTH_ENDPOINT: '//sunshine.skailar.net',
        SENTRY_TAGS: oldGlobalEnv.SENTRY_TAGS,
        MIGRATION_SOURCE_ORIGIN: 'https://sunshine.skailar.net',
        MIGRATION_DESTINATION_ORIGIN: 'https://sunshine.skailar.net',
        HTML_TIMESTAMP: Date.now(),
        ALGOLIA_KEY: oldGlobalEnv.ALGOLIA_KEY,
        PUBLIC_PATH: '/assets/'
    };
    window.GLOBAL_ENV = newGlobalEnv;
    for (const key in window) {
        if (window[key] && window[key].toString().includes('gateway.discordapp.com')) {
            window[key] = window[key].toString().replace(/gateway\.discordapp\.com/g, 'sunshine.skailar.net');
        }
    }
    for (const key in window) {
        if (window[key] && window[key].toString().includes('discord.com/error-reporting-proxy/web')) {
            window[key] = window[key].toString().replace(/discord\.com/g, 'sunshine.skailar.net');
        }
    }
})();