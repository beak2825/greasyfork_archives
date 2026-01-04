// ==UserScript==
// @name         WME Toll Info Capture
// @name:es      WME Toll Info Capture
// @namespace    https://greasyfork.org/es/users/381587-vitoco
// @version      0.4.0
// @description  Captures segment & venue info to paste in custom tolls prices spreadsheet
// @description:es  Captura información de segmentos y lugares para la planilla de precios de peajes
// @author       witoco
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @match        https://www.waze.com/*/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/390693/WME%20Toll%20Info%20Capture.user.js
// @updateURL https://update.greasyfork.org/scripts/390693/WME%20Toll%20Info%20Capture.meta.js
// ==/UserScript==

/* global W */
/* global $ */

(function() {
    'use strict';

    var estilo;
    var bloque;
    var idLugar = '';
    var registros = '';
    var punto;

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

    function sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    function accion() {
        if (W.selectionManager.getSelectedWMEFeatures().length == 1) {
            if (W.selectionManager.getSelectedWMEFeatures()[0].featureType == "segment") {
                if (!$("#clpeajes").length) {
                    var segmento = W.selectionManager.getSelectedWMEFeatures()[0]._wmeObject.attributes;
                    estilo = 'margin:0 5px 0 5px;border-radius:6px;padding:0 3px 0 3px';
                    bloque = document.createElement("span");
                    bloque.id = 'clpeajes';
                    bloque.classList.add('text');
                    if (segmento.fwdToll || segmento.revToll) {
                        if (segmento.fwdToll && segmento.fwdDirection && segmento.revToll && segmento.revDirection) {
                            bloque.style.cssText = estilo + ';cursor:pointer;background-color:blue;color:white';
                            bloque.innerHTML = '🔧 Capture double toll segment info';
                            registros = 'Two records';
                        } else {
                            bloque.style.cssText = estilo + ';cursor:pointer;background-color:cyan';
                            bloque.innerHTML = '🔧 Capture toll segment info';
                            registros = 'Record';
                        }
                        bloque.onclick = function() {

                            segmento = W.selectionManager.getSelectedWMEFeatures()[0]._wmeObject.attributes;

                            var numSegmento = segmento.id;
                            var nodoA = segmento.fromNodeID;
                            var nodoB = segmento.toNodeID;

                            var enlace = $('a[class="permalink hidden"]').attr('href').replace(/\&s=\d+/i, "");
                            var coordLon = (enlace.match(/\blon=(-?\d+\.\d+)/i))[1];
                            var coordLat = (enlace.match(/\blat=(-?\d+\.\d+)/i))[1];

                            var extra = '';
                            var color = ';background-color:lime';
                            if (idLugar !== "") {
                                extra = "\t" + idLugar;
                                color = ';background-color:green;color:white';
                            }

                            var nombre = '';
                            if (W.model.streets.getObjectById(segmento.primaryStreetID)) {
                                nombre = W.model.streets.getObjectById(segmento.primaryStreetID).attributes.name;
                            }

                            var paste = '';
                            if (segmento.fwdToll && segmento.fwdDirection) { // A->B
                                paste += nombre + "\t" + coordLon + "\t" + coordLat + "\t" + numSegmento + "\t" + nodoA + "\t" + nodoB + "\t" + 1 + "\t" + enlace + extra + "\n";
                            }
                            if (segmento.revToll && segmento.revDirection) { // B->A
                                paste += nombre + "\t" + coordLon + "\t" + coordLat + "\t" + numSegmento + "\t" + nodoB + "\t" + nodoA + "\t" + 0 + "\t" + enlace + extra + "\n";
                            }

                            if (paste !== "") {
                                var $temp = $("<textarea>");
                                $("body").append($temp);
                                $temp.val(paste).select();
                                document.execCommand("copy");
                                $temp.remove();
                                bloque.style.cssText = estilo + color;
                                bloque.innerHTML = '🔧 ' + registros + ' copied to paste buffer';
                            }
                        };
                    } else {
                        bloque.style.cssText = estilo + ';background-color:#FFE8E8';
                        bloque.innerHTML = "🔧 Not a toll segment";
                    }
                    //document.querySelector("#edit-panel > div > div > div > div.selection.selection-icon > span:nth-child(1)").insertAdjacentElement("afterend", bloque);
                    //document.querySelector("wz-caption.feature-id").insertAdjacentElement("beforeend", bloque);
                    //document.querySelector("wz-section-header").children[1].insertAdjacentElement("beforeend", bloque);
                    sleep(1000);
                    //var sel = document.querySelector("i.w-icon.venue-panel-header-icon");
                    //var sel = document.querySelector("#edit-panel > div > div > div > wz-section-header > div.wz-section-header ");
                    //document.querySelector("#edit-panel > div > div > div > wz-section-header > div").insertAdjacentElement("beforeend", bloque);
                    punto = document.querySelector("#edit-panel > div > div > div > wz-section-header") ??
                        document.querySelector("#edit-panel > div > div > div > wz-banner");
                    punto.insertAdjacentElement("beforebegin", bloque);
                }

            } else if (W.selectionManager.getSelectedWMEFeatures()[0].featureType == "venue") {

                if (!$("#clpeajes").length) {
                    var lugar = W.selectionManager.getSelectedWMEFeatures()[0]._wmeObject.attributes;
                    estilo = 'cursor:pointer;margin-left:5px;border-radius:6px;padding:0 3px 0 3px';
                    bloque = document.createElement("span");
                    bloque.id = 'clpeajes';
                    //bloque.title = 'Capture toll venue Id';
                    bloque.classList.add('text');
                    bloque.style.cssText = estilo + ';background-color:' + (idLugar == lugar.id ? 'yellow' : 'cyan');
                    bloque.innerHTML = '🔧 Capture venue Id for toll';

                    bloque.onclick = function() {
                        lugar = W.selectionManager.getSelectedWMEFeatures()[0]._wmeObject.attributes;
                        idLugar = lugar.id == idLugar ? '' : lugar.id;
                        var $temp = $("<input>");
                        $("body").append($temp);
                        $temp.val(idLugar).select();
                        document.execCommand("copy");
                        $temp.remove();
                        bloque.style.cssText = estilo + ';background-color:' + (idLugar === '' ? 'cyan' : 'yellow');
                    };
                    //document.querySelector("#edit-panel > div > div > div > div.selection.selection-icon > span:nth-child(1)").insertAdjacentElement("afterend", bloque);
                    //document.querySelector("wz-caption.feature-id").insertAdjacentElement("beforeend", bloque);
                    //document.querySelector("wz-section-header").children[1].insertAdjacentElement("beforeend", bloque);
                    //document.querySelector("#edit-panel > div > div > div > wz-section-header > div").insertAdjacentElement("beforeend", bloque);
                    document.querySelector("#edit-panel > div > div > div > wz-section-header").insertAdjacentElement("beforebegin", bloque);
                }

            } else {

                if ($("#clpeajes").length) {
                    bloque.style.cssText = estilo + ';background-color:black;display:none;';
                }

            }
        }

    }

    bootstrap(1);
})();
