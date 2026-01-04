// ==UserScript==
// @name         No market confirmation & notifs
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  A userscript for market tweaking when buying items
// @author       loliprane
// @license      GNU GPLv3
// @match        https://web.simple-mmo.com/market/listings*
// @icon         https://icons.duckduckgo.com/ip2/simple-mmo.com.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/501313/No%20market%20confirmation%20%20notifs.user.js
// @updateURL https://update.greasyfork.org/scripts/501313/No%20market%20confirmation%20%20notifs.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function simulateKeypress(element, text) {
        var ev = new Event('input', { bubbles: true});
        ev.simulated = true;
        element.value = text;
        element.defaultValue = text;
        element.dispatchEvent(ev);
    }
    function wait_for_crafting_btn_and_click(){
        let interval_craft = setInterval(() => {
            if(!document.querySelector('[wire\\:click="initiateCraftingSession()"]').disabled){
                document.querySelector('[wire\\:click="initiateCraftingSession()"]').click()
                clearInterval(interval_craft)
            }
        },200)
    }
    function input_mostly_untrads(){
        document.querySelector('button[wire\\:click="autoAddMaterials();"]').parentElement
        let nb_mats_required=Number(document.querySelector("div.dark\\:divide-gray-800:nth-child(1)").querySelector(".text-xs:nth-child(2)").innerText)
        if(nb_mats_required>get_mats_nb()[0] + get_mats_nb()[3]){return;}
        let nb_mats_putted = 0
        var cont = document.querySelector("div.dark\\:bg-gray-800:nth-child(2) > div:nth-child(1)")
        if (!cont) return;
        for (let i = 0; i < cont.childElementCount; i++) {
            let material_txt = cont.children[i].innerText.trim()
            if(!material_txt.includes("Untr")){continue;}
            let nb_mat = Number(material_txt.match("[0-9]*")[0])
            if(nb_mat<nb_mats_required-nb_mats_putted){
                simulateKeypress(cont.children[i].querySelector('[name="quantity"]'),String(nb_mat))
                nb_mats_putted +=nb_mat
            }
            else if(nb_mat >= nb_mats_required-nb_mats_putted){
                simulateKeypress(cont.children[i].querySelector('[name="quantity"]'),String(nb_mats_required-nb_mats_putted))
                document.querySelector('[wire\\:click="updateMaterials"]').click()
                wait_for_crafting_btn_and_click()
                return
            }
        }
        for (let i = 0; i < cont.childElementCount; i++) {
            let material_txt = cont.children[i].innerText.trim()
            if(material_txt.includes("Diamond Shard") || material_txt.includes("Untr")){continue;}
            let nb_mat = Number(material_txt.match("[0-9]*")[0])
            if(nb_mat<nb_mats_required-nb_mats_putted){
                simulateKeypress(cont.children[i].querySelector('[name="quantity"]'),String(nb_mat))
                nb_mats_putted +=nb_mat
            }
            else if(nb_mat >= nb_mats_required-nb_mats_putted){
                simulateKeypress(cont.children[i].querySelector('[name="quantity"]'),String(nb_mats_required-nb_mats_putted))
                document.querySelector('[wire\\:click="updateMaterials"]').click()
                wait_for_crafting_btn_and_click()
                return
            }
        }
        for (let i = 0; i < cont.childElementCount; i++) {
            let material_txt = cont.children[i].innerText.trim()
            if(!material_txt.includes("Diamond Shard")){continue;}
            let nb_mat = Number(material_txt.match("[0-9]*")[0])
            if(nb_mat<nb_mats_required-nb_mats_putted){
                simulateKeypress(cont.children[i].querySelector('[name="quantity"]'),String(nb_mat))
                nb_mats_putted +=nb_mat
            }
            else if(nb_mat >= nb_mats_required-nb_mats_putted){
                simulateKeypress(cont.children[i].querySelector('[name="quantity"]'),String(nb_mats_required-nb_mats_putted))
                document.querySelector('[wire\\:click="updateMaterials"]').click()
                wait_for_crafting_btn_and_click()
                return
            }
        }
    }
    function get_mats_nb(){
        var sum = 0;
        var sum_untr = 0;
        var sum_trad = 0;
        var dias_shards = 0;
        var cont = document.querySelector("div.dark\\:bg-gray-800:nth-child(2) > div:nth-child(1)")
        if (!cont) return;
        for (let i = 0; i < cont.childElementCount; i++) {
            var material_txt = cont.children[i].innerText.trim()
            let nb_mat = Number(material_txt.match("[0-9]*")[0])
            if(material_txt.includes("Untr")){sum_untr +=nb_mat}
            if(material_txt.includes("Diamond Shard")){dias_shards +=nb_mat; continue;}
            else{sum_trad+=nb_mat}
            sum += nb_mat
        }
        return [sum,sum_untr,sum_trad,dias_shards]
    }
    if (location.pathname.includes("/crafting/menu")) {
        setInterval(() => {
            if(document.querySelector('[x-on\\:click="craftables_popup = true;crafting_popup=false;"]') && document.querySelector('[x-on\\:click="craftables_popup = true;crafting_popup=false;"]').innerText.includes("Keys")){return;}
            if(document.querySelector('button[wire\\:click="autoAddMaterials();"]') && document.querySelector('button[wire\\:click="autoAddMaterials();"]').parentElement.children.length==1){
                let button_auto_mats = document.createElement("button")
                button_auto_mats.onclick = input_mostly_untrads
                button_auto_mats.innerText = "Put mats & craft"
                button_auto_mats.className = document.querySelector('button[wire\\:click="autoAddMaterials();"]').className
                document.querySelector('button[wire\\:click="autoAddMaterials();"]').parentElement.append(button_auto_mats)


            }
            if(document.querySelector('[x-on\\:click="materials_popup=true; console.log(materials_popup);"]') && document.querySelector('[x-on\\:click="materials_popup=true; console.log(materials_popup);"]').parentElement.children.length==1){
                let button_auto_mats = document.createElement("button")
                button_auto_mats.onclick = input_mostly_untrads
                button_auto_mats.innerText = "Put mats & craft"
                button_auto_mats.className = document.querySelector('[x-on\\:click="materials_popup=true; console.log(materials_popup);"]').className
                document.querySelector('[x-on\\:click="materials_popup=true; console.log(materials_popup);"]').parentElement.append(button_auto_mats)

            }
            var sum,sum_untr,sum_trad,dias_shards;

            var cont = document.querySelector("div.dark\\:bg-gray-800:nth-child(2) > div:nth-child(1)")
            if (!cont) return;
            [sum,sum_untr,sum_trad,dias_shards] = get_mats_nb()
            if(document.querySelector('[x-on\\:click="craftables_popup = true;crafting_popup=false;"]') && document.querySelector('[x-on\\:click="craftables_popup = true;crafting_popup=false;"]').innerText.includes("Diamonds")){
                document.querySelector("div.dark\\:text-gray-400:nth-child(3)").innerText = "How many items do you want to craft? \n Diamond Shards : " +dias_shards
                return
            }
            //document.querySelector("div.sm\\:px-4:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)").innerText = "What materials do you want to use? You have " + sum
            document.querySelector("div.dark\\:text-gray-400:nth-child(3)").innerText = "How many items do you want to craft? \n You have " +sum +" total mats \n You have " + sum_untr + " untradable mats"
            if(dias_shards!=0){document.querySelector("div.dark\\:text-gray-400:nth-child(3)").innerText += "\n Diamond Shards : " +dias_shards + "\n This makes for a total of : " + (sum+dias_shards) + " including dias shards"}

        }, 200)
    }
    // Your code here...
})();