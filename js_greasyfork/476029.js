// ==UserScript==
// @name                Devuplads clean bloat
// @namespace           https://greasyfork.org/users/821661
// @match               https://devuploads.com/*
// @match               https://djxmaza.in/*
// @match               https://smartfeecalculator.com/*
// @match               https://gujjukhabar.in/*
// @match               https://rfiql.com/*
// @grant               GM.addStyle
// @run-at              document-start
// @version             1.2.3
// @author              hdyzen
// @description         clean bloat in devuploads
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/476029/Devuplads%20clean%20bloat.user.js
// @updateURL https://update.greasyfork.org/scripts/476029/Devuplads%20clean%20bloat.meta.js
// ==/UserScript==

const domain = window.location.hostname;

if (domain === "devuploads.com") {
    devuploadsCSS();
} else {
    reDevuploadsCSS();
}

function addCSS(text) {
    document.documentElement.insertAdjacentHTML("beforeend", `<style>${text}</style>`);
}

function reDevuploadsCSS() {
    addCSS(`
        #dlp, [style*="block"]:is(#dlndiv, #adBlocked, #Blocked) {
            position: fixed !important;
            height: 100vh !important;
            width: 100vw !important;
            inset: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            background-color: #131316 !important;
            z-index: 99999 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important; 
        }    
    `);
}

function devuploadsCSS() {
    addCSS(`
        body:not(:has(#container)) {
            background-color: #131316 !important;
        }
        body {
            overflow: hidden;
            & .shadow-lg {
                box-shadow: none !important;
            }
        }
        #folders_paging {
            display: none !important;
        }
        #container {
            max-width: unset !important;
            position: fixed !important;
            inset: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            background-color: #131316 !important;
            margin: 0 !important;
            z-index: 214748364 !important;
            & .filesof {
                color: #8f91a3 !important;
            }
            & .bg-white {
                background-color: #1b1b1f !important;
            }
            & .form-control, & .paging {
                background-color: inherit !important;
                color: #cccee7;
                &::placeholder {
                    color: #8f91a3;
                }
            }
            & .border-bottom {
                border-color: #1b1b1f !important;
            }
            & .title a {
                color: #cccee7 !important;
            }
            & i.fas {
                background: #bac3ff;
                background-clip: text;
            }
            & .fa-magnifying-glass {
                color: #bac3ff !important;
            }
        }    
    `);
}
