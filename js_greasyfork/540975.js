// ==UserScript==
// @name         MyHeritage: Names and dates abbreviator (for Spanish lang)
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Intercepts 'get-tree-layout.php' API call and abbreviates the given and last name, along with the months of the dates.
// @author       ciricuervo
// @match        https://www.myheritage.es/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myheritage.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/540975/MyHeritage%3A%20Names%20and%20dates%20abbreviator%20%28for%20Spanish%20lang%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540975/MyHeritage%3A%20Names%20and%20dates%20abbreviator%20%28for%20Spanish%20lang%29.meta.js
// ==/UserScript==

/**
 *  Considerations:
 *
 * 'get-tree-layout.php' responses are cached in the browser local storage.
 *  Clean the local storage in order to intercept new API calls.
 */

(function() {
    'use strict';

    const monthMap = {
        'enero': 'ene',
        'febrero': 'feb',
        'marzo': 'mar',
        'abril': 'abr',
        'mayo': 'may',
        'junio': 'jun',
        'julio': 'jul',
        'agosto': 'ago',
        'septiembre': 'sep',
        'octubre': 'oct',
        'noviembre': 'nov',
        'diciembre': 'dic',
    };

    // Abbreviator tries not to truncate words
    function abbrev(str, maxLen) {
        if (str.length <= maxLen) return str;
        const cutoff = str.lastIndexOf(' ', maxLen);
        if (cutoff === -1) return str.slice(0, maxLen) + '…'; // there are no spaces
        return str.slice(0, cutoff).trim() + '…';
    }

    function abbreviateDateString(str) {
        return str
            .toLowerCase()
            .replace(/(?<!antes|después|alrededor) de /g, ' ')
            .replace(new RegExp('\\b(' + Object.keys(monthMap).join('|') + ')\\b', 'g'), m => monthMap[m]);
    }

    function processCard(card) {
        if (typeof card.b === 'string') card.b = abbreviateDateString(card.b);
        if (typeof card.d === 'string') card.d = abbreviateDateString(card.d);

        const maxLength = 40;
        if (typeof card.n === 'string' && card.n.length > maxLength && typeof card.fn === 'string' && typeof card.ln === 'string') {

            const prefixLength = Math.max(card.n.indexOf(card.fn), 0);
            const cutoff = Math.floor((maxLength - prefixLength) / 2);

            // First check the last name (we give some extra space for it (+4))
            if (card.ln.length < cutoff + 4) {
                const abbrevLength = Math.max(maxLength - prefixLength - card.ln.length, 1);
                const fnAbbrev = abbrev(card.fn, abbrevLength);
                card.n = card.n.replace(card.fn, fnAbbrev);

            // Then the given name
            } else if (card.fn.length < cutoff) {
                const abbrevLength = Math.max(maxLength - prefixLength - card.fn.length, 1);
                const lnAbbrev = abbrev(card.ln, abbrevLength);
                card.n = card.n.replace(card.ln, lnAbbrev);

            // Else, abbreviate them equally
            } else {
                const fnAbbrev = abbrev(card.fn, cutoff);
                const lnAbbrev = abbrev(card.ln, cutoff);
                card.n = card.n.replace(card.fn, fnAbbrev);
                card.n = card.n.replace(card.ln, lnAbbrev);
            }
        }
    }

    const interceptUrl = 'get-tree-layout.php';

    // Fetch interceptor
    const origFetch = window.fetch;
    window.fetch = async function(input, init) {
        const url = typeof input === 'string' ? input : input.url;
        const resp = await origFetch(input, init);
        if (url.includes(interceptUrl) &&
            resp.headers.get('Content-Type')?.includes('application/json')
           ) {
            const data = await resp.clone().json();
            if (data?.data?.personCards) {
                data.data.personCards.forEach(processCard);
            }
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            return new Response(blob, {
                status: resp.status,
                statusText: resp.statusText,
                headers: resp.headers
            });
        }
        return resp;
    };

    // XHR interceptor
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return origOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4 &&
                this._url.includes(interceptUrl) &&
                this.getResponseHeader('Content-Type')?.includes('application/json')
               ) {
                try {
                    const json = JSON.parse(this.responseText);
                    if (json?.data?.personCards) {
                        json.data.personCards.forEach(processCard);
                    }
                    Object.defineProperty(this, 'responseText', {
                        writable: true,
                        value: JSON.stringify(json)
                    });
                } catch (e) {
                    console.error('Error parseando JSON MyHeritage:', e);
                }
            }
        });
        return origSend.apply(this, arguments);
    };

})();
