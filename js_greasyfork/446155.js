// ==UserScript==
// @name         Form marker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  Marks the required form on the japanese conjugation tools in different colors for better identification.
// @author       ThisIsntTheWay
// @match        https://steven-kraft.com/projects/japanese/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steven-kraft.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446155/Form%20marker.user.js
// @updateURL https://update.greasyfork.org/scripts/446155/Form%20marker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.info("[i] Form marker loaded.");

    // /html/body/div/div[1]/div/div[1]/h3[1], usually matches
    let a = document.evaluate("/html/body/div/div[1]/div/div[1]/h3[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    //console.info(a)
    function detectForm() {
        if ((a.innerHTML).includes("Polite")) {
            a.innerHTML = (a.innerHTML).replace("Polite", "<span style='color: green;'>Polite</span>");
        }
        if ((a.innerHTML).includes("Negative")) {
            a.innerHTML = (a.innerHTML).replace("Negative", "<span style='color: red;'>Negative</span>");
        }
        if ((a.innerHTML).includes("Volitional")) {
            a.innerHTML = (a.innerHTML).replace("Volitional", "<span style='color: orange;'>Volitional</span>");
        }
        if ((a.innerHTML).includes("Causative")) {
            a.innerHTML = (a.innerHTML).replace("Causative", "<span style='color: pink;'>Causative</span>");
        }
        if ((a.innerHTML).includes("Conditional")) {
            a.innerHTML = (a.innerHTML).replace("Conditional", "<span style='color: violet;'>Conditional</span>");
        }
        if ((a.innerHTML).includes("Passive")) {
            a.innerHTML = (a.innerHTML).replace("Passive", "<span style='color: cyan;'>Passive</span>");
        }
        if ((a.innerHTML).includes("Imperative")) {
            a.innerHTML = (a.innerHTML).replace("Imperative", "<em>Imperative</em>");
        }
        if ((a.innerHTML).includes("Potential")) {
            a.innerHTML = (a.innerHTML).replace("Potential", "<i>Potential</i>");
        }
        if ((a.innerHTML).includes("Past")) {
            a.innerHTML = (a.innerHTML).replace("Past", "<span style='color: yellow;'>Past</span>");
        }
        if ((a.innerHTML).includes("Plain")) {
            a.innerHTML = (a.innerHTML).replace("Plain", "<b>Plain</b>");
        }
    }

    // Unfortunately this is more reliable than MutationObserver.
    // For some reason, the observer only triggers on every SECOND change using cfg: {characterData: true, subtree: true, characterDataOldValue: true, attributes: true}
    setInterval(function () {
        detectForm()
    }, 100);
    console.log(a);
})();