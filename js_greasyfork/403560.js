// ==UserScript==
// @name         WhatsApp like it should be: no whitespace!
// @namespace    https://itsad.am
// @version      2.0.0
// @description  Removes the dumb space-wasting layout used on displays wider than 1440px.
// @author       Adam W
// @match        https://web.whatsapp.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403560/WhatsApp%20like%20it%20should%20be%3A%20no%20whitespace%21.user.js
// @updateURL https://update.greasyfork.org/scripts/403560/WhatsApp%20like%20it%20should%20be%3A%20no%20whitespace%21.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let styles = `
        div.app-wrapper-web:after{
            display: none;
        }

        @media screen and (min-width: 1441px) {
            .app-wrapper-web > div:first-of-type {
                height: 100% !important;
                top: 0 !important;
                width: 100% !important;
            }

            html[dir] .app-wrapper-web > div:first-of-type {
                box-shadow: 0 1px 1px 0 rgba(var(--shadow-rgb),.06),0 2px 5px 0 rgba(var(--shadow-rgb),.2) !important;
                margin: 0 auto !important;
            }

            html[dir] .app-wrapper-web.safari-fix .h70RQ {
                border-radius: 0 !important;
            }
        }
    `
    let styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
})();