// ==UserScript==
// @name         Idlescape Show prices on Inventory
// @namespace    ISSpoI
// @version      1.0.0
// @description  Display idlescape.xyz prices on inventory items
// @author       Dael
// @include      *://*idlescape.com/game*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      api.idlescape.xyz
// @downloadURL https://update.greasyfork.org/scripts/426456/Idlescape%20Show%20prices%20on%20Inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/426456/Idlescape%20Show%20prices%20on%20Inventory.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const priceDataRefreshRate = 60 * 1000;

    function start() {
        const gameContainer = document.getElementsByClassName("play-area-container");
        if(gameContainer.length === 0) {
            setTimeout(start, 500);
        } else {
            if (_isIronManCharacter()) return;
            addMutationObserver();
            getPriceData();
            setInterval(() => { getPriceData(); }, priceDataRefreshRate);
        }
    }

    function _isIronManCharacter(){
        return document.getElementsByClassName("header-league-icon")[0].getAttribute("src").includes("ironman");
    }

    function addMutationObserver(){
        const callback = function(mutationsList, observer) {
            if (document.getElementsByClassName("marketplace-content").length > 0) getPriceData();
            if (document.getElementsByClassName("scrollcrafting-main").length > 0) getPriceData();
        };

        // Observe Play Area DOM changes
        const playAreaContainer = document.getElementsByClassName("play-area-container")[0];
        const config = {attributes: true, childList: true, subtree: true };
        const observer = new MutationObserver(callback);
        observer.observe(playAreaContainer, config);
    }

    function getPriceData() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.idlescape.xyz/prices",
            onload: (response) => {
                try{
                    const priceData = {};
                    const apiPriceData = JSON.parse(response.responseText)['items'];
                    apiPriceData.forEach(data => {
                        priceData[data["name"]] = data["price"];
                    });
                    _updateInventoryPrices(priceData);
                } catch(e) {
                    //console.log("Api returned an invalid JSON: " + response.responseText);
                }
            }
        });
    }

    function _updateInventoryPrices(priceData) {
        _addPriceToInventory(priceData);
        _addPriceToMarketplace(priceData);
        _addPriceToScrollcrafting(priceData);
    }

    function _addPriceToInventory(priceData) {
        let inventoryDiv = document.getElementsByClassName("inventory-panel");
        if (inventoryDiv.length === 0) return;
        const regex = /\d+(.+)(vault|stockpile)/;
        inventoryDiv[0].querySelectorAll(".item").forEach(item => {
            let itemName = regex.exec(item.attributes['data-for'].nodeValue)[1];

            const price = priceData[itemName];
            _addPriceDivToItem(item, price);
        })
    }

    function _addPriceToMarketplace(priceData) {
        let marketplaceDiv = document.getElementsByClassName("marketplace-content");
        if (marketplaceDiv.length === 0) return;
        if (document.getElementsByClassName("marketplace-sell-items all-items").length > 0) return;
        marketplaceDiv[0].querySelectorAll(".item-icon").forEach(item => {
            const itemName = item.attributes['alt'].nodeValue;

            item = item.parentNode;
            const price = priceData[itemName];
            _addPriceDivToItem(item, price);
        })
    }

    function _addPriceToScrollcrafting(priceData) {
        let scrollCrafting = document.getElementsByClassName("scrollcrafting-main");
        if (scrollCrafting.length === 0) return;
        scrollCrafting[0].querySelectorAll(".scrollcrafting-image").forEach(item => {
            const itemName = item.attributes['alt'].nodeValue;

            item = item.parentNode;
            const price = priceData[itemName];
            _addPriceDivToItem(item, price);
        })
    }

    function _addPriceDivToItem(item, price){
        if(item.getElementsByClassName("price").length === 0){
            // If the div was not created yet, create it with adapted CSS style and also move down the enchant icon
            const newNode = document.createElement("div");
            newNode.className = "price";
            newNode.style.position = "absolute";
            newNode.style.top = "-4px";
            newNode.style.left = "1px";
            newNode.style.color = "#ffc107";
            newNode.style.fontSize = "11px";
            const lastNode = item.lastElementNode;
            item.insertBefore(newNode, lastNode);
            const enchantNode = item.getElementsByClassName("item-enchant").item(0);
            if (enchantNode != null){
                enchantNode.style.position = "absolute";
                enchantNode.style.top = "8px";
                enchantNode.style.left = "0px";
            }
        }
        if (price !== undefined) item.getElementsByClassName("price").item(0).textContent = price.toLocaleString();
    }

    start();
})();