// ==UserScript==
// @name     Left/Right Arrow Key Navigation for Manga/Manhwa/Manhua Sites
// @author  sm00nie
// @version  1.07
// @description left and right arrow key navigation to the previous or next manga/manhwa/manhua in the series
// @grant    none
// @include /^https?:\/\/(?:www\.)?(manganelo\.com|mangakakalot\.com|mangasushi\.net|leviatanscans\.com|methodscans\.com|skscans\.com|reaperscans\.com|secretscans\.co|hunlight-scans\.info|edelgardescans\.com|the-nonames\.com|asurascans\.com|webtoons\.com/)(?:.*)$/
// @namespace https://greasyfork.org/users/165048
// @downloadURL https://update.greasyfork.org/scripts/38268/LeftRight%20Arrow%20Key%20Navigation%20for%20MangaManhwaManhua%20Sites.user.js
// @updateURL https://update.greasyfork.org/scripts/38268/LeftRight%20Arrow%20Key%20Navigation%20for%20MangaManhwaManhua%20Sites.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let next, previous;

    document.addEventListener("keyup", function(event) {
        let btnContainer = document.querySelectorAll('#pages-container .btn');
        if(btnContainer.length > 0) {
            // Genkan themes
            for (const button of btnContainer) {
                if(button.text.includes('Previous')) {
                    previous = button
                }

                if(button.text.includes('Next')) {
                    next = button
                }
            }
        } else {
            // Madara -> mangakakalot, manganelo, mangasushi
            // Mangastream -> asurascans
            previous = document.querySelector('.next') || document.querySelector('.navi-change-chapter-btn-prev') || document.querySelector('.prev_page') || document.querySelector('[rel="prev"]') || document.querySelector('.pg_prev');
            next = document.querySelector('.back') || document.querySelector('.navi-change-chapter-btn-next') || document.querySelector('.next_page') || document.querySelector('[rel="next"]') || document.querySelector('.pg_next');
        }

        if (event.keyCode == 37 && previous !== null) {
            previous.click()
        } else if(event.keyCode == 39 && next !== null) {
            next.click()
        }
    })
})();