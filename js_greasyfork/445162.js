// ==UserScript==
// @name       Plex Media Server beta update link fixer
// @namespace  http://mathemaniac.org/
// @version    1.0.1
// @description  Plex Media Server has been corrupting update download links for users on the beta channel on linux. This user-script "turns up the geek", and fixes the links to point to the correct address.
// @match        https://app.plex.tv/desktop*
// @copyright  2022, Sebastian Paaske Tørholm
// @require    https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/445162/Plex%20Media%20Server%20beta%20update%20link%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/445162/Plex%20Media%20Server%20beta%20update%20link%20fixer.meta.js
// ==/UserScript==

// See https://forums.plex.tv/t/server-download-link-hiding-makes-it-useless/791780 for context.

/* jshint -W097 */
/* eslint-env jquery */
'use strict';

// Automatically fix broken links back into correct ones - and hide the link in the Shadow DOM, so the token isn't removed again.
function fixLink(elm) {
    let link = elm.href.replace('xxxxxxxxxxxxxxxxxxxx', localStorage.myPlexAccessToken);
    let shadowDOM = elm.parentNode.attachShadow({ mode: 'closed' });
    elm.remove();
    elm.href = link;

    let styleSheets = document.querySelectorAll('link[rel="stylesheet"]');
    for (let ss of styleSheets) {
        shadowDOM.appendChild(ss.cloneNode());
    }

    shadowDOM.appendChild(elm);
}

$(function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var config = { childList: true, characterData: false, attributes: true, subtree: true };
    var observer = new MutationObserver( function (mutations) {
        mutations.forEach( function (mutation) {
            if (mutation.type == 'childList') {
                for (let m of mutation.addedNodes) {
                    $('a[href^="https://plex.tv/downloads/latest"]', m).each(function () { fixLink(this) });
                }
            } else if (mutation.type == 'attributes') {
                if (mutation.attributeName == 'href' && $(mutation.target).attr('href').match(/^https:\/\/plex\.tv\/downloads\/latest/)) {
                    fixLink(mutation.target);
                }
            }
        });
    });

    observer.observe(document.querySelector('#plex'), config);

    $('a[href^="https://plex.tv/downloads/latest"]').each( function () {
        fixLink(this);
    });
});
