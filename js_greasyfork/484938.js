// ==UserScript==
// @name         MH - SkyMap Highlight
// @namespace    http://tampermonkey.net/
// @version      2025-07-04
// @description  Highlight Sky Map tiles in the Floating Islands
// @author       lounge
// @match        https://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484938/MH%20-%20SkyMap%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/484938/MH%20-%20SkyMap%20Highlight.meta.js
// ==/UserScript==

var run_on_floating_islands=false;

function get_tile_type(element){
    return type_to_letter(element.getAttribute('data-type'))
}

function type_to_letter(type){
    let tile_type;
    switch (type){
        case 'ore_bonus':
            tile_type='O';
            break;
        case 'gem_bonus':
            tile_type='G';
            break;
        case 'sky_cheese':
            tile_type='C';
            break;
        case 'loot_cache':
            tile_type='K';
            break;
        case 'sky_pirates':
            tile_type='P';
            break;
        case 'wind_shrine':
            tile_type='W';
            break;
        case 'rain_shrine':
            tile_type='R';
            break;
        case 'frost_shrine':
            tile_type='T';
            break;
        case 'fog_shrine':
            tile_type='F';
            break;
        case 'paragon_cache_a':
            //Sprocket
            tile_type='E';
            break;
        case 'paragon_cache_b':
            //Silk
            tile_type='L';
            break;
        case 'paragon_cache_c':
            //Wing
            tile_type='I';
            break;
        case 'paragon_cache_d':
            //Bangle
            tile_type='B';
            break;
    }
    return tile_type;
}

function toggle_green_hl(hudmod){
    let fi_hl = localStorage.getItem('fi-highlight');
    if (fi_hl.includes('undefined')){fi_hl = fi_hl.replace('undefined','');}
    let tile_type = get_tile_type(hudmod);
    if (tile_type == 'undefined'){return;}
    let tile = hudmod.parentNode;
    if (tile.style.boxShadow==''|| tile.style.boxShadow==null){
        if (fi_hl.length >= 4){ return; }
        tile.style.boxShadow='0 0 20px #69ff00 inset';
        localStorage.setItem('fi-highlight',fi_hl+tile_type);
    } else if (tile.style.boxShadow=='rgb(105, 255, 0) 0px 0px 20px inset'){
        // If clicked green islandmod
        tile.style.boxShadow='';
        localStorage.setItem('fi-highlight',fi_hl.replace(tile_type,''));
    }
}

function target_in_row(target,row){
    //target is the fi-highlight tiles we want
    //row is the row/column present on the map
    //target is a string, row is an array
    if (target.length == 0){return false;}
    for (let i=0;i<target.length;i++){
        let fidx = row.indexOf(target[i]);
        if (fidx == -1){return false;}
        row.splice(fidx,1);
    }
    return true;
}

function highlight_tiles_on_map(){
    //Build grid_rows
    let mods = document.getElementsByClassName('floatingIslandsAdventureBoardSkyMap-islandMod');
    let grid_rows = {}
    grid_rows.arca = [mods[0],mods[1],mods[2],mods[3]];
    grid_rows.forg = [mods[4],mods[5],mods[6],mods[7]];
    grid_rows.hydr = [mods[8],mods[9],mods[10],mods[11]];
    grid_rows.shad = [mods[12],mods[13],mods[14],mods[15]];
    grid_rows.drac = [mods[12],mods[8],mods[4],mods[0]];
    grid_rows.law = [mods[13],mods[9],mods[5],mods[1]];
    grid_rows.phys = [mods[14],mods[10],mods[6],mods[2]];
    grid_rows.tact = [mods[15],mods[11],mods[7],mods[3]];

    //Clear all highlights
    for (let i=0;i<mods.length;i++){
        mods[i].style.boxShadow='';
    }

    //If applicable, apply golden highlights to modhud
    let golden_mods = [];
    for (let key in grid_rows){
        let target = localStorage.getItem('fi-highlight');
        let row=[];
        grid_rows[key].forEach(function(e){row.push(type_to_letter(e.children[0].getAttribute('data-type')))})
        if (target_in_row(target,row)){
            for (let idx in grid_rows[key]){
                let mod=grid_rows[key][idx];
                mod.children[0].style.boxShadow='0 0 20px #FFD700 inset';
                golden_mods.push(mod);
            }
        }
    }
    //Apply green highlights to golden squares
    let target = localStorage.getItem('fi-highlight');
    for (let i=0;i<target.length;i++){
        for (let j=0;j<golden_mods.length;j++){
            let mod = golden_mods[j];
            if (type_to_letter(mod.children[0].getAttribute('data-type')) == target.charAt(i)){
                if (mod.style.boxShadow==''){
                    mod.style.boxShadow='0 0 20px #69ff00 inset';
                    break;
                }
            }
        }
    }

    //Apply green highlights to non-golden squares
    if (golden_mods.length ==0){
        for (let i=0;i<target.length;i++){
            for (let j=0;j<mods.length;j++){
                let mod = mods[j];
                if (type_to_letter(mod.children[0].getAttribute('data-type')) == target.charAt(i)){
                    if (mod.style.boxShadow==''){
                        mod.style.boxShadow='0 0 20px #69ff00 inset';
                        break;
                    }
                }
            }
        }
    }
}

function css_find_rule(to_find,stylesheet){
    let rules = stylesheet.cssRules;
    let sheet_length = rules.length;
    let start=0;
    let end=sheet_length;
    // The CSS rules used to be sorted alphabetical so I could do a ordered search
    // Now they aren't anymore :(
    // Time to manually iterate 16k rules
    for (let idx=0;idx<end;idx++){
        let test_rule = rules.item(idx);
        if (test_rule.selectorText == to_find){
            return rules[idx]
        }
    }
    return null;
}

function on_floating_islands(){
    if (!run_on_floating_islands){
        //Remove spinIn animation
        for (let sheet_idx in document.styleSheets){
            if (document.styleSheets.item(sheet_idx).href && document.styleSheets.item(sheet_idx).href.includes('views.css')){
                let views_sheet = document.styleSheets.item(sheet_idx);
                let spinIn_rule = css_find_rule('.floatingIslandsAdventureBoardSkyMap-islandModContainer.spinIn',views_sheet);
                spinIn_rule.style.animationDuration='0s';
                let spinOut_rule = css_find_rule('.floatingIslandsAdventureBoardSkyMap-islandModContainer.spinOut',views_sheet);
                spinOut_rule.style.animationDuration='0s';
                let mod_rule = css_find_rule('.floatingIslandsAdventureBoardSkyMap-islandMod',views_sheet);
                mod_rule.style.height = '25%';
            }
        }

        //Listens for skymap dialog open
        new MutationObserver(function(mutationList){
            if (document.getElementById('overlayPopup').classList.contains('skyMap')){
                //skymap dialog has been opened
                new MutationObserver(function(mutationList,observer){
                    for (let i in mutationList){
                        for (let j=0;j<mutationList[i].addedNodes.length;j++){
                            let added_child = mutationList[i].addedNodes[j];
                            if (!added_child.classList){continue;}
                            if (added_child.classList.contains('floatingIslandsAdventureBoardSkyMap-islandMod')){
                                //islandModContainer has finished loading
                                let modcontainer = added_child.parentNode;
                                //When modcontainer clicked, highlight appropriate children
                                modcontainer.addEventListener('click',function(e){toggle_green_hl(e.target);});
                                //Highlight current tiles based on target
                                highlight_tiles_on_map();
                                //When modcontainer's children get updated, highlight again
                                //Runs per reroll
                                new MutationObserver(function(mutationList){
                                    highlight_tiles_on_map();
                                }).observe(modcontainer,{childList:true,attributes:true})
                                //observer was waiting for islandModContainer to load
                                //we don't need it to wait anymore (since it has finished loading)
                                observer.disconnect();
                                break;
                            }
                        }
                    }
                }).observe(document.getElementById('overlayPopup'),{childList:true,subtree:true});
            }
        }).observe(document.getElementById('overlayPopup'),{attributeFilter:['class']});
        run_on_floating_islands=true;
    }
}


(function() {
    'use strict';

    if (localStorage.getItem('fi-highlight') == null){
        localStorage.setItem('fi-highlight','');
    }

    // If HUD updates to Floating Islands HUD
    new MutationObserver(function(mutationList){
        if (document.getElementById('hudLocationContent').classList.contains('floating_islands')){
           on_floating_islands();
        }
    }).observe(document.getElementById('hudLocationContent'),{attributeFilter:['class']});

    // If on Floating Islands
    if (user.environment_id == 63){on_floating_islands();}

})();