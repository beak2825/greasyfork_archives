// ==UserScript==
// @name           CineCalidad rate movies
// @name:es        CineCalidad rate pelis
// @description    Add imdb rating to movies in list and featured movies
// @description:es Agrega la calificación de imdb a las películas del listado y de las películas destacadas
// @license        MIT
// @version        0.13
// @author         IgnacioV
// @icon           https://cinecalidad.fo/wp-content/themes/dpelis/assets/img/favicon.png
// @namespace      https://greasyfork.org/users/460341
// @include        https://*cinecalidad.*/*

// @downloadURL https://update.greasyfork.org/scripts/404282/CineCalidad%20rate%20movies.user.js
// @updateURL https://update.greasyfork.org/scripts/404282/CineCalidad%20rate%20movies.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function httpGetAsync(url, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                const page = parser.parseFromString(xmlHttp.responseText, 'text/html');
                callback(page);
            }
        }
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    }

    const parser = new DOMParser();

    const contentInside = document.querySelector('#content_inside');
    const boxes = contentInside.querySelectorAll('div.home_post_cont.post_box');
    boxes.forEach((box) => {
        const url = box.querySelector('a').href;
        httpGetAsync(url, (page) => {
            const starBox = page.querySelector('#star-rating-box');
            const starRating = starBox.querySelector('div');
            starRating.style.width = '90px';
            starBox.style.marginLeft = '0px';
            const imdbBox = page.querySelector('#imdb-box').lastChild;
            const rate = imdbBox.textContent.trim().split(' ')[0];
            imdbBox.textContent = rate;
            starRating.querySelector('div').style.width = `${rate.split('/')[0]*10}%`;
            box.appendChild(starBox);
            box.appendChild(imdbBox);
        });
    });

    const sideBar = document.querySelector('#sidebar div.destacados-widget.side_box');
    const sideBoxes = sideBar.querySelectorAll('ul > li');
    sideBoxes.forEach(function (sideBox){
        const url = sideBox.querySelector('a').href;
        httpGetAsync(url, (page) => {
            const starBox = page.querySelector('#star-rating-box');
            const starRating = starBox.querySelector('div');
            starRating.style.width = '90px';
            const imdbBox = page.querySelector('#imdb-box').lastChild;
            const rate = imdbBox.textContent.trim().split(' ')[0];
            imdbBox.textContent = rate;
            starRating.querySelector('div').style.width = `${rate.split('/')[0]*10}%`;
            sideBox.appendChild(imdbBox);
        });
    });
})();