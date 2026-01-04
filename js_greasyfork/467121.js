// ==UserScript==
// @name         cerca video youtube su mylife
// @namespace    findYoutubeOnMyLife
// @version      0.2
// @description  riporta i link di youtube delle pagine di mylife.it
// @author       flejta
// @match        https://www.mylife.it/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467121/cerca%20video%20youtube%20su%20mylife.user.js
// @updateURL https://update.greasyfork.org/scripts/467121/cerca%20video%20youtube%20su%20mylife.meta.js
// ==/UserScript==

setTimeout(function() {
    var regex = /https:\/\/www\.youtube\.com\/embed\/[^"]+/g;
    var matches = document.body.innerHTML.match(regex);

    if (matches && matches.length > 0) {
        var result = matches.join('\n');
        var testo = result.replace(/embed\//g, "watch?v=");

        var confirmation = confirm(testo + "\n\nVuoi copiare il testo nella cache del computer?");

        if (confirmation) {
            //sostituisci embed/ con watch?v=
            navigator.clipboard.writeText(testo)
                .then(function() {
                alert("Il testo è stato copiato nella cache del computer.");
            })
                .catch(function() {
                alert("Si è verificato un errore durante la copia del testo nella cache del computer.");
            });
            console.log(testo);
        }
    }
}, 10000);