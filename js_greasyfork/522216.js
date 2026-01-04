// ==UserScript==
// @name v2ph.com - Kill lazy load
// @description Kill lazy load on v2ph.com and load all images directly
// @namespace https://greasyfork.org/users/752079
// @version 1.0.1
// @license Unlicense
// @match https://www.v2ph.com/*
// @grant none
// @icon https://www.v2ph.com/img/favicon.svg
// @downloadURL https://update.greasyfork.org/scripts/522216/v2phcom%20-%20Kill%20lazy%20load.user.js
// @updateURL https://update.greasyfork.org/scripts/522216/v2phcom%20-%20Kill%20lazy%20load.meta.js
// ==/UserScript==

const run = (images) => {
    images.forEach(image => {
        if (image.dataset && image.dataset.src) {
            image.src = image.dataset.src;
            delete image.dataset.src;
            image.style.opacity = "1";
            image.style.transition = "none";
        }
    });
};

const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            run(document.querySelectorAll('img[data-src]'));
        }
    });
});

run(document.querySelectorAll('img[data-src]'));

observer.observe(document.body, { childList: true, subtree: true });
