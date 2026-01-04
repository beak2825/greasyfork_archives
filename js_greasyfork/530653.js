// ==UserScript==
// @name         Perplexity Force Writing Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Force "writing mode" on perplexity
// @author       Lugia19
// @match        https://www.perplexity.ai/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530653/Perplexity%20Force%20Writing%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/530653/Perplexity%20Force%20Writing%20Mode.meta.js
// ==/UserScript==

(function () {
'use strict';

// Store the original fetch function
const originalFetch = window.fetch;

// Override the fetch function
window.fetch = async function (...args) {
const url = args[0];
let urlString = '';

// Handle different types of URL arguments
if (typeof url === 'string') {
urlString = url;
} else if (url instanceof URL) {
urlString = url.href;
} else if (url instanceof Request) {
urlString = url.url;
}

// Check if this is a request to the target endpoint
if (urlString.includes('https://www.perplexity.ai/rest/sse/perplexity_ask')) {
try {
// Clone the request to avoid modifying the original
let request = args[1] || {};

// If there's a body, parse and modify it
if (request.body) {
const body = JSON.parse(request.body);

// Force the search_focus to be "writing"
if (body.params) {
body.params.search_focus = "writing";
body.params.local_search_enabled = false;
console.log("Forced search_focus to 'writing'");
}

// Create a new request with the modified body
const newRequest = {
...request,
body: JSON.stringify(body)
};

// Replace the original request with our modified one
args[1] = newRequest;
}
} catch (error) {
console.error("Error in fetch monkeypatch:", error);
}
}

// Call the original fetch with possibly modified arguments
return originalFetch.apply(this, args);
};

console.log("Perplexity.ai Force Writing Focus userscript loaded");
})();