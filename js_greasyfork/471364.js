// ==UserScript==
// @name         Bakalari - prumery
// @version      1.7.0
// @description  Zobrazování průměru ze známek i když nejsou administrátorem povolené
// @copyright    2019, Engy
// @author       engycz@gmail.com
// @license MIT
// @include      http*://*/*prubzna.aspx*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @xicon         https://image.prntscr.com/image/QpmNM_LxSfuaJL2vzUvczw.png
// @namespace https://greasyfork.org/users/1132330
// @downloadURL https://update.greasyfork.org/scripts/471364/Bakalari%20-%20prumery.user.js
// @updateURL https://update.greasyfork.org/scripts/471364/Bakalari%20-%20prumery.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($("#topheader").length && $("#cphmain_DivBySubject").length) {
        var table = $("#cphmain_DivBySubject")[0];

        var i = 0;
        var celkovyPrumer = 0;
        var celkovyPrumerPocet = 0;
        while (i < table.childElementCount) {
            var predmet = null;
            var znamky;
            var suma = 0;
            var pocet = 0;

            for (; i < table.childElementCount; i++) {
                if ($(table.children[i]).hasClass("predmet-radek")) {
                    predmet = $(table.children[i]);
                    break;
                }
            }

            for (; i < table.childElementCount; i++) {
                if ($(table.children[i]).hasClass("vyjed")) {
                    znamky = table.children[i];
                    break;
                }
            }

            if (predmet === null || znamky === null) {
                continue;
            }

            for (var j = 1; j < znamky.childElementCount; j++) {
                var info = $(znamky.children[j]);

                var vaha;
                if (info.children('.tab-vaha').length > 0) {
                    vaha = info.children('.tab-vaha')[0].innerText;
                } else {
                    vaha = 1;
                }
                var znamka = info.children('.tab-hodnoceni').children('.ta-znamka')[0].children[0].innerText;

                vaha = Number(vaha);
                znamka = znamka.replace("-", ".5");

                if (Number.isInteger(vaha) && !isNaN(znamka*1)) {
                    pocet = pocet + vaha;
                    suma = suma + znamka*vaha;
                }
            }

            if (pocet !== 0) {
                var prumer = (suma/pocet).toFixed(2);
                console.log(celkovyPrumerPocet + " - " + predmet[0].id + ' - ' + predmet.children('.leva').children('.obal').text().trim() + ' - ' + Math.round(suma/pocet))

                if (predmet.children('.leva').children('.dalsi-dva')[0].children.length == 0) {
                    predmet.children('.leva').children('.dalsi-dva')[0].innerText = prumer;
                    celkovyPrumer += Math.round(suma/pocet);
                } else {
                    predmet.children('.leva').children('.dalsi-dva').children().removeClass('modra-z');
                    celkovyPrumer += Math.round(parseFloat(predmet.children('.leva').children('.dalsi-dva').children('div').text().replace(",",".")));
                }

                celkovyPrumerPocet++;

                predmet.children('.leva').children('.dalsi-dva').addClass('velky');
                if (prumer < 1.5) {
                    predmet.children('.leva').children('.dalsi-dva').css("color", "#26F826");
                } else if (prumer < 2.5) {
                    predmet.children('.leva').children('.dalsi-dva').css("color", "#0090C9");
                } else if (prumer < 3.5) {
                    predmet.children('.leva').children('.dalsi-dva').css("color", "#FFAA2A");
                } else {
                    predmet.children('.leva').children('.dalsi-dva').css("color", "#C20E1A");
                }
            }
        }

        $("#cphmain_obdobiLabel").text($("#cphmain_obdobiLabel").text() + ". Průmer: " + (celkovyPrumer / celkovyPrumerPocet).toFixed(2));
    }
})();