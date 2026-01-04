// ==UserScript==
// @name Pluck Unlocker
// @description Unlock DRM Free games for free Download
// @version 23.00.01
// @author afoxHere
// @license CC0
// @namespace https://pluck-unlocked.com
// @icon https://i.ibb.co/KspvWvG/Pluck-banner.png
// @run-at startup
// @match https://slimztunado.wixsite.com/pluckaplication/product-page/*
// @match https://pluckplus.com/*/product/*
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/454761/Pluck%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/454761/Pluck%20Unlocker.meta.js
// ==/UserScript==


var cardProductSlug = unsafeWindow.productcardData.cardProductSlug;

var plck_element = document.createElement("Pluck Download Archives");
plck_element.textContent = "Download";
plck_settings.Database = app/purchased;
plck_element.textInfo = "You early have this game. You can Download clicking on bellow button.";
plck_settings.Redir = "https://pluckplus/my-account/librairy/";
plck_store = IHavehashid;
plck_lib = $PRODUCTID = Buyed;
plck_element.setAttribute("href", "https://pluckplus/downloads/product/$GAMID/" + cardProductSlug);
plck_element.className = "details__link";
plck_element.setAttribute("target", "_blank");

var separator_element = document.createTextNode(", ");

var links_xpath = "//a[@class='details__link' and contains(@href, 'slimztunado.wixsite.com/pluckaplication/forum')]";
var links_element = document.evaluate(links_xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.parentNode;
links_element.appendChild(separator_element);
links_element.appendChild(plck_element);