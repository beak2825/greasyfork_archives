// ==UserScript==
// @name         BS Clan Crops
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Tools to improve game BatteredShield farming skill
// @author       chemish
// @match        https://batteredshield.com/game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28910/BS%20Clan%20Crops.user.js
// @updateURL https://update.greasyfork.org/scripts/28910/BS%20Clan%20Crops.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //store count, name, level
    var cropArr = [[0, 'Wheat', 0], [0, 'Milk', 2], [0, 'Carrot', 4], [0, 'Parsley', 8], [0, 'Jute', 10], [0, 'Lettuce', 12], [0, 'Basil', 16], [0, 'Tomato', 20],
                   [0, 'Barley', 22], [0, 'Onion', 24], [0, 'Rosemary', 28], [0, 'Potato', 32], [0, 'Garlic', 36], [0, 'Green Bean', 38],
                   [0, 'Rice', 40], [0, 'Pea Pod', 40], [0, 'Radish', 42], [0, 'Strawberry', 44], [0, 'Oregano', 46], [0, 'Corn', 48], [0, 'Cinnamon', 54], [0, 'Cotton', 50],
                   [0, 'Jalapeno', 62], [0, 'Cilantro', 64], [0, 'Pinto Bean', 68], [0, 'Chive', 70], [0, 'Green Pepper', 74], [0, 'Oat', 78],
                   [0, 'Sugar Cane', 80], [0, 'Seaweed', 80], [0, 'Banana', 82], [0, 'Grape', 87], [0, 'Eggplant', 90], [0, 'Hemp', 90], [0, 'Beet', 95],
                   [0, 'Squash', 103], [0, 'Pineapple', 106], [0, 'Vanilla Bean', 108], [0, 'Ginger Root', 112]];

    var orchardArr = [[0, 'Apple', 6], [0, 'Pear', 20], [0, 'Peach', 56], [0, 'Olive', 60], [0, 'Avocado', 85], [0, 'Macadamia Nut', 98], [0, 'Orange', 100],
                      [0, 'Coconut', 116], [0, 'Roasted Cocoa Bean', 120]];

    var cropRefreshButtons = '<div style="width: 100%; display: table"><div style="display: table-row"><div id="btnClanCropsAlpha" class="theme_button" style="display: table-cell; margin: 0 auto; width: 50%"><div>By Name</div></div></div></div>';
    cropRefreshButtons += '<div style="width: 100%; display: table"><div style="display: table-row"><div id="btnClanCropsLevel" class="theme_button" style="display: table-cell; margin: 0 auto; width: 50%"><div>By Level</div></div></div></div>';
    cropRefreshButtons += '<div style="width: 100%; display: table"><div style="display: table-row"><div id="btnClanCropsQty" class="theme_button" style="display: table-cell; margin: 0 auto; width: 50%"><div>By Qty</div></div></div></div>';

    if($("#clanCropsSection").length == 0) {
        //console.log('adding new section');
        var cropSection = '<div id="clanCropsSection" class="Item_InventoryList inventory Qty AtoZ"></div>';
        $(".ui-layout-east:first").find('.wrapper').append(cropSection);
        var beginCropSection ='<div id="clanCropsSection" class="Item_InventoryList inventory Qty AtoZ"><div class="ContainerWrapper stackContainer" id="Right_menu"><div class="RightMenu side_block activeItem"><div class="smallchain"></div><div class="toggle"><a href="javascript:void(0);">Clan Crops</a></div><div class="toggle_container"><div class="sub_set"><div class="sub_set ItemHolder">';
        var endCropSection ='</div></div></div></div></div></div>';
        $("#clanCropsSection").html(beginCropSection + cropRefreshButtons + endCropSection);
        document.getElementById("btnClanCropsAlpha").addEventListener("click", function(){displayClanCropsWithSort(sortNameFunction);}, false);
        document.getElementById("btnClanCropsLevel").addEventListener("click", function(){displayClanCropsWithSort(sortLevelFunction);}, false);
        document.getElementById("btnClanCropsQty").addEventListener("click", function(){displayClanCropsWithSort(sortQtyFunction);}, false);
    }
    else{
        //console.log('section already exists');
    }

    function getClanCrops()
    {
        //clear crop counts
        for (var i = 0; i < cropArr.length; i++) {
            cropArr[i][0] = 0;
        }

        for (var i = 0; i < orchardArr.length; i++) {
            orchardArr[i][0] = 0;
        }

        var bigList = document.getElementsByClassName("ItemContainer row_group");
        var itemList = bigList[0].getElementsByClassName("row Item popup_holder");

        for (var i = 0; i < itemList.length; i++) {
            var tempItemName = itemList[i].getElementsByClassName("Name")[0].innerHTML;
            var tempItemQtyString = itemList[i].getElementsByClassName("Quantity")[0].innerHTML;
            var tempItemQty = parseInt(tempItemQtyString.replace("K","000"));

            for (var j = 0; j < cropArr.length; j++) {
                if (tempItemName == cropArr[j][1]){
                    cropArr[j][0] += tempItemQty;
                    break;
                }
            }

            for (var j = 0; j < orchardArr.length; j++) {
                if (tempItemName == orchardArr[j][1]){
                    orchardArr[j][0] += tempItemQty;
                    break;
                }
            }
        }
    }

    function displayClanCropsWithSort(sortFunction)
    {
        console.log('CCS - ' + sortFunction);
        getClanCrops();

        var cropsString = cropRefreshButtons;

        cropsString += '<div class="item_line"><div class="sub_title">Clan Farm Crops</div></div>';

        cropArr.sort(sortFunction);

        orchardArr.sort(sortFunction);

        for (var i = 0; i < cropArr.length; i++) {
            cropsString += '<div class="item_line popup_holder"><div class="item_content popup_link_hijacked"><span class="amount"><span class="Slots">'+cropArr[i][0]+'</span>';
            if(cropArr[i][0] > 10000)
                cropsString += '<span class="Quantity" data-tooltip="'+cropArr[i][0]+'">'+Math.floor(cropArr[i][0]/1000)+'K</span>';
            else
                cropsString += '<span class="Quantity">'+cropArr[i][0]+'</span>';
            cropsString += '</span><div class="icon_wrapper"><div class="icon manual_link"><div class="pic IconPic '+cropArr[i][1].toLowerCase().replace(/ /g,"_")+'"></div><div class="theme_move"></div></div></div><div class="details"><a href="javascript:void(0);" class=" ItemLink"><span class="Name">'+cropArr[i][1]+'</span><span class="BShidden Type">Plant</span></a></div></div></div>';
        }

        cropsString += '<div class="item_line"><div class="sub_title">Clan Tree Crops</div></div>';

        for (var i = 0; i < orchardArr.length; i++) {
            cropsString += '<div class="item_line popup_holder"><div class="item_content popup_link_hijacked"><span class="amount"><span class="Slots">'+orchardArr[i][0]+'</span>';
            if(orchardArr[i][0] > 10000)
                cropsString += '<span class="Quantity" data-tooltip="'+orchardArr[i][0]+'">'+Math.floor(orchardArr[i][0]/1000)+'K</span>';
            else
                cropsString += '<span class="Quantity">'+orchardArr[i][0]+'</span>';
            cropsString += '</span><div class="icon_wrapper"><div class="icon manual_link"><div class="pic IconPic '+orchardArr[i][1].toLowerCase().replace(/ /g,"_")+'"></div><div class="theme_move"></div></div></div><div class="details"><a href="javascript:void(0);" class=" ItemLink"><span class="Name">'+orchardArr[i][1]+'</span><span class="BShidden Type">Plant</span></a></div></div></div>';
        }

        var beginCropSection ='<div id="clanCropsSection" class="Item_InventoryList inventory Qty AtoZ"><div class="ContainerWrapper stackContainer" id="Right_menu"><div class="RightMenu side_block activeItem"><div class="smallchain"></div><div class="toggle"><a href="javascript:void(0);">Clan Crops</a></div><div class="toggle_container"><div class="sub_set"><div class="sub_set ItemHolder">';
        var endCropSection ='</div></div></div></div></div></div>';
        $("#clanCropsSection").html(beginCropSection + cropsString + endCropSection);

        document.getElementById("btnClanCropsAlpha").addEventListener("click", function(){displayClanCropsWithSort(sortNameFunction);}, false);
        document.getElementById("btnClanCropsLevel").addEventListener("click", function(){displayClanCropsWithSort(sortLevelFunction);}, false);
        document.getElementById("btnClanCropsQty").addEventListener("click", function(){displayClanCropsWithSort(sortQtyFunction);}, false);
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