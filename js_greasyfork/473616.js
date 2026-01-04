// ==UserScript==
// @name         No promoted job announces filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  adds filter for hide "promoted" marked announces from job search results
// @author       You
// @match        https://www.linkedin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473616/No%20promoted%20job%20announces%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/473616/No%20promoted%20job%20announces%20filter.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const sleep = ms => new Promise(res => setTimeout(res, ms));


    let blockPromoted = false;

    if(localStorage.getItem("blockPromoted")){
        blockPromoted = JSON.parse(localStorage.getItem("blockPromoted"));
    }

    let allFiltersButton = null;

    while(allFiltersButton == null){
        await sleep(300);
        allFiltersButton =document.getElementsByClassName("artdeco-pill artdeco-pill--slate artdeco-pill--choice artdeco-pill--2 search-reusables__filter-pill-button\nsearch-reusables__filter-pill-button search-reusables__all-filters-pill-button")[0];
    }

    allFiltersButton.addEventListener("click", ()=>addBlockPromotedFilter());


    async function addBlockPromotedFilter(){

        let filterPanelOption = null;

        while(filterPanelOption == null){
            filterPanelOption = document.getElementsByClassName("artdeco-toggle artdeco-toggle--32dp artdeco-toggle--default ember-view")[0];
            await sleep(300);
        }

        filterPanelOption = filterPanelOption.parentElement.parentElement;

        let blockPromotedFilterOption = filterPanelOption.cloneNode(true);
        blockPromotedFilterOption.children[1].innerText = "Filter promoted announces";
        let toggle = blockPromotedFilterOption.children[2].children[0];
        handleBlockPromotedToggle(toggle);
        toggle.addEventListener("click", (ev)=>{
            ev.preventDefault();
            blockPromoted = !blockPromoted;
            localStorage.setItem("blockPromoted", blockPromoted);
            handleBlockPromotedToggle(ev.target);
        });

        filterPanelOption.parentElement.parentElement.insertBefore(blockPromotedFilterOption, filterPanelOption.parentElement.parentElement.children[1]);


    }


    let visitedAnnouncesFooter = [];


    async function handleBlockPromotedToggle(toggle){
        console.log(blockPromoted);
        if(blockPromoted === true){
            toggle.className = "artdeco-toggle artdeco-toggle--32dp artdeco-toggle--default artdeco-toggle--toggled ember-view";
            toggle.children[0].innerText = "Enabled";
        }else{
            toggle.className = "artdeco-toggle artdeco-toggle--32dp artdeco-toggle--default ember-view";
            toggle.children[0].innerText = "Disabled";

        }

        visitedAnnouncesFooter = [];
    }


    while(true){

        let announceFooterDescriptions = document.getElementsByClassName("job-card-container__footer-item inline-flex align-items-center");
        if(announceFooterDescriptions != null){

            let promotedAnnounces = [];

            for(let i = 0 ; i<announceFooterDescriptions.length ; i++){

                if(!visitedAnnouncesFooter.includes(announceFooterDescriptions[i])){
                    if (announceFooterDescriptions[i].innerText.includes("Promo")){
                        promotedAnnounces.push(announceFooterDescriptions[i]);

                        if(blockPromoted){

                            announceFooterDescriptions[i].parentElement.parentElement.style.cssText += 'display:none';
                        }else{
                            announceFooterDescriptions[i].parentElement.parentElement.style.cssText += 'display:block';
                        }

                    }
                    visitedAnnouncesFooter.push(announceFooterDescriptions[i]);
                }
            }


        }
        await sleep(300);

    }






})();