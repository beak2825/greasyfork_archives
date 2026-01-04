// ==UserScript==
// @name         Logbook trade search enhancer
// @namespace    https://violentmonkey.github.io/
// @version      2023-12-15
// @description  Highlight custom faction/area/mods on Logbooks
// @author       afkoncore
// @match        https://www.pathofexile.com/trade/search/*
// @icon         https://www.poewiki.net/images/e/ef/Expedition_Logbook_inventory_icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482396/Logbook%20trade%20search%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/482396/Logbook%20trade%20search%20enhancer.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //Warning: The regex matches are Case Sensitive. Artifacts dropped is OK, artifacts Dropped is NOT.
//Logbook Faction
    window.FACTION_MATCH = 'Black Scythe'
//Logbook Area
	window.AREA_MATCH = 'Black Scythe|Forest Ruins|Forest Ruins|Shipwreck Reef|Vaal Temple|Karui Wargraves|Utzaal Outskirts|Volcanic Islands|Cemetery'
//Mod
	window.MOD_MATCH ='Runic Monster|Artifacts dropped'
//Hide shit result (no area with the right Faction)
    window.HIDE_AREA_AND_FACTION_NO_MATCH = true;
//window.MOD_MATCH ='Runic Monster|Artifacts Dropped'
    window.TEXT_COLOR_FACTION_AND_AREA_MATCH ='#66ff66'
    window.TEXT_COLOR_FACTION_AND_AREA_MATCH_WITH_MODS ='#ffff00'
    window.TEXT_COLOR_MODS_WITH_FACTION_AND_AREA_MATCH ='#00ffff'
//____________________________________________________
//Todo: add checkbox options GUI, check if 'fake' livesearch notif can be prevented



window.DEBUG = false;
window.countHiddenItems = 0;
window.clickedSearchButton = false;

window.onload = function() {
		console.log("~ Logbook trade search enhancer ~");

const HiddenItemsCounter = document.createElement('div');
HiddenItemsCounter.setAttribute("style","position: sticky;");
HiddenItemsCounter.setAttribute("style",""+
    "position: sticky;"+
    "float: right;"+
    "top: 0;"+
    "background:black;"+
    "color:#cccc00;"+
    "z-index:9999;"+
"");


const callbackResultsetObserver = (mutationList, observer) => {
    countHiddenItems = 0;
    searchAndHighight()
    if(countHiddenItems){
        HiddenItemsCounter.innerHTML = countHiddenItems+' results hidden! <span style="font-size:.8em;">(no faction & area match)</span>'
    }
    console.log("Logbook trade search enhancer: New listings loaded");
};const resultsetObserver = new MutationObserver(callbackResultsetObserver);

const callbackTradeObserver = (mutationList, observer) => {
    var targetNode = document.querySelector('.resultset')
    if(targetNode && targetNode.nodeType == 1 ){
        resultsetObserver.observe(targetNode, {childList: true});

        var targetNode = document.querySelector('.results.nosort') //livesearch
        if(targetNode && targetNode.nodeType == 1 ){
            resultsetObserver.observe(targetNode, {childList: true, subtree: true});
        }


        if(clickedSearchButton){
           searchAndHighight()
        }else{
            document.querySelector('button.btn.search-btn').addEventListener("click", callbackSearchClickObserver);
            document.querySelector('button.btn.livesearch-btn').addEventListener("click", callbackSearchClickObserver);
        }


        tradeObserver.disconnect();
        if(DEBUG){console.log("Found .resultset")}
    }
};const tradeObserver = new MutationObserver(callbackTradeObserver);

const callbackAppObserver = (mutationList, observer) => {
    var targetNode = document.getElementById("trade");
    if(targetNode && targetNode.nodeType == 1 ){
        tradeObserver.observe(targetNode, {childList: true, subtree: true});
        appObserver.disconnect();
        if(DEBUG){console.log("Found #trade")}
        document.querySelector('.wrapper').prepend(HiddenItemsCounter);
    }
};const appObserver = new MutationObserver(callbackAppObserver);

const callbackSearchClickObserver = (mutationList, observer) => {
    clickedSearchButton = true;
    if(DEBUG){console.log("Clicked Search")}
    resultsetObserver.disconnect();
    appObserver.observe(document.getElementById("app"), {childList: true, subtree: true});
};const searchClickObserver = new MutationObserver(callbackSearchClickObserver);

appObserver.observe(document.getElementById("app"), {childList: true, subtree: true});





}
})();

function searchAndHighight(){
	for (const faction of document.querySelector('.results').querySelectorAll(".logbookMod>span.lc.faction")) {
        if (faction.textContent.match(FACTION_MATCH)){
            var area = faction.parentElement.querySelector('span.lc.area');
            var logbookContent = area.parentElement.parentElement; //.content
            if(area.textContent.match(AREA_MATCH)){

                var implicitModMatches = getImplicitMod(area);
                if(implicitModMatches){
                    //area.parentElement.setAttribute("style", "background:#53c653");
                    var color = 'color:'+TEXT_COLOR_FACTION_AND_AREA_MATCH_WITH_MODS+';'
                    faction.setAttribute("style", color);
                    area.setAttribute("style", color);

                    for(const i in implicitModMatches){
                        var match = 'span[data-field="'+implicitModMatches[i]+'"]';
                        if(DEBUG){console.log('match: '+match);}
                        var implicitMod = logbookContent.querySelector(match);
                        var color = 'color:'+TEXT_COLOR_MODS_WITH_FACTION_AND_AREA_MATCH+';'
                        implicitMod.setAttribute("style", color);
                    }
                }else{
                    var color = 'color:'+TEXT_COLOR_FACTION_AND_AREA_MATCH+';'
                    faction.setAttribute("style", color);
                    area.setAttribute("style", color);
                }
            }else{
                if(HIDE_AREA_AND_FACTION_NO_MATCH){
                    var row = logbookContent.parentElement.parentElement.parentElement.parentElement;
                    row.setAttribute("style", "display:none;");
                    if(!window.countHiddenItems){window.countHiddenItems = 0;}
                    window.countHiddenItems +=1;
                    if(DEBUG){console.log('countHiddenItems: '+countHiddenItems);}
                }

            }

        }
    }
}

function getImplicitMod(spanAreaOrFaction){
    logbookContent = spanAreaOrFaction.parentElement.parentElement; //.content
    var split = logbookContent.innerHTML.split('<div class="separator"></div>')
    for(const s of split){
        if(s.match(MOD_MATCH)&&s.match(AREA_MATCH)&&s.match(FACTION_MATCH)){
            if(DEBUG){console.log('MOD_MATCH: '+s);}
            var modMatches_datafield = [];
            for(const mod of s.split('class="implicitMod"')){
                if(mod.match(MOD_MATCH)){
                    //data-field="stat.implicit.stat_1640965354"
                     for(const datafield of mod.split('"')){
                        if(datafield.match('stat.implicit.stat_')){
                            modMatches_datafield.push(datafield);
                        }
                     }
                }
            }
            return modMatches_datafield;
        }
    }
    return false;
    /*It feels a bit dumb to check twice with querySelector and a raw HTML parser
     but I already selected the right DOM element and I spent too long on this already to
     try and find out if parsing the whole HTML page to then select the matching DOM element
     would work.*/
    //TODO: Redo the logic and selection using mutation observer.
}
