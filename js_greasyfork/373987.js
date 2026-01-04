// ==UserScript==
// @name         Window Title Changer (Autoloop/CSA)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Changes the window title for autoloop and csa to something relevant 
// @author       jack@autoloop.com
// @include      *autoloop.us*
// @grant        none
// @icon
// @downloadURL https://update.greasyfork.org/scripts/373987/Window%20Title%20Changer%20%28AutoloopCSA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/373987/Window%20Title%20Changer%20%28AutoloopCSA%29.meta.js
// ==/UserScript==
'use strict';

//¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦
//Window Title Changer
//¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦
//autoloop
//works, but is changing the title to the link for some reason
if (window.location.href.includes('autoloop.us/DMS/App/')) {
    document.title = (document.title).split('-')[1];
}

//csa store + product
if (window.location.href.includes('csa.autoloop.us/CustomerProduct/')) {
    var store = ($('#page_canvas > h1 > a:nth-child(2)').text()); //$('#page_canvas > h1 > a:nth-child(2)').text();
    var product = ($('#page_canvas > h1').text());
    product = product.split(':');
    document.title = product[1] + ' - ' + store;

    //csa main store page
} else if (window.location.href.includes('csa.autoloop.us/Customer/')) {
    var storee = ($('#page_canvas > h1').text());
    storee = storee.split('(');
    document.title = storee[0];
}
