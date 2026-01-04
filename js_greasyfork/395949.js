// ==UserScript==
// @name         Fiction.Live Alert Blacklist
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically dismisses stories in the alerts that are blacklisted
// @author       You
// @match        https://fiction.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395949/FictionLive%20Alert%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/395949/FictionLive%20Alert%20Blacklist.meta.js
// ==/UserScript==

function myCode() {
    'use strict';

    var delayInMilliseconds = 200;
    var html = document.querySelector("html")
    //Blacklisted alert list
    var Blacklist = ["Placeholder",
                     "Placeholder",
                     "Placeholder",
                     "Placeholder",
                     "Placeholder"
                    ]
    //Temporary, for things I may wish to read later
    var tempBlacklist = ["Placeholder"]
    var finalBlacklist = Blacklist.concat(tempBlacklist)
    'use strict';
    alertHandler();


    /**
    * Simulate a click event.
    * @public
    * @param {Element} elem  the element to simulate a click on
    */
    function simclick(elem) {
    // Create our event (with options)
        var evt = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        // If cancelled, don't dispatch our event
        var canceled = !elem.dispatchEvent(evt);
    };




    //Delays the code by one second
    function alertHandler(){

    //Gets every entry in the alert panel
    var alertsAll=document.querySelectorAll('[ng-repeat="item in type"]'), alertCount=0, currentAlert;
    var count = 0
    while (currentAlert = alertsAll[alertCount++])
    {
        //Adds to the counter
        count++
        //console.log(count)
        //Adds each alert into a variable
        var alertTitle = currentAlert.querySelector('[set-text="item.value.value"]');

        //The actual value of the alert
        alertTitle.textContent

        //Has the method ran for each item in the blacklist
        finalBlacklist.forEach(hideBlacklist);

    }

    function hideBlacklist(value) {
        //console.log(`"WHATS GOING ON ${value}"`);
        //Sets the var to current tag
        var alertCheck = (`${value} went live`);
        //If the tag was applied
        if(alertTitle.textContent == alertCheck) {
            console.log(value)
            console.log(alertTitle.textContent)
            console.log("This alert is blacklisted.");
            var dismiss = currentAlert.querySelector('[ng-click="dismissFeedItem(item)"]');
            simclick(dismiss);
        }
            /*
            if (alertCheck){
            //console.log("yes",bl2)
            //Hides any list items that have a blacklisted tag
            //currentAlert.style.display = "none";
            }
            */
        }}
    //document.body.style.backgroundColor = "grey"
    console.log("Alert Script Complete")
    setTimeout(alertHandler, delayInMilliseconds)

setInterval(alertHandler, 10000)
};

var intervalDelay = 10000; //10 seconds
setInterval(myCode, intervalDelay);