// ==UserScript==
// @name         vreddit-direct
// @description  Adds a vreddit.azzurite.tv link to reddit posts
// @namespace    http://azzurite.tv/
// @version      1.0
// @author       Azzu
// @match        https://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421883/vreddit-direct.user.js
// @updateURL https://update.greasyfork.org/scripts/421883/vreddit-direct.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $ = window.$;

    const things = [].slice.call(document.querySelectorAll('.thing.link:not(.promotedlink)'));
    const vredditThings = things.filter((thing) => thing.dataset.domain == 'v.redd.it');
    vredditThings.forEach(thing => {
        const link = `https://vreddit.azzurite.tv/?url=${thing.dataset.permalink}`;
        const a = $(`<li><a target="blank" href="${link}">Directlink</a></li>`);
        $(thing).find('.buttons').append(a);
    });
})();