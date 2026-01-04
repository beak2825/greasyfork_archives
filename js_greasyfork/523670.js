// ==UserScript==
// @name        LitCharts unblur, allow selection, add links
// @namespace   Violentmonkey Scripts
// @match       https://www.litcharts.com/*
// @grant       none
// @version     1.4
// @author      CyrilSLi
// @description Unblur and allow text selection in blurred fields, add links to characters, themes, and symbols, remove LitCharts A+ ads
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/523670/LitCharts%20unblur%2C%20allow%20selection%2C%20add%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/523670/LitCharts%20unblur%2C%20allow%20selection%2C%20add%20links.meta.js
// ==/UserScript==

const classes = ["blurred", "blurred-text", "blur"];
const unblurRetry = setInterval(removeBlur, 100);
const styles = [
    "-webkit-touch-callout",
    "-webkit-user-select",
    "-khtml-user-select",
    "-moz-user-select",
    "-ms-user-select",
    "user-select"
];
const styleStr = "-webkit-touch-callout:default !important; -webkit-user-select:auto !important; -khtml-user-select:auto !important; -moz-user-select:auto !important; -ms-user-select:auto !important; user-select:auto !important;";

var charSymbolLinks = {};
var themeLinks = {};

function removeBlur() {
    var allElements = [];
    for (var i = 0; i < classes.length; i++) {
        var blurred = document.getElementsByClassName(classes[i]);
        allElements.push(...blurred);
        for (var j = 0; j < blurred.length; j++) {
            blurred[j].classList.remove(classes[i]);
        }
    }
    if (!allElements.length && document.readyState === "complete") {
        clearInterval(unblurRetry);
        console.log("Finished unblurring");
        allowSelect();
    }
}

function allowSelect() {
    var walker = document.createTreeWalker(
        document.documentElement,
        NodeFilter.SHOW_ELEMENT,
        el => {
            for (var i = 0; i < styles.length; i++) {
                if (getComputedStyle(el)[styles[i]] == "none") {
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
            return NodeFilter.FILTER_SKIP;
        }
    );
    var els = [];
    while (walker.nextNode()) {
        walker.currentNode.setAttribute("style", styleStr);
        els.push(walker.currentNode);
    }
    for (var i = 0; i < els.length; i++) {
        els[i].parentNode.replaceChild(els[i].cloneNode(true), els[i]);
    }
    console.log("Allowed selection");
    addLinks();
}

function addLinks() {
    // intentional misspelling of symbol as the website does the same
    [...document.querySelectorAll(".dropdown.characters > ul > li > a, .dropdown.simbols > ul > li > a")].forEach((el) => {
        charSymName = el.textContent.trim();
        if (charSymName.toLowerCase() != "all characters" && charSymName.toLowerCase() != "all symbols") {
            charSymbolLinks[charSymName] = el.href;
        }
    });
    [...document.querySelectorAll(".dropdown.themes > ul > li > a")].forEach((el) => {
        themeName = el.textContent.trim();
        if (themeName.toLowerCase() != "all themes") {
            themeLinks[themeName] = el.href;
        }
    });
    [...document.querySelectorAll("span.faux-link")].forEach((el) => {
        charSymName = el.textContent.trim();
        if (charSymName in charSymbolLinks) {
            linkEl = document.createElement("a");
            linkEl.textContent = el.textContent;
            linkEl.href = charSymbolLinks[charSymName];
            el.replaceWith(linkEl);
        }
    });
    [...document.querySelectorAll("div.theme-icon.medium")].forEach((el) => {
        el.parentNode.innerHTML = el.parentNode.innerHTML.trim().replace(/^<div/, "<a").replace(/\/div>$/, "/a>");
    });
    [...document.querySelectorAll("a.theme-icon.medium > img")].forEach((el) => {
        themeName = Object.keys(themeLinks).find((theme) => el.alt.includes(theme));
        if (themeName != undefined) {
            el.parentNode.href = themeLinks[themeName];
            el.title = themeName;
        }
        el.style.visibility = null;
        el.src = el.src.replace("litcharts.prod.litcharts.com/icons/", "assets.litcharts.com/icons/");
    });
    console.log("Added links");
    removeAds();
}

function removeAds() {
    document.querySelectorAll(".analysis-dialog, .analysis-text-dialog, .stretch-left-promo, .paywall-blocker, .hits__a-plus-dialog").forEach((el) => el.remove());
    console.log("Removed A+ Ads");
}