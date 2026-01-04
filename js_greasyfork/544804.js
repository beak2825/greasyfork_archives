// ==UserScript==
// @name        Reddit Code Block Fix
// @namespace   Violentmonkey Scripts
// @match       https://old.reddit.com/*
// @grant       GM_xmlhttpRequest
// @require     https://unpkg.com/showdown@2.1.0/dist/showdown.min.js
// @version     1.0
// @description Fixes triple backtick code blocks in old Reddit layout
// @license     WTFPL
// @downloadURL https://update.greasyfork.org/scripts/544804/Reddit%20Code%20Block%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/544804/Reddit%20Code%20Block%20Fix.meta.js
// ==/UserScript==

const CONTENT_SELECTOR = '.thing[data-type="comment"], .thing[data-type="link"]';
const TIMEOUT = 2500;

const showdownOptions = {
    noHeaderId: true,
    strikethrough: true,
    tables: true,
    encodeEmails: false,
    simplifiedAutoLink: true,
    disableForced4SpacesIndentedSublists: true,
    extensions: ['redditSpoilerExtension']
};

showdown.extension('redditSpoilerExtension', function() {
    return [{
        type: 'lang',
        regex: /^(?!^    )([^\n]*?)>! *([^\n]+?) *!</gm,
        replace: "$1 <span class='md-spoiler-text' title='Reveal spoiler'>$2</span>"
    }];
});

function processContent(thing, utbody, body) {
    const converter = new showdown.Converter(showdownOptions);
    utbody.innerHTML = `<div class="md">${converter.makeHtml(body)}</div>`;
}

function handleResponse(response) {
    if (response.status !== 200) return;

    const { thing, utbody } = response.context;
    const json = JSON.parse(response.responseText);

    // Determine if it's a comment or post
    const body = thing.dataset.type === 'comment'
        ? json[1].data.children[0].data.body
        : json[0].data.children[0].data.selftext;

    processContent(thing, utbody, body);
}

function fixCodeBlocks() {
    document.querySelectorAll(CONTENT_SELECTOR).forEach(thing => {
        const utbody = thing.querySelector('.usertext-body');
        const permalink = thing.dataset.permalink;

        if (utbody?.innerText.includes('```') && permalink) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${permalink}.json`,
                timeout: TIMEOUT,
                context: { thing, utbody },
                onload: handleResponse
            });
        }
    });
}

// Initialize after page loads
window.addEventListener('load', () => {
    if (typeof showdown !== 'undefined') {
        fixCodeBlocks();
    }
});