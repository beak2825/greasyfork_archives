// ==UserScript==
// @name                 Enlarge (Old)Reddit Gallery
// @description          (or: How I learned to stop worrying about Reddit's UI and love reading short comic posts)
// @name:en              Enlarge (Old)Reddit Gallery
// @description:en       (or: How I learned to stop worrying about Reddit's UI and love reading short comic posts)
// @name:fr              Enlarge (Old)Reddit Galerie
// @description:fr       (ou: Comment j'ai appris à ne plus maudire l'interface de Reddit et à aimer les posts de bandes dessinées)
//
// @namespace            reddit.com
// @author               oliezekat
// @license              GPL-3.0-or-later
// @icon                 https://www.google.com/s2/favicons?domain=reddit.com
//
// @version              0.1.6
//
// @match                https://www.reddit.com/*/comments/*
// @match                https://old.reddit.com/*/comments/*
// @exclude              https://new.reddit.com/*
//
// @grant                GM_info
//
//
// @downloadURL https://update.greasyfork.org/scripts/506835/Enlarge%20%28Old%29Reddit%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/506835/Enlarge%20%28Old%29Reddit%20Gallery.meta.js
// ==/UserScript==

/* eslint no-multi-spaces: 0 */
(function() {
    let EORG = {}; // main object to store functions
    EORG.isOldRedditUi = function() {
        if ('new.reddit.com' === window.location.host) return false;
        if (document.documentElement.classList.contains('theme-beta')) return false;
        return true;
    };
    // check if new UI
    if (false === EORG.isOldRedditUi()) {
        console.warn("Userscript \"" + GM_info.script.name + "\" do nothing for new and/or beta Reddit's UI.");
        return; // silently exit
    }
    /* comments page */
    const EOL                = '\r\n';
    const comments_page_path = 'body.single-page.comments-page';
    let root_path, style;
    // compact header
    root_path = comments_page_path + ' ';
    style              = document.createElement('style');
    style.textContent += root_path + '.reddit-infobar.archived-infobar { width: fit-content; margin: 0 0 -45px auto; }' + EOL;
    style.textContent += root_path + '.expando:has(> .media-preview, > .crosspost-preview.video) { margin: 0; }' + EOL;
    style.textContent += root_path + '.expando:has(> .media-preview) > .usertext .md { max-width: none; }' + EOL;
    document.head.appendChild(style);
    // fix thumbnails grid
    const media_gallery_path = '.media-preview > .media-gallery';
    root_path = comments_page_path + ' ' + media_gallery_path + ' ';
    style              = document.createElement('style');
    style.textContent += root_path + '.gallery-tiles { text-align: left; }' + EOL;
    style.textContent += root_path + '.gallery-tiles .gallery-navigation { float: none !important; display: inline-block; vertical-align: middle; }' + EOL;
    // set caption over picture
    style.textContent += root_path + '.gallery-preview > div:has(> .gallery-item-caption) { margin: 0 auto -1.8em 0; opacity: 0.2; position: relative; width: fit-content; background-color: #fff; padding: 0.25em; }' + EOL;
    style.textContent += root_path + '.gallery-preview > div:has(> .gallery-item-link) { margin: 0 auto -1.7em 0; opacity: 0.2; position: relative; width: fit-content; background-color: #fff; padding: 0.25em; }' + EOL;
    style.textContent += root_path + '.gallery-preview > div:has(> .gallery-item-caption):has(> .gallery-item-link) { margin-bottom: -2.8em; }' + EOL;
    style.textContent += root_path + '.gallery-preview > div:has(> .gallery-item-caption):hover { opacity: 1; background-color: #ffffffb5; }' + EOL;
    style.textContent += root_path + '.gallery-preview > div:has(> .gallery-item-link):hover { opacity: 1; background-color: #ffffffb5; }' + EOL;
    style.textContent += root_path + '.gallery-item-caption { text-align: left; }' + EOL;
    style.textContent += root_path + '.gallery-item-link { text-align: left; }' + EOL;
    // set gallery preview sizes
    style.textContent += root_path + '> .gallery-preview { max-width: 100% !important; }' + EOL;
    style.textContent += root_path + '.media-preview-content:not(.gallery-tile-content) { height: 82vh; width: 100%; overflow: hidden; float: none; }' + EOL;
    style.textContent += root_path + '.media-preview-content:not(.gallery-tile-content) a.gallery-item-thumbnail-link > img.preview { width: auto; height: auto; max-width: 100%; max-height: 100%; min-height: 50%; min-width: 30%; }' + EOL;
    // description after preview
    style.textContent += root_path + '.usertext .md { max-width: none; }' + EOL;
    document.head.appendChild(style);
    /* comments page with gallery in crosspost */
    const crosspost_preview_path = '.expando .crosspost-preview.video';
    root_path = comments_page_path + ' ' + crosspost_preview_path + ' ';
    style              = document.createElement('style');
    style.textContent += root_path + '{ max-width: 99%; }' + EOL;
    style.textContent += root_path + '.crosspost-preview-header { padding: 0.25%; }' + EOL;
    style.textContent += root_path + media_gallery_path + ' .media-preview-content:not(.gallery-tile-content) { height: 75vh; padding: 0 0.25% 0.25% 0.25%; width: 99.5%; }' + EOL;
    document.head.appendChild(style);
    // replace low-res preview image with hi-res (from link target)
    root_path = comments_page_path + ' ' + media_gallery_path + ' ';
    const previewImages = document.querySelectorAll(root_path + 'a.gallery-item-thumbnail-link > img.preview');
    for (let i = 0; i < previewImages.length; i++) {
        let previewImg            = previewImages[i];
        // check if link to hi-res
        let previewLink = previewImg.parentNode;
        let linkUrl = new URL(previewLink.href);
        if ('preview.redd.it' !== linkUrl.hostname) continue;
        // prevent pre-loading hi-res until click to show preview
        previewImg.decoding       = 'async';
        previewImg.fetchPriority  = 'low';
        previewImg.loading        = 'lazy';
        previewImg.src            = previewLink.href;
    }
    /* comments page with single picture preview */
    root_path = comments_page_path + ' .entry > .expando > .media-preview:has(> .media-preview-content a.post-link > img.preview) ';
    style              = document.createElement('style');
    style.textContent += root_path + '{ max-width: 100% !important; }' + EOL;
    style.textContent += root_path + '> .media-preview-content:not(.video-player) { height: 82vh; width: 100%; overflow: hidden; }' + EOL;
    style.textContent += root_path + '> .media-preview-content:not(.video-player) a.post-link > img.preview { width: auto; height: auto; max-width: 100%; max-height: 100%; min-height: 50%; min-width: 30%; }' + EOL;
    document.head.appendChild(style);
    // replace low-res preview image with hi-res (from link target)
    root_path = comments_page_path + ' .entry > .expando > .media-preview ';
    const previewImage = document.querySelector(root_path + '> .media-preview-content a.post-link > img.preview');
    if (null !== previewImage) {
        // check if link to hi-res
        let previewLink = previewImage.parentNode;
        let linkUrl = new URL(previewLink.href);
        if ('i.redd.it' === linkUrl.hostname) {
            previewImage.decoding       = 'async';
            previewImage.fetchPriority  = 'low';
            previewImage.loading        = 'lazy';
            previewImage.src            = previewLink.href;
        }
    }
    // todo: enhance on list views (home, multi, sub, etc)
    // todo: enhance gallery page
})();