// ==UserScript==
// @name         YMCA Today's Date Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a floating button to navigate to today's date on YMCA schedules page
// @author       Sander Valstar
// @match        *://www.seattleymca.org/schedules/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522240/YMCA%20Today%27s%20Date%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/522240/YMCA%20Today%27s%20Date%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to format the date as YYYY-MM-DD
    function formatDate(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    // Function to create and append the floating button
    function createButton() {
        const button = document.createElement("button");
        button.innerText = "Go to Today's Date";
        button.style.position = "fixed";
        button.style.bottom = "20px";
        button.style.right = "20px";
        button.style.padding = "10px 20px";
        button.style.backgroundColor = "#0071bc";
        button.style.color = "#fff";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.zIndex = "1000";
        button.id = "ymca-date-button";
        document.body.appendChild(button);

        // Function to update the URL with today's date and reload the page
        button.addEventListener("click", () => {
            const url = new URL(window.location.href);
            url.searchParams.set("date", formatDate(new Date()));
            window.location.href = url.toString();
        });
    }

    // Function to check and render the button if necessary
    function checkAndRenderButton() {
        const today = formatDate(new Date());
        const url = new URL(window.location.href);
        const currentDate = url.searchParams.get("date");

        // Remove the button if it exists
        const existingButton = document.getElementById("ymca-date-button");
        if (existingButton) {
            existingButton.remove();
        }

        if (currentDate !== today) {
            createButton();
        }
    }

    // Initial check
    checkAndRenderButton();

    // Use a setInterval to check for URL changes every second
    let lastUrl = window.location.href;
    setInterval(() => {
        if (lastUrl !== window.location.href) {
            lastUrl = window.location.href;
            checkAndRenderButton();
        }
    }, 1000);

})();
