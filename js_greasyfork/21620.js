// ==UserScript==
// @name         Skin Changer for Agarlist 2.0
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Add skin changing to agarlist
// @author       HTinsten
// @match        http://agarlist.com/
// @match        http://warlis.io/
// @match        http://alis.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21620/Skin%20Changer%20for%20Agarlist%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/21620/Skin%20Changer%20for%20Agarlist%2020.meta.js
// ==/UserScript==

var htscodeCSS = "<link rel='stylesheet' href='http://htscode.net/Projects/Skin-Changer-for-Agarlist/stylesheets/style.css'/>";
var htscodeJS = "<script src='http://htscode.net/Projects/Skin-Changer-for-Agarlist/scripts/script.js'></script>";
$(document).ready(function(){
    $("head").append(htscodeCSS);
    $("body").append(htscodeJS);
});