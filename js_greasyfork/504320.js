// ==UserScript==
// @name         API Data Access Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button to fetch and display data from an API
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.0.22/sweetalert2.all.min.js
// @connect      * // Adjust this if you are making requests to a specific domain
// @downloadURL https://update.greasyfork.org/scripts/504320/API%20Data%20Access%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/504320/API%20Data%20Access%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS for the button
    GM_addStyle(`
        #api-button {
            position: fixed;
            bottom: 10px;
            right: 10px;
            padding: 10px 20px;
            background-color: #007BFF;
            color: #FFFFFF;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            z-index: 9999;
        }
    `);

    // Create and add the button to the page
    let button = document.createElement('button');
    button.id = 'api-button';
    button.textContent = 'Fetch API Data';
    document.body.appendChild(button);

    // Function to fetch data from the API
    function fetchData() {
        const apiUrl = 'https://jsonplaceholder.typicode.com/posts/1'; // Replace with your API URL

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        // Display the data using SweetAlert2
                        Swal.fire({
                            title: 'API Data',
                            text: JSON.stringify(data, null, 2),
                            width: '80%',
                            padding: '3em',
                            background: '#fff',
                            backdrop: `
                                rgba(0,0,123,0.4)
                                url(https://cdn.jsdelivr.net/npm/sweetalert2@11/images/nyan-cat.gif)
                                left top
                                no-repeat
                            `
                        });
                    } catch (e) {
                        Swal.fire('Error', 'Failed to parse API response', 'error');
                    }
                } else {
                    Swal.fire('Error', 'Failed to fetch data from API', 'error');
                }
            },
            onerror: function() {
                Swal.fire('Error', 'Failed to make the request', 'error');
            }
        });
    }

    // Add event listener to the button
    button.addEventListener('click', fetchData);
})();
