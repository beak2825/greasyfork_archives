// ==UserScript==
// @name         NordInvasion#
// @namespace    https://nordinvasion.com
// @version      1.14.3
// @description  Extra functions for the NordInvasion website
// @author       Sylvius Roeles (Kaasovic)
// @include      https://nordinvasion.com/*
// @include      https://www.nordinvasion.com/*
// @downloadURL https://update.greasyfork.org/scripts/11064/NordInvasion.user.js
// @updateURL https://update.greasyfork.org/scripts/11064/NordInvasion.meta.js
// ==/UserScript==

var version = "1.11.2";
var j = 0;
var url = window.location.href;
var servers = [];
//$.post('/ajax/crafting.ajax.php',{act: 3, b: 47, c: 1},'json');
var recipes = ' \
{ "recipes" : [ \
{"name": "Rough Cloth", "recipe": [["Old Boots", 3]]}, \
{"name": "Scrap Metal", "recipe": [["Bent Sword", 3]]}, \
{"name": "Basic Wood", "recipe": [["Crooked Stick", 3]]}, \
{"name": "Steel", "recipe": [["Coal", 1],["Scrap Metal", 3]]}, \
{"name": "Assorted Ammunition", "recipe": [["Basic Wood", 8],["Scrap Metal", 5]]}, \
{"name": "Black Steel", "recipe": [["Shade Ore", 1],["Steel", 2]]}, \
{"name": "Handle", "recipe": [["Hardened Metal", 2],["Heavy Cloth", 1],["Sturdy Wood", 1]]}, \
{"name": "Flemish String", "recipe": [["Heavy Cloth", 2],["Spurn Berry", 1],["Sturdy Wood", 1]]}, \
{"name": "Blade Shard", "recipe": [["Quality Charcoal", 1],["Hardened Metal", 3]]}, \
{"name": "Basic Leather", "recipe": [["Rough Cloth", 3]]}, \
{"name": "Woven Steel", "recipe": [["Basic Leather", 3],["Steel", 1]]}, \
{"name": "Silk", "recipe": [["Fine Needle", 1],["Heavy Cloth", 3],["Hydra Leaf", 1]]}, \
{"name": "Strap", "recipe": [["Fine Needle", 1],["Heavy Cloth", 3]]}, \
{"name": "Armour Plate", "recipe": [["Quality Charcoal", 1],["Hardened Metal", 3]]}, \
{"name": "Bone Powder", "recipe": [["Bone Shard", 2]]}, \
{"name": "Antiseptic Cloth", "recipe": [["Nem Flower", 5],["Worm Root", 5],["Rough Cloth", 3]]}, \
{"name": "Mixed Glue", "recipe": [["Hydra Leaf", 2],["Spurn Berry", 1],["Bone Powder", 3]]}, \
{"name": "Mystic Charm", "recipe": [["Nem Flower", 3],["Sparkly Necklace", 3]]}, \
{"name": "Small Gold Bar", "recipe": [["Quality Candle", 10],["Small Lump of Lead", 5]]}, \
{"name": "Oil", "recipe": [["Hardened Metal", 2],["Spurn Berry", 5],["Sturdy Wood", 1]]}, \
{"name": "Dye", "recipe": [["Quality Candle", 1],["Nem Flower", 3],["Sturdy Wood", 2]]}, \
{"name": "Bone Dust", "recipe": [["Quality Candle", 1],["Wolf Teeth Necklace", 2],["Worm Root", 1]]}, \
{"name": "Large Gold Bar", "recipe": [["Quality Candle", 10],["Quality Charcoal", 10],["Silk", 2],["Small Gold Bar", 5]]}, \
{"name": "Ink of Life", "recipe": [["Quality Candle", 8],["Hydra Leaf", 5],["Water of Hvergelmir", 5],["Bone Dust", 10],["Dye", 10],["Large Gold Bar", 1]]}, \
{"name": "Gunpowder", "recipe": [["Quality Candle", 5],["Quality Grindstone", 15],["Sulphur", 5],["Bone Dust", 10]]}, \
{"name": "Skull Fragment", "recipe": [["Black Steel", 1],["Bone Dust", 10]]}, \
{"name": "Oil of Velentr", "recipe": [["Water of Hvergelmir", 1],["Oil", 2]]}, \
{"name": "Chain", "recipe": [["Chain Link", 3]]}, \
{"name": "Perfected Metal", "recipe": [["Coal", 3],["Hardened Metal", 5],["Heavy Cloth", 10],["Shade Ore", 10],["Sulphur", 1],["Black Steel", 2],["Chain", 3],["Construction Tools", 5]]}, \
{"name": "Construction Tools", "recipe": [["Basic Leather", 3],["Scrap Metal", 1]]}, \
{"name": "Processed Wood", "recipe": [["Basic Wood", 3]]}, \
{"name": "Brass Bar", "recipe": [["Copper Bar", 1],["Zinc Shard", 1]]}, \
{"name": "Wooden Slat", "recipe": [["Quality Charcoal", 2],["Sturdy Wood", 5],["Construction Tools", 5],["Processed Wood", 10]]}, \
{"name": "Plate Mail", "recipe": [["Armour Plate", 3],["Chain", 10]]}, \
{"name": "Hardened Leather", "recipe": [["Basic Leather", 20],["Silk", 5]]} \
]}';
recipes = JSON.parse(recipes);

$(document).ready(function () {
    //le scrt coedu
    var kkeys = [], scrt = "38,38,40,40,37,39,37,39,66,65";
    $(document).keydown(function(e) {
        kkeys.push( e.keyCode );
        if ( kkeys.toString().indexOf( scrt ) >= 0 ) {
            $(document).unbind('keydown',arguments.callee);
            $('body').empty();
            $('body').append('<iframe style="position: fixed; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%);" width="560" height="315" src="https://www.youtube.com/embed/0bfuQWCqkcg?autoplay=1" frameborder="0" allowfullscreen></iframe>');
        }
    });
    $("#title a img").attr("src", "//i.imgur.com/UiKiQTu.png"); //Pepe trademark
    if($(document).width() > 1400){
        ReloadQuestTracker();
    }

    $('#nav a[href*="/auction_hall.php"]').attr('href', localStorage.getItem("auctionHallLatestLink") || '/auction_hall.php');

    // If any logged on page is loaded...
    if ($('#playerListForm').length) {
        // Add empty element for options.
        $('body').append('<div id="nipOptions" style="display:none;text-align:center;"></div>');
        // Add Inventory to the Character menu
        $('#nav ul li:first').append('<ul><li><a href="/marketplace.php?b=0&mode=inventory">Inventory</a></li><li><a href="/character.php?mode=ServerBrowser">Server Browser</a></li></ul>').next().append('<ul><li><a href="/crafting.php?mode=project">Project</a></li></ul>');
        //$('#nav ul li:first').append('<ul><li><a href="/character.php?mode=serverBrowser">Server Browser</a></li></ul>');
        // Add the NI+ server list button to the navigation bar.
        $('#nav ul li.extras ul').append('<li id="nipServers"><a href="/server-links.html" target="_blank">Servers</a></li>');
        // Wait for a click event
        $('#nipMenu > a').click(function(){
            nip_displayOptions();
        });

        //Handy shortcuts
        $("#nav ul li:eq(8)").append('<ul><li><a href="/house_crafting.php">House Crafting</a></li><li><a href="/house.php?hp=invite">Invite Player</a></li><li><a href="/house_events.php">Schedule Event</a></li></ul>');
        //Handy shortcuts end

        //QuestAlerter
        $.ajax({
            url: 'https://nordinvasion.com/quests.php',
            type: "GET",
            success: function (data) {
                var html = $(data).find('.leftMenu ul form button').html();
                if (html != null) {
                    $('img[src="/images/page_white_text.png"]').attr('src', '/images/new.png');
                    $('#notifications').append('<div class="update_msg"><a href="/quests.php"><i class="fa fa-envelope"></i>You have quests available! Click here to accept all quests.</a><a class="right"></a></div>');
                    //$('#quick_login').css({"height": "auto", "width": "352px"});
                }
            }
        });
        if (url.indexOf("quests.php") != -1) { //accept all quests
            var html = $('body').find('.leftMenu ul form button').html();
            if (html != null) {
                $('.minimal.w150').click();
            }
            QuestTrackerCheckBoxes();
        }
        //QuestAlerter END
    }

    // If Crafting is loaded...
    if (url.match(/\/(house_|)crafting\.php/)) {
        nip_craftingRecipeFilter();
        //auto craft
        $('#craftable').append(
            '<div class="seperator" style="margin-top: 30px;margin-bottom: 30px;"></div><ul class="list"><li><div id="autocraft"> Craft Amount: <input style="margin-left:10px;margin-right:10px; height:22px;" id="craft_times" type="text" name="craft_times"></div></li></ul>');
        //Auto craft button
        AutoCraft();
        //Max button
        MaxCraft();
        if(url.indexOf("crafting.php?b=") != -1){
            $('ul.list:first').before('<a href="#" class="craftingBreakdown">Click here to view all the materials needed for this recipe.</a>');
            Recipe_To_Project_Code();
        }
        $('#craftable').after('<ul class="list"><li><div>Crafting number: <span id="times_crafted"></span></div></li></ul');
        var temp = 0;
        $('#begin_craft').click(function () {
            temp++;
            $('#times_crafted').text(temp);
        });
        //auto craft end
    }
    if (url.match(/\/(house_|)crafting\.php\?mode=project/)) {
        craftingProjectInit();
    }
    // If Marketplace / Sell is loaded...
    if (url.match(/\/marketplace\.php\?b=0\&mode=inventory/)) {
        nip_marketSellToInventory();
    }
    // If Manage Players is loaded...
    if (url.match(/\/house\.php\?hp=manage_members/)) {
        nip_houseMembersIds();
    }

    // Calculate the lowest value of a item
    if (url.indexOf("auction_hall") !== -1 && url.indexOf("a=s") === -1) {
        //Sort Entries button
        let ahSortByFilter = 'default';
        let storedAhSortByFilter = localStorage.getItem('sortByFilter');
        if(storedAhSortByFilter)
            ahSortByFilter = storedAhSortByFilter;

        $('.ahHeader').children('.cell5collapse.right').append(
            '<select id="ahSortBy" style="margin-left: 5px">' +
            '<option value="default"' + (storedAhSortByFilter === 'default' ? 'selected' : '') +'>Sort By</option>' +
            '<option value="price+asc"' + (storedAhSortByFilter === 'price+asc' ? 'selected' : '') +'>Price Ascending</option>' +
            '<option value="price+desc"' + (storedAhSortByFilter === 'price+desc' ? 'selected' : '') +'>Price Descending</option>'+
            '<option value="rarity+asc"' + (storedAhSortByFilter === 'rarity+asc' ? 'selected' : '') +'>Item Rarity Ascending</option>'+
            '<option value="rarity+desc"' + (storedAhSortByFilter === 'rarity+desc' ? 'selected' : '') +'>Item Rarity Descending</option>'+
            '</select>'
        );

        function isMoreRare(a, b) {
            let rarities = [
                'item m',
                'item e',
                'item pc',
                'item pcp',
                'item hc',
                'item l',
                'item lp',
                'item lpp',
            ];
            return rarities.indexOf(a) > rarities.indexOf(b);
        };

        let ahHeader = $('#ahListings').children('.ahHeader');

        function orderByPrice(order) {
            let $divs = $("div.ahEntry:not(.ahHeader)");
            let numericallyOrderedDivs = $('#ahListings');

            if(order === 'desc') {
                numericallyOrderedDivs = $divs.detach().sort(function(a,b){
                    return parseInt($(a).find("span.gold").text().replace(/,/g, "")) < parseInt($(b).find("span.gold").text().replace(/,/g, "")) ? 1 : -1;
                });
            } else {
                numericallyOrderedDivs = $divs.detach().sort(function(a,b){
                    return parseInt($(a).find("span.gold").text().replace(/,/g, "")) > parseInt($(b).find("span.gold").text().replace(/,/g, "")) ? 1 : -1;
                });
            }
            $("#ahListings").html([ahHeader, numericallyOrderedDivs]);
        }

        function orderByRarity(order) {
            let $divs = $("div.ahEntry:not(.ahHeader)");
            let numericallyOrderedDivs = $('#ahListings');

            if(order === 'desc') {
                numericallyOrderedDivs = $divs.detach().sort(function(a,b){
                    return !isMoreRare($(a).find("span.inline").attr('class').replace("inline ", ""), $(b).find("span.inline").attr('class').replace("inline ", "")) ? 1 : -1;
                });
            } else {
                numericallyOrderedDivs = $divs.detach().sort(function(a,b){
                    return isMoreRare($(a).find("span.inline").attr('class').replace("inline ", ""), $(b).find("span.inline").attr('class').replace("inline ", "")) ? 1 : -1;
                });
            }
            $("#ahListings").html([ahHeader, numericallyOrderedDivs]);
        }

        function sortByValue(val, shouldRefresh = false) {
            if(shouldRefresh && val === "default")
                window.location.reload();

            if(val === "default")
                return;

            if(val === 'price+asc') {
                orderByPrice('asc');
            } else if (val === 'price+desc') {
                orderByPrice('desc');
            } else if (val === 'rarity+asc') {
                orderByRarity('asc');
            } else if (val === 'rarity+desc') {
                orderByRarity('desc');
            }
        }

        $('body').on('change', '#ahSortBy', function(event) {
            let val = this.value;
            localStorage.setItem('sortByFilter', val);
            sortByValue(val, true);
        });

        $.urlParam = function(name){
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            if (results==null) {
                return null;
            }
            return decodeURI(results[1]) || 0;
        }

        function getForPagesInRange(nextPageUrl, currentPage, items){
            localStorage.setItem('ahResultsPerPage', items);
            $('.ahCloned').remove();
            let newNextPage = currentPage + (items/20);
            let newPrevPage = currentPage - (items/20);
            let url = nextPageUrl.replace(/p=[0-9]+/g, "");
            $('#ahPages > a:contains("Next")').attr('href', url + 'p=' + newNextPage);
            if(newPrevPage > 0){
                $('#ahPages > a:contains("Prev")').attr('href', url + 'p=' + newPrevPage);
            } else {
                $('#ahPages > a:contains("Prev")').attr('href', url + 'p=0');
            }

            let isLoading = true;

            for(let i = currentPage + 1; i < newNextPage; i++) {
                $.get(url + 'p=' + i,{i: i, newNextPage: newNextPage}, function(data) {
                    $('#ahListings').append($(data).find('#ahListings').children('.ahEntry:not(".ahHeader")').addClass('ahCloned'));
                    let events = $._data( $(".ahEntry:not('.ahCloned') .ahBuy")[0], "events" );
                    $('.ahCloned .ahBuy:not(".eventAdded")').each(function() {
                        var t = $(this);
                        $.each(events, function(index, event) {
                            $.each(event, function(i, v) {
                                t.bind(v.type, v.handler);
                            });
                        });
                        $(t).addClass('eventAdded');
                    });

                    events = $._data( $(".ahEntry:not('.ahCloned') .toggle")[0], "events" );
                    $('.ahCloned .toggle:not(".eventAdded")').each(function() {
                        var t = $(this);
                        $.each(events, function(index, event) {
                            $.each(event, function(i, v) {
                                t.bind(v.type, v.handler);
                            });
                        });
                        $(t).addClass('eventAdded');
                    });
                    if(i+1 === newNextPage && localStorage.getItem('sortByFilter')) {
                        setTimeout(function() {
                            sortByValue(localStorage.getItem('sortByFilter'));
                        }, 100);
                    }
                });
            }
        }
        let ahResultsPerPage = '20';
        let storedResultsPerPage = localStorage.getItem('ahResultsPerPage');
        if(storedResultsPerPage)
            ahResultsPerPage = storedResultsPerPage;

        $('#ahPages').prepend(
            '<label for="ahResultsPerPage">Results per page:</label>' +
            '<select id="ahResultsPerPage">' +
            '<option value="20"' + (ahResultsPerPage.toString() === '20' ? 'selected' : '') + '>20</option>' +
            '<option value="40"' + (ahResultsPerPage.toString() === '40' ? 'selected' : '') + '>40</option>' +
            '<option value="60"' + (ahResultsPerPage.toString() === '60' ? 'selected' : '') + '>60</option>'+
            '<option value="80"' + (ahResultsPerPage.toString() === '80' ? 'selected' : '') + '>80</option>'+
            '<option value="100"' + (ahResultsPerPage.toString() === '100' ? 'selected' : '') + '>100</option>'+
            '</select>'
        );

        let nextPageUrl = $('#ahPages > a').attr('href');

        if(ahResultsPerPage) {
            getForPagesInRange(nextPageUrl, parseInt($.urlParam('p') || 0), ahResultsPerPage);
        }

        $('body').on('change', '#ahResultsPerPage', function(event) {
            let val = this.value;
            switch(val) {
                case '40':
                    getForPagesInRange(nextPageUrl, parseInt($.urlParam('p') || 0), 40);
                    break;
                case '60':
                    getForPagesInRange(nextPageUrl, parseInt($.urlParam('p') || 0), 60);
                    break;
                case '80':
                    getForPagesInRange(nextPageUrl, parseInt($.urlParam('p') || 0), 80);
                    break;
                case '100':
                    getForPagesInRange(nextPageUrl, parseInt($.urlParam('p') || 0), 100);
                    break;
                default:
                case '20':
                    getForPagesInRange(nextPageUrl, parseInt($.urlParam('p') || 0), 20);
                    break;
            }
        });

        $('.ahFilterApply').removeAttr('onclick');
        $('body').on('click', '.ahFilterApply', function() {
            let categoryParam = $('#ahFiltersMain').children('.ahFilterCategoryValue')[0].value;
            let usableParam = $('#ahFiltersMain').children('.ahFilterUsableValue')[0].value;
            //let ahSearchParam = $('#ahFiltersMain').children('.ahSearch').children('input')[0].value;

            let link = '/auction_hall.php?';

            let params = $.param({
                //q : ahSearchParam,
                c : categoryParam,
                u : usableParam,
            });

            localStorage.setItem("auctionHallLatestLink", link + params);
            $('#ahFiltersMain').submit();
        });
    } else if(url.indexOf("auction_hall") !== -1 && url.indexOf("a=s") !== -1) {
        //lowest price calculator
        LowestPriceCalc();
        //Product of Interest
        ProductOfInterest();
    }

    // Allows loading and storing of characters to invite them to a house
    if (url.indexOf("house.php?hp=invite") != -1) {
        EasyInvite();
    }
    // If a trade is open add it to the trade history
    if (url.indexOf("trading.php?t=") != -1) {
        // add all button (trading)
        CreateButton('Add All', "minimal w100", 'button', -1, "margin-right: 20px;", '.table2.m13').onclick = function () {
            $('.row').each(function () {
                $('button[value^="add_items"]', this).click();
            });
        };
        // add add all materials
        CreateButton('Add Materials', "minimal w100", 'button', -1, -1, '.table2.m13').onclick = function () {
            $('.row:first button[value^="add_items"]').click();
            $('.row:has(span[class^=material])').each(function () {
                $('button[value^="add_items"]', this).click();
            });
        };
    }
    // server browser:
    if (url.match(/\/character\.php\?mode=ServerBrowser/)) {
        ServerBrowserPreStuff();
        //begin retrieving the server list at nordinvasion.com/server-links.html
        ServerBrowserInit();
    }
    //Character Presets
    if (url.indexOf("character.php") != -1) {
        //Store presets code \|/
        $('.centered.charBtn:first').before('<button type="button" class="add_preset minimal w100 tm9" style="float: left;">Add preset</button>');
        $('.centered.charBtn:last').before('<button role="cavalry" type="button" class="add_preset minimal w100 tm9" style="float: left;">Add preset</button>');
        $('.add_preset').on( 'click', function () {
            let preset_role = $(this).attr('role') ? $(this).attr('role') : '';
            $(this).closest('div').find('.charBtn').after('<div id="MessageBox"><p>Name your preset: </p><input id="preset_name" type="text"></br><button id="confirm_preset" type="button" class="minimal w100">Confirm preset</button></div>');
            $('#confirm_preset').on( 'click', function () {

                localStorage.setItem($('#preset_name').val() + " " + $("#playerListText option:selected").text(), preset_role === 'cavalry' ? $('#cavSlots').serialize() : $('#infSlots').serialize());

                if (localStorage.getItem($("#playerListText option:selected").text() + " presets" + preset_role)) {
                    localStorage.setItem($("#playerListText option:selected").text() + " presets" + preset_role, localStorage.getItem($("#playerListText option:selected").text() + " presets" + preset_role) + " %&% " + $('#preset_name').val());
                } else {
                    localStorage.setItem($("#playerListText option:selected").text() + " presets" + preset_role, $('#preset_name').val());
                }
                alert($('#preset_name').val()+' has been saved.');
                location.reload();
            });
        });

        //Store presets code end || start of loading presets \|/

        var presetsInf = localStorage.getItem($("#playerListText option:selected").text() + " presets") ? localStorage.getItem($("#playerListText option:selected").text() + " presets").split(" %&% ") : [];
        var presetsCav = localStorage.getItem($("#playerListText option:selected").text() + " presetscavalry") ? localStorage.getItem($("#playerListText option:selected").text() + " presetscavalry").split(" %&% ") : [];
        for (var i = 0; i < presetsInf.length; i++) {
            if(presetsInf[i] != undefined && presetsInf[i] != null && presetsInf[i] != ''){
                $('.halfpane.lineleft:first h3:first').after('<button name="nis_preset" style="margin-left: 10px; margin-bottom: 10px;" class="minimal w100" id="'+ presetsInf[i] +'" type="button" class="minimal w100">'+ presetsInf[i] +'</button> <a class="clearitm" id="'+presetsInf[i]+ '">X</a>');
            }
        }
        for (i = 0; i < presetsCav.length; i++) {
            if(presetsCav[i] != undefined && presetsCav[i] != null && presetsCav[i] != ''){
                $('.halfpane.lineleft:first h3:last').after('<button name="nis_preset" style="margin-left: 10px; margin-bottom: 10px;" class="minimal w100" id="'+ presetsCav[i] +'" type="button" class="minimal w100">'+ presetsCav[i] +'</button> <a class="clearitm" role="cavalry" id="'+presetsCav[i]+ '">X</a>');
            }
        }
        $('.centered.charBtn:first').before('<button id="preview_gear" type="button" class="minimal w100 tm9" style="float: right;">Preview Gear</button>');
        $('#preview_gear').on( 'click', function () {
            if(!$('#gear_preview_box').length){
                $('#container').css('opacity',0.7);
                $('#container').before('<div id="gear_preview_box" style="z-index: 1; width:500px; height:500px; position: fixed; background: url(/images/ni_back.jpg) no-repeat; top: 50%; left: 50%; margin-top: -250px; margin-left: -250px;"></div>');
                $('#gear_preview_box').append('<button id="clear_preview_gear" type="button" class="minimal w100 tm9" style="float: right; width: 20px;">X</button>');
                $('#clear_preview_gear').on( 'click', function () {
                    $('#container').css('opacity',1);
                    $('#gear_preview_box').remove();
                });
                var weapon1 = $('select[name=slot_0]:first option:selected').text();
                var weapon2 = $('select[name=slot_1]:first option:selected').text();
                var weapon3 = $('select[name=slot_2]:first option:selected').text();
                var head    = $('select[name=slot_4]:first option:selected').text();
                var body    = $('select[name=slot_5]:first option:selected').text();
                var hand    = $('select[name=slot_6]:first option:selected').text();
                var boot    = $('select[name=slot_7]:first option:selected').text();
                var item_colours = [$('select[name=slot_0]:first option:selected').css("color"),$('select[name=slot_1]:first option:selected').css("color"),$('select[name=slot_2]:first option:selected').css("color"),
                                    $('select[name=slot_4]:first option:selected').css("color"),$('select[name=slot_5]:first option:selected').css("color"),$('select[name=slot_6]:first option:selected').css("color"),
                                    $('select[name=slot_7]:first option:selected').css("color")];
                var place_holder = "[td][img=180x150]https://www.transparenttextures.com/patterns/asfalt-light.png[/img][/td]";
                $.ajax({
                    url: 'https://nordinvasion.com/marketplace.php?b=0&mode=inventory',
                    type: "GET",
                    success: function (data) {
                        data = $(data).find('.rightContent').html();
                        weapon1 = $(data).filter('div[class="mkt_item_outter"]:contains("'+weapon1+'")').html();
                        weapon2 = $(data).filter('div[class="mkt_item_outter"]:contains("'+weapon2+'")').html();
                        weapon3 = $(data).filter('div[class="mkt_item_outter"]:contains("'+weapon3+'")').html();
                        head    = $(data).filter('div[class="mkt_item_outter"]:contains("'+head+'")').html();
                        body    = $(data).filter('div[class="mkt_item_outter"]:contains("'+body+'")').html();
                        hand    = $(data).filter('div[class="mkt_item_outter"]:contains("'+hand+'")').html();
                        boot    = $(data).filter('div[class="mkt_item_outter"]:contains("'+boot+'")').html();
                        var gear = [weapon1, weapon2, weapon3, head, body, hand, boot];
                        var gear_picture_only = [];
                        var bbcode = [];
                        jQuery.each( gear, function( i, val ) {
                            let image;
                            if(val != undefined || val != null){
                                if ($(val).find('a[class^="fb img-link"]').attr('href') != undefined){
                                    img = $(val).find('a[class^="fb img-link"]').attr('href');
                                    gear_picture_only.push("<img src='https://nordinvasion.com" + img + "' style='height: 75px; width: 90px;'/>");
                                }
                                else {
                                    img = "/images/items/thumb/unknown.png";
                                    gear_picture_only.push("<img src='https://nordinvasion.com" + img + "'/>");
                                }
                                bbcode.push("[td][size=small][color="+rgb2hex(item_colours[i])+"]"+ $(val).find('span[class^="mkt_item_name"]').text() + "[/color][/size]\n[img=180x150]https://nordinvasion.com"+ img +"[/img][/td]");
                            } else {
                                bbcode.push(place_holder);
                                gear_picture_only.push("<img href='https://www.transparenttextures.com/patterns/asfalt-light.png' style='height: 75px; width: 90px;'/>");
                            }
                        });
                        $('#gear_preview_box').append("<table><tr><td>"+ gear_picture_only[0] + "</td><td><img href='https://www.transparenttextures.com/patterns/asfalt-light.png' style='height: 75px; width: 90px;'/></td><td>"+gear_picture_only[3]+"</td></tr>\
<tr><td>"+ gear_picture_only[1] + "</td><td><img href='https://www.transparenttextures.com/patterns/asfalt-light.png' style='height: 75px; width: 90px;'/></td><td>"+gear_picture_only[4]+"</td><td>"+gear_picture_only[5]+"</td></tr>\
<tr><td>"+ gear_picture_only[2] + "</td><td><img href='https://www.transparenttextures.com/patterns/asfalt-light.png' style='height: 75px; width: 90px;'/></td><td>"+gear_picture_only[6]+"</td></tr></table>");
                        $('#gear_preview_box').append('<textarea id="gear_ni" type="text" style="height: 245px; width: 100%;" value=""></textarea>');
                        $('#gear_ni').val("[table][tr]" + bbcode[0] + place_holder + bbcode[3] + "[/tr] \
[tr]" + bbcode[1] + place_holder + bbcode[4] + bbcode[5] +"[/tr] \
[tr]" + bbcode[2] + place_holder + bbcode[6] + "[/tr][/table]");
                    }
                });
            }
        });
    }
});

// Crafting - Filter the recipes displayed
function nip_craftingRecipeFilter() {
    // Set classes for recipe filtering
    $('.leftMenu a').each(function(){
        var blueprintTitle = $(this).text();
        var classStr;
        // If profession header, do not add class
        if (blueprintTitle.match(/Blacksmith|Armorsmith|Alchemist|Defender|Attacker|Support/)) return;
        // Determine the appropriate class to each link
        if (blueprintTitle.match(/\(.*All|Inf|Sgt|Commando|Legion|Guard|Zwei|Juggernaut.*\)/)) classStr = nip_appendList(classStr, 'infantry', ' ');
        if (blueprintTitle.match(/\(.*All|Archer|Long|Sniper|Warden|Sentinel|Ranger|Sentry.*\)/)) classStr = nip_appendList(classStr, 'archer', ' ');
        if (blueprintTitle.match(/\(.*All|Cross|Man at Arms|Sharp|Marksman|Aventurier|Pavise|Repeater.*\)/)) classStr = nip_appendList(classStr, 'crossbowman', ' ');
        if (blueprintTitle.match(/\(.*All|Militia|Skirm|Pike|Halb|Peltast|Marauder|Hoplite.*\)/)) classStr = nip_appendList(classStr, 'skirmisher', ' ');
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
            if ($(this).text().match(/Everyone|Archer|Longbowman|Sniper|Warden|Sentinel|Ranger|Sentry/)) $(this).addClass('nip_archer');
            if ($(this).text().match(/Everyone|Infantry|Sergeant|Commando|Royal Guard|Zweihander|Legionnaire|Juggernaut/)) $(this).addClass('nip_infantry');
            if ($(this).text().match(/Everyone|Crossbowman|Man at Arms|Sharpshooter|Chosen Marksman|Adventurier|Pavise Champion|Repeaterman/)) $(this).addClass('nip_crossbowman');
            if ($(this).text().match(/Everyone|Militia|Skirmisher|Pikeman|Master Peltast|Halberdier|Marauder|Hoplite/)) $(this).addClass('nip_pikeman');
            if ($(this).text().match(/Apprentice|Engineer|Nurse|Medic|Surgeon/)) $(this).addClass('nip_support');
        }
        if ($('.item.e', this).text()) $(this).addClass('nip_collectibles');
        else if ($('.item.m', this).text()) $(this).addClass('nip_marketplace');
        else if ($('.item.pc', this).text()) $(this).addClass('nip_green');
        else if ($('.item.pcp', this).text()) $(this).addClass('nip_teal');
        else if ($('.item.hc', this).text()) $(this).addClass('nip_house');
        else if ($('.item.l', this).text()) $(this).addClass('nip_orange');
        else if ($('.item.lp', this).text()) $(this).addClass('nip_red');
        else if ($('.material.lp', this).text()) $(this).addClass('nip_material_2');
        else if ($('.material.lp0', this).text()) $(this).addClass('upgraded_leg');
        else if ($('.material.c', this).text()) $(this).addClass('nip_material_hc');
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
<input class="filter" type="checkbox" name="color" value="collectibles"><span class="item e">Collectibles</span><br />\
<input class="filter" type="checkbox" name="color" value="marketplace"><span class="item m">Marketplace</span><br />\
<input class="filter" type="checkbox" name="color" value="green"><span class="item pc">Green craftables</span><br />\
<input class="filter" type="checkbox" name="color" value="teal"><span class="item pcp">Teal craftables</span><br />\
<input class="filter" type="checkbox" name="color" value="house"><span class="item hc">House craftables</span><br />\
<input class="filter" type="checkbox" name="color" value="orange"><span class="item l">Legendaries</span><br />\
<input class="filter" type="checkbox" name="color" value="red"><span class="item lp">Rare Legendaries</span><br />\
<input class="filter" type="checkbox" name="color" value="upgraded_leg"><span class="item lpp">Upgraded Legendaries</span><br />\
<input class="filter" type="checkbox" name="color" value="material_2"><span class="material lp">Rare materials</span><br />\
<input class="filter" type="checkbox" name="color" value="material_hc"><span class="material c">Crafted materials</span><br />\
<input class="filter" type="checkbox" name="color" value="normal">Other<br />\
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
        filters = JSON.stringify(filters);
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
        if(!$("#gear_ni").length){
            $(tobbcode).after('<textarea id="gear_ni" type="text" style="height: 400px; width: 100%;" value=""></textarea>');
        }
        $("#gear_ni").val("[align=center][table][tr]");
        var unequipped = "";

        var index = 0;
        var limit = 5;

        $('div[class="mkt_item_outter"]:not(:has(div:not(:visible)))').each(function (i) {
            if(i < limit){
                let img;
                if ($('a[class^="fb img-link"]', this).attr('href') != undefined){
                    img = $('a[class^="fb img-link"]', this).attr('href');
                }
                else {
                    img = "/images/items/thumb/unknown.png";
                }
                $("#gear_ni").val($("#gear_ni").val() + "\n[td][size=small][color="+rgb2hex($('span[class^="mkt_item_name"] span', this).css("color"))+"]"+ $('span[class^="mkt_item_name"]', this).text() + "[/color][/size]\n[img=180x150]https://nordinvasion.com"+ img +"[/img][/td]");
            }
            else {
                if ($('a[class^="fb img-link"]', this).attr('href') != undefined){
                    let img = $('a[class^="fb img-link"]', this).attr('href');
                }
                else {
                    let img = "/images/items/thumb/unknown.png";
                }
                $("#gear_ni").val($("#gear_ni").val() + "\n[td][size=small][color="+rgb2hex($('span[class^="mkt_item_name"] span', this).css("color"))+"]"+ $('span[class^="mkt_item_name"]', this).text() + "[/color][/size]\n[img=180x150]https://nordinvasion.com"+ img +"[/img][/td][/tr][tr]");
                limit = limit + 6;
            }
        });

        var credits = "[i]Generated by [url=http://forum.nordinvasion.com/showthread.php?tid=41761]NordInvasion#[/url] "+version+ "[/i]";

        $("#gear_ni").val($("#gear_ni").val() + "[/tr][/table][table][tr][td]"+credits + "[/td][/tr][/table][/align]");
    };
    $(".rightContent").after(tobbcode);
}

function nis_ServerBrowser() {
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
    $('.clear').remove();
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

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function CreateButton(name, class_, type, height, style, append){
    var button = document.createElement('button');
    if(name != -1)
        button.innerHTML = name;
    if(class_ != -1)
        button.setAttribute("class", class_);
    if(type != -1)
        button.setAttribute("type", type);
    if(height != -1)
        button.setAttribute("height", height);
    if(style != -1)
        button.setAttribute("style", style);
    if(append != -1)
        $(append).append(button);
    return button;
}

function AutoCraft(){
    //Auto craft button
    CreateButton('Auto Craft', "minimal w100 ui-button ui-widget ui-state-default ui-corner-all", "button", "25px", -1, '#autocraft').onclick = function () {
        var times_crafted = 0;
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
}

function MaxCraft(){
    CreateButton('Max', "minimal w100 ui-button ui-widget ui-state-default ui-corner-all", "button", "25px", "margin-left: 10px", '#autocraft').onclick = function () {
        //calculating max amount of crafting
        var times_crafted = 0;
        var lowest = new Array();
        $("ul.list:first li").each(function () {
            var value = $("span[style^='font-weight:']:first", this).text() / $("span[id^='req_']:first", this).text();
            if($.isNumeric(value)){
                lowest.push(value);
            }
        });
        lowest = lowest.filter(function(n){ return n != undefined; });
        var lownr = Math.min.apply(Math, lowest);
        document.getElementById('craft_times').value = Math.floor(lownr);
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
}

function LowestPriceCalc(){
    if(url.match(/\/auction_hall\.php\?a=s/)){
        var playerGold = parseInt($('#playerGoldValue').text().replace(/,/g, ""));
        var predictedWealth = [];
        predictedWealth.push(playerGold);
        $('#playerGold').append('<br> Predicted Wealth: <br><div id="predictedWealth"></div>');

        jQuery("#ahListings div.ahEntry").each(function () {
            var itm = jQuery('span[class*="material"]', this).text() + jQuery('span[class*="item"]', this).text();
            var itm_id = jQuery(this).attr('id');
            var lowest = new Array();
            var userAmount = parseInt(jQuery('.ahQuantity', this).text());
            $.ajax({
                url: 'https://nordinvasion.com/auction_hall.php?q=' + itm.replace(/\s+/g, '+').toLowerCase() + '&u=0',
                type: "GET",
                success: function (data) {
                }
            }).done(function(data){
                var html = $(data).find('#ahListings').html();
                $(html).filter("div.ahEntry").each(function () {
                    if (jQuery('span[class*="material"]', this).text() == itm || jQuery('span[class*="item"]', this).text() == itm) {
                        var strValue = jQuery("span.gold", this).text();
                        strValue = strValue.replace(/,/g, "");
                        lowest.push(strValue);
                    }
                });
                var lownr = Math.min.apply(Math, lowest);
                if(lownr > 0 && isFinite(lownr)){
                    jQuery('#' + itm_id).find('span[class^="ahStatus"]').text("low: " + lownr);
                } else{
                    jQuery('#' + itm_id).find('span[class^="ahStatus"]').text("low: No Data");
                }
                var gold = jQuery('#' + itm_id).find('span.gold').text();
                gold = gold.replace(/,/g, '');
                if (lownr < gold) {
                    jQuery('#' + itm_id).find('span.gold').css("color", "red");
                } else if (lownr == gold) {
                    jQuery('#' + itm_id).find('span.gold').css("color", "green");
                }

                if(isNaN(parseInt(lownr))) lownr = 0;
                if(isNaN(parseInt(userAmount))) userAmount = 0;
                predictedWealth.push(parseInt(userAmount) * parseInt(lownr));
                var predictedWealthSum = 0;
                for(var i = 0; i < predictedWealth.length; i++){
                    predictedWealthSum += parseInt(predictedWealth[i]);
                }
                $('#predictedWealth').html(addCommas(predictedWealthSum));
            });
        });
    }
}

function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function ProductOfInterest(){
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
                let itemname = document.getElementById('item_name').value;
                localStorage.product = localStorage.product + "<li>"+itemname+" <a class='clearitm' id='"+itemname+"'>X</a></li>";
                location.reload();
            } else {
                let itemname = document.getElementById('item_name').value;
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
        if(localStorage.getItem("product") != null && localStorage.getItem("product") != ""){
            jQuery("div.ahEntry").each(function (i) {
                var itm = jQuery('span[class^="material"]', this).text() + jQuery('span[class^="item"]', this).text();
                if (localStorage.getItem("product").indexOf(itm) >= 0 && i >= 1) {
                    $(this).attr("style","background-color: yellow;");
                }
            });
        }
    }
    else {
        $('.rightContent').append('Whoops, your browser does not support LocalStorage, please upgrade your browser');
    }
}

function EasyInvite(){
    if(typeof(Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        if(localStorage.getItem("char") !== null){
            $('.rightContent').append('<ul class="list"><li>Click on one of the characters below to invite them to the House.</li></ul><div class="seperator" style="margin-top: 30px;margin-bottom: 30px;">');
            $('.rightContent').append('<div id="loadedcharacter"><ul class="list">'+localStorage.getItem("char")+'</ul><div class="seperator" style="margin-top: 30px;margin-bottom: 30px;"></div>');
        } else {
            $('.rightContent').append('No stored characters found.');
        }
        //appending add character box
        $('.rightContent').append(
            '<ul class="list"><li><div id="newcharacter"> Character Name: <input id="char_name" type="text" name="char_name"> Character ID: <input id="char_id" type="text" name="char_id"><br></div></li></ul>');
        CreateButton('Add Character', "minimal", -1, -1, -1, '#newcharacter').onclick = function () {
            if (localStorage.char) {
                let charname = document.getElementById('char_name').value;
                let charid = document.getElementById('char_id').value;
                localStorage.char = localStorage.char + "<li><button class='minimal' id='"+charid+"' value='"+charid+"'>"+charname+"</button></li>";
                location.reload();
            } else {
                let charname = document.getElementById('char_name').value;
                let charid = document.getElementById('char_id').value;
                localStorage.char = "<li><button class='minimal' id='"+charid+"' value='"+charid+"'>"+charname+"</button></li>";
                location.reload();
            }
        };
        CreateButton('Delete All Characters',"minimal", -1, -1, "margin-left: 10px;", '#newcharacter').onclick = function () {
            localStorage.removeItem("char");
            location.reload();
        };
        $("button").click(function() {
            $('input[name="invite_id"]').val(this.id);
        });
    }
    else {
        $('.rightContent').append('Whoops, your browser does not support LocalStorage, please upgrade your browser');
    }
}

function ServerBrowserPreStuff(){
    if(localStorage.getItem("beep") !== null){
        if(localStorage.getItem("beep").indexOf('Enabled') != -1){
            $('#title_holder').prepend('<a style="left: 20px; top: 20px;" class="disable_beep" href="#">Disable the beeping</a></br>');
        } else {
            $('#title_holder').prepend('<a style="left: 20px; top: 20px;" class="enable_beep" href="#">Beep if 15 players are on a server</br>');
        }
    } else {
        localStorage.setItem("beep", "Disabled");
    }
    $(".class-container.cell2.center").draggable({
        stop: function(event, ui) {
            localStorage.setItem($(this).attr("id"), $(this).position().left + "&" + $(this).position().top);
        }
    });
    $('#contents_body').empty(); //clear all of the elements in the container

    //adding a exit button
    CreateButton('Exit Server Browser', "minimal w100", 'button', -1, "margin-right: 20px;", '#contents_body').onclick = function () {
        window.location.href = "https://nordinvasion.com/character.php";
    };
    //button to reset the positions of the servers
    CreateButton('Reset positions of servers', "minimal w100", 'button', -1, -1, '#contents_body').onclick = function () {
        for (var i = 0; i < servers.length; i++){
            localStorage.removeItem(servers[i]);
        }
        location.reload();
    };
}

function ServerBrowserInit(){
    $.ajax({
        url: 'https://nordinvasion.com/server-links.html', //Pass URL here
        type: "GET", //Also use GET method
        success: function (data) {
            //get Server info
            jQuery('#contents_body').append("<div class='primary-class-trees' style='height:auto; width:auto; margin: 20px; padding: 20px;' id='servers'><div id='normal'><h3>Normal Servers:</h3><div class='seperator'></div></div><div id='hard'><h3>Hard Servers:</h3><div class='seperator'></div></div><div id='ragnarok'><h3>Ragnarok Servers:</h3><div class='seperator'></div></div><div id='cavalry'><h3>Cavalry Servers:</h3><div class='seperator'></div></div><div id='beginner'><h3>Beginner Servers:</h3><div class='seperator'></div></div><div id='other'><h3>Other Servers:</h3><div class='seperator'></div></div></div>");

            jQuery($(data).find('a')).each(function () {
                servers.push($(this).attr('href')); //add server link to array
                //checking difficulty
                if($(this).text().indexOf("Normal") >= 0)
                {
                    jQuery('#normal').append("<div class='class-container cell2 center' style='position:relative; height: 190px; width: 190px; margin: auto; padding: 5px;' id='"+$(this).attr('href')+"'></div>");
                }
                else if($(this).text().indexOf("Hard") >= 0)
                {
                    jQuery('#hard').append("<div class='class-container cell2 center' style='position:relative; height: 190px; width: 190px; margin: auto; padding: 5px;' id='"+$(this).attr('href')+"'></div>");
                }
                else if($(this).text().indexOf("Ragnarok") >= 0)
                {
                    jQuery('#ragnarok').append("<div class='class-container cell2 center' style='position:relative; height: 190px; width: 190px; margin: auto; padding: 5px;' id='"+$(this).attr('href')+"'></div>");
                }
                else if($(this).text().indexOf("Cavalry") >= 0)
                {
                    jQuery('#cavalry').append("<div class='class-container cell2 center' style='position:relative; height: 190px; width: 190px; margin: auto; padding: 5px;' id='"+$(this).attr('href')+"'></div>");
                }
                else if($(this).text().indexOf("Beginner") >= 0)
                {
                    jQuery('#beginner').append("<div class='class-container cell2 center' style='position:relative; height: 190px; width: 190px; margin: auto; padding: 5px;' id='"+$(this).attr('href')+"'></div>");
                }
                else
                {
                    jQuery('#other').append("<div class='class-container cell2 center' style='position:relative; height: 190px; width: 190px; margin: auto; padding: 5px;' id='"+$(this).attr('href')+"'></div>");
                }
            });
            for (var i = 0; i < servers.length; i++){
                LoadServerData(servers[i]);
                setpositions(servers[i]);
            }
            dodrag();
            beep_notification();
        }
    });
}

function LoadServerData(link) {
    $.ajax({
        url: link, //Pass URL here
        type: "GET", //Also use GET method
        success: function (serverdata) { //using xml parser to retrieve xml data
            setTimeout(function () {
                var xml = serverdata,
                    xmlDoc = $.parseXML( xml ),
                    $xml = $( xmlDoc ),
                    $servername = $(xml).find( "Name" ),
                    $players = $(xml).find( "NumberOfActivePlayers" ),
                    $maxplayers = $(xml).find( "MaxNumberOfPlayers" ),
                    $mapname = $(xml).find( "MapName" );

                //updating the divs with new data
                document.getElementById(link).innerHTML = "<table style='height:190px; width:190px;'><tr><td><h3>"+$servername.text()+"</h3></td></tr><tr><td>Map: <b>"+$mapname.text()+"</b></td></tr><tr><td><progress value='"+$players.text()+"' max='"+$maxplayers.text()+"'></progress></br>"+$players.text()+"/"+$maxplayers.text()+" players</td></tr></table>";
                if(parseInt($players.text()) == 15 && localStorage.getItem("beep").indexOf('Enabled') != -1){
                    beep();
                }
                LoadServerData(link);
            }, 100);
        },
        error: function (ajaxContext) {
            setTimeout(function () {
                //if the ajax request failes, add a empty server with the name error
                document.getElementById(link).innerHTML = "<table style='height:190px; width:190px;'><tr><td><h3>Error</h3></td></tr><tr><td>---</td></tr><tr><td>---</td></tr></table>";
                LoadServerData(link);
            }, 100);
        }
    });
}

function dodrag(){
    if (url.match(/\/character\.php\?mode=ServerBrowser/)) {
        $(".class-container.cell2.center").draggable({
            stop: function(event, ui) {
                localStorage.setItem($(this).attr("id"), document.getElementById($(this).attr("id")).style.left + "&" + document.getElementById($(this).attr("id")).style.top);
            }
        });
    }
}

function setpositions(link){
    if (url.match(/\/character\.php\?mode=ServerBrowser/)) {
        if(localStorage.getItem(link) != undefined){
            var stored_item = localStorage.getItem(link);
            var coordinates = stored_item.split('&');
            document.getElementById(link).style.left = coordinates[0];
            document.getElementById(link).style.top = coordinates[1];
        }
    }
}

function beep(){
    var snd = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
}

function beep_notification(){
    $('a.enable_beep').click( function(event) {
        localStorage.setItem("beep", "Enabled");
        location.reload();
    });
    $('a.disable_beep').click( function(event) {
        localStorage.setItem("beep", "Disabled");
        location.reload();
    });
}

function QuestTrackerCheckBoxes() {
    $('.leftMenu ul li a').each(function() {
        var questNum = $(this).attr('href').split('=')[1];
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = questNum;
        if(localStorage.getItem('TrackedQuests') != undefined){
            var TrackedQuests = localStorage.getItem('TrackedQuests').split('|');
            if(TrackedQuests.indexOf(questNum) > -1)
                checkbox.checked = true;
        }
        $(checkbox).change(function() {
            if(this.checked){
                if(localStorage.getItem('TrackedQuests') != undefined)
                    localStorage.setItem('TrackedQuests', localStorage.getItem('TrackedQuests') + this.name + '|');
                else
                    localStorage.setItem('TrackedQuests', this.name + '|');
            } else {
                localStorage.setItem('TrackedQuests', localStorage.getItem('TrackedQuests').replace(this.name + '|', ''));
            }
            ReloadQuestTracker();
        });
        $(this).parent().prepend(checkbox);
    });
}

function ReloadQuestTracker(){
    if(localStorage.getItem('TrackedQuests') != undefined){
        // container setup
        var container;
        if(document.getElementById('QuestTracker') == undefined || document.getElementById('QuestTracker') == null){
            container = document.createElement('div');
            container.style.background = "url(/images/ni_parch_body_s.gif) repeat-y center center";
            container.style.padding = "10px";
            container.style.minWidth = "200px";
            container.style.position = "absolute";
            container.style.top = "20px";
            container.style.left = "20px";
            container.id = "QuestTracker";
        } else {
            container = document.getElementById('QuestTracker');
            container.innerHTML = '';
        }
        // container setup end
        var TrackedQuests = localStorage.getItem('TrackedQuests').split('|');
        for(var quest in TrackedQuests){
            if(quest < TrackedQuests.length - 1){
                $.ajax({
                    url: 'https://nordinvasion.com/quests.php?q=' + TrackedQuests[quest],
                    type: "GET"
                }).done(function(data){
                    if(data != undefined || data != null){
                        var seperator = document.createElement('br');
                        if(parseInt($(data).find('ul.q_collect:first li').length - 1) > -1){
                            var button = document.createElement('a');
                            button.className = 'QuestTrackerButton';
                            button.href = '#';
                            button.name = this.url.split('=')[1];
                            var total = 0;
                            $(data).find('ul.q_collect:first li:not(li:first)').each(function(){
                                if($(this).text() != undefined || $(this).text() != null){
                                    var temp = $(this).text().split('(');
                                    var div = temp[1].split('/');
                                    total += (parseInt(div[0].replace(')', '')) / parseInt(div[1])) * 100;
                                }
                            });
                            var sum = parseInt(total) / parseInt($(data).find('ul.q_collect:first li').length - 1);
                            button.innerHTML = $(data).find('.rightContent h2:first').text() + ' (' + Math.round(sum).toFixed() + '%)';
                            container.appendChild(button);
                            container.appendChild(seperator);
                        } else {
                            var NA = document.createElement('a');
                            NA.innerHTML = "Not Available";
                            container.appendChild(NA);
                            var removeQuest = document.createElement('a');
                            removeQuest.innerHTML = " X";
                            removeQuest.name = this.url.split('=')[1];
                            removeQuest.className = 'removeQuestButton';
                            container.appendChild(removeQuest);
                            container.appendChild(seperator);
                        }
                    } else if(status == "error"){
                        let NA = document.createElement('a');
                        NA.innerHTML = "Not Available";
                        container.appendChild(NA);
                        container.appendChild(seperator);
                    }

                });
            }
        }
        var seperator = document.createElement('br');
        var removeAllQuests = document.createElement('a');
        removeAllQuests.className = "removeAllQuestsButton";
        removeAllQuests.innerHTML = "Stop tracking all quests";
        removeAllQuests.style.color = "red";
        container.appendChild(removeAllQuests);
        container.appendChild(seperator);
        if(TrackedQuests.length > 1)
            $('#container').after(container);
        else{
            if(document.getElementById('QuestTracker') != undefined || document.getElementById('QuestTracker') != null)
                document.getElementById('QuestTracker').parentNode.removeChild(document.getElementById('QuestTracker'));
        }
    }
}
$(document).on('click', '.QuestTrackerButton', function(e) {
    var elem = this;
    e.preventDefault();
    if($(elem).attr('disabled') != 'disabled'){
        $.ajax({
            url: 'https://nordinvasion.com/quests.php?q=' + $(this).attr('name'),
            type: 'GET'
        }).done(function(data){
            $(elem).after('<div class="questInfo"><br>'+ $('ul.q_collect:first', data).html()+'<br><a href='+ this.url +'>Go to the quest page.</a></div>');
            $(elem).attr('disabled', true);
        });
    } else {
        $(elem).next().remove();
        $(elem).attr('disabled', false);
    }
});

$(document).on('click', '.removeQuestButton', function(e) {
    e.preventDefault();
    localStorage.setItem('TrackedQuests', localStorage.getItem('TrackedQuests').replace($(this).attr('name') + '|', ''));
    ReloadQuestTracker();
});

$(document).on('click', '.removeAllQuestsButton', function(e) {
    e.preventDefault();
    localStorage.setItem('TrackedQuests', '');
    ReloadQuestTracker();
});

let playerMaterials;

function getMaterials(){
    $.ajax({
        url: 'https://nordinvasion.com/crafting.php',
        type: 'GET'
    }).done(function(data){
        playerMaterials = $(data).find('.table2');
        initCraftingCheck();
    });
}

let ProjectTotal = {};
function Add_To_Project_Total(name, amount){
    ProjectTotal[name] = (ProjectTotal[name] || 0) + 0;
    amount = parseInt(amount.replace(' ', ''));
    ProjectTotal[name] += amount;
}

let MarketPlaceGoods = {'Normal Candle': {'item_id': 2092, 'itm': '73eba168e27edfc97ee2'},
                        'Normal Charcoal': {'item_id': 2090, 'itm': 'ed19db176ddadf46aa4d'},
                        'Normal Grindstone': {'item_id': 2091, 'itm': '1da9bf9d8ef62b429663'},
                        'Normal Needle': {'item_id': 2093, 'itm': '86257ec713f6a8a90910'},
                        'Fine Needle': {'item_id': 2076, 'itm': '63f962a3c7c221237d83'},
                        'Quality Candle': {'item_id': 2084, 'itm': 'b9dfc4d6e8b29dc8702a'},
                        'Quality Charcoal': {'item_id': 2077, 'itm': '3de4e13c48cae1831c6d'},
                        'Quality Grindstone': {'item_id': 2085, 'itm': 'e3f6ee28f2a47e1d9359'},
                        'Orichalcum': {'item_id': 2110, 'itm': 'a9c3affc2acf92ffabef'},
                        'Relic Fragment': {'item_id': 2109, 'itm': '36749d3cb4719ba83e0b'},
                        'Phoenix Feather': {'item_id': 2106, 'itm': '9067ab5d48d1b0cbd437'}};

function initCraftingCheck(){
    $('ul.list:first li:has(span.material.c)').each(function() {
        recipes.recipes.find((elements) => {
            if (elements.name === $(this).find('span.material.c').text()){
                for(let element of elements.recipe){
                    getMaterial(element, parseInt($(this).find('span[id*="req"]').text()), this, 20);
                }
            }
        });
    });
    $('ul.list:first li').each(function() {
        let name = $('span[class*="material"]',this).text();
        let amount = $('span[id*="req"]',this).text();
        Add_To_Project_Total(name, amount);
        $('div', this).each(function(){
            let cname = $(this).text().split('x ')[1].split(' (')[0];
            let camount = $(this).text().split('x')[0].replace('- ', '');
            Add_To_Project_Total(cname, camount);
        });
    });
    $('ul.list').append("<br><li><b>Total of materials needed: </b></li><li><i>Please be careful when using this data.</li><li>You'll have to figure out what part belongs to what other part.</li><li>This total only gives an indication of the materials needed.</i></li>");
    $.each(ProjectTotal, function(key, value) {
        var element = $(playerMaterials).find('span:contains("'+key+'")');
        element = element.filter(function(elem){
            return $(this).text() === key;
        });
        var elementColour = $(playerMaterials).find('span:contains("'+key+'")').attr('class');
        if(key in MarketPlaceGoods){
            if(element.text() === "")
                $('ul.list').append("<li> - <span class='"+ elementColour +"'>" + key + '</span> : ' + 0 + "/" + value + '<a name="' + parseInt(value) + '" href="#" class="buymarketplacegoods"> Buy all '+ key +'</a></li>');
            else if (parseInt(value)-parseInt(element.parent().next().text()) > 0)
                $('ul.list').append("<li> - <span class='"+ elementColour +"'>" + key + '</span> : ' + parseInt(element.parent().next().text()) + "/" + value + '<a name="' + (parseInt(value)-parseInt(element.parent().next().text())) + '" href="#" class="buymarketplacegoods"> Buy all '+ key +'</a></li>');
            else
                $('ul.list').append("<li> - <span class='"+ elementColour +"'>" + key + '</span> : ' + value + "</li>");
        }else
            if(element.text() === ""){
                $('ul.list').append("<li> - <span class='"+ elementColour +"'>" + key + '</span> : ' + 0 + "/" + value + '</li>');
            } else {
                $('ul.list').append("<li> - <span class='"+ elementColour +"'>" + key + '</span> : ' + parseInt(element.parent().next().text()) + "/" + value + '</li>');
            }
    });
}

$(document).on('click', '.buymarketplacegoods', function(e) {
    e.preventDefault();
    var r = confirm("You are about to purchace " + $(this).attr("name") + " " + $(this).text().split(' Buy all ')[1] + "\nPlease note that this function is not checking if you have enough gold.\nPress OK to continue or Cancel to abort.");
    if (r == true) {
        $.post('/marketplace.php?b=16',{item_id: MarketPlaceGoods[$(this).text().split(' Buy all ')[1]]['item_id'], itm: MarketPlaceGoods[$(this).text().split(' Buy all ')[1]]['itm'], itemNo: $(this).attr("name"), buy: 'Buy'});
    } else {
        alert("Operation Aborted");
    }
    location.reload();
});

function getMaterial(element, parentAmount, append, margin){
    canCraft(element[0], element[1] * parentAmount, append, '<div style="margin-left: '+margin+'px"> - ' + element[1] * parentAmount + ' x ' + element[0]);
    recipes.recipes.find((elements) => {
        if (elements.name === element[0]){
            for(let material of elements.recipe){
                getMaterial(material, parentAmount * element[1], append, margin+20);
            }
        }
    });
    return;
}

function canCraft(materialName, materialAmount, append, content){
    var element = $(playerMaterials).find('span:contains("'+materialName+'")');
    element = element.filter(function(elem){
        return $(this).text() === materialName;
    });
    if(element.text() === materialName){
        if(parseInt(element.parent().next().text()) >= materialAmount){
            if(append !== "none")
                $(append).append(content+' (<span style="color: green;">' + element.parent().next().text() + '</span>/' + materialAmount + ')</div>');
            else
                return '(<span style="color: green;">' + element.parent().next().text() + '</span>/' + materialAmount + ')';
        }
        else{
            if(append !== "none")
                $(append).append(content+' (<span style="color: red;">' + element.parent().next().text() + '</span>/' + materialAmount + ')</div>');
            else
                return ' (<span style="color: red;">' + element.parent().next().text() + '</span>/' + materialAmount + ')';
        }
    } else if(element.text() === "") {
        if(append !== "none")
            $(append).append(content+' (<span style="color: red;">0</span>/' + materialAmount + ')</div>');
        else
            return ' (<span style="color: red;">0</span>/' + materialAmount + ')';
    }
    else {
        $(append).append(content + '</div>');
    }
}

function craftingProjectInit(){
    var storedProjects = [];
    if(localStorage.getItem('CraftingProjects') != undefined){
        storedProjects = localStorage.getItem('CraftingProjects').split('|');
    }
    if(storedProjects.length > 0){
        var html = '';
        for(let project of storedProjects){
            if(project){
                project = JSON.parse(project);
                html += '<li><a class="ProjectDetail" href="#" name="' + project['name'] +'">' + project['name'] + '</a><a class="removeCraftingProject" href="#" style="font-size: 6pt; vertical-align: super" name="' + project['name'] + '"> remove</a></li>';
            }
        }
        $('.leftMenu').html('<h3>Stored Projects</h3><ul><li><a href="#" class="removeAllCraftingProjects" style="color: red">Remove all crafting projects</a></li>' + html + '</ul>');
    }else{
        $('.leftMenu').html('<h3>Stored Projects</h3><ul><li>No stored projects.</li></ul>');
    }
    let htmlstr = `\
<b>Add a project here using project code. Examples can be found <a target="_blank" href="https://forum.nordinvasion.com/showthread.php?tid=41761&pid=293319#pid293319">here</a></b>.
</br><input type="text" placeholder="Enter project code here" class="projectMats" style="margin-right: 20px; width: 400px; height: 30px">
<input type="button" class="storeProject minimal w100 ui-button ui-widget ui-state-default ui-corner-all" value="Add Project">
</br><div class="separator"></div></br>
<b>Add a project the classic way, by adding a list of materials needed. Can use the recipes in <a target="_blank" href="https://forum.nordinvasion.com/showthread.php?tid=65402">this</a> thread.</b>
</br>Name:</br>
<input type="text" placeholder="Name your project." class="cprojectName" style="margin-right: 20px; height: 30px">
</br>Recipe:</br>
<textarea placeholder="Enter recipe." class="cprojectRecipe" cols="60" rows="8" style="margin-right: 20px; width: 400px; height: 200px"/></br>
<input type="button" class="storeProjectClassic minimal w100 ui-button ui-widget ui-state-default ui-corner-all" value="Add Project">`;
    $('.crafting-skills').html(htmlstr);
}

$(document).on('click', '.removeAllCraftingProjects', function(e) {
    e.preventDefault();
    localStorage.setItem('CraftingProjects', '');
    location.reload();
});

$(document).on('click', '.removeCraftingProject', function(e) {
    e.preventDefault();
    let storedProjects = [];
    if(localStorage.getItem('CraftingProjects') != undefined){
        storedProjects = localStorage.getItem('CraftingProjects').split('|');
    }
    var materials = "";
    if(storedProjects.length > 0){
        for(let project of storedProjects){
            if(project){
                let projectString = project;
                project = JSON.parse(project);
                if(project['name'] === $(this).attr('name')){
                    localStorage.setItem('CraftingProjects', localStorage.getItem('CraftingProjects').replace(projectString + '|', ''));
                }
            }
        }
    }
    location.reload();
});

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function Recipe_To_Project_Code(){
    let projectcode = '{"name": "';
    let name = $('ul.list:eq(1) li span').text() + '", "recipe": [';
    projectcode += name;
    $('ul.list:first li').each(function(){
        projectcode += '["' +  $('span[class*="material"]', this).text() + '", ' + $('span[id*="req"]', this).text() + '],';
    });
    projectcode = projectcode.slice(0,-1);
    projectcode += ']}';
    $('.rightContent').append('<li><b>Project Code:</b></li></li><li>' + projectcode + '</li>');
}

$(document).on('click', '.storeProject', function(e) {
    e.preventDefault();
    if(IsJsonString($('.projectMats').val())){
        AddNewProject($('.projectMats').val());
    } else
        alert('The JSON string you entered is not valid, please check the NordInvasion# thread for the right syntax.');
});

$(document).on('click', '.storeProjectClassic', function(e) {
    if($('.cprojectName').val() !== "" && $('.cprojectRecipe').val() !== "")
        AddNewProject(ConvertRecipeToProjectCode($('.cprojectName').val(), $('.cprojectRecipe').val()));
    else
        alert("Something went wrong. Please check if all the fields are filled in correctly.");
});

function ConvertRecipeToProjectCode(name, recipe){
    if(recipe.indexOf(' x ') > -1){
        let project_code = '{"name": "'+ name + '", "recipe": [';
        for (material of recipe.split('\n')){
            project_code += '["' + material.split(' x ')[1].split(' (')[0] + '", ' + material.split(' x ')[0] + '],';
        }
        return project_code.slice(0,-1) + ']}';
    } else {
        alert("The recipe you entered does not seems to be right, please check and try again.");
    }
}

function AddNewProject(project){
    if(project !== undefined && project !== null && project !== "" && IsJsonString(project)){
        if(localStorage.getItem('CraftingProjects') != undefined)
            localStorage.setItem('CraftingProjects', localStorage.getItem('CraftingProjects') + project + '|');
        else
            localStorage.setItem('CraftingProjects', project + '|');
        location.reload();
    }
}

$(document).on('click', '.ProjectDetail', function(e) {
    e.preventDefault();
    var elem = this;
    var storedProjects = [];
    if(localStorage.getItem('CraftingProjects') != undefined){
        storedProjects = localStorage.getItem('CraftingProjects').split('|');
    }
    playerMaterials = $('body').find('.table2');
    var materials = "";
    if(storedProjects.length > 0){
        for(let project of storedProjects){
            if(project){
                project = JSON.parse(project);
                if(project['name'] === this.name){
                    let isCrafted = [];
                    for(let name in recipes.recipes){
                        isCrafted.push(recipes.recipes[name]['name']);
                    }
                    for(let material in project['recipe']){
                        if(isCrafted.indexOf(project['recipe'][material][0]) > -1)
                            materials += '<li><span id="req_' + Math.floor((Math.random() * 1000) + 1) + '">' + project['recipe'][material][1] + '</span> x <span class="inline material c">'+ project['recipe'][material][0] + '</span>' +  canCraft(project['recipe'][material][0], project['recipe'][material][1], "none", 0) + '</li>';
                        else
                            materials += '<li><span id="req_' + Math.floor((Math.random() * 1000) + 1) + '">' + project['recipe'][material][1] + '</span> x <span class="inline material">'+ project['recipe'][material][0] + '</span>' +  canCraft(project['recipe'][material][0], project['recipe'][material][1], "none", 0) + '</li>';
                    }
                }
            }
        }
    }
    $('.rightContent').prepend('<div class="separator"></div><h3>Items Required for ' + this.name + '</h3><ul class="list">'+ materials +'</ul><div class="separator"></div>');
    getMaterials();
});

$('button[name="nis_preset"]').on( 'click', function () {
    $.ajax({
        method: 'POST',
        url: 'ajax/character-loadout.ajax.php',
        data: localStorage.getItem(this.id + " " + $("#playerListText option:selected").text()),
        success: function (serverdata) {
            alert("Preset Loaded");
            location.reload();
        },
        error: function (serverdata) {
            alert("ERROR. Could not load preset.");
        }
    });
});

//remove presets
$('.clearitm').on( 'click', function () {
    let preset_role = $(this).attr('role') ? $(this).attr('role') : '';
    localStorage.setItem($("#playerListText option:selected").text() + " presets" + preset_role , localStorage.getItem($("#playerListText option:selected").text() + " presets"  + preset_role).replace(this.id,''));
    localStorage.removeItem(this.id + " " + $("#playerListText option:selected").text());
    location.reload();
});

var craftingBreakdownClicked = false;
$(document).on('click', '.craftingBreakdown', function(e) {
    e.preventDefault();
    if(!craftingBreakdownClicked)
        getMaterials();
    craftingBreakdownClicked = true;
});
