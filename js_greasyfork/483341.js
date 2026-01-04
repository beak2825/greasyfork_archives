// ==UserScript==
// @name         YTSpeed+
// @version      1.0.0
// @description  Provides an improved speed changer for YouTube
// @author       @charlesbobomb (Discord)
// @match        http*://www.youtube.com/watch*
// @icon64       data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAACiElEQVR4nO3ZvU5UURSG4RdFE+QSUEu9C1sLCy5A6Uy8EtRSwViReAcEC0y0k0ugIwIJBbWNFiQmY8FMmDmcn7X3Xt/aU5yVnIZM8s37ZAgJA+ONN954i7cKHALPg/ZeA5+B+0F7g7cBTIArYDNgb3+695UlQXjM9RuaAP+Al+K9g7m978CaeG/w5gEiEOYBlgKhCaBGaAJUR2gDUCK0AVRF6AJQIXQBVEPoA1Ag9AFUQRgCmCG8ctobAghHsAB4IlgAJsAPghCsAF4IVoAwhBQAD4QUgBCEVIBShFQAOUIOQAlCDoAUIRcgFyEXQIZQApCDUAIgQSgFSEUoBXBH8ABIQfAAcEXwArAieAG4IXgCWBA8AVwQvAGGELwBihEUADOErSCACfATWF8mgC4EFUA2ghKgDUEJkIWgBmgiqAF6EVZTZBzvLvAlcO8Z8A14AfwZenHEJ2D2XAEngXufLFqRANHPZTP2jkVEfL8Dt46bP6gNsAMcBW1dAG8sL4z6Fdie7kX8FfgFPLQ5xQBsc3NqgKT4CID5eDVAcrwa4G3LngrgNCdeCdAWrwI4BR7lxKsAuuIVAEXxCoC+eG+A4njwBXhn2PMCcIkHPwBLPPgAuMWDD4A1HsoBXOOhHCAlHsoA3OOhDCA1HvIBJPGQD/A+cy8H4AxRPOQB5MZDOsDZ9D3KLhXgA7BSsJcCII+HNIDSeLADhMSDHeAj5fFgAwiLBxuAVzwMA4TGwzCAZzz0A5wTHA/9AN7x0A1QJR66ARTx0A5QLR7aAXbQxMNtgKrxcBtAGQ+LANXjYRFgD/13BzOAS+CJeMt068BfYJeYL052uf7v7dOALfM9CNy6N33GG2+88cLvP3CmutKKbbx2AAAAAElFTkSuQmCC
// @grant        none
// @license      MPL-2.0
// @namespace    charlesbobomb
// @downloadURL https://update.greasyfork.org/scripts/470633/YTSpeed%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/470633/YTSpeed%2B.meta.js
// ==/UserScript==
function waitForElement(guaranteedParent, selector) {
    /**
        Waits for a given element to exist.
        @param {Element} guaranteedParent - A parent that will always exist (to be watched)
        @param {string} selector - A CSS selector for the element to wait for
    **/
    return new Promise(resolve => {
        const o = new MutationObserver(() => { // watch for descendants being added
            let el = document.querySelector(selector);
            if (el) {
                resolve(el || null);
                o.disconnect(); // stop watching
            }
        });
        o.observe(guaranteedParent || document.body, {
            childList: true,
            subtree: true
        });
    });
}

(function() {
    'use strict';
    const container = document.createElement("div");
    container.id = "ytspeed-container";
    container.innerHTML = '<p class="bold" style="font-size:2rem">YTSpeed+</p><input type="range" min="0.1" max="8" value="1" step="0.1" id="ytspeed-slider" list="ytspeed-list">'+
        '<datalist id="ytspeed-list" display="none"><option value="0.5"></option><option value="1"></option><option value="2"></option><option value="4"></option><option value="8"></option></option></datalist>'+
        '<p id="ytspeed-label">1x</p><label for="ytspeed-pitch">Preserve pitch</label><input type="checkbox" id="ytspeed-pitch" checked><a id="ytspeed-url" target="_blank" href="https://greasyfork.org/en/scripts/470633">about</a>';
    const style = document.createElement("style");
    style.innerText = `
    #ytspeed-container {font-size:1.2rem;}
    #ytspeed-container{background:var(--yt-spec-badge-chip-background);width:75%;padding:3vh;margin:3vh auto;border-radius:12px;text-align:center;}
    #ytspeed-label{margin-bottom:1vh;}
    #ytspeed-slider{width:100%;margin-top:1vh;background:transparent;height:2vh;}

    #ytspeed-slider::-moz-range-track{background:var(--yt-spec-10-percent-layer);}
    #ytspeed-slider::-webkit-slider-runnable-track{background:var(--yt-spec-10-percent-layer);}

    #ytspeed-slider::-moz-range-thumb{background:var(--yt-spec-themed-blue);height:12px;width:12px;transition:.1s;border:transparent;border-radius:50%;}
    #ytspeed-slider::-webkit-slider-thumb{background:var(--yt-spec-themed-blue);height:12px;width:12px;transition:.1s;border:transparent;border-radius:50%;}
    #ytspeed-slider:hover::-moz-range-thumb{height:18px;width:18px;}
    #ytspeed-slider:hover::-webkit-slider-thumb{height:18px;width:18px;}
    #ytspeed-slider::-moz-range-progress{background:var(--yt-spec-themed-blue);}
    #ytspeed-url {margin-top:1vh;color:var(--yt-spec-themed-blue);display:block;}

    `; // various styles

    document.head.appendChild(style);
    let slider = container.querySelector("#ytspeed-slider"),
        label = container.querySelector("#ytspeed-label"),
        pitch = container.querySelector("#ytspeed-pitch");

    waitForElement(null, "#bottom-row").then(e => { // make sure the element immediately below the container exists
        e.insertAdjacentElement("beforebegin", container);
        const video = document.querySelector("video");
        const observer = new MutationObserver((changes)=> { // resets the speed & stuff when the video changes (doesn't reload bottom part of video)
            changes.forEach(function(mutation) {
                if (mutation.type === "attributes" && mutation.attributeName === "src") {
                    pitch.checked = true;
                    video.preservesPitch = true;
                    slider.value = 1;
                    video.playbackRate = 1;
                    label.innerText = "1x";
                }
            });
        });
        observer.observe(video, {
            attributes: true
        });
        pitch.onchange = () => { video.preservesPitch = pitch.checked; }; // "Preserves pitch" checkbox
        slider.oninput = () => { video.playbackRate = parseFloat(slider.value);label.innerText = slider.value + "x"; }; // Slider
    });
})();