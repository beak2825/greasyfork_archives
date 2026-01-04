// ==UserScript==
// @name         Whatsapp Camouflage
// @version      0.4
// @description  Change the look of WhatsApp Web to have better privacy.
// @author       Projects, by Who
// @match        https://web.whatsapp.com/
// @grant        none
// @license      MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/472629/Whatsapp%20Camouflage.user.js
// @updateURL https://update.greasyfork.org/scripts/472629/Whatsapp%20Camouflage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Apply greyscale filter to all elements.
    function applyBlackAndWhite() {
        const elementsToConvert = document.querySelectorAll('body *');
        elementsToConvert.forEach(element => {
            element.style.filter = 'grayscale(100%)';
        });
    }

    // Inject custom CSS.
    function injectCustomCSS() {
        const customCSS = `
            /* Hide voice recording button */
            ._2xy_p._3XKXx {
                display: none;
            }

            /* Margin to make chatlist better looking after hidding profile pictures */
            html[dir=ltr] ._8nE1Y {
                padding: var(--chat-spacing);
            }

            /* Hide headers */
            [data-testid="chatlist-header"], [data-testid="conversation-header"] {
                display: none !important;
            }
            html[dir=ltr] .AmmtE {
                display: none !important;
            }

            /* Hide profile pictures */
            [data-testid="group-chat-profile-picture"] {
                display: none !important;
            }

            /* Remove background of all entires */
            html[dir] .message-in ._1BOF7, html[dir] .message-out ._1BOF7 {
                background-color: transparent !important;
            }

            /* Hide chatlist by default */
            ._2Ts6i._3RGKj {
                position: fixed;
                transition: width .5s;
                width: 5px;
            }

            /* Show chatlist when hovering */
            ._2Ts6i._3RGKj:hover {
                width: 500px;
            }

            /* Remove chat bubble shadow */
            html[dir] ._2AOIt {
                box-shadow: none !important;
            }
            html[dir] ._1BOF7 {
                border-radius: 0 !important;
            }

            /* Tail indicator */
            .message-in .p0s8B {
                color: unset !important;
            }

            /* Reply's background */
            html[dir] .message-in ._1EbXp {
                background: transparent !important;
            }

            /* Left align all entries */
            .message-out {
                align-items: flex-start !important;
            }

            /* Image thumbs */
            [data-testid='image-thumb'] {
                filter: opacity(0.1) blur(2px);
                transition: filter .2s;
            }

            [data-testid='image-thumb']:hover {
                filter: none;
            }

            /* Tools */
            html[dir=ltr] .message-out:not(._2oBun) .FxqSn {
                left: unset !important;
                right: -68px !important;
            }

            /* Full screen at all time */
            @media screen and (min-width: 1441px) {
                .app-wrapper-web ._1jJ70 {
                    top: inherit !important;
                    width: inherit !important;
                    max-width: inherit !important;
                    height: inherit !important;
                }
            }

            /* Message max width */
            @media screen and (min-width: 1025px)  {
            ._1uv-a {
                max-width: unset !important;
            }
        `;
        const styleTag = document.createElement('style');
        styleTag.innerHTML = customCSS;
        document.head.appendChild(styleTag);
    }

    // Add initial instruction to homepage.
    function addInstruction() {
        var instruction = document.querySelector('div.instruction');

        if(instruction == null) {
            const introText = document.querySelector('div[data-testid="intro-text"]');

            if(introText != null) {
                instruction = introText.cloneNode();
                instruction.classList.add('instruction');
                instruction.innerHTML = '<strong>Hover cursor at left edge to show chat list.</strong>';
                document.querySelector('div._2v9n-').appendChild(instruction);
            }
        }
    }

    // Force out of dark mode.
    setInterval( function() {
        document.body.classList.remove('dark');
        addInstruction();
    }, 10 )

    // Run the functions when the page loads
    applyBlackAndWhite();
    injectCustomCSS();
    addInstruction();
})();