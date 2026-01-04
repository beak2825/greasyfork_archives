// ==UserScript==
// @name         IC Save Instances
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Makes Infinite Craft save instances
// @icon         https://i.imgur.com/WlkWOkU.png
// @author       @activetutorial on discord
// @match        https://neal.fun/infinite-craft/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523468/IC%20Save%20Instances.user.js
// @updateURL https://update.greasyfork.org/scripts/523468/IC%20Save%20Instances.meta.js
// ==/UserScript==

(function () {
    'use strict';
    (window.AT ||= {}).saveinstances = {
        infinitecraft: null,
        saveItems: function () {
            localStorage.setItem(
                "infinite-craft-data",
                JSON.stringify({
                    elements: this.elements,
                    instances: this.instances,
                    darkMode: this.isDarkMode,
                })
            );
        },
        loadInstances: function () {
            const savedItems = JSON.parse(
                localStorage.getItem("infinite-craft-data")
            );
            const instances = savedItems.instances;
            this.infinitecraft.instances = [];
            instances?.forEach(this.infinitecraft.duplicateInstance);
        },
        start: function () {
            if (document.querySelector(".container").__vue__) { // Wait for Nuxt
                this.infinitecraft = document.querySelector(".container").__vue__;
                this.infinitecraft.saveItems = this.saveItems;
                this.loadInstances();
                const originalPlay = window.Howl.prototype.play;
                window.Howl.prototype.play = function(...args) {
                    const result = originalPlay.apply(this, args);
                    window.AT.saveinstances.infinitecraft.saveItems();
                    return result;
                };
                const originalDropElement = this.infinitecraft.dropElement;
                this.infinitecraft.dropElement = function(...args) {
                    const result = originalDropElement.apply(this, args);
                    window.AT.saveinstances.infinitecraft.saveItems();
                    return result;
                }
            } else {
                setTimeout(this.start.bind(this), 200);
            }
        }
    };
    window.AT.saveinstances.start();
})();
