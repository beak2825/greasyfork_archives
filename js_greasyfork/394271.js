// ==UserScript==
// @name         Hordes Deals
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shows you merchant listings that cost less than their npc value
// @author       Cullen
// @match        https://hordes.io/play
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394271/Hordes%20Deals.user.js
// @updateURL https://update.greasyfork.org/scripts/394271/Hordes%20Deals.meta.js
// ==/UserScript==

(function(){
    'use strict';
    // TO-DO
    // When hovering a list, save first, then hide hovers, THEN compare and highlight
    // Merchant+ menu in settings to enable/disable/explain features
    // Filter rarity (colour vs %s? Probably colour, faster)
    // Filter item stats
    // FIXED Bug: When you uncheck Deals while deals are highlighted they stay highlighted

    //Sloppy global variables
    var areWeHovering = false, currentItemList, deals = false, dealCount = 0;

    function init(){
        //TO-DO Attach anything that needs to be listening constantly
        //alert("hello");
    }

    //Add "Deals" checkbox to merchant UI when it's opened and attach listener
    function dealsInit(){
        const dealsContainer = document.createElement("div");
        dealsContainer.className = "marg svelte-1gzciq8";

        const dealsCheckbox = document.createElement("div");
        if(deals){
            dealsCheckbox.className = "btn checkbox active";
        }
        else{
            dealsCheckbox.className = "btn checkbox";
        }
        dealsCheckbox.id = "dealsToggle";

        const dealsLabel = document.createElement("div");
        dealsLabel.style.display = "inline"
        dealsLabel.innerText = " Deals ";
        dealsLabel.id = "dealsLabel";

        dealsContainer.appendChild(dealsCheckbox);
        dealsContainer.appendChild(dealsLabel);

        const sacrifice = document.querySelector(".search span:not([class])")

        document.querySelector(".search").replaceChild(dealsContainer, sacrifice);

        document.querySelector('#dealsToggle').addEventListener('click', toggleDeals);
    }


    //Purely to be used by "Deals" checkbox
    function toggleDeals(){
        if(!deals){
            document.querySelector("#dealsToggle").classList = "btn checkbox active"
            deals = true;
            merchantObserver.observe(document.querySelector('.items'), merchantConfig);
            merchantObserver2.observe(document.querySelector('.items'), merchantConfig2);
            merchantCallback(null, null);
        }
        else{
            document.querySelector("#dealsToggle").classList = "btn checkbox"
            deals = false;
            merchantObserver.disconnect();
            merchantObserver2.disconnect();
            document.querySelector("#dealsLabel").innerText = " Deals ";
            currentItemList.forEach(function(item, i){
                item.style.border = "";
            });
        }
    }

    //Hover on/off all items being displayed in merchant so we can scrape item values
    function hoverEnterLeave(state){
        // Unexpected and concerning error if it pops up
        if(state != "enter" && state != "leave"){
                console.log("Choice wasn't picked in hoverEnterLeave");
                state = "leave";
        }

        // Controls whether or not we'll try to highlight later
        areWeHovering = state == 'leave' ? false : true;

        currentItemList = document.querySelectorAll(".buy")
        if(currentItemList.length > 1){
            
            Array.from(currentItemList).forEach(function(item, i){
                if(i != 0){
                    item.children[0].dispatchEvent(new Event('pointer' + state));
                };
            });
        }
        else{
            document.querySelector("#dealsLabel").innerText = " Deals (0)";
        }
    }

    //Handle item value and prices being split into copper/silver/gold elements
    function currencyCheck(item, i){
        var value = 0;

        if(!!item.querySelector('.textcopper')){
            value += Number(item.querySelector('.textcopper').innerText);
        }
        if(!!item.querySelector('.textsilver')){
            value += Number(item.querySelector('.textsilver').innerText) * 100;
        }
        if(!!item.querySelector('.textgold')){
            value += Number(item.querySelector('.textgold').innerText) * 10000;
        }

        var price = 0;

        if(currentItemList[i+1] != undefined){

            if(!!currentItemList[i+1].querySelector('.textcopper')){
                price += Number(currentItemList[i+1].querySelector('.textcopper').innerText);
            }
            if(!!currentItemList[i+1].querySelector('.textsilver')){
                price += Number(currentItemList[i+1].querySelector('.textsilver').innerText) * 100;
            }
            if(!!currentItemList[i+1].querySelector('.textgold')){
                price += Number(currentItemList[i+1].querySelector('.textgold').innerText) * 10000;
            }

            if(value > price){
                currentItemList[i+1].style.border = "5px solid yellow";
                dealCount++;
            }
            else{
                currentItemList[i+1].style.border = "";
            }
        }
    }

    //Iterate through all hovered items to individually run a function to compare price and value, then kill the hover
    function highlightItems(){
        var promises = [];

        dealCount = 0;

        Array.from(document.querySelectorAll(".search .container p")).forEach(function(item, i){
            promises.push(currencyCheck(item, i));
        });

        Promise.all(promises).then(()=>
            hoverEnterLeave('leave')
        );

        document.querySelector("#dealsLabel").innerText = " Deals (" + dealCount + ")";
    }

    //Setup observer to watch for changes in Merchant's items list UI
    var merchantHasLoaded = false;
    //Config/Observer 1 handles when the list of items stays full (100) but the content of the items change
    const merchantConfig = { attributes: false, childList: false, subtree: true, characterData: true };
    //Config/Observer 2 only handles when the number of list items changes (usually from 100 to 0 and reverse)
    const merchantConfig2 = { attributes: false, childList: true, subtree: false, characterData: true };
    const merchantCallback = function(mutationList, observer){
        // Save to merchant list

        //Trigger hovers
        hoverEnterLeave('enter');

        //Trigger highlights
    };
    const merchantObserver = new MutationObserver(merchantCallback);
    const merchantObserver2 = new MutationObserver(merchantCallback);


    //Main handler, sets up most things
    var initHasLoaded = false;
    const initTargetNode = document.body;
    const initConfig = { attributes: true, childList: true, subtree: true };
    const initCallback = function(mutationList, observer){
        const isMerchantLoaded = !!document.querySelector('.search');
        const isHoverLoaded = document.querySelectorAll('.search .container').length > 10;

        /*const isUILoaded = !!document.querySelector('.layout');
        if (isUILoaded && !initHasLoaded) {
            initHasLoaded = true;
	    	init();
	    }*/

        //Merchant UI was opened, try and setup deals observers
        if (isMerchantLoaded && !merchantHasLoaded) {
            merchantHasLoaded = true;
            dealsInit();
	    	if(deals){
                merchantObserver.observe(document.querySelector('.items'), merchantConfig);
                merchantObserver2.observe(document.querySelector('.items'), merchantConfig2);
            }
            else{
                merchantObserver.disconnect();
                merchantObserver2.disconnect();
            }
	    }

        //Merchant UI was closed, kill observers
        if (!isMerchantLoaded && merchantHasLoaded){
            merchantHasLoaded = false;
            merchantObserver.disconnect();
            merchantObserver2.disconnect();
        }

        //Waiting for hover UIs to actually load before trying to highlight, also stopping unnecessary repeated runs
        if(isHoverLoaded && areWeHovering){
            areWeHovering = false;
            highlightItems();
        }
    };
    const initObserver = new MutationObserver(initCallback);
	initObserver.observe(initTargetNode, initConfig);
})();