// ==UserScript==
// @name         Delete Timer Brofist.io
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  No Timer For Brofist.io 2PL Another Code $("#startTime").remove();
// @author       Arthur132 / MegaCheater
// @match        http://brofist.io/modes/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371067/Delete%20Timer%20Brofistio.user.js
// @updateURL https://update.greasyfork.org/scripts/371067/Delete%20Timer%20Brofistio.meta.js
// ==/UserScript==

(function() {
   var timerID=setInterval(function(){
    if(this.client!=undefined){
        if(this.client.modeName!="sandbox" & this.client.modeName!="hideAndSeek"){
            if(document.querySelector("#startTime")!=null){
                document.querySelector("#startTime").remove();
                if(document.querySelector("#startTime")==null){
                    clearInterval(timerID);
                }
            }
        }
    }
},0);
})();