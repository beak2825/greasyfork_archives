// ==UserScript==
// @name          Zoom , Hide Chat Messages
// @namespace     http://userstyles.org
// @description   Hides Psychopaths from Talking on Zoom
// @author        636597
// @include       *://*zoom.us/*
// @run-at        document-start
// @version       0.3
// @downloadURL https://update.greasyfork.org/scripts/442276/Zoom%20%2C%20Hide%20Chat%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/442276/Zoom%20%2C%20Hide%20Chat%20Messages.meta.js
// ==/UserScript==

function add_css() {
    try{
        var styles = `
            div.last-chat-message-tip__container { visibility: hidden !important; }
            span.number-badge { visibility: hidden !important; }
            span.footer-button__number-counter { visibility: hidden !important; }
            span.footer-button__number-badge-wrapper { visibility: hidden !important; }
        `;
        var styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }
    catch(e) {
        console.log( e );
    }
}

window.addEventListener ( "load" , add_css );