// ==UserScript==
// @name         Auto Liker
// @namespace    https://martin-fr.de/
// @version      0.2
// @description  Likes automatically every post in the GTA-United forum
// @author       Martin Frühauf
// @match        https://www.gta-united.net/forum/index.php?thread/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372204/Auto%20Liker.user.js
// @updateURL https://update.greasyfork.org/scripts/372204/Auto%20Liker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    autoLike();
})();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function like(element, multiplier) {
    await sleep(multiplier * 500);

    var button = $(element)[0];

    button.click();

    var name = $(element).parents('article').find('span[itemprop="name"]').text();
    var id = $(element).parents('article').find('a[data-tooltip="Teilen"]').text();

    console.log('Liked post ' + id + ' from ' + name);
}

async function autoLike() {
    await sleep(1000);

    $('a[data-type="like"]:not(.active)').each(function(index, element) {
        like(element, index);
    });
}