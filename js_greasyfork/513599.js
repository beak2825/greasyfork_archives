// ==UserScript==
// @name         DuckDuckGo Append Anti-AI Search
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  Automatically appends predefined phrases to the DuckDuckGo search box
// @author       Beauvoir Ferril
// @match        https://duckduckgo.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513599/DuckDuckGo%20Append%20Anti-AI%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/513599/DuckDuckGo%20Append%20Anti-AI%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const phrases = [
                '-"ai"', '-"artificial intelligence"', '-"stable diffusion"', '-"nightcafe"', '-"chatgpt"', '-"gpt"', '-"adobe firefly"', '-"midjourney"', '-"dall-e"', '-"canva"', '-"jumpstory"', '-"runwayml"', '-"openai"', '-"gettyimages"', '-"limewire"', '-"playgroundai"', '-"craiyon"', '-"freepik"','-"dreamstime"','-"civitai"', '-"deepai"', '-"hotpot"', '-"deepmind"', '-"pixlr"'
    ];

    const searchInput = document.querySelector('input[name="q"]');

    if (searchInput) {
        // Get current value in the search box
        const currentValue = searchInput.value;

        searchInput.value = currentValue ? `${currentValue}, ${phrases.join(', ')}` : phrases.join(', ');
    }
})();
