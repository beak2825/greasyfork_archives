// ==UserScript==
// @name            Geoportal Waze integration
// @version         1.4.3
// @description     Adds geoportal.gov.pl overlays ("satelite view", cities, places, house numbers)
// @include         https://*.waze.com/*/editor*
// @include         https://*.waze.com/editor*
// @include         https://*.waze.com/map-editor*
// @include         https://*.waze.com/beta_editor*
// @copyright       2013-2025+, Patryk Ściborek, Paweł Pyrczak, Kamil Marud
// @run-at          document-end
// @grant           none
// @icon            https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @namespace https://greasyfork.org/users/1430039
// @downloadURL https://update.greasyfork.org/scripts/525577/Geoportal%20Waze%20integration.user.js
// @updateURL https://update.greasyfork.org/scripts/525577/Geoportal%20Waze%20integration.meta.js
// ==/UserScript==

/**
 * Source code: https://github.com/TKr/WME-geoportal - deprecated
 * Source code: https://github.com/strah/WME-geoportal.pl - versions up to 0.2.15.21
 * Source code: https://github.com/kmarud/WME-geoportal.pl -version >= 1.0
 */


/* Changelog:
 *  1.4.3 - Fix issue with checkboxes logic
 *  1.4.2 - Rename some layers
 *  1.4.1 - Reformat code with beautifier.io
 *  1.4 - Added new layers
 *  1.3 - Hide some option depending on user rank
 *  1.2 - Disable loading ortofoto layer on start
 *  1.1 - Added Gminy and Wojewodztwa
 *  1.0 - Refactored, simplified code
 *  0.2.15.21 - added city, voivodeship and country borders overlay (by Falcon4Tech)
 *  0.2.15.20 - css tweaks - moving toggles to the "view" section
 *  0.2.15.19 - css tweaks
 *  0.2.15.18 - accommodating WME updates (by @luc45z)
 *  0.2.15.17 - accommodating WME updates (by @luc45z)
 *  0.2.15.16 - Fix for CSP errors
 *  0.2.15.15 - Added streets overlay (by absf11_2)
 *  0.2.15.14 - Added hi-res ortophoto map (by absf11_2)
 *  0.2.15.13 - API endpoint change (street numbers)
 *  0.2.15.12 - z-index fix
 *  0.2.15.11 - added administrative map overlay
 *  0.2.15.10 - updated ortofoto map API URL
 *  0.2.15.9 - added mileage bars overlay
 *  0.2.15.8 - added railcrossings overlay
 *  0.2.15.7 - fixed for the new layers swither, again
 *  0.2.15.6 - fixed for the new layers swither
 *  0.2.15.5 - added new layer: "miejsca", simplified layers names
 *  0.2.15.4 - updated BDOT url (again)
 *  0.2.15.3 - updated BDOT url
 *  0.2.15.2 - fixed for the new layers switcher
 *  0.2.15.1 - fixed window.Waze/window.W deprecation warnings
 *  0.2.15.0 - fixed layers zIndex switching
 *  0.2.14.1 - fixed include addresses
 *  0.2.14.0 - fixed adding toggle on layer list (new WME version)
 */
(function() {
  var GEOPORTAL = {
    ver: "1.0"
  };
  GEOPORTAL.init = function(w) {
    console.log('Geoportal: Version ' + this.ver + ' init start');

    const style = document.createElement('style');
    const usrRank = window.W.loginManager.getUserRank();
    style.innerHTML = `
                .layer-switcher ul[class^="collapsible"]  {
                    max-height: none;
                }
            `;
    document.head.appendChild(style);

    const wms_service_orto = "https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMS/StandardResolution?";
    const wms_service_orto_high = "https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMS/HighResolution?";
    const wms_osm = "https://mapy.geoportal.gov.pl/wss/ext/OSM/BaseMap/service?";
    const wms_adresy = "https://mapy.geoportal.gov.pl/wss/ext/KrajowaIntegracjaNumeracjiAdresowej?request=GetMap&";
    const wms_rail = "https://mapy.geoportal.gov.pl/wss/service/sdi/Przejazdy/get?REQUEST=GetMap&";
    const wms_mileage = "https://mapy.geoportal.gov.pl/wss/ext/OSM/SiecDrogowaOSM?";
    const wms_topo = "https://integracja.gugik.gov.pl/cgi-bin/KrajowaIntegracjaBazDanychObiektowTopograficznych?";
    const wms_parcels = "https://integracja.gugik.gov.pl/cgi-bin/KrajowaIntegracjaEwidencjiGruntow?";
    const wms_border_city = "https://mapy.geoportal.gov.pl/wss/service/PZGIK/PRG/WMS/AdministrativeBoundaries?REQUEST=GetMap&";
    const wms_kompozycja = "https://mapy.geoportal.gov.pl/wss/service/pub/guest/kompozycja_BDOT10k_WMS/MapServer/WMSServer"

    const my_wazeMap = w;

    const epsg900913 = new window.OpenLayers.Projection("EPSG:900913");
    const epsg4326 = new window.OpenLayers.Projection("EPSG:4326");

    const getUrlAsEpsg4326 = function(bounds) {
      bounds = bounds.clone();
      bounds = this.adjustBounds(bounds);

      var imageSize = this.getImageSize(bounds);
      var newParams = {};
      bounds.transform(epsg900913, epsg4326);

      // WMS 1.3 introduced axis order
      newParams.BBOX = bounds.toArray(true);
      newParams.WIDTH = imageSize.w;
      newParams.HEIGHT = imageSize.h;
      var requestString = this.getFullRequestString(newParams);
      return requestString;
    };

    const setEpsg4326 = function(newParams, altUrl) {
      this.params.CRS = "EPSG:4326";
      return window.OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this, arguments);
    };

    const geoportalAddLayer = function(layer, defaultChecked) {
      var displayGroupSelector = document.querySelector('#layer-switcher-region .menu .list-unstyled');
      if (displayGroupSelector != null) {
        var displayGroup = displayGroupSelector.querySelector('li.group:nth-child(5) ul');
        var toggler = document.createElement('wz-checkbox');
        var togglerContainer = document.createElement('li');
        toggler.appendChild(document.createTextNode(layer.name));
        toggler.checked = defaultChecked;
        layer.setVisibility(defaultChecked);
        toggler.addEventListener('change', function() {
          layer.setVisibility(this.checked);
        });

        togglerContainer.appendChild(toggler);
        displayGroup.appendChild(togglerContainer);
      }
    };

    const addText = function(text) {
      var displayGroupSelector = document.querySelector('#layer-switcher-region .menu .list-unstyled');
      if (displayGroupSelector != null) {
        var displayGroup = displayGroupSelector.querySelector('li.group:nth-child(5) ul');

        var togglerContainer = document.createElement('li');
        togglerContainer.appendChild(document.createTextNode(text));

        displayGroup.appendChild(togglerContainer);
      }
    };

    const geop_orto = new window.OpenLayers.Layer.WMS(
      "Geoportal - ortofoto",
      wms_service_orto, {
        layers: "Raster",
        format: "image/jpeg",
        version: "1.3.0"
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: false,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );

    const geop_orto_high = new window.OpenLayers.Layer.WMS(
      "Geoportal - ortofoto high res",
      wms_service_orto_high, {
        layers: "Raster",
        format: "image/jpeg",
        version: "1.3.0"
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: false,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );

    const geop_osm = new window.OpenLayers.Layer.WMS(
      "Geoportal - OSM",
      wms_osm, {
        layers: "osm",
        format: "image/png",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );

    const geop_adresy = new window.OpenLayers.Layer.WMS(
      "Geoportal - adresy",
      wms_adresy, {
        layers: "prg-adresy",
        transparent: "true",
        version: "1.3.0"
      }, {
        isBaseLayer: false,
        visibility: false,
        getURL: getUrlAsEpsg4326,
        singleTile: true,
        getFullRequestString: setEpsg4326
      }
    );

    const geop_miejsca = new window.OpenLayers.Layer.WMS(
      "Geoportal - place",
      wms_adresy, {
        layers: "prg-place",
        transparent: "true",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );


    const geop_ulice = new window.OpenLayers.Layer.WMS(
      "Geoportal - ulice",
      wms_adresy, {
        layers: "prg-ulice",
        transparent: "true",
        format: "image/png",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );

    const geop_komplet = new window.OpenLayers.Layer.WMS(
      "Geoportal - adresy, place i ulice w jednym",
      wms_adresy, {
        layers: "prg-adresy,prg-place,prg-ulice",
        transparent: "true",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );


    const geop_rail = new window.OpenLayers.Layer.WMS(
      "Geoportal - przejazdy kolejowe (wymaganay duży zoom)",
      wms_rail, {
        layers: "PMT_Linie_Kolejowe_Sp__z_o_o_,Kopalnia_Piasku_KOTLARNIA_-_Linie_Kolejowe_Sp__z__o_o_,Jastrzębska_Spółka_Kolejowa_Sp__z_o_o_,Infra_SILESIA_S_A_,EUROTERMINAL_Sławków_Sp__z_o_o_,Dolnośląska_Służba_Dróg_i_Kolei_we_Wrocławiu,CARGOTOR_Sp__z_o_o_,PKP_SKM_w_Trójmieście_Sp__z_o_o_,PKP_Linia_Hutnicza_Szerokotorowa_Sp__z_o__o_,PKP_Polskie_Linie_Kolejowe",
        transparent: "true",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );

    const geop_mileage = new window.OpenLayers.Layer.WMS(
      "Geoportal - drogi",
      wms_mileage, {
        layers: "planowane,wbudowie,pikietaz,drugorzedne,glowne,ekspresowe,autostrady",
        transparent: "true",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );

    const geop_parcels = new window.OpenLayers.Layer.WMS(
      "Geoportal - podział adm",
      wms_parcels, {
        layers: "dzialki,numery_dzialek",
        transparent: "true",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );

    const geop_b_city = new window.OpenLayers.Layer.WMS(
      "Geoportal - Miasta",
      wms_border_city, {
        layers: "A06_Granice_obrebow_ewidencyjnych,A05_Granice_jednostek_ewidencyjnych,A04_Granice_miast",
        transparent: "true",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );

    const geop_b_gminy = new window.OpenLayers.Layer.WMS(
      "Geoportal - gminy",
      wms_border_city, {
        layers: "A03_Granice_gmin",
        transparent: "true",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );

    const geop_b_powiaty = new window.OpenLayers.Layer.WMS(
      "Geoportal - powiaty",
      wms_border_city, {
        layers: "A02_Granice_powiatow",
        transparent: "true",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );

    const geop_b_woj = new window.OpenLayers.Layer.WMS(
      "Geoportal - województwa",
      wms_border_city, {
        layers: "A01_Granice_wojewodztw",
        transparent: "true",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );


    const geop_b_pl = new window.OpenLayers.Layer.WMS(
      "Geoportal - Granica PL",
      wms_border_city, {
        layers: "A00_Granice_panstwa",
        transparent: "true",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );

    const geop_topo = new window.OpenLayers.Layer.WMS(
      "Geoportal - obiekty topograficzne",
      wms_topo, {
        layers: "bdot",
        transparent: "true",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );

    const geop_bdot1 = new window.OpenLayers.Layer.WMS(
      "BDOT - Gruntowa",
      wms_kompozycja, {
        layers: "DrDGr,DrLGr",
        transparent: "true",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );


    const geop_bdot2 = new window.OpenLayers.Layer.WMS(
      "BDOT - Utwardzona",
      wms_kompozycja, {
        layers: "JDrLNUt",
        transparent: "true",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );

    const geop_bdot3 = new window.OpenLayers.Layer.WMS(
      "BDOT - Twarda",
      wms_kompozycja, {
        layers: "JDLNTw,JDrZTw",
        transparent: "true",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );

    const geop_bdot4 = new window.OpenLayers.Layer.WMS(
      "BDOT - Główna",
      wms_kompozycja, {
        layers: "JDrG",
        transparent: "true",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );


    const geop_bdot5 = new window.OpenLayers.Layer.WMS(
      "BDOT - Droga ekspresowa lub Głowna ruchu przyspieszonego w budowie",
      wms_kompozycja, {
        layers: "DrEk",
        transparent: "true",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );

    const geop_bdot6 = new window.OpenLayers.Layer.WMS(
      "BDOT - Jezdnia drogi ekspresowej lub głównej ruchu przyspieszonego",
      wms_kompozycja, {
        layers: "JDrEk",
        transparent: "true",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );

    const geop_bdot7 = new window.OpenLayers.Layer.WMS(
      "BDOT - Autostrada",
      wms_kompozycja, {
        layers: "JAu",
        transparent: "true",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );

    const geop_bdot8 = new window.OpenLayers.Layer.WMS(
      "BDOT - Numer drogi",
      wms_kompozycja, {
        layers: "NrDr",
        transparent: "true",
        version: "1.3.0",
      }, {
        isBaseLayer: false,
        visibility: false,
        singleTile: true,
        getURL: getUrlAsEpsg4326,
        getFullRequestString: setEpsg4326
      }
    );

    console.log('Geoportal: adding layers');
    if (my_wazeMap.getLayersByName("Geoportal - orto").length == 0) {

      addText("-- Warstwy dodatkowe --")

      my_wazeMap.addLayer(geop_orto);
      geoportalAddLayer(geop_orto, false);

      my_wazeMap.addLayer(geop_orto_high);
      geoportalAddLayer(geop_orto_high, false);

      if (usrRank >= 2) {
        my_wazeMap.addLayer(geop_osm);
        geoportalAddLayer(geop_osm, false);
      }

      my_wazeMap.addLayer(geop_adresy);
      geoportalAddLayer(geop_adresy, true);

      my_wazeMap.addLayer(geop_ulice);
      geoportalAddLayer(geop_ulice, false);

      my_wazeMap.addLayer(geop_miejsca);
      geoportalAddLayer(geop_miejsca, false);

      my_wazeMap.addLayer(geop_komplet);
      geoportalAddLayer(geop_komplet, false);

      my_wazeMap.addLayer(geop_rail);
      geoportalAddLayer(geop_rail, false);

      my_wazeMap.addLayer(geop_mileage);
      geoportalAddLayer(geop_mileage, false);

      my_wazeMap.addLayer(geop_parcels);
      geoportalAddLayer(geop_parcels, false);

      my_wazeMap.addLayer(geop_b_city);
      geoportalAddLayer(geop_b_city, false);

      my_wazeMap.addLayer(geop_b_gminy);
      geoportalAddLayer(geop_b_gminy, false);

      my_wazeMap.addLayer(geop_b_powiaty);
      geoportalAddLayer(geop_b_powiaty, false);

      my_wazeMap.addLayer(geop_b_woj);
      geoportalAddLayer(geop_b_woj, false);

      my_wazeMap.addLayer(geop_b_pl);
      geoportalAddLayer(geop_b_pl, false);

      addText("Warsty są esperymentalne (zoom 18+), używaj rozsądnie")

      my_wazeMap.addLayer(geop_topo);
      geoportalAddLayer(geop_topo, false);

      my_wazeMap.addLayer(geop_bdot1);
      geoportalAddLayer(geop_bdot1, false);

      my_wazeMap.addLayer(geop_bdot2);
      geoportalAddLayer(geop_bdot2, false);

      my_wazeMap.addLayer(geop_bdot3);
      geoportalAddLayer(geop_bdot3, false);

      my_wazeMap.addLayer(geop_bdot4);
      geoportalAddLayer(geop_bdot4, false);

      my_wazeMap.addLayer(geop_bdot5);
      geoportalAddLayer(geop_bdot5, false);

      my_wazeMap.addLayer(geop_bdot6);
      geoportalAddLayer(geop_bdot6, false);

      my_wazeMap.addLayer(geop_bdot7);
      geoportalAddLayer(geop_bdot7, false);

      my_wazeMap.addLayer(geop_bdot8);
      geoportalAddLayer(geop_bdot8, false);


      console.log('Geoportal: layers added');
      this.OrtoTimer();
    }
  };

  GEOPORTAL.OrtoTimer = function() {
    setTimeout(function() {
      var orto = window.W.map.getLayerByUniqueName("Geoportal - ortofoto");
      if (orto) orto.setZIndex(2050);

      var ortoHighRes = window.W.map.getLayerByUniqueName("Geoportal - ortofoto high res");
      if (ortoHighRes) ortoHighRes.setZIndex(2050);

      var osm = window.W.map.getLayerByUniqueName("Geoportal - OSM");
      if (osm) osm.setZIndex(2050);

      GEOPORTAL.OrtoTimer();
    }, 1000);
  };

  GEOPORTAL.initBootstrap = function() {
    try {
      if (document.getElementById('layer-switcher-group_display') != null) {
        this.init(window.W.map);
      } else {
        console.log("->Geoportal: WME not initialized yet, trying again later.");
        setTimeout(function() {
          GEOPORTAL.initBootstrap();
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      console.log("Geoportal: WME not initialized yet, trying again later.");
      setTimeout(function() {
        GEOPORTAL.initBootstrap();
      }, 1000);
    }
  };
  GEOPORTAL.initBootstrap();
})();
