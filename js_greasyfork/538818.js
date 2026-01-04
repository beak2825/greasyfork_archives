// ==UserScript==
// @name         Auto Remove ChatGPT UTM Parameter
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Removes ?utm_source=chatgpt.com from URLs and reloads the page automatically
// @description:en Removes ?utm_source=chatgpt.com from URLs and reloads the page automatically
// @description:de Entfernt ?utm_source=chatgpt.com aus URLs und lädt die Seite automatisch neu
// @author       https://github.com/anga83
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538818/Auto%20Remove%20ChatGPT%20UTM%20Parameter.user.js
// @updateURL https://update.greasyfork.org/scripts/538818/Auto%20Remove%20ChatGPT%20UTM%20Parameter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const currentUrl = window.location.href;
    const hasUtmSource = currentUrl.includes('?utm_source=chatgpt.com') || currentUrl.includes('&utm_source=chatgpt.com');
    
    if (hasUtmSource) {
        const url = new URL(currentUrl);
  
        url.searchParams.delete('utm_source');
        
        let cleanUrl = url.toString();
        if (cleanUrl.endsWith('?')) {
            cleanUrl = cleanUrl.slice(0, -1);
        }
        
        if (cleanUrl !== currentUrl) {
            window.location.replace(cleanUrl);
        }
    }
})();
