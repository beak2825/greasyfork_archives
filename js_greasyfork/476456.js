// ==UserScript==
// @name         WME Layer Counter
// @namespace    https://greasyfork.org/en/scripts/476456-wme-layer-counter
// @version      2025.12.26.1
// @description  See how many layers you have active in WME.
// @match        *://*.waze.com/*editor*
// @exclude      *://*.waze.com/user/editor*
// @grant        none
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/476456/WME%20Layer%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/476456/WME%20Layer%20Counter.meta.js
// ==/UserScript==

/* global WazeWrap */

(function main() {
    'use strict';

    const SCRIPT_NAME = 'WME Layer Counter';
    const SCRIPT_ID = 'wme-layer-counter';
    const updateMessage = "<b>Changelog</b><br><br>Update 2025.12.26<br>- Updated to new SDK.<br><br>Update 2024.7.15.1<br>- I can now remember your choice.<br><br>Update 2024.7.9.5<br>- Fixed code.<br><br>Update 2024.7.9.3<br>- Moved layer counter over to the tab section. If you prefer, you can still have it show on the right.<br><br>Update 2024.7.9.1<br>- Removed colors.<br><br>Update 2024.7.4.2<br>- Added dynamic button color change based on active layers.<br><br>Update 2024.7.8.1<br>- Updated the way max layers are calculated.<br><br>Update 2023.10.4.8<br>- Found out Layer Counter wanted to hangout with the cool kids from the FUME block. I scolded him and told him he can't hangout with them. I then sent him to the corner and told him not to move again.<br><br>Update 2023.10.4.5<br>- Fixed no display issue.<br><br>Initial Release.<br>- Hope this helps those that need to know how many layers they are using.<br><br>";
    const scriptVersion = GM_info.script.version;

    let _$layerCountElem = null;
    let _isButtonVisible = JSON.parse(localStorage.getItem('wmeLayerCounterButtonVisible')) || false;

    function createLayerCountElement() {
        if (document.getElementById('layer-count-monitor')) return;

        _$layerCountElem = document.createElement('div');
        _$layerCountElem.innerHTML = `
            <div id="layer-count-monitor" class="toolbar-button" style="font-weight: bold; font-size: 16px; border-radius: 10px; margin-left: 4px; background-color: white;" title="Active Layers / Max Layers">
                <div class="item-container" style="padding-left: 10px; padding-right: 10px; cursor: default;">
                </div>
            </div>`;

        // Append _$layerCountElem to the DOM
        const secondaryToolbar = document.querySelector('.secondary-toolbar');
        if (secondaryToolbar) {
            secondaryToolbar.appendChild(_$layerCountElem);
        }
    }

    function updateLayerCount() {
        if (!_isButtonVisible) return;

        if (!_$layerCountElem || !document.getElementById('layer-count-monitor')) {
            createLayerCountElement();
        }

        const W = typeof unsafeWindow !== 'undefined' ? unsafeWindow.W : window.W;
        if (!W || !W.map || !W.map.olMap) return;

        const activeLayers = W.map.olMap.layers.filter(layer => layer.visibility).length;
        const featureLayer = W.map.olMap.Z_INDEX_BASE.Feature;
        const overlayLayer = W.map.olMap.Z_INDEX_BASE.Overlay;
        const maxLayers = (featureLayer - overlayLayer) / 5;

        if (_$layerCountElem) {
            const itemContainer = _$layerCountElem.querySelector('.item-container');
            if (itemContainer) {
                itemContainer.textContent = `${activeLayers}/${maxLayers}`;
            }
        }
    }

    function injectLayerCountElement() {
        if (_$layerCountElem && _$layerCountElem.parentElement) {
            _$layerCountElem.parentElement.removeChild(_$layerCountElem);
        }
        if (_isButtonVisible) {
            updateLayerCount();
            const secondaryToolbar = document.querySelector('.secondary-toolbar');
            if (secondaryToolbar && !secondaryToolbar.querySelector('#layer-count-monitor')) {
                secondaryToolbar.appendChild(_$layerCountElem);
            }
        }
    }

    function toggleLayerCountButton() {
        _isButtonVisible = !_isButtonVisible;
        localStorage.setItem('wmeLayerCounterButtonVisible', JSON.stringify(_isButtonVisible));
        injectLayerCountElement();
    }

    async function addScriptTab(wmeSDK) {
        if (typeof WazeWrap === 'undefined') {
            console.log('WazeWrap is not available. Exiting script.');
            return;
        }

        let tabLabel, tabPane;
        try {
            const result = await wmeSDK.Sidebar.registerScriptTab();
            tabLabel = result.tabLabel;
            tabPane = result.tabPane;
            console.log('WME Layer Counter: Sidebar tab registered via SDK');
        } catch (e) {
            console.error('WME Layer Counter: Failed to register sidebar tab via SDK', e);
            return;
        }

        tabLabel.innerText = 'LC';
        tabLabel.title = 'Layer Counter';

        const description = document.createElement('p');
        description.style.fontWeight = 'bold';
        description.textContent = 'Layer Counter';
        tabPane.appendChild(description);

        const toggleButtonContainer = document.createElement('div');
        const toggleButtonLabel = document.createElement('label');
        toggleButtonLabel.textContent = 'Show Layer Count';
        const toggleButtonCheckbox = document.createElement('input');
        toggleButtonCheckbox.type = 'checkbox';
        toggleButtonCheckbox.checked = _isButtonVisible;
        toggleButtonCheckbox.addEventListener('change', toggleLayerCountButton);

        toggleButtonContainer.appendChild(toggleButtonCheckbox);
        toggleButtonContainer.appendChild(toggleButtonLabel);
        tabPane.appendChild(toggleButtonContainer);

        const activeLayersText = document.createElement('p');
        activeLayersText.id = 'active-layers';
        tabPane.appendChild(activeLayersText);

        const activeLayersTextForButton = document.createElement('p');
        activeLayersTextForButton.id = 'active-layers-button';
        activeLayersTextForButton.style.display = 'none';
        tabPane.appendChild(activeLayersTextForButton);

        const createdLayersText = document.createElement('p');
        createdLayersText.id = 'created-layers';
        tabPane.appendChild(createdLayersText);

        const maxLayersText = document.createElement('p');
        maxLayersText.id = 'max-layers';
        tabPane.appendChild(maxLayersText);

        const madeBy = document.createElement('p');
        madeBy.textContent = 'Made by DevlinDelFuego';
        madeBy.style.margin = '0';
        tabPane.appendChild(madeBy);

        const version = document.createElement('p');
        version.textContent = `Version: ${scriptVersion}`;
        version.style.margin = '0';
        tabPane.appendChild(version);

        updateTabContent(wmeSDK, activeLayersText, activeLayersTextForButton, createdLayersText, maxLayersText);

        setInterval(() => {
            updateTabContent(wmeSDK, activeLayersText, activeLayersTextForButton, createdLayersText, maxLayersText);
            if (_isButtonVisible) {
                updateLayerCount();
            }
        }, 1000);
    }

    function updateTabContent(wmeSDK, activeLayersText, activeLayersTextForButton, createdLayersText, maxLayersText) {
        // Since we still have access to W and some features might not be fully in SDK yet,
        // we use a mix but try to use SDK where possible.
        // Counting layers is still easiest via W.map.olMap.layers as SDK doesn't have a getLayers() yet.
        const W = typeof unsafeWindow !== 'undefined' ? unsafeWindow.W : window.W;
        const activeLayers = W.map.olMap.layers.filter(layer => layer.visibility).length;
        const createdLayers = W.map.olMap.layers.length;
        const featureLayer = W.map.olMap.Z_INDEX_BASE.Feature;
        const overlayLayer = W.map.olMap.Z_INDEX_BASE.Overlay;
        const maxLayers = (featureLayer - overlayLayer) / 5;

        if (activeLayersText) activeLayersText.textContent = `Active Layers: ${activeLayers}`;
        if (activeLayersTextForButton) activeLayersTextForButton.textContent = `${activeLayers}/${maxLayers}`;
        if (createdLayersText) createdLayersText.textContent = `Created Layers: ${createdLayers}`;
        if (maxLayersText) maxLayersText.textContent = `Max Layers: ${maxLayers}`;
    }

    function observeLayerChanges(wmeSDK) {
        const updateAll = () => {
            const activeLayersText = document.getElementById('active-layers');
            const activeLayersTextForButton = document.getElementById('active-layers-button');
            const createdLayersText = document.getElementById('created-layers');
            const maxLayersText = document.getElementById('max-layers');

            if (activeLayersText || activeLayersTextForButton || createdLayersText || maxLayersText) {
                updateTabContent(
                    wmeSDK,
                    activeLayersText,
                    activeLayersTextForButton,
                    createdLayersText,
                    maxLayersText
                );
            }
            if (_isButtonVisible) {
                updateLayerCount();
            }
        };

        wmeSDK.Events.on({ eventName: 'wme-map-layer-changed', eventHandler: updateAll });
        wmeSDK.Events.on({ eventName: 'wme-map-layer-added', eventHandler: updateAll });
        wmeSDK.Events.on({ eventName: 'wme-map-layer-removed', eventHandler: updateAll });
    }

    // Initialize the script
    function initialize() {
        const currentWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
        const sdkInit = currentWindow.SDK_INITIALIZED;

        if (!sdkInit) {
            console.log('WME SDK initialization signal not found. Waiting for wme-ready.');
            document.addEventListener('wme-ready', () => {
                const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
                if (win.SDK_INITIALIZED) {
                    win.SDK_INITIALIZED.then(() => {
                        if (typeof win.getWmeSdk === 'function') {
                            const wmeSDK = win.getWmeSdk({ scriptId: SCRIPT_ID, scriptName: SCRIPT_NAME });
                            addScriptTab(wmeSDK);
                            injectLayerCountElement();
                            observeLayerChanges(wmeSDK);
                            showScriptUpdate();
                        }
                    });
                }
            }, { once: true });
            return;
        }

        sdkInit.then(() => {
            if (typeof currentWindow.getWmeSdk === 'function') {
                const wmeSDK = currentWindow.getWmeSdk({ scriptId: SCRIPT_ID, scriptName: SCRIPT_NAME });
                addScriptTab(wmeSDK);
                injectLayerCountElement();
                observeLayerChanges(wmeSDK);
                showScriptUpdate();
            } else {
                console.error('WME SDK getWmeSdk function not found.');
            }
        });
    }

    // Call the initialize function
    initialize();

    // Show script update notification
    function showScriptUpdate() {
        const ww = typeof unsafeWindow !== 'undefined' ? unsafeWindow.WazeWrap : window.WazeWrap;
        if (ww && ww.Interface && typeof ww.Interface.ShowScriptUpdate === 'function') {
            try {
                ww.Interface.ShowScriptUpdate(
                    SCRIPT_NAME,
                    GM_info.script.version,
                    updateMessage,
                    'https://greasyfork.org/en/scripts/476456-wme-layer-counter',
                    'https://www.waze.com/forum/viewtopic.php?t=394699'
                );
            } catch (error) {
                console.error('Error showing script update:', error);
            }
        } else {
            console.log('WazeWrap.Interface.ShowScriptUpdate not available. Skipping update message.');
        }
    }

})();
