// ==UserScript==
// @name         MouseHunt - Open "All but One" Kits/Spring Eggs
// @author       Jia Hao (Limerence#0448 @Discord)
// @namespace    https://greasyfork.org/en/users/165918-jia-hao
// @version      1.1
// @description  Adds an open "all but one" button to your kits and spring eggs which have > 2 quantity.
// @include      https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/382479/MouseHunt%20-%20Open%20%22All%20but%20One%22%20KitsSpring%20Eggs.user.js
// @updateURL https://update.greasyfork.org/scripts/382479/MouseHunt%20-%20Open%20%22All%20but%20One%22%20KitsSpring%20Eggs.meta.js
// ==/UserScript==

function allButOne() {
    var inventoryQty = $(this).data("qty");
    $(this).parents(".inventoryPage-item-margin.clear-block").find(".quantity").html(inventoryQty - 1);
    app.pages.InventoryPage.useConvertible(this);
    $(this).parent().css("margin-left", "");
    $(this).prev().remove();
    $(this).remove();
}

function initButtons() {
    var pageTitle = hg.utils.PageUtil.getCurrentPageTemplateType();
    if (!pageTitle.includes("Inventory") || $(".mousehuntHud-page-tabHeader.special.active").length != 1) return;

    var kits = $(".inventoryPage-tagContent-tagGroup.clear-block[data-tag='convertibles'] > .inventoryPage-tagContent-listing").children();
    for (var i = 0; i < kits.length; i++) {
        var kit = kits.eq(i);
        var kitName = kit.data("item-type");
        var kitQty = kit.find(".quantity").text();
        if (kit.find(".allButOne").length > 0) return; //Buttons already initialized before
        if (kitQty <= 2) continue; //No need to add buttons for quantity <= 2

        //HTML magic
        var kitsAllButOneButton = '<input type="button" class="inventoryPage-item-button button allButOne" value="All but One" data-item-action="all" data-item-type="'+ kitName + '" data-qty="'+ kitQty + '">';
        var kitsActionButtonsLabel = kit.find(".inventoryPage-item-content-action");
        kitsActionButtonsLabel.css("margin-left", "-35%");
        kitsActionButtonsLabel.append(kitsAllButOneButton);
    }

    var eggs = $(".inventoryPage-tagContent-tagGroup.clear-block[data-tag='spring_hunt'] > .inventoryPage-tagContent-listing").children();
    for (i = 0; i < eggs.length; i++) {
        var egg = eggs.eq(i);
        var eggName = egg.data("item-type");
        var eggQty = egg.find(".quantity").text();
        if (egg.find(".allButOne").length > 0) return; //Buttons already initialized before
        if (eggQty <= 2) continue; //No need to add buttons for quantity <= 2

        //HTML magic
        var eggsAllButOneButton = '<input type="button" class="inventoryPage-item-button button allButOne" value="All but One" data-item-action="all" data-item-type="'+ eggName + '" data-qty="'+ eggQty + '">';
        var eggsActionButtonsLabel = egg.find(".inventoryPage-item-content-action");
        eggsActionButtonsLabel.css("margin-left", "-35%");
        eggsActionButtonsLabel.append(eggsAllButOneButton);
    }

    //Thanks to Tan Y.K. for catching a bug whereby the last element button will not work
    $(".allButOne").on("click", allButOne);
}

$(document).ajaxSuccess(initButtons);
$(document).ready(initButtons);