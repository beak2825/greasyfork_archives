// ==UserScript==
// @name         IC Recipe Discoveries
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @license      MIT
// @description  Adds indication if you were the first to get a recipe in Infinite Craft
// @icon         https://i.imgur.com/WlkWOkU.png
// @author       @activetutorial on discord
// @match        https://neal.fun/infinite-craft/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520736/IC%20Recipe%20Discoveries.user.js
// @updateURL https://update.greasyfork.org/scripts/520736/IC%20Recipe%20Discoveries.meta.js
// ==/UserScript==

(function () {
    'use strict';

    (window.AT ||= {}).recipediscoverydata = {
        infinitecraft: null,
        testRecipe: async function (first, second) {
            try {
                [first, second] = [first, second].map((s) =>
                    s.toLowerCase().replace(/(^|\s)\S/g, (match) => match.toUpperCase()) // Neal Case
                );
                const response = await fetch(
                    `https://neal.fun/api/infinite-craft/check?first=${first}&second=${second}&result=Nothing` // Request to do the thing
                );
                if (response.status === 500) return true; //  true if recipe doesn't exist
                return false; // false if anything else
            } catch {
                return undefined; // undefined if error
            }
        },
        start: function () {
            if (document.querySelector(".container").__vue__) { // Wait for Nuxt
                this.infinitecraft = document.querySelector(".container").__vue__;
                const ogGCR = this.infinitecraft.getCraftResponse;
                this.infinitecraft.getCraftResponse = async function () { // Patch getCraftReesponse
                    const firstRecipe = await window.AT.recipediscoverydata.testRecipe(arguments[0].text, arguments[1].text); // Check before /pair request
                    const response = await ogGCR.apply(this, arguments); // Do the original request
                    let recheck = false;
                    if (response.result === 'Nothing') {
                        recheck = await window.AT.recipediscoverydata.testRecipe(arguments[0].text, arguments[1].text); // Recheck for 'Nothing'
                    }
                    response.recipeNew = firstRecipe && !recheck; // Assign values
                    response.actuallyNothing = !(recheck === false);
                    // console.log(response); // Log it
                    return response; // And preserve original
                };
            } else {
                setTimeout(this.start.bind(this), 200);
            }
        }
    };
    window.AT.recipediscoverydata.start();
})();
