// ==UserScript==
// @name         Yet Another Udemy Course Creation Date Getter
// @namespace    <https://github.com/lundeen-bryan>
// @version      2.0.0
// @description  Shows the creation date of the course below the latest update date.
// @author       lundeen-bryan based on a script by scriptbug
// @match        https://www.udemy.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @grant        GM_addStyle
// @license      GPL-2.0-or-later
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/482437/Yet%20Another%20Udemy%20Course%20Creation%20Date%20Getter.user.js
// @updateURL https://update.greasyfork.org/scripts/482437/Yet%20Another%20Udemy%20Course%20Creation%20Date%20Getter.meta.js
// ==/UserScript==

var $ = window.$;
var x = document.body.getAttribute("data-clp-course-id");
$.get("https://www.udemy.com/api-2.0/courses/" + x + "/?fields[course]=created", function (data) {
    var date = new Date(data.created);
    var formattedDate = (date.getMonth() + 1) + "/" + date.getFullYear(); // Adjust the format as needed

    // Function to create the date element
    function createDateElement() {
        var creationDateDiv = document.createElement("div");
        creationDateDiv.className = "clp-lead__element-item";
        creationDateDiv.innerHTML = '<span>Created on ' + formattedDate + '</span>';
        return creationDateDiv;
    }

    // Function to insert the creation date
    function insertCreationDate() {
        var updateDateElement = document.querySelector("[data-purpose='last-update-date']");
        if (updateDateElement) {
            updateDateElement.parentNode.insertBefore(createDateElement(), updateDateElement.nextSibling);
            return true;
        }
        return false;
    }

    // Try to insert immediately
    if (!insertCreationDate()) {
        // Use MutationObserver as the first fallback
        var observer = new MutationObserver(function (mutations, me) {
            if (insertCreationDate()) {
                me.disconnect(); // stop observing when done
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });

        // Additional fallback: try again after a delay
        setTimeout(function () {
            if (!insertCreationDate()) {
                console.error("Could not insert the creation date after delay.");
            }
        }, 5000); // Wait for 5 seconds as the last resort
    }
});