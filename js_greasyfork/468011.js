// ==UserScript==
// @name         Cerca video e pdf vimeo sui siti di Mylife 2
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  cerca e embedda video vimeo 2
// @author       Flejta
// @include https://eckharttollecorso.it/giorno*
// @include https://moonology.it/giorno*
// @include https://brianweiss.it/thank-you*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468011/Cerca%20video%20e%20pdf%20vimeo%20sui%20siti%20di%20Mylife%202.user.js
// @updateURL https://update.greasyfork.org/scripts/468011/Cerca%20video%20e%20pdf%20vimeo%20sui%20siti%20di%20Mylife%202.meta.js
// ==/UserScript==
// sito dove trovare i video: https://www.mylifetv.it/
// converti stringa Html Javascript: https://accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/
//        regex:
//        Stringa: https:\/\/player.vimeo.com\/video\/.*?(?=&amp)
//        Sito regex: https://regexr.com/

setTimeout(function () {
    processResults();
    getPDFURLs();
    getAudioFile();
}, 10000);

//funzione iniziale
function processResults() {
    var nodesWithTitleVideo = getNodesWithTitle_video();
    var result = "<div>Giorno X</div>";
    for (var i = 0; i < nodesWithTitleVideo.length; i++) {
        var htmlCode = nodesWithTitleVideo[i].htmlCode;
        result += htmlCode;
    }
    console.log("codice html: /n" + result);
}

function getNodesWithTitle_video() {
    // Ottenere gli elementi <div> con class="elementor-widget-wrap"
    var divElements = document.querySelectorAll('div.elementor-widget-wrap');

    // Array per i risultati
    var results = [];
    var vimeoLinks = [];

    // Iterazione sugli elementi <div>
    for (var i = 0; i < divElements.length; i++) {
        var divElement = divElements[i];

        // Ottenere il titolo <h2> e l'URL Vimeo all'interno dell'elemento <div>
        //var h2Elements = divElement.querySelectorAll('p.elementor-heading-title.elementor-size-default');

        var h2Element = divElement.querySelector('h2.elementor-heading-title');
        //Modificato var h2Element = divElement.querySelector('p.elementor-heading-title');

        var urlVimeoElement = divElement.querySelector('iframe[src^="https://player.vimeo.com/video/"]');
        var description = divElement.querySelector('div.elementor-text-editor');
        // Verifica se entrambi il titolo e l'URL Vimeo sono presenti nell'elemento <div>
        if (h2Element && urlVimeoElement) {
            var h2Content = h2Element.textContent.trim();
            var urlVimeo = urlVimeoElement.getAttribute('src');
            var htmlCode = getHtmlCode(h2Content, urlVimeo, description);
            results.push({
                titolo: h2Content,
                descrizione: description,
                urlVimeo: urlVimeo,
                htmlCode: htmlCode
            });
        }
        if (urlVimeoElement) {
            vimeoLinks.push (urlVimeoElement.getAttribute('src'));
        }
    }
    //pubblico indirizzi video
    vimeoLinks.forEach(function(item) {
        console.log(item);
    });
    console.log("getNodesWithTitle_video: /n", results);

    return results;
}

function getHtmlCode(title, urlVimeo, description) {
    var embedVideo = "";
    embedVideo += "<div><h2>titolo</h2><\/div><br>";

    if (description) {
        var descrizione = description.innerText;
        embedVideo += "<div>";
        embedVideo += descrizione;
        embedVideo += "<\/div><br>"
    }
    embedVideo += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    embedVideo += "        src=\"xxx\"";
    embedVideo += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    embedVideo += "        title=\"titolo\"><\/iframe> <\/div>";
    var result = "";
    result = embedVideo.replace("xxx", urlVimeo);
    result = result.replace("titolo", title);
    return result;
}

function getTitleVideo(mainElement) {
    // Ottenere il contenuto del tag <h2> e l'URL Vimeo corrispondente
    var regexH2 = /<h2[^>]*>([^<]*)<\/h2>/g;
    var regexURL = /src="(https:\/\/player.vimeo.com\/video\/[^"]*)/g;
    var matchesH2 = mainElement.titolo.match(regexH2);
    var matchesURL = mainElement.urlVimeo.match(regexURL);
    var result = {
        titolo: "",
        urlVimeo: ""
    };

    if (matchesH2 && matchesURL && matchesH2.length === matchesURL.length) {
        for (var i = 0; i < matchesH2.length; i++) {
            var h2Content = matchesH2[i].replace(regexH2, '$1').trim();
            var urlVimeo = matchesURL[i].replace(regexURL, '$1');
            result.titolo = h2Content;
            result.urlVimeo = urlVimeo;
            console.log(h2Content + ', ' + urlVimeo);
        }
    }
    return result;
}

function getPDFURLs() {
    try {
        var codiceEmbedPdf = "";
        codiceEmbedPdf += "<a href=\"urlpdf\">Scarica il libro<\/a>";
        codiceEmbedPdf += "<div>";
        codiceEmbedPdf += "        <embed src=\"urlpdf\" type=\"application\/pdf\"";
        codiceEmbedPdf += "                width=\"100%\" height=\"600px\" \/>";
        codiceEmbedPdf += "<\/div>";
        var code = document.body.innerHTML;
        var regex = /(?<=")https:\\\/\\\/[^\s]+\.pdf(?=")/g;
        var matches = code.match(regex);
        var result = "";
        // Rimuovi il carattere '\' dagli URL
        var urls = matches.map(function (url) {
            url = url.replace(/\\/g, '');
            url = "\"" + url + "\"";
            url = codiceEmbedPdf.replace(/"urlpdf"/g, url);
            result += url;
            return url;
        });
        console.log(result);
        return urls;
    } catch (error) {
        //
    }

}
function getAudioFile () {
    var nodes = Array.from(document.querySelectorAll('a[href^="https://www.mylife.it/mediafile"]'));

    // Controlla se nodes è vuoto
    if (nodes.length === 0) {
        return; // Esci dalla funzione
    }

    // Crea un nuovo array per contenere l'HTML di ciascun nodo
    var htmlCodes = nodes.map(function(node) {
        return node.outerHTML;
    });

    // Trasforma l'array in una stringa separata da virgola
    var htmlString = htmlCodes.join(', ');

    // Stampa la stringa nella console
    console.log('<div>' + htmlString + '</div>');
}