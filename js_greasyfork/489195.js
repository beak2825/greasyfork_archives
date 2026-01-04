// ==UserScript==
// @name         Improved Channel Select Menu for Mbin
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  Adds subscribed magazines to the channel select menu.
// @author       NeighborlyFedora
// @match        *://kbin.run/*
// @match        *://fedia.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/489195/Improved%20Channel%20Select%20Menu%20for%20Mbin.user.js
// @updateURL https://update.greasyfork.org/scripts/489195/Improved%20Channel%20Select%20Menu%20for%20Mbin.meta.js
// ==/UserScript==

//Code partially based on Floating Subs List by raltsm4k (https://greasyfork.org/en/scripts/469121-floating-subs-list)



let user;
let cacheId;
let subs = [];
let subsHtml = [];
let settings = {
    cacheEnabled: true,
    defaultIcons: true,
    fillOnChange: true
};
const SETTINGS_TEXT = {
    cacheEnabled: "Cache menu items for faster loading.",
    defaultIcons: "Add placeholder icons to iconless magazines.",
    fillOnChange: "Immediately reload menu when a magazine is subscribed."
}
let settingsOpen = false;
let isFilling = false;
let fetchTries = 3;

"use strict";



main();
const observer = new MutationObserver( function(records){
    if(!settings["fillOnChange"]) return
    for(const record of records){
        const subButtons = Array.from(record.addedNodes).filter( node => node.classList !== undefined && node.classList.contains("magazine__subscribe") );
        if(subButtons.length){
            fill();
        };
    }
});
observer.observe(document,{subtree: true, childList: true});



function main() {

    user = document.querySelector("#header a.login").getAttribute("href");
    cacheId = "icsm_" + user;

    if(user === "/login") return;

    const channelList = document.querySelector("#header li:has(a[title='Select a channel']) .dropdown__menu");
    Object.assign(channelList, {
        id: "channel-list"
    });

    let clRefresh = document.querySelector("#cl-refresh")
    if(clRefresh === null){
        clRefresh = Object.assign(document.createElement("button"), {
            id: "cl-refresh",
            title: "Refresh list",
        });
        clRefresh.appendChild(Object.assign(document.createElement("i"), {
            className: "fa-solid fa-rotate"
        }));
    }

    channelList.prepend(clRefresh);
    clRefresh.addEventListener("click", fill);

    let clSettings = document.querySelector("#cl-settings")
    if(clSettings === null){
        clSettings = Object.assign(document.createElement("button"), {
            id: "cl-settings",
            title: "Settings",
        });
        clSettings.appendChild(Object.assign(document.createElement("i"), {
            className: "fa-solid fa-gear"
        }));
    }
    channelList.prepend(clSettings);

    clSettings.addEventListener("click", function(){
        if(settingsOpen){
            closeSettings();
        }else{
            openSettings();
        }
        settingsOpen = !settingsOpen;
    });

    $(document).on("keydown", function(event) {
        if(event.key == "Escape"){
            closeSettings();
        }
    });

    const icsmSettings = Object.assign(document.createElement("ul"), {
        id: "icsm-settings"
    });
    $(icsmSettings).hide();
    channelList.append(icsmSettings);

    icsmSettings.append(Object.assign(document.createElement("h3"), {
        textContent: "Settings"
    }));

    $("<style>").text(
        `
        #header #channel-list {
            scroll-behavior: auto;
            max-width: 60vw;
            width: 25rem;
            height: 25rem;
            overflow-x: hidden;
            overflow-y: scroll;
        }

        #header #channel-list h3 {
            border-bottom: var(--kbin-sidebar-header-border);
            color: var(--kbin-sidebar-header-text-color);
            font-size: .8rem;
            width: 95%;
            margin: 1rem 0 0 2.5%;
            text-transform: uppercase;
        }

        #cl-refresh {
            display: inline !important;
            position: absolute;
            background: none;
            border: 0;
            color: var(--kbin-meta-link-color);
            cursor: pointer;
            height: auto;
            width: auto;
            text-indent: 0;
            right: 2.5%;
            text-align: right;
            margin: 1rem 0 0 1rem;
            padding: 0 !important;
        }

        #cl-settings {
            display: inline !important;
            position: absolute;
            background: none;
            border: 0;
            color: var(--kbin-meta-link-color);
            cursor: pointer;
            height: auto;
            width: auto;
            text-indent: 0;
            right: calc(2.5% + 1.25rem);
            text-align: right;
            margin: 1rem 0 0 1rem;
            padding: 0 !important;
        }

        #cl-refresh:hover, #cl-settings:hover {
            color: var(--kbin-meta-link-hover-color);
        }

        #icsm-settings {
            padding: 0;
        }

        #icsm-settings li {
            padding: .35rem 1rem;
        }

        #icsm-settings input {
            min-width: 1.5rem;
            margin-right: .4rem;
        }

        #header #channel-list li {
            height: auto;
        }

        #header #channel-list #sub_item a:has(figure) {
            display: flex !important;
            justify-content: left;
        }

        #header #channel-list a {
            overflow-x: hidden;
            position: relative;
            padding: .35rem 1rem !important;
        }

        #header #channel-list #sub_item figure{
            float: left;
            margin-right: .25rem;
        }

        #header #channel-list #sub_item figure :is(img,i){
            width: 1.25rem;
            height: 1.25rem;
            vertical-align: middle;
        }

        #header #channel-list #sub_item figure i {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            top: .15rem;
        }

        #header #channel-list #sub_item figure i::before{
            vertical-align: middle;

        }

        #header #channel-list::-webkit-scrollbar {
            width: 8px;
        }

        .rounded-edges #header #channel-list::-webkit-scrollbar-track {
            border-top-right-radius: var(--kbin-rounded-edges-radius);
            border-bottom-right-radius: var(--kbin-rounded-edges-radius);
        }

        .rounded-edges #header #channel-list::-webkit-scrollbar-thumb  {
            border-radius: var(--kbin-rounded-edges-radius);
        }


        #header #channel-list::-webkit-scrollbar-track {
            background: var(--kbin-bg);
            border-left: var(--kbin-section-border);
        }


        #header #channel-list::-webkit-scrollbar-thumb {
            background: var(--kbin-meta-link-color);
            border-left: var(--kbin-section-border);
            transition-duration: 0.4s;
        }
        #header #channel-list::-webkit-scrollbar-thumb:hover {
            background: var(--kbin-meta-link-hover-color);
        }
        `
    ).appendTo(document.head);

    const settingsCache = JSON.parse(localStorage.getItem(cacheId + "_settings"));
    if(settingsCache !== null){
        Object.assign(settings, settingsCache);
    }
    for (const [key, val] of Object.entries(settings)) {
        if(SETTINGS_TEXT[key] === undefined) continue;
        const item = document.createElement("li");
        const checkbox = Object.assign(document.createElement("input"), {
            type: "checkbox",
            checked: val
        });
        item.append(checkbox);
        item.append(Object.assign(document.createElement("span"), {
            textContent: SETTINGS_TEXT[key]
        }));
        icsmSettings.append(item);
        checkbox.addEventListener("change", function(event){
            settings[key] = checkbox.checked;
            localStorage.setItem(cacheId + "_settings", JSON.stringify(settings));
        });
    }
    localStorage.setItem(cacheId + "_settings", JSON.stringify(settings));


    const cache = JSON.parse(localStorage.getItem(cacheId));
    if (!settings["cacheEnabled"] || cache === null || Date.now() >= cache.expire) {
        fill();
    } else if(!isFilling) {
        isFilling = true;
        empty();
        console.log("Fetching from cache....");
        cache.subs.forEach(function(cached_html){
           subs.push($(Object.assign(document.createElement("li"),{
               id: "sub_item"
           })).html(cached_html))
        });
        complete();
    }

}

function fill(){
    if(isFilling) return;
    isFilling = true;
    $("#channel-list").children("li").show();
    $("#channel-list").children("h3").show();
    $("#icsm-settings").hide();
    localStorage.removeItem(cacheId);
    empty();
    $("#cl-refresh").find("i").addClass("fa-spin");
    fetchSubs(1);
}

function empty(){
    subs.forEach((sub) => { sub.remove();} );
    subs = [];
    subsHtml = [];
}

function fetchSubs(page){
    $.get( window.location.origin + "/settings/subscriptions/magazines?p=" + page, function(data) {
        const $dom = $($.parseHTML(data));
        const $subsList = $dom.find("#content .magazines ul");
        console.log("Fetching page " + page + " of subscriptions....");
        if (!$subsList.length) {
            if (fetchTries > 0) {
                console.log("Failed to fetch page " + page + " of subscriptions. Retrying....");
                fetchTries--;
                fetchSubs(page);
            } else {
                console.log("Failed to fetch page " + page + " of subscriptions. Out of attempts.");
                failSubs();
            }
        }else{
            fetchTries = 3;
            const $newSubs = $subsList.children("li");
            $newSubs.each(function() {

                $(this).prop("id", "sub_item");

                const $link = $(this).find("a");

                const $icon = $(this).find("figure");
                if($icon.length){
                    $link.prepend($icon);
                }

                $link.removeClass();
                if(window.location.href.includes("/m/"+$link.text())){
                   $link.addClass("active");
                }


                $(this).append($link);
                $(this).find("small").remove();
                $(this).find("div").remove();
                subs.push($(this));
                subsHtml.push($(this).html());

            });
            const $pg = $dom.find("#content .pagination__item--next-page.pagination__item--disabled");

            if ($pg.length) {
                if(settings["cacheEnabled"]){
                    cache();
                }
                complete();
            } else {
                fetchSubs(page+1);
            }
        }
    }).fail(function() {
        console.log("Error occurred in reaching page " + page + " of subscriptions.");
        failSubs();
    });
}

function failSubs(){
    console.log("Skipping to menu completion.");
    cache();
    complete();
}

function cache(){
    localStorage.setItem(cacheId, JSON.stringify({subs: subsHtml, expire: Date.now() + 15 * 60 * 1000}));
}


function complete(){

    console.log("Completing menu....");

    $("#cl-refresh").find("i").removeClass("fa-spin");

    $("#channel-list").children("h3").remove();

    $("#channel-list").prepend($(Object.assign(document.createElement("h3"), {
        id: "cl-header-feeds",
        textContent: "Feeds"
    })));

    $("#channel-list").prepend($("#cl-refresh"));
    $("#channel-list").prepend($("#cl-settings"));
    completeSubs();

    $("#channel-list").append($("#icsm-settings"));

    console.log("Done!");

    isFilling = false;
}


function completeSubs(){

    $("#channel-list").append($(Object.assign(document.createElement("h3"), {
        id: "cl-header-subs",
        textContent: "Subscribed Magazines"
    })));

    subs.sort(function(a, b){
        return a.find("a").text().trim().toLowerCase().localeCompare(b.find("a").text().trim().toLowerCase());
    });

    subs.forEach(function($sub) {
        $("#channel-list").append($sub);
        const $link = $sub.find("a")
        if(!$sub.find("figure img").length) {
            $sub.find("figure").remove();
            if(settings["defaultIcons"]){
                const icon = document.createElement("figure");
                icon.append(Object.assign(document.createElement("i"), {
                    className: "fa-solid fa-newspaper"
                }));
                $link.prepend($(icon));
            }
        }
        if( window.location.href.endsWith("/m/"+$link.text().trim()) || window.location.href.includes("/m/"+$link.text().trim()+"/") ){
            $link.addClass("active");
        }else{
            $link.removeClass("active");
        }
    })

}


function openSettings(){
    if(isFilling) return;
    $("#channel-list").children("li").hide();
    $("#channel-list").children("h3").hide();
    $("#icsm-settings").show();
}


function closeSettings(){
    complete();
    $("#channel-list").children("li").show();
    $("#channel-list").children("h3").show();
    $("#icsm-settings").hide();
}