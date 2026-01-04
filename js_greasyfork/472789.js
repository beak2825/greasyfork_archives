// ==UserScript==
// @name         ISLAND WAR TERRITORIES
// @namespace    mafia.ttcolor
// @version      1.1.0
// @description  Recolor territories for Island War
// @author       Mafia [610357]
// @match        https://www.torn.com/city.php
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @license      BSD
// @connect      sheets.googleapis.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/472789/ISLAND%20WAR%20TERRITORIES.user.js
// @updateURL https://update.greasyfork.org/scripts/472789/ISLAND%20WAR%20TERRITORIES.meta.js
// ==/UserScript==

GM_addStyle(`
    #ttcolor {
        position: relative;
        padding: 10px;
        z-index: 9999;
        width: 198px;
        background-color: #272727;
        border-radius: 8px;
        cursor: pointer;
        display: none;
    }
    
    #ttcolor ul > li {
        padding: 1px;
        font-weight: 600;
        font-size: larger;
    }

    .d g.territories.own-faction .shape.fake {
        stroke: #ffffff;
        stroke-width: 2;
        animation: pulse 2s infinite;
    }

    .d g.territories.own-faction .shape.real {
        stroke-width: 2;
        animation: pulse 1s infinite;
    }
`);

(async function(){
    GM_xmlhttpRequest ( {
        method:     "GET",
        url:        'https://sheets.googleapis.com/v4/spreadsheets/1icz73m76ygje_rxBJPYYAfYAFcLOASiNPEROD5ucm4M/values/Alliances?key=AIzaSyD5GRn44v2ALnsCIrmEJW6TewMwQTAKgmo',
        headers:    {
            "Content-Type": "application/json"
        },
        onload: response =>{
            result = JSON.parse(response.responseText)

            rows = result.values
            cols = rows[0]
            obj = Object.fromEntries( cols.map(f => [f,[]]))
            for (let index = 1; index < rows.length; index++) {
                for(i = 0;i < cols.length; i++) {
                    value = Number(rows[index][i])
                    if(value) {
                        obj[cols[i]].push(value)
                    }
                }
            }

            const { CRYPTO, JFK, ROD, OBN, WEST_WORLD } = obj

            setTimeout(() => {
                const ALLIES = CRYPTO.concat(ROD,JFK)
                const ENEMIES = OBN.concat(WEST_WORLD)
                const ALL = ALLIES.concat(ENEMIES)
                mapData = torn.model.get()
                
                $(".terr.size").attr('title','ISLAND WAR').click(function() {
                    torn.view.map.updateColourMode('racket');
                    apply(1)
                })
                $(".terr.size").on("contextmenu", function(e) {
                    e.preventDefault();
                    torn.view.map.updateColourMode('racket');
                    apply(2)
                })


                function apply(mode) {   
                    switch (mode) {
                        case 1:
                            _CRYPTO = "#0000FF";
                            _ROD = "#8a2be2";
                            _JFK = "#00ff00";
                            _OBN = "#ff0020";
                            _WEST_WORLD = "#8b0000";
                            break;
                        case 2:
                            _CRYPTO = "#00ff00";
                            _ROD = "#00ff00";
                            _JFK = "#00ff00";
                            _OBN = "#ff0000";
                            _WEST_WORLD = "#ff0000";
                            break;
                    }
                    _UNASSIGNED = "#ffd700";


                    mapData.collection.forEach( (f,i) => {
                        if(CRYPTO.includes(Number(f.factionID))) {
                            f.setColour(_CRYPTO)
                        }
                        else if(ROD.includes(Number(f.factionID))) {
                            f.setColour(_ROD)
                        }
                        else if(JFK.includes(Number(f.factionID))) {
                            f.setColour(_JFK)
                        }
                        else if(OBN.includes(Number(f.factionID))) {
                            f.setColour(_OBN)
                        }
                        else if(WEST_WORLD.includes(Number(f.factionID))) {
                            f.setColour(_WEST_WORLD)
                        }
                        else if(f.factionID) {
                            f.setColour(_UNASSIGNED)
                        }
                        else {                
                            f.setColour("#ffffff")
                        }

                        if(f.hasOwnProperty('war')) {
                            const { attackFaction, defendFaction } = f.war
                            if((ALLIES.includes(Number(attackFaction)) && ALLIES.includes(Number(defendFaction))) || (ENEMIES.includes(Number(attackFaction)) && ENEMIES.includes(Number(defendFaction))) || (!ALL.includes(Number(attackFaction)) && !ALL.includes(Number(defendFaction)))) {
                                f.addClass('fake')
                            }
                            else {
                                f.addClass('real')
                            }
                        }

                    })

                    // TORN BUILDING
                    Object.keys(mapData.factionTerritories).forEach( (f,i) => {
                        mapData.standardShapeCollectionById[f].setColour("#000000").attr('fill-opacity', 0.7)
                    })

                    $("#ttcolor").hide().html(`
                    <sub>* color is reset while zooming (in/out)</sub>
                    <ul>
                        <li style='color: ${_CRYPTO};'>CRyPTo</li>
                        <li style='color: ${_JFK};'>JFK</li>
                        <li style='color: ${_ROD};'>ROD</li>
                        <li style='color: ${_OBN};'>OBN</li>
                        <li style='color: ${_WEST_WORLD};'>West World</li>
                        <li style='color: ${_UNASSIGNED};'>neutral / unassigned</li>
                    </ul>
                    <i>click here to close</i>`).fadeIn().click( function(){$(this).fadeOut()})
                }

                $("#map").append("<div id='ttcolor'></div>")
            }, 3000);
            
        }
    })
    

})()