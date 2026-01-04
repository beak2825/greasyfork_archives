// ==UserScript==
// @name         Redirection and open matlab doc
// @namespace    ehng
// @version      0.4
// @description  open matlab doc. Redirection from  licensecenter
// @author       You
// @match        https://ww2.mathworks.cn/licensecenter/*
// @match        https://www.mathworks.com/licensecenter/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/394312/Redirection%20and%20open%20matlab%20doc.user.js
// @updateURL https://update.greasyfork.org/scripts/394312/Redirection%20and%20open%20matlab%20doc.meta.js
// ==/UserScript==

(function() {
    'use strict';
var str=unescape(window.location.href);
var it2=str.split("uri=");
var it3=it2[1].split("/");
var it4=it3[0]+'//'+it3[1]+it3[2]+'/'+it3[3]+'/'+it3[4] +'/'+it3[5];
str = it2[1].toString();
var str1 = str.replace(it4.toString(), 'https://ww2.mathworks.cn/help');
location.href=(str1);
   
})();