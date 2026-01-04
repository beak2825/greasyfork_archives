// ==UserScript==
// @name         Que Monitoring Tool
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://zayo.my.salesforce.com/500?fcf=00B0z00000*
// @grant        unsafewindow
// @grant        GM_getTab
// @grant        GM_getTabs
// @grant        GM_saveTab
// @grant        GM_Notification
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/396625/Que%20Monitoring%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/396625/Que%20Monitoring%20Tool.meta.js
// ==/UserScript==

// Alright, this is probably not the greatest script, but I've spend 12+ hours on it and it works, so I'm not gotta touch it anymore
// Ideally, we would just wait for the page to load, and then iterate over the list of cases
// This is not (cleanly) possible, as there are MULTIPLE asychronous (read parallel) processes going on while loading the page, in addition to this Javascript. This means our script executes before the page has loaded the list
// Every attempt I made to simply validate the page was loaded by waiting called yet another asynchronous function. This caused the checking loop to run infinitely, and the Wait command/function to run on a separate process. In good implementation, I could get the loop and wait function on the same thread, but then couldn't get it to stop.
//
// Each Queue view has a uniqe identifier (something like "00B6000000xxxxx"). When changing the view, the URL of the window does NOT change, but the list view does. Elements in the page have IDs assigned to them that are unique to the queue's ID (ie "00B0z000007yUvr_listBody"), so getting this is queue ID is important
//
// Once we have the Queue ID, we can create and MutationOBserver object which will monitor the main _listBody for changes. The _listBody is present at page load, and is modified by SF Javascript to populate the list once it pulls it from the server. The MutationObserver will fire a function once it detects the list has been populated.
//
// Once the list is populated, we store the varius columns data (type: HTMLCollection) into variables. We can later convert the HTMLCollection into the raw text
//
// Then we can evaluate what we want to listen for (evaluateSingleTrigger or evaluateDoubleTrigger). We need to pass the function a table to iterate through, and a "trigger" or search phrase, and actions (either a single string, or array of strings/actions). The evaluation function will look through the list and send any triggers off to be acted upon
//
//Actions are first passed by the first call to evaluate a table. The evaluation function then passes the actions to the actOnTriggers() function. Actions available are "highlight" row, desktop "notification", and "sound". Multiple actions can be passed as an array of strings, otherwise a single string/action will suffice.



(function() {
    'use strict';
    //
    var firstLoad = true;
    const listSelector = document.getElementsByClassName("title")[0]; //Store the entirety of the Queue dropdown into a variable
    var selectedList = document.getElementsByClassName("title")[0].selectedOptions[0].value; //The queue view identifier in the URL is not necessarily the one being displayed. The identifier being displayed can be be pulled from the currently selected dropdown menu
    var urlList = listSelector.options[0].value; //Not sure if this will come in handy, but it seems like a good idea to differntiate the two

//    //Table Loaded Trigger Logic
//    (function() { //Crate the MutationObserver element so that it fires the rest of the script when the mutation (read "page load") happens
//        var targetElement = document.getElementById(selectedList + "_listBody");
//        var observer = new MutationObserver(function(){
//            if(targetElement.style.display != 'none'){//If the list of cases is no longer hidden, draw the restOfTheFuckingOwl
//                if (firstLoad == true){
//                    firstLoad = false;
//                    document.getElementById(selectedList + "_refresh").click(); //For some reason the script won't run right on first load, but clicking the refresh button works correctly every time
//                    parseTable();
//                    monitor("highlight", ["Status", "Action Required"]);
//                }
//                //parseTable();
//            }
//        });
//        observer.observe(targetElement, { attributes: true, childList: true });

    //The most reliable way to know when the table has been loaded is with a MutationObserver, which is a fairly finicky Object to work with
    //It requires a Callback function upon creation. Later it requires a Target to Observe, and a list of Options (config)
    //This Object listens and fires the Callback for ALL changes to the target Node. You cannot set it to listen for a specific child/attribute/etc within the target
    //Additionally, to add to the inefficiency of this whole ordeal, the targetNode cannot be an Element, but had to be of type Node, so it can monitor multiple elements
    var targetElement = $(".listBody")[0]; //MUST be of specific Node type (DIV elements don't coun't, apparently)
    var observerConfig = { //Fire for ALL possible events. Our actual target here is the DIV with ID "00B0z00000xxxxx_loading"
        attributes : true,
        childList: true,
        subtree: true
    };
    var observerCallback = function (mutationList, observer) { //What we wan to happen everytime the MutationObserver fires
        if (document.getElementsByClassName("waitingSearchDiv")[1].style.display == "none") { //Since this Callback fires for multiple events, check to see if DOM change we want happened (alternatively, we could also iterate through mutationList)
            parseTable();
            //observer.disconnect(); //Stop the observer and free up system resources
            monitor("notification", ["Status", "Action Required"]);

        };
    };
    var observer = new MutationObserver(observerCallback);
    observer.observe(targetElement, observerConfig);


    var tbl = [];
    var tblHeaders = [];
    var elRows;

    function parseTable () {
        if ($(".x-grid3-hd-row")){}else{return;};

        tbl = [];
        var tblRow = [];

        //Parse Column Headers
        var elHeaders = $(".x-grid3-hd-row");
        for (var i = 0; i < elHeaders[0].children.length; i++){ //Iterate through each cell
            tblHeaders.push(elHeaders[0].children[i].innerText); //Append the innerText of each cell to the tblHeaders Array
        };

        //Parse Rows
        elRows = $(".x-grid3-row-table");
        for (var rowIndex = 0; rowIndex < elRows.length; rowIndex++) { //Iterate through each row
            for (var cellIndex = 0; cellIndex < elRows[rowIndex].children[0].children[0].children.length; cellIndex++){ //Iterate through each cell in the row
                tblRow.push(elRows[rowIndex].children[0].children[0].children[cellIndex].innerText); //Add the the innerText of the current cell to the current row array, tblRow
            };
            tbl.push(tblRow); //Add the row to the master "tbl" array
            tblRow = []; //Clear the row for the next go-round in the For loop
        };
        console.log(tbl);
    };


    function indexesOfSearch (columnSearchArray) { //Expects array [column, search]. Returns array
        var column = columnSearchArray[0];
        var search = columnSearchArray[1];
        //var column = "Status";
        //var search = "Action Required";
        var response = [];

        var columnIndex = tblHeaders.indexOf(column);
        if (columnIndex < 0){ return []}; //If we can't find the column, we can't search for anything, so return an empty array

        for (var i = 0; i < tbl.length; i++) { //Iterate through each row
            if (tbl[i][columnIndex] === search){ //If the contents of the cell in column X match the search string, add it to the response
                response.push(i);
            };
        };
        return response;
    };


    function indexesOfComparedSearches (firstSearch, secondSearch){ //Expects arrays. Returns array
        var response = [];

        for (var i = 0; i < firstSearch.length; i++){//Iterate through each row in the firstSearch Array
            if(secondSearch.indexOf(firstSearch[i]) >= 0){ //If the contents of the current row are ANYWHERE in the secondSearch Array, add it to the response
                response.push(firstSearch[i]);
            };
        }
        return response;
    };


    function notify (rows, notificationType){ //Expects rows as an array, notificationType as a "String"
        if (rows.length < 1) { //If there's nothing to iterate over, then GTFO
            return;
        };

        for (var i = 0; i < rows.length; i++){ //Iterate through each row we need to notify on
            switch(notificationType){
                case "highlight":
                    elRows[rows[i]].style.backgroundColor = "pink";
                    break;
                case "notification":
                    var options; //For a notification. Will need to customize this a few lines down
                    var notif; //The actual notificaiton
                    var ttnIndex = tblHeaders.indexOf("Case Number"); //Grab the TTN of the affected case
                    var subjectIndex = tblHeaders.indexOf("Subject"); //Grab the subject of the affected case
                    options = {
                        icon: "https://zayo.my.salesforce.com/favicon.ico",
                        body: tbl[i][subjectIndex] //Assign subject to teh body of the Destop Notification
                        };
                    notif = new Notification(tbl[i][ttnIndex], options); //Create the notification
                    break;
                case "sound":
                    break;
            };
        };

    };

    function monitor (notificationType, trigger) {//Expects notificationType as String, trigger as Array with a length >=2
        var searchResults = [];
        for (var i = 0; i < trigger.length; i = i+2){ //Iterate through each column/trigger pair. Make an array for each pair, and add that to searchResults (so that we have an array of arrays)
            var columnSearchArray = [trigger[i], trigger[i+1]];
            searchResults.push(indexesOfSearch (columnSearchArray))
        };

        console.log("Search Results: " + searchResults);
        console.log(searchResults.length);

        var notificationRows = [];
        if (searchResults.length > 1){ //Is there more than one column/trigger pair?
            var preliminaryMatches = indexesOfComparedSearches(searchResults[0], searchResults[1]); //Init this variable for the For loop below

            for (i = 2; i < searchResults.length; i++){ //Already initializing the variable means i needs to start at 2
                preliminaryMatches = indexesOfComparedSearches(preliminaryMatches, searchResults[i]);
            };

            notificationRows = preliminaryMatches;

        } else if (searchResults.length > 0){
            notificationRows = searchResults[0];
        } else {
            //You fucked up
        };
        notify(notificationRows, notificationType);
    };
//    })();
})();