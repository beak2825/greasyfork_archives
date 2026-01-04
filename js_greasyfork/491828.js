// ==UserScript==
// @name            	Youtube removes clickbait from thumbnails
// @namespace       	https://greasyfork.org/users/821661
// @match           	https://www.youtube.com/*
// @grant           	GM_registerMenuCommand
// @grant           	GM_setValue
// @grant           	GM_getValue
// @version         	0.2
// @author          	hdyzen
// @description     	Removes clickbait from thumbnails changing to start/middle/end thumb of video
// @license         	MIT
// @downloadURL https://update.greasyfork.org/scripts/491828/Youtube%20removes%20clickbait%20from%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/491828/Youtube%20removes%20clickbait%20from%20thumbnails.meta.js
// ==/UserScript==
'use strict';

const optionsMenu = {
    start: 'hq1',
    middle: 'hq2',
    end: 'hq3',
    default: 'hqdefault',
};

let optionSelected = GM_getValue('optionSelected', optionsMenu['start']);

const regexThumbName = /(?<=\/)hq.*(?=\.)/;

function createMenu() {
    Object.keys(optionsMenu).forEach(id => {
        let optionAtual = optionsMenu[id];
        GM_registerMenuCommand(
            `${optionAtual === optionSelected ? '[⬤]' : '[◯]'} Use thumbnail from ${id}`,
            e => {
                GM_setValue('optionSelected', optionAtual);
                optionSelected = optionAtual;
                createMenu();
                changeThumbsAfter();
            },
            { autoClose: false, id: optionAtual },
        );
    });
}

function changeThumbsAfter() {
    const thumbs = document.querySelectorAll('a#thumbnail > .ytd-thumbnail > img[src]');
    thumbs.forEach(thumb => {
        thumb.src = thumb.src.replace(regexThumbName, optionSelected);
    });
}

function changeThumbsOnInit() {
    document.addEventListener('image-loaded', e => {
        if (!e.target.src.includes(`${optionSelected}.`)) {
            e.target.src = e.target.src.replace(regexThumbName, optionSelected);
        }
    });
}

createMenu();
changeThumbsOnInit();
