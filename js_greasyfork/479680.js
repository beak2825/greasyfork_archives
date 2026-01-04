// ==UserScript==
// @name         Larger Lever of Doom Button
// @version      0.1
// @author       Twiggies
// @description  Larger Lever of Doom Buttonn
// @match        *://www.grundos.cafe/space/strangelever/*
// @match        *://www.grundos.cafe/space/leverofdoom/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @namespace    https://github.com/13ulbasaur/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479680/Larger%20Lever%20of%20Doom%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/479680/Larger%20Lever%20of%20Doom%20Button.meta.js
// ==/UserScript==

const rollAgainButton = document.querySelector('input[value="Pull the Lever Anyway"], input[value="Go Back to the Lever"]');


if (rollAgainButton) {
    rollAgainButton. style.height = "250px";
}