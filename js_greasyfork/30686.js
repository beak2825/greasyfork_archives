// ==UserScript==
// @name         Gwent Tracker to Gwentify Collection
// @version      0.4
// @description  Transfer your collection to Gwentify
// @author       spokomaciek
// @match        http://www.gwent-tracker.com/*
// @match        http://gwentify.com/collection-manager/
// @run-at document-idle
// @grant   GM_getValue
// @grant   GM_setValue
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/string.js/3.3.3/string.min.js
// @namespace https://greasyfork.org/users/133522
// @downloadURL https://update.greasyfork.org/scripts/30686/Gwent%20Tracker%20to%20Gwentify%20Collection.user.js
// @updateURL https://update.greasyfork.org/scripts/30686/Gwent%20Tracker%20to%20Gwentify%20Collection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCollection() {
        if (GM_getValue('transfer') == 'true') {
            console.log('Adding to collection');
            var cards = JSON.parse(GM_getValue('cards', '{}'));
            GM_setValue('transfer', 'false');
            var cardsD = {};
            cards.forEach(function(val) {
                if (cardsD[val] === undefined) {
                    cardsD[val] = 1;
                }
                else {
                    cardsD[val] += 1;
                }
            });
            console.log(JSON.stringify(cardsD));
            for (var key in cardsD) {
                var card = $("div.db-card").filter(function() { return S($(this).attr('data-name').toUpperCase()).latinise().s == key; });
                if (card.attr('data-ownership') === 'owned') {
                    var amnt = Number(card.find('.cm-card-ct').text());
                    if (amnt <= cardsD[key]) {
                        for (var i = 0; i < cardsD[key] - amnt; ++i) {
                            card.click();
                        }
                    }
                    else {
                        for (var i = 0; i < amnt - cardsD[key]; ++i) {
                            card[0].dispatchEvent(new CustomEvent('contextmenu'));
                        }
                    }
                }
                else {
                    for (var i = 0; i < cardsD[key]; ++i) {
                        card.click();
                    }
                }
            }
            alert('Remember to save your collection :)');
        }
    }
    function transfer() {
        console.log("Bookmarklet starting");
        var cards = $(".name").text().split('\n').map(function(u) {return S(u.trim().toUpperCase()).latinise().s;}).filter(function(u) {return u !== "";});
        GM_setValue('transfer', 'true');
        GM_setValue('cards', JSON.stringify(cards));
        window.location.assign("http://gwentify.com/collection-manager/");
    }

    if (location.href.match(/gwent-tracker/)) {
        $('body').append('<input type="button" value="Transfer collection" id="transferBtn">');
        $("#transferBtn").css("position", "fixed").css("top", 0).css("left", 0);
        $('#transferBtn').click(function() {
            transfer();
        });
    }
    else {
        addCollection();
    }
})();