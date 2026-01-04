// ==UserScript==
// @name          Lichess Hide Watchers Area
// @namespace     http://userstyles.org
// @description   Hides Watchers Area During Matches
// @author        636597
// @include       *://*lichess.org/*
// @run-at        document-start
// @version       0.4
// @downloadURL https://update.greasyfork.org/scripts/375946/Lichess%20Hide%20Watchers%20Area.user.js
// @updateURL https://update.greasyfork.org/scripts/375946/Lichess%20Hide%20Watchers%20Area.meta.js
// ==/UserScript==

function hide_watchers_area() {
    try{
        var styles = `
            div.watchers * { display: none; }
            div.chat__members { visibility: hidden !important; }
            span.list { visibility: hidden !important; }"
            span.number { visibility: hidden !important; }"
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

window.addEventListener ( "load" , hide_watchers_area );