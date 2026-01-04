// ==UserScript==
// @name			Private - Slovak WMS layers
// @version			2025.11.25
// @author			Waze Slovensko
// @description		Displays layers from Slovak WMS services (UGKK) in WME
// @match 			https://*.waze.com/*editor*
// @run-at			document-end
// @namespace		https://greasyfork.org/sk/users/1467982-waze-slovensko
// @downloadURL https://update.greasyfork.org/scripts/535511/Private%20-%20Slovak%20WMS%20layers.user.js
// @updateURL https://update.greasyfork.org/scripts/535511/Private%20-%20Slovak%20WMS%20layers.meta.js
// ==/UserScript==

var WMSLayersTechSource = {};
var W;
var OL;
var I18n;
var ZIndexes = {};

async function init() {
	W = unsafeWindow.W;
	OL = unsafeWindow.OpenLayers;
	I18n = unsafeWindow.I18n;

	WMSLayersTechSource.tileSizeG = new OL.Size(512,512);
	WMSLayersTechSource.resolutions =	 [156543.03390625,
										  78271.516953125,
										  39135.7584765625,
										  19567.87923828125,
										  9783.939619140625,
										  4891.9698095703125,
										  2445.9849047851562,
										  1222.9924523925781,
										  611.4962261962891,
										  305.74811309814453,
										  152.87405654907226,
										  76.43702827453613,
										  38.218514137268066,
										  19.109257068634033,
										  9.554628534317017,
										  4.777314267158508,
										  2.388657133579254,
										  1.194328566789627,
										  0.5971642833948135,
										  0.298582141697406,
										  0.149291070848703,
										  0.0746455354243515,
										  0.0373227677121757
										 ];

	ZIndexes.base = W.map.olMap.Z_INDEX_BASE.Overlay + 20;
	ZIndexes.overlay = W.map.olMap.Z_INDEX_BASE.Overlay + 100;
	ZIndexes.popup = W.map.olMap.Z_INDEX_BASE.Overlay + 1000;

	// adresy WMS služieb
	var service_wms_kataster = {"type" : "WMS", "url" : "https://kataster.skgeodesy.sk/eskn/services/NR/kn_wms_orto/MapServer/WmsServer?", "attribution" : "© ÚGKK SR; r. 2015", "comment" : "Geoportál ZBGIS - Služba WMS - Parcely C (SJTSK aj Web Mercator)"};
	var service_xyz_orto = {"type" : "XYZ", "url" :"https://zbgis.skgeodesy.sk/zbgis/rest/services/Ortofoto/MapServer/tile/${z}/${y}/${x}", "attribution" : "© GKÚ, NLC; r.2017 - 2019", "comment" : "Geoportál ZBGIS - Ortofotomozaika", "maxZoom": 19};

	//skupiny vrstev v menu
	var groupTogglerPlaces = addGroupToggler(true, "layer-switcher-group_places");
	var groupTogglerRoad = addGroupToggler(true, "layer-switcher-group_road");
	var groupTogglerDisplay = addGroupToggler(true, "layer-switcher-group_display");
	//vrstvy v menu
	var WMSLayerTogglers = {};
	//ZOBRAZENÍ
	WMSLayerTogglers.wms_katastr = addLayerToggler(groupTogglerDisplay, "Katastrálna mapa", true, [addNewLayer("wms_katastr", service_wms_kataster, "1,2,3,5,6,7,8,10,11,12,13,14,15", 0, 1, false)]);
	WMSLayerTogglers.xyz_orto = addLayerToggler(groupTogglerDisplay, "Ortofoto ZBGIS", true, [addNewLayer("xyz_orto", service_xyz_orto,"", 0, 1, true)]);

	var isLoaded = false;
	window.addEventListener("beforeunload", function() {
		if (localStorage && isLoaded) {
			var JSONStorageOptions = {};
			for (var key in WMSLayerTogglers) {
				if (WMSLayerTogglers[key].serviceType == "WMS") {
					JSONStorageOptions[key] = document.getElementById(WMSLayerTogglers[key].htmlItem).checked;
				}
			}
			localStorage.WMSLayers = JSON.stringify(JSONStorageOptions);
		}
	}, false);
	window.addEventListener("load", function() {
		isLoaded = true;
		if (localStorage.WMSLayers) {
			var JSONStorageOptions = JSON.parse(localStorage.WMSLayers);
			for (var key in WMSLayerTogglers) {
				if (JSONStorageOptions[key] && WMSLayerTogglers[key].serviceType == "WMS") {
					document.getElementById(WMSLayerTogglers[key].htmlItem).click();
				}
			}
		}
	}, false);

	const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("wms-sk-private");
	tabLabel.innerText = 'WMS';
    tabLabel.title = 'Private - Slovak WMS layers';
	tabLabel.id = "sidepanel-wms";
    tabPane.innerHTML = "<b><u><a href='https://greasyfork.org/scripts/535511' target='_blank'>" + GM_info.script.name + "</a></u></b> &nbsp; v" + GM_info.script.version;
	var section = document.createElement("section");
	section.style.fontSize = "13px";
	section.id = "WMS";
	section.style.marginBottom = "15px";
	section.appendChild(document.createElement("br"));
	section.appendChild(document.createTextNode("WMS vrstva: "));
	var WMSSelect = document.createElement("select");
	WMSSelect.id = "WMSLayersSelect";
	section.appendChild(WMSSelect);
	var opacityRange = document.createElement("input");
	var opacityLabel = document.createElement("label");
	opacityRange.type = "range";
	opacityRange.min = 0;
	opacityRange.max = 100;
	opacityRange.value = 100;
	opacityRange.id = "WMSOpacity";
	opacityLabel.textContent = "Průhlednost vrstvy: " + opacityRange.value + " %";
	opacityLabel.id = "WMSOpacityLabel";
	opacityLabel.htmlFor = opacityRange.id;
	section.appendChild(opacityLabel);
	section.appendChild(opacityRange);
	tabPane.appendChild(section);
	await W.userscripts.waitForElementConnected(tabPane);

	opacityRange.addEventListener("input", function() {
		var value = document.getElementById("WMSLayersSelect").value;
		if (value !== "" && value !== "undefined") {
			var layer = W.map.getLayerByName(value);
			layer.setOpacity(opacityRange.value / 100);
			document.getElementById("WMSOpacityLabel").textContent = "Průhlednost vrstvy: " + document.getElementById("WMSOpacity").value + " %";
		}
	});
	WMSSelect.addEventListener("change", function() {
		opacityRange.value = W.map.layers.filter(layer => layer.name == WMSSelect.value)[0].opacity * 100;
		document.getElementById("WMSOpacityLabel").textContent = "Průhlednost vrstvy: " + document.getElementById("WMSOpacity").value + " %";
	});
	setZOrdering(WMSLayerTogglers);
	W.map.events.register("addlayer", null, fillWMSLayersSelectList);
	W.map.events.register("removelayer", null, fillWMSLayersSelectList);
	W.map.events.register("addlayer", null, setZOrdering(WMSLayerTogglers));
	W.map.events.register("removelayer", null, setZOrdering(WMSLayerTogglers));
	W.map.events.register("moveend", null, setZOrdering(WMSLayerTogglers));
}

function fillWMSLayersSelectList() {
	var select = document.getElementById("WMSLayersSelect");
	var value = select.value;
	var htmlCode;
	W.map.layers.filter(layer => layer.params !== undefined && layer.params.SERVICE !== undefined && layer.params.SERVICE == "WMS").forEach(
		layer => (htmlCode += "<option value='" + layer.name + "'>" + layer.name + "</option><br>"));
	select.innerHTML = htmlCode;
	select.value = value;
}

function addNewLayer(id, service, serviceLayers, zIndex = 0, opacity = 1, placeAtBottom = false) {
	var newLayer = {};
	newLayer.serviceType = service.type;

    var bottomZ = 1;
    newLayer.zIndex = placeAtBottom ? bottomZ : ZIndexes.overlay;

        switch(service.type) {
		case "WMS":
			newLayer.layer = new OL.Layer.WMS(
				id, service.url,
				{
					layers: serviceLayers ,
					transparent: "true",
					format: "image/png",
                    VERSION: "1.3.0",
                    CRS: "EPSG:3857"
				},
				{
					opacity: opacity,
                    tileSize: WMSLayersTechSource.tileSizeG,
					isBaseLayer: false,
					visibility: false,
					projection: new OL.Projection("EPSG:3857") //alternativa defaultní EPSG:900913
				}
			);
			break;
		case "WMS_4326":
			newLayer.layer = new OL.Layer.WMS(
				id, service.url,
				{
					layers: serviceLayers ,
					transparent: "true",
					format: "image/png"
				},
				{
					opacity: opacity,
					tileSize: WMSLayersTechSource.tileSizeG,
					isBaseLayer: false,
					visibility: false,
					transitionEffect: "resize",
					attribution: service.attribution,
					epsg4326: new OL.Projection("EPSG:4326"),
					getURL: getUrl4326,
					getFullRequestString: getFullRequestString4326
				}
			);
			break;
		case "XYZ":
			newLayer.layer = new OL.Layer.XYZ(
				id, service.url,
				{
					sphericalMercator: true,
                    isBaseLayer: false,
                    visibility: true, // by default zapnute
                    numZoomLevels: 23, // 0–22
					resolutions: WMSLayersTechSource.resolutions,
					attribution: service.attribution
				}
			);
			break;
		default:
			newLayer.layer = null;
	}
    if (newLayer.layer) {
        W.map.addLayer(newLayer.layer);

        if (placeAtBottom) {
            W.map.setLayerIndex(newLayer.layer, 0);
        }
    }
    newLayer.placeAtBottom = placeAtBottom;

	return newLayer;
}

function addGroupToggler(isDefault, layerSwitcherGroupItemName, layerGroupVisibleName) {
	var group;
	if (isDefault === true) {
		group = document.getElementById(layerSwitcherGroupItemName).parentElement.parentElement;
	}
	else {
		var layerGroupsList = document.getElementsByClassName("list-unstyled togglers")[0];
		group = document.createElement("li");
		group.className = "group";
		var togglerContainer = document.createElement("div");
		togglerContainer.className = "layer-switcher-toggler-tree-category";
		var groupButton = document.createElement("wz-button");
		groupButton.color = "clear-icon";
		groupButton.size = "xs";
		var iCaretDown = document.createElement("i");
		iCaretDown.className = "toggle-category w-icon w-icon-caret-down";
		iCaretDown.dataset.groupId = layerSwitcherGroupItemName.replace("layer-switcher-", "").toUpperCase();
		var togglerSwitch = document.createElement("wz-toggle-switch");
		togglerSwitch.className = layerSwitcherGroupItemName + " hydrated";
		togglerSwitch.id = layerSwitcherGroupItemName;
		togglerSwitch.checked = true;
		var label = document.createElement("label");
		label.className = "label-text";
		label.htmlFor = togglerSwitch.id;
		var togglerChildrenList = document.createElement("ul");
		togglerChildrenList.className = "collapsible-" + layerSwitcherGroupItemName.replace("layer-switcher-", "").toUpperCase();
		label.appendChild(document.createTextNode(layerGroupVisibleName));
		groupButton.addEventListener("click", layerTogglerGroupMinimizerEventHandler(iCaretDown));
		togglerSwitch.addEventListener("click", layerTogglerGroupMinimizerEventHandler(iCaretDown));
		groupButton.appendChild(iCaretDown);
		togglerContainer.appendChild(groupButton);
		togglerContainer.appendChild(togglerSwitch);
		togglerContainer.appendChild(label);
		group.appendChild(togglerContainer);
		group.appendChild(togglerChildrenList);
		layerGroupsList.appendChild(group);
	}
	return group;
}

function addLayerToggler(groupToggler, layerName, isPublic, layerArray) {
	var layerToggler = {};
	layerToggler.layerName = layerName;
    layerToggler.serviceType = (layerArray.filter(e => e.serviceType == "XYZ").length > 0) ? "XYZ" : "WMS";
	var layerShortcut = layerName.replace(/ /g, "_").replace(".", "");
	layerToggler.htmlItem = "layer-switcher-item_" + layerShortcut;
	layerToggler.layerArray = layerArray;

	var layer_container = groupToggler.getElementsByTagName("UL")[0];
	var layerGroupCheckbox = groupToggler.getElementsByClassName("layer-switcher-toggler-tree-category")[0].getElementsByTagName("wz-toggle-switch")[0];

	var toggler = document.createElement("li");
	var togglerCheckbox = document.createElement("wz-checkbox");
	togglerCheckbox.id = layerToggler.htmlItem;
	togglerCheckbox.className = "hydrated";

    // ZAŠKRTNÚŤ LEN ORTO VRSTVU
    togglerCheckbox.checked = (layerName === "Ortofoto ZBGIS");

	var labelSymbol = document.createElement("span");
	labelSymbol.className = (isPublic) ? "fa fa-location-arrow" : "fa fa-lock";
	togglerCheckbox.appendChild(labelSymbol);
	togglerCheckbox.appendChild(document.createTextNode(layerName));
	toggler.appendChild(togglerCheckbox);
	layer_container.appendChild(toggler);

	for (var i = 0; i < layerArray.length; i++){
		togglerCheckbox.addEventListener("change", layerTogglerEventHandler(layerArray[i]));
		layerGroupCheckbox.addEventListener("change", layerTogglerGroupEventHandler(togglerCheckbox, layerArray[i]));
		layerArray[i].layer.name = layerName + ((layerArray.length > 1) ? " " + i : "");

        // Ak je to orto, nastav aj viditeľnosť vrstvy
        if (layerName === "Ortofoto ZBGIS") {
            layerArray[i].layer.setVisibility(true);
            if (layerArray[i].placeAtBottom) {
                W.map.setLayerIndex(layerArray[i].layer, 0);
            }
        }
	}
	registerKeyShortcut("WMS: " + layerName, layerKeyShortcutEventHandler(layerGroupCheckbox, togglerCheckbox), layerShortcut);
	return layerToggler;
}

function registerKeyShortcut(actionName, callback, keyName) {
	I18n.translations[I18n.locale].keyboard_shortcuts.groups.default.members[keyName] = actionName;
	W.accelerators.addAction(keyName, {group: "default"});
	W.accelerators.events.register(keyName, null, callback);
	W.accelerators._registerShortcuts({["name"]: keyName});
}

function layerTogglerEventHandler(layerType) {
	return function() {
		if (this.checked) {
            if (!W.map.getLayerByName(layerType.layer.name)) {
                W.map.addLayer(layerType.layer);
            }

            // Nastav visibility az PO pridani do mapy
            setTimeout(() => {
                layerType.layer.setVisibility(true);
                layerType.layer.redraw(true);
            }, 50);
            // ak má vrstva byť dole → po pridaní presunúť na začiatok
            if (layerType.placeAtBottom) {
                W.map.setLayerIndex(layerType.layer, 0);
            }
		}
		else {
			layerType.layer.setVisibility(false);
			W.map.removeLayer(layerType.layer);
		}
	};
}

function layerKeyShortcutEventHandler(groupCheckbox, checkbox) {
	return function() {
		if (!groupCheckbox.disabled) {
			checkbox.click();
		}
	};
}

function layerTogglerGroupEventHandler(checkbox, layerType) {
	return function() {
		if (this.checked) {
			if (checkbox.checked) {
				W.map.addLayer(layerType.layer);
				layerType.layer.setVisibility(this.checked && checkbox.checked);
			}
		}
		else {
			if (checkbox.checked) {
				layerType.layer.setVisibility(this.checked && checkbox.checked);
				W.map.removeLayer(layerType.layer);
			}
		}
		checkbox.disabled = !this.checked;
	};
}

function layerTogglerGroupMinimizerEventHandler(iCaretDown) {
	return function() {
		var ulCollapsible = iCaretDown.parentElement.parentElement.parentElement.getElementsByTagName("UL")[0];
		if (!iCaretDown.classList.contains("upside-down")) {
			iCaretDown.classList.add("upside-down");
			ulCollapsible.classList.add("collapse-layer-switcher-group");
		}
		else {
			iCaretDown.classList.remove("upside-down");
			ulCollapsible.classList.remove("collapse-layer-switcher-group");
		}
	};
}

function setZOrdering(layerTogglers) {
	return function() {
		for (var key in layerTogglers) {
			for (var j = 0; j < layerTogglers[key].layerArray.length; j++) {
				if (layerTogglers[key].layerArray[j].zIndex > 0) {
					var l = W.map.getLayerByName(layerTogglers[key].layerName);
					if (l !== undefined) {
						l.setZIndex(layerTogglers[key].layerArray[j].zIndex);
					}
				}
			}
		}
	};
}

function getUrl4326(bounds) {
	var newParams = {};
	bounds.transform(this.projection, this.epsg4326);
	newParams.BBOX = bounds.toArray(this.reverseAxisOrder());
	newParams.WIDTH = 742;
	newParams.HEIGHT = 485;
	var requestString = this.getFullRequestString(newParams);
	return requestString;
}

function getFullRequestString4326(newParams) {
	this.params.SRS = "EPSG:4326";
	return OL.Layer.Grid.prototype.getFullRequestString.apply(this, arguments);
}

document.addEventListener("wme-map-data-loaded", init, {once: true});