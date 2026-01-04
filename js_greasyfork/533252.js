// ==UserScript==
// @name          JustWatch - Search Improvements
// @description   Improved search efficiency
// @author        TheRealHawk
// @license       MIT
// @namespace     https://greasyfork.org/en/users/18936-therealhawk
// @match         https://www.justwatch.com/*
// @version       1.2
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require       https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/533252/JustWatch%20-%20Search%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/533252/JustWatch%20-%20Search%20Improvements.meta.js
// ==/UserScript==

// Workaround to get rid of "is not defined" warnings
/* globals $, jQuery, moment */

function waitForEl(selector, callback, maxtries = false, interval = 100) {
    const poller = setInterval(() => {
        const el = $(selector)
        const retry = maxtries === false || maxtries-- > 0
        if (retry && el.length < 1) return
        clearInterval(poller)
        callback(el || null)
    }, interval)
}

waitForEl('#searchbar-input', function() {

    $('#searchbar-input').css( { color: 'black' } );
    $('#searchbar-input:focus').css( { color: 'black' } );
    $('#searchbar-input').css( { background: 'white' } );

    $('#searchbar-input').click(function() {
        $(this).focus();
        $(this).select();
    });

}, 10, 500);

var imdbRating = $('img.is-imdb').next('div').first().text();
var titleText = $('.title-block > div > .text-muted').text();

titleText = titleText.replace(/ $/, ' - IMDB: ' + imdbRating);

$('.title-block > div > .text-muted').text(titleText);

var observedNode = document.querySelector('.title-block > div > .text-muted');
var observerConfig = { attributes: true, childList: true, subtree: true , characterData: true };

var callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
        if (mutation.type === 'characterData') {
            console.log(mutation);
            $('.title-block > div > .text-muted').text(titleText);
        }
    }
};

var observer = new MutationObserver(callback);
observer.observe(observedNode, observerConfig);
