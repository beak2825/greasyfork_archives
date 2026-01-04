// ==UserScript==
// @name         MouseHunt Location HUD Preview
// @description  Keep track of what state you left an area in, because travelling just to check is jank
// @author       LethalVision
// @version      0.5.2
// @require      https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/en/users/683695-lethalvision
// @downloadURL https://update.greasyfork.org/scripts/454413/MouseHunt%20Location%20HUD%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/454413/MouseHunt%20Location%20HUD%20Preview.meta.js
// ==/UserScript==

(function () {
    const STORAGE_TAG = 'mh-lochud-cache';

    const MAIN_ID = 'hudPreview-main';
    const PREVIEW_ID = 'hudPreview';

    const LG_COMPLEX = ['desert_oasis', 'sand_dunes', 'lost_city'];
    const TWISTED = '_twisted';
    const LABYKOR = ['labyrinth', 'ancient_city'];

    var areaHuds = { display:true };

    // == local storage ==
    function loadCache() {
        var cacheJson = window.localStorage.getItem(STORAGE_TAG);
        if (cacheJson){
            try{
                if (!cacheJson.startsWith('{')) { // compressed data
                    cacheJson = LZString.decompressFromUTF16(cacheJson);
                }
                areaHuds = JSON.parse(cacheJson);
            } catch (err) {
                console.log('Cache parse error: ' + err);
            }
        }
    }

    function saveCache() {
        var jsonString = LZString.compressToUTF16(JSON.stringify(areaHuds));
        window.localStorage.setItem(STORAGE_TAG, jsonString);
        //console.log('Saved cache: ' + jsonString);
    }

    // == init hooks ==
    function initHooks() {
        // hook showEnv
        const _parentShowEnv = app.pages.TravelPage.showEnvironment;
        app.pages.TravelPage.showEnvironment = function (envType, instant) {
            updatePreview(envType);
            _parentShowEnv(envType, instant);
        }
        // hook toggleQuickMap
        const _parentToggleQuick = app.pages.TravelPage.toggleQuickMap;
        app.pages.TravelPage.toggleQuickMap = function () {
            _parentToggleQuick();
            updateVisibility();
        }
        // hook page.php
        const pageUrl = 'managers/ajax/pages/page.php';
        const travelPageUrl = 'travel.php';
        const travelUrl = 'managers/ajax/users/changeenvironment.php';

        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener('load', function() {
                if (this.responseURL.indexOf(pageUrl) != -1) {
                    // page is called basically when you do anything in MH
                    storeHud();
                } else if (this.responseURL.indexOf(travelUrl) != -1) {
                    // travelling to new location
                    storeHud();
                    updatePreview(user.environment_type);
                }
            });
            originalOpen.apply(this, arguments);
        };
        // in case the window is refreshed in travel.php
        if (window.location.href.includes('travel.php')) {
            updatePreview(user.environment_type);
        }
    }

    // UI, my one love in life
    function updatePreview(envType) {
        var mainDiv = document.getElementById(MAIN_ID);
        if (!mainDiv) {
            // create the main div if it doesn't exist
            var mapContainer = document.querySelector('.travelPage-mapContainer.full');
            if (!mapContainer) return; // idk just return
            mainDiv = getMainDiv();
            mapContainer.parentNode.insertBefore(mainDiv, mapContainer);
        }
        const previewElem = mainDiv.querySelector(`#${PREVIEW_ID}`);
        // load cached HUD or handle based on exceptions
        const cachedHud = areaHuds[envType];
        if (LG_COMPLEX.includes(envType)) {
            previewElem.innerHTML = renderLgComplex(envType);
        } else if (user.environment_type == envType) {
            previewElem.innerHTML = getTextDiv('You are currently hunting here.');
        } else if (cachedHud) {
            previewElem.innerHTML = cachedHud;
            // the frox HUD specifically sets margin-bottom to display correctly, don't override it
            previewElem.querySelector(' div').style.marginBottom = (envType == 'fort_rox') ? '' :'0px';
        } else if (cachedHud != undefined) {
            previewElem.innerHTML = getTextDiv('This location does not have a HUD.');
        } else {
            previewElem.innerHTML = getTextDiv('There is no saved data for this location, travel here at least once to save the HUD.');
        }
    }

    // it's called LG complex, not LG simple, amirite
    function renderLgComplex(envType) {
        if (user.environment_type == envType) { // current location, display the inverse version
            if (document.querySelector('#hudLocationContent .corrupted')) { // at twisted
                return areaHuds[envType] || getTextDiv('There is no saved data for the normal version of this location.');
            } else { // at normal
                return areaHuds[envType + TWISTED] || getTextDiv('There is no saved data for the twisted version of this location.');
            }
        } else { // not at location, display both (if available)
            const normal = areaHuds[envType] || '';
            const twisted = areaHuds[envType + TWISTED] || '';
            const noData = getTextDiv('There is no saved data for this location, travel here at least once to save the HUD.');
            return (normal + twisted) ? normal + twisted : noData;
        }
    }

    // hide the whole thing when Quick Travel is selected
    function updateVisibility() {
        const mapTab = document.querySelector('.mousehuntHud-page-tabContent.map');
        if (!mapTab) return; // idk just return
        const mainDiv = document.getElementById(MAIN_ID);
        if (!mapTab) return; // idk just return again
        // hide mainDiv if it's quick travel, and vice versa
        mainDiv.style.display = mapTab.classList.contains('quick') ? 'none' : '';
    }

    function getMainDiv() {
        const mainDiv = document.createElement('div');
        mainDiv.style.color = '#FFF'
        mainDiv.style.background = 'url(https://www.mousehuntgame.com/images/ui/backgrounds/hud_bg_blue_repeating.png?asset_cache_version=2) repeat-y bottom center';
        mainDiv.style.borderRadius = '12px';
        mainDiv.style.paddingTop = '10px';
        mainDiv.style.paddingBottom = '10px';
        mainDiv.style.marginBottom = '10px';
        mainDiv.style.boxShadow = '-1px -1px 1px #ccc inset';
        mainDiv.id = MAIN_ID;
        // title div
        const titleDiv = document.createElement('div');
        titleDiv.style.height = '20px';
        titleDiv.style.paddingLeft = '10px';
        titleDiv.style.paddingRight = '10px';
        titleDiv.style.display = 'flex';
        titleDiv.style.justifyContent = 'space-between';
        titleDiv.style.alignItems = 'center';
        const titleText = document.createElement('div');
        titleText.innerHTML = '<b>Location HUD Preview</b>'
        titleDiv.appendChild(titleText);
        const toggleBtn = document.createElement('button');
        toggleBtn.innerHTML = areaHuds.display ? '-' : '+';
        toggleBtn.style.padding = '0';
        toggleBtn.style.height = '18px';
        toggleBtn.style.width = '18px';
        toggleBtn.style.borderRadius = '5px';
        toggleBtn.style.background = '#ccc';
        toggleBtn.style.border = '1px solid #999';
        toggleBtn.addEventListener('click', (e) => toggleDisplay(e.target));
        titleDiv.appendChild(toggleBtn);
        mainDiv.appendChild(titleDiv);
        // preview elem
        const previewElem = document.createElement('div');
        previewElem.style.paddingTop = '10px';
        previewElem.id = PREVIEW_ID;
        previewElem.style.display = areaHuds.display ? '' : 'none';
        mainDiv.appendChild(previewElem);
        return mainDiv;
    }

    function getTextDiv(text) {
        return `<div style="padding-left:10px;">${text}</div>`;
    }

    // button onclicks
    function toggleDisplay(element) {
        const previewElem = document.getElementById(PREVIEW_ID);
        if (!previewElem) return;
        areaHuds.display = !areaHuds.display;
        previewElem.style.display = areaHuds.display ? '' : 'none';
        element.innerHTML = areaHuds.display ? '-' : '+';
        //saveCache();
    }

    // process and store the current location HUD
    function storeHud() {
        var hudElem = document.getElementById('hudLocationContent');
        if (!hudElem) {
            console.log('failed to get HUD element');
            return;
        }
        const envType = user.environment_type;
        var hudName = envType;
        var cloneHud = hudElem.cloneNode(true);
        // disable all warning elements (wrong powertype etc)
        var activeList = cloneHud.querySelectorAll('.active');
        activeList.forEach((elem) => {
            if (elem.className.toLowerCase().indexOf('warning') != -1) {
                elem.classList.remove('active');
            }
        });
        // location-based processing
        if (LG_COMPLEX.includes(envType)) {
            cloneHud.querySelectorAll('.baitWarning').forEach((elem) => elem.remove());
            if (cloneHud.querySelector('.corrupted')) { // is twisted version
                hudName = envType + TWISTED;
            }
        } else if (LABYKOR.includes(envType)) {
            // remove zokor hud if in laby, and vice versa - both areas can't coexist
            const pairEnv = LABYKOR[(LABYKOR.indexOf(envType) + 1) % 2]; // fancy mirror math that returns the counterpart
            delete areaHuds[pairEnv];
        }

        fixHud(envType, cloneHud);
        // strip mouse events and href from the cached HUD to disable clicks
        const cloneInnerHtml = cloneHud.innerHTML
        .replace(/on[a-z]+?=".+?"/g, '')
        .replace(/ href="#"/g, '');
        areaHuds[hudName] = cloneInnerHtml;
        saveCache();
    }

    // fix HUD elements that don't display properly as preview
    function fixHud(envType, hudElem) {
        var colorSelector = [];
        switch(envType) {
            case 'zugzwang_tower':
                // I could fix floating elements, but I will delete them instead
                // do not try me
                hudElem.querySelectorAll('.zugzwangsTowerHUD-retreatButton').forEach((elem) => elem.remove());
                break;
            case 'sunken_city':
                colorSelector.push('.item.quantity');
                break;
            case 'rift_gnawnia':
                colorSelector.push('.riftGnawniaHud-label');
                break;
            case 'rift_valour':
                colorSelector.push('.valourRiftHUD-fuelContainer-armButton');
                colorSelector.push('.valourRiftHUD-powerUp-title');
                break;
            case 'rift_bristle_woods':
                colorSelector.push('.riftBristleWoodsHUD-chamberSpecificTextContainer');
                break;
        }
        colorSelector.forEach((selector) => {
            hudElem.querySelectorAll(selector).forEach((elem) => {elem.style.color = 'white'});
        });
    }

    // init
    loadCache();
    initHooks();
    storeHud();
})();