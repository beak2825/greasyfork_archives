// ==UserScript==
// @name        fmovies/fbox episode controls
// @namespace   Violentmonkey Scripts
// @match       *://fmovies24.to/tv/*
// @match       *://fboxz.to/tv/*
// @grant       none
// @version     1.2.1
// @author      -
// @license     MIT
// @require     https://greasyfork.org/scripts/476008-waitforkeyelements-gist-port/code/waitforkeyelements%20gist%20port+.js
// @description Adds previous and next episode buttons to fmovies/fbox
// @downloadURL https://update.greasyfork.org/scripts/503897/fmoviesfbox%20episode%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/503897/fmoviesfbox%20episode%20controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    waitForKeyElements('.server.active', () => {
        $('#servers').prepend(`<button id='previousEpisode' type='submit'>Previous Episode</button><button id='nextEpisode' type='submit'>Next Episode</button>`)

        function changeClick(t) {
            let currentEpisode = document.querySelector('ul.episodes > li > a.active').getAttribute('data-num')
            let episodePicker = document.querySelector('#episodes > div.foot > div > form > input')
            episodePicker.value = parseInt(currentEpisode) + t
        }

        document.querySelector('#nextEpisode').addEventListener('click', () => {changeClick(1); document.querySelector("#episodes > div.foot > div > form > button").click()})
        document.querySelector('#previousEpisode').addEventListener('click', () => {changeClick(-1); document.querySelector("#episodes > div.foot > div > form > button").click()})
    }, false)
})();
