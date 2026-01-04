// ==UserScript==
// @name         Better R34Hentai
// @description  Add custom filters, tag markers to animated posts, and fix spaces in URLs
// @version      1.0.1
// @match        *://rule34hentai.net/*
// @match        *://www.rule34hentai.net/*
// @author       Alighieri
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34.xxx
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/1399147
// @downloadURL https://update.greasyfork.org/scripts/518086/Better%20R34Hentai.user.js
// @updateURL https://update.greasyfork.org/scripts/518086/Better%20R34Hentai.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fix bad URL
    var currentURL = window.location.href;
    var fixedURL = currentURL.replace(/%20|\s/g, '+');
    if (currentURL !== fixedURL) {
        window.location.href = fixedURL;
    }

    const allAnchors = document.querySelectorAll('a')
    allAnchors.forEach((anchor) => {
        anchor.href = anchor.href.replace(/%20|\s/g, '+');
    })
    // ==================================================

    // Custom filters
    let userSort = localStorage.getItem('userSort');

    let userRating = localStorage.getItem('userRating');

    let userPrefs = localStorage.getItem('userPrefs');
    userPrefs = JSON.parse(userPrefs);

    const form = document.querySelector('#Navigationleft > div > form');

    const customHtml = `<style>
            @import url('https://fonts.googleapis.com/css?family=Poppins:300,400,500,700');

            :root {
                --light-color: #232B32;
                --dark-color: #152028;
                --border-color: #444;

                --space-xxxs: calc(0.375 * 1rem);
                --body-line-height: 1.4;

                --checkbox-radio-size: 18px;
                --checkbox-radio-gap: calc(0.375 * 1rem);
                --checkbox-radio-border-width: 2px;
                --checkbox-radio-line-height: 1.4;

                --radio-marker-size: 8px;

                --checkbox-marker-size: 12px;
                --checkbox-radius: 4px;

                --color-bg: hsl(0, 0%, 100%);
                --color-contrast-low: hsl(240, 4%, 65%);
                --color-contrast-lower: hsl(240, 4%, 85%);
                --color-primary: #ecb307;

                --radius: 0.375em;
                --radius-md: var(--radius, 0.375em);
            }

            .radio,
            .checkbox {
                position: absolute;
                margin: 0 !important;
                padding: 0 !important;
                opacity: 0;
                height: 0;
                width: 0;
                pointer-events: none;
            }

            .radio+label,
            .checkbox+label {
                display: inline-flex;
                align-items: flex-start;
                line-height: var(--checkbox-radio-line-height);
                user-select: none;
                cursor: pointer;
            }

            .radio+label::before,
            .checkbox+label::before {
                content: '';
                display: inline-block;
                position: relative;
                top: calc((1em * var(--checkbox-radio-line-height) - var(--checkbox-radio-size)) / 2);
                flex-shrink: 0;
                width: var(--checkbox-radio-size);
                height: var(--checkbox-radio-size);
                background-color: var(--color-bg);
                border-width: var(--checkbox-radio-border-width);
                border-color: var(--color-contrast-low);
                border-style: solid;
                background-repeat: no-repeat;
                background-position: center;
                margin-right: var(--checkbox-radio-gap);
                transition: transform .2s, border .2s;
            }

            .radio:not(:checked):not(:focus)+label:hover::before,
            .checkbox:not(:checked):not(:focus)+label:hover::before {
                border-color: lightness(var(--color-contrast-low), 0.7);
            }

            .radio+label::before {
                border-radius: 50%;
            }

            .checkbox+label::before {
                border-radius: var(--checkbox-radius);
            }

            .radio:checked+label::before,
            .checkbox:checked+label::before {
                background-color: var(--color-primary);
                box-shadow: none;
                border-color: var(--color-primary);
                transition: transform .2s;
            }

            .radio:active+label::before,
            .checkbox:active+label::before {
                transform: scale(0.8);
                transition: transform .2s;
            }

            .radio:checked:active+label::before,
            .checkbox:checked:active+label::before {
                transform: none;
                transition: none;
            }

            .radio:checked+label::before {
                background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cg class='nc-icon-wrapper' fill='%23ffffff'%3E%3Ccircle cx='8' cy='8' r='8' fill='%23ffffff'%3E%3C/circle%3E%3C/g%3E%3C/svg%3E");
                background-size: var(--radio-marker-size);
            }

            .checkbox:checked+label::before {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpolyline points='1 6.5 4 9.5 11 2.5' fill='none' stroke='%23FFFFFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/%3E%3C/svg%3E");
                background-size: var(--checkbox-marker-size);
            }

            .radio:checked:active+label::before,
            .checkbox:checked:active+label::before,
            .radio:focus+label::before,
            .checkbox:focus+label::before {
                border-color: var(--color-primary);
                box-shadow: 0 0 0 3px alpha(var(--color-primary), 0.2);
            }

            .radio--bg+label,
            .checkbox--bg+label {
                padding: var(--space-xxxxs) var(--space-xxxs);
                border-radius: var(--radius-md);
                transition: background .2s;
            }

            .radio--bg+label:hover,
            .checkbox--bg+label:hover {
                background-color: var(--color-contrast-lower);
            }

            .radio--bg:active+label,
            .checkbox--bg:active+label,
            .radio--bg:focus+label,
            .checkbox--bg:focus+label {
                background-color: alpha(var(--color-primary), 0.1);
            }

            fieldset {
                margin: 14px 0;
            }

            .f-row, .f-col {
                display: flex;
            }

            .f-row {
                flex-direction: row;
                justify-content: space-between;
            }

            .f-col {
                flex-direction: column;
            }

            [tooltip]::before {
                content: '?';
                font-weight: bold;
            }

            [tooltip] {
                position: relative;
            }

            [tooltip]:hover:after {
                content: attr(tooltip);
                position: absolute;
                transform: translate(0%, -100%);
                top: -10px;
                font-size: 16px;
                white-space: nowrap;
                min-width: 120px;
                padding: 0 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 30px;
                border-radius: 3px;
                background-color: #000;
                color: #fff;
                text-align: center;
                text-decoration: none;
                font-weight: lighter;
                z-index: 999;
            }

            body {
                color: #fff;
                background: var(--dark-color);
            }

            a,
            ul li a {
                color: #ecb307;
            }

            header {
                background: var(--light-color);
            }

            header img.wp-image-69454 {
                display: none;
            }

            section > h3 {
                background: var(--light-color);
            }

            footer,
            section > .blockbody,
            .comment,
            .setupblock {
                background: var(--light-color);
            }

            .thumb img,
            header,
            footer,
            section > h3,
            section > .blockbody,
            .comment,
            .setupblock {
                border: 1px solid var(--border-color);
            }

            #Favorited_Byleft .blockbody {
                display: none;
            }

            .shm-image-list {
                display: flex;
                flex-wrap: wrap;
                justify-content: left;
                align-items: baseline;
            }

            /* -------------------------------------------------- */


            /* Video */
            /* #6fe73c, #ecb307, #d5c623 */
            a[data-mime^="video/"] > img {
                background: linear-gradient(45deg, rgba(2,0,36,1) 0%, rgba(152,7,236,1) 100%);
            }

            /* Video with Sound */
            /* #e73cd9, #ec0707, #ec0776 */
            a[data-mime^="video/"][data-tags*="sound"] > img {
                background: linear-gradient(45deg, rgba(2,0,36,1) 0%, rgba(236,7,118,1) 100%);
            }

            /* GIF */
            /* #3ce7e4, #233bd5, #2cd523 */
            a[data-mime="image/gif"] > img {
                background: linear-gradient(45deg, rgba(2,0,36,1) 0%, rgba(60,231,228,1) 100%);
            }

            a.thumb > span {
            padding: 3px;
            color: white;
            margin: 5px;
            font-family: 'Poppins';
            font-weight: 400;
            letter-spacing: 0.5px;
            border-radius: 5px;
            }

            span.video {
            background: linear-gradient(-45deg, #fa6c9f 0%, #404cff 80%, #cc40ff 100%);
            }

            span.sound {
            background: linear-gradient(-45deg, #52A0FD 0%, #00e2fa 80%, #00e2fa 100%);
            }

            span.gif {
            background: linear-gradient(-45deg, #52A0FD 0%, #00e2fa 80%, #00e2fa 100%);
            }

            span.time {
            background: linear-gradient(-45deg, #FD5252 0%, #fa0075 80%, #fa0000 100%);
            }

            div#fluid_video_wrapper_video-id {
                min-width: 100%;
                max-width: 100%;
                min-height: 80vh;
                max-height: 80vh !important;
                aspect-ratio: 16/9;
            }

            video {
                max-height: 80vh !important;
            }

            .thumb img {
                background: var(--dark-color);
                filter: brightness(.9) contrast(1.1);
                border-radius: 5px;
                box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
                width: 188px;
                height: 188px;
                object-fit: contain;
            }

            .shm-main-image {
                width: 100%;
                max-width: 85vw;
            }
        </style>

        <fieldset id="sort">
            <legend class="form-legend">Sort by</legend>

            <ul class="f-row">
                <li>
                    <input class="radio" type="radio" name="sort" value="most-recent" id="most_recent" ${!userSort || userSort === 'most-recent' ? 'checked' : ''}>
                    <label for="most_recent">Most Recent</label>
                </li>

                <li>
                    <input class="radio" type="radio" name="sort" value="top-voted" id="top_voted" ${userSort === 'top-voted' ? 'checked' : ''}>
                    <label for="top_voted">Top Voted</label>
                </li>
            </ul>
        </fieldset>

        <fieldset id="rating">
            <legend class="form-legend" tooltip="'Rating Explicit' refers to bestiality AND 3D cartoon loli/shota. Login required">
                Rating
            </legend>

            <ul class="f-col">
                <li>
                    <input class="radio" type="radio" name="rating" id="exp-default" value="exp-default" ${!userRating || userRating === 'exp-default' ? 'checked' : ''}>
                    <label for="exp-default">Default</label>
                </li>

                <li>
                    <input class="radio" type="radio" name="rating" id="exp-hide" value="exp-hide" ${userRating === 'exp-hide' ? 'checked' : ''}>
                    <label for="exp-hide">Hide Explicit</label>
                </li>

                <li>
                    <input class="radio" type="radio" name="rating" id="exp-only" value="exp-only" ${userRating === 'exp-only' ? 'checked' : ''}>
                    <label for="exp-only">Only Explicit</label>
                </li>
            </ul>
        </fieldset>

        <fieldset id="preferences">
            <legend class="form-legend">Preferences</legend>

            <ul class="f-col">
                <li>
                    <input class="checkbox" type="checkbox" name="hide-furry" id="hide-furry" ${!userPrefs || userPrefs.hideFurry ? 'checked' : ''}>
                    <label for="hide-furry">Hide Furry/Monsters</label>
                </li>
                <li>
                    <input class="checkbox" type="checkbox" name="hide-ai" id="hide-ai" ${!userPrefs || userPrefs.hideAI ? 'checked' : ''}>
                    <label for="hide-ai">Hide AI Generated</label>
                </li>
            </ul>
        </fieldset>`;

    form.insertAdjacentHTML("beforeend", customHtml);

    const tagsInput = form.querySelector('input[name="search"]');
    const furryList = ['-Alien', '-Cat(s)', '-Dog(s)', '-Fish', '-Fox', '-Horse(s)', '-Insect(s)', '-Jaguar', '-Leopard', '-Pony', '-Sonic_The_Hedgehog', '-Werewolf', '-Wolf_(Wolves)', '-Zootopia', '-Animal_Crossing', '-Cockroach(es)', '-Pig(s)', '-Grimm', '-regenerator', '-Nemesis', '-Zombie(s)'];

    const tagAnchors = document.querySelectorAll('table:not(#header) a[href^="/post/list/"]');
    tagAnchors.forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            let splited = event.target.href.split('/');

            const sort = form.sort.value;
            if (sort) {
                if (sort === 'most-recent') {
                    splited[5] += '+order=id_desc';
                } else if (sort === 'top-voted') {
                    splited[5] += '+order=score_desc';
                }
            }

            const rating = form.rating.value;
            if (rating) {
                if (rating === 'exp-hide') {
                    splited[5] += '+-rating:e';
                } else if (rating === 'exp-only') {
                    splited[5] += '+rating:e';
                }
            }

            const hideFurry = form['hide-furry'].checked;
            if (hideFurry) {
                for (let item of furryList) {
                    splited[5] += `+${item}`;
                }
            }

            const hideAI = form['hide-ai'].checked;
            if (hideAI) {
                splited[5] += '+-AI-generated';
            }

            const finalURL = splited.join('/');
            window.location = finalURL;
        });
    });

    form.onsubmit = () => {
        const sort = form.sort.value;
        if (sort) {
            tagsInput.value = tagsInput.value.replaceAll(/(\-)?(order=id_desc|order=score_desc)/gi, '');
            if (sort === 'most-recent') {
                tagsInput.value += '+order=id_desc';
            } else if (sort === 'top-voted') {
                tagsInput.value += '+order=score_desc';
            }
        }

        const rating = form.rating.value;
        if (rating) {
            tagsInput.value = tagsInput.value.replaceAll(/(\-)?rating:e/gi, '');
            if (rating === 'exp-hide') {
                tagsInput.value += '+-rating:e';
            } else if (rating === 'exp-only') {
                tagsInput.value += '+rating:e';
            }
        }

        const hideFurry = form['hide-furry'].checked;
        if (hideFurry) {
            for (let item of furryList) {
                if (!tagsInput.value.includes(item)) {
                    tagsInput.value += `+${item}`;
                }
            }
        } else {
            for (let item of furryList) {
                if (tagsInput.value.includes(item)) {
                    tagsInput.value = tagsInput.value.replace(item, '');
                }
            }
        }

        const hideAI = form['hide-ai'].checked;
        if (hideAI) {
            tagsInput.value += '+-AI-generated';
        }
    }

    form.sort[0].onchange = (event) => {
        localStorage.setItem('userSort', event.target.value);
    };

    form.rating[0].onchange = (event) => {
        localStorage.setItem('userRating', event.target.value);
    };

    form['hide-furry'].onchange = (event) => {
        localStorage.setItem('userPrefs', JSON.stringify({ hideFurry: event.target.checked }));
    };

    form['hide-ai'].onchange = (event) => {
        localStorage.setItem('userPrefs', JSON.stringify({ hideAI: event.target.checked }));
    };
    // ==================================================

    // Better mark for animated posts
    const imgs = document.querySelectorAll('.shm-image-list .thumb img')
    const imgTimeRegex = /(?<=,\s)((\d{1,}.*s)(?=\s\/\/))/gi;

    imgs.forEach((img) => {
        if (img.title.includes('webm') || img.title.includes('mp4')) {
            img.parentElement.style.setProperty('--video', "'VIDEO'");
            let vspan = document.createElement('span');
            vspan.className = 'video';
            vspan.innerText = 'VIDEO';
            img.parentElement.appendChild(vspan);
        }

        if (img.title.includes('Sound')) {
            img.parentElement.style.setProperty('--sound', "'SOUND'");
            let vspan = document.createElement('span');
            vspan.className = 'sound';
            vspan.innerText = 'SOUND';
            img.parentElement.appendChild(vspan);
        }

        if (img.title.includes('gif')) {
            img.parentElement.style.setProperty('--gif', "'GIF'");
            let vspan = document.createElement('span');
            vspan.className = 'gif';
            vspan.innerText = 'GIF';
            img.parentElement.appendChild(vspan);
        }

        if (img.title.match(imgTimeRegex)) {
            img.parentElement.style.setProperty('--time', "'" + img.title.match(imgTimeRegex)[0] + "'")
            let vspan = document.createElement('span');
            vspan.className = 'time';
            vspan.innerText = img.title.match(imgTimeRegex)[0];
            img.parentElement.appendChild(vspan);
        }
    });
    // ==================================================
})();