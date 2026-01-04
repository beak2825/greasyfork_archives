// ==UserScript==
// @name         Bricklink Links for Lego.com
// @license      MIT
// @version      0.1
// @description  Adds a link to Bricklink for each product on Lego.com
// @author       azuravian
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match        https://www.lego.com/*
// @match        http://www.lego.com/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/1025348
// @downloadURL https://update.greasyfork.org/scripts/459825/Bricklink%20Links%20for%20Legocom.user.js
// @updateURL https://update.greasyfork.org/scripts/459825/Bricklink%20Links%20for%20Legocom.meta.js
// ==/UserScript==

document.body.addEventListener('DOMNodeInserted', function(event) {
	bricklink(event.target);
}, false);

function bricklink() {
    const itemSpan = document.querySelector('[data-test*="item-value"]');
    const itemValue = itemSpan.innerText;
    const bcWrapper = document.querySelector('ol[data-test*="breadcrumbs"]');
    const blUrl = "https://www.bricklink.com/v2/catalog/catalogitem.page?S=";
    const finalUrl = blUrl + itemValue;
    itemSpan.children[0].children[0].innerHTML = '<a href="' + finalUrl + '" target="_blank">' + itemValue + '</a>';
}