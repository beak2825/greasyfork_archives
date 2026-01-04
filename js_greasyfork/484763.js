// ==UserScript==
// @name         scrap.tf select all duplicate items
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  auto select duplicate items to sell
// @author       calculatortamer
// @match        https://scrap.tf/sell/weapons
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scrap.tf
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484763/scraptf%20select%20all%20duplicate%20items.user.js
// @updateURL https://update.greasyfork.org/scripts/484763/scraptf%20select%20all%20duplicate%20items.meta.js
// ==/UserScript==

var sell_achievement_obtainable_weapons=true
var sell_duplicate_weapons=true
var sell_gifted=false
var sell_crafted=false

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const tf2AchievementWeapons = [
    "Force-A-Nature", "Sandman", "Bonk! Atomic Punch",
    "Equalizer", "Direct Hit", "Buff Banner",
    "Flare Gun", "Backburner", "Axtinguisher",
    "Chargin' Targe", "Eyelander", "Scottish Resistance",
    "Sandvich", "Natascha", "Killing Gloves of Boxing",
    "Frontier Justice", "Gunslinger", "Wrangler",
    "Blutsauger", "Kritzkrieg", "Übersaw",
    "Huntsman", "Jarate", "Razorback",
    "Ambassador", "Cloak and Dagger", "Dead Ringer"
];

//checks if its ok to click
function select_item(item){
    console.log(item.classList)
    if(item.classList.contains("gifted") && !sell_gifted){
        return false
    }
	  if(item.dataset["content"].includes("Crafted by:") && !sell_crafted){
        return false
    }
    item.click()
    return true
}

(async function() {
    await sleep(3000)
    'use strict';

    var items_container=document.getElementsByClassName("user-bp-app")[0].children[0];

//check if achievement obtainable weapons are there
    if(sell_achievement_obtainable_weapons){
        for(let wep=0;wep<tf2AchievementWeapons.length;wep++){
            let items=items_container.querySelectorAll('[data-title="'+tf2AchievementWeapons[wep]+'"]');
            for(let item=0;item<items.length;item++){
                select_item(items[item])
            }
        }
    }
    //check if duplicate weapons are there
    if(sell_duplicate_weapons){
        //get all weapon names
        let weapon_names=[]
        for(let i=0;i<items_container.children.length;i++){
            let item=items_container.children[i]
            let title=item.dataset["title"]
            if(!weapon_names.includes(title) && !tf2AchievementWeapons.includes(title)){
                weapon_names.push(title)
            }
        }
        //find all duplicate weapons
        for(let i=0;i<weapon_names.length;i++){
            let items=items_container.querySelectorAll('[data-title="'+weapon_names[i]+'"]');
            let items_clicked=0
            for(let item=0;item<items.length && items_clicked<items.length-1 ;item++){
                if(select_item(items[item])){
                    items_clicked++
                }
            }
        }
    }
})();