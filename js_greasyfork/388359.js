// ==UserScript==
// @name         Random Page and Gallery for exhentai
// @namespace    http://exhentai.org/
// @version      1.1
// @description  adds random page and random gallery buttons to search pages
// @author       sllypper
// @include      *://exhentai.org/*
// @include      *://g.e-hentai.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388359/Random%20Page%20and%20Gallery%20for%20exhentai.user.js
// @updateURL https://update.greasyfork.org/scripts/388359/Random%20Page%20and%20Gallery%20for%20exhentai.meta.js
// ==/UserScript==

// Options:

let openGalleryOnNewTab = true;

//

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function openRandGal() {
    let gals = Array.from(document.getElementsByClassName('itg')[0].getElementsByTagName('a')).filter(gal => gal.href.includes('/g/'));
    // gals = gals.filter(onlyUnique);
    window.open(gals[parseInt(Math.floor(Math.random() * gals.length - 1))].href, openGalleryOnNewTab ? '_blank' : '_parent');
}

function getRandPageNum() {
    let pageButtons = document.getElementsByClassName('ptt')[0].firstChild.firstChild.children;
    let numPages = pageButtons[pageButtons.length - 2].firstChild.text;
    return parseInt((numPages * Math.random()) - 1);
}

function openRandPage() {
    let pageNum = getRandPageNum();
    let url = Array.from(document.getElementsByClassName('ptt')[0].getElementsByTagName('a')).find(el => el.href.includes('page'));
    if (url) {
        url = url.href.replace(/(page=)\d+(&)/, '$1' + pageNum + '$2');
        window.open(url, '_parent');
    }
}

(function(){
    let isFavorites = location.href.indexOf('favorites') > 0;
    let place;
    let style = '';

    if (!isFavorites) {
        // on the main page
        place = document.getElementsByClassName('nopm');
        place = place[place.length - 1];
        style = 'float: right;'
    } else {
        // on the Favorites page
        place = document.getElementsByClassName('ip')[0];
    }

    let template = `<div id="randomStuff" style="${style}">
  <a id="randGalLink" href="#">Random Gallery</a> &nbsp; &nbsp;
  <a id="randPageLink" href="#">Random Page</a>
</div>`;

    place.innerHTML = !isFavorites ? place.innerHTML + template : template + place.innerHTML;

    var myLink = document.getElementById("randGalLink");
    myLink.addEventListener("click", openRandGal, true);
    
    var myPageLink = document.getElementById("randPageLink");
    myPageLink.addEventListener("click", openRandPage, true);
    
})();