// ==UserScript==
// @name         WME Gas Station Capture MX
// @name:es      WME Gas Station Capture MX
// @namespace    https://greasyfork.org/es/users/381587-vitoco
// @version      0.9
// @description  Captures gas station venue info to paste in gas station prices spreadsheet
// @description:es  Captura información de estaciones de servicio para pegar en la planilla de precios de combustible
// @author       witoco
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @match        https://www.waze.com/*/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461070/WME%20Gas%20Station%20Capture%20MX.user.js
// @updateURL https://update.greasyfork.org/scripts/461070/WME%20Gas%20Station%20Capture%20MX.meta.js
// ==/UserScript==

/* global W */
/* global $ */

(function() {
    'use strict';

    var bloque;
    var boton;

    function bootstrap(intentos) {
        if (W && W.map && W.model && W.loginManager.user && $ ) {
            init();
        } else if (intentos < 1000) {
            setTimeout(function () {bootstrap(intentos++);}, 200);
        }
    }

    function init() {
        setTimeout(function() {var myVar = setInterval(accion ,500);}, 2000);
    }

    function accion() {
        if (W.selectionManager.getSelectedWMEFeatures().length == 1) {
            var lugar = W.selectionManager.getSelectedWMEFeatures()[0];
            if (lugar.featureType == "venue") {
                var estacion = lugar._wmeObject.attributes;
                var boton = document.querySelector("i.w-icon.w-icon-car-services");
                if (!$("#mxgas").length) {
                    bloque = document.createElement("span");
                    bloque.id = 'mxgas';
                    bloque.classList.add('text');
                    if (estacion.brand) {
                        boton.title = 'Capture gas station info';
                        boton.style.cssText = ';background-color:cyan;cursor:copy;color:black';
                    } else {
                        boton.removeAttribute('style');
                        boton.title = "Venue is not a gas station";
                    }
                    bloque.innerHTML = estacion.id;
                    boton.onclick = function() {

                        estacion = W.selectionManager.getSelectedWMEFeatures()[0]._wmeObject.attributes;
                        var estacionref = W.selectionManager.getSelectedWMEFeatures()[0]._wmeObject.model;

                        var enlace = $('a[class="permalink hidden"]').attr('href').replace(/\&s=\d+/i, "").replace(/com\/.*?editor/i, "com/editor");
                        var coordLon = (enlace.match(/\blon=(-?\d+\.\d+)/i))[1];
                        var coordLat = (enlace.match(/\blat=(-?\d+\.\d+)/i))[1];
                        var ambienteurl = (enlace.match(/\benv=(\w+)/i))[1];
                        var idCiudad = estacionref.topCityId;
                        var ciudad = '';
                        if (idCiudad) {
                            ciudad = W.model.cities.getObjectById(idCiudad).attributes.name || '';
                        }
                        var estado = estacionref.topState.attributes.name;
                        var pais = estacionref.topCountry.attributes.name;
                        var ambiente = estacionref.topCountry.attributes.env;
                        if (ambienteurl == 'usa') {
                            ambiente = "NA";
                        }

                        // INSERT INTO waze_venues ("venue_id", "name", "longitude", "latitude", "country", "state", "city", "environment") VALUES ('159252805.1592593588.27896129', 'BP', '-116.98640', '32.52162', 'México', 'Baja California', 'Tijuana', 'ROW');

                        var paste = 'INSERT INTO wvenues ("venue_id", "name", "longitude", "latitude", "country", "state", "city", "environment", "brand") VALUES (' +
                            "'" + estacion.id + "', '" + estacion.name + "', '" + coordLon + "', '" + coordLat + "','" + pais + "', '" + estado + "', '" + ciudad + "', '" + ambiente + "', '" + estacion.brand + "');\n";

                        var $temp = $("<textarea>");
                        $("body").append($temp);
                        $temp.val(paste).select();
                        document.execCommand("copy");
                        $temp.remove();
                        boton.style.cssText = ';background-color:lime;color:black';
                    };
                    bloque.style.cssText = 'background-color:black;display:none;';
                    boton.insertAdjacentElement("afterend", bloque)
                } else {
                    if ($("#mxgas").text() != estacion.id) {
                        boton.removeAttribute('style');
                        boton.removeAttribute('title');
                        $("#mxgas").remove();
                    }
                }
            } else {
                if ($("#mxgas").length) {
                    $("#mxgas").remove();
                }

            }
        }

    }

    bootstrap(1);
})();
