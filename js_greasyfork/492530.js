// ==UserScript==
// @name         [AO3] Spice Meter
// @namespace    https://greasyfork.org/en/users/1138163-dreambones
// @version      1.0
// @description  Highlight NSFW tags and display/hide "spicy" fanfics in search results based on preferences.
// @author       DREAMBONES
// @match        http*://archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492530/%5BAO3%5D%20Spice%20Meter.user.js
// @updateURL https://update.greasyfork.org/scripts/492530/%5BAO3%5D%20Spice%20Meter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const spiceLevels = {"Any": -1, "None": 0, "Mild": 1, "Moderate": 2, "Spicy": 3}
    const threshold = ["≤", "=", "≥"]

    // Edit the values inside the lists here if you want to change what counts as "spicy." Values in the lists are REGULAR EXPRESSIONS but you can just put plain words to match if you're unfamiliar with regex.
    const spicyRe = {
        // Mild: Anything suggestive/NSFW that isn't yet/inherently explicit.
        "Mild": [/sexting/, /slut/, /dirty talk/, /dom\/sub/, /degradation/, /(kink|fetish)/, / play$/, /spanking/, /^(bottom|top|sub|dom) /, /macro\/micro/, /friends with benefits/, /aftercare/, /alpha\/beta\/omega/,
                 /watersports/, /condom/, /horny/, /sexual tension/, /aphrodisiacs/],
        // Moderate: Anything more explicit that isn't outright sex.
        "Moderate": [/sexual content/, /masturbat(ion|ing)/, /bdsm/, /bondage/, /sex (toys|pollen|machines|tapes)/, /knotting/, /humping/,
                    /penis|cock/, /(?<!no )(smut|porn)/, /frott(age|ing)/, /cum/, /sex work/, /face-?sitting/, /voyeurism/, /exhibitionism/],
        // Spicy: Yeah, that's sex.
        "Spicy": [/cunnilingus/, /loss of virginity/, /penetration/, /sex$/, /(three|four|five)some/, /pegging/, /(breed|mat)ing/, /strap-ons/, /squirting/, /creampie/, /orgy/, /^nsfw$/, /rape/, /orgasm/, /(-|\w)fucking/,
                 /deep ?throat/, /(fist|finger)ing/, /rimming/, /(hand|blow) ?job/]
    }
    // Terms that make a tag default to being "Mild" on the spice meter.
    const waterRe = [/implied/, /past/, /no(n-|t )explicit/, /eventual/, /mention/]
    // Terms that make a tag no longer "spicy."
    const milkRe = /(non-sexual|no )/i;

    var setSpice = localStorage.setSpice || "Any";
    var setThreshold = localStorage.setThreshold || "=";

    const domainRe = /https?:\/\/archiveofourown\.org\/(works|tags|users).*/i;
    if (domainRe.test(document.URL)) {
        const worksQuery = "ol.work.index.group, ol.bookmark.index.group, ul.index.group, #user-series > ol.index.group";
        const worksList = document.querySelectorAll(worksQuery);
        var workSpice = {}
        for (let section of worksList) {
            for (let work of section.children) {
                workSpice[work.id] = 0;
                const freeforms = work.querySelectorAll("li.freeforms > a");
                for (let tag of freeforms) {
                    for (let level in spicyRe) {
                        for (let re of spicyRe[level]) {
                            re = new RegExp(re, "i");
                            if (re.test(tag.innerHTML) && !milkRe.test(tag.innerHTML)) {
                                tag.style["background-color"] = "#ff4b82";
                                tag.style.color = "white";
                                if (spiceLevels[level] > workSpice[work.id]) { workSpice[work.id] = spiceLevels[level] }
                                for (let water of waterRe) {
                                    water = new RegExp(water, "i");
                                    if (water.test(tag.innerHTML)) { workSpice[work.id] = 1; }
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
        createMenu();
        const spiceSetting = document.querySelector(`#spice-meter input#spice-level-${setSpice.toLowerCase()}`);
        spiceSetting.click();
        const thresholdSetting = document.querySelector(`#spice-meter input[type="button"][value="${setThreshold}"]`);
        thresholdSetting.click();
    }

    function createMenu() {
        const filters = document.querySelector("form.filters");
        var container = document.createElement("div");
        container.id = "spice-meter";
        container.style.background = "linear-gradient(to right,  #ffa756, #ff744b, #ff4b82)";
        container.style.margin = "0.643em";
        container.style.padding = "0.643em";
        container.style.color = "#320244";
        container.style.border = "2px solid #991e69";
        var heading = document.createElement("h3");
        heading.innerText = "Spice Meter";
        heading.style["font-family"] = "sans-serif";
        heading.style.color = "white";
        heading.style.background = "#320244";
        heading.style.margin = "-0.643em -0.5em 0.25em";
        heading.style.padding = "0.643em";
        container.appendChild(heading);
        for (let level in spiceLevels) {
            var input = document.createElement("input");
            input.id = `spice-level-${level.toLowerCase()}`;
            input.name = "spice-meter";
            input.type = "radio";
            input.value = level;
            input.addEventListener("click", function() { setSpiceLevel(level); });
            input.style.width = "initial";
            input.style.height = "initial";
            input.style.position = "initial";
            input.style.margin = "0.5em";
            var label = document.createElement("label");
            label.htmlFor = `spice-level-${level.toLowerCase()}`;
            label.innerText = level;
            container.appendChild(input);
            container.appendChild(label);
        }
        for (let level of threshold) {
            var button = document.createElement("input");
            button.type = "button";
            button.value = level;
            button.addEventListener("click", function() { setThresholdLevel(level); });
            container.appendChild(button);
        }
        filters.insertBefore(container, filters.firstElementChild);
    }

    function setSpiceLevel(level) {
        localStorage.setSpice = level;
        setSpice = localStorage.setSpice;
        if (level == "Any") {
            toggleButton("≤", "disable");
            toggleButton("=", "disable");
            toggleButton("≥", "disable");
            selectButton(); // Removing the selection visual.
        }
        else if (level == "None") {
            toggleButton("≤", "disable");
            toggleButton("=", "enable");
            toggleButton("≥", "enable");
            if (setThreshold == "≤") { setThresholdLevel("="); }
            selectButton(setThreshold);
        }
        else if (level == "Mild") {
            toggleButton("≤", "enable");
            toggleButton("=", "enable");
            toggleButton("≥", "enable");
            selectButton(setThreshold);
        }
        else if (level == "Moderate") {
            toggleButton("≤", "enable");
            toggleButton("=", "enable");
            toggleButton("≥", "enable");
            selectButton(setThreshold);
        }
        else if (level == "Spicy") {
            toggleButton("≤", "enable");
            toggleButton("=", "enable");
            toggleButton("≥", "disable");
            if (setThreshold == "≥") { setThresholdLevel("="); }
            selectButton(setThreshold);
        }
        sortWorks();
    }

    function setThresholdLevel(level) {
        localStorage.setThreshold = level;
        setThreshold = localStorage.setThreshold;
        selectButton(level);
        sortWorks();
    }

    function toggleButton(value, action) {
        const button = document.querySelector(`#spice-meter input[type="button"][value="${value}"]`);
        if (action == "enable") { button.disabled = false; }
        else if (action == "disable") { button.disabled = true; }
    }

    function selectButton(value) {
        const buttons = document.querySelectorAll("#spice-meter input[type='button']");
        for (let button of buttons) {
            if (button.value == value) {
                button.style.background = "#320244";
                button.style.color = "white";
            }
            else {
                button.style.removeProperty("background");
                button.style.color = "#320244";
            }
        }
    }

    function sortWorks() {
        const intensity = spiceLevels[setSpice];
        const threshold = setThreshold;
        for (let id in workSpice) {
            const work = document.querySelector(`li#${id}`);
            if (intensity != -1) {
                if (threshold == "≤") {
                    if (workSpice[id] <= intensity) { work.style.display = "block"; }
                    else { work.style.display = "none"; }
                }
                else if (threshold == "=") {
                    if (workSpice[id] == intensity) { work.style.display = "block"; }
                    else { work.style.display = "none"; }
                }
                else if (threshold == "≥") {
                    if (workSpice[id] >= intensity) { work.style.display = "block"; }
                    else { work.style.display = "none"; }
                }
            }
            else { work.style.display = "block"; }
        }
    }
})();