// ==UserScript==
// @name         ChooseMyGift Linkafy to Amazon and Google
// @namespace    http://tampermonkey.net/JClouseau42
// @version      0.1
// @description  Change all SKUs to Amazon/Google links (based on SKU/text)
// @author       JClouseau42
// @match        https://www.chooseyourgift.com/*
// @icon         https://www.google.com/s2/favicons?domain=chooseyourgift.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436871/ChooseMyGift%20Linkafy%20to%20Amazon%20and%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/436871/ChooseMyGift%20Linkafy%20to%20Amazon%20and%20Google.meta.js
// ==/UserScript==

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

(function() {
    'use strict';

	var elements = document.getElementsByClassName('item-sku'); // get all elements
	for(var i = 0; i < elements.length; i++){
		elements[i].style.backgroundColor = "whitesmoke";
        //var q = replaceAll(elements[i].textContent.replace("sku # ","").replace("sku# ",""), " ", "+");
        var q = elements[i].textContent.replace("sku # ","").replace("sku# ","")
        var qq = replaceAll(encodeURIComponent(q)," ","+");
        var v = elements[i].textContent; //innerHTML;
        elements[i].innerHTML = ("<a target='_blank' href='https://www.amazon.com/s?k=" + qq + "' >" + v + "</a><br/><a target='_blank' href='https://www.google.com/search?q=SKU+" + qq + "' >Google</a>");
        // add for shopping:  &tbm=shop
	}

	elements = document.getElementsByClassName('item-title'); // get all elements
	for(i = 0; i < elements.length; i++){
        q = elements[i].textContent.trim();
        qq = replaceAll(encodeURIComponent(q)," ","+");
        v = elements[i].innerHTML;
        var a = "<a target='_blank' href='https://www.amazon.com/s?k=" + qq + "' >Amazon</a>";
        var g = "<a target='_blank' href='https://www.google.com/search?q=" + qq + "'>Google</a>";
        //elements[i].innerHTML = (v + "<br/><h6 style=\"font-size: 0.875em;text-decoration: underline;\"><a target=\"_blank\" href='https://www.amazon.com/s?k=" + q + "' >Amazon</a><br/><a target=\"_blank\" href='https://www.google.com/search?q='>Google</a></h6>");
        elements[i].innerHTML = (v + "<br/><h6 style=\"font-size: 0.875em;text-decoration: underline;\">" + a + "<br/>" + g + "</h6>");
	}
})();

