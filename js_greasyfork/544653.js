// ==UserScript==
// @name         Readwise tag clean-up
// @namespace    https://axley.net/
// @version      1.0.0
// @description  This script will fix all readwise tags that mistakenly have trailing whitespaces by removing the trailing whitespace
// @author       Jason Axley
// @license      MIT
// @match        https://readwise.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=readwise.io
// @grant        GM_registerMenuCommand
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL https://update.greasyfork.org/scripts/544653/Readwise%20tag%20clean-up.user.js
// @updateURL https://update.greasyfork.org/scripts/544653/Readwise%20tag%20clean-up.meta.js
// ==/UserScript==

const cfg = new GM_config({
    id: 'readwiseTagCleanupConfig',
    title: 'readwise Tag Cleanup Settings', // Panel Title
    fields: {
        "apiKey": {
            'label': 'Readwise API key (https://readwise.io/access_token)', // Appears next to field
            'type': 'string', // Makes this setting a text field
            'default': null
        }
    }
});

const headers_orig = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "x-requested-with": "XMLHttpRequest"
};

const headers = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9"
};

function buildRequestHeaders() {
    const theHeaders = headers;

    const apiKey = cfg.get('apiKey');
    if (apiKey) {
        theHeaders["Authorization"] = `Token ${apiKey}`;
    }
    return theHeaders;
}

async function renameTag(book_id, tag_id, new_name) {
    // because renameTag_api_broken() doesn't work, I'm DELETING and RECREATING a tag to rename it
    // Request: DELETE to https://readwise.io/api/v2/books/<book id>/tags/<tag id>
    const renameHeaders = buildRequestHeaders();
    renameHeaders["Content-Type"] = "application/json";

    // Request: POST to https://readwise.io/api/v2/books/<book id>/tags/
    const create_result = await fetch(`https://readwise.io/api/v2/books/${book_id}/tags/`, {
        "headers": renameHeaders,
        "referrer": "https://readwise.io/articles",
        "body": JSON.stringify({"name": new_name}),
        "method": "POST",
        "mode": "same-origin" /*,
        "mode": "cors",
        "credentials": "include" */
    });

    if (create_result.ok) {
        // only delete if the create succeeded to avoid losing information
        const delete_result = fetch(`https://readwise.io/api/v2/books/${book_id}/tags/${tag_id}`, {
            "headers": renameHeaders,
            "referrer": "https://readwise.io/articles",
            "body": null,
            "method": "DELETE",
            "mode": "same-origin"/*,
        "mode": "cors",
        "credentials": "include" */
        });
    } else {
        debugger;
    }
}

async function renameTag_api_broken(book_id, tag_id, new_name) {
    // I'm trusting the IDs from readwise
    return fetch(`https://readwise.io/api/v2/books/${book_id}/tags/${tag_id}`, {
        "headers": headers,
        "referrer": "https://readwise.io/articles",
        "headers": {
            "Content-Type": "application/json",
        },
        "body": JSON.stringify({"name": new_name}),
        "method": "PATCH",
        "mode": "cors",
        "credentials": "include"
    });
}

async function fetchWithPagination(url, params) {
    let aggregate_results = [];

    let next_url = url;
    while (next_url) {
        let results = await fetch(next_url, params);
        if (results.ok) {
            let results_json = await results.json();

            aggregate_results = aggregate_results.concat(results_json.results);
            next_url = results_json.next;
        } else if (results.status == 429) {
            // too many requests
            // book list endpoints are restricted to 20 per minute (per access token).
            // Retry-After to sleep before retry
            let secs = results.headers["Retry-After"];
            console.warn(`Throttled: Waiting for ${secs} seconds before retry`);
            await new Promise(r => setTimeout(r, secs));
        }
    }

    return aggregate_results;
}

async function cleanTags(){

    let books = await fetchWithPagination("https://readwise.io/api/v2/books/?page_size=1000", {
        "headers": headers,
        "referrer": "https://readwise.io/articles",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });

    books.forEach((b) => {
        if (b.tags) {
            b.tags.forEach((t) => {
                if (t.name.endsWith(" ")) {
                    console.log(`${JSON.stringify(t)} needs cleanup`);
                    renameTag(t.user_book, t.id, t.name.trim());
                }
            }
            );
        }
    }
    );
}

(async function() {
    'use strict';

    GM_registerMenuCommand("Change settings", function(event) {
        cfg.open();
    }, {
        autoClose: true
    });

    GM_registerMenuCommand('Clean Up Readwise Tags', () => {
        cleanTags();
    }, {
        autoClose: true
    });

})();