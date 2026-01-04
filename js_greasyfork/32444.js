// ==UserScript==
// @name         bittrex - Show Chart only 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Thai Tran
// @match        https://bittrex.com/Market/Index?MarketName=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32444/bittrex%20-%20Show%20Chart%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/32444/bittrex%20-%20Show%20Chart%20only.meta.js
// ==/UserScript==

var u = document.location.href.replace('Index?','MarketStandardChart?') ;
alert('url = '+ u); //https://bittrex.com/Market/Index?MarketName=BTC-BCC

document.location = u;
//https://bittrex.com/market/MarketStandardChart?marketName=BTC-BCC
