// ==UserScript==
// @name         Military Time Converter and Time Zone Adjuster with Preference
// @namespace    RyanCane26
// @version      1.0
// @description  Convert military time to regular time and adjust MST to EST, CST, PST with user preference and storage
// @author       RyanCane26
// @match        https://glb.warriorgeneral.com/game/user*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497865/Military%20Time%20Converter%20and%20Time%20Zone%20Adjuster%20with%20Preference.user.js
// @updateURL https://update.greasyfork.org/scripts/497865/Military%20Time%20Converter%20and%20Time%20Zone%20Adjuster%20with%20Preference.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert military time to regular time
    function militaryToRegularTime(militaryTime) {
        let [hours, minutes] = militaryTime.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
    }

    // Function to convert MST to other time zones
    function convertMSTToTimeZones(militaryTime) {
        let [hours, minutes] = militaryTime.split(':').map(Number);

        // Create a Date object in MST
        const mstDate = new Date();
        mstDate.setHours(hours, minutes, 0, 0);

        // Function to format the time properly for conversion
        function formatTime(date) {
            const hrs = date.getHours();
            const mins = date.getMinutes();
            return `${hrs < 10 ? '0' : ''}${hrs}:${mins < 10 ? '0' : ''}${mins}`;
        }

        // Convert to EST, CST, PST by adjusting hours
        const estDate = new Date(mstDate.getTime() + (2 * 60 * 60 * 1000)); // MST + 2 hours = EST
        const cstDate = new Date(mstDate.getTime() + (1 * 60 * 60 * 1000)); // MST + 1 hour = CST
        const pstDate = new Date(mstDate.getTime() - (1 * 60 * 60 * 1000)); // MST - 1 hour = PST

        return {
            mst: militaryToRegularTime(formatTime(mstDate)),
            est: militaryToRegularTime(formatTime(estDate)),
            cst: militaryToRegularTime(formatTime(cstDate)),
            pst: militaryToRegularTime(formatTime(pstDate))
        };
    }

    // Function to get the preferred time zone from localStorage
    function getPreferredTimeZone() {
        return localStorage.getItem('preferredTimeZone') || 'mst';
    }

    // Function to set the preferred time zone in localStorage
    function setPreferredTimeZone(timeZone) {
        localStorage.setItem('preferredTimeZone', timeZone);
    }

    // Function to find and convert all military times on the page
    function convertTimesOnPage() {
        const preferredTimeZone = getPreferredTimeZone();
        const timeRegex = /\b([01]?\d|2[0-3]):([0-5]\d)\b/g;
        const textNodes = document.evaluate('//text()[contains(., ":")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for (let i = 0; i < textNodes.snapshotLength; i++) {
            const node = textNodes.snapshotItem(i);
            const originalText = node.nodeValue;
            let newText = originalText;

            const matches = originalText.match(timeRegex);
            if (matches) {
                matches.forEach(militaryTime => {
                    const timeZones = convertMSTToTimeZones(militaryTime);
                    const replacementText = `${militaryTime} (${preferredTimeZone.toUpperCase()}: ${timeZones[preferredTimeZone]})`;
                    newText = newText.replace(militaryTime, replacementText);
                });

                node.nodeValue = newText;
            }
        }
    }

    // Function to create and display the time zone selector
    function createTimeZoneSelector() {
        const timeZoneSelector = document.createElement('select');
        const timeZones = ['mst', 'est', 'cst', 'pst'];
        timeZones.forEach(tz => {
            const option = document.createElement('option');
            option.value = tz;
            option.textContent = tz.toUpperCase();
            if (tz === getPreferredTimeZone()) {
                option.selected = true;
            }
            timeZoneSelector.appendChild(option);
        });

        timeZoneSelector.addEventListener('change', () => {
            setPreferredTimeZone(timeZoneSelector.value);
            window.location.reload(); // Reload the page to apply changes
        });

        timeZoneSelector.style.position = 'fixed';
        timeZoneSelector.style.top = '10px';
        timeZoneSelector.style.right = '10px';
        timeZoneSelector.style.zIndex = '9999';
        document.body.appendChild(timeZoneSelector);
    }

    // Run the function to convert times on page load
    window.addEventListener('load', () => {
        createTimeZoneSelector();
        convertTimesOnPage();
    });

})();
