// ==UserScript==
// @name         AIBooru: Pixiv filename to artwork link
// @namespace    http://tampermonkey.net/
// @license      Unlicense
// @version      2024-08-16
// @description  A button to convert Pixiv filename to an artwork link when uploading to AIBooru
// @author       @maimaimai
// @match        https://*aibooru.online/uploads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aibooru.online
// @resource     pixiv_icon https://www.google.com/s2/favicons?sz=16&domain=pixiv.net
// @grant        GM.getResourceUrl
// @downloadURL https://update.greasyfork.org/scripts/503864/AIBooru%3A%20Pixiv%20filename%20to%20artwork%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/503864/AIBooru%3A%20Pixiv%20filename%20to%20artwork%20link.meta.js
// ==/UserScript==

// /!\
// Tampermonkey is recommended. Only tested on Chrome/Chromium at the moment

if(jQuery) {
    let element = jQuery('.post_source input');
    if(!element.length) return;

    let match = element.val().match(/(?<id>\d+)_p\d+.*?/);
    if(!match) return;

    let button = jQuery('<button style="margin-left: 0.5em"><img style="display: inline-block; height: 1em; margin-right: 0.5em;"></img>Linkify</button>');

    // Rails static assets seem to lack a generic filename that can be relied upon.
    // https://github.com/search?q=repo%3Aaibooruorg/aibooru%20image_pack_tag&type=code
    //
    // There's no /packs/static/public/images/pixiv-logo.png or /packs/static/public/images/pixiv-logo-{128x128,16x16,48x48}.png
    // They contain a hash in the filename. We have no idea where it comes from on the frontend side.
    if(typeof(GM.getResourceUrl) !== 'undefined') {
        GM.getResourceUrl('pixiv_icon')
        .then(resource => jQuery(':first-child', button).attr('src', resource))
        .catch(err => {
            console.error('[Userscript: AIBooru: pixiv filename to artwork link]', err);
            jQuery(':first-child', button).attr('src', 'https://www.pixiv.net/favicon.ico');
        });
    } else {
        jQuery(':first-child', button).attr('src', 'https://www.pixiv.net/favicon.ico');
    };

    button.insertAfter(element).click(
        e => {
            e.preventDefault();
            element.val(`https://www.pixiv.net/en/artworks/${match.groups.id}`);
        }
    );

    element.css('max-width', '70%');
}
