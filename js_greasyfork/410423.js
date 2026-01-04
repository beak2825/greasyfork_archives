// ==UserScript==
// @name         智慧猪场
// @namespace    wo
// @version      0.1.1
// @description  以梦为马，不负韶华。
// @author       You
// @match        https://www.tampermonkey.net/index.php?version=4.10&ext=dhdg&updated=true
// @grant        none

//@include      *://120.24.55.226/*

// @downloadURL https://update.greasyfork.org/scripts/410423/%E6%99%BA%E6%85%A7%E7%8C%AA%E5%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/410423/%E6%99%BA%E6%85%A7%E7%8C%AA%E5%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var s = $("#west");
    if(s.length=1){
         $("#nav").css('width','');
         $("#nav").css('margin','');
    }

    $("#home").css("padding",'');
    $("#home").css("width",'100%');
    $("#home").css("height",'900px');


    $("#bk").css("width","100%");
    $("#bk").css("height","830px");

    $("#I1").css("height","900px");
    $("#I1").css("width","100%");




})();