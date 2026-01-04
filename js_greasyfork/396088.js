// ==UserScript==
// @name         Salesforce - Queue Bookmarks & Auto-Refresh
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Creates customizable secondary "Quick Draw" queue dropdown selection list. Also adds auto-refresh button
// @author       You
// @match        https://zayo.my.salesforce.com/500?fcf=*
// @include      https://zayo.my.salesforce.com/500/o
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/396088/Salesforce%20-%20Queue%20Bookmarks%20%20Auto-Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/396088/Salesforce%20-%20Queue%20Bookmarks%20%20Auto-Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //This creates a customizable second dropdown just to the right of the current one in SalesForce for the purpose of creating bookmarks
    //To lay things out in the code:
    //First we define some variables and create the new dropdown, assuming on is already saved (else use Defaults)
    //Then we create the edit button, in all its glory
    //Lastly we handle the all the nitty grity of editing the dropdown
    //Finalize everything an append it to the page

    //Define some variables we'll need later
    const currentListSelector = document.getElementsByName("fcf")[0]; //Pulls the current dropdown/selector from the page
    var newListSelector = document.createElement("SELECT"); //Create a new dropodown/selector to add to the page later
    const currentSelection = currentListSelector.options[currentListSelector.selectedIndex].value; //Get the list selected currently (as string)
    const defaultHTML = "<option>Quick Draw</option>\r\n<option value=\"00B0z000007yUvr\">NCC Transport -1-Needs Pickup</option>\r\n<option value=\"00B0z000007edeC\">NCC Transport -3.-All In Progress +child</option>\r\n<option value=\"00B0z000007yQiK\">NCC Transport-3A- All In Progress</option>\r\n<option value=\"00B0z000007yQiU\">NCC Transport-3B - In Progress NSA</option>\r\n<option value=\"00B0z000007ede7\">NCC Transport -4-All Inactive</option>\r\n<option value=\"00B0z000007yda9\">NCC-Transport-Incident Investigations</option>\r\n<option value=\"00B60000006cVo1\">My Closed Cases</option>\r\n<option value=\"00B0z000007ydRq\">My Open Cases - Custom</option>\r\n<option value=\"00B0z000007ydAG\">My Open Cases - DO NOT EDIT/DELETE</option>";
    const storedInnerHTML = GM_getValue("quickDrawBookmarks");
    var timer = window.setInterval(awaitQueueLoaded, 100);
    var interval = GM_getValue("autoRefreshInterval", 10);
    var timerEnabled = GM_getValue("autoRefreshEnabled", "false");
    var timeLeft = interval;
    GM_setValue("quickDrawBookmarks", defaultHTML);

    //Before we get started, let's check to see if we can pull previous settings from the browser. If we can't we'll use the hard-coded defaults
    if (GM_getValue("quickDrawBookmarks")){
        newListSelector.innerHTML = storedInnerHTML;
    }else{
        newListSelector.innerHTML = defaultHTML;
    };

    //Create and style the Edit button
    var btnCustomize = document.createElement("input");
        btnCustomize.type = "button";
        btnCustomize.id = "btnCustomize";
        btnCustomize.value = "Edit";

    //Create the new Dropdown menu
    newListSelector.id = "newListSelector";
    currentListSelector.outerHTML = newListSelector.outerHTML.concat(currentListSelector.outerHTML); //Scrape the SalesForce default HTML out, add our sauce, and then put it back
    document.getElementsByName("fcf")[0].insertAdjacentElement("afterend", btnCustomize); //Add the edit button to the side (not sure why this isn't at the end of the code like the other appendChild statements, but it works so I'm not gonna change it

    //What to do when we click the button
    $("btnCustomize").onclick = function () {
        openCustomizer();
    };

    //What to do when we click a new selection from the Dropdown
    $("newListSelector").onchange = function () {
        newListSelector = $("newListSelector"); //Reuse that variable from earlier to update our internal reference for it
        const baseURL = "https://zayo.my.salesforce.com/500?fcf="; //All Queue URLs start this way
        var goToURL = baseURL + newListSelector.options[newListSelector.selectedIndex].value; //Append the GUID to the base URL
        navigateToUrl(goToURL); //Go to that URL
    };



    //Oh what fun this one was. First time saving/retrieving settings
    function openCustomizer () {
        //First we create and style the DIV, create a multi-select list element for the user, a button to continue, and lastly paste the selection into a text box for the user to re-order to their liking before finally saving the settings
        //
        //Create and style the DIV
        var customizerDiv = document.createElement("div"); //create and style a new DIV element
        customizerDiv.id = "customizerDiv";
        customizerDiv.style.width = "60%";
        customizerDiv.style.height = "400px";
        customizerDiv.style.bottom = "center";
        customizerDiv.style.top = "40px";
        customizerDiv.style.zIndex = "99999";
        customizerDiv.style.position = "fixed";
        customizerDiv.style.margin = "auto";
        customizerDiv.style.border = "3px solid black";
        customizerDiv.style.borderRadius = "6px";
        customizerDiv.style.padding = "20px";
        customizerDiv.style.backgroundColor = "white";
        customizerDiv.style.fontSize = "125%";
        customizerDiv.innerText = "Select Lists you would like added to your bookmarks:";

        //Create and style the list
        var checkBoxList = document.createElement("SELECT");
        checkBoxList.id = "checkBoxList";
        checkBoxList.multiple = true;
        checkBoxList.style.width = "95%";
        checkBoxList.style.height = "100%";
        var currentOption = document.createElement("OPTION")
        //for (var i = 0; i < currentListSelector.options.length; i++){ //Add memebers to the list from SalesForce's dropdown by iterating through each one
            ////checkBoxList.add(currentListSelector[i]);
            //checkBoxList.add(currentOption);
        //}
        checkBoxList.innerHTML = currentListSelector.innerHTML;

        //Create and style the button
        var btnSave = document.createElement("input");
        btnSave.type = "button";
        btnSave.id = "btnSave";
        btnSave.value = "Next";
        btnSave.style.position = "absolute";

        //The holy Save Button
        btnSave.onclick = function () {
            if (this.value == "Next"){ //We reuse this same button later, so first we check to see if it's at the first for Final step
                const toSave = $("checkBoxList").selectedOptions; //Save all of the previously selected Queues to a variable
                //var list = $("checkBoxList"); //I don't think this does anything?? Keeping it here just in case

                //Create and style a new text box
                var textBoxToSave = document.createElement("textarea");
                textBoxToSave.style.width = "95%";
                textBoxToSave.style.height = "95%";
                textBoxToSave.id = "textBoxToSave";
                textBoxToSave.name = "textBoxToSave";
                textBoxToSave.wrap = "soft";

                //Generate the text for the textBox
                var text = "<option>Quick Draw<\/option>"; //This is the hard-coded default option
                for (var i=0; i < toSave.length; i++){ //Iterate through each selected option
                    text = text + "\r\n<option value=\"" + toSave[i].value + "\">" + toSave[i].innerText + "<\/option>"; //Generate HTML for each option the user selected
                };
                textBoxToSave.value = text; //Put text generated by the For loop into the textBox

                $("checkBoxList").replaceWith(textBoxToSave); //Replace the multi-select list with the textBox we just spent so much time making

                btnSave.value = "Save"; //Update the button for the Final step
                alert("Reorder them as you prefer (each line represents one option)");

            }else{ //this.value == "Save";
                GM_setValue("quickDrawBookmarks", $("textBoxToSave").value); //Save the content of the textBox to TamperMonkey's internal memory, indefinitely
                customizerDiv.style.hidden = true; //Hide the UI we made. Not really necessary since we're about 20ms away from reloading the page anyway
                location.reload(); //Reload the screen
            };


        };

        //Add all of everything to the page
        document.body.appendChild(customizerDiv);
        $("customizerDiv").appendChild(checkBoxList);
        $("customizerDiv").appendChild(btnSave);

    };

    function awaitQueueLoaded () {
        //var selectedList = document.getElementsByClassName("title")[0].selectedOptions[0].value
        //var targetElement = document.getElementById(selectedList + "_refresh");
        var targetElement = document.getElementsByClassName("waitingSearchDiv")[0];
        //if(targetElement != null){
        if (targetElement.style.display == "none"){
            window.clearInterval(timer);
            timer = null;
            addAutoRefresh();
            addRefreshClickEventHandler();
        };
    };

    function addAutoRefresh () {
        var btnAutoRefresh = document.createElement("input");
        btnAutoRefresh.type = "button";
        btnAutoRefresh.className = "btn refreshListButton";
        btnAutoRefresh.id = "btnAutoRefresh";
        btnAutoRefresh.title = "Double-click to change reload speed";
        btnAutoRefresh.style.width = "unset";
        btnAutoRefresh.style.height = "unset";
        btnAutoRefresh.style.background = "unset";
        btnAutoRefresh.onclick = btnAutoRefreshClickHandler;
        if (timerEnabled == "true"){
            btnAutoRefresh.value = "Disable - Refresh in " + timeLeft + "s";
            GM_setValue("autoRefreshEnabled", "true");
            btnAutoRefresh.style.backgroundColor = "#ffc8c8";
            timer = window.setInterval(countdownTicker, 1000);
        } else {
            btnAutoRefresh.value = "Enable Auto-Refresh";
        };
        document.getElementsByClassName("refreshListButton")[0].insertAdjacentElement("afterEnd", btnAutoRefresh);
    };

    function btnAutoRefreshClickHandler (eventArgs) {
        if (eventArgs.detail == 2) { //If it's a double click
            console.log("double clicked");
            window.clearInterval(timer);
            timer = null;
            changeAutoRefreshInterval();
            btnAutoRefreshClickHandler({detail: 1});
        } else if (eventArgs.detail == 1 && timer == null){ //If we are enabling the countdown
            GM_setValue("autoRefreshEnabled", "true");
            timerEnabled = "true";
            $("btnAutoRefresh").style.backgroundColor = "#ffc8c8";
            timer = window.setInterval(countdownTicker, 1000);
        } else if (eventArgs.detail == 1 && timer !== null){ //If we are stopping the countdow
            GM_setValue("autoRefreshEnabled", "false");
            timerEnabled = "false";
            window.clearInterval(timer);
            timer = null;
            $("btnAutoRefresh").style.backgroundColor = "unset";
            $("btnAutoRefresh").value = "Enable Auto-Refresh";
        };
    };
    function countdownTicker () {
        timeLeft--
        $("btnAutoRefresh").value = "Disable - Refresh in " + timeLeft + "s";
        if (timeLeft <= 0){
            window.clearInterval(timer);
            $("btnAutoRefresh").parentElement.firstElementChild.click();
            timer = window.setInterval(awaitQueueLoaded, 100);
            timeLeft = interval;
        };
    };

    function changeAutoRefreshInterval () {
        var response = prompt("Page refresh interval (seconds): <10-999>");
        response = parseInt(response);
        if (isNaN(response) == true || response <= 10 || response >= 1000){
            alert("Input invalid");
            return;
        };
        interval = parseInt(response);
        GM_setValue("autoRefreshInterval", interval);
        console.log(GM_getValue("autoRefreshInterval"));
    };


    function addRefreshClickEventHandler () {
        window.clearInterval(timer);

        $(currentSelection + "_refresh").addEventListener("click", function () {
            console.log("clicked");
            window.clearInterval(timer);
            GM_setValue("autoRefreshEnabled", "false");
            timerEnabled = "false";
            timer = window.setInterval(awaitQueueLoaded, 100);
        });
    };
    function $(elementId) {
        return document.getElementById(elementId);
    };

})();