// ==UserScript==
// @name        Derpibooru - Rating Info
// @description Shows image's rating above its thumbnail on Derpibooru.
// @namespace   derpibooru_ratinginfo
// @include     /^https?:\/\/(www\.)?(derpiboo(ru\.org|\.ru)|trixiebooru\.org).*$/
// @version     20171120
// @downloadURL https://update.greasyfork.org/scripts/10359/Derpibooru%20-%20Rating%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/10359/Derpibooru%20-%20Rating%20Info.meta.js
// ==/UserScript==

(function() {
    "use strict";

    function addStyle(css) {
        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    let isRatingTag = tag => tags.includes(tag);

    addStyle('.RI_rating > * {padding-right: 3px; font-weight: bold}');

    const conf = [
        ['safe',             'S',       '#67AF2B'],
        ['explicit',         'E',       '#CF0001'],
        ['questionable',     'Q',       '#C4B246'],
        ['suggestive',       'Sg',      '#C4B246'],
        ['grimdark',         'GD',      '#5E0000'],
        ['semi-grimdark',    'S-GD',    '#5E0000'],
        ['grotesque',        'Gr',      '#000000']
    ];

    const tags = conf.map(value => value[0]);

    for (const tag of conf) {
        addStyle('.RI_' + tag[0] + ':after {content: "' + tag[1] + '"; color:' + tag[2] + '}');
    }

    for (const mediaBox of document.getElementsByClassName("media-box")) {
        const infoBoxEl = mediaBox.getElementsByClassName("media-box__header") [0];
        const imgTags = mediaBox.getElementsByClassName("image-container") [0].dataset.imageTagAliases.split(", ");
        const rTags = imgTags.filter(isRatingTag);

        const ratingNode = document.createElement("span");
        ratingNode.className = "RI_rating";

        for (const rTag of rTags) {
            const tagNode = document.createElement('span');
            tagNode.className  = "RI_" + rTag;
            ratingNode.appendChild(tagNode);
        }

        infoBoxEl.insertBefore(ratingNode, infoBoxEl.firstChild);
    }
})();