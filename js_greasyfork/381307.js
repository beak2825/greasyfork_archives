// ==UserScript==
// @name         Torn Market Autobuy
// @namespace    https://jhvisser.com
// @version      0.2
// @description  Make buying easier
// @author       Fogest (Justin)
// @match        https://www.torn.com/imarket.php
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @grant        unsafeWindow
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/381307/Torn%20Market%20Autobuy.user.js
// @updateURL https://update.greasyfork.org/scripts/381307/Torn%20Market%20Autobuy.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    var stopScript = false;

    //--STEP 1: Wait for page to be loaded in and then insert button
//#item-market-main-wrap > div.shop-market-page > div > div.market-search.top-round.white-grad
    $(document).arrive("#item-market-main-wrap > div.shop-market-page > div > div.items-list.bottom-round.cont-gray", foundHtml);

    function foundHtml(jNode) {
         console.log("Found!");
         $("#item-market-main-wrap > div.shop-market-page > div > div.market-search.top-round.white-grad").after(getHtmlToInsert());
         if(sessionStorage.getItem("currentlyBuying") == 1) {
            startItemBuying();
        }
    }

    function getHtmlToInsert() {
       var defaultVal = sessionStorage.getItem("buyComparison");
       return "<div>" +
                 "<button type='button' class='buyAllOfIt'>Buy All</button>" +
                 "<button type='button' class='stopBuyingItAll'>Stop</button>" +
                 "<input id='buyAllOfItLessThan' type='text' placeholder='Less than' value='"+defaultVal+"'></input>" +
               "</div>";
    }

    //#item-market-main-wrap > div.shop-market-page > div > div.items-list.bottom-round.cont-gray > ul.items > li.active > div.confirm-buy > span.confirm > span.question

    //--Step 2: Listen for click on buy button.

    $(document).on("click", "button.buyAllOfIt", function() {
         startItemBuying();
    });

    $(document).on("click", "button.stopBuyingItAll", function() {
         stopScript = true;
         stopProgram();
    });


    function startItemBuying() {
        if(stopScript) {
            stopProgram();
            return false;
        }
        var numLess = parseInt($("#buyAllOfItLessThan").val());
        sessionStorage.setItem("buyComparison", numLess);
        console.log(numLess);
        if(numLess == 0) {
            sessionStorage.setItem("currentlyBuying", 0);
            location.reload();
        }
        var element = $(".items > li:first");
        if(element.attr("class") == 'clear') {
            sessionStorage.setItem("currentlyBuying", 1);
            location.reload();
        } else {
            sessionStorage.setItem("currentlyBuying", 0);
        }
        var cost = parseInt(element.find('li.cost').text().match(/\d+/g));
        console.log(cost);
        if(cost < numLess) {
            element.find('li.buy > span > span').trigger('click');
            element.find('.confirm-buy').attr("id", "waitForThisOne");
            waitForKeyElements(
                "#waitForThisOne > span.confirm > span.question:visible, #waitForThisOne > span.confirm.t-red, #waitForThisOne > span.confirm > span:contains('Oh sorry')",
                activateBuyDropDown
            );
        }
    }

    function activateBuyDropDown() {
        if(stopScript) {
            stopProgram();
            return false;
        }

        if($("#waitForThisOne > span.confirm > span.question:visible").length <=0) {
            console.log("Didn't find buy!");
            if($("#waitForThisOne > span.confirm.t-red").length <= 0) {
                console.log("Found red error!");
                $("#waitForThisOne").parent().remove();
                startItemBuying();
            }
            if($("#waitForThisOne > span.confirm > span:contains('Oh sorry')").length <= 0) {
                console.log("Found plain error!");
                $("#waitForThisOne").parent().remove();
                startItemBuying();
            }
        }
        console.log("Ready to buy!");
        var element = $('#waitForThisOne');
        element.find('a.yes-buy').trigger('click');
        element.next().attr("id", "waitForThisOneToo");
        element.attr("id", "");

        waitForKeyElements(
            '#waitForThisOneToo > span.success > span.bought-item:visible',
            activateNextBuy
        );
    }

    function activateNextBuy() {
        if(stopScript) {
            stopProgram();
            return false;
        }
        console.log("Next buy ready!");
        $("#waitForThisOneToo").parent().remove();
        startItemBuying();
    }



    function stopProgram() {
        sessionStorage.setItem("currentlyBuying", 0);
    }
}(unsafeWindow.jQuery));

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
