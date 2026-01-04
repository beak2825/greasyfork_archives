// ==UserScript==
// @name         Prevent Reddit Auto-Translate
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Prevent Reddit from auto-translating posts by removing the /?tl= language parameter from URLs. It is usually added when Reddit posts are opened via Google or other search engines.
// @description:en Prevent Reddit from auto-translating posts by removing the /?tl= language parameter from URLs. It is usually added when Reddit posts are opened via Google or other search engines.
// @description:de Verhindert, dass Reddit-Beiträge automatisch übersetzt werden, indem der /?tl= Parameter aus URLs entfernt wird. Dieser wird in der Regel hinzugefügt, wenn Reddit-Beiträge über Google oder andere Suchmaschinen geöffnet werden.
// @author       https://github.com/anga83
// @match        *://www.reddit.com/*
// @match        *://reddit.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538819/Prevent%20Reddit%20Auto-Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/538819/Prevent%20Reddit%20Auto-Translate.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const currentUrl = window.location.href;
    const hasLanguageParam = currentUrl.includes('/?tl=');
    
    if (hasLanguageParam) {
        const cleanUrl = currentUrl.replace(/\/\?tl=[^&?]*(&|$)/, '/');
        
        if (cleanUrl !== currentUrl) {
            window.location.replace(cleanUrl);
        }
    }
})();
