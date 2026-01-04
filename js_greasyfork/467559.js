// ==UserScript==
// @name         Showcase: selectable features in WME map
// @author       Tom 'Glodenox' Puttemans
// @namespace    http://www.tomputtemans.com/
// @version      0.3
// @description  Shows how to add a vector feature layer where the features can receive events, just like Waze's features
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @downloadURL https://update.greasyfork.org/scripts/467559/Showcase%3A%20selectable%20features%20in%20WME%20map.user.js
// @updateURL https://update.greasyfork.org/scripts/467559/Showcase%3A%20selectable%20features%20in%20WME%20map.meta.js
// ==/UserScript==

/* global W, OpenLayers */

async function onWmeReady() {
  // Create vector layer
  let mapLayer = new OpenLayers.Layer.Vector("feature_selection_showcase", {
    styleMap: new OpenLayers.StyleMap({
      'default': new OpenLayers.Style({
        pointRadius: 50,
        strokeColor: '#aaa',
        strokeWidth: 4,
        fillColor: '${fillColor}',
        fontColor: '#fff',
        fontWeight: 'bold',
        fontSize: '50px',
        label: '${text}'
      }),
      'highlight': new OpenLayers.Style({
        strokeColor: '#aaa',
        fillColor: '${highlightFillColor}'
      }),
      'select': new OpenLayers.Style({
        strokeColor: '#fff',
        fillColor: '${fillColor}'
      }),
      'highlightselected': new OpenLayers.Style({
        strokeColor: '#fff',
        fillColor: '${highlightFillColor}'
      })
    })
  });
  W.map.addLayer(mapLayer);
  // Move the SVG root of the new layer into the layer RootContainer used by Waze.
  let layerContainer =  W.selectionManager.selectionMediator._rootContainerLayer;
  layerContainer.layers.push(mapLayer);
  layerContainer.collectRoots();

  // Needed if you want to track the unselect event
  let selectedFeature = null;

  // Event handling example
  // We need to filter out the highlight events of the other layers, hence the checks within the handlers
  W.selectionManager.selectionMediator.on({
    "map:selection:featureIn": (e) => e.layer == mapLayer && console.log("highlight", e), // e is the highlighted OpenLayers.Feature.Vector instance
    "map:selection:featureOut": (e) => e.layer == mapLayer && console.log("unhighlight", e) // e is the no longer highlighted OpenLayers.Feature.Vector instance
  });
  W.selectionManager.events.on({
    "selectionchanged": (e) => {
      let matchedFeature = e.selected.find(feature => feature.layer == mapLayer);
      if (matchedFeature) {
        selectedFeature = matchedFeature;
        console.log("select", selectedFeature);
      } else if (selectedFeature) {
        console.log("unselect", selectedFeature);
        selectedFeature = null;
      }
    }
  });
  // Implementation note: W.selectionManager also has more specific "app:selection:featureselected" and "app:selection:featureunselected" events, but the unselection event doesn't trigger if you select another vector directly
  // If you wish to use those events, e.layers contains the affected layers. Alternatively, you could implement the setSelected method in the attributes, which gets a boolean attribute indicating a select or unselect.

  // Create a test location at the center of the map to showcase the highlighting and selection
  let location = W.map.getCenter();
  let vectorPoint = new OpenLayers.Geometry.Point(location.lon, location.lat);
  let text = "foo";
  // The repositoryObject contains methods required by the Waze logic
  let vectorAttributes = {
    text: text,
    type: 'custom',
    fillColor: "#555",
    highlightFillColor: "#888",
    index: `${text}`,
    repositoryObject: {
      isDeleted: () => false,
      setSelected: (state) => null, // You could implement this method to get select/unselect callbacks
      isNew: () => false,
      getType: () => null,
      getID: () => -1
    }
  };
  let testVector = new OpenLayers.Feature.Vector(vectorPoint, vectorAttributes);
  // Not needed by Waze, but some common scripts rely on the presence of a model field
  testVector.model = vectorAttributes;
  mapLayer.addFeatures([ testVector ]);
}

// Below you just find the usual bootstrap code, nothing needs to be changed there

function onWmeInitialized() {
  if (W.userscripts?.state?.isReady) {
    console.log('W is ready and in "wme-ready" state. Proceeding with initialization.');
    onWmeReady();
  } else {
    console.log('W is ready, but not in "wme-ready" state. Adding event listener.');
    document.addEventListener('wme-ready', onWmeReady, { once: true });
  }
}

function bootstrap() {
  if (!W) {
    console.log('W is not available. Adding event listener.');
    document.addEventListener('wme-initialized', onWmeInitialized, { once: true });
  } else {
    onWmeInitialized();
  }
}

bootstrap();
