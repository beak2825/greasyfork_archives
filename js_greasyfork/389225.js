// ==UserScript==
// @name            WME Eesti Maa-amet WMS kihid
// @version         1.0.5
// @author          Mikk36, Hapsal_PA. Co authors: (petrjanik, d2-mac, MajkiiTelini)
// @description     Displays WMS layers from Estonia Land Board WMS services (Maa-amet) in WME.
// @include         https://*.waze.com/*/editor*
// @include         https://*.waze.com/editor*
// @include         https://*.waze.com/map-editor*
// @include         https://*.waze.com/beta_editor*
// @include         https://editor-beta.waze.com*
// @run-at          document-end
// @namespace       https://greasyfork.org/users/331322
// @source          https://github.com/Mikk36/wme-eesti-maaamet-map-layer
// @downloadURL https://update.greasyfork.org/scripts/389225/WME%20Eesti%20Maa-amet%20WMS%20kihid.user.js
// @updateURL https://update.greasyfork.org/scripts/389225/WME%20Eesti%20Maa-amet%20WMS%20kihid.meta.js
// ==/UserScript==

/**
 * Changelog:
 *
 * 1.0.5 - fix higher zoom levels
 * 1.0.4 - fixed the visual style
 * 1.0.3 - fixed the new WME layer switching update
 * 1.0.2 - fixed layers
 * 1.0.1 - v2019.08.21 - first version, modifications of "Czech WMS layers".
 */

/**
 *
 */

let W, OpenLayers, I18n;
init();

function init(e) {
  W = unsafeWindow.W;
  OpenLayers = unsafeWindow.OpenLayers;
  I18n = unsafeWindow.I18n;
  if (e && e.user === null) {
    return;
  }
  if (typeof W === "undefined" || typeof W.loginManager === "undefined") {
    setTimeout(init, 100);
    return;
  }
  if (!W.loginManager.user) {
    W.loginManager.events.register("login", null, init);
    W.loginManager.events.register("loginStatus", null, init);
  }
  if (document.getElementById("layer-switcher") === null && document.getElementById("layer-switcher-group_display") === null) {
    setTimeout(init, 200);
    return;
  }

  // Maa-amet (Land Board) service connection
  const serviceWmsMaaamet = {
    "type": "WMS",
    "url": "https://tiles.maaamet.ee/tm/?",
    "attribution": "Maa-amet",
    "comment": "Maa-amet WMS"
  };

  // Menu title
  const groupTogglerWMS = addGroupToggler(false, "layer-switcher-group_wms", "Maa-ameti kihid");

  // Layers
  const layersInfo = [
    {
      key: "kaart",
      name: "Eesti kaart",
      zIndex: 200
    },
    {
      key: "foto",
      name: "Ortofoto",
      zIndex: 200
    },
    {
      key: "hybriid",
      name: "Hübriidkaart",
      zIndex: 201
    }
  ];

  const layerTogglers = {};

  for (let i = 0; i < layersInfo.length; i++) {
    let layerInfo = layersInfo[i];
    let mapLayer = addNewLayer(layerInfo.key, serviceWmsMaaamet, layerInfo.key, layerInfo.zIndex);
    layerTogglers[`wms_${layerInfo.key}`] = addLayerToggler(groupTogglerWMS, layerInfo.name, [mapLayer]);
  }

  W.map.events.register("addlayer", null, setZOrdering(layerTogglers));
  W.map.events.register("removelayer", null, setZOrdering(layerTogglers));

  if (localStorage.WMSLayers) {
    let JSONStorageOptions = JSON.parse(localStorage.WMSLayers);
    for (let key in layerTogglers) {
      if (JSONStorageOptions[key]) {
        document.getElementById(layerTogglers[key].htmlItem).click();
      }
    }
  }

  const saveWMSLayersOptions = () => {
    if (localStorage) {
      let JSONStorageOptions = {};
      for (let key in layerTogglers) {
        JSONStorageOptions[key] = document.getElementById(layerTogglers[key].htmlItem).checked;
      }
      localStorage.WMSLayers = JSON.stringify(JSONStorageOptions);
    }
  };
  window.addEventListener("beforeunload", saveWMSLayersOptions, false);
}

// Layer creation
function addNewLayer(id, service, serviceLayers, zIndex) {
  const newLayer = {};
  newLayer.uniqueName = `_${id}`;
  newLayer.zIndex = (typeof zIndex === "undefined") ? 0 : zIndex;
  newLayer.layer = new OpenLayers.Layer.WMS(
      id,
      service.url,
      {
        layers: serviceLayers,
        transparent: "true",
        format: "image/png"
      },
      {
        tileSize: new OpenLayers.Size(256, 256),
        isBaseLayer: false,
        visibility: false,
        transitionEffect: "resize",
        attribution: service.attribution,
        uniqueName: newLayer.uniqueName,
        serverResolutions: [38.218514137268066, 19.109257068634033, 9.554628534317017, 4.777314267158508, 2.388657133579254, 1.194328566789627, 0.5971642833948135],
        resolutions: [38.218514137268066, 19.109257068634033, 9.554628534317017, 4.777314267158508, 2.388657133579254, 1.194328566789627, 0.5971642833948135, 0.29858214169740677, 0.14929107084870338, 0.07464553542435169, 0.037322767712175846],
      }
  );
  return newLayer;
}

// Layers menu
function addGroupToggler(isDefault, layerSwitcherGroupItemName, layerGroupVisibleName) {
  let group;
  if (isDefault === true) {
    group = document.getElementById(layerSwitcherGroupItemName).parentElement.parentElement;
  } else {
    const layerGroupsList = document.getElementsByClassName("list-unstyled togglers")[0];
    group = document.createElement("li");
    group.className = "group";
    const togglerContainer = document.createElement("div");
    togglerContainer.className = "toggler layer-switcher-toggler-tree-category";
    const divI = document.createElement("i");
    divI.className = "toggle-category w-icon w-icon-caret-down";
    divI.id = "arrow";
    divI.addEventListener("click", listToggle);
    const spanLabel = document.createElement("wz-toggle-switch");
    spanLabel.className = "layer-switcher-group_toggler hydrated toggle";
    spanLabel.checked = "true";
    spanLabel.id = "maaameti-kihtide-toggle";
    const label = document.createElement("label");
    label.htmlFor = spanLabel.id;
    label.className = "label-text";
    const togglerChildrenList = document.createElement("ul");
    togglerChildrenList.className = "children";
    togglerContainer.appendChild(divI);
    label.appendChild(document.createTextNode(layerGroupVisibleName));
    togglerContainer.appendChild(label);
    togglerContainer.appendChild(spanLabel);
    group.appendChild(togglerContainer);
    group.appendChild(togglerChildrenList);
    layerGroupsList.appendChild(group);
  }
  return group;
}

// Layer submenu
function addLayerToggler(groupToggler, layerName, layerArray) {
  const layerToggler = {};
  const layerShortcut = layerName.replace(/ /g, "_").replace(".", "");
  layerToggler.htmlItem = `layer-switcher-item_${layerShortcut}`;
  layerToggler.layerArray = layerArray;
  const layer_container = groupToggler.getElementsByClassName("children")[0];
  layer_container.id = "list";
  const layerGroupCheckbox = groupToggler.getElementsByClassName("toggler")[0].getElementsByClassName("toggle")[0];
  const toggler = document.createElement("li");
  const togglerContainer = document.createElement("div");
  togglerContainer.className = "wz-checkbox styledContainer";
  togglerContainer.id = layerShortcut;
  const styled = layerToggler.htmlItem;
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = styled;
  checkbox.className = "toggle";
  const customStyle = document.createElement("style");
  document.head.appendChild(customStyle);

  // Delete old style
  customStyle.sheet.insertRule(`#layer-switcher-item_${layerShortcut} {position: absolute; opacity: 0; cursor: pointer;height: 0; width: 0}`);

  // Modify style
  const checkboxDivBorder = document.createElement("span");
  checkboxDivBorder.id = `${layerShortcut}_styledContainer`;
  checkboxDivBorder.className = "styledCheckbox";

  // Add new styles
  customStyle.sheet.insertRule(`
.styledContainer {
  display: block;
  position: relative;
  padding-left: 28px;
  margin-bottom: 8px;
  cursor: pointer;
  user-select: none;
}`);
  customStyle.sheet.insertRule(`
.styledCheckbox {
  position: absolute;
  left: 0px;
  height: 18px;
  width: 18px;
  border: 2px solid rgb(133, 155, 166);
  border-radius: 3px;
  background-color: white
}`);
  customStyle.sheet.insertRule(`
.styledContainer input:checked ~ .styledCheckbox {
  background-color: rgb(0, 164, 235);
  border: 2px solid rgb(0, 164, 235)
}`);
  customStyle.sheet.insertRule(`
.styledContainer input[disabled]:checked ~ .styledCheckbox {
  background-color: #ccc;
  border: 2px solid #ccc
}`);
  customStyle.sheet.insertRule(`
.styledContainer input[disabled] ~ .styledCheckbox {
  border: 2px solid #ccc
}`);
  customStyle.sheet.insertRule(`
.styledCheckbox:after {
  content: " ";
  position: absolute;
  display: none;
}`);
  customStyle.sheet.insertRule(`
.styledContainer input:checked ~ .styledCheckbox:after {
  display: block
}`);
  customStyle.sheet.insertRule(`
.styledContainer .styledCheckbox:after {
  left: 5px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 1px 1px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg)
}`);

  // customStyle.sheet.insertRule("#toggle input:disabled {opacity: 0.3}");
  const label = document.createElement("label");
  label.innerHTML = ` ${layerName}`;
  label.htmlFor = checkbox.id;
  label.appendChild(checkbox);
  label.appendChild(checkboxDivBorder);
  togglerContainer.appendChild(label);
  toggler.appendChild(togglerContainer);
  layer_container.appendChild(toggler);

  for (let i = 0; i < layerArray.length; i++) {
    checkbox.addEventListener("click", layerTogglerEventHandler(layerArray[i].layer));
    layerGroupCheckbox.addEventListener("click", layerTogglerGroupEventHandler(checkbox, layerArray[i].layer));
  }
  return layerToggler;
}

// Adds a layer
function layerTogglerEventHandler(layer) {
  return function () {
    if (this.checked) {
      W.map.addLayer(layer);
      layer.setVisibility(this.checked);
    } else {
      layer.setVisibility(this.checked);
      W.map.removeLayer(layer);
    }
  };
}

// Opens/closes all layers at once
function layerTogglerGroupEventHandler(checkbox, layer) {
  return function () {
    if (this.checked) {
      if (checkbox.checked) {
        W.map.addLayer(layer);
        layer.setVisibility(this.checked & checkbox.checked);
      }
    } else {
      if (checkbox.checked) {
        layer.setVisibility(this.checked & checkbox.checked);
        W.map.removeLayer(layer);
      }
    }
    checkbox.disabled = !this.checked;
  };
}

// Open/close submenu
function listToggle() {
  document.getElementById("arrow").classList.toggle("upside-down");
  const listDisplay = document.getElementById("list");
  if (listDisplay.style.display === "none") {
    listDisplay.style.display = "block";
  } else {
    listDisplay.style.display = "none";
  }
}

// Configure proper Z-order for a layer
function setZOrdering(layerTogglers) {
  return function () {
    for (let key in layerTogglers) {
      if (!layerTogglers.hasOwnProperty(key)) {
        continue;
      }
      for (let j = 0; j < layerTogglers[key].layerArray.length; j++) {
        if (layerTogglers[key].layerArray[j].zIndex > 0) {
          let l = W.map.getLayersBy("uniqueName", layerTogglers[key].layerArray[j].uniqueName);
          if (l.length > 0) {
            l[0].setZIndex(layerTogglers[key].layerArray[j].zIndex);
          }
        }
      }
    }
  };
}