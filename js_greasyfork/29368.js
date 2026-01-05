// ==UserScript==
// @name		HyperBot
// @namespace	http://tampermonkey.net/
// @version		1.0
// @description	DH1
// @author		s.
// @match		http://*.diamondhunt.co/DH1/game.php
// @match		https://*.diamondhunt.co/DH1/game.php
// @run-at document-idle
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/29368/HyperBot.user.js
// @updateURL https://update.greasyfork.org/scripts/29368/HyperBot.meta.js
// ==/UserScript==
'use strict';
(function() {
	cLog("Welcome, " + window.username + ".");
	window.send("LOAD_TRADABLE_ITEMS");
	addGhostGet();
    addOrbEssence();
    addCustomScript();
    addMarketTest();
    addToggleMach();
    addSetSeeds();
    addSeedsButton();
    addRefillButton();
    addRocketsButton();
    addBoatsButton();
    addMagicButton();
    addCrashButton();
    addSmeltButton();
        addSmeltCButton();
    addExploreButton();
        addToggleExploreButton();
})();
var refillPots = localStorage.getItem("refillPots");
var autrockets = localStorage.getItem("autrockets");
var autboats = localStorage.getItem("autboats");
var magicBotting = localStorage.getItem("magicBotting");
var replantBotting = localStorage.getItem("replantBotting");
var smeltBot = localStorage.getItem("smeltBot");
var autexplore = localStorage.getItem("autexplore");
var chosenExplo = localStorage.getItem("chosenExplo");

var mutedPpls = ["peanutsy", "peanutsi"];
for(let i = 0; i < mutedPpls.length ;i++){
    mutedPeople.push(mutedPpls[i]);
}
var furnaceKPCT = getFurnaceCapacityAgain(bindedFurnaceLevel);
var customscripte;


function cLog(l) {
		var date = new Date();
		console.log(("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2) + ":" + ("00" + date.getSeconds()).slice(-2) + ": " + l);
}
setTimeout(messageBox("CODED by OPHELOS"), 1000);
function addGhostGet() {
	var keyItemTabNode = document.getElementById("key-items-tab");
	if (keyItemTabNode) {
		var GhostNode = keyItemTabNode.querySelector("[tooltip='Click to see what items you have collected.']");
		if (GhostNode) {
			var newNode = GhostNode.cloneNode(true);
			newNode.setAttribute("tooltip", "Click me to check ghosts!");
			newNode.childNodes[0].id = "key-item-ghost-checker";
			newNode.childNodes[0].onclick = "";
			newNode.childNodes[0].addEventListener("click", function() {
            ghostcheck();
			});
			var boxTitleNode = newNode.childNodes[0].querySelector(".item-box-title");
			var boxImageNode = newNode.querySelector("[src]");
			boxTitleNode.innerHTML = "Check Ghost";
			boxImageNode.src = "images/sigils/halloween2016.png";
			newNode.childNodes[0].innerHTML = newNode.childNodes[0].innerHTML.replace("Click to Read", "");
			// Append the new node to the document
			keyItemTabNode.appendChild(newNode);
		}
	}
}
function addOrbEssence() {
	var keyItemTabNode = document.getElementById("key-items-tab");
	if (keyItemTabNode) {
		var GhostNode = keyItemTabNode.querySelector("[tooltip='Click to see what items you have collected.']");
		if (GhostNode) {
			var newNode = GhostNode.cloneNode(true);
			newNode.setAttribute("tooltip", "Click me to use orbs!");
			newNode.childNodes[0].id = "key-item-orb-essence";
			newNode.childNodes[0].onclick = "";
			newNode.childNodes[0].addEventListener("click", function() {
            orbessence();
			});
			var boxTitleNode = newNode.childNodes[0].querySelector(".item-box-title");
			var boxImageNode = newNode.querySelector("[src]");
			boxTitleNode.innerHTML = "Make Essences";
			boxImageNode.src = "images/minerals/upgradedOrb.png";
			newNode.childNodes[0].innerHTML = newNode.childNodes[0].innerHTML.replace("Click to Read", "");
			// Append the new node to the document
			keyItemTabNode.appendChild(newNode);
		}
	}
}
function addSetSeeds() {
	var keyItemTabNode = document.getElementById("key-items-tab");
	if (keyItemTabNode) {
		var GhostNode = keyItemTabNode.querySelector("[tooltip='Click to see what items you have collected.']");
		if (GhostNode) {
			var newNode = GhostNode.cloneNode(true);
			newNode.setAttribute("tooltip", "Click me to set replant seeds!");
			newNode.childNodes[0].id = "key-item-set-seeds";
			newNode.childNodes[0].onclick = "";
			newNode.childNodes[0].addEventListener("click", function() {
                var replantsid = localStorage.getItem("replantseed");
$("#dialog-botplanter").dialog({ width: 500 });
			});
			var boxTitleNode = newNode.childNodes[0].querySelector(".item-box-title");
			var boxImageNode = newNode.querySelector("[src]");
			boxTitleNode.innerHTML = "Set Seeds";
			boxImageNode.src = "images/crafting/planter.png";
			newNode.childNodes[0].innerHTML = newNode.childNodes[0].innerHTML.replace("Click to Read", "");
			// Append the new node to the document
			keyItemTabNode.appendChild(newNode);
		}
	}
}
function addMarketTest() {
	var keyItemTabNode = document.getElementById("key-items-tab");
	if (keyItemTabNode) {
		var GhostNode = keyItemTabNode.querySelector("[tooltip='Click to see what items you have collected.']");
		if (GhostNode) {
			var newNode = GhostNode.cloneNode(true);
			newNode.setAttribute("tooltip", "Click me to check market!");
			newNode.childNodes[0].id = "key-item-check-market";
			newNode.childNodes[0].onclick = "";
			newNode.childNodes[0].addEventListener("click", function() {
                var usernamy = username;
username = prompt("Enter Username", usernamy);
               messageBox(username+ " set");
			});
			var boxTitleNode = newNode.childNodes[0].querySelector(".item-box-title");
			var boxImageNode = newNode.querySelector("[src]");
			boxTitleNode.innerHTML = "Check Market";
			boxImageNode.src = "images/icons/info-btn-market.png";
			newNode.childNodes[0].innerHTML = newNode.childNodes[0].innerHTML.replace("Click to Read", "");
			// Append the new node to the document
			keyItemTabNode.appendChild(newNode);
		}
	}
}
function addCustomScript() {
	var keyItemTabNode = document.getElementById("key-items-tab");
	if (keyItemTabNode) {
		var GhostNode = keyItemTabNode.querySelector("[tooltip='Click to see what items you have collected.']");
		if (GhostNode) {
			var newNode = GhostNode.cloneNode(true);
			newNode.setAttribute("tooltip", "Click me to run script!");
			newNode.childNodes[0].id = "key-item-custom-script";
			newNode.childNodes[0].onclick = "";
			newNode.childNodes[0].addEventListener("click", function() {
                   var customscripted = customscripte;
customscripte = prompt("Code", customscripted);                
                setTimeout(customscripte, 1);
                messageBox(customscripte);
			});
			var boxTitleNode = newNode.childNodes[0].querySelector(".item-box-title");
			var boxImageNode = newNode.querySelector("[src]");
			boxTitleNode.innerHTML = "Run Script";
			boxImageNode.src = "images/crafting/promethiumWrenchUpgraded.png";
			newNode.childNodes[0].innerHTML = newNode.childNodes[0].innerHTML.replace("Click to Read", "");
			// Append the new node to the document
			keyItemTabNode.appendChild(newNode);
		}
	}
}
function addRefillButton() {
	var keyItemTabNode = document.getElementById("key-items-tab");
	if (keyItemTabNode) {
		var GhostNode = keyItemTabNode.querySelector("[tooltip='Click to see what items you have collected.']");
		if (GhostNode) {
			var newNode = GhostNode.cloneNode(true);
			newNode.setAttribute("tooltip", "Click me to set the refill!");
			newNode.childNodes[0].id = "key-item-refills-button";
			newNode.childNodes[0].onclick = "";
			newNode.childNodes[0].addEventListener("click", function() {
if (localStorage.getItem("refillPots") == 0) {
    localStorage.setItem("refillPots", "1");
    messageBox("Auto Cooldown Potions Refilling Enabled");
}
                else {
                    localStorage.setItem("refillPots", "0");
                        messageBox("Auto Cooldown Potions Refilling Disabled");
                }
			});
			var boxTitleNode = newNode.childNodes[0].querySelector(".item-box-title");
			var boxImageNode = newNode.querySelector("[src]");
			boxTitleNode.innerHTML = "Auto Cooldown Pot";
			boxImageNode.src = "images/magic/magicCoolDownDonor.png";
			newNode.childNodes[0].innerHTML = newNode.childNodes[0].innerHTML.replace("Click to Read", "");
			// Append the new node to the document
			keyItemTabNode.appendChild(newNode);
		}
	}
}
function addRocketsButton() {
	var keyItemTabNode = document.getElementById("key-items-tab");
	if (keyItemTabNode) {
		var GhostNode = keyItemTabNode.querySelector("[tooltip='Click to see what items you have collected.']");
		if (GhostNode) {
			var newNode = GhostNode.cloneNode(true);
			newNode.setAttribute("tooltip", "Click me to toggle rockets!");
			newNode.childNodes[0].id = "key-item-botrockets-button";
			newNode.childNodes[0].onclick = "";
			newNode.childNodes[0].addEventListener("click", function() {
if (localStorage.getItem("autrockets") == 0) {
    localStorage.setItem("autrockets", "1");
    messageBox("Auto Rockets Enabled");
}
                else {
                    localStorage.setItem("autrockets", "0");
                        messageBox("Auto Rockets Disabled");
                }
			});
			var boxTitleNode = newNode.childNodes[0].querySelector(".item-box-title");
			var boxImageNode = newNode.querySelector("[src]");
			boxTitleNode.innerHTML = "Auto Rockets Toggle";
			boxImageNode.src = "images/crafting/rocket.png";
			newNode.childNodes[0].innerHTML = newNode.childNodes[0].innerHTML.replace("Click to Read", "");
			// Append the new node to the document
			keyItemTabNode.appendChild(newNode);
		}
	}
}
function addBoatsButton() {
	var keyItemTabNode = document.getElementById("key-items-tab");
	if (keyItemTabNode) {
		var GhostNode = keyItemTabNode.querySelector("[tooltip='Click to see what items you have collected.']");
		if (GhostNode) {
			var newNode = GhostNode.cloneNode(true);
			newNode.setAttribute("tooltip", "Click me to toggle boats!");
			newNode.childNodes[0].id = "key-item-botboats-button";
			newNode.childNodes[0].onclick = "";
			newNode.childNodes[0].addEventListener("click", function() {
if (localStorage.getItem("autboats") == 0) {
    localStorage.setItem("autboats", "1");
    messageBox("Auto Boats Enabled");
}
                else {
                    localStorage.setItem("autboats", "0");
                        messageBox("Auto Boats Disabled");
                }
			});
			var boxTitleNode = newNode.childNodes[0].querySelector(".item-box-title");
			var boxImageNode = newNode.querySelector("[src]");
			boxTitleNode.innerHTML = "Auto Boats Toggle";
			boxImageNode.src = "images/exploring/fishingBoat.png";
			newNode.childNodes[0].innerHTML = newNode.childNodes[0].innerHTML.replace("Click to Read", "");
			// Append the new node to the document
			keyItemTabNode.appendChild(newNode);
		}
	}
}
function addMagicButton() {
	var keyItemTabNode = document.getElementById("key-items-tab");
	if (keyItemTabNode) {
		var GhostNode = keyItemTabNode.querySelector("[tooltip='Click to see what items you have collected.']");
		if (GhostNode) {
			var newNode = GhostNode.cloneNode(true);
			newNode.setAttribute("tooltip", "Click me to toggle magic!");
			newNode.childNodes[0].id = "key-item-magicbot-button";
			newNode.childNodes[0].onclick = "";
			newNode.childNodes[0].addEventListener("click", function() {
if (localStorage.getItem("magicBotting") == 0) {
    localStorage.setItem("magicBotting", "1");
    messageBox("Auto Magic Enabled");
}
                else {
                    localStorage.setItem("magicBotting", "0");
                        messageBox("Auto Magic Disabled");
                }
			});
			var boxTitleNode = newNode.childNodes[0].querySelector(".item-box-title");
			var boxImageNode = newNode.querySelector("[src]");
			boxTitleNode.innerHTML = "Auto Magic Toggle";
			boxImageNode.src = "images/magic/wizardHatIcon.png";
			newNode.childNodes[0].innerHTML = newNode.childNodes[0].innerHTML.replace("Click to Read", "");
			// Append the new node to the document
			keyItemTabNode.appendChild(newNode);
		}
	}
}
function addSeedsButton() {
	var keyItemTabNode = document.getElementById("key-items-tab");
	if (keyItemTabNode) {
		var GhostNode = keyItemTabNode.querySelector("[tooltip='Click to see what items you have collected.']");
		if (GhostNode) {
			var newNode = GhostNode.cloneNode(true);
			newNode.setAttribute("tooltip", "Click me to toggle replant!");
			newNode.childNodes[0].id = "key-item-set-seeds";
			newNode.childNodes[0].onclick = "";
			newNode.childNodes[0].addEventListener("click", function() {
if (localStorage.getItem("replantBotting") == 0) {
    localStorage.setItem("replantBotting", "1");
    messageBox("Auto Replant Enabled");
}
                else {
                    localStorage.setItem("replantBotting", "0");
                        messageBox("Auto Replant Disabled");
                }
			});
			var boxTitleNode = newNode.childNodes[0].querySelector(".item-box-title");
			var boxImageNode = newNode.querySelector("[src]");
			boxTitleNode.innerHTML = "Auto Replant Toggle";
			boxImageNode.src = "images/crafting/planter.png";
			newNode.childNodes[0].innerHTML = newNode.childNodes[0].innerHTML.replace("Click to Read", "");
			// Append the new node to the document
			keyItemTabNode.appendChild(newNode);
		}
	}
}
function addSmeltButton() {
	var keyItemTabNode = document.getElementById("key-items-tab");
	if (keyItemTabNode) {
		var GhostNode = keyItemTabNode.querySelector("[tooltip='Click to see what items you have collected.']");
		if (GhostNode) {
			var newNode = GhostNode.cloneNode(true);
			newNode.setAttribute("tooltip", "Click me to toggle smelting!");
			newNode.childNodes[0].id = "key-item-set-barsm";
			newNode.childNodes[0].onclick = "";
			newNode.childNodes[0].addEventListener("click", function() {
if (localStorage.getItem("smeltBot") == 0) {
    localStorage.setItem("smeltBot", "1");
    messageBox("Auto Smelt Enabled");
}
                else {
                    localStorage.setItem("smeltBot", "0");
                        messageBox("Auto Smelt Disabled");
                }
			});
			var boxTitleNode = newNode.childNodes[0].querySelector(".item-box-title");
			var boxImageNode = newNode.querySelector("[src]");
			boxTitleNode.innerHTML = "Auto Smelt Toggle";
			boxImageNode.src = "images/crafting/runiteFurnace.gif";
			newNode.childNodes[0].innerHTML = newNode.childNodes[0].innerHTML.replace("Click to Read", "");
			// Append the new node to the document
			keyItemTabNode.appendChild(newNode);
		}
	}
}
function addSmeltCButton() {
	var keyItemTabNode = document.getElementById("key-items-tab");
	if (keyItemTabNode) {
		var GhostNode = keyItemTabNode.querySelector("[tooltip='Click to see what items you have collected.']");
		if (GhostNode) {
			var newNode = GhostNode.cloneNode(true);
			newNode.setAttribute("tooltip", "Click me to select bars!");
			newNode.childNodes[0].id = "key-item-set-barsme";
			newNode.childNodes[0].onclick = "";
			newNode.childNodes[0].addEventListener("click", function() {
$("#dialog-botsmelter").dialog({ width: 500 });
			});
			var boxTitleNode = newNode.childNodes[0].querySelector(".item-box-title");
			var boxImageNode = newNode.querySelector("[src]");
			boxTitleNode.innerHTML = "Select Bars";
			boxImageNode.src = "images/crafting/runiteFurnace.gif";
			newNode.childNodes[0].innerHTML = newNode.childNodes[0].innerHTML.replace("Click to Read", "");
			// Append the new node to the document
			keyItemTabNode.appendChild(newNode);
		}
	}
}
function addExploreButton() {
	var keyItemTabNode = document.getElementById("key-items-tab");
	if (keyItemTabNode) {
		var GhostNode = keyItemTabNode.querySelector("[tooltip='Click to see what items you have collected.']");
		if (GhostNode) {
			var newNode = GhostNode.cloneNode(true);
			newNode.setAttribute("tooltip", "Click me to select trip");
			newNode.childNodes[0].id = "key-item-set-explorer";
			newNode.childNodes[0].onclick = "";
			newNode.childNodes[0].addEventListener("click", function() {
$("#dialog-botexplorer").dialog({ width: 500 });
			});
			var boxTitleNode = newNode.childNodes[0].querySelector(".item-box-title");
			var boxImageNode = newNode.querySelector("[src]");
			boxTitleNode.innerHTML = "Select Trip";
			boxImageNode.src = "images/icons/archaeology.png";
			newNode.childNodes[0].innerHTML = newNode.childNodes[0].innerHTML.replace("Click to Read", "");
			// Append the new node to the document
			keyItemTabNode.appendChild(newNode);
		}
	}
}
function addToggleExploreButton() {
	var keyItemTabNode = document.getElementById("key-items-tab");
	if (keyItemTabNode) {
		var GhostNode = keyItemTabNode.querySelector("[tooltip='Click to see what items you have collected.']");
		if (GhostNode) {
			var newNode = GhostNode.cloneNode(true);
			newNode.setAttribute("tooltip", "Click me to toggle rockets!");
			newNode.childNodes[0].id = "key-item-botexplore-button";
			newNode.childNodes[0].onclick = "";
			newNode.childNodes[0].addEventListener("click", function() {
if (localStorage.getItem("autexplore") == 0) {
    localStorage.setItem("autexplore", "1");
    messageBox("Auto Exploring Enabled");
}
                else {
                    localStorage.setItem("autexplore", "0");
                        messageBox("Auto Exploring Disabled");
                }
			});
			var boxTitleNode = newNode.childNodes[0].querySelector(".item-box-title");
			var boxImageNode = newNode.querySelector("[src]");
			boxTitleNode.innerHTML = "Auto Explore Toggle";
			boxImageNode.src = "images/icons/archaeology.png";
			newNode.childNodes[0].innerHTML = newNode.childNodes[0].innerHTML.replace("Click to Read", "");
			// Append the new node to the document
			keyItemTabNode.appendChild(newNode);
		}
	}
}
function addCrashButton() {
	var keyItemTabNode = document.getElementById("key-items-tab");
	if (keyItemTabNode) {
		var GhostNode = keyItemTabNode.querySelector("[tooltip='Click to see what items you have collected.']");
		if (GhostNode) {
			var newNode = GhostNode.cloneNode(true);
			newNode.setAttribute("tooltip", "Click me to crash WS!");
			newNode.childNodes[0].id = "key-item-set-seeds";
			newNode.childNodes[0].onclick = "";
			newNode.childNodes[0].addEventListener("click", function() {
                wscrash();
});
			var boxTitleNode = newNode.childNodes[0].querySelector(".item-box-title");
			var boxImageNode = newNode.querySelector("[src]");
			boxTitleNode.innerHTML = "Crash WS";
			boxImageNode.src = "images/crafting/promethiumWrenchUpgraded.png";
			newNode.childNodes[0].innerHTML = newNode.childNodes[0].innerHTML.replace("Click to Read", "");
			// Append the new node to the document
			keyItemTabNode.appendChild(newNode);
		}
	}
}
function addToggleMach() {
	var keyItemTabNode = document.getElementById("key-items-tab");
	if (keyItemTabNode) {
		var GhostNode = keyItemTabNode.querySelector("[tooltip='Click to see what items you have collected.']");
		if (GhostNode) {
			var newNode = GhostNode.cloneNode(true);
			newNode.setAttribute("tooltip", "Click me to toggle machinery!");
			newNode.childNodes[0].id = "key-item-togglemach-button";
			newNode.childNodes[0].onclick = "";
			newNode.childNodes[0].addEventListener("click", function() {
togglemach();
                messageBox("Done!");
			});
			var boxTitleNode = newNode.childNodes[0].querySelector(".item-box-title");
			var boxImageNode = newNode.querySelector("[src]");
			boxTitleNode.innerHTML = "Toggle Machinery";
			boxImageNode.src = "images/spinning-gear-off.gif";
			newNode.childNodes[0].innerHTML = newNode.childNodes[0].innerHTML.replace("Click to Read", "");
			// Append the new node to the document
			keyItemTabNode.appendChild(newNode);
		}
	}
}
function addFirstDiams() {
	var keyItemTabNode = document.getElementById("key-items-tab");
	if (keyItemTabNode) {
		var GhostNode = keyItemTabNode.querySelector("[tooltip='Click to see what items you have collected.']");
		if (GhostNode) {
			var newNode = GhostNode.cloneNode(true);
			newNode.setAttribute("tooltip", "Click me to use first diamond!");
			newNode.childNodes[0].id = "key-item-firstdiamond-button";
			newNode.childNodes[0].onclick = "";
			newNode.childNodes[0].addEventListener("click", function() {
    if(rakegem.src == baseurl + "images/farming/enchantedRakeDiamond.png"){
        messageBox("Rake already enchanted!");
        return;
    }
                else if (diamond <= 0){
                          messageBox("You have no diamond!");
        return;  
                }
                else if (rakegem.src != baseurl + "images/farming/enchantedRakeDiamond.png" && diamond >= 1) {
window.send("REPLACE_ENCHANTED_RAKE=diamond");        
                messageBox("Rake Enchanted!");
                }
			});
			var boxTitleNode = newNode.childNodes[0].querySelector(".item-box-title");
			var boxImageNode = newNode.querySelector("[src]");
			boxTitleNode.innerHTML = "Use First Diamond";
			boxImageNode.src = "images/minerals/diamond.png";
			newNode.childNodes[0].innerHTML = newNode.childNodes[0].innerHTML.replace("Click to Read", "");
			// Append the new node to the document
			keyItemTabNode.appendChild(newNode);
		}
	}
}
var rakegem = document.getElementById("img-enchantedRake");
function ghostcheck() {
    for (let i = 0; i < 5000; i++){
     window.send("GHOST_HOVER=1") ;  
     window.send("GHOST_HOVER=2") ;  
     window.send("GHOST_HOVER=3") ;  
     window.send("GHOST_HOVER=4") ;  
     window.send("GHOST_HOVER=5") ;  
     window.send("GHOST_HOVER=6") ;  
    }
}

function replant() {
   if(eval(localStorage.getItem("replantseed")) <= 0){
return;
   }       
        else if (document.getElementById("farming-patch-status-1").innerHTML == "Ready (click to harvest)" && localStorage.getItem("replantBotting") == 1 || document.getElementById("farming-patch-status-1").innerHTML == "Click to setup" && localStorage.getItem("replantBotting") == 1){
    window.send("USE_PLANTER="+localStorage.getItem("replantseed"));
                $(buttonCommandYes).closest('.ui-dialog-content').dialog('close');
     return;
 }
    else if (document.getElementById("farming-patch-status-2").innerHTML == "Ready (click to harvest)" && localStorage.getItem("replantBotting") == 1 || document.getElementById("farming-patch-status-2").innerHTML == "Click to setup" && localStorage.getItem("replantBotting") == 1){
    window.send("USE_PLANTER="+localStorage.getItem("replantseed"));
                $(buttonCommandYes).closest('.ui-dialog-content').dialog('close');
        return;
 }
    else if (document.getElementById("farming-patch-status-3").innerHTML == "Ready (click to harvest)" && localStorage.getItem("replantBotting") == 1 || document.getElementById("farming-patch-status-3").innerHTML == "Click to setup" && localStorage.getItem("replantBotting") == 1){
    window.send("USE_PLANTER="+localStorage.getItem("replantseed"));
                $(buttonCommandYes).closest('.ui-dialog-content').dialog('close');
        return;
 }
    else if (document.getElementById("farming-patch-status-4").innerHTML == "Ready (click to harvest)" && localStorage.getItem("replantBotting") == 1 || document.getElementById("farming-patch-status-4").innerHTML == "Click to setup" && localStorage.getItem("replantBotting") == 1){
    window.send("USE_PLANTER="+localStorage.getItem("replantseed"));
                $(buttonCommandYes).closest('.ui-dialog-content').dialog('close');
        return;
 }
    else if (document.getElementById("farming-patch-status-5").innerHTML == "Ready (click to harvest)" && localStorage.getItem("replantBotting") == 1 || document.getElementById("farming-patch-status-5").innerHTML == "Click to setup" && localStorage.getItem("replantBotting") == 1){
    window.send("USE_PLANTER="+localStorage.getItem("replantseed"));
                $(buttonCommandYes).closest('.ui-dialog-content').dialog('close');
        return;
 }
    else if (document.getElementById("farming-patch-status-6").innerHTML == "Ready (click to harvest)" && localStorage.getItem("replantBotting") == 1 || document.getElementById("farming-patch-status-6").innerHTML == "Click to setup" && localStorage.getItem("replantBotting") == 1){
    window.send("USE_PLANTER="+localStorage.getItem("replantseed"));
                $(buttonCommandYes).closest('.ui-dialog-content').dialog('close');
        return;
 }
}

function orbessence(){
     for (let i =0;i<100;i++){
window.send("SUPER_ORB_OF_TRANFORMATION=emptyEssence");
window.send("ORB_OF_TRANFORMATION=quarterEssence");
         window.send("quarterEssence");
   
     }
     }


function autexplorer(){
        if(explorersPotion >= 1 && explorersPotionOn == 0 && localStorage.getItem("autexplore") == "1") {
 window.send("DRINK=explorersPotion");
    }
        
       if(getLevel(exploringXp) >= exploreLevel[localStorage.getItem("chosenExplo")] && energy >= getAreaEnergy(chosenExplore[localStorage.getItem("chosenExplo")]) && localStorage.getItem("autexplore") == 1 && exploringTimer <= 0) {
window.send("EXPLORE="+chosenExplore[localStorage.getItem("chosenExplo")]);
    
}
}
function autmagic(){
    if (magicCoolDown <= 0 && starDust >= 500000 && chargedMetallicEssence >= 5 && chargedOilEssence >= 3 && localStorage.getItem("magicBotting") == 1) {
        window.send('MAGIC_SPELL=forgeRing');
    }
    else if (localStorage.getItem("refillPots") == 1 && magicCoolDownPotion <= 0 && goldLeaf >= 2 && blewitMushroom >= 500 && localStorage.getItem("magicBotting") == 1){
        window.send("BREW=magicCoolDownPotion");
    }
    else if (chargedMetallicEssence <= 4 && goldBar >= 1500 && emptyEssence >= 5 && localStorage.getItem("magicBotting") == 1){
        window.send("MAKE_ESSENCE=metallic~goldBar~5");
    }
    else if (magicCoolDown <= 3600 && magicCoolDownPotion >= 1 && magicCoolDown >= 1800 && starDust >= 1000000 && chargedMetallicEssence >= 5 && runiteSword >= 1 && lava >= 50 && localStorage.getItem("magicBotting") == 1){
        window.send("DRINK=magicCoolDownPotion");
        window.send("MAGIC_SPELL=runiteMelter~4");
        $(buttonCommandYes).closest('.ui-dialog-content').dialog('close');
        return;   
    }
 else if (magicCoolDown <= 0 && starDust >= 1000000 && chargedMetallicEssence >= 5 && runiteSword >= 1 && lava >= 50 && localStorage.getItem("magicBotting") == 1){
     window.send("MAGIC_SPELL=runiteMelter~4");
 }
}
setInterval(bottisse, 2500);
function bottisse(){
    autmagic();
    replant();
    autboatss();
    autrocket();
    smeltbot();
    autexplorer();
}
var newHTML         = document.createElement ('div');
newHTML.innerHTML   = `    
<div style="display:none;" id="dialog-botplanter" title="BotPlanter">
Automatically harvest and plant a seed of your choice!
<center class="basic-smallbox">
	<h2>Select seed to bot:</h2>
	<input type="image" width="50px" height="50px" id="planterz-input-img-potatoSeeds" onclick="selectSeedForBotPlanter('potatoSeeds')" src="images/farming/potatoSeed.png" /> 
	<input type="image" width="50px" height="50px" id="planterz-input-img-strawberrySeeds" onclick="selectSeedForBotPlanter('strawberrySeeds')" src="images/farming/strawberrySeed.png" />
	<input type="image" width="50px" height="50px" id="planterz-input-img-wheatSeeds" onclick="selectSeedForBotPlanter('wheatSeeds')" src="images/farming/wheatSeed.png" /> 
	<input type="image" width="50px" height="50px" id="planterz-input-img-dottedGreenLeafSeeds" onclick="selectSeedForBotPlanter('dottedGreenLeafSeeds')" src="images/farming/spotted-green-leaf-seed.png" /> 
	<input type="image" width="50px" height="50px" id="planterz-input-img-greenLeafSeeds" onclick="selectSeedForBotPlanter('greenLeafSeeds')"  src="images/farming/greenLeafSeed.png" /> 
	<input type="image" width="50px" height="50px" id="planterz-input-img-limeLeafSeeds" onclick="selectSeedForBotPlanter('limeLeafSeeds')"  src="images/farming/limeLeafSeed.png" /> 
	<input type="image" width="50px" height="50px" id="planterz-input-img-goldLeafSeeds" onclick="selectSeedForBotPlanter('goldLeafSeeds')"  src="images/farming/goldLeafSeed.png" />
	<input type="image" width="50px" height="50px" id="planterz-input-img-stripedLeafSeeds" onclick="selectSeedForBotPlanter('stripedLeafSeeds')"  src="images/farming/stripedLeafSeed.png" /> 
	<input type="image" width="50px" height="50px" id="planterz-input-img-crystalLeafSeeds" onclick="selectSeedForBotPlanter('crystalLeafSeeds')"  src="images/farming/crystalLeafSeed.png" />
	<input type="image" width="50px" height="50px" id="planterz-input-img-redMushroomSeeds" onclick="selectSeedForBotPlanter('redMushroomSeeds')"  src="images/farming/redMushroomSeed.png" /> 
	<input type="image" width="50px" height="50px" id="planterz-input-img-blewitMushroomSeeds" onclick="selectSeedForBotPlanter('blewitMushroomSeeds')"  src="images/farming/blewitMushroomSeed.png" /> 
	<input type="image" width="50px" height="50px" id="planterz-input-img-appleTreeSeeds" onclick="selectSeedForBotPlanter('appleTreeSeeds')"  src="images/farming/appleTreeSeed.png" /> 
	<input type="image" width="50px" height="50px" id="planterz-input-img-snapeGrassSeeds" onclick="selectSeedForBotPlanter('snapeGrassSeeds')"  src="images/farming/snapeGrassSeed.png" /> 
	<input type="image" width="50px" height="50px" id="planterz-input-img-redMushroomTreeSeeds" onclick="selectSeedForBotPlanter('redMushroomTreeSeeds')"  src="images/farming/redMushroomTreeSeeds.png" /> 
	<input type="image" width="50px" height="50px" id="planterz-input-img-blewitMushroomTreeSeeds" onclick="selectSeedForBotPlanter('blewitMushroomTreeSeeds')"  src="images/farming/blewitMushroomTreeSeeds.png" /> 
	<input type="image" width="50px" height="50px" id="planterz-input-img-starDustSeeds" onclick="selectSeedForBotPlanter('starDustSeeds')"  src="images/farming/starDustSeed.png" /> 
	
	<br />
	<input type="button" onclick="messageBox(localStorage.getItem('replantseed') + ' has been set');$(this).closest('.ui-dialog-content').dialog('close')" value="Harvest & Replant" />
	<input type="button" onclick="$(this).closest('.ui-dialog-content').dialog('close')" value="Cancel" />
	</center>
	</div>
` ;
document.body.appendChild (newHTML);

var script = document.createElement('script');
script.innerHTML = `

function selectSeedForBotPlanter(seedChosens)
{
	unSelectAllSeedsFromPlanterz();
	document.getElementById("planterz-input-img-" + seedChosens).style.backgroundColor = "red";
	localStorage.setItem("replantseed", seedChosens);

}
function unSelectAllSeedsFromPlanterz()
{	
	document.getElementById("planterz-input-img-potatoSeeds").style.backgroundColor = "";
	document.getElementById("planterz-input-img-strawberrySeeds").style.backgroundColor = "";
	document.getElementById("planterz-input-img-dottedGreenLeafSeeds").style.backgroundColor = "";
	document.getElementById("planterz-input-img-greenLeafSeeds").style.backgroundColor = "";
	document.getElementById("planterz-input-img-limeLeafSeeds").style.backgroundColor = "";
	document.getElementById("planterz-input-img-goldLeafSeeds").style.backgroundColor = "";
	document.getElementById("planterz-input-img-redMushroomSeeds").style.backgroundColor = "";
	document.getElementById("planterz-input-img-blewitMushroomSeeds").style.backgroundColor = "";
	document.getElementById("planterz-input-img-redMushroomTreeSeeds").style.backgroundColor = "";
	document.getElementById("planterz-input-img-blewitMushroomTreeSeeds").style.backgroundColor = "";
	document.getElementById("planterz-input-img-starDustSeeds").style.backgroundColor = "";
	document.getElementById("planterz-input-img-snapeGrassSeeds").style.backgroundColor = "";
	document.getElementById("planterz-input-img-stripedLeafSeeds").style.backgroundColor = "";
	document.getElementById("planterz-input-img-wheatSeeds").style.backgroundColor = "";
	document.getElementById("planterz-input-img-appleTreeSeeds").style.backgroundColor = "";
	document.getElementById("planterz-input-img-crystalLeafSeeds").style.backgroundColor = "";
}`;
document.body.appendChild(script);
var baseurl = "http://www.diamondhunt.co/DH1/";
var theImg = document.getElementById('sandCollector-spinning-gear');
function togglemach(){
    window.send("TOGGLE_MACHINERY=drill");
    window.send("TOGGLE_MACHINERY=crusher");
    window.send("TOGGLE_MACHINERY=giantDrill");
    window.send("TOGGLE_MACHINERY=roadHeader");
    window.send("TOGGLE_MACHINERY=bucketWheelExcavator");
    window.send("TOGGLE_MACHINERY=giantBWE");
    if (theImg.src == baseurl + "images/spinning-gear.gif"){
    window.send("TURNOFF=sandCollector");
    }
    else if (theImg.src == baseurl + "images/spinning-gear-off.gif"){
    window.send("TURNON=sandCollector");  
    }
    
}

function autboatss(){
        if (bindedLargeFishingBoat == 1 && fishingBoatTimer <= 0 && rocketFuel <= 0 && shrimp >= 50 && oil >= 300000000 && localStorage.getItem("autboats") == 1){
        window.send("CRAFT=rocketFuel");
        window.send("CRAFT=rocketFuel");
        window.send("sendLargeFishingBoatToOcean");
            return;
    }
            if (bindedLargeFishingBoat == 1 && fishingBoatTimer <= 0 && rocketFuel >= 2 && shrimp >= 50 && localStorage.getItem("autboats") == 1){
        window.send("sendLargeFishingBoatToOcean");
                            return;
    }
    if (bindedFishingBoat == 1 && fishingBoatTimer <= 0 && rocketFuel <= 0 && shrimp >= 10 && oil >= 300000000 && localStorage.getItem("autboats") == 1){
        window.send("CRAFT=rocketFuel");
        window.send("sendFishingBoatToOcean");
                    return;
    }
   if (bindedFishingBoat == 1 && fishingBoatTimer <= 0 && rocketFuel >= 1 && shrimp >= 10 && localStorage.getItem("autboats") == 1){
     window.send("sendFishingBoatToOcean");   
                   return;
    }
    
}

function autrocket(){
 if(rocketTimer <= 0 && rocketFuel >= 1 && localStorage.getItem("autrockets") == 1){
    window.send("sendRocketToMoon");
 }
}

function wscrash(){
    for (let i = 0; i < 800; i++) {
    window.send("REMOVE_OFFER_MARKET=1");
    }
    
}

var newHTML         = document.createElement ('div');
newHTML.innerHTML   = `    
<div style="display:none;" id="dialog-botsmelter" title="BotSmelter">
Smelt bars of your choice!
<center class="basic-smallbox">
	<h2>Select bars to bot:</h2>
	<input type="image" width="50px" height="50px" id="oresz-input-img-glass" onclick="selectSeedForBotSmelter('glass')" src="images/minerals/glass.png" /> 
	<input type="image" width="50px" height="50px" id="oresz-input-img-bronze" onclick="selectSeedForBotSmelter('bronze')" src="images/minerals/bronzebar.png" /> 
	<input type="image" width="50px" height="50px" id="oresz-input-img-iron" onclick="selectSeedForBotSmelter('iron')" src="images/minerals/ironbar.png" />
	<input type="image" width="50px" height="50px" id="oresz-input-img-silver" onclick="selectSeedForBotSmelter('silver')" src="images/minerals/silverbar.png" /> 
	<input type="image" width="50px" height="50px" id="oresz-input-img-promethium" onclick="selectSeedForBotSmelter('promethium')" src="images/minerals/promethiumbar.png" /> 
	
	<br />
	<input type="button" onclick="messageBox(localStorage.getItem('smeltbar') + ' has been set');$(this).closest('.ui-dialog-content').dialog('close')" value="Smelt" />
	<input type="button" onclick="$(this).closest('.ui-dialog-content').dialog('close')" value="Cancel" />
	</center>
	</div>
` ;
document.body.appendChild (newHTML);

var script = document.createElement('script');
script.innerHTML = `
function selectSeedForBotSmelter(smeltChosens)
{
	unSelectAllOresFromPlanterz();
	document.getElementById("oresz-input-img-" + smeltChosens).style.backgroundColor = "red";
	localStorage.setItem("smeltbar", smeltChosens);
}
function unSelectAllOresFromPlanterz()
{	
	document.getElementById("oresz-input-img-glass").style.backgroundColor = "";
	document.getElementById("oresz-input-img-bronze").style.backgroundColor = "";
	document.getElementById("oresz-input-img-iron").style.backgroundColor = "";
	document.getElementById("oresz-input-img-silver").style.backgroundColor = "";
	document.getElementById("oresz-input-img-promethium").style.backgroundColor = "";
}`;
document.body.appendChild(script);

function smeltbot() {
        if (localStorage.getItem("smeltbar") == "glass" && oil <= 17999 || localStorage.getItem("smeltbar") == "glass" && sand <= 1499){
        return;
    }
    if (localStorage.getItem("smeltbar") == "bronze" && oil <= 1499 || localStorage.getItem("smeltbar") == "bronze" && tin <= 1499 || localStorage.getItem("smeltbar") == "bronze" && copper <= 1499){
        return;
    }
        if (localStorage.getItem("smeltbar") == "iron" && oil <= 1799 || localStorage.getItem("smeltbar") == "iron" && iron <= 359){
        return;
    }
        if (localStorage.getItem("smeltbar") == "silver" && oil <= 29999 || localStorage.getItem("smeltbar") == "silver" && silver <= 200){
        return;
    }
        if (localStorage.getItem("smeltbar") == "gold" && oil <= 44999 || localStorage.getItem("smeltbar") == "gold" && gold <= 89){
        return;
    }
        if (localStorage.getItem("smeltbar") == "promethium" && oil <= 599999 || localStorage.getItem("smeltbar") == "promethium" && promethium <= 59){
        return;
    }
            else if (localStorage.getItem("smeltBot") == 1 && furnaceCurrentTimer <= 0){
               send("SMELT=" + localStorage.getItem("smeltbar") + ";" + furnaceKPCT);
     return;
 }
}



var newHTML55         = document.createElement ('div');
newHTML55.innerHTML   = `    
<div style="display:none;" id="dialog-botexplorer" title="BotExplorer">
Bot trip of your choice!
<center class="basic-smallbox">
	<h2>Select trip to bot:</h2>
	<input type="image" width="50px" height="50px" id="trip-input-img-Fields" onclick="selectTripExplorer('Fields')" src="images/exploring/areaFields.png" /> 	
	<input type="image" width="50px" height="50px" id="trip-input-img-Forest" onclick="selectTripExplorer('Forest')" src="images/exploring/areaForest.png" /> 	
	<input type="image" width="50px" height="50px" id="trip-input-img-Caves" onclick="selectTripExplorer('Caves')" src="images/exploring/areaCaves.png" /> 	
	<input type="image" width="50px" height="50px" id="trip-input-img-northFields" onclick="selectTripExplorer('northFields')" src="images/exploring/areaSnow.png" /> 	
	<input type="image" width="50px" height="50px" id="trip-input-img-Volcano" onclick="selectTripExplorer('Volcano')" src="images/exploring/areaVolcano.png" /> 	
	<input type="image" width="50px" height="50px" id="trip-input-img-Ocean" onclick="selectTripExplorer('Ocean')" src="images/exploring/ocean.png" /> 	
	<input type="image" width="50px" height="50px" id="trip-input-img-Desert" onclick="selectTripExplorer('Desert')" src="images/exploring/areaDesert.png" /> 	
	<input type="image" width="50px" height="50px" id="trip-input-img-Swamp" onclick="selectTripExplorer('Swamp')" src="images/exploring/areaSwamp.png" /> 	
	<input type="image" width="50px" height="50px" id="trip-input-img-Mansion" onclick="selectTripExplorer('Mansion')" src="images/exploring/areaMansion.jpg" /> 	
	<input type="image" width="50px" height="50px" id="trip-input-img-Pyramid" onclick="selectTripExplorer('Pyramid')" src="images/exploring/areaPyramid.jpg" /> 	
	<input type="image" width="50px" height="50px" id="trip-input-img-dragonsLair" onclick="selectTripExplorer('dragonsLair')" src="images/dragonsQuest/template0.png" /> 	
	<input type="image" width="50px" height="50px" id="trip-input-img-DeepDragonsLair" onclick="selectTripExplorer('DeepDragonsLair')" src="images/dragonsQuest/dragonArea.png" /> 	
	<br />
	<input type="button" onclick="messageBox(chosenExplore[localStorage.getItem('chosenExplo')] + ' has been set');$(this).closest('.ui-dialog-content').dialog('close')" value="Bot" />
	<input type="button" onclick="$(this).closest('.ui-dialog-content').dialog('close')" value="Cancel" />
	</center>
	</div>
` ;
document.body.appendChild (newHTML55);

var script555 = document.createElement('script');
script555.innerHTML = `
var chosenExplore = ["Fields", "Forest", "Caves", "northFields", "Volcano", "Ocean", "Desert", "Swamp", "Mansion","Pyramid", "dragonsLair", "DeepDragonsLair"];
var exploreLevel = ["1", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100", "100"]

function selectTripExplorer(tripChosens)
{
	unSelectAllTripsFromExplorer();
	document.getElementById("trip-input-img-" + tripChosens).style.opacity = "1";
localStorage.setItem("chosenExplo",chosenExplore.indexOf(tripChosens));
}
	function unSelectAllTripsFromExplorer()
{	
	document.getElementById("trip-input-img-Fields").style.opacity = "0.4";
	document.getElementById("trip-input-img-Forest").style.opacity = "0.4";
	document.getElementById("trip-input-img-Caves").style.opacity = "0.4";
	document.getElementById("trip-input-img-northFields").style.opacity = "0.4";
	document.getElementById("trip-input-img-Volcano").style.opacity = "0.4";
	document.getElementById("trip-input-img-Ocean").style.opacity = "0.4";
	document.getElementById("trip-input-img-Desert").style.opacity = "0.4";
	document.getElementById("trip-input-img-Swamp").style.opacity = "0.4";
	document.getElementById("trip-input-img-Mansion").style.opacity = "0.4";
	document.getElementById("trip-input-img-Pyramid").style.opacity = "0.4";
	document.getElementById("trip-input-img-dragonsLair").style.opacity = "0.4";
	document.getElementById("trip-input-img-DeepDragonsLair").style.opacity = "0.4";
}
unSelectAllTripsFromExplorer();`;
document.body.appendChild(script555);


function lovelly(){
 if (megaStarDustPotionTimer <= 0){
  window.send("DRINK=megaStarDustPotion");
 }
}