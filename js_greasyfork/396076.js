// ==UserScript==
// @name         PC indicator
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  Indicates what kind of PC you are on
// @author       meppydc
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396076/PC%20indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/396076/PC%20indicator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){
    //if (~window.location.href.indexOf("play=8")) {


        $("<div class='formulaElement' id='lrem' style='display:none'>1st</div>").insertBefore("#lrem");


        if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
        if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}

        function afterFunction() {
            //(p + 4*((10×p - b)/5)+1) mod 7
            if(this['PCdata']['blocks'] == 0) {
                let suffixes = ['th','st','nd','rd','th','th','th','th']
                pcs = parseInt(this['lrem']['textContent'])
                pcNumber = ((pcs + 1 + 3*((10*pcs - this['placedBlocks'])/5)) % 7) || 7
                $(".formulaElement")[0].innerHTML = pcNumber + suffixes[pcNumber];

            }
        };

        function beforeReadyGoFunction() {
            //console.log("ready go function run")
            //console.log(this['pmode'])
            if (this['pmode'] == 8) {
                    $(".formulaElement")[0].style.display = "block"
                } else {
                       $(".formulaElement")[0].style.display = "none"
                }
            $(".formulaElement")[0].innerHTML = "1st";
        }

    var placeBlockFunc = Game['prototype']["placeBlock"].toString()
    var params2 = getParams(placeBlockFunc)
    placeBlockFunc =  trim(placeBlockFunc) + trim(afterFunction.toString())
    Game['prototype']["placeBlock"] = new Function(...params2, placeBlockFunc);

    var readyGoFunc = Game['prototype']['startPractice'].toString()
    var params3 = getParams(readyGoFunc)
    readyGoFunc =  trim(readyGoFunc) + trim(beforeReadyGoFunction.toString())
    Game['prototype']['startPractice'] = new Function(...params3, readyGoFunc);
    //console.log("end of script")
//}
    });

})();