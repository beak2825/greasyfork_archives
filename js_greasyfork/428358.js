// ==UserScript==
// @name         BWRift Loot Tracker
// @description  Tracks BWrift Loots 
// @version      1.0.2
// @author       Chromatical
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        GM_xmlhttpRequest
// @connect      self
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @namespace https://greasyfork.org/users/748165
// @downloadURL https://update.greasyfork.org/scripts/428358/BWRift%20Loot%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/428358/BWRift%20Loot%20Tracker.meta.js
// ==/UserScript==
var debug = localStorage.getItem("Chro.debug") == 1? true : false;

$(document).ready(function(){
    if(user.environment_name == "Bristle Woods Rift"){
        render()
    }
})

$(document).ajaxComplete(async function(event,xhr,options){
    if(options.url == "https://www.mousehuntgame.com/managers/ajax/users/userInventory.php"){
         if (debug) console.log("Aco Loot - URL is userInventory")
    } else {
        var location = user.environment_name
        if (location == "Bristle Woods Rift"){
            var entryId = $("[data-entry-id]")[0].getAttribute("data-entry-id")
            var oldEntry = localStorage.getItem("chro-aco-track")
            if(oldEntry === null){
                localStorage.setItem("chro-aco-track",0)
            }
            if (entryId){
                var promise = await idCheck()
                .then(
                    res => record(),
                    error => {}
                )}
        }
    }
});
function render(){
    const lootDiv = document.createElement("div");
    lootDiv.innerText = "Tracking (Loot)"
    $(lootDiv).css({
        "position": "absolute",
        "right": "10px",
        "bottom": "2px",
        "color": "silver",
        "font-weight": "bold",
    })
    const original = $("#hudLocationContent")[0]
    original.insertAdjacentElement("beforeend",lootDiv)
}

function idCheck(){
    return new Promise ((resolve,reject) => {
        var entryId = $("[data-entry-id]")[0].getAttribute("data-entry-id")
        var oldEntry = localStorage.getItem("chro-aco-track")
        if (entryId != oldEntry){
            localStorage.setItem("chro-aco-track",entryId)
            if (debug) console.log("Aco Loot: New entry found, set in localStorage")
            resolve(this)
        } else {
            if (debug) console.log("Aco Loot: Old entry")
            reject(this)
        }
    })
}

function record(){
    if (debug) console.log("Aco Loot: New ID in chambers, checking if it's mouse")
    var newAction = $("[data-entry-id]")[0]
    if (typeof newAction.getAttribute('data-mouse-type') == "string"){
        if (debug) console.log("Aco Loot: in charmber + new id + new mice")
        var newId = newAction.attributes[1].textContent
        var mouseName = newAction.children[1].innerText.split("oz. ")[1].split(" worth")[0] || newCatchNoLoot[0].children[1].innerText.split("oz. ")[1].split(" worth")[0];
        var loot_name_array = []
        var loot_quantity_array = []
        if($("[data-entry-id]")[0].className.includes("loot")){
            var loot_name = $("[data-entry-id]")[0].children[1].innerText.split("loot:\n")[1].replace(" and","").split(", ")
            var possible_loot = ["Tiny","Quantum","Sand","Runic","Ancient","Calcified"];
            for (var x=0;x<loot_name.length;x++){
                for (var y=0;y<possible_loot.length;y++){
                    if (loot_name[x].includes(possible_loot[y])){
                        var quantity = parseInt(loot_name[x].match(/\d+/g));
                        loot_name_array.push(loot_name[x].match(/\D+/g)[0]);
                        if (debug) console.log("Loot " + [x] + " is " + loot_name[x].match(/\D+/g)[0]);
                        loot_quantity_array.push(quantity)
                    }
                }
            }
        }
    var charm = user.trinket_name
    var crmProc;
    if (charm.includes("Vacuum")){
        var charm_type = "Vacuum"
        } else if (charm.includes("Anti")) {
            charm_type = "A/S"
        } else {
            charm_type = "Else"
        }
    if (charm_type){
        loot_name_array.forEach(el =>{
            if (charm_type == "Vacuum"){
                if (el.includes("Calcified")){
                    crmProc = "P"
                    } else {
                        crmProc = "NP"
                    }
            } else {
                crmProc = "NC"
            }
        })
    }
    var chamber = user.quests.QuestRiftBristleWoods.chamber_name
    var obelisk = user.quests.QuestRiftBristleWoods.obelisk_percent
    var acolyte_sand = user.quests.QuestRiftBristleWoods.acolyte_sand
    if (obelisk == 100 && acolyte_sand == 0){
        var status = "Drained"
        } else if (obelisk == 100){
            status = "Draining"
        } else if (chamber == "Acolyte") {
            status = "Charging"
        } else {
            status = "Not in Chamber"
        }
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbxHRJEPWn8-zWiH4DS9Rjgs_S0Zw0Iwi7zcdZr1L201/dev';
               if (webAppUrl){
                   GM_xmlhttpRequest({
                       method: "POST",
                       url: webAppUrl,
                       data: JSON.stringify({
                           chamber: chamber,
                           mouse: mouseName,
                           status: status,
                           charm: charm_type,
                           loot: loot_name_array,
                           quantity: loot_quantity_array,
                           crmProc : crmProc
                       }),
                       onload: function(response){
                           if (debug) console.log("ac data submitted")
                       },
                       onerror: function(response){
                           if (debug) console.log("ac data submission failed")
                       }
                   })
               }
    }
}

function testGML(){
        const webAppUrl = 'https://script.google.com/macros/s/AKfycbyppyVz0DDePjvmdfusofoIQr7HdqWkvzB6ZP6FUVeh6DSoap33IBamm15HfieAOZ-twg/exec';
               if (webAppUrl){
                   GM_xmlhttpRequest({
                       method: "POST",
                       url: webAppUrl,
                       data:JSON.stringify ({
                           chamber: "Timewarp",
                           mouse: "Chronomaster Mouse",
                           status: "Not in Chamber",
                           charm: "Else",
                           loot: ["Calcified Rift Mist","Time Sand"],
                           quantity: [1,2],
                           crmProc : "P"
                       }),
                       onload: function(response){
                           console.log("data submitted")
                       },
                       onerror: function(response){
                           console.log("data submission failed")
                       }
                   })
               }
}

/*function observe(){
    var id = $("#journalEntries6016883")[0]
    const observer = new MutationObserver(function(){
        var chamber = user.quests.QuestRiftBristleWoods.chamber_name
        if(chamber == "Acolyte"){
            const treewalker = document.createTreeWalker(id);
            const nodes = [];
            let currentNode = treewalker.currentNode;
            while (currentNode){
                nodes.push(currentNode);
                currentNode = treewalker.nextNode;
            }
            console.log(nodes);
        }
    });
    //nst observerTarget = $(".journalEntries")[1].childNodes[0];
    const config = {childList: true, subtree: true};
    observer.observe(id,config);
}*/
/*function observe(){
    const observer = new MutationObserver(function(){
    var chamber = user.quests.QuestRiftBristleWoods.chamber_name
        if(chamber == "Acolyte"){
            record()
        }
    });
    const observerTarget = $("#journalEntries6016883")[0];
    const config = {childList: true, subtree: true};
    observer.observe(observerTarget,config);
*/


/*function parsedata(data){
    if (debug) console.log("parsing data")
    const result = data.journal_markup
    var loot_name_array = []
    var loot_quantity_array = []

    //Loop through mouse and mouse name
    for (var i=0;i<result.length;i++){
        if (result[i].render_data.mouse_type){
            var text = result[i].render_data.text;
            var el = document.createElement("div");
            el.innerHTML = text;
            var txt = el.textContent;
            var mouse_converted = txt.split('oz.');
            var mouse_converted2 = mouse_converted[1].split("worth");
            var mouseName = mouse_converted2[0];
            //Loot
            if (txt.indexOf("loot")>-1){
                var loot = txt.split('loot:');
                var loot2 = loot[1]
                var loot3 = loot2.replace(" and","");
                var loot_name = loot3.split(', ');

                var possible_loot = ["Tiny","Quantum","Sand","Runic","Ancient","Calcified"];
                for (var x=0;x<loot_name.length;x++){
                    for (var y=0;y<possible_loot.length;y++){
                        if (loot_name[x].includes(possible_loot[y])){
                            var quantity = parseInt(loot_name[x].match(/\d+/g));
                            loot_name_array.push(loot_name[x].match(/\D+/g));
                            loot_quantity_array.push(quantity)
                        }
                    }
                }
            }
            console.log(loot_name_array)
            console.log(loot_quantity_array)
        }
    }
    //Get chamber,charm
    var charm = data.user.trinket_name
    var crmProc;
    if (charm.includes("Vacuum")){
        var charm_type = "Vacuum"
        } else {
            charm_type = "Else"
        }
    if (charm_type){
        loot_name_array.forEach(el =>{
            if (charm_type == "Vacuum"){
                if (el.includes("Calcified")){
                    crmProc = "P"
                    } else {
                        crmProc = "NP"
                    }
            } else {
                crmProc = "NC"
            }
        })
    }
    var chamber = data.user.quests.QuestRiftBristleWoods.chamber_name
    var obelisk = user.quests.QuestRiftBristleWoods.obelisk_percent
    var acolyte_sand = user.quests.QuestRiftBristleWoods.acolyte_sand
    if (obelisk == 100 && acolyte_sand == 0){
        var status = "Drained"
        } else if (obelisk == 100){
            status = "Draining"
        } else {
            status = "Charging"
        }
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbxHRJEPWn8-zWiH4DS9Rjgs_S0Zw0Iwi7zcdZr1L201/dev';
               if (webAppUrl){
                   GM_xmlhttpRequest({
                       method: "POST",
                       url: webAppUrl,
                       data: JSON.stringify({
                           chamber: chamber,
                           mouse: mouseName,
                           status: status,
                           charm: charm_type,
                           loot: loot_name_array,
                           quantity: loot_quantity_array,
                           crmProc : crmProc
                       }),
                       onload: function(response){
                           console.log("data submitted")
                       },
                       onerror: function(response){
                           console.log("data submission failed")
                       }
                   })
               }
}*/

/*function huntListener(){
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (){
        this.addEventListener("load",function(){
            if (this.responseURL === "https://www.mousehuntgame.com/managers/ajax/turns/activeturn.php" ){
                if (debug){
                    console.log("Hunt URL")
                };
                try {
                    const data = JSON.parse(this.responseText);
                    if (debug) console.log("data received");
                    if (data) parsedata(data);
                } catch (error){
                    console.log(error)
                }
            }
        });
        originalOpen.apply(this,arguments);
    }
};*/
