// ==UserScript==
// @name         Cerca video vimeo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  cerca e embedda video vimeo
// @author       Flejta
// @include https://liberalatuaanima.it/giorno*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467164/Cerca%20video%20vimeo.user.js
// @updateURL https://update.greasyfork.org/scripts/467164/Cerca%20video%20vimeo.meta.js
// ==/UserScript==
// converti stringa Html Javascript: https://accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/
//        regex:
//        Stringa: https:\/\/player.vimeo.com\/video\/.*?(?=&amp)
//        Sito regex: https://regexr.com/

setTimeout(function() {
    const regex = /https:\/\/player.vimeo.com\/video\/.*?(?=&amp)/g;
    var matches = document.body.innerHTML.match(regex);
    if (matches && matches.length > 0) {
        var embedVideo="";
        embedVideo += "<div>titolo<\/div><br>";
        embedVideo += "<div style=\"width: 100%; height: 500px;\"> <iframe";
        embedVideo += "        src=\"xxx&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"";
        embedVideo += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
        embedVideo += "        title=\"titolo\"><\/iframe> <\/div>";
        var matches2 = []; // Inizializza la variabile matches2 come un array vuoto
        matches.forEach((element) => {
            matches2.push(embedVideo.replace("xxx",element));
        });
        var result = "<div><b>Giorno 1<\/b><\/div>";
        result += "    <br><br>";
        result += matches2.join('\n');

        var confirmation = confirm(result + "\n\nVuoi copiare il testo nella cache del computer?");

        if (confirmation) {
            //sostituisci embed/ con watch?v=
            navigator.clipboard.writeText(result)
                .then(function() {
                alert("Il testo è stato copiato nella cache del computer.");
            })
                .catch(function() {
                alert("Si è verificato un errore durante la copia del testo nella cache del computer.");
            });
        }
    }
}, 10000);