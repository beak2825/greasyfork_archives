// ==UserScript==
// @name         BS Clan Smithed Gear
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tools to improve game BatteredShield smithing skill
// @author       chemish
// @match        https://batteredshield.com/game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29297/BS%20Clan%20Smithed%20Gear.user.js
// @updateURL https://update.greasyfork.org/scripts/29297/BS%20Clan%20Smithed%20Gear.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //store count, name, level
    var smithGearArr = [[0, 'Copper Shovel', 0], [0, 'Copper Pan', 0], [0, 'Copper Pot', 2], [0, 'Copper Pick', 2], [0, 'Copper Axe', 6], [0, 'Copper Hammer', 6],
                        [0, 'Bronze Shovel', 20], [0, 'Bronze Pan', 20], [0, 'Bronze Pot', 20], [0, 'Bronze Pick', 26], [0, 'Bronze Axe', 26], [0, 'Bronze Hammer', 26],
                        [0, 'Iron Shovel', 40], [0, 'Iron Pan', 40], [0, 'Iron Pot', 40], [0, 'Iron Pick', 46], [0, 'Iron Axe', 46], [0, 'Iron Hammer', 46],
                        [0, 'Steel Shovel', 60], [0, 'Steel Pan', 60], [0, 'Steel Pot', 60], [0, 'Steel Pick', 66], [0, 'Steel Axe', 66], [0, 'Steel Hammer', 66],
                        [0, 'Aluminum Shovel', 80], [0, 'Aluminum Pan', 80], [0, 'Aluminum Pot', 80], [0, 'Aluminum Pick', 86], [0, 'Aluminum Axe', 86], [0, 'Aluminum Hammer', 86],
                        [0, 'Titanium Shovel', 100], [0, 'Titanium Pan', 100], [0, 'Titanium Pot', 100], [0, 'Titanium Pick', 106], [0, 'Titanium Axe', 106], [0, 'Titanium Hammer', 106]];

    var gearRefreshButtons = '<div style="width: 100%; display: table"><div style="display: table-row"><div id="btnClanGearAlpha" class="theme_button" style="display: table-cell; margin: 0 auto; width: 50%"><div>By Alpha</div></div><div id="btnClanGearLevel" class="theme_button" style="display: table-cell; margin: 0 auto; width: 50%"><div>By Level</div></div></div></div>';
    gearRefreshButtons += '<div style="width: 100%; display: table"><div style="display: table-row"><div id="btnClanGearQty" class="theme_button" style="display: table-cell; margin: 0 auto; width: 50%"><div>By Qty</div></div></div></div>';

    if($("#clanGearSection").length == 0) {
        //console.log('adding new section');
        var gearSection = '<div id="clanGearSection" class="Item_InventoryList inventory Qty AtoZ"></div>';
        $(".ui-layout-east:first").find('.wrapper').append(gearSection);
        var beginGearSection ='<div id="clanGearSection" class="Item_InventoryList inventory Qty AtoZ"><div class="ContainerWrapper stackContainer" id="Right_menu"><div class="RightMenu side_block activeItem"><div class="smallchain"></div><div class="toggle"><a href="javascript:void(0);">Clan Smithed Gear</a></div><div class="toggle_container"><div class="sub_set"><div class="sub_set ItemHolder">';
        var endGearSection ='</div></div></div></div></div></div>';
        $("#clanGearSection").html(beginGearSection + gearRefreshButtons + endGearSection);
        document.getElementById("btnClanGearAlpha").addEventListener("click", function(){displayClanGearWithSort(sortNameFunction);}, false);
        document.getElementById("btnClanGearLevel").addEventListener("click", function(){displayClanGearWithSort(sortLevelFunction);}, false);
        document.getElementById("btnClanGearQty").addEventListener("click", function(){displayClanGearWithSort(sortQtyFunction);}, false);
    }
    else{
        //console.log('section already exists');
    }

    function getClanSmithedGear()
    {
        //clear counts
        for (var i = 0; i < smithGearArr.length; i++) {
            smithGearArr[i][0] = 0;
        }

        var bigList = document.getElementsByClassName("ItemContainer row_group");
        var itemList = bigList[0].getElementsByClassName("row Item popup_holder");

        for (var i = 0; i < itemList.length; i++) {
            var tempItemName = itemList[i].getElementsByClassName("Name")[0].innerHTML;
            var tempItemQtyString = itemList[i].getElementsByClassName("Quantity")[0].innerHTML;
            var tempItemQty = parseInt(tempItemQtyString.replace("K","000"));

            for (var j = 0; j < smithGearArr.length; j++) {
                if (tempItemName == smithGearArr[j][1]){
                    smithGearArr[j][0] += tempItemQty;
                    break;
                }
            }
        }
    }

    function displayClanGearWithSort(sortFunction)
    {
        getClanSmithedGear();

        var gearString = gearRefreshButtons;

        gearString += '<div class="item_line"><div class="sub_title">Clan Smithed Gear</div></div>';

        smithGearArr.sort(sortFunction);

        for (var i = 0; i < smithGearArr.length; i++) {
            gearString += '<div class="item_line popup_holder"><div class="item_content popup_link_hijacked"><span class="amount"><span class="Slots">'+smithGearArr[i][0]+'</span><span class="Quantity">'+smithGearArr[i][0]+'</span></span><div class="icon_wrapper"><div class="icon manual_link"><div class="pic IconPic '+smithGearArr[i][1].toLowerCase().replace(/ /g,"_")+'"></div><div class="theme_move"></div></div></div><div class="details"><a href="javascript:void(0);" class=" ItemLink"><span class="Name">'+smithGearArr[i][1]+'</span><span class="BShidden Type">Plant</span></a></div></div></div>';
        }

        var beginGearSection ='<div id="clanGearSection" class="Item_InventoryList inventory Qty AtoZ"><div class="ContainerWrapper stackContainer" id="Right_menu"><div class="RightMenu side_block activeItem"><div class="smallchain"></div><div class="toggle"><a href="javascript:void(0);">Clan Smithed Gear</a></div><div class="toggle_container"><div class="sub_set"><div class="sub_set ItemHolder">';
        var endGearSection ='</div></div></div></div></div></div>';
        $("#clanGearSection").html(beginGearSection + gearString + endGearSection);

        document.getElementById("btnClanGearAlpha").addEventListener("click", function(){displayClanGearWithSort(sortNameFunction);}, false);
        document.getElementById("btnClanGearLevel").addEventListener("click", function(){displayClanGearWithSort(sortLevelFunction);}, false);
        document.getElementById("btnClanGearQty").addEventListener("click", function(){displayClanGearWithSort(sortQtyFunction);}, false);
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