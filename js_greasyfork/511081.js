// ==UserScript==
// @name        Allow selection, right click and copy on Microfiches.net syndicate websites
// @namespace   StephenP
// @license     MIT
// @match       https://de.microfiches.net/*
// @match       https://en.microfiches.net/*
// @match       https://es.microfiches.net/*
// @match       https://fr.microfiches.net/*
// @match       https://it.microfiches.net/*
//ITALY
// @match       https://www.bike-parts-honda.it/*
// @match       https://www.bike-parts-yam.it/*
// @match       https://www.bike-parts-suz.it/*
// @match       https://www.ricambi-ducati.it/*
// @match       https://www.ricambi-moto-bmw.it/*
// @match       https://www.bike-parts-kawa.it/*
// @match       https://www.ricambi-kymco.com/*
// @match       https://www.ricambi-ktm.it/*
// @match       https://www.ricambi-triumph.it/*
// @match       https://www.ricambi-polaris.it/*
// @match       https://www.ricambi-honda.it/*
// @match       https://www.aprilia.ricambi-moto-scooter.com/*
// @match       https://www.ricambi-mv.it/*
// @match       https://www.classic-red.com/*
// @match       https://www.ricambi-bmw.it/*
// @match       https://www.ricambi-husqvarna.it/*
// @match       https://www.ricambi-mash.it/*
// @match       https://www.piaggio.ricambi-moto-scooter.com/*
// @match       https://www.motoguzzi.ricambi-moto-scooter.com/*
// @match       https://www.bike-parts-sym.it/*
// @match       https://www.ricambio-gasgas.it/*
// @match       https://www.ricambi-royalenfield.it/*
// @match       https://www.ricambi-mini.it/*
// @match       https://www.ricambi-sea-doo.it/*
// @match       https://www.ricambi-can-am.it/*
// @match       https://www.ricambi-benelli.it/*
// @match       https://www.ricambi-isuzu.it/*
// @match       https://www.honda.ricambi-giardino.it/*
// @match       https://www.kawasaki.ricambi-giardino.it/*
// @match       https://www.stihl.ricambi-giardino.it/*
// @match       https://www.husqvarna.ricambi-giardino.it/*
// @match       https://www.unlimited-power.net/*
// @match       https://www.manuale-tecnico.it/*
//GERMANY
// @match       https://www.bike-parts-honda.de/*
// @match       https://www.bike-parts-yam.de/*
// @match       https://www.bike-parts-suz.de/*
// @match       https://www.ersatzteile-ducati.de/*
// @match       https://www.ersatzteile-motorrad-bmw.de/*
// @match       https://www.bike-parts-kawa.de/*
// @match       https://www.ersatzteile-kymco.de/*
// @match       https://www.ersatzteile-ktm.de/*
// @match       https://www.ersatzteile-triumph.de/*
// @match       https://www.ersatzteile-polaris.de/*
// @match       https://www.ersatzteile-honda.de/*
// @match       https://www.aprilia.original-ersatzteilkatalog.de/*
// @match       https://www.ersatzteile-mvagusta.de/*
// @match       https://www.classic-red.com/*
// @match       https://www.ersatzteile-auto-bmw.de/*
// @match       https://www.ersatzteile-husqvarna.de/*
// @match       https://www.ersatzteile-mash.de/*
// @match       https://www.piaggio.original-ersatzteilkatalog.de/*
// @match       https://www.motoguzzi.original-ersatzteilkatalog.de/*
// @match       https://www.bike-parts-sym.de/*
// @match       https://www.ersatzteile-gasgas.de/*
// @match       https://www.ersatzteile-royalenfield.de/*
// @match       https://www.ersatzteile-mini.de/*
// @match       https://www.ersatzteile-sea-doo.de/*
// @match       https://www.ersatzteile-can-am.de/*
// @match       https://www.ersatzteile-benelli.de/*
// @match       https://www.ersatzteile-isuzu.de/*
// @match       https://www.honda.ersatzteile-garten.de/*
// @match       https://www.kawasaki.ersatzteile-garten.de/*
// @match       https://www.stihl.ersatzteile-garten.de/*
// @match       https://www.husqvarna.ersatzteile-garten.de/*
// @match       https://www.unlimited-power.net/*
// @match       https://www.geratehandbuch.de/*
//ENGLISH
// @match       https://www.bike-parts-honda.com/*
// @match       https://www.bike-parts-yam.com/*
// @match       https://www.bike-parts-suz.com/*
// @match       https://www.bike-parts-ducati.com/*
// @match       https://www.bike-parts-bmw.com/*
// @match       https://www.bike-parts-kawa.com/*
// @match       https://www.bike-parts-kymco.uk/*
// @match       https://www.bike-parts-ktm.com/*
// @match       https://www.bike-parts-triumph.com/*
// @match       https://www.parts-polaris.uk/*
// @match       https://www.parts-honda.uk/*
// @match       https://www.aprilia.genuine-parts-catalogue.com/*
// @match       https://www.bike-parts-mv.com/*
// @match       https://www.classic-red.com/*
// @match       https://www.bmw-spare-parts.com/*
// @match       https://www.bike-parts-husqvarna.com/*
// @match       https://www.bike-parts-mash.com/*
// @match       https://www.www.piaggio.genuine-parts-catalogue.com/*
// @match       https://www.motoguzzi.genuine-parts-catalogue.com/*
// @match       https://www.bike-parts-sym.com/*
// @match       https://www.bike-parts-gasgas.com/*
// @match       https://www.bike-parts-royalenfield.com/*
// @match       https://www.mini-spare-parts.com/*
// @match       https://www.bike-parts-sea-doo.com/*
// @match       https://www.bike-parts-can-am.com/*
// @match       https://www.bike-parts-benelli.com/*
// @match       https://www.parts-isuzu.com/*
// @match       https://www.honda.gardening-parts.com/*
// @match       https://www.kawasaki.gardening-parts.com/*
// @match       https://www.stihl.gardening-parts.com/*
// @match       https://www.husqvarna.gardening-parts.com/*
// @match       https://www.unlimited-power.net/*
// @match       https://www.technical-manual.com/*
//FRENCH
// @match       https://www.bike-parts.fr/*
// @match       https://www.pieces-yam.com/*
// @match       https://www.pieces-suz.com/*
// @match       https://www.pieces-ducati.com/*
// @match       https://www.pieces-bmw-moto.fr/*
// @match       https://www.pieces-kawa.com/*
// @match       https://www.pieces-kymco.com/*
// @match       https://www.pieces-ktm.com/*
// @match       https://www.pieces-triumph.com/*
// @match       https://www.pieces-polaris.com/*
// @match       https://www.pieces-auto-honda.fr/*
// @match       https://www.aprilia.pieces-detachees-origine.fr/*
// @match       https://www.pieces-mv.com/*
// @match       https://www.classic-red.fr/*
// @match       https://www.pieces-bmw.fr/*
// @match       https://www.pieces-husqvarna.com/*
// @match       https://www.pieces-mash.com/*
// @match       https://www.piaggio.pieces-detachees-origine.fr/*
// @match       https://www.motoguzzi.pieces-detachees-origine.fr/*
// @match       https://www.pieces-sym.com/*
// @match       https://www.pieces-gasgas.com/*
// @match       https://www.royalenfield-pieces.fr/*
// @match       https://www.pieces-mini.com/*
// @match       https://www.pieces-sea-doo.fr/*
// @match       https://www.pieces-can-am.fr/*
// @match       https://www.benelli-pieces.fr/*
// @match       https://www.pieces-isuzu.fr/*
// @match       https://www.honda.pieces-jardin.fr/*
// @match       https://www.kawasaki.pieces-jardin.fr/*
// @match       https://www.stihl.pieces-jardin.fr/*
// @match       https://www.husqvarna.pieces-jardin.fr/*
// @match       https://www.up-power.eu/*
// @match       https://www.manuel-technique.com/*
//SPANISH
// @match       https://www.bike-parts-honda.es/*
// @match       https://www.bike-parts-yam.es/*
// @match       https://www.bike-parts-suz.es/*
// @match       https://www.repuestos-ducati.es/*
// @match       https://www.recambios-moto-bmw.es/*
// @match       https://www.bike-parts-kawa.es/*
// @match       https://www.recambio-kymco.com/*
// @match       https://www.repuestos-ktm.es/*
// @match       https://www.recambios-triumph.es/*
// @match       https://www.recambio-polaris.es/*
// @match       https://www.repuestos-honda.es/*
// @match       https://www.aprilia.catalogo-recambios.es/*
// @match       https://www.recambio-mv.es/*
// @match       https://www.classic-red.com/*
// @match       https://www.recambios-bmw.es/*
// @match       https://www.repuestos-husqvarna.es/*
// @match       https://www.recambios-mash.es/*
// @match       https://www.piaggio.catalogo-recambios.es/*
// @match       https://www.motoguzzi.catalogo-recambios.es/*
// @match       https://www.bike-parts-sym.es/*
// @match       https://www.repuestos-gasgas.es/*
// @match       https://www.recambios-royalenfield.es/*
// @match       https://www.recambios-mini.es/*
// @match       https://www.recambios-sea-doo.es/*
// @match       https://www.recambios-can-am.es/*
// @match       https://www.recambios-benelli.es/*
// @match       https://www.recambios-isuzu.es/*
// @match       https://www.honda.recambios-jardin.es/*
// @match       https://www.kawasaki.recambios-jardin.es/*
// @match       https://www.stihl.recambios-jardin.es/*
// @match       https://www.husqvarna.recambios-jardin.es/*
// @match       https://www.unlimited-power.net/*
// @match       https://www.manual-tecnico.es/*
// @grant       none
// @version     1.2
// @author      StephenP
// @description Allow text selections and right clicks on microfiches.net syndicate websites (motorbike parts resellers)
// @downloadURL https://update.greasyfork.org/scripts/511081/Allow%20selection%2C%20right%20click%20and%20copy%20on%20Microfichesnet%20syndicate%20websites.user.js
// @updateURL https://update.greasyfork.org/scripts/511081/Allow%20selection%2C%20right%20click%20and%20copy%20on%20Microfichesnet%20syndicate%20websites.meta.js
// ==/UserScript==
//MIT License
//
//Copyright (c) 2024 StephenP
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.


var s=document.createElement("STYLE");
s.innerHTML=`
*{
   -webkit-touch-callout: unset !important;
   -webkit-user-select: unset !important;
   -khtml-user-select: unset !important;
   -moz-user-select: unset !important;
   -ms-user-select: unset !important;
   user-select: unset !important;
}
`
document.body.appendChild(s);