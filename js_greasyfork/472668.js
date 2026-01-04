// ==UserScript==
// @name         ByTowne Letterboxd Link
// @namespace    vignesh.one
// @version      0.1
// @description  Leverage Letterboxd API to include Letterboxd and IMDB links for movies on the ByTowne website
// @author       Vignesh K
// @match        https://www.bytowne.ca/movies/*
// @icon         https://www.letterboxd.com
// @grant        GM_xmlhttpRequest
// @run-at document-end
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/472668/ByTowne%20Letterboxd%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/472668/ByTowne%20Letterboxd%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LETTERBOXD_ICON = "https://a.ltrbxd.com/logos/letterboxd-decal-dots-pos-rgb-500px.png";
    const movieName = document.querySelector('h1.elementor-heading-title').textContent;

    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://api.letterboxd.com/api/v0/search?input=' + movieName + '&include=FilmSearchItem&perPage=1',
        onload: function(response) {
            var data = JSON.parse(response.responseText);
            console.log(data);
            const letterboxdUrl = data.items[0].film.links[0].url;
            document.querySelector('h1.elementor-heading-title').innerHTML += " <a href=\""+ letterboxdUrl + "\"><img src=\"" + LETTERBOXD_ICON + "\"/ width='25px' height'25px'></a>";
        },
        onerror: function(error) {
            console.error('Error fetching data:', error);
        }
    });
})();