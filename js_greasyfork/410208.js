// ==UserScript==
// @name         Google Meet Attendance
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Copy google meet participants to clipboard on "u" key click
// @author       You
// @match        https://meet.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410208/Google%20Meet%20Attendance.user.js
// @updateURL https://update.greasyfork.org/scripts/410208/Google%20Meet%20Attendance.meta.js
// ==/UserScript==

(function() {
    function copyToClipboard(text) {
        window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
    }
    'use strict';
    function main(){
    var divs = document.getElementsByTagName("div");
    var newNames = [""];
    for (var i=0; i<divs.length; i++){
        if (divs[i].getAttribute("aria-label")!=null && divs[i].getAttribute("aria-label").includes("Show more actions for ")){
            //console.log(i);
            var name = (divs[i].getAttribute("aria-label").replace("Show more actions for", ""));
            //console.log(name);
            if (newNames.indexOf(name)==-1){
                //console.log("success");
                newNames.push(name);
            }
        }
    }
    copyToClipboard(newNames);
    }
    document.onkeydown = function(e){
        e = e || window.event;
        var key = e.which || e.keyCode;
        if(key===85){ //change key code, currently set to "u"
            main();
        }
    }
})();