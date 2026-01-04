// ==UserScript==
// @name         Letterboxd Stremio Icon and link
// @namespace    http://tampermonkey.net/
// @version      2024-01-12
// @description  Adds an icon with a link to Stremio on every film on Letterboxd
// @author       CarnivalHipster
// @match 	     https://letterboxd.com/film/*
// @match 	     https://letterboxd.com/*/film/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stremio.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485089/Letterboxd%20Stremio%20Icon%20and%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/485089/Letterboxd%20Stremio%20Icon%20and%20link.meta.js
// ==/UserScript==
const tmdbApiKey = ''; //Put Your TMDB Key here
var StremioImg = 'https://www.google.com/s2/favicons?sz=64&domain=stremio.com';
var filmTitle = filmData['name']
filmTitle = filmTitle.replace(/[\/\\#,+()$~%.":*?<>{}!]/g, '');
filmTitle = filmTitle.replace(/&/g, '%26')
var filmYear = filmData['releaseYear']
var tmdbId = getMovieId("TMDb");
var imdbId = getMovieId("IMDb");
var pixelSize = 30;
function getMovieId(idType) {
    var element = document.querySelector(`[data-track-action="${idType}"]`); // Gets Tmdb and Imdb Ids
    if (typeof element !== 'undefined' && element !== null) {
        var buttons = document.getElementsByClassName('micro-button track-event');
        if (idType == "TMDb"){
            for (var i = 0; i < buttons.length; i++) {
                var tmdbUrl = buttons[i].getAttribute('href');
                if (tmdbUrl.includes('themoviedb.org')) {
                    var tmdbId = tmdbUrl.split('/').filter(str => str)[3];
                    console.log(`${idType} ID: ${tmdbId}`);
                    return tmdbId;
                }
            }
        } else {
            var idBtn = buttons[0].href.match(/(tt\d+)/); // Capture 'tt' followed by one or more digits
            var imdbId = idBtn ? idBtn[1] : null; // Check if the match was successful

            if (imdbId) {
                console.log(`IMDb ID: ${imdbId}`);
            } else {
                console.error('IMDb ID not found');
            }

            return imdbId;
        }
    }
    return null;
}

if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") {
    main();
} else {
    document.addEventListener('DOMContentLoaded', main);
}

function makeApiCall(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            throw error;
        });
}

function getImdbIdFromTitleAndYear(filmTitle, filmYear) {
    const api_key = tmdbApiKey;
    const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${filmTitle}&year=${filmYear}`;

    return makeApiCall(tmdbUrl)
        .then(data => {
            if (data.total_results > 0) {
                const tmdbId = data.results[0].id;
                const tmdbMovieUrl = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${api_key}`;
                return makeApiCall(tmdbMovieUrl);
            } else {
                throw new Error(`No movie was found with the title "${filmTitle}" and release year "${filmYear}".`);
            }
        })
        .then(movieData => {
            if (movieData && movieData.imdb_id) {
                return movieData.imdb_id;
            } else {
                throw new Error(`IMDb ID not found for the movie "${filmTitle}" (${filmYear})`);
            }
        });
}

function createIcon(cont, title, href, icon, eventListener) {

    var a = document.createElement('a');
    a.href = href;
    a.title = title;
    a.setAttribute('target', '_blank');

    var img = document.createElement('img');
    img.src = icon;
    img.style.padding = '3px';
    img.style.borderRadius = '3px';
    img.setAttribute('height', pixelSize);
    img.setAttribute('width', pixelSize);

    a.appendChild(img);
    var cell = cont.insertCell(-1);
    cell.appendChild(a);

    if (eventListener) {
        img.addEventListener('click', async (event) => {
            eventListener();
            img.style.opacity = '0.6';
            setTimeout(() => {
                img.style.opacity = '1';
            }, 100);
        });
    }

    console.log(title, 'icon built successfully.');
    return a;
}

function applyCSS() {
    const iconElt = document.querySelectorAll('#media-icon');
    iconElt.forEach(el => {
        el.style.display = 'table';
        el.style.margin = '0 auto';
        el.childNodes.forEach(child => {
            child.style.padding = '2px 4px 0px 4px';
            child.id = 'tor-icon';
        });
    });
    console.log('CSS applied.');
}


function createIconStremio(tr, title, href, icon) {
    var eventListener = async function () {
        if (imdbId == undefined) {
            imdbId = await getImdbIdFromTitleAndYear(filmTitle, filmYear);
            console.log(`The IMDB ID grabbed from their API for ${filmTitle} (${filmYear}) is ${imdbId}.`);
        } else {
            console.log(`The IMDB ID for ${filmTitle} (${filmYear}) is ${imdbId}.`);
        }
    };

    var stremioIconLink = createIcon(tr, title, href, icon, eventListener);
    var stremioIconImg = stremioIconLink.querySelector('img');
}


async function setupStremioIcon(tr) {
    await fetchImdbIdOnLoad();
    createIconStremio(tr,'Stremio', `https://web.stremio.com/#/detail/movie/${imdbId}/${imdbId}`, StremioImg);
}

async function fetchImdbIdOnLoad() {
    try {
        imdbId = await getImdbIdFromTitleAndYear(filmTitle, filmYear);
        console.log(`Fetched IMDb ID: ${imdbId}`);
    } catch (error) {
        console.error(`Error fetching IMDb ID: ${error}`);
    }
}

async function main() {
    let divContainer = document.querySelector('#media-icon');
    if (!divContainer) {
        const actionsPanel = document.querySelector('.js-actions-panel');
        const listItem = document.createElement('li');
        divContainer = document.createElement('div');
        divContainer.id = 'media-icon';
        listItem.appendChild(divContainer);
        actionsPanel.insertBefore(listItem, actionsPanel.lastChild);
    }

    let tr = divContainer.querySelector('tr');
    if (!tr) {
        tr = document.createElement('tr');
        tr.style.display = 'flex';
        divContainer.appendChild(tr);
    }

    await setupStremioIcon(tr);
    applyCSS();
}


