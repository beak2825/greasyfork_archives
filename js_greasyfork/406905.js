// ==UserScript==
// @name         www.imagefruit.com ad bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.imagefruit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406905/wwwimagefruitcom%20ad%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/406905/wwwimagefruitcom%20ad%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var theDiv=document.getElementById('layer');
    if(theDiv){


        theDiv.remove();
    }
    var div2s= document.getElementsByClassName('introBox');
    if(div2s){
        var as = div2s[0].getElementsByTagName('a');

        var aa = as[0];

         console.log(aa);

        aa.click();

    }
})();