// ==UserScript==
// @name         IMDB Movies
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Stream movies directly on IMDB
// @author       ElRobaMichis
// @match        https://www.imdb.com/title/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515473/IMDB%20Movies.user.js
// @updateURL https://update.greasyfork.org/scripts/515473/IMDB%20Movies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sources = {
        VidSrc: {
            movie: id => `https://vidsrc.to/embed/movie/${id}`,
            tv: id => `https://vidsrc.to/embed/tv/${id}`
        },
        '2Embed': {
            movie: id => `https://2embed.cc/embed/${id}`,
            tv: id => `https://2embed.cc/embedtvfull/${id}`
        },
        AutoEmbed: {
            movie: id => `https://player.autoembed.cc/embed/movie/${id}`,
            tv: id => `https://player.autoembed.cc/embed/movie/${id}`
        },
        SmashyStream: {
            movie: id => `https://embed.smashystream.com/playere.php?imdb=${id}`,
            tv: id => `https://embed.smashystream.com/playere.php?imdb=${id}`
        },
        EmbedSU: {
            movie: id => `https://embed.su/embed/movie/${id}`,
            tv: (id, season, episode) => `https://embed.su/embed/tv/${id}/${season}/${episode}`
        },
        MultiEmbed: {
            movie: id => `https://multiembed.mov/directstream.php?video_id=${id}`,
            tv: (id, season, episode) => `https://multiembed.mov/directstream.php?video_id=${id}&s=${season}&e=${episode}`
        },
        VidLink: {
            movie: id => `https://vidlink.pro/movie/${id}`
        }
    };

    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .mirror-controls { margin: 20px 0; padding: 10px; text-align: center; }
            .mirror-label { display: block; margin-bottom: 10px; font-weight: bold; }
            .mirror-select {
                padding: 8px 15px;
                font-size: 14px;
                border: 2px solid #f3ce13;
                border-radius: 4px;
                background-color: white;
                cursor: pointer;
                min-width: 200px;
            }
            .mirror-select:hover { border-color: #ddb911; }
            .mirror-select:focus { outline: none; border-color: #c4a410; }
        </style>
    `);

    const createIframe = url => {
        const iframe = document.createElement('iframe');
        Object.assign(iframe, {
            src: url,
            width: '100%',
            height: '600',
            frameBorder: '0',
            allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
            allowFullscreen: true
        });
        return iframe;
    };

    const init = () => {
        const imdbId = location.href.match(/title\/(tt\d+)\//)?.[1];
        if (!imdbId) return;

        const isMovie = document.querySelector('meta[property="og:type"]')?.content === 'video.movie';

        let season = null;
        let episode = null;

        if (!isMovie) {
            const seasonEpisodeElement = document.querySelector('[data-testid="hero-subnav-bar-season-episode-numbers-section"]');
            if (seasonEpisodeElement) {
                const match = seasonEpisodeElement.textContent.match(/T(\d+)\.E(\d+)/);
                if (match) {
                    season = match[1];
                    episode = match[2];
                }
            }
        }

        const container = document.createElement('div');

        const select = document.createElement('select');
        select.className = 'mirror-select';
        select.innerHTML = Object.keys(sources)
            .map(name => `<option value="${name}">${name}</option>`)
            .join('');

        container.innerHTML = `
            <div class="mirror-controls">
                <label class="mirror-label">Servidor de video:</label>
            </div>
        `;
        container.querySelector('.mirror-controls').appendChild(select);

        select.onchange = ({target}) => {
            const source = sources[target.value];
            const url = isMovie ?
                source.movie(imdbId) :
                (target.value === 'MovieTV' && season && episode) ?
                    source.tv(imdbId, season, episode) :
                    source.tv?.(imdbId);
            container.querySelector('iframe').src = url;
        };

        container.appendChild(createIframe(isMovie ? sources.VidSrc.movie(imdbId) : sources.VidSrc.tv(imdbId)));

        const targetNode = document.evaluate(
            '//*[@id="__next"]/main/div/section[1]/section/div[3]/section/section/div[2]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        targetNode?.insertAdjacentElement('afterend', container);
    };

    document.readyState === 'loading' ?
        document.addEventListener('DOMContentLoaded', init) :
        init();
})();