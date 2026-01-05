// ==UserScript==
// @name         Invino - CellarTracker Integration
// @namespace    http://www.invino.com/
// @version      0.3.1
// @description  Display CellarTracker search button on Invino product pages
// @match        https://www.invino.com/
// @match        https://www.invino.com/wines/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15862/Invino%20-%20CellarTracker%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/15862/Invino%20-%20CellarTracker%20Integration.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var products = document.querySelectorAll (".product-discription");

for (var J = 0;  J < products.length;  J++) {
    var product = products[J];
    //console.log(product);
    //Get Product Name
    var name  = product.textContent.split("\n")[1].replace(/^\s+/, '').replace(/\s+$/, '');
    name = name.split("'").join("%27");
    name = name.split('"').join("%22");
    name = name.split(" ").join("+");
    
    //Create CellarTracker link button
    var cturl = "https://www.cellartracker.com/list.asp?fInStock=0&Table=List&iUserOverride=0&szSearch="+name;
    var wsurl = "http://www.wine-searcher.com/find/"+name;
    var ctNode       = document.createElement ('div');
    ctNode.innerHTML = '<button id="myButton" type="button" onclick="window.open(\''+cturl+'\');">'
        + '<img src="http://www.cellartracker.com/favicon2.ico" style="height:16px;"></button>'
        + '<button id="myButton" type="button" onclick="window.open(\''+wsurl+'\');">'
        + '<img src="http://sr1.wine-searcher.net/images/favicon.1.png" style="height:16px;"></button>'
    ;
    ctNode.setAttribute ('id', 'CellarTrackerNode');
    ctNode.setAttribute ('style', 'display:inline;height:18px;');
    product.appendChild(ctNode);
};
