// ==UserScript==
// @name        AnimeSeason Watch List
// @namespace   s
// @description Highlights anime in your last watched list that have unwatched episodes
// @include     http://www.animeseason.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/1803/AnimeSeason%20Watch%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/1803/AnimeSeason%20Watch%20List.meta.js
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
    var script = document.createElement('script');
    script.setAttribute('src', '//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js');
    script.addEventListener('load', function () {
        var script = document.createElement('script');
        script.textContent = 'window.jQ=jQuery.noConflict(true);(' + callback.toString() + ')();';
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

// Search for next episodes
function main() {
    // Note, jQ replaces $ to avoid conflicts.
    jQ('#header_lw') .next('ul') .children() .each(function () {
        var link = jQ(this) .children() .attr('href');
        var item = jQ(this) .children();
        jQ.ajax({
            url: link
        }) .done(function (page) {
            if (page.indexOf('[NEXT]') > 0) item.css('color', '#cca');
        });
    });
}

// load jQuery and execute the main function
addJQuery(main);
