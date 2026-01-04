// ==UserScript==
// @name         TWITTER BLUR
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @grant    GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/484759/TWITTER%20BLUR.user.js
// @updateURL https://update.greasyfork.org/scripts/484759/TWITTER%20BLUR.meta.js
// ==/UserScript==

// GM_addStyle ( `
//    .public-DraftEditorPlaceholder-root, .DraftEditor-editorContainer {
//    font-size: 15px !important;
//    }
//    [data-testid="tweetPhoto"] {
//    filter: blur(15.1px) !important;
// }
//    img {
//   filter: blur(1.1px) !important;
//   }

// ` );

(function() {
    'use strict';
    var maVariablePersistante = GM_getValue('maVariablePersistante', 1);
    // Fonction pour créer et manipuler le bouton
    function createToggleButton() {
        const button = document.createElement('button');
        button.textContent = 'ぼやける';
        button.style.position = 'fixed';
        button.style.bottom = '50px';
        button.style.left = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px';
        button.style.background = '#1da1f2';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', toggleBlur);

        document.body.appendChild(button);
    }

    // Fonction pour activer ou désactiver le filtre de flou
    function toggleBlur() {
        if (maVariablePersistante == 1) {
            maVariablePersistante = 0;
            console.log(maVariablePersistante);

            GM_addStyle ( `
            [data-testid="tweetPhoto"],[data-testid="previewInterstitial"], [data-testid="Tweet-User-Avatar"], [data-testid="card.layoutLarge.media"], [data-testid="card.layoutSmall.media"], [data-testid="User-Name"] div:nth-child(2) > div > div:nth-child(1) {
            // filter: blur(20.1px) !important;
            visibility: hidden !important;
            }
            ` );

        } else {
           maVariablePersistante = 1;
            console.log(maVariablePersistante);
            GM_addStyle ( `
                [data-testid="tweetPhoto"],[data-testid="previewInterstitial"], [data-testid="Tweet-User-Avatar"], [data-testid="card.layoutLarge.media"], [data-testid="card.layoutSmall.media"], [data-testid="User-Name"] div:nth-child(2) > div > div:nth-child(1) {
                // filter: blur(0.0px) !important;
                visibility: unset !important;
                }
            ` );
        }

    }



    createToggleButton();
})();