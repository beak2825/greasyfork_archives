// ==UserScript==
// @name         Shiki Achievs Helper
// @namespace    http://shikimori.org/
// @version      1.0
// @description  Shows achievements that you can obtain by specific anime
// @author       Legatt
// @match        http://shikimori.org/*
// @match        https://shikimori.org/*
// @match        http://shikimori.one/*
// @match        https://shikimori.one/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500551/Shiki%20Achievs%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/500551/Shiki%20Achievs%20Helper.meta.js
// ==/UserScript==

const get_anime_api = 'https://shikimori.one/api/animes/';
const get_genre_image_api = '/assets/achievements/anime/';

const genres = {
    'comedy': [4],
    'romance': [22, 151, 107],
    'fantasy': [10],
    'historical': [13],
    'dementia_psychological': [5, 40],
    'mecha': [18],
    'slice_of_life': [36],
    'scifi': [24],
    'supernatural': [37],
    'drama': [8],
    'horror_thriller': [14, 41],
    'josei': [43],
    'kids': [15],
    'military': [38],
    'detektiv': [39],
    'space': [29],
    'sports': [30],
    'music': [19, 145, 150],
};

function get_current_anime_id() {
    let url = window.location.href.split('/');
    return url[url.length - 1].split('-')[0];
}

function create_block(block)
{
    let target_block = document.getElementsByClassName('c-image')[0];
    target_block.appendChild(block);
}

async function create_genre_image_block(genre_named)
{
    let image_url = get_genre_image_api + genre_named.name + '_1';
    let jpg_test = await fetch(image_url+'.jpg');
    let png_test = await fetch(image_url+'.png');
    let gif_test = await fetch(image_url+'.gif');
    if (jpg_test.ok) image_url += '.jpg';
    else if (png_test.ok) image_url += '.png';
    else if (gif_test.ok) image_url += '.gif';

    let image_block = document.createElement('div');
    image_block.setAttribute('class', 'b-achievement is-badge');
    image_block.setAttribute('data-hint', genre_named.russian);
    image_block.innerHTML = '<div class="c-image"><div class="inner"><a href="https://shikimori.one/achievements/genre/'+genre_named.name+'"><div class="border" style="border-color: #FAE7B5"></div><img loading="lazy" src="'+image_url+'"></a></div></div>';

    create_block(image_block);
}

async function get_current_genres() {
    let response = await fetch(get_anime_api+get_current_anime_id());
    let data = await response.json();
    return data.genres;
}

async function async_start()
{
    let current_genres = await get_current_genres();
    let current_genres_named = []
    current_genres.forEach(current_genre => {
        for (const [name, ids] of Object.entries(genres)) {
            ids.forEach(el => {if (el == current_genre.id) current_genres_named.push({id: el, name: name, russian: current_genre.russian});});
        }
    });


    let title_block = document.createElement('div');
    title_block.setAttribute('id', 'achiv_helper');
    title_block.setAttribute('class', 'subheadline');
    title_block.innerHTML = 'В достижениях';
    create_block(title_block);

    current_genres_named.forEach(async el => {await create_genre_image_block(el);});

}

function start() {
    'use strict';

    if (!window.location.href.includes('animes/'))
    {
        return;
    }
    if (document.getElementsByClassName('c-image').length < 1)
    {
        return;
    }
    if (document.getElementById('achiv_helper') !== null)
    {
        return;
    }

    async_start();
}



function ready(fn) {
    document.addEventListener('page:load', fn);
    document.addEventListener('turbolinks:load', fn);

    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(start);

//main
//(function() {
//    'use strict';
//
//
//})();