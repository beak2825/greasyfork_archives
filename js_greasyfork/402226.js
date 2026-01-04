// ==UserScript==
// @name     Desmartify google search buttons
// @description Sorts the google search buttons the old way.
// @version  1
// @grant    none
// @include  https://www.google.com/search*
// @namespace https://greasyfork.org/users/22770
// @downloadURL https://update.greasyfork.org/scripts/402226/Desmartify%20google%20search%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/402226/Desmartify%20google%20search%20buttons.meta.js
// ==/UserScript==
// jshint esversion:6
let seq = ["Images", "Videos", "Maps", "News", "Shopping"];

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function SortButtons() {
    let tosort = document.querySelector("#hdtb-msb-vis");

    let desiredSeq = [...tosort.children].sort((a, b) => seq.indexOf(a.innerText) > seq.indexOf(b.innerText) ? 1 : -1);
    if (!arraysEqual(tosort.children, desiredSeq)) {
        console.log("DesmartifyGoogleSearch: Sorting the buttons");
        [...tosort.children].sort((a, b) => seq.indexOf(a.innerText) > seq.indexOf(b.innerText) ? 1 : -1).map(node => tosort.appendChild(node));
    }
}
setInterval(SortButtons, 50);
