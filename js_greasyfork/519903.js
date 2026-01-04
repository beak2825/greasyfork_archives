// ==UserScript==
// @name         Fullres Zoomable Twitch Thumbnails
// @namespace    http://tampermonkey.net/
// @version      2024-12-05
// @description  Modifies twitch thumbnails to be full resolution images instead of downscaled where possible and allows zoom on hover.
// @author       laund
// @license      MIT
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @require      https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@a03933c5e42343b434c7800eb2777575342d8287/waitForKeyElements.js
// @require      https://gist.githubusercontent.com/laundmo/341526bd819c619712e2680a4469cd7f/raw/19621be01b830c0f888c99769e2964f40a5282bf/hover_zoomable.js#sha256=166177289f4c2707a86f057b9861d29daea4ed1ef9e6b33aaf5fb39cf331d991
// @downloadURL https://update.greasyfork.org/scripts/519903/Fullres%20Zoomable%20Twitch%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/519903/Fullres%20Zoomable%20Twitch%20Thumbnails.meta.js
// ==/UserScript==
/* globals waitForKeyElements, makeImageHoverZoomable */

const twitch_cdn_url_size_regex = /(thumb0)?(?:-\d{1,5}x\d{1,5})(\.jpg|\.png|\.jpeg|)/gm;

const selectors = [
    ".preview-card-image-link .tw-image:not(.thumbnail_fullres_modified)",
    ".search-result-card__img-wrapper .tw-image.search-result-card__img:not(.thumbnail_fullres_modified)",
    ".search-result-related-live-channels__row-container .tw-image:not(.thumbnail_fullres_modified)"
];

waitForKeyElements(selectors.join(", "), handleNewThumbnail, false, 200);
waitForKeyElements(".preview-card-thumbnail__image:not(.preview-card-thumbnail__image--animated) .tw-image:not(.thumbnail_fullres_modified)", handleNewThumbnailCloned, false, 200);

function replacer(match, g1, g2){
    if (g1 === undefined){
        return g2
    }
    return g1 + "-1920x1080" + g2
}


function handleNewThumbnail(elem){
    elem.classList.add(".thumbnail_fullres_modified");
    elem.src = elem.src.replace(twitch_cdn_url_size_regex, replacer);
    makeImageHoverZoomable(elem, 3, 0.5);
}


function handleNewThumbnailCloned(elem){
    // sometimes the selector matches again after cloning
    if (elem.classList.contains(".thumbnail_fullres_modified")) { return; }

    // clone container
    const container = elem.parentNode;
    // make sure its not copying src from a animated thumbnail
    if (container.classList.contains(".preview-card-thumbnail__image--animated")){ return; }
    const cloned = container.cloneNode(true);
    container.hidden = true;

    // handle normally
    handleNewThumbnail(cloned.querySelector(".tw-image"));

    // reinstate container
    container.parentNode.insertBefore(cloned, container.nextSibling);
}