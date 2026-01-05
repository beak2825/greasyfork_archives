// ==UserScript==
// @name            Open GMM in WME
// @description     Opens the current Google Map Maker view in Waze Map Editor
// @namespace       vaindil
// @version         0.6
// @grant           none
// @include         https://mapmaker.google.com/mapmaker*
// @author          vaindil
// @downloadURL https://update.greasyfork.org/scripts/16685/Open%20GMM%20in%20WME.user.js
// @updateURL https://update.greasyfork.org/scripts/16685/Open%20GMM%20in%20WME.meta.js
// ==/UserScript==

function gen_url() {
    var zoom = {12: 0, 13: 1, 14: 3, 15: 3, 16: 4, 17: 5, 18: 6, 19: 7, 20: 8};
    var llre = /https:\/\/mapmaker\.google\.com\/mapmaker.*[?&]ll=([\d,.-]+)/g;
    var zre = /https:\/\/mapmaker\.google\.com\/mapmaker.*[?&]z=(\d+)/g;
    var urlstring = document.getElementById('link-to-page').href;
    var llarr = llre.exec(urlstring)[1].split(',');
    var z = zre.exec(urlstring)[1];
    if (z in zoom) {
        z = zoom[z];
    } else {
        z = 0;
    }
    return "https://www.waze.com/editor/?lon=" + llarr[1] + "&lat=" + llarr[0] + "&zoom=" + z;
}

function appendButton() {
    var anode = document.getElementById('kd-browse-toolbar-button');
    var newnode = document.createElement('div');
    newnode.setAttribute('class', 'pointer_cursor goog-inline-block hasMaxWidth jfk-button jfk-button-standard');
    newnode.setAttribute('ct', 'bt');
    newnode.setAttribute('role', 'button');
    newnode.tabIndex = '0';
    newnode.style = '-webkit-user-select: none;';
    newnode.id = 'GMMtoWME';
    newnode.innerText = 'WME';
    newnode.onclick = function() {
        window.open(gen_url(), '_blank');
    };
    anode.parentNode.insertBefore(newnode, anode.nextSibling);
}

function init() {
    try {
        var element = document.getElementById('link-to-page');
        if (typeof element !== "undefined" && element !== null && element.value !== '') {
            appendButton();
        } else {
            setTimeout(init, 1000);
        }
    } catch (err) {
        console.log("GMMWME - " + err);
        setTimeout(init, 1000);
    }
}

init();