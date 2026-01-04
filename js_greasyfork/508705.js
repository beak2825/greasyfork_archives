// ==UserScript==
// @name         Subito.it Tools
// @namespace    https://gist.github.com/nicola02nb
// @version      0.14
// @description  Rimuove i banner pubblicitari e i prodotti venduti dalla ricerca
// @author       nicola02nb (https://gist.github.com/nicola02nb)
// @match        https://www.subito.it/annunci-*/vendita/*
// @match        https://www.subito.it/*/*.htm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=subito.it
// @grant        none
// @run-at       document-start
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/508705/Subitoit%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/508705/Subitoit%20Tools.meta.js
// ==/UserScript==
let $ = window.jQuery;//Dipendenza

let btn;
let btnElement;
let hide=true;

const adsSelector = [
    'div[id^="ad_wrapper_"]',
    'iframe[id^="google_ads_iframe_"]',
    'div[class^="AdsGAMP"]',
    'div[id="apn_skin_tag"]',
    'button[class^="banner-module_sticky-banner_"]',
    'div[id="desktop-after-listing-lp-market"]',
    'div[class^="AdsBeforeListingBlock_adsense-before-listing-container_"]'
].join(', ');

//Funzione che elimina tutti i banner pubblicitari durante la ricerca
function deleteAds(){
    document.querySelectorAll(adsSelector).forEach(div => {
        div.remove();
    });
}

let style=document.createElement('style');
style.innerHTML=`
article:has(div > span[class*="soldBadge"]) {
    display: none !important;
}
`;
//Funzione che rimuove tutti i prodotti venduti
function toggleHideSold(){
    if(hide){
        document.head.appendChild(style);
    } else {
        document.head.removeChild(style);
    }
}

//Aggiorna lo stile del bottone per nascondere i prodotti venduti
function updateButton(toggle = true){
    if (toggle) hide = !hide;
    if(hide){
        btn.attr("aria-checked","true");
        btn.attr("data-state","checked");
        btnElement.setAttribute("data-state", "checked");
    }
    else{
        btn.attr("aria-checked","false");
        btn.attr("data-state","unchecked");
        btnElement.setAttribute("data-state", "unchecked");
    }
    toggleHideSold();
}

//Funzione che crea un interruttore per abilitare/disabilitare la visione di prodotti venduti
function initializeButton(){
    let old_section=$("#filters-container:nth-child(1)");

    let section=old_section.clone();
    section.find("h5").text("Plugin Filters");
    section.find("p").text("Custom Filters");
    section.find("label").text("Nascondi venduti").attr("id","radx-99").attr("for","/isSold");

    btn=section.find("button");
    btn.attr("id","/isSold").attr("aria-labelledby","radx-99");
    btnElement = btn.find("span")[0];
    btn.on("click",updateButton);
    updateButton(false);

    let i=0;
    section.find("[class^=\"index-module_container_\"]").each(function(){
        if(i>0)$( this ).remove();
        i+=1;
    });
    old_section.before(section);
}

//Funzione eliminare elementi dalla pagina
function deleteStuff(){
    toggleHideSold();
    deleteAds();
}

//Inizializzatione del bottone e Interval al termine del caricamento della pagina
window.onload = () => {
    initializeButton();
    deleteStuff();
    setInterval(deleteStuff,1000);
}