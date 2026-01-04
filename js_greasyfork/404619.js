// ==UserScript==
// @name         XES - XLR Enhancement Suite [native]
// @namespace    http://tampermonkey.net/
// @version      1.76
// @description  XLR Enhancement Suite
// @author       You
// @match        http://den02vmxlr03.us.corp.zayo.com/*
// @match        http://collapsed.zayo.us/*
// @match        https://ncctool.zayo.us/index.php?-table=node_data*
// @require      https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/404619/XES%20-%20XLR%20Enhancement%20Suite%20%5Bnative%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/404619/XES%20-%20XLR%20Enhancement%20Suite%20%5Bnative%5D.meta.js
// ==/UserScript==

(function() {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Variables
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //"Global" variables
    const ver = 1.76
    const verDate = "2021-02-09";
    var tblHTML;
    var tblData = [];
    var tblLength;
    var rowLength;
    var firstLoad = true;
    var loadingObserver;
    var dspWindowOpen = false;
    var tblAlarms;
    var timer;
    var clpsTool = {};
    var zDAF;
    var isIframe = false;
    var dispatchQueue = [];
    const maxDispatchRequests = 10;
    const dispatchTimeOut = 3; //seconds
    var cache;
    const maxCacheSize = 1024000 //uncompressed chars
    const fetchUrl = {nodeId : { url : "https://fetch.zayo.us:4443/v3/nodes/like/", append : ""},};
    // Column Constants
    const colBlockInd = 0;
    const colSeq = 1;
    const colCLLI = 2;
    const colAddress = 3;
    const colAddtLocInfo = 4;
    const colConnectivityType = 5;
    const colCategory = 6;
    const colProductGroup = 7;
    const colTID = 8;
    const colEquipFacility = 9;
    const colPort = 10;
    const colFNI = 11;
    const colIPAddress = 12;
    const colDesignAction = 13;
    //Script Sources
    //const DataTablesJSSource = "http://cdn.datatables.net/1.10.21/js/jquery.dataTables.min.js";
    const DataTablesJSSource = "https://cdn.datatables.net/v/dt/dt-1.10.23/b-1.6.5/b-colvis-1.6.5/b-html5-1.6.5/cr-1.5.3/fh-3.1.8/sb-1.0.1/sp-1.2.2/sl-1.3.1/datatables.min.js";
    //const DataTablesCSSSource = "http://cdn.datatables.net/1.10.21/css/jquery.dataTables.min.css";
    const DataTablesCSSSource = "https://cdn.datatables.net/v/dt/dt-1.10.23/b-1.6.5/b-colvis-1.6.5/b-html5-1.6.5/cr-1.5.3/fh-3.1.8/sb-1.0.1/sp-1.2.2/sl-1.3.1/datatables.min.css";
    //Icons
    const icnXES = "https://i.imgur.com/Cvi6NIy.png"
    const icnCopySrc = "https://i.imgur.com/qS2E9nC.png"
    const icnDispatchSrc = "https://i.imgur.com/g6DhElc.png"
    const icnMenuSrc = "https://i.imgur.com/3hO1HlF.png"
    const icnMapSrc = "https://i.imgur.com/Q7Ig7t0.png"
    const icnPortSrc = "https://i.imgur.com/sPrkTBa.png"
    const icnCollapseToolSrc = "https://i.imgur.com/gjadEND.png"
    const icnExpandFacilitySrc = "https://i.imgur.com/bGHhwze.png"
    const icnMinimizeFacilitySrc = "https://i.imgur.com/VT1UC9H.png"
    const icnFirsttSrc = "https://i.imgur.com/7XDriYr.png"
    const icnPreviousSrc = "https://i.imgur.com/QcbekGJ.png"
    const icnNextSrc = "https://i.imgur.com/MQ8WYCo.png"
    const icnCurrentSrc = "https://i.imgur.com/auqhP2T.png"


    //Settings
    var opt;
    var optDefaults = {
        "About": {
            type: "about",
            version: ver,
            date: verDate,
            author: "Lucas Labounty",
            changelog: "https://greasyfork.org/en/scripts/404619-xes-xlr-enhancement-suite/versions",
            enabled: true
        },
        "LookandFeel": {
            type: "section",
            description: "Look and Feel",
            enabled: true
        },
        "TitleCustomer": {
            type: "option",
            description: "Add Customer Name to window Title  (Note: XLR2 currently does not pull this information, so this feature will not work until it does)",
            enabled: true
        },
        "TitleCID": {
            type: "option",
            description: "Add Circuit ID to window Title",
            enabled: true
        },
        "HideBlockIndCol": {
            type: "option",
            description: "Hide \"Block Ind\" column",
            enabled: true
        },
        "HideStatusSection": {
            type: "option",
            description: "Hide Status section if empty",
            enabled: true
        },
        "HideDesignerSection": {
            type: "option",
            description: "Hide Designer section if empty",
            enabled: true
        },
        "MoveSearchBar": {
            type: "option",
            description: "Combine Search bar and Banner into one",
            enabled: true
        },
        "HideBanner": {
            type: "option",
            description: "Hide Zayo Banner (do not enable if also combining with Search bar)",
            enabled: false
        },
        "HighlightDisconnected": {
            type: "option",
            description: "Highligh disconnected circuits",
            enabled: true
        },
        "HighlightTSP": {
            type: "option",
            description: "Highligh TSP coded circuits (Note: XLR2 currently does not pull TSP codes, so this feature will not work until it does)",
            enabled: true
        },
        "Functionality": {
            type: "section",
            description: "Functionality",
            enabled: true
        },
        "AutoLoadOnPaste": {
            type: "option",
            description: "Auto-load circuit on paste",
            enabled: true
        },
        "NCCLinks": {
            type: "option",
            description: "Add NCC Links to the FNI column where applicable",
            enabled: true
        },
        "FetchIPs": {
            type: "option",
            description: "Resolve missing/faulty IP addresses with calls to Fetch server",
            enabled: true
        },
        "Copyontripleclick": {
            type: "option",
            description: "Copy cell contents on triple-click",
            enabled: true
        },
        "FixFacilityLinks": {
            type: "option",
            description: "Make Facility links selectable with cursor",
            enabled: true
        },
        "CollapseDropDowns": {
            type: "option",
            description: "Collapse zDaf Dropdowns",
            enabled: true
        },
        "ParseZDAF": {
            type: "option",
            description: "Parse zDAF Output",
            enabled: true
        },
        "VersionButtons": {
            type: "option",
            description: "Circuit design Verision navigation buttons",
            enabled: true
        },
        "CleanUpBeforeExport": {
            type: "option",
            description: "Uninitialize XES and zDAF prior to export",
            enabled: true
        },
        "ActionButtonsSection": {
            type: "section",
            description: "Design Action Buttons",
            enabled: true
        },
        "ActionButtons": {
            type: "option",
            description: "Action Buttons - Master Switch",
            enabled: true
        },
        "BtnCopyTidPort": {
            type: "option",
            description: "Button: Copy TID/Port/IP Address",
            enabled: true
        },
        "BtnCopyTidPortIP": {
            type: "option",
            description: "Button Option: Do not copy IP Address ",
            enabled: true
        },
        "BtnGoogleMaps": {
            type: "option",
            description: "Button: Google Maps",
            enabled: true
        },
        "BtnDispatch": {
            type: "option",
            description: "Button: Dispatch",
            enabled: true
        },
        "BtnExpandFacility": {
            type: "option",
            description: "Button: In-Line Facility Expando",
            enabled: true
        },
        "BtnCollapseTool": {
            type: "option",
            description: "Button: Collapse Tool",
            enabled: true
        },
        "BtnContextMenu": {
            type: "option",
            description: "Button: Context Menu",
            enabled: true
        },
        "hidden": {
            type: "hidden settings",
            enabled: false,
            loadOnPaste: true,
        },
    };

    verifySettings();
    determinePageType();



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Worker Bees
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function determinePageType () {
        var pageURL = window.location.href;
        if (window.location.host == "collapsed.zayo.us") {clpsToolInit()};

        if (pageURL.search("circuit=") >= 0 && pageURL.search("XES") < 0 ) {
            preInit();
            createCircuitLoadObserver();
        } else if (pageURL.search("&cmd=GET-") > 0){
            if (opt.ParseZDAF.enabled == false) {return};
            awaitOutputLoaded();
        }else if (pageURL.search("XES?") >= 0 && firstLoad == true) {
            preInit();
            var CID = (window.location.search.match(/(?<=circuit\=).*?(?=$)/) !== null) ? decodeURIComponent(window.location.search.match(/(?<=circuit\=).*?(?=$)/)[0]) : "";
            isIframe = (window.location.search.match(/(?<=iframe\=).*?(?=$)/) !== null) ? true : false;
            loadXEScircuit(CID);
        } else if (pageURL.slice(pageURL.length-3,pageURL.length) == "\/#\/") {
            preInit();
            createCircuitLoadObserver();
        };
    };

    function preInit () {
        mySpecialCSS();
        addSettingsLink();
        changeFavIcon(icnXES);
        if (opt.MoveSearchBar.enabled == true && opt.HideBanner.enabled == false) {
            moveSearchSection();
        };
        if (opt.HideBanner.enabled == true && opt.MoveSearchBar.enabled == false){
            hideBanner();
        };
        if (opt.CleanUpBeforeExport.enabled) {addCleanUpBeforeExport()};
        if (opt.AutoLoadOnPaste.enabled) {addLoadOnPaste()};
    };

    function cleanUpBeforeReInit () {
        //Get rid of elements we've added
        var XESElements = document.getElementsByClassName("XES");
        while (XESElements.length > 0){
            XESElements[0].remove();
        };

        //Unhide the elements we've hidden
        removeClassFromAllElements("XES-hidden");
        function removeClassFromAllElements (className){
            var collection = document.getElementsByClassName(className)
            for (var i = 0; i < collection.length; i++){
                collection[i].classList.remove(className);
            };
        };

        Array.from(document.getElementsByClassName("IP_ADDRESS")).forEach(function (cell, index, array) {
            cell.className = "IP_ADDRESS";
            cell.removeAttribute("title");
            cell.innerText = "";
        });
    };
    function init () {
        if (firstLoad == false) {
            cleanUpBeforeReInit();
        };
        //window.location.href = "http://den02vmxlr03.us.corp.zayo.com:8080/#?XEScid=" + document.getElementsByClassName("billing")[0].rows[1].cells[3].innerText.trim().replace(/\//g, "");
        tblHTML = document.getElementsByClassName("circuit")[0];
        //tblData = [];
        tblLength = tblHTML.rows.length;
        rowLength = tblHTML.rows[0].cells.length;
        loadtblData();

        for (var setting in opt){
            if (opt[setting].enabled == true && opt[setting].type == "option") {
                switch (setting){
                    case "TitleCustomer":
                        updateTitle();
                        break;
                    case "TitleCID":
                        updateTitle();
                        break;
                    case "HideBlockIndCol":
                        hideColumn(0);
                        break;
                    case "HideStatusSection":
                        hideStatusSection();
                        break;
                    case "HideDesignerSection":
                        hideDesignerSection();
                        break;
                    case "NCCLinks":
                        addNCCLink(colFNI);
                        if (firstLoad) {fixPortDropDowns()};
                        break;
                    case "FetchIPs":
                        cleanUpIPs();
                        break;
                    case "Copyontripleclick":
                        //Need to come back to this. No setting currently modeled for the required Context Menu
                        break;
                    case "FixFacilityLinks":
                        fixFacilityLinks();
                        break;
                    case "ActionButtons":
                        addActionIcons();
                        break;
                    case "HighlightTSP":
                        HighlightDisconnected_TSPCodedCircuits();
                        break;
                    case "HighlightDisconnected":
                        HighlightDisconnected_TSPCodedCircuits();
                        break;
                    case "VersionButtons":
                        addVersionButtons();
                        break;
                };
            };
        };
        if ((opt.Copyontripleclick.enabled == false && opt.ActionButtons.enabled == true && opt.BtnContextMenu.enabled == true) || opt.Copyontripleclick.enabled == true){
            addCopyOnTripleClick(); //This needs to be run no matter what if the Context Menu is enabled
        };

        firstLoad = false;
        if (isIframe) {iFrame()};
        //mySpecialCSS(); //Deprecated. Changes were integrated into XLR 2.0 in June 2020
        //collapseDropDowns(); //Deprecated. Feature was integrated into XLR 2.0 in July 2020
        //newURLonSubmit(); //Temporary. Code expects fresh page every time, but page is just modified with data from a server call instead
    };


    function changeFavIcon(img) {
        //Courtesy of https://codepad.co/snippet/changing-your-site-s-favicon-with-javascript
        var favicon = document.querySelector('link[rel="shortcut icon"]');
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.setAttribute('rel', 'shortcut icon');
            var head = document.querySelector('head');
            head.appendChild(favicon);
        };
        favicon.setAttribute('type', 'image/png');
        favicon.setAttribute('href', img);
    };

    function loadtblData () {
        tblData = [];
        for (var row = 0; row < tblLength; row++){
            var partialRow = [];
            for (var column = 0; column < rowLength; column++){
                partialRow.push(tblHTML.rows[row].cells[column].innerText.trim());
            };
            tblData.push(partialRow);
        };
    };

    function addNCCLink(emptyColumn) {
        var rowsWithPorts = returnAllRowsWith("Physical Port", colConnectivityType).concat(returnAllRowsWith("Logical Port", colConnectivityType)).concat(returnAllRowsWith("Ring Node", colConnectivityType));
        var actionableRows = [] //2-dimensional array,  [rowIndex, tidString]

        //Filter out rows with ports that don't have TIDs
        for (var i = 0; i < rowsWithPorts.length; i++){
            if (tblData[rowsWithPorts[i]][colTID] !== "") {
                actionableRows.push([rowsWithPorts[i], tblData[rowsWithPorts[i]][colTID]]);
            };
        };

        //Do something
        for (i = 0; i < actionableRows.length; i++){
            var nccLink = "https://ncctool.zayo.us/index.php?-table=node_data&-search="; //base URL for the search Function
            nccLink = nccLink.concat(formattedTID(actionableRows[i][1])); //add the facility to the end of the URL
            var link = document.createElement("a");
            link.href = nccLink;
            link.innerText = "NCC";
            link.target = "_blank";
            link.className = "nccLink XES";
            tblHTML.rows[actionableRows[i][0]].cells[colFNI].appendChild(link);
        };
    };


    //function cleanUpIPs () {
//
    //    var rowsWithIPAddresses = []
    //    //First, lets get all of the rows with IP Addresses in them
    //    for (i = 1; i < tblLength; i++){ //Iterate through each row
    //        if (tblData[i][colIPAddress] !== ""){ //If the row has data in the IP Address Column
    //            rowsWithIPAddresses.push([i,tblData[i][colIPAddress]]); //Then add it to the list in format [rowIndex, IPAddressData]
    //        };
    //    };
//
    //    //Next, lets' figure out which IP Addresses are bad, and do something about the ones that are
    //    for (var i = 0; i < rowsWithIPAddresses.length; i++){ //Iterate through each IP Address
    //        var IP = rowsWithIPAddresses[i][1].trim();
    //        if (isValidIP(IP) == false){ //If the IP Address is invalid
//
//
    //            //Hooray for nested IF statements that I will never understand when I'm done writing this. Let's hope I never have to fix it
    //            //Okay, so I did end up needing to fix this, so I guess I'd better comment this shiz
    //            //The XLR tool outputs a ton of invalid IP addresses. Some of them are easy to guess, others have multiple options. Here we try to fix the easiest problems first before moving on. I'll list possible scenarios and their solutions
//
    //            //Scenario #1: The IP address is nothing but numbers, and 12 characters long. Here we can presume that the IP address can be simply "123123123123" and is just missing decimals in all the right spots
    //            //Solution #1: Put the decimals in all the right spots (expected input = "123123123132", expected output "123.123.123.123")
    //            if (IP.length == 12 && IP.search(" ") < 0){ //If it's got 12 numbers then we've got soemthing like "192168255255" and we know exactly where the decimals need to go
    //                var chars = Array.from(IP); // Create array of characters from teh string. ie ["1", "9", "2", "1", "6", "8", "2", "5", "5", "2", "5", "5"]
    //                var newIP = ""
    //                chars.splice(3,0,".");
    //                chars.splice(7,0,".");
    //                chars.splice(11,0,".");
    //                newIP = chars.join("");
    //                IP = newIP;
//
    //                //Scenario #2: The IP address contains spaces where decimals should be. IE "123 123 123 123"
    //                //Solution #2: Replace all the spaces with decimals
    //            } else if (IP.search(" ") >= 0) { //If the IP address has spaces, we can reasonably assume that there's an octet on either side and the spaces need to be decimals
    //                while (IP.search(" ") >= 0 || IP.search(/\d\.\.\d/) >= 0){ //While the IP address has spaces, or double decimals
    //                    IP = IP.replace(" ", "."); //Replace the spaces with decimals
    //                    IP = IP.replace("..","."); //Replace the double decimals with single decimals
    //                };
    //                //Scenario #3: The IP address may contain spaces and may contain decimals, but none of the criteria for solution #1 are met, and solution #2 does not resolve the issue. (ie "10 64 12845" or "10 64 1245")
    //                //Solution #3: Run solution number 2, and start adding decimals where it makes sense. Many will be unfixable. If it unfixable, we will stop guessing and mark it invalid
    //                //Solution #3 continued: For example, "10 64 12845" after solution #2 will become "10.64.12845" and there is only one decimal missing. There's only place we can put it and keep the octects below 255
    //                //Solution #3 continued: However, "10 64 1245" after solution #2 will become "10.64.1245" and there is only one decimal missing. The decimal could go in one of 2 different places and still be valid. It could become "10.64.1.245", "10.64.12.45", or "10.64.124.5" and still be a valid IP
    //                //Solution #3 continued: We will only attempt solution 3 if and only if we're trying to guess a double octet. Mostly because it gets really confusing otherwise, and the likelyhood of more than 1 IP being possible with a triple-octet-mashup increases exponentially
    //                if (isValidIP(IP) == false){ //If primitive methods don't work, lets start guessing. If we can guess more than one valid IP, then we'll stop trying.
    //                    var octets = IP.split("."); //Create array of octets (ie "123.123.123123" becomes ["123', "123", "123123"])
    //                    var totalValidOctets = getValidOctets(octets);
//
    //                    for (var j = 0; j < octets.length; j++){ //Iterate through our array (ie ["123', "123", "123123"])
    //                        if (isValidOctet(octets[j]) == false){ //If we get to a "bad" octet (ie "123123")
    //                            var possibleOctets = [];
    //                            if (totalValidOctets == 2){
    //                                possibleOctets = calculateDualOctets(octets[j]); //Calculate the possible enumarations. This function returns a max of 2 octet sets
    //                                if (possibleOctets.length == 1){
    //                                    octets.splice(j, 1, possibleOctets[0][0], possibleOctets[0][1]); //Change our bad octet to two good octets (ie ["123', "123", "123123"] becomes ["123', "123", "123", "123"])
    //                                    IP = octets.join("."); //Join our array back together as a string (ie ["123', "123", "123", "123"] becomes "123.123.123.123")
    //                                };
    //                            }else if (totalValidOctets == 1){
    //                                possibleOctets = calculateTripleOctets(octets[j]);
    //                                if (possibleOctets.length == 1){
    //                                    octets.splice(j, 1, possibleOctets[0][0], possibleOctets[0][1], possibleOctets[0][2]); //Change our bad octet to two good octets (ie ["123', "123", "123123"] becomes ["123', "123", "123", "123"])
    //                                    IP = octets.join("."); //Join our array back together as a string (ie ["123', "123", "123", "123"] becomes "123.123.123.123")
    //                                };
//
//
    //                            };
    //                        };
    //                    };
    //                };
    //                //Scenario #4: None of the above solutions work, and things are looking pretty grim
    //                //Solution #4: Similar to solution #3, we convert the whole mess to one long string of numbers without spaces, and iterate through every possible permutation of decimal points, and just hope there's only 1 match
    //                //Solution #4: But don't worry, that's what thermal throttling is for
    //                if (isValidIP(IP) == false){
    //                    possibleOctets = calculateAllOctets(IP.replace(/[.]/g, ""));
    //                    if (possibleOctets.length == 1){
    //                        IP = possibleOctets[0].join(".");
    //                    };
    //                };
    //            };
//
    //            if (isValidIP(IP) == true){
    //                tblHTML.rows[rowsWithIPAddresses[i][0]].cells[colIPAddress].innerText = IP;
    //                tblHTML.rows[rowsWithIPAddresses[i][0]].cells[colIPAddress].style.fontStyle = "italic";
    //                tblData[i][colIPAddress] = IP;
    //            } else {
    //                tblHTML.rows[rowsWithIPAddresses[i][0]].cells[colIPAddress].style.color = "red";
    //            };
    //        };
    //    };
//
    //};

    function hideColumn (index) {
        for (var i = 0; i < tblLength; i++){
            tblHTML.rows[i].cells[index].classList.add("XES-hidden");
        };
    };

    function hideStatusSection () {
        var designerTable = document.getElementsByClassName("status")[0];
        if (designerTable.rows[1].innerText.trim() == ""){
            designerTable.parentElement.parentElement.classList.add("XES-hidden");
        };
    };

    function hideDesignerSection () {
        var designerTable = document.getElementsByClassName("designer")[0];
        if (designerTable.rows[1].innerText.trim() == ""){
            designerTable.parentElement.parentElement.classList.add("XES-hidden");
        };
    };

    function hideBanner () {
        $("app").firstElementChild.style.display = "none";
    };

    function moveSearchSection () {
        var searchSection = document.getElementsByClassName("cell-top request")[0];
        var topSection = $("app").firstElementChild.rows[0].insertCell(2);
        jQuery(searchSection).detach().appendTo(topSection);
        searchSection.parentElement.style.paddingLeft = "8px";
    };

    function addCopyOnTripleClick () {
        var billingRow = document.getElementsByClassName("billing")[0].rows[1].cells;
        var serviceRow = document.getElementsByClassName("status")[0].rows[1].cells;
        var designerRow = document.getElementsByClassName("designer")[0].rows[1].cells;
        var specialRows = [billingRow, serviceRow, designerRow];
        //Add to special Rows
        for (var i = 0; i < specialRows.length; i++){
            for (var j = 0; j < specialRows[i].length; j++){
                specialRows[i][j].onclick = copyOnTripleClickHandler;
            };
        };

        //Add to main design layout
        for (i = 1; i < tblLength; i++){
            for (j = 0; j < rowLength; j++){
                tblHTML.rows[i].cells[j].onclick = copyOnTripleClickHandler;
            };
        };
    };

    function copyOnTripleClickHandler (eventArgs){
        if (ctxMenu.state == 1){
            toggleMenu(eventArgs);
        };
        if (eventArgs.detail == 3) { //If this is a triple click
            var clickedElement = eventArgs.path[0]
            var clickedX = eventArgs.pageX;
            var clickedY = eventArgs.pageY
            console.log(eventArgs);
            var text = clickedElement.innerText;
            if (text.length >= 1){
                GM_setClipboard(text.trim());

                var tooltip = document.createElement("div");
                tooltip.innerText = "📋"
                tooltip.id = "copyTooltip";
                tooltip.style.position = "absolute";
                tooltip.style.background = "black";
                tooltip.style.borderRadius = "6px";
                tooltip.style.boxShadow = "0 0 3px 6px black"
                document.body.appendChild(tooltip);
                tooltip.style.top = (clickedY - tooltip.offsetHeight) + "px";
                tooltip.style.left = (clickedX - (tooltip.offsetWidth / 2)) + "px";
                window.setTimeout(removeTooltip, 250);
            };

            function removeTooltip () {
                $("copyTooltip").remove();
            };
        };
    };

    function fixFacilityLinks () {
        applyStyleSheet(".nav-link{display: unset; padding: unset;}");
    };


    function updateTitle () {
        var billingSection = document.getElementsByClassName("billing")[0];
        var circuit = billingSection.rows[1].cells[3].innerText.trim();
        var customer =billingSection.rows[1].cells[1].innerText.trim();
        if (customer.search("Interco") >= 0){//If the customer is "Interco ZG (USA) - Wavelengths LH" then don't mention it in the title
            customer = ""
        }else if (customer.length > 10){
            customer = customer.slice(0,customer.search(" "))
            customer = customer + " ";
        };
        if (opt.TitleCustomer.enabled == false) { customer = "";};
        if (opt.TitleCID.enabled == false) { circuit = "";};
        document.title = customer + circuit;
    };

    function fixPortDropDowns () {
        var portHeader = tblHTML.rows[0].cells[colPort];
        var TIDHeader = tblHTML.rows[0].cells[colTID];
        portHeader.style.width = portHeader.offsetWidth + convertRemToPixels(1.5) + "px";
        TIDHeader.style.width = TIDHeader.offsetWidth + convertRemToPixels(2.5) + "px";
        applyStyleSheet(".dropdown {right: 0.25rem !important;}");
        function convertRemToPixels(rem) { //Courtesy of etham. https://stackoverflow.com/questions/36532307/rem-px-in-javascript
            return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
        }
    };

    function HighlightDisconnected_TSPCodedCircuits () {
        var serviceStatusElement = document.getElementsByClassName("service_status")[1];
        var TSPElement = document.getElementsByClassName("tsp")[1];

        if (opt.HighlightDisconnected.enabled){
            if (serviceStatusElement.innerText.trim() == "Disconnected"){
                serviceStatusElement.style.background = "red";
            } else {
                serviceStatusElement.style.background = "unset";
            };
        };

        if (opt.HighlightTSP.enabled) {
            if (TSPElement.innerText.trim().length > 0){
                TSPElement.style.background = "red";
            } else {
                TSPElement.style.background = "unset";
            };
        };
    };

    function addSettingsLink () {
        var tdSettings = document.createElement("td");
        var btnSettings = document.createElement("button");
        btnSettings.type = "submit";
        btnSettings.innerText = "XES Settings";
        btnSettings.className = "btn btn-primary btn-xs";
        btnSettings.onclick = settingsLinkHandler;

        document.getElementsByClassName("export-btns")[0].parentElement.parentElement.appendChild(tdSettings);
        tdSettings.appendChild(btnSettings);
    };


    function verifySettings () {
        opt = GM_getValue("xesSettings", optDefaults); //Retrieve saved settings, if available. If not, use defaults
        if (typeof(opt) == "string"){opt = JSON.parse(opt)}; //If retrieving saved settings, it will be a string. Defaults will be a JSON object

        var changesMade = false;
        for (var key in opt){ //Iterate through saved settings and update descriptions with defaults
            if(optDefaults[key]){
                opt[key].type = optDefaults[key].type;
                opt[key].description = optDefaults[key].description;
            } else {
                delete opt[key]
                changesMade = true;
                console.log("Deleted cached XES Settings key: " + key);
            };
        };

        for (key in optDefaults){ //Iterate through default settings and alert the user if a new feature is available
            if (!opt[key]){
                opt[key] = optDefaults[key];
                if (optDefaults[key].type == "option") {alert("New XES Feature Available:\r\n" + optDefaults[key].description)};
                changesMade = true;
                console.log("Made change to cached XES Settings key: ".concat("From\r\n", JSON.stringify(opt[key]), "\r\n\r\nTo\r\n", JSON.stringify(optDefaults[key])));
            };
        };
        if (changesMade) {saveSettings()};
    };

    function saveSettings () {
        GM_setValue("xesSettings", JSON.stringify(opt));
        console.log(GM_getValue("xesSettings"));
    };

    function settingsLinkHandler () {
        var optWindow = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes");
        var table = document.createElement("table");
        var tableBody = document.createElement("tbody");
        var tableRowAbout = document.createElement("tr");
        var tableDataAbout = document.createElement("td");

        table.appendChild(tableBody);
        tableBody.appendChild(tableRowAbout);
        tableRowAbout.appendChild(tableDataAbout);

        tableDataAbout.setAttribute("colspan", 2);
        tableDataAbout.innerText = "XES (XLR Enhancement Suite)\r\nBy Lucas Labounty\r\nVersion: " + opt.About.version + " (" + opt.About.date + ") ";
        tableDataAbout.innerHTML += ("Changelog".link(opt.About.changelog) + "<br><br>");

        for (var key in opt){
            var row = document.createElement("tr");
            var dataCell = document.createElement("td");
            if (opt[key].type == "section"){
                dataCell.setAttribute("colspan", 2);
                dataCell.innerText = opt[key].description;
                row.appendChild(dataCell);
            } else if (opt[key].type == "option"){
                var checkboxCell = document.createElement("td");
                var checkbox = document.createElement("input");

                checkbox.type = "checkbox"
                checkbox.id = key;
                checkbox.checked = opt[key].enabled;

                dataCell.innerText = opt[key].description;

                row.appendChild(checkboxCell);
                checkboxCell.appendChild(checkbox);
                row.appendChild(dataCell);
            };
            tableBody.appendChild(row);
        };
        row = document.createElement("tr");
        row.colspan = 2;
        dataCell = document.createElement("td");
        var btn = document.createElement("input");
        btn.type = "button";
        btn.value = "Save";
        btn.onclick = commitSettings;

        var btnDefaults = document.createElement("input");
        btnDefaults.type = "button";
        btnDefaults.value = "Restore Defaults";
        btnDefaults.onclick = restoreDefaults();

        var btnClearCache = document.createElement("input");
        btnDefaults.type = "button";
        btnDefaults.value = "Clear IP address Cache";
        btnDefaults.onclick = initCache(true);

        table.appendChild(row);
        row.appendChild(dataCell);
        dataCell.appendChild(btn);
        dataCell.appendChild(btnDefaults);
        dataCell.appendChild(btnClearCache);
        optWindow.document.body.appendChild(table);
        optWindow.resizeTo(550, Math.min(table.offsetHeight + 25,optWindow.screen.availHeight - 100));
        //table.onfocus = function () {optWindow.resizeTo(550, table.offsetHeight + 125);};
        function commitSettings (){
            for (var key in opt){
                if (opt[key].type == "option"){
                    opt[key].enabled = optWindow.document.getElementById(key).checked;
                };
            };
            saveSettings();
        };
        function restoreDefaults () {
            GM_setValue("xesSettings", JSON.stringify(optDefaults));
        };
    };

    function loadXEScircuit (CID) {
        CID = CID.replace(/\W/g, "%"); //Replace anything that's not a letter or number with a "%"
        CID = "%" + CID + "%";
        while (CID.search("%%") >= 0){
            CID = CID.replace(/%%/g, "%"); //Since this one runs one globably, and not recursively we have do to it in a loop
        };

        var inputElement = document.getElementsByTagName("input")[0];
        var containerElement = document.getElementsByClassName("input-values")[0].firstElementChild;
        var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        var inputEvent = new Event("input", {bubbles:true});
        var XESObserver = new MutationObserver(loadXESCircuitObserver);


        nativeInputValueSetter.call(inputElement, CID);
        inputElement.dispatchEvent(inputEvent);
        XESObserver.observe(containerElement, {subtree:true, childList:true});
    };

    function loadXESCircuitObserver (mutations, observer) {
        var defaultElement = $("react-select-2-option-0");
        var expectedElement = $("react-select-2-option-1");

        if (defaultElement) {
            observer.disconnect();

            if (!expectedElement) {return};
            expectedElement.click();
            document.getElementsByClassName("btn btn-primary")[0].click();
            createCircuitLoadObserver();
        };
    };
    function iFrame () { //Note: This is called by the child script
        setParentIframeState("loading");
        $("app").firstElementChild.className += " XES-hidden";
        //document.getElementsByClassName("billing")[0].className += " XES-hidden";
        document.getElementsByClassName("circuit")[0].firstElementChild.firstElementChild.className += " XES-hidden";
        document.getElementsByClassName("billing")[0].style.visibility = "collapse";
        document.getElementsByClassName("container")[0].style.padding = "unset";
        document.getElementsByClassName("container")[0].style.minHeight = "0px";
        document.getElementsByClassName("xlr dashboard")[0].style.margin = "unset";
        document.getElementsByClassName("cell-top response")[0].style.padding = "unset";
        hideColumn(1);
        setParentIframeState("done");
    };

    function iFrameObserverCallback (mutations, observer) { //Note: This is called by the parent script
        var target = mutations[0].target
        if (target.getAttribute("state") == "done") {
            target.style.height = target.contentDocument.getElementsByClassName("container")[0].offsetHeight + 10 + "px";
            if (isIframe) {setParentIframeState("done")};
        } else if (isIframe) {
            setParentIframeState("loading");
        };
    };

    function setParentIframeState (state) {
        var parentIframeID = window.location.href.split(/(iframe=|&)/g);
        parentIframeID = parentIframeID[parentIframeID.indexOf("iframe=")+1]

        var parentDOMElement = parent.document.getElementById(parentIframeID)
        if(parentDOMElement) {parentDOMElement.setAttribute("state", state)};
    };

    function addLoadOnPaste () {
        var div = document.createElement("div");
        var checkBox = document.createElement("input");
        var label = document.createElement("label");

        div.className = "loadOnPaste";
        div.style.backgroundColor = "unset";
        div.id = "someID";

        checkBox.type = "checkbox";
        checkBox.id = "loadOnPaste";
        checkBox.name = checkBox.id;
        checkBox.className = "loadOnPaste";
        checkBox.checked = opt.hidden.loadOnPaste;

        label.setAttribute("for", checkBox.id);
        label.className = "loadOnPaste";
        label.innerText = "Autoload";

        $("react-select-2-input").parentElement.parentElement.parentElement.parentElement.lastElementChild.insertAdjacentElement("afterBegin", div);
        if (div.nextElementSibling) {div.nextElementSibling.style.display = "none"};
        div.appendChild(checkBox)
        div.appendChild(label);
        $("react-select-2-input").onpaste = loadOnPasteHandler;
        checkBox.onchange = loadOnPasteHandler;

        function loadOnPasteHandler (eventArgs) {
            var isEnabled = $("loadOnPaste").checked;
            switch (eventArgs.target.id){
                case "react-select-2-input": //A paste event has happened

                    if (!isEnabled) {return};
                    eventArgs.preventDefault();
                    loadXEScircuit(eventArgs.clipboardData.getData("Text"));

                    break;
                case "loadOnPaste": //A check/uncheck event has happened
                    if (isEnabled) {
                        eventArgs.target.parentElement.style.color = "#0075ff";
                    } else {
                        eventArgs.target.parentElement.style.color = "unset";
                    };
                    opt.hidden.loadOnPaste = isEnabled;
                    saveSettings();
                    break;
            };
        };
    };

    function addCleanUpBeforeExport () {
        var exportTableRow = document.getElementsByClassName("export-btns")[0].firstElementChild.firstElementChild;
        var btnPDF = exportTableRow.childNodes[1].firstElementChild;
        var btnPDFclone = btnPDF.cloneNode();
        var btnExcel = exportTableRow.childNodes[2].firstElementChild
        var btnExcelclone = btnExcel.cloneNode();

        btnPDF.style.display = "none";
        btnExcel.style.display = "none";
        btnPDF.insertAdjacentElement("afterEnd", btnPDFclone);
        btnExcel.insertAdjacentElement("afterEnd", btnExcelclone);
        btnPDFclone.innerText = "PDF";
        btnExcelclone.innerText = "EXCEL";

        btnPDFclone.onclick = function () {cleanUpBeforeExport(btnPDF)};
        btnExcelclone.onclick = function () {cleanUpBeforeExport(btnExcel)};
    };

    function cleanUpBeforeExport (exportButton) {
        cleanUpBeforeReInit()
        var dropDowns = document.getElementsByClassName("dropdown");
        while (dropDowns.length > 0){
            dropDowns[0].remove();
        };
        exportButton.click();
        init();
    };

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//IP Address Resolver
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async function cleanUpIPs () {
        initCache();
        tblData.forEach(async function (row, index, tbl) { //FYI this is ASYNC!!!!
            if (ctxActions["Copy IP"].connectivityType.indexOf(row[colConnectivityType].match(/^.*?(?=(\d|$))/)[0].trim()) >= 0 && formattedTID(row[colTID].trim()) !== ""){
                if (isValidIP(row[colIPAddress].trim())){ //If IP address is already valid, cache it
                    cache.nodeId[formattedTID(row[colTID])] = row[colIPAddress];
                } else {
                    var response = await new Request("nodeId", formattedTID(row[colTID]), false);
                    if (response !== null && response !== " "){
                        tblHTML.rows[index].cells[colIPAddress].innerText = response;
                        tblHTML.rows[index].cells[colIPAddress].className += " XES-correctedIP";
                    } else {
                        tblHTML.rows[index].cells[colIPAddress].title = "NULL response from Fetch";
                        tblHTML.rows[index].cells[colIPAddress].className += " XES-badIP";
                    };
                };
            }
        });
    };


    async function dispatchScheduler () {
        var pendingRequests = 0;

        for (var i = 0; i < dispatchQueue.length; i++){//Count the pending requests in Q
            var dispatch = dispatchQueue[i];
            if (dispatch.dispatched){
                if (dispatch.settled){
                    dispatchQueue.splice(i,1)
                    i--
                } else {
                    if ((dispatch.time + (dispatchTimeOut*1000) < Date.now())){
                        dispatch.requestPromise.reject("Dispatch Timeout");
                        dispatchQueue.splice(i,1)
                        i--
                    } else {
                        pendingRequests++;
                    };
                };
            };
        };
        console.log(pendingRequests + " Pending Requests");
        if (pendingRequests == 0){
            window.setTimeout(function () {
                if (pendingRequests == 0){saveCache()};
            }, dispatchTimeOut*1000);
        };

        for (i = 0; i < dispatchQueue.length; i++){
            if (pendingRequests <= maxDispatchRequests && dispatchQueue[i].dispatched == false){
                pendingRequests++
                dispatchQueue[i].dispatch();
            }
        };
    };

    class Request {
        constructor(type, requestString, runNow){
            if(cache[type][requestString]){ //Check for cached responses
                return new Promise(function (resolve){
                    resolve(cache[type][requestString]);
                });
            };
            for (var i = 0; i < dispatchQueue.length; i++){ //Check for duplicate Requests
                if (dispatchQueue[i].type == type && dispatchQueue[i].request == requestString){
                    return dispatchQueue[i].requestPromise;
                    break;
                };
            };

            this.type = type;
            this.request = requestString;
            this.url = fetchUrl[type].url + encodeURIComponent(this.request) + fetchUrl[type].append;
            this.runNow = runNow;
            this.XHRpromise;
            this.dispatched = false;
            this.settled = false;
            this.time = 0;

            function externalPromise () {
                var res, rej;
                var promise = new Promise(function (resolve, reject){
                    res = resolve;
                    rej = reject;
                });
                promise.resolve = res;
                promise.reject = rej;
                return promise;
            };
            this.requestPromise = externalPromise();

            if (!runNow) {
                dispatchQueue.push(this);
            } else {
                this.dispatch();
            };
            dispatchScheduler();
            return this.requestPromise;
        };

        async dispatch () {
            console.log("Retrieving '" + this.type + "' for '" + this.request + "' from " + this.url);
            this.time = Date.now();
            this.dispatched = true;
            GM.xmlHttpRequest({
                method: "GET",
                url: this.url,
                onload: this.parse.bind(this),
                onerror: this.fetchError.bind(this),
            });
        };
        parse (data) {
            var request = this;
            this.settled = true;
            var response;
            var error;
            data = data.responseText;
            data = JSON.parse(data);
            if(data.length == 0 || data == []){
                this.parseError("No data returned for '" + this.type + "' '" + this.request + "' from " + this.url);
                response = " ";
            } else {
                console.log("'" + this.type + "' loaded for '" + this.request + "'");
            };

            var parseFunction = {
                nodeId : function () {node()},
            };
            parseFunction[this.type]();

            function node () {
                response = (data[0].ip_address == null) ? " " : data[0].ip_address;
            };

            if(error){this.parseError(error);return;}

            cache[this.type][this.request] = response
            this.requestPromise.resolve(response);
            dispatchScheduler();
        };
        parseError (text) {
            console.error('Parsing error: "' + text + '"');
            this.requestPromise.reject();
        };
        fetchError (promise){
            dispatchScheduler();
            console.error('Error in retrieving "'.concat(this.type, '" for "', this.request, '"', ' from ', this.url));
            console.warn(promise);
            this.requestPromise.reject();
        };
    };

    function initCache (wipe) {
        var defaultCache = "ᯡ࠽䈌ʀ匤䥤Ɠ⪠ "; //Gibberish is UTF16 compression of '{"nodeId":{}}'
        if (wipe){
            GM_setValue("XESipCache", defaultCache);
            cache = {"nodeId":{}};
            return;
        };
        cache = GM_getValue("XESipCache", defaultCache);
        cache = LZString.decompressFromUTF16(cache); //JS strings are by default UTF-16, even though our smaller charset for this data would net a smaller size if originally UTF-8. Luckily the LZ library assumes UTF-8 input and uses all 16bits of the UTF-16 to compress
        cache = JSON.parse(cache);
    };

    function saveCache () {
        var size = JSON.stringify(cache).length
        if (size > maxCacheSize){
            console.warn("Cache size too large to save. Reduction of " + (1-(1 / (size / maxCacheSize))) + "% in progress...");
            console.log(cache);
            var newSize = size;
            var blobs = Object.keys(cache)
            while (newSize >= maxCacheSize){
                blobs.forEach(function (blob) {
                    var keys = Object.keys(cache[blob])
                    if (keys.length > 0){
                        newSize -= JSON.stringify(cache[blob][keys[0]]);
                        delete cache[blob][keys[0]];
                    };
                });
            };
        };
        var reducedCache = LZString.compressToUTF16(JSON.stringify(cache))
        console.log("Cache compressed " + Math.trunc(100-((reducedCache.length/size)*100)) + "% (" + size + " to " + reducedCache.length + ")");
        GM_setValue("XESipCache", reducedCache);
    };
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Button Functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var ctxMenu = {element : undefined, state : 0, row : 0, lastTimeStamp : undefined, tableBody : undefined};
    var ctxActions = {
        "Copy Info" : {
            iconSource: icnCopySrc,
            callback: ctxMenuActionCopyInfo,
            connectivityType: ["Cross Reference", "Miscellaneous Info", "Foreign Information"],
            enabled: true,
        },
        "Copy IP" : {
            callback: ctxMenuActionCopyIP,
            connectivityType: ["Physical Port", "Logical Port", "Ring Node"],
            enabled: true,
        },
        "Copy TID/Port" : {
            iconSource: icnPortSrc,
            callback: ctxMenuActionCopyTIDPort,
            connectivityType: ["Physical Port", "Logical Port", "Ring Node"],
            enabled: opt.BtnCopyTidPort.enabled
        },
        "NCCTool" : {
            callback: ctxMenuActionNCCTool,
            connectivityType: ["Physical Port", "Logical Port", "Ring Node"],
            enabled: true,
        },
        "Collapse Tool" : {
            iconSource: icnCollapseToolSrc,
            callback: ctxMenuActionCollapsed,
            connectivityType: ["Facility"],
            enabled: opt.BtnCollapseTool.enabled,
        },
        "Google Maps" : {
            iconSource: icnMapSrc,
            callback: ctxMenuActionGoogleMaps,
            connectivityType: ["Physical Port", "Logical Port", "Ring Node"],
            enabled: opt.BtnGoogleMaps.enabled,
        },
        "Dispatch" : {
            iconSource: icnDispatchSrc,
            callback: ctxMenuActionDispatch,
            connectivityType: ["Physical Port", "Logical Port", "Ring Node"],
            enabled: opt.BtnDispatch.enabled,
        },
        "Legacy XLR" : {
            callback: ctxMenuActionXLR,
            connectivityType: ["Facility"],
            enabled: true,
        },
        "Copy CID" : {
            callback: ctxMenuCopyCID,
            connectivityType: ["Facility"],
            enabled: true,
        },
        "Search SalesForce-TID" : {
            callback: ctxMenuSearchSFTID,
            connectivityType: ["Physical Port", "Logical Port"],
            enabled: true,
        },
        "Search SalesForce-CID" : {
            callback: ctxMenuSearchSFCID,
            connectivityType: ["Facility"],
            enabled: true,
        },
        "Expand Facility" : {
            iconSource: icnExpandFacilitySrc,
            callback: ctxMenuExpandFacility,
            connectivityType: ["Facility"],
            enabled: opt.BtnCollapseTool.enabled,
        },
        "Minimize Facility" : {
            iconSource: icnMinimizeFacilitySrc,
            callback: ctxMenuMinimizeFacility,
            connectivityType: ["Facility"],
            enabled: false,
        },
        "Menu" : {
            iconSource: icnMenuSrc,
            callback: toggleMenu,
            connectivityType: ["Physical Port", "Logical Port", "Ring Node", "Cross Reference", "Miscellaneous Info", "Facility"],
            enabled: false,
        },
    };

    function addActionIcons () {
        buildContextMenu();
        tblHTML.rows[0].cells[colDesignAction].style.whiteSpace = "nowrap";
        for (var i = 1; i < tblLength; i++){
            var image;
            var imageElementId;
            for (var key in ctxActions) {
                if (ctxActions[key].enabled == true && ctxActions[key].iconSource && ctxActionApplicable(key, i)){
                    image = styleImage(ctxActions[key].iconSource, i, key);
                    image.onclick = ctxMenuAction;
                    tblHTML.rows[i].cells[colDesignAction].appendChild(image);
                };
            };
            image = styleImage(icnMenuSrc, i, "Menu", i-1 + "xMenu");
            image.onclick = ctxMenuAction;
            tblHTML.rows[i].cells[colDesignAction].appendChild(image);
        };

        //if (ctxActions.ctxMenuActionCollapsed.enabled == true) {
        //    var element = document.getElementsByClassName("EXCHANGE_CARRIER_CIRCUIT_ID")[1];
        //    image = styleImage(ctxActions.ctxMenuActionCollapsed.iconSource, i, key);
        //    image.onclick = function () {
        //        var element = document.getElementsByClassName("EXCHANGE_CARRIER_CIRCUIT_ID")[1];
        //        ctxMenuActionCollapsed(null,element.innerText);
        //    };
        //    element.nextElementSibling.insertAdjacentElement("afterBegin", image);
        //};
    };

    function ctxActionApplicable (action, row){
        var connectivityTypes = ctxActions[action].connectivityType;
        for (var i = 0; i < connectivityTypes.length; i++){
            if (tblData[row][colConnectivityType].trim().search(connectivityTypes[i]) >= 0){
                return true;
            };
        };
        return false;
    };

    function styleImage (source, row, action, id) {
        var image = new Image();
        image.src = source;
        if(id) {image.id = id};
        image.className = "XES actionIcon";
        image.setAttribute("row", row);
        image.setAttribute("action", action);
        image.setAttribute("title", action);
        return image;
    };

    function updateMenuOptions (clickedRow) {
        var list = [];
        for (var key in ctxActions) {
            if (ctxActions[key].enabled == true && ctxActionApplicable(key, clickedRow)){
                list.push(key);
            };
        };
        return list;
    };


    function ctxMenuAction (eventArgs) {
        var elementAction = eventArgs.path[0].getAttribute("action");
        var clickedRow = parseInt(eventArgs.path[0].getAttribute("row"));
        var element = eventArgs.path[0];
        ctxActions[elementAction].callback(clickedRow, eventArgs);
    };

    function ctxMenuActionCopyInfo (clickedRow) {
        GM_setClipboard(tblData[clickedRow][colEquipFacility]);
    };

    function ctxMenuActionCopyIP (clickedRow) {
        GM_setClipboard(tblData[clickedRow][colIPAddress]);
    };
    function ctxMenuActionCopyTIDPort (clickedRow) {
        var TID = formattedTID(tblData[clickedRow][colTID]);
        var port = formattedPort(tblData[clickedRow][colPort]);
        var IP = tblData[clickedRow][colIPAddress];
        if (isValidIP(IP) == true){
            //IP = " (" + IP + ")";
            IP = "";
        }else{
            IP = "";
        };
        if (opt.BtnCopyTidPortIP.enabled == false) {IP=""};
        GM_setClipboard(TID + " " + port + IP);
    };
    function ctxMenuActionNCCTool (clickedRow) {
        var TID = formattedTID(tblData[clickedRow][colTID]);
        window.open("https://ncctool.zayo.us/index.php?-table=node_data&-search=" + TID);
    };
    function ctxMenuActionCollapsed (clickedRow, CID) {
        //if (!CID){
        //    CID = tblData[clickedRow][colEquipFacility];
        //};
        CID = tblData[clickedRow][colEquipFacility];
        window.open("http://collapsed.zayo.us/?circuitID="+ CID);
    };
    function ctxMenuActionGoogleMaps (clickedRow) {
        var address = tblData[clickedRow][colAddress]
        window.open("https://www.google.com/maps/search/"+address);
    };
    function ctxMenuActionXLR (clickedRow) {
        var CID = tblData[clickedRow][colEquipFacility];
        window.open("http://xlr.zayo.com/CircuitInfo/CircuitLayoutRecord.aspx?circuitID="+ CID);
    };
    function ctxMenuCopyCID (clickedRow){
        var CID = tblData[clickedRow][colEquipFacility];
        //CID = sanitizeCID(CID);
        GM_setClipboard(CID);
    };
    function ctxMenuSearchSFTID (clickedRow) {
        var TID = formattedTID(tblData[clickedRow][colTID]);
        window.open("https://zayo.my.salesforce.com/_ui/search/ui/UnifiedSearchResults?searchType=2&str=" + TID);
    };

    function ctxMenuSearchSFCID (clickedRow) {
        var CID = tblData[clickedRow][colEquipFacility];
        window.open("https://zayo.my.salesforce.com/_ui/search/ui/UnifiedSearchResults?searchType=2&str=" + CID);
    };

    function ctxMenuExpandFacility (clickedRow, eventArgs) {
        var element = eventArgs.target;
        if (isIframe) {setParentIframeState("loading")};

        var cickedRowElement = element.parentElement.parentElement
        var iFrameID = Math.floor(Math.random() * 1000000000000) //Generate a random ID
        var iFrameSrc = "http://den02vmxlr03.us.corp.zayo.com/?XES&iframe=" +iFrameID + "&circuit=" + cickedRowElement.cells[colEquipFacility].firstElementChild.innerText; //Embed that ID in the URL for the new script to retrieve
        var iFrameRow = document.createElement("tr");
        var iFrameData = document.createElement("td");
        var iFrame = document.createElement("iframe");

        iFrameRow.className = "XES";
        iFrameData.colSpan = 15;
        iFrame.id = iFrameID;
        iFrame.src = iFrameSrc;
        iFrame.width = "100%";
        iFrame.setAttribute("state", "init");

        cickedRowElement.insertAdjacentElement("afterend", iFrameRow);
        iFrameRow.appendChild(iFrameData);
        iFrameData.appendChild(iFrame);

        element.src = icnMinimizeFacilitySrc;
        element.setAttribute("action", "Minimize Facility");
        element.setAttribute("data", iFrameID);
        var iFrameObserver = new MutationObserver(iFrameObserverCallback);
        iFrameObserver.observe(iFrame, {childList: false, attributes:true});
        iFrame.setAttribute("state", "loading");
    };

    function ctxMenuMinimizeFacility (clickedRow, eventArgs) {
        var element = eventArgs.target;
        if (isIframe) {setParentIframeState("loading")};
        element.src = icnExpandFacilitySrc;
        element.setAttribute("action", "Expand Facility");
        element.setAttribute("title", "Expand Facility");
        element.parentElement.parentElement.nextElementSibling.remove();
        if (isIframe) {setParentIframeState("done")};
    };

    function ctxMenuActionDispatch (clickedRow) {
        if (dspWindowOpen == true && confirm("You already have a dispatch window open for this page. Continuing will lose all unsaved data. Continue?") == false){
            return;
        };
        dspWindowOpen = true;
        var dspWindow = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes");
        dspWindow.document.body.innerHTML = "<html><head><title>Dispatch - \/OQYX\/250189\/ \/ZYO \/<\/title><\/head><body><style type=\"text\/css\">\r\n\t*{\r\n\t\tbackground-color: #292a2a;\r\n\t\tcolor: white;\r\n\t}\r\n    .:active{\r\n        box-shadow: 0 0 2px 0px black;\r\n    }\r\n    .dspTxt{\r\n        width:100%;\r\n    }\r\n    .dspTxtMulti{\r\n        width: -webkit-fill-available;\r\n        height: 80px;\r\n    }\r\n    .dspRequired{\r\n        border-left: 3px solid #2780e3;\r\n    };\r\n    <\/style>\r\n\r\n\r\n<table id=\"dspTemplateTable\" style=\"display: unset;\">\r\n    <tbody>\r\n        <tr>\r\n            <td>TTN<\/td>\r\n            <td><input id=\"dspTTN\" class=\"dspTxt dspRequired\"><\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>Network Layer<\/td>\r\n            <td>\r\n                <select id=\"dspNetworkLayer\" class=\"dspRequired\">\r\n                    <option value=\"Wave\">Wave<\/option>\r\n                    <option value=\"SONET\">SONET<\/option>\r\n                    <option value=\"IP\">IP<\/option>\r\n\t\t\t\t\t<option value=\"Ethernet\">Ethernet<\/option>\r\n                <\/select>\r\n            <\/td>       \r\n        <\/tr>\r\n        <tr>\r\n            <td>Dispatch Type<\/td>\r\n            <td>\r\n                <select id=\"dspType\" class=\"dspRequired\">\r\n                    <option value=\"MTTR\">MTTR<\/option>\r\n                    <option value=\"Scheduled\">Scheduled<\/option>\r\n                    <option value=\"Best Effort\">Best Effort<\/option>\r\n                <\/select>\r\n            <\/td>       \r\n        <\/tr>\r\n\t\t<tr style=\"display: none;\">\r\n            <td>\r\n                Date\/Time\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspScheduledTime\" class=\"dspTxt dspScheduled dspRequired\">\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                Address\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspAddress\" class=\"dspTxt\">\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>Access Request Required<\/td>\r\n            <td>\r\n                <select id=\"dspAccessRequired\" class=\"dspRequired\">\r\n                    <option value=\"Yes\">Yes<\/option>\r\n                    <option value=\"No\">No<\/option>\r\n                <\/select>\r\n            <\/td>       \r\n        <\/tr>\r\n\t\t<tr>\r\n            <td colspan=\"2\">\r\n                ISP Facility Information\r\n        <\/td><\/tr>\r\n        <tr rowspan=\"3\">\r\n            <td colspan=\"2\">\r\n                <textarea id=\"dspISPInfo\" class=\"dspTxtMulti dspRequired\" style=\"width: -webkit-fill-available;\"><\/textarea>\r\n            <\/td>\r\n        <\/tr>\r\n        \r\n        <tr>\r\n            <td>\r\n                Zayo POC\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspPOC\" class=\"dspTxt dspRequired\">\r\n            <\/td>\r\n        <\/tr>\r\n        \r\n        \r\n        \r\n        \r\n        \r\n        \r\n        \r\n        \r\n        <tr>\r\n            <td colspan=\"2\">\r\n                Equipment Location\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                TID\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspTID\" class=\"dspTxt\">\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                Floor\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspFloor\" class=\"dspTxt dspRequired\">\r\n            <\/td>\r\n        <\/tr><tr>\r\n            <td>\r\n                Cage\/Room\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspCage\" class=\"dspTxt\">\r\n            <\/td>\r\n        <\/tr>\r\n        \r\n        <tr>\r\n            <td>\r\n                Rack\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspRR\" class=\"dspTxt\">\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                Shelf\/Slot\/Port\r\n            <\/td>\r\n            <td>\r\n                <input id=\"dspPort\" class=\"dspTxt\">\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td colspan=\"2\">\r\n                Description of problem:\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td colspan=\"2\">\r\n                <textarea id=\"dspWork\" class=\"dspTxtMulti dspRequired\" style=\"margin: 0px; width: 483px; height: 58px;\"><\/textarea>\r\n            <\/td>\r\n        <\/tr>\r\n\t\t<tr>\r\n            <td>\r\n                Scope of Work\r\n            <\/td>\r\n        <\/tr>\r\n        \r\n        <tr>\r\n            <td colspan=\"2\">\r\n                <textarea id=\"dspSOW\" class=\"dspTxtMulti dspRequired\" style=\"margin: 0px; width: 483px; height: 58px;\"><\/textarea>\r\n            <\/td>\r\n        <\/tr>\r\n\t\t<tr>\r\n            <td colspan=\"2\">\r\n                Equipment Needed\r\n        <\/td><\/tr>\r\n        <tr rowspan=\"3\">\r\n            <td colspan=\"2\">\r\n                <textarea id=\"dspTools\" class=\"dspTxtMulti dspRequired\" style=\"width: -webkit-fill-available;\"><\/textarea>\r\n            <\/td>\r\n        <\/tr>\r\n        \r\n\r\n\r\n    <\/tbody>\r\n<\/table>\r\n<table class=\"dspHiddenText\">\r\n    <tbody class=\"dspHiddenText\">\r\n        <tr>\r\n            <td>\r\n                 <textarea id=\"dspHiddenText\" class=\"dspHiddenText\" rows=\"50\" cols=\"50\" style=\"display: none;\"><\/textarea>\r\n            <\/td>\r\n        <\/tr>\r\n    <\/tbody>\r\n<\/table>\r\n<input type=\"button\" value=\"Generate Template\" id=\"dspGenerateButton\" style=\"display: unset;\">\r\n<input type=\"button\" value=\"Copy to Clipboard\" id=\"dspCopyButton\" style=\"display: none;\">\r\n    \r\n    \r\n    \r\n    \r\n    \r\n    <\/body><\/html>";

        //https://www.freeformatter.com/javascript-escape.html
        dspWindow.onunload = function () {
            dspWindowOpen = false;
        };

        dspWindow.resizeTo(600,800);
        dspWindow.resizeTo(dsp("dspTemplateTable").offsetWidth + 50, dspWindow.document.body.scrollHeight + 100);
        dspWindow.document.title = "Dispatch - " + document.title;
        dsp("dspType").onchange = function () {
            if (dsp("dspType").value == "Scheduled"){
                dsp("dspScheduledTime").parentElement.parentElement.style.display = "";
            }else{
                dsp("dspScheduledTime").parentElement.parentElement.style.display = "none";
            };
        };
        dsp("dspAccessRequired").onchange = function () {
            if (dsp("dspAccessRequired").value == "Yes"){
                dsp("dspISPInfo").parentElement.parentElement.previousElementSibling.innerText = "ISP Facility Information";
                dsp("dspISPInfo").parentElement.parentElement.style.display = "";
            } else {
                dsp("dspISPInfo").parentElement.parentElement.previousElementSibling.innerText = "LCON/Access Info";

            };
        };
        dsp("dspAddress").value = tblData[clickedRow][colAddress];
        dsp("dspPOC").value = GM_getValue("xlrScriptDispatchPOC", "")
        dsp("dspTID").value = tblData[clickedRow][colTID].replace("<","(AKA ").replace(">",")");
        if (tblData[clickedRow][colAddress].search(/floor|flr/gi) >= 0){
            var address = tblData[clickedRow][colAddress];
            address = address.split(",");
            for (var i = 0; i < address.length; i++){
                if (address[i].search(/floor|flr/gi) >= 0){ dsp("dspFloor").value = address[i]};
            };
        };
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
            template += "<pre><mark>DISPATCH TEMPLATE<\/mark>";
            cr();
            template += dsp("dspTTN").value;
            cr();
            template += "Work Order: ";
            cr();
            template += "Service Appointment #: ";
            cr();
            template += "Circuit Type: " + dsp("dspNetworkLayer").value;
            cr();
            template += "We are in need of a dispatch to: " + dsp("dspAddress").value;
            cr();
            template += "Number of Technicians necessary: 1";
            cr();
            template += "Time Frame: ";
            if (dsp("dspType").value == "Scheduled"){
                template += dsp("dspScheduledTime").value
            }else{
                template += dsp("dspType").value;
            };
            cr();
            template = template.concat("Local Contact: ", "Zayo POC ", dsp("dspPOC").value, " (NOC 866-236-2824 Opt 1)");
            cr();
            cr();
            template += "Equipment Needed:";
            cr();
            template += dsp("dspTools").value;
            cr();
            cr();
            template += "Scope of Work:";
            cr();
            template += dsp("dspSOW").value
            cr();
            cr();
            template += "Description of Problem:";
            cr();
            template += dsp("dspWork").value;
            cr();
            cr();
            if (dsp("dspAccessRequired").value == "No"){
                template += "Access Info:";
                cr();
                template += dsp("dspISPInfo").value;
                cr();
                cr();
            };
            template += "Demarc Location(s):";
            cr();
            template += "TID: " + dsp("dspTID").value;
            cr();
            template += "Floor: " + dsp("dspFloor").value;
            cr();
            template += "Cage/Room: " + dsp("dspCage").value;
            cr();
            template += "Rack: " + dsp("dspRR").value;
            cr();
            template += "Shelf/Slot/Port: " + dsp("dspPort").value;
            cr();
            cr();
            template += "<mark>Access Template</mark>";
            cr();
            template += "Access Needed: " + dsp("dspAccessRequired").value;
            if (dsp("dspAccessRequired").value == "Yes"){
                cr();
                template += "ISP Facility Info:";
                cr();
                template += dsp("dspISPInfo").value;
                cr();
                template += "Site Address: " + dsp("dspAddress").value;
                cr();
                template += "First and Last Name(s), Company(s), and contact number(s) of technicians needing access:"
                cr();
                cr();
                template += "Network Layer: " + dsp("dspNetworkLayer").value;
                cr();
                template += "Date of Needed Access: ";
                if (dsp("dspType").value == "Scheduled"){ template += dsp("dspScheduledTime").value};
                cr();
                template += "Floor: " + dsp("dspFloor").value;
                cr();
                template += "Room/Suite/Cage: " + dsp("dspCage").value;
                cr();
                template += "Rack: " + dsp("dspRR").value;
                cr();
                template += "Shelf/Slot/Port: " + dsp("dspPort").value;
                cr();
                template += "Reason for Access: Troubleshooting and Repair";
                cr();
                template += "Zayo TTN#: " + dsp("dspTTN").value;
            };



            dsp("dspHiddenText").value=template;
            function cr(){
                template += "\r\n";
            };
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

    function addVersionButtons () {
        var icnFirst = styleImage(icnFirsttSrc, -1, "First Version", "versionFirst");
        var icnPrevious = styleImage(icnPreviousSrc, -1, "Previous Version", "versionPrevious");
        var icnNext = styleImage(icnNextSrc, -1, "Next Version", "versionPrevious");
        var icnCurrent = styleImage(icnCurrentSrc, -1, "Current Version", "versionCurrent");

        icnFirst.onclick = versionButtonClickHandler;
        icnPrevious.onclick = versionButtonClickHandler;
        icnNext.onclick = versionButtonClickHandler;
        icnCurrent.onclick = versionButtonClickHandler;

        var versionCell = document.getElementsByClassName("ISSUE_NBR")[1];
        versionCell.insertAdjacentElement("afterbegin", icnPrevious);
        versionCell.insertAdjacentElement("afterbegin", icnFirst);
        versionCell.insertAdjacentElement("beforeend", icnNext);
        versionCell.insertAdjacentElement("beforeend", icnCurrent);

        document.getElementsByClassName("ISSUE_NBR")[0].style.whiteSpace = "nowrap"

        function versionButtonClickHandler (eventArgs) {
            var action = eventArgs.target.getAttribute("action");
            var currentVersion = parseInt(eventArgs.target.parentElement.innerText);
            var actionFunction = {
                "First Version" : function () {goToVersion(1)},
                "Previous Version" : function () {goToVersion(currentVersion -1)},
                "Next Version" : function () {goToVersion(currentVersion + 1)},
                "Current Version": function () {goToVersion(0)}
            };

            actionFunction[action]();
            function goToVersion (version) {
                var inputElement = $("issue-nbr");
                var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                var inputEvent = new Event("input", {bubbles:true});

                nativeInputValueSetter.call(inputElement, version);
                inputElement.dispatchEvent(inputEvent);
                document.getElementsByTagName("button")[0].click();
            };
        };
    };



    function buildContextMenu () {
        var jQ_CSS = jQuery.parseHTML("<style type=\"text\/css\">\r\n.ctxMenu{\r\n\tbackground-color: #292a2b;\r\n\twidth: fit-content;\r\n    padding: 3px;\r\n\tz-index: 10;\r\n}\r\ndiv.ctxMenu{\r\n    width: fit-content;\r\n    border-radius: 6px;\r\n    box-shadow: -6px 11px 20px #324b68;\r\n\tposition: absolute;\r\n\tdisplay: none;\r\n}\r\ntd.ctxMenu{\r\n    border-left: 2px solid #292a2b;\r\n}\r\ntd.ctxMenu:hover{\r\n\tbackground-color: #393d43;\r\n\tborder-left: 2px solid #2780e3;\r\n\tcursor: pointer;\r\n}\r\ntr.ctxMenu{\r\n\tborder-left-color: black;\r\n\tborder-left-width: 6px;\r\n}\r\ntr.ctxMenu:hover{\r\n\tbackground-color: #393d43;\r\n\tborder-left: 2px solid #2780e3;\r\n}\r\n.opaqueDiv{\r\n\tposition: fixed;\r\n\twidth: 100%;\r\n\theight: 100%;\r\n\ttop: 0px;\r\n\tz-index: 2;\r\n\tdisplay: none;\r\n}\r\n<\/style>");
        var jQ_DOM = jQuery.parseHTML("<div class=\"XES opaqueDiv\" id=\"opaqueDiv\"><\/div>\r\n<div class=\"ctxMenu\" id=\"ctxMenu\">\r\n\t<table class=\"ctxMenu\">\r\n\t\t<tbody id=\"context-menu\" class=\"ctxMenu\">\r\n\t\t<\/tbody>\r\n\t<\/table>\r\n<\/div>");
        jQuery("#app").append(jQ_DOM).append(jQ_CSS);
        ctxMenu.element = $("ctxMenu");
        ctxMenu.tableBody = $("context-menu");
    };

    function toggleMenu (eventArgs, clickedRow) {
        var element = eventArgs.target || clickedRow.target;
        if (clickedRow){ //Side effect of code refactor 8/5/20 (if called by ctxMenuAction handler, the variables are reversed from when this function is called by copyOnTripleClickHandler
            var tempEventArgs = clickedRow;
            clickedRow = eventArgs;
            eventArgs = tempEventArgs
        };
        if (element.id.search("xMenu") >= 0 && clickedRow >= 0){
            ctxMenu.state = 1;
            ctxMenu.lastTimeStamp = eventArgs.timeStamp;
            $("opaqueDiv").onclick = toggleMenu;

            buildMenu(updateMenuOptions(clickedRow), clickedRow);
            positionMenu(eventArgs, element);
        } else if (eventArgs.timeStamp - ctxMenu.lastTimeStamp >= 50 || ctxMenu.lastTimeStamp == undefined){
            ctxMenu.state = 0;
            ctxMenu.element.style.display = "none";
        };
    };

    function buildMenu (menuItems, clickedRow) {
        clearMenu();
        for (var i = 0; i < menuItems.length; i++){
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            tr.className = "ctxMenu";
            tr.setAttribute("data", menuItems[i]);

            td.className = "ctxMenu";
            td.id = menuItems[i]
            td.innerText = menuItems[i];
            td.setAttribute("action", menuItems[i]);
            td.setAttribute("row", clickedRow);
            td.onclick = function (eventArgs) {
                toggleMenu(eventArgs);
                ctxMenuAction(eventArgs);
            };;
            tr.appendChild(td);
            ctxMenu.tableBody.appendChild(tr);
            ctxMenu.element.style.display = "block";
        };
        function clearMenu () {
            while ($("ctxMenu").firstElementChild.rows.length > 0){
                $("ctxMenu").firstElementChild.deleteRow(0);
            };
        };
    };
    function positionMenu (eventArgs, element) {
        //Courtesy of Nick Salloum https://www.sitepoint.com/building-custom-right-click-context-menu-javascript/
        var menuPosition = getPosition(eventArgs);
        var menuPositionX = menuPosition.x;
        var menuPositionY = menuPosition.y;
        var menuWidth = ctxMenu.element.offsetWidth;
        var menuHeight = ctxMenu.element.offsetHeight;
        var ctxMenuRowHeight = ctxMenu.element.firstElementChild.firstElementChild.firstElementChild.offsetHeight;

        ctxMenu.element.style.left = menuPositionX - menuWidth + "px";
        ctxMenu.element.style.top = menuPositionY - (ctxMenuRowHeight / 2) + "px";
        function getPosition(e) {
            var posx = 0;
            var posy = 0;
            if (!e) {e = window.event};
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
    };


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//XLRTab (zDaf Integration) Functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function awaitOutputLoaded () {
        initDataTables();
        timer = window.setInterval(checkOutputLoaded,250)
    };

    function checkOutputLoaded () {
        console.log("Checking...");
        if (!$("LoadingIndicator")){ //The LoadingIndicator element is destroyed once an output has been acheived
            window.clearInterval(timer);
            getToWork();
        };
    };
    function initDataTables () {
        var DataTablesScript = document.createElement("script");
        DataTablesScript.type = "text/javascript";
        DataTablesScript.charset = "utf8";
        DataTablesScript.src = DataTablesJSSource;
        document.body.appendChild(DataTablesScript);

        applyStyleSheet(".dataTable{display: block !important;}");
        applyStyleSheet(DataTablesCSSSource);
        applyStyleSheet("\/*\r\n * Table styles\r\n *\/\r\ntable.dataTable {\r\n  width: 100%;\r\n  margin: 0 auto;\r\n  clear: both;\r\n  border-collapse: separate;\r\n  border-spacing: 0;\r\n  \/*\r\n   * Header and footer styles\r\n   *\/\r\n  \/*\r\n   * Body styles\r\n   *\/ }\r\n  table.dataTable thead th,\r\n  table.dataTable tfoot th {\r\n    font-weight: bold; }\r\n  table.dataTable thead th,\r\n  table.dataTable thead td {\r\n    padding: 10px 18px;\r\n    border-bottom: 1px none #111111; }\r\n    table.dataTable thead th:active,\r\n    table.dataTable thead td:active {\r\n      outline: none; }\r\n  table.dataTable tfoot th,\r\n  table.dataTable tfoot td {\r\n    padding: 10px 18px 6px 18px;\r\n    border-top: 1px none #111111; }\r\n  table.dataTable thead .sorting,\r\n  table.dataTable thead .sorting_asc,\r\n  table.dataTable thead .sorting_desc,\r\n  table.dataTable thead .sorting_asc_disabled,\r\n  table.dataTable thead .sorting_desc_disabled {\r\n    cursor: pointer;\r\n    *cursor: hand;\r\n    background-repeat: no-repeat;\r\n    background-position: center right; }\r\n  table.dataTable thead .sorting {\r\n    background-image: url(\"http:\/\/datatables.net\/media\/images\/sort_both.png\"); }\r\n  table.dataTable thead .sorting_asc {\r\n    background-image: url(\"http:\/\/datatables.net\/media\/images\/sort_asc.png\"); }\r\n  table.dataTable thead .sorting_desc {\r\n    background-image: url(\"http:\/\/datatables.net\/media\/images\/sort_desc.png\"); }\r\n  table.dataTable thead .sorting_asc_disabled {\r\n    background-image: url(\"http:\/\/datatables.net\/media\/images\/sort_asc_disabled.png\"); }\r\n  table.dataTable thead .sorting_desc_disabled {\r\n    background-image: url(\"http:\/\/datatables.net\/media\/images\/sort_desc_disabled.png\"); }\r\n  table.dataTable tbody tr {\r\n    background-color: #393d43; }\r\n    table.dataTable tbody tr.selected {\r\n      background-color: #324b68; }\r\n  table.dataTable tbody th,\r\n  table.dataTable tbody td {\r\n    padding: 8px 10px; }\r\n  table.dataTable.row-border tbody th, table.dataTable.row-border tbody td, table.dataTable.display tbody th, table.dataTable.display tbody td {\r\n    border-top: 1px none #dddddd; }\r\n  table.dataTable.row-border tbody tr:first-child th,\r\n  table.dataTable.row-border tbody tr:first-child td, table.dataTable.display tbody tr:first-child th,\r\n  table.dataTable.display tbody tr:first-child td {\r\n    border-top: none; }\r\n  table.dataTable.cell-border tbody th, table.dataTable.cell-border tbody td {\r\n    border-top: 1px none #dddddd;\r\n    border-right: 1px none #dddddd; }\r\n  table.dataTable.cell-border tbody tr th:first-child,\r\n  table.dataTable.cell-border tbody tr td:first-child {\r\n    border-left: 1px none #dddddd; }\r\n  table.dataTable.cell-border tbody tr:first-child th,\r\n  table.dataTable.cell-border tbody tr:first-child td {\r\n    border-top: none; }\r\n  table.dataTable.stripe tbody tr.odd, table.dataTable.display tbody tr.odd {\r\n    background-color: #373b41; }\r\n    table.dataTable.stripe tbody tr.odd.selected, table.dataTable.display tbody tr.odd.selected {\r\n      background-color: #304965; }\r\n  table.dataTable.hover tbody tr:hover, table.dataTable.display tbody tr:hover {\r\n    background-color: #363a40; }\r\n    table.dataTable.hover tbody tr:hover.selected, table.dataTable.display tbody tr:hover.selected {\r\n      background-color: #304864; }\r\n  table.dataTable.order-column tbody tr > .sorting_1,\r\n  table.dataTable.order-column tbody tr > .sorting_2,\r\n  table.dataTable.order-column tbody tr > .sorting_3, table.dataTable.display tbody tr > .sorting_1,\r\n  table.dataTable.display tbody tr > .sorting_2,\r\n  table.dataTable.display tbody tr > .sorting_3 {\r\n    background-color: #373b41; }\r\n  table.dataTable.order-column tbody tr.selected > .sorting_1,\r\n  table.dataTable.order-column tbody tr.selected > .sorting_2,\r\n  table.dataTable.order-column tbody tr.selected > .sorting_3, table.dataTable.display tbody tr.selected > .sorting_1,\r\n  table.dataTable.display tbody tr.selected > .sorting_2,\r\n  table.dataTable.display tbody tr.selected > .sorting_3 {\r\n    background-color: #314965; }\r\n  table.dataTable.display tbody tr.odd > .sorting_1, table.dataTable.order-column.stripe tbody tr.odd > .sorting_1 {\r\n    background-color: #35393f; }\r\n  table.dataTable.display tbody tr.odd > .sorting_2, table.dataTable.order-column.stripe tbody tr.odd > .sorting_2 {\r\n    background-color: #363a3f; }\r\n  table.dataTable.display tbody tr.odd > .sorting_3, table.dataTable.order-column.stripe tbody tr.odd > .sorting_3 {\r\n    background-color: #363a40; }\r\n  table.dataTable.display tbody tr.odd.selected > .sorting_1, table.dataTable.order-column.stripe tbody tr.odd.selected > .sorting_1 {\r\n    background-color: #2f4662; }\r\n  table.dataTable.display tbody tr.odd.selected > .sorting_2, table.dataTable.order-column.stripe tbody tr.odd.selected > .sorting_2 {\r\n    background-color: #2f4763; }\r\n  table.dataTable.display tbody tr.odd.selected > .sorting_3, table.dataTable.order-column.stripe tbody tr.odd.selected > .sorting_3 {\r\n    background-color: #304863; }\r\n  table.dataTable.display tbody tr.even > .sorting_1, table.dataTable.order-column.stripe tbody tr.even > .sorting_1 {\r\n    background-color: #373b41; }\r\n  table.dataTable.display tbody tr.even > .sorting_2, table.dataTable.order-column.stripe tbody tr.even > .sorting_2 {\r\n    background-color: #383c42; }\r\n  table.dataTable.display tbody tr.even > .sorting_3, table.dataTable.order-column.stripe tbody tr.even > .sorting_3 {\r\n    background-color: #383c42; }\r\n  table.dataTable.display tbody tr.even.selected > .sorting_1, table.dataTable.order-column.stripe tbody tr.even.selected > .sorting_1 {\r\n    background-color: #314965; }\r\n  table.dataTable.display tbody tr.even.selected > .sorting_2, table.dataTable.order-column.stripe tbody tr.even.selected > .sorting_2 {\r\n    background-color: #314a66; }\r\n  table.dataTable.display tbody tr.even.selected > .sorting_3, table.dataTable.order-column.stripe tbody tr.even.selected > .sorting_3 {\r\n    background-color: #314a67; }\r\n  table.dataTable.display tbody tr:hover > .sorting_1, table.dataTable.order-column.hover tbody tr:hover > .sorting_1 {\r\n    background-color: #34373d; }\r\n  table.dataTable.display tbody tr:hover > .sorting_2, table.dataTable.order-column.hover tbody tr:hover > .sorting_2 {\r\n    background-color: #34383d; }\r\n  table.dataTable.display tbody tr:hover > .sorting_3, table.dataTable.order-column.hover tbody tr:hover > .sorting_3 {\r\n    background-color: #35393e; }\r\n  table.dataTable.display tbody tr:hover.selected > .sorting_1, table.dataTable.order-column.hover tbody tr:hover.selected > .sorting_1 {\r\n    background-color: #2d445f; }\r\n  table.dataTable.display tbody tr:hover.selected > .sorting_2, table.dataTable.order-column.hover tbody tr:hover.selected > .sorting_2 {\r\n    background-color: #2e4560; }\r\n  table.dataTable.display tbody tr:hover.selected > .sorting_3, table.dataTable.order-column.hover tbody tr:hover.selected > .sorting_3 {\r\n    background-color: #2e4661; }\r\n  table.dataTable.no-footer {\r\n    border-bottom: 1px none #111111; }\r\n  table.dataTable.nowrap th, table.dataTable.nowrap td {\r\n    white-space: nowrap; }\r\n  table.dataTable.compact thead th,\r\n  table.dataTable.compact thead td {\r\n    padding: 4px 17px; }\r\n  table.dataTable.compact tfoot th,\r\n  table.dataTable.compact tfoot td {\r\n    padding: 4px; }\r\n  table.dataTable.compact tbody th,\r\n  table.dataTable.compact tbody td {\r\n    padding: 4px; }\r\n  table.dataTable th.dt-left,\r\n  table.dataTable td.dt-left {\r\n    text-align: left; }\r\n  table.dataTable th.dt-center,\r\n  table.dataTable td.dt-center,\r\n  table.dataTable td.dataTables_empty {\r\n    text-align: center; }\r\n  table.dataTable th.dt-right,\r\n  table.dataTable td.dt-right {\r\n    text-align: right; }\r\n  table.dataTable th.dt-justify,\r\n  table.dataTable td.dt-justify {\r\n    text-align: justify; }\r\n  table.dataTable th.dt-nowrap,\r\n  table.dataTable td.dt-nowrap {\r\n    white-space: nowrap; }\r\n  table.dataTable thead th.dt-head-left,\r\n  table.dataTable thead td.dt-head-left,\r\n  table.dataTable tfoot th.dt-head-left,\r\n  table.dataTable tfoot td.dt-head-left {\r\n    text-align: left; }\r\n  table.dataTable thead th.dt-head-center,\r\n  table.dataTable thead td.dt-head-center,\r\n  table.dataTable tfoot th.dt-head-center,\r\n  table.dataTable tfoot td.dt-head-center {\r\n    text-align: center; }\r\n  table.dataTable thead th.dt-head-right,\r\n  table.dataTable thead td.dt-head-right,\r\n  table.dataTable tfoot th.dt-head-right,\r\n  table.dataTable tfoot td.dt-head-right {\r\n    text-align: right; }\r\n  table.dataTable thead th.dt-head-justify,\r\n  table.dataTable thead td.dt-head-justify,\r\n  table.dataTable tfoot th.dt-head-justify,\r\n  table.dataTable tfoot td.dt-head-justify {\r\n    text-align: justify; }\r\n  table.dataTable thead th.dt-head-nowrap,\r\n  table.dataTable thead td.dt-head-nowrap,\r\n  table.dataTable tfoot th.dt-head-nowrap,\r\n  table.dataTable tfoot td.dt-head-nowrap {\r\n    white-space: nowrap; }\r\n  table.dataTable tbody th.dt-body-left,\r\n  table.dataTable tbody td.dt-body-left {\r\n    text-align: left; }\r\n  table.dataTable tbody th.dt-body-center,\r\n  table.dataTable tbody td.dt-body-center {\r\n    text-align: center; }\r\n  table.dataTable tbody th.dt-body-right,\r\n  table.dataTable tbody td.dt-body-right {\r\n    text-align: right; }\r\n  table.dataTable tbody th.dt-body-justify,\r\n  table.dataTable tbody td.dt-body-justify {\r\n    text-align: justify; }\r\n  table.dataTable tbody th.dt-body-nowrap,\r\n  table.dataTable tbody td.dt-body-nowrap {\r\n    white-space: nowrap; }\r\n \r\ntable.dataTable,\r\ntable.dataTable th,\r\ntable.dataTable td {\r\n  box-sizing: content-box; }\r\n \r\n\/*\r\n * Control feature layout\r\n *\/\r\n.dataTables_wrapper {\r\n  position: relative;\r\n  clear: both;\r\n  *zoom: 1;\r\n  zoom: 1; }\r\n  .dataTables_wrapper .dataTables_length {\r\n    float: left; }\r\n  .dataTables_wrapper .dataTables_filter {\r\n    float: right;\r\n    text-align: right; }\r\n    .dataTables_wrapper .dataTables_filter input {\r\n      margin-left: 0.5em; }\r\n  .dataTables_wrapper .dataTables_info {\r\n    clear: both;\r\n    float: left;\r\n    padding-top: 0.755em; }\r\n  .dataTables_wrapper .dataTables_paginate {\r\n    float: right;\r\n    text-align: right;\r\n    padding-top: 0.25em; }\r\n    .dataTables_wrapper .dataTables_paginate .paginate_button {\r\n      box-sizing: border-box;\r\n      display: inline-block;\r\n      min-width: 1.5em;\r\n      padding: 0.5em 1em;\r\n      margin-left: 2px;\r\n      text-align: center;\r\n      text-decoration: none !important;\r\n      cursor: pointer;\r\n      *cursor: hand;\r\n      color: white !important;\r\n      border: 1px solid transparent;\r\n      border-radius: 2px; }\r\n      .dataTables_wrapper .dataTables_paginate .paginate_button.current, .dataTables_wrapper .dataTables_paginate .paginate_button.current:hover {\r\n        color: white !important;\r\n        border: 1px solid #37393b;\r\n        background-color: #c3c5c8;\r\n        background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #c3c5c8), color-stop(100%, #797d83));\r\n        \/* Chrome,Safari4+ *\/\r\n        background: -webkit-linear-gradient(top, #c3c5c8 0%, #797d83 100%);\r\n        \/* Chrome10+,Safari5.1+ *\/\r\n        background: -moz-linear-gradient(top, #c3c5c8 0%, #797d83 100%);\r\n        \/* FF3.6+ *\/\r\n        background: -ms-linear-gradient(top, #c3c5c8 0%, #797d83 100%);\r\n        \/* IE10+ *\/\r\n        background: -o-linear-gradient(top, #c3c5c8 0%, #797d83 100%);\r\n        \/* Opera 11.10+ *\/\r\n        background: linear-gradient(to bottom, #c3c5c8 0%, #797d83 100%);\r\n        \/* W3C *\/ }\r\n      .dataTables_wrapper .dataTables_paginate .paginate_button.disabled, .dataTables_wrapper .dataTables_paginate .paginate_button.disabled:hover, .dataTables_wrapper .dataTables_paginate .paginate_button.disabled:active {\r\n        cursor: default;\r\n        color: #666 !important;\r\n        border: 1px solid transparent;\r\n        background: transparent;\r\n        box-shadow: none; }\r\n      .dataTables_wrapper .dataTables_paginate .paginate_button:hover {\r\n        color: white !important;\r\n        border: 1px solid #9fa3a8;\r\n        background-color: #eaebec;\r\n        background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #eaebec), color-stop(100%, #9fa3a8));\r\n        \/* Chrome,Safari4+ *\/\r\n        background: -webkit-linear-gradient(top, #eaebec 0%, #9fa3a8 100%);\r\n        \/* Chrome10+,Safari5.1+ *\/\r\n        background: -moz-linear-gradient(top, #eaebec 0%, #9fa3a8 100%);\r\n        \/* FF3.6+ *\/\r\n        background: -ms-linear-gradient(top, #eaebec 0%, #9fa3a8 100%);\r\n        \/* IE10+ *\/\r\n        background: -o-linear-gradient(top, #eaebec 0%, #9fa3a8 100%);\r\n        \/* Opera 11.10+ *\/\r\n        background: linear-gradient(to bottom, #eaebec 0%, #9fa3a8 100%);\r\n        \/* W3C *\/ }\r\n      .dataTables_wrapper .dataTables_paginate .paginate_button:active {\r\n        outline: none;\r\n        background-color: #babdc0;\r\n        background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #babdc0), color-stop(100%, #9a9ea3));\r\n        \/* Chrome,Safari4+ *\/\r\n        background: -webkit-linear-gradient(top, #babdc0 0%, #9a9ea3 100%);\r\n        \/* Chrome10+,Safari5.1+ *\/\r\n        background: -moz-linear-gradient(top, #babdc0 0%, #9a9ea3 100%);\r\n        \/* FF3.6+ *\/\r\n        background: -ms-linear-gradient(top, #babdc0 0%, #9a9ea3 100%);\r\n        \/* IE10+ *\/\r\n        background: -o-linear-gradient(top, #babdc0 0%, #9a9ea3 100%);\r\n        \/* Opera 11.10+ *\/\r\n        background: linear-gradient(to bottom, #babdc0 0%, #9a9ea3 100%);\r\n        \/* W3C *\/\r\n        box-shadow: inset 0 0 3px #111; }\r\n    .dataTables_wrapper .dataTables_paginate .ellipsis {\r\n      padding: 0 1em; }\r\n  .dataTables_wrapper .dataTables_processing {\r\n    position: absolute;\r\n    top: 50%;\r\n    left: 50%;\r\n    width: 100%;\r\n    height: 40px;\r\n    margin-left: -50%;\r\n    margin-top: -25px;\r\n    padding-top: 20px;\r\n    text-align: center;\r\n    font-size: 1.2em;\r\n    background-color: white;\r\n    background: -webkit-gradient(linear, left top, right top, color-stop(0%, rgba(57, 61, 67, 0)), color-stop(25%, rgba(57, 61, 67, 0.9)), color-stop(75%, rgba(57, 61, 67, 0.9)), color-stop(100%, rgba(255, 255, 255, 0)));\r\n    background: -webkit-linear-gradient(left, rgba(57, 61, 67, 0) 0%, rgba(57, 61, 67, 0.9) 25%, rgba(57, 61, 67, 0.9) 75%, rgba(57, 61, 67, 0) 100%);\r\n    background: -moz-linear-gradient(left, rgba(57, 61, 67, 0) 0%, rgba(57, 61, 67, 0.9) 25%, rgba(57, 61, 67, 0.9) 75%, rgba(57, 61, 67, 0) 100%);\r\n    background: -ms-linear-gradient(left, rgba(57, 61, 67, 0) 0%, rgba(57, 61, 67, 0.9) 25%, rgba(57, 61, 67, 0.9) 75%, rgba(57, 61, 67, 0) 100%);\r\n    background: -o-linear-gradient(left, rgba(57, 61, 67, 0) 0%, rgba(57, 61, 67, 0.9) 25%, rgba(57, 61, 67, 0.9) 75%, rgba(57, 61, 67, 0) 100%);\r\n    background: linear-gradient(to right, rgba(57, 61, 67, 0) 0%, rgba(57, 61, 67, 0.9) 25%, rgba(57, 61, 67, 0.9) 75%, rgba(57, 61, 67, 0) 100%); }\r\n  .dataTables_wrapper .dataTables_length,\r\n  .dataTables_wrapper .dataTables_filter,\r\n  .dataTables_wrapper .dataTables_info,\r\n  .dataTables_wrapper .dataTables_processing,\r\n  .dataTables_wrapper .dataTables_paginate {\r\n    color: white; }\r\n  .dataTables_wrapper .dataTables_scroll {\r\n    clear: both; }\r\n    .dataTables_wrapper .dataTables_scroll div.dataTables_scrollBody {\r\n      *margin-top: -1px;\r\n      -webkit-overflow-scrolling: touch; }\r\n      .dataTables_wrapper .dataTables_scroll div.dataTables_scrollBody > table > thead > tr > th, .dataTables_wrapper .dataTables_scroll div.dataTables_scrollBody > table > thead > tr > td, .dataTables_wrapper .dataTables_scroll div.dataTables_scrollBody > table > tbody > tr > th, .dataTables_wrapper .dataTables_scroll div.dataTables_scrollBody > table > tbody > tr > td {\r\n        vertical-align: middle; }\r\n      .dataTables_wrapper .dataTables_scroll div.dataTables_scrollBody > table > thead > tr > th > div.dataTables_sizing,\r\n      .dataTables_wrapper .dataTables_scroll div.dataTables_scrollBody > table > thead > tr > td > div.dataTables_sizing, .dataTables_wrapper .dataTables_scroll div.dataTables_scrollBody > table > tbody > tr > th > div.dataTables_sizing,\r\n      .dataTables_wrapper .dataTables_scroll div.dataTables_scrollBody > table > tbody > tr > td > div.dataTables_sizing {\r\n        height: 0;\r\n        overflow: hidden;\r\n        margin: 0 !important;\r\n        padding: 0 !important; }\r\n  .dataTables_wrapper.no-footer .dataTables_scrollBody {\r\n    border-bottom: 1px none #111111; }\r\n  .dataTables_wrapper.no-footer div.dataTables_scrollHead table.dataTable,\r\n  .dataTables_wrapper.no-footer div.dataTables_scrollBody > table {\r\n    border-bottom: none; }\r\n  .dataTables_wrapper:after {\r\n    visibility: hidden;\r\n    display: block;\r\n    content: \"\";\r\n    clear: both;\r\n    height: 0; }\r\n \r\n@media screen and (max-width: 767px) {\r\n  .dataTables_wrapper .dataTables_info,\r\n  .dataTables_wrapper .dataTables_paginate {\r\n    float: none;\r\n    text-align: center; }\r\n  .dataTables_wrapper .dataTables_paginate {\r\n    margin-top: 0.5em; } }\r\n@media screen and (max-width: 640px) {\r\n  .dataTables_wrapper .dataTables_length,\r\n  .dataTables_wrapper .dataTables_filter {\r\n    float: none;\r\n    text-align: center; }\r\n  .dataTables_wrapper .dataTables_filter {\r\n    margin-top: 0.5em; } }");
        //Source: https://datatables.net/manual/styling/theme-creator
        //Config:
        //	Table section border: 	None
        //	Row / cell border: 		None
        //	Row Background: 		#393d43
        //	Row selected: 			#324b68
        //	Control text: 			#ffffff
        //	Paging button active: 	#797d83
        //	Paging button hover: 	#9fa3a8
        //Note: Also need to replace all "url("../" with "url("http://datatables.net/media/" from the output, otherwise the column sort icons won't appear
    };

    function getToWork () {
        var outputElement = document.getElementsByClassName("xlrtab-table")[0].rows[1].cells[0];
        var outputText = outputElement.innerText;
        var outputType = determineGetType();
        var equipType = determineEquipmentType(outputText, outputType);
        if (!equipType) {return};

        var equipTypeFunction = {
            "6500" : parse6500,
            "1830" : parse1830,
        };
        loadDataTables(equipTypeFunction[equipType](outputText, outputType));
    };

    function loadDataTables (response) {
        var element = document.getElementsByClassName("xlrtab-table")[0].rows[1].cells[0];
        element.innerText = "";
        var newTable = document.createElement("table");
        var newTableHeader = document.createElement("thead");
        var newTableBody = document.createElement("tbody");
        newTable.classList.add("compact");
        newTable.appendChild(newTableHeader);
        newTable.appendChild(newTableBody);
        newTable.id = "DataTablesTable";
        element.insertAdjacentElement("afterbegin", newTable);

        const maxPageLength = 500;
        var pagingOption = false;
        var optSearchDelay = 0;
        if (response.table.length > maxPageLength) {
            pagingOption = true;
            optSearchDelay = 500; //in ms. Want to prevent a immediate redraw from every single keypress
        };

        var APIOptions = {
            columns: formatHeaderAsJSON(response.headers),
            data: response.table,
            order: [[response.sortColumn, response.sortDirection]],
            createdRow: response.callback,
            paging: pagingOption,
            pageLength: maxPageLength,
            lengthMenu: [[50, 100, 250, 500, 1000, 2000, 3000, 4000, -1, -1], [50, 100, 250, 500, 1000, 2000, "*3,000", "*4,000", "*All", "* Not recommended"]],
            pagingType: "full_numbers",
            processing: true,
            buttons: [
                "csv",
                "copy",
                {
                    text : "Raw",
                    action : copyRaw,
                }
            ],
            dom: 'Blfrtip', //pure fucking magic
            search : {
                regex : true,
            },
            responsive : true,
            searchDelay: optSearchDelay,
            initComplete: undefined,
        };
        var API = jQuery("#DataTablesTable").DataTable(APIOptions);
        zDAF = {
            API : API,
            response: response,
        };
        addColumnSearch(optSearchDelay);

        function addColumnSearch (searchDelay) {
            jQuery("#DataTablesTable thead tr").clone(false).appendTo("#DataTablesTable thead");
            jQuery("#DataTablesTable thead tr:eq(1) th").each( function (i) {
                var title = jQuery(this).text();
                jQuery(this).html("<input type=\"text\" placeholder=\"Search ".concat(title, "\"", " style=\"width:inherit\">"));

                jQuery( 'input', this ).on( 'keyup change', function () {
                    if (zDAF.API.column(i).search() == this.value ) {return};
                    zDAF.API.column(i).search(this.value, true, false, true).draw(); //regex=true, smart=false, caseInensitive=true
                }
                                          );
            }
                                                             );
        };
        function copyRaw () {
            GM_setClipboard(response.rawInput);
        };
    };


    function parse6500 (input, inputType) {
        var response = {
            headers : [],
            sortColumn : "",
            sortDirection : "",
            callback : "",
            table: [],
            rawInput: input,
        };
        input = input.split("\r\n");

        var output = [];
        for (var i = 0; i < input.length; i++){
            var value = input[i];
            if (value.search(",") > 0 && input[i-1].match(/[A-Z]\s{1,3}\d{3,12}\sREPT\s[A-Z]{1,8}\s[A-Z]{1,12}/) == null){
                output.push(value);
            };
        };

        var inputTypeFunction = {
            "alarms": function () {parseAlarms()},
            "pms": function () {parsePMs()},
            "inventory": function () {parseInventory()},
            "alarmHistory": function () {parseAlarmHistory()}
        };
        inputTypeFunction[inputType]();

        function parseAlarms () {
            response.headers = ["TID", "Unit", "Class", "Severity", "Service", "Time", "Description", "Additional Information", "Location", "Direction", "Condition", "PortMode"];
            response.sortColumn = 5;
            response.sortDirection = "desc";
            response.callback = function alarmStyling (row, data, dataIndex, cells) {
                var severityColor = {
                    CR : "darkred",
                    MJ : "darkred",
                    MN : "darkorange",
                    WN : "light-blue",
                }
                cells[3].style.backgroundColor = severityColor[data[3]];
            };;

            var TID = window.location.href.match(/(?<=tid\=).*?(?=&)/);
            for (i = 0; i < output.length; i++){
                //Headers
                var line = output[i];
                var data = {
                    TID : TID,
                    Unit : line.match(/(\w|-)*?(?=,)/),
                    Class : line.match(/(?<=(.*?,){1}).*?(?=:)/),
                    Severity : line.match(/(?<=(.*?,){1}.*?:).*?(?=,)/),
                    Service : line.match(/(?<=(.*?,){3}).*?(?=,)/),
                    TimeRaised : line.match(/(?<=(.*?,){5}).*?(?=,)/),
                    Description : line.match(/(?<=(.*?,){7}.*?:).*?(?=,)/),
                    AdditionalInformation : line.match(/(?<=ADDITIONALINFO\=).*?(?=,|$)/),
                    Location : line.match(/(?<=(.*?,){6}).*?(?=,)/),
                    Direction : line.match(/(?<=(.*?,){7}).*?(?=:)/),
                    Condition : line.match(/(?<=(.*?,){2}).*?(?=,)/),
                    PortMode : line.match(/(?<=MODE\=).*?(?=,|$)/),
                    date : line.match(/(?<=(.*?,){4}).*?(?=,)/), //non-header; parsing variable only
                    year : line.match(/(?<=YEAR\=)\d{4}/), //non-header; parsing variable only
                }

                for (var key in data){
                    data[key] = (data[key] == null)? "" : data[key][0]
                };

                if(data.TimeRaised && data.date && data.year){
                    data.TimeRaised = data.year + "-" + data.date + ", " + data.TimeRaised.replaceAll("-", ":")
                };
                output[i] = [data.TID, data.Unit, data.Class, data.Severity, data.Service, data.TimeRaised, data.Description, data.AdditionalInformation, data.Location, data.Direction, data.Condition, data.PortMode];

            };
            response.table = output;
        };
        function parsePMs() {
            response.headers = ["Name", " Location", " Direction", " Interval", "Monitor Type", " Value"];
            response.sortColumn = 4
            response.sortDirection = "asc";

            for (i = 0; i < output.length; i++){
                var line = output[i];
                var data = {
                    Name : line.match(/(\w|-)*?(?=,)/),
                    Location : line.match(/(?<=(.*?,){4}).*?(?=,)/),
                    Direction : line.match(/(?<=(.*?,){5}).*?(?=,)/),
                    Interval : line.match(/(?<=(.*?,){6}).*?(?=,)/),
                    MonitorType : line.match(/(?<=(.*?,){1}.*?:).*?(?=,)/),
                    Value : line.match(/(?<=(.*?,){2}).*?(?=,)/),
                }
                for (var key in data){
                    data[key] = (data[key] == null)? "" : data[key][0]
                };

                data.Location = data.Location.replace("NEND", "Near End");
                data.Location = data.Location.replace("FEND", "Far End");
                data.Direction = data.Direction.replace("TRMT", "Transmit");
                data.Direction = data.Direction.replace("RCV", "Receive");

                output[i] = [data.Name, data.Location, data.Direction, data.Interval, data.MonitorType, data.Value];
            };
            response.table = output;

        };
        function parseInventory () {
            response.headers = ["Shelf", " Slot", "Slot Type", " Card Type", "PEC", "Release", "Card Width", "CLEI", "Serial", "Mfr Date", "Age", "On Since", "Current Temp", "Avg Temp", "Additional Information"];
            response.sortColumn = 1
            response.sortDirection = "asc";

            const colShelf_Slot_Port_Type = 0;

            for (i = 0; i < output.length; i++){
                var line = output[i];
                var data = {
                    Shelf : line.match(/(?<=(\w)*-)\d*(?=-)/),
                    Slot : line.match(/(?<=(\w)*-).*?(?=::)/),
                    SlotType : null,
                    CardType : line.match(/(?<=CTYPE\=).*?(?=,|$)/),
                    PEC : line.match(/(?<=PEC\=).*?(?=,|$)/),
                    Release : line.match(/(?<=REL\=).*?(?=,|$)/),
                    CardWidth : line.match(/(?<=WIDTH\=).*?(?=,|$)/),
                    CLEI : line.match(/(?<=CLEI\=).*?(?=,|$)/),
                    Serial :  line.match(/(?<=SERIAL\=).*?(?=,|$)/),
                    MfrDate : line.match(/(?<=MDAT\=).*?(?=,|$)/),
                    Age : line.match(/(?<=AGE\=).*?(?=,|$)/),
                    OnSince : line.match(/(?<=ONSC\=).*?(?=,|$)/),
                    CurrentTemp : line.match(/(?<=TCUR\=).*?(?=,|$)/),
                    AverageTemp : line.match(/(?<=TAVG\=).*?(?=,|$)/),
                    AdditionalInformation : line.match(/(?<=CARDPWR\=).*?(?=,|$)/),
                    CardType1 : line.match(/(?<=(.*?,){1}).*?(?=,)/), //non-header; parsing variable only
                    CardType2 : line.match(/(?<=(.*?,){2}).*?(?=,)/), //non-header; parsing variable only
                };

                for (var key in data){
                    data[key] = (data[key] == null)? "" : data[key][0]
                };

                if (data.CardType1.length > 0 && data.CardType1.search("=") < 0){ // If this is a port instead of a card
                    data.SlotType = data.CardType;
                    data.CardType = data.CardType + ", " + data.CardType1 + ", " + data.CardType2;
                } else {
                    data.SlotType = "Card";
                };

                if (data.AdditionalInformation == "FULL"){
                    data.AdditionalInformation = "CARDPWR=FULL";
                };

                output[i] = [data.Shelf, data.Slot, data.SlotType, data.CardType, data.PEC, data.Release, data.CardWidth, data.CLEI, data.Serial, data.MfrDate, data.Age, data.OnSince, data.CurrentTemp, data.AverageTemp, data.AdditionalInformation];
            };
            response.table = output;
                        console.log(response.table);

        };

        function parseAlarmHistory () {
            response.headers = ["Unit", "Class", "SA  ", "Service", "Description", "TimeRaised", "TimeCleared", "DateTime", "Location", "Direction", "Condition", "PortMode", "CLFI"];
            response.sortColumn = 7;
            response.sortDirection = "desc";
            response.callback = function alarmStyling (row, data, dataIndex, cells) {
                var severityColor = {
                    CR : "darkred",
                    MJ : "darkred",
                    MN : "darkorange",
                    WN : "light-blue",
                }
                cells[2].style.backgroundColor = severityColor[data[2]];
            };
            for (i = 0; i < output.length; i++){
                var line = output[i];
                var data = {
                    Unit : line.match(/(?<=SUBTYPE\=.*?:).*?(?=:)/),
                    Class : line.match(/(?<=SUBTYPE\=).*?(?=:)/),
                    Severity : null,
                    Service : null,
                    Description : null,
                    TimeRaised : null,
                    TimeCleared : null,
                    DateTime : null,
                    Location : null,
                    Direction : null,
                    Condition : null,
                    PortMode : line.match(/(?<=MODE\=).*?(?=,|$)/),
                    CLFI : line.match(/(?<=CLFI\=).*?(?=,|$)/),
                    messageType : line.match(/(?<=MSGTYPE\=).*?(?=,|$)/), //non-header; parsing variable only
                    year : line.match(/(?<=YEAR\=).*?(?=,|$)/), //non-header; parsing variable only
                    date : null, //non-header; parsing variable only
                    time : null, //non-header; parsing variable only
                }
                if(data.messageType){data.messageType = data.messageType[0]};
                if (data.messageType == "EVT"){
                    data.Severity = ["Log"];
                    data.Service = ["NSA"];
                    data.Description = line.match(/(?<=(.*?,){10}).*?(?=:)/);
                    data.TimeRaised = null;
                    data.TimeCleared = null;
                    data.Location = line.match(/(?<=(.*?,){6}).*?(?=,)/);
                    data.Direction = line.match(/(?<=(.*?,){7}).*?(?=,)/);
                    data.Condition = line.match(/(?<=(.*?,){10}.*?:).*?(?=(:|,))/);
                    data.date = line.match(/(?<=(.*?,){4}).*?(?=,)/);
                    data.time = line.match(/(?<=(.*?,){5}).*?(?=,)/);
                    data = resolveData(data);
                    switch (data.Description){
                        case "15-MIN":
                            data.Description = "15-Min Threshold Crossing"
                            break;
                        case "1-DAY":
                            data.Description = "1-Day Threshold Crossing";
                            break;
                        case "1-UNT":
                            data.Description = "Untimed Threshold Crossing";
                            break;
                        default:
                            data.Description = data.Condition
                    };
                } else if (data.messageType == "ALM"){
                    data.Severity = line.match(/(?<=(.*?,){2}.*?:.*?:).*?(?=,)/);
                    data.Service = line.match(/(?<=(.*?,){4}).*?(?=,)/);
                    data.Description = line.match(/(?<=(.*?,){8}.*?:).*?(?=,)/);
                    data.Location = line.match(/(?<=(.*?,){7}).*?(?=,)/);
                    data.Direction = line.match(/(?<=(.*?,){8}).*?(?=:)/);
                    data.Condition = line.match(/(?<=(.*?,){3}).*?(?=,)/);
                    data.date = line.match(/(?<=(.*?,){5}).*?(?=,)/);
                    data.time = line.match(/(?<=(.*?,){6}).*?(?=,)/);
                    data = resolveData(data);

                    if (data.Severity == "CL"){
                        data.TimeCleared = data.DateTime
                    } else {
                        data.TimeRaised = data.DateTime
                    };
                };

                function resolveData (data) { //String.match()  returns an array, not the match
                    for (var key in data){
                        data[key] = (data[key] == null)? "" : data[key][0]
                    };
                    if(data.time && data.date && data.year){
                        data.DateTime = data.year + "-" + data.date + ", " + data.time.replaceAll("-", ":")
                    };
                    return data;
                };

                output[i] = [data.Unit, data.Class, data.Severity, data.Service, data.Description, data.TimeRaised, data.TimeCleared, data.DateTime, data.Location, data.Direction, data.Condition, data.PortMode, data.CLFI]
            };
            response.table = output;
        };


        return response;
    };

    function parse1830 (input, inputType) {
        var response = {
            headers : [],
            sortColumn : "",
            sortDirection : "",
            callback : "",
            table: [],
            rawInput: input,
        };
        input = input.split("\r\n");
        input.shift();

        var output = [];
        for (var i = 0; i < input.length; i++){
            if (input[i].search(",") >= 0){
                output.push(input[i].split(/[,]/));
            };
        };

        var inputTypeFunction = {
            "alarms": function () {parseAlarms()},
            "pms": function () {parsePMs()},
            "inventory": function () {parseInventory()},
            "alarmHistory": function () {parseAlarmHistory()}
        };

        inputTypeFunction[inputType]();
        function parseAlarms () {
            response.headers = ["TID", "Time*", "Source", "Category", "Severity", "Description", "Condition", "SA"];
            response.sortColumn = 7;
            response.sortDirection = "asc";
            response.callback = alarmStyling;
            for (var i = 0; i < output.length; i++){
                const colClass_Source = 0;
                const colCategory_Severity = 1;
                const colCondition = 2;
                const colSA = 3;
                const colDate = 4;
                const colTime = 5;
                const colLocation = 6;
                const colDirection_Description = 7;

                var line = output[i];
                var Time = "";
                var Source = "";
                var Category = "";
                var Severity = "";
                var Description = "";
                var Condition = line[colCondition];
                var SA = line[colSA];

                Time = "YEAR-" + line[colDate] + ", " + line[colTime].replace(/[-]/g, ":");
                Source = line[colClass_Source].slice(line[colClass_Source].search("-") + 1).replace(/[-]/g, "/");
                Category = line[colCategory_Severity].split(":")[0];
                Severity = line[colCategory_Severity].split(":")[1];
                switch (Severity){
                    case "MN":
                        Severity = "Minor";
                        break;
                    case "MJ":
                        Severity = "Major";
                        break;
                    case "CR":
                        Severity = "Critical";
                        break;
                };
                Description = line[colDirection_Description].split(":")[1];
                output[i] = [Time, Source, Category, Severity, Description, Condition, SA];
            };
            response.table = addTID(output, document.getElementsByClassName("cell-top")[0].innerText.split(" ")[0]);
        };
        function parseAlarmHistory () {
            //zDaf just pulls current alarms when you pull historicals
            parseAlarms();
        };
        function parsePMs () {
            response.headers = ["Name", "Location", "Direction", "Interval", "Monitor Type", "Value"];
            response.sortColumn = 4;
            response.sortDirection = "asc";
            for (var i = 0; i < output.length; i++){
                const colMode_Port = 0;
                const colMode_Parameter = 1;
                const colValue = 2;
                const colLocation = 4;
                const colDirection = 5;
                const colInterval = 6;

                var line = output[i];
                var Name = "";
                var MonitorType = "";
                var Location = line[colLocation];
                var Direction = line[colDirection];
                var Interval = line[colInterval];
                var Value = line[colValue];

                Name = line[colMode_Port].slice(line[colMode_Port].search("-") + 1);
                MonitorType = line[colMode_Parameter].slice(line[colMode_Parameter].search(":") + 1);

                output[i] = [Name, Location, Direction, Interval, MonitorType, Value];
            };
            response.table = output;
        };
        function parseInventory () {
            response.headers = ["Slot", "State", "Name", "Type", "Temp", "Temp High Thresh.", "Temp Low Thresh."];
            response.sortColumn = 0;
            response.sortDirection = "asc";
            for (var i = 0; i < output.length; i++){
                const colSlot_Description = 0;

                var line = output[i];
                var Slot = "";
                var State = "";
                var Name = "";
                var Type = "";
                var TempCurrent = "";
                var TempHighThreshold = "";
                var TempLowThreshold = "";

                Slot = line[colSlot_Description].slice(line[colSlot_Description].search("-") + 1, line[colSlot_Description].search(":"));
                var lastParam = line[line.length - 1];
                if (lastParam.search(":") >= 0){
                    State = lastParam.split(":")[1];
                } else {
                    var secondToLastParam = line[line.length - 2];
                    switch (lastParam){
                        case "STBY":
                            secondToLastParam = secondToLastParam.split(":")[1];
                            State = State.concat(secondToLastParam, " ", "STBY");
                            break;
                        case "ACT":
                            secondToLastParam = secondToLastParam.split(":")[1];
                            State = State.concat(secondToLastParam, " ", "ACT");
                            break;
                        case "UEQ&UAS":
                            State = "UEQ";
                            break;
                    };
                };
                for (var j = 0; j < line.length; j++){
                    if (line[j].search("=") >= 0){
                        var data = line[j].split("=");
                        var attribute = data[0];
                        var value = data[1];
                        switch (attribute){
                            case "HIGHTEMPTH":
                                TempHighThreshold = value;
                                break;
                            case "LOWTEMPTH":
                                TempLowThreshold = value;
                                break;
                            case "ACTUALTYPE":
                                Type = value;
                                break;
                            case "NAME":
                                Name = value;
                                break;
                            case "TEMPERATURE":
                                TempCurrent = value;
                                break;
                        };
                    };
                };
                output[i] = [Slot, State, Name, Type, TempCurrent, TempHighThreshold, TempLowThreshold];
            };
            response.table = output;
        };
        function alarmStyling (row, data, dataIndex, cells) {
            var color;
            console.log(data);
            switch (data[4]) {
                case "Critical":
                    color = "darkred";
                    break;
                case "Major":
                    color = "darkred";
                    break;
                case "Minor":
                    color = "darkorange";
                    break;
                case "Warning":
                    color = "light-blue";
                    break;
            };
            cells[4].style.backgroundColor = color;
        };
        return response;
    };

    function createTableHTML (table) {
        var tableHTML = document.createElement("table");
        var tableHTMLHeader = document.createElement("thead");
        var tableHTMLHeaderRow = document.createElement("tr");
        var tableHTMLBody = document.createElement("tbody");

        for (var i = 0; i < table[0].length; i++){//Iterate through headers
            var headerCell = document.createElement("th");
            headerCell.innerText = table[0][i];
            tableHTMLHeaderRow.appendChild(headerCell);
        };
        tableHTMLHeader.appendChild(tableHTMLHeaderRow);
        tableHTML.appendChild(tableHTMLHeader);

        for (i = 1; i < table.length; i++){ //Iterate through the rest of the table
            var tableHTMLRow = document.createElement("tr");
            for (var j = 0; j < table[i].length; j++){
                var tableHTMLCell = document.createElement("td");
                tableHTMLCell.innerText = table[i][j];
                tableHTMLRow.appendChild(tableHTMLCell);
            };
            tableHTMLBody.appendChild(tableHTMLRow);
        };
        tableHTML.appendChild(tableHTMLBody);
        return tableHTML;
    };

    function formatHeaderAsJSON (headerArray) {
        var option = []
        for (var i = 0; i < headerArray.length; i++){
            option.push({"title" : headerArray[i]});
        };
        return option;
    };

    function determineEquipmentType (output, getType) {
        var TID = window.location.href.match(/(?<=tid\=).*?(?=&)/);
        if (TID == null){return undefined}else{TID=TID[0]};

        var systems = {
            1830 : /\w{8}L[STV]\d/,
            infinera : /\w{8}I[FA]\d{1,2}/,
            6500 : /\w{8}H[GVY]\d/,
            cyan : /\w{8}Y[ABCD](\d|[A-Z])/,
        }
        for (var key in systems){
            if(TID.match(systems[key])){
                return key;
            };
        };
        console.log("You fucked up if you got this far");
        return undefined;
    };

    function determineGetType () {
        var getText = document.getElementsByClassName("cell-top")[0].firstElementChild.innerText;
        if (getText.search("GET-ALARMS") >= 0){
            return "alarms";
        }else if (getText.search("GET-PMS") >= 0){
            return "pms";
        }else if (getText.search("GET-INVENTORY") >= 0){
            return "inventory";
        }else if (getText.search("GET-ALARM-HISTORY") >= 0){
            return "alarmHistory";
        };
    };
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Collapsed Tool Functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function clpsToolInit () {
        clpsTool.i = 0;
        clpsTool.downKeyEvent = createKeyEvent(40);
        clpsTool.time = {
            timeOut : 2000, //ms
        };
        clpsTool.searchList = [];
        clpsTool.finalEntry = function () {
            if (this.i >= this.searchList.length) {
                return true;
            } else {
                return false;
            };
        };
        var URLCID = decodeURIComponent(window.location.href.split("circuitID=")[1]).trim();
        if (URLCID !== "undefined"){clpsTool.searchList.push({circuit: URLCID}); loadCIDs()};
        addBulkCompareButton();

        function addBulkCompareButton () {
            var btnBulkCompare = document.createElement("input");
            btnBulkCompare.type = "button";
            btnBulkCompare.id = "btnBulkCompare";
            btnBulkCompare.value = "Bulk Compare";
            btnBulkCompare.className = "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only";
            btnBulkCompare.style.width = "auto";
            btnBulkCompare.onclick = bulkCompare;
            document.getElementsByClassName("ui-widget")[0].appendChild(btnBulkCompare);
        };
    };

    function bulkCompare () {
        clpsTool.bulkWindow = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes");
        clpsTool.bulkWindow.document.body.innerHTML = "<html><head><title>Bulk Collapsed Tool Compare<\/title>\r\n    \r\n    <style type=\"text\/css\">\r\n        .:active{\r\n            box-shadow: 0 0 2px 0px black;\r\n        }\r\n        th{\r\n            text-align: center;\r\n            font-weigth: bold;\r\n        }\r\n        table, td, tr, input{\r\n            width:100%;\r\n        }\r\n        textarea{\r\n            width: 100%;\r\n            rows: 20;\r\n           -webkit-box-sizing: border-box;\r\n           -moz-box-sizing: border-box;\r\n           box-sizing: border-box;\r\n        }\r\n        .button{\r\n            width: auto;\r\n            background: #e6e6e6 url(images\/ui-bg_glass_75_e6e6e6_1x400.png) 50% 50% repeat-x;\r\n            border-radius: 4px;\r\n        };\r\n        .inputs{\r\n            display: unset;\r\n        }\r\n        .results{\r\n            display: none;\r\n        };\r\n    <\/style>\r\n<\/head>\r\n    <body>\r\n         <table class=\"input\">\r\n                <tbody><tr>\r\n                    <th>\r\n                            Bulk Collapsed Tool Compare\r\n                    <\/th>\r\n                    \r\n                <\/tr>\r\n                <tr>\r\n                    <td>\r\n                        Each line represents a single circuit ID\r\n                    <\/td>\r\n                <\/tr>\r\n                <tr>\r\n                    <td>\r\n                        <textarea id=\"collapsedBulkTxtArea\" rows=\"20\"><\/textarea>\r\n                    <\/td>\r\n                <\/tr><tr>\r\n                    <td>\r\n                        Facility to compare against:\r\n                    <\/td>\r\n                <\/tr>\r\n                \r\n                <tr>\r\n                    <td>\r\n                        <input id=\"collapsedFacility\" placeholder=\"102  \/FIBER \/BOISIDWKIF1\/SLKDUTTXIF1\">\r\n                <\/td><\/tr><tr>\r\n                    <td>\r\n                        <input type=\"button\" value=\"Compare\" id=\"btnCollapsedCompare\" class=\"button\">\r\n                    <\/td>\r\n                <\/tr>\r\n        <\/tbody><\/table>\r\n    <table class=\"results\">\r\n    <tbody>\r\n        <tr>\r\n            <th>\r\n                Results\r\n            <\/th>\r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                <textarea id=\"collapsedReults\"><\/textarea>\r\n            <\/td>\r\n        <\/tr>\r\n        <tr>\r\n            <td>\r\n                <input type=\"button\" value=\"Requery Failures\" id=\"btnCollapsedRetry\" class=\"button\">\r\n                <input type=\"button\" value=\"Change Faclity\" id=\"btnChangeFacility\" class=\"button\">\r\n                <input type=\"button\" value=\"Back\" id=\"btnCollapsedBack\" class=\"button\">\r\n                \r\n            <\/td>\r\n        <\/tr>\r\n<\/tbody><\/table>\r\n<\/body><\/html>";

        clpsTool.bulkWindow.resizeTo(clp("collapsedFacility").offsetWidth + 50, clpsTool.bulkWindow.document.body.scrollHeight + 100);
        clp("btnCollapsedCompare").onclick = function () {
            parseBulkInput(clpsTool.bulkWindow);
            loadCIDs();
        };

        function clp(elementID){
            return clpsTool.bulkWindow.document.getElementById(elementID);
        };

        function parseBulkInput () {
            var bulk = clp("collapsedBulkTxtArea").value;
            bulk = bulk.split("\n");

            for (var i = 0; i < bulk.length; i++){
                bulk[i] = bulk[i].trim();
                bulk[i] = bulk[i].replace("\/ \/ZYO", "");
                bulk[i] = bulk[i].replace("\/\/ZYO", "");
                if (bulk[i] == ""){
                    bulk.splice(i,1);
                    i--
                };
                clpsTool.searchList.push({circuit: bulk[i]});
            };
        };
    };


    function loadCIDs () { //Main loop triggered by either the init function, or the mutation observer
        console.log("beginLoad");
        window.clearInterval(clpsTool.time.timeOutIntervalID); //Clear the continuous checking for search Timeout, if present.
        if (clpsTool.finalEntry()) {cleanUp();return;};

        var searchBar = $("circuit-search");
        searchBar.value = clpsTool.searchList[clpsTool.i].circuit;
        clpsTool.i++
        clpsTool.time.lastIteration = Date.now();
        clpsTool.observer = new MutationObserver(clpsObservationHandler);

        searchBar.dispatchEvent(clpsTool.downKeyEvent);
        console.log("dispatchKeyEvent");
        clpsTool.time.timeOutIntervalID = window.setInterval(searchTimeOutCheck, 100);
        console.log("setInterval");
        clpsTool.observer.observe($("ui-id-1"), {childList:true});
        console.log("Observing...");

        function clpsObservationHandler (mutations) { //This is fired everytime there's a mutation to the list of results
            console.log("MutationObserved");
            console.log(mutations);
            clpsTool.observer.disconnect(); //Stop observing
            document.getElementsByTagName("a")[0].click(); //Click on the first result, adding it to the compare list
            clpsTool.searchList[clpsTool.i - 1].element = document.getElementsByTagName("p")[document.getElementsByTagName("p").length -1]; //Add an "element" key to our searchList JSON array for correlation
            loadCIDs(); //Carry on with the next one

        };
        function searchTimeOutCheck () {
            console.log("TimeOutCheck");
            if (Date.now() - clpsTool.time.lastIteration >= clpsTool.time.timeOut){ //If the time elapsed since last successful search is greated than the allowed time
                clpsTool.searchList[clpsTool.i-1].error = "Timed Out";
                window.clearInterval(clpsTool.time.timeOutIntervalID);
                clpsTool.observer.disconnect();
                loadCIDs(); //Carry on with the next one
            };
        };
        function cleanUp () {
            console.log("cleanup");
            $("compare-button").click();
            clpsTool.results = clpsTool.searchList;
            clpsTool.searchList = [];
            clpsTool.i = 0;
            clpsTool.observer.disconnect();
            if (clpsTool.callback) {clpsTool.callback()};
        };
    };

    function createKeyEvent (keycode){
        var keyboardEvent = document.createEvent("KeyboardEvent");
        var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
        keyboardEvent[initMethod]("keydown", true, true, document.defaultView, false, false, false, false, keycode, 0);
        return keyboardEvent;
    };
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Helper Functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function applyTheme (themeClassName){
        tblHTML.className = themeClassName;
    };

    function returnAllRowsWith (searchString, searchColumn){ //Returns type Array with indexes of rows that match the criteria. Note: it does not return the data in any cell and that all data in tblHTML will be off by 1 (tblData row 1 = tblHTML row 2)
        var rows = [];
        for (var i = 0; i < tblLength; i++){
            if (tblData[i][searchColumn].search(searchString) >= 0){
                rows.push(i);
            }
        };
        return rows;
    };

    function createCircuitLoadObserver () {
        loadingObserver = new MutationObserver(observationHandler);
        var observerOptions = {childList: true};
        loadingObserver.observe($("loading_indicator"), observerOptions);
        function observationHandler () {
            var loadingText = $("loading_indicator").innerText;
            if (loadingText.search("Retrieving data") >= 0){
                //firstLoad = false;
            }else{
                init();
            };
        };
    };

    function formattedTID (tid){
        return (tid.match(/^.*?(?=($|\W))/) !== null) ? tid.match(/^.*?(?=($|\W))/)[0] : tid;
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

    function $ (elementId) {
        return document.getElementById(elementId);
    };

    function isValidIP (IPAddress) {
        //Regex courtesy of https://www.w3resource.com/javascript/form/ip-address-validation.php
        IPAddress = IPAddress.trim();
        if (IPAddress !== "" && IPAddress.search(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/) >= 0){
            return (true);
        };
        return (false);
    };

    //function getValidOctets (octets) {
    //    var total = 0;
    //    for (var k = 0; k < octets.length; k++){
    //        if (isValidOctet(octets[k])){
    //            total++
    //        };
    //    };
    //    return total;
    //};
//
    //function isValidOctet (octet){
    //    if (parseInt(octet) >= 0 && parseInt(octet) <= 255 && octet.charAt(0) !== "0"){
    //        return true;
    //    };
    //    return false;
    //};
//
    //function isValidOctetArray (octetArray) {
    //    for (var currentOctet = 0; currentOctet < octetArray.length; currentOctet++){
    //        if (isValidOctet(octetArray[currentOctet]) == false){
    //            return false;
    //        };
    //    };
    //    return true;
    //};
//
    //function addDecimal (string, position){
    //    string = string.slice(0, position) + "." + string.slice(position, string.length);
    //    return string;
    //};
//
    //function calculateDualOctets(badOctet){
    //    var possibleOctets = []
    //    for (var pos = 1; pos < badOctet.length; pos ++){ //Iterate through the string, moving the decimal point over over each iteration and checking to see if the result is valid
    //        var currentAttempt = addDecimal(badOctet, pos);
    //        currentAttempt = currentAttempt.split("."); // Convert to array of possible octets (ie  ["1", "23123"])
    //        console.log(currentAttempt);
    //        if (isValidOctetArray(currentAttempt) == true){ //If our work did  anyting worthwhile
    //            possibleOctets.push([currentAttempt[0], currentAttempt[1]]); //Add it to the list of possible octets
    //        };
    //        if (possibleOctets.length == 2){
    //            return possibleOctets; //No sense in returning more than 2, since we can't display more than 1 IP address to the user
    //        };
    //    };
    //    return possibleOctets;
    //};
//
    //function calculateTripleOctets(badOctet){
    //    var possibleOctets = []
    //    for (var pos1 = 1; pos1 < badOctet.length - 3; pos1 ++){ //Iterate through the string, moving the decimal point over over each iteration and checking to see if the result is valid
    //        for (var pos2 = pos1 +2; pos2 < badOctet.length + 1; pos2++){
    //            var currentAttempt = addDecimal(badOctet, pos1); //Add first decimal (ie "20913340" becomes "2.0913340"
    //            currentAttempt = addDecimal(currentAttempt, pos2); //Add second decomal (ie "2.0913340" becomes "2.0.913340"
    //            currentAttempt = currentAttempt.split("."); // Convert to array of possible octets (ie  ["1", "231", "23"])
    //            //console.log(currentAttempt);
    //            if (isValidOctetArray(currentAttempt) == true){ //If our work did  anyting worthwhile
    //                possibleOctets.push([currentAttempt[0], currentAttempt[1], currentAttempt[2]]); //Add it to the list of possible octets
    //            };
    //            if (possibleOctets.length == 2){
    //                return possibleOctets; //No sense in returning more than 2, since we can't display more than 1 IP address to the user
    //            };
    //        };
    //    };
    //    return possibleOctets;
    //};
//
    //function calculateAllOctets(badOctet){
    //    var possibleOctets = []
    //    for (var pos1 = 1; pos1 < badOctet.length - 3; pos1 ++){ //Iterate through the string, moving the decimal point over over each iteration and checking to see if the result is valid
    //        for (var pos2 = pos1 +2; pos2 < badOctet.length + 1; pos2++){
    //            for (var pos3 = pos2 +2; pos3 < badOctet.length +2; pos3++){
    //                var currentAttempt = addDecimal(badOctet, pos1); //Add first decimal (ie "2091334040" becomes "2.091334040"
    //                currentAttempt = addDecimal(currentAttempt, pos2); //Add second decomal (ie "2.091334040" becomes "2.0.91334040"
    //                currentAttempt = addDecimal(currentAttempt, pos3); //Add second decomal (ie "2.0.91334040" becomes "2.0.9.1334040"
    //                currentAttempt = currentAttempt.split("."); // Convert to array of possible octets (ie  ["1", "231", "23"])
    //                //console.log(currentAttempt);
    //                if (isValidOctetArray(currentAttempt) == true){ //If our work did  anyting worthwhile
    //                    //console.log(currentAttempt);
    //                    possibleOctets.push(currentAttempt); //Add it to the list of possible octets
    //                };
    //                if (possibleOctets.length == 2){
    //                    return possibleOctets; //No sense in returning more than 2, since we can't display more than 1 IP address to the user
    //                };
    //            };
    //        };
    //    };
    //    console.log(possibleOctets.length);
    //    return possibleOctets;
    //};

    function applyStyleSheet (style, callback) {
        var styleSheet
        if(style.search("http") == 0){ //If this is a link to a StyleSheet
            styleSheet = document.createElement("link");
            styleSheet.href = style;
        } else { //If this is a StyleSheet
            styleSheet = document.createElement("style");
            styleSheet.innerHTML = style;
        };
        styleSheet.type = "text/css";
        document.body.appendChild(styleSheet);
        if (callback){
            callback();
        };
    };
function mySpecialCSS(){
    //document.getElementsByTagName("link")[1].remove();
    var myCSS = ".XES{\r\n}\r\n.nccLink{\r\n\toutline: 2px solid #324b68;\r\n}\r\n.actionIcon{\r\n\twidth: 16px;\r\n\theight: 16px;\r\n\tcursor: pointer;\r\n\tdisplay: inline-block;\r\n\tmargin-left: 3px;\r\n}\r\n.XES-hidden{\r\n\tdisplay: none;\r\n}\r\n.XES-badIP{\r\n\tcolor : red;\r\n}\r\n.XES-correctedIP{\r\n\tfont-style: italic;\r\n}\r\ndiv.loadOnPaste{\r\n\tbackground-color: unset;\r\n\tposition: relative;\r\n\ttop: 2.2rem;\r\n\ttransition: color 0.25s;\r\n}\r\nlabel.loadOnPaste{\r\n\tmargin-right: 0.25rem;\r\n\tcolor: unset !important;\r\n}\r\n.loadOnPaste:checked ~ label{\r\n\tcolor: #0075ff !important;\r\n}\r\n.loadOnPaste:unchecked ~label{\r\n\tcolor: unset !important;\r\n}";

    applyStyleSheet(myCSS);
};

})();