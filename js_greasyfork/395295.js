// ==UserScript==
// @name         WME Segment City Tool
// @namespace    WazeDev
// @version      2019.11.21.001
// @description  Tools to help out with cities on WME road segments
// @author       MapOMatic
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395295/WME%20Segment%20City%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/395295/WME%20Segment%20City%20Tool.meta.js
// ==/UserScript==

/* global W */
/* global $ */
/* global require */
/* global _ */
/* global OpenLayers */
/* global OL */
/* global localStorage */
/* global performance */
/* global confirm */
/* global require */
/* global GM_info */

const SCRIPT_STORE = 'wme-sct';
const SCRIPT_NAME = GM_info.script.name;
const NO_CITY_NAME = '<No city>';
const CSS = `
input.wmesct-city-input { height: 22px; }
.wmesct-clear-text { height: 22px; vertical-align: bottom; }
.wmesct-btn { height: 22px; float: right; }
#wmesct-container {border: #bbb 1px solid; border-radius: 4px; margin: 2px 10px; padding: 4px;}
#wmesct-container table { width: 100%; }
#wmesct-container td { vertical-align:top; }
#wmesct-container .header-label { float: right; }
#wmesct-container .header-cell { width: 90px; }
#wmesct-container .wmesct-city-input { width: 160px; }
.wmesct-preview { float: left; }
.wmesct-run-button-container { padding-top: 2px; }
`;
const _lastValues = {};

var UpdateFeatureAddress;
// const MultiAction = require('Waze/Action/MultiAction');
var AddAlternateStreet;
var UpdateObject;

let _mapLayer;
let _$previewCheckbox;
let _$primaryCityText;
let _$altCityText;
let _$runButton;
let _ignoreHighlight = false;


function log(msg) {
    console.log('WME SCT:', msg);
}

function _id(name) {
    return `wmesct-${name}`;
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
    const cities = W.model.cities.getObjectArray().map(city => city.attributes.name).filter(name => name.length).sort().map(name => `<option value="${name}">`);
    $(`#${_id('alt-city-datalist')}`).empty().append(cities);
    cities.push(`<option value="${NO_CITY_NAME}">`);
    $(`#${_id('primary-city-datalist')}`).empty().append(cities);
}

function getStreetInfo(streetID, isPrimary = false) {
    const street = W.model.streets.getObjectById(streetID);
    if (!street) {
        return { ignore: true };
    }
    const city = W.model.cities.getObjectById(street.cityID);
    if (!city) return { ignore: true };
    const state = W.model.states.getObjectById(city.attributes.stateID);
    const country = W.model.countries.getObjectById(state.countryID);
    // If country is not found, it will be assumed the city is not a valid city and will be treated the
    // same as a no - city segment. i.e. it wll be removed if primary or any alts have a city with the same street name.
    return {
        id: streetID,
        streetName: street.name,
        cityName: country ? W.model.cities.getObjectById(street.cityID).attributes.name : '',
        stateID: state.id,
        countryID: country ? country.id : -1,
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

        if (segmentAttr.primaryStreetID) {
            const primaryStreetInfo = getStreetInfo(segmentAttr.primaryStreetID, true);
            const noPrimaryCity = newPrimaryCityName === NO_CITY_NAME;
            if (newPrimaryCityName && ((!noPrimaryCity && primaryStreetInfo.cityName !== newPrimaryCityName)
                || (noPrimaryCity && !!primaryStreetInfo.cityName))) {
                const updateObj = {
                    countryID: primaryStreetInfo.countryID,
                    stateID: primaryStreetInfo.stateID,
                    cityName: noPrimaryCity ? '' : newPrimaryCityName,
                    streetName: primaryStreetInfo.streetName,
                    emptyStreet: !primaryStreetInfo.streetName,
                    emptyCity: noPrimaryCity
                };
                result.actions.push(new UpdateFeatureAddress(segment, updateObj, { streetIDField: 'primaryStreetID' }));
                isSegmentEdited = true;
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
                if (newAltCityName && cityNames.indexOf(newAltCityName) === -1) cityNames.push(newAltCityName);
                const streetNames = _.uniq(streetInfos.map(streetInfo => streetInfo.streetName).filter(streetName => !!streetName));
                if (removeOtherAltCities) {
                    cityNames = cityNames.filter(cityName => cityName === newPrimaryCityName || cityName === newAltCityName);
                }
                cityNames.forEach(cityName => {
                    streetNames.forEach(streetName => {
                        if (!streetInfos.some(streetInfo => streetInfo.streetName === streetName && streetInfo.cityName === cityName)) {
                            result.actions.push(new AddAlternateStreet(segment, { cityName, streetName }));
                            isSegmentEdited = true;
                            streetInfos.push({ streetID: -999, streetName, cityName });
                        }
                    });
                });
                if (cityNames.length) {
                    const altIdsToRemove = altStreetInfos.filter(altStreetInfo => {
                        if (newPrimaryCityName && newPrimaryCityName === altStreetInfo.cityName && primaryStreetInfo.streetName === altStreetInfo.streetName) {
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
        if (isSegmentEdited) result.affectedSegments.push(segment);
    });

    return result;
}

function highlightSegments() {
    if (_ignoreHighlight || !_$previewCheckbox.prop('checked')) return;
    _mapLayer.removeAllFeatures();
    const result = processSegments(W.model.segments.getObjectArray(), true);
    const features = W.map.segmentLayer.features.filter(f => result.affectedSegments.indexOf(f.model) > -1).map(f => {
        const geometry = f.geometry.clone();
        const style = {
            strokeColor: '#ff0',
            strokeDashstyle: 'solid',
            strokeWidth: 30
        };
        return new OL.Feature.Vector(geometry, null, style);
    });
    _mapLayer.addFeatures(features);
}

function updateButton() {
    try {
        const features = W.selectionManager.getSelectedFeatures();
        const isSegments = features.length && features[0].model.type === 'segment';
        let enable = false;
        if (isSegments) {
            const result = processSegments(features.map(f => f.model));
            if (result.actions.length || result.altIdsToRemove.length) {
                enable = true;
            }
        }

        const $btn = $('.wmesct-btn');
        if (enable) {
            $btn.removeAttr('disabled');
        } else {
            $btn.attr('disabled', '');
        }
        $btn.css({
            'background-color': enable ? '' : '#ccc',
            'box-shadow': enable ? '' : 'none'
        });
    } catch (ex) {
        console.error('WME Segment City Tool', ex);
    }
}

function onSegmentsAdded() {
    highlightSegments();
}

function onCitiesAddedToModel() {
    updateCityLists();
}

function onApplyClick() {
    const start = performance.now();
    const segments = W.selectionManager.getSelectedFeatures().map(f => f.model);
    if (segments.length && segments[0].type === 'segment') {
        const noState = []; // Array of segments which have no state defined
        const stateNames = []; // Array of state names for the selected segments
        segments.forEach(segment => {
            const addr = segment.getAddress();
            if (!addr || addr.isEmpty() || !addr.getState()) {
                noState.push(segment);
            } else {
                const stateName = addr.getStateName();
                if (stateNames.indexOf(stateName) === -1) {
                    stateNames.push(stateName);
                }
            }
        });
        if (noState.length) {
            if (!confirm(`There are ${noState.length} segments that don't have an address yet.`
                + 'Click OK to ignore those segments and continue, or Cancel to quit.')) {
                if (confirm('Do you want to select the segment(s) that are missing an address?')) {
                    W.selectionManager.unselectAll();
                    W.selectionManager.setSelectedModels(noState);
                }
                return;
            }
        } else if (stateNames.length > 1 && !confirm('You have selected segments from more than one state.'
            + `Click OK to go ahead and update cities (states will not be changed). Or click Cancel to quit.\n\n${stateNames.sort().join('\n')}`)) {
            return;
        }

        const result = processSegments(segments);
        if (result.actions.length || result.altIdsToRemove.length) {
            _ignoreHighlight = true;
            // const mAction = new MultiAction();
            // mAction.setModel(W.model);
            result.actions.forEach(action => W.model.actionManager.add(action));
            // result.actions.forEach(action => mAction.doSubAction(action));
            if (result.altIdsToRemove.length) {
                result.altIdsToRemove.forEach(toRemove => {
                    const idsToKeep = toRemove.segment.attributes.streetIDs.filter(streetID => toRemove.altIds.indexOf(streetID) === -1);
                    W.model.actionManager.add(new UpdateObject(toRemove.segment, { streetIDs: idsToKeep }));
                    // mAction.doSubAction(new UpdateObject(toRemove.segment, { streetIDs: idsToKeep }));
                });
            }
            // mAction._description = `Updated cities on ${result.affectedSegments.length} segment(s). Total edits: ${
            //     result.actions.length + result.altIdsToRemove.length}`;
            // W.model.actionManager.add(mAction);
            _ignoreHighlight = false;
            highlightSegments();
        }

        updateButton();
        log(`Segments Edited: ${result.affectedSegments.length}`);
        log(`Edits: ${result.actions.length + result.altIdsToRemove.length}`);
        log(`Time: ${performance.now() - start}`);
    }
}

function onSelectionChanged() {
    try {
        const selected = W.selectionManager.getSelectedFeatures()[0];
        const isSegment = selected && selected.model.type === 'segment';
        $(`#${_id('container')}`).css({ display: $(`#${_id('preview')}`).is(':checked') || isSegment ? '' : 'none' });
        updateButton();
    } catch (ex) {
        console.error(SCRIPT_NAME, ex);
    }
}

function onCityTextChange() {
    const id = $(this).attr('id');
    if (id) {
        _lastValues[id] = $(this).val();
    }
    saveSettings();
    highlightSegments();
    updateButton();
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

function initGui() {
    _$previewCheckbox = $('<input>', { id: _id('preview'), class: _id('preview'), type: 'checkbox' });
    _$primaryCityText = $('<input>', {
        id: _id('primary-city'), type: 'text', class: _id('city-input'), list: _id('primary-city-datalist')
    });
    _$altCityText = $('<input>', {
        id: _id('alt-city'), type: 'text', class: _id('city-input'), list: _id('alt-city-datalist')
    });
    _$runButton = $('<button>', { class: `${_id('btn')} waze-btn waze-btn-green` }).text('Update Segments');

    $('#sidebar').prepend(
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
                        $('<button>', { class: _id('clear-text'), for: 'alt-city' }).text('x'),
                    )
                ),
                $('<tr>').append($('<td>', { colspan: '2', class: _id('run-button-container') }).append(
                    $('<div>').append(
                        $('<div>', { class: `controls-container ${_id('preview')}` }).append(
                            _$previewCheckbox.change(onPreviewChanged),
                            $('<label>', { for: _id('preview') }).text('Preview')
                        ),
                        _$runButton.click(onApplyClick)
                    )
                ))
            ),
            $('<datalist>', { id: _id('primary-city-datalist') }),
            $('<datalist>', { id: _id('alt-city-datalist') }),
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
    updateButton();
}

function initLayer() {
    _mapLayer = new OpenLayers.Layer.Vector('WME Segment City Tool', { uniqueName: '__wmeSegmentCityTool' });
    W.map.addLayer(_mapLayer);

    // W.map.setLayerIndex(_mapLayer, W.map.getLayerIndex(W.map.roadLayers[0])-2);
    // HACK to get around conflict with URO+.  If URO+ is fixed, this can be replaced with the setLayerIndex line above.
    _mapLayer.setZIndex(333);
    const checkLayerZIndex = () => { if (_mapLayer.getZIndex() !== 333) _mapLayer.setZIndex(333); };
    setInterval(() => { checkLayerZIndex(); }, 100);
    // END HACK

    _mapLayer.setOpacity(0.6);
    _mapLayer.setVisibility(true);
}

function init() {
     UpdateFeatureAddress = require('Waze/Action/UpdateFeatureAddress');
     AddAlternateStreet = require('Waze/Action/AddAlternateStreet');
     UpdateObject = require('Waze/Action/UpdateObject');
    $(`<style type="text/css">${CSS}</style>`).appendTo('head');
    W.model.cities.on('objectsadded', onCitiesAddedToModel);
    W.model.segments.on('objectschanged', updateButton);
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
