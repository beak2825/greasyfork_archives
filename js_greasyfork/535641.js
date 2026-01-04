// ==UserScript==
// @name         Remove Yandex Video Webkit Line Clamp and Flex
// @description  Unset -webkit-line-clamp on titles and disable flex layout on Yandex Video results.
// @match        https://yandex.com/video/search?*
// @version 0.0.1.20250511092458
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/535641/Remove%20Yandex%20Video%20Webkit%20Line%20Clamp%20and%20Flex.user.js
// @updateURL https://update.greasyfork.org/scripts/535641/Remove%20Yandex%20Video%20Webkit%20Line%20Clamp%20and%20Flex.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
    /* Remove the two-line clamp so titles show full text */
    .VideoSnippet2 .VideoSnippet-Title_maxLines_2 {
        -webkit-line-clamp: unset !important;
    }

    /* Force the main snippet container back to block layout */
    [class][class].VideoSnippet2.VideoSnippet_preset_serp .VideoSnippet-Main,
    .VideoSnippet2.VideoSnippet_preset_serp .VideoSnippet-Main {
        display: block !important;
    }

    /* Constrain the overall snippet list item to 290px */
    li.SearchBlock.SearchBlock_hasHover.VideoSnippetSerpFeature {
        max-width: 290px !important;
    }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();