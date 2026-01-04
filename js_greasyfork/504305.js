// ==UserScript==
// @name         WME Segment City Highlighter
// @namespace    WazeDev
// @version      2024.09.07.002
// @description  Highlighter to help out with cities on WME road segments
// @author       MapOMatic
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504305/WME%20Segment%20City%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/504305/WME%20Segment%20City%20Highlighter.meta.js
// ==/UserScript==

/* global W */
/* global _ */
/* global OpenLayers */

(function main() {
    'use strict';

    const SCRIPT_STORE = 'wme-sc-highlighter';
    const SCRIPT_NAME = GM_info.script.name;
    const NO_CITY_NAME = '<No city>';
    const CSS = `
    input.wmesch-city-input { height: 22px; }
    .wmesch-clear-text { height: 22px; vertical-align: bottom; }
    .wmesch-btn { height: 22px; float: right; }
    #wmesch-container {border: #bbb 1px solid; border-radius: 4px; margin: 2px 10px; padding: 4px;}
    #wmesch-container table { width: 100%; }
    #wmesch-container td { vertical-align:top; }
    #wmesch-container .header-label { float: right; }
    #wmesch-container .header-cell { width: 90px; }
    #wmesch-container .wmesch-city-input { width: 160px; }
    .wmesch-preview { float: left; }
    `;
    const _lastValues = {};
    let LAYER_Z_INDEX;

    let _mapLayer;
    let _$previewCheckbox;
    let _$primaryCityText;
    let _$altCityText;

    function log(msg) {
        console.log('WME SCH:', msg);
    }

    function _id(name) {
        return `wmesch-${name}`;
    }

    function saveSettings() {
        localStorage.setItem(SCRIPT_STORE, JSON.stringify({
            primaryCity: _$primaryCityText.val(),
            altCity: _$altCityText.val(),
            preview: _$previewCheckbox.prop('checked')
        }));
    }

    function loadSettings() {
        const settings = $.parseJSON(localStorage.getItem(SCRIPT_STORE) || '{}');

        _$primaryCityText.val(settings.primaryCity || '');
        _$altCityText.val(settings.altCity || '');
        _$previewCheckbox.prop('checked', settings.preview || false);
    }

    function updateCityLists() {
        const cities = W.model.cities.getObjectArray()
            .map(city => city.attributes.name)
            .filter(name => name.length)
            .sort()
            .map(name => `<option value="${name}">`);
        $(`#${_id('alt-city-datalist')}`).empty().append(cities);
        cities.push(`<option value="${NO_CITY_NAME}">`);
        $(`#${_id('primary-city-datalist')}`).empty().append(cities);
    }

    function getStreetInfo(streetID, isPrimary = false) {
        const street = W.model.streets.getObjectById(streetID);
        if (!street) {
            return { ignore: true };
        }
        const city = W.model.cities.getObjectById(street.attributes.cityID);
        if (!city) return { ignore: true };
        const state = W.model.states.getObjectById(city.attributes.stateID);
        const country = W.model.countries.getObjectById(city.getCountryID());
        // If country is not found, it will be assumed the city is not a valid city and will be treated the
        // same as a no - city segment. i.e. it wll be removed if primary or any alts have a city with the same street name.
        return {
            id: streetID,
            streetName: street.attributes.name,
            cityName: country ? W.model.cities.getObjectById(street.attributes.cityID).attributes.name : '',
            stateID: state.attributes.id,
            countryID: country ? country.attributes.id : -1,
            isPrimary
        };
    }

    function processSegments(segments) {
        const roadTypesToIgnore = [18];
        segments = segments.filter(s => roadTypesToIgnore.indexOf(s.attributes.roadType) === -1);
        const newPrimaryCityName = $(`#${_id('primary-city')}`).val().trim();
        const newAltCityName = $(`#${_id('alt-city')}`).val().trim();
        const removeOtherAltCities = $(`#${_id('remove-other-alts')}`).prop('checked');
        const result = { actions: [], affectedSegments: [], altIdsToRemove: [] };

        segments.forEach(segment => {
            const segmentAttr = segment.attributes;
            let isSegmentEdited = false;
            let isAllNoCity = !newPrimaryCityName && !newAltCityName;

            if (segmentAttr.primaryStreetID) {
                const primaryStreetInfo = getStreetInfo(segmentAttr.primaryStreetID, true);
                const noPrimaryCity = newPrimaryCityName === NO_CITY_NAME;
                if (newPrimaryCityName && ((!noPrimaryCity && primaryStreetInfo.cityName !== newPrimaryCityName)
                    || (noPrimaryCity && !!primaryStreetInfo.cityName))) {
                    isSegmentEdited = true;
                }

                if (primaryStreetInfo.cityName || !primaryStreetInfo.streetName || primaryStreetInfo.ignore) {
                    isAllNoCity = false;
                }

                let streetInfos = [primaryStreetInfo];
                if (noPrimaryCity) {
                    primaryStreetInfo.cityName = '';
                } else if (newPrimaryCityName) {
                    primaryStreetInfo.cityName = newPrimaryCityName;
                }

                const altStreetInfos = segmentAttr.streetIDs.map(streetID => getStreetInfo(streetID));
                streetInfos = streetInfos.concat(altStreetInfos);
                if (!streetInfos.some(streetInfo => streetInfo.ignore)) {
                    let cityNames = _.uniq(streetInfos.map(streetInfo => streetInfo.cityName).filter(cityName => !!cityName));
                    if (cityNames.length) isAllNoCity = false;
                    if (newAltCityName && cityNames.indexOf(newAltCityName) === -1) cityNames.push(newAltCityName);
                    const streetNames = _.uniq(streetInfos.map(streetInfo => streetInfo.streetName).filter(streetName => !!streetName));
                    if (removeOtherAltCities) {
                        cityNames = cityNames.filter(cityName => cityName === newPrimaryCityName || cityName === newAltCityName);
                    }
                    cityNames.forEach(cityName => {
                        streetNames.forEach(streetName => {
                            if (!streetInfos.some(streetInfo => streetInfo.streetName === streetName && streetInfo.cityName === cityName)) {
                                isSegmentEdited = true;
                                streetInfos.push({ streetID: -999, streetName, cityName });
                            }
                        });
                    });
                    if (cityNames.length) {
                        const altIdsToRemove = altStreetInfos.filter(altStreetInfo => {
                            if (newPrimaryCityName && newPrimaryCityName === altStreetInfo.cityName
                                && primaryStreetInfo.streetName === altStreetInfo.streetName) {
                                return true;
                            } if (!altStreetInfo.cityName) {
                                return true;
                            }
                            return false;
                        }).map(altStreetInfo => altStreetInfo.id);
                        if (altIdsToRemove.length) {
                            result.altIdsToRemove.push({
                                segment,
                                altIds: altIdsToRemove
                            });
                            isSegmentEdited = true;
                        }
                    }
                }
            }
            if (isAllNoCity && !segment.isNew()) isSegmentEdited = true;
            if (isSegmentEdited) result.affectedSegments.push(segment);
        });

        return result;
    }

    function highlightSegments() {
        if (!_$previewCheckbox.prop('checked')) return;
        _mapLayer.removeAllFeatures();
        const result = processSegments(W.model.segments.getObjectArray(), true);
        const features = W.map.segmentLayer.features.filter(f => result.affectedSegments.indexOf(f.attributes.wazeFeature._wmeObject) > -1).map(f => {
            const geometry = f.geometry.clone();
            const style = {
                strokeColor: '#ff0',
                strokeDashstyle: 'solid',
                strokeWidth: 30
            };
            return new OpenLayers.Feature.Vector(geometry, null, style);
        });
        _mapLayer.addFeatures(features);
    }

    function onSegmentsAdded() {
        highlightSegments();
    }

    function onCitiesAddedToModel() {
        updateCityLists();
    }

    function onCityTextChange() {
        const id = $(this).attr('id');
        if (id) {
            _lastValues[id] = $(this).val();
        }
        saveSettings();
        highlightSegments();
    }

    function onClearTextClick() {
        $(`#${_id($(this).attr('for'))}`).val(null).change();
    }

    function onPreviewChanged() {
        saveSettings();
        if (_$previewCheckbox.prop('checked')) {
            highlightSegments();
            W.model.segments.on('objectsadded', onSegmentsAdded);
            W.model.segments.on('objectschanged', onSegmentsAdded);
        } else {
            _mapLayer.removeAllFeatures();
            W.model.segments.off('objectsadded', onSegmentsAdded);
            W.model.segments.off('objectschanged', onSegmentsAdded);
        }
        onSelectionChanged();
    }

    function onSelectionChanged() {
        try {
            const selected = W.selectionManager.getSelectedDataModelObjects()[0];
            const isSegment = selected?.type === 'segment';
            $(`#${_id('container')}`).css({ display: isSegment ? '' : 'none' });
        } catch (ex) {
            console.error(SCRIPT_NAME, ex);
        }
    }

    function initGui() {
        _$previewCheckbox = $('<input>', {
            id: _id('preview'),
            type: 'checkbox',
            class: _id('preview')
        });
        _$primaryCityText = $('<input>', {
            id: _id('primary-city'),
            type: 'text',
            class: _id('city-input'),
            list: _id('primary-city-datalist'),
            autocomplete: 'off' // helps prevent password manager from displaying a popup list
        });
        _$altCityText = $('<input>', {
            id: _id('alt-city'),
            type: 'text',
            class: _id('city-input'),
            list: _id('alt-city-datalist'),
            autocomplete: 'off' // helps prevent password manager from displaying a popup list
        });

        // TODO: 2022-11-22 - This is temporary to determine which parent element to add the div to, depending on beta or production WME.
        // Remove once new side panel is pushed to production.
        const $parent = $('#edit-panel .contents');
        $parent.prepend(
            $('<div>', { id: _id('container') }).append(
                $('<table>').append(
                    $('<tr>').append(
                        $('<td>', { class: 'header-cell' }).append($('<label>', { class: 'header-label' }).text('Primary city')),
                        $('<td>').append(
                            _$primaryCityText,
                            $('<button>', { class: _id('clear-text'), for: 'primary-city' }).text('x')
                        )
                    ),
                    $('<tr>').append(
                        $('<td>', { class: 'header-cell' }).append($('<label>', { class: 'header-label' }).text('Alt city')),
                        $('<td>').append(
                            _$altCityText,
                            $('<button>', { class: _id('clear-text'), for: 'alt-city' }).text('x')
                        )
                    ),
                    $('<tr>').append($('<td>', { colspan: '2', class: _id('run-button-container') }).append(
                        $('<div>').append(
                            $('<div>', { class: `controls-container ${_id('preview')}` }).append(
                                _$previewCheckbox.change(onPreviewChanged),
                                $('<label>', { for: _id('preview') }).text('Preview')
                            )
                        )
                    ))
                ),
                $('<datalist>', { id: _id('primary-city-datalist') }),
                $('<datalist>', { id: _id('alt-city-datalist') })
            )
        );
        $(`.${_id('clear-text')}`).click(onClearTextClick);
        $(`.${_id('city-input')}`).each2((idx, obj) => {
            const [{ id }] = obj;
            const lastVal = _lastValues[id];
            if (lastVal) obj.val(lastVal);
        }).change(onCityTextChange);

        updateCityLists();
        loadSettings();
        onPreviewChanged();
    }

    function initLayer() {
        _mapLayer = new OpenLayers.Layer.Vector('WME Segment City Highlighter', { uniqueName: '__wmeSegmentCityHighlighter' });
        W.map.addLayer(_mapLayer);

        // W.map.setLayerIndex(_mapLayer, W.map.getLayerIndex(W.map.roadLayers[0])-2);
        // HACK to get around conflict with URO+.  If URO+ is fixed, this can be replaced with the setLayerIndex line above.
        LAYER_Z_INDEX = W.map.roadLayer.getZIndex() - 2;
        _mapLayer.setZIndex(LAYER_Z_INDEX);
        const checkLayerZIndex = () => { if (_mapLayer.getZIndex() !== LAYER_Z_INDEX) _mapLayer.setZIndex(LAYER_Z_INDEX); };
        setInterval(() => { checkLayerZIndex(); }, 100);
        // END HACK

        _mapLayer.setOpacity(0.6);
        _mapLayer.setVisibility(true);
    }

    function init() {
        $(`<style type="text/css">${CSS}</style>`).appendTo('head');
        W.model.cities.on('objectsadded', onCitiesAddedToModel);
        W.selectionManager.events.register('selectionchanged', null, onSelectionChanged);
        initLayer();
        initGui();
    }

    function bootstrap(tries = 1) {
        if (W && W.loginManager && W.loginManager.user && $('#sidebar').length) {
            init();
        } else if (tries > 200) {
            log('Bootstrap has failed too many times. Exiting script.');
        } else {
            if (tries % 20 === 0) log('Bootstrap failed. Trying again...');
            setTimeout(() => bootstrap(++tries), 250);
        }
    }

    bootstrap();
})();
