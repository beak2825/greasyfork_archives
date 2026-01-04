// ==UserScript==
// @name         ygg.JS
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Ajoute un lien direct dans le tableau listant les fichiers
// @author       CoStiC
// @include        *://*.yggtorrent.se/*
// @grant        none
// @require https://greasyfork.org/scripts/394721-w84kel/code/w84Kel.js?version=763614
// @downloadURL https://update.greasyfork.org/scripts/394971/yggJS.user.js
// @updateURL https://update.greasyfork.org/scripts/394971/yggJS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    waitForKeyElements( "#\\#torrents", el => display(el), false );
})();

function display(el) {
    let movies = [];
    let rows = el.querySelector('table').rows;

    for (let row of rows) {
        let movieCell = row.cells[1],
            cellContent = document.createElement('DIV'),
            movieLink = movieCell.childNodes[0],
            movieLinkButton = document.createElement('button'),
            movieName = movieLink.innerText,
            movieId = movieLink.href.split("/").pop().split("-")[0];
        cellContent.classList.add('cellContent');
        movieCell.classList.add('movieCell');
        movieLink.classList.add('movieLink');
        movieLinkButton.innerText = "download";
        movieLinkButton.classList.add('directLink');
        movieLinkButton.onclick = function() {torrentLink(movieLink.href, movieId, movieName)};
        cellContent.appendChild(movieLink);
        cellContent.appendChild(movieLinkButton);
        movieCell.appendChild(cellContent);
        movies.push(movieCell);
    }

}

function torrentLink(ref, id, filename) {
    try {
        fetch("https://www2.yggtorrent.ws/engine/download_torrent?id=" + id, {
            "credentials":"include",
            "headers":{
                "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language":"fr-FR,fr;q=0.9,en;q=0.8,en-US;q=0.7",
                "sec-fetch-mode":"navigate",
                "sec-fetch-site":"same-origin",
                "sec-fetch-user":"?1",
                "upgrade-insecure-requests":"1"
            },
            "referrer":ref,
            "referrerPolicy":"no-referrer-when-downgrade",
            "body":null,
            "method":"GET",
            "mode":"cors"
        })
            .then(rep => {
            let contentType = rep.headers.get("content-type");
            if (contentType && contentType.indexOf("text/html") !== -1) {
                return rep.text()
            } else {
                return rep.blob();
            }
        })
            .then(res => {
            if (typeof res == "string") {
                alert(res);
                panelConnect();
            } else {
                let url = window.URL.createObjectURL(res),
                    a = document.createElement('a');
                a.href = url;
                a.download = filename + ".torrent";
                document.body.appendChild(a); //we need to append the element to the dom -> otherwise it will not work in firefox
                a.click();
                a.remove(); //afterwards we remove the element again
            }
        });
    } catch(e) {
        console.log(e);
    }
}
