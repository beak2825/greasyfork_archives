// ==UserScript==
// @name            Netflix CSFD rating
// @namespace       http://tampermonkey.net/
// @version         1.0
// @author			A. Sipicky
// @description     Script for Netflix site to add rating from CSFD.cz site
// @match           http*://www.netflix.com/*
// @match      	    http*://*.netflix.com/*
// @match      	    http*://netflix.com/*
// @grant           GM_addStyle
// @grant           GM_download
// @grant           GM_xmlhttpRequest
// @run-at       	document-idle
// @copyright   	2020-01-03 // A. Sipicky
// @license         https://creativecommons.org/licenses/by-sa/4.0
// @downloadURL https://update.greasyfork.org/scripts/453647/Netflix%20CSFD%20rating.user.js
// @updateURL https://update.greasyfork.org/scripts/453647/Netflix%20CSFD%20rating.meta.js
// ==/UserScript==

const API_URL = 'https://api.themoviedb.org/3/search/multi';
const API_KEY = '2273bdb4fdb0bfdd3a16a477da8f28c1';
const API_PARAMS = {
    'api_key': API_KEY,
    'page': '1',
    'include_adult': 'true',
};
const API_ALLOWED_MEDIA_TYPE = ['tv', 'movie'];
const CARD_RATING_NODE = 'netflixcsfd__card-rating';

void new class {
    constructor() {
        this._netflixMovieBuffer = new Set();

        this.init();
        this.addStyles();
    }

    init() {
        let eventTimer = null;
        window.addEventListener('scroll', () => {
            if (eventTimer !== null) {
                clearTimeout(eventTimer);
            }
            eventTimer = setTimeout(() => {
                // [...this.loadNetflixStream()].map(item => this._netflixMovieBuffer.add(item));
                this.loadNetflixStream();
            }, 350);
        }, false);
    }

    loadNetflixStream() {
        return [...document.querySelectorAll('.title-card-container:not(.netflixcsfd__card--loaded)')].map((item) => {
            let movieTitle = item.querySelector('.fallback-text').textContent || null;
            this.fetchMovieDbApi(movieTitle).then((data) => {
                let filteredJson = data.results.reduce((obj, item) => {
                    if (API_ALLOWED_MEDIA_TYPE.some(el => item.media_type.includes(el))) {
                        obj.push(item);
                    }
                    return obj;
                }, []);

                this.createNetflixNode(item, filteredJson[0].vote_average);

                //console.log(`(${movieTitle}) // Title: ${filteredJson[0].original_name || filteredJson[0].original_title} // Vote: ${filtered[0].vote_average}`);
            }).catch((e) => { throw new Error(400) });

            item.classList.add('netflixcsfd__card--loaded');

            return movieTitle;
        });
    }

    async fetchMovieDbApi(movieTitle) {
        let response = await fetch(this.createApiUrl(movieTitle));
        let apiData = await response.json();

        return apiData;
    }

    createApiUrl(queryString) {
        let queryParams = Object.entries(API_PARAMS).map(([attribute, value]) => `${attribute}=${value}`).join('&');
        return queryString ? `${API_URL}?${queryParams}&query=${encodeURIComponent(queryString)}` : null;
    }

    createNetflixNode(element, rating) {
        element.insertAdjacentHTML('afterbegin', `<div class="${CARD_RATING_NODE}">${rating * 10}%</div>`);
    }

    addStyles() {
        GM_addStyle(`
            .${CARD_RATING_NODE} {
                top: 0.3em;
                left: 0.3em;
                width: 3em;
                height: 3em;
                position: absolute;
                z-index: 100;
                background-color: #ea0000;
                vertical-align: middle;
                text-align: center;
                line-height: 3em;
                border-radius: 100%;
                font-weight: bold;
            }
        `);
    }
}