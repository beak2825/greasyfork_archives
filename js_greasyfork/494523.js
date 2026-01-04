// ==UserScript==
// @name         Lichess custom theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds new themes
// @author       Prateek Saini
// @match        https://lichess.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lichess.org
// @grant        GM_addStyle
// @grant        GM_addElement
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494523/Lichess%20custom%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/494523/Lichess%20custom%20theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var defaultLightColor = "#eae9d2";
    var defaultDarkColor = "#4b7399";
    var lightColorKey = "tm.customTheme.lightColor";
    var darkColorKey = "tm.customTheme.darkColor";
    var lightColorClassName = "tmLightColor";
    var darkColorClassName = "tmDarkColor";
    var themeName = "blue3";

    function getThemeStyles(lightColor, darkColor) {
        const svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:x="http://www.w3.org/1999/xlink"
                 viewBox="0 0 8 8" shape-rendering="crispEdges">
            <g id="a">
              <g id="b">
                <g id="c">
                  <g id="d">
                    <rect width="1" height="1" fill="${lightColor}" id="e"/>
                    <use x="1" y="1" href="#e" x:href="#e"/>
                    <rect y="1" width="1" height="1" fill="${darkColor}" id="f"/>
                    <use x="1" y="-1" href="#f" x:href="#f"/>
                  </g>
                  <use x="2" href="#d" x:href="#d"/>
                </g>
                <use x="4" href="#c" x:href="#c"/>
              </g>
              <use y="2" href="#b" x:href="#b"/>
            </g>
            <use y="4" href="#a" x:href="#a"/>
            </svg>`;

        let encodedSVG = encodeURIComponent(svg);

        // return style for board image and icon
        return `
        body[data-board=${themeName}] .is2d cg-board::before {
          background-image:url("data:image/svg+xml;text,${encodedSVG}") !important;
        }

        #dasher_app .board.d2 .${themeName} {
          background-image:url("data:image/svg+xml;text,${encodedSVG}") !important;
          background-size:256px !important;
        }`;
    }

    function updateTheme() {
        let lightColor = document.getElementById(lightColorClassName).value;
        let darkColor = document.getElementById(darkColorClassName).value;

        let css = getThemeStyles(lightColor, darkColor);
        addedStyleElement.innerHTML = css;

        localStorage.setItem(lightColorKey, lightColor);
        localStorage.setItem(darkColorKey, darkColor);
    }

    // Set defaults
    if( localStorage.getItem(lightColorKey) === null ) {
        localStorage.setItem(lightColorKey, defaultLightColor);
    }
    if( localStorage.getItem(darkColorKey) === null ) {
        localStorage.setItem(darkColorKey, defaultDarkColor);
    }

    var lightColor = localStorage.getItem(lightColorKey);
    var darkColor = localStorage.getItem(darkColorKey);

    // Add theme buttons
    let buttonsDiv = document.getElementsByClassName("site-buttons")[0];
    let lightPickerElement = GM_addElement(buttonsDiv, "input", {
        id: lightColorClassName,
        type: "color",
        value: lightColor
    });
    let darkPickerElement = GM_addElement(buttonsDiv, "input", {
        id: darkColorClassName,
        type: "color",
        value: darkColor
    });
    lightPickerElement.addEventListener("input", updateTheme, false);
    darkPickerElement.addEventListener("input", updateTheme, false);

    var addedStyleElement = GM_addStyle(getThemeStyles(lightColor, darkColor));
})();
