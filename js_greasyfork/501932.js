// ==UserScript==
// @name         Cinematheqular
// @namespace    https://github.com/harristom
// @version      2025-06-01
// @description  Adds movie plots and ratings to the Ville de Luxembourg Cinematheque website
// @author       https://github.com/harristom
// @match        https://www.vdl.lu/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/501932/Cinematheqular.user.js
// @updateURL https://update.greasyfork.org/scripts/501932/Cinematheqular.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function formatRtRating(rating) {
        const FRESH_THRESHOLD = 60;
        return (parseInt(rating) >= FRESH_THRESHOLD ? '🍅 ' : '🍏 ') + rating;
    }

    function cleanTitle(title) {
        // Remove ending brackets from the title (often used to indicate the showing is part of a season)
        title = title.trim();
        return encodeURIComponent(title.replaceAll(/ \(.*$/gi, ''));
    }

    function agendaPage(omdbApiKey) {
        const RATINGS_CLASS_NAME = 'cinematheqular-ratings';

        GM_addStyle(`
            /* Hide the categories as it will be "Cinema" on all and the language tags are always wrong */
            .media-inner .media-category {
                display: none;
            }

            .${RATINGS_CLASS_NAME} {
                color: #4A4A4A;
                font-weight: 400;
            }

            .media-image figure[data-content] {
                position: relative;
                &::after {
                    position: absolute;
                    inset: 0px;
                    color: white;
                    background: linear-gradient(black, transparent);
                    padding: 3px;
                    content: attr(data-content);
                    font-size: 0.85em;
                    line-height: 1.2;
                    transition: 0.2s;
                    opacity: 0;
                    mask: linear-gradient(black 80%, transparent);
                }
                .media-link:hover &::after {
                    opacity: 1;
                }
            }
        `);

        const movieEls = document.querySelectorAll('.media-inner');

        for (const movieEl of movieEls) {
            const titleEl = movieEl.querySelector('.media-title');
            if (!titleEl) continue;
            let title = titleEl.textContent;
            title = cleanTitle(title);
            fetch(`https://www.omdbapi.com/?apikey=${omdbApiKey}&type=movie&t=${title}`)
                .then(response => response.json())
                .then(result => {
                    if (result.Error) return;
                    const tooltip = `${result.Title} (${result.Year}) ${result.Director}`;
                    // Add plot
                    const imgEl = movieEl.querySelector('.media-image figure');
                    if (imgEl) {
                        imgEl.dataset.content = result.Plot;
                        imgEl.title = tooltip;
                    }
                    // Add ratings
                    const rtRating = result.Ratings?.find(r => r.Source == 'Rotten Tomatoes')?.Value;
                    if (rtRating) {
                        const ratingEl = document.createElement('p');
                        ratingEl.className = RATINGS_CLASS_NAME;
                        ratingEl.textContent = formatRtRating(rtRating);
                        ratingEl.title = tooltip;
                        titleEl.append(ratingEl);
                    }
                })
                .catch(error => console.log('error', error));
        }
    }

    function detailPage(omdbApiKey) {
        const DETAILS_CLASS_NAME = 'cinematheqular-details';

        GM_addStyle(`
            .${DETAILS_CLASS_NAME} {
                border-radius: 7px;
                border: 2px solid #E4E4E4;
                padding: 10px 20px 20px 20px;
                margin-bottom: 20px;
            }

            .${DETAILS_CLASS_NAME}__disclaimer {
                text-transform: uppercase;
                margin-block: 0px 10px;
                font-size: 0.8rem;
                opacity: 0.8;
            }

            .${DETAILS_CLASS_NAME}__wrapper {
                display: flex;
                justify-content: center;
                align-items: start;
                flex-wrap: wrap;
                gap: 20px;
            }
        
            .${DETAILS_CLASS_NAME}__poster {
                display: block;
                object-fit: contain;
                overflow: hidden;
                flex: 1 100px;
                max-width: 200px;
                border-radius: 3px;
            }
        
            .${DETAILS_CLASS_NAME}__data {
                flex: 3 300px;
            }

            .${DETAILS_CLASS_NAME}__title {
                font-size: 1.8em;
                margin-bottom: 5px;
            }

            .${DETAILS_CLASS_NAME}__director {
                margin-top: 0px;
                margin-bottom: 5px;
                color: #b6b6b6;
                font-weight: 600;
            }

            .${DETAILS_CLASS_NAME}__ratings {
                margin-top: 0px;
                margin-bottom: 10px;
            }

            .${DETAILS_CLASS_NAME}__plot {
                margin: 0px;
            }
        `);

        let titleEl = document.querySelector('.block-page-title');
        if (!titleEl) return;
        const title = cleanTitle(titleEl.textContent);
        fetch(`https://www.omdbapi.com/?apikey=${omdbApiKey}&type=movie&plot=full&t=${title}`)
            .then(response => response.json())
            .then(result => {
                if (result.Error) return;
                const detailsEl = document.createElement('div');
                detailsEl.className = DETAILS_CLASS_NAME;
                detailsEl.innerHTML = `
                    <p class="${DETAILS_CLASS_NAME}__disclaimer"><small>Added by <a href="https://github.com/harristom/cinematheqular">Cinematheqular</a> &mdash; please check the rest of the listing to ensure the information is correct</small></p>
                    <div class="${DETAILS_CLASS_NAME}__wrapper">
                        <img src="" alt="" class="${DETAILS_CLASS_NAME}__poster">
                        <div class="${DETAILS_CLASS_NAME}__data">
                            <h2 class="${DETAILS_CLASS_NAME}__title"></h2>
                            <p class="${DETAILS_CLASS_NAME}__director"></p>
                            <p class="${DETAILS_CLASS_NAME}__ratings"></p>
                            <p class="${DETAILS_CLASS_NAME}__plot"></p>
                        </div>
                    </div>
                `;
                detailsEl.querySelector(`.${DETAILS_CLASS_NAME}__poster`).src = result.Poster;
                detailsEl.querySelector(`.${DETAILS_CLASS_NAME}__title`).textContent = `${result.Title} (${result.Year})`;
                const rtRating = result.Ratings.find(r => r.Source == 'Rotten Tomatoes')?.Value;
                if (rtRating) detailsEl.querySelector(`.${DETAILS_CLASS_NAME}__ratings`).textContent = formatRtRating(rtRating);
                detailsEl.querySelector(`.${DETAILS_CLASS_NAME}__plot`).textContent = result.Plot;
                detailsEl.querySelector(`.${DETAILS_CLASS_NAME}__director`).textContent = result.Director;
                document.querySelector('.event-full .node-content .container .content')?.prepend(detailsEl);
            })
            .catch(error => console.log('error', error));
    }

    async function getOmdbApiKey() {
        const key = GM_getValue('key', null);
        if (key) {
            return fetch('https://www.omdbapi.com/?apikey=' + key).then(r => r.ok && key);
        }
    }

    function showApiKeyPrompt() {
        const KEY_POPUP_CLASS_NAME = 'cinematheqular-popup';
        GM_addStyle(`
            .${KEY_POPUP_CLASS_NAME} {
                position: fixed;
                bottom: 15px;
                width: 100%;
            }
        
            .${KEY_POPUP_CLASS_NAME}__wrapper {
                display: block;
                margin: 0 auto;
                background-color: white;
                width: fit-content;
                min-width: 250px;
                padding: 10px;
                border-radius: 30px;
                box-shadow: 0px 2px 8px rgba(0,0,0,0.15);
            }

            .${KEY_POPUP_CLASS_NAME}__form {
                display: flex;
                align-items: center;
                background: #F3F3F3;
                border-radius: 20px;
                height: 30px;
                padding: 0px 5px 0px 0px;
            }

            .${KEY_POPUP_CLASS_NAME}__input {
                flex-grow: 1;
                height: 100%;
                background: transparent;
                padding: 0px 3px 0px 20px;
                border-radius: 20px 0px 0px 20px;
                &:focus {
                    outline: none !important;
                }
                .${KEY_POPUP_CLASS_NAME}__form:has(&:focus) {
                    outline: solid 1px;
                }
            }

            .${KEY_POPUP_CLASS_NAME}__save {
                cursor: pointer;
                background: #34B47D;
                color: #ffffff;
                border-radius: 50%;
                height: 20px;
                width: 20px;
                display: grid;
                place-content: center;
            }

        `);
        const popupEl = document.createElement('div');
        popupEl.className = KEY_POPUP_CLASS_NAME;
        popupEl.innerHTML = `
            <div class="${KEY_POPUP_CLASS_NAME}__wrapper">
                <form class="${KEY_POPUP_CLASS_NAME}__form">
                    <input type="text" name="key" placeholder="Enter your OMDB API Key" class="${KEY_POPUP_CLASS_NAME}__input">
                    <button class="${KEY_POPUP_CLASS_NAME}__save">+</button>
                </form>
            </div>
        `;
        document.body.append(popupEl);
        popupEl.querySelector(`.${KEY_POPUP_CLASS_NAME}__form`).addEventListener('submit', e => {
            e.preventDefault();
            const key = e.currentTarget.querySelector('[name=key]').value.trim();
            GM_setValue('key', key);
            location.reload();
        });
    }

    function isAgendaPage() {
        return /\/cinematheque\/(?:film-programme|programm|agenda)$/.test(location.href);
    }

    function isDetailPage() {
        return true &&
            // Matches the URL pattern for an event page
            /^https:\/\/www\.vdl\.lu\/.*?\/(?:kalender|agenda|whats-on)\//.test(location.href) &&
            // Event location is Cinematheque
            document.querySelector('.infos-inner .place strong')?.textContent.trim().startsWith('Cinémathèque');
    }

    function isMainPage() {
        return /\/cinematheque$/.test(location.href);
    }

    async function auth(callback) {
        const key = await getOmdbApiKey();
        if (key) {
            if (typeof callback == 'function') callback(key);
        } else {
            showApiKeyPrompt();
        }
    }

    function route() {
        if (isAgendaPage()) {
            console.log('agenda');
            auth(agendaPage);
        } else if (isDetailPage()) {
            console.log('detail');
            auth(detailPage);
        } else if (isMainPage()) {
            console.log('main');
            auth();
        }
    }

    route();

    // FOR DEBUGGING ONLY
    
    function GM_clearValues() {
        for (const value of GM_listValues()) {
            GM_deleteValue(value);
            location.reload();
        }
    }

    unsafeWindow.GM_clearValues ??= GM_clearValues;

})();