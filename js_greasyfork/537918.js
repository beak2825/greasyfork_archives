// ==UserScript==
// @name         WME Street View Availability Extended
// @description  Shows a layer displaying the available street view roads and locations
// @namespace    https://greasyfork.org/fr/scripts/23338-wme-map-nav-history
// @version      0.4.1
// @author       Sebiseba, Hiwi234
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537918/WME%20Street%20View%20Availability%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/537918/WME%20Street%20View%20Availability%20Extended.meta.js
// ==/UserScript==

var wmeSDK;
window.SDK_INITIALIZED.then(() => {
  wmeSDK = getWmeSdk({ scriptId: "street-view-availability", scriptName: "Street View Availability"});
  wmeSDK.Events.once({ eventName: "wme-ready" }).then(init);
});
 
function init() {
  var enteringStreetView = false, // Set to true when the marker is being dragged to the map
      ignoreStreetViewExit = false, // Set to true to indicate that the street view availability was set to visible manually and should not be reverted
      pinWasHidden = true; // Contains previous pin display state, used to detected changes
 
  const buttons = document.getElementById('overlay-buttons-region');
 
  // Layer object to encapsulate layer logic
  const layer = function() {
    const layerName = 'Street View';
    wmeSDK.Map.addTileLayer({
      layerName: layerName,
      layerOptions: {
        tileHeight: 256,
        tileWidth: 256,
        url: {
          fileName: 'mapslt?lyrs=svv&x=${x}&y=${y}&z=${z}&w=256&h=256&style=40',
          servers: ['https://mts0.google.com', 'https://mts1.google.com', 'https://mts2.google.com', 'https://mts3.google.com' ]
        }
      }
    });
    wmeSDK.Events.trackLayerEvents({ layerName: layerName });
    wmeSDK.Events.on({
      eventName: 'wme-layer-visibility-changed',
      eventHandler: () => {
        if (!enteringStreetView && layer.isLayerVisible()) {
          ignoreStreetViewExit = true;
        }
        if (!layer.isLayerVisible()) {
          ignoreStreetViewExit = false;
        }
      }
    });
 
    return {
      setVisibility: (visibility) => wmeSDK.Map.setLayerVisibility({
        layerName: layerName,
        visibility: visibility
      }),
      isLayerVisible: () => wmeSDK.Map.isLayerVisible({ layerName: layerName })
    };
  }();
  layer.setVisibility(false);
 
  // Add layer entry in the new layer drawer
  var displayGroupToggle = document.getElementById('layer-switcher-group_display');
  if (displayGroupToggle != null) {
    var displayGroup = displayGroupToggle.parentNode;
    while (displayGroup != null && displayGroup.className != 'group') {
      displayGroup = displayGroup.parentNode;
    }
    var togglesList = displayGroup.querySelector('.collapsible-GROUP_DISPLAY');
    var toggler = document.createElement('li');
    var checkbox = document.createElement('wz-checkbox');
    checkbox.id = 'layer-switcher-item_street_view';
    checkbox.type = 'checkbox';
    checkbox.className = 'hydrated';
    checkbox.textContent = 'Street View';
    checkbox.addEventListener('click', e => layer.setVisibility(e.target.checked));
    toggler.appendChild(checkbox);
    togglesList.appendChild(toggler);
    displayGroupToggle.addEventListener('click', function() {
      checkbox.disabled = !displayGroupToggle.checked;
      layer.setVisibility(displayGroupToggle.checked && checkbox.checked);
    });
  }
 
  // Create keyboard shortcut to toggle the imagery layer (Shift+T)
  wmeSDK.Shortcuts.createShortcut({
    callback: () => {
      layer.setVisibility(!layer.isLayerVisible());
      checkbox.checked = layer.isLayerVisible();
    },
    description: 'Toggle street view availability',
    shortcutId: 'toggleStreetViewAvailability',
    shortcutKeys: 'S+t'
  });
 
  // Add an observer to activate the script whenever the street view marker gets dragged around
  // TODO: maybe simplify by both observing the pin and the class street-view-mode in #map?
  var controlObserver = new MutationObserver(function(mutationRecords) {
    try {
      var activeButton = mutationRecords.find(record => record.target.classList.contains('overlay-button-active'));
      if ((activeButton == null) != pinWasHidden) {
        if (pinWasHidden == true && displayGroupToggle.checked) {
          pinWasHidden = activeButton == null;
          enteringStreetView = true;
          layer.setVisibility(true);
          enteringStreetView = false;
        } else if (pinWasHidden == false && !ignoreStreetViewExit) {
          pinWasHidden = activeButton == null;
          layer.setVisibility(false);
        }
      }
    } catch (error) {
      console.error('Error caught while observing pin mutation', error);
    }
  });
  controlObserver.observe(document.querySelector('.street-view-control'), { attributes: true, attributeFilter: ['class'] });
  var buttonsObserver = new MutationObserver(function(mutationRecords) {
    mutationRecords.forEach(record => {
      // Set timeout of 200ms, as creating the wz-button tends to take a while
      setTimeout(() => {
        let streetViewControl = record.target.querySelector('.street-view-control');
        if (streetViewControl) {
          controlObserver.observe(streetViewControl, { attributes: true, attributeFilter: ['class'] })
        }
      }, 200);
    });
  });
  buttonsObserver.observe(buttons, { childList: true });
}