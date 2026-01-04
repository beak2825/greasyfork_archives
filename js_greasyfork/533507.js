// ==UserScript==
// @name         JetBrainsDirectLink
// @namespace    https://www.jetbrains.com/
// @version      1.0
// @description  Direct download link buttons
// @author       You
// @match        https://www.jetbrains.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jetbrains.com
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533507/JetBrainsDirectLink.user.js
// @updateURL https://update.greasyfork.org/scripts/533507/JetBrainsDirectLink.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const path = window.location.pathname.split("/").filter(p => p.length > 0);
    if (path.length !== 2 || path[1] !== "download") return;

    const systems = ["windows", "macos", "linux"];

    let processDownloads = (downloads) => {
        const buttons = systems.reduce((map, name) => (map[name] = document.querySelector(`a[href*="download-thanks.html?platform=${name.substr(0, 3)}"]`), map), {});
        const elements = systems.reduce((map, name) => (map[name] = [document.createElement('br')], map), {});
        for (const target in downloads) {
            const system = systems.find(system => target.startsWith(system.substr(0, 3)));
            if (!system) continue;
            const button = document.createElement('a');
            button.setAttribute('href', downloads[target].link);
            button.text = `Download (${target})`;
            elements[system].push(button);
            elements[system].push(document.createElement('br'));
        }
        for (const system of systems) {
            const elementArray = elements[system];
            if (elementArray.length < 2) continue;
            let nextElement = buttons[system];
            while (!nextElement.parentNode.className.includes('__block'))
                nextElement = nextElement.parentNode;
            for (const element of elementArray) {
                nextElement.parentNode.insertBefore(element, nextElement);
                nextElement = element;
            }
        }
    }

    const openFn = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...args) {
        if (args.length > 1 && typeof args[1] === "string" &&
            args[1].startsWith("https://data.services.jetbrains.com/products/releases")) {
            XMLHttpRequest.prototype.open = openFn;
            fetch(args[1]).then(response => response.json().then(json => {
                const process = processDownloads;
                if (process != null) {
                    processDownloads = null;
                    process(json[Object.keys(json)[0]][0].downloads);
                }
            }));
        }
        return openFn.apply(this, args);
    }
})();