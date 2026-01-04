// ==UserScript==
// @name         XLR Scripts Rewrite - Deprecated
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://xlr.zayo.com/CircuitInfo/CircuitLayoutRecord.aspx*
// @match        http://collapsed.zayo.us/?circuitID=*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/412989/XLR%20Scripts%20Rewrite%20-%20Deprecated.user.js
// @updateURL https://update.greasyfork.org/scripts/412989/XLR%20Scripts%20Rewrite%20-%20Deprecated.meta.js
// ==/UserScript==

(function() {
    'use strict';
//GreaseMonkey Saved Data Table ("xlrScriptSavedData")
//Variable is a 2-dimensional array saved to the user's browser in the format ["variableName", "variableValue"]
//[0] dispatchPOC
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//URL Handler
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var pageURL = window.location.href; //grab the browser's URL
    //if (pageURL.search("xlr.zayo.com/") >= 0) {XLRToolHandler()};
    var circuitSearchList = [];
    var circuitSearchData = [];
    var clpBulkWindow;
    var collapsedToolResults;
    if (pageURL.search("collapsed.zayo.us/") >= 0) {collapsedToolHandler()};



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//XLR Tool Handler
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Change some basic functionality of the page
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Add Wildcard Search functions
    //We do this first, because in the event that we have a blank XLR, the following code will error out causing script failure before this runs
    addXLRWildCardSearch();

        //Add URL Recognition and handling
        var circuitStart = pageURL.indexOf("circuitID=") + 10; //figure out where our CID starts

        if (circuitStart < 49){ //this is more "idiot light" logic than it is real checking to see if we actually have a CID in that variable
        } else if ($("txtCircuitID").value == ""){ //check to see if the search bar is empty. If it's not, then the page has already loaded the contents of the XLR the user requested
            var dirtyCID = pageURL.slice(circuitStart, pageURL.length); //extract the CID from the browser's URL, +'s and %'s included
            var cleanCID = decodeURIComponent(dirtyCID); //get rid of all of those pesky %20s and other URL encoded characters to human-readable form
            cleanCID = cleanCID.replace(/\+/g, ""); //get rid of all of the + signs put there by SimpleSelectSearch, should it be used
            cleanCID = sanitizeCID(cleanCID);

            if (pageURL.search("collapsed.zayo.us/") >= 0) {collapsedToolHandler()};
            $("txtCircuitID").value = cleanCID; //put the CID in the search box by referencing the internal identifyer
            $("btnFindCircuitDesignID").click(); //emulate clicking the search ("Refresh XLR") button
        }

        //Add Title to Window
        var customer = document.getElementsByTagName("td")[1].innerText;
        if (customer.search("Interco") >= 0){//If the customer is "Interco ZG (USA) - Wavelengths LH" then don't mention it in the title
            customer = ""
        }else if (customer.length > 10){
            customer = customer.slice(0,customer.search(" "))
            customer = customer + " ";
        };
        document.title = customer + document.getElementById("form1").elements[2].value;

        //Change the Window Icon
        //Courtesy of https://codepad.co/snippet/changing-your-site-s-favicon-with-javascript
        function change_favicon(img) {
            var favicon = document.querySelector('link[rel="shortcut icon"]');
            if (!favicon) {
                favicon = document.createElement('link');
                favicon.setAttribute('rel', 'shortcut icon');
                var head = document.querySelector('head');
                head.appendChild(favicon);
            }
            favicon.setAttribute('type', 'image/png');
            favicon.setAttribute('href', img);
        }
        change_favicon('https://i.imgur.com/Cvi6NIy.png');

        //Change up the Alternate CLR retrieval scheme


        const colBlockInd = 0;
        const colSeq = 1;
        const colPrintableLines = 2;
        const colCLLI = 3;
        const colAddress = 4;
        const colAddtLocInfo = 5;
        const colConnectivityType = 6;
        const colCategory = 7;
        const colProductGroup = 8;
        const colTID = 9;
        const colEquipFacility = 10;
        const colPort = 11;
        const colFNI = 12;
        const colIPAddress = 13;
        const colDesignAction = 14;
        const icnCopySrc = "https://i.imgur.com/oVFrGno.png"
        const icnDispatchSrc = "https://i.imgur.com/g6DhElc.png"
        const icnMenuSrc = "https://i.imgur.com/3hO1HlF.png"
        const icnMapSrc = "https://i.imgur.com/Q7Ig7t0.png"
        const icnPortSrc = "https://i.imgur.com/Z8UpbBo.png"
        var dspWindowOpen = false;
        var tblHTML = $("GridView1"); //Load the XLR table into variable "tbl"
        var tblLength = tblHTML.rows.length - 1;
        var rowLength = tblHTML.rows[0].cells.length;
        var tblData = []

        //Load the table into memory
        //Store the text only only into an easily addressable 2-dimensional table "tblData"
        var row = []
        for (var i = 1; i < tblLength + 1; i++){
            for (var j = 0; j < rowLength; j++){
                if (tblHTML.rows[i].cells[j].innerText == " "){ //"Empty" cells in M6 are shown in XLR by a special zero-width whitespace character. Here, we detect them and convert them to an actually empty cell
                    row.push("");
                }else{
                    row.push(tblHTML.rows[i].cells[j].innerText);
                };
            };
            tblData.push(row)
            row = [];
        };



        addFacilitiesLink();
        addNCCLink();
        cleanUpIPs();
        //addClassName("actionButton", colDesignAction);
        hideColumn(0);
        hideColumn(2);
        //buildContextMenu(); //This MUST be run before addActionIcons()
        addActionIcons();
        //addActionsToIcons();
        addCopyOnTripleClick();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Build the Context Menu
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function buildContextMenu () {
    document.head.innerHTML += "<style type=\"text\/css\">\r\n.ctxMenu{\r\n\tbackground-color: white;\r\n\twidth: fit-content;\r\n    padding: 3px;\r\n\tz-index: 10;\r\n}\r\ndiv.ctxMenu{\r\n    width: fit-content;\r\n    border-radius: 6px;\r\n    box-shadow: -6px 11px 20px black;\r\n\tposition: absolute;\r\n\tdisplay: none;\r\n}\r\ntd.ctxMenu{\r\n\tborder-left-color: black;\r\n\tborder-left-width: 6px;\r\n}\r\ntd.ctxMenu:hover{\r\n\tbackground-color: lightgrey;\r\n\tborder-left-color: blue;\r\n\tcursor: pointer;\r\n}\r\ntr.ctxMenu{\r\n\tborder-left-color: black;\r\n\tborder-left-width: 6px;\r\n}\r\ntr.ctxMenu:hover{\r\n\tbackground-color: lightgrey;\r\n\tborder-left-color: red;\r\n}\r\n.opaqueDiv{\r\n\tposition: fixed;\r\n\twidth: 100%;\r\n\theight: 100%;\r\n\ttop: 0px;\r\n\tz-index: 2;\r\n\tdisplay: none;\r\n}\r\n.actionButton{\r\n\tbackground-image: url(https:\/\/zayo--c.na67.content.force.com\/sfc\/servlet.shepherd\/version\/download\/0680z000008tm02?asPdf=false&operationContext=CHATTER);\r\n\tbackground-position: center;\r\n\tbackground-repeat: no-repeat;\r\n}\r\n<\/style>";
    document.body.innerHTML += "<div class=\"opaqueDiv\" id=\"opaqueDiv\"><\/div>\r\n<div class=\"ctxMenu\" id=\"ctxMenu\">\r\n\t<table class=\"ctxMenu\">\r\n\t\t<tbody id=\"context-menu\" class=\"ctxMenu\">\r\n\t\t<\/tbody>\r\n\t<\/table>\r\n<\/div>";

    };
    var ctxMenu = $("ctxMenu");
    var ctxMenuState = 0;
    var tbodyCtxMenu = $("context-menu")
    var ctxMenuRow = 0;
    var clickedRow;
    var lastTimeStamp = undefined;
    //var menuItems = ["Copy IP", "Copy TID/Port", "NCC Tool", "Collapsed Tool", "Google Maps", "Dispatch"]
    //for (i = 0; i < menuItems.length; i++){
    //    var tr = document.createElement("tr");
    //    var td = document.createElement("td");
    //    tr.className = "ctxMenu";
    //    tr.id = menuItems[i]
    //    tr.setAttribute("data", menuItems[i]);
    //    td.className = "ctxMenu";
    //    td.innerText = menuItems[i];
    //    td.onclick = function () {
    //        ctxMenuAction(this.id);
    //    };
    //    tr.appendChild(td);
    //    tbodyCtxMenu.appendChild(tr);
    //};
    //document.addEventListener( "ctxMenu", function(e) {
    //    console.log(e);
    //});

    //addEventListeners();
    function addEventListeners () {
        for (i = 0; i < tblLength; i++){ //Iterate through each row
            var cell = $("GridView1").rows[i+1].cells[colDesignAction];
            cell.setAttribute("data", i);

            cell.addEventListener( "click", function(e) {
                console.log(e, this);
                //e.preventDefault();
                toggleMenu(e, this);
            });

        };
    };

    // document.addEventListener( "click", function(e) {
    //     console.log(e, this);
    //     //e.preventDefault();
    //     toggleMenu(e, this);
    // });
    addXLRWildCardSearch(); //For some reason adding the eventListeners causes buttons made/modified by this script to no longer work. Re-running them seems to fix it though
    addPreviousCLRButton();

    function toggleMenu (eventArgs, element) {
        var opaqueDiv = $("opaqueDiv");
        if (element.className == "actionButton"){
            ctxMenuState = 1;
            lastTimeStamp = eventArgs.timeStamp;
            $("opaqueDiv").onclick = function () {
                toggleMenu();
            };
            ctxMenu.style.display = "block";
            clickedRow = parseInt(element.getAttribute("data"));
            console.log(clickedRow);
            updateMenuOptions(element);
            positionMenu(eventArgs, element);
        } else if (eventArgs.timeStamp - lastTimeStamp >= 50 || lastTimeStamp == undefined){
            ctxMenuState = 0;
            ctxMenu.style.display = "none";
        };
    };

    function positionMenu (eventArgs, element) {
        //Courtesy of Nick Salloum https://www.sitepoint.com/building-custom-right-click-context-menu-javascript/
        var menuPosition = getPosition(eventArgs);
        var menuPositionX = menuPosition.x;
        var menuPositionY = menuPosition.y;
        var menuWidth = ctxMenu.offsetWidth;
        var menuHeight = ctxMenu.offsetHeight;
        var ctxMenuRowHeight = $("ctxMenu").firstElementChild.firstElementChild.firstElementChild.offsetHeight;


        ctxMenu.style.left = menuPositionX - menuWidth + "px";
        ctxMenu.style.top = menuPositionY - (ctxMenuRowHeight / 2) + "px";
    };

    function updateMenuOptions (tblDataRow) {
        var rowType = tblData[tblDataRow][colConnectivityType]
        var list = [];
        switch(rowType){
            case "Cross Reference":
                list = ["Copy Info"];
                break;
            case "Foreign Information":
                list = ["Copy Info"];
                break;
            case "Physical Port":
                list = ["Copy IP", "Copy TID/Port", "NCC Tool", "Google Maps", "Search SalesForce-TID", "Dispatch"]
                break;
            case "Logical Port":
                list = ["Copy IP", "Copy TID/Port", "NCC Tool", "Google Maps", "Search SalesForce-TID", "Dispatch"]
                break;
            case "Facility":
                list = ["Collapse Tool", "Copy Facility", "Search SalesForce-CID", "XLR"]
                break;
        };
        return list;
        //buildMenu(list);
    };

    function buildMenu (menuItems) {
        clearMenu();
        for (i = 0; i < menuItems.length; i++){
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            tr.className = "ctxMenu";
            tr.setAttribute("data", menuItems[i]);

            td.className = "ctxMenu";
            td.id = menuItems[i]
            td.innerText = menuItems[i];
            td.onclick = function () {
                ctxMenuAction(this.id);
            };
            tr.appendChild(td);
            tbodyCtxMenu.appendChild(tr);
        };
    };

    function ctxMenuAction (elementId) {
        switch(elementId){
            case "Copy IP":
                ctxMenuActionCopyIP();
                break;
            case "Copy TID/Port":
                ctxMenuActionCopyTIDPort()
                break;
            case "NCC Tool":
                ctxMenuActionNCCTool()
                break;
            case "Collapse Tool":
                ctxMenuActionCollapsed()
                break;
            case "Google Maps":
                ctxMenuActionGoogleMaps()
                break;
            case "Dispatch":
                ctxMenuActionDispatch()
                break;
            case "XLR":
                ctxMenuActionXLR();
                break;
            case "Copy Facility":
                ctxMenuCopyCID();
                break;
            case "Search SalesForce-TID":
                ctxMenuSearchSFTID();
                break;
            case "Search SalesForce-CID":
                ctxMenuSearchSFCID();
        };
    };

    function ctxMenuActionCopyIP () {
        addToClipboard(tblData[clickedRow][colIPAddress]);
    };
    function ctxMenuActionCopyTIDPort () {
        var TID = formattedTID(tblData[clickedRow][colTID]);
        var port = formattedPort(tblData[clickedRow][colPort]);
        var IP = tblData[clickedRow][colIPAddress];
        if (isValidIP(IP) !== true){
            IP = " (" + IP + ")";
        }else{
            IP = ""
        };
        addToClipboard(TID + " " + port + IP);
    };
    function ctxMenuActionNCCTool () {
        var TID = formattedTID(tblData[clickedRow][colTID]);
        window.open("https://ncctool.zayo.us/index.php?-table=node_data&-search=" + TID);
    };
    function ctxMenuActionCollapsed () {
        var CID = tblData[clickedRow][colEquipFacility];
        window.open("http://collapsed.zayo.us/?circuitID="+ CID);
    };
    function ctxMenuActionGoogleMaps () {
        var address = tblData[clickedRow][colAddress]
        window.open("https://www.google.com/maps/search/"+address);
    };

    function ctxMenuActionXLR () {
        var CID = tblData[clickedRow][colEquipFacility];
        window.open("http://xlr.zayo.com/CircuitInfo/CircuitLayoutRecord.aspx?circuitID="+ CID);
    };

    function ctxMenuCopyCID (){
        var CID = tblData[clickedRow][colEquipFacility];
        CID = sanitizeCID(CID);
        addToClipboard(CID);
    };

    function ctxMenuSearchSFTID () {
        var TID = formattedTID(tblData[clickedRow][colTID]);
        window.open("https://zayo.my.salesforce.com/_ui/search/ui/UnifiedSearchResults?searchType=2&str=" + TID);
    };

    function ctxMenuSearchSFCID () {
        var CID = tblData[clickedRow][colEquipFacility];
        window.open("https://zayo.my.salesforce.com/_ui/search/ui/UnifiedSearchResults?searchType=2&str=" + CID);
    };

    function ctxMenuActionDispatch () {
        if (dspWindowOpen == true && confirm("You already have a dispatch window open for this page. Continuing will lose all unsaved data. Continue?") == false){
            return;
        };
        dspWindowOpen = true;
        var dspWindow = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes");
        dspWindow.document.body.innerHTML = "<html><head><style type=\"text\/css\">\r\n    .:active{\r\n        box-shadow: 0 0 2px 0px black;\r\n    }\r\n    .dspTxt{\r\n        width:100%;\r\n    }\r\n    .dspTxtMulti{\r\n        width: -webkit-fill-available;\r\n        height: 80px;\r\n    }\r\n    .dspRequired{\r\n        border-left: 3px solid red;\r\n    };\r\n    <\/style>\r\n<\/head><body>\r\n\r\n<table id=\"dspTemplateTable\" style=\"\r\n    display: unset;\r\n\">\r\n    <tbody>\r\n        <tr>\r\n            <td>TTN<\/td>\r\n            <td><input id=\"dspTTN\" class=\"dspTxt dspRequired\"><\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>Dispatch Type<\/td>\r\n            <td>\r\n                <select id=\"dspType\" class=\"dspRequired\">\r\n                    <option value=\"MTTR\">MTTR<\/option>\r\n                    <option value=\"Scheduled\">Scheduled<\/option>\r\n                    <option value=\"Best Effort\">Best Effort<\/option>\r\n                <\/select>\r\n            <\/td>       \r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                Address\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspAddress\" class=\"dspTxt\">\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                Type of Work\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspTypeOfWork\" class=\"dspTxt dspRequired\">\r\n            <\/td>\r\n        <\/tr>\r\n        <tr style=\"display: none;\">\r\n            <td>\r\n                Scheduled Date\/Time\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspScheduledTime\" class=\"dspTxt dspScheduled dspRequired\">\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                Time Zone\r\n            <\/td>\r\n            <td>\r\n                <select id=\"dspTimeZoneDropDown\" class=\"dspRequired\">\r\n                    <option>Select<\/option>\r\n                    <option value=\"Pacific\">Pacific<\/option>\r\n                    <option value=\"Mountain\">Mountain<\/option>\r\n                    <option value=\"Central\">Central<\/option>\r\n                    <option value=\"Eastern\">Eastern<\/option>\r\n                    <option value=\"GMT\/UTC\">GMT\/UTC<\/option>\r\n                <\/select>\r\n                <input id=\"dspTimeZoneTxt\" class=\"dspTxt\" placeholder=\"Other..\" style=\"width:auto\">\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                Zayo POC\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspPOC\" class=\"dspTxt dspRequired\">\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td colspan=\"2\">\r\n                Special Security\/Access Requirements\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td colspan=\"2\">\r\n                <textarea id=\"dspAccessRequirements\" class=\"dspTxtMulti dspRequired\"><\/textarea>\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                Security Type\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspSecurityType\" class=\"dspTxt\">\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                Access Info\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspAccessInfo\" class=\"dspTxt\">\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                Access Restrictions\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspAccessRestrictions\" class=\"dspTxt\">\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                Advanced Notice\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspAdvanceNotice\" class=\"dspTxt\">\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                Site Comments\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspSiteComments\" class=\"dspTxt\">\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                Is this a Zayo\/360\/AboveNet Site\r\n            <\/td>\r\n            <td>\r\n                <select id=\"dspZayoSite\" class=\"dspRequired\">\r\n                    <option value=\"Yes\">Yes<\/option>\r\n                    <option value=\"No\">No<\/option>\r\n                <\/select>\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td colspan=\"2\">\r\n                Equipment Location\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                TID\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspTID\" class=\"dspTxt\">\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                Floor\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspFloor\" class=\"dspTxt dspRequired\">\r\n            <\/td>\r\n        <\/tr><tr>\r\n            <td>\r\n                Cage\/Room\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspCage\" class=\"dspTxt\">\r\n            <\/td>\r\n        <\/tr>\r\n        \r\n        <tr>\r\n            <td>\r\n                Rack\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspRR\" class=\"dspTxt\">\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                Shelf\/Slot\/Port\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspPort\" class=\"dspTxt\">\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td colspan=\"2\">\r\n                Description of work or trouble:\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td colspan=\"2\">\r\n                <textarea id=\"dspWork\" class=\"dspTxtMulti dspRequired\" style=\"margin: 0px; width: 483px; height: 58px;\"><\/textarea>\r\n            <\/td>\r\n        <\/tr><tr>\r\n            <td colspan=\"2\">\r\n                Tools\/Spares Needed\r\n        <\/td><\/tr>\r\n        <tr rowspan=\"3\">\r\n            <td colspan=\"2\">\r\n                <textarea id=\"dspTools\" class=\"dspTxtMulti dspRequired\" style=\"\r\n    width: -webkit-fill-available;\r\n\"><\/textarea>\r\n            <\/td>\r\n        <\/tr>\r\n        \r\n\r\n        \r\n            \r\n    <\/tbody>\r\n<\/table>\r\n<table class=\"dspHiddenText\">\r\n    <tbody class=\"dspHiddenText\">\r\n        <tr>\r\n            <td>\r\n                 <textarea id=\"dspHiddenText\" class=\"dspHiddenText\" rows=\"50\" cols=\"50\" style=\"display: none;\"><\/textarea>\r\n            <\/td>\r\n        <\/tr>\r\n    <\/tbody>\r\n<\/table>\r\n<input type=\"button\" value=\"Generate Dispatch Template\" id=\"dspGenerateButton\" style=\"display: block;\">\r\n<input type=\"button\" value=\"Copy to Clipboard\" id=\"dspCopyButton\" style=\"display: none;\">\r\n    \r\n    \r\n    \r\n    \r\n    \r\n    <\/body><\/html>";
        dspWindow.onunload = function () {
            dspWindowOpen = false;
        };

        dspWindow.resizeTo(600,800);
        dspWindow.resizeTo(dsp("dspTemplateTable").offsetWidth + 50, dspWindow.document.body.scrollHeight + 100);
        dspWindow.document.title = "Dispatch - " + document.title;
        dsp("dspType").onchange = function () {
            if (dsp("dspType").value == "Scheduled"){
                dsp("dspScheduledTime").parentElement.parentElement.style.display = "";
            }else{dsp("dspScheduledTime").parentElement.parentElement.style.display = "none";
                 };
        };
        dsp("dspAddress").value = tblData[clickedRow][colAddress];
        dsp("dspTypeOfWork").value = "Troubleshooting";
        dsp("dspPOC").value = GM_getValue("xlrScriptDispatchPOC", "")
        dsp("dspTID").value = tblData[clickedRow][colTID].replace("<","(AKA ").replace(">",")");
        dsp("dspCage").value = tblData[clickedRow][colAddtLocInfo].trim();
        dsp("dspRR").value = tblData[clickedRow][colEquipFacility];
        dsp("dspPort").value = formattedPort(tblData[clickedRow][colPort]);
        dsp("dspTools").value = "An assortment of fiber jumpers\r\nAn assortment of attenuators\r\nA fiber cleaning kit\r\nLight\/power meter\r\nRFC Test set\r\nOTDR";
        dsp("dspGenerateButton").onclick = function () {
            GM_setValue("xlrScriptDispatchPOC", dsp("dspPOC").value)
            dsp("dspTemplateTable").style.display = "none";
            dsp("dspHiddenText").style.display = "unset";
            dsp("dspCopyButton").style.display = "unset";
            dsp("dspGenerateButton").style.display = "none";


            var template = "";
            template += "<mark>DISPATCH REQUEST<\/mark>";
            template += "\r\n";
            template += "> Trouble Ticket Number: " + dsp("dspTTN").value;
            template += "\r\n";
            template += "> Dispatch Type: " + dsp("dspType").value;
            template += "\r\n";
            template += "> Address: " + dsp("dspAddress").value;
            template += "\r\n";
            template += "> Type of work: " + dsp("dspTypeOfWork").value;
            template += "\r\n";
            if (dsp("dspType").value == "Scheduled"){
                template += "> Scheduled Date/Time: " + dsp("dspScheduledTime").value + "\r\n";};
            template += "> Time Zone: ";
            if (dsp("dspTimeZoneDropDown").value == "Select"){
                template += dsp("dspTimeZoneTxt").value;
            } else {
                template += dsp("dspTimeZoneDropDown").value
            };
            template += "\r\n"
            template += "> Zayo POC: " + dsp("dspPOC").value + "(NOC 866-236-2824 Opt 1)";
            template += "\r\n";
            template += "> Special Security/Access Requirements: ";
            if (dsp("dspAccessRequirements").value == ""){
                template += "None"
            } else {
                template += dsp("dspAccessRequirements").value;
            };
            template += "\r\n";
            if (dsp("dspSecurityType").value !== ""){template += "> Security Type: " + dsp("dspSecurityType").value + "\r\n"};
            if (dsp("dspAccessInfo").value !== ""){template += "> Access Info: " + dsp("dspAccessInfo").value + "\r\n"};
            if (dsp("dspAccessRestrictions").value !== ""){template += "> Access Restrictions: " + dsp("dspAccessRestrictions").value + "\r\n"};
            if (dsp("dspSiteComments").value !== ""){template += "> Site Comments: " + dsp("dspSiteComments").value + "\r\n"};
            template += "> Is this a Zayo/360/AboveNet Site: " + dsp("dspZayoSite").value;
            template += "\r\n";
            template += "\r\n";
            template += "> Equipment Location: ";
            template += "\r\n";
            template += "> TID: " + dsp("dspTID").value;
            template += "\r\n";
            template += "> Floor: " + dsp("dspFloor").value;
            template += "\r\n";
            template += "> Cage/Room: " + dsp("dspCage").value;
            template += "\r\n";
            template += "> Rack: " + dsp("dspRR").value;
            template += "\r\n";
            template += "> Shelf/Slot/Port: " + dsp("dspPort").value;
            template += "\r\n";
            template += "\r\n";
            template += "> Description of work or trouble:"
            template += "\r\n";
            template += dsp("dspWork").value;
            template += "\r\n";
            template += "\r\n";
            template += "> Tools/Spares Needed:";
            template += "\r\n";
            template += dsp("dspTools").value;
            dsp("dspHiddenText").value=template;
        };

        dsp("dspCopyButton").onclick = function () {
            dsp("dspHiddenText").select(); //select all the text in the search field
            dspWindow.document.execCommand("copy"); //Copy the selected text to the clipboard

            dsp("dspTemplateTable").style.display = "unset";
            dsp("dspHiddenText").style.display = "none";
            dsp("dspGenerateButton").style.display = "unset";
            dsp("dspCopyButton").style.display = "none";
        };

        function dsp (el){
            return dspWindow.document.getElementById(el);
        };
    };
    function addClassName (className, column){
        for (i =0; i < tblLength; i++){
            tblHTML.rows[i+1].cells[column].className = className;
        };
    };

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Functions to modify the XLR page data
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function addFacilitiesLink () {
        var rows = returnAllRowsWith("Facility", colConnectivityType);
        for (i = 0; i < rows.length; i++){
            var facility = sanitizeCID(tblData[rows[i]][colEquipFacility]);
            var xlrLink = "http://xlr.zayo.com/CircuitInfo/CircuitLayoutRecord.aspx?circuitID="; //base URL for the search Function
            xlrLink = xlrLink.concat(facility); //add the facility to the end of the URL
            var linkText = "XLR"; //What we want the text to say
            tblHTML.rows[rows[i]+1].cells[colFNI].innerHTML = linkText.link(xlrLink);
        };
    };

    function addNCCLink() {
        var rowsWithPorts = returnAllRowsWith("Physical Port", colConnectivityType).concat(returnAllRowsWith("Logical Port", colConnectivityType));
        var actionableRows = [] //2-dimensional array,  [rowIndex, ]

        //Filter out rows with ports that don't have TIDs
        for (i = 0; i < rowsWithPorts.length; i++){
            if (tblData[rowsWithPorts[i]][colTID] !== "") {
                actionableRows.push([rowsWithPorts[i], tblData[rowsWithPorts[i]][colTID]]);
            };
        };

        //Do something
        for (i = 0; i < actionableRows.length; i++){
            var nccLink = "https://ncctool.zayo.us/index.php?-table=node_data&-search="; //base URL for the search Function
            nccLink = nccLink.concat(formattedTID(actionableRows[i][1])); //add the facility to the end of the URL
            var linkText = "NCC"; //What we want the text to say
           // tblHTML.rows[rows[i]+1].cells[colFNI].innerHTML = linkText.link(nccLink);

            //tblHTML.rows[allRowsWithTIDs[i][0]+1].cells[colFNI].innerText = formattedTID(allRowsWithTIDs[i][1]);
            tblHTML.rows[actionableRows[i][0]+1].cells[colFNI].innerHTML = linkText.link(nccLink);

        };
    };

    function cleanUpIPs () {

        var rowsWithIPAddresses = []
        //First, lets get all of the rows with IP Addresses in them
        for (i = 0; i < tblLength; i++){ //Iterate through each row
            if (tblData[i][colIPAddress] !== ""){ //If the row has data in the IP Address Column
                rowsWithIPAddresses.push([i,tblData[i][colIPAddress]]); //Then add it to the list in format [rowIndex, IPAddressData]
            };
        };

        //Next, lets' figure out which IP Addresses are bad, and do something about the ones that are
        for (i = 0; i < rowsWithIPAddresses.length; i++){ //Iterate through each IP Address
            var IP = rowsWithIPAddresses[i][1].trim();
            if (isValidIP(IP) == false){ //If the IP Address is invalid


                //Hooray for nested IF statements that I will never understand when I'm done writing this. Let's hope I never have to fix it
                //Okay, so I did end up needing to fix this, so I guess I'd better comment this shiz
                //The XLR tool outputs a ton of invalid IP addresses. Some of them are easy to guess, others have multiple options. Here we try to fix the easiest problems first before moving on. I'll list possible scenarios and their solutions

                //Scenario #1: The IP address is nothing but numbers, and 12 characters long. Here we can presume that the IP address can be simply "123123123123" and is just missing decimals in all the right spots
                //Solution #1: Put the decimals in all the right spots (expected input = "123123123132", expected output "123.123.123.123")
                if (IP.length == 12 && IP.search(" ") < 0){ //If it's got 12 numbers then we've got soemthing like "192168255255" and we know exactly where the decimals need to go
                    var chars = Array.from(IP); // Create array of characters from teh string. ie ["1", "9", "2", "1", "6", "8", "2", "5", "5", "2", "5", "5"]
                    var newIP = ""
                    chars.splice(3,0,".");
                    chars.splice(7,0,".");
                    chars.splice(11,0,".");
                    newIP = chars.join("");
                    IP = newIP;

                //Scenario #2: The IP address contains spaces where decimals should be. IE "123 123 123 123"
                //Solution #2: Replace all the spaces with decimals
                } else if (IP.search(" ") >= 0) { //If the IP address has spaces, we can reasonably assume that there's an octet on either side and the spaces need to be decimals
                    while (IP.search(" ") >= 0 || IP.search(/\d\.\.\d/) >= 0){ //While the IP address has spaces, or double decimals
                        IP = IP.replace(" ", "."); //Replace the spaces with decimals
                        IP = IP.replace("..","."); //Replace the double decimals with single decimals
                    };
               //Scenario #3: The IP address may contain spaces and may contain decimals, but none of the criteria for solution #1 are met, and solution #2 does not resolve the issue. (ie "10 64 12845" or "10 64 1245")
               //Solution #3: Run solution number 2, and start adding decimals where it makes sense. Many will be unfixable. If it unfixable, we will stop guessing and mark it invalid
               //Solution #3 continued: For example, "10 64 12845" after solution #2 will become "10.64.12845" and there is only one decimal missing. There's only place we can put it and keep the octects below 255
               //Solution #3 continued: However, "10 64 1245" after solution #2 will become "10.64.1245" and there is only one decimal missing. The decimal could go in one of 2 different places and still be valid. It could become "10.64.1.245", "10.64.12.45", or "10.64.124.5" and still be a valid IP
               //Solution #3 continued: We will only attempt solution 3 if and only if we're trying to guess a double octet. Mostly because it gets really confusing otherwise, and the likelyhood of more than 1 IP being possible with a triple-octet-mashup increases exponentially
                    if (isValidIP(IP) == false){ //If primitive methods don't work, lets start guessing. If we can guess more than one valid IP, then we'll stop trying.
                        var octets = IP.split("."); //Create array of octets (ie "123.123.123123" becomes ["123', "123", "123123"])
                        var totalValidOctets = getValidOctets(octets);

                        for (j = 0; j < octets.length; j++){ //Iterate through our array (ie ["123', "123", "123123"])
                            if (isValidOctet(octets[j]) == false){ //If we get to a "bad" octet (ie "123123")
                                var possibleOctets = [];
                                if (totalValidOctets == 2){
                                    possibleOctets = calculateDualOctets(octets[j]); //Calculate the possible enumarations. This function returns a max of 2 octet sets
                                    if (possibleOctets.length == 1){
                                        octets.splice(j, 1, possibleOctets[0][0], possibleOctets[0][1]); //Change our bad octet to two good octets (ie ["123', "123", "123123"] becomes ["123', "123", "123", "123"])
                                        IP = octets.join("."); //Join our array back together as a string (ie ["123', "123", "123", "123"] becomes "123.123.123.123")
                                    };
                                }else if (totalValidOctets == 1){
                                    possibleOctets = calculateTripleOctets(octets[j]);
                                    if (possibleOctets.length == 1){
                                        octets.splice(j, 1, possibleOctets[0][0], possibleOctets[0][1], possibleOctets[0][2]); //Change our bad octet to two good octets (ie ["123', "123", "123123"] becomes ["123', "123", "123", "123"])
                                        IP = octets.join("."); //Join our array back together as a string (ie ["123', "123", "123", "123"] becomes "123.123.123.123")
                                    };


                                };
                            };
                        };
                    };
               //Scenario #4: None of the above solutions work, and things are looking pretty grim
               //Solution #4: Similar to solution #3, we convert the whole mess to one long string of numbers without spaces, and iterate through every possible permutation of decimal points, and just hope there's only 1 match
               //Solution #4: But don't worry, that's what thermal throttling is for
                    if (isValidIP(IP) == false){
                        possibleOctets = calculateAllOctets(IP.replace(/[.]/g, ""));
                        if (possibleOctets.length == 1){
                            IP = possibleOctets[0].join(".");
                        };
                    };
                };

                //One last final check, in case something went wrong
                if (isValidIP(IP) == true){
                    tblHTML.rows[rowsWithIPAddresses[i][0]+1].cells[colIPAddress].innerText = IP;
                    tblHTML.rows[rowsWithIPAddresses[i][0]+1].cells[colIPAddress].style.fontStyle = "italic";
                } else {
                    tblHTML.rows[rowsWithIPAddresses[i][0]+1].cells[colIPAddress].style.color = "red";
                };
            };
        };
    };

    function addXLRWildCardSearch () {
        $("btnFindCircuitDesignID").onclick = function() {
            var circuitID = $("form1").elements[2].value; //XLR has a form called "form1" which includes all inputs on the page. Element 2 is the CID field. This gets the value in that field and assigns it to a variable
            circuitID = circuitID.replace(/\\/g, "/"); //use regex to replace all "\" with "/"
            circuitID = circuitID.replace(/(\/)/g, "%"); //use regex to replace all "/" with "%"
            circuitID = circuitID.replace(/( )/g, ""); //use regex to delete all spaces (" ")
            circuitID = circuitID.replace(/\t/g, ""); //use regex to delete all tabs "	"
            while (circuitID.search("%%") >= 0){
                circuitID = circuitID.replace("%%", "%");
            };
            $("txtCircuitID").value = circuitID //insert the modified text into the text box and proceed with submitting form
        };
    };

    function addPreviousCLRButton () {
        var btnRetrieveLastCLR = document.createElement("input");
        btnRetrieveLastCLR.type = "button";
        btnRetrieveLastCLR.id = "btnRetrieveLastCLR";
        btnRetrieveLastCLR.value = "Previous CLR";
        btnRetrieveLastCLR.onclick = function () {
            var currentVerision = parseInt(document.getElementsByTagName("td")[12].innerText);
            $("txtVersionNumber").value = currentVerision -1;
            $("btnRetrieveAlternateVersion").click();
        };
        $("pnlVersionSelection").appendChild(btnRetrieveLastCLR);
    };

    function addActionIcons () {
        tblHTML.rows[0].cells[colDesignAction].style.width = "80px";
        for (var i = 0; i < tblLength; i++){
            var options = updateMenuOptions(i);
            options = iconOptionsEnabled(options);
            var image;
            var imageElementId;
            for (var j = 0; j < options.length; j++){
                imageElementId = i.toString().concat("x", j);
                image = new Image();
                //image = document.createElement("img");
                image.id = imageElementId;
                image.setAttribute("row", i);
                image.setAttribute("action", options[j]);
                image = styleImage(image);
                switch (options[j]){
                    case "Copy TID/Port":
                        image.src = icnPortSrc;
                        break;
                    case "Google Maps":
                        image.src = icnMapSrc;
                        break;
                    case "Dispatch":
                        image.src = icnDispatchSrc;
                        break;
                    case "Copy Info":
                        image.src = icnCopySrc;
                        break;
                };
                image.onclick = iconClickHandler;
                tblHTML.rows[i+1].cells[colDesignAction].appendChild(image);
                //$(imageElementId).addEventListener("click", iconClickHandler);
            };
            image = new Image();
            image.setAttribute("row", i);
            image.setAttribute("action", "menu");
            image.src = icnMenuSrc;
            image = styleImage(image);
            tblHTML.rows[i+1].cells[colDesignAction].appendChild(image);
        };
    };

    function addActionsToIcons () {
        var images = document.getElementsByTagName("img");
        for (i = 0; i < images.length; i++){
            images[i].onclick = iconClickHandler;
        };
    };

    function styleImage (image) {
        image.setAttribute("width", "16");
        image.setAttribute("height", "16");
        image.style.display = "inline-block";
        image.style.paddingLeft = "3px";
        return image;
    };

    function iconClickHandler (eventArgs){
        clickedRow = parseInt(eventArgs.path[0].getAttribute("row"));
        ctxMenuAction(eventArgs.path[0].getAttribute("action"))
        console.log("Row: ", clickedRow, "\r\n", eventArgs);
    };

    function addCopyOnTripleClick () {
        for (var i =0; i < tblLength; i++){
            for (var j = 0; j < rowLength; j++){
                tblHTML.rows[i+1].cells[j].onclick = copyOnTripleClickHandler;
            };
        };
    };

    function copyOnTripleClickHandler (eventArgs){
        if (eventArgs.detail == 3) { //If this is a triple click
            var clickedElement = eventArgs.path[0]
            var initialText = clickedElement.innerText;
            addToClipboard(initialText.trim());
            clickedElement.innerText = "✔️";
            window.setTimeout(resetText, 250);
            function resetText () {
                clickedElement.innerText = initialText;
            };
        };
    };
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Helper Functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function $ (element){
        return document.getElementById(element);
    };

    function fetchCIDFromURL(){
        var circuitStart = pageURL.indexOf("circuitID=") + 10; //figure out where our CID starts
        if (circuitStart < 49){ //this is more "idiot light" logic than it is real checking to see if we actually have a CID in that variable
            var dirtyCID = pageURL.slice(circuitStart, pageURL.length); //extract the CID from the browser's URL, +'s and %'s included
            var cleanCID = decodeURIComponent(dirtyCID); //get rid of all of those pesky %20s and other URL encoded characters to human-readable form
            cleanCID = cleanCID.replace(/\+/g, ""); //get rid of all of the + signs put there by SimpleSelectSearch, should it be used
            cleanCID = sanitizeCID(cleanCID);
            return cleanCID;
        };
    };

    function returnAllRowsWith (searchString, searchColumn){ //Returns type Array with indexes of rows that match the criteria. Note: it does not return the data in any cell and that all data in tblHTML will be off by 1 (tblData row 1 = tblHTML row 2)
        var rows = [];
        for (i = 0; i < tblLength; i++){
            if (tblData[i][searchColumn] == searchString){
                rows.push(i);
            }
        };
        return rows;
    };

    function formattedTID (tid){
        var tidSpecialCharacterLocation = tid.search(/[^abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890]/g, 0); //some TIDs have legacy TIDs or additional information. This uses regex to find the first position of a non-alpanumeric character. Later we will extract (Split) the text starting at the begining, and ending at the first non-alphanumeric character
        if (tidSpecialCharacterLocation == 0){ //Some (very few) TID cells will have special characters at the begining. If they do, we slice off the first character and proceed
            tid = tid.slice(1,tid.length);
            tidSpecialCharacterLocation = tid.search(/[^abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789]/g, 0);
        };
        return tid.slice(0, tidSpecialCharacterLocation); //Extract the TID from the TID's table cell
    };

    function sanitizeCID (CID) {
        CID = CID.trim();
        if (CID.charAt(0) == "\/"){
            CID = CID.slice(1, CID.length)
        };
        return CID;
    };

    function hideColumn (index) {
        for (i = 0; i < tblLength + 1; i++){
            tblHTML.rows[i].cells[index].style.display = "none";
        };
    };

    function isValidIP (IPAddress) {
        //Regex courtesy of https://www.w3resource.com/javascript/form/ip-address-validation.php
        if (IPAddress !== "" && IPAddress.search(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/) >= 0){
            return (true);
        };
        return (false);
    };

    function isValidOctet (octet){
        if (parseInt(octet) >= 0 && parseInt(octet) <= 255 && octet.charAt(0) !== "0"){
            return true;
        };
        return false;
    };

    function getValidOctets (octets) {
        var total = 0;
        for (var k = 0; k < octets.length; k++){
            if (isValidOctet(octets[k])){
                total++
            };
        };
        return total;
    };

    function addDecimal (string, position){
        string = string.slice(0, position) + "." + string.slice(position, string.length);
        return string;
    };

    function isValidOctetArray (octetArray) {
        for (var currentOctet = 0; currentOctet < octetArray.length; currentOctet++){
            if (isValidOctet(octetArray[currentOctet]) == false){
                return false;
            };
        };
        return true;
    };
    function calculateDualOctets(badOctet){
        var possibleOctets = []
        for (var pos = 1; pos < badOctet.length; pos ++){ //Iterate through the string, moving the decimal point over over each iteration and checking to see if the result is valid
            var currentAttempt = addDecimal(badOctet, pos);
            currentAttempt = currentAttempt.split("."); // Convert to array of possible octets (ie  ["1", "23123"])
            console.log(currentAttempt);
            if (isValidOctetArray(currentAttempt) == true){ //If our work did  anyting worthwhile
                possibleOctets.push([currentAttempt[0], currentAttempt[1]]); //Add it to the list of possible octets
            };
            if (possibleOctets.length == 2){
                return possibleOctets; //No sense in returning more than 2, since we can't display more than 1 IP address to the user
            };
        };
        return possibleOctets;
    };

    function calculateTripleOctets(badOctet){
        var possibleOctets = []
        for (var pos1 = 1; pos1 < badOctet.length - 3; pos1 ++){ //Iterate through the string, moving the decimal point over over each iteration and checking to see if the result is valid
            for (var pos2 = pos1 +2; pos2 < badOctet.length + 1; pos2++){
                var currentAttempt = addDecimal(badOctet, pos1); //Add first decimal (ie "20913340" becomes "2.0913340"
                currentAttempt = addDecimal(currentAttempt, pos2); //Add second decomal (ie "2.0913340" becomes "2.0.913340"
                currentAttempt = currentAttempt.split("."); // Convert to array of possible octets (ie  ["1", "231", "23"])
                //console.log(currentAttempt);
                if (isValidOctetArray(currentAttempt) == true){ //If our work did  anyting worthwhile
                    possibleOctets.push([currentAttempt[0], currentAttempt[1], currentAttempt[2]]); //Add it to the list of possible octets
                };
                if (possibleOctets.length == 2){
                    return possibleOctets; //No sense in returning more than 2, since we can't display more than 1 IP address to the user
                };
            };
        };
        return possibleOctets;
    };

    function calculateAllOctets(badOctet){
        var possibleOctets = []
        for (var pos1 = 1; pos1 < badOctet.length - 3; pos1 ++){ //Iterate through the string, moving the decimal point over over each iteration and checking to see if the result is valid
            for (var pos2 = pos1 +2; pos2 < badOctet.length + 1; pos2++){
                for (var pos3 = pos2 +2; pos3 < badOctet.length +2; pos3++){
                    var currentAttempt = addDecimal(badOctet, pos1); //Add first decimal (ie "2091334040" becomes "2.091334040"
                    currentAttempt = addDecimal(currentAttempt, pos2); //Add second decomal (ie "2.091334040" becomes "2.0.91334040"
                    currentAttempt = addDecimal(currentAttempt, pos3); //Add second decomal (ie "2.0.91334040" becomes "2.0.9.1334040"
                    currentAttempt = currentAttempt.split("."); // Convert to array of possible octets (ie  ["1", "231", "23"])
                    //console.log(currentAttempt);
                    if (isValidOctetArray(currentAttempt) == true){ //If our work did  anyting worthwhile
                        //console.log(currentAttempt);
                        possibleOctets.push(currentAttempt); //Add it to the list of possible octets
                    };
                    if (possibleOctets.length == 2){
                        return possibleOctets; //No sense in returning more than 2, since we can't display more than 1 IP address to the user
                    };
                };
            };
        };
        console.log(possibleOctets.length);
        return possibleOctets;
    };

    function getPosition(e) {
        //Courtesy of Nick Salloum https://www.sitepoint.com/building-custom-right-click-context-menu-javascript/
        var posx = 0;
        var posy = 0;

        if (!e) var
        e = window.event;

        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
        }

        return {
            x: posx,
            y: posy
        }
    };

    function clearMenu () {
        while ($("ctxMenu").firstElementChild.rows.length > 0){
            $("ctxMenu").firstElementChild.deleteRow(0);
        };
    };

    function formattedPort (port) {
        port = port.trim()
        port = port.toUpperCase();
        port = port.replace("TX","")
        port = port.replace("RX","")
        port = port.replace("--", "-");
        port = port.trim();
        if (port.charAt(port.length-1) == "-"){
            port = port.slice(0, port.length - 1)
        };
        return port;
    };
    function addToClipboard (copyText) {
        var initialText = $("txtCircuitDesignID").value;
        $("txtCircuitDesignID").value = copyText; //typically, you'd want to create a hidden text field and put the text to be coppied into it, but I don't see the point. This just puts it in the search field at the top of the page
        $("txtCircuitDesignID").select(); //select all the text in the search field
        document.execCommand("copy"); //Copy the selected text to the clipboard
        $("txtCircuitDesignID").value = initialText; //Clear the search box at the top, like it never happened
    };


    function iconOptionsEnabled (optionList) {
        return ["Copy TID/Port", "Google Maps", "Dispatch"];
    };
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Collapsed Tool Functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function collapsedToolHandler () {
        addBulkCompareButton();
        circuitSearchData = [0,0];
        //circuitSearchList = ["OQYX/262159", "fasdfasdfasdfd", "OGYX/165469"];
        //var searchBar = $("circuit-search");
        //loadCIDs(searchBar);

    };

    function addBulkCompareButton () {
        var btnBulkCompare = document.createElement("input");
        btnBulkCompare.type = "button";
        btnBulkCompare.id = "btnBulkCompare";
        btnBulkCompare.value = "Bulk Compare";
        btnBulkCompare.className = "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only";
        btnBulkCompare.style.width = "auto";
        btnBulkCompare.onclick = function () {
            launchBulkCompareWindow();
        };
        document.getElementsByClassName("ui-widget")[0].appendChild(btnBulkCompare);
    };

    function launchBulkCompareWindow () {
        clpBulkWindow = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes");
        clpBulkWindow.document.body.innerHTML = "<html><head><title>Bulk Collapsed Tool Compare<\/title>\r\n    \r\n    <style type=\"text\/css\">\r\n        .:active{\r\n            box-shadow: 0 0 2px 0px black;\r\n        }\r\n        th{\r\n            text-align: center;\r\n            font-weigth: bold;\r\n        }\r\n        table, td, tr, input{\r\n            width:100%;\r\n        }\r\n        textarea{\r\n            width: 100%;\r\n            rows: 20;\r\n           -webkit-box-sizing: border-box;\r\n           -moz-box-sizing: border-box;\r\n           box-sizing: border-box;\r\n        }\r\n        .button{\r\n            width: auto;\r\n            background: #e6e6e6 url(images\/ui-bg_glass_75_e6e6e6_1x400.png) 50% 50% repeat-x;\r\n            border-radius: 4px;\r\n        };\r\n        .inputs{\r\n            display: unset;\r\n        }\r\n        .results{\r\n            display: none;\r\n        };\r\n    <\/style>\r\n<\/head>\r\n    <body>\r\n         <table class=\"input\">\r\n                <tbody><tr>\r\n                    <th>\r\n                            Bulk Collapsed Tool Compare\r\n                    <\/th>\r\n                    \r\n                <\/tr>\r\n                <tr>\r\n                    <td>\r\n                        Each line represents a single circuit ID\r\n                    <\/td>\r\n                <\/tr>\r\n                <tr>\r\n                    <td>\r\n                        <textarea id=\"collapsedBulkTxtArea\" rows=\"20\"><\/textarea>\r\n                    <\/td>\r\n                <\/tr><tr>\r\n                    <td>\r\n                        Facility to compare against:\r\n                    <\/td>\r\n                <\/tr>\r\n                \r\n                <tr>\r\n                    <td>\r\n                        <input id=\"collapsedFacility\" placeholder=\"102  \/FIBER \/BOISIDWKIF1\/SLKDUTTXIF1\">\r\n                <\/td><\/tr><tr>\r\n                    <td>\r\n                        <input type=\"button\" value=\"Compare\" id=\"btnCollapsedCompare\" class=\"button\">\r\n                    <\/td>\r\n                <\/tr>\r\n        <\/tbody><\/table>\r\n    <table class=\"results\">\r\n    <tbody>\r\n        <tr>\r\n            <th>\r\n                Results\r\n            <\/th>\r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                <textarea id=\"collapsedReults\"><\/textarea>\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                <input type=\"button\" value=\"Requery Failures\" id=\"btnCollapsedRetry\" class=\"button\">\r\n                <input type=\"button\" value=\"Change Faclity\" id=\"btnChangeFacility\" class=\"button\">\r\n                <input type=\"button\" value=\"Back\" id=\"btnCollapsedBack\" class=\"button\">\r\n                \r\n            <\/td>\r\n        <\/tr>\r\n<\/tbody><\/table>\r\n<\/body><\/html>";

        clpBulkWindow.resizeTo(clp("collapsedFacility").offsetWidth + 50, clpBulkWindow.document.body.scrollHeight + 100);
        clp("btnCollapsedCompare").onclick = function () {
            parseBulkInput(clpBulkWindow);
        };

        function clp(elementID){
            return clpBulkWindow.document.getElementById(elementID);
        };
    };
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Collapsed Tool - Helper Functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function createKeyEvent (keycode){
        var keyboardEvent = document.createEvent("KeyboardEvent");
        var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
        keyboardEvent[initMethod]("keydown", true, true, document.defaultView, false, false, false, false, keycode, 0);
        return keyboardEvent;
    };

    function parseBulkInput (window){
        var bulk = window.document.getElementById("collapsedBulkTxtArea").value;
        bulk = bulk.split("\n"); //Convert to array of strings, each item being a line

        for (i = 0; i < bulk.length; i++){
            bulk[i] = bulk[i].trim();
            bulk[i] =
            bulk[i] = bulk[i].replace("\/ \/ZYO", "");
            bulk[i] = bulk[i].replace("\/\/ZYO", "");
            if (bulk[i] == ""){
                bulk.splice(i,1);
                i--
            };
        };

        console.log("Circuit Search List: " + bulk);
        circuitSearchList = bulk;
        loadCIDs($("circuit-search"));
    };

    function compareOutput (input, facility){
        var matches = [];
        var noMatch = [];
        var errInvalidInput = []//circuitSearchData[4];
        var errOutputIntegrity = [];
        var outputRaw = document.getElementsByClassName("circuit-root");
        var outputData = cleanupOutput(outputRaw);
        var results = "";

        facility = facility.replace(/\s/g, ""); //Remove All Whitespace

        for (var i = 0; i < input.length; i++){
            var inputCID = input[i][0];
            var inputResult = input[i][1]
            if (inputResult == "error"){
                //
            } else if (noWhiteSpace(inputResult.innerText).search(facility) > 0) {
                matches.push(inputCID);
            } else if (noWhiteSpace(inputResult.innerText).search("null") >= 0) {
                errOutputIntegrity.push(inputCID)
            } else {
                noMatch.push(inputCID);
            };
        };

        let br = "\r\n";
        results = results.concat("Matches:", br, matches.join(br), br, br, "Failed to find match:", br, noMatch.join(br), br, br, "Failure to query CID:", br, errInvalidInput.join(br), br, br, "Failure due to integrity of page data:", br, errOutputIntegrity.join[br]);
        console.log(results);

        return results;
    };

    function collapseSanitizeCID (input){
        input = input.trim()
        input = input.replace("ZYO", "");
        //input = input.
    };

    function loadCIDs(searchBar) {
        //This is our "main loop" to load the CIDs, regardless of how many there are
        //This isn't very straightforward because we're using a computer to interact with a tool made for humans
        //The Collapsed Tool listens for human input into the search box, and generates a list of matching results. It then waits for further human input to add it to the list

        //How this works: First, we need a global variable (I know...I tried not to) to store a few bits of data in. Namely the circuit ID's we're searching for [circuitSearchList] and various things to keep the async functions going [circuitSearchData]
        //circuitSearchData[] contains info for the Async observer, Async Internal timer, as well as the current count (i), a list of circuits we were unable to find, and other useful info
        //First we check to see if we're on the either the first or last run of this function. If the first, we initialize the data. If the last, we destroy the data and stop recurrences
        //During normal operation, we autofill the search bar with our query, create a "human interaction" of a keyboard stroke, and then fire an Observer (startObserving() function). The Observer waits for the page to update with a list, and then clicks the response
        //Immediately prior to firing the Observer, we also create a Interval Timer (function searchTimeOutObserver()) that cancels the query if it's taking to long. The timeout for this is set in circuitSearchData[2], and the Timer checks ever 1/10th of a second. At time of writing, the timeout default is 2seconds

        if (circuitSearchList.length == 0 || circuitSearchData[0] >= circuitSearchList.length){ //If we're on the last iteration
            window.clearInterval(circuitSearchData[3])
            $("compare-button").click();
            compareOutput(circuitSearchList, clpBulkWindow.document.getElementById("collapsedFacility").value);
            circuitSearchList = [];
            return;
        }else if (circuitSearchData[0] == 0){//If this is the first iteration
            circuitSearchData = [
                0, //         [0] =  i (int)
                Date.now(), //[1] = timeOfLastIteration (int)
                2000, //      [2] = timeOut (1/1000ths of a second, or miliseconds) (int)
                0, //         [3] = setIntervalID (int)
                [], //        [4] = [erroredCircuits] (["string", "array"])
                , //          [5] = observer (MutationObserver Object)
                false,//      [6] = isRunning (bool)
                 //           [7] = isBulkCompare (bool)
                ];
            circuitSearchData[3] = window.setInterval(searchTimeOutObserver, 100);
        };

        var downKeyEvent = createKeyEvent(40);

        $("circuit-search").value = circuitSearchList[circuitSearchData[0]]; //Place the current query in the search box

        circuitSearchData[0]++ //This is effectively our "i" counter in a global variable
        circuitSearchData[1] = Date.now(); //Set the start time of this iteration
        circuitSearchData[5] = new MutationObserver(observationHandler); //Create a MutationObserver to start checking for results to be displayed on the page

        searchBar.dispatchEvent(downKeyEvent);
        startObserving();

        function startObserving () {
            //var observer = new MutationObserver(observationHandler);
            var observerOptions = {childList: true};
            circuitSearchData[5].observe($("ui-id-1"),observerOptions);
        };

        function observationHandler (mutations) { //This is fired everytime there's a mutation to the list of results
            circuitSearchData[5].disconnect(); //Stop observing
            document.getElementsByTagName("a")[0].click(); //Click on the first result, adding it to the compare list
            circuitSearchList[circuitSearchData[1]-1] = [circuitSearchList[circuitSearchData[0]] , document.getElementsByTagName("p")[document.getElementsByTagName("p").length -1]]; //Add a second dimension to our circuitSearchList array, where it is now [input, element]
            loadCIDs($("circuit-search")); //Carry on with the next one

        };
    };

    function searchTimeOutObserver () {
        if (Date.now() - circuitSearchData[1] >= circuitSearchData[2]){ //If the time elapsed since last successful search is greated than the allowed time
            circuitSearchData[4].push(circuitSearchList[circuitSearchData[0]]); //Log the errored search attempt
            circuitSearchList[circuitSearchData[0]-1] = [circuitSearchList[circuitSearchData[0]], "error"];
            circuitSearchData[5].disconnect(); //Shut down the observer waiting for something to happen
            loadCIDs($("circuit-search")); //Carry on with the next one
        };
    };

    function cleanupOutput (elementArray) {
        var result = []
        for (var i =0; i < elementArray.length; i++){
            result.push(elementArray[i].innerText);
        };
        return result;
    };

    function noWhiteSpace (input) {
        return input.replace(/\s/g, "");
    };

})();