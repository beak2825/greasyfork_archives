// ==UserScript==
// @name         Metacritic: IGGGAMES Search
// @description  Adds an igg-games.com search link to Metacritic game pages
// @version      0.6
// @author       mica
// @namespace    greasyfork.org/users/12559
// @match        https://www.metacritic.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/430485/Metacritic%3A%20IGGGAMES%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/430485/Metacritic%3A%20IGGGAMES%20Search.meta.js
// ==/UserScript==

function makeLink() {
    const title = document.querySelector('.c-productHero_title').innerText.replace(':', '');
    const div = document.createElement('div');
        div.style.marginTop = '15px';
    const a = document.createElement('a');
        a.href = 'https://igg-games.com/?s=' + encodeURIComponent(title);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '20px');
        svg.setAttribute('height', '20px');
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        image.setAttribute('width', '20px');
        image.setAttribute('height', '20px');
        image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'data:image/png;base64,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');
    const span = document.createElement('span');
        span.style.position = 'relative';
        span.style.top = '-4px';
        span.style.left = '6px';
        span.style.fontSize = '115%';
        span.innerText = 'Search IGGGAMES';
    svg.append(image);
    a.append(svg, span);
    div.append(a);
    document.querySelector('.c-productHero_score-container > .g-text-xsmall').append(div);
}

let url;
setInterval(() => {
    if (url != location.href) {
        url = location.href;
        if (location.pathname.match('\/game\/.') && document.querySelector('.c-gamePlatformLogo_icon.c-gamePlatformLogo_icon--PCLogo')) {
            setTimeout(() => {
                makeLink();
            }, 900);
        }
    }
}, 300);
