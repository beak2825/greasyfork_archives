// ==UserScript==
// @name         NordInvasion# Test scripts
// @namespace    https://nordinvasion.com
// @version      1.4
// @description  Extra Scripts for the NordInvasion website 
// @author       Sylvius Roeles (Kaasovic)
// @include         https://nordinvasion.com/*
// @include         https://www.nordinvasion.com/*
// @downloadURL https://update.greasyfork.org/scripts/15540/NordInvasion%20Test%20scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/15540/NordInvasion%20Test%20scripts.meta.js
// ==/UserScript==

var version = "1.4";
var lownr = 0;
var j = 0;
var url = window.location.href;
var $divs = $("div.ahEntry");

$(document).ready(function () {

    // If any logged on page is loaded...
    if ($('#playerListForm').length) {
        // Add empty element for options.
        $('body').append('<div id="nipOptions" style="display:none;text-align:center;"></div>');
        // Add Inventory to the Character menu
        $('#nav ul li:first').append('<ul><li><a href="/marketplace.php?b=0&mode=inventory">Inventory</a></li></ul>');
        // Add the NI+ server list button to the navigation bar.
        $('#nav ul li.extras ul').append('<li id="nipServers"><a href="/server-links.html" target="_blank">Servers</a></li>');
        // Wait for a click event
        $('#nipMenu > a').click(function(){
            nip_displayOptions();
        });
        //Handy shortcuts
        $("#nav ul li:eq(7)").append('<ul><li><a href="/house_crafting.php">House Crafting</a></li><li><a href="/house.php?hp=manage_members">Manage members</a></li></ul>');
        //Handy shortcuts end
        //QuestAlerter
        $.ajax({
            url: 'https://nordinvasion.com/quests.php',
            type: "GET",
            success: function (data) {
                var html = $(data).find('.leftMenu ul form button').html();
                if (html != null) {
                    $('img[src="/images/page_white_text.png"]').attr('src', '/images/new.png');
                    $('#notifications').append('<div class="update_msg"><a href="/quests.php"><i class="fa fa-envelope"></i>You have quests available!</a><a class="right"></a></div>');
                    //$('#quick_login').css({"height": "auto", "width": "352px"}); 
                }
            }
        });
        //QuestAlerter END
    }

    // If Crafting is loaded...
    if (url.match(/\/(house_|)crafting\.php/)) {
        nip_craftingRecipeFilter();
        //auto craft
        $('#craftable').append(
            '<div class="seperator" style="margin-top: 30px;margin-bottom: 30px;"></div><ul class="list"><li><div id="autocraft"> Craft Amount: <input style="margin-left:10px;margin-right:10px; height:22px;" id="craft_times" type="text" name="craft_times"></div></li></ul>');
        var button = document.createElement('button');
        button.innerHTML = 'Auto Craft';
        button.setAttribute("class","minimal w100 ui-button ui-widget ui-state-default ui-corner-all");
        button.setAttribute("height","25px");
        button.onclick = function () {
            setInterval(function () {
                if ($('#progressbar').attr("aria-valuenow") == 100 || $('#progressbar').attr("aria-valuenow") == 0) {
                    var craft_times = document.getElementById('craft_times').value;
                    if (j < craft_times) {
                        jQuery("#begin_craft").click();
                    }
                    j++;
                }
            }, 300);
        };
        $('#autocraft').append(button);
        //max button
        var max = document.createElement('button');
        max.innerHTML = 'Max';
        max.setAttribute("class","minimal w100 ui-button ui-widget ui-state-default ui-corner-all");
        max.setAttribute("style","margin-left: 10px");
        max.onclick = function () {
            //calculating max amount of crafting
            var lowest = new Array();
            $("ul.list li").each(function () {
                var value = $("span[style='font-weight:bold;']:first", this).text() / $("span[id^='req_']:first", this).text();
                if($.isNumeric(value)){
                    lowest.push(value);
                    alert(value);
                }
            });
            lowest = lowest.filter(function(n){ return n != undefined }); 
            var lownr = Math.min.apply(Math, lowest);
            document.getElementById('craft_times').value = lownr;
            setInterval(function () {
                if ($('#progressbar').attr("aria-valuenow") == 100 || $('#progressbar').attr("aria-valuenow") == 0) {
                    var craft_times = document.getElementById('craft_times').value;
                    if (j < craft_times) {
                        jQuery("#begin_craft").click();
                    }
                    j++;
                }
            }, 300);
            lowest.lenght = 0;
        };
        $('#autocraft').append(max);
        //auto craft end
    }
    // If Marketplace / Sell is loaded...
    if (url.match(/\/marketplace\.php\?b=0\&mode=inventory/)) {
        nip_marketSellToInventory();
    }
    // If Manage Players is loaded...
    if (url.match(/\/house\.php\?hp=manage_members/)) {
        nip_houseMembersIds();
    }

    if (url.indexOf("auction_hall") != -1) {
        var orderby = document.createElement('button');
        orderby.innerHTML = 'Sort Entries';
        orderby.setAttribute("class","minimal");
        orderby.onclick = function () {
            var numericallyOrderedDivs = $divs.sort(function(a,b){
                return $(a).find("span.gold").text() > $(b).find("span.gold").text() ? 1 : -1;
            });
            $("#ahListings").html(numericallyOrderedDivs);        
        };
        for (var i = 1; i < 3; i++) {
            $.ajax({
                url: 'https://nordinvasion.com/auction_hall.php?p=' + i, //Pass URL here 
                type: "GET", //Also use GET method
                success: function (data) {
                    var html = $(data).find('#ahListings').html();
                    jQuery('#ahListings').append('<div style="visibility:hidden; height:0px">' + html + '</div>');
                    initcalc();
                }
            });
        }
        $('#ahListings .ahEntry.ahHeader .ahStatus').append(orderby);
        //Product of Interest
        if(typeof(Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            if(localStorage.getItem("product") != null && localStorage.getItem("product") != ""){
                $('.leftMenu').append('<div class="seperator" style="margin-top: 30px;margin-bottom: 30px;">');
                $('.leftMenu').append('<ul class="list"><li><b>Items of Interest: </b></li></ul>');
                $('.leftMenu').append('<div id="loadedcharacter"><ul class="list">'+localStorage.getItem("product")+'</ul><div class="seperator" style="margin-top: 30px;margin-bottom: 30px;"></div>');
            } else {
                $('.leftMenu').append('<div class="seperator" style="margin-top: 30px;margin-bottom: 30px;"></div>You do not have any item of interest.<div class="seperator" style="margin-top: 30px;margin-bottom: 30px;">');
            }
            //appending add item box
            $('.leftMenu').append(
                '<ul class="list"><li><div id="newitem"> Item Name: <input id="item_name" type="text" name="item_name"></li></ul>');
            var additem = document.createElement('button');
            additem.innerHTML = 'Add Item';
            additem.setAttribute("class","minimal");
            additem.onclick = function () {
                if (localStorage.product) {
                    var itemname = document.getElementById('item_name').value;
                    localStorage.product = localStorage.product + "<li>"+itemname+" <a class='clearitm' id='"+itemname+"'>X</a></li>";
                    location.reload();
                } else {
                    var itemname = document.getElementById('item_name').value;
                    localStorage.product = "<li>"+itemname+" <a class='clearitm' id='"+itemname+"'>X</a></li>";
                    location.reload();
                }
            };
            $('#newitem').append(additem);
            $('a.clearitm').click( function(event) { 
                var product = event.target.id;
                var storage = localStorage.getItem("product");
                var update_storage = storage.replace("<li>"+product+" <a class='clearitm' id='"+product+"'>X</a></li>", '');
                localStorage.product = update_storage;
                location.reload();
            });
            jQuery("div.ahEntry").each(function (i) {
                var itm = jQuery('span[class^="material"]', this).text() + jQuery('span[class^="item"]', this).text();
                if (localStorage.getItem("product").indexOf(itm) >= 0 && i >= 1) {
                    $(this).attr("style","background-color: yellow;");
                }
            });
        }
        else {
            $('.rightContent').append('Whoops, your browser does not support LocalStorage, please upgrade your browser');
        }         
    } if (url.indexOf("house.php?hp=invite") != -1) {
        if(typeof(Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            if(localStorage.getItem("char") != null){
                $('.rightContent').append('<ul class="list"><li>Click on one of the characters below to invite them to the House.</li></ul><div class="seperator" style="margin-top: 30px;margin-bottom: 30px;">');
                $('.rightContent').append('<div id="loadedcharacter"><ul class="list">'+localStorage.getItem("char")+'</ul><div class="seperator" style="margin-top: 30px;margin-bottom: 30px;"></div>');
            } else {
                $('.rightContent').append('No stored characters found.');
            }
            //appending add character box
            $('.rightContent').append(
                '<ul class="list"><li><div id="newcharacter"> Character Name: <input id="char_name" type="text" name="char_name"> Character ID: <input id="char_id" type="text" name="char_id"><br></div></li></ul>');
            var addchar = document.createElement('button');
            addchar.innerHTML = 'Add Character';
            addchar.setAttribute("class","minimal");
            addchar.onclick = function () {
                if (localStorage.char) {
                    var charname = document.getElementById('char_name').value;
                    var charid = document.getElementById('char_id').value;
                    localStorage.char = localStorage.char + "<li><button class='minimal' id='"+charid+"' value='"+charid+"'>"+charname+"</button></li>";
                    location.reload();
                } else {
                    var charname = document.getElementById('char_name').value;
                    var charid = document.getElementById('char_id').value;
                    localStorage.char = "<li><button class='minimal' id='"+charid+"' value='"+charid+"'>"+charname+"</button></li>";
                    location.reload();
                }
            };
            $('#newcharacter').append(addchar);
            $("button").click(function() {
                $('input[name="invite_id"]').val(this.id);
            });
        }
        else {
            $('.rightContent').append('Whoops, your browser does not support LocalStorage, please upgrade your browser');
        } 
    }
    if (url.indexOf("trading.php") != -1) {
        if(localStorage.getItem($("#playerListBox h3").text())){
            var arr =  localStorage.getItem($("#playerListBox h3").text()).split('</li>');
            var temparr = "";
            var index;
            for	(index = arr.length - 6; index < arr.length; index++) {
                if(arr[index] != undefined){
                    temparr += arr[index];
                }
            }
            $(".leftMenu").append("<h4>Trade History:</h4><ul class='list'>"+temparr+"</ul>");
        } else {
            $(".leftMenu").append("<h4>Trade History:</h4><ul class='list'><li>No trade history.</li></ul>");
        }
        //        if(localStorage.trade){
        //            localStorage.removeItem("trade");
        //        }
    } 
    if (url.indexOf("trading.php?t=") != -1) {
        if(typeof(Storage) !== "undefined") {
            if (localStorage.getItem($("#playerListBox h3").text())) {
                var value = url.substring(url.lastIndexOf('t=') + 1);
                var valueint = value.replace(/[^0-9\.]+/g, "");
                if(localStorage.getItem($("#playerListBox h3").text()).indexOf(valueint) == -1){
                    localStorage.setItem($("#playerListBox h3").text(),localStorage.getItem($("#playerListBox h3").text()) + '<li><a class="check" href="?t='+valueint+'">'+$(".column.trade.other.open div h5:first").text()+'</a></li>');
                }
            }
            else {
                var value = url.substring(url.lastIndexOf('t=') + 1);
                var valueint = value.replace(/[^0-9\.]+/g, "");
                localStorage.setItem($("#playerListBox h3").text(),'<li><a class="check" href="?t='+valueint+'">'+$(".column.trade.other.open div h5:first").text()+'</a></li>');
            }
        }else {
            $('.rightContent').append('Whoops, your browser does not support LocalStorage, please upgrade your browser');
        }
        // add all button (trading)
        var addall = document.createElement('button');
        addall.innerHTML = 'Add All';
        addall.setAttribute("class","minimal w100");
        addall.setAttribute("style","margin-right: 20px;");
        addall.setAttribute("type","button");
        addall.setAttribute("position","absolute");
        addall.onclick = function () {
            jQuery(".add").each(function () {
                (this).click();
            });
            $('button[value^="add_items"]').click();
        };
        var addallmats = document.createElement('button');
        addallmats.innerHTML = 'Add Materials';
        addallmats.setAttribute("class","minimal w100");
        addallmats.setAttribute("type","button");
        addallmats.setAttribute("position","absolute");
        addallmats.onclick = function () {
            $('li:has(span[class^="name material"])').next().next().each(function () {
                $(this).click();
            });
            $('button[value^="add_items"]').click();
        };
        $('button[value^="add_items"]').after(addall,addallmats);

    }
    //    if (url.indexOf("character.php") != -1) {
    //        if(typeof(Storage) !== "undefined") {
    //            $("#infLoadout").before("<div id='presets'><input class='minimal w100 tm9' type='button' value='Preset'><input class='minimal w100 tm9' type='button' value='Preset'></div>");/
    //
    //        }else {
    //            $('.rightContent').append('Whoops, your browser does not support LocalStorage, please upgrade your browser');
    //        }  
    //    }
});

function initcalc() {
    jQuery("div.ahEntry").each(function () {
        var itm = jQuery('span[class^="material"]', this).text() + jQuery('span[class^="item"]', this).text();
        var selector = "span.gold";
        var lowest = new Array();
        jQuery("div.ahEntry").each(function () {
            if (jQuery('span[class^="material"]', this).text() == itm || jQuery('span[class^="item"]', this).text() == itm) {
                var strValue = jQuery(selector, this).text();
                strValue = strValue.replace(/,/g, "");
                lowest.push(strValue);
            }
        });
        lownr = Math.min.apply(Math, lowest);
        lowest.lenght = 0;
        jQuery('span[class^="ahStatus toggle"]', this).text("low: " + lownr);
        var gold = jQuery('span.gold', this).text();
        gold = gold.replace(/,/g, '');
        if (lownr < gold) {
            jQuery('span.gold', this).css("color", "red");
        } else if (lownr == gold) {
            jQuery('span.gold', this).css("color", "green");
        } 
    });
}

// Crafting - Filter the recipes displayed
function nip_craftingRecipeFilter() {
    // Set classes for recipe filtering
    $('.leftMenu a').each(function(){
        var blueprintTitle = $(this).text();
        var classStr;
        // If profession header, do not add class
        if (blueprintTitle.match(/Blacksmith|Armorsmith|Alchemist|Defender|Attacker|Support/)) return;
        // Determine the appropriate class to each link
        if (blueprintTitle.match(/\(.*All|Inf|Sgt|Commando|Legion|Guard|Zwei.*\)/)) classStr = nip_appendList(classStr, 'infantry', ' ');
        if (blueprintTitle.match(/\(.*All|Archer|Long|Sniper|Warden|Sentinel|Ranger.*\)/)) classStr = nip_appendList(classStr, 'archer', ' ');
        if (blueprintTitle.match(/\(.*All|Cross|Man at Arms|Sharp|Marksman|Aventurier|Pavise.*\)/)) classStr = nip_appendList(classStr, 'crossbowman', ' ');
        if (blueprintTitle.match(/\(.*All|Militia|Skirm|Pike|Halb|Peltast|Marauder.*\)/)) classStr = nip_appendList(classStr, 'skirmisher', ' ');
        if (blueprintTitle.match(/\(.*Stable|Novice|Trained|Adept|Master|Rider.*\)/)) classStr = nip_appendList(classStr, 'cavalry', ' ');
        // If none of the above are true, it must be a mat or support item
        if (!classStr) classStr = 'other';
        // Set the class
        $(this).attr('class',classStr);
    });
    // Add filter buttons
    $('.leftMenu').prepend('<input class="minimal filter" style="margin:2px" type="button" name="archer" value="Arch"><input class="minimal filter" style="margin:2px" type="button" name="infantry" value="Inf"><input class="minimal filter" style="margin:2px" type="button" name="crossbowman" value="Cross"><input class="minimal filter" style="margin:2px" type="button" name="skirmisher" value="Skirm"><br /><input class="minimal filter" style="margin:2px" type="button" name="all" value="All"><input class="minimal filter" style="margin:2px" type="button" name="cavalry" value="Cav"><input class="minimal filter" style="margin:2px" type="button" name="other" value="Other">');
    // Set click event for the filter buttons
    $('.filter').click(function() {
        // Get the filter type
        var filterType = $(this).attr('name');
        // If the filter type is all, display all the blueprints and level sections
        if (filterType === 'all') {
            $('.archer, .infantry, .crossbowman, .skirmisher, .cavalry, .other').css('display','inline');
            $('.leftMenu > ul > li').css('display','block');
            // If the filter is not all, display the appropriate blueprints and non-empty level sections
        } else {
            // Hide everything and then display the appropriate blueprints
            $('.archer,.infantry,.crossbowman,.skirmisher,.cavalry,.other').css('display','none');
            $('.' + filterType).css('display','inline');
            // Search each level section for a visible blueprint
            $('.leftMenu > ul > li').each(function() {
                if ($(this).text().match(/Blueprints/)) return;
                if ($(this).html().match(/display: inline/)) $(this).css('display','block');
                else $(this).css('display','none');
            });
        }
    });
}

// Marketplace / Sell - Filter the items displayed
function nip_marketSellToInventory() {
    // Set the page title
    $('title').text('Nord Invasion | Inventory');
    // Remove sell fields
    $('.mkt_item .mkt_item_buy').remove();
    // Set classes for item filtering
    $('.mkt_item', '.rightContent').each(function(){
        if ($(this).text().match(/Used in crafting/)) {
            $(this).addClass('nip_material');
        } else {
            $(this).addClass('nip_gear');
            if ($(this).text().match(/Everyone|Archer|Longbowman|Sniper|Warden|Sentinal|Ranger/)) $(this).addClass('nip_archer');
            if ($(this).text().match(/Everyone|Infantry|Sergeant|Commando|Royal Guard|Zweihander|Legionnaire/)) $(this).addClass('nip_infantry');
            if ($(this).text().match(/Everyone|Crossbowman|Man at Arms|Sharpshooter|Chosen Marksman|Adventurier|Pavise Champion/)) $(this).addClass('nip_crossbowman');
            if ($(this).text().match(/Everyone|Militia|Skirmisher|Pikeman|Master Peltast|Halberdier|Marauder/)) $(this).addClass('nip_pikeman');
            if ($(this).text().match(/Apprentice|Engineer|Nurse|Medic|Surgoon/)) $(this).addClass('nip_support');
        }
        if ($('.shiny, .ultra', this).text()) $(this).addClass('nip_valuable');
        else if ($('.rare, .veryrare', this).text()) $(this).addClass('nip_rare');
        else if ($('.legendary, .ultralegendary, .unknown', this).text()) $(this).addClass('nip_legendary');
        else $(this).addClass('nip_normal');
    });
    // Add filter title
    $('.leftMenu').append('<p><strong>Inventory Filters</strong></p>');
    // Add filter type radios
    $('.leftMenu').append('<fieldset style="border:none;margin:0px 18px 10px 0px;">\
<legend>Item Type</legend>\
<input class="filter" type="radio" name="type" value="everything">Everyting<br />\
<input class="filter" type="radio" name="type" value="gear">Gear<br />\
<input class="filter" type="radio" name="type" value="material">Materials\
</fieldset>');
    // Add filter class radios
    $('.leftMenu').append('<fieldset style="border:none;margin:0px 18px 10px 0px;">\
<legend>Usable by</legend>\
<input class="filter" type="radio" name="class" value="everything">Everything (not filtered)<br />\
<input class="filter" type="radio" name="class" value="archer">Archer<br />\
<input class="filter" type="radio" name="class" value="infantry">Infantry<br />\
<input class="filter" type="radio" name="class" value="crossbowman">Crossbowman<br />\
<input class="filter" type="radio" name="class" value="pikeman">Pikeman<br />\
<input class="filter" type="radio" name="class" value="support">Support<br />\
<input class="filter" type="radio" name="class" value="cavalry">Cavalry\
</fieldset>');
    // Add filter color checkboxes
    $('.leftMenu').append('<fieldset style="border:none;margin:0px 18px 10px 0px;">\
<legend>Color</legend>\
<input class="filter" type="checkbox" name="color" value="normal">Normal<br />\
<input class="filter" type="checkbox" name="color" value="valuable">Green / Valuable<br />\
<input class="filter" type="checkbox" name="color" value="rare">Rare<br />\
<input class="filter" type="checkbox" name="color" value="legendary">Legendary\
</fieldset>');
    $('.leftMenu > ul').remove();
    // Set the default selection
    if (localStorage.lastInventoryFilters) {
        var filters = JSON.parse(localStorage.lastInventoryFilters);
        $('.filter[name=\'type\'][value=\'' + filters['type'] + '\']', '.leftMenu').attr('checked','');
        $('.filter[name=\'class\'][value=\'' + filters['class'] + '\']', '.leftMenu').attr('checked','');
        for (color in filters['color']) $('.filter[name=\'color\'][value=\'' + filters['color'][color] + '\']', '.leftMenu').attr('checked','');
        nip_filterInventory(localStorage.lastInventoryFilters);
    } else {
        $('.filter[name=\'type\'][value=\'everything\']', '.leftMenu').attr('checked','');
        $('.filter[name=\'class\'][value=\'everything\']', '.leftMenu').attr('checked','');
        $('.filter[name=\'color\']', '.leftMenu').attr('checked','');
        $('.filter[name=\'class\']').attr('disabled','');
    }
    // Set filter trigger
    $('.filter').change(function() {
        // Get the filters
        var filterType = $('.filter[name=\'type\']:checked', '.leftMenu').val();
        var filterClass = $('.filter[name=\'class\']:checked', '.leftMenu').val();
        var filterColorArray = [];
        $('.filter[name=\'color\']:checked', '.leftMenu').each(function(){ filterColorArray.push($(this).val()); });
        var filters = { 'type':filterType, 'class':filterClass, 'color':filterColorArray };
        // Store the current filters
        var filters = JSON.stringify(filters);
        localStorage.lastInventoryFilters = filters;
        nip_filterInventory(filters);
    });
    // Inventory to BBCode - Store Owner Tool
    var tobbcode = document.createElement('button');
    tobbcode.innerHTML = 'Convert to BBCode';
    tobbcode.setAttribute("class","minimal w250");
    tobbcode.setAttribute("type","button");
    tobbcode.setAttribute("position","absolute");
    tobbcode.onclick = function () {
        $.get("https://nordinvasion.com/character.php", function(response) {
            var $response = $(response);

            //loading items names from equipped items
            var slot0c = $response.find(".slot.sloti_0 select option[selected]").text();
            var slot1c = $response.find(".slot.sloti_1 select option[selected]").text();
            var slot2c = $response.find(".slot.sloti_2 select option[selected]").text();
            var slot3c = $response.find(".slot.sloti_3 select option[selected]").text();
            var slot4c = $response.find(".slot.sloti_4 select option[selected]").text();
            var slot5c = $response.find(".slot.sloti_5 select option[selected]").text();
            var slot6c = $response.find(".slot.sloti_6 select option[selected]").text();
            var slot7c = $response.find(".slot.sloti_7 select option[selected]").text();
            var slot9c = $response.find(".slot.sloti_9 select option[selected]").text();

            //getting pic/stats/name in inventory page
            var slot0 = "";
            var slot1 = "";
            var slot2 = "";
            var slot3 = "";
            var slot4 = "";
            var slot5 = "";
            var slot6 = "";
            var slot7 = "";
            var slot9 = "";
            var unequipped = "[table][tr]";

            var index = 0;
            var limit = 5;

            var blank = "[img height=150 width=150]http://www.transparenttextures.com/patterns/asfalt-light.png[/img]";

            $('div[class^="mkt_item"]').each(function () { //div[class^="mkt_item"]
                //weapon slot 0
                //alert($('a[class^="fb img-link"]', this).text());
                if($('span[class^="mkt_item_name"] span[class^="item"]', this).text() == slot0c){
                    slot0 = "[center][table][tr][td]"+ slot0c +"[/td][/tr][tr][td][img height=150 width=150]https://nordinvasion.com"+ $('a[class^="fb img-link"]', this).attr('href') +"[/img][/td][/tr][/table][/center]";
                }
                //weapon slot 1
                else if($('span[class^="mkt_item_name"] span[class^="item"]', this).text() == slot1c){
                    slot1 = "[center][table][tr][td]"+ slot1c +"[/td][/tr][tr][td][img height=150 width=150]https://nordinvasion.com"+ $('a[class^="fb img-link"]', this).attr('href') +"[/img][/td][/tr][/table][/center]";
                }
                //weapon slot 2
                else if($('span[class^="mkt_item_name"] span[class^="item"]', this).text() == slot2c){
                    slot2 = "[center][table][tr][td]"+ slot2c +"[/td][/tr][tr][td][img height=150 width=150]https://nordinvasion.com"+ $('a[class^="fb img-link"]', this).attr('href') +"[/img][/td][/tr][/table][/center]";
                }
                //support slot 3
                else if($('span[class^="mkt_item_name"] span[class^="item"]', this).text() == slot3c){
                    slot3 = "[center][table][tr][td]"+ slot3c +"[/td][/tr][tr][td][img height=150 width=150]https://nordinvasion.com"+ $('a[class^="fb img-link"]', this).attr('href') +"[/img][/td][/tr][/table][/center]";
                }
                //head armour slot 4
                else if($('span[class^="mkt_item_name"] span[class^="item"]', this).text() == slot4c){
                    slot4 = "[center][table][tr][td]"+ slot4c +"[/td][/tr][tr][td][img height=150 width=150]https://nordinvasion.com"+ $('a[class^="fb img-link"]', this).attr('href') +"[/img][/td][/tr][/table][/center]";
                }
                //body armour slot 5
                else if($('span[class^="mkt_item_name"] span[class^="item"]', this).text() == slot5c){
                    slot5 = "[center][table][tr][td]"+ slot5c +"[/td][/tr][tr][td][img height=150 width=150]https://nordinvasion.com"+ $('a[class^="fb img-link"]', this).attr('href') +"[/img][/td][/tr][/table][/center]";
                }
                //hand armour slot 6
                else if($('span[class^="mkt_item_name"] span[class^="item"]', this).text() == slot6c){
                    slot6 = "[center][table][tr][td]"+ slot6c +"[/td][/tr][tr][td][img height=150 width=150]https://nordinvasion.com"+ $('a[class^="fb img-link"]', this).attr('href') +"[/img][/td][/tr][/table][/center]";
                }
                //leg armour slot 7
                else if($('span[class^="mkt_item_name"] span[class^="item"]', this).text() == slot7c){
                    slot7 = "[center][table][tr][td]"+ slot7c +"[/td][/tr][tr][td][img height=150 width=150]https://nordinvasion.com"+ $('a[class^="fb img-link"]', this).attr('href') +"[/img][/td][/tr][/table][/center]";
                }
                //backup support slot 9
                else if($('span[class^="mkt_item_name"] span[class^="item"]', this).text() == slot9c){
                    slot9 = "[center][table][tr][td]"+ slot9c +"[/td][/tr][tr][td][img height=150 width=150]https://nordinvasion.com"+ $('a[class^="fb img-link"]', this).attr('href') +"[/img][/td][/tr][/table][/center]";
                }
                else {

                }
            });
            
            $('div[class^="mkt_item"]').each(function (i) {
                if(i < limit){
                    unequipped = unequipped + "[td][table][tr][td][size=8pt][color=red]"+ $('span[class^="mkt_item_name"]', this).text() + "[/color][/size][/td][/tr][tr][td][img height=150 width=150]https://nordinvasion.com"+ $('a[class^="fb img-link"]', this).attr('href') +"[/img][/td][/tr][/table][/td]";
                }
                else {
                    unequipped = unequipped + "[td][table][tr][td][size=8pt][color=red]"+ $('span[class^="mkt_item_name"]', this).text() + "[/color][/size][/td][/tr][tr][td][img height=150 width=150]https://nordinvasion.com"+ $('a[class^="fb img-link"]', this).attr('href') +"[/img][/td][/tr][/table][/td][/tr][/table][table][tr]";
                    limit = limit + 6;
                }                 
            });

            var HeadArmourSlot_Weapon1 =                "[tr][td]" + blank + "[/td][td]" + slot4 + "[/td][td]" + blank + "[/td][td]" + slot0 + "[/td][/tr]";
            var HandArmourSlot_BodyArmourSlot_Weapon2 = "[tr][td]" + slot6 + "[/td][td]" + slot5 + "[/td][td]" + blank + "[/td][td]" + slot1 + "[/td][/tr]";
            var LegArmourSlot_Weapon_3 =                "[tr][td]" + blank + "[/td][td]" + slot7 + "[/td][td]" + blank + "[/td][td]" + slot2 + "[/td][/tr]";
            var EquippedSupportSlot =                   "[tr][td]" + blank + "[/td][td]" + blank + "[/td][td]" + blank + "[/td][td]" + slot3 + "[/td][td]" + slot9 + "[/td][/tr]";
            var UnequippedItems =                       "[tr][td]" + blank + "[/td][/tr]" + unequipped + "[/tr][/table]";
            var credits =                               "[i]Generated by [url=http://forum.nordinvasion.com/index.php?topic=45474.0]NordInvasion#[/url] "+version;            

            if($('#checkbox').is(':checked')){
                var CompleteGear =                          "[center][table] " + HeadArmourSlot_Weapon1+HandArmourSlot_BodyArmourSlot_Weapon2+LegArmourSlot_Weapon_3+EquippedSupportSlot+UnequippedItems+credits + " [/table][/center]";
            } else {
                var CompleteGear =                          "[center][table] " + UnequippedItems+credits + " [/table][/center]";
            }


            $(tobbcode).after('<input type="text" value="' + CompleteGear + '"></input>');
        });
    };
    $(".rightContent").after(tobbcode, '<input id="checkbox" type="checkbox" name="Include character box" value="true" checked="checked"> Include character box');
}

// Filter the items on the inventory screen
function nip_filterInventory(filters) {
    filters = JSON.parse(filters);
    var filterType, filterClass, filterColor;

    // Convert the filters into classes
    if (filters['type'] === 'everything') filterType = '.mkt_item';
    else filterType = '.nip_' + filters['type'];

    if (filters['type'] === 'gear') {
        // Enable the class filters
        $('.filter[name=\'class\']').removeAttr('disabled');
        if (filters['class'] === 'everything') filterClass = '.mkt_item';
        else filterClass = '.nip_' + filters['class'];
    } else {
        // Disable the class filters
        $('.filter[name=\'class\']').attr('disabled','');
        filterClass = '.mkt_item';
    }
    filterColor = '.nip_' + filters['color'].join(',.nip_');

    // Hide everything and then display the appropriate items
    $('.mkt_item', '.rightContent').css('display','none');
    $(filterType, '.rightContent').filter(filterClass).filter(filterColor).css('display','block');
    // Reset the float clearing
    $('div[style=\'clear:both;\']', '.rightContent').remove();
    $('.mkt_item[style="display: block;"]', '.rightContent').each(function(index) {
        // Insert a clear after every three displayed items
        if ((index+1)%3 === 0) $(this).after('<div class="clear" style="clear:both;"></div>');
    });
}

// Manage Members - format the list and add member IDs
function nip_houseMembersIds() {
    // Loop through each <li> in the .list
    $('.list li').each(function(){
        // Determine each member's rank
        rank = $(this).text().match(/Leader|Captain|Sergeant|Soldier|Recruit/);
        // Check if an <a> exists; then extract the ID from the end of the url; else set the id as "NA" (not available)
        if ($('a', this).length)  var id = $('a', this).attr('href').match(/[0-9]*$/);
        else                      var id = 'NA';
        // Replace the old <li> with the new contents
        $(this).html(
            $(this).html().replace(rank,'<span class="rank" style="display: inline-block; width: 80px;">' + rank + '</span> - <span class="id" style="display: inline-block; width: 80px;">' + id + '</span>')
        );
        // Widen the first colum (some character names are quite long and there is free space)
        $('.label', this).attr('style','width: 250px;');
    });
}

// Appends a new class to the class string with proper spacing
function nip_appendList(list, newItem, delimiter) {
    // Set the default delimiter
    if (typeof(delimiter)==='undefined') delimiter = ',';
    // If the list is not empty, add the next item with a delimiter
    if (list) list = list + delimiter + newItem;
    // If the list is empty, just set the new item
    else list = newItem;
    // Return the new list
    return list;
}