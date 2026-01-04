// ==UserScript==
// @name         Extended hat switch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Raymond Zhu
// @match        *://*.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379899/Extended%20hat%20switch.user.js
// @updateURL https://update.greasyfork.org/scripts/379899/Extended%20hat%20switch.meta.js
// ==/UserScript==

(function(){
    var store = {
        'h': '400px',
        'w': '25%'
    }
    document.title = "Moo Moo | Extended Store"
    var settings = document.createElement('div');
    var hInput = document.createElement('input');
    hInput.id = "storeHeightInput";
    hInput.value = store.h;
    hInput.placeholder = "StoreHeight";
    var WInput = document.createElement('input');
    WInput.id = "storeWidthInput";
    WInput.value = store.w;
    WInput.placeholder = "StoreWidth";
    var applyButton = document.createElement('button');
    applyButton.innerText = "Apply Settings"
    applyButton.onclick = function(){
        document.getElementById('storeHolder').style.width = document.getElementById('storeWidthInput').value;
        document.getElementById('storeHolder').style.height = document.getElementById('storeHeightInput').value;
    }
    settings.innerText = "Store (height | Width)\n";
    settings.style.fontSize = "150%";
    settings.appendChild(hInput);
    settings.appendChild(WInput);
    settings.appendChild(applyButton);
    try {
        document.getElementById('storeHolder').style.width = store.w;
        document.getElementById('storeHolder').style.height = store.h;
        document.getElementById('guideCard').appendChild(settings);
    }
    catch(e){
        console.error(`ERROR LOADING STOREHOLDER HACK. ERROR: ${e}`);
    }
})();