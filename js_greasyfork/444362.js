// ==UserScript==
// @name         AutoBank Select - Facture.net
// @namespace    http://tampermonkey.net/
// @author       Revine | revine.fr
// @version      0.2
// @description  Sélectionne automatiquement le premier compte en banque s'il est disponible lors de la création de factures
// @author       Revine
// @match        https://www.facture.net/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facture.net
// @license      MIT
// @grant        none
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/444362/AutoBank%20Select%20-%20Facturenet.user.js
// @updateURL https://update.greasyfork.org/scripts/444362/AutoBank%20Select%20-%20Facturenet.meta.js
// ==/UserScript==


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


        waitForKeyElements (
            "#bill_bank_account_id", loadFirstBankOption
        );

        //--- Page-specific function to do what we want when the node is found.
        function loadFirstBankOption (el) {
            if(!el.val()) {
                const value = el.children().eq(1).val();
                const parent = el.parent();
                const menu = el.parent().children(".menu");
                const divSelect = parent.children(".select.dropdown");
                const name = el.children().eq(1).text();

                el.val(value);
                divSelect.removeClass("noselection");
                parent.removeClass("dropdown-with-blank").addClass("float-label");
                menu.children('.item.active.selected').removeClass("active").removeClass("selected");
                menu.children('.item[data-value="'+value+'"]').addClass("selected").addClass("active");
                parent.children(".text").text(name);

                console.log("Data inserted");
            }
        }