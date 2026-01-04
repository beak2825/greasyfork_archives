// ==UserScript==
    // @name         GC Keyboard Controls
    // @namespace    grundos-cafe
    // @version      1.02
    // @description  Adds keyboard controls around GC
    // @author       Z & Dij & nonhic
    // @match        https://www.grundos.cafe/halloween/esophagor/*
    // @match        https://www.grundos.cafe/island/kitchen/*
    // @match        https://www.grundos.cafe/winter/snowfaerie/*
    // @match        https://www.grundos.cafe/halloween/witchtower/*
    // @match        https://www.grundos.cafe/halloween/braintree/*
    // @match        https://www.grundos.cafe/winter/grundo/*
    // @match        https://www.grundos.cafe/safetydeposit/*
    // @match        https://www.grundos.cafe/market/wizard/*
    // @match        https://www.grundos.cafe/market/browseshop/?owner=*
    // @match        https://www.grundos.cafe/games/*dicearoo/*
    // @match        https://www.grundos.cafe/dome/1p/*battle/
    // @match        https://www.grundos.cafe/adopt/
    // @license      MIT
    // @grant        none
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @downloadURL https://update.greasyfork.org/scripts/506321/GC%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/506321/GC%20Keyboard%20Controls.meta.js
    // ==/UserScript==
     
    (function() {
     window.addEventListener("keydown", (event) => {
         if(event.target.matches("input[type='text']")) {return;} //if entering text in a text box, don't record keydown event
         let arrowKey = 0;
         let questSidebarCount = 0; //initialize some useful variables
            switch (event.code) {
                case "Enter":
                case "NumpadEnter":
                    if (location.pathname.match(/safetydeposit/)) {
                        const SDBrmOne = document.querySelector("a.sdb-remove-one-text");
                        if (SDBrmOne) SDBrmOne.click();
                    } else if (location.pathname.match(/market\/browseshop/)) {
                        const USbuy = document.querySelector("#searchedItem.shop-item input[type='image']");
                        if (USbuy) USbuy.click();
                    } else if (location.pathname.match(/market\/wizard/)) {
                        const SWsearch = document.querySelector("div.sw_search_submit input.form-control");
                        const SWshop = document.querySelector(".market_grid.sw_results .data a:nth-child(1)");
                        if (SWsearch) SWsearch.click();
                        else if (SWshop) SWshop.click();
                    } else if (location.pathname.match(/halloween|island|winter/)) {
                        const questStart = document.getElementById("page_content").querySelector("form[action*='accept'] .form-control");
                        const questComplete = document.getElementById("page_content").querySelector(".form-control[onclick*='complete']");
                        const questRestart = document.getElementById("page_content").querySelector(".form-control:not([value*='Return'])");
                        if (questStart) questStart.click();
                        else if (questComplete) questComplete.click();
                        else if (questRestart) questRestart.click();
                    } else if (location.pathname.match(/dicearoo/)) {
                        const dicearooRA = document.querySelector("form[id='roll-again'] > input[type='submit']");
                        const dicearooPM = document.querySelector("input[value='Press Me']");
                        const dicearooPlay = document.querySelector("form[action*='play_dicearoo'] > input[type='submit']");
                        if (dicearooPlay) dicearooPlay.click();
                        else if (dicearooRA) dicearooRA.click();
                        else if (dicearooPM) dicearooPM.click();
                    } else if (location.pathname.match(/dome\/1p/)) {
                        const BDgo = document.querySelector("input[value='Go!']:not(.ignore-button-size)");
                        const BDnext = document.querySelector("input[value='Next']");
                        const BDrematch = document.querySelector("input[value='Rematch!']");
                        if (BDgo) BDgo.click();
                        else if (BDnext) BDnext.click();
                        else if (BDrematch) BDrematch.click();
                    } else if (location.pathname.match(/adopt/)) {
                        const adoptNext = document.querySelector("input[value='Find a Neopet at Random']");
                        if (adoptNext) adoptNext.click();
                    } break;
                case "ArrowDown":
                    arrowKey++; //falls through, select the fourth item with down arrow
                case "ArrowRight":
                    arrowKey++; //falls through, select the third item with right arrow
                case "ArrowUp":
                    arrowKey++; //falls through, select the second item with up arrow
                case "ArrowLeft":
                    arrowKey++; //select the first item with left arrow
                    if (location.pathname.match(/halloween|island|winter/) && arrowKey <= document.querySelector(".itemList").childElementCount) {
                        let itemInInv = document.querySelector(`.itemList .shop-item:nth-child(${arrowKey}) img.search-helper-in-inv`);
                        let itemInSDB = document.querySelector(`.itemList .shop-item:nth-child(${arrowKey}) img.search-helper-sdb-exists`);
                        if (itemInInv) {
                            console.log("since the item is already in your inv, you don't need to search anywhere for it!");
                            break;
                        }
                        else if (itemInSDB) { //if the item already exists in your SDB, click that icon to get it
                            itemInSDB.click();
                        } else { //if neither, search it on the SW
                            document.querySelector(`.itemList .shop-item:nth-child(${arrowKey}) img.search-helper-sw`).click();
                        }
                    } break;
                case "Digit7":
                    questSidebarCount++; //falls through
                case "Digit6":
                    questSidebarCount++; //falls through
                case "Digit5":
                    questSidebarCount++; //falls through
                case "Digit4":
                    questSidebarCount++; //falls through
                case "Digit3":
                    questSidebarCount++; //falls through
                case "Digit2":
                    questSidebarCount++; //falls through
                case "Digit1":
                    if (location.pathname.match(/halloween|island|winter|faerieland/)) {
                        let rankOrderDiv = document.querySelectorAll('.quests .aioImg div');
                        let rankOrderList = Array.prototype.slice.call(rankOrderDiv).sort((a, b) => {
                            var aOrder = a.getAttribute('style').match(/order:(\d+)/)[1]; var bOrder = b.getAttribute('style').match(/order:(\d+)/)[1]; if (aOrder > bOrder) return 1; if (aOrder < bOrder) return -1; return 0;})
                        $(rankOrderList[questSidebarCount].firstChild.click());
                    } break;
            }
     });
    })();