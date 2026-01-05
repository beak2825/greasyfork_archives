// ==UserScript==
// @name        WME Speeds
// @namespace   https://greasyfork.org/cs/scripts/12402-wme-speeds
// @version     1.0.5
// @description Adds colors to road segments to show their speeds
// @author      Martin Kolář
// @match       https://www.waze.com/editor*
// @match       https://beta.waze.com/editor*
// @match       https://www.waze.com/*/editor*
// @match       https://beta.waze.com/*/editor*
// @exclude     https://www.waze.com/user/editor*
// @exclude     https://beta.waze.com/user/editor*
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMzMgMjMzIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgc3Ryb2tlPSJyZWQiIHN0cm9rZS13aWR0aD0iMjUiIGZpbGw9IiNmZmYiIGN4PSIxMTYuNSIgY3k9IjExNi41IiByPSIxMDQiLz48ZyBmaWxsPSIjMDAwIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjxwYXRoIGQ9Im00Ni40IDEzNy4yIDE5LjEtMnEuOCA2LjYgNC45IDEwLjNhMTMgMTMgMCAwIDAgMTkuNC0xcTQuMi01IDQuMi0xNC44IDAtOS4yLTQuMS0xMy44LTQuMi00LjYtMTAuOC00LjYtOC4zIDAtMTQuOCA3LjNsLTE1LjYtMi4zIDkuOC01Mi4xaDUwLjh2MThINzMuMWwtMyAxN2EyOSAyOSAwIDAgMSAxMy4xLTMuM3ExMi44IDAgMjEuNyA5LjN0OC45IDI0LjJxMCAxMi4zLTcuMiAyMmEzMiAzMiAwIDAgMS0yNy4yIDEzLjNxLTEzLjggMC0yMi42LTcuNC04LjctNy41LTEwLjQtMjBNMTU2LjQgNjIuNHExNC41IDAgMjIuOCAxMC40UTE4OSA4NSAxODkgMTEzLjZ0LTkuOSA0MC45YTI3IDI3IDAgMCAxLTIyLjcgMTAuMnEtMTQuNiAwLTIzLjYtMTEuMi05LTExLjMtOS00MC4xIDAtMjguMyAxMC00MC44IDgtMTAuMiAyMi42LTEwLjJtMCAxNS45cS0zLjUgMC02LjIgMi4ydC00LjIgOHEtMiA3LjUtMiAyNSAwIDE3LjggMS44IDI0LjMgMS43IDYuNiA0LjQgOC44YTEwIDEwIDAgMCAwIDYuMiAyLjJxMy41IDAgNi4yLTIuMnQ0LjMtOHEyLTcuNSAyLTI1YTEwOSAxMDkgMCAwIDAtMS44LTI0LjNxLTEuOC02LjYtNC41LTguOGExMCAxMCAwIDAgMC02LjItMi4yIi8+PC9nPjwvZz48L3N2Zz4=
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @require     https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/12402/WME%20Speeds.user.js
// @updateURL https://update.greasyfork.org/scripts/12402/WME%20Speeds.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const i18n = {
        cs: {
            scriptName: 'WME Speeds',
            speedsHeadline: 'Barvy segmentů dle rychlostí',
            forumLink: '<a href="https://www.waze.com/forum/viewtopic.php?f=22&t=166406" target="_blank">České fórum</a>',
            author: 'Autor: <a href="https://www.waze.com/user/editor/martinkolar" target="_blank">martinkolar (5)</a>',
            version: 'Verze:',
            invertSpeedsTitleNonDrivable: 'Zobrazit pouze segmenty bez rychlostí',
            hideWithoutSpeeds: 'Skrýt segmenty bez rychlostí',
            noSpeedsSegmentsOtherTitle: 'Skrýt rychlosti na nedůležitých segmentech',
            transparentColorsTitle: 'Průsvitné barvy',
            dashedHint: 'Bíle přerušovaná barva znamená, že rychlostní limit není kulaté číslo.',
            forumUrl: 'https://www.waze.com/forum/viewtopic.php?f=22&t=166406'
        },
        sk: {
            scriptName: 'WME Rýchlosti',
            speedsHeadline: 'Farby podľa rýchlosti',
            forumLink: '<a href="https://www.waze.com/forum/viewtopic.php?f=22&t=166406" target="_blank">České fórum</a>',
            author: 'Autor: <a href="https://www.waze.com/user/editor/martinkolar" target="_blank">martinkolar (CZ)</a>',
            version: 'Verzia:',
            invertSpeedsTitleNonDrivable: 'Zobraziť iba úseky bez rýchlostí',
            hideWithoutSpeeds: 'Skryť úseky bez rýchlostí',
            noSpeedsSegmentsOtherTitle: 'Skryť rýchlosti na iných jazdných úsekoch bez rýchlostí',
            transparentColorsTitle: 'Priehľadná farba',
            dashedHint: 'Biele prerušované čiary znamenajú, že rýchlostný limit nie je zaokrúhlené číslo.',
            forumUrl: 'https://www.waze.com/forum/viewtopic.php?f=22&t=166406'
        },
        en: {
            scriptName: 'WME Speeds',
            speedsHeadline: 'Colors by speed',
            forumLink: '<a href="https://www.waze.com/forum/viewtopic.php?f=819&t=166497" target="_blank">English discussion</a>',
            author: 'Author: <a href="https://www.waze.com/user/editor/martinkolar" target="_blank">martinkolar (CZ)</a>',
            version: 'Version:',
            invertSpeedsTitleNonDrivable: 'Show only segments without speeds',
            hideWithoutSpeeds: 'Hide segments without speeds',
            noSpeedsSegmentsOtherTitle: 'Hide speeds on other-drivable segments without speeds',
            transparentColorsTitle: 'Transparent color',
            dashedHint: 'White dashed styles mean that the speed limit is not round number.',
            forumUrl: 'https://www.waze.com/forum/viewtopic.php?f=819&t=166497'
        },
        he: {
            scriptName: 'מהירות WME',
            speedsHeadline: 'צבעים לפי מהירות',
            forumLink: '<a href="https://www.waze.com/forum/viewtopic.php?f=819&t=166497" target="_blank">דיון באנגלית</a>',
            author: 'מחבר: <a href="https://www.waze.com/user/editor/martinkolar" target="_blank">martinkolar (צ׳כיה)</a>',
            version: 'גרסה:',
            invertSpeedsTitleNonDrivable: 'הצג רק מקטעים ללא מהירויות',
            hideWithoutSpeeds: 'הסתר מקטעים ללא מהירויות',
            noSpeedsSegmentsOtherTitle: 'הסתר מהירויות במקטעים אחרים ללא נתוני מהירות',
            transparentColorsTitle: 'צבע שקוף',
            dashedHint: 'קו לבן מקווקו מציין שהמהירות אינה מספר עגול.',
            forumUrl: 'https://www.waze.com/forum/viewtopic.php?f=819&t=166497'
        },
        pl: {
            scriptName: 'WME Prędkości',
            speedsHeadline: 'Kolory według prędkości',
            forumLink: '<a href="https://www.waze.com/forum/viewtopic.php?f=819&t=166497" target="_blank">Dyskusja po angielsku</a>',
            author: 'Autor: <a href="https://www.waze.com/user/editor/martinkolar" target="_blank">martinkolar (CZ)</a>',
            version: 'Wersja:',
            invertSpeedsTitleNonDrivable: 'Pokaż tylko odcinki bez prędkości',
            hideWithoutSpeeds: 'Ukryj odcinki bez prędkości',
            noSpeedsSegmentsOtherTitle: 'Ukryj prędkości na innych przejezdnych odcinkach bez prędkości',
            transparentColorsTitle: 'Przezroczysty kolor',
            dashedHint: 'Białe linie przerywane oznaczają, że ograniczenie prędkości nie jest liczbą zaokrągloną.',
            forumUrl: 'https://www.waze.com/forum/viewtopic.php?f=819&t=166497'
        }
    };
    function getTranslations(localeCode) {
        return i18n[localeCode] || i18n['en'];
    }

    unsafeWindow.SDK_INITIALIZED.then(initScript);
    function initScript() {
        const UPDATE_NOTES = 'Implement WazeWrap for update notifications.<br><br>';
        const GF_LINK = 'https://update.greasyfork.org/scripts/12402/WME%20Speeds.user.js';
        if (!unsafeWindow.getWmeSdk) {
            throw new Error("SDK not available");
        }
        const wmeSDK = unsafeWindow.getWmeSdk({
            scriptId: 'wme-speedlimits',
            scriptName: 'WME Speedlimits'
        });
        const _layerName = getTranslation('scriptName');
        const _styleName = 'wmeSpeedlimits';
        const _config = {
            colorsKmph: ['#e300ff', '#321325', '#540804', '#BA1200', '#FA4A48', '#F39C6B', '#A7D3A6', '#ADD2C2', '#CFE795', '#F7EF81', '#BDC4A7', '#95AFBA', '#3F7CAC', '#0A369D', '#001C55'],
            colorsMph: ['#e300ff', '#321325', '#702632', '#540804', '#A00027', '#BA1200', '#F15872', '#FA4A48', '#F39C6B', '#A7D3A6', '#ADD2C2', '#CFE795', '#F7EF81', '#BDC4A7', '#95AFBA', '#3F7CAC', '#0A369D', '#001C55', '#000000'],
            maxSpeedKmph: 130,
            maxSpeedMph: 85,
            otherDrivableList: [8, 20, 17, 15],
            nonDrivableList: [5, 9, 10, 16, 18, 19],
            useMph: false,
            ratioKmphToMph: 0.621371192,
            speedsForTab: null,
            invertColors: null,
            otherDrivable: null,
            transparent: null,
            hideWithoutSpeeds: null,
            checkboxIds: {
                otherDrivable: '_wmeSpeedsOtherDrivable',
                transparent: '_wmeSpeedsTransparent',
                invertNonDrivable: '_wmeSpeedsInvertNonDrivable',
                hideWithoutSpeeds: '_wmeSpeedsHideWithoutSpeeds'
            }
        };
        function getTranslation(key) {
            const localeCode = wmeSDK.Settings.getLocale().localeCode;
            return getTranslations(localeCode)[key] || key;
        }
        function setKeyboardShortcuts() {
            wmeSDK.Shortcuts.createShortcut({
                callback: () => {
                    wmeSDK.LayerSwitcher.setLayerCheckboxChecked({
                        name: _layerName,
                        isChecked: !wmeSDK.LayerSwitcher.isLayerCheckboxChecked({ name: _layerName }),
                    });
                    drawSegments();
                    saveSettings();
                },
                description: `${getTranslation('scriptName')} shortcut`,
                shortcutId: `-${_styleName}-shortcut`,
                shortcutKeys: 'A+s',
            });
        }
        function getStylesRules() {
            let rules = [];
            rules.push({
                predicate: (featureProperties) => !!featureProperties.problemSegment,
                style: {
                    strokeColor: '#e300ff',
                    strokeWidth: 8,
                    strokeOpacity: _config.transparent ? .5 : 1
                },
            });
            var colors = _config.colorsKmph;
            if (_config.useMph) {
                colors = _config.colorsMph;
            }
            colors.forEach((color, index) => {
                rules.push({
                    predicate: (featureProperties) => !!featureProperties[`speed${index}`],
                    style: {
                        strokeColor: color,
                        strokeWidth: 8,
                        strokeOpacity: _config.transparent ? .5 : 1
                    },
                });
                rules.push({
                    predicate: (featureProperties) => !!featureProperties[`speedFwd${index}`],
                    style: {
                        strokeColor: color,
                        strokeDashstyle: '0 20 20 0',
                        strokeLinecap: 'butt',
                        strokeWidth: 8,
                        strokeOpacity: _config.transparent ? .75 : 1
                    },
                });
                rules.push({
                    predicate: (featureProperties) => !!featureProperties[`speedRev${index}`],
                    style: {
                        strokeColor: color,
                        strokeDashstyle: '20 20',
                        strokeLinecap: 'butt',
                        strokeWidth: 8,
                        strokeOpacity: _config.transparent ? .75 : 1
                    },
                });
            });
            rules.push({
                predicate: (featureProperties) => !!featureProperties.nonExactSpeed,
                style: {
                    strokeColor: '#ffffff',
                    strokeDashstyle: '2 8 2 8',
                    strokeLinecap: 'butt',
                    strokeWidth: 8,
                    strokeOpacity: _config.transparent ? .75 : 1
                },
            });
            rules.push({
                predicate: (featureProperties) => !!featureProperties.nonExactSpeedFwd,
                style: {
                    strokeColor: '#ffffff',
                    strokeDashstyle: '0 20 2 8 2 8 0 0',
                    strokeLinecap: 'butt',
                    strokeWidth: 8,
                    strokeOpacity: _config.transparent ? .75 : 1
                },
            });
            rules.push({
                predicate: (featureProperties) => !!featureProperties.nonExactSpeedRev,
                style: {
                    strokeColor: '#ffffff',
                    strokeDashstyle: '2 8 2 8 0 20',
                    strokeLinecap: 'butt',
                    strokeWidth: 8,
                    strokeOpacity: _config.transparent ? .75 : 1
                },
            });
            return rules;
        }
        function addLayer() {
            _config.transparent = getLocalStorage()[4];
            wmeSDK.Map.addLayer({
                layerName: _layerName,
                styleRules: getStylesRules()
            });
            wmeSDK.LayerSwitcher.addLayerCheckbox({
                name: _layerName,
            });
            wmeSDK.LayerSwitcher.setLayerCheckboxChecked({
                name: _layerName,
                isChecked: getLocalStorage()[7] || false,
            });
        }
        function addEventListeners() {
            wmeSDK.Events.once({ eventName: 'wme-ready' }).then(wmeReady);
            wmeSDK.Events.on({ eventName: 'wme-map-move', eventHandler: drawSegments });
            wmeSDK.Events.on({ eventName: 'wme-map-data-loaded', eventHandler: drawSegments });
            wmeSDK.Events.on({
                eventName: 'wme-layer-checkbox-toggled',
                eventHandler: (event) => {
                    if (event.name === _layerName) {
                        drawSegments();
                        saveSettings();
                    }
                }
            });
        }
        function wmeReady() {
            getId(_config.checkboxIds.otherDrivable).addEventListener('change', settingsChanged);
            getId(_config.checkboxIds.transparent).addEventListener('change', () => {
                _config.transparent = getId(_config.checkboxIds.transparent).checked;
                resetLayers();
                settingsChanged();
            });
            getId(_config.checkboxIds.invertNonDrivable).addEventListener('change', settingsChanged);
            getId(_config.checkboxIds.hideWithoutSpeeds).addEventListener('change', settingsChanged);
            drawSegments();
        }
        function resetLayers() {
            wmeSDK.Map.removeLayer({
                layerName: _layerName
            });
            wmeSDK.Map.addLayer({
                layerName: _layerName,
                styleRules: getStylesRules()
            });
        }
        function settingsChanged() {
            drawSegments();
            saveSettings();
        }
        function getContrastColor(hex_color) {
            var r = parseInt(hex_color.substr(1, 2), 16);
            var g = parseInt(hex_color.substr(3, 2), 16);
            var b = parseInt(hex_color.substr(5, 2), 16);
            var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            return (yiq >= 128) ? 'black' : 'white';
        }
        async function addScriptTab() {
            function optionHtml(labelId, title_t) {
                return `
        <li style="list-style-type: none;">
          <label class="wz-checkbox" style="align-items: flex-start;cursor: pointer;display: flex;font-size: 14px;min-height: 24px;outline: none;user-select: none;">
            <input type="checkbox" name="" value="on" id="${labelId}" style="display:none;">
            <div class="border" style="border: 2px solid var(--hairline_strong, #90959c);border-radius: 3px;box-sizing: border-box;display: inline-block;flex-shrink: 0;height: 18px;margin-inline-end: var(--wz-checkbox-margin, var(--space-always-s, 12px));position: relative;width: 18px;">
              <div class="fill" style="background: var(--primary_variant, #0075e3);height: 100%;position: absolute;width: 100%;"></div>
              <div class="mask" style="background: var(--background_default, #ffffff);clip-path: circle(10px at center);height: 100%;position: absolute;transition: 100ms cubic-bezier(0.25, 0.1, 0.25, 1);width: 100%;"></div>
              <svg width="14px" height="14px" viewBox="0 0 24 24" style="position: absolute;stroke: var(--on_primary, #ffffff);stroke-width: 2;"><g fill="none"><polygon fill="#ffffff" points="9.5 15.5 6 12 4.5 13.5 9.5 18.5 20 8 18.5 6.5"></polygon></g></svg>
            </div>
            <span class="label" style="font-family: var(--wz-font-family);color: var(--content_default, #202124);font-weight: normal;-webkit-transition: 0.25s;transition: 0.25s;">${getTranslation(title_t)}</span>
          </label>
        </li>
      `;
            }
            const { tabLabel, tabPane } = await wmeSDK.Sidebar.registerScriptTab();
            tabLabel.innerHTML = `
      <span style="display:flex;align-items:center;justify-content:center;height:100%;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 233 233" width="20" height="20"><g fill="none" fill-rule="evenodd"><circle stroke="red" stroke-width="25" cx="116.5" cy="116.5" r="104" fill="#FFFFFF"/><g fill="#000" fill-rule="nonzero"><path d="m46.4 137.2 19.1-2q.8 6.6 4.9 10.3a13 13 0 0 0 19.4-1q4.2-5 4.2-14.8 0-9.2-4.1-13.8-4.2-4.6-10.8-4.6-8.3 0-14.8 7.3l-15.6-2.3 9.8-52.1h50.8v18H73.1l-3 17a29 29 0 0 1 13.1-3.3q12.8 0 21.7 9.3t8.9 24.2q0 12.3-7.2 22a32 32 0 0 1-27.2 13.3q-13.8 0-22.6-7.4-8.7-7.5-10.4-20M156.4 62.4q14.5 0 22.8 10.4Q189 85 189 113.6t-9.9 40.9a27 27 0 0 1-22.7 10.2q-14.6 0-23.6-11.2-9-11.3-9-40.1 0-28.3 10-40.8 8-10.2 22.6-10.2m0 15.9q-3.5 0-6.2 2.2t-4.2 8q-2 7.5-2 25 0 17.8 1.8 24.3 1.7 6.6 4.4 8.8a10 10 0 0 0 6.2 2.2q3.5 0 6.2-2.2t4.3-8q2-7.5 2-25a109 109 0 0 0-1.8-24.3q-1.8-6.6-4.5-8.8a10 10 0 0 0-6.2-2.2"/></g></g></svg>
      </span>`;
            var speedsTemplate = function () {
                _config.speedsForTab = _config.useMph ? _config.colorsMph : _config.colorsKmph;
                var speedTemplate = '<div style="display:grid;gap:5px;grid-template-columns:repeat(3, 1fr);margin-bottom: 15px;">';
                speedTemplate += '<div style="background-color: ' + _config.colorsKmph[0] + ';padding:2px 0;border-radius:5px;color:' + getContrastColor(_config.colorsKmph[0]) + ';font-size:14px;text-align:center;">---</div>';
                for (var i = 1; i < _config.speedsForTab.length; i++) {
                    var actualSpeedForTab;
                    if ((i + 1) === _config.speedsForTab.length) {
                        if (_config.useMph) {
                            actualSpeedForTab = ' &gt; ' + _config.maxSpeedMph + '&nbsp;mph';
                        }
                        else {
                            actualSpeedForTab = ' &gt; ' + _config.maxSpeedKmph + '&nbsp;km/h';
                        }
                    }
                    else if (_config.useMph) {
                        actualSpeedForTab = (i * 5) + '&nbsp;mph';
                    }
                    else {
                        actualSpeedForTab = (i * 10) + '&nbsp;km/h';
                    }
                    speedTemplate += '<div style="background-color: ' + _config.speedsForTab[i] + ';padding:2px 0;border-radius:5px;color:' + getContrastColor(_config.speedsForTab[i]) + ';font-size:14px;text-align:center;">' + actualSpeedForTab + '</div>';
                }
                speedTemplate += '</div>';
                return speedTemplate;
            };
            tabPane.innerHTML = `
      <style type="text/css">
        .${_styleName} .wz-checkbox input:checked + .border {
          background-color: var(--primary_variant, #0075e3) !important;
          border: 2px solid var(--primary_variant, #0075e3) !important;
        }
        .${_styleName} .wz-checkbox input:checked + .border .mask {
          clip-path: circle(0 at center) !important;
        }
      </style>
      <div class="${_styleName}">
        <h3 style="margin-bottom: 15px;font-size: 20px; text-align:center;">${getTranslation('speedsHeadline')}</h3>

        <ul style="list-style-type: none;padding:0;display:grid;gap:2px;margin-bottom:10px;">

          ${optionHtml(_config.checkboxIds.invertNonDrivable, 'invertSpeedsTitleNonDrivable')}
          ${optionHtml(_config.checkboxIds.hideWithoutSpeeds, 'hideWithoutSpeeds')}
          ${optionHtml(_config.checkboxIds.otherDrivable, 'noSpeedsSegmentsOtherTitle')}
          ${optionHtml(_config.checkboxIds.transparent, 'transparentColorsTitle')}
        </ul>

        ${speedsTemplate()}

        <p style="font-size:12px;">
          ${getTranslation('dashedHint')}
        </p>
        <p style="font-size:12px;">
          ${getTranslation('forumLink')}
          <br>
          ${getTranslation('author')}
          <br>
          ${getTranslation('version')} <a href="https://greasyfork.org/scripts/12402" target="_blank">${GM_info.script.version}</a>
        </p>
      </div>
    `;
            let storageData = getLocalStorage();
            getId(_config.checkboxIds.otherDrivable).checked = storageData[3];
            getId(_config.checkboxIds.transparent).checked = storageData[4];
            getId(_config.checkboxIds.invertNonDrivable).checked = storageData[6];
            getId(_config.checkboxIds.hideWithoutSpeeds).checked = storageData[8];
        }
        function getLocalStorage() {
            if (localStorage.WMESpeedsScript) {
                return JSON.parse(localStorage.WMESpeedsScript);
            }
            return {
                options: [null, false, false, false, false, null, false, false, false]
            };
        }
        function drawSegment(segment, layerProperties) {
            wmeSDK.Map.addFeatureToLayer({
                layerName: _layerName,
                feature: {
                    id: `wme-speedlimits-${segment.id}`,
                    geometry: {
                        type: 'LineString',
                        coordinates: segment.geometry.coordinates
                    },
                    type: 'Feature',
                    properties: layerProperties,
                },
            });
        }
        function getId(id) {
            return document.getElementById(id);
        }
        function drawSegments() {
            wmeSDK.Map.removeAllFeaturesFromLayer({ layerName: _layerName });
            function getSpeedValue(speed) {
                if (_config.useMph) {
                    return Math.round(speed * _config.ratioKmphToMph);
                }
                return speed;
            }
            function proceedSpeed(segment, direction) {
                var speed = direction === 'fwd' ? segment.fwdSpeedLimit : segment.revSpeedLimit;
                var speedValue = -1;
                var speedExact = false;
                var speedIndex = 0;
                if (speed !== null) {
                    speedValue = getSpeedValue(speed);
                    speedExact = (speedValue % speedDiv) === 0;
                    if (speedValue >= maxSpeed) {
                        speedIndex = Math.ceil(maxSpeed / speedDiv);
                    }
                    else {
                        speedIndex = Math.ceil(speedValue / speedDiv);
                    }
                }
                return {
                    nonDrivableType: _config.nonDrivableList.indexOf(segment.roadType) !== -1,
                    otherDrivableType: _config.otherDrivableList.indexOf(segment.roadType) !== -1,
                    direction: segment.isTwoWay || direction === 'fwd' && segment.isAtoB || direction === 'rev' && segment.isBtoA,
                    value: speedValue,
                    exact: speedExact,
                    index: speedIndex,
                    color: _config.useMph ? _config.colorsMph[speedIndex] : _config.colorsKmph[speedIndex]
                };
            }
            if (wmeSDK.LayerSwitcher.isLayerCheckboxChecked({ name: _layerName })) {
                var segments = wmeSDK.DataModel.Segments.getAll();
                _config.invertColors = getId(_config.checkboxIds.invertNonDrivable).checked;
                _config.hideWithoutSpeeds = getId(_config.checkboxIds.hideWithoutSpeeds).checked;
                _config.otherDrivable = getId(_config.checkboxIds.otherDrivable).checked;
                var speedDiv = _config.useMph ? 5 : 10;
                var maxSpeed = _config.useMph ? _config.maxSpeedMph : _config.maxSpeedKmph;
                segments.forEach(segment => {
                    var fwdSpeed = proceedSpeed(segment, 'fwd');
                    var revSpeed = proceedSpeed(segment, 'rev');
                    if (fwdSpeed.nonDrivableType) {
                        return;
                    }
                    if (_config.invertColors) {
                        if (((fwdSpeed.value === -1 && fwdSpeed.direction) || (revSpeed.value === -1 && revSpeed.direction))) {
                            drawSegment(segment, {
                                problemSegment: 1
                            });
                        }
                        return;
                    }
                    if (_config.hideWithoutSpeeds) {
                        if (((fwdSpeed.value === -1 && fwdSpeed.direction) || (revSpeed.value === -1 && revSpeed.direction))) {
                            return;
                        }
                    }
                    if (_config.otherDrivable && fwdSpeed.otherDrivableType) {
                        return;
                    }
                    if (fwdSpeed.value === revSpeed.value || (fwdSpeed.value >= 0 && !revSpeed.direction) || (revSpeed.value >= -1 && !fwdSpeed.direction)) {
                        drawSegment(segment, {
                            [`speed${fwdSpeed.direction ? fwdSpeed.index : revSpeed.index}`]: 1
                        });
                        if ((!fwdSpeed.exact && fwdSpeed.direction && fwdSpeed.value > 0) || (!revSpeed.exact && revSpeed.direction && revSpeed.value > 0)) {
                            drawSegment(segment, {
                                nonExactSpeed: 1
                            });
                        }
                    }
                    else {
                        drawSegment(segment, {
                            [`speedFwd${fwdSpeed.index}`]: 1
                        });
                        if (!fwdSpeed.exact && fwdSpeed.value > 0) {
                            drawSegment(segment, {
                                nonExactSpeedFwd: 1
                            });
                        }
                        drawSegment(segment, {
                            [`speedRev${revSpeed.index}`]: 1
                        });
                        if (!revSpeed.exact && revSpeed.value > 0) {
                            drawSegment(segment, {
                                nonExactSpeedRev: 1
                            });
                        }
                    }
                });
            }
        }
        function saveSettings() {
            if (localStorage) {
                var options = [];
                if (localStorage.WMESpeedsScript) {
                    options = JSON.parse(localStorage.WMESpeedsScript);
                }
                options[3] = getId(_config.checkboxIds.otherDrivable).checked;
                options[4] = getId(_config.checkboxIds.transparent).checked;
                options[6] = getId(_config.checkboxIds.invertNonDrivable).checked;
                options[7] = wmeSDK.LayerSwitcher.isLayerCheckboxChecked({ name: _layerName });
                options[8] = getId(_config.checkboxIds.hideWithoutSpeeds).checked;
                localStorage.WMESpeedsScript = JSON.stringify(options);
            }
        }
        var tries = 0;
        function checkWazeWrap() {
            if (typeof WazeWrap !== 'undefined' && WazeWrap.Ready) {
                console.log("Checking for script updates...");
                WazeWrap.Interface.ShowScriptUpdate(GM_info.script.name, GM_info.script.version, UPDATE_NOTES, GF_LINK, getTranslation('forumUrl'));
                try {
                    let updateMonitor = new WazeWrap.Alerts.ScriptUpdateMonitor(GM_info.script.name, GM_info.script.version, GF_LINK, GM_xmlhttpRequest);
                    updateMonitor.start();
                }
                catch (ex) {
                    console.error(ex);
                }
            }
            else {
                if (tries == 0) {
                    console.log("Waiting for WazeWrap...");
                }
                else if (tries >= 60) {
                    console.warn("WazeWrap loading failed after 60 tries. Script updates will not be detected.");
                    return;
                }
                tries++;
                setTimeout(checkWazeWrap, 500);
            }
        }
        function init() {
            _config.useMph = wmeSDK.Settings.getUserSettings().isImperial ?? false;
            addScriptTab();
            setKeyboardShortcuts();
            addLayer();
            addEventListeners();
            checkWazeWrap();
        }
        init();
    }

})();
