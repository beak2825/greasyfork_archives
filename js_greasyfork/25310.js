// ==UserScript==
// @name         Grepolis AutoFarm
// @namespace    http://cl.1ck.me
// @version      0.1
// @description  try to take over the world!
// @author       TheTh0rus
// @match        https://*.grepolis.com/game/*
// @match        https://*.grepolis.com/start*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25310/Grepolis%20AutoFarm.user.js
// @updateURL https://update.greasyfork.org/scripts/25310/Grepolis%20AutoFarm.meta.js
// ==/UserScript==

/*
var inter = setInterval(function() { getFarms(); }, 1000);
var farms;
var farm;
var farmids = [];
    
    function farming() {
    
for(var i = 0; i< farmids.length; i++) {
    
    for(var a = 0; a < farmids.length; a++) {
        
        w(document.getElementsByClassName("bold farm_claim")[a]).call('claimLoad', farmids[i], 'normal', 300, 64, false, 1462212726);
        
    }
    a = 0;
        
}
    
}

function getFarms() {
farms = document.getElementsByClassName("tile farmtown_owned");

if(farms[0] == null) {
    console.log("mep");
} else {

for(var i = 0; i < farms.length; i++) {
    console.log(farms[i].id);
    farmids.push(farms[i].id.replace("farm_town_",""));
}
clearInterval(inter);
    
    farm = setInterval(function(){ farming(); }, 3000);
    
}
}
*/


/*Gebäude: 

Senat: main
Höhle: hide
Holzfäller: lumber
Steinbruch: stoner
Silbermine: ironer
Markt: market
Hafen: docks
Kaserne: barracks
Mauer: wall
Lager: storage
Bauernhof: farm
Akademie: academy
Tempel: temple

Special (vorher Baumenü für Spezialgebäude öffnen):

Theater: theater
Therme: thermal
Bibliothek: library
Leuchtturm: lighthouse

Handelsdepot: ?
Turm: tower   (?)
Statue: statue
Orakel: oracle   (?)

*/

var building = "main";


setTimeout(function() { document.getElementsByClassName("construction_queue_sprite queue_button-idle queue_button btn_construction_mode js-tutorial-btn-construction-mode")[0].click(); }, 5000);

var inter = setInterval(function() { farm(); }, 5000);
clearInterval(inter);
inter = setInterval(function() { farm(); }, 5000);
var inter2 = setInterval(function() { upgrade(building); }, 10000);
Layout.wnd.Create(Layout.wnd.TYPE_FARM_TOWN_OVERVIEWS,"Farming Town Overview");void(0);


function farm() {
    try {
    var button = document.getElementById("fto_claim_button");
    var widget = document.getElementsByClassName("gpwindow_frame ui-dialog-content ui-widget-content")[0];
    widget.setAttribute("style", "display: block; width: 200px; min-height: 0px; height: 100px; top: 1100px; left: 0px;");
    button.click();
    } catch(e) {
        
        alert("hi");
        
        document.getElementsByClassName("world_name")[0].getElementsByTagName("DIV")[0].click();
        
    }
    clearInterval(inter);
    inter = setInterval(function() { farm(); }, 305000);
}

function upgrade(build) {
    
    var button = document.getElementsByClassName("city_overview_overlay "+build)[0].getElementsByClassName("btn_build build_button")[0];
    button.click();
    
}

