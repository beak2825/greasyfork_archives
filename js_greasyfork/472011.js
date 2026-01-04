// ==UserScript==
// @name         Not more job spamposting
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  block the spammy publishers!
// @author       You
// @match        https://www.linkedin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472011/Not%20more%20job%20spamposting.user.js
// @updateURL https://update.greasyfork.org/scripts/472011/Not%20more%20job%20spamposting.meta.js
// ==/UserScript==


(async function() {

    'use strict';

    const sleep = ms => new Promise(res => setTimeout(res, ms));


    //contains the blocked posters
    let blockedSources = [];


    let visitedAnnounces = [];


    let blockedPosts = [];

    if(localStorage.getItem("blockedSources") != null){

        blockedSources = JSON.parse(localStorage.getItem("blockedSources"));
    }
    //select the the button to copy

    let threeDottedButton = null;

    //copy element for the button
    async function searchButton(){
        while(threeDottedButton == null){
            await sleep(300);
            threeDottedButton = document.getElementsByClassName("msg-overlay-bubble-header__dropdown-trigger artdeco-button artdeco-button--1 artdeco-button--circle artdeco-button--muted artdeco-button--tertiary artdeco-dropdown__trigger artdeco-dropdown__trigger--placement-top ember-view")[0];
        }
    }

    await searchButton();



    //serch for the "all filters" button


    async function searchFiltersButton(){

        let filterButton = null;

        while(filterButton == null || filterButton.length == 0){

            await sleep(300);
            filterButton = document.getElementsByClassName("artdeco-pill artdeco-pill--slate artdeco-pill--choice artdeco-pill--2 search-reusables__filter-pill-button\n     search-reusables__filter-pill-button search-reusables__all-filters-pill-button"
);

        }

        filterButton = filterButton[0];

        filterButton.addEventListener('click', ()=>{
            searchFiltersList();
        });


    }

    searchFiltersButton();

    async function searchFiltersList(){

        let filtersList = null;

        while(filtersList == null){
            await sleep(300);
            filtersList = document.getElementsByClassName("search-reusables__secondary-filters-filter");
        }

        let blockingSourcesFilter = document.createElement('li');
        let fieldSet = document.createElement('fieldset');
        let blockingSourcesTitle = document.createElement('h3');
        blockingSourcesTitle.innerText = "Blocked announcers";
        blockingSourcesTitle.className = "t-16 t-black t-bold inline-block";
        fieldSet.appendChild(blockingSourcesTitle);

        let pillContainer = document.createElement('div');
        pillContainer.style.cssText += "width:100%;gap:1em;display:flex;flex-wrap:wrap;margin-top:24px;";
        pillContainer.className = "t-14 t-black--light t-normal";

        if(blockedSources.length == 0){

            pillContainer.innerText = "You haven't block any announcer yet";

        }

        for(let i=0; i<blockedSources.length; i++){

            let pill = document.createElement('button');
            pill.className = "artdeco-dropdown__trigger artdeco-dropdown__trigger--placement-bottom ember-view artdeco-pill artdeco-pill--slate artdeco-pill--choice artdeco-pill--2 search-reusables__filter-pill-button artdeco-pill--selected cursor-pointer";
            pill.innerText = blockedSources[i];

            let closeIcon = document.getElementsByClassName("mercado-match")[0].cloneNode(true);
            closeIcon.style.cssText += "margin-left:4px;width:16px;height:16px";

            pill.appendChild(closeIcon);

            pill.addEventListener('click', (ev) => {
                ev.preventDefault();
                unblockAnnouncer(pill.innerText);
                 if(blockedSources.length == 0){

                     pillContainer.innerText = "You haven't block any announcer yet";

                 }
                pill.remove();
            });

            pillContainer.appendChild(pill);
        }

        fieldSet.appendChild(pillContainer);
        let divider = document.createElement('hr');
        divider.className = "reusable-search-filters-advanced-filters__divider";
        fieldSet.appendChild(divider);

        blockingSourcesFilter.appendChild(fieldSet);


        filtersList[0].parentElement.insertBefore(blockingSourcesFilter, filtersList[0]);
    }


    function unblockAnnouncer(announcer){

        blockedSources = blockedSources.filter(element => element !== announcer);
        localStorage.setItem("blockedSources", JSON.stringify(blockedSources));
        revealHiddenPosts(announcer);
        console.log(blockedSources);
    }


    function revealHiddenPosts(announcer){

        for(let i = 0; i< blockedPosts.length; i++){

            if(blockedPosts[i].children[0].children[1].children[1].children[0].innerText.trim() == announcer){
                blockedPosts[i].style.cssText = 'display:block';
            }
        }


    }








    function openBlockDialog(parentButton){

        let publisher = parentButton.parentElement.children[0].children[1].children[1].children[0].innerText;

        let dialog = document.createElement('div');
        dialog.className = "artdeco-hoverable-content__shell";
        dialog.style.cssText += 'position:absolute;width:max-content;padding:0.5em;right:0;z-index:9999;'

        let dialogOption = document.createElement('div');
        dialogOption.className = "artdeco-dropdown__item artdeco-dropdown__item--is-dropdown ember-view";
        dialogOption.innerText = "block posts from "+publisher;
        dialogOption.style.cssText += 'display:flex;flex-direction:row-reverse;align-items:center;gap:1em;';
        dialogOption.addEventListener('click', (ev)=>{
            ev.preventDefault();
            blockedSources.push(publisher);
            localStorage.setItem("blockedSources", JSON.stringify(blockedSources));
            let successNotification = document.createElement('div');
            successNotification.innerText = "You will no longer see announces from "+publisher;
            successNotification.style.cssText += "color:var(--color-signal-positive);text-align:center;height:155px;display:flex;flex-direction:column;flex-align:center;justify-content:center;";
            parentButton.parentElement.parentElement.insertBefore(successNotification, parentButton.parentElement);
            sleep(3000).then(()=>{successNotification.remove()});
        })

        let icon = document.getElementsByClassName("job-card-container__action artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view")[0].children[0];
        icon = icon.cloneNode(true);

        dialogOption.appendChild(icon);
        dialog.appendChild(dialogOption);


        parentButton.appendChild(dialog);


        document.body.addEventListener('click', (e) => {
            if(!e.target.classList.contains("artdeco-dropdown__item") && !e.target.classList.contains("artdeco-hoverable-content__shell")){
                dialog.remove();
            }
        }
        )

    }



    while(true){

        await sleep(300);

	    let jobAnnounces = null;

        jobAnnounces = document.getElementsByClassName("job-card-container__primary-description");

        for(let i = 0 ; i<jobAnnounces.length; i++){

            if(!visitedAnnounces.includes(jobAnnounces[i])){

                let newButton = threeDottedButton.cloneNode(true);

                newButton.style.cssText += 'position:absolute;right:0;bottom:0;overflow:visible;'
                newButton.addEventListener('click', (e)=>{
                    e.stopPropagation();
                    openBlockDialog(newButton);
                });

                jobAnnounces[i].parentElement.parentElement.parentElement.parentElement.appendChild(newButton);
                visitedAnnounces.push(jobAnnounces[i]);
            }

            // let newButton = threeDottedButton.cloneNode(true);

            // newButton.style.cssText += 'position:absolute;bottom:0;right:0;';

            // jobAnnounces[i].parentElement.parentElement.parentElement.parentElement.appendChild(newButton);

        if(blockedSources.includes(jobAnnounces[i].innerText) ){
                jobAnnounces[i].parentElement.parentElement.parentElement.parentElement.style.cssText = 'display:none';
               blockedPosts.push(jobAnnounces[i].parentElement.parentElement.parentElement.parentElement);
            }

        }

    }


})();