// ==UserScript==
// @name         Turn off ADS POPUP in site xamvl.com
// @version      0.1
// @description  enter something useful
// @author       TienNH
// @include      http://xamvl.com/*
// @grant        none
// @run-at      document-start
// @namespace https://greasyfork.org/users/16893
// @downloadURL https://update.greasyfork.org/scripts/14082/Turn%20off%20ADS%20POPUP%20in%20site%20xamvlcom.user.js
// @updateURL https://update.greasyfork.org/scripts/14082/Turn%20off%20ADS%20POPUP%20in%20site%20xamvlcom.meta.js
// ==/UserScript==

function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function createElement( str ) {
    var elem = document.createElement('div');
    elem.innerHTML = str;
    return elem;
}

function addNewStyle(newStyle) {
    var styleElement = document.getElementById('styles_js');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
    styleElement.appendChild(document.createTextNode(newStyle));
}

addNewStyle('.afs_ads {display:block !important;height:1px;width:1px;}');

removeElementsByClass('afs_ads');
var elemDiv = createElement('<p>fake ads</p>');
elemDiv.className  = 'afs_ads';
document.body.appendChild(elemDiv);
