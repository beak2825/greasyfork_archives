// ==UserScript==
// @name         Card_Kingdom_Hotlist_Display
// @namespace    https://*cardkingdom.com/
// @version      0.10
// @description  Security through obfuscation is bad, m'kay.
// @author       Halt_I_m_Reptar (MtG Cabal Cast)
// @match        https://*.cardkingdom.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416094/Card_Kingdom_Hotlist_Display.user.js
// @updateURL https://update.greasyfork.org/scripts/416094/Card_Kingdom_Hotlist_Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    createDataRequestButton();

    function createDataRequestButton() {
        const div = document.createElement('div');
        div.innerHTML = ('<button class="dataRequestButton" style="position:fixed;top:0;left:0;z-index:9999;width:auto;height:20px;padding:0 5px 0 0;background:#00b;color:#fff;font-weight:bold;" onclick="beginDisplay()">Gather Sales Data</button>');
        document.body.prepend(div);
    }

    //write toggle button
    const createHotlistToggleButton = () => {
        const div = document.createElement('div');
        div.innerHTML = ('<button class="hotlistToggle" style="position:fixed;top:20px;left:0;z-index:999;width:120px;height:20px;padding:0 5px 0 0;background:#0b0;color:#fff;font-weight:bold;" onclick="toggleHotlistDisplay()">Toggle Hotlist</button>');
        document.body.prepend(div);
    }

    const displayHotlistData = (hotlistMap) => {
        const div = document.getElementsByClassName('hotlistContainer')[0];
        hotlistMap.forEach( itemInfo => {
            div.style.height = adjustHeight(div);
            div.innerHTML += itemInfo;
        });
    }

    const writeHotlistDataContainer = () => {
        const div = document.createElement('div');
        div.innerHTML = ('<div class="hotlistContainer" style="position:fixed;bottom:20px;left:0;z-index:8888;width:auto;height:300px;max-height:600px;overflow-y:scroll;padding:0 5px 0 0;border:1px solid #d00;background:#fff"></div>');
        document.body.prepend(div);

    }

    window.beginDisplay = function() {
        clearHtmlElements();
        writeHotlistDataContainer();
        displayHotlistData(createReadableList(mapHotlistData(fetchHotlistData())));
        createHotlistToggleButton();
    }

    window.toggleHotlistDisplay = function() {
        const display = document.getElementsByClassName('hotlistContainer')[0].style.display;
        document.getElementsByClassName('hotlistContainer')[0].style.display = display === 'none' ? 'inline' : 'none';
    }

    const fetchHotlistData = () => Array.from(document.getElementsByClassName("slider-item-info"));

    const mapHotlistData = (slideArr) => {
        return slideArr.map( (elem) => {
            if (elem.innerText.match(/:/g)) {
                return elem.innerText.replace(/[\n\r]+/g,'--').replace(/:([^:]*):\s/g,'$1--');
            }
            return elem.innerText.replace(/[\n\r]+/g,'--').replace(": ","--")
        });
    }

    const createReadableList = (cardList) => {
        return cardList.map(elem => {
            const tempName = elem.split("--");
            return `<a href="https://www.cardkingdom.com/purchasing/mtg_singles?search=header&filter%5Bname%5D=${tempName[1]}" target="_blank">${tempName[1]} - ${tempName[0]} - ${tempName[2]}</a><br />`;
        }).sort();
    }

    const adjustHeight = (div) => (parseInt(div.style.height.replace(/[a-zA-Z]/g,'')) + 20) + "px";

    const clearHtmlElements = () => {
        const htmlElementsToClear = ['hotlistContainer', 'hotlistToggle'];
        htmlElementsToClear.forEach( selector => {
            if ( document.getElementsByClassName(selector)[0] ) { document.getElementsByClassName(selector)[0].remove(); }
        });
    }
})();
