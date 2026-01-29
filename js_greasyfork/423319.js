// ==UserScript==
// @name         WME House Numbers to RPP
// @version      2026.01.29.01
// @description  Converts WME House Numbers to Residential Place Points
// @author       davidakachaos, ressurected by LihtsaltMats
// @include      /^https:\/\/(www|beta)\.waze\.com(\/\w{2,3}|\/\w{2,3}-\w{2,3}|\/\w{2,3}-\w{2,3}-\w{2,3})?\/editor\b/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://greasyfork.org/scripts/38421-wme-utils-navigationpoint/code/WME%20Utils%20-%20NavigationPoint.js?version=251065
// @require      https://update.greasyfork.org/scripts/509664/WME%20Utils%20-%20Bootstrap.js
// @grant        none
// @namespace    WME
// @downloadURL https://update.greasyfork.org/scripts/423319/WME%20House%20Numbers%20to%20RPP.user.js
// @updateURL https://update.greasyfork.org/scripts/423319/WME%20House%20Numbers%20to%20RPP.meta.js
// ==/UserScript==

// 2026-01-29 Move basic functionality to WME SDK. New rules allow all kinds of RPP house numbers so convert HN data directly.
// 2022-05-24 HNs including a slash ('/') are turned into POIs, because RPPs do not support those. New RPP will have a lowercase letter.
// 2021-12-12 HN delete button is back. Navigation Points are added to every segment no matter the type. Improved readability.
// 2021-10-04 Add navigation points when nearest segment is PLR, PR or off-road
// 2021-09-28 Fix house numbers for RPPs
// Update 2020-10-18: Added option to use the alt city name when no city found initial
// Update 2020-10-18: Added option to set a default lock level in the settings

/* global W */
/* global WazeWrap */
/* global NavigationPoint */
/* global I18n */
/* global OpenLayers */
/* global require */
/* global $ */
/* global bootstrap */

(function () {
    "use strict";

    const updateMessage = `
    <h5>HN to RPP Conversion Restored</h5>
    <p>A new button is now available in the <strong>House Number section</strong>. Clicking it will:</p>
    <ul style="padding-left: 20px;">
      <li>Add new RPPs and delete converted HNs from <strong>selected segments</strong>.</li>
      <li>Set RPP entry point at the old HN's navigation point.</li>
      <li>Apply a configurable distance to RPP's entry point so it wouldn't overvlap with the segment.</li>
    </ul>
`;
    const downloadUrl = 'https://greasyfork.org/scripts/423319-wme-house-numbers-to-rpp/code/WME%20House%20Numbers%20to%20RPP.user.js';

    let settings = {};
    let sdk;

    const locales = {
        en: {
            makeRppButtonLabel: 'HN → RPP',
            noDuplicatesLabel: 'No RPP duplicates',
            entryPointDistanceLabel: 'Entry Point distance from segment (in pseudo metres)',
            defaultLockLevelLabel: 'Default lock level'
        },
        nl: {
            makeRppButtonLabel: 'HN → RPP',
            noDuplicatesLabel: 'Geen duplicaten',
            entryPointDistanceLabel: 'Entry Point distance from segment (in pseudo metres)',
            defaultLockLevelLabel: 'Standaard lock level'
        },
        ru: {
            makeRppButtonLabel: 'HN → RPP',
            noDuplicatesLabel: 'Без дубликатов RPP',
            entryPointDistanceLabel: 'Entry Point distance from segment (in pseudo metres)',
            defaultLockLevelLabel: 'Default lock level'
        }
    };

    function txt(id) {
        return locales[I18n.locale] === undefined ? locales['en'][id] : locales[I18n.locale][id];
    }

    async function wait() {
        sdk = await bootstrap({scriptUpdateMonitor: {downloadUrl}});
        init();
    }

    async function init() {
        W.selectionManager.events.register('selectionchanged', null, injectIntoSidePanel);

        const s = localStorage['hn2rpp'];
        settings = s ? JSON.parse(s) : {noDuplicates: true, entryPointDistance: 5, defaultLockLevel: 1};

        initSettingsTab();

        WazeWrap.Interface.ShowScriptUpdate("HN to RPP", GM_info.script.version, updateMessage, "", "");
    }

    async function injectIntoSidePanel() {
        await new Promise(resolve => setTimeout(resolve, 300));

        const $targetContainer = $("div#segment-edit-general > div:has(wz-button i.w-icon-home)");

        if ($targetContainer.length > 0 && $('#hn2rpp-side-container').length === 0) {
            const $btnContainer = $(`
        <div id="hn2rpp-side-container" style="display: flex; flex-direction: row; gap: 8px; margin-top: 10px; align-items: center;">
            <wz-button color="secondary" id="hn2rpp-make-side" title="Convert HNs to RPP" size="sm">
                ${txt('makeRppButtonLabel')}
            </wz-button>
        </div>
      `);

            $targetContainer.append($btnContainer);

            $('#hn2rpp-make-side').on('click', replaceHouseNumber);
        }
    }

    async function replaceHouseNumber() {
        const segmentIds = getSelectedSegments();
        const houseNumbers = await sdk.DataModel.HouseNumbers.fetchHouseNumbers({segmentIds});
        const existingResidentialPlaceStreetIds = getExistingResidentialAddresses();

        for (const houseNumber of houseNumbers) {
            const finalCoords = getInterpolatedPoint(
                houseNumber.fractionPoint.coordinates,
                houseNumber.geometry.coordinates,
                settings.entryPointDistance ?? 5
            );
            const streetId = sdk.DataModel.Segments.getAddress({segmentId: houseNumber.segmentId}).street.id;

            const isDuplicate = existingResidentialPlaceStreetIds.some(existing =>
                existing.houseNumber === houseNumber.number &&
                existing.streetId === streetId
            );

            if (isDuplicate) {
                sdk.DataModel.HouseNumbers.deleteHouseNumber({houseNumberId: houseNumber.id});
                continue;
            }

            const venueId = sdk.DataModel.Venues.addVenue({
                category: 'RESIDENTIAL',
                geometry: houseNumber.geometry
            }).toString();

            sdk.DataModel.Venues.updateAddress({
                houseNumber: houseNumber.number,
                streetId,
                venueId
            });

            sdk.DataModel.Venues.updateVenue({
                lockRank: settings.defaultLockLevel ?? 1,
                venueId
            });

            sdk.DataModel.Venues.replaceNavigationPoints({
                venueId,
                navigationPoints: [{
                    point: {
                        type: 'Point',
                        coordinates: finalCoords,
                    },
                    isPrimary: true
                }]
            });

            sdk.DataModel.HouseNumbers.deleteHouseNumber({houseNumberId: houseNumber.id});
        }
    }

    function getExistingResidentialAddresses() {
        if (!settings.noDuplicates) {
            return [];
        }
        return sdk.DataModel.Venues.getAll()
            .filter(venue => venue.isResidential)
            .map(venue => {
                const address = sdk.DataModel.Venues.getAddress({venueId: venue.id});
                return {
                    houseNumber: address.houseNumber,
                    streetId: address.street.id
                };
            });
    }

    function getSelectedSegments() {
        const selection = sdk.Editing.getSelection();
        if (selection?.objectType !== 'segment') {
            return;
        }
        return selection.ids;
    }

    function getInterpolatedPoint(start, target, distanceMeters) {
        const [startLon, startLat] = start;
        const [targetLon, targetLat] = target;

        const latMid = (startLat + targetLat) / 2;
        const mPerDegLat = 111111;
        const mPerDegLon = 111111 * Math.cos(latMid * Math.PI / 180);

        const dLon = (targetLon - startLon) * mPerDegLon;
        const dLat = (targetLat - startLat) * mPerDegLat;
        const totalDist = Math.sqrt(dLon * dLon + dLat * dLat);

        if (totalDist <= distanceMeters) {
            return target;
        }

        const t = distanceMeters / totalDist;
        return [
            startLon + t * (targetLon - startLon),
            startLat + t * (targetLat - startLat)
        ];
    }

    function initSettingsTab() {
        const tabs = document.querySelector('.nav-tabs'),
            tabContent = document.querySelector('#user-info .tab-content');
        if (!tabs || !tabContent) return;
        const content = `
      <div id="sidepanel-hn2rpp" class="tab-pane">
        <h4>WME HN2RPP</h4>
        <label><input type="checkbox" id="hn2rpp-dup"> ${txt('noDuplicatesLabel')}</label>
        <br>
        <br>
        <label>${txt('entryPointDistanceLabel')}</label>
        <br>
        <input type="number" id="hn2rpp-eep-distance" min="0" size="2">
        <br>
        <br>
        <label>${txt('defaultLockLevelLabel')}</label>
        <select id="hn2rpp-lock" class="form-control">
          <option value="0">1</option>
          <option value="1">2</option>
          <option value="2">3</option>
          <option value="3">4</option>
          <option value="4">5</option>
          <option value="5">6</option>
        </select>
      </div>`;
        $(tabContent).append(content);
        $(tabs).append('<li><a href="#sidepanel-hn2rpp" data-toggle="tab">HN2RPP</a></li>');
        $('#hn2rpp-dup').prop('checked', settings.noDuplicates).on('change', function () {
            settings.noDuplicates = this.checked;
            save();
        });
        $('#hn2rpp-eep-distance').val(settings.entryPointDistance).on('change', function () {
            settings.entryPointDistance = parseInt(this.value);
            save();
        });
        $('#hn2rpp-lock').val(settings.defaultLockLevel).on('change', function () {
            settings.defaultLockLevel = parseInt(this.value);
            save();
        });
    }

    function save() {
        localStorage['hn2rpp'] = JSON.stringify(settings);
    }

    wait();
})();