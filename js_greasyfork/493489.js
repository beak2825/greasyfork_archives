// ==UserScript==
// @name         MT Convert to Local Time
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  Override JavaScript's Date object to always use Beijing time (UTC+8), and convert all date and time values on a webpage from Beijing Time (GMT+8) to your local time zone.
// @author       tttsc, GPT4
// @match        https://*.m-team.cc/*
// @match        https://*.m-team.io/*
// @match        https://test2.m-team.cc/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493489/MT%20Convert%20to%20Local%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/493489/MT%20Convert%20to%20Local%20Time.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalDate = Date;

    // Function to adjust the local time to Beijing time
    function toBeijingTime(original) {
        const localTime = new originalDate(original);
        const localTimeMs = localTime.getTime();
        const localOffset = localTime.getTimezoneOffset() * 60000; // Offset in milliseconds
        const beijingOffset = 8 * 3600 * 1000; // Beijing is UTC+8
        return new originalDate(localTimeMs + localOffset + beijingOffset);
    }

    // Override the Date object
    Date = function () {
        if (arguments.length === 0) {
            return toBeijingTime(originalDate.now());
        } else if (arguments.length === 1) {
            return new originalDate(arguments[0]);
        } else {
            return new originalDate(...arguments);
        }
    };

    Date.prototype = originalDate.prototype;
    Date.now = function() {
        return toBeijingTime(originalDate.now()).getTime();
    };
    Date.parse = originalDate.parse;
    Date.UTC = originalDate.UTC;
    Object.defineProperty(Date, 'prototype', { writable: false });
    console.log('Tampermonkey script loaded: Starting conversion...');

    // Function to format dates into YYYY-MM-DD HH:MM:SS format
    function formatDateTime(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // Function to convert time from Beijing to local
    function convertTimeToLocal(timeString) {
        // Correct format for ISO 8601 with timezone
        const formattedTimeString = timeString.replace(' ', 'T') + '+08:00';
        const dateInBeijing = new Date(formattedTimeString); // Parse the Beijing time
        return formatDateTime(dateInBeijing); // Convert to local time string in fixed format
    }

    // Function to process and replace date strings within an element's text
    function processTextNode(node) {
        const timePattern = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}|\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/g; // Example patterns, modify as needed
        if (node.nodeValue.match(timePattern)) {
            node.nodeValue = node.nodeValue.replace(timePattern, match => convertTimeToLocal(match));
            console.log(`Processed text node: `, node.nodeValue);
        }
    }

    // Function to process and replace date strings within an element's title attribute
    function processTitleAttribute(element) {
        const timePattern = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}|\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/g; // Example patterns, modify as needed
        if (element.title && element.title.match(timePattern)) {
            element.title = element.title.replace(timePattern, match => convertTimeToLocal(match));
            console.log(`Processed title attribute: `, element.title);
        }
    }

    // Observer to handle dynamic content
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    processTextNode(node);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    processTitleAttribute(node);
                    node.querySelectorAll('*').forEach(child => {
                        processTitleAttribute(child);
                        child.childNodes.forEach(childNode => {
                            if (childNode.nodeType === Node.TEXT_NODE) {
                                processTextNode(childNode);
                            }
                        });
                    });
                }
            });
        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial processing on load
    document.querySelectorAll('time, span, div, p, a, *[title]').forEach(element => {
        processTitleAttribute(element);
        element.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                processTextNode(node);
            }
        });
    });

    // Traverse DOM elements to apply text node processing
    function traverseAndProcess(element) {
        element.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                processTextNode(child);
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                traverseAndProcess(child);
            }
        });
    }
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.querySelectorAll('.ant-typography-secondary').forEach(traverseAndProcess);
            console.log("Script processed elements after window load");
        }, 1000); // Adjust delay as necessary
    });

})();