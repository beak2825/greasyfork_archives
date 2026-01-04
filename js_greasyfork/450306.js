// ==UserScript==
// @name         反查亚马逊Search Term
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  提取Search Term
// @author       下饭猫
// @match        *://sellercentral.amazon.com/*
// @match        *://sellercentral.amazon.ca/*
// @match        *://sellercentral.amazon.com.mx/*
// @match        *://sellercentral.amazon.co.uk/*
// @match        *://sellercentral.amazon.de/*
// @match        *://sellercentral.amazon.fr/*
// @match        *://sellercentral.amazon.it/*
// @match        *://sellercentral.amazon.es/*
// @match        *://sellercentral-japan.amazon.com/*
// @license      Zlib/Libpng License
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/450306/%E5%8F%8D%E6%9F%A5%E4%BA%9A%E9%A9%AC%E9%80%8ASearch%20Term.user.js
// @updateURL https://update.greasyfork.org/scripts/450306/%E5%8F%8D%E6%9F%A5%E4%BA%9A%E9%A9%AC%E9%80%8ASearch%20Term.meta.js
// ==/UserScript==

(function() {

var text = document.getElementsByTagName('pre')[0].innerText
var re = new RegExp('(?<=搜索关键字","value":")[^"]*(?=")');
var st = re.exec(text);
alert("Search Term为："+st);


})();