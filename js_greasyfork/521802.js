// ==UserScript==
// @name         IC save API recipes
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license      MIT
// @description  Save recipes in IC Helper when using API in console
// @icon         https://i.imgur.com/WlkWOkU.png
// @author       @activetutorial on discord
// @match        https://neal.fun/infinite-craft/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521802/IC%20save%20API%20recipes.user.js
// @updateURL https://update.greasyfork.org/scripts/521802/IC%20save%20API%20recipes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (window.AT ||= {}).saveapirecipesdata = {
        ogFetch: null,
        start: function () {
            if (document.querySelector('.settings-content')) { // Wait for IC Helper
                this.infinitecraft = window.$nuxt.$root.$children[1].$children[0].$children[0];
                this.ogFetch = window.fetch;
                window.fetch = async function (...args) {
                    const response = window.AT.saveapirecipesdata.ogFetch.apply(this, args);
                    setTimeout(async () => {
                        try{
                            if (args[0] && args[0].split("?")[0] === "https://neal.fun/api/infinite-craft/pair" && !(args[1] && args[1].signal)) {
                                const first = decodeURIComponent(args[0].split("?")[1].split("&")[0].split("=")[1]);
                                const second = decodeURIComponent(args[0].split("?")[1].split("&")[1].split("=")[1]);
                                const clonedResponse = (await response).clone();
                                const result = await clonedResponse.json();
                                await window.addElementToCrafts({
                                    text: first,
                                    emoji: "⬜",
                                }, {
                                    text: second,
                                    emoji: "⬜",
                                }, result.result);
                                // console.log("It works!");
                            }
                        } catch (error) {
                            console.error("Failed to add recipe to IC Helper", error);
                        }
                    }, 0);
                    return response;
                }
            } else {
                setTimeout(this.start.bind(this), 200);
            }
        }
    };
    window.AT.saveapirecipesdata.start();

})();