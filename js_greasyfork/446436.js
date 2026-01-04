// ==UserScript==
// @name         MouseHunt Enhanced Search (Beta)
// @description  Improve the search logic of search bars in the game
// @author       LethalVision
// @version      1.2.3
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/en/users/683695-lethalvision
// @downloadURL https://update.greasyfork.org/scripts/446436/MouseHunt%20Enhanced%20Search%20%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/446436/MouseHunt%20Enhanced%20Search%20%28Beta%29.meta.js
// ==/UserScript==

// reference dictionaries in the format of <item name>:<search tags> - item names *must* be exact
// search tags are case insensitive, set tags to empty to indicate that the item should be skipped
// only exceptions/special cases need to be defined here, the script automatically generates the acronyms otherwise
const CHEESE = {
    "Bonefort Cheese":"BF","Checkmate Cheese":"CMC","Cloud Cheesecake":"CCC","Dragonvine Cheese":"DVC","Empowered SUPER|brie+":"ESB","First Draft Derby Cheese":"FDDC#1D",
    "Fusion Fondue":"M400#FF ","Second Draft Derby Cheese":"SDDC#2D ","Galleon Gouda":"GGC","Limelight Cheese":"LLC","Nian Gao'da Cheese":"NGD","Polter-Geitost":"PG",
    "SUPER|brie+":"SB","Wildfire Queso":"WF"
}
const CHARMS = {
    "Baitkeep Charm":"BKC","Festive Anchor Charm":"FAC#EAC","EMP400 Charm":"M400#EC","Timesplit Charm":"TSC","Dragonbane Charm":"DBC","Super Dragonbane Charm":"SDBC",
    "Extreme Dragonbane Charm":"EDBC","Ultimate Dragonbane Charm":"UDBC","Party Charm":"PaC","Super Party Charm":"SPaC","Extreme Party Charm":"EPaC",
    "Ultimate Party Charm":"UPaC","Rift Vacuum Charm":"RVC#Calcified Rift Mist#CRM","Rift Super Vacuum Charm":"RSVC#Calcified Rift Mist#CRM","Cherry Charm":"CC#funnel",
    "Gnarled Charm":"GC#funnel","Stagnant Charm":"SC#funnel"
}
const CRAFTING = {
    "Chrome Celestial Dissonance Upgrade Kit":"CCDT","Chrome Circlet of Pursuing Upgrade Kit":"CCOP#CA2","Chrome MonstroBot Upgrade Kit":"CMBT",
    "Chrome Oasis Upgrade Kit":"COWNT#CPOT","Chrome Storm Wrought Ballista Upgrade Kit":"CSWBT","Chrome Thought Obliterator Upgrade Kit":"CTOT#CTHOT#CF2",
    "Ful'Mina's Tooth":"Fulmina#teeth","Sandblasted Metal":"SBM","Stale SUPER brie+":"stale SB"
}
const SPECIAL = {
    "Ful'Mina's Gift":"fulmina","Ful'mina's Charged Toothlet":"fulmina","SUPER|brie+ Supply Pack":"SB","Timesplit Rune":"TSR","Sky Sprocket":"HAL#high altitude loot",
    "Skysoft Silk":"HAL#high altitude loot","Enchanted Wing":"HAL#high altitude loot","Cloudstone Bangle":"HAL#high altitude loot","Sky Glass":"glore","Sky Ore":"glore"
}
const WEAPON = {
    "Biomolecular Re-atomizer Trap":"BRAT#BRT","Birthday Party Piñata Bonanza":"BPPB#Pinata","Blackstone Pass Trap":"BPT#BSP","Brain Extractor":"BE #Brain Bits",
    "Charming PrinceBot":"CPB","Christmas Crystalabra Trap":"CCT#Calcified Rift Mist#CRM","Chrome Circlet of Pursuing Trap":"CCOP#CA2","Chrome MonstroBot":"CMB",
    "Chrome RhinoBot":"CRB","Chrome Thought Obliterator Trap":"CTOT#CTHOT#CF2","Circlet of Pursuing Trap":"A2","Circlet of Seeking Trap":"A1","Enraged RhinoBot":"ERB",
    "Glacier Gatler":"GG#Charm","Ice Blaster":"IB#Charm","Icy RhinoBot":"IRB","Interdimensional Crossbow":"IDCT#ICT","Legendary KingBot":"LKB",
    "Maniacal Brain Extractor":"MBE#Brain Bits","Multi-Crystal Laser":"MCL","Mysteriously unYielding Null-Onyx Rampart of Cascading Amperes":"MYNORCA","RhinoBot":"RB ",
    "Rift Glacier Gatler":"RGG#Charm","S.A.M. F.E.D. DN-5":"SAMFED DN5#SAM FED DN5","S.L.A.C.":"SLAC","S.L.A.C. II":"SLAC2#SLAC 2","S.S. Scoundrel Sleigher Trap":"SSSST#S4T",
    "S.T.I.N.G. Trap":"STING#L1","S.T.I.N.G.E.R. Trap":"STINGER#L2","Sandstorm MonstroBot":"SMB","Sleeping Stone Trap":"SST#T1","Slumbering Boulder Trap":"SBT#T2",
    "Snow Barrage":"SNOB","Steam Laser Mk. I":"SLM1#SLMK1#SLMK 1#MARK 1","Steam Laser Mk. II":"SLM2#SLMK2#SLMK 2#MARK 2",
    "Steam Laser Mk. II (Broken!)":"SLM2#SLMK2#SLMK 2#MARK 2","Steam Laser Mk. III":"SLM3#SLMK3#SLMK 3#MARK 3","Surprise Party Trap":"SPT#Party Charm",
    "Tarannosaurus Rex Trap":"TREX","The Forgotten Art of Dance":"TFAOD#FART#FAD","The Haunted Manor Trap":"THMT#Charm","The Holiday Express Trap":"THET#Charm",
    "Thought Manipulator Trap":"TMT#F1","Thought Obliterator Trap":"TOT#THOT#F2","Timesplit Dissonance Trap":"TDT#TDW#TSD#TSW"
}
const BASE = {
    "10 Layer Birthday Cake Base":"Ten Layer#Charm","Clockwork Base":"CWB#CB","Condemned Base":"CB#Charm","Cupcake Birthday Base":"CBB#Charm",
    "Extra Sweet Cupcake Birthday Base":"ESCBB#Charm","Rift Mist Diffuser Base":"RMDB#Charm","Skello-ton Base":"SB#Brain Bits",
    "Sprinkly Sweet Cupcake Birthday Base":"SSCBB#Charm","All Season Express Track Base":"ASETB#Charm"
}

// special merged list - potion outputs, needs both cheese and charms
const POTION = Object.assign({}, CHEESE, CHARMS);

// tag identifier - this is used to remove injected search tags during rendering
const TAG_ID = '#';
const TAG_REGEX = new RegExp(`${TAG_ID}.*${TAG_ID}`, 'g');

// piggyback on Mousehunt's jQuery
// this is a smart thing to do that will never backfire on me
var $ = $ || window.$;

// setup tooltip observer
const tooltipObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        // this triggers itself once when the tooltip is updated, but should stop after that
        removeTooltipTag(mutation.target);
    });
});

// one-time init functions go here
function init() {
    initMp();
    initTrap();
    initInv();
    initSupplyTransfer();
}

// == Marketplace Search ==
function initMp() {
    // extend templateutil.render to inject desired search terms
    const _parentRender = hg.utils.TemplateUtil.render;
    hg.utils.TemplateUtil.render = function(templateType, templateData) {
        //console.log(templateType);
        //console.log(templateData);
        if (templateType == 'ViewMarketplace_search_terms') {
            // only edit marketplace search
            templateData.search_terms.forEach((category) => updateMpSearch(category));
        }
        return _parentRender(templateType, templateData);
    }
}

function updateMpSearch(category) {
    var refDict = getDict(category.name);
    if (!refDict) { // invalid name
        return;
    }
    category.terms.forEach((listing) => {
        var tag = getInitials(listing.value, refDict);
        if (tag && !listing.value.includes('hidden')) {
            // skip if the listing already has "hidden" tag added
            listing.value += `<span class="hidden">${tag}</span>`;
        }
    });
}

// == Trap Setup Search ==
function initTrap() {
    // hook into ajax calls to inject search tags into trap data
    // trap data is refreshed on trap change, hook into changetrap calls to reinject tags
    var callback = function(options, originalOptions, jqXHR) {
        const componentUrl = 'managers/ajax/users/gettrapcomponents.php';
        const changeTrapUrl = 'managers/ajax/users/changetrap.php';
        if (options.url.includes(componentUrl) || options.url.includes(changeTrapUrl)) {
            var _parentSuccess = options.success || originalOptions.success;
            var _parentAjax = options.ajax;
            var _extendedSuccess = function (data) {
                if (data.components && data.components.length > 0) { // gettrapcomponents
                    data.components.forEach((component) => updateTrapSearch(component));
                } else if (data.inventory) { // changetrap
                    for (var item in data.inventory) {
                        updateTrapSearch(data.inventory[item]);
                    }
                }
                if (_parentAjax) { // changetrap
                    // changetrap uses some unhinged wrapper for successhandler that doesn't resolve properly
                    // so this calls the success function (ondone) directly
                    return _parentAjax.ondone(data);
                } else if (typeof _parentSuccess === 'function') { // components
                    return _parentSuccess(data);
                }
            };
            options.success = originalOptions.success = _extendedSuccess;
        }
    }
    $.ajaxPrefilter(callback);

    // hook into renderFromFile to hide the injected search tags
    const _parentRenderFile = hg.utils.TemplateUtil.renderFromFile;
    hg.utils.TemplateUtil.renderFromFile = function(TemplateGroupSource,templateType,templateData) {
        var result = templateData;
        if (TemplateGroupSource == 'TrapSelectorView' &&
            ['tag_groups','item_armed','item_favourite','item'].includes(templateType)) { //
            result = modifyTemplateData(templateData);
            observeTooltip();
        }
        return _parentRenderFile(TemplateGroupSource,templateType,result);
    }
}

// inject search tags into trap data
function updateTrapSearch(component) {
    var refDict = getDict(component.classification);
    if (!refDict) { // invalid name
        return;
    }
    var tag = getInitials(component.name, refDict);
    if (!tag) {
        return; // item not in refDict and getInitials fails to generate an acronym for it
    }
    tag += TAG_ID;
    // Tag the trap component with its acronym
    component.name += tag;
}

// return a copy of templateData with the search tags removed
function modifyTemplateData(templateData) {
    if (templateData.is_loading) {
        // no need to modify loading data
        return templateData;
    }
    // use JSON de/serialization to deep copy templateData
    var modified = JSON.parse(JSON.stringify(templateData));
    if (modified.name) {
        modified.name = modified.name.replace(TAG_REGEX, '');
    } else if (modified.tag_groups) {
        modified.tag_groups.forEach((tag_group) => {
            tag_group.items.forEach((item) => {
                item.name = item.name.replace(TAG_REGEX, '');
            });
        });
    }
    return modified;
}

// reattach observer in case the tooltip elem is recreated
function observeTooltip() {
    const tooltip = document.querySelector('.campPage-trap-itemBrowser-itemDescriptionHover');
    tooltipObserver.disconnect();
    tooltipObserver.observe(tooltip, { childList: true, subtree: true });
}
function removeTooltipTag(tooltipElem) {
    const title = tooltipElem.querySelector('b');
    if (title) {
        title.innerText = title.innerText.replace(TAG_REGEX, '');
    }
}

// == Inventory Search ==
// TODO: break this up for the different tabs? (cheese, crafting, special, etc.)
function initInv() {
    const inventoryUrl = 'managers/ajax/pages/page.php';
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("load", function() {
            if ( this.responseURL.includes(inventoryUrl)) {
                updateInventory();
            }
        });
        originalOpen.apply(this, arguments);
    };
    // in case the window is refreshed in inventory.php
    if (window.location.href.includes("inventory.php")) {
        updateInventory();
    }
}

// inject search tags into the HTML element
function updateInventory() {
    var query = document.querySelectorAll('.inventoryPage-item:not(.tagged)');
    query.forEach((item) => {
        item.classList.add("tagged");
        var itemType = item.getAttribute('data-item-classification');
        const dataName = item.getAttribute('data-name'); // original name
        var searchName = dataName;
        if (itemType == 'recipe') {
            itemType = item.parentElement.getAttribute('data-tag'); // get the type of the recipe output item instead
            searchName = sanitizeRecipeName(dataName); // restore sanity
        } else if (itemType == 'potion') {
            updatePotions(item); // potions are handled using different logic
            return;
        }
        var refDict = getDict(itemType);
        if (!refDict) { // invalid classification
            return;
        }
        var tag = getInitials(searchName, refDict);
        if (!tag) {
            return;
        }
        item.setAttribute('data-name', `${dataName}${tag}`); // preserve original name for normal search
    });
}

// this function exists as witness and testament to the raw insanity that is recipe names
function sanitizeRecipeName(name) {
    // start with removing stuff from the name
    var output = name.replace(/ \(.*\)/g, '') // everything between brackets
    .replace(/Rebuild /g, '') // trap/base rebuilds
    .replace(/the /g, '') // F2 rebuild recipe specifically has an extra 'the' in the name
    .replace(/ Recipe/g, ''); // CMC (charm) specifically has an extra 'Recipe' in the name
    if (name.match(/brie/i)) {
        output = output.replace(/ Cheese/g, ''); // ESB & emp brie recipe has an extra 'cheese' at the end
    }
    // add missing stuff
    if (name.includes('Asiago') || name.includes('Stilton') || name.includes('Havarti') || name.includes('Cheddar')) {
        output += ' Cheese'; // some cheese recipes exclude the 'cheese'
    } else if (name.includes('Chrome') &&
               (name.includes('Celestial') || name.includes('School') || name.includes('Storm') || name.includes('Thought'))) {
        output += ' Trap'; // some weapon recipes exclude the 'trap'
    } else if (name.includes('A.C.R.O.N.Y.M.')) {
        output = 'Arcane Capturing Rod Of Never Yielding Mystery';
    }
    return output;
}

// add tags to potions based on output items from their recipe options
function updatePotions(item) {
    const query = item.querySelectorAll('li');
    const outputSet = new Set();
    query.forEach((listItem) => {
        // grab all bolded items minus the quantities
        const matchList = Array.from(listItem.innerHTML.matchAll(/<b>[0-9]+ (.*?)<\/b>/g));
        if (matchList.length != 2) { // should have exactly 2 items
            return;
        }
        outputSet.add(matchList[1][1]); // add the second bolded item (the output) to the set
    });
    const parentTag = item.parentElement.getAttribute('data-tag');
    var tag = '';
    outputSet.forEach((output) => {
        // use the merged potion output list
        var initials = getInitials(output, POTION);
        if (initials) {
            tag += '_' + initials;
        }
    });
    if (!tag) {
        return;
    }
    item.setAttribute('data-name', `${item.getAttribute('data-name')}${tag}`);
}

// == supplyTransfer search ==
function initSupplyTransfer() {
    // the supplyTransfer page causes a full refresh, just check the URL upon init
    if (window.location.href.includes('supplytransfer.php')) {
        updateSupplyTransfer();
    }
    // retag items when the categories are changed
    const observer = new MutationObserver(updateSupplyTransfer);
    const listContainer = document.querySelector('#supplytransfer .categoryContent.itemList.listContainer');
    if (listContainer) {
        observer.observe(listContainer, {childList: true});
    }
}

function updateSupplyTransfer() {
    const supplyTransferPage = document.getElementById('supplytransfer');
    if (!supplyTransferPage) {
        return;
    }
    // add search bar
    const supplyHeader = supplyTransferPage.querySelector('.tabContent.item h2:not(.tagged)');
    if (supplyHeader) {
        supplyHeader.classList.add("tagged");
        supplyHeader.style.display = 'flex';
        supplyHeader.style.justifyContent = 'space-between';
        supplyHeader.innerHTML = `<div>${supplyHeader.innerHTML}</div>`;
        const searchDiv = document.createElement('div');
        searchDiv.style.position = 'relative';
        // search bar
        const searchInput = document.createElement('input');
        searchInput.classList.add('searchInput');
        searchInput.placeholder = "Search";
        searchInput.onkeyup = filterSupplyItems;
        searchDiv.appendChild(searchInput);
        // clear button
        const searchClear = document.createElement('a');
        searchClear.classList.add('searchClear');
        searchClear.href = '#';
        searchClear.innerText = 'x';
        searchClear.style.position = 'absolute';
        searchClear.style.bottom = '3px';
        searchClear.style.right = '5px';
        searchClear.onclick = clearSearch;
        searchDiv.appendChild(searchClear);
        // append div to header
        supplyHeader.appendChild(searchDiv);
    }
    // add "no items" text
    const listContainer = supplyTransferPage.querySelector('.categoryContent.itemList.listContainer');
    var noItemDiv = supplyTransferPage.querySelector('.noItem');
    if (!noItemDiv && listContainer) {
        noItemDiv = document.createElement('div');
        noItemDiv.classList.add('noItem');
        noItemDiv.style.display = 'none';
        noItemDiv.style.position = 'absolute';
        noItemDiv.style.top = '190px';
        noItemDiv.style.left = '335px';
        noItemDiv.innerText = 'No items found.';
        listContainer.appendChild(noItemDiv);
    }
    // tag items
    const query = supplyTransferPage.querySelectorAll('.element.item:not(.tagged)');
    query.forEach((item) => {
        item.classList.add("tagged");
        // pry the item data out from JQuery's cold, dead hands
        const name = $(item).data()?.item?.name;
        const classification = $(item).data()?.item?.classification;
        if (!name || !classification) {
            return;
        }
        var tag;
        const refDict = getDict(classification);
        if (refDict) {
            tag = getInitials(name, refDict);
        }
        const dataName = tag ? `${name}_${tag}` : name;
        item.setAttribute('data-name', dataName);
    });
    filterSupplyItems();
}

function filterSupplyItems() {
    const searchInput = document.querySelector('#supplytransfer .searchInput');
    if (!searchInput) {
        return;
    }
    const searchText = searchInput.value.toLowerCase();
    const query = document.querySelectorAll('#supplytransfer .element.item');
    var count = 0;
    query.forEach((item) => {
        const itemName = item.getAttribute('data-name').toLowerCase();
        if (itemName.includes(searchText)) {
            item.style.display = '';
            count++;
        } else {
            item.style.display = 'none';
        }
    });
    // show hide message for no items found
    const noItemDiv = document.querySelector('#supplytransfer .noItem');
    if (noItemDiv) {
        noItemDiv.style.display = count ? 'none' : '';
    }
    // show/hide search clear button
    const searchClear = document.querySelector('#supplytransfer .searchClear');
    if (searchClear) {
        searchClear.style.display = searchText ? '' : 'none';
    }
}

function clearSearch() {
    const searchInput = document.querySelector('#supplytransfer .searchInput');
    if (searchInput) {
        searchInput.value = '';
        filterSupplyItems();
    }
    // this is used as onclick, return false to prevent screen movement
    return false;
}

// == helpers ==
// returns the appropriate reference dict given a classification string
// returns undefined if there is no match
function getDict(classification) {
    if (typeof classification === 'string') {
        switch(classification.toLowerCase()) {
            case 'cheese':
            case 'bait':
                return CHEESE;
            case 'charms':
            case 'trinket':
                return CHARMS;
            case 'crafting':
            case 'crafting_item':
                return CRAFTING;
            case 'special':
            case 'stat':
                return SPECIAL;
            case 'weapon':
                return WEAPON;
            case 'base':
                return BASE;
        }
    }
    // no match
    return undefined;
}

// get acronym from a given item name and refDict
// this generates an acronym if item name is valid but not in the refDict, but returns undefined otherwise
function getInitials(itemName, refDict) {
    // check refDict first
    if (refDict[itemName] != undefined) {
        return TAG_ID + refDict[itemName];
    }
    var wordList = itemName.split(' ');
    if (wordList.length < 2) { // 0-1 letter acronyms are useless
        return undefined;
    } else if (refDict == CHARMS && itemName.includes('Rift 20')) {
        return TAG_ID + 'R' + wordList[1]; // special provision for rift 20xx charms
    } else if (refDict == SPECIAL && itemName.includes('Airship')) {
        return undefined; // exclude all airship parts
    } else if (refDict == CRAFTING && itemName.includes('Theme Scrap')) {
        return undefined; // exclude all theme scraps
    } else if (refDict == CRAFTING && itemName.includes('Blueprint')) {
        return undefined; // exclude all blueprints
    }
    var acronym = '';
    for (var i=0; i < wordList.length; i++) {
        if (wordList[i].length == 0) {
            // empty word, skip
            continue;
        }
        acronym += wordList[i].charAt(0); // first letter of word
    }
    return TAG_ID + acronym.toUpperCase();
}

// start script
init();