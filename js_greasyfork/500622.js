// ==UserScript==
// @name         Video Enhancer with Advanced Control Panel
// @namespace    http://tampermonkey.net/
// @version      1.4
// @author       UMATTER
// @description  Enhances your video by applying filter to it with a control panel and additional features.
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500622/Video%20Enhancer%20with%20Advanced%20Control%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/500622/Video%20Enhancer%20with%20Advanced%20Control%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // SVG Filters
    const svgFilters = `
        <svg id="svgfilters" aria-hidden="true" style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
                <filter id="none"></filter>
                <filter id="turbulence">
                    <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="turbulence_3" data-filterId="3" />
                    <feDisplacementMap xChannelSelector="R" yChannelSelector="G" in="SourceGraphic" in2="turbulence_3" scale="25" />
                </filter>
                <filter id="squiggly">
                    <feTurbulence id="turbulence1" baseFrequency="0.02" numOctaves="3" result="noise" seed="0" />
                    <feDisplacementMap id="displacement" in="SourceGraphic" in2="noise" scale="6" />
                </filter>
                <filter id="squiggly-1">
                    <feTurbulence id="turbulence2" baseFrequency="0.02" numOctaves="3" result="noise" seed="1" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
                </filter>
                <filter id="squiggly-2">
                    <feTurbulence id="turbulence3" baseFrequency="0.02" numOctaves="3" result="noise" seed="2" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
                </filter>
                <filter id="squiggly-3">
                    <feTurbulence id="turbulence4" baseFrequency="0.02" numOctaves="3" result="noise" seed="3" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
                </filter>
                <filter id="squiggly-4">
                    <feTurbulence id="turbulence5" baseFrequency="0.02" numOctaves="3" result="noise" seed="4" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
                </filter>
            </defs>
        </svg>
    `;
    document.body.insertAdjacentHTML('beforeend', svgFilters);

    // Initialization
    const htmlElement = window.document.documentElement;
    let defaultEnhancerActive = GM_getValue('defaultEnhancerActive', false);
    let saturateValue = GM_getValue('saturateValue', 1.3);
    let brightnessValue = GM_getValue('brightnessValue', 1);
    let contrastValue = GM_getValue('contrastValue', 1);

    function setFilterOnElement(element) {
        if (defaultEnhancerActive) {
            element.style.filter = `saturate(${saturateValue}) brightness(${brightnessValue}) contrast(${contrastValue})`;
        } else {
            element.style.filter = "none";
        }
    }

    function toggleEnhancer() {
        defaultEnhancerActive = !defaultEnhancerActive;
        GM_setValue('defaultEnhancerActive', defaultEnhancerActive);
        setFilterOnElement(htmlElement);
        if (fullscreenElement) {
            setFilterOnElement(fullscreenElement);
        }
        alert(`Video Enhancer is now ${defaultEnhancerActive ? 'ON' : 'OFF'}`);
    }

    function createControlPanel() {
        const controlPanel = document.createElement('div');
        controlPanel.style.position = 'fixed';
        controlPanel.style.bottom = '10px';
        controlPanel.style.right = '10px';
        controlPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        controlPanel.style.color = 'white';
        controlPanel.style.padding = '10px';
        controlPanel.style.borderRadius = '5px';
        controlPanel.style.zIndex = '10000';
        controlPanel.innerHTML = `
            <button id="toggleEnhancerBtn">Toggle Enhancer</button>
            <br/>
            <label>Saturate: <input type="range" id="saturateRange" min="1" max="3" step="0.1" value="${saturateValue}"><input type="number" id="saturateNumber" min="1" max="3" step="0.1" value="${saturateValue}" style="width: 50px; margin-left: 10px;"></label>
            <br/>
            <label>Brightness: <input type="range" id="brightnessRange" min="0.5" max="2" step="0.1" value="${brightnessValue}"><input type="number" id="brightnessNumber" min="0.5" max="2" step="0.1" value="${brightnessValue}" style="width: 50px; margin-left: 10px;"></label>
            <br/>
            <label>Contrast: <input type="range" id="contrastRange" min="0.5" max="2" step="0.1" value="${contrastValue}"><input type="number" id="contrastNumber" min="0.5" max="2" step="0.1" value="${contrastValue}" style="width: 50px; margin-left: 10px;"></label>
            <br/>
            <button id="exportPresetBtn">Export Preset</button>
            <button id="importPresetBtn">Import Preset</button>
            <input type="file" id="presetFileInput" style="display: none;">
        `;
        document.body.appendChild(controlPanel);

        document.getElementById('toggleEnhancerBtn').addEventListener('click', toggleEnhancer);

        const saturateRange = document.getElementById('saturateRange');
        const saturateNumber = document.getElementById('saturateNumber');
        saturateRange.addEventListener('input', (e) => {
            saturateValue = e.target.value;
            saturateNumber.value = saturateValue;
            GM_setValue('saturateValue', saturateValue);
            if (defaultEnhancerActive) {
                setFilterOnElement(htmlElement);
                if (fullscreenElement) {
                    setFilterOnElement(fullscreenElement);
                }
            }
        });
        saturateNumber.addEventListener('input', (e) => {
            saturateValue = e.target.value;
            saturateRange.value = saturateValue;
            GM_setValue('saturateValue', saturateValue);
            if (defaultEnhancerActive) {
                setFilterOnElement(htmlElement);
                if (fullscreenElement) {
                    setFilterOnElement(fullscreenElement);
                }
            }
        });

        const brightnessRange = document.getElementById('brightnessRange');
        const brightnessNumber = document.getElementById('brightnessNumber');
        brightnessRange.addEventListener('input', (e) => {
            brightnessValue = e.target.value;
            brightnessNumber.value = brightnessValue;
            GM_setValue('brightnessValue', brightnessValue);
            if (defaultEnhancerActive) {
                setFilterOnElement(htmlElement);
                if (fullscreenElement) {
                    setFilterOnElement(fullscreenElement);
                }
            }
        });
        brightnessNumber.addEventListener('input', (e) => {
            brightnessValue = e.target.value;
            brightnessRange.value = brightnessValue;
            GM_setValue('brightnessValue', brightnessValue);
            if (defaultEnhancerActive) {
                setFilterOnElement(htmlElement);
                if (fullscreenElement) {
                    setFilterOnElement(fullscreenElement);
                }
            }
        });

        const contrastRange = document.getElementById('contrastRange');
        const contrastNumber = document.getElementById('contrastNumber');
        contrastRange.addEventListener('input', (e) => {
            contrastValue = e.target.value;
            contrastNumber.value = contrastValue;
            GM_setValue('contrastValue', contrastValue);
            if (defaultEnhancerActive) {
                setFilterOnElement(htmlElement);
                if (fullscreenElement) {
                    setFilterOnElement(fullscreenElement);
                }
            }
        });
        contrastNumber.addEventListener('input', (e) => {
            contrastValue = e.target.value;
            contrastRange.value = contrastValue;
            GM_setValue('contrastValue', contrastValue);
            if (defaultEnhancerActive) {
                setFilterOnElement(htmlElement);
                if (fullscreenElement) {
                    setFilterOnElement(fullscreenElement);
                }
            }
        });

        document.getElementById('exportPresetBtn').addEventListener('click', () => {
            const preset = {
                saturateValue: saturateValue,
                brightnessValue: brightnessValue,
                contrastValue: contrastValue,
            };
            const blob = new Blob([JSON.stringify(preset)], {type: "application/json"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'preset.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        document.getElementById('importPresetBtn').addEventListener('click', () => {
            document.getElementById('presetFileInput').click();
        });

        document.getElementById('presetFileInput').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preset = JSON.parse(event.target.result);
                    saturateValue = preset.saturateValue || saturateValue;
                    brightnessValue = preset.brightnessValue || brightnessValue;
                    contrastValue = preset.contrastValue || contrastValue;
                    GM_setValue('saturateValue', saturateValue);
                    GM_setValue('brightnessValue', brightnessValue);
                    GM_setValue('contrastValue', contrastValue);
                    saturateRange.value = saturateValue;
                    saturateNumber.value = saturateValue;
                    brightnessRange.value = brightnessValue;
                    brightnessNumber.value = brightnessValue;
                    contrastRange.value = contrastValue;
                    contrastNumber.value = contrastValue;
                    setFilterOnElement(htmlElement);
                    if (fullscreenElement) {
                        setFilterOnElement(fullscreenElement);
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    createControlPanel();

    // Applying filters to full screen elements like video
    let fullscreenElement = null;
    document.onfullscreenchange = () => {
        let currentFullScreenElement = document.fullscreenElement;
        if (currentFullScreenElement) {
            if (currentFullScreenElement.tagName == "HTML") {
                return;
            }
            fullscreenElement = currentFullScreenElement;
            setFilterOnElement(fullscreenElement);
        } else {
            if (fullscreenElement) {
                fullscreenElement.style.filter = "none";
                fullscreenElement = null;
            }
        }
    };

    // Listen for storage changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'defaultEnhancerActive') {
            defaultEnhancerActive = GM_getValue('defaultEnhancerActive', false);
            setFilterOnElement(htmlElement);
        }
    });

    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if (e.key === 'E' && e.ctrlKey) {
            toggleEnhancer();
        }
    });

    // Apply filter on initial load
    setFilterOnElement(htmlElement);
})();
