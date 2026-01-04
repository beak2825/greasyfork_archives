// ==UserScript==
// @name         Twitter Is Bad
// @namespace    http://tiller.fun
// @version      0.1
// @description  make twitter less bad
// @author       Tiller Von Dogbear
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387638/Twitter%20Is%20Bad.user.js
// @updateURL https://update.greasyfork.org/scripts/387638/Twitter%20Is%20Bad.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = (event) => {
        setTimeout((e) => {
            for (let item of document.getElementsByClassName('css-1dbjc4n r-aqfbo4 r-1joea0r r-zso239 r-1ovo9ad')) { item.remove(); }
            for (let item of document.getElementsByClassName('css-1dbjc4n r-kemksi r-1kqtdi0 r-1ljd8xs r-13l2t4g r-1phboty r-1jgb5lz r-1ye8kvj r-13qz1uu r-184en5c')) { item.style.maxWidth = '100%'; }
            for (let item of document.getElementsByClassName('css-1dbjc4n r-1jgb5lz r-1ye8kvj r-6337vo r-13qz1uu')) { item.style.maxWidth = '100%'; }
            for (let item of document.getElementsByClassName('css-1dbjc4n r-1jgb5lz r-1ye8kvj r-13qz1uu')) { item.style.maxWidth = '100%'; }
        }, 3000);
    };
})();