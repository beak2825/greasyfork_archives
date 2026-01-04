// ==UserScript==
// @name         Tryb Ciemny dla t.pl
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Apply dark mode with green accents, change logos, and background for t.pl
// @author       You
// @match        https://t.pl/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514162/Tryb%20Ciemny%20dla%20tpl.user.js
// @updateURL https://update.greasyfork.org/scripts/514162/Tryb%20Ciemny%20dla%20tpl.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Apply dark mode styles with green accents and blue elements
    const darkModeStyles = `
        body {
            font-family: arial, sans-serif;
            font-size: 12px;
            color: #ffffff; /* Biały tekst */
            background-color: #121212; /* Ciemne tło */
            text-align: center;
        }

        h1 {
            font-size: 18px;
            color: #00ff00; /* Zielony akcent */
        }

        h2 {
            font-size: 16px;
            color: #00ff00; /* Zielony akcent */
        }

        input, select, textarea, button {
            font-size: 12px;
            font-family: arial, sans-serif;
            color: #ffffff; /* Biały tekst */
            background-color: #1e1e1e; /* Ciemne tło dla inputów */
            border: 1px solid #00ff00; /* Zielona ramka dla inputów */
        }

        textarea {
            width: 490px;
            height: 300px;
        }

        select {
            padding-top: 1px;
            padding-bottom: 1px;
        }

        .form {
            width: 600px;
            margin-left: auto;
            margin-right: auto;
            text-align: left;
        }

        .form label {
            width: 110px;
            float: left;
            margin-top: 3px;
            margin-left: 130px;
            color: #00ff00; /* Zielony kolor etykiet */
        }

        .form .input, .form select {
            width: 225px;
            margin-bottom: 5px;
            background-color: #1e1e1e; /* Ciemne tło */
            color: #00ff00; /* Zielony tekst */
        }

        .form textarea.input {
            height: 100px;
        }

        .form p {
            text-align: center;
        }

        a {
            color: #00bfff; /* Niebieskie linki */
            text-decoration: none;
            font-weight: bold;
        }

        a:hover {
            text-decoration: underline;
        }

        ul, ol {
            text-align: left;
            color: #00ff00; /* Zielony tekst dla list */
        }

        table {
            margin-left: auto;
            margin-right: auto;
            text-align: left;
            color: #ffffff; /* Biały tekst w tabelach */
        }

        .table td {
            border-bottom: 1px solid #00ff00; /* Zielona ramka dla komórek tabeli */
            padding-left: 5px;
            padding-right: 5px;
        }

        .clear {
            clear: both;
        }

        #menu {
            background-color: #1e1e1e; /* Ciemne tło dla menu */
            height: 3px;
            clear: both;
            margin-bottom: 5px;
        }

        #wiadomosci2 a {
            display: block;
            color: #ffffff; /* Biały tekst dla wiadomości */
            font-weight: normal;
            text-decoration: none;
        }

        #wiadomosci .wiadomosc {
            background-color: #003366; /* Ciemnoniebieskie tło dla przeczytanych wiadomości */
            color: #ffffff; /* Biały tekst dla przeczytanych wiadomości */
        }

        #zegar2 {
            visibility: hidden;
            top: 250px;
            position: absolute;
            background-color: #1e1e1e; /* Ciemne tło dla zegara */
            padding-top: 50px;
            width: 400px;
            height: 160px;
            left: 50%;
            margin-left: -200px;
            border: 3px solid #00ff00; /* Zielona ramka */
        }

        #content3 {
            background: url(https://s9566.chomikuj.pl/ChomikImage.aspx?e=fx9X0Uw7mlZ9XfhTFZbZGN78x3NuW7JWlnneBICVHvPx-mI-hvQjfq8Y6qYZgZ1ADQdlRI44UVeYUBmQlncvB4Oka3EdPDVL7LTJGlfADRU&pv=2) no-repeat 40px 30px; /* Zmienione tło */
            height: 450px;
            text-align: left;
            padding-left: 380px;
            padding-right: 40px;
            padding-top: 5px;
            font-size: 16px;
        }

        #content3 h1 {
            font-size: 24px;
            color: #00ff00; /* Zielony tekst */
        }

        .zajety {
            text-align: center;
        }

        .tpl-logo {
            display: inline-block;
            background-color: #000000; /* Czarne tło */
            color: #ffffff; /* Biały tekst */
            font-weight: bold;
            font-size: 24px;
            padding: 8px 16px;
            text-decoration: none;
            border: 2px solid #ffffff; /* Biały outline 2px */
            border-radius: 4px;
            cursor: pointer;
            font-family: Arial, sans-serif;
        }

        .tpl-logo:hover {
            background-color: #333333; /* Nieco jaśniejsze tło przy najechaniu */
            text-decoration: none;
        }

        /* Blokowanie komunikatu o ciasteczkach */
        #cookiesmessage {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            pointer-events: none !important;
        }
    `;

    // Create a style element and append the dark mode styles
    const styleElement = document.createElement('style');
    styleElement.innerText = darkModeStyles;
    document.head.appendChild(styleElement);

    // Replace logo with T.PL text that links to homepage
    const logo = document.querySelector('img[alt="poczta"]');
    if (logo) {
        // Create the T.PL element
        const tplLink = document.createElement('a');
        tplLink.href = '/'; // Link to homepage
        tplLink.className = 'tpl-logo';
        tplLink.textContent = 'T.PL';

        // Replace the logo with the T.PL text
        logo.parentNode.replaceChild(tplLink, logo);
    }

    // Function to block cookies message
    function blockCookiesMessage() {
        // Method 1: CSS hiding (already in styles above)

        // Method 2: DOM removal
        const cookiesMessage = document.getElementById('cookiesmessage');
        if (cookiesMessage) {
            cookiesMessage.remove();
            console.log('Cookies message removed');
        }

        // Method 3: Observe for dynamically added elements
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.id === 'cookiesmessage') {
                            node.remove();
                            console.log('Dynamically added cookies message removed');
                        }
                        // Also check children of added nodes
                        const cookiesMsg = node.querySelector && node.querySelector('#cookiesmessage');
                        if (cookiesMsg) {
                            cookiesMsg.remove();
                            console.log('Cookies message found in added node and removed');
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Run cookies message blocking
    blockCookiesMessage();

    // Also run on page load complete
    window.addEventListener('load', function() {
        setTimeout(blockCookiesMessage, 1000);
    });

})();