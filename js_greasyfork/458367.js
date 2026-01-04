// ==UserScript==
// @name         Japanese ASMR Tags Tooltip on hover
// @namespace    https://www.swcombine.com/
// @version      1.1
// @description  Adds a floating tooltip with the ASMR's tags when you hover over the thumbnail.
// @author       code-syl
// @match        https://japaneseasmr.com/*
// @icon         https://external-content.duckduckgo.com/ip3/japaneseasmr.com.ico
// @grant        none
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458367/Japanese%20ASMR%20Tags%20Tooltip%20on%20hover.user.js
// @updateURL https://update.greasyfork.org/scripts/458367/Japanese%20ASMR%20Tags%20Tooltip%20on%20hover.meta.js
// ==/UserScript==
/* @require      https://code.jquery.com/jquery-3.6.3.min.js /* <-- enable when not using waitForKeyElements.js */

(function() {
    'use strict';

    const styles = `
        .op-square:hover .syl-tooltip {
            display: flex;
        }

        .syl-tooltip {
            display: none;
            flex-direction: row;
            justify-content: center;
            gap: .5em;
            flex-wrap: wrap;
            align-self: center;

            background: #262626;
            padding: .7em !important;
            max-width: 100%;

            z-index: 1000;
        }
    `;

    /* add custom styles to the page */
    let styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const addTagsOnMainThumbnails = (mainThumbnail) => {
        const $anchor = mainThumbnail.find('a')[0];
        const $url = $anchor.href;

        let $tooltip = $("<div>", {"class": "syl-tooltip post-meta post-tags"});
        $.get($url, (data) => {
            const $tags = $(data).find('a[rel=tag]').toArray();
            $tags.forEach(($tag) => {
                $tooltip.append($tag);
            });
        });

        $anchor.after($tooltip[0]);
    }

    waitForKeyElements('.site-archive-post .op-square', addTagsOnMainThumbnails);
})();