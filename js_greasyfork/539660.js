// ==UserScript==
// @name         Imgur No More Posts
// @namespace    https://gitlab.com/Dwyriel
// @version      1.1.1
// @description  Removes "Newest posts" and "Explore posts"
// @author       Dwyriel
// @license      MIT
// @match        *://*.imgur.com/*
// @grant        GM.registerMenuCommand
// @run-at       document-idle
// @homepageURL  https://gitlab.com/Dwyriel/Greasyfork-Scripts
// @downloadURL https://update.greasyfork.org/scripts/539660/Imgur%20No%20More%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/539660/Imgur%20No%20More%20Posts.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const userscriptName = "[Imgur No More Posts]";

    let mutationObs;
    
    const mutationObsStart = () => { mutationObs.observe(document.body, { attributes: true, childList: true, subtree: true }); };
    const yesNoString = (bool) => { return bool ? "Yes" : "No"; };

    const enhanceImagesKey = "INMP_enhance_images";
    const enhanceImagesMenuString = "Enhance images: ";
    let shouldEnhanceImages = false;
    const enhanceImages = () => {
        let images = document.querySelectorAll(`img[loading="lazy"]`);
        for (let img of images) 
            if (img.src.indexOf("_d.webp") != -1)
                img.src = img.src.split("_d.webp")[0] + ".png";
    }
    const menuEntry_EnhanceImagesAction = () => {
        mutationObs.disconnect();
        shouldEnhanceImages = !shouldEnhanceImages;
        localStorage.setItem(enhanceImagesKey, shouldEnhanceImages);
        if (shouldEnhanceImages)
            enhanceImages();
        GM.registerMenuCommand(enhanceImagesMenuString + yesNoString(shouldEnhanceImages), menuEntry_EnhanceImagesAction, { id: enhanceImagesKey, autoClose: false });
        mutationObsStart();
    }

    const callback = () => {
        mutationObs.disconnect();
        let infititeScroll = document.getElementsByClassName("BottomRecirc");
        for (let item of infititeScroll)
            item.parentNode.remove();
        let sidebar = document.getElementsByClassName("Gallery-Sidebar");
        for (let item of sidebar)
            item.remove();
        if (shouldEnhanceImages)
            enhanceImages();
        mutationObsStart();
    }

    try {
        let enhanceImagesStorageValue = localStorage.getItem(enhanceImagesKey);
        if (enhanceImagesStorageValue)
            shouldEnhanceImages = enhanceImagesStorageValue == "true";
    } catch {
        console.error(`${userscriptName} Couldn't read saved settings from localStorage`);
    }
    try {
        GM.registerMenuCommand(enhanceImagesMenuString + yesNoString(shouldEnhanceImages), menuEntry_EnhanceImagesAction, { id: enhanceImagesKey, autoClose: false });
    } catch (err) {
        console.error(`${userscriptName} Couldn't add GM menu entries`);
        console.error(err);
    }
    mutationObs = new MutationObserver(callback);
    mutationObsStart();
    callback();
})();
