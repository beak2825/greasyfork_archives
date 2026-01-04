// ==UserScript==
// @name         Custom AI !Bang Redirects
// @namespace    http://your.namespace.here
// @version      1.9
// @description  Redirects DuckDuckGo searches with custom bangs to specified services
// @match        *://*.google.com/*
// @match        *://*.bing.com/*
// @match        *://startpage.com/*
// @match        *://*.brave.com/*
// @match        *://*.ecosia.org/*
// @match        *://*.duckduckgo.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519068/Custom%20AI%20%21Bang%20Redirects.user.js
// @updateURL https://update.greasyfork.org/scripts/519068/Custom%20AI%20%21Bang%20Redirects.meta.js
// ==/UserScript==

/*
The MIT License (MIT)

Copyright (c) 2024 ShadowTux

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function() {
    'use strict';

    // Function to extract URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Extract the search query
    var query = getUrlParameter('q');
    if (query) {
        // Define bang patterns with corresponding URLs and additional parameters
        var bangs = {
            '!chatgpt': {
                url: 'https://chatgpt.com/?q=',
                suffix: ' use web search'
            },
            '!chat': {
                url: 'https://chatgpt.com/?q=',
                suffix: ' use web search'
            },
            '!summary': {
                url: 'https://search.brave.com/search?q=',
                params: '&source=llmSuggest&summary=1'
            },
            '!perp': {
                url: 'https://www.perplexity.ai/search?q='
            },
            '!youai': {
                url: 'https://you.com/search?q=',
                params: '&fromSearchBar=true&tbm=youchat&chatMode=default'
            },
            '!phind': {
                url: 'https://www.phind.com/search?q=',
                params: '&searchMode=auto&allowMultiSearch=true'
            },
            '!felo': {
                url: 'https://felo.ai/search?q='
            },
            '!ecoai': {
                url: 'https://www.ecosia.org/chat?q='
            },
            '!mistral': {
                url: 'https://chat.mistral.ai/chat?q=',
                params: '&mode=ai'
            },
            '!mis': {
                url: 'https://chat.mistral.ai/chat?q=',
                params: '&mode=ai'
            }
        };

        // Iterate over the defined bangs
        for (var bang in bangs) {
            if (query.includes(bang)) {
                // Remove the bang from the query
                var newQuery = query.replace(bang, '').trim();
                // Append suffix if defined
                if (bangs[bang].suffix) {
                    newQuery += bangs[bang].suffix;
                }
                // Construct the redirect URL
                var redirectUrl = bangs[bang].url + encodeURIComponent(newQuery);
                // Append additional parameters if defined
                if (bangs[bang].params) {
                    redirectUrl += bangs[bang].params;
                }
                // Redirect to the constructed URL
                window.location.replace(redirectUrl);
                break;
            }
        }
    }
})();
