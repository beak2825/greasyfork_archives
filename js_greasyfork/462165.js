// ==UserScript==
// @name MAM Extra Max User Gift
// @namespace    yyyzzz999
// @author       yyyzzz999
// @description  11/8/25 Maximizes the default gift value for old and new members, plus extras
// @match        https://www.myanonamouse.net/u/*

// @version      5.0
// @icon         https://cdn.myanonamouse.net/imagebucket/164109/mgs64.png
// @homepage     https://greasyfork.org/en/users/705546-yyyzzz999
// @supportURL   https://greasyfork.org/en/scripts/462165-mam-extra-max-user-gift/feedback
// @license      MIT
// @grant        window.close
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/462165/MAM%20Extra%20Max%20User%20Gift.user.js
// @updateURL https://update.greasyfork.org/scripts/462165/MAM%20Extra%20Max%20User%20Gift.meta.js
// ==/UserScript==
/*jshint esversion: 11 */
/*eslint no-multi-spaces:0 */

// Script icon uses Gift icon created by Freepik - Flaticon https://www.flaticon.com/free-icons/gift
// Automate adjusting to new gift limits on MAM, and the Extra version automates gifting
// 2023-03-17: Decreased bonus gifts to new users (sub 2 weeks) from 1k to 100 per user
// Adds buttons to walk through a series of members
// See history for more info: https://greasyfork.org/en/scripts/462165-mam-extra-max-user-gift/versions

setTimeout(function() {
    'use strict';
    var DEBUG =1; // Debugging mode on (1) or off (0), >1 verbose
    if (DEBUG) console.log('Starting MAM Extra Max User Gift');

    setInterval(function() { // Reload page if Internet is up, but host unreachable etc.
        if (document.body.innerHTML.includes("504 Gateway Time-out") ||
            document.body.innerHTML.includes("503 Service Unavailable") ||
            document.body.innerHTML.includes("500 Internal Server Error") ||
            document.body.innerHTML.includes("CHC Failure at: 148") ||
            document.body.innerHTML.includes("502 Bad Gateway")) {
            location.reload();
        }
    }, 60000);
    //    var LastKnownU = 208750; // This gives us a rough idea of when we're near the end
    var LastKnownU = GM_getValue("LastKnownU", 219315); //v3.1 auto updates with the highest we visit
    // add code to check if current valid user is greater and update a new GM set value key
    var LowestValidU = 11; //v3.8
    var AutoClose = 0; // For use with many tabs and AutoClick, to close the tab after sending gift.  Count will be inaccurate in this mode.
    var AutoNext = 0; // Keep gifting the next user until bonus points below MinPoints, Started with Go button
    var AutoPrev = 1; // Gift users starting with the current one, then go back to older ones.  Ignored if AutoNext = 1.
    //   var MinPoints = 50000; // Point reserve under which to stop gifting, and wait PauseMin for more
    //   var SkipPMd = 1; // Set this to 1 if you're done gifting those you've marked as contacted, otherwise 0.
    var waitfornext = 11000; // 11 seconds, set in AutoClick for use in AutoNext, time from script start to move on, must leave time for gift
    //    var Friends = [5, 129747]; // Put your friends here to avoid multiple tabs gifting at the same time! v3.0
    var NewerThan =207000; // Similar to Friends, if non zero, don't run on pages <= this number, but won't stop other tabs v3.0 (206800 is over 6 weeks ago)
    //NewerThan is particularly handy during book hunts when using profile pages to PM folks asking for hints!
    var NumSaveErrors = 30; // Count is now confirmed, and failed gifts other than daily max are logged, keeping this many log entries. v3.0
    // var HideFlags = 1; //v3.1 this option makes it easier to see the stats in a smaller windows by hiding the flags Replaced with HideFlagsAndHunt v3.2
    // Moved to Edit Settings Menu
    // End User Configurable Parameters //

    // the varbs object will hold information on variables that may be set via gear control button v3.1
    // The init copys our declaration so we can avoid a "scary" eval like GM_setValue(variableName, eval(variableName))
    // The names in the varbs object become menu items in our modal dialog, of type type.
    var varbs = [ /// DO NOT CHANGE THE ORDER OF THESE! Unless you also match the order of the declarations after this object ///
        {name: 'NewOnly', range: [0, 1], type: 'boolean', init: 0}, // A boolean variable named 'NewOnly' with a range of 0 to 1.
        {name: 'SkipPMd', range: [0, 1], type: 'boolean', init: 0},
        {name: 'OnlyPMd', range: [0, 1], type: 'boolean', init: 0},
        {name: 'HideFlagsAndHunt', range: [0, 1], type: 'boolean', init: 0},
        {name: 'MinPoints', range: [1, 99899], type: 'integer', init: 50000}, // Usually 10,000 to 60,000, point reserve at which to wait for more
        {name: 'MaxCount', range: [1, 99999999], type: 'integer', init: 99999999}, // Use to gift this many points after counter reset
        {name: 'PauseMin', range: [5, 1439], type: 'number', init: 12.5}, ///// These init values are used in declaring the variables below...
        {name: 'Friends', type: 'integer', list: [5, 129747]}, // lazlothemonk who requested many of the features in this script
        // {name: 'EditTheme', type: 'string', options: ['Default', 'Dark', 'Light', 'Pink', 'Green']}, // Examples for testing our settings function
        {name: 'UserNote', type: 'string', init: ""},
        {name: 'ButtonColor', range: [0, 20], type: 'string', init: "LightSkyBlue"},  //A string variable named 'ButtonColor' with a range of 0 to 25 characters.
        {name: 'MillionaireColor', range: [0, 20], type: 'string', init: "Lime"},
        {name: 'Regulars', range: [0, 1], type: 'boolean', init: 0}, // Gift a list of regulars v4.7
        {name: 'MaxNotSeenDays', type: 'integer', init: 0}, // Give minimum points of 5 if DaysSinceLastSeen >= MaxNotSeenDays
        // {name: 'NewMills', range: [0, 1], type: 'boolean', init: 0}, // Gift new Millionaires not yet VIP
        // longest valid HTML color name is `LightGoldenRodYellow` with 20 characters
        // {name: 'message2', range: [0, 100], type: 'string', init: "for testing Settings"},
        // {name: 'message3', range: [0, 100], type: 'string', init: "function"},
        // {name: 'count', range: [0, 100], type: 'integer'}, // An integer variable named 'count' with a range of 0 to 100.
    ];
    if (DEBUG>1) console.log('varbs: ',varbs);
    // The following variables are now set in the spiffy new Edit Settings Dialog box with the gear button, DO NOT REORDER THEM!!!
    var NewOnly = GM_getValue("NewOnly", varbs[0].init); // Only works with AutoPrev to stop gifting when we reach the first 1000 point eligable member v2.8, setable v3.1
    var SkipPMd = GM_getValue("SkipPMd", varbs[1].init);
    if (DEBUG>1) console.log('SkipPMd: ',SkipPMd);
    var OnlyPMd = GM_getValue("OnlyPMd", varbs[2].init); //Added V3.5 to gift only those messaged
    if (DEBUG>1) console.log('OnlyPMd: ',OnlyPMd);
    var HideFlagsAndHunt = GM_getValue("HideFlagsAndHunt", varbs[3].init); //v3.1 this option makes it easier to see the stats in a smaller windows by hiding the flags
    var MinPoints = GM_getValue("MinPoints", varbs[4].init); // Script will pause and wait PauseMin minutes for more bonus point income.
    if (DEBUG>1) console.log('MinPoints: ',MinPoints);
    var MaxCount = GM_getValue("MaxCount", varbs[5].init); // Stop AutoClick gifting if counter >= MaxCount (). Default 99999999. Set to 200 and reset the counter to send 200 gifts and auto stop. v2.8
    if (DEBUG>1) console.log('MaxCount: ',MaxCount);
    var PauseMin =  GM_getValue("PauseMin", varbs[6].init); // Minutes to wait for more than MinPoints, 10-30 usually? Max 23 hours 59 minutes, but in minutes v2.7
    if (DEBUG>1) console.log('PauseMin: ',PauseMin);
    var Friends = GM_getValue("Friends", varbs[7].list);
    //var EditTheme = GM_getValue("EditTheme", varbs[8].options);
    //if (DEBUG>1) console.log('EditTheme: ',EditTheme);
    var UserNote = " "; // will get later with getMsgByNumber()
    var ButtonColor = GM_getValue("ButtonColor", varbs[9].init);
    if (DEBUG>1) console.log('ButtonColor: ',ButtonColor);
    var MillionaireColor = GM_getValue("MillionaireColor", varbs[10].init);
    if (DEBUG>1) console.log('MillionaireColor: ',MillionaireColor);
    var Regulars = GM_getValue("Regulars", varbs[11].init);
    if (DEBUG>1) console.log('Regulars: ',Regulars);
    var MaxNotSeenDays = GM_getValue("MaxNotSeenDays", varbs[12].init);
    if (DEBUG) console.log('MaxNotSeenDays: ',MaxNotSeenDays);
    //var NewMills = GM_getValue("NewMills", varbs[13].init);
    //if (DEBUG>1) console.log('NewMills: ',NewMills);

    // The following global variables are used internally for tracking operation states, etc.
    var AutoClick = GM_getValue("AutoClick", 0); // Controlled with Go/Stop button
    var OldReached = 0; // Used for status when stopping with NewOnly true or 1 v3.0
    var StartedWithAutoClick = AutoClick; // v3.0 use to detect stop on NewOnly
    if (AutoNext && AutoPrev) AutoNext = 0; // Can't do both at once, simple config error check v3.8 default to AutoPrev
    if (SkipPMd && OnlyPMd) SkipPMd = 0; // v3.8 default to OnlyPMd if both set
    var PauseMs = PauseMin * 60000; // 60 seconds/min + 1000ms/second
    var SKIPPING = 0; // Used to skip if SkipPMd set, and after Go button shows Stop indicating gifting in progress
    var GIFTED = 0; // Used to prevent double gifting when toggling Go/Stop button
    var TOGGLED = 0; // Counter for Stop/Go button
    // if (AutoClick) TOGGLED = 1; // Count click from previous instance to get stop button to always stop when wanted.
    // Broke the Go button on first use, sigh it's hard to keep all the state information from one run to the next.
    var PageERROR = 0; // If true, maybe we've gone next past the last user
    var count = GM_getValue('count', 0); //Gift counter for odometer at page bottom, Get from storage or default to 0
    var stopCount = 0; // Used to stop countdown clock when Stop button pressed
    var raisedRatio = 0; //v.31 set in removeUID() to identify someone on our low ratio list has gotten >=2
    var newMillionaire = 0; //v4.9 Used to log dates when new Millionaires are found
    var Downloaded; //v4.6 For collecting stats strings we'll need three vars
    var rIncr, sratio, dateStamp, UTCdateStamp;
    var Uploaded; //v4.7 add this stat to copy stats
    var DaysSinceLastSeen; //v4.9

    if (document.querySelector('p').textContent.includes('account has been disabled')) AutoNP(); //5/13/24 v4.9

    if (count >= MaxCount) {
        AutoClick = 0; // Stop AutoClick, COMMENT THIS OUT IF YOU NEVER WANT TO RESET COUNT.
        if (DEBUG) console.log('Stopped on MaxCount: ',MaxCount);
        var MaxReached = 1;
    }

    if (document.querySelector('h2') && document.querySelector('h2').textContent === 'Error') PageERROR = 1;
    // this either means we've gone next the last user, or way back to early users not marked disabled or innactive

    var curU = window.location.href; //get current url
    //TODO add code to get own id when viewing /u/&public
    // @match        https://www.myanonamouse.net/u/%26public

// var curUNum = parseInt(curU.match(/\d+$/)[0], 10); //Crashed with trailing # on URL!  11/25
    var curUNum = parseInt(curU.match(/(\d+)\D*$/)[1], 10);
    if (DEBUG) console.log('curUNum: ',curUNum);
    keepLastNErrors('Last 3', String(curUNum), 3); // Log last 3 visits in case we loose our place to system crash or Windows Update etc. v3.0

    var headDiv = document.querySelector('.blockHeadCon'); //2nd table does not appear on error page
    var topHeadDiv = headDiv;

    // Maybe it would simplify things to always put the buttons here?

    function getDateStamp(date){
        let year = date.getFullYear().toString().substr(-2); // get last two digits of year
        let month = date.getMonth() + 1; // getMonth() is zero-based
        let day = date.getDate();
        return(`${year}-${month}-${day}`); // Use - instead of / for valid filename
    }

    function getUTCDateStamp(date) {
    const utcYear = date.getUTCFullYear().toString().substr(-2); // Get last two digits of UTC year
    const utcMonth = date.getUTCMonth() + 1; // getUTCMonth() is zero-based
    const utcDay = date.getUTCDate();
    return `${utcYear}-${utcMonth}-${utcDay}`; // Use - instead of / for valid filename
    }


    if (!PageERROR) { //If we have a user we can gift, gather info...
        var date;
        var twoWeeksAfter;
        var now = new Date();
        //Save timestamp string for stats and download file name
        dateStamp=getDateStamp(now);
        UTCdateStamp=getUTCDateStamp(now); //4.9
        //Continue calculationg 2 week date
        var dateString = document.querySelector(".coltable").rows[0].cells[1].textContent ; //Get Join date
        date = new Date(dateString.split(' ')[0] + 'T' + dateString.split(' ')[1] + 'Z'); // Convert string to date
        twoWeeksAfter = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 14, date.getHours(), date.getMinutes(), date.getSeconds());
        if (DEBUG) {
            console.log("Join date: " + date.toUTCString());
            console.log("2 weeks after join: " + twoWeeksAfter.toUTCString());
            console.log("Now: " + now.toUTCString());
        }
        // TODO VIP DATE?

        // if (DEBUG) topHeadDiv.innerHTML = " - Test - ";
        UserNote = getMsgByNumber('UserNotes', curUNum);
        DisplayUserNote(); // add usernote at top

        //v3.1 autoupdate LastKnownU
        if (curUNum > LastKnownU) {
            GM_setValue("LastKnownU", curUNum);
            LastKnownU = curUNum;
            if (DEBUG ) console.log("Updated LastKnownU: ", LastKnownU);
        }
        //var bg = document.getElementById("bonusgift"); // Dies when element doesn't exist
        var bg = document.querySelector('#bonusgift'); //v1.0 find gift amount
        var bp = parseInt(document.querySelector("#tmBP").textContent.split(":")[1].trim()); //MAM+ change text was messing with this v1.8
        if (DEBUG ) console.log("62 bp: ", bp);
        if (bg && DEBUG > 1) console.log("starting bonus gift amount bg: ", bg);
        if (bg){ //v1.0
            var oneDayMore = new Date(twoWeeksAfter.getTime()); // Added 7/7/24 as it takes a day or two more to finish new gifts.
            oneDayMore.setDate(twoWeeksAfter.getDate() + 2); // One was not enough...
            if (now > twoWeeksAfter) {
                bg.value = "1000";
                if (NewOnly && AutoPrev && (now > oneDayMore)) { // 7/7/24 add a day to newonly
                    AutoClick = 0; // Stop AutoClick
                    OldReached = 1; // Use later to update status
                    GM_setValue("AutoClick", 0); // v2.9 stop in other tabs as well!
                    // GM_setValue("log", "NewOnly stopped on " + curUNum); //v3.0 debugging false stops near 2 week limit
                    //TODO get last newonly user, and test if our stop is before that and don't log if we've veiwed out of sequence
                    if (StartedWithAutoClick) keepLastNErrors('Stop log', "NewOnly stopped on " + curUNum, 20);
                    //v3.1+? watch for cases not part of a series to avoid log clutter?
                    // Bogus Stop Cause: viewing older users in annother tab.
                }
            } else {
                bg.value = "100";
            }

        } // Only existing users have bonusgift text area.



    } else {// !PageERROR
        if ((curUNum > LowestValidU && AutoPrev && curUNum < LastKnownU) || document.querySelector('p').textContent.includes('account has been disabled')) { //v3.8 Skip over invalid user IDs like 222303 created during server upgrade 1/24
            //v4.9  5/7/24 skip disabled like 229177 NOT WORKING
            window.location = curU.replace(/\d+$/, curUNum-1);
        }
    }
    // Prevent Auto Gifting on self and friends when looking to PM or see last log in while gifting in another tab v3.0
    if (Friends && Friends.includes(curUNum) || (NewerThan && curUNum <= NewerThan)) {
        if (DEBUG) console.log('Stopped on Friends, or NewerThan: ',NewerThan);
        AutoClick = 0; AutoPrev = 0; AutoNext = 0;
    }

    if (bg && (curUNum > LastKnownU)) LastKnownU = curUNum; // store this later IS THIS STALE CODE?
    var newUNum;
    // Figure out which user to visit/autogift next!
    function incURL(url,inc) { //Used by next/previous buttons, pass curU,1 or -1
        if (DEBUG) console.log('curUNum before inc: ' + curUNum);
        newUNum = curUNum + inc;
        if (DEBUG && OnlyPMd) {console.log('newUNum: ' + newUNum);
                    console.log('SkipPMd,OnlyPMd: ' + SkipPMd +', ' + OnlyPMd);
                   }
        if (Regulars) { //v4.8 Gift regulars
            let vals = GM_getValue("Regulrs", []);
            if (vals.includes(curUNum)){ // find next if already in list
                let curi = vals.indexOf(curUNum)
                newUNum = vals[curi + inc];
                if (DEBUG) console.log('curUNum in Regulars: ' + curUNum);
                if (DEBUG) console.log('Jumping to next Regular: ' + newUNum);
/*                 if (!isNaN(newUNum) || newUNum <= 5 || newUNum > LastKnownU+1000){
                    // TODO Stop message, autogift off until next time!  NewOnly back on reminder
                    if (AutoClick) {
                    AutoClick = GM_setValue("AutoClick", 0);
                    AutoClick = 0;
                    document.querySelector('h1').innerText += " - Last Regular Gifted, Reset NewOnly?";
                        return;
                    }
                } else {
                window.location = url.replace(/\d+$/, newUNum);
                } */

            } else if (inc == 1) {
                    for (let i = 0; i < vals.length; i++) {
                        if (vals[i] <= curUNum) window.location = url.replace(/\d+$/, vals[i + inc]);
                        // console.log(vals[i]);
                    }
            } else if (inc == -1) {
                if (DEBUG) console.log('curUNum just before searching Regulars from top: ' + curUNum);
                    for (let i = vals.length - 1; i >= 0; i--) {
                        if (vals[i] >= curUNum) { // if just > and not = don't inc?
                            if (DEBUG) console.log('Regular Search at: ' + vals[i]);
                            newUNum = vals[i + inc];
                            if (DEBUG) {console.log('Regular newUNum: ' + newUNum);
                            setTimeout(function() {
                        window.location = url.replace(/\d+$/, vals[i + inc]);
                                 }, 10000);
                          }
                        }
                    }
                }
            } // end if (Regulars)
            if (SkipPMd && !OnlyPMd) {// fixed in 2.2, stupid increment before!
                while (uidIsMarked(newUNum)) {
                    newUNum += inc; //since inc is either -1 or 1, this will go either direction
                    if (DEBUG>1) console.log('newUNum IsMarked, now: ' + newUNum);
                }
            } else if (OnlyPMd) {  // New gift only PM'd users in v3.5
                while (!uidIsMarked(newUNum)) { //Inefficent when we can load the array...
                    newUNum += inc; //since inc is either -1 or 1, this will go either direction
                    if (DEBUG>1) console.log("Skipping to next PM'd user, now: " + newUNum);
                }
            }
            window.location = url.replace(/\d+$/, newUNum);
        } // end function incURL

        // Countdown Clock for Gift Pause v2.7
        function countDown(waitTime) {
            let timeLeft = waitTime;
            //stopCount = TOGGLED;
            const interval = setInterval(() => {
                if (stopCount) { // We should only wind up here while gifting and 1 click means STOP
                    clearInterval(interval);
                    document.getElementById("status").innerHTML = " Gifting Stopped!";
                    span.textContent = span.textContent.replace("paused for more points", "Stopped"); // v2.8
                }
                else if (timeLeft <= 0) {
                    clearInterval(interval);
                    document.getElementById("status").innerHTML = " Gifting Resumed!";
                } else {
                    const hours = Math.floor(timeLeft / 3600);
                    const minutes = Math.floor((timeLeft % 3600) / 60);
                    const seconds = timeLeft % 60;
                    if (hours > 0) {
                        document.getElementById("status").innerHTML =
                            //     ` ${hours}:${((minutes - hours) * 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${seconds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`;
                            ` ${hours}:${minutes.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${seconds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})} to next Gift`;
                    } else {
                        //   document.getElementById("status").innerHTML = `${minutes}:${seconds} to next Gift`;
                        document.getElementById("status").innerHTML =  ` ${minutes}:${seconds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})} to next Gift`;
                    }
                    timeLeft--;
                }
            }, 1000);
        }

        //Create all the buttons we'll use...
        let prevBtn = document.createElement('button');
        prevBtn.textContent = 'Previous';
        prevBtn.classList.add('mybutton', 'gradient-button');
        prevBtn.addEventListener('click', function() {
            setTimeout(function() {
                incURL(curU, -1);
            }, 500);
        });

        let nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next';
        nextBtn.classList.add('mybutton', 'gradient-button');
        nextBtn.addEventListener('click', function() {
            setTimeout(function() {
                incURL(curU, 1);
            }, 500);
        });

        let back2Btn = document.createElement('button');
        back2Btn.textContent = 'Back 620';
        back2Btn.classList.add('mybutton', 'gradient-button');
        back2Btn.addEventListener('click', function() {
            setTimeout(function() {
                incURL(curU, -620); // todo: check range first, but this will likely only be used on recent members since point limit change
            }, 500);
        });

        // Create a Newest button element //v4.1 Jump to end button to start gift cycle with newest member
        let nwstBtn = document.createElement('button');
        nwstBtn.textContent = 'Newest';
        nwstBtn.classList.add('mybutton', 'gradient-button');
        nwstBtn.addEventListener('click', goLast);

        function goLast() { // 4.1 find last (newest) user on the New users in the past week page
            GM_xmlhttpRequest({
                method: "GET",
                url: "/newUsers.php", // New users in the past week page
                onload: function(response) {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(response.responseText, "text/html");
                    var links = doc.getElementsByTagName('a');
                    var lastLink = links[links.length - 1];
                    window.location.href = lastLink.href;
                }
            });
        }

        function uidIsMarked(curUNum) {
            let uids = GM_getValue('uids', []);
            return uids.includes(curUNum);
        }
        function IsInKey(key,curUNum) { //v4.7
            let vals = GM_getValue(key, []);
            return vals.includes(curUNum);
        }

        let regulrBtn = document.createElement('button'); //v4.7

        regulrBtn.classList.add('mybutton', 'gradient-button');
        if (IsInKey("Regulrs",curUNum)) {
            regulrBtn.textContent = "- Regulars";
            regulrBtn.addEventListener('click', function() {
                document.querySelector('h1').innerText += " - Removed from Regular Donees ";
                removeUID('Regulrs',curUNum);
                regulrBtn.textContent = "+ Regulars";
            });
        } else {
            regulrBtn.textContent = "+ Regulars";
            regulrBtn.addEventListener('click', function() {
                document.querySelector('h1').innerText += " - Added to Regular Donees ";
                // save to local storage for later check.
                saveUID('Regulrs',curUNum);
                regulrBtn.textContent = "- Regulars";
            });
        }

        let markCBtn = document.createElement('button');
        markCBtn.textContent = "Mark PM'd";
        markCBtn.classList.add('mybutton', 'gradient-button');
        markCBtn.addEventListener('click', function() {
            document.querySelector('h1').innerText += " - PM'd";
            // save to local storage for later check.
            saveUID('uids',curUNum);
        });

        // SAVE PM'd UIDs, or other key lists v3.1 //
        function saveUID(key, uid) {
            // debugger
            let uids = (GM_getValue(key, '[]'));
            if (typeof uids === 'string') {
                uids = JSON.parse(uids);  // Convert string to array if necessary
            }
            if (DEBUG) console.log("Got", uids.length, "in key: " + key);
            if (!uids.includes(uid)) {
                if (DEBUG) console.log("uids type: ",typeof uids, Array.isArray(uids));
                if (key == 'Mils') keepLastNErrors('New Millionaire Found', curUNum + "," + sratio +' ' + UTCdateStamp, 100); //v4.9
                uids.push(uid); //Exception TypeError: uids.push is not a function in lowratio fixed with JSON.parse
                uids = uids.sort((a, b) => a - b); // sort our list 2.1
                GM_setValue(key, uids);
                if (DEBUG) console.log("Stored", uids.length, " ", key, " uids"); //4.3 was still logging for original key PM'd
                //if (key == 'uids')
                GM_setValue(key + '-length', uids.length); // For reference when looking at Storage
            }
        }
        // v3.1 used to remove those who have raised their ratio
        function removeUID(key, uid) {
            let uids = GM_getValue(key, []);
            if (typeof uids === 'string') {
                uids = JSON.parse(uids);  // Convert string to array if necessary
            }
            if (DEBUG) console.log("Got", uids.length, "in key: " + key);
            if (uids.includes(uid)) {
                raisedRatio = true ;
                uids.splice(uids.indexOf(uid), 1);
                GM_setValue(key, uids);
                if (DEBUG) console.log("Removed", uid, "from", key);
                //if (key == 'uids')
                GM_setValue(key + '-length', uids.length); // For reference when looking at Storage
            }
        }



        //function hideFlags(){ //v3.1
        var hideText = document.createElement('div');
        function hideFlags() {
            const images = document.querySelectorAll('.ud_country, [class^="userIcon"]');
            images.forEach((image) => {
                const restoreText = document.createElement('div');
                restoreText.innerText = `Restore: ${image.alt}`;
                restoreText.style.position = 'absolute';
                restoreText.style.top = `${image.offsetTop}px`;
                restoreText.style.left = `${image.offsetLeft}px`;
                restoreText.style.backgroundColor = 'white';
                restoreText.style.padding = '5px';
                restoreText.style.borderRadius = '5px';
                restoreText.style.cursor = 'pointer';
                image.parentNode.insertBefore(restoreText, image);


                hideText.innerText = 'Hide';
                hideText.style.position = 'absolute';
                hideText.style.top = `${image.offsetTop}px`;
                hideText.style.left = `${image.offsetLeft}px`;
                hideText.style.backgroundColor = 'white';
                hideText.style.padding = '5px';
                hideText.style.borderRadius = '5px';
                hideText.style.cursor = 'pointer';

                restoreText.addEventListener('click', () => {
                    image.style.display = '';
                    hideText.style.display = '';
                    restoreText.remove();
                });

                hideText.addEventListener('click', () => {
                    image.style.display = 'none';
                    image.parentNode.insertBefore(hideText, image);
                    image.parentNode.insertBefore(restoreText, image.nextSibling);

                    hideText.style.display = 'none';
                });

                image.parentNode.insertBefore(hideText, image);
            });
        }

        if (HideFlagsAndHunt) hideFlags(); hideText.dispatchEvent(new MouseEvent('click')); //click here gets AI generated function to actually do what I want!

        function downloadGMValues() {
            // Get all keys
            var keys = GM_listValues();
            var data = {};

            // Loop over the keys and get the values
            for (var i = 0; i < keys.length; i++) {
                data[keys[i]] = GM_getValue(keys[i]);
            }

            // Custom replacer function
            var replacer = function(key, value) {
                if (Array.isArray(value) && value.every(Number.isInteger)) {
                    return JSON.stringify(value);
                }
                return value;
            };

            // Convert object to JSON with the replacer
            var json = JSON.stringify(data, replacer, 2);

            // Create a blob with the JSON data and create an object URL for it
            var blob = new Blob([json], {type: "application/json"});
            var url  = URL.createObjectURL(blob);

            // Create a link element
            var a = document.createElement('a');
            a.download = "ExtraGiftData"+ dateStamp +".json";
            a.href = url;

            // Append the link to the body and click it to start the download
            document.body.appendChild(a);
            a.click();

            // Clean up
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        let style = document.createElement('style');
        style.textContent = `
.mybutton {
  display: inline-block;
  border: none;
  padding: 1px 4px;
  font-size: 15px;
  font-weight: 900;
  text-align: center;
  text-decoration: none;
  color: black;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0px 2px 2px rgba(0,0,0,0.2);
  font-family: "Twemoji Mozilla",
         /*       "Apple Color Emoji",
               "Segoe UI Emoji",
               "Segoe UI Symbol",
               "Noto Color Emoji",
               "EmojiOne Color",
               "Android Emoji",
               sans-serif;  Better Emoji support in these fonts */
}

.gradient-button {
  background: linear-gradient(to bottom right, white, LightSkyBlue);
}

.gradient-button:hover {
  box-shadow: 0px 8px 8px rgba(0,0,0,0.2);
  transform: translateY(-2px);
}

.right-button {
  float: right;
}

input[type=text] {
  border: 2px solid LightSkyBlue;
}

textarea {
  border: 2px solid LightSkyBlue;
  line-height: 1.5;
  min-height: 1em;
}

.resizable {
        min-height: 1em;
        max-height: 10em;
        line-height: 1.5;
        resize: both;
}
`;
    document.head.appendChild(style);

    if (isValidColor(ButtonColor)) style.sheet.cssRules[1].style.background = `linear-gradient(to bottom right, white, ${ButtonColor})`;

    var footDivs = document.querySelectorAll('.blockFoot'); // v3.1 get both foot divs in array

    // GO / STOP BUTTON
    let goBtn = document.createElement('button');
    function labelGoBtn(){  //Used to change the label on toggle
        if (AutoClick) {
            goBtn.textContent = "Stop";
        } else {
            goBtn.textContent = "Go";
        }
    }
    labelGoBtn();
    goBtn.classList.add('mybutton', 'gradient-button');
    goBtn.addEventListener('click', function() {
        if(AutoClick) stopCount += 1; // We were going, so we just stopped.
        AutoClick = !AutoClick; // Toggle AutoClick
        if (AutoClick && NewOnly) keepLastNErrors('Start log', "NewOnly started on " + curUNum, 20); //v3.4
        labelGoBtn();
        TOGGLED += 1;
        if (DEBUG) console.log("TOGGLED: " + TOGGLED);
        if (AutoClick) {
            if (!GIFTED) AutoGift(); // stopped before gift was given, so gift on Go
            AutoNP(); // This allows a double click on Go to gift and stop v1.9, and one or no clicks to keep going.
        }
        // Save the value of AutoClick to storage
        GM_setValue("AutoClick", AutoClick);
    });


    var span = document.createElement('span');

    function isValidColor(colorName) {
        var tempElement = document.createElement("div");
        tempElement.style.color = colorName;
        return tempElement.style.color !== "";
    }
    //debugger
    // Find low & high ratio users v3.1+
    // let sratio; v4.6 made global to use in stats
    document.querySelectorAll('tr').forEach(row => {
        // if (DEBUG) console.log(row);
        // ?. is a new optional chaining operator, if element doesn’t exist, it will return undefined instead of throwing an error.
        if (row.querySelector('td.rowhead')?.innerText === 'Share ratio') { //Infinite is labled Share Ratio!
            //  if (DEBUG) console.log("row.querySelector('td.row1')?.innerText: ",row.querySelector('td.row1')?.innerText);
            sratio = parseFloat(row.querySelector('td.row1')?.innerText.replace(/,/g,""));

            if (DEBUG) console.log('--> sratio: ',sratio);
            if (typeof sratio === 'number' && sratio < 2) {
                saveUID('lowRatio',curUNum); // breaks on users like 223808
                removeUID('Mils',curUNum);
                keepLastNErrors('Low log', curUNum + "," + sratio, 100); //v3.1 lets see how many bumped up their ratio
            } else if (typeof sratio === 'number' && sratio >= 2){
                removeUID('lowRatio',curUNum);
                if (raisedRatio) keepLastNErrors('Raised log', curUNum + "," + sratio, 50); //v3.1
                if (sratio >= 99999) keepLastNErrors('High log', curUNum + "," + sratio, 100); //v3.1
                if (sratio >= 999999) {
                    keepLastNErrors('Millionaires', curUNum + "," + sratio, 200); //v4.2
                    saveUID('Mils',curUNum); //
                    if (DEBUG) console.log('This is a Ratio Millionaire! Color: ', MillionaireColor);
                    if (DEBUG) console.log('isValidColor(MillionaireColor): ',isValidColor(MillionaireColor));
                    if (isValidColor(MillionaireColor)) {
                        if (DEBUG) console.log('Valid MillionaireColor: ',MillionaireColor);
                        row.style.backgroundColor = MillionaireColor; // Doesn't work, some CSS is more important?
                        row.style.setProperty("background-color", MillionaireColor, "important"); // Not this either.
                        row.setAttribute("style", "background-color: " + MillionaireColor + " !important;"); //Nor this!
                        style.sheet.cssRules[1].style.background = `linear-gradient(to bottom right, white, ${MillionaireColor})`;

                        /*                 // Iterate over the CSS rules to find the .gradient-button rule
                for (let i = 0; i < style.sheet.cssRules.length; i++) {
                    let rule = style.sheet.cssRules[i];
                    if (rule.selectorText === '.gradient-button') {
                        rule.style.background = `linear-gradient(to bottom right, white, ${MillionaireColor})`;
                        console.log("The index of .gradient-button rule is: " + i); // Is 1
                        break;
                    }
                } */
                    }
                } else removeUID('Mils',curUNum);
            }
        }
    });

    // Most page modifications are complete at this point.
    // Show ratio increase calculation
    showRatioIncr();
    if (DEBUG) console.log('DaysSinceLastSeen, MaxNotSeenDays: '+ DaysSinceLastSeen + ', ' + MaxNotSeenDays );
    if (bg && MaxNotSeenDays >0 && (DaysSinceLastSeen > MaxNotSeenDays )) bg.value=5; //v4.9 5/24 minimize gift to regulars who don't log in!

    // v1.3 //v3.5 only skip PM'd if this is set instead of OnlyPMd
    if (uidIsMarked(curUNum)  ) {
        document.querySelector('h1').innerText += " - PM'd";
        if (SkipPMd) SKIPPING = 1;
    }

    if (!PageERROR) {  ///common page with previous button, span, and next button
        span.textContent = " 2 Week Date: " + twoWeeksAfter.toUTCString() + ' ';
        if (StartedWithAutoClick && OldReached == 1) span.textContent += " - Stopping: Over 2 Weeks";
        headDiv = document.querySelectorAll('.blockHeadCon')[1];
        if (curUNum >5 ) headDiv.appendChild(prevBtn); // Mousebot is oldest user at 5
        headDiv.appendChild(span);
        headDiv.appendChild(nextBtn);
        footDivs[0].appendChild(goBtn);
        if (curUNum >207694 ) footDivs[0].appendChild(back2Btn); // 207694 last user before two week rule
        if (!uidIsMarked(curUNum)) footDivs[0].appendChild(markCBtn); //v1.4
        footDivs[0].appendChild(regulrBtn); //v4.7
        footDivs[0].appendChild(nwstBtn); //v4.1 Jump to end button to start gift cycle with newest member
    } else if (PageERROR && parseInt(curU.match(/\d+$/)[0], 10) > LastKnownU ) {
        // End case, no span, no next
        headDiv.appendChild(prevBtn);
        footDivs[0].appendChild(goBtn);
        footDivs[0].appendChild(back2Btn);
        footDivs[0].appendChild(regulrBtn); //v4.8
        const div = document.createElement("div");
        div.textContent = " ...Probably beyond last user, no more Next! ";
        div.style.fontSize = '15px';
        document.body.appendChild(div);
    }  else { // all three but different span, still top table
        headDiv.appendChild(prevBtn);
        span.textContent = " <- * * * -> ";
        headDiv.appendChild(span);
        headDiv.appendChild(nextBtn);
    }

    // Create a Download Data button element
    let dlBtn = document.createElement('button');
    dlBtn.textContent = 'DL Data';
    dlBtn.classList.add('mybutton', 'gradient-button');
    dlBtn.addEventListener('click', downloadGMValues);
    footDivs[1].appendChild(dlBtn);

    // Create a new gear button element
    const gbutton = document.createElement('button');
    gbutton.style.border = 'none';
    gbutton.addEventListener('click', function() {saveSD(varbs);});
    gbutton.classList.add('mybutton', 'gradient-button');
    gbutton.textContent = "⚙️ Settings"; // Replaced messy svg with Unicode Emoji v3.4
    //gbutton.style.filter = 'brightness(75%)';
    //gbutton.style.fontSize = '18px';
    //gbutton.style.color = 'black';
    footDivs[1].appendChild(gbutton);

    // Create a span element with the count and append it to the body
    let cspan = document.createElement('span');
    cspan.textContent = ` • Gift Count: ${count} • `;
    //document.body.appendChild(cspan);
    footDivs[1].appendChild(cspan); //v3.1 move these status things up a bit

    // Create a button to reset the count
    let cbutton = document.createElement('button');
    cbutton.textContent = 'Reset Count';
    cbutton.classList.add('mybutton', 'gradient-button');
    cbutton.addEventListener('click', () => {
        let countbefore = GM_getValue("Count at last Reset", 0);
        let countbefore2 = GM_getValue("Count before last Reset", 0);
        GM_setValue('Count before 2nd last Reset', countbefore2);
        GM_setValue('Count before last Reset', countbefore);
        GM_setValue('Count at last Reset', count); // Backup so undo is possible by editing after "count": in Storage
        GM_setValue('Total Saved Resets', count + countbefore + countbefore2);
        GM_setValue('count', 0);
        count = 0; // v3.0 oops, forgot this before!
        cspan.textContent = ` • Gift Count: ${count} • `; //v2.8 Update Display! Doh
    });
    footDivs[1].appendChild(cbutton);

    const statusSpan = document.createElement("span");
    statusSpan.id = "status";
    statusSpan.textContent = " : : ";
    // if (bp && (bp > MinPoints) && AutoPrev && bg.value == "100") { // Did not show status after 2 weeks 7/8/24
    if (bp && (bp > MinPoints) && AutoPrev ) {
        let giftstogo = Math.floor((bp-MinPoints)/parseInt(bg.value));
        if (MaxCount-count <= giftstogo) {
            giftstogo = MaxCount-count;
            statusSpan.textContent = " About " + giftstogo + " gifts to go before reaching count: " + MaxCount +"."; //v2.8
        }  else {
            statusSpan.textContent = " About " + giftstogo + " gifts to go before reaching MinPoints: " + MinPoints +"."; //v2.8
        }
    }

    if (MaxReached) statusSpan.textContent = " MaxCount Reached.";
    footDivs[1].appendChild(statusSpan);



    var timeouts = [3500, 6000, 9000]; //Delays used in AutoClick, increased due to "exceeding the rate limit" v3.1, again v3.4
    // Delays increased to avoid seeing "Last Error": ... Do you really want to send... v3.0
    function clickPoints(t) {
        // Count page buttons so we can click buttons in dialogs later
        let buttons = document.getElementsByTagName('button');
        let bl = buttons.length; // Pop up dialog will have the most recently added buttons
        if (!GIFTED) {
            // Scroll entire page to the bottom, so we can see the count before Prev/Next
            const scrollingElement = (document.scrollingElement || document.body);
            scrollingElement.scrollTop = scrollingElement.scrollHeight;

            // Click Send Point after 1st timeout
            setTimeout(function() { // Send Points
                if (AutoClick) { document.getElementById("sendPointsDetailP").dispatchEvent(new MouseEvent('click')); // Send Points if not Stopped by button
                                if (DEBUG) console.log("Clicked Send Points");
                               }
            }, t[0]);  // Wait 4 seconds before AutoClick

            // Click OK to confirm after 2nd timeout
            setTimeout(function(){
                buttons = document.getElementsByTagName('button'); // add new buttons from dialog to our aray
                bl = buttons.length;

                if (bl>1 && buttons[bl-2].textContent=="Ok") {
                    //  if (DEBUG) console.log("Now " + bl + " buttons on this page.");
                    // if (DEBUG) console.log("Button Text: " + buttons[bl-2].textContent);
                    if (AutoClick) { //TOGGLED < 2 was wrong test, fixed in v3.0
                        //   if (DEBUG) console.log("Now " + bl + " buttons on this page.");
                        if (DEBUG) console.log("Button Text: " + buttons[bl-2].textContent);
                        buttons[bl-2].dispatchEvent(new MouseEvent('click')); //Click the OK Button on pop up dialog to confirm
                        // Gift accounting moved from here, as we now check for success... v3.0
                    }
                }
            }, t[1]); // 1 second after send, click confirm button.

            // Click OK to confirm after 3rd timeout
            setTimeout(function(){
                buttons = document.getElementsByTagName('button'); // add new buttons from dialog to our aray
                bl = buttons.length;
                if (DEBUG > 1) console.log("Then " + bl + " buttons on this page.");
                if (DEBUG> 1) console.log("Button Text: " + buttons[bl-1].textContent); // Use this to avoid clicking other buttons if user clicks before we do!
                if (AutoClick && buttons[bl-1].textContent=="Ok") buttons[bl-1].dispatchEvent(new MouseEvent('click')); //Click the OK Button on pop up dialog to confirm
                if (DEBUG) console.log("Clicked 2nd OK, checking status.");
                let dialogmsg = document.querySelector('div[id^="dialog-message"]').innerHTML
                if (dialogmsg.includes("You have successfully")){
                    if (DEBUG) console.log("Gift Succeded.");
                    span.textContent = span.textContent.replace("Gifting", "Gifted");
                    GIFTED = 1;
                    // Increment the count and store it back in storage
                    //If we left two copies of this script running in different tabs, our count may be stale, so get a fresh one!
                    count = GM_getValue('count', count); //v2.3
                    count++;
                    cspan.textContent = ` • Gift Count: ${count} • `;
                    GM_setValue('count', count);
                } else {
                    if (stopCount) {
                        span.textContent = span.textContent.split(" - ")[0] + "Gift Stopped!";
                    } else {
                        span.textContent = span.textContent.split(" - ")[0] + "Gift Failed!";
                        if (DEBUG) console.log("Gift Failed!  Error in Storage");
                        //GM_setValue('Last Error', curUNum.toString() + ": " + dialogmsg );
                        // Daily cap errors are probably not interesting, but let's see who is blocking...
                        if (!dialogmsg.includes("over daily cap")){
                            keepLastNErrors('Last N Errors', String(curUNum) + ": " + dialogmsg, NumSaveErrors);
                            if (DEBUG) console.log("Error logged in Storage");
                        }
                    }
                }
            }, t[2]); // 3 second after confirm button, close the send PM dialog v1.5 fixe to use 3rd timeout
        }
    }
    // More error logging to trouble shoot v3.0 features.  Should probably rename this keepLastNMsgs or something.
    /* If the code works now, these won't show up in storage unless this script is run on someone who already received today's max
       This function could be used to log the last n number of anything with an ln logname key. */
    function keepLastNErrors(ln, logmsg, n) {
        let lastNErrors = GM_getValue(ln, []);
        if (lastNErrors.length >= n) {
            lastNErrors.shift();
        }
        if (logmsg.length > 1) lastNErrors.push(logmsg);
        GM_setValue(ln, lastNErrors);
    }

    function getMsgByNumber(key, num) { // For user notes (at first) stored with keepLastNErrors v4.4
        // if (DEBUG ) console.log("getMsgByNumber called with: ",key,num);
        let lastNMsgs = GM_getValue(key, []);
        for (let i = lastNMsgs.length - 1; i >= 0; i--) { // Search last messages first, so we have the most recent note
            // let [storedNum, msg] = lastNMsgs[i].split(","); //Eats all after 1st comma in stored strings, oops v4.6
            let str = lastNMsgs[i];
            let storedNum = str.substring(0, str.indexOf(','));
            let msg = str.substring(str.indexOf(',') + 1);
            //   if (DEBUG ) console.log("i, storedNum, msg, num: ",i, storedNum, msg, num);
            if (storedNum == num) {
                if (DEBUG ) console.log("Msg found: ",msg);
                return msg;  // return the message that matches the number
            }
        }
        return "";  // or throw an error, or return a default value
    }

    function DisplayUserNote(value){
        if (value) {
            topHeadDiv.innerHTML = value;
            if(DEBUG) console.log("value is true, usernote passed.");
        } else {
            let note = getMsgByNumber('UserNotes', curUNum);
            if (note) {
                topHeadDiv.innerHTML = note;
                if(DEBUG) console.log("Note found: ",note);
            }
        }
    }

    function AutoGift(){

        if (DEBUG ) console.log("AutoGift called.");
        if (AutoClick && !SKIPPING) {
            // This requires the bonus balance not turned off in preferences!
            // https://www.myanonamouse.net/preferences/index.php?view=style
            //   Main Menu, Top Menu, Bonus Points checked!
            //
            //if (DEBUG) console.log("271 Bonus Points: " + bp);

            if (bg){ // bonusgift Points prompt to gift is available
                if ( !isNaN(bp) && (bp - bg.value < MinPoints) ) { // v3.1 subtracting current gift so we stop going under MinPoints
                    //wait for more points
                    span.textContent += " - Gifting paused for more points.";
                    if (DEBUG ) console.log("bp: " + bp + " - gift < " + MinPoints );
                    for (var i = 0; i < timeouts.length; i++) {
                        timeouts[i] += PauseMs; // Used to default to 30 minutes
                    } // if current bonus points less than configured minimum
                    waitfornext += PauseMs;
                    clickPoints(timeouts); // long wait
                    countDown(timeouts[0]/1000); // Tick Pause Clock v2.7
                } else { //Damn the points, we don't know or > MinPoints
                    span.textContent += " - Auto Gifting " + bg.value + " Points."; //v1.1
                    clickPoints(timeouts); // short wait
                } // end else we have enough points

            } //bg

        }
    }


    AutoGift();

    function AutoNP(){
        if (AutoClick && (AutoNext || AutoPrev )) {
            // span.textContent = " - Auto Clicking in 2 seconds!  ->";  Timing didn't work on this
            if (!PageERROR || parseInt(curU.match(/\d+$/)[0], 10) < LastKnownU ) {
                // Last user as of this writing:207981, allows us to skip past very old users who don't exist either

                setTimeout(function() { // Go to next user
                    if (AutoNext){ //v.15 allow either direction
                        if (AutoClick) incURL(curU, 1); //Abort scheduled reload if double clicked Go/Stop! v2.4
                    } else {
                        if (AutoClick) incURL(curU, -1);
                    }
                }, waitfornext);  // Click next before AutoClose?
            } else if (PageERROR) {
                span.textContent = " - Beyond last user, no more Next! ";
                headDiv.appendChild(span); // Not working, why?
            }

        }
    }

    if (AutoClick) AutoNP(); // Was looking at TOGGLED, but AutoClick is better v3.0

    if (AutoClose && !AutoNext && !AutoPrev) {
        setTimeout(function() {
            if (AutoClick) window.close(); // Need to test again for STOP button v3.0
        }, 20100); // Wait 12 seconds for viewing and OK confirmation clicks, then close tab
    }

    if (DEBUG) {
        console.log('MAM Extra Max User Gift Finished.');
        if (AutoClick) console.log("Auto Clicks are scheduled."); //v3.0
    }

    // Begin saveSD Save Settings Dialog function //
    function saveSD(varbs) {
        // Check if modal element already exists
        var modal = document.getElementById('settings-modal');
        var content;
        if (modal) {
            // If modal already exists, clear its content
            content = modal.querySelector('.modal-content');
            content.innerHTML = '';
        } else {
            // If modal does not exist, create it
            modal = document.createElement('div');
            modal.id = 'settings-modal';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            modal.style.zIndex = '9999';

            // Create modal content
            content = document.createElement('div');
            content.className = 'modal-content';
            content.style.backgroundColor = 'AliceBlue'; //v3.3, was white before
            content.style.padding = '20px';
            content.style.position = 'absolute';
            content.style.top = '50%';
            content.style.left = '50%';
            content.style.transform = 'translate(-50%, -50%)';
            content.style.borderRadius = '13px'; // Round dialog corners
            content.style.border = `4px solid ${ButtonColor}`; //v4.4 changed to ButtonColor
            modal.appendChild(content);

            // Append modal to body
            document.body.appendChild(modal);
        }

        // Create title
        var title = document.createElement('h2');
        title.textContent = 'Edit Settings & Notes';
        title.style.textAlign = 'center';
        content.appendChild(title);
        var hr = document.createElement('hr');
        content.appendChild(hr);

        // Create settings container // Untested multicolumn code:
        var settingsContainer = document.createElement('div');
        settingsContainer.style.display = 'flex';
        settingsContainer.style.flexWrap = 'wrap';
        content.appendChild(settingsContainer);

        // Create input fields for each setting
        varbs.forEach(function(v) {
            var wrapper = document.createElement('div');
            wrapper.style.paddingBottom = '10px';

            var label = document.createElement('label');
            label.textContent = v.name;
            if (v.type !== 'boolean') {
                label.textContent += ': ';
            }
            wrapper.appendChild(label);

            var input;
            if (v.type === 'boolean') {
                input = document.createElement('input');
                input.type = 'checkbox';
                input.style.border = '2px solid LightSkyBlue';
                // input.style.appearance = 'none'; // Add this line to remove the default checkbox appearance, BROKE TOO MUCH
                input.style.width = '18px'; // Add this line to set the width of the checkbox
                input.style.height = '18px'; // Add this line to set the height of the checkbox
                input.style.verticalAlign = 'middle';
                input.checked = GM_getValue(v.name, v.init !== undefined ? v.init : false);
                // if (DEBUG ) console.log("input.checked: ", input.checked);
                if (input.checked) label.style.fontWeight = 'bold'; //Stress with Bold label checked is ON!
                input.addEventListener('change', function() { // Test
                    if (this.checked) {
                        label.style.fontWeight = 'bold';
                    } else {
                        label.style.fontWeight = 'normal';
                    }
                });
                wrapper.appendChild(input);
            } else if (v.type === 'string' && v.options) {
                input = document.createElement('select');
                // input.style.border = '2px solid LightSkyBlue'; set for all below v3.3
                // input.style.width = '12em';
                v.options.forEach(function(option) {
                    var optionEl = document.createElement('option');
                    optionEl.value = option;
                    optionEl.textContent = option;
                    input.appendChild(optionEl);
                });
                input.value = GM_getValue(v.name, v.options[0]);

                wrapper.appendChild(input);
            } else if (v.type === 'string') {
                input = document.createElement('input');
                input.type = 'text';
                input.value = GM_getValue(v.name, v.init !== undefined ? v.init : '');
                if (DEBUG ) console.log("Adding Setting v.name, input.value: ", v.name, input.value);
                if (input.value == "undefined") input.value =""; //prevent undefined in unset varaibles v4.4
                if (DEBUG ) console.log("Adding Setting v.name, input.value: ", v.name, input.value);
                wrapper.appendChild(input);
            } else if (v.list !== undefined && v.type ==='integer') {
                input = document.createElement('textarea');
                input.style.resize = 'both';
                input.style.overflow = 'auto';
                input.style.height = '1em';
                defaultValue = v.list;
                input.value=GM_getValue(v.name, defaultValue);
                input.size=(v.list.join()).length + v.list.length+5;
                if (input.size > 21) { // Here is where I decide I'd rather have a textarea
                    input.classList.add('resizable');
                }

            } else {
                input = document.createElement('input');
                input.type='text';
                var defaultValue;
                if (v.type ==='integer') {
                    defaultValue=0;
                    if (v.init !== undefined) {
                        defaultValue = v.init;
                    }
                } else if (v.type ==='number') {
                    defaultValue=0.0;
                } else {
                    defaultValue='';
                }
                input.value=GM_getValue(v.name, defaultValue);
                input.size=String(input.value).length+1;
            }

            input.id=v.name;
            wrapper.appendChild(input);
            // if (v.list == undefined || v.options== undefined ) input.style.width = '50%'; // Leaves some space between our settings
            input.style.marginRight = '12px';
            input.style.border = '2px solid LightSkyBlue';
            content.appendChild(wrapper);
            // Untested multicolumn code:
            if (varbs.length > 11) {
                wrapper.style.width = '50%';
                wrapper.style.boxSizing = 'border-box';
            }
            settingsContainer.appendChild(wrapper);
        });

        // Create save button
        var saveBtn=document.createElement('button');
        saveBtn.textContent='Save';
        saveBtn.classList.add('mybutton', 'gradient-button');
        saveBtn.addEventListener('click',function() {

            varbs.forEach(function(v) {
                var input=document.getElementById(v.name);
                var value;
                if (v.type ==='boolean') {
                    value=input.checked;
                } else if (v.type ==='integer') {
                    if (v.list !== undefined) {
                        value = input.value.split(',').map(function(item) {
                            return parseInt(item.trim(), 10);
                        });
                    } else {
                        value=parseInt(input.value);
                    }
                } else if (v.type ==='number') {
                    value=parseFloat(input.value);
                } else {
                    if (v.name === "UserNote" && input.value) {
                        if (DEBUG) console.log("UserNote: ",input.value);
                        keepLastNErrors('UserNotes', curUNum + "," + input.value, 400);
                        DisplayUserNote(value); // add usernote at top
                    } else {
                        value=input.value;
                    }
                }
                GM_setValue(v.name,value);

            }); // End varbs.forEach block
            modal.remove();
            // Make ButtonColor change happen before next reload.
            let newButtonColor = GM_getValue("ButtonColor", "LightSkyBlue");
            if (DEBUG) {console.log('Previous ButtonColor: ',ButtonColor);
                        console.log('Just Stored ButtonColor: ',newButtonColor);
                       }
            if (newButtonColor.toLowerCase().includes("default")) { //I should document this!
                newButtonColor = "LightSkyBlue"; //v4.4
                GM_setValue("ButtonColor", "LightSkyBlue");
            }
            if (ButtonColor !== GM_getValue("ButtonColor", "LightSkyBlue") && isValidColor(newButtonColor)) {
                ButtonColor = newButtonColor; //v4.4
                style.sheet.cssRules[1].style.background = `linear-gradient(to bottom right, white, ${newButtonColor})`;
            }
        }); // End saveBtn function
        content.appendChild(saveBtn);

        // Create Copy Stats button
        var copyStatBtn=document.createElement('button');
        copyStatBtn.textContent='Copy Stats';
        copyStatBtn.classList.add('mybutton', 'gradient-button', 'right-button');
        copyStatBtn.addEventListener('click',function() {
            let inputE = document.querySelector("#UserNote");
            // find our variables and create string for stats
            // `${year}/${month}/${day}`
            if(inputE) {
                if (rIncr) {
                    inputE.value = Uploaded +" U D'ld: "+Downloaded+", Ratio: " +sratio + " RI: "+rIncr.toFixed(6)+" " + UTCdateStamp;
                } else {
                    inputE.value = " D'ld: 0 " + UTCdateStamp; //v4.9 log MAM date not local
                }
            }

        });

        // Create cancel button
        var cancelBtn=document.createElement('button');
        cancelBtn.textContent='Cancel';
        cancelBtn.classList.add('mybutton', 'gradient-button', 'right-button');
        cancelBtn.addEventListener('click',function() {
            modal.remove();
        });
        content.appendChild(cancelBtn); // TODO add small span for spacing?
        content.appendChild(copyStatBtn);

    }

    // End saveSD function

    // Define a structure to store the current, previous, and next array index positions
    function Position(key, prev, current, next) {
        this.key = key;
        this.prev = prev;
        this.current = current;
        this.next = next;
    }

    // Binary Search function to find out place in a list from a random start point.
    function findNextNumberBinSearch(arr, target, direction) {
        let start = 0;
        let end = arr.length - 1;
        let mid;

        while (start <= end) {
            mid = Math.floor((start + end) / 2);

            if (arr[mid] === target) {
                if (direction === -1 && mid - 1 >= 0) {
                    return arr[mid - 1]; // the next lower number
                } else if (direction === 1 && mid + 1 < arr.length) {
                    return arr[mid + 1]; // the next higher number
                } else {
                    return null; // no number is less or more than target
                }
            }

            if (arr[mid] < target) {
                start = mid + 1;
            } else {
                end = mid - 1;
            }
        }

        // if target is not found, return the number at the current mid index
        if (direction === -1) {
            return arr[mid] < target ? arr[mid] : arr[mid - 1];
        } else {
            return arr[mid] > target ? arr[mid] : arr[mid + 1];
        }
    } // end findNextNumberBinSearch

    // Define the new findNextNumber function
    function findNextNumber(key, target, direction) {
        // Get the Position object for this array
        var position = GM_getValue(key + "_position", new Position(key, -1, -1, -1));

        // Get the array from GM_setValue
        var arr = GM_getValue(key, []);

        // If the Position object has not been initialized, use binary search
        if (position.current === -1) {
            let nextNumber = findNextNumberBinSearch(arr, target, direction);
            let nextIndex = arr.indexOf(nextNumber);
            position.current = nextIndex;
            position.prev = nextIndex - 1;
            position.next = nextIndex + 1;
        }
        // Otherwise, use the Position object to find the next number
        else {
            position.current = (direction === 1) ? position.next : position.prev;
            position.prev = position.current - 1;
            position.next = position.current + 1;
        }

        // Check if we've reached either end of the array
        if (position.current < 0 || position.current >= arr.length) {
            return 0;
        }

        // Store the updated Position object
        GM_setValue(key + "_position", position);

        // Return the next number
        return arr[position.current];
    }

    function storageArr2Bytes(x){
        if (DEBUG) console.log("x = " + x + ", x[0]= " + x[0] + ", x[1]= " + x[1] );
        Downloaded = x[0] + " " + x[1];
        const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
        return x[0].replace(/,/g,"") * Math.pow(1024, sizes.indexOf(x[1]));
    }

    function showRatioIncr(){ // New in v3.6
        /* This only worked on other people's info pages)
    let sitedltd = document.querySelectorAll('td.rowhead')[3].nextElementSibling; // DL td
    let siteRatio = document.querySelectorAll('td.rowhead')[4].nextElementSibling; // Ratio td
*/
        // Get Site Downloaded data and Share ratio elements
        const tds = document.querySelectorAll('td.rowhead');
        let sitedltd; // Declare outside of the if block, for later use!
        let siteRatio;
        for (const td of tds) {
            if (td.innerText.includes("Uploaded")) {
                if (DEBUG >3) console.log(td);
                Uploaded = td.nextElementSibling.innerText; // sitedltd.innerText will have our string
            }
            if (td.innerText.includes("Downloaded")) {
                if (DEBUG >1) console.log(td);
                sitedltd = td.nextElementSibling; // sitedltd.innerText will have our string
            }
            if (td.innerText.includes("Share")) {
                if (DEBUG >3) console.log(td);
                siteRatio = td.nextElementSibling;
                break; // Stop looping after finding "Share ratio"
            }
            if (td.innerText.includes("Last")) { //v4.9 5/10/24
                DaysSinceLastSeen = Math.floor((new Date() - new Date(td.nextElementSibling.innerText)) / (1000 * 60 * 60 * 24));
                td.nextElementSibling.innerText += " (" + DaysSinceLastSeen + " days ago)";
                if (DEBUG) console.log("DaysSinceLastSeen: " + DaysSinceLastSeen);
            }
        }

        if (siteRatio.innerText.includes("Infinite")) {  // Check for 0/0 share ratio!
            // could also test if (/NAN/.test(siteRatio.outerText)) as includes matches at start
            // console.log("Max possible 1GiB ratio increase: 1,766,022.736842");
            sitedltd.innerText=" " + sitedltd.innerText + " - Max possible 1GiB ratio increase: 1,766,022.736842";
        } else {
            let x=sitedltd.outerText.split(/\s+/); //Parse number x[0] and size
            let dsize = storageArr2Bytes(x);
            if (DEBUG) console.log("dsize = " + dsize);
            rIncr = 1073741824/dsize
            console.log("Ratio Increase: " + rIncr);
            if (dsize == 604.16 ) { // Rules prevent any new torrent around this size, so this is Boston Chicken
                sitedltd.innerText=sitedltd.innerText + " - 1GiB Upload Credit Ratio Increase: 1,766,022.736842";
            } else {
                sitedltd.innerText=sitedltd.innerText + " - 1GiB Upload Credit Ratio Increase: " + rIncr.toFixed(6); // TODO add commas?
            }
        }
        // 4.0 addition, calculate BP/torrent
        let rtds = document.querySelectorAll('td.row1'); // Get all td elements with class 'row1'

        // Regular expression to match the string pattern
        let regex = /(had (\d+) satisfied torrents worth ([\d,.]+) per hour)/;

        rtds.forEach(td => {
            let html = td.innerHTML;
            let match = html.match(regex);
            if (match) {
                let torrents = parseInt(match[2]); // Extract the number of torrents
                let worth = parseFloat(match[3].replace(/,/g, '')); // Extract the worth
                let tValue = (worth / torrents).toFixed(6); // Calculate the value per torrent

                // Replace the matched string with the new string
                td.innerHTML = html.replace(regex, `$1 (${tValue}/torrent)`);
            }
        });

    } // End showRatioIncr function

}, 500); // delay in ms to run after MAM+ is finished, default 0.5 seconds, not sure if this was long enough for Newonly to work right.