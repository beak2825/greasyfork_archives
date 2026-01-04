// ==UserScript==
// @name        MyAnimeList - Animeleri TürkAnime, TRAnimeİzle ve AnimeciX'te Arama
// @name:en     MyAnimeList - Search Title on TurkAnime, TRAnimeİzle and AnimeciX
// @namespace   https://greasyfork.org/en/users/1500762-kerimdemirkaynak
// @version     4.3
// @description MyAnimeList anime sayfalarına, ilgili seriyi TürkAnime, TRAnimeİzle ve AnimeciX sitelerinde kolayca aratmak için butonlar ekler.
// @description:en Adds buttons to MyAnimeList anime pages to easily search the corresponding series on TurkAnime, TRAnimeİzle, and AnimeCix websites.
// @match       https://myanimelist.net/anime/*
// @match       *://www.turkanime.co/?q=*
// @include     *://*turkanime.co/?q=*
// @grant       GM_addStyle
// @run-at      document-end
// @license        MIT License
// @author         Kerim Demirkaynak
// @icon           https://cdn.myanimelist.net/images/favicon.ico
// @description Adds a button to MyAnimeList anime pages to copy the title with one click.
// @description:tr MyAnimeList anime sayfasına, başlığı tek tıkla kopyalamak için buton ekler.
// @downloadURL https://update.greasyfork.org/scripts/544365/MyAnimeList%20-%20Animeleri%20T%C3%BCrkAnime%2C%20TRAnime%C4%B0zle%20ve%20AnimeciX%27te%20Arama.user.js
// @updateURL https://update.greasyfork.org/scripts/544365/MyAnimeList%20-%20Animeleri%20T%C3%BCrkAnime%2C%20TRAnime%C4%B0zle%20ve%20AnimeciX%27te%20Arama.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- CONFIGURATION ---
    const detectedLanguage = navigator.language.startsWith('tr') ? 'tr' : 'en';

    const searchSites = [
        { key: 'turkanime', url: 'https://www.turkanime.co/?q=', labels: { en: 'Search TürkAnime', tr: "TürkAnime'de Ara" } },
        { key: 'tranimeizle', url: 'https://www.tranimeizle.io/arama/', labels: { en: 'Search TRAnimeİzle', tr: "TRAnimeİzle'de Ara" } },
        { key: 'animecix', url: 'https://animecix.tv/search?query=', labels: { en: 'Search AnimeciX', tr: "AnimeciX'te Ara" } }
    ];
    // --- END CONFIGURATION ---

    function handleTurkAnimePostSearch() {
        if (window.location.href.includes('turkanime.co/?q=')) {
            window.stop();
            const urlParams = new URLSearchParams(window.location.search);
            const keyword = urlParams.get('q');
            if (keyword && keyword.trim()) {
                const form = document.createElement('form');
                form.method = 'post';
                form.action = '/arama';
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = 'arama';
                hiddenField.value = keyword;
                form.appendChild(hiddenField);
                document.documentElement.appendChild(form);
                form.submit();
            }
        }
    }

    function addModernStyles() {
        GM_addStyle(`
            #custom-search-container {
                display: flex;
                justify-content: flex-start;
                gap: 10px;
                margin: 15px 0;
                padding-left: 5px;
            }
            .custom-search-btn {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 13px;
                font-weight: bold;
                color: #ffffff; /* Pure white for max contrast */
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* Shadow for text pop */
                background-color: #2e51a2;
                border: 1px solid #1d3b84;
                padding: 6px 14px;
                border-radius: 5px;
                text-decoration: none;
                transition: all 0.2s ease;
                cursor: pointer;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                text-align: center;
                flex-shrink: 0; /* Prevent shrinking on desktop */
            }
            .custom-search-btn:hover {
                background-color: #3e6de0;
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            }

            /* --- MOBILE ADAPTIVE STYLES --- */
            @media (max-width: 768px) {
                #custom-search-container {
                    /* Remove any mobile-specific vertical spacing */
                    margin-bottom: 10px;
                    padding-left: 10px;
                    padding-right: 10px;
                }
                .custom-search-btn {
                    flex-grow: 1;           /* Allow button to grow */
                    flex-basis: 0;          /* Distribute space evenly */
                    white-space: nowrap;    /* Keep text on one line */
                    font-size: 11px;        /* Reduce font size to fit */
                    padding: 7px 5px;       /* Adjust padding for smaller size */
                }
            }
        `);
    }

    function createSearchButton(text, url, title) {
        const btn = document.createElement('a');
        btn.innerText = text;
        btn.href = url + encodeURIComponent(title);
        btn.target = '_blank';
        btn.className = 'custom-search-btn';
        return btn;
    }

    function insertSearchButtons() {
        if (document.getElementById('custom-search-container')) return;
        const titleElement = document.querySelector('h1.title-name');
        if (!titleElement) return;
        const titleWrapper = titleElement.parentElement;
        if (!titleWrapper) return;

        const animeTitle = titleElement.innerText.trim();
        const container = document.createElement('div');
        container.id = 'custom-search-container';

        searchSites.forEach(site => {
            const buttonLabel = site.labels[detectedLanguage] || site.labels.en;
            const button = createSearchButton(buttonLabel, site.url, animeTitle);
            container.appendChild(button);
        });

        titleWrapper.insertAdjacentElement('afterend', container);
    }

    // --- SCRIPT EXECUTION ---
    handleTurkAnimePostSearch();

    if (window.location.hostname === 'myanimelist.net') {
        addModernStyles();
        const observer = new MutationObserver(() => {
            if (document.querySelector('h1.title-name') && !document.getElementById('custom-search-container')) {
                insertSearchButtons();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        insertSearchButtons();
    }
})();