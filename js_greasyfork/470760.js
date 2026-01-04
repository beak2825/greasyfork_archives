// ==UserScript==
// @name         Alliance Labels
// @namespace    heasley.alliance.labels
// @version      1.2.7
// @description  Label faction names with their alliance tag. Change faction territory colors
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/city.php*
// @match        https://www.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/470760/Alliance%20Labels.user.js
// @updateURL https://update.greasyfork.org/scripts/470760/Alliance%20Labels.meta.js
// ==/UserScript==
var tertColors = localStorage.getItem('obn_tertColors') || "true";
var fullbright = localStorage.getItem('obn_fullbright') || "true";
var hideMarkers = localStorage.getItem('obn_hideMarkers') || "true";
var hideDefaultTerts = localStorage.getItem('obn_hideDefaultTerts') || "true";


const OBN = [19,231,1149,6895,7049,8062,8520,8706,8803,9055,9100,9110,9118,9412,9533,10140,10296,10610,10820,11062,11581,11747,12645,12863,12894,13180,13502,13784,14052,14581,16040,16312,18714,21526,22492,22680,22887,23188,25001,25025,26885,27458,29865,30009,32395,33007,35507,36457,36691,37537,40449,40992,41702,42125,42650,44758,48097,48965];
const WEST_WORLD = [366,2095,6731,6984,7709,7835,7969,8085,8205,8255,8322,8336,8384,8422,8468,8509,8677,8795,8802,8867,8954,9032,9171,9176,9201,9356,9370,9420,9674,9745,10741,10818,10960,11131,11522,11796,12094,12249,12255,12893,13851,14078,14438,14760,15120,15446,15655,15929,16057,16079,16120,16282,16335,16424,17055,17133,17845,18736,20211,20303,20465,20501,20514,20659,21028,21040,21665,22631,22781,25874,26437,27223,27370,27902,29107,30085,30820,33097,33241,35090,35423,35776,36134,36693,36891,37426,37530,37786,38481,39549,39580,39756,40334,40399,40518,40775,40918,41028,41234,41363,41929,42435,42671,42685,43785,44445,45046,47838,48640,48912,48927,49147,49776,50169];
const OBN_MINI = [40449,10507,42263];
const NAMELESS = [7227,7935,17991,18597,39788,10542,8500,13789,8766,13726,40774,35739,24106,48184,47042];
const CRYBABIES = [89,95,230,478,937,946,1117,2013,2736,5431,6974,7197,8124,8151,8285,8317,8400,8537,8715,8836,8938,9036,9041,9305,9357,9503,9517,9689,10174,10566,10856,11539,12912,13343,13383,13665,13842,15151,16053,16247,16503,16628,18090,18569,19982,20554,21368,21716,22295,23952,26043,26154,27312,27554,31397,33458,35840,36274,37185,37498,37595,38761,38887,40200,40420,40624,41419,41775,41853,42681,43325,44865,46708,48140,48277,48628,49164];
const JFK = [3241,6924,7282,7652,7986,8076,9405,9953,11428,14365,14821,21234,24622,26312,38668,45797,49184];
const ROD = [6780,6834,7818,7990,8152,8811,9047,9280,11376,11782,12905,13307,13377,13872,14686,15154,15222,15286,15644,16296,16299,16634,17587,23193,23492,28073,28205,28349,32781,33783,36007,36140,37093,39531,39960,40624,40905,40951,40959,41164,41234,41297,41593,42505,43836,44467,44562,45595,46089,46127,46442,47100,48002,48112,48526,48680,48832,48989,49167,49169,49346,49763];

const OTHERcolor = "#333333";

const OBNcolor = "#34912D"; //green
const WEST_WORLDcolor = "#E48C1B"; //orange
const OBN_MINIcolor = "#8FDB8A"; //light green
const NAMELESScolor = "#808080"; //gray
const CRYBABIEScolor = "#0492c2"; //lightblue
const JFKcolor = "#f699cd"; //pink
const RODcolor = "#594684"; //purple



const OTHERcolorID = "14";
const OBNcolorID = "15";
const WEST_WORLDcolorID = "16";
const OBN_MINIcolorID = "20";
const NAMELESScolorID = "21";
const CRYBABIEScolorID = "17";
const JFKcolorID = "18";
const RODcolorID = "19";

GM_addStyle(`
.obn-ali-tag {
    color: #00a9f8;
    font-weight: 700;
    vertical-align: middle;
    max-width: 145px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 3px;
    margin-left: 0px;
}
`);

GM_addStyle(`
.d.obn-fullbright .shape {
    fill-opacity: 1 !important;
    }
`);

//[width="782"]
GM_addStyle(`
.d.obn-fullbright .leaflet-zoom-hide .shape:not(.war):not(.selected) {
    stroke-width: 0.5 !important
    }
`);

GM_addStyle(`
.d.obn-fullbright .leaflet-zoom-hide[width="1564"] .shape:not(.war):not(.selected) {
    stroke-width: 0.7 !important
    }
`);

GM_addStyle(`
.d.obn-fullbright .leaflet-zoom-hide[width="3128"] .shape:not(.war):not(.selected) {
    stroke-width: 1.1 !important
    }
`);

GM_addStyle(`
.d.obn-fullbright .leaflet-zoom-hide[width="6256"] .shape:not(.war):not(.selected) {
    stroke-width: 1.7 !important
    }
`);

GM_addStyle(`
.d.obn-fullbright .shape.territory[fill="#999999"] {
    fill: #5c5c5c !important;
}
`);

GM_addStyle(`
#map-cont.hideMarkers .leaflet-marker-pane > img {
    display: none !important;
}
`);

GM_addStyle(`
#map-cont.hideMarkers .leaflet-shadow-pane > img {
    display: none !important;
}
`);

var standardTerts = [];

defer(function () {
    jQuery.ajaxSetup({
        dataFilter: function (data, type) {
            try {
                let json = JSON.parse(data);
                if (!json?.factionOwnTerritories) {
                    return data;
                }


                if (json?.standardMapObjects) {
                    var standardTertCSS = "";
                    var strokeTertCSS = "";

                    for (const [id, v] of Object.entries(json.standardMapObjects)) {
                        standardTerts.push(v.map_territory_id);
                    }

                    standardTerts.forEach(function(dbID) {
                        standardTertCSS += `.d #map-cont.obn-hideDefaultTerts g.territories > path.shape[db_id="${dbID}"],`
                        strokeTertCSS += `.d #map-cont.obn-hideDefaultTerts g.territories > path.shape[db_id="${dbID}"]:not(.selected),`
                });

                    standardTertCSS = standardTertCSS.replace(/,+$/, ""); //remove last comma
                    strokeTertCSS = strokeTertCSS.replace(/,+$/, ""); //remove last comma

                    standardTertCSS += `{
                       fill: #000 !important;
                       fill-opacity: 0 !important;
                    }`;

                    strokeTertCSS += `{
                       stroke-width: 0 !important;
                    }`;

                    GM_addStyle(standardTertCSS);
                    GM_addStyle(strokeTertCSS);
                }



                if (tertColors != "true") {
                    return data;
                }

                json.factionOwnTerritories.colours[parseInt(OTHERcolorID - 1)] = {
                    "ID": OTHERcolorID,
                    "colour": OTHERcolor
                }

                json.factionOwnTerritories.colours[parseInt(OBNcolorID - 1)] = {
                    "ID": OBNcolorID,
                    "colour": OBNcolor
                }
                json.factionOwnTerritories.colours[parseInt(WEST_WORLDcolorID - 1)] = {
                    "ID": WEST_WORLDcolorID,
                    "colour": WEST_WORLDcolor
                }
                json.factionOwnTerritories.colours[parseInt(OBN_MINIcolorID - 1)] = {
                    "ID": OBN_MINIcolorID,
                    "colour": OBN_MINIcolor
                }
                json.factionOwnTerritories.colours[parseInt(NAMELESScolorID - 1)] = {
                    "ID": NAMELESScolorID,
                    "colour": NAMELESScolor
                }
                json.factionOwnTerritories.colours[parseInt(CRYBABIEScolorID - 1)] = {
                    "ID": CRYBABIEScolorID,
                    "colour": CRYBABIEScolor
                }
                json.factionOwnTerritories.colours[parseInt(JFKcolorID - 1)] = {
                    "ID": JFKcolorID,
                    "colour": JFKcolor
                }
                json.factionOwnTerritories.colours[parseInt(RODcolorID - 1)] = {
                    "ID": RODcolorID,
                    "colour": RODcolor
                }


                for (const [factionID, v] of Object.entries(json.factionOwnTerritories.factionData)) {
                    if (json?.factionOwnTerritories?.factionInWarData[factionID]) {
                        json.factionOwnTerritories.factionInWarData[factionID].colour = OTHERcolor;
                        json.factionOwnTerritories.factionInWarData[factionID].colourID = OTHERcolorID;
                    }
                    if (json?.factionOwnTerritories?.factionData[factionID]) {
                        json.factionOwnTerritories.factionData[factionID].colour = OTHERcolor;
                        json.factionOwnTerritories.factionData[factionID].colourID = OTHERcolorID;
                    }



                    if (OBN.includes(parseInt(factionID))) {
                        if (json?.factionOwnTerritories?.factionInWarData[factionID]) {
                            json.factionOwnTerritories.factionInWarData[factionID].colour = OBNcolor;
                            json.factionOwnTerritories.factionInWarData[factionID].colourID = OBNcolorID;
                        }
                        if (json?.factionOwnTerritories?.factionData[factionID]) {
                            json.factionOwnTerritories.factionData[factionID].colour = OBNcolor;
                            json.factionOwnTerritories.factionData[factionID].colourID = OBNcolorID;
                        }
                    }

                    if (WEST_WORLD.includes(parseInt(factionID))) {
                        if (json?.factionOwnTerritories?.factionInWarData[factionID]) {
                            json.factionOwnTerritories.factionInWarData[factionID].colour = WEST_WORLDcolor;
                            json.factionOwnTerritories.factionInWarData[factionID].colourID = WEST_WORLDcolorID;
                        }
                        if (json?.factionOwnTerritories?.factionData[factionID]) {
                            json.factionOwnTerritories.factionData[factionID].colour = WEST_WORLDcolor;
                            json.factionOwnTerritories.factionData[factionID].colourID = WEST_WORLDcolorID;
                        }
                    }

                    if (OBN_MINI.includes(parseInt(factionID))) {
                        if (json?.factionOwnTerritories?.factionInWarData[factionID]) {
                            json.factionOwnTerritories.factionInWarData[factionID].colour = OBN_MINIcolor;
                            json.factionOwnTerritories.factionInWarData[factionID].colourID = OBN_MINIcolorID;
                        }
                        if (json?.factionOwnTerritories?.factionData[factionID]) {
                            json.factionOwnTerritories.factionData[factionID].colour = OBN_MINIcolor;
                            json.factionOwnTerritories.factionData[factionID].colourID = OBN_MINIcolorID;
                        }
                    }

                    if (NAMELESS.includes(parseInt(factionID))) {
                        if (json?.factionOwnTerritories?.factionInWarData[factionID]) {
                            json.factionOwnTerritories.factionInWarData[factionID].colour = NAMELESScolor;
                            json.factionOwnTerritories.factionInWarData[factionID].colourID = NAMELESScolorID;
                        }
                        if (json?.factionOwnTerritories?.factionData[factionID]) {
                            json.factionOwnTerritories.factionData[factionID].colour = NAMELESScolor;
                            json.factionOwnTerritories.factionData[factionID].colourID = NAMELESScolorID;
                        }
                    }

                    if (CRYBABIES.includes(parseInt(factionID))) {
                        if (json?.factionOwnTerritories?.factionInWarData[factionID]) {
                            json.factionOwnTerritories.factionInWarData[factionID].colour = CRYBABIEScolor;
                            json.factionOwnTerritories.factionInWarData[factionID].colourID = CRYBABIEScolorID;
                        }
                        if (json?.factionOwnTerritories?.factionData[factionID]) {
                            json.factionOwnTerritories.factionData[factionID].colour = CRYBABIEScolor;
                            json.factionOwnTerritories.factionData[factionID].colourID = CRYBABIEScolorID;
                        }
                    }

                    if (JFK.includes(parseInt(factionID))) {
                        if (json?.factionOwnTerritories?.factionInWarData[factionID]) {
                            json.factionOwnTerritories.factionInWarData[factionID].colour = JFKcolor;
                            json.factionOwnTerritories.factionInWarData[factionID].colourID = JFKcolorID;
                        }
                        if (json?.factionOwnTerritories?.factionData[factionID]) {
                            json.factionOwnTerritories.factionData[factionID].colour = JFKcolor;
                            json.factionOwnTerritories.factionData[factionID].colourID = JFKcolorID;
                        }
                    }

                    if (ROD.includes(parseInt(factionID))) {
                        if (json?.factionOwnTerritories?.factionInWarData[factionID]) {
                            json.factionOwnTerritories.factionInWarData[factionID].colour = RODcolor;
                            json.factionOwnTerritories.factionInWarData[factionID].colourID = RODcolorID;
                        }
                        if (json?.factionOwnTerritories?.factionData[factionID]) {
                            json.factionOwnTerritories.factionData[factionID].colour = RODcolor;
                            json.factionOwnTerritories.factionData[factionID].colourID = RODcolorID;
                        }
                    }
                }

                data = JSON.stringify(json);
                return data;
            }
            catch (e) {
                //console.log(e);
                return data;
            }
        }
    });

});




(function() {
    'use strict';
    const url = window.location.href;
    if (url.includes("city.php")) {
        cityPage();
    }

    if (url.includes("factions.php")) {
        factionPage();
    }
})();

function factionPage() {
    const documentObserver = new MutationObserver(function(mutations) {
        if (document.contains(document.querySelector('div.faction-info-wrap.faction-profile > div.title-black'))) {
            const fNameElement = $('div.faction-info-wrap.faction-profile > div.title-black');
            const fNameText = fNameElement.clone()    //clone the element
            .children() //select all the children
            .remove()   //remove all the children
            .end()  //again go back to selected element
            .text();

            if (!fNameText) return;
            documentObserver.disconnect();
            const factionID = getFactionIDFromFactionPage();
            if (!factionID) return;
            const tag = getAllianceTag(factionID);
            if (!tag) return;
            fNameElement.prepend(`<span>[${tag}] </span>`);
            //fNameElement.contents().filter(function(){ return this.nodeType == 3; }).first().replaceWith(`[${tag}] ${fNameText}`);
        }
    });

    documentObserver.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
}


function cityPage() {
    const documentObserver = new MutationObserver(function(mutations) {
        if (document.contains(document.querySelector('div.leaflet-popup-pane'))) {
            documentObserver.disconnect();

            const target = document.querySelector('div.leaflet-popup-pane');
            tertObserver.observe(target, {attributes: false, childList: true, characterData: false, subtree:true});
            insertCityToggles();
        }
    });

    const tertObserver = new MutationObserver(function(mutations) {
        if ($('.obn-tert-box').length != 0) {
            return; //already modified
        }
        if (document.contains(document.querySelector('div.territory-dialogue-wrap'))) {
            const tertBox = $('div.territory-dialogue-wrap');
            tertBox.each(function() {
                if ($(this).find('.info-and-action-wrap').length == 0 || $(this).find('div.title.assaulter > a:contains("Loading...")').length > 0) {
                    $(this).addClass("obn-tert-nouse");
                }
            });

            if ($('div.territory-dialogue-wrap:not(.obn-tert-nouse) > .title > a.faction:not(:contains("Loading..."))').length) {
                $('div.territory-dialogue-wrap:not(.obn-tert-nouse) > .title > a.faction:not(:contains("Loading..."))').each(function( index ) {

                    const href = $(this).attr('href');
                    const nameElement = $(this).parent().find("a.text-blue");
                    const fname = nameElement.text().trim();
                    if (fname) nameElement.attr('title', fname);
                    if (href) {
                        var match = href.match(/ID=(\d+)/);
                        if (!match || !match[1]) return;
                        const factionID = parseInt(match[1]);
                        tertBox.addClass('obn-tert-box');
                        const tag = getAllianceTag(factionID);
                        if (!tag) return;
                        $(this).after(`<span class="obn-ali-tag">[${tag}]</span>`);
                    }
                });
            }
        }
    });

    documentObserver.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
}

function insertCityToggles() {
    $('.territory-info-toggle').after(`
        <div class="territory-info-toggle white-grad border-round m-top10 p10 t-gray-6">
            <div class="info">
                <span>
                    Toggle alliance territory colors (refresh required)
                </span>
            </div>
            <div class="btn-toggle-wrap torn-switcher">
                <input type="checkbox" id="obn-tcolors" class="active" switch>
                <label for="obn-tcolors" data-on-label="on" data-off-label="off"></label>
            </div>
        </div>

        <div class="territory-info-toggle white-grad border-round m-top10 p10 t-gray-6">
            <div class="info">
                <span>
                    Toggle full bright territories
                </span>
            </div>
            <div class="btn-toggle-wrap torn-switcher">
                <input type="checkbox" id="obn-tbright" class="active" switch>
                <label for="obn-tbright" data-on-label="on" data-off-label="off"></label>
            </div>
        </div>

        <div class="territory-info-toggle white-grad border-round m-top10 p10 t-gray-6">
            <div class="info">
                <span>
                    Remove default buildings color
                </span>
            </div>
            <div class="btn-toggle-wrap torn-switcher">
                <input type="checkbox" id="obn-hideDefaultTerts" class="active" switch>
                <label for="obn-hideDefaultTerts" data-on-label="on" data-off-label="off"></label>
            </div>
        </div>

        <div class="territory-info-toggle white-grad border-round m-top10 p10 t-gray-6">
            <div class="info">
                <span>
                    Hide markers and icons
                </span>
            </div>
            <div class="btn-toggle-wrap torn-switcher">
                <input type="checkbox" id="obn-markers" class="active" switch>
                <label for="obn-markers" data-on-label="on" data-off-label="off"></label>
            </div>
        </div>
    `);

    $('#obn-tcolors').click(function() {
        let checked = $(this).prop("checked");
        tertColors = checked;
        localStorage.setItem('obn_tertColors', tertColors);
    });

    $('#obn-markers').click(function() {
        let checked = $(this).prop("checked");
        hideMarkers = checked;
        localStorage.setItem('obn_hideMarkers', hideMarkers);

        if (checked) {
            $('#map-cont').addClass('hideMarkers');
            $('#map-cont').addClass('hideMarkers');
        } else {
            $('#map-cont').removeClass('hideMarkers');
            $('#map-cont').removeClass('hideMarkers');
        }
    });

    $('#obn-tbright').click(function() {
        let checked = $(this).prop("checked");
        fullbright = checked;
        localStorage.setItem('obn_fullbright', fullbright);

        if (checked) {
            $('.d').addClass('obn-fullbright');
        } else {
            $('.d').removeClass('obn-fullbright');
        }
    });

    $('#obn-hideDefaultTerts').click(function() {
        let checked = $(this).prop("checked");
        hideDefaultTerts = checked;
        localStorage.setItem('obn_hideDefaultTerts', hideDefaultTerts);

        if (checked) {
            $('#map-cont').addClass('obn-hideDefaultTerts');
        } else {
            $('#map-cont').removeClass('obn-hideDefaultTerts');
        }
    });

    $("#obn-tcolors").prop( "checked", (tertColors === "true") );

    if (hideMarkers === "true") {
        $("#obn-markers").prop( "checked", (hideMarkers === "true") );
        $('#map-cont').addClass('hideMarkers');
        $('#map-cont').addClass('hideMarkers');
    } else {
        $('#map-cont').removeClass('hideMarkers');
        $('#map-cont').removeClass('hideMarkers');
    }

    if (fullbright === "true") {
        $("#obn-tbright").prop( "checked", (fullbright === "true") );
        $('.d').addClass('obn-fullbright');
    } else {
        $('.d').removeClass('obn-fullbright');
    }

    if (hideDefaultTerts === "true") {
        $("#obn-hideDefaultTerts").prop( "checked", (hideDefaultTerts === "true") );
        $('#map-cont').addClass('obn-hideDefaultTerts');
    } else {
        $('#map-cont').removeClass('obn-hideDefaultTerts');
    }
}

function getAllianceTag(factionID) {
    if (OBN.includes(factionID)) return "OBN";
    if (WEST_WORLD.includes(factionID)) return "WW";
    if (OBN_MINI.includes(factionID)) return "ᴼᴮᴺ";
    if (NAMELESS.includes(factionID)) return "NA";
    if (CRYBABIES.includes(factionID)) return "CRPT";
    if (ROD.includes(factionID)) return "RoD";
    if (JFK.includes(factionID)) return "JFK";
    return null;
}


function getFactionIDFromFactionPage() {
    let factionID;

    //try to get factionID from url (not always available)
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    factionID = urlParams.get('ID');
    if (factionID && !isNaN(factionID)) return parseInt(factionID);


    // Check for factionID in $('#top-page-links-list .view-wars').attr('href')
    var href = $('#top-page-links-list .view-wars').attr('href');
    var match = href.match(/\/ranked\/(\d+)/);
    if (match) {
        factionID = match[1];
        return parseInt(factionID);
    }

    // Check for factionID in $('.faction-info .f-info a[href*="city.php#factionID="]')
    var link = $('.faction-info .f-info a[href*="city.php#factionID="]');
    if (link.length) {
        var hrefParts = link.attr('href').split('=');
        if (hrefParts.length === 2) {
            factionID = hrefParts[1];
            return parseInt(factionID);
        }
    }

    //could not find factionID
    return null;
}


function GM_addStyle(css) {
    const style = document.getElementById("GM_addStyleBy8626") || (function() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "GM_addStyleBy8626";
        document.head.appendChild(style);
        return style;
    })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}

function defer(method) {
    if (window.jQuery) {
        method();
    } else {
        setTimeout(function() { defer(method) }, 50);
    }
}