// ==UserScript==
// @name         Darkino Jellyseer Media Info
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Ce script Tampermonkey vous permet d'obtenir les informations des média de depuis Jellyseer/Overseerr et de vérifier si le film est dans votre médiathèque. Un message s'affiche pour vous indiquer la présence ou non du média.
// @author       login744369
// @match        https://catalogue.darkino3.top/*
// @grant        GM.xmlHttpRequest
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at 	     document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485082/Darkino%20Jellyseer%20Media%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/485082/Darkino%20Jellyseer%20Media%20Info.meta.js
// ==/UserScript==

const JELLYSEER_API_BASE = ''; // example: 'https://jellyseer.example.com/api/v1'
const JELLYSEER_API_KEY = '' // can be found in the Jellyseer settings
const DARKINO_REGEX = new RegExp('https:\/\/.*\.darkino\..*');
const MOVIE_ENDPOINT = 'films'; // darkino movie endpoint
const SERIES_ENDPOINT = 'series'; // darkino series endpoint
const ANIMES_ENDPOINT = 'animes'; // darkino animes endpoint
const BROWSER_ENDPOINT = '?'; // darkino browser endpoint
const SINGLE_CARD_SELECTOR = 'div.box.product-card'; // darkino single card selector
const SUPPORTED_CATEGORY = ['films', 'séries', 'animes']; // darkino supported categories

// enum for the different types of responses
const ResponseType = {
    PRESENT: 0,
    ABSENT: 1,
    NOTSURE: 2,
    ERROR: 3
};

const ArticleType = {
    MOVIE: 0,
    SERIES: 1,
    ANIMES: 2,
    ALL: 3,
    NOTSUPPORTED: 4
};

function displayNotification(title, text) {
    GM.notification({
        title: title,
        text: text,
        timeout: 15000,
        silent: false,
        ondone: function () {
        },
        onclick: function () {
        }
    });
}

/**
 * Checks the parameters for the API requests.
 */
async function checkParams() {
    // make a request to the /status endpoint to check if the API url is correct
    const apiUrl = `${JELLYSEER_API_BASE}/status`;
    var resp = false;

    if (JELLYSEER_API_BASE == '' || JELLYSEER_API_KEY == '') {
        displayNotification('Darkino Jellyseer Media Info', `Veuillez configurer l'URL et la clé API Jellyseer dans le script Tampermonkey`);
        return resp;
    }

    GM.deleteValue('jellyseer_api_base');
    GM.deleteValue('jellyseer_api_key');

    // Perform the API request
    await GM.xmlHttpRequest({
        method: 'GET',
        url: apiUrl,
        headers: {
            'accept': 'application/json'
        },
        onload: function (response) {
            if (response.status === 200) {
                const statusData = JSON.parse(response.responseText);
                if (!statusData.version) {
                    displayNotification('Darkino Jellyseer Media Info', `L'URL ${JELLYSEER_API_BASE} n'est pas une URL de Jellyseer ou Overseerr`);
                    return;
                }
                resp = true;
            } else {
                displayNotification('Darkino Jellyseer Media Info', `L'URL ${JELLYSEER_API_BASE} n'est pas une URL valide`);
            }
        },
        onerror: function () {
            displayNotification('Darkino Jellyseer Media Info', `Impossible de vérifier l'URL ${JELLYSEER_API_BASE}`);
        }
    });

    if (!resp) {
        return resp;
    } else {
        resp = false;
    }

    await GM.setValue('jellyseer_api_base', JELLYSEER_API_BASE);

    const url = `${JELLYSEER_API_BASE}/auth/me`;

    // Perform the API request
    await GM.xmlHttpRequest({
        method: 'GET',
        url: url,
        headers: {
            'accept': 'application/json',
            'X-Api-Key': JELLYSEER_API_KEY
        },
        onload: function (response) {
            if (response.status === 200) {
                const data = JSON.parse(response.responseText);
                if (!data.email) {
                    displayNotification('Darkino Jellyseer Media Info', `La clé API "${JELLYSEER_API_KEY}" n'est pas une clé API valide`);
                    return;
                }
                resp = true;
            } else {
                displayNotification('Darkino Jellyseer Media Info', `La clé API "${JELLYSEER_API_KEY}" n'est pas une clé API valide`);
            }
        },
        onerror: function (error) {
            displayNotification('Darkino Jellyseer Media Info', `Impossible de vérifier la clé API "${JELLYSEER_API_KEY}"`);
        }
    });

    if (!resp) {
        return resp;
    }

    await GM.setValue('jellyseer_api_key', JELLYSEER_API_KEY);

    return resp;
}

/**
 * Retrieves the article type based on the current URL.
 * @returns {string} The article type.
 */
function getArticleType() {
    try {
        var article_type = document.location.href.split('/')[4];

        if (document.location.href.includes(BROWSER_ENDPOINT)) {
            return ArticleType.ALL;
        }

        switch (article_type) {
            case MOVIE_ENDPOINT:
                return ArticleType.MOVIE;
            case SERIES_ENDPOINT:
                return ArticleType.SERIES;
            case ANIMES_ENDPOINT:
                return ArticleType.ANIMES;
            case BROWSER_ENDPOINT:
                return ArticleType.ALL;
            default:
                return ArticleType.NOTSUPPORTED;
        }
    } catch (e) {
        return ArticleType.NOTSUPPORTED;
    }
}

/**
 * Retrieves the position element of the article.
 * @returns {HTMLElement|null} The position element of the article, or null if it cannot be found.
 */
function getArticlePositionElement() {
    try {
        return document.getElementById("rate-post").parentElement;
    } catch (e) {
        return null;
    }
}

/**
 * Retrieves the title of the article.
 *
 * @returns {string|null} The title of the article, or null if an error occurs.
 */
function getArticleTitle() {
    try {
        var title = document.title;
        // remove the "Télécharger" and "ou voir en streaming gratuitement - Darkino Officiel" parts and spaces
        var title_text = title.replace('Télécharger', '').replace('ou voir en streaming gratuitement - Darkino Officiel', '').trim();
        return title_text;
    } catch (e) {
        return null;
    }
}

/**
 * Adds an icon to the specified element based on the response type.
 * @param {HTMLElement} element - The element to which the icon will be added.
 * @param {string} response_type - The type of response (e.g., "PRESENT", "ABSENT", "ERROR").
 * @returns {void}
 */
function addIcon(element, response_type) {
    if (element) {
        element.classList.add('relative');
        var icon_container = document.createElement('span');
        icon_container.classList.add('absolute', 'top-2', 'left-2', 'p-1', 'rounded-xl');
        var icon = document.createElement('svg');
        icon.classList.add('h-4', 'w-4');
        icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        icon.setAttribute('width', '16');
        icon.setAttribute('height', '16');
        icon.setAttribute('fill', 'currentColor');
        icon.setAttribute('viewBox', '0 0 16 16');
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        switch (response_type) {
            case ResponseType.PRESENT:
                icon.classList.add('text-green-500');
                icon_container.classList.add('bg-green-500');
                path.setAttribute('d', 'M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z');
                break;
            case ResponseType.ABSENT:
                icon.classList.add('text-red-500');
                icon_container.classList.add('bg-red-500');
                path.setAttribute('d', 'M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm0-1.5A6.5 6.5 0 1 0 8 1.5a6.5 6.5 0 0 0 0 13zM7.5 5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 .5-.5zm.5 7a.5.5 0 0 1-1 0V8a.5.5 0 0 1 1 0v4z');
                break;
            case ResponseType.ERROR:
                icon.classList.add('text-yellow-500');
                icon_container.classList.add('bg-yellow-500');
                path.setAttribute('d', 'M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm0-1.5A6.5 6.5 0 1 0 8 1.5a6.5 6.5 0 0 0 0 13z');
                break;
            case ResponseType.NOTSURE:
                icon.classList.add('text-yellow-500');
                icon_container.classList.add('bg-yellow-500');
                path.setAttribute('d', 'M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm0-1.5A6.5 6.5 0 1 0 8 1.5a6.5 6.5 0 0 0 0 13z');
                break;
        }
        icon.appendChild(path);
        icon_container.appendChild(icon);
        element.appendChild(icon_container);
    }
}

/**
 * Adds a tile element to the DOM based on the provided parameters.
 *
 * @param {HTMLElement} element - The element after which the tile will be inserted.
 * @param {string} response_type - The type of response (PRESENT, ABSENT, ERROR).
 * @param {string} html - The HTML content of the tile.
 */
function addTile(element, response_type, html) {
    if (element) {
        // create the parent div element
        var parent_div = document.createElement('div');
        parent_div.classList.add('flex', 'justify-center');

        // <div class="ti-toast bg-white dark:bg-bodybg dark:border-white/10" style="max-width: 67rem" role="alert">
        var container_div = document.createElement('div');
        container_div.classList.add('ti-toast', 'bg-white', 'dark:bg-bodybg', 'dark:border-white/10');
        container_div.setAttribute('style', 'max-width: 67rem');
        container_div.setAttribute('role', 'alert');

        // create the same div element as the one above
        var div = document.createElement('div');
        div.classList.add('flex', 'p-4');

        // create the first div element
        var div1 = document.createElement('div');
        div1.classList.add('flex-shrink-0');

        // create the svg element
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.classList.add('h-4', 'w-4', 'mt-0.5');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('fill', 'currentColor');
        svg.setAttribute('viewBox', '0 0 16 16');

        // create the path element
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");

        // create the second div element
        var div2 = document.createElement('div');
        div2.classList.add('ms-3');

        // create the p element
        var p = document.createElement('p');
        p.classList.add('text-sm', 'text-gray-700', 'dark:text-[#8c9097]', 'dark:text-white/50');

        switch (response_type) {
            case ResponseType.PRESENT:
                svg.classList.add('text-green-500');
                path.setAttribute('d', 'M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z');
                p.innerHTML = html;
                break;
            case ResponseType.ABSENT:
                svg.classList.add('text-red-500');
                path.setAttribute('d', 'M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm0-1.5A6.5 6.5 0 1 0 8 1.5a6.5 6.5 0 0 0 0 13zM7.5 5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 .5-.5zm.5 7a.5.5 0 0 1-1 0V8a.5.5 0 0 1 1 0v4z');
                p.innerHTML = html;
                break;
            case ResponseType.ERROR:
                svg.classList.add('text-yellow-500');
                path.setAttribute('d', 'M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm0-1.5A6.5 6.5 0 1 0 8 1.5a6.5 6.5 0 0 0 0 13z');
                p.innerHTML = html;
                break;
        }

        // append the path element to the svg element
        svg.appendChild(path);

        // append the svg element to the first div element
        div1.appendChild(svg);

        // append the p element to the second div element
        div2.appendChild(p);

        // append the first and second div elements to the div element
        parent_div.appendChild(container_div);
        container_div.appendChild(div);
        div.appendChild(div1);
        div.appendChild(div2);

        // append the div element just after the title element
        element.after(parent_div);
    }
}

/**
 * Retrieves the media ID and type from a link on the page.
 * @returns {Array<number|string>|null} An array containing the media ID and type, or null if no link is found.
 */
function getMediaID() {
    // search for a link with "https://www.themoviedb.org" in it
    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
        if (links[i].href.indexOf('https://www.themoviedb.org') != -1) {
            var href = links[i].href;
            // get the last part of the link, which is the movie ID and remove any other end parameters
            var media_id = href.split('/').pop().split('?')[0];
            // get the type of the media (movie => https://www.themoviedb.org/movie/400928, tv => https://www.themoviedb.org/tv/60735)
            var media_type = href.split('/')[3];
            if (media_type === 'movie') {
                return [media_id, ArticleType.MOVIE];
            } else {
                return [media_id, ArticleType.SERIES];
            }
        }
    }
    return null;
}

/**
 * Handles the response from an API request.
 * Determines the response type based on the status code and the presence of movie data.
 * Adds a tile to the article position element with the corresponding response message.
 *
 * @param {Object} response - The response object from the API request.
 */
function handleResponse(response) {
    var resp = ResponseType.ERROR;

    if (response.status === 200) {
        const movieData = JSON.parse(response.responseText);
        // if the "mediaindo" field is not empty, then the movie is in Jellyseer's database
        if (movieData.mediaInfo) {
            resp = ResponseType.PRESENT;
        } else {
            resp = ResponseType.ABSENT;
        }
    } else {
        resp = ResponseType.ERROR;
        checkParams();
    }

    const element = getArticlePositionElement();

    if (element) {
        const title = getArticleTitle();
        switch (resp) {
            case ResponseType.PRESENT:
                addTile(element, resp, `<strong>${title}</strong> est présent dans la base de données de Jellyseer`);
                break;
            case ResponseType.ABSENT:
                addTile(element, resp, `<strong>${title}</strong> n'est pas présent dans la base de données de Jellyseer`);
                break;
            case ResponseType.ERROR:
                addTile(element, resp, `Erreur lors de la récupération des données de <strong>${title}</strong> depuis Jellyseer`);
                break;
        }
    }
}

/**
 * Retrieves the details of a movie from the Jellyseer API.
 * @param {number} movie_id - The ID of the movie to retrieve details for.
 */
function getMovieDetails(movie_id) {
    const apiUrl = `${JELLYSEER_API_BASE}/movie/${movie_id}`;

    // Perform the API request
    GM.xmlHttpRequest({
        method: 'GET',
        url: apiUrl,
        headers: {
            'accept': 'application/json',
            'X-Api-Key': JELLYSEER_API_KEY
        },
        onload: handleResponse,
        onerror: function (error) {
            return ResponseType.ERROR;
        }
    });
}

/**
 * Retrieves TV details from the API.
 * @param {string} tv_id - The ID of the TV show.
 * @returns {void}
 */
function getTvDetails(tv_id) {
    const apiUrl = `${JELLYSEER_API_BASE}/tv/${tv_id}`;

    // Perform the API request
    GM.xmlHttpRequest({
        method: 'GET',
        url: apiUrl,
        headers: {
            'accept': 'application/json',
            'X-Api-Key': JELLYSEER_API_KEY
        },
        onload: handleResponse,
        onerror: function (error) {
            return ResponseType.ERROR;
        }
    });
}

/**
 * Removes special characters from the title.
 * @param {string} title - The title to remove special characters from.
 * @returns {string} The modified title without special characters.
 */
function removeParasiteFromTitle(title) {
    // remove -, :, (, ), and spaces from the title
    var title_text = title.replace(/[-:() ]/g, '');
    return title_text;
}

/**
 * Handles the response from the title API.
 *
 * @param {object} response - The response object from the API.
 * @param {number} year - The year of the movie.
 * @param {string} title - The title of the movie.
 * @param {HTMLElement} element - The HTML element to add the icon to.
 * @returns {void}
 */
function handleResponseFromTitle(response, year, title, element) {
    var resp = ResponseType.ERROR;

    if (response.status === 200) {
        const movieData = JSON.parse(response.responseText);

        if (movieData.results.length == 0) {
            resp = ResponseType.NOTSURE;
        } else if (movieData.results.length == 1) {
            if (movieData.results[0].mediaInfo && new Date(movieData.results[0].releaseDate).getFullYear() == year)
            {
                resp = ResponseType.PRESENT;
            }
        }
        else {
            for (var i = 0; i < movieData.results.length; i++) {
                if (movieData.results[i].mediaInfo && new Date(movieData.results[i].releaseDate).getFullYear() == year && removeParasiteFromTitle(movieData.results[i].title.toLowerCase()) == removeParasiteFromTitle(title.toLowerCase())) {
                    resp = ResponseType.PRESENT;
                    break;
                }
            }

            if (resp === ResponseType.ERROR) {
                resp = ResponseType.ABSENT;
            }
        }
    } else {
        resp = ResponseType.ERROR;
    }

    if (element) {
        addIcon(element, resp);
    }
}

/**
 * Retrieves details from the title using an API request.
 * @param {string} title - The title to search for.
 * @param {number} year - The year of the title.
 * @param {HTMLElement} element - The element to update with the details.
 * @returns {void}
 */
function getDetailsFromTitle(title, year, element) {
    const apiUrl = `${JELLYSEER_API_BASE}/search?query=${encodeURIComponent(title)}&page=1`;

    // Perform the API request
    GM.xmlHttpRequest({
        method: 'GET',
        url: apiUrl,
        headers: {
            'accept': 'application/json',
            'X-Api-Key': JELLYSEER_API_KEY
        },
        onload: (response) => handleResponseFromTitle(response, year, title, element),
        onerror: function (error) {
            return ResponseType.ERROR;
        }
    });
}

/**
 * The main function that executes the script.
 */
async function main() {
    if (!DARKINO_REGEX.test(document.location.href)) {
        return;
    }

    const jellyseer_api_base = await GM.getValue('jellyseer_api_base');
    const jellyseer_api_key = await GM.getValue('jellyseer_api_key');

    if (jellyseer_api_base != JELLYSEER_API_BASE || jellyseer_api_key != JELLYSEER_API_KEY) {
        console.log(new Date().toLocaleString() + ' - Settings for Darkino Jellyseer Script has been changed, checking params...');
        if(!checkParams()) {
            console.log(new Date().toLocaleString() + ' - Darkino Jellyseer Script has been disabled because of invalid settings');
            return;
        }
    }

    const article_type = getArticleType();

    if (article_type === ArticleType.NOTSUPPORTED) {
        return;
    }

    console.log(new Date().toLocaleString() + ' - Darkino Jellyseer Script has been executed for ' + document.location.href);

    switch (article_type) {
        case ArticleType.MOVIE:
            var [movie_id, m_type] = getMediaID();
            if (movie_id) {
                getMovieDetails(movie_id);
            }
            break;
        case ArticleType.SERIES:
            var [tv_id, t_type] = getMediaID();
            if (tv_id) {
                getTvDetails(tv_id);
            }
            break;
        case ArticleType.ANIMES:
            var [animes_id, animes_type] = getMediaID();
            if (animes_id) {
                if (animes_type === ArticleType.MOVIE) {
                    getMovieDetails(animes_id);
                }
                else if (animes_type === ArticleType.SERIES) {
                    getTvDetails(animes_id);
                }
            }
            break;
        case ArticleType.ALL:
            var articles = document.querySelectorAll(SINGLE_CARD_SELECTOR);
            for (var i = 0; i < articles.length; i++) {
                if (SUPPORTED_CATEGORY.includes(articles[i].querySelector(".ti.ti-category").parentElement.querySelector("a").text.toLowerCase())) {
                    var year = articles[i].querySelector('.post.info.tooltip div div span').textContent.trim();
                    var title = articles[i].querySelector('.post.info.tooltip div div').textContent.replace(year, '').trim();
                    getDetailsFromTitle(title, year, articles[i]);
                }
            }
            break;
    }
}

window.onload = function () {
    main();
};

// Listen for changes in the URL
var currentUrl = window.location.href;
setInterval(function () {
    if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        main();
    }
}, 1000); // Check every 1000 milliseconds (adjust as needed)