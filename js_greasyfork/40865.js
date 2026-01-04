// ==UserScript==
// @name         Geforce Experience - Game hider
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  lets you hide games from the list
// @author       Shuunen
// @match        https://www.nvidia.fr/geforce/geforce-experience/games/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40865/Geforce%20Experience%20-%20Game%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/40865/Geforce%20Experience%20-%20Game%20hider.meta.js
// ==/UserScript==

$(document).ready(function() {
    console.log('geforce experience hider (geh) : init');

    function log(thing) {
        console.log('geh :', thing);
    }

    var gamesToHide = [];
    if(localStorage.gahGamesToHide) {
        gamesToHide = localStorage.gahGamesToHide.split(',');
    }
    log(gamesToHide.length + ' games will be hidden');

    var hideItStyle = 'color: orangered; border-width: 3px; display: inline-block; box-sizing: content-box; border-radius: 50%; margin-left: 10px; cursor: pointer; height: 10px; width: 10px; border-style: dashed;';

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this;
            var args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate)
                    func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow)
                func.apply(context, args);
        };
    }

    function hide() {
        log('hidding...');
        $('.gameName:visible').each(function(index,game){
            // clean game tile
            var title = game.textContent.trim().replace(/\./g, '').replace(/[^a-zA-Z0-9\s]+/g, '');
            // game.textContent = title
            if (gamesToHide.includes(title)) {
                $(game).hide('slow');
            } else {
                game.innerHTML = '<a href="https://www.google.fr/search?q=' + title + '" target="_blank">' + title + '</a>';
                var hideIt = $('<span style="'+hideItStyle+'"></span>');
                hideIt.click(function(event){
                    var gameToHide = event.currentTarget.previousElementSibling.textContent;
                    log('user choosed to hide "' + gameToHide + '"');
                    gamesToHide.push(gameToHide);
                    log('this list has been saved in LS, put it in your script if you want to save it forever');
                    console.log(gamesToHide);
                    localStorage.gahGamesToHide = gamesToHide;
                    hide();
                });
                $(game).append(hideIt);
            }
        });
    }

    // prepare a debounced function
    var hideDebounced = debounce(hide, 1000);

    // activate when window is scrolled
    // window.onscroll = hideDebounced;

    // activate when select is changed
    $('#gameTypes').change(hideDebounced);

    // start by default
    hideDebounced();

});
