// ==UserScript==
// @name         שמירת הכתיבה
// @namespace    http://scripts.eithanet.co.il
// @version      1.4beta
// @description  שומר את מה שאתם כותבים
// @author       Eithanet
// @match        http://web3.ekoloko.com/*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20089/%D7%A9%D7%9E%D7%99%D7%A8%D7%AA%20%D7%94%D7%9B%D7%AA%D7%99%D7%91%D7%94.user.js
// @updateURL https://update.greasyfork.org/scripts/20089/%D7%A9%D7%9E%D7%99%D7%A8%D7%AA%20%D7%94%D7%9B%D7%AA%D7%99%D7%91%D7%94.meta.js
// ==/UserScript==

var s = document.createElement('script');
s.onload = function() {

};
s.src = 'https://code.jquery.com/jquery-1.12.3.min.js';
document.getElementsByTagName('head')[0].appendChild(s);
var script = document.createElement('script');
script.onload = function() {

};
script.src = "https://scripts.eithanet.co.il/js/jqsave.js";
document.getElementsByTagName('head')[0].appendChild(script);


var script2 = document.createElement('script');
script2.onload = function() {

};
script2.src = "https://scripts.eithanet.co.il/js/save.js";
document.getElementsByTagName('head')[0].appendChild(script2);

