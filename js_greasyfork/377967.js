// ==UserScript==
// @name			SVK WMS layers
// @version			2019.02.05f
// @authorCZ		petrjanik, d2-mac, MajkiiTelini
// @description		Displays layers from Slovak WMS services in WME
// @include			/^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @copyright		2013,2014+, Patryk Ściborek, Paweł Pyrczak
// @run-at			document-end
// @namespace		https://greasyfork.org/sk/users/158746
// @downloadURL https://update.greasyfork.org/scripts/377967/SVK%20WMS%20layers.user.js
// @updateURL https://update.greasyfork.org/scripts/377967/SVK%20WMS%20layers.meta.js
// ==/UserScript==

(function() {
	var WMSLayersTechSource = {};

	function init(e) {
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
		WMSLayersTechSource.epsg900913 = new unsafeWindow.OpenLayers.Projection("EPSG:900913");
		WMSLayersTechSource.epsg4326 = new unsafeWindow.OpenLayers.Projection("EPSG:4326");
		WMSLayersTechSource.tileSizeG = new OL.Size(512,512);
        // adresy WMS služeb
        var service_wms_katastr = {"type" : "WMS_3857", "url" : "https://kataster.skgeodesy.sk/eskn/services/NR/kn_wms_norm/MapServer/WmsServer?", "attribution" : "ČUZK Katastrální mapy", "comment" : "ČUZK katastr"};
        var service_wms_hranice = {"type" : "WMS_4326", "url" : "https://zbgisws.skgeodesy.sk/zbgis_administrativne_hranice_wms_featureinfo/service.svc/get?", "attribution" : "ČUZK Katastrální mapy", "comment" : "ČUZK katastr"};
        var service_wms_vodstvo = {"type" : "WMS_4326", "url" : "https://zbgisws.skgeodesy.sk/zbgis_vodstvo_wms_featureinfo/service.svc/get?", "attribution" : "ČUZK Katastrální mapy", "comment" : "ČUZK katastr"};
        var service_wms_vegetacia = {"type" : "WMS_4326", "url" : "https://zbgisws.skgeodesy.sk/zbgis_vegetacia_wms_featureinfo/service.svc/get?", "attribution" : "ČUZK Katastrální mapy", "comment" : "ČUZK katastr"};
        var service_wms_gn = {"type" : "WMS_4326", "url" : "https://zbgisws.skgeodesy.sk/zbgis_geograficke_nazvoslovie_wms/service.svc/get?", "attribution" : "ČUZK Katastrální mapy", "comment" : "ČUZK katastr"};
        //skupina vrstev v menu
        var groupTogglerWMS = addGroupToggler(false, "layer-switcher-group_wms", "WMS SK");
		//vrstvy v menu
		var layerTogglers = {};
        layerTogglers.wms_katastr = addLayerToggler(groupTogglerWMS, "Katastrálna mapa", [addNewLayer("wms_katastr", service_wms_katastr, "5,8")]);
        layerTogglers.wms_hranice = addLayerToggler(groupTogglerWMS, "Hranice", [addNewLayer("wms_hranice", service_wms_hranice, "0,1,2,3")]);
        layerTogglers.wms_vodstvo = addLayerToggler(groupTogglerWMS, "Vodstvo", [addNewLayer("wms_vodstvo", service_wms_vodstvo, "5,6,7")]);
        layerTogglers.wms_vegetacia = addLayerToggler(groupTogglerWMS, "Lesy", [addNewLayer("wms_vegetacia", service_wms_vegetacia, "5")]);
        layerTogglers.wms_gn = addLayerToggler(groupTogglerWMS, "Geografické názvy", [addNewLayer("wms_gn", service_wms_gn, "0,1,2,3,4")]);

		addGroupVisibilityToggler();
		OrtoTimer(layerTogglers);

		if (localStorage.WMSLayers) {
			var JSONStorageOptions = JSON.parse(localStorage.WMSLayers);
			for (var key in layerTogglers) {
				if (JSONStorageOptions[key]) {
					document.getElementById(layerTogglers[key].htmlItem).click();
				}
			}
		}
		var saveWMSLayersOptions = function() {
			if (localStorage) {
				var JSONStorageOptions = {};
				for (var key in layerTogglers) {
					JSONStorageOptions[key] = document.getElementById(layerTogglers[key].htmlItem).checked;
				}
				localStorage.WMSLayers = JSON.stringify(JSONStorageOptions);
			}
		};
		window.addEventListener("beforeunload", saveWMSLayersOptions, false);
	}

	addNewLayer = function(id, service, serviceLayers, zIndex) {
		var newLayer = {};
		newLayer.uniqueName = "_" + id;
		newLayer.zIndex = (typeof zIndex === 'undefined') ? 0 : zIndex;
		switch(service.type) {
			case "WMS":
				newLayer.layer = new OpenLayers.Layer.WMS(
					id, service.url,
					{
						layers: serviceLayers ,
						transparent: "true",
						format: "image/png"
					},
					{
						tileSize: WMSLayersTechSource.tileSizeG,
						isBaseLayer: false,
						visibility: false,
						transitionEffect: "resize",
						attribution: service.attribution,
						uniqueName: newLayer.uniqueName,
					}
				);
				break;
			case "WMS_3857":
				newLayer.layer = new OpenLayers.Layer.WMS(
					id, service.url,
					{
						layers: serviceLayers ,
						transparent: "true",
						format: "image/png"
					},
					{
						tileSize: WMSLayersTechSource.tileSizeG,
						isBaseLayer: false,
						visibility: false,
						transitionEffect: "resize",
						attribution: service.attribution,
						uniqueName: newLayer.uniqueName,
						projection: new unsafeWindow.OpenLayers.Projection("EPSG:3857")
					}
				);
				break;
			case "WMS_4326":
				newLayer.layer = new OpenLayers.Layer.WMS(
					id, service.url,
					{
						layers: serviceLayers ,
						transparent: "true",
						format: "image/png"
					},
					{
						tileSize: WMSLayersTechSource.tileSizeG,
						isBaseLayer: false,
						visibility: false,
						transitionEffect: "resize",
						attribution: service.attribution,
						uniqueName: newLayer.uniqueName,
						epsg900913: WMSLayersTechSource.epsg900913,
						epsg4326: WMSLayersTechSource.epsg4326,
						getURL: getUrl4326,
						ConvTo2180: ConvTo2180,
						ep2180: false,
						getFullRequestString: getFullRequestString4326
					}
				);
				break;
			default:
				newLayer.layer = null;
		}
		return newLayer;
	};

	addGroupToggler = function(isDefault, layerSwitcherGroupItemName, layerGroupVisibleName) {
		var group;
		if (isDefault === true) {
			group = document.getElementById(layerSwitcherGroupItemName).parentElement.parentElement;
		}
		else {
			var layerGroupsList = document.getElementsByClassName("list-unstyled togglers")[0];
			group = document.createElement("li");
			group.className = "group";
			var togglerContainer = document.createElement("div");
			togglerContainer.className = "controls-container main toggler";
			var checkbox = document.createElement("input");
			checkbox.className = "toggle";
			checkbox.id = layerSwitcherGroupItemName;
			checkbox.type = "checkbox";
			checkbox.checked = "true";
			var label = document.createElement("label");
			label.htmlFor = checkbox.id;
			var labelText = document.createElement("span");
			labelText.className = "label-text";
			var togglerChildrenList = document.createElement("ul");
			togglerChildrenList.className = "children";
			togglerContainer.appendChild(checkbox);
			labelText.appendChild(document.createTextNode(layerGroupVisibleName));
			label.appendChild(labelText);
			togglerContainer.appendChild(label);
			group.appendChild(togglerContainer);
			group.appendChild(togglerChildrenList);
			layerGroupsList.appendChild(group);
		}
		return group;
	};

	addLayerToggler = function(groupToggler, layerName, layerArray) {
		var layerToggler = {};
		var layerShortcut = layerName.replace(/ /g, "_").replace(".", "");
		layerToggler.htmlItem = "layer-switcher-item_" + layerShortcut;
		layerToggler.layerArray = layerArray;
		var layer_container = groupToggler.getElementsByClassName("children")[0];
		var layerGroupCheckbox = groupToggler.getElementsByClassName("controls-container main toggler")[0].getElementsByClassName("toggle")[0];
		var toggler = document.createElement("li");
		var togglerContainer = document.createElement("div");
		togglerContainer.className = "controls-container toggler";
		var checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.id = layerToggler.htmlItem;
		checkbox.className = "toggle";
		checkbox.disabled = !layerGroupCheckbox.checked;
		togglerContainer.appendChild(checkbox);
		var label = document.createElement("label");
		label.htmlFor = checkbox.id;
		var labelText2 = document.createElement("span");
		labelText2.className = "label-text";
		labelText2.appendChild(document.createTextNode(" " + layerName));
		label.appendChild(labelText2);
		togglerContainer.appendChild(label);
		toggler.appendChild(togglerContainer);
		layer_container.appendChild(toggler);
		for (var i = 0; i < layerArray.length; i++){
			checkbox.addEventListener("click", layerTogglerEventHandler(layerArray[i].layer));
			layerGroupCheckbox.addEventListener("click", layerTogglerGroupEventHandler(checkbox, layerArray[i].layer));
		}
		registerKeyShortcut("WMS " + layerName, layerKeyShortcutEventHandler(layerGroupCheckbox, checkbox), layerShortcut);
		return layerToggler;
	};

	addGroupVisibilityToggler = function() {
		var layerGroupsList = Array.filter(Array.prototype.slice.call(document.getElementsByClassName("list-unstyled togglers")[0].childNodes), function(e) {return e.nodeType == 1 && e.tagName == "LI";});
		for (i = 0; i < layerGroupsList.length; i++) {
			var togglerContainer = Array.filter(Array.prototype.slice.call(layerGroupsList[i].childNodes), function(e) {return e.nodeType == 1 && e.tagName == "DIV";})[0];
			var togglerChildrenList = Array.filter(Array.prototype.slice.call(layerGroupsList[i].childNodes), function(e) {return e.nodeType == 1 && e.tagName == "UL";})[0];
			var aControlWindow = document.createElement("a");
			aControlWindow.href = "#";
			aControlWindow.className = "fa fa-window-minimize pull-right";
			togglerContainer.appendChild(aControlWindow);
			aControlWindow.addEventListener("click", layersEventHandler(Array.filter(Array.prototype.slice.call(togglerChildrenList.childNodes), function(e) {return e.nodeType == 1 && e.tagName == "LI";})));
		}
	};

	function registerKeyShortcut(actionName, callback, keyName) {
		I18n.translations[I18n.locale].keyboard_shortcuts.groups['default'].members[keyName] = actionName;
		W.accelerators.addAction(keyName, {group: 'default'});
		W.accelerators.events.register(keyName, null, callback);
		W.accelerators._registerShortcuts({[""]: keyName});
	}

	function layerTogglerEventHandler(layer) {
		return function() {
			if (this.checked) {
				W.map.addLayer(layer);
				layer.setVisibility(this.checked);
			} else {
				layer.setVisibility(this.checked);
				W.map.removeLayer(layer);
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

	function layerTogglerGroupEventHandler(checkbox, layer) {
		return function() {
			if (this.checked) {
				if (checkbox.checked) {
					W.map.addLayer(layer);
					layer.setVisibility(this.checked & checkbox.checked);
				}
			}
			else {
				if (checkbox.checked) {
					layer.setVisibility(this.checked & checkbox.checked);
					W.map.removeLayer(layer);
				}
			}
			checkbox.disabled = !this.checked;
		};
	}

	function layersEventHandler(childList) {
		return function () {
			if (this.className == "fa fa-window-maximize pull-right"){
				this.className = "fa fa-window-minimize pull-right";
				for (j = 0; j < childList.length; j++) {
					childList[j].style.display = "";
				}
			}
			else{
				this.className = "fa fa-window-maximize pull-right";
				for (j = 0; j < childList.length; j++) {
					childList[j].style.display = "none";
				}
			}
		};
	}

	OrtoTimer = function(layerTogglers) {
		setTimeout(function(){
			for (var key in layerTogglers) {
				for (j = 0; j < layerTogglers[key].layerArray.length; j++) {
					if (layerTogglers[key].layerArray[j].zIndex > 0) {
						var l = W.map.getLayersBy("uniqueName", layerTogglers[key].layerArray[j].uniqueName);
						if (l.length > 0) {
							l[0].setZIndex(layerTogglers[key].layerArray[j].zIndex);
						}
					}
				}
			}
			OrtoTimer(layerTogglers);
		},500);
	};

	getUrl4326 = function (bounds) {
		/* this function is modified Openlayer WMS CLASS part */
		/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
		* full list of contributors). Published under the 2-clause BSD license.
		* See license.txt in the OpenLayers distribution or repository for the
		* full text of the license. */
		bounds = bounds.clone();
		bounds = this.adjustBounds(bounds);
		var imageSize = this.getImageSize(bounds);
		var newParams = {};
		bounds.transform(this.epsg900913,this.epsg4326);
		if (this.ep2180) {
			bounds = bounds.clone();
			a={lat: bounds.bottom , lon: bounds.right};
			b={lat: bounds.top, lon: bounds.left};
			a=this.ConvTo2180(a);
			b=this.ConvTo2180(b);
			bounds.bottom = a.lat;
			bounds.right = a.lon;
			bounds.top = b.lat;
			bounds.left = b.lon;
		}
		// WMS 1.3 introduced axis order
		var reverseAxisOrder = this.reverseAxisOrder();
		newParams.BBOX = this.encodeBBOX ? bounds.toBBOX(null, reverseAxisOrder) : bounds.toArray(reverseAxisOrder);
		/*newParams.WIDTH = imageSize.w;*/
		newParams.WIDTH = 742;
		/*newParams.HEIGHT = imageSize.h;*/
		newParams.HEIGHT = 485;
		var requestString = this.getFullRequestString(newParams);
		return requestString;
	};

	ConvTo2180 = function(p) {
		//var D2R = 0.01745329251994329577;
		var D2R = 0.0174532925199433;
		var mlfn = function(e0, e1, e2, e3, phi) {
			return (e0 * phi - e1 * Math.sin(2 * phi) + e2 * Math.sin(4 * phi) - e3 * Math.sin(6 * phi));
		};
		var contants = {
			a: 6377397.155,
			rf: 299.1528128,
			x0 : 500000,
			y0 : -5300000,
			k0 : 0.9999,
			init : function() {
				var D2R = 0.0174532925199433;
				/*a: 6378137.0,
rf: 298.257222101,
x0 : 500000,
y0 : -5300000,
k0 : 0.9993,
init : function() {
var D2R = 0.01745329251994329577; */
				this.lon0 = 19.0 * D2R;
				this.lat0 = 0 * D2R;
				this.b = ((1.0 - 1.0 / this.rf) * this.a);
				this.ep2 = ((Math.pow(this.a,2) - Math.pow(this.b,2)) / Math.pow(this.b,2));
				this.es = ((Math.pow(this.a,2) - Math.pow(this.b,2)) / Math.pow(this.a,2));
				this.e0 = (1 - 0.25 * this.es * (1 + this.es / 16 * (3 + 1.25 * this.es)));
				this.e1 = (0.375 * this.es * (1 + 0.25 * this.es * (1 + 0.46875 * this.es)));
				this.e2 = (0.05859375 * this.es * this.es * (1 + 0.75 * this.es));
				this.e3 = (this.es * this.es * this.es * (35 / 3072));
				this.ml0 = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0);
			}
		};
		contants.init();
		var lon = p.lon * D2R;
		var lat = p.lat * D2R;
		var a0 = 0;
		var b0 = 0;
		var k0 = 0.9999;
		var lon0 = 19.0 * D2R;
		var lat0 = 0 * D2R;
		var delta_lon = lon - lon0;
		var slon = (delta_lon < 0) ? -1 : 1;
		delta_lon = (Math.abs(delta_lon) < Math.PI) ? delta_lon : (delta_lon - (slon * (Math.PI * 2)));
		var con;
		var x, y;
		var sin_phi = Math.sin(lat);
		var cos_phi = Math.cos(lat);
		var sphere = false;
		if (sphere) {
			var b = cos_phi * Math.sin(delta_lon);
			if ((Math.abs(Math.abs(b) - 1)) < 0.0000000001) {
				return (93);
			}
			else {
				x = 0.5 * a0 * k0 * Math.log((1 + b) / (1 - b));
				con = Math.acos(cos_phi * Math.cos(delta_lon) / Math.sqrt(1 - b * b));
				if (lat < 0) {
					con = -con;
				}
				y = a0 * k0 * (con - lat0);
			}
		}
		else {
			var al = cos_phi * delta_lon;
			var als = Math.pow(al, 2);
			var c = contants.ep2 * Math.pow(cos_phi, 2);
			var tq = Math.tan(lat);
			var t = Math.pow(tq, 2);
			con = 1 - contants.es * Math.pow(sin_phi, 2);
			var n = contants.a / Math.sqrt(con);
			var ml = contants.a * mlfn(contants.e0, contants.e1, contants.e2, contants.e3, lat);
			x = contants.k0 * n * al * (1 + als / 6 * (1 - t + c + als / 20 * (5 - 18 * t + Math.pow(t, 2) + 72 * c - 58 * contants.ep2))) + contants.x0;
			y = contants.k0 * (ml - contants.ml0 + n * tq * (als * (0.5 + als / 24 * (5 - t + 9 * c + 4 * Math.pow(c, 2) + als / 30 * (61 - 58 * t + Math.pow(t, 2) + 600 * c - 330 * contants.ep2))))) + contants.y0;
		}
		p.lon = x;
		p.lat = y;
		return p;
	};

	getFullRequestString4326 = function(newParams, altUrl) {
		/* this function is modified Openlayer WMS CLASS part */
		/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
		* full list of contributors). Published under the 2-clause BSD license.
		* See license.txt in the OpenLayers distribution or repository for the
		* full text of the license. */
		var mapProjection = this.map.getProjectionObject();
		var projectionCode = this.projection.getCode();
		var value = (projectionCode == "none") ? null : projectionCode;
		if (parseFloat(this.params.VERSION) >= 1.3) {
			this.params.CRS = value;
		} else {
			this.params.SRS = (this.ep2180) ? "EPSG:2180" : "EPSG:4326";
		}
		if (typeof this.params.TRANSPARENT == "boolean") {
			newParams.TRANSPARENT = this.params.TRANSPARENT ? "TRUE" : "FALSE";
		}
		return unsafeWindow.OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this, arguments);
	};

	init();
})();