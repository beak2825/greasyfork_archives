// ==UserScript==
// @name         UMJI Lucky Draw
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description
// @author       Celeste
// @match        https://coursesel.umji.sjtu.edu.cn/welcome.action
// @grant        none
// @description A simple JS script to register your desired course when slots are available.
// @downloadURL https://update.greasyfork.org/scripts/420920/UMJI%20Lucky%20Draw.user.js
// @updateURL https://update.greasyfork.org/scripts/420920/UMJI%20Lucky%20Draw.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("Lucky Draw Load Successfully.")
    let wantedlessonTaskID = ["C926C3CA-F100-0001-F6A7-3FE552D04190"]; // Replace the elements of the array with the lessontaskid of your wanted courses (the  lessontaskid can be found by inspect
    var timeVar = setInterval(() => { doItEveryTime(); }, 5000);
    function doItEveryTime() {
        let allClass = document.querySelectorAll("div[lessontaskid]")
        console.log("=== A round begins ===")
        for (let i = 0; i < allClass.length; i++) {
            let thisID = allClass[i].getAttribute("lessontaskid");
            if (wantedlessonTaskID.includes(thisID)) {
                console.log("---")
                console.log(i);
                // some of these having the same  "lessontaskid" actually do not have buttons
                let thisButton
                try {
                  thisButton = allClass[i].getElementsByTagName("button")[0]
                }
                catch(error){
                    console.log("skip")
                    continue
                }
                let thisCourse = allClass[i];
                let state
                try {
                    state = thisButton.innerHTML
                }
                catch(error){
                    console.log("skip")
                    continue
                }
                console.log("Find the course, status shown below")
                console.log(state)
                if (state == "Register") {
                    console.log("Find available!")
                    thisButton.click();
                    console.log("Done Registration.")
                }
            }
        }
        let refresh = document.getElementsByClassName("refresh")
        refresh[0].click();
        // Refresh the course list
    }
})();
