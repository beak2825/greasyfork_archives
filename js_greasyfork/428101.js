// ==UserScript==
// @name         MH - BWrift HUD Enhancer (Items + Charms)
// @version      2.0.2
// @description  See and change charms on your bwrift HUD!
// @author       Chromatical
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// @namespace https://greasyfork.org/users/748165
// @downloadURL https://update.greasyfork.org/scripts/428101/MH%20-%20BWrift%20HUD%20Enhancer%20%28Items%20%2B%20Charms%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428101/MH%20-%20BWrift%20HUD%20Enhancer%20%28Items%20%2B%20Charms%29.meta.js
// ==/UserScript==

(function() {
    if (user.environment_name == "Bristle Woods Rift"){
        huntListener();
        getData();
    }
})();

$(document).ajaxComplete(function() {
    var container = $(".charm_container")[0]
    if(container){
        return;
    } else if (user.environment_name == "Bristle Woods Rift"){
        getData();
    }
});

function huntListener(){
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (){
        this.addEventListener("load",function(){
            if (this.responseURL === "https://www.mousehuntgame.com/managers/ajax/turns/activeturn.php" ||this.responseURL === "https://www.mousehuntgame.com/managers/ajax/pages/page.php" ||this.responseURL === "https://www.mousehuntgame.com/managers/ajax/purchases/itempurchase.php"){
                success:{update()}
                cache: {false}
            }
        })
        originalOpen.apply(this,arguments);
    };
};


function getData(){
    postReq("https://www.mousehuntgame.com/managers/ajax/users/userInventory.php",
            `sn=Hitgrab&hg_is_ajax=1&item_types%5B%5D=rift_vacuum_trinket&item_types%5B%5D=super_rift_vacuum_trinket&item_types%5B%5D=rift_anti_skele_trinket&item_types%5B%5D=temporal_fusion_trinket&item_types%5B%5D=rift_clockwork_cog_stat_item&item_types%5B%5D=temporal_rune_stat_item&action=get_items&uh=${user.unique_hash}`
            ).then(res=>{
        try {
            var response = JSON.parse(res.responseText);
            if (response) {
                var quantity = []
                for (var i =0;i<response.items.length;i++){
                    quantity.push(response.items[i].quantity)
                }
                render(quantity);
            }
        } catch (error) {
            console.error(error.stack);
        }
    });
}

function render(quantity){
    //Charms------------------------------------------------
    var charm_container = document.createElement("div");
    charm_container.className = "charm_container";
    charm_container.title = "Click to change charms"
    charm_container.style.position = "absolute";
    charm_container.style.left = "247px";
    charm_container.style.top = "153px";
    charm_container.style.height = "33px";

    var vac_charm_btn = document.createElement("button");
    vac_charm_btn.style.filter = "brightness(0.5)"
    vac_charm_btn.className = "Charm-Btn"
    vac_charm_btn.style.backgroundImage = "url('https://www.mousehuntgame.com/images/items/trinkets/08c2297af0dac1e26490ce3f814df026.gif')"
    vac_charm_btn.style.backgroundSize = "30px"
    vac_charm_btn.style.position = "relative"
    vac_charm_btn.style.width = "33px"
    vac_charm_btn.style.height = "33px"
    vac_charm_btn.style.borderRadius = "5px"
    vac_charm_btn.style.textAlign = "center"
    vac_charm_btn.style.borderColor = "#4db6ff"

    var vac_count = document.createElement("div");
    vac_count.className = "Charm-Quantity"
    vac_count.style.fontSize = "9px"
    vac_count.style.position = "absolute"
    vac_count.style.backgroundColor = "white"
    vac_count.style.minWidth = "15px"
    vac_count.style.top = "19px"
    vac_count.style.right = "1px"
    vac_count.style.color = "black";
    vac_count.style.borderStyle = "solid"
    vac_count.style.borderWidth = "thin"
    vac_count.style.borderColor = "grey"
    vac_count.style.borderRadius = "5px"

    var vac_id = document.createElement("div")
    vac_id.className = "charm-id"
    vac_id.innerText = 1553
    vac_id.style.display = "none"

    var super_vac_charm_btn = vac_charm_btn.cloneNode(true);
    super_vac_charm_btn.style.backgroundImage = "url('https://www.mousehuntgame.com/images/items/trinkets/a8857b31040f508bf0c1b9f506afc95a.gif')"
    var anti_skele_btn = vac_charm_btn.cloneNode(true);
    anti_skele_btn.style.backgroundImage = "url('https://www.mousehuntgame.com/images/items/trinkets/7218005f9062e881a6a2991ba58db829.gif')"
    var timesplit_btn = vac_charm_btn.cloneNode(true);
    timesplit_btn.style.backgroundImage = "url('https://www.mousehuntgame.com/images/items/trinkets/6216e879109bff9abc69c64bcd30d95a.gif')"

    var super_vac_count = vac_count.cloneNode(true);
    var anti_skele_count = vac_count.cloneNode(true);
    var timesplit_count = vac_count.cloneNode(true);

    var super_vac_id = vac_id.cloneNode(true);
    super_vac_id.innerText = 1841
    var anti_skele_id = vac_id.cloneNode(true);
    anti_skele_id.innerText = 2322
    var timesplit_id = vac_id.cloneNode(true);
    timesplit_id.innerText = 2348

    //Items-------------------------------------------------
    var item_container = document.createElement("div")
    item_container.className = "item_container";
    item_container.style.position = "absolute";
    item_container.style.right = "249px";
    item_container.style.top = "153px";
    item_container.style.height = "33px";

    var tsr_btn = vac_charm_btn.cloneNode(true);
    tsr_btn.className = "item-Btn"
    tsr_btn.title = "Click to buy Timesplit Runes"
    tsr_btn.style.backgroundImage = "url('https://www.mousehuntgame.com/images/items/stats/d7f159d1329c78e901d8cdea0b9aff40.gif')"
    tsr_btn.style.filter = "brightness(1.0)"
    tsr_btn.onclick = function(){
        purchasable(quantity[4])
    }

    var cog_btn = tsr_btn.cloneNode(true);
    cog_btn.style.backgroundImage = "url('https://www.mousehuntgame.com/images/items/stats/bf6e07d618060217cc5996f59a0fd009.gif')"

    var tsr_count = vac_count.cloneNode(true);
    tsr_count.className = "Item-Quantity"
    tsr_count.style.borderColor = "grey"

    var cog_count = tsr_count.cloneNode(true);

    //render---------------------------------------------------------------
    vac_count.textContent = quantity[0];
    super_vac_count.textContent = quantity[1];
    anti_skele_count.textContent = quantity[2];
    timesplit_count.textContent = quantity[3];
    cog_count.textContent = quantity[4]
    tsr_count.textContent = quantity[5]

    vac_charm_btn.appendChild(vac_count);
    vac_charm_btn.appendChild(vac_id);
    super_vac_charm_btn.appendChild(super_vac_count);
    super_vac_charm_btn.appendChild(super_vac_id);
    anti_skele_btn.appendChild(anti_skele_count);
    anti_skele_btn.appendChild(anti_skele_id);
    timesplit_btn.appendChild(timesplit_count);
    timesplit_btn.appendChild(timesplit_id);
    charm_container.appendChild(vac_charm_btn);
    charm_container.appendChild(super_vac_charm_btn);
    charm_container.appendChild(anti_skele_btn);
    charm_container.appendChild(timesplit_btn);

    tsr_btn.appendChild(tsr_count);
    cog_btn.appendChild(cog_count);
    item_container.appendChild(cog_btn);
    item_container.appendChild(tsr_btn);

    var ori_box = $(".riftBristleWoodsHUD-itemContainer")[0];
    ori_box.insertAdjacentElement("afterend",charm_container);
    charm_container.insertAdjacentElement("afterend",item_container);

    active();
}

function active(){
    var btns = document.getElementsByClassName("Charm-Btn");
    const charm = [1553,1841,2322];
    var currentCharm = user.trinket_item_id;

    // Loop through the buttons and add the active class to the current/clicked button
    for (var i = 0; i < btns.length; i++) {
        //Initial colour
        if (currentCharm == charm[i]){
            btns[i].className += " active";
            btns[i].style.borderColor = "#33ff1e"
            btns[i].style.filter = "brightness(1.0)"
        }

        btns[i].addEventListener("click", function() {
            var current = document.getElementsByClassName("Charm-Btn active");
            if(current[0] == this){
                //Disarm
                hg.utils.TrapControl.disarmTrinket().go()
                current[0].style.borderColor = "#4db6ff"
                current[0].style.filter = "brightness(0.5)"
                current[0].className = current[0].className.replace(" active", "");
            } else if (current.length == 0){
                //Changing to one of the charms
                hg.utils.TrapControl.setTrinket(this.firstElementChild.nextElementSibling.innerText).go();
                this.className += " active";
                this.style.borderColor = "#33ff1e"
                this.style.filter = "brightness(1.0)"
            } else {
                //Changing from one to another
                current[0].style.borderColor = "#4db6ff"
                current[0].style.filter = "brightness(0.5)"
                current[0].className = current[0].className.replace(" active", "");
                hg.utils.TrapControl.setTrinket(this.firstElementChild.nextElementSibling.innerText).go();
                this.className += " active";
                this.style.borderColor = "#33ff1e"
                this.style.filter = "brightness(1.0)"
            }
        });
    }
}

function update(){
        postReq("https://www.mousehuntgame.com/managers/ajax/users/userInventory.php",
             `sn=Hitgrab&hg_is_ajax=1&item_types%5B%5D=rift_vacuum_trinket&item_types%5B%5D=super_rift_vacuum_trinket&item_types%5B%5D=rift_anti_skele_trinket&item_types%5B%5D=temporal_fusion_trinket&item_types%5B%5D=rift_clockwork_cog_stat_item&item_types%5B%5D=temporal_rune_stat_item&action=get_items&uh=${user.unique_hash}`
            ).then(res=>{
        try {
            var response = JSON.parse(res.responseText);
            if (response) {
                document.getElementsByClassName("Charm-Quantity")[0].textContent = response.items[0].quantity;
                document.getElementsByClassName("Charm-Quantity")[1].textContent = response.items[1].quantity;
                document.getElementsByClassName("Charm-Quantity")[2].textContent = response.items[2].quantity;
                document.getElementsByClassName("Charm-Quantity")[3].textContent = response.items[3].quantity;
                document.getElementsByClassName("Item-Quantity")[0].textContent = response.items[4].quantity;
                document.getElementsByClassName("Item-Quantity")[1].textContent = response.items[5].quantity;
            }
        } catch (error) {
            console.error(error.stack);
        }
    });
}

function purchasable(number){
    document
     .querySelectorAll("#marketplace-tsr-buy")
     .forEach( el=> el.remove())

    const div = document.createElement("div");
    div.id = "marketplace-tsr-buy";
    div.style.backgroundColor = "#F5F5F5";
    div.style.position = "fixed";
    div.style.zIndex = "9999";
    div.style.left = "35vw";
    div.style.top = "28vh";
    div.style.border = "solid 3px #696969";
    div.style.borderRadius = "20px";
    div.style.padding = "10px";
    div.style.textAlign = "center";

    const gs_title = document.createElement("div")
    gs_title.innerText = "General Store"
    gs_title.style.fontWeight = "bold";
    gs_title.style.fontSize = "15px"

    const closeButton = document.createElement("button", {
        id: "close-button"
    });
    closeButton.textContent = "x";
    closeButton.onclick = function () {
    document.body.removeChild(div);
    };

    const table = document.createElement("table");
    table.style.textAlign = "left";
    table.style.borderSpacing = "1em 0";

    const row = document.createElement("tr");

    const label = document.createElement("label");
    label.innerText = "Amount of Timesplit Rune: "

    const input = document.createElement("input");
    input.type = "text";
    input.id = "tsr-input-id"
    input.size = "10"
    input.placeholder = "Max: ".concat(Math.floor(number/50));

    const buyButton = document.createElement("button");
    buyButton.style.fontWeight = "bold";
    buyButton.innerText = "Buy";
    buyButton.onclick = function(){
        const val = input.value;
        if (val>0 && val <= Math.floor(number/50)){
            postReq("https://www.mousehuntgame.com/managers/ajax/purchases/itempurchase.php",
                `sn=Hitgrab&hg_is_ajax=1&type=temporal_rune_stat_item&quantity=${val}&buy=1&is_kings_cart_item=0&uh=${user.unique_hash}`
                ).then(function(){
                try {
                    alert("Purchase successful!")
                } catch (error){
                    alert("Purchase unsuccessful!");
                    console.log(error)
                }
                document.body.removeChild(div);
            })
        } else {
            alert("Invalid Amount!")
        }
    }
    row.appendChild(label);
    row.appendChild(input);
    table.appendChild(row);
    div.appendChild(closeButton);
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));
    div.appendChild(gs_title);
    div.appendChild(document.createElement("br"));
    div.appendChild(table);
    div.appendChild(document.createElement("br"));
    div.appendChild(buyButton);
    document.body.appendChild(div);
}

function postReq(url, form) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          resolve(this);
        }
      };
      xhr.onerror = function () {
        reject(this);
      };
      xhr.send(form);
    });
}