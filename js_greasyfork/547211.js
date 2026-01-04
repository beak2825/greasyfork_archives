// ==UserScript==
// @name Last.fm Mark Corrections
// @namespace https://github.com/hummingme
// @description Highlights auto-corrected artist names and track titles in scrobbles lists.
// @version 1.0.0
// @author hummingme
// @license MIT
// @match https://www.last.fm/*
// @noframes
// @grant none
// @homepageURL https://github.com/hummingme/lastfm-mark-corrections
// @supportURL https://github.com/hummingme/lastfm-mark-corrections/issues
// @icon https://raw.githubusercontent.com/hummingme/lastfm-mark-corrections/refs/heads/main/assets/lastfm-icon.png
// @downloadURL https://update.greasyfork.org/scripts/547211/Lastfm%20Mark%20Corrections.user.js
// @updateURL https://update.greasyfork.org/scripts/547211/Lastfm%20Mark%20Corrections.meta.js
// ==/UserScript==

if (hasPro()) {
    run();
}

function run() {
    processChartlists(document.documentElement);
    observer().observe(document.body, {
        childList: true,
        subtree: true
    });
}

function observer() {
    const userLink = document.querySelector('a.auth-link')?.href;
    return new MutationObserver(mutations => {
        if (!location.href.startsWith(userLink)) {
            return; // not part of the user library
        }
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node instanceof HTMLTableRowElement) {
                    // with 'automatic refreshing of recent tracks' enabled
                    highlightAutocorrections([node]);
                } else if (
                    node instanceof HTMLElement &&
                    ['DIV', 'SECTION'].includes(node.tagName)
                ) {
                    processChartlists(node);
                }
            }
        }
    });
}

function processChartlists(node) {
    const tables = node.querySelectorAll('table.chartlist');
    Array.from(tables).forEach((table) => {
        if (isScrobbleList(table)) {
            const rows = table.querySelectorAll('tr.chartlist-row');
            highlightAutocorrections([...rows]);
        }
    });
}

function highlightAutocorrections(rows) {
    rows.forEach((row) => {
        if (isScrobbleRow(row)) {
            const artist = getValueFromInputField(row, 'artist_name');
            const track = getValueFromInputField(row, 'track_name');
            const { value: artist2, node: artistNode } = getValueFromTextNode(row, 'artist');
            const { value: track2, node: trackNode } =  getValueFromTextNode(row, 'name');
            if (artist && artist2 && artist.toLowerCase() !== artist2.toLowerCase()) {
                highlight(artistNode, artist);
            }
            if (track && track2 && track.toLowerCase() !== track2.toLowerCase()) {
                highlight(trackNode, track);
            }
        }
    });
};

function hasPro() {
    return !!document.querySelector('span.user-status-subscriber');
}

function isScrobbleList(table) {
    return table.classList.contains('chartlist--with-bar') === false;
}

function isScrobbleRow(row) {
    return row.querySelector('form[data-edit-scrobble]') instanceof HTMLFormElement;
}

function getValueFromInputField(row, name) {
    return row.querySelector(`form[data-edit-scrobble] input[name="${name}"]`)?.value;
}

function getValueFromTextNode(row, name) {
    const node = row.querySelector(`td.chartlist-${name} a`);
    const value = node?.innerText;
    return { value, node };
}

function highlight(node, corrected) {
    Object.assign(node.style, {
        textDecorationLine: 'underline',
        textDecorationStyle: 'wavy',
        textDecorationColor: '#d92323'
    });
    node.title = `auto-corrected from: ${corrected}`;
}
