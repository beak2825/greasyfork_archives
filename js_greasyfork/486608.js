// ==UserScript==
// @name         Map labeler
// @namespace    Ziticca Script Library
// @version      0.4
// @description  Displayes territory names on city map
// @author       Ziticca
// @license      Copyright Ziticca
// @match        https://www.torn.com/city.php
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/486608/Map%20labeler.user.js
// @updateURL https://update.greasyfork.org/scripts/486608/Map%20labeler.meta.js
// ==/UserScript==

/* jshint esversion:9 */

// Usage of this script without permission is prohibited

(function() {
    'use strict';
    const mapLoaderNode = document.querySelector("#map .map-loader-wp");
    let initialZoom = 1;

    let idAndName = {};

    const nameTerritories = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.attributeName === "style") {
                const textContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");
                textContainer.setAttribute("class", "ttTextContainer");
                if (mutation.target.attributes.style.value === "display: none;") {
                    const mapSvg = document.querySelector("svg.leaflet-zoom-hide")
                    observer.observe(mapSvg, { attributes: true });
                    const mapTerritoryGroup = document.querySelector("svg.leaflet-zoom-hide g");
                    const ttPaths = document.querySelectorAll("path.territory");
                    initialZoom = Number(mapSvg.getAttribute("width")) / 782;
                    if (unsafeWindow.territories_shapes) {
                        for (const tt of unsafeWindow.territories_shapes) {
                            idAndName[tt[4].toString()] = tt[9];
                        }
                        for (const ttPath of ttPaths) {
                            const coords = ttPath.getBBox();
                            const x = coords.x + coords.width / 2 - 3*initialZoom;
                            const y = coords.y + coords.height / 2;
                            const boxContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");
                            boxContainer.setAttribute("style", "pointer-events: none;");
                            const textBox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                            textBox.setAttribute("x", x-initialZoom/2);
                            textBox.setAttribute("rx", "2px");
                            textBox.setAttribute("y", y-(1.5*initialZoom));
                            textBox.setAttribute("height", 2*initialZoom);
                            textBox.setAttribute("width", 5*initialZoom);
                            textBox.setAttribute("style", "fill: black; stroke: white;");
                            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                            text.setAttribute("x", x);
                            text.setAttribute("y", y);
                            text.setAttribute("textLength", 4*initialZoom);
                            text.setAttribute("tt_id", ttPath.getAttribute("db_id"));
                            text.setAttribute("style", `fill: white; font-weight: bold; font-size: ${1.5*initialZoom}px;`);
                            text.innerHTML = idAndName[ttPath.getAttribute("db_id")];
                            boxContainer.appendChild(textBox);
                            boxContainer.appendChild(text);
                            textContainer.appendChild(boxContainer);
                            ttPath.addEventListener("mouseenter", (e) => {
                                boxContainer.remove()
                                textContainer.appendChild(boxContainer);
                            })
                        }
                        mapTerritoryGroup.appendChild(textContainer);
                    }
                } else {
                    const mapSvg = document.querySelector("svg.leaflet-zoom-hide")
                    const textCont = mapSvg.querySelector("g.ttTextContainer")
                    const zoomLevel = Number(mapSvg.getAttribute("width")) / 782 / initialZoom;
                    if (textCont) {
                        textCont.setAttribute("transform", `matrix(${zoomLevel} 0 0 ${zoomLevel} 0 0)`);
                    }
                }
            }
        }
    }

    const observer = new MutationObserver(nameTerritories)

    const initFunc = function() {
        observer.observe(mapLoaderNode, { attributes: true });
    }

    document.readyState == "complete" ? initFunc() : window.addEventListener('load', initFunc)
})();