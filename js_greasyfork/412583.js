// ==UserScript==
// @name         WME Segment Id Copy
// @name:en      WME Segment Id Copy
// @namespace    https://greasyfork.org/es/users/381587-vitoco
// @version      0.8
// @description  Captura Id de segmentos
// @description:en  Captures segment Id
// @author       witoco
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @match        https://www.waze.com/*/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/412583/WME%20Segment%20Id%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/412583/WME%20Segment%20Id%20Copy.meta.js
// ==/UserScript==

/* global W */
/* global $ */

(function() {
    'use strict';

    var estilo;
    var bloque;

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
        if (W.selectionManager.getSelectedFeatures().length == 1) {
            var objeto = W.selectionManager.getSelectedFeatures()[0].featureType;
            if (objeto == "segment" || objeto == "venue") {
                var boton = document.querySelector("#edit-panel > div > div > div > wz-section-header").shadowRoot.querySelector("div > div.text-wrapper > wz-caption");
                if (!boton.onclick) {
                    boton.style.backgroundColor = '#FFFFC0';
                    boton.style.cursor = 'pointer';
                    boton.title = 'Capture ' + objeto + ' Id';
                    var segmento = W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes;
                    boton.onclick = function() {
                       var $temp = $("<textarea>");
                        $("body").append($temp);
                        $temp.val(segmento.id).select();
                        document.execCommand("copy");
                        $temp.remove();
                        boton.style.backgroundColor = 'lime';
                    };
                }
            }
        }
    }

    bootstrap(1);
})();
