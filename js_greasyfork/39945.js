// ==UserScript==
// @name        Facepunch Coin Progress Bar
// @description Displays a progress bar below the coin count
// @author      Matoking
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @include     http*://forum.facepunch.com/*
// @version     1.1
// @run-at      document-end
// @namespace https://greasyfork.org/users/176639
// @downloadURL https://update.greasyfork.org/scripts/39945/Facepunch%20Coin%20Progress%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/39945/Facepunch%20Coin%20Progress%20Bar.meta.js
// ==/UserScript==

(function() {
    var coinNavbar = $(".navbar-item").find(".coins").parent();

    if (coinNavbar.length === 1) {
        var coinTitle = coinNavbar.attr("title");

        if (coinTitle.startsWith("next coin: ")) {
            var coinProgress = coinTitle.slice(coinTitle.indexOf("next coin: ") + 11).replace("%", "") / 100;
            var barWidth = coinNavbar.width() + (2*8); // 8px padding on each side
            var barFillWidth = barWidth * coinProgress;
            var barFillColor = $(coinNavbar).find(".coins").css("color");

            var barElement = $("<div/>")
                .css("width", barWidth + "px")
                .css("height", "5px")
                .css("margin-left", "-8px")
                .css("margin-right", "-8px")
                .css("margin-top", "2.4px")
                .css("margin-bottom", "-6.4px");
            var barFillElement = $("<div/>")
                .css("width", barFillWidth + "px")
                .css("height", "5px")
                .css("background-color", barFillColor);

            coinNavbar.css("display", "flex").css("flex-direction", "column");

            barElement.appendTo(coinNavbar);
            barFillElement.appendTo(barElement);
        }
    }
})();