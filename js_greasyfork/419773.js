// ==UserScript==
// @name         Neopets Beta Navigation Bar
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Life is full of pain and sadness
// @author       Fuzzy
// @match        http://www.neopets.com/*
// @match        https://www.neopets.com/*
// @grant        none
// @icon         https://media.discordapp.net/attachments/793396281753337866/796492503033053214/pixeloctopus.gif?width=469&height=469
// @downloadURL https://update.greasyfork.org/scripts/419773/Neopets%20Beta%20Navigation%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/419773/Neopets%20Beta%20Navigation%20Bar.meta.js
// ==/UserScript==

 {
    $('.navsub-left__2020').append('&nbsp&nbsp;\
                                   <a href="https://www.neopets.com/customise/">Customisation</a>&nbsp&nbsp;\
                                   <a href="https://www.neopets.com/items/transfer_list.phtml">Item Transfer Log</a>&nbsp&nbsp;\
                                   <a href="https://www.neopets.com/battledome/battledome.phtml">Battledome</a>&nbsp&nbsp;\
                                   <a href="https://www.neopets.com/safetydeposit.phtml">SDB</a>&nbsp&nbsp;\
                                   <a href="https://www.neopets.com/inventory.phtml">Inventory</a>&nbsp&nbsp\
                                   <a href="https://www.neopets.com/quickstock.phtml">Quick Stock</a>&nbsp&nbsp\
                                   <a href="https://www.neopets.com/island/tradingpost.phtml">Trading Post</a>&nbsp&nbsp;\
                                   <a href="https://www.neopets.com/gallery/index.phtml?view=all">Gallery</a>&nbsp&nbsp;\
                                   <a href="https://www.neopets.com/market.phtml?type=your">My Shop</a><br>')}