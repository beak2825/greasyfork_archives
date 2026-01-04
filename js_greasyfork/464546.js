// ==UserScript==
// @name         自动完成 MSN Shopping Game
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  自动完成 Microsoft Rewards MSN Shopping Game
// @author       You
// @license      MIT
// @match        https://www.msn.com/en-us/shopping
// @icon         https://www.google.com/s2/favicons?sz=64&domain=msn.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/464546/%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%20MSN%20Shopping%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/464546/%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%20MSN%20Shopping%20Game.meta.js
// ==/UserScript==

setTimeout(function() {
    'use strict';

    function extractNumberFromCurrencyFrt(str) {
        return parseFloat(str.replace(/[^0-9.-]+/g,""));
    }

    function getRealPrice(entity) {
        const originPriceNumber = extractNumberFromCurrencyFrt(entity.priceInfo.originalPrice);
        const discount = (100 - parseFloat(entity.dealPercentage)) / 100
        return originPriceNumber * discount;
    }

    // function getSmallestValueKey(map) {
    //     let smallestPrice = Infinity;
    //     let smallestKey;

    //     for (let [key, value] of Object.entries(map)) {
    //         const price = extractNumberFromCurrencyFrt(value.price);
    //         if (price < smallestPrice) {
    //             smallestPrice = price;
    //             smallestKey = key;
    //         }
    //     }

    //     return smallestKey;
    // }

    function getCorrectAnswerIndex(pane) {
        const displayedShoppingEntities = pane._displayedShoppingEntities;
        const lowestPriceIndex = displayedShoppingEntities.reduce(
            (currentIndex, currentValue, index, array) =>
                getRealPrice(currentValue) < getRealPrice(array[currentIndex]) ? index : currentIndex,
            0
        );
        return lowestPriceIndex;
    }

    if (
        !document.location.href.startsWith("https://www.msn.com/en-us/shopping")
    ) {
        alert("Invalid page!");
        return;
    }

    var shoppingPageChildren = null;
    try {
        shoppingPageChildren = document
            .getElementsByTagName("shopping-page-base")[0]
            .shadowRoot.children[0].getElementsByTagName("shopping-homepage")[0]
            .shadowRoot.children[0].getElementsByTagName("msft-feed-layout")[0]
            .shadowRoot.children;
    } catch (e) {
        alert("Script error...\nMake sure the page is fully loaded.");
        return;
    }

    var msnShoppingGamePane = null;
    for (let i = 0; i <= shoppingPageChildren.length - 1; i++) {
        if (shoppingPageChildren[i].getAttribute("gamestate") == "active") {
            msnShoppingGamePane = shoppingPageChildren[i];
        }
    }
    var answerSelectorInterval =
        msnShoppingGamePane == null
    ? 0
    : setInterval(() => {
        const correctAnswerIndex = getCorrectAnswerIndex(msnShoppingGamePane);
        if (
            msnShoppingGamePane.gameState == "active" &&
            msnShoppingGamePane.selectedCardIndex !=
            correctAnswerIndex
        ) {
            msnShoppingGamePane.selectedCardIndex = correctAnswerIndex;
        }

        if (msnShoppingGamePane._dailyLimitReached) {
            clearInterval(answerSelectorInterval);
        }
    }, 500);
    alert(
        answerSelectorInterval == 0
        ? "Unable to locate shopping game...\nTry scrolling down to it."
        : "Shopping game located!\nEnjoy :)"
    );
}, 6000);