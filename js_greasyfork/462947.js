// ==UserScript==
// @name           wegbowsie
// @namespace      http://tampermonkey.net/
// @version        0.1
// @description    weg met bowsies avatar
// @author         UltraTiger
// @match          https://www.budgetgaming.nl/*
// @run-at         document-start
// @require        https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @license        MIT
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/462947/wegbowsie.user.js
// @updateURL https://update.greasyfork.org/scripts/462947/wegbowsie.meta.js
// ==/UserScript==

setMutationHandler({
    processExisting: true,
    selector: 'img[src*="18852.gif"]',
    handler: images => images.forEach(img => {
        img.src = 'https://www.budgetgaming.nl/bgroodlogo.png';
    })
});