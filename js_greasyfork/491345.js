// ==UserScript==
// @name		WME Mods
// @version		2025.09.20.00
// @description	Modifies the Waze Map Editor to suit my needs
// @author		fuji2086
// @match		*://*.waze.com/*editor*
// @exclude		*://*.waze.com/user/editor*
// @grant		GM_xmlhttpRequest
// @require		https://greasyfork.org/scripts/39002-bluebird/code/Bluebird.js?version=255146
// @require		https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require		https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js
// @require		https://update.greasyfork.org/scripts/509664/WME%20Utils%20-%20Bootstrap.js
// @connect		greasyfork.org
// @connect		wv.gov
// @license		GNU GPLv3
// @namespace	https://greasyfork.org/en/users/456696
// @downloadURL https://update.greasyfork.org/scripts/491345/WME%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/491345/WME%20Mods.meta.js
// ==/UserScript==

/* global $ */
/* global turf */
/* global bootstrap */

(async function main() {
	'use strict';

    const settingsStoreName = 'wme_mods';
    const debug = false;
    const scriptVersion = GM_info.script.version;
    const downloadUrl = 'https://greasyfork.org/scripts/491345/code/WME%20Mods.user.js';
    const sdk = await bootstrap({ scriptUpdateMonitor: { downloadUrl } });
    const layerName = 'RT Layer';
    let isAM = false;
    let userNameLC;
    let settings = {};
    let rank;
    let MAP_LAYER_Z_INDEX;
	let _lastPromise = null;
    let _lastContext = null;
    let _rtCallCount = 0;
    const MIN_ZOOM_LEVEL = 11;
    const STATES_HASH = {
        Alabama: 'AL',
        Alaska: 'AK',
        'American Samoa': 'AS',
        Arizona: 'AZ',
        Arkansas: 'AR',
        California: 'CA',
        Colorado: 'CO',
        Connecticut: 'CT',
        Delaware: 'DE',
        'District of Columbia': 'DC',
        'Federated States Of Micronesia': 'FM',
        Florida: 'FL',
        Georgia: 'GA',
        Guam: 'GU',
        Hawaii: 'HI',
        Idaho: 'ID',
        Illinois: 'IL',
        Indiana: 'IN',
        Iowa: 'IA',
        Kansas: 'KS',
        Kentucky: 'KY',
        Louisiana: 'LA',
        Maine: 'ME',
        'Marshall Islands': 'MH',
        Maryland: 'MD',
        Massachusetts: 'MA',
        Michigan: 'MI',
        Minnesota: 'MN',
        Mississippi: 'MS',
        Missouri: 'MO',
        Montana: 'MT',
        Nebraska: 'NE',
        Nevada: 'NV',
        'New Hampshire': 'NH',
        'New Jersey': 'NJ',
        'New Mexico': 'NM',
        'New York': 'NY',
        'North Carolina': 'NC',
        'North Dakota': 'ND',
        'Northern Mariana Islands': 'MP',
        Ohio: 'OH',
        Oklahoma: 'OK',
        Oregon: 'OR',
        Palau: 'PW',
        Pennsylvania: 'PA',
        'Puerto Rico': 'PR',
        'Rhode Island': 'RI',
        'South Carolina': 'SC',
        'South Dakota': 'SD',
        Tennessee: 'TN',
        Texas: 'TX',
        Utah: 'UT',
        Vermont: 'VT',
        'Virgin Islands': 'VI',
        Virginia: 'VA',
        Washington: 'WA',
        'West Virginia': 'WV',
        Wisconsin: 'WI',
        Wyoming: 'WY'
    };

    function reverseStatesHash(stateAbbr) {
        // eslint-disable-next-line no-restricted-syntax
        for (const stateName in STATES_HASH) {
            if (STATES_HASH[stateName] === stateAbbr) return stateName;
        }
        throw new Error(`RT Layer: reverseStatesHash function did not return a value for ${stateAbbr}.`);
    }

	const STATE_SETTINGS = {
		global: {
			roadTypes: ['St', 'StUp', 'OR'],
			getFeatureRoadType(feature, layer) {
				const rt = feature.attributes[layer.rtPropName];
				return this.getRoadTypeFromRT(rt, layer);
			},
			getRoadTypeFromRT(rt, layer) {
				return Object.keys(layer.roadTypeMap).find(rti => layer.roadTypeMap[rti].indexOf(rt) !== -1);
			},
			isPermitted(stateAbbr) {
				return (true);
			},
			getMapLayer(stateAbbr, layerID) {
				let returnValue;
				STATE_SETTINGS[stateAbbr].rtMapLayers.forEach(layer => {
					if (layer.layerID === layerID) {
						returnValue = layer;
					}
				});
				return returnValue;
			}
		},
		WV: {
			baseUrl: 'https://gis.transportation.wv.gov/arcgis/rest/services/Roads_And_Highways/Publication_LRS/MapServer/',
			defaultColors: {
				OR: '#000000', StUp: '#ffa500', St: '#eeeeee'
			},
			zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [[], [], [], [], [], [], [], [], [], [], []] },
			rtMapLayers: [
				{
					layerID: 70,
					rtPropName: 'SURFACE_TYPE',
					idPropName: 'OBJECTID',
					outFields: ['OBJECTID', 'SURFACE_TYPE', 'ROUTE_ID'],
					maxRecordCount: 1000,
					supportsPagination: true,
					roadTypeMap: {
						OR: [1], StUp: [3], St: [6]
					}
				}
			],
			information: { Source: 'WV DOT' },
			isPermitted() { return true; },
			getWhereClause(context) {
				if (context.mapContext.zoom < 16) {
					return `${context.layer.rtPropName} NOT IN (9,19)`;
				}
				return null;
			},
			getFeatureRoadType(feature, layer) {
				if (layer.getFeatureRoadType) {
					return layer.getFeatureRoadType(feature);
				}
				const rtCode = feature.attributes[layer.rtPropName];
				let rt = 6;
				if (rtCode == 99 || rtCode == 1.1) rt = 1;
				else if (rtCode == 1.3 || rtCode == 1.2) rt = 3;
				const id = feature.attributes.ROUTE_ID;
				return STATE_SETTINGS.global.getRoadTypeFromRT(rt, layer);
			}
		}
	};

	function log(message) {
		console.log('RT Layer: ', message);
	}
	function debugLog(message) {
		console.debug('RT Layer: ', message);
	}
	function errorLog(message) {
		console.error('RT Layer: ', message);
	}

	function UpdateZoomDisplay() {
		try {
			const zoomBar = $('.zoom-bar-container')[0];
			const zoomDisplayLevel = $('#zoomdisplaycontainer > p')[0];
			const zoomLevel = sdk.Map.getZoomLevel();

			zoomDisplayLevel.innerText = zoomLevel;
			switch (zoomLevel) {
				case 4:
				case 5:
				case 6:
				case 7:
				case 8:
				case 9:
				case 10:
				case 11:
				case 12:
				case 13:
					zoomBar.style.background = '#ef9a9a';
					break;
				case 14:
				case 15:
					zoomBar.style.background = '#ffe082';
					break;
				default:
					zoomBar.style.background = '#ffffff';
					break;
			}
		}
		catch {
			AddZoomDisplay();
		}
	}

	async function AddZoomDisplay() {
		const zoomBar = $('.zoom-bar-container')[0];
		const zoomDisplayContainer = $('<div>', {id:'zoomdisplaycontainer', style:'width:100%;'});
		zoomDisplayContainer.append($('<p>', {id:'zoomdisplaylevel', style:'font-size:20px;text-align:center;margin:0px;'}));
		zoomDisplayContainer.insertAfter(zoomBar.firstChild);
		UpdateZoomDisplay();
	}

	function waitForElm(selector) {
		return new Promise(resolve => {
			if (document.querySelector(selector)) {
				return resolve(document.querySelector(selector));
			}

			const observer = new MutationObserver(mutations => {
				if (document.querySelector(selector)) {
					observer.disconnect();
					resolve(document.querySelector(selector));
				}
			});

			// If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		});
	}

	function getLineWidth() {
		return 12 * (1.15 ** (sdk.Map.getZoomLevel() - 13));
	}

	function sortArray(array) {
		array.sort((a, b) => { if (a < b) return -1; if (a > b) return 1; return 0; });
	}

	function getVisibleStateAbbreviations() {
        const { activeStateAbbr } = settings;
        return sdk.DataModel.States.getAll()
            .map(state => STATES_HASH[state.name])
            .filter(stateAbbr => STATE_SETTINGS[stateAbbr]
                && STATE_SETTINGS.global.isPermitted(stateAbbr)
                && (!activeStateAbbr || activeStateAbbr === 'ALL' || activeStateAbbr === stateAbbr));
    }

	function getUrl(context, queryType, queryParams) {
		const { extent } = context.mapContext;
		const { zoom } = context.mapContext;
		const { layer } = context;
		const { state } = context;

		const whereParts = [];
		const geometry = {
			xmin: extent[0], ymin: extent[1], xmax: extent[2], ymax: extent[3], spatialReference: { wkid: 4326 }
		};
		const geometryStr = JSON.stringify(geometry);
		const stateWhereClause = state.getWhereClause(context);
		const layerPath = layer.layerPath || '';
		let url = `${state.baseUrl + layerPath + layer.layerID}/query?geometry=${encodeURIComponent(geometryStr)}`;

		if (queryType === 'countOnly') {
			url += '&returnCountOnly=true';
		} else if (queryType === 'idsOnly') {
			url += '&returnIdsOnly=true';
		} else if (queryType === 'paged') {
			// TODO
		} else {
			url += `&returnGeometry=true&maxAllowableOffset=${state.zoomSettings.maxOffset[zoom - 12]}`;
			url += `&outFields=${encodeURIComponent(layer.outFields.join(','))}`;
			if (queryType === 'idRange') {
				whereParts.push(`(${queryParams.idFieldName}>=${queryParams.range[0]} AND ${queryParams.idFieldName}<=${queryParams.range[1]})`);
			}
		}
		if (stateWhereClause) whereParts.push(stateWhereClause);
		if (whereParts.length > 0) url += `&where=${encodeURIComponent(whereParts.join(' AND '))}`;
		url += '&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=102100&outSR=3857&f=json';
		return url;
	}

	function getAsync(url, context) {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				context,
				method: 'GET',
				url,
				onload(res) {
					if (res.status.toString() === '200') {
						resolve({ responseText: res.responseText, context });
					} else {
						reject(new Error({ responseText: res.responseText, context }));
					}
				},
				onerror() {
					reject(Error('Network Error'));
				}
			});
		});
	}

	function onSave() {
		if (!$('.zoom-bar-container')[0]) {
			waitForElm('.zoom-bar-container').then(AddZoomDisplay);
		}
        else AddZoomDisplay();
	}

	function fetchLayerRT(context) {
		const url = getUrl(context, 'idsOnly');
		debugLog(url);
		if (!context.parentContext.cancel) {
			return getAsync(url, context).bind(context).then(res => {
				const ids = $.parseJSON(res.responseText);
				if (!ids.objectIds) ids.objectIds = [];
				sortArray(ids.objectIds);
				debugLog(ids);
				return ids;
			}).then(res => {
				const idRanges = [];
				if (res.objectIds) {
					const len = res.objectIds ? res.objectIds.length : 0;
					let currentIndex = 0;
					const offset = Math.min(context.layer.maxRecordCount, 1000);
					while (currentIndex < len) {
						let nextIndex = currentIndex + offset;
						if (nextIndex >= len) nextIndex = len - 1;
						idRanges.push({ range: [res.objectIds[currentIndex], res.objectIds[nextIndex]], idFieldName: res.objectIdFieldName });
						currentIndex = nextIndex + 1;
					}
					debugLog(context.layer.layerID);
					debugLog(idRanges);
				}
				return idRanges;
			}).map(idRange => {
				if (!context.parentContext.cancel) {
					const newUrl = getUrl(context, 'idRange', idRange);
					debugLog(newUrl);
					return getAsync(newUrl, context).then(res => {
						if (!context.parentContext.cancel) {
							let { features } = $.parseJSON(res.responseText);
							context.parentContext.callCount++;
							debugLog('Feature Count=' + (features ? features.length : 0));
							features = features || [];
							return features.map(feature => convertRTToRoadTypeLineStrings(feature, context));
						}
						return null;
					});
				}
				debugLog('Async call cancelled');
				return null;
			});
		}
		return null;
	}

	function convertRTToRoadTypeLineStrings(feature, context) {
        const { state, stateAbbr, layer } = context;
        const roadType = state.getFeatureRoadType(feature, layer);
        // debugLog(feature);
        const attr = {
            state: stateAbbr,
            layerID: layer.layerID,
            roadType,
            color: state.defaultColors[roadType]
        };

        const lineStrings = feature.geometry.paths.map(path => {
            const line = turf.toWgs84(turf.lineString(path, attr));
            line.id = 0;
            return line;
        });

        return lineStrings;
    }

	function fetchStateRT(context) {
		const state = STATE_SETTINGS[context.stateAbbr];
		const contexts = state.rtMapLayers.map(layer => ({
			parentContext: context.parentContext, layer, state, stateAbbr: context.stateAbbr, mapContext: context.mapContext
		}));

		return Promise.map(contexts, ctx => fetchLayerRT(ctx));
	}

	function fetchAllRT() {
		if (!sdk.Map.isLayerVisible({ layerName })) return;

		if (_lastPromise) { _lastPromise.cancel(); }
		$('#mods-loading-indicator').text('Loading RT...');

		const mapContext = { zoom: sdk.Map.getZoomLevel(), extent: sdk.Map.getMapExtent() };
		if (mapContext.zoom > MIN_ZOOM_LEVEL) {
			const parentContext = { callCount: 0, startTime: Date.now() };

			if (_lastContext) _lastContext.cancel = true;
			_lastContext = parentContext;
			const contexts = getVisibleStateAbbreviations().map(stateAbbr => ({ parentContext, stateAbbr, mapContext }));
			const map = Promise.map(contexts, ctx => fetchStateRT(ctx)).then(statesLineStringArrays => {
				if (!parentContext.cancel) {
					sdk.Map.removeAllFeaturesFromLayer({ layerName });
					statesLineStringArrays.forEach(stateLineStringsArray => {
                        stateLineStringsArray.forEach(lineStringsArray1 => {
                            lineStringsArray1.forEach(lineStringsArray2 => {
                                lineStringsArray2.forEach(lineStringsArray3 => {
                                    lineStringsArray3.forEach(feature => {
                                        sdk.Map.addFeatureToLayer({ layerName, feature });
                                    });
                                });
                            });
                        });
                    });
				}
				return statesLineStringArrays;
			}).catch(e => {
				$('#mods-loading-indicator').text('RT Error! (check console for details)');
				errorLog(e);
			}).finally(() => {
				_rtCallCount -= 1;
				if (_rtCallCount === 0) {
					$('#mods-loading-indicator').text('');
				}
			});

			_rtCallCount += 1;
			_lastPromise = map;
		} else {
			// if zoomed out too far, clear the layer
			sdk.Map.removeAllFeaturesFromLayer({ layerName });
		}
	}

	function onLayerCheckboxChanged(args) {
		setEnabled(args.checked);
	}

	function checkLayerZIndex() {
        try {
            if (sdk.Map.getLayerZIndex({ layerName }) !== MAP_LAYER_Z_INDEX) {
                // ("ADJUSTED RT LAYER Z-INDEX " + mapLayerZIndex + ', ' + mapLayer.getZIndex());
                sdk.Map.setLayerZIndex({ layerName, zIndex: MAP_LAYER_Z_INDEX });
            }
        } catch {
            // ignore this hack if it crashes
        }
    }

	function loadSettingsFromStorage() {
		const loadedSettings = $.parseJSON(localStorage.getItem(settingsStoreName));
		const defaultSettings = {
			lastVersion: null,
			layerVisible: true,
			roadTypeEnabled: false
		};
		settings = loadedSettings || defaultSettings;
		Object.keys(defaultSettings).filter(prop => !settings.hasOwnProperty(prop)).forEach(prop => {
			settings[prop] = defaultSettings[prop];
		});
	}

    function saveSettingsToStorage() {
        if (localStorage) {
            // In case the layer is turned off some other way...
            settings.layerVisible = sdk.Map.isLayerVisible({ layerName });
            localStorage.setItem(settingsStoreName, JSON.stringify(settings));
        }
    }

	function addLoadingIndicator() {
		$('.loading-indicator').after($('<div class="loading-indicator" style="margin-right:10px" id="mods-loading-indicator">'));
	}

	function initLayer() {
        const styleRules = [
            {
                style: {
                    strokeColor: 'black',
                    strokeDashstyle: 'solid',
                    strokeOpacity: 1.0,
                    strokeWidth: '15'
                }
            }
        ];
        for (let zoom = 12; zoom < 22; zoom++) {
            styleRules.push({
                // eslint-disable-next-line no-loop-func
                predicate: () => sdk.Map.getZoomLevel() === zoom,
                style: {
                    strokeWidth: 12 * (1.15 ** (zoom - 13))
                }
            });
        }
        Object.values(STATE_SETTINGS)
            .filter(state => !!state.defaultColors)
            .forEach(state => Object.values(state.defaultColors)
                .forEach(color => {
                    if (!styleRules.some(rule => rule.style.strokeColor === color)) {
                        styleRules.push({
                            predicate: props => props.color === color,
                            style: { strokeColor: color }
                        });
                    }
                }));

        STATE_SETTINGS.global.roadTypes.forEach((roadType, index) => {
            styleRules.push({
                predicate: props => props.roadType === roadType,
                style: { graphicZIndex: index * 100 }
            });
        });
        sdk.Map.addLayer({
            layerName,
            styleRules,
            zIndexing: true
        });

        sdk.Map.setLayerOpacity({ layerName, opacity: 0.5 });
        sdk.Map.setLayerVisibility({ layerName, visibility: settings.layerVisible });
        MAP_LAYER_Z_INDEX = sdk.Map.getLayerZIndex({ layerName: 'roads' }) - 3;
        sdk.Map.setLayerZIndex({ layerName, zIndex: MAP_LAYER_Z_INDEX });

        window.addEventListener('beforeunload', () => saveSettingsToStorage);

        sdk.LayerSwitcher.addLayerCheckbox({ name: 'RT Layer' });
        sdk.LayerSwitcher.setLayerCheckboxChecked({ name: 'RT Layer', isChecked: settings.layerVisible });
        sdk.Events.on({ eventName: 'wme-layer-checkbox-toggled', eventHandler: onLayerCheckboxChanged });

        // Hack to fix layer zIndex.  Some other code is changing it sometimes but I have not been able to figure out why.
        // It may be that the RT layer is added to the map before some Waze code loads the base layers and forces other layers higher. (?)
        setInterval(checkLayerZIndex, 1000);

        sdk.Events.on({ eventName: 'wme-map-move-end', eventHandler: fetchAllRT });
    }

	function setEnabled(value) {
        sdk.Map.setLayerVisibility({ layerName, visibility: value });
        settings.layerVisible = value;
        saveSettingsToStorage();

        if (value) fetchAllRT();
        sdk.LayerSwitcher.setLayerCheckboxChecked({ name: 'RT Layer', isChecked: value });
		$('#mods-hlrt').prop('checked', value);
    }

	async function initUserPanel() {
		let $panel = $("<div>", {style:"padding:8px 16px", id:"mods-settings"});
		$panel.html([
			'<b>WME Mods</b> v' + GM_info.script.version,
			'</br>',
			'<div><input type="checkbox" name="mods-hlrt" title="Turn this on to highlight segments based on road type" id="mods-hlrt"><label for="mods-hlrt">Highlight Segment Road Type</label></div>',
		].join(' '));

		const { tabLabel, tabPane } = await sdk.Sidebar.registerScriptTab();
        $(tabLabel).text('Mods');
        $(tabPane).append($panel);

		initGUI2();
	}

	function initGUI2() {
		$('#mods-hlrt').change(function() {
			setEnabled(this.checked)
		});
		$('#mods-hlrt').prop('checked', settings.layerVisible);
	}

    function initZoom() {
		AddZoomDisplay();
		sdk.Events.on({ eventName: 'wme-map-zoom-changed', eventHandler: UpdateZoomDisplay });
        sdk.Events.on({ eventName: 'wme-save-finished', eventHandler: onSave });
	}

	    async function initGui() {
        initLayer();
        await initUserPanel();
    }

	async function init() {
        if (debug && Promise.config) {
            Promise.config({
                warnings: true,
                longStackTraces: true,
                cancellation: true,
                monitoring: false
            });
        } else {
            Promise.config({
                warnings: false,
                longStackTraces: false,
                cancellation: true,
                monitoring: false
            });
        }

		initZoom();

        const u = sdk.State.getUserInfo();
        rank = u.rank + 1;
        isAM = u.isAreaManager;
        userNameLC = u.userName.toLowerCase();

        loadSettingsFromStorage();
        await initGui();
        fetchAllRT();
        log('Initialized.');
    }

    init();
})();
