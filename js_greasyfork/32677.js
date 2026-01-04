// ==UserScript==
// @name         靠北工口師免登入Avgle功能
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://driver.kobeengineer.io/post/*
// @grant        none
// @namespace https://greasyfork.org/users/150810
// @downloadURL https://update.greasyfork.org/scripts/32677/%E9%9D%A0%E5%8C%97%E5%B7%A5%E5%8F%A3%E5%B8%AB%E5%85%8D%E7%99%BB%E5%85%A5Avgle%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/32677/%E9%9D%A0%E5%8C%97%E5%B7%A5%E5%8F%A3%E5%B8%AB%E5%85%8D%E7%99%BB%E5%85%A5Avgle%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = $("a[class='ui google plus fluid button']").attr("href");
    var avcode = url.split("https://www.google.com.tw/search?q=");
    console.log(avcode["1"]);
    $("div[class='ui form tertiary segment']").append("<br><a class=\"ui green fluid button button-avgle\" data-car-number=\"" + avcode["1"] + "\" data-vivaldi-spatnav-clickable=\"1\><i class=\"font icon\"></i> 老司機幫我 Avgle 一下</a>");
})();