// ==UserScript==
// @name         Kiss the mortog AP
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      2025-05-11
// @description  Auto plays Kiss the mortog until you get the avatar.
// @match        https://www.grundos.cafe/medieval/kissthemortog/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535619/Kiss%20the%20mortog%20AP.user.js
// @updateURL https://update.greasyfork.org/scripts/535619/Kiss%20the%20mortog%20AP.meta.js
// ==/UserScript==

(function () {
    'use strict';


    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }

    // $(`[alt="Submit"]:first`).click();

    setTimeout(function () {
        if ($(`[value="Try again..."]`).length == 1) {
            $(`[value="Try again..."]`).click()
        }

        var mortog_number = $(`#mortogs img`).length;

        if (mortog_number < 5) {
            $(`[value="Continue"]`).click()
        }
        if ($(`[src="https://grundoscafe.b-cdn.net/games/kissthemortog/frog_guy.gif"]`).length == 1) {
            $(`#mortogs form:nth-child(${getRandomInt(1, $(`#mortogs form`).length + 1)}) [alt="Submit"]`).click()
        }
    }, getRandomInt(1000, 3000));

})();