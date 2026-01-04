// ==UserScript==
// @name         FC - Dark Mode
// @run-at        document-start
// @namespace    https://greasyfork.org/es/scripts/446037-fc-dark-mode
// @version      6
// @description  Aplica el modo noche a Forocoches
// @author       DonNadie
// @match        http://*.forocoches.com/*
// @match        https://*.forocoches.com/*
// @match        http://www.forocoches.com/*
// @match        https://www.forocoches.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446037/FC%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/446037/FC%20-%20Dark%20Mode.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

let style = document.createElement('style');
        style.innerHTML = `
        body, .tborder-author, .page, .tborder-author, .panel, #tablist li a, .alt1, .alt1Active, .contenido, .alt1-user, #profile_box div, .tborder.content_block {
            background: #323639 !important;
            color: white !important;
        }

        td {
            background-color: #323639 !important;
        }

        .controlbar, .controlbar td {
            background-color: #e1e1e2 !important;
        }

        .tcat, thead, .thead a:link, .thead_alink, .alt2, .alt2Active, .tborder, .thead, .alt1-author, legend, .texto {
            color: white !important;
        }

        a:link, body_alink, .texto a, a {
            color: #00a6cc !important;
        }

        .tborder-author {
            border-left: 3px solid #00a6cc !important;
            border-right: 3px solid #00a6cc !important;
        }

        .alt1-author, .thead, .alt2, .alt2Active {
            background: #4a4a4a !important;
        }

        .tborder, textarea, input, select {
            background: #4a4a4a !important;
            color: white !important;
        }
        textarea, input {
            border: 1px;
        }

        .cajasprin, .cajascat, .cajastip {
            BORDER-RIGHT: #4a4a4a 1px solid !important;
            BORDER-TOP: #4a4a4a 1px solid !important;
            BORDER-LEFT: #4a4a4a 1px solid !important;
            BORDER-BOTTOM: #4a4a4a 1px solid !important;
            background: #4a4a4a !important;
        }
        td {
            border-right-color: #4a4a4a !important;
            border-left-color: #4a4a4a !important;
            border-top-color: #4a4a4a !important;
            border-bottom-color: #4a4a4a !important;
        }

        .panel, .vBulletin_editor {
            border: 2px !important;
        }

        .fieldset {
            border-style: solid;
            border-color: #4a4a4a;
        }
        `;

const addStyles = () => {
    document.head.prepend(style);
}

const replaceImages = () => {
    document.body.querySelectorAll('[background="/image/tbase_hd.png"]').forEach(el => {
        el.removeAttribute("background");
    });

    document.body.querySelector('[src="/image/top_c1_hd.png"]').src = "https://i.imgur.com/hJGDXqM.png";
    document.body.querySelector('[src="/image/top_c2_fcs_hd5.png"]').src = "https://i.imgur.com/HoBcv8z.png";
};

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
            const $node = mutation.addedNodes[0];

            switch ($node.tagName) {
                case "HTML":
                    observer.observe(mutation.addedNodes[0], {
                        attributes: true,
                        childList: true
                    });
                    break;
                case "HEAD":
                    addStyles();
                    break;
                case "BODY":
                    setTimeout(() => {
                        replaceImages();
                    }, 200);
                    break;
            }
        }
    });
});

[1, 50, 100, 200, 300, 400, 500].forEach(ms => {
    setTimeout(() => {
        addStyles();
        replaceImages();
    }, ms);
});

observer.observe(document, {
    attributes: true,
    childList: true
});
