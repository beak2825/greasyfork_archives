// ==UserScript==
// @name         WME Gas Station Capture
// @name:es      WME Gas Station Capture
// @namespace    https://greasyfork.org/es/users/381587-vitoco
// @version      0.6
// @description  Captures gas station venue info to paste in gas station prices spreadsheet
// @description:es  Captura información de estaciones de servicio para pegar en la planilla de precios de combustible
// @author       witoco
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @match        https://www.waze.com/*/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459913/WME%20Gas%20Station%20Capture.user.js
// @updateURL https://update.greasyfork.org/scripts/459913/WME%20Gas%20Station%20Capture.meta.js
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
                //var boton = document.querySelector("i.w-icon.venue-panel-header-icon");
                var boton = document.querySelector("i.w-icon.w-icon-car-services");
                if (!$("#clgas").length) {
                    //var boton = document.querySelector("wz-caption.feature-id");
                    //var boton = document.querySelector("i.w-icon.venue-panel-header-icon.w-icon-car-services");
                    bloque = document.createElement("span");
                    bloque.id = 'clgas';
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
                        var enlace = $('a[class="permalink hidden"]').attr('href').replace(/\&s=\d+/i, "").replace(/com\/.*?editor/i, "com/editor");
                        var coordLon = (enlace.match(/\blon=(-?\d+\.\d+)/i))[1];
                        var coordLat = (enlace.match(/\blat=(-?\d+\.\d+)/i))[1];
                        var paste = estacion.id + "\t" + coordLon + "\t" + coordLat + "\t" + enlace + "\n";
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
                    if ($("#clgas").text() != estacion.id) {
                        boton.removeAttribute('style');
                        boton.removeAttribute('title');
                        $("#clgas").remove();
                    }
                }
            } else {
                if ($("#clgas").length) {
                    $("#clgas").remove();
                }
            }
        }
 
    }
 
    bootstrap(1);
})();
