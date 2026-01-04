// ==UserScript==
// @name         stonehub_updateUI_xyz
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  retrieve prices from idlescape.xyz and inject it in idlescape inventory
// @author       godi, weld, gamergeo, flo
// @include      *://*idlescape.com/game*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/415828/stonehub_updateUI_xyz.user.js
// @updateURL https://update.greasyfork.org/scripts/415828/stonehub_updateUI_xyz.meta.js
// ==/UserScript==

class Stonehub_updateUI_xyz {

    constructor() {
        this.extension_id = 'updateui';
        this.status_refresh_time = 3000;

        this.xyz_data;
        this.xyz_inventory_HTML = "";
        this.xyz_market_HTML = "";
        this.xyz_enchant_HTML = "";
        this.xyz_inventory_items = [];
        this.xyz_market_items = [];
        this.xyz_enchant_items = [];
        this.xyz_active_market_tag = "";
        this.xyz_refresh_rate = 500;
        this.timer_hook = 0;
        this.go_interval_retry = 2000;
        this.go_nb_geode = 0;

        this.status_div;
        this.activated_extensions = {
            'stonehub':false,
            'updateui':false
        };
    }

    error_handler(that, e) {
        let alert_msg = "Something goes wrong with Stonehub_updateUI_xyz ! \nError msg: " + e.message + "\nPlease reload the page or contact messenoire / Gamergeo / Godi";
        console.log(alert_msg);
        //alert(alert_msg);
    }

    start() {
        let that = this;

        // wait for loading to complete, then check which ext is activated
        let page_ready = setInterval(() =>{
            if(document.readyState == 'complete'){
                clearInterval(page_ready);
                that.set_status(that);
                that.retrieve_status_div(that)
            }
            ;
        }, 200);

        // launch xyz prices (xyz) daemon
        setInterval(() => {
            try {
                that.xyz_main(that);
            } catch(e) {that.error_handler(that, e);}
        }, that.xyz_refresh_rate);
        // launch geode_opener (go) daemon
        this.timer_hook = setInterval(() => {
            try {
                that.go_geode_hook(that);
            } catch(e) {that.error_handler(that, e);}
        }, that.go_interval_retry);
    }
}

Stonehub_updateUI_xyz.prototype.create_status_div = function(that) {
    /**
     * <div id='stonehub_status'></div>
     */
    const sdiv = document.createElement('div');
    sdiv.id = 'stonehub_status';
    sdiv.style.display = 'none';
    document.body.appendChild(sdiv);
    return document.getElementById('stonehub_status');
}

Stonehub_updateUI_xyz.prototype.set_status = function(that) {
    if(!that.activated_extensions.stonehub){
        that.status_div = that.status_div ?? that.create_status_div(that);
        let ext_status = document.createElement('div');
        ext_status.id = that.extension_id;
        that.status_div.appendChild(ext_status);
    }
}

Stonehub_updateUI_xyz.prototype.retrieve_status_div = function(that) {
    /**
     * Checks inside <div id='stonehub_status'></div> which script is activated
     * and update its state inside this.activated_extensions
     */
    setInterval(() => {
        that.status_div = that.status_div ?? that.create_status_div(that);
        [...that.status_div.children].forEach(ext =>{
            that.activated_extensions[ext.id] = true;
        });
    }, that.status_refresh_time);
}

Stonehub_updateUI_xyz.prototype.int_to_commas = function(x) {
    // src https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


Stonehub_updateUI_xyz.prototype.xyz_main = function(that) {
    // This function is called every "xyz_refresh_rate" seconds and refreshes price according to items displayed on screen
    that.xyz_get_inventory_HTML(that);
    that.xyz_get_market_HTML(that);
    that.xyz_get_enchant_HTML(that);
    if(that.xyz_inventory_items.length > 0 || that.xyz_market_items.length > 0 || that.xyz_enchant_items.length > 0) that.xyz_get_prices(that);
    that.xyz_show_gold_heat(that);
    that.xyz_am_i_minprice(that);
}


Stonehub_updateUI_xyz.prototype.xyz_get_inventory_HTML = function(that) {
    that.xyz_inventory_HTML = "";
    that.xyz_inventory_items = [];
    if (! document.getElementsByClassName("inventory-panel")[0]) {return;} // Inventory isn't being displayed => Leave
    that.xyz_inventory_HTML = document.getElementsByClassName("inventory-container-all-items")[0].children[0];
    for (var i = 0; i < that.xyz_inventory_HTML.childElementCount; i++) {
        let item_node = that.xyz_inventory_HTML.children[i];
        if(item_node){
            let node_value = item_node.attributes['data-for'].nodeValue;
            let item_name = ""
            if (node_value.includes("stockpile", 1)) {
                item_name = node_value.substring(7,node_value.indexOf("stockpile"));
            } else {
                item_name = node_value.substring(7,node_value.indexOf("vault"));
            }
            that.xyz_inventory_items.push([item_name,]);
        }
    }
}

Stonehub_updateUI_xyz.prototype.xyz_get_market_HTML = function(that) {
    that.xyz_market_HTML = "";
    that.xyz_market_items = [];
    that.xyz_active_market_tag = ""
    if (! document.getElementsByClassName("marketplace-content")[0]) {return;} // Market isn't open => Leave
    if (document.getElementsByClassName("marketplace-sell-items all-items")[0]) {
        // market is open on "Sell" tab
        return;
    } else {
        // market is open on "Buy" tab
        that.xyz_active_market_tag = "marketplace-content";
    }
    that.xyz_market_HTML = document.getElementsByClassName(that.xyz_active_market_tag)[0].children[0];
    for (var i = 0; i < that.xyz_market_HTML.childElementCount; i++) {
        let current_item_node = that.xyz_market_HTML.children[i].children[0].children[0];
        if(current_item_node){
            let item_name = current_item_node.attributes['alt'].nodeValue;
            that.xyz_market_items.push([item_name,]);
        }
    }
}

Stonehub_updateUI_xyz.prototype.xyz_get_enchant_HTML = function(that) {
    // Add prices into scrollcrafting container
    that.xyz_enchant_HTML = "";
    that.xyz_enchant_items = [];
    var enchant_tab = document.getElementsByClassName("enchanting-tabs")[0];
    if (enchant_tab) {
        if (enchant_tab.children[0].className == "enchanting-tab-selected") {
            var scrolls = that.xyz_enchant_HTML = document.getElementsByClassName("scrollcrafting-main")[0].children[1];
            for(var i = 0; i < scrolls.childElementCount; i++) {
                that.xyz_enchant_items.push([scrolls.children[i].children[0].attributes['alt'].nodeValue,]);
            }
        }
    }
}

Stonehub_updateUI_xyz.prototype.xyz_update_inventory_HTML = function(that) {
    // Create HTML div into the item node so we can display the price onto it
    for (var i = 0; i < that.xyz_inventory_items.length; i++) {
        let item_node = that.xyz_inventory_HTML.children[i];
        if(item_node){
            if(item_node.getElementsByClassName("price").length==0){
                // If the div was not created yet, create it with adapted CSS style and also move down the enchant icon
                var newNode = document.createElement("div");
                newNode.className = "price";
                newNode.style.position = "absolute";
                newNode.style.top = "-4px";
                newNode.style.left = "1px";
                newNode.style.color = "#54FF9F";
                newNode.style.fontSize = "11px";
                var lastNode = item_node.lastElementNode;
                item_node.insertBefore(newNode, lastNode);
                var enchantNode = item_node.getElementsByClassName("item-enchant").item(0);
                enchantNode.style.position = "absolute";
                enchantNode.style.top = "8px";
                enchantNode.style.left = "0px";
            }
            // Populate the div with xyz API current price
            let value = that.xyz_inventory_items[i][1];
            item_node.getElementsByClassName("price").item(0).textContent = value ? that.int_to_commas(value) : 'no data...';
        }
    }
}

Stonehub_updateUI_xyz.prototype.xyz_update_market_HTML = function(that) {
    // Create HTML div into the item node so we can display the price onto it
    for (var i = 0; i < that.xyz_market_items.length; i++) {
        let item_node = that.xyz_market_HTML.children[i].children[0];
        if(item_node){
            if(item_node.getElementsByClassName("price").length==0){
                // If the div was not created yet, create it with adapted CSS style and also move down the enchant icon
                var newNode = document.createElement("div");
                newNode.className = "price";
                newNode.style.position = "absolute";
                newNode.style.top = "-4px";
                newNode.style.left = "1px";
                newNode.style.color = "#54FF9F";
                newNode.style.fontSize = "11px";
                var lastNode = item_node.lastElementNode;
                item_node.insertBefore(newNode, lastNode);
                if(that.xyz_active_market_tag == "marketplace-sell-items all-items"){
                    var enchantNode = item_node.getElementsByClassName("item-enchant").item(0);
                    enchantNode.style.position = "absolute";
                    enchantNode.style.top = "8px";
                    enchantNode.style.left = "0px";
                }
            }
            // Populate the div with xyz API current price
            let value = that.xyz_market_items[i][1];
            item_node.getElementsByClassName("price").item(0).textContent = value ? that.int_to_commas(value) : 'no data...';
        }
    }
}

Stonehub_updateUI_xyz.prototype.xyz_update_enchant_HTML = function(that) {
    // Create HTML div into the item node so we can display the price onto it
    for (var i = 0; i < that.xyz_enchant_items.length; i++) {
        let item_node = that.xyz_enchant_HTML.children[i];
        if(item_node){
            if(item_node.getElementsByClassName("price").length==0){
                // If the div was not created yet, create it with adapted CSS
                var newNode = document.createElement("div");
                newNode.className = "price";
                newNode.style.position = "absolute";
                newNode.style.top = "50px";
                newNode.style.left = "40px";
                newNode.style.color = "#54FF9F";
                newNode.style.fontSize = "14px";
                item_node.insertBefore(newNode, item_node.lastElementNode);
            }
            // Populate the div with xyz API current price
            let value = that.xyz_enchant_items[i][1];
            item_node.getElementsByClassName("price").item(0).textContent = value ? that.int_to_commas(value) : 'no data...';
        }
    }
}


Stonehub_updateUI_xyz.prototype.xyz_get_prices = function(that) {
    // xhr request to scrape idlescape.xyz prices in JSON format
    // xhr request is asynchronous as for now (synchronous = true not working, neither callback apparently), and so HTML edits must happen inside the onload event for now
    GM_xmlhttpRequest({
        url: "https://api.idlescape.xyz/prices",
        method: "GET",
        onload: response => {
            that.xyz_data = JSON.parse(response.responseText)['items'];
            // Get price for each item in inventory
            for (var i = 0; i < that.xyz_inventory_items.length; i++) {
                for (var j = 0; j < that.xyz_data.length; j++) {
                    if (that.xyz_data[j]['name'] == that.xyz_inventory_items[i][0]) {
                        that.xyz_inventory_items[i][1]=that.xyz_data[j]['price'];
                        break;
                    }
                }
            }
            if(that.xyz_inventory_items.length > 0) that.xyz_update_inventory_HTML(that);

            // Get price for each item in market
            for (i = 0; i < that.xyz_market_items.length; i++) {
                for (j = 0; j < that.xyz_data.length; j++) {
                    if (that.xyz_data[j]['name'] == that.xyz_market_items[i][0]) {
                        that.xyz_market_items[i][1]=that.xyz_data[j]['price'];
                        break;
                    }
                }
            }
            if(that.xyz_market_items.length > 0) that.xyz_update_market_HTML(that);

            // Get price for each scroll in enchant
            for (i = 0; i < that.xyz_enchant_items.length; i++) {
                for (j = 0; j < that.xyz_data.length; j++) {
                    if (that.xyz_data[j]['name'] == that.xyz_enchant_items[i][0]) {
                        that.xyz_enchant_items[i][1]=that.xyz_data[j]['price'];
                        break;
                    }
                }
            }
            if(that.xyz_enchant_items.length > 0) that.xyz_update_enchant_HTML(that);
        }
    });
}

Stonehub_updateUI_xyz.prototype.xyz_show_gold_heat = function(that) {
    // Simply shows entirely gold and heat amounts
    if (! document.getElementsByClassName("inventory-panel")[0]) {return;} // Inventory isn't being displayed => Leave
    document.getElementById('gold').textContent = document.getElementById('gold-tooltip').children[1].textContent
    document.getElementById('heat').textContent = document.getElementById('heat-tooltip').children[1].textContent
}

Stonehub_updateUI_xyz.prototype.xyz_am_i_minprice = function(that) {
    const table = document.getElementsByClassName('crafting-table marketplace-table marketplace-my-auctions-table')[0];
    if(table){
        const items = table.getElementsByTagName('tbody')[0].children;
        [...items].forEach(tr => {
            const infos = {
                'name':tr.childNodes[0].childNodes[0].childNodes[1].childNodes[0].innerHTML,
                'price': that.activated_extensions.stonehub ? (tr.childNodes[tr.childNodes.length - 2].innerHTML).replace(/\s+/g, '') : (tr.childNodes[tr.childNodes.length - 1].innerHTML).replace(/\s+/g, '')
            };

            that.xyz_data.forEach(d => {
                if(infos.name == d.name) {
                    if(infos.price == d.price)
                        tr.style.backgroundColor = '#3254fc';
                    else
                        tr.style.backgroundColor = '#eb4646';
               }
            });

        });
    }
}


// **************************************************************************
//             PARTIE               GEODE - OPENER
// **************************************************************************


Stonehub_updateUI_xyz.prototype.go_geode_hook = function(that) {
    try {
        var inventory_HTML = document.getElementsByClassName("inventory-container-all-items")[0].children[0];
    } catch(e) { return;}
    var geode_div = "";
    for(var i = 0; i < inventory_HTML.childElementCount; i++) {
        if (inventory_HTML.children[i].outerHTML.includes("Geode")) {geode_div = inventory_HTML.children[i]; break;}
    }
    if (geode_div) {
        if(! geode_div.attributes["fdp-event"]){
            geode_div.attributes["fdp-event"] = true;
            geode_div.addEventListener("click", (e) => {that.go_geode_item_clicked(that,e);}, false);
        }
    }
}

Stonehub_updateUI_xyz.prototype.go_geode_item_clicked = function(that) {
    var UI_Geode_hook = setInterval(() => {
        try{
            var menu_open = document.getElementsByClassName("MuiDialogActions-root item-dialogue-button-div MuiDialogActions-spacing")[0];
            var new_button = document.createElement('div');
            new_button.innerHTML = `<div variant="contained" color="secondary" class="item-dialogue-button idlescape-button idlescape-button-green">OUVRE MOI ÇA FDP ! <img src="https://raw.githubusercontent.com/geode-booster/geode-booster.github.io/master/211148-full.png" alt="Geode" class="icon40"></div>`;
            menu_open.insertBefore(new_button, menu_open.children[1]);
            menu_open.children[1].children[0].addEventListener("click", (e) => {that.go_run(that,e);}, false);
            clearInterval(UI_Geode_hook);
        } catch(e) { return; }
    }, 100);
}

Stonehub_updateUI_xyz.prototype.go_run = function(that) {
    that.go_nb_geode = parseInt(document.getElementsByClassName("MuiInputBase-input MuiInput-input MuiInputBase-inputMarginDense MuiInput-inputMarginDense")[0].value,10);
    var Bouton_open = document.getElementsByClassName("MuiDialogActions-root item-dialogue-button-div MuiDialogActions-spacing")[0].children[0].children[0];
    Bouton_open.click();
    document.getElementsByClassName('chat-tabs')[0].children[1].click();
    // Retrieve all items in geode
    var Activity_Geode_hook = setInterval(() => {
        try{
            var messages = document.getElementsByClassName("activity-log");
            var geode = ""
            if(messages[messages.length-1].textContent.includes("You cracked open") && ! messages[messages.length-1].attributes["opened"]) {
                geode = messages[messages.length-1].textContent;
                messages[messages.length-1].attributes["opened"]=true;
            } else {
                // no log yet in Activity tab, we need to wait 40 more ms for server to respond
                return;
            }
            // Only for testing purpose
//             geode = "You cracked open 4 geodes and found Copper Ore x 27, Iron Ore x 39, Gold Ore x 139, Mithril Ore x 22, Runite Ore x 21, Clay x 19, Stone x 43, Sand x 16, Silver x 75, Coal x 82, Sapphire x 2, Diamond x 1, as loot."
            geode = geode.substring(geode.indexOf("found ")+6,(that.go_nb_geode>1) ? geode.lastIndexOf(",") : geode.indexOf(" as loot."));
            geode = geode.split(", ");
            for(var j = 0; j < geode.length; j++){
                geode[j] = geode[j].split(" x ");
            }
            clearInterval(Activity_Geode_hook);
            that.go_main_game(that, geode);
        } catch(e) {console.log(e.message); return; }
    }, 40);
}

Stonehub_updateUI_xyz.prototype.go_main_game = function(that, geode) {

    var x = document.getElementById("root");
    x.style.display = "none";
    var audio = new Audio('https://raw.githubusercontent.com/geode-booster/geode-booster.github.io/master/eussou.mp3');
    audio.volume = 0.05;
    audio.play();

    that.go_gl = [];
    that.go_pl = [];

    that.go_geode = new Image();

    that.go_copper_ore = new Image();
    that.go_tin_ore = new Image();
    that.go_iron_ore = new Image();
    that.go_gold_ore = new Image();
    that.go_mithril_ore = new Image();
    that.go_adamantite_ore = new Image();
    that.go_runite_ore = new Image();

    that.go_clay = new Image();
    that.go_stone = new Image();
    that.go_sand = new Image();
    that.go_silver = new Image();
    that.go_coal = new Image();
    that.go_stygian_ore = new Image();

    that.go_sapphire = new Image();
    that.go_emerald = new Image();
    that.go_ruby = new Image();
    that.go_diamond = new Image();
    that.go_black_opal = new Image();

    that.go_air_talisman = new Image();
    that.go_earth_talisman = new Image();
    that.go_fire_talisman = new Image();
    that.go_water_talisman = new Image();
    that.go_blood_talisman = new Image();
    that.go_death_talisman = new Image();
    that.go_chaos_talisman = new Image();
    that.go_nature_talisman = new Image();
    that.go_mind_talisman = new Image();
    that.go_cosmic_talisman = new Image();

    that.go_geode.src = "/images/misc/geode.png";

    that.go_copper_ore.src = "/images/mining/copper_ore.png";
    that.go_tin_ore.src = "/images/mining/tin_ore.png";
    that.go_iron_ore.src = "/images/mining/tin_ore.png";
    that.go_gold_ore.src = "/images/mining/tin_ore.png";
    that.go_mithril_ore.src = "/images/mining/tin_ore.png";
    that.go_adamantite_ore.src = "/images/mining/tin_ore.png";
    that.go_runite_ore.src = "/images/mining/runite_ore.png";

    that.go_clay.src = "/images/mining/clay.png";
    that.go_stone.src = "/images/mining/stone.png";
    that.go_sand.src = "/images/mining/sand.png";
    that.go_silver.src = "/images/mining/silver.png";
    that.go_coal.src = "/images/mining/coal.png";
    that.go_stygian_ore.src = "/images/mining/stygian_ore.png";

    that.go_sapphire.src = "/images/mining/sapphire.png";
    that.go_emerald.src = "/images/mining/emerald.png";
    that.go_ruby.src = "/images/mining/ruby.png";
    that.go_diamond.src = "/images/mining/diamond.png";
    that.go_black_opal.src = "/images/mining/black_opal.png";

    that.go_air_talisman.src = "/images/runecrafting/air_talisman.png";
    that.go_earth_talisman.src = "/images/runecrafting/earth_talisman.png";
    that.go_fire_talisman.src = "/images/runecrafting/fire_talisman.png";
    that.go_water_talisman.src = "/images/runecrafting/water_talisman.png";
    that.go_blood_talisman.src = "/images/runecrafting/blood_talisman.png";
    that.go_death_talisman.src = "/images/runecrafting/death_talisman.png";
    that.go_chaos_talisman.src = "/images/runecrafting/chaos_talisman.png";
    that.go_nature_talisman.src = "/images/runecrafting/nature_talisman.png";
    that.go_mind_talisman.src = "/images/runecrafting/mind_talisman.png";
    that.go_cosmic_talisman.src = "/images/runecrafting/cosmic_talisman.png";

    var imgs = {};
    imgs["Geode"] = that.go_geode;

    imgs["Copper Ore"] = that.go_copper_ore;
    imgs["Tin Ore"] = that.go_tin_ore;
    imgs["Iron Ore"] = that.go_iron_ore;
    imgs["Gold Ore"] = that.go_gold_ore;
    imgs["Mithril Ore"] = that.go_mithril_ore;
    imgs["Adamantite Ore"] = that.go_adamantite_ore;
    imgs["Runite Ore"] = that.go_runite_ore;

    imgs["Clay"] = that.go_clay;
    imgs["Stone"] = that.go_stone;
    imgs["Sand"] = that.go_sand;
    imgs["Silver"] = that.go_silver;
    imgs["Coal"] = that.go_coal;
    imgs["Stygian Ore"] = that.go_stygian_ore;

    imgs["Sapphire"] = that.go_sapphire;
    imgs["Emerald"] = that.go_emerald;
    imgs["Ruby"] = that.go_ruby;
    imgs["Diamond"] = that.go_diamond;
    imgs["Black Opal"] = that.go_black_opal;

    imgs["Air Talisman"] = that.go_air_talisman;
    imgs["Earth Talisman"] = that.go_earth_talisman;
    imgs["Fire Talisman"] = that.go_fire_talisman;
    imgs["Water Talisman"] = that.go_water_talisman;
    imgs["Blood Talisman"] = that.go_blood_talisman;
    imgs["Death Talisman"] = that.go_death_talisman;
    imgs["Chaos Talisman"] = that.go_chaos_talisman;
    imgs["Nature Talisman"] = that.go_nature_talisman;
    imgs["Mind Talisman"] = that.go_mind_talisman;
    imgs["Cosmic Talisman"] = that.go_cosmic_talisman;

    document.getElementsByTagName("body")[0].style.cursor = "url('https://raw.githubusercontent.com/geode-booster/geode-booster.github.io/master/pick0.png') 5 65, auto";
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    document.body.appendChild(canvas);
    var w = canvas.width = innerWidth;
    var h = canvas.height = innerHeight;

    // Shuffle what we can find in each geode
    var probability = geode.map((v, i) => Array(parseInt(v[1],10)).fill(i)).reduce((c, v) => c.concat(v), []);
    shuffle(probability);
    var total_part = probability.length;

    for(let i = 0; i < that.go_nb_geode; i++) {
        that.go_gl.push({
            x : canvas.width/2, y : canvas.height/2,
            xr : rand(canvas.width), yr : rand(canvas.height),
            r : rand(0,1), // mélangeons les goudjas
            scale : rand(0.9,1.2), // chanclons la bougnadère
            dx : rand(-3,3), dy : rand(-3,3),
            dr : rand(-0.4,0.4),
        })
    }

    canvas.addEventListener('click', function(event) {
        var pas = that.go_gl.length-1;
        while(pas >= 0) {
            var spr = that.go_gl[pas];
            if(event.offsetX > spr.xr-(that.go_geode.width/2*spr.scale) && event.offsetX < spr.xr+(that.go_geode.width/2*spr.scale) && event.offsetY > spr.yr-(that.go_geode.height/2*spr.scale) && event.offsetY < spr.yr+(that.go_geode.height/2*spr.scale)){
                let nb_part = (that.go_gl.length > 1) ? Math.ceil(total_part / that.go_nb_geode) : probability.length;
                for(let i = 0; i < nb_part; i++) {
                    that.go_pl.push({
                        name: geode[probability[i]][0],
                        img : imgs[geode[probability[i]][0]],
                        x : event.offsetX+(imgs[geode[probability[i]][0]].width/2*spr.scale), y : event.offsetY+(imgs[geode[probability[i]][0]].height/2*spr.scale),
                        xr : 0, yr : 0,
                        r : rand(0,1), // mélangeons les goudjas
                        scale : rand(0.2,0.5), // chanclons la bougnadère
                        dx : rand(-2,2), dy : rand(-2,2),
                        dr : rand(-0.2,0.2),
                        tick : Math.floor(rand(900, 1400))
                    })
                }
                probability = probability.splice(nb_part);
                that.go_gl.splice(pas, 1);
                break;
            }
            pas--
        }
    });

    // src "accepted answer" https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    function rand(min,max){
        return Math.random() * (max ?(max-min) : min) + (max ? min : 0)
    }

    function drawImage(image, spr){
//         ctx.setTransform(spr.scale, 0, 0, spr.scale, spr.xr, spr.yr); // yatangaki par là
        ctx.setTransform(spr.scale, 0, 0, spr.scale, spr.xr, spr.yr); // yatangaki par là
        ctx.rotate(spr.r/10);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);
    }

    function update(){
        var ihM,iwM;
        ctx.setTransform(1,0,0,1,0,0);
        ctx.clearRect(0,0,w,h);
        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(0,0,window.innerWidth,window.innerHeight);

        var iw = imgs['Geode'].width;
        var ih = imgs['Geode'].height;
        for(i = 0; i < that.go_pl.length; i ++){
            spr = that.go_pl[i];
            spr.x += spr.dx;
            spr.y += spr.dy;
            spr.r += spr.dr;
            spr.tick -= 1;
            iwM = iw * spr.scale * 2 + w;
            ihM = ih * spr.scale * 2 + h;
            spr.xr = ((spr.x % iwM) + iwM) % iwM - iw * spr.scale;
            spr.yr = ((spr.y % ihM) + ihM) % ihM - ih * spr.scale;
            drawImage(spr.img,spr);
        }
        for(var i = 0; i < that.go_gl.length; i ++){
            var spr = that.go_gl[i];
            spr.x += spr.dx;
            spr.y += spr.dy;
            spr.r += spr.dr;
            iwM = iw * spr.scale * 2 + w;
            ihM = ih * spr.scale * 2 + h;
            spr.xr = ((spr.x % iwM) + iwM) % iwM - iw * spr.scale;
            spr.yr = ((spr.y % ihM) + ihM) % ihM - ih * spr.scale;
            drawImage(imgs['Geode'],spr);
        }
        var pas = 0
        while(pas < that.go_pl.length ) {
            if(that.go_pl[pas].tick == 0){
                that.go_pl.splice(pas,1);
            } else {
                pas += 1;
            }
        }
        if(that.go_pl.length==0 && that.go_gl.length==0){
            audio.pause();
            document.body.removeChild(canvas)
            document.getElementsByTagName("body")[0].style.cursor = "auto";
            x.style.display = "block";
            return;
        }
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

let s = new Stonehub_updateUI_xyz(); s.start()
