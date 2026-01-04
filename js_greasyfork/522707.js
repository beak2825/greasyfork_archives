// ==UserScript==
// @name         MangaDex Limit-Width Dual Spread Fix
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Improve Mangadex's fit-width logic to account for large images that are intended to be "dual-spread", ignoring the width limit on relevant pages.
// @author       Delfofthebla
// @license      MIT
// @match        *://mangadex.org/*
// @match        *://*.mangadex.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangadex.org
// @grant        unsafeWindow
// @run-at       document-idle
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/522707/MangaDex%20Limit-Width%20Dual%20Spread%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/522707/MangaDex%20Limit-Width%20Dual%20Spread%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const chapterReg = /\/chapter\//;
    const chapterGuidReg = /\/chapter\/([^/]*)/;
	const observerConfig = {subtree: true, childList: true};

    let _interval = null;
    let _previousUrl = '';
    const observer = new MutationObserver(onPageChanged);

    observer.observe(document, observerConfig);

	checkIfShouldRun();

    function startInterval() {
        if (_interval != null) {
            clearInterval(_interval);
        }

        _interval = setInterval(stripFitWidthIfNecessary, 100);
        setTimeout(() => scrollToTop(), 250);

        console.log("Dual Spread Fix: Dual-Spread Check Starting");
        //scrollToTop();
    }

    // Callback function to execute when a page is changed
    function onPageChanged(mutationsList) {
        checkIfShouldRun();
    }

    function checkIfShouldRun() {
        let previousUrl = _previousUrl;
        _previousUrl = location.pathname;
        //console.log("Dual Spread Fix: Checking Path for: " + location.pathname);

        let onNewChapterPage = false;
        if (typeof previousUrl === 'undefined' || !previousUrl) {
            // No previous url found. Just check current page.
            if (chapterReg.test(location.pathname)) {
                onNewChapterPage = true;
            }
        }

        if (previousUrl !== location.pathname && chapterReg.test(location.pathname)) {
            // We're on a chapter page, but we might already have been here. Check if we just came from another path.
            if (!chapterReg.test(previousUrl)) {
                onNewChapterPage = true;
            } else {
                // Both the previous url and current url are chapter paths. Check if the chapter is actually different.
                let previousUrlGuid = previousUrl.match(chapterGuidReg)[0];
                let currentUrlGuid = location.pathname.match(chapterGuidReg)[0];

                if (previousUrlGuid !== currentUrlGuid) {
                    onNewChapterPage = true;
                }
            }
        }

        if (onNewChapterPage) {
            console.log("Dual Spread Fix: Detected a page change to a new chapter.");
            startInterval();
        }
    }

    function scrollToTop() {
        // This prevents the page from scrolling down to where it was previously.
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        // This is needed if the user scrolls down during page load and you want to make sure the page is scrolled to the top once it's fully loaded. This has Cross-browser support.
        window.scrollTo(0,0);
    }

    function stripFitWidthIfNecessary() {
        //console.log("Dual Spread Fix: Checking for chapter pages.");
        // pre-load check
        let img = document.querySelector("img.img");
        if(!img || !img.naturalWidth) {
            //console.log("Dual Spread Fix: Dual Spread Fix: No chapter pages found yet.");
            return;
        }

        let headerElems = document.getElementsByClassName("reader--header-meta");
        if (headerElems === null || headerElems.length < 1 || !headerElems[0].children || headerElems[0].children.length < 3) {
            //console.log("Dual Spread Fix: Headers haven't loaded yet.");
            return;
        }

        // Ensure all images are loaded.
        let pageCountEle = headerElems[0].children[1];
        let requiredPageCount = parseInt(pageCountEle.innerText.split('/').pop().replace(' ', ''));
        let imageEles = document.getElementsByClassName("img limit-width grow-pages ls");
        let images = Array.prototype.map.call(imageEles, (image) => image);
        if (images.length < requiredPageCount || images.some(x => x.naturalWidth == 0)) {
            //console.log("Dual Spread Fix: We haven't loaded every single page yet.");
            return;
        }

        //scrollToTop();

        // Reset any previously altered pages (usually due to a previous chapter being viewed)
        let alteredImageEles = document.getElementsByClassName("img limit-width grow-pages ls dual-spread");
        let alteredImages = Array.prototype.map.call(alteredImageEles, (image) => image);
        if (alteredImages.length > 0) {
            for (let i = 0; i < alteredImages.length; i++) {
                let image = alteredImages[i];
                console.log("Dual Spread Fix: Reverting class changes to Image.");
                image.classList.remove('dual-spread');
            }
        }

        // Ensure we're in limit-width mode with a valid width value set before proceeding
        let dexSettings = JSON.parse(localStorage.getItem("md"));
        if (dexSettings == null || dexSettings.readerMenu == null || dexSettings.readerMenu._limitWidth !== true || dexSettings.readerMenu.maxWidth == null) {
            clearInterval(_interval);
            console.log("Dual Spread Fix: Aborted page modification. You are not in limit width mode. Settings: " + dexSettings);
            return;
        }

        const style = document.createElement("style")
        let scrollbarWidth = window.innerWidth - document.body.clientWidth;
        let dualSpreadWidth = "calc(100vw - " + scrollbarWidth + "px)";
        let centeringMargin = "calc((50% - 50vw) + " + (scrollbarWidth * 0.5) + "px)";
        style.textContent = ".img.limit-width.grow-pages.dual-spread.ls { max-width: " + dualSpreadWidth + "; width: " + dualSpreadWidth + "; flex-shrink: 0; margin-left: " + centeringMargin + "; }"
        document.head.appendChild(style);

        Array.prototype.forEach.call(imageEles, function(imageEle) {
            imageEle.addEventListener('auxclick', event => {
                if (event.button === 1) {
                    event.preventDefault();

                    if (imageEle.classList.contains('dual-spread')) {
                        imageEle.classList.remove('dual-spread');
                    } else {
                        imageEle.classList.add('dual-spread');
                    }
                }
            });

            imageEle.addEventListener('mousedown', event => {
                if (event.which === 2) {
                    event.preventDefault();
                }
            });
        });

        function groupBy(list, keyGetter) {
            const map = new Map();
            list.forEach((item) => {
                const key = keyGetter(item);
                const collection = map.get(key);
                if (!collection) {
                    map.set(key, [item]);
                } else {
                    collection.push(item);
                }
            });
            return map;
        }

        let highestPageCount = 0;
        let defaultPageWidth = 0;
        let pageCountsByWidth = groupBy(images, image => image.naturalWidth);
        pageCountsByWidth.forEach((pagesForWidth, width) => {
            if (pagesForWidth.length > highestPageCount) {
                highestPageCount = pagesForWidth.length;
                defaultPageWidth = width;
            }
        });

        let changedAPage = false;
        for (let i = 0; i < images.length; i++) {
            let image = images[i];
            console.log("Dual Spread Fix: Image Width: " + image.naturalWidth);
            if (image.naturalWidth > defaultPageWidth * 1.25) {
                //image.classList.toggle('limit-width');
                image.classList.add('dual-spread');
                changedAPage = true;
                console.log("Dual Spread Fix: Dual Spread added to page with " + image.naturalWidth + " width.");
            }
        }

        // if (changedAPage) {
        //     scrollToTop();
        // }

        clearInterval(_interval);
        console.log("Dual Spread Fix: Dual-Spread Check Finished.");
    }
})();