// ==UserScript==
// @name         Remove "Ship to you" FB marketplace listings
// @author       Rolandas Valantinas
// @description  Add button which if cliked removes all visible "Ship to you" FB marketplace listings
// @include      *facebook.com/marketplace*
// @namespace    https://greasyfork.org/users/157178
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @supportURL   https://github.com/rolandas-valantinas/gists/issues
// @version      1.0.1
// @downloadURL https://update.greasyfork.org/scripts/448178/Remove%20%22Ship%20to%20you%22%20FB%20marketplace%20listings.user.js
// @updateURL https://update.greasyfork.org/scripts/448178/Remove%20%22Ship%20to%20you%22%20FB%20marketplace%20listings.meta.js
// ==/UserScript==

(function () {
    var metricsButton = `<input type="button" id="filter-ship-to-you" value="Filter">`;
    setTimeout(addButton, 2000);

    function hideListings() {
        var shipsToYou = $("a:contains('Ships to you')");

        for (var i = 0; i < shipsToYou.length; i++) {
            console.log(shipsToYou[i].closest( "span" ).closest( "div.lcfup58g" ));
            shipsToYou[i].closest( "span" ).closest( "div.lcfup58g" ).remove();
        }
    }

    function addButton() {
        console.log($("a:contains('Marketplace')"));
        $("a:contains('Marketplace')").closest( "span" ).append(metricsButton);
        $('#filter-ship-to-you').click(hideListings);
    }
})();
