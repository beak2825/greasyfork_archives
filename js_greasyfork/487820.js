// ==UserScript==
// @name         Siege Incoming Displayer
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  Display incoming troops to sieges and allow you to sort them by type of attack
// @author       Draub
// @match        https://*.grepolis.com/game/*
// @run-at       document-end
// @icon         https://wiki.fr.grepolis.com/images/2/29/ConquestIcon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487820/Siege%20Incoming%20Displayer.user.js
// @updateURL https://update.greasyfork.org/scripts/487820/Siege%20Incoming%20Displayer.meta.js
// ==/UserScript==


(function() {
    'use strict';
    function addIncomings() {
        $('<style>.hidden { display:none; } .unselected { opacity: 0.33; }</style>').appendTo("head");
        $('.conquest .report_side_defender').each(function () {
            const seaAttacks = $(this).find('.attack_sea').length;
            const landAttacks = $(this).find('.attack_land').length;
            const support = $(this).find('.support').length;
            $(this).find('h4').html(
                "Movements of troops: " +
                "<span class='seaAttacks'><img src='https://gpen.innogamescdn.com/images/game/unit_overview/attack_sea.png' style='vertical-align: middle;  margin-right: 5px;' />" +
                `<span style="${seaAttacks > 0 ? 'color: red; font-weight: bold;' : ''}">${seaAttacks}</span></span>` +
                "<span class='landAttacks'><img src='https://gpen.innogamescdn.com/images/game/unit_overview/attack_land.png' style='vertical-align: middle; margin-left: 10px;  margin-right: 5px;' />" +
                `<span style="${landAttacks > 0 ? 'color: red; font-weight: bold;' : ''}">${landAttacks}</span></span>` +
                "<span class='supp'><img src='https://gpen.innogamescdn.com/images/game/unit_overview/support.png' style='vertical-align: middle; margin-left: 10px; margin-right: 5px;' />" +
                `<span style="${support > 0 ? 'color: #00b9fb; font-weight: bold;' : ''}">${support}</span></div>`
           );
        });
        $('.seaAttacks').click(function () {
           hideMouvements('seaAttacks');
        });
        $('.landAttacks').click(function () {
           hideMouvements('landAttacks');
        });
        $('.supp').click(function () {
           hideMouvements('supp');
        });
    }

    function hideMouvements(typeMouvements) {
        console.log('hideMouvements Function with parameters typeMouvements : ' + typeMouvements);
        switch (typeMouvements) {
            case 'seaAttacks':
                if ($('.landAttacks').find('img').hasClass('unselected') && $('.supp').find('img').hasClass('unselected')) {
                    $('.attack_sea').removeClass("hidden");
                    $('.attack_land').removeClass("hidden");
                    $('.support').removeClass("hidden");
                    $('.seaAttacks').find('img').removeClass("unselected");
                    $('.landAttacks').find('img').removeClass("unselected");
                    $('.supp').find('img').removeClass("unselected");
                } else {
                    $('.attack_sea').removeClass("hidden");
                    $('.attack_land').addClass("hidden");
                    $('.support').addClass("hidden");
                    $('.seaAttacks').find('img').removeClass("unselected");
                    $('.landAttacks').find('img').addClass("unselected");
                    $('.supp').find('img').addClass("unselected");
                }
                break;
            case 'landAttacks':
                if ($('.seaAttacks').find('img').hasClass('unselected') && $('.supp').find('img').hasClass('unselected')) {
                    $('.attack_sea').removeClass("hidden");
                    $('.attack_land').removeClass("hidden");
                    $('.support').removeClass("hidden");
                    $('.seaAttacks').find('img').removeClass("unselected");
                    $('.landAttacks').find('img').removeClass("unselected");
                    $('.supp').find('img').removeClass("unselected");
                } else {
                    $('.attack_sea').addClass("hidden");
                    $('.attack_land').removeClass("hidden");
                    $('.support').addClass("hidden");
                    $('.landAttacks').find('img').removeClass("unselected");
                    $('.seaAttacks').find('img').addClass("unselected");
                    $('.supp').find('img').addClass("unselected");
                }
                break;
            case 'supp':
                if ($('.seaAttacks').find('img').hasClass('unselected') && $('.landAttacks').find('img').hasClass('unselected')) {
                    $('.attack_sea').removeClass("hidden");
                    $('.attack_land').removeClass("hidden");
                    $('.support').removeClass("hidden");
                    $('.seaAttacks').find('img').removeClass("unselected");
                    $('.landAttacks').find('img').removeClass("unselected");
                    $('.supp').find('img').removeClass("unselected");
                } else {
                    $('.attack_sea').addClass("hidden");
                    $('.attack_land').addClass("hidden");
                    $('.support').removeClass("hidden");
                    $('.supp').find('img').removeClass("unselected");
                    $('.seaAttacks').find('img').addClass("unselected");
                    $('.landAttacks').find('img').addClass("unselected");
                }
                break;
            default:
                console.debug('This code should be unreached');
        }
    }

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
        var controlObj = waitForKeyElements.controlObj  ||  {};
        var controlKey = selectorTxt.replace (/[^\w]/g, "_");
        var timeControl = controlObj [controlKey];

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
        ".report_side_defender",
        addIncomings
    );

})();
