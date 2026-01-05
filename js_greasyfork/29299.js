// ==UserScript==
// @name         BS Clan Foods
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Tools to improve game BatteredShield clan cooking skill
// @author       chemish
// @match        https://batteredshield.com/game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29299/BS%20Clan%20Foods.user.js
// @updateURL https://update.greasyfork.org/scripts/29299/BS%20Clan%20Foods.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //store count, name, level, popup text, item_id
    var foodPartsArr = [[0, 'Water', 0, '', 465], [0, 'Flour', 0, '', 710], [0, 'Dough', 4, '', 458], [0, 'Cream', 20, '', 479], [0, 'Curd', 24, '', 747], [0, 'Salt', 40, '', 846], [0, 'Cheese', 40, '', 482], [0, 'Oil', 60, '', 962], [0, 'Flat Bread', 70, '', 950]];

    var foodArr = [[0, 'Cooked Crayfish', 0, '', 38], [0, 'Carrot Stew', 6, '', 51], [0, 'Bluegill Sashimi', 8, '', 913], [0, 'Baked Fish', 10, '', 472],
                   [0, 'Omelet', 12, '', 462], [0, 'Baked Apple', 12, '', 715], [0, 'Tomato Soup', 16, '', 455], [0, 'Basic Salad', 18, '', 459], [0, 'Frog Legs', 20, '', 711],
                   [0, 'Onion Soup', 24, '', 476], [0, 'Pear Treat', 26, '', 748], [0, 'Fish Soup', 28, '', 749], [0, 'Rainbow Trout Sashimi', 28, '', 914],
                   [0, 'Rosemary Potatoes', 30, '', 485], [0, 'Dinner Salad', 40, '', 844], [0, 'Bunch o Noodles', 42, '', 497], [0, 'Spaghetti Dish', 48, '', 845],
                   [0, 'Cutthroat Trout Nigiri', 48, '', 915], [0, 'Corn Bread', 52, '', 498], [0, 'Split Pea Soup', 54, '', 493], [0, 'Tortilla', 61, '', 949],
                   [0, 'Fish Taco', 62, '', 952], [0, 'Tortilla Soup', 63, '', 946], [0, 'Stuffed Pepper', 64, '', 941], [0, 'Fried Beans', 65, '', 956], [0, 'Refried Beans', 65, '', 954],
                   [0, 'Salsa', 66, '', 948], [0, 'Oatmeal', 67, '', 945], [0, 'Lake Trout Nigiri', 68, '', 944], [0, 'Burrito', 68, '', 947], [0, 'Empinada', 72, '', 957],
                   [0, 'Gordita', 73, '', 953], [0, 'Sardine Vegetale', 80, '', 1014], [0, 'Beet Soup', 82, '', 1009], [0, 'guacamole', 86, '', 1011], [0, 'Baked Eggplant', 90, '', 1004],
                   [0, 'Apple Pie', 92, '', 1006], [0, 'Fried Banana', 100, '', 1025]];

    var potionArr = [[0, 'Red Potion', 2, '1 Rotten Flesh<br/>1 Sweat<br/>1 Goblin Blood<br/>1 Potion Flask'],
                     [0, 'Yellow Potion', 2, '1 Finger Bone<br/>1 Green Scales<br/>1 Goblin Toe<br/>1 Potion Flask'],
                     [0, 'Blue Potion', 2, '1 Rat Tail<br/>1 Sprite Wing<br/>1 Kobold Spur<br/>1 Potion Flask'],
                     [0, 'Orange Potion', 20, '1 Rock Dust<br/>1 Rock Scales<br/>1 Braided Beard<br/>1 Potion Flask'],
                     [0, 'Green Potion', 22, '1 Potion Flask<br/>1 Large Claw<br/>1 Goblin Hair<br/>1 Goblin Tooth'],
                     [0, 'Purple Potion', 24, '1 Dark Elf Ear<br/>1 Rib Bone<br/>1 Goblin Eye<br/>1 Potion Flask'],
                     [0, 'White Potion', 26, '1 Potion Flask<br/>1 Shaman Powder<br/>1 Grey Venom<br/>1 Thick Whiskers'],
                     [0, 'Light Orange Potion', 40, '1 Centaur Hoof<br/>1 Copper Scales<br/>1 Gnoll Tongue<br/>1 Potion Flask'],
                     [0, 'Light Green Potion', 42, '1 Orc Blood<br/>1 Satyr Tuft<br/>1 Pixie Wing<br/>1 Potion Flask'],
                     [0, 'Light Purple Potion', 44, '1 Large Rat Tail<br/>1 Strong Rotten Flesh<br/>1 Bandit Bandana Grime<br/>1 Potion Flask'],
                     [0, 'Bleach Potion', 52, '5 Limestone<br/>1 Potion Flask<br/>2 Water'],
                     [0, 'Blood Orange Potion', 60, '1 Scorpion tail<br/>1 Gipsy Ale<br/>1 Tomb Dust<br/>1 Potion Flask'],
                     [0, 'Leaf Green Potion', 62, '1 Imp wing<br/>1 Snake Rattle<br/>1 Sphinx Feather<br/>1 Potion Flask'],
                     [0, 'Ultra Violet Potion', 64, '1 Mummy Wrappings<br/>1 Worm carapace<br/>1 Imp Horn<br/>1 Potion Flask'],
                     [0, 'Black Potion', 66, '1 Desert Grime<br/>1 Sphinx Claw<br/>1 Scorpion Poison<br/>1 Potion Flask'],
                     [0, 'Dark Orange Potion', 80, '1 Tiger Tooth<br/>1 Spider Web<br/>1 Digested Blood<br/>1 Potion Flask'],
                     [0, 'Dark Green Potion', 82, '1 Potion Flask<br/>1 Vine Stock<br/>1 Leech Slime<br/>1 War Paint'],
                     [0, 'Dark Purple Potion', 84, '1 Small Scale<br/>1 Root chunk<br/>1 Purple Venom<br/>1 Potion Flask']];

    var foodRefreshButtons = '<div style="width: 100%; display: table"><div style="display: table-row"><div id="btnClanFoodAlpha" class="theme_button" style="display: table-cell; margin: 0 auto; width: 50%"><div>By Alpha</div></div><div id="btnClanFoodLevel" class="theme_button" style="display: table-cell; margin: 0 auto; width: 50%"><div>By Level</div></div></div></div>';
    foodRefreshButtons += '<div style="width: 100%; display: table"><div style="display: table-row"><div id="btnClanFoodQty" class="theme_button" style="display: table-cell; margin: 0 auto; width: 50%"><div>By Qty</div></div></div></div>';

    if($("#clanFoodSection").length == 0) {
        //console.log('adding new section');
        var foodSection = '<div id="clanFoodSection" class="Item_InventoryList inventory Qty AtoZ"></div>';
        $(".ui-layout-east:first").find('.wrapper').append(foodSection);
        var beginFoodSection ='<div id="clanFoodSubSection" class="Item_InventoryList inventory Qty AtoZ"><div class="ContainerWrapper stackContainer" id="Right_menu"><div class="RightMenu side_block activeItem"><div class="smallchain"></div><div class="toggle"><a href="javascript:void(0);">Clan Foods</a></div><div class="toggle_container"><div class="sub_set"><div class="sub_set ItemHolder">';
        var endFoodSection ='</div></div></div></div></div></div>';
        $("#clanFoodSection").html(beginFoodSection + foodRefreshButtons + endFoodSection);
        document.getElementById("btnClanFoodAlpha").addEventListener("click", function(){displayClanFoodWithSort(sortNameFunction);}, false);
        document.getElementById("btnClanFoodLevel").addEventListener("click", function(){displayClanFoodWithSort(sortLevelFunction);}, false);
        document.getElementById("btnClanFoodQty").addEventListener("click", function(){displayClanFoodWithSort(sortQtyFunction);}, false);
    }
    else{
        //console.log('section already exists');
    }

    function getClanFoods()
    {
        //clear food counts
        for (var i = 0; i < foodPartsArr.length; i++) {
            foodPartsArr[i][0] = 0;
        }

        for (var i = 0; i < foodArr.length; i++) {
            foodArr[i][0] = 0;
        }

        for (var i = 0; i < potionArr.length; i++) {
            potionArr[i][0] = 0;
        }

        var bigList = document.getElementsByClassName("ItemContainer row_group");
        var itemList = bigList[0].getElementsByClassName("row Item popup_holder");

        for (var i = 0; i < itemList.length; i++) {
            var tempItemName = itemList[i].getElementsByClassName("Name")[0].innerHTML;
            var tempItemQtyString = itemList[i].getElementsByClassName("Quantity")[0].innerHTML;
            var tempItemQty = parseInt(tempItemQtyString.replace("K","000"));

            for (var j = 0; j < foodPartsArr.length; j++) {
                if (tempItemName == foodPartsArr[j][1]){
                    foodPartsArr[j][0] += tempItemQty;
                    break;
                }
            }

            for (var j = 0; j < foodArr.length; j++) {
                if (tempItemName == foodArr[j][1]){
                    foodArr[j][0] += tempItemQty;
                    break;
                }
            }

            for (var j = 0; j < potionArr.length; j++) {
                if (tempItemName == potionArr[j][1]){
                    potionArr[j][0] += tempItemQty;
                    break;
                }
            }
        }
    }

    function displayClanFoodWithSort(sortFunction)
    {
        console.log('CCS - ' + sortFunction);
        getClanFoods();

        var foodString = foodRefreshButtons;

        foodPartsArr.sort(sortFunction);
        foodArr.sort(sortFunction);
        potionArr.sort(sortFunction);

        foodString += '<div class="item_line"><div class="sub_title">Clan Food Ingrediants</div></div>';

        for (var i = 0; i < foodPartsArr.length; i++) {
            foodString += '<div class="item_line popup_holder"><div class="item_content popup_link_hijacked"><span class="amount"><span class="Slots">'+foodPartsArr[i][0]+'</span><span class="Quantity">'+foodPartsArr[i][0]+'</span></span><div class="icon_wrapper"><div class="icon manual_link" onclick="popup_manual(\'item\', '+foodPartsArr[i][4]+');"><div class="pic IconPic '+foodPartsArr[i][1].toLowerCase().replace(/ /g,"_")+'"></div><div class="theme_move"></div></div></div><div class="details"><a href="javascript:void(0);" class=" ItemLink"><span class="Name">'+foodPartsArr[i][1]+'</span><span class="BShidden Type">Plant</span></a></div></div></div>';
        }

        foodString += '<div class="item_line"><div class="sub_title">Clan Foods</div></div>';

        for (var i = 0; i < foodArr.length; i++) {
            foodString += '<div class="item_line popup_holder"><div class="item_content popup_link_hijacked"><span class="amount"><span class="Slots">'+foodArr[i][0]+'</span><span class="Quantity">'+foodArr[i][0]+'</span></span><div class="icon_wrapper"><div class="icon manual_link" onclick="popup_manual(\'item\', '+foodArr[i][4]+');"><div class="pic IconPic '+foodArr[i][1].toLowerCase().replace(/ /g,"_")+'"></div><div class="theme_move"></div></div></div><div class="details"><a href="javascript:void(0);" class=" ItemLink"><span class="Name">'+foodArr[i][1]+'</span><span class="BShidden Type">Plant</span></a></div></div></div>';
        }

        foodString += '<div class="item_line"><div class="sub_title">Clan Potions</div></div>';

        for (var i = 0; i < potionArr.length; i++) {
            foodString += '<div class="item_line popup_holder"><div class="item_content popup_link_hijacked" onclick="$(this).closest(\'.popup_holder\').toggleClass(\'open\').find(\'.popup_div\').toggleClass(\'BShidden\');"><span class="amount"><span class="Slots">'+potionArr[i][0]+'</span><span class="Quantity">'+potionArr[i][0]+'</span></span><div class="icon_wrapper"><div class="icon manual_link"><div class="pic IconPic '+potionArr[i][1].toLowerCase().replace(/ /g,"_")+'"></div><div class="theme_move"></div></div></div><div class="details"><a href="javascript:void(0);" class=" ItemLink"><span class="Name">'+potionArr[i][1]+'</span><span class="BShidden Type">Plant</span></a></div></div><div class="link_popup popup_div ItemPopup BShidden"><div class="pop-wrapper"><div class="choices">'+potionArr[i][3]+'</div></div></div></div>';
        }

        var beginFoodSection ='<div id="clanFoodSubSection" class="Item_InventoryList inventory Qty AtoZ"><div class="ContainerWrapper stackContainer" id="Right_menu"><div class="RightMenu side_block activeItem"><div class="smallchain"></div><div class="toggle"><a href="javascript:void(0);">Clan Foods</a></div><div class="toggle_container"><div class="sub_set"><div class="sub_set ItemHolder">';
        var endFoodSection ='</div></div></div></div></div></div>';
        $("#clanFoodSection").html(beginFoodSection + foodString + endFoodSection);

        document.getElementById("btnClanFoodAlpha").addEventListener("click", function(){displayClanFoodWithSort(sortNameFunction);}, false);
        document.getElementById("btnClanFoodLevel").addEventListener("click", function(){displayClanFoodWithSort(sortLevelFunction);}, false);
        document.getElementById("btnClanFoodQty").addEventListener("click", function(){displayClanFoodWithSort(sortQtyFunction);}, false);
    }

    ///Sort Functions
    function sortQtyFunction(a, b) {
         return a[0]-b[0];
    }

    function sortNameFunction(a, b) {
        return a[1].toLowerCase().localeCompare(b[1].toLowerCase());
    }

    function sortLevelFunction(a, b) {
         return a[2]-b[2];
    }
})();