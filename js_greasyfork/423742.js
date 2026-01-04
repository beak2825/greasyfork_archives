// ==UserScript==
// @name         GSearch in Persian
// @name:fa      سوییچ جستو در سایت‌های فارسی
// @version      0.5
// @author       Amir
// @description  GSearch in Persian can change Google search results to Persian language, without affecting the RTL (Right-to-Left) direction. (Based on the fork from tgxhx)
// @homepage     https://github.com/Amm1rr/GSearch-Toggle/
// @namespace    amm1rr
// @description:fa با این اسکریپت به راحتی می‌توان بین جستجو فقط در سایت‌های فارسی در جستجوی گوگل سوییچ کرد، یک گزینه زیر جستجوی گوگل اضافه می شود. البته بدون تغییر در
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @icon         https://www.google.com/favicon.ico
// @match        https://www.google.com/search*
// @exclude      https://www.google.com/maps*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/423742/GSearch%20in%20Persian.user.js
// @updateURL https://update.greasyfork.org/scripts/423742/GSearch%20in%20Persian.meta.js
// ==/UserScript==

/*

Last Changes: (Sort by Date)

18/07/2023

- Excluded Google Map
- Added support for UK/US Google domains
- Added support for mobile, tablet, and desktop devices
- External library removed

*/

(function () {
    "use strict";

    // I just added this variable to check if the class is found for the first time, so there's no need to execute multiple times.
    var iFoundCounter = 0;

    // How to use:
    // if( isMobile.any() ) alert('Mobile');
    // To check to see if the user is on a specific mobile device:
    // if( isMobile.iOS() ) alert('iOS');
    const isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        iPhone: function () {
            return navigator.userAgent.match(/iPhone/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return (
                navigator.userAgent.match(/IEMobile/i) ||
                navigator.userAgent.match(/WPDesktop/i)
            );
        },
        any: function () {
            return (
                isMobile.Android() ||
                isMobile.BlackBerry() ||
                isMobile.iOS() ||
                isMobile.Opera() ||
                isMobile.Windows()
            );
        },
        mobile: function () {
            return (
                isMobile.Android() ||
                isMobile.BlackBerry() ||
                isMobile.iPhone() ||
                isMobile.Opera()
            );
        },
    };

    //-- Wait for the "Tools" button
    if (isMobile.mobile()) {
        waitForKeyElements('div[jsname="yIZuWb"]', onPageLoadedMobile);
    } else {
        waitForKeyElements(".PuHHbb", onPageLoaded);
    }

    function CreateSeprator() {
        var seperator = document.createElement("div");
        seperator.classList.add("IDFSOe");
        //-- Class=> TZqsAd

        return seperator;
    }

    function CreateLink() {
        var aTag = document.createElement("a");
        var query = new URLSearchParams(decodeURIComponent(location.search));
        const isFarsi = (query.get("lr") || "").toLowerCase() === "lang_fa";
        if (isFarsi) {
            query.delete("lr");
            query.delete("tbs");
            aTag.textContent = "Clear";
        } else {
            query.set("lr", "lang_fa");
            query.set("tbs", "lr:lang_fa");
            aTag.textContent = "Persian";
        }

        const href = `${location.origin}${
            location.pathname
        }?${query.toString()}`;
        aTag.setAttribute("href", href);
        aTag.classList.add("hdtb-tl");
        aTag.style.cssText = "color: #5f6368;text-decoration: none;";

        return aTag;
    }

    function onPageLoadedMobile() {
        onPageLoaded("Mobile");
    }

    // Function to be executed after the page has completely loaded
    function onPageLoaded(arg) {
        var ToolsButton;
        if (arg == "Mobile") {
            //-- Mobile
            ToolsButton = document.querySelector('div[jsname="yIZuWb"]');
        } else {
            //-- Desktop
            ToolsButton = document.querySelector(".PuHHbb");

            //-- Tablet
            if (!ToolsButton) {
                ToolsButton = document.querySelector(".hdtb-tl-sel");
                // alert("1." + ToolsButton);
            }

            if (!ToolsButton) {
                ToolsButton = document.querySelector("#hdtb-tls");
                // alert("2." + ToolsButton);
            }

            if (!ToolsButton) {
                ToolsButton = document.querySelector(".TZqsAd");
                // alert("3." + ToolsButton);
            }
            //-- Tablet
        }

        if (ToolsButton) {
            if (iFoundCounter > 1) {
                return;
            }
        }
        iFoundCounter++;

        var seperator = CreateSeprator();
        var alink = CreateLink();

        ToolsButton.insertAdjacentElement("afterend", seperator);
        seperator.insertAdjacentElement("afterend", alink);
    }

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
    function waitForKeyElements(
        selectorTxt /* Required: The jQuery selector string that
                            specifies the desired element(s).
                        */,
        actionFunction /* Required: The code to run when elements are
                            found. It is passed a jNode to the matched
                            element.
                        */,
        bWaitOnce /* Optional: If false, will continue to scan for
                            new elements even after the first match is
                            found.
                        */,
        iframeSelector /* Optional: If set, identifies the iframe to
                            search.
                        */
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt);
        else targetNodes = $(iframeSelector).contents().find(selectorTxt);

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            /*--- Found target node(s).  Go through each and act if they
                are new.
            */
            targetNodes.each(function () {
                var jThis = $(this);
                var alreadyFound = jThis.data("alreadyFound") || false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound = actionFunction(jThis);
                    if (cancelFound) btargetsFound = false;
                    else jThis.data("alreadyFound", true);
                }
            });
        } else {
            btargetsFound = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj = waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace(/[^\w]/g, "_");
        var timeControl = controlObj[controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval(timeControl);
            delete controlObj[controlKey];
        } else {
            //--- Set a timer, if needed.
            if (!timeControl) {
                timeControl = setInterval(function () {
                    waitForKeyElements(
                        selectorTxt,
                        actionFunction,
                        bWaitOnce,
                        iframeSelector
                    );
                }, 300);
                controlObj[controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }

    //document.addEventListener('DOMContentLoaded', onPageLoaded);
    // window.onload = onPageLoaded;
})();
