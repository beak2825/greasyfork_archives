// ==UserScript==
// @name         Manga Release Date Grabber
// @namespace    https://github.com/gboi
// @version      2.2
// @description  Recupera la data di uscita dei volumi uscenti sulla pagina del calendario di AnimeClick e calcola la spesa totale
// @author       gboi
// @match        https://www.animeclick.it/calendario-manga
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_addStyle
// @supportURL   https://github.com/gboi/Manga-Release-Date-Grabber
// @downloadURL https://update.greasyfork.org/scripts/397162/Manga%20Release%20Date%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/397162/Manga%20Release%20Date%20Grabber.meta.js
// ==/UserScript==

// Lista dei titoli da considerare, in lowercase
const want = ["vinland saga",
            "mob psycho 100",
            "dungeon food",
            "boruto",
            "dragon quest saga - l'emblema di roto ii - gli eredi dell'emblema",
            "born to be on air!"];

let myDiv;

(function() {
    'use strict';
    addCss();
    createListButton('#calendario-pagination-div');
})();

function createListButton(parentDiv){
	let buttonParagraph = $('<p/>', {
        id: "button-paragraph"
    }).appendTo(parentDiv);

    let listButton = $('<button/>', {
        id: "list-button",
        class: 'btn btn-default',
        html: 'Miei manga in pagina'
    }).appendTo(buttonParagraph);

	listButton.click(() => print() );
}

function addCss(){
    GM_addStyle('#list-button { margin: 10px }');
    GM_addStyle('#mie-uscite {background-color: white; border-radius: 25px; padding: 1px 20px 20px 20px; }');
    GM_addStyle('#mie-uscite h3 { color: #ec1f27; }');
    GM_addStyle('#mie-uscite h4 { color: #39548d; }');
    GM_addStyle('#mie-uscite p { font-style: italic }');
    GM_addStyle('#mie-uscite p.date { font-weight: bold }');
}

function print(){
    myDiv = $('#mie-uscite');
    if(myDiv.length!=0){
        return;
    }

    myDiv = $('<div/>', {
        id: 'mie-uscite'
    }).appendTo('.calendario-mese');

    Promise.all(getMangaPromises())
        .then(responses =>
              Promise.all(responses.map(data => data.text())))
        .then(response =>{
        myDiv.append('<h3>Uscite che m\'interessano</h3>');
        let mangaList = getMangaList(response);
        mangaList.forEach(manga => printManga(manga));
        printTotal(mangaList);
    });
}

function getMangaPromises(){
    let mangaListPromise = [];
    $('.panel-evento-calendario').each((i, el) => {
        var title = $(el).find('h5').html();

        if(want.includes(title.toLowerCase())){
            var url = $(el).find('a').attr("href");
            mangaListPromise.push(fetch(url));
        }
    });
    return mangaListPromise;
}

function getMangaList(response){
    let mangaList = [];
    response.forEach(data => mangaList.push(getManga(data)));
    return mangaList;
}

function getManga(data){
    let manga = {
        'title': getTitle(data),
        'volume': getVolume(data),
        'date': getDate(data),
        'price': getPrice(data)
    }
    return manga;
}

function printManga(manga){
    myDiv.append('<h4>' + manga.title + ' <span class="volume">' + manga.volume + '</span></h4>');
    myDiv.append('<p><strong class="date">' + manga.date + '</strong> - <span class="price">' + manga.price + '</span> €</p>');
}

function printTotal(mangaList){
    let total = 0;
    mangaList.forEach((manga) => {
        total += parsePrice(manga.price);
    });
    myDiv.append('<strong id="totale-spese">Totale:</strong> ' + total.toFixed(2).replace('.',',') + ' €');
}

function parsePrice(price){
    return parseFloat(price.replace(',','.'));
}

function getTitle(data){
    return useRegex(/<h1 itemprop="name">(.*)&nbsp;/, data);
}

function getVolume(data){
    return useRegex(/<h1 itemprop="name">.*\n\D*(\d*)\D*<\/h1>/, data);
}

function getPrice(data){
    return useRegex(/<strong>Prezzo:<\/strong>&nbsp;(\d*,\d*)&nbsp;/, data);
}

function getDate(data){
    return useRegex(/<strong>Data pubblicazione:<\/strong>&nbsp;(\d*\/\d*)\/\d*/, data);
}

function useRegex(pattern, data){
    let regex = pattern.exec(data);
    if(regex != null) return pattern.exec(data)[1];
    return '';
}
