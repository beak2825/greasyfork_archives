// ==UserScript==
// @name           ozon.ru filter
// @author         Nemo (Papageno)
// @namespace      Papageno
// @version        1.1
// @description    Clear the main page of ozon.ru from garbage
// @match          https://www.ozon.ru/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon           http://ozon.ru/favicon.ico
// @grant          GM_log
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/518350/ozonru%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/518350/ozonru%20filter.meta.js
// ==/UserScript==

function remove_element(title, elements){
    GM_log("To remove: " + elements.length);
    for(const element of elements){
        GM_log('Removing ' + title + ', class: ' + element.getAttribute("class"));
        //element.setAttribute("style", "width:1416px;height:0px;min-width:1050px;min-height:0px;");
        element.remove();
    }
}

function search_element(text){
    GM_log("Looking for: " + text);
    const elements = document.querySelectorAll(text);
    GM_log("Found: " + elements.length);
    return elements;
}

function main(){
    var elements = search_element("[data-widget='advBanner']");
    remove_element('advBanner', elements);
    elements = search_element("[data-widget='separator']");
    remove_element('separator', elements);
    elements = search_element("[data-widget='island']");
    remove_element('island', elements);
    elements = search_element("[data-widget='skuShelfGoods']");
    remove_element('skuShelfGoods', elements);
    elements = search_element("[data-widget='skuGrid']");
    remove_element('skuGrid', elements);
    elements = search_element("[data-widget='seasonWidget']");
    remove_element('seasonWidget', elements);
    elements = search_element("[data-widget='bannerCarousel']");
    remove_element('bannerCarousel', elements);
    elements = search_element("[data-widget='objectBannerList']");
    remove_element('objectBannerList', elements);
    elements = search_element("[data-widget='advVideoBanner']");
    remove_element('advVideoBanner', elements);
    elements = search_element("[data-widget='banner']");
    remove_element('banner', elements);
    elements = Array.from(search_element("[data-widget='freshIsland']"));
    remove_element('freshIsland', elements.slice(0, elements.length - 1));
}


setTimeout(function(){
    main();
    }, 2000);

//window.addEventListener(
//    "scroll", main, false
//);
