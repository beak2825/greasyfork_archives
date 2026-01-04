// ==UserScript==
// @name        VoirAnime 2Watch Highlighter
// @namespace   Scripts Dark mode and hide anime unwanted
// @match       https://*.voiranime.com/*
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @version     2024.12.16#1
// @author      -
// @license     MIT
// @description Dark mode and hide anime unwanted
// @icon        https://icon.horse/icon/voiranime.com
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/507525/VoirAnime%202Watch%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/507525/VoirAnime%202Watch%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const darkModeCSS = `html,body,body *{background-color:#181818!important;color:#f5f5f5!important;border-color:#555!important}a{color:#7289da!important}.post-title a{color:#eee!important}.score.font-meta.total_votes{color:#fff!important}.watched-highlight{background-color:rgba(0,0,255,0.4)!important}`;
    GM_addStyle(darkModeCSS);
    
    let hiddenAnime = GM_getValue('hiddenAnime', []);
    let watchedEpisodes = GM_getValue('watchedEpisodes', []);

    const hideAnime = animeCard => {
        animeCard.style.display = 'none';
        let title = animeCard.querySelector('.post-title a').textContent;
        if (!hiddenAnime.includes(title)) {
            hiddenAnime.push(title);
            GM_setValue('hiddenAnime', hiddenAnime);
        }
    };

    const createHideButton = animeCard => {
        if (animeCard.querySelector('.hide-anime-button')) return;
        let button = document.createElement('button');
        button.textContent = '✕';
        button.className = 'hide-anime-button';
        button.style.cssText = `position:absolute;top:40px;right:10px;cursor:pointer;font-size:20px;background-color:rgba(255,0,0,0.7);color:white;border:none;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;z-index:1000;`;
        button.addEventListener('click', e => {
            e.stopPropagation();
            hideAnime(animeCard);
        });
        animeCard.style.position = 'relative';
        animeCard.appendChild(button);
    };

    const getLastEpisodeLink = card => {
        const chapters = card.querySelectorAll('.chapter-item');
        return chapters.length > 0 ? chapters[0].querySelector('a').href : null;
    };

    const isWatched = link => watchedEpisodes.some(ep => link.includes(ep));

    const processAnimeCards = () => {
        document.querySelectorAll('.col-12.col-md-6.badge-pos-1').forEach(container => {
            let animeCard = container.querySelector('.page-item-detail.video');
            if (!animeCard) return;

            let title = animeCard.querySelector('.post-title a');
            let thumbnail = animeCard.querySelector('.item-thumb a');
            let lastEpisodeLink = getLastEpisodeLink(animeCard);

            if (hiddenAnime.includes(title.textContent)) {
                hideAnime(animeCard);
            } else {
                createHideButton(animeCard);
                if (lastEpisodeLink) {
                    title.href = lastEpisodeLink;
                    thumbnail.href = lastEpisodeLink;
                    if (isWatched(lastEpisodeLink)) {
                        title.classList.add('watched-highlight');
                        thumbnail.classList.add('watched-highlight');
                    }
                }
            }
        });
    };

    const markAsWatched = link => {
        let episodeId = link.split('/').slice(-2).join('/');
        if (!watchedEpisodes.includes(episodeId)) {
            watchedEpisodes.push(episodeId);
            GM_setValue('watchedEpisodes', watchedEpisodes);
        }
    };

    const addClickListeners = () => {
        document.querySelectorAll('.post-title a, .item-thumb a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                markAsWatched(this.href);
                window.location.href = this.href;
            });
        });
    };

    const init = () => {
        if (/https:\/\/v\d+\.voiranime\.com/.test(window.location.href)) {
            processAnimeCards();
            addClickListeners();
        } else if (window.location.href.includes('/anime/') && window.location.href.includes('-vostfr/')) {
            markAsWatched(window.location.href);
        }
    };

    document.addEventListener('DOMContentLoaded', init);
    setInterval(init, 2000);

    const isHomePage = /https:\/\/v\d+\.voiranime\.com\/?$/.test(window.location.href);
    if (isHomePage) {
        window.location.href = window.location.href + (window.location.href.endsWith('/') ? '' : '/') + '?filter=subbed';
    }
})();