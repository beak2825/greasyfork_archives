// ==UserScript==
// @name         Deezer Mini Player
// @namespace    lilybergonzat
// @license      MIT
// @version      2025-08-25
// @description  Adds CSS and JavaScript to the Deezer website so that it looks decent on small resolutions
// @author       Lily Bergonzat <lilybergonzat@gmail.com>
// @match        https://www.deezer.com/*
// @icon         https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.deezer.com&size=64
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522497/Deezer%20Mini%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/522497/Deezer%20Mini%20Player.meta.js
// ==/UserScript==

const scriptTag = document.createElement('script');

scriptTag.setAttribute('type', 'text/javascript');
scriptTag.setAttribute('data-origin', 'Deezer Mini Player');

scriptTag.innerHTML = `
    const styleTag = document.createElement('style');

    styleTag.setAttribute('data-origin', 'Deezer Mini Player');

    styleTag.innerHTML = \`
        @media (max-width: 768px) {
            /* Global */

            /* Make the main container resizable so it can become real small */
            #page_content.page-main, #dzr-app > .naboo > .page-main, #dzr-app > .naboo > .page-topbar {
                min-width: 0;
            }

            /* Homepage */

            /* Flow channels: rows instead of columns */
            .page-main > .channel > .channel-section > .container:nth-of-type(2) > div {
                flex-direction: column;
                justify-content: center;
                gap: 15px;
            }

            /* Flow channels: reset item behaviours */
            .page-main > .channel > .channel-section > .container:nth-of-type(2) > div > div {
                flex: initial;
                width: 100%;
                max-width: 100%;
            }

            /* Flow channels: remove left margin for items */
            .page-main > .channel > .channel-section > .container:nth-of-type(2) > div > div + div {
                margin-inline-start: 0;
            }

            /* Flow channels: icon and text side to side for items */
            .page-main > .channel > .channel-section > .container:nth-of-type(2) > div > div > div {
                display: flex;
                gap: 15px;
            }

            /* Flow channels: icon and text side to side for items */
            .page-main > .channel > .channel-section > .container:nth-of-type(2) > div > div > div[data-testid="flow-config-default"] h2 {
                font-size: .75rem;
            }

            /* Flow channels: restore item icon size */
            .page-main > .channel > .channel-section > .container:nth-of-type(2) > div > div > div > div:first-child {
                width: 30px;
                height: 30px;
                padding-bottom: 0;
            }

            /* Flow channels: vertically center item text */
            .page-main > .channel > .channel-section > .container:nth-of-type(2) > div > div > div > div:last-child {
                align-self: center;
                margin-top: 0;
            }

            /* Track listing */

            /* Remove checkbox column heading */
            #page_content.page-main > div > div:nth-of-type(2) > div.Ledev > div:nth-of-type(1) > div:last-of-type {
                display: none;
            }

            /* Remove buttons next to track name */
            #page_content.page-main > div > div:nth-of-type(2) > div.Ledev > div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:last-of-type {
                display: none;
            }

            /* Remove checkbox column */
            #page_content.page-main > div > div:nth-of-type(2) > div.Ledev > div:nth-of-type(2) > div > div > div:last-of-type {
                display: none;
            }

            /* Song playing */

            /* The player is higher, so gotta push the content further */
           	#page_player > .player-lyrics-full {
                bottom: 227px;
            }

            #dzr-app > .naboo {
                min-width: 0;
                padding-bottom: 230px;
            }

            #page_naboo_playlist > .catalog-content > .container > div:first-child[data-testid="masthead"] > div:first-child {
                width: 125px;
                height: 125px;
            }

            #page_naboo_playlist > .catalog-content > .container > div:first-child[data-testid="masthead"] > div:nth-child(2) > h2 {
                font-size: 25px;
                margin-bottom: .75rem;
                line-height: 2rem;
            }

            #page_naboo_playlist > .catalog-content > .container > div:first-child[data-testid="masthead"] > div:nth-child(2) > ul:first-of-type {
                flex-direction: column;
            }

            #page_naboo_playlist > .catalog-content > .container > div:first-child[data-testid="masthead"] > div:nth-child(2) > ul:first-of-type > li:not(:first-child)::before {
                display: none;
            }

            #page_naboo_playlist > .catalog-content > .container > div:first-child[data-testid="masthead"] > div:nth-child(2) > ul:last-of-type {
                display: none;
            }

            #page_naboo_playlist > .catalog-content > .container > div:nth-child(2) {
                gap: 15px;
                flex-direction: column;
            }

            #page_naboo_playlist > .catalog-content > .container > div.Ledev > div:nth-child(1) > div[role="columnheader"]:nth-child(7) {
                display: none;
            }

            #page_naboo_playlist > .catalog-content > .container > div.Ledev > div:nth-child(2) > div:nth-child(2) > div > div > div > div[role="gridcell"]:nth-child(1) > div:nth-child(4) {
                display: none;
            }

            #page_naboo_playlist > .catalog-content > .container > div.Ledev > div:nth-child(2) > div:nth-child(2) > div > div > div > div[role="gridcell"]:nth-child(7) {
                display: none;
            }

            div[itemprop="lyrics"] > div[itemprop="text"] > span:first-child {
                display: none;
            }

            div[itemprop="lyrics"] + div[role="complementary"] {
            	margin-top: 30px;
            }

            #page_player > div[class^="css"] {
                flex-direction: column;
                min-width: 0;
                height: auto;
                gap: 30px;
                padding-top: 15px;
                padding-bottom: 15px;
            }

            #page_player > div[class^="css"] > div[class^="css"] {
                width: 100%;
                justify-content: center;
            }
        }
    \`;

    document.head.appendChild(styleTag);

    const pullLyricsUpStyleTag = document.createElement('style');

    pullLyricsUpStyleTag.innerHTML = \`
        @media (max-width: 768px) {
            #page_player > .player-lyrics-full > div:first-child > div:nth-child(2) > div:first-child > div:nth-child(2) > div:first-child {
           	    mask-image: none;
            }

            .player-lyrics-full > div:first-child > div:nth-child(2) > div:first-child > div:nth-child(2) > div:first-child > div:first-child > div:first-child {
           	    padding-top: 30px;
                padding-bottom: 30px;
            }

            .player-lyrics-full > div:first-child > div:nth-child(2) > div:first-child > div:nth-child(2) > div:first-child > div:first-child > div:first-child > div:first-child {
                gap: 0;
            }

            .player-lyrics-full .chakra-text:first-child {
                display: none;
            }

            .player-lyrics-full .chakra-text {
                font-size: 14px;
                font-weight: 500;
                padding: 0;
                line-height: 20px;
                cursor: text;
                pointer-events: all;
            }
        }
    \`;

    const handleLyrics = async (args) => {
        const [url, options] = args;
        const lyricsRequest = Boolean(options?.body && options.body.includes('GetLyrics'));
        const headers = options?.headers ?? {};

        if (!lyricsRequest || headers['Request-Author'] === 'GM') {
            return;
        }

        if (!options.headers) {
            options.headers = {};
        }

        options.headers['Request-Author'] = 'GM';

		const response = await fetch(url, options);
    	const data = await response.json();
        const lyricsData = data?.data?.track?.lyrics;

        if (!lyricsData) {
            return;
        }

        const hasLyrics = Boolean(lyricsData.text && lyricsData.text.length > 0);
        const lyricsSynced = Boolean(lyricsData.synchronizedLines) || Boolean(lyricsData.synchronizedWordByWordLines);

        if (hasLyrics && !lyricsSynced) {
            document.head.appendChild(pullLyricsUpStyleTag);
        } else {
            try {
                document.head.removeChild(pullLyricsUpStyleTag);
            } catch {}
        }
    };

    window.fetch = new Proxy(window.fetch, {
        apply(actualFetch, that, args) {
            handleLyrics(args);
            return Reflect.apply(actualFetch, that, args);
        }
    });
`;

document.head.appendChild(scriptTag);
