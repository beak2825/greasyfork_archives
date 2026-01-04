// ==UserScript==
// @name         Inventory color display
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Implement color BG for inventory stuff
// @author       Ophelia D
// @match        https://mmolb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mmolb.com
// @grant        none
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/547483/Inventory%20color%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/547483/Inventory%20color%20display.meta.js
// ==/UserScript==

const batting_attributes = ["Aiming", "Contact", "Cunning", "Determination", "Discipline", "Insight", "Intimidation", "Lift", "Muscle", "Selflessness", "Vision", "Wisdom", "Stealth", "Speed", "Greed", "Performance"];
const pitching_attributes = ["Accuracy", "Control", "Defiance", "Guts", "Persuasion", "Presence", "Rotation", "Stamina", "Stuff", "Velocity"];

(function() {
    'use strict';

    function waitUntilElementIsRendered(elementOrSelector, timeout) {
        timeout = typeof timeout === "number" ? timeout : 10000;

        const waitForElement = (resolve) => {
            const startTime = window.performance.now();

            const checkElement = () => {
                if (window.performance.now() - startTime >= timeout) {
                    resolve(null); return;
                }

                const element = typeof elementOrSelector === "string" ? document.querySelector(elementOrSelector) : elementOrSelector;
                if (element.innerHTML) {
                    resolve(element); return;
                }

                window.requestAnimationFrame(checkElement);
            };
            window.requestAnimationFrame(checkElement);
        };

        return new Promise(waitForElement);
    }

    function removeStyles(el) {
        el.removeAttribute('style');

        if(el.childNodes.length > 0) {
            for(let child in el.childNodes) {
                /* filter element nodes only */
                if(el.childNodes[child].nodeType == 1) {
                    removeStyles(el.childNodes[child]);
                }
            }
        }
    }

    function processChildrenNode(children) {
        console.log(children);
        let stat_childrens = children.getElementsByClassName("text-yellow-400");
        if(stat_childrens.length == 0) {
            stat_childrens = children.getElementsByClassName("text-blue-400");
        }
        let current_potential = 0;
        let theorically_maximum_potential = 0;
        let has_batting_attribute = false;
        let has_pitching_attribute = false;
        for(let stat_children of stat_childrens) {
            let number = stat_children.getElementsByClassName("font-semibold")[0].innerText.slice(1).trim();
            let type = stat_children.getElementsByClassName("opacity-80")[0].innerText.trim();

            if(batting_attributes.includes(type)) {
                has_batting_attribute = true;
            }

            if(pitching_attributes.includes(type)) {
                has_pitching_attribute = true;
            }

            if(number.includes("%")) {
                current_potential += (number.slice(0, -1) - 8);
                theorically_maximum_potential += 7;
            } else {
                current_potential += (number-5);
                theorically_maximum_potential += 15;
            }
        }
        const item_efficiency = current_potential/theorically_maximum_potential;
        children.style.backgroundColor=getColorByPerc(item_efficiency*100);
        if(has_pitching_attribute && has_batting_attribute) {
            children.style.color="red";
        }
    }

    function refreshBackgroundColor() {
        const grid = document.querySelector("div.grid");
        for(let children of grid.children) {
            removeStyles(children);
            processChildrenNode(children);
        }
        const player_inventories = document.querySelector("div.mt-4").getElementsByClassName("relative group");
        for(let player_object of player_inventories) {
            removeStyles(player_object);
            processChildrenNode(player_object);
        }
    }

    function runOnInventory() {
        const grid = document.querySelector("div.grid");
        const inventory = document.querySelector("div.mt-4");

        console.log(grid);
        const observer = new MutationObserver((mutations) => {
            refreshBackgroundColor();
        });

        observer.observe(grid, {
            childList: true,
            subtree: true
        });

        observer.observe(inventory, {
            childList: true,
            subtree: true
        });
    }

    function getColorByPerc(perc) {
        let r, g, b = 0;
        const value = Math.round(255 * 0.35);
        if(perc < 50) {
            r = value;
            g = Math.round(value*0.02 * perc);
        }
        else {
            g = value;
            r = Math.round((value*2) - (value*0.02*perc));
        }
        const h = r * 0x10000 + g * 0x100 + b * 0x1;
        return '#' + ('000000' + h.toString(16)).slice(-6);
    }

    function onUrlChange() {
        if (location.pathname.startsWith('/manage-team/inventory')) {
            waitUntilElementIsRendered("main").then(runOnInventory);
        }
    }

    if (self.navigation) {
        self.navigation.addEventListener('navigatesuccess', onUrlChange);
    } else {
        let u = location.href;
        new MutationObserver(() => u !== (u = location.href) && onUrlChange())
            .observe(document, {subtree: true, childList: true});
    }

    onUrlChange();
})();