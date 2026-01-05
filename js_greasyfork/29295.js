// ==UserScript==
// @name         Dossier adder
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  try to take over the world!
// @author       You
// @match        https://www.nationstates.net/nation=*/detail=trend*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29295/Dossier%20adder.user.js
// @updateURL https://update.greasyfork.org/scripts/29295/Dossier%20adder.meta.js
// ==/UserScript==
const nations = [];

(function() {
    'use strict';

    let els = $('#trendaddnationselector option').not('[value=0]');

    els.map((i) => {
        nations.push(els[i].innerHTML.replace(/ /g, '_').toLowerCase());
    });

    const button = `<button class="button" id="TGAButton">Add TGA</button>`;
    $('#trendaddnationselector').parent().append(button);
})();

$(document).ready(() => {
    $('#TGAButton').click((e) => {
        e.preventDefault();
        window.location.href += '/nations=' + nations.join('+');
    });
});