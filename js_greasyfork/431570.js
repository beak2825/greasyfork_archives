// ==UserScript==
// @name         link me
// @version      0.3
// @description  i'm real lazy
// @author       asher (sidefury)
// @match        https://neopetsclassic.com/*
// @namespace https://greasyfork.org/users/799416
// @downloadURL https://update.greasyfork.org/scripts/431570/link%20me.user.js
// @updateURL https://update.greasyfork.org/scripts/431570/link%20me.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var styles = `
    #rinks {
    position: absolute;
    left: 780px; top: 440px;
    width: 103; text-align: center;
    }
    #rinks a {
    display: block;
    font-size: 8pt;
    color: #999;
    margin-top: 2px; padding: 4px;
    background-color: #333;
    border-radius: 5px;
    }
    #rinks a:hover {
    color: #CCC;
    background-color: #555;
    }
    #rinks .durp {
    background-color: transparent;
    }`

    var styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerHTML = styles
    document.head.appendChild(styleSheet)
    var page_html = document.body.innerHTML;

    // quick links on every sidebar
    if (document.getElementsByName("a").length > 0) {
        var rinks = document.createElement("div")
        document.body.appendChild(rinks)
        rinks.id = "rinks"
        rinks.innerHTML = `
                        <a href='/quickstock/'>Quick Stock</a>
                        <a href='/inventory/'>Inventory</a>
                        <a href='/market/wizard/'>Shop Wiz</a>
                        <a href="/island/tradingpost/browse/#" onclick="document.forms['tradesBrowse'].submit();">Trades</a>
                        <a href='/auctions/'>Auctions</a>
                        <a href='/water/fishing/'>Fishing</a>
                        <a href='/faerieland/employ/jobs/?page=1'>FEA Jobs</a>
                        <br>
                        <a href='/safetydeposit/'>— SDB —</a>
                        <a class='durp' href='/safetydeposit/?page=1&query=Morphing+Potion&category=0'>Morphing Pot</a>
                        <a class='durp' href='/safetydeposit/?page=1&query=Paint+Brush&category=0'>Paint Brush</a>
                        <a class='durp' href='/safetydeposit/?page=1&query=Coupon&category=0'>Job Coupon</a>
                        <a class='durp' href='/safetydeposit/?page=1&query=&category=34'>Baked</a>
                        <a class='durp' href='/safetydeposit/?page=1&query=&category=39'>Faerie</a>
                        <a class='durp' href='/safetydeposit/?page=1&query=&category=42'>Seashells</a>`
    }

})();