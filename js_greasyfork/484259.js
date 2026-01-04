// ==UserScript==
// @name         Fetch Intercept Userscript
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A JS script that intercepts the fetch prototype and overrides it to intercept POST requests
// @author       You
// @match        https://academy.cs.cmu.edu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cmu.edu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484259/Fetch%20Intercept%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/484259/Fetch%20Intercept%20Userscript.meta.js
// ==/UserScript==



//add any desired link addresses to block to the list
const blockingRequests = []

//to call the fetch, click on the check button in the exercise
var originalFetch = window.fetch;
window.fetch = function(url, options){
    if (url == "https://backend.academy.cs.cmu.edu/api/v0/submission/points/"){
        const optionsBody = JSON.parse(options.body)
        let submissionID = optionsBody.submission_id;
        let fileVersion = optionsBody.file_version;

        const exercisePoints = 1; //change as needed to exercise max limit
        /*
        @param {number} submissionID a 4 digit number that is created upon submission(is in link)
        @param {number} points - a 1 digit number that represents the amount of points scored upon submission 
        | (NOTE - be very careful with setting it to high or to negative values - it can break the website/exercises)
        @param {string} score - string that can have 2 possiblities "PASS" or "FAIL"
        @param {arr} fileVersion - an array that contains 2 numbers that represent fileversion (should be kept the same)
        */
        let jsonDefined = {
            "submission_id": submissionID,
            "points": exercisePoints, 
            "score": "PASS",
            "file_version": fileVersion
        }
        options.body = JSON.stringify(jsonDefined);
        console.log(`Found submission url: ${url}, ${options.body}`);
     }
    //elif not blocked url  
    if (blockingRequests.some(blockedUrl => url.includes(blockedUrl))){
        console.log("Blocked Request in List:", url);
        return Promise.reject(new Error("Blocked Request."))
    }else{
        return originalFetch.apply(this, arguments)
    }
}
