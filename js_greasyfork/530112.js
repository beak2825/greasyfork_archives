// ==UserScript==
// @name                WME Wide-Angle Lens Normalizer
// @namespace           https://greasyfork.org/en/users/19861-vtpearce
// @description         Normalización de nombres en WMEWAL
// @author              mincho77
// @version             1.0.0
// @match               https://*.waze.com/*editor*
// @license             MIT
// @exclude             https://*.waze.com/user/editor*
// @grant               GM_xmlhttpRequest
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/530112/WME%20Wide-Angle%20Lens%20Normalizer.user.js
// @updateURL https://update.greasyfork.org/scripts/530112/WME%20Wide-Angle%20Lens%20Normalizer.meta.js
// ==/UserScript==

var WMEWAL_Normalizer;
(function (WMEWAL_Normalizer) {
    const SCRIPT_NAME = "WMEWAL Normalizer";
    const SCRIPT_VERSION = "1.0.0";
    
    function onWmeReady() {
        if (WazeWrap && WazeWrap.Ready && typeof (WMEWAL) !== 'undefined' && WMEWAL.RegisterPlugIn) {
            init();
        } else {
            setTimeout(onWmeReady, 1000);
        }
    }

    function bootstrap() {
        if (W?.userscripts?.state.isReady) {
            onWmeReady();
        } else {
            document.addEventListener('wme-ready', onWmeReady, { once: true });
        }
    }

    function init() {
        console.log(`${SCRIPT_NAME} v${SCRIPT_VERSION} initialized`);
        WMEWAL.RegisterPlugIn(WMEWAL_Normalizer);
        createNormalizerTab();
        initNormalizerEvents();
    }

    function createNormalizerTab() {
        const tabContent = $("<div class='tab-pane' id='sidepanel-wmewal-normalizer'/>");
        tabContent.append("<h5>Normalize Places</h5>");

        tabContent.append("<div><input type='checkbox' id='_wmewalNormalizeArticles'><label for='_wmewalNormalizeArticles' class='wal-label'>NO Normalizar artículos (el, la, los, las)</label></div>");
        tabContent.append("<div><input type='checkbox' id='_wmewalUseExceptions'><label for='_wmewalUseExceptions' class='wal-label'>Usar excepciones</label></div>");
        tabContent.append("<div><label>Agregar excepción:</label><input type='text' id='_wmewalAddException' class='form-control' style='width: 150px; display: inline-block; margin-left: 10px;'> <button class='btn btn-primary' id='_wmewalAddExceptionBtn'>Añadir</button></div>");
        tabContent.append("<ul id='_wmewalExceptionList' style='margin-top: 10px; max-height: 100px; overflow-y: auto;'></ul>");
        tabContent.append("<button class='btn btn-secondary' id='_wmewalSaveExceptions' style='margin-top: 5px;'>Guardar Excepciones</button> ");
        tabContent.append("<button class='btn btn-secondary' id='_wmewalLoadExceptions' style='margin-top: 5px;'>Cargar Excepciones</button> ");
        tabContent.append("<div><label>Max Places to Process: </label><input type='number' id='_wmewalNormalizeMax' value='50' min='1' max='500' class='form-control' style='width: 80px; display: inline-block; margin-left: 10px;'></div>");
        tabContent.append("<button class='btn btn-primary' id='_wmewalNormalizeScan' style='margin-top: 10px;'>Scan Places</button>");
        tabContent.append("<button class='btn btn-success' id='_wmewalApplyNormalization' style='margin-top: 10px;'>Apply Changes</button>");
        
        $("#wmewal-tabs").append("<li><a data-toggle='tab' href='#sidepanel-wmewal-normalizer'>Normalizer</a></li>");
        $(".tab-content").append(tabContent);
    }

    function initNormalizerEvents() {
        $(document).on("click", "#_wmewalNormalizeScan", function () {
            console.log("Botón Scan Places presionado");
            scanPlaces();
        });

        $(document).on("click", "#_wmewalApplyNormalization", function () {
            let selectedPlaces = [];
            $(".placeCheckbox:checked").each(function () {
                let index = $(this).data("index");
                let newName = $(".normalizedName[data-index='" + index + "']").val().trim();
                selectedPlaces.push({ id: foundPlaces[index].id, newName: newName });
            });
            selectedPlaces.forEach(place => {
                let wazePlace = W.model.venues.getObjectById(place.id);
                if (wazePlace) {
                    wazePlace.attributes.name = place.newName;
                    console.log(`Updated ${wazePlace.attributes.id} -> ${place.newName}`);
                }
            });
            alert("Normalization applied!");
        });
    }

    WMEWAL_Normalizer.bootstrap = bootstrap;

})(WMEWAL_Normalizer || (WMEWAL_Normalizer = {}));

WMEWAL_Normalizer.bootstrap();