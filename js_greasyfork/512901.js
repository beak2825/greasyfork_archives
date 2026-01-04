// ==UserScript==
// @name         RR Filter
// @namespace    rrfilter.torn
// @version      1.0
// @description  Filters games based on bet amounts in Russian Roulette
// @author       Whiskey_Jack [1994581]
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512901/RR%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/512901/RR%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var gamesData = {};

    function filterAdd() {
        if ($('div[class^="titleContainer"]').length > 0) {
            var filter = $('<input type="text" id="filterValue" placeholder="Enter value or =value">');
            $('div[class^="titleContainer"]').append(filter);
        } else {
            setTimeout(filterAdd, 300);
        }
    }

    function filterGameDiv(gameDiv) {
        var filterValue = $('#filterValue').val();
        var exactMatch = false;
        if (filterValue && filterValue.startsWith('=')) {
            filterValue = parseInt(filterValue.slice(1));
            exactMatch = true;
        } else {
            filterValue = parseInt(filterValue) || 0;
        }

        var starterAnchor = gameDiv.find('.honorWrap___BHau4 a[rel="noopener noreferrer"]');
        if (starterAnchor.length > 0) {
            var startedLink = starterAnchor.attr('href');
            var gameId = gameDiv.attr('id');
            var gameAmount = parseInt(gameDiv.find('div[class^="betBlock"]').attr('aria-label').split(':')[1]);

            if (!Object.keys(gamesData).includes(gameId)) {
                gamesData[gameId] = [starterAnchor.text(), startedLink];
            }

            if (exactMatch ? gameAmount !== filterValue : gameAmount < filterValue) {
                if (Object.keys(gamesData).includes(gameId)) {
                    gameDiv.hide();
                    delete gamesData[gameId];
                }
            } else {
                gameDiv.show();
            }
        } else {
            console.log("Anchor element not found for game:", gameDiv.attr('id'));
        }
    }

    function observeNewGames() {
        const targetNode = document.querySelector('div[class^="rowsWrap"]');
        if (!targetNode) {
            console.log('Target node not found. Retrying in 300ms...');
            setTimeout(observeNewGames, 300);
            return;
        }

        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Ensure it's an element node
                            filterGameDiv($(node));
                        }
                    });
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    filterAdd();
    setInterval(function() {
        $('div[class^="rowsWrap"] > div').each(function() {
            filterGameDiv($(this));
        });
    }, 300);
    observeNewGames();
})();
