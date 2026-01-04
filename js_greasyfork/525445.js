// ==UserScript==
// @name         4CHelper
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Утилита, дополняющая функционал сервиса 4Cells
// @author       yoshi41
// @match        https://4cells.ru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525445/4CHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/525445/4CHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentOperator = '';
    let currentStandard = '';
    const bandStorage = new Map();
    const stateKey = 'cellFilterState_v9';
    let isUpdating = false;

    // Элементы управления
    const controls = document.createElement('div');
    controls.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 1000;
        display: flex;
        gap: 4px;
        align-items: center;
        background: rgba(50, 50, 50, 0.3);
        padding: 4px;
        border-radius: 14px;
        backdrop-filter: blur(5px);
    `;

    const filterButton = createButton('⚙️', '#ffffff', 'Фильтр бендов');
    const filterPanel = createFilterPanel();

    // Инициализация
    loadState();
    initObservers();
    handleNetworkChange(true);

    function createButton(emoji, color, title) {
        const btn = document.createElement('button');
        btn.innerHTML = emoji;
        btn.title = title;
        btn.style.cssText = `
            padding: 0;
            width: 24px;
            height: 24px;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 12px;
            background: rgba(100, 100, 100, 0.4);
            color: ${color};
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        `;
        return btn;
    }

    function createFilterPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: absolute;
            top: 30px;
            right: 0;
            background: rgba(255,255,255,0.95);
            padding: 8px;
            border-radius: 6px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            display: none;
            min-width: 110px;
            max-height: 200px;
            overflow-y: auto;
            font-size: 12px;
        `;
        return panel;
    }

    function getNetworkKey() {
        return `${currentOperator}|${currentStandard}`;
    }

    function updateBandList() {
        if (isUpdating) return;
        isUpdating = true;

        const newBands = new Set(getAllBands());
        const networkKey = getNetworkKey();
        const storedData = bandStorage.get(networkKey) || {
            bands: new Set(),
            selected: new Set()
        };

        // Очистка и обновление бендов
        storedData.bands = newBands;
        bandStorage.set(networkKey, storedData);

        renderBandList();
        isUpdating = false;
    }

    function getAllBands() {
        const bands = [];
        try {
            document.querySelectorAll('.EnbMarkers-module_iconBands__QG-8q').forEach(el => {
                el.textContent.split(',').forEach(b => {
                    const band = cleanBand(b);
                    if (band) bands.push(band);
                });
            });
        } catch (e) {
            console.error('Ошибка получения бендов:', e);
        }
        return [...new Set(bands)].sort(sortBands);
    }

    function cleanBand(band) {
        return band.replace(/(\d+[×x]?)?(B\d+)/i, '$2').trim().toUpperCase();
    }

    function sortBands(a, b) {
        return parseInt(a.slice(1)) - parseInt(b.slice(1));
    }

    function renderBandList() {
        const networkKey = getNetworkKey();
        if (!networkKey || !bandStorage.has(networkKey)) return;

        const { bands, selected } = bandStorage.get(networkKey);
        filterPanel.innerHTML = '<div style="margin-bottom:6px;font-weight:bold;font-size:11px;">Выберите бенды:</div>';

        [...bands].sort(sortBands).forEach(band => {
            const label = document.createElement('label');
            label.style.cssText = `
                display: flex;
                align-items: center;
                margin: 2px 0;
                padding: 2px;
                cursor: pointer;
            `;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = selected.has(band);
            checkbox.style.marginRight = '6px';
            checkbox.onchange = () => {
                checkbox.checked ? selected.add(band) : selected.delete(band);
                saveState();
                applyFilters();
            };

            label.append(checkbox, document.createTextNode(band));
            filterPanel.appendChild(label);
        });
    }

    function applyFilters() {
        const networkKey = getNetworkKey();
        const selectedBands = bandStorage.get(networkKey)?.selected || new Set();

        document.querySelectorAll('.leaflet-marker-icon').forEach(marker => {
            marker.style.display = checkVisibility(marker, selectedBands) ? '' : 'none';
        });
    }

    function checkVisibility(marker, selectedBands) {
        if (selectedBands.size === 0) return true;

        const bands = getMarkerBands(marker);
        return bands.some(b => selectedBands.has(b));
    }

    function getMarkerBands(marker) {
        try {
            const bandsElement = marker.querySelector('.EnbMarkers-module_iconBands__QG-8q');
            return bandsElement ? bandsElement.textContent.split(',').map(cleanBand) : [];
        } catch (e) {
            return [];
        }
    }

    function detectNetworkState() {
        const newOperator = detectOperator();
        const newStandard = detectStandard();
        return { newOperator, newStandard };
    }

    function detectOperator() {
        try {
            const operatorElement = document.querySelector('.Button-module_buttonContainer__vFNaz');
            return operatorElement?.textContent?.trim()?.replace(/\s+/g, ' ').split('\n')[0] || '';
        } catch (e) {
            return '';
        }
    }

    function detectStandard() {
        try {
            const standardElement = document.querySelector('.LongRadio-module_longRadioItem__j1O1I[style*="background-color: var(--actionColor)"]');
            return standardElement?.textContent?.trim() || '';
        } catch (e) {
            return '';
        }
    }

    function handleNetworkChange(force = false) {
        const { newOperator, newStandard } = detectNetworkState();

        if (newOperator !== currentOperator || newStandard !== currentStandard || force) {
            // Сохраняем предыдущее состояние
            saveState();

            // Обновляем текущие значения
            currentOperator = newOperator;
            currentStandard = newStandard;

            // Инициализируем новое состояние
            const networkKey = getNetworkKey();
            if (!bandStorage.has(networkKey)) {
                bandStorage.set(networkKey, {
                    bands: new Set(getAllBands()),
                    selected: new Set()
                });
            }

            updateBandList();
            renderBandList();
            applyFilters();
        }
    }

    function initObservers() {
        const observerConfig = {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style']
        };

        const mapObserver = new MutationObserver(() => {
            updateBandList();
            applyFilters();
        });

        const networkObserver = new MutationObserver(() => {
            handleNetworkChange();
        });

        // Наблюдатель за картой
        const mapContainer = document.querySelector('.leaflet-map-pane');
        if (mapContainer) {
            mapObserver.observe(mapContainer, {
                childList: true,
                subtree: true
            });
        }

        // Наблюдатель за оператором и стандартом
        const observerTargets = [
            document.querySelector('.OperatorsList-module_selectContainer__9qYWv'),
            document.querySelector('.LongRadio-module_radioGroup__HX7uR')
        ];

        observerTargets.forEach(target => {
            if (target) {
                networkObserver.observe(target, observerConfig);
            }
        });
    }

    function loadState() {
        try {
            const saved = localStorage.getItem(stateKey);
            if (saved) {
                const data = JSON.parse(saved);
                currentOperator = data.currentOperator ?? '';
                currentStandard = data.currentStandard ?? '';

                data.bands?.forEach(([key, { bands, selected }]) => {
                    bandStorage.set(key, {
                        bands: new Set(bands),
                        selected: new Set(selected)
                    });
                });
            }
        } catch(e) {
            console.error('Ошибка загрузки состояния:', e);
        }
    }

    function saveState() {
        const data = {
            currentOperator,
            currentStandard,
            bands: [...bandStorage].map(([key, { bands, selected }]) => [
                key,
                { bands: [...bands], selected: [...selected] }
            ])
        };
        localStorage.setItem(stateKey, JSON.stringify(data));
    }

    filterButton.addEventListener('click', () => {
        filterPanel.style.display = filterPanel.style.display === 'none' ? 'block' : 'none';
        updateBandList();
    });

    controls.append(filterButton, filterPanel);
    document.body.appendChild(controls);
})();