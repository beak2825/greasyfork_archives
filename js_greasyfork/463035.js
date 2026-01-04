// ==UserScript==
// @name         中国电信改桥接
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @author       鸡景行
// @match        http://192.168.1.1/*
// @grant        none
// @license MIT
// @description 666
// @downloadURL https://update.greasyfork.org/scripts/463035/%E4%B8%AD%E5%9B%BD%E7%94%B5%E4%BF%A1%E6%94%B9%E6%A1%A5%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/463035/%E4%B8%AD%E5%9B%BD%E7%94%B5%E4%BF%A1%E6%94%B9%E6%A1%A5%E6%8E%A5.meta.js
// ==/UserScript==

// ==UserScript==
// @name         中国电信改桥接
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @author       鸡景行
// @match        http://192.168.1.1/*
// @grant        none
// @license MIT
// @description 666
// ==/UserScript==

(function() {
var bdd = "'BY：鸡景行'";
var bddf = '<td id="f17" bgcolor="#EF8218" align="middle" class="Fstmenutd"><a class="Fstmenuoff" href="ctwanconfig.html" target="mainFrame" onclick="window.alert('+ bdd + ');  ">改桥接</a></td>';
document.getElementById("f17").innerHTML=bddf;
})();