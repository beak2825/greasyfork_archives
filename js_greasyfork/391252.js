// ==UserScript==
// @name         Auto-build economy
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Builds economy buildings with all available resources
// @author       hasashin
// @include      https://*/game.php*screen=main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391252/Auto-build%20economy.user.js
// @updateURL https://update.greasyfork.org/scripts/391252/Auto-build%20economy.meta.js
// ==/UserScript==
function getLevel(type){
    var text = document.getElementById("main_buildrow_"+type).cells[0].innerText;
    var buildqueueLevels = document.querySelectorAll("#buildqueue .buildorder_wood");
    for(var elem of buildqueueLevels){
        text = elem.cells[0].innerText;
    }
    return parseInt(text.substr(text.search("[0-9]")));
}

function findMinimumLevel(arg){
    var lvl_obj = arg.lvl_obj;
    var except = arg.except;
    var minimumDesc="";
    var minimum=100;
    for (var key in lvl_obj){
        if(except.includes(key)){
            continue;
        }
        if(parseInt(lvl_obj[key]) < minimum){
            minimum = parseInt(lvl_obj[key]);
            minimumDesc = key;
        }
    }
    return minimumDesc;
}

function checkIfAvailable(type){
    var buildingRow = document.getElementById("main_buildrow_"+type);
    if(buildingRow.cells[6].querySelector(".btn-build").style.display !== "none"){
        return true;
    }
    return false;
}

function tryBuild(type){
    if(type === ""){
        return false;
    }
    if(checkIfAvailable(type)){
        document.querySelector("#main_buildrow_"+type+" .build_options .btn-build").click();
        return true;
    }
    return false;
}

function fastenBuild(){
    for(var elem of document.querySelectorAll("#buildqueue .btn-instant-free")){
        if(elem.style.display === "none"){
            continue;
        }
        else{
            elem.click();
        }
    }
}

/* Run every 60 seconds */
setInterval(function() {
    var levels = {
        "stone": getLevel("stone"),
        "iron": getLevel("iron"),
        "wood": getLevel("wood")
    };
    var minimumDesc = findMinimumLevel({lvl_obj: levels, except: []});
    if(!tryBuild(minimumDesc)){
        var minimumNewDesc = findMinimumLevel({lvl_obj: levels, except:[minimumDesc]});
        tryBuild(minimumNewDesc);
    }
    fastenBuild();
}, 10000);

