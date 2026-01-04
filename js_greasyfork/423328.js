// ==UserScript==
// @name         LiveWorkShits
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Skrypt został stworzony przez: Monsterek#5113
// @author       Monsterek#5113
// @match        https://www.liveworksheets.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/423328/LiveWorkShits.user.js
// @updateURL https://update.greasyfork.org/scripts/423328/LiveWorkShits.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ansArr = [];
    var parsedJSON = JSON.parse(contenidojson);

    window.addEventListener("load", function(event) {
        let childrenArray = $("#capa1").children();
        let index = 0;
        for(let i of parsedJSON){
           let task = i[0];
           if(task.startsWith("select:")){
               let answer = task.replace("select:","");
               if(answer == "yes") {
                   selectanswer(index);
               }
           }
           else if(task.startsWith("choose:")){
               childrenArray.each(function(){
                   $(this).val("right");
               });
           }
            else if(task.startsWith("tick:")){
                let answer = task.replace("tick:","");
                if(answer == "yes") {
                    tickanswer(index);
                }
            }
           else{
                task = task.replace('$',"'");
                if(task != "") childrenArray[index].innerHTML = task;
           }
            index++;
        }
    });
})();