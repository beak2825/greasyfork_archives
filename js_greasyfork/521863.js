// ==UserScript==
// @name         uflix.to | PREV and NEXT episode buttons
// @namespace    http://tampermonkey.net/
// @version      2024-12-30
// @description  Adds previous/next buttons below the player to episodic content on uflix.
// @match        https://*.uflix.to/movie/*
// @match        https://*.uflix.to/episode/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uflix.to
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521863/uflixto%20%7C%20PREV%20and%20NEXT%20episode%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/521863/uflixto%20%7C%20PREV%20and%20NEXT%20episode%20buttons.meta.js
// ==/UserScript==

const url_parts=window.location.href.split('/');
const serie_url=`${url_parts[0]}//${url_parts[2]}/serie/${url_parts[4]}`;
const base_url=url_parts.slice(0,url_parts.length-1).join('/');
const season_episode=url_parts[url_parts.length-1].split('?')[0];
const season=parseInt(season_episode.split('E')[0].substr(1));
const episode=parseInt(season_episode.split('E')[1]);
const isMovie=url_parts[3].toLowerCase()==='movie';

let num_seasons=1;
let num_episodes={};
let prev=null;
let next=null;

function createButton(text,link,bPrev=false) {
    const button = document.createElement('a');
    button.classList='btn btn-stream btn-ghost btn-sm me-1';
    if (bPrev) button.classList.add('row');
    button.href=link;
    button.role='button';
    button.textContent=text;
    return button;
}

function createRow() {
    const row = document.createElement('div');
    row.classList='row';
    const col = document.createElement('div');
    col.classList='row-cols-2';
    if (prev !== null) col.appendChild(createButton('<< PREV',prev,true));
    if (next !== null) col.appendChild(createButton('NEXT >>',next));
    row.appendChild(col);
    return row;
}

function fetchInfo() {
    return new Promise((resolve, reject) => {
        // grab the season count
        fetch(serie_url)
        .then(response => {
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // grab season count, substract 1 if season 0 exists
            num_seasons=doc.querySelector('#seasonAccordion').children.length;
            if (doc.querySelector('#season0') !== null) num_seasons--;

            // grab episode counts, skip season 0
            for (let i = 1; i <= num_seasons; i++) {
                num_episodes[i]=doc.querySelector(`#season${i}>.episodes`).children.length;
            }

            if (episode > 1) {
                prev=`${base_url}/S${season}E${(episode-1)}`;
            } else if (season > 1) {
                prev=`${base_url}/S${(season-1)}E${num_episodes[(season-1)]}`;
            }

            if (episode < num_episodes[season]) {
                next=`${base_url}/S${season}E${(episode+1)}`;
            } else if (season < num_seasons) {
                next=`${base_url}/S${(season+1)}E1`;
            }

            return resolve();
        });
    });
}

function bypassFirstClick() {
    const iframe = document.querySelector('iframe');
    if (iframe) {
        const playBtn = iframe.contentWindow.document.querySelector('.play-btn');
        if (playBtn) {
            playBtn.click();
            return;
        }
    }

    setTimeout(bypassFirstClick,1000);
}

(function(){
    if (!isMovie) {
        fetchInfo().then(() => {
            document.querySelector('.card-stream').parentNode.appendChild(createRow());
        });
    }

    bypassFirstClick();
})();
