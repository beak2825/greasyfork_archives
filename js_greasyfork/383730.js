// ==UserScript==
// @name           Pokemon battler for SilphRoad
// @description    A brief description of your script
// @author         Luis Medina
// @include        https://thesilphroad.com/raid-bosses
// @version        1.0.1
// @namespace https://greasyfork.org/users/150411
// @downloadURL https://update.greasyfork.org/scripts/383730/Pokemon%20battler%20for%20SilphRoad.user.js
// @updateURL https://update.greasyfork.org/scripts/383730/Pokemon%20battler%20for%20SilphRoad.meta.js
// ==/UserScript==

console.log("Hello")

var URL = "https://www.pokebattler.com/raids/defenders/pikachu/levels/tier_raid/attackers/levels/35/strategies/CINEMATIC_ATTACK_WHEN_POSSIBLE/DEFENSE_RANDOM_MC?sort=ESTIMATOR&weatherCondition=NO_WEATHER&dodgeStrategy=DODGE_REACTION_TIME&aggregation=AVERAGE&randomAssistants=-1";
var XPathParent = "//*[@id='content']/div[2]/div/div[1]"
var ComplementaryXPathName ="/div[1]/div[2]/div[1]/div[1]";

function getElementsByXpath(path) {
	return document.evaluate(path, document, null, XPathResult.ANY_TYPE, null);
}

function getElementByXpath(path) {
	return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}


function removeRoundBrakets(name){
	return name.replace(/ *\([^)]*\) */g, "");
}

function specialFormsName(name){
	if(name.includes("ORIGIN")){
		return name.replace("ORIGIN", "").trim()+"_ORIGIN_FORM";		
	}else if(name.includes("ALOLAN")){
		return name.replace("ALOLAN", "").trim()+"_ALOLA_FORM";
	}else if(name.includes("DEFENSE")){
		return name.replace("DEFENSE", "").trim()+"_DEFENSE_FORM";	
	}
	return name;
}

function applyTierLevel(name){

	if(name.includes("EX Raids")){
		return "RAID_LEVEL_5";
	}else if(name.includes("Tier 5")){
		return "RAID_LEVEL_5";
	}else if(name.includes("Tier 4")){
		return "RAID_LEVEL_4";
	}else if(name.includes("Tier 3")){
		return "RAID_LEVEL_3";
	}else if(name.includes("Tier 2")){
		return "RAID_LEVEL_2";
	}else if(name.includes("Tier 1")){
		return "RAID_LEVEL_1";
	}
	
}

function transformNames(name){
	name = specialFormsName(name);
	name = removeRoundBrakets(name);
	return name;
}

var nodes = getElementByXpath(XPathParent);
console.log(nodes.children.length);
var i;
var tierApplies="RAID_LEVEL_4";
for(i = 1; i<=nodes.children.length; i++){
	var name = getElementByXpath(XPathParent+"/div["+i+"]"+ComplementaryXPathName);
	var tier = getElementByXpath(XPathParent+"/div["+i+"]"+"/h4");
	if(name){
		console.log(name.innerHTML);
		var href = getElementByXpath(XPathParent+"/div["+i+"]/div[2]/a");
		urlName = transformNames(name.innerHTML.toUpperCase());
		partial= URL.replace("pikachu", urlName);
		href.href=partial.replace("tier_raid", tierApplies);
	}else if(tier){
		console.log("type: "+tier.innerHTML);
		tierApplies = applyTierLevel(tier.innerHTML);
	}
}
