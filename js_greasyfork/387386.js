// ==UserScript==
// @name         Reposition replay stats script
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  moves replay stats to the left
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387386/Reposition%20replay%20stats%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/387386/Reposition%20replay%20stats%20script.meta.js
// ==/UserScript==

/******************************
Reposition replay stats script
******************************/

(function() {
    'use strict';

    window.addEventListener('load', function(){

var website = "jstris.jezevec10.com"
var url = window.location.href
var parts = url.split("/")

if(parts[3]=="replay" && parts[2].endsWith(website) && parts.length>4){

    if(parts[4]!="1v1"){


var stat1 = document.querySelector("#statTable")

var vertPos = 400
var horPos = -200

stat1.style.position = "absolute"
stat1.style.left = horPos + "px"
stat1.style.top = vertPos + "px"


    }
}


    });
})();