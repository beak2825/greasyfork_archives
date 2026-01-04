// ==UserScript==
// @name        Melvor Auto Sell Items
// @namespace   http://tampermonkey.net/
// @version     0.1
// @description Automatically sells items that you want so your bank is always clean of junk
// @author      WhackyGirl
// @match       https://*.melvoridle.com/*
// @exclude     https://wiki.melvoridle.com*
// @exclude     https://*.melvoridle.com/index.php
// @noframes
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/434670/Melvor%20Auto%20Sell%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/434670/Melvor%20Auto%20Sell%20Items.meta.js
// ==/UserScript==

window.removeItemFromAutoSellList = (e) =>  {
    var itemId = parseInt(e.dataset.itemid);
    var itemsToAutoSell = getAutoSellItemsList();
    itemsToAutoSell = jQuery.grep(itemsToAutoSell, function(value) {
        return value != itemId;
    });
    localStorage.setItem("itemsToAutoSell", JSON.stringify(itemsToAutoSell));

    $("#auto-sell-item-container-" + itemId).remove();
}

function getItemDom(itemId) {
    let itemDom = document.createElement('span');
    itemDom.setAttribute("id", "auto-sell-item-container-" + itemId);
    itemDom.style.setProperty('display', 'flex');
    itemDom.style.setProperty('justify-content', 'space-around');
    $(itemDom).append(
        "<span style='width: 100%;'>" + items[itemId].name + "</span>"
    ).append(
        "<span id='auto-sell-item-" + itemId + "' data-itemid=" + itemId + " onclick=removeItemFromAutoSellList(this) style='color: red; cursor: pointer;'>X</span>"
    ).append(document.createElement('br'));

    return itemDom;
}

function injectDomElements() {
    var itemsToAutoSell = getAutoSellItemsList();

    window.addItemToAutoSellList = () =>  {
        var itemId = selectedBankItem;
        itemsToAutoSell = getAutoSellItemsList();

        if(!itemsToAutoSell.includes(itemId))
            itemsToAutoSell.push(itemId)

        localStorage.setItem("itemsToAutoSell", JSON.stringify(itemsToAutoSell));

        $("#auto-sell-item-sidebar").append(getItemDom(itemId));
    }

    $("#bank-container-sell-item .bank-sell-btn-all").after("<button role='button' class='btn btn-sm btn-success mt-2' id='bank-sell-btn-auto' onclick=addItemToAutoSellList()>Add to Auto Sell</button>");

    let sideBar = document.createElement('div');
    sideBar.setAttribute("id", "auto-sell-item-sidebar");
    sideBar.style.setProperty('position', 'fixed');
    sideBar.style.setProperty('right', '-230px');
    sideBar.style.setProperty('top', '10rem');
    sideBar.style.setProperty('height', '240px');
    sideBar.style.setProperty('width', '230px');
    sideBar.style.setProperty('overflow', 'auto');
    sideBar.style.setProperty('padding', '15px');
    sideBar.style.setProperty('z-index', '999');
    sideBar.style.setProperty('transition', 'right 500ms ease');
    sideBar.style.setProperty('background-color', '#fcfbf3');
    sideBar.style.setProperty('border-radius', '6px 0 0 6px');

    $('#page-container').append(sideBar);

    $(sideBar).append("<p style='margin-bottom: 5px'><strong>Manage items to sell:</strong></p>");

    if(itemsToAutoSell && itemsToAutoSell.length) {
        $.each(itemsToAutoSell, function( index, itemId ) {
            $(sideBar).append(getItemDom(itemId))
        });
    }

    let sideBarButton = document.createElement('div');
    sideBarButton.style.setProperty('position', 'absolute');
    sideBarButton.style.setProperty('right', '0');
    sideBarButton.style.setProperty('top', '200px');
    sideBarButton.style.setProperty('display', 'flex');
    sideBarButton.style.setProperty('align-items', 'center');
    sideBarButton.style.setProperty('border-radius', '6px 0 0 6px');
    sideBarButton.style.setProperty('height', '50px');
    sideBarButton.style.setProperty('width', '30px');
    sideBarButton.style.setProperty('z-index', '999');
    sideBarButton.style.setProperty('transition', 'right 500ms ease');
    sideBarButton.style.setProperty('background-color', '#fcfbf3');
    $('#page-container').append(sideBarButton);

    $(sideBarButton).append(
        $('<img />', {
            src: "/assets/media/main/gp.svg",
            width: '20px',
            height: '20px'
        }).css("margin", "0 auto")
    );

    window.toggleAutoSellSidebar = () =>  {
        sideBar.style.setProperty('right', sideBar.style.getPropertyValue('right') == '-230px' ? '0' : '-230px');
        sideBarButton.style.setProperty('right', sideBarButton.style.getPropertyValue('right') == '230px' ? '0' : '230px');
    };

    sideBarButton.addEventListener('click', toggleAutoSellSidebar);
}

function loadScript() {
    if (confirmedLoaded) {
        // Only load script after game has opened
        clearInterval(scriptLoader);
        injectDomElements();
    }
}

function getAutoSellItemsList() {
    return JSON.parse(localStorage.getItem("itemsToAutoSell")) || [];
}

const scriptLoader = setInterval(loadScript, 200);

var autosell = setInterval(() => {
    getAutoSellItemsList().forEach(function(itemId) {
        const qty = getItemQty(itemId);
        if(qty > 0) {
            updateItemInBank(getBankId(itemId), itemId, -qty);
            player.addGP(getItemSalePrice(itemId) * qty);
        }
    });
}, 5000);