// ==UserScript==
// @name         Yahoo Mail Sidebar Shrinker
// @namespace    https://greasyfork.org/en/users/810921-guywmustang
// @version      1.0
// @description  Shrink the side bar in Yahoo Mail
// @author       guywmustang
// @match        https://mail.yahoo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472768/Yahoo%20Mail%20Sidebar%20Shrinker.user.js
// @updateURL https://update.greasyfork.org/scripts/472768/Yahoo%20Mail%20Sidebar%20Shrinker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceCssClasses(elem, cssString) {
        elem.classList = [];
        cssString.split(' ').forEach((style) => elem.classList.add(style));
    }

    function handleClickToNewWindow(elem, url) {
        elem.addEventListener("click", function(e) {
            e.stopPropagation();
            // alert(e.target + ": " + url);
            window.open(url, "_blank");
        });
    }

    function overrideSidebar() {

        console.log("Overriding sidebar...");

        // Remove the iframe, the hide button, etc
        var rightRailElement = document.querySelector("div[data-test-id=mail-right-rail]")

        // Hide the right arrow button
        var hideAdButton = document.querySelector("div[data-test-id=right-rail-hidead-btn]")
        hideAdButton.style.display = "none"

        // Start changing class styles of the various child elements
        var element1 = rightRailElement.querySelector(".Z_qc");
        element1.classList.add("H_6D6F"); // Adds height: 100% style

        // Remove the iframe grandparent div (to remove all traces of the bottom div)
        var iframeParentDiv = rightRailElement.querySelector("iframe").parentElement.parentElement.remove();

        // Change the styling on the elements
        var commsPropertiesBar = rightRailElement.querySelector("div[data-test-id=comms-properties-bar]");
        replaceCssClasses(commsPropertiesBar, "D_F en_0 gl_CI je_6Fd5 jb_6Fd5 N_6Fd5 X_6Fd5 H_6D6F k_w I_ZS20V7 m_ZYfqDw U_0 ab_C ek_BB");

        var commsProperties = rightRailElement.querySelector("div[data-test-id=comms-properties]");
        replaceCssClasses(commsProperties, "D_F W_A ab_C ek_BB Y_6EGz");

        var paneIconCssClasses = "D_F r_P M_Z1bGli4 q_n b_n P_0 C_Z281SGl cdPFi_ak5m8 cdPFi4_ZkbNhI is_26ISAR cZdTOHS_ZXgLQ3";

        // Change the sidebar icon styles & override the click handlers
        var contactsIconDiv = rightRailElement.querySelector("button[data-test-id=contacts-pane-icon]");
        handleClickToNewWindow(contactsIconDiv, "https://mail.yahoo.com/b/contacts");
        replaceCssClasses(contactsIconDiv, paneIconCssClasses);

        var calendarIconDiv = rightRailElement.querySelector("[data-test-id=right-rail-calendar-icon]");
        handleClickToNewWindow(calendarIconDiv, "https://calendar.yahoo.com/");
        replaceCssClasses(calendarIconDiv, paneIconCssClasses);

        var notepadIconDiv = rightRailElement.querySelector("[data-test-id=right-rail-notepad-icon]");
        handleClickToNewWindow(notepadIconDiv, "https://calendar.yahoo.com/?view=notepad");
        replaceCssClasses(notepadIconDiv, paneIconCssClasses);

        var helpIconDiv = rightRailElement.querySelector("[data-test-id=right-rail-help-icon]");
        replaceCssClasses(helpIconDiv, paneIconCssClasses);

        // Move the settings/popover container div to the top
        // Get the div[data-test-id=popover-container]
        var popoverContainer = rightRailElement.querySelector("div > div > div[data-test-id=popover-container]");

        // Change parent's classlist
        replaceCssClasses(popoverContainer.parentElement, "D_F ab_C cdPFi_ZamTeg C_ZamTeg r_P");

        // Change grandparent's classlist
        replaceCssClasses(popoverContainer.parentElement.parentElement, "D_F ek_BB");

        // Remove the span label
        rightRailElement.querySelector("span[data-test-id=settings-link-label]").remove();

        // Move the grandparent container to the first element under div[data-test-id=comms-properties-bar]
        commsPropertiesBar.prepend(popoverContainer.parentElement.parentElement);
    }

    var oldHref = document.location.href;

    function setHrefHandler() {

        var bodyList = document.querySelector("body")

            ,observer = new MutationObserver(function(mutations) {

                mutations.forEach(function(mutation) {

                    if (oldHref != document.location.href) {

                        oldHref = document.location.href;

                        console.log("url changed...");

                        /* Changed ! your code here */
                        setTimeout(overrideSidebar, 50);

                    }

                });

            });

        var config = {
            childList: true,
            subtree: true
        };

        observer.observe(bodyList, config);

    }

    // Do the thing
    window.onload = function() {
        overrideSidebar();

        setHrefHandler();
    }

})();