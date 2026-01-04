// ==UserScript==
// @name         Auto Fire 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include		http://mousehuntgame.com/*
// @include		https://mousehuntgame.com/*
// @include		http://www.mousehuntgame.com/*
// @include		https://www.mousehuntgame.com/*
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// @include		http://hi5.com/friend/games/MouseHunt*
// @include		http://mousehunt.hi5.hitgrab.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411304/Auto%20Fire.user.js
// @updateURL https://update.greasyfork.org/scripts/411304/Auto%20Fire.meta.js
// ==/UserScript==

(function() {
    const interval = setInterval(function() {
        check()
    }, 2000);
})();
function check() {
    if (user.environment_name == "Valour Rift"){
        console.log("at eclipse: " + user.quests.QuestRiftValour.is_at_eclipse+ " fire status: " + user.quests.QuestRiftValour.is_fuel_enabled + " trinket id: " +user.trinket_item_id);
		// check if UU
        if(user.quests.QuestRiftValour.is_eclipse_mode){
			return
        }
        else{
            if(user.quests.QuestRiftValour.is_at_eclipse == true && user.quests.QuestRiftValour.is_fuel_enabled == false){
                console.log("fuel switch on");
                hg.views.HeadsUpDisplayRiftValourView.toggleFuel(this);

            }
            if(user.quests.QuestRiftValour.is_at_eclipse == false && user.quests.QuestRiftValour.is_fuel_enabled == true){
                console.log("fuel switch off");
                hg.views.HeadsUpDisplayRiftValourView.toggleFuel(this);
            }
        }
    }
}
