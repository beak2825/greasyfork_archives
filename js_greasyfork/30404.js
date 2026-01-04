// ==UserScript==
// @name			Czech WMS layers (beta fork)
// @version			2025.11.06
// @author			petrjanik, d2-mac, MajkiiTelini
// @description		Displays layers from Czech WMS services (ČÚZK) in WME
// @match 			https://*.waze.com/*editor*
// @run-at			document-end
// @namespace		https://greasyfork.org/cs/users/110192
// @downloadURL https://update.greasyfork.org/scripts/30404/Czech%20WMS%20layers%20%28beta%20fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/30404/Czech%20WMS%20layers%20%28beta%20fork%29.meta.js
// ==/UserScript==

var W;
var OL;
var I18n;
var ZIndexes = {};

function init(e) {
	W = unsafeWindow.W;
	OL = unsafeWindow.OpenLayers;
	I18n = unsafeWindow.I18n;

	ZIndexes.base = W.map.olMap.Z_INDEX_BASE.Overlay + 20;
	ZIndexes.overlay = W.map.olMap.Z_INDEX_BASE.Overlay + 100;
	ZIndexes.popup = W.map.olMap.Z_INDEX_BASE.Overlay + 500;

	// adresy WMS služeb
	var service_wms_orto = {"type" : "WMS", "url" : "https://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/WMService.aspx?", "attribution" : "ČUZK Ortofoto", "comment" : "ČUZK ortofoto"};
	var service_wms_geonames = {"type" : "WMS", "url" : "https://geoportal.cuzk.cz/WMS_GEONAMES_PUB/WMService.aspx?", "attribution" : "ČUZK Geonames", "comment" : "ČUZK GeoNames"};
	var service_wms_katastr = {"type" : "WMS", "url" : "https://services.cuzk.cz/wms/wms.asp?", "attribution" : "ČUZK Katastrální mapy", "comment" : "ČUZK katastr"};
	var service_wms_inspire = {"type" : "WMS", "url" : "https://services.cuzk.cz/wms/inspire-ad-wms.asp?", "attribution" : "ČUZK INSPIRE", "comment" : "ČUZK čísla popisná a orientační + názvy ulic"};
	var service_wms_zabaged = {"type" : "WMS", "url" : "https://ags.cuzk.cz/arcgis/services/ZABAGED/MapServer/WMSServer?", "attribution" : "ČUZK ZABAGED®", "comment" : "ČUZK Doprava, Lesy, Vodní plochy"};
	//skupina vrstev v menu
	var groupTogglerWMS = addGroupToggler(false, "layer-switcher-group_wms", "WMS ČÚZK");
	//vrstvy v menu
	var WMSLayerTogglers = {};
	WMSLayerTogglers.wms_verejne = addLayerToggler(groupTogglerWMS, "Veřejné budovy", [addNewLayer("wms_verejne", service_wms_zabaged, "89,90,91,154,155,156,157,159,158,176"), addNewLayer("wms_verejne_1", service_wms_zabaged, "24,25,26,39,40,41,46,47,57,68,69,70,88", 0, 0.7), addNewLayer("wms_verejne_2", service_wms_geonames, "GN8,GN10")]);
	WMSLayerTogglers.wms_lesvoda = addLayerToggler(groupTogglerWMS, "Lesy a vodstva", [addNewLayer("wms_lesvoda", service_wms_zabaged, "77,78,79,80,82,83,84,143,189,190,191,192,193,194,195,196"), addNewLayer("wms_lesvoda_1", service_wms_zabaged, "0,1,2,3,4,5,6,7,8,9,10,11,19,20,21", 0, 0.7), addNewLayer("wms_lesvoda_2", service_wms_geonames, "GN13,GN18,GN19,GN20,GN21")]);
	WMSLayerTogglers.wms_cesty = addLayerToggler(groupTogglerWMS, "Místní cesty", [addNewLayer("wms_cesty", service_wms_zabaged, "98,102,103,106", 0), addNewLayer("wms_cesty_1", service_wms_zabaged, "96,97", 0, 0.6)]);
	WMSLayerTogglers.wms_orto = addLayerToggler(groupTogglerWMS, "Ortofoto ČUZK", [addNewLayer("wms_orto", service_wms_orto, "GR_ORTFOTORGB", ZIndexes.base)]);
	WMSLayerTogglers.wms_katastr = addLayerToggler(groupTogglerWMS, "Katastrální mapa", [addNewLayer("wms_katastr", service_wms_katastr, "hranice_parcel,dalsi_p_mapy,RST_KN")]);
	WMSLayerTogglers.wms_budovy = addLayerToggler(groupTogglerWMS, "Adresní místa 1a", [addNewLayer("wms_budovy", service_wms_inspire, "AD.Addresses.Text.AddressNumber,AD.Addresses.ByPrefixNumber.TypOfBuilding.2,AD.Addresses.ByPrefixNumber.TypOfBuilding.1")]);
	WMSLayerTogglers.wms_budovy_b = addLayerToggler(groupTogglerWMS, "Adresní místa 1b", [addNewLayer("wms_budovy_b", service_wms_inspire, "AD.Addresses.Text.AddressAreaName,AD.Addresses.Text.ThoroughfareName")]);

	window.addEventListener("beforeunload", function() {
		if (localStorage) {
			var JSONStorageOptions = {};
			for (var key in WMSLayerTogglers) {
				JSONStorageOptions[key] = document.getElementById(WMSLayerTogglers[key].htmlItem).checked;
			}
			localStorage.WMSLayers = JSON.stringify(JSONStorageOptions);
		}
	}, false);
	if (localStorage.WMSLayers) {
		var JSONStorageOptions = JSON.parse(localStorage.WMSLayers);
		for (var key in WMSLayerTogglers) {
			if (JSONStorageOptions[key]) {
				document.getElementById(WMSLayerTogglers[key].htmlItem).click();
			}
		}
	}
	setZOrdering(WMSLayerTogglers);
	W.map.events.register("addlayer", null, setZOrdering(WMSLayerTogglers));
	W.map.events.register("removelayer", null, setZOrdering(WMSLayerTogglers));
	W.map.events.register("moveend", null, setZOrdering(WMSLayerTogglers));
}

function addNewLayer(id, service, serviceLayers, zIndex = 0, opacity = 1) {
	var newLayer = {};
	if (service.type == "XYZ" & zIndex == 0) {
		newLayer.zIndex = ZIndexes.base;
	} else {
		newLayer.zIndex = (zIndex == 0) ? ZIndexes.popup : zIndex;
	}
	newLayer.layer = new OL.Layer.WMS(
		id, service.url,
		{
			layers: serviceLayers ,
			transparent: "true",
			format: "image/png"
		},
		{
			opacity: opacity,
			tileSize: new OL.Size(512,512),
			isBaseLayer: false,
			visibility: false,
			transitionEffect: "resize",
			attribution: service.attribution,
			projection: new OL.Projection("EPSG:3857") //alternativa defaultní EPSG:900913
		}
	);
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

function addLayerToggler(groupToggler, layerName, layerArray) {
	var layerToggler = {};
	layerToggler.layerName = layerName;
	var layerShortcut = layerName.replace(/ /g, "_").replace(".", "");
	layerToggler.htmlItem = "layer-switcher-item_" + layerShortcut;
	layerToggler.layerArray = layerArray;
	var layer_container = groupToggler.getElementsByTagName("UL")[0];
	var layerGroupCheckbox = groupToggler.getElementsByClassName("layer-switcher-toggler-tree-category")[0].getElementsByTagName("wz-toggle-switch")[0];
	var toggler = document.createElement("li");
	var togglerCheckbox = document.createElement("wz-checkbox");
	togglerCheckbox.id = layerToggler.htmlItem;
	togglerCheckbox.className = "hydrated";
	togglerCheckbox.appendChild(document.createTextNode(layerName));
	toggler.appendChild(togglerCheckbox);
	layer_container.appendChild(toggler);
	for (var i = 0; i < layerArray.length; i++){
		togglerCheckbox.addEventListener("change", layerTogglerEventHandler(layerArray[i]));
		layerGroupCheckbox.addEventListener("change", layerTogglerGroupEventHandler(togglerCheckbox, layerArray[i]));
		layerArray[i].layer.name = layerName + ((layerArray.length > 1) ? " " + i : "");
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
			W.map.addLayer(layerType.layer);
			layerType.layer.setVisibility(this.checked);
		}
		else {
			layerType.layer.setVisibility(this.checked);
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

document.addEventListener("wme-map-data-loaded", init, {once: true});