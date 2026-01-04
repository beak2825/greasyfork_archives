// ==UserScript==
// @name         MH - MHCT Map Solve Button
// @namespace    http://tampermonkey.net/
// @version      2024-01-17.2
// @description  Adds MHCT Solve button to map listings
// @author       lounge
// @match        https://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485068/MH%20-%20MHCT%20Map%20Solve%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/485068/MH%20-%20MHCT%20Map%20Solve%20Button.meta.js
// ==/UserScript==

var current_map_id;
const map_cache = {};

function remainingGoalList(treasure_map){
    let all_goals = treasure_map.goals.item.concat(treasure_map.goals.mouse);
    let remaining_goals = [];
    let completed_goals = new Set();
    for (let hunter of treasure_map.hunters){
        for (let type in hunter.completed_goal_ids){
            for (let goal_id of hunter.completed_goal_ids[type]){
                completed_goals.add(goal_id);
            }
        }
    }
    for (let goal of all_goals){
        let goal_id = goal.unique_id;
        let goal_name = goal.name;
        if (!completed_goals.has(goal_id)){
            remaining_goals.push(goal_name);
        }
    }
    //Array of full name items
    remaining_goals.sort();
    return remaining_goals.join("\n");
}

function createCopyButton(){
    let copyButton = document.createElement('a');
    copyButton.id='copy-button';
    copyButton.className="mousehuntActionButton tiny lightBlue";
    //copyButton.innerHTML = "<span>Copy</span>"
    copyButton.innerHTML = "<span>MHCT Solve</span>"
    copyButton.style.cssText += "margin-left: 10px";
    copyButton.addEventListener('click', () => {

        //Copy goal list to clipboard
        //navigator.clipboard.writeText(string_to_clipboard);
        //alert('Goal list copied to clipboard!');

        //Open goal list in mhct scav solver
        if (!map_cache[current_map_id]){return;}
        let param_string = map_cache[current_map_id].text;
        param_string = param_string.replaceAll('\n','%0D%0A');
        param_string = param_string.replaceAll(' ','+');
        let is_scav = map_cache[current_map_id].is_scav;
        if (is_scav){
            window.open('https://www.mhct.win/scavhelper.php?items='+param_string);
        } else if (is_scav==false) {
            window.open('https://www.mhct.win/maphelper.php?mice='+param_string);
        } else {alert('error');}

    });
    return copyButton;
}

function injectCopyButton(){
    let block_title = document.getElementsByClassName('treasureMapView-block-title')[0];
    let button_exist = false;
    for (let child of block_title.children){
        if (child.id == 'copy-button'){
            button_exist=true;
            break;
        }
    }
    if (button_exist == false){
        let copyButton = createCopyButton();
        block_title.insertBefore(copyButton,block_title.firstElementChild)
    }
}

(function() {
    'use strict';

    // Your code here...
    eventRegistry.addEventListener('ajax_response',function(e){
        if ('treasure_map' in e){
            //Runs once per map info retrieval
            map_cache[e.treasure_map.map_id] = {};
            map_cache[e.treasure_map.map_id].text = remainingGoalList(e.treasure_map);
            map_cache[e.treasure_map.map_id].is_scav = e.treasure_map.is_scavenger_hunt!=null;
        }
    })

    let tabswap_watch_observer = new MutationObserver(function(mutationList){
        for (let mutationRecord of mutationList){
            if (mutationRecord.target.classList.contains('treasureMapView')){
                //Runs on tab swap
                let header_row = document.getElementsByClassName('treasureMapRootView-tabRow')[0];
                for (let tab_element of header_row.children){
                    if (tab_element.classList.contains('active')){
                        let map_id = tab_element.getAttribute('data-type');
                        current_map_id = map_id;
                        injectCopyButton();
                    }
                }

            }
        }
    })

    new MutationObserver(function(mutationList,popup_observer){
        for (let mutationRecord of mutationList){
            if (mutationRecord.target.classList.contains('treasureMapPopup')){
                new MutationObserver(function(mutationList,rootview_load_observer){
                    for (let mutationRecord of mutationList){
                        if (mutationRecord.target.classList.contains('treasureMapRootView-content')){
                            //Runs a single time after dialog opens + mapview finishes loading
                            tabswap_watch_observer.observe(mutationRecord.target,{childList:true,subtree:true});
                            rootview_load_observer.disconnect();
                        }
                    }
                }).observe(mutationRecord.target,{subtree:true,childList:true});
            }
        }
    }).observe(document.getElementById('overlayPopup'),{attributeFilter:['class']});


})();