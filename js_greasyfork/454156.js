// ==UserScript==
// @name         MegaStream Poster Replacer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replaces poster images for films
// @author       Stefan456789
// @match        https://mega-stream.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mega-stream.to
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/454156/MegaStream%20Poster%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/454156/MegaStream%20Poster%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let elements = document.querySelectorAll(".film-poster-img")
    elements.forEach(replaceImg)
})();


async function replaceImg(element){

    if (element !== undefined) {
        let apiKey = "c5e7db36e1c5fe8d594fabd7cb305405"
        let encoded = encodeURIComponent(element.getAttribute("title"))
        let url = "https://api.themoviedb.org/3/search/multi?api_key=" + apiKey + "&query=" + encoded + "&page=1&include_adult=true"
        let imgResponse = await fetch(url)
        let img = await imgResponse.json();


        setInterval(function () {
            element.setAttribute("src", "https://image.tmdb.org/t/p/w500" + img.results[0].poster_path)
        }, 5000);
    }
}