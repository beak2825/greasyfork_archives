// ==UserScript==
// @name         IMDb to allstream.cc
// @description  Adds vertically stacked styled search buttons on IMDb using the IMDb ID
// @namespace    yournamespace
// @author       you
// @match        https://www.imdb.com/title/tt*
// @version      1.2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537784/IMDb%20to%20allstreamcc.user.js
// @updateURL https://update.greasyfork.org/scripts/537784/IMDb%20to%20allstreamcc.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getImdbId() {
        const pathParts = window.location.pathname.split('/');
        return pathParts.find(part => part.startsWith('tt')) || null;
    }

    function createContainer() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 10%;
            left: 1%;
            z-index: 9999;
            background: #121212;
            padding: 12px;
            border: 1px solid #ff0000;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            font-family: sans-serif;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        return container;
    }

    function createButton(label, url) {
        const button = document.createElement('a');
        button.href = url;
        button.target = '_blank';
        button.innerText = label;
        button.style.cssText = `
            display: block;
            padding: 10px 16px;
            background: #000000;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-size: 0.85em;
            font-weight: 600;
            text-align: center;
            transition: background 0.25s, transform 0.2s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        button.onmouseover = () => {
            button.style.background = '#ff0000';
            button.style.transform = 'translateY(-1px)';
        };
        button.onmouseout = () => {
            button.style.background = '#000000';
            button.style.transform = 'translateY(0)';
        };
        return button;
    }

    const imdbId = getImdbId();
    if (imdbId) {
        const container = createContainer();

        const moviesButton = createButton('🎬 allstream.cc Movies', `https://allstream.cc/movies/${imdbId}`);
        const showsButton = createButton('📺 allstream.cc Shows', `https://allstream.cc/shows/${imdbId}`);

        container.appendChild(moviesButton);
        container.appendChild(showsButton);
        document.body.appendChild(container);
    }
})();
