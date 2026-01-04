// ==UserScript==
// @name                WME JSON IBGE Loader
// @description         Carrega a camada JSON/GeoJSON do IBGE diretamente no WME.
// @namespace           felipeangrax@gmail.com
// @version             1.3.0
// @author              T0NINI
// @match               https://www.waze.com/*/editor*
// @match               https://www.waze.com/editor*
// @match               https://beta.waze.com/*
// @exclude             https://www.waze.com/*user/*editor/*
// @icon                https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant               none
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/541730/WME%20JSON%20IBGE%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/541730/WME%20JSON%20IBGE%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_VERSION = "1.3.0";

    const STORAGE_KEYS = {
        HOTKEY: 'wme_json_loader_hotkey',
        DEFAULT_COLOR: 'wme_json_loader_default_color',
        SELECT_COLOR: 'wme_json_loader_select_color'
    };

        const DEFAULT_COLORS = {
        DEFAULT: '#0078FF',
        SELECT: '#00FF00'
    };

    let lineLayer = null;
    let clickControl = null;
    let selectedFeature = null;
    let isInitialized = false;

    function bootstrap() {
        if (typeof W === 'undefined' || typeof W.map === 'undefined' || typeof OpenLayers === 'undefined' || !WazeWrap.Ready) {
            setTimeout(bootstrap, 500);
            return;
        }
        initializeScript();
    }

    function initializeScript() {
        if (isInitialized) return;
        isInitialized = true;
        console.log(`JSON IBGE Loader: Script inicializado com sucesso! (v${SCRIPT_VERSION})`);
        createUI();
        createPopup();
        initializeControls();
    }

    function createUI() {
        const tabTitle = 'JSON IBGE Loader';
        const navTabs = document.querySelector('#user-info .nav-tabs');
        const tabContent = document.querySelector('#user-info .tab-content');

        if (!navTabs || !tabContent || document.getElementById('sidepanel-jsonloader')) return;

        const newTab = document.createElement('li');
        newTab.innerHTML = `<a href="#sidepanel-jsonloader" data-toggle="tab">${tabTitle}</a>`;
        navTabs.appendChild(newTab);

        const newTabPanel = document.createElement('div');
        newTabPanel.id = 'sidepanel-jsonloader';
        newTabPanel.className = 'tab-pane';
        newTabPanel.innerHTML = `
            <style>
                #sidepanel-jsonloader .side-panel-section { padding: 15px 10px; }
                #sidepanel-jsonloader .side-panel-section + .side-panel-section { border-top: 1px solid #ddd; }
                #sidepanel-jsonloader h4 { font-size: 28px; font-weight: 500; margin-bottom: 3px; }
                #sidepanel-jsonloader h5 { margin-top: 0; margin-bottom: 15px; font-size: 13px; font-weight: 500; text-transform: uppercase; color: #555; }
                #sidepanel-jsonloader .w-100 { width: 100%; }
                #sidepanel-jsonloader a:not(.btn) { text-decoration: none; }
                #sidepanel-jsonloader a:not(.btn):hover { text-decoration: underline; }
                #sidepanel-jsonloader .btn.btn-danger { border-radius: 50px; font-weight: 400; font-size: 12px; }
                #sidepanel-jsonloader .btn.btn-primary { display: flex; align-items: center; justify-content: center; background-color: #008CFF; border: none; border-radius: 50px; font-weight: 400; font-size: 12px; padding-top: 8px; padding-bottom: 8px; margin-bottom: 12px; transition: background-color 0.2s ease; text-decoration: none; }
                #sidepanel-jsonloader .btn.btn-primary:hover { background-color: #0073cc; text-decoration: none; }
                #sidepanel-jsonloader .btn.btn-primary:active { background-color: #005a9e; }
                #json-hotkey-input { cursor: pointer; }
                #sidepanel-jsonloader .customization-label { display: block; font-size: 11px; font-weight: 500; color: #888; text-transform: uppercase; margin-bottom: 10px; margin-top: 5px; }
                #sidepanel-jsonloader .color-picker-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
                #sidepanel-jsonloader .color-picker-container label { margin-bottom: 0; font-weight: normal; }
                #sidepanel-jsonloader input[type="color"] { width: 40px; height: 30px; border: 1px solid #ccc; border-radius: 4px; padding: 2px; cursor: pointer; background-color: white; }
            </style>

            <div class="side-panel-section"><h4>JSON IBGE Loader</h4><p>Versão: <b>${SCRIPT_VERSION}</b></p></div>

            <div class="side-panel-section">
                <h5>Carregar Arquivo GeoJSON</h5>
                <input type="file" id="json-file-input" accept=".json,.geojson" style="display:none;"/>
                <label for="json-file-input" class="btn btn-primary w-100" style="margin: 0; text-align: center; cursor: pointer;">Escolher Arquivo</label>
                <p style="text-align: center; margin-top: 8px; font-style: italic; color: #888;">
                    <span id="json-file-name">Nenhum arquivo selecionado</span>
                </p>
                <p id="json-status" style="text-align: center; font-weight: bold;"></p>
                <button id="json-clear-button" class="btn btn-danger w-100" disabled style="margin-top: 8px;">Limpar Camada</button>
            </div>

            <div class="side-panel-section">
                <h5>Obter Dados</h5>
                <a href="https://cidades.ibge.gov.br/" target="_blank" rel="noopener noreferrer" class="btn btn-primary w-100">Consultar Código do Município</a>
                <a href="https://www.ibge.gov.br/geociencias/downloads-geociencias.html?caminho=recortes_para_fins_estatisticos/malha_de_setores_censitarios/censo_2022/base_de_faces_de_logradouros_versao_2022_censo_demografico/json" target="_blank" rel="noopener noreferrer" class="btn btn-primary w-100">Download JSON por UF</a>
            </div>

            <div class="side-panel-section">
                <h5>Personalizar Script</h5>
                <label class="customization-label">Aparência</label>
                <div class="color-picker-container">
                    <label for="json-color-default">Cor Padrão:</label>
                    <input type="color" id="json-color-default">
                </div>
                <div class="color-picker-container" style="margin-bottom: 20px;">
                    <label for="json-color-select">Cor da Seleção:</label>
                    <input type="color" id="json-color-select">
                </div>

                <label class="customization-label">Atalho</label>
                <input type="text" id="json-hotkey-input" class="form-control" placeholder="Definir novo atalho" readonly>
                <p style="font-size: 11px; color: #888; margin-top: 10px;">Pressione a tecla de atalho para mostrar/ocultar a camada. O padrão é <b>TAB</b>. Clique na caixa acima para definir um novo atalho.</p>
            </div>`;
        tabContent.appendChild(newTabPanel);

        document.getElementById('json-file-input').addEventListener('change', handleFileSelect);
        document.getElementById('json-clear-button').addEventListener('click', clearLayer);
    }

    function initializeControls() {
        const hotkeyInput = document.getElementById('json-hotkey-input');
        if(!hotkeyInput) return;
        const defaultHotkey = 'TAB';

        hotkeyInput.value = localStorage.getItem(STORAGE_KEYS.HOTKEY) || defaultHotkey;
        hotkeyInput.addEventListener('keydown', (event) => {
            event.preventDefault();
            let hotkeyString = [
                event.ctrlKey && 'Ctrl', event.altKey && 'Alt',
                event.shiftKey && 'Shift', !['Control', 'Alt', 'Shift'].includes(event.key) && event.key.toUpperCase()
            ].filter(Boolean).join(' + ');
            hotkeyInput.value = hotkeyString;
            localStorage.setItem(STORAGE_KEYS.HOTKEY, hotkeyString);
        });

        document.addEventListener('keydown', (event) => {
            const activeEl = document.activeElement;
            if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA') && activeEl !== hotkeyInput) return;

            if (event.key === 'Escape') {
                if (selectedFeature) {
                    event.preventDefault();
                    onFeatureUnselect();
                }
                return;
            }

            const targetHotkey = localStorage.getItem(STORAGE_KEYS.HOTKEY) || defaultHotkey;
            const currentPress = [
                event.ctrlKey && 'Ctrl', event.altKey && 'Alt',
                event.shiftKey && 'Shift', !['Control', 'Alt', 'Shift'].includes(event.key) && event.key.toUpperCase()
            ].filter(Boolean).join(' + ');

            if (currentPress === targetHotkey && document.activeElement !== hotkeyInput) {
                event.preventDefault();
                toggleLayerVisibility();
            }
        });

        const defaultColorInput = document.getElementById('json-color-default');
        const selectColorInput = document.getElementById('json-color-select');
        defaultColorInput.value = localStorage.getItem(STORAGE_KEYS.DEFAULT_COLOR) || DEFAULT_COLORS.DEFAULT;
        selectColorInput.value = localStorage.getItem(STORAGE_KEYS.SELECT_COLOR) || DEFAULT_COLORS.SELECT;

        defaultColorInput.addEventListener('input', (event) => {
            const newColor = event.target.value;
            localStorage.setItem(STORAGE_KEYS.DEFAULT_COLOR, newColor);
            if (lineLayer) {
                lineLayer.styleMap.styles.default.defaultStyle.strokeColor = newColor;
                lineLayer.redraw();
            }
        });
        selectColorInput.addEventListener('input', (event) => {
            const newColor = event.target.value;
            localStorage.setItem(STORAGE_KEYS.SELECT_COLOR, newColor);
            if (lineLayer) {
                lineLayer.styleMap.styles.select.defaultStyle.strokeColor = newColor;
                lineLayer.redraw();
            }
        });
    }

    function toggleLayerVisibility() { if (lineLayer) { lineLayer.setVisibility(!lineLayer.getVisibility()); } }

    function createPopup() { if (document.getElementById('wme-json-popup')) return; const styleSheet = document.createElement("style"); styleSheet.type = "text/css"; styleSheet.innerText = ` #wme-json-popup { position: absolute; display: none; background: white; color: black; padding: 8px 12px; border-radius: 6px; border: 1px solid #ccc; z-index: 2001; font-family: sans-serif; font-size: 13px; font-weight: bold; pointer-events: none; transform: translate(-50%, -125%); white-space: nowrap; box-shadow: 0 3px 8px rgba(0,0,0,0.2); } #wme-json-popup::after, #wme-json-popup::before { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border-style: solid; border-color: transparent; border-top-color: #ccc; } #wme-json-popup::after { border-width: 8px; margin-top: -1px; border-top-color: white; } #wme-json-popup::before { border-width: 9px; }`; document.head.appendChild(styleSheet); const popup = document.createElement('div'); popup.id = 'wme-json-popup'; document.getElementById('WazeMap').appendChild(popup); }
    function onFeatureSelect(feature, lonlat) { const popup = document.getElementById('wme-json-popup'); const attr = feature.attributes; const nomeCompleto = [attr.NM_TIP_LOG, attr.NM_TIT_LOG, attr.NM_LOG].filter(Boolean).join(' ') || "Nome não disponível"; popup.innerText = nomeCompleto; const pixel = W.map.getPixelFromLonLat(lonlat); popup.style.left = `${pixel.x}px`; popup.style.top = `${pixel.y}px`; popup.style.display = 'block'; }
    function onFeatureUnselect() { const popup = document.getElementById('wme-json-popup'); if (popup) popup.style.display = 'none'; if (selectedFeature && lineLayer) { lineLayer.drawFeature(selectedFeature, 'default'); } selectedFeature = null; }
    function initializeCustomClickHandler() { const OL = OpenLayers; const CustomClick = OL.Class(OL.Control, { defaultHandlerOptions: { 'single': true, 'double': false, 'pixelTolerance': 2, 'stopSingle': false, 'stopDouble': false }, initialize: function(options) { this.handlerOptions = OL.Util.extend({}, this.defaultHandlerOptions); OL.Control.prototype.initialize.apply(this, arguments); this.handler = new OL.Handler.Click(this, { 'click': this.trigger }, this.handlerOptions); }, trigger: function(e) { if (!lineLayer) return; const lonlat = W.map.getLonLatFromPixel(e.xy); const clickPoint = new OL.Geometry.Point(lonlat.lon, lonlat.lat).transform(new OL.Projection("EPSG:4326"), W.map.getProjectionObject()); let closestFeature = null, minDistance = Infinity; for (const feature of lineLayer.features) { const distance = feature.geometry.distanceTo(clickPoint, {details: false}); if (distance < minDistance) { minDistance = distance; closestFeature = feature; } } if (closestFeature && minDistance < 5) { if (selectedFeature !== closestFeature) { onFeatureUnselect(); selectedFeature = closestFeature; lineLayer.drawFeature(closestFeature, 'select'); onFeatureSelect(closestFeature, lonlat); } } } }); clickControl = new CustomClick(); W.map.addControl(clickControl); clickControl.activate(); W.map.events.register('movestart', null, onFeatureUnselect); }


    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) { clearLayer(); return; }
        document.getElementById('json-file-name').textContent = file.name;
        const statusEl = document.getElementById('json-status');
        const reader = new FileReader();
        reader.onload = function(e) {
            statusEl.textContent = 'Analisando arquivo...';
            try {
                const geojson = JSON.parse(e.target.result);
                statusEl.textContent = `Arquivo válido. Desenhando...`;
                setTimeout(() => drawGeoJSON(geojson), 50);
            } catch (error) {
                alert('Erro: O arquivo não parece ser um JSON válido.');
                console.error("Erro de Análise JSON:", error);
                clearLayer();
            }
        };
        reader.readAsText(file);
    }

    function drawGeoJSON(geojson) {
        clearMapData();
        const OL = OpenLayers;
        const sourceProjection = new OL.Projection("EPSG:4326");
        const mapProjection = W.map.getProjectionObject();
        const defaultColor = localStorage.getItem(STORAGE_KEYS.DEFAULT_COLOR) || DEFAULT_COLORS.DEFAULT;
        const selectColor = localStorage.getItem(STORAGE_KEYS.SELECT_COLOR) || DEFAULT_COLORS.SELECT;
        const lineStyleMap = new OL.StyleMap({
            'default': new OL.Style({ strokeColor: defaultColor, strokeWidth: 2, strokeOpacity: 0.8 }),
            'select': new OL.Style({ strokeColor: selectColor, strokeWidth: 4, strokeOpacity: 1.0 })
        });
        lineLayer = new OL.Layer.Vector("JSON Linhas", { styleMap: lineStyleMap });
        let nomeCidade = null;
        const allFeatures = [];
        for (const feature of geojson.features) {
            if (feature.geometry && feature.geometry.type === 'LineString' && feature.geometry.coordinates.length > 1) {
                if (!nomeCidade && feature.properties && feature.properties.NM_MUN) {
                    nomeCidade = feature.properties.NM_MUN;
                }
                const points = feature.geometry.coordinates.map(coord => new OL.Geometry.Point(coord[0], coord[1]));
                const line = new OL.Geometry.LineString(points);
                const vectorFeature = new OL.Feature.Vector(line, feature.properties);
                allFeatures.push(vectorFeature);
            }
        }
        allFeatures.forEach(f => f.geometry.transform(sourceProjection, mapProjection));
        lineLayer.addFeatures(allFeatures);
        W.map.addLayer(lineLayer);
        initializeCustomClickHandler();
        const statusMessage = nomeCidade ? `Camada para ${nomeCidade} carregada com ${allFeatures.length} linhas.` : `Camada desenhada com ${allFeatures.length} linhas.`;
        document.getElementById('json-status').textContent = statusMessage;
        document.getElementById('json-clear-button').disabled = false;
    }


    function clearMapData() {
        onFeatureUnselect();
        if (clickControl) {
            W.map.events.unregister('movestart', null, onFeatureUnselect);
            clickControl.deactivate();
            W.map.removeControl(clickControl);
            clickControl = null;
        }
        if (lineLayer) {
            W.map.removeLayer(lineLayer);
            lineLayer.destroy();
            lineLayer = null;
        }
        selectedFeature = null;
    }

    function clearLayer() {
        clearMapData();
        const status = document.getElementById('json-status');
        if (status) status.textContent = '';
        const fileInput = document.getElementById('json-file-input');
        if (fileInput) fileInput.value = '';
        const fileNameEl = document.getElementById('json-file-name');
        if (fileNameEl) fileNameEl.textContent = 'Nenhum arquivo selecionado';
        const clearButton = document.getElementById('json-clear-button');
        if(clearButton) clearButton.disabled = true;
    }

    bootstrap();

})();