// ==UserScript==
// @name         e(x)hentai image resizer
// @namespace    https://greasyfork.org/users/780477
// @version      0.3
// @description  resizes images to fit the height of your current device
// @match        *://e-hentai.org/s/*
// @match        *://exhentai.org/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427593/e%28x%29hentai%20image%20resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/427593/e%28x%29hentai%20image%20resizer.meta.js
// ==/UserScript==

function change_css(){
    const img = document.getElementById('img')
    img.style.width = ''
    img.style.height = '90vh'
}

(function() {
    'use strict';

    // credits https://stackoverflow.com/a/46428962
    var oldHref = document.location.href

    var
    bodyList = document.querySelector("body")

    ,observer = new MutationObserver(function(mutations) {

        mutations.forEach(function(mutation) {

            if (oldHref != document.location.href) {

                oldHref = document.location.href;

                change_css()

            }

        });

    });

    var config = {
        childList: true,
        subtree: true
    };

    observer.observe(bodyList, config);


    change_css()


})();