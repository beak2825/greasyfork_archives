// ==UserScript==
// @name         MercadoLivre Filter
// @namespace    https://github.com/argit2/mercadolivre-filter
// @version      0.3
// @description  Filtre palavras na pesquisa do mercadolivre. Filter words when searching in mercadolivre.
// @author       You
// @include      *mercadolivre.com.br*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419158/MercadoLivre%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/419158/MercadoLivre%20Filter.meta.js
// ==/UserScript==

/*
Instruções

Para filtrar a palavra "azul", adicione "-azul" à sua pesquisa no site.
Exemplo: pesquise por "mochila -azul"

Instructions

To filter the word "blue", add "-blue" to your search in the site.
Example: search for "backpack -blue"
*/

var searchQuery = "";
var toFilter = [];
var linkEnd = "";

function getToFilter() {
    let address = document.location.href.replaceAll("%20", " ");
    linkEnd = "#" + address.split("#")[1];
    if (! linkEnd) {
        return;
    }
    searchQuery = linkEnd.split("[")[1].slice(2, -1);
    toFilter = searchQuery.split(" ").filter(x => {
        return x[0] === "-"; // takes part of the query that begin with -
    }).map(x => x.slice(1));
    toFilter = toFilter.map(x => x.toLowerCase());
}

function fixSearchBar() {
    if (! searchQuery) {
        return;
    }
    let searchBar = document.querySelector("input.nav-search-input");
    searchBar.value = searchQuery;
}

function fixLink() {
    let address = document.location.href;
    let parts = address.split("#");
    toFilter.forEach( f => {
        parts[0] = parts[0].replace(f, "");
    })
    newAddress = parts[0] + "#" + parts[1];
    if (address == newAddress){
        return;
    }
    document.location.href = newAddress;
}

function filter (elem) {
    if (! elem) {
        return;
    }
    let titleElem = elem.querySelector(".ui-search-item__title")
    if (! titleElem) {
        return;
    }
    //console.log(toFilter);
    let title = titleElem.innerText.toLowerCase();
    //console.log(title);
    toFilter.forEach( f => {
        if (title.includes(f) && elementExists(elem)) {
            console.log(`Removing ${f}: ${title}`);
            elem.style.display = "none";
        }
    })
}

function elementExists(elem)
{
    if (! elem) {
        return;
    }
    return elem && elem.style.visibility != "hidden" && elem.style.display !== "none";
}

function filterAll() {
    if (! toFilter) {
        return;
    }
    let elements = document.querySelectorAll(".ui-search-layout__item");
    elements.forEach(x => filter(x));
}

function replaceLinks() {
    if (! linkEnd) {
        return;
    }
    let links = Array.from(document.querySelectorAll("a"));
    links.forEach( x => {
        x.href = x.href + linkEnd;
    })
}

getToFilter();
fixLink();
fixSearchBar();
setInterval(filterAll, 1000);
replaceLinks();