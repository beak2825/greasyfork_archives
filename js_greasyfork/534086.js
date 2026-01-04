// ==UserScript==
// @name         Smart Redirect to DuckDuckGo
// @namespace    https://github.com/MehmetCanWT
// @version      1.7
// @author       MehmetCanWT
// @match        *://www.google.*/*
// @match        *://www.bing.com/*
// @match        *://yandex.com/*
// @match        *://yandex.com.tr/*
// @grant        none
// @run-at       document-start
// @description Gerçek aramaları hızlıca DuckDuckGo'ya yönlendirir. Tarayıcı dilini algılar, geçerli değilse İngilizce (en-us) kullanır 🌍🚀🔥
// @downloadURL https://update.greasyfork.org/scripts/534086/Smart%20Redirect%20to%20DuckDuckGo.user.js
// @updateURL https://update.greasyfork.org/scripts/534086/Smart%20Redirect%20to%20DuckDuckGo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href);

    const isGoogleSearch = url.hostname.includes('google.') && url.pathname === '/search';
    const isBingSearch = url.hostname.includes('bing.com') && url.pathname === '/search';
    const isYandexSearch = url.hostname.includes('yandex.') && url.pathname === '/search/';

    if (isGoogleSearch || isBingSearch || isYandexSearch) {
        const query = url.searchParams.get('q') || url.searchParams.get('text');

        if (query) {
            // Tarayıcı dilini al
            let language = navigator.language ? navigator.language.toLowerCase() : '';

            // Geçerli dil mi kontrol et (örnek: tr-tr, en-us vs.)
            const validLangPattern = /^[a-z]{2}-[a-z]{2}$/;
            if (!validLangPattern.test(language)) {
                language = 'en-us'; // Geçerli değilse İngilizce yap
            }

            const duckduckgoURL = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&kl=${encodeURIComponent(language)}`;

            window.location.replace(duckduckgoURL);
        }
    }
})();
