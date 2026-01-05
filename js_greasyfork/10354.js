// ==UserScript==
// @name        WME CheckThoseStreets
// @name:en     WME CheckThoseStreets
// @description Ferramenta auxiliar para o Waze Map Editor (WME) que destaca os segmentos com um ou mais anos desde a última atualização.
// @description:en It is an auxiliary tool for Waze Map Editor (WME) that highlights segments with one or more years since their last update.
// @include     https://www.waze.com/editor/*
// @include     https://www.waze.com/*/editor/*
// @author	RomuloBarrosPI (romuloobarros at g mail dot com)
// @version     1.1
// @grant       none
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/10354/WME%20CheckThoseStreets.user.js
// @updateURL https://update.greasyfork.org/scripts/10354/WME%20CheckThoseStreets.meta.js
// ==/UserScript==

(function ()
 {
     var hoje = new Date();
     function iniciar() {
         if (window.Waze.model.segments.objects.length <=0)
         {
             console.log('WME-CTS aguardando API...');
             window.setTimeout(iniciar, 500);
             return;
         } 
         else
         {
             for (var objeto in Waze.model.segments.objects)
             {
                 var segmento = Waze.model.segments.get(objeto);
                 var atributos = segmento.attributes;
                 var dias = (hoje.getTime() - atributos.updatedOn) / 86400000;
                 var noh = segmento.geometry.id;
                 var linha = capturar(noh);
                 if (linha !== null && dias >= 365 && linha.getAttribute("stroke") != '#00ece3')
                 {
                     linha.setAttribute('stroke', 'lime');
                     linha.setAttribute('stroke-width', '5');
                     linha.setAttribute('stroke-opacity', '0.5');
                 }
             }
         }
     }
     function capturar(noh) {
         return document.getElementById(noh);
     }
     window.setInterval(iniciar, 333);
     iniciar();
 }) ();