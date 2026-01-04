// ==UserScript==
// @name        WME Norway - Map Overlay
// @namespace   WazeNOR
// @version     1.0
// @description Adds overlay functionality to Waze Map Editor with norwegian providers
// @author      MtsAssen
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require     https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require     https://greasyfork.org/scripts/370113-wme-norway-utils/code/WME%20Norway%20-%20Utils.js
// @license     MIT
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/370131/WME%20Norway%20-%20Map%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/370131/WME%20Norway%20-%20Map%20Overlay.meta.js
// ==/UserScript==

/* global $ */
/* global W */
/* global Nor */

var providerSpreadsheetListUrl = "https://spreadsheets.google.com/feeds/list/1hPlrJ0V0zzqfGD6fMgnJyfcRxoMntY_dlGcAoy9DKpc/od6/public/values";

// Custom log function with prefix.
function log(message) {
    if (typeof message === 'string')
        console.log("NorOverlay: " + message)
    else
        console.log("NorOverlay:", message);
}

function NorOverlay_Bootstrap() {
    var _waze = W || window.W;
    if (!_waze || !_waze.map || !_waze.loginManager.isLoggedIn() || !Nor) {
        log("Waze not ready, waiting...");
        setTimeout(NorOverlay_Bootstrap, 1000);
        return;
    }

    log("Waze is ready, initializing!");
    NorOverlay_Init();
}

function NorOverlay_Init() {
    // Create NorOverlay object
    var NorOverlay = {};

    /// Variables
    NorOverlay.PROVIDERS = []; // Storage for providers.
    NorOverlay.Active = true;  // Is the overlay active? Defaults to true.
    NorOverlay.ActiveOverlayId = ""; // The currently active overlay.
    NorOverlay.ActiveOverlay = null;

    /**
     * Function to get providers from spreadsheet
     * @private
     * @param {[]} callback Returns array of providers.
     */
    NorOverlay.getProviders = function (callback) {
        // Get providers from google docs
        Nor.parseSpreadsheetTable(providerSpreadsheetListUrl, result => {
            NorOverlay.PROVIDERS = result;
            log("Found " + result.length + " providers!");
            if (callback != null) callback(result);
        });
    }

    /**
     * Adds the providers to the dropdown in the settings section.
     */
    NorOverlay.populateProviders = function () {
        this.getProviders((providers) => {
            var providerList = $("#overlay-providers");
            $.each(providers, function () {
                if (this.public != "TRUE") return; 

                var option = $("<option />").val(this.id).text(this.provider);
                if (this.id == NorOverlay.ActiveOverlayId) option.prop("selected", true);

                providerList.append(option);

                // Add shortcut
                var shortcut = new WazeWrap.Interface.Shortcut("toggleMapOverlay" + this.id, "Show overlay: " + this.provider, "WME Norway", "WME Norway", '', function () { NorOverlay.showOverlay(this.id)}, this)
                shortcut.add();
            });

            // If map overlay is active, show provided map.
            if (NorOverlay.Active) NorOverlay.showOverlay(providerList.val());

            // Add shortcut for each provider
        });
    }

    NorOverlay.getSelectedProviderId = function () {
        return $("#overlay-providers").val();
    }

    NorOverlay.getSelectedProvider = function () {
        var selectedProviderId = NorOverlay.getSelectedProviderId();
        return (NorOverlay.PROVIDERS.find(function (obj) {
            return obj.id == selectedProviderId;
        }));
    }

    /**
     * Creates a settings tab using WazeWrap
     */
    NorOverlay.addSettingsTab = function () {
        var tab = new WazeWrap.Interface.Tab("NO", "<span></span>", null, null);
    }

    /**
     * Generates and appends the settings tab.
     */
    NorOverlay.addSettingsSection = function () {
        var tabContent = new Nor.TabBuilder()
            .header("Overleggskart", "map-overlay-header")
            .form(
                new Nor.TabForm()
                .formGroup(
                    new Nor.FormGroup()
                    .dropdown("Kart", "overlay-providers", NorOverlay.PROVIDERS, "Provider", "ID", "norkart")
                )
                .formGroup(
                    new Nor.FormGroup()
                    .checkbox("Vis kartoverlegg", "overlay-enabled", NorOverlay.Active)
                    //.button("SVV", "SVV", "red")
                )
        ).html;
        
        // Append the tab content to the side panel
        $("div#sidepanel-no").append(tabContent);

        // Get and populate provider list.
        NorOverlay.populateProviders();
    }

    NorOverlay.getCoordinates = function(img) {
        var satelliteTileUrl = img.attr('src');
        var coords;

        var pattern = new RegExp("\\/\\/www\\.googleapis\\.com\\/tile\\/v1", 'g');
        if (pattern.test(satelliteTileUrl)) {
            re = /\/\/www\.googleapis\.com\/tile\/v1\/tiles\/(\d+)\/(\d+)\/(\d+)/g;
            match = re.exec(satelliteTileUrl);
            if (match) {
                coords = Nor.Overlay.QuadDigitsToQuadLetters(Nor.Overlay.TileXYZToQuadDigits(match[2], match[3], match[1]));
            }
        }

        return coords;
    }

    NorOverlay.replaceImage = function(element) {
        var quadLetters = element.data("coords");
        if (!quadLetters)
            return;
        element.attr('src', Nor.Overlay.getUrl(NorOverlay.ActiveOverlay.url, quadLetters));
    }

    NorOverlay.setImages = function() {
        var innerTilesContainer = $('#WazeMap #OpenLayers_Layer_Google_210');

        innerTilesContainer.children('img.overlayGMM').each(function () {
            var default_url = $(this).attr('data-default_url');
            var original = innerTilesContainer.find('img.olTileImage[src="' + default_url + '"]');
            if (original.length == 0) {
                $(this).remove();
            }
        });

        innerTilesContainer.children('img.olTileImage').each(function () {
            var content = $(this);
            var coords = NorOverlay.getCoordinates(content);
            if (undefined != coords) {
                var duplicate = innerTilesContainer.find('img.overlayGMM[data-coords="' + coords + '"]');
                if (duplicate.length == 0) {
                    duplicate = $('<img src="" draggable="false" style="width: 256px; height: 256px; position: absolute; border: 0px; padding: 0px; margin: 0px; -webkit-user-select: none;">');
                    duplicate.addClass('overlayGMM');
                }
                if (!duplicate.is(content.next())) {
                    duplicate.attr('data-default_url', content.attr('src'));
                    duplicate.attr('data-coords', coords);
                    duplicate.css('top', content.css('top'));
                    duplicate.css('left', content.css('left'));
                    duplicate.insertAfter(content);
                    NorOverlay.replaceImage(duplicate);
                }
            }
        });
    }

    /*NorOverlay.setSVVImages = function () {
        var svvCacheLayer = new OpenLayers.Layer.ArcGISCache("GeocacheTrafikk", ["https://m1-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer", "https://m2-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer", "https://m3-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer", "https://m4-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer", "https://m5-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer", "https://m6-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer", "https://m7-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer", "https://m8-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer", "https://m9-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer"], {
                isBaseLayer: true,

                type: "jpg",
                resolutions: [21674.7100160867, 10837.3550080434, 5418.67750402168, 2709.33875201084, 1354.66937600542, 677.334688002709, 338.667344001355, 169.333672000677, 84.6668360003387, 42.3334180001693, 21.1667090000847, 10.5833545000423, 5.29167725002117, 2.64583862501058, 1.32291931250529, .661459656252646],
                maxExtent: new OpenLayers.Bounds(-25e5, 35e5, 3045984, 9045984),
                tileOrigin: W.map.layerContainerOrigin,
                
            });

        W.map.addLayer(svvCacheLayer);
    }

    NorOverlay.SVVinitMap = function () {
        
        //overlay test layer
        //http://dev.openlayers.org/examples/web-mercator.html
        var wms = new OpenLayers.Layer.WMS("SVV", "https://nvdbcache.geodataonline.no/arcgis/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer/WMSServer", {
                layers: "1",
                format: "image/jpg",
                transparent: "false"
            }, {
                isBaseLayer: false,
                wrapDateLine: false
            }
        );
        W.map.addLayers([wms]);
    }*/

    NorOverlay.clearOverlay = function() {
        $('.overlayGMM', $('#WazeMap #OpenLayers_Layer_Google_210')).remove();
    }

    /**
     * Show overlay.
     * @param {string} overlayId overlay id (not required)
     */
    NorOverlay.showOverlay = function (overlayId = "") {
        if (overlayId == "")
            overlayId = $("select#overlay-providers").val();
        else
            $("select#overlay-providers").val(overlayId);
        
        // Set checkbox states
        $("input#layer-switcher-item_map_overlay").prop('checked', true);
        $("input#overlay-enabled").prop('checked', true);

        // Show overlay
        log("Show overlay: " + overlayId);
        NorOverlay.ActiveOverlay = NorOverlay.getSelectedProvider(overlayId);
        NorOverlay.clearOverlay();
    }

    /**
     * Hides the visible overlay.
     */
    NorOverlay.hideOverlay = function () {
        // Set checkbox states
        $("input#layer-switcher-item_map_overlay").prop('checked', false);
        $("input#overlay-enabled").prop('checked', false);

        // Hide overlay
        log("Hide overlay!");
        NorOverlay.Active = false;
        NorOverlay.clearOverlay();
    }

    /**
     * Toogles overlay.
     * @param {boolean} enable enable overlay?
     */
    NorOverlay.toggleOverlay = function (enable) {
        if (!(typeof enable === 'boolean')) enable = !NorOverlay.Active;
        
        if (enable)
            NorOverlay.showOverlay();
        else
            NorOverlay.hideOverlay();

        NorOverlay.Active = enable;
        localStorage.setItem("overlay-enabled", NorOverlay.Active ? "true" : "false");
    }

    /// INITs

    // Gets active status and active overlay from local storage.
    NorOverlay.Active = (localStorage.getItem("overlay-enabled") == "true" ? true : false);
    NorOverlay.ActiveOverlayId = localStorage.getItem("overlay-provider");

    // Checks if a tab already exists and if it doesn't creates a new Waze tab using WazeWrap
    if (!$("#user-tabs > ul a").toArray().find(e => e.innerText === "NO")) {
        NorOverlay.addSettingsTab()
    }

    // Populate settings tab with script specific settings
    if (!$("div.tab-content > div#sidepanel-no > h4").toArray().find(e => e.id === "map-overlay-header")) {
        NorOverlay.addSettingsSection()
    }

    // Create Waze layer using WazeWrap
    WazeWrap.Interface.AddLayerCheckbox("Display", "Map Overlay", NorOverlay.Active, NorOverlay.toggleOverlay)

    // Create Waze shortcut using WazeWrap
    var shortcut = new WazeWrap.Interface.Shortcut("toggleMapOverlay", "Toggles the map overlay", "WME Norway", "WME Norway", 'A+l', NorOverlay.toggleOverlay, this)
    shortcut.add();

    /// Register event handlers
    $("input#overlay-enabled").change(function () {
        NorOverlay.toggleOverlay($(this).is(":checked"));
        log($(this).is(":checked"));
    });
    
    $("select#overlay-providers").change(function () {
        localStorage.setItem("overlay-provider", $(this).val());

        // If enabled, change active map
        if (NorOverlay.Active) NorOverlay.showOverlay($(this).val());
    });

    $("button#SVV").click(function () {
        NorOverlay.SVVinitMap();
    });

    /// Register interval
    window.setInterval(function () {
        if (NorOverlay.Active === true) {
            NorOverlay.setImages();
        } else {
            NorOverlay.clearOverlay();
        }
    }, 250);
}

// Run bootstrap function any time now...
setTimeout(NorOverlay_Bootstrap, 1000);