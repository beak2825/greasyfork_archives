// ==UserScript==
// @name         Filter, Highlight & Delete
// @namespace    https://github.com/erickRecai
// @version      1.04.07b
// @description  Highlights, Lowlights, or Deletes page elements based on their text.
// @author       guyRicky

// @match        *://*/*

// @exclude      *://docs.google.com/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012

// @licence      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/
// @licence      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/384685/Filter%2C%20Highlight%20%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/384685/Filter%2C%20Highlight%20%20Delete.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function () {
    'use strict';

    const scriptPrefix = "fhd-"; // for text elements excluding element classes.
    const classPrefix = "fhd-"; // exclusively for element classes.
    const scriptTag = "FHD"; // used to mark script sources in console log.

    let runScript = 1;
    runScript = getOptionState("enable-"+ scriptPrefix +"script", runScript);

    // = getOptionState(, );
    // used to update option if 'script option' is set.
    function getOptionState(idName, currentState) {
        if (document.getElementById(idName)) {
            return document.getElementById(idName).checked;
        }
        return currentState;
    }

    if (runScript) {

        if(0){/*

            == last update: 7/05/2020 ==
    
            ==  todo ==
    
            5. B2, (custom rules script), generate selector block from selectors made.
            10. C1, change autohide notifs to apply per notif, not to all notifs.
    
            ==== how it works =====================================================================|
    
            - checks for "block selectors" from current href.
            - if found and custom selectors are found (custom rules script), adds selectors set to list of selectors. 
    
            if there are block selectors
            checkBlocks() {
                foreach (selector set) {
                    checkblock() {
                        if (not checked previously) {
                            check against delete1
                            check against lowlight1
                            * check against short1
                            * check against short2
                            check against highlight1
                            check against highlight2
                            check other things
                            create notif if enabled.
                        }
                    } end checkblock()
                } end foreach (selector set)
                add 'checked' class to all checked elements
            } end checkBlocks()
    
            == other notes
            - applies checked marker to a block after a block is fully checked.
    
            ==== version log ======================================================================|
            == 1.04.07b ==
            - fullCheck on manual runs.
            == 1.04.07 ==
            - getOptionState()
            - retrieveLocalRules()
        */}

        if(0){/*
        
            ==== code markers =====================================================================|

            A0. console messages
            AA. filter lists
            AB. selectors by site list
            AC. script options
            
            AD. setting parent selectors block
            AE. main code start
            AF. script CSS
            AD. notif block

            BA. checkBlock()
            BB. checkBlocks()
            BC. checkRegex()
            BD. createNotif()

            CA. script execution block
            CB. script button
            ZZ. script end

        */}

        // ==== A0. console messages ==============================================================|
        // controls if messages are made to the browser's console.

        let enableLogMessages = 1; // set to 1 to show console messages, required to enable the following message rules.
        enableLogMessages = getOptionState("log-"+ scriptPrefix +"msg", enableLogMessages);

        let enabledMessages =
            "DLT|"+
            "LL1|"+
            //"-MA|"+ // all matches
            "selectors|"+

            "local-rules|"+
            //"secondText|"+
            "blockHref|"+

            "RUNT|"+ // run time messages.
            "EXEC|"+ // execution messages.
            "1"; // high priority messages.

        let logAll = 0; // if 1, logs all titles from blocks.
        logAll = getOptionState("log-"+ scriptPrefix +"all", logAll);
        if (logAll) {
            enabledMessages = enabledMessages.concat("|title");
        }
        const enabledMessagesRegex = new RegExp(enabledMessages,"i"); // used in consolelog().

        consolelog("#### ("+ scriptTag +") start. ####", "EXEC");

        // ==== AA. filter lists ==================================================================|
        let delete1, delete2, lowlight1, lowlight2, highlight1, highlight2;
        if (1) {

            // ==== AAA. delete1 ==================================================================|
            delete1 = [
                
            ];

            // ==== AAB. delete2 ==================================================================|
            delete2 = [
            
            ];

            // ==== AAC. lowlight1 ================================================================|
            //strong lowlight
            lowlight1 = [

            ];

            // ==== AAD. lowlight2 ================================================================|
            lowlight2 = [

            ];

            // ==== AAE. highlight1 ===============================================================|
            highlight1 = [
                /apple/i,
            ];

            // ==== AAF. highlight2 ===============================================================|
            highlight2 = [
            
            ];

            // ==== AAG. local rules ==============================================================|
           
            let localRules = retrieveLocalRules("Delete1");
            if (localRules) {
                delete1 = delete1.concat(localRules);
            }
            localRules = retrieveLocalRules("Lowlight1");
            if (localRules) {
                lowlight1 = lowlight1.concat(localRules);
            }
            localRules = retrieveLocalRules("Highlight1");
            if (localRules) {
                highlight1 = highlight1.concat(localRules);
            }
            
            function retrieveLocalRules(keyName) {
                if (window.localStorage.getItem(keyName)) {
                    let localRules = window.localStorage.getItem(keyName);
                    localRules = localRules.split(";");
                    for (let index = 0; index < localRules.length; index++) { // converts a string of rules to an array of regex.
    
                        localRules[index] = localRules[index].split("##")[0].trim();
    
                        if (localRules[index]) {
                            let ruleFlags = localRules[index].split("/")[1];
                            if (ruleFlags) {
                                ruleFlags = ruleFlags.trim();
                            }
                            localRules[index] = localRules[index].split("/")[0].replace(/^\//, "");
                            localRules[index] = new RegExp(localRules[index], ruleFlags);
                            ruleFlags = "";
                        }
                    }
                    localRules = localRules.filter(Boolean);
                    if (localRules) {
                        consolelog(localRules, "local-rules");
                        return localRules;
                    }else {
                        return false;
                    }
                } // end if (localStorage.getItem(keyName))
                return false;
            } // end function retrieveLocalRules()
        } // end if(1) of filter rules.

        // ==== AB. selectors by site list ========================================================|
        // needs to be set and matched to function on a site.

        const domainName = window.location.hostname;
        const hrefString = window.location.href; //href lets you be more specific

        const selectorsList = [
            {hrefRegex: /reddit\.com/i,
                elementSelectors: [
                    {superParentSelector: "div.ListingLayout-outerContainer div:nth-child(5)>div",
                        textSelector: 'span>a>h2',
                        secondTextSelector: "",
                        hrefSelector: "",
                        thirdTextSelector: ""},
                    {superParentSelector: ".Comment",
                        textSelector: 'div[data-test-id="comment"]>div>p',
                        secondTextSelector: "",
                        hrefSelector: "",
                        thirdTextSelector: ""},

            ]},

            {hrefRegex: /www\.youtube\.com/i,
                elementSelectors: [
                    {superParentSelector: "ytd-compact-video-renderer",
                        textSelector: 'span#video-title',
                        secondTextSelector: "",
                        hrefSelector: "",
                        thirdTextSelector: ""},
            ]},

            {hrefRegex: /news\.google\.com/i,
                elementSelectors: [
                    {superParentSelector: "main>c-wiz>div>div",
                        textSelector: 'div>article>h3>a',
                        secondTextSelector: "article:nth-child(2)>div:nth-child(4)>div>a",
                        hrefSelector: "",
                        thirdTextSelector: ""},
            ]},
        ];
        if(0){/*
            {hrefRegex: ,
                elementSelectors: [
                    {superParentSelector: "", // required; selector for the parent block;
                        textSelector: "", // ex: title
                        secondTextSelector: "", //ex: source/author
                        hrefSelector: "",
                        thirdTextSelector: ""}, //ex: description
                        // other than the parent selector, other selectors are optional, order does not need to be kept.
            ]},
        */}

        // ==== AC. script options ================================================================|

        const generalizeSpace = 0; // default 0; if 1, the " " character in Regexs are replaced with (\W|_).

        // ==== script options with local storage =================================================|
        // these options are used as default if the option is not set by the user in (script options).

        let markCheckedBlocks = 1; // default 1; does all possible checks before applying a special checked class.
        //checked in checkBlocks().

        let dynamicChecking = 1; // default 1; set to 1 to run the script automatically when new image elements are detected.

        let logRuntimes = 1; // set to 1 to log to console how long this takes to run.

        let disableDelete = 0; // if 1, delete matches are lowlight1 instead.
        let deleteDelete2 = 0; // default 0;

        // ==== AD. identifying parent selectors block ============================================|
        let parentSelectors;
        for (let index = 0; index < selectorsList.length; index++) { //if href match, sets custom filters
            if (selectorsList[index]["hrefRegex"].test(hrefString)) {

                let selectorsMessage =
                    "("+ scriptTag +") href match: "+
                    selectorsList[index]["hrefRegex"]
                    ;
                consolelog(selectorsMessage, "selectors");

                parentSelectors = selectorsList[index]["elementSelectors"]; // array of selector sets, usually 1.
                break;
            }
        }
        
        // ==== local selectors ====
        let keyList = ["parentSelector", "textSelector", "secondTextSelector", "hrefSelector", "thirdTextSelector"];
        if (window.localStorage.getItem(keyList[0])) {
            let customSelectors = {
                superParentSelector: window.localStorage.getItem(keyList[0]),
                textSelector: window.localStorage.getItem(keyList[1]),
                secondTextSelector: window.localStorage.getItem(keyList[2]),
                hrefSelector: window.localStorage.getItem(keyList[3]),
                thirdTextSelector: window.localStorage.getItem(keyList[4])
            };
            if (parentSelectors) {
                parentSelectors.push(customSelectors);
            }else {
                parentSelectors = [customSelectors];
            }
        }

        // ==== AE. main code start ===============================================================|
        if (parentSelectors) {
            
            consolelog(parentSelectors, "selectors");

            // ==== AF. script CSS ================================================================|
            let enableScriptCSS = 1;
            enableScriptCSS = getOptionState("log-"+ scriptPrefix +"all", enableScriptCSS);

            if (enableScriptCSS) {
                const scriptCSS =
    `<style type="text/css">
        .`+classPrefix+`dlt1,
        .`+classPrefix+`dlt2,
        .`+classPrefix+`lowlight1
        {opacity: .2;}

        .`+classPrefix+`dlt1,
        .`+classPrefix+`dlt2,
        .`+classPrefix+`lowlight1 
        {background: #f004 !important;}

        .`+classPrefix+`lowlight2 {
            opacity: .5;
            background: #ff9800 !important;
        }

        .`+classPrefix+`highlight1
        {background: #62bb66 !important;}
        .`+classPrefix+`highlight2
        {background: #fff281 !important;}
    </style>`;
                jQuery(document.body).append(scriptCSS);
            }

            // ==== AD. notif block ===============================================================|

            // 'script options' options
            let enableBlockCounter = 0;
            enableBlockCounter = getOptionState("enable-"+ scriptPrefix +"counter", enableBlockCounter);
            let enableNotifications = 0;
            enableNotifications = getOptionState("enable-"+ scriptPrefix +"notifs", enableNotifications);
            let autohideNotifs = 0; // default 0; notifs disappear after a set period of time. used in createNotif().
            let startCollapsed = 1; // default 1;

            // notif css variables.
            const notifsHex = "#ddd";
            const notifsOpacity = .4; // default .4; set to a value between 0 and 1, 1 is no transparency, .5 is 50% transparency.
            const notifsWidth = 120; // default 120; width in pixels of each notification.

            let notifContainerId = "notif-main-container";

            // generate notif container if needed.
            if ((enableBlockCounter || enableNotifications) && !jQuery("#"+ notifContainerId).length) {

                // ==== setting/checking initial visual state of notifs ===========================|

                // controlled exclusively by local storage or the default value.
                const localStorageName = "notif start collapsed";
                if (window.localStorage.getItem(localStorageName)) {
                    startCollapsed = window.localStorage.getItem(localStorageName);
                    startCollapsed = (startCollapsed == "true");
                }

                const visibleClass = "notif-visible";
                const hiddenClass = "notif-hidden1";
                let startingStateClass = visibleClass;
                let otherStartingStateClass = hiddenClass;
                if (startCollapsed) {
                    startingStateClass = hiddenClass;
                    otherStartingStateClass = visibleClass;
                }

                // ==== create container ==========================================================|
                /*
                [ notif main container
                    [notif1] - content
                    [hide] - button
                    [open] - button
                    [close] - button
                    [clear] - button
                    [notif2] - content
                ]
                - hide: makes visible open | hides close, clear, notif2
                - open: makes visible hide, close, clear, notif2 | hides open
                - close: deletes notif main container.
                - clear: empties notif-container2
                */

            const openButtonId = "notif-open";
            const hideButtonId = "notif-hide";

                let notificationsElement =
                    "<div id='"+ notifContainerId +"'>"+
                        "<div id='notif-container1'></div>"+
                        "<div id='"+ hideButtonId +"' class='notif-red notif-rounded-block "+ startingStateClass +"'>notif hide</div>"+
                        "<div id='"+ openButtonId +"' class='notif-green notif-rounded-block "+ otherStartingStateClass +"'>notif open</div>"+
                        "<div id='notif-close' class='notif-gray notif-rounded-block "+ startingStateClass +"'>close notif[]</div>"+
                        "<div id='notif-clear' class='notif-orange notif-rounded-block "+ startingStateClass +"'>clear notif</div>"+
                        "<div id='notif-container2' class=' "+ startingStateClass +"'>"+
                            "<div id='dlt-container'></div>"+
                            "<div id='ll-container' class='notif-hidden1'></div>"+
                            "<div id='ot-container' class='notif-hidden1'></div>"+
                        "</div>"+
                    "</div>";
                jQuery("body").prepend(notificationsElement);

                let textReaderElement =
                    "<div id='notif-text-overlay' class='notif-text-hidden'></div>";
                jQuery("body").prepend(textReaderElement);

                $('#notif-container2').on( {
                    mouseenter: function () {
                        let notifText = $(this).find(".notif-text").text();
                        let notifClassList = this.className;
                        if (/red/.test(notifClassList)) {
                            jQuery("#notif-text-overlay").addClass("notif-red");
                        }else if (/orange/.test(notifClassList)) {
                            jQuery("#notif-text-overlay").addClass("notif-orange");
                        }else if (/yellow/.test(notifClassList)) {
                            jQuery("#notif-text-overlay").addClass("notif-yellow");
                        }else {
                            jQuery("#notif-text-overlay").addClass("notif-gray");
                        }
                        jQuery("#notif-text-overlay").text(notifText);
                        jQuery("#notif-text-overlay").addClass("notif-text-visible");
                    },
                    mouseleave: function () {
                        jQuery("#notif-text-overlay").removeClass("notif-text-visible");
                        jQuery("#notif-text-overlay").removeClass("notif-red");
                        jQuery("#notif-text-overlay").removeClass("notif-orange");
                    }
                }, '.notif-instance');

                // ==== close ====
                jQuery("#notif-close").click(function(){jQuery("#"+ notifContainerId).remove();});

                // ==== clears container2 which contains notif instances. ====
                function clearNotif(){
                    jQuery("#notif-container2").empty();
                }
                jQuery("#notif-clear").click(clearNotif);

                // ==== open/hide events ==========================================================|

                const mainSelector = "#notif-container2, #"+ hideButtonId +", #notif-close, #notif-clear";

                jQuery("#"+ hideButtonId).click(function () {
                    //console.log(hideButtonId);
                    window.localStorage.setItem(localStorageName, true);

                    switchClasses(
                        mainSelector,
                        "#"+ openButtonId,
                        visibleClass,
                        hiddenClass
                    );
                });

                jQuery("#"+ openButtonId).click(function () {
                    //console.log(openButtonId);
                    window.localStorage.setItem(localStorageName, false);

                    switchClasses(
                        mainSelector,
                        "#"+ openButtonId,
                        hiddenClass,
                        visibleClass
                    );
                });

                function switchClasses(mainSelector, subSelector, removedClass, newClass) {
                    jQuery(mainSelector).removeClass(removedClass);
                    jQuery(mainSelector).addClass(newClass);
                    jQuery(subSelector).removeClass(newClass);
                    jQuery(subSelector).addClass(removedClass);
                }

                // ==== notif CSS =================================================================|
                if(1){var notifsCss =
    `<style type="text/css">
        #`+ notifContainerId +` {
            width: `+ notifsWidth +`px;
            max-height: 50%;
            margin: 0 2px 2px;
            display: block;

            line-height: initial;
            color: #000;
            opacity: `+ notifsOpacity +`;
            position: fixed;
            top: 0px;
            right: 0px;
            z-index: 9999;
            overflow-y: auto;
        }
        #`+ notifContainerId +`:hover {
            opacity: 1;
        }

        .notif-rounded-block {
            display: block;
            padding: 2px;
            border-radius: 3px;
            margin-top: 2px;

            font-size: 11px !important;
            font-weight: bold;
            text-align: center;
            cursor: pointer;
        }

        .s-counter {
            display: block;
            padding: 2px;
            border-radius: 4px;
            margin-top: 2px;

            background: #ddd;
            font-size: 11px !important;
            font-weight: bold;
            text-align: center;
        }

        .notif-text-hidden {
            display:none;
        }
        .notif-text-visible {
            display: block;
            max-width: 50%;
            padding: 5px;
            border: #999 solid 2px;
            border-radius: 10px;

            position: fixed;
            top: 5px;
            left: 5px;
            z-index: 999999;


            font-size: 15px !important;
            font-weight: bold !important;
            text-align: center !important;
            color: black !important;
        }

        .notif-instance {
            display: block;
            padding: 2px;
            border-radius: 4px;
            margin-top: 2px;

            background: `+ notifsHex +`;
            font-size: 11px !important;
            font-weight: bold;
            text-align: center;
            cursor: pointer;
        }

        .notif-instance div{/* div holding the rule.*/
            max-height: 12px;
            padding: 0px;
            margin: 0px;
            border: 0px;

            overflow: hidden;
            word-break: break-all;
        }
        .notif-hidden{ /* meant to hide the rule */
            opacity: .1;
        }
        .notif-hidden:hover {
            opacity: 1;
        }

        .notif-red {
            background: #f67066;
        }
        .notif-orange {
            background: #ffc107; //yellowish
        }
        .notif-green {
            background: #62bb66;
        }
        .notif-gray {
            background: #777;
        }

        /* collapsible classes */
        .notif-hidden1 {
            display: none !important;
        }
        .notif-visible {
            display: block !important;
        }

        div#ll-container, div#ot-container {
            border-top: solid black 3px;
        }
    </style>`;
                }
                jQuery(document.body).append(notifsCss);
            }
            if (enableBlockCounter) {
                jQuery("#notif-container1").prepend("<div id='"+ scriptTag +"-counter' class='s-counter .notif-rounded-block'>B No Blocks Matched.</div>");
            }

            // ==== BA. checkBlock() ==============================================================|

            // ==== checkBlock globals ====
            var currentElementSelectors = "";
            let elementCounter = 0;
            let elementsDeleted = 0;
            let lowlight1Counter = 0;
            //internal state, checks all blocks regardless if previously, changes state when function is ran manually.
            let fullCheck = 0;

            // used to find if classlist contains the checked class marker.
            const checkedClassRegex = new RegExp(classPrefix +"element");

            // checks values within a specific block to choose what class to add to it.
            function checkBlock() {

                if(!fullCheck){elementCounter++;}

                let parentClassList = "";
                if (jQuery(this).attr("class")) {
                    parentClassList = jQuery(this).attr("class");
                    //consolelog(classList, 1); // test: doublecheck parent class list
                }

                // main check block, only run if not checked or a check is forced.
                if (!parentClassList ||
                    !checkedClassRegex.test(parentClassList) ||
                    fullCheck) {

                    // ==== retrieve block data ===================================================|
                    let blockTitle, secondText, thirdText, blockHref;
                    if (currentElementSelectors && currentElementSelectors["textSelector"]) {
                        blockTitle = jQuery(this).find(currentElementSelectors["textSelector"]).text();
                        if(blockTitle){consolelog("("+ scriptTag +") t1 ["+ blockTitle +"]", "title");}
                    }
                    if (currentElementSelectors && currentElementSelectors["secondTextSelector"]) {
                        secondText = jQuery(this).find(currentElementSelectors["secondTextSelector"]).text();
                        if(secondText){consolelog("("+ scriptTag +") t2 ["+ secondText +"]", "secondText");}
                    }
                    if (currentElementSelectors && currentElementSelectors["thirdTextSelector"]) {
                        thirdText = jQuery(this).find(currentElementSelectors["thirdTextSelector"]).text();
                    }
                    if (currentElementSelectors && currentElementSelectors["hrefSelector"]) {
                        blockHref = jQuery(this).find(currentElementSelectors["hrefSelector"]).attr("href");
                        if(blockHref){consolelog("("+ scriptTag +") href ["+ blockHref +"]", "blockHref");}
                    }

                    if (blockTitle || blockHref) {

                        if (blockTitle) {
                            blockTitle = blockTitle.trim();
                        }

                        let matchCode = "n0";
                        let filterType = "txt";
                        
                        disableDelete = getOptionState("disable-delete", disableDelete);

                        // stops after the first rule matched.
                        // ## delete 1 ## =========================================================|
                        
                        if (checkRegex(blockTitle, delete1) ||
                            /dlt1/i.test(blockTitle) || //cases caught by text replace script.
                            (secondText && (checkRegex(secondText, delete1) || /dlt1/i.test(secondText))) ||
                            (blockHref && checkRegex(blockHref, delete1))) {

                            matchCode = "dlt1";
                            
                            if (secondText && checkRegex(secondText, delete1)) {
                                filterType = "2nd";
                            }else if (blockHref && checkRegex(blockHref, delete1)) {
                                filterType = "href";
                            }

                            if (!disableDelete) {
                                jQuery(this).remove();
                                elementsDeleted++;
                            }else {
                                jQuery(this).addClass(classPrefix + matchCode);
                                lowlight1Counter++;
                            }
                            
                        // ## delete 2 ## =========================================================|

                        }else if (checkRegex(blockTitle, delete2) || /dlt2/i.test(blockTitle) || (blockHref && checkRegex(blockHref, delete2))) {
                            matchCode = "dlt2";

                            deleteDelete2 = getOptionState("delete-delete2", deleteDelete2);

                            if (!disableDelete && deleteDelete2) {
                                jQuery(this).remove();
                                elementsDeleted++;
                            }else {
                                jQuery(this).addClass(classPrefix + matchCode);
                                lowlight1Counter++;
                            }
                            
                        // ## lowlight 1 ## =======================================================|

                        }else if (checkRegex(blockTitle, lowlight1) ||
                                checkRegex(blockTitle, lowlight1) ||
                                /fr1/i.test(blockTitle) ||
                                (blockHref && checkRegex(blockHref, lowlight1))) {

                            matchCode = "ll1";
                            jQuery(this).addClass(classPrefix +"lowlight1");
                            lowlight1Counter++;
                            
                        // ## lowlight 2 ## =======================================================|

                        }else if (checkRegex(blockTitle, lowlight2)) {
                            matchCode = "ll2";
                            jQuery(this).addClass(classPrefix +"lowlight2");
                        }

                        // ## highlight 1/2 ## ====================================================|

                        if (matchCode == "n0") {
                            if (checkRegex(blockTitle, highlight1)) {
                                matchCode = "h1";
                                jQuery(this).addClass(classPrefix +"highlight1");
                            }else if (checkRegex(blockTitle, highlight2)) {
                                matchCode = "h2";
                                jQuery(this).addClass(classPrefix +"highlight2");
                            }
                            //additionalCheck(searchText);
                        }

                        createNotif(elementCounter +" ("+ filterType +")"+ matchCode, regexLog, blockTitle);

                        if (enableLogMessages) {
                            let printMsg;
                            printMsg = "("+ scriptTag +") ";
                            printMsg += elementCounter;
                            printMsg += " ("+ matchCode +")";
                            printMsg += ": "+ blockTitle;
                            if(regexLog){printMsg += "("+ regexLog +")";}
                            if(thirdText){printMsg += "("+ thirdText.trim() +")";}
                            //printMsg += "("+ groupLink +")";
                            consolelog(printMsg, matchCode +"-MA");
                        }
                        if (regexLog) {regexLog = "";}
                    }else {
                        //consolelog("("+ classPrefix +"element-"+ elementCounter +")("+ selectorType +") no text found.");
                    }
                }

            } // end function checkBlock()

            // ==== BB. checkBlocks() =============================================================|

            let printedSelectors = 0; // used to print parentSelectors just once.
            function checkBlocks() {

                logRuntimes = getOptionState("log-"+ scriptPrefix +"runtimes", logRuntimes);

                if (enableLogMessages && logRuntimes) {
                    var startTime = performance.now();
                }
                // on sites with multiple block selectors, checks against all block selectors
                for (let index = 0; index < parentSelectors.length; index++) {
                    currentElementSelectors = parentSelectors[index];
                    let superParentSelector = currentElementSelectors["superParentSelector"];
                    let textSelector = currentElementSelectors["textSelector"];
                    let secondTextSelector = currentElementSelectors["secondTextSelector"];
                    let hrefSelector = currentElementSelectors["hrefSelector"];
                    let thirdTextSelector = currentElementSelectors["thirdTextSelector"];
                    let selectorsMessage =
                        "("+ scriptTag +") selectors: "+
                        superParentSelector +" | "+
                        textSelector +" | "+
                        secondTextSelector +" | "+
                        hrefSelector +" | "+
                        thirdTextSelector +" ##";
                    if (!printedSelectors) {
                        printedSelectors = 1;
                        consolelog( selectorsMessage, "selectors");
                    }

                    jQuery(superParentSelector).each(checkBlock);
                }

                // ==== update block counter ====
                if (elementCounter && !fullCheck) {
                    let counterText = "B DLT: "+ elementsDeleted +" |  LL1: "+ lowlight1Counter +" | B: "+ elementCounter;
                    jQuery("#"+ scriptTag +"-counter").text(counterText);
                    jQuery("#"+ scriptTag +"-counter").addClass("notif-green");
                }

                // adds a marker as a class that identifies what was checked.
                let elementLog = "";
                markCheckedBlocks = getOptionState(scriptPrefix +"mark-checked", markCheckedBlocks);
                if (markCheckedBlocks && !fullCheck) {
                    // for each selector
                    elementCounter = 0;
                    for (let index = 0; index < parentSelectors.length; index++) {
                        //for each block selected
                        jQuery(parentSelectors[index]["superParentSelector"]).each(function(){
                            let classList = "";
                            if (jQuery(this).attr("class")) {
                                classList = jQuery(this).attr("class");
                            }
                            if (!classList || !checkedClassRegex.test(classList)){
                                elementCounter++;
                                jQuery(this).addClass(classPrefix +"element-"+ elementCounter);
                                elementLog = elementLog +" "+ elementCounter;
                            }

                        });
                    }
                    //console.log(elementLog); //test: check checked elements
                }

                if (fullCheck) {
                    fullCheck = 0;
                }

                // logs the run time of the script.
                if (enableLogMessages && logRuntimes) {
                    const endTime = performance.now();
                    const runTime = ((endTime - startTime) / 1000).toFixed(2);
                    if (runTime < 1) {
                        consolelog("("+ scriptTag +") finished in less than 1 second.", "RUNT");
                    }else {
                        consolelog("("+ scriptTag +") finished after " + runTime + " seconds.", "RUNT");
                    }
                }
            }

            // ==== BC. checkRegex() ==============================================================|

            // checks string against given list of regular expressions.
            // resets lastIndex of global regex
            let regexLog = "";
            function checkRegex(string, regexList) {
                for (let i = 0; i < regexList.length; i++) {
                    let regexRule = regexList[i];
                    if (generalizeSpace && / /.test(regexRule.toString())) {
                        let regexFlags = regexRule.flags;
                        regexRule = new RegExp(regexRule.toString().replace(/ /g,"(\\W|_)").replace(/(^\/|\/$|\/\w*)/g,''), regexFlags); // converts /ab cd/i to /ab(\W|_)cd)i
                    }
                    if (regexRule.test(string)) {
                        if (regexLog) {
                            regexLog = regexLog +", "+ regexList[i];
                        }else {
                            regexLog = regexList[i];
                        }
                        if (/\/i?g/.test(regexList[i])) {//regex global modifier needs to be reset.
                            regexList[i].lastIndex = 0;
                        }
                        return true;
                    }
                }
                return false;
            }

            // ==== BD. createNotif() =============================================================|

            let scriptChar = "b"; // indicator of which script created this notif.
            function createNotif(notifLabel, notifRule, notifText) { //notifRule needs to match notifTypes
                enableNotifications = getOptionState("enable-"+ scriptPrefix +"notifs", enableNotifications);
                if (enableNotifications) {
                    let additionalClass, notifContainer;
                    if (/dlt/i.test(notifLabel) && /dlt/i.test(notifText)) { // caught by text replace
                        additionalClass = "notif-yellow";
                        notifContainer = "dlt-container";
                    }else if (/dlt/i.test(notifLabel)) {
                        additionalClass = "notif-red";
                        notifContainer = "dlt-container";
                    }else if (/ll/i.test(notifLabel)) {
                        additionalClass = "notif-orange";
                        notifContainer = "ll-container";
                    }else {
                        additionalClass = "notif-gray";
                        notifContainer = "ot-container";
                    }

                    let newNotif =
                        "<div class='notif-instance "+ additionalClass +"'><div>"+ scriptChar +" "+ notifLabel +"</div>"+
                            "<div class='notif-hidden'>"+ notifRule +"</div>"+
                            "<div class='notif-text' hidden>"+ notifText+"</div>"+ // to be displayed at the bottom left.
                        "</div>";

                    const enabledNotifTypesString = // set to only create notifs for dlt1 and ll1.
                        "dlt1"+
                        "|ll1";
                    const enabledNotifTypesRegex = new RegExp(enabledNotifTypesString, "i");
                    if (enabledNotifTypesRegex.test(notifLabel)) {
                        jQuery("#"+ notifContainer).append(newNotif);
                        jQuery(".notif-instance").click(function(){
                            jQuery("#notif-container2").empty();
                        });

                        if (/ll1/i.test(notifLabel)) {
                            jQuery("#ll-container").removeClass("notif-hidden1");
                        }

                        autohideNotifs = getOptionState("autohide-notifications", autohideNotifs);
                        if (autohideNotifs) {
                            const notifDuration = 10; // default 10; amount of seconds notifications are displayed before disappearing.
                            setTimeout(function() {
                                jQuery(".notif-instance").remove();
                            }, notifDuration*1000);
                        }
                    }
                }
            } // end function createNotif()

            // ==== CA. script execution block ====================================================|

            consolelog("("+ scriptTag +") EXEC: Initial run.", "EXEC");
            checkBlocks();
            let runWhenReady = 0;
            runWhenReady = getOptionState("run-when-ready", runWhenReady);
            if (runWhenReady) {
                jQuery(document).ready(function() { //after DOM has loaded.
                    consolelog("("+ scriptTag +") EXEC: document.ready()", "EXEC");
                    //fullCheck = 1;
                    checkBlocks();
                });
            }

            let runWhenLoaded = 0;
            runWhenLoaded = getOptionState("run-when-loaded", runWhenLoaded);
            if (runWhenLoaded) {
                jQuery(window).on("load", function() { //after all initial images are loaded.
                    consolelog("("+ scriptTag +") EXEC: window.load()", "EXEC");
                    //fullCheck = 1;
                    checkBlocks();
                });
            }

            dynamicChecking = getOptionState("dynamic-checking", dynamicChecking);
            if (dynamicChecking) {
                let allSelectors = "";
                for (let index = 0; index < parentSelectors.length; index++) {
                    if (allSelectors) {
                        allSelectors += ","+ parentSelectors[index]["superParentSelector"];
                    }else {
                        allSelectors = parentSelectors[index]["superParentSelector"];
                    }
                }
                //consolelog(allSelectors, "selectors");

                waitForKeyElements(allSelectors, function(){
                    //consolelog("("+ scriptTag +") EXEC: waitForKeyElements().", "EXEC");
                    checkBlocks();
                });
            }

            // ==== CB. script button =============================================================|
            let buttonContainerId = "ctb-container1";

            if (jQuery("#"+ buttonContainerId).length) {
                jQuery("#"+ buttonContainerId).prepend("<div id='"+ scriptTag +"-reset' class='ctb-blue ctb-rounded-block'>run "+ scriptTag +"</div>"); //added to beginning
                jQuery("#"+ scriptTag +"-reset").click(function () {
                    consolelog("("+ scriptTag +") EXEC: Script button.", "EXEC");
                    elementCounter = 0;
                    fullCheck = 1;
                    checkBlocks();
                });
            }
        } //end if (parentSelectors)

        function consolelog(text, messageType) {
            if (enableLogMessages && enabledMessagesRegex.test(messageType)) { // script option; defined at top.
                console.log(text);
            }
        }

        // ==== ZZ. script end ====================================================================|
        consolelog("#### ("+ scriptTag +") script finished. ####", "EXEC");

    } // end if (runScript)

})();