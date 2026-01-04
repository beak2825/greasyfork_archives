// ==UserScript==
// @name         MD1 Material Design Style with Materialize
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Apply Material Design 1 (MD1) styles using Materialize CSS to all websites
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_addElement
// @require      https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js
// @downloadURL https://update.greasyfork.org/scripts/505467/MD1%20Material%20Design%20Style%20with%20Materialize.user.js
// @updateURL https://update.greasyfork.org/scripts/505467/MD1%20Material%20Design%20Style%20with%20Materialize.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS for MD1 design
    const md1CSS = `
        /* Basic MD1 Styling */
        body {
            font-family: 'Roboto', sans-serif;
            background-color: #F5F5F5;
            color: #212121;
            margin: 0;
            padding: 0;
        }

        .container, .content, .main {
            padding: 16px;
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        button, .btn {
            background-color: #6200EA;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
        }

        button:hover, .btn:hover {
            background-color: #3700B3;
        }

        .card {
            background: white;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            padding: 16px;
            margin: 16px 0;
        }

        input, textarea {
            border: 1px solid #BDBDBD;
            border-radius: 4px;
            padding: 8px;
            width: 100%;
            box-sizing: border-box;
        }

        h1, h2, h3, h4, h5, h6 {
            margin: 0;
            font-weight: 400;
            color: #212121;
        }

        a {
            color: #6200EA;
            text-decoration: none;
            transition: color 0.3s;
        }

        a:hover {
            color: #3700B3;
        }

        /* Override Materialize styles if necessary */
        .materialize {
            /* Your overrides here */
        }
    `;

    // Add custom CSS to the page
    GM_addStyle(md1CSS);

    // Ensure Materialize JavaScript is executed
    GM_addElement('script', {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js',
        type: 'text/javascript',
        defer: true
    });

    // Ensure Materialize CSS is loaded
    GM_addElement('link', {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css'
    });
})();
