// ==UserScript==
// @name         Drawaria.online Aquatic Abyss
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A deep ocean, aquatic abyss theme for Drawaria.online with subtle underwater effects.
// @author       YouTubeDrawaria
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @match        https://drawaria.online/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @connect      fonts.googleapis.com
// @connect      fonts.gstatic.com
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536166/Drawariaonline%20Aquatic%20Abyss.user.js
// @updateURL https://update.greasyfork.org/scripts/536166/Drawariaonline%20Aquatic%20Abyss.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fetch and inject Google Font (Orbitron can still fit a deep-sea tech vibe)
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap",
        onload: function(response) {
            GM_addStyle(response.responseText);
        }
    });

    // --- Aquatic Abyss Theme Styles ---
    const aquaticStyles = `
        /* --- Aquatic Abyss Color Variables --- */
        :root {
            --abyss-dark-blue: #0A122A; /* Very dark, deep blue */
            --abyss-mid-blue: #1B2A41;  /* Slightly lighter for panels */
            --abyss-deep-green: #0E3337; /* Dark greenish tint */
            --abyss-light-blue: #4B8A8A; /* Muted light blue/cyan */
            --abyss-biolum-purple: #5D3A6F; /* Hint of bioluminescence */
            --abyss-biolum-green: #9BE1A9;  /* Hint of glowing green */

            --abyss-text-color: var(--abyss-light-blue);
            --abyss-link-color: var(--abyss-biolum-green);
            --abyss-heading-color: var(--abyss-light-blue);
            --abyss-border-color: var(--abyss-deep-green);

            --abyss-text-glow: 0 0 4px var(--abyss-light-blue),
                               0 0 8px rgba(75, 138, 138, 0.5); /* Faint glow */
            --abyss-box-shadow: 0 0 10px rgba(0, 0, 0, 0.5), /* Soft overall shadow */
                                0 0 5px var(--abyss-biolum-purple); /* Hint of bioluminescent edge */
            --abyss-border: 1px solid var(--abyss-border-color);
        }

        /* --- Global Styles --- */
        body, html {
            background: var(--abyss-dark-blue) !important;
            /* Subtle gradient or texture to suggest depth */
            background-image: linear-gradient(to bottom, var(--abyss-dark-blue), #050a18) !important;
            color: var(--abyss-text-color) !important;
            font-family: 'Orbitron', sans-serif !important;
            height: 100%;
            overflow-x: hidden; /* Prevent horizontal scroll */
        }

        /* Ensure the body background image is overridden */
        body {
             background-image: none !important; /* Remove any site background */
        }


        a {
            color: var(--abyss-link-color) !important;
            text-decoration: none !important;
            transition: color 0.3s ease, text-shadow 0.3s ease;
            /* Subtle underwater ripple effect on hover - requires JS or complex CSS */
        }
        a:hover {
            color: #fff !important; /* Brighter on hover */
            text-shadow: var(--abyss-text-glow);
        }

        h1, h2, h3, h4, h5, h6 {
            color: var(--abyss-heading-color) !important;
            text-shadow: var(--abyss-text-glow);
        }

        /* --- Layout Principal and Panels --- */
        #main {
            background-color: transparent !important;
        }

        #leftbar, #rightbar {
            background: var(--abyss-mid-blue) !important;
            border-color: var(--abyss-border-color) !important;
            box-shadow: var(--abyss-box-shadow);
            border-radius: 8px !important; /* Slightly rounded like sub windows */
            padding: 1em !important;
            transition: box-shadow 0.3s ease;
            width: 18% !important; /* Keep width as before */
             /* Optional: subtle pulsating effect on hover */
        }
        #leftbar:hover, #rightbar:hover {
             box-shadow: 0 0 15px rgba(0,0,0,0.8),
                               0 0 8px var(--abyss-biolum-purple),
                               0 0 12px var(--abyss-biolum-green);
        }
        #leftbar { border-right: var(--abyss-border) !important; }
        #rightbar { border-left: var(--abyss-border) !important; }


        /* --- Login Area and Central Content --- */
        #login {
            padding-top: 5vh !important; /* Adjust padding */
        }
        .sitelogo img {
            /* Adjust filter for aquatic look and subtle glow */
            filter: drop-shadow(0 0 5px var(--abyss-light-blue)) drop-shadow(0 0 10px var(--abyss-deep-green));
            animation: aquaticPulse 4s infinite alternate ease-in-out; /* Slower, smoother pulse */
        }
        @keyframes aquaticPulse {
            0% { filter: drop-shadow(0 0 5px var(--abyss-light-blue)) drop-shadow(0 0 10px var(--abyss-deep-green)); }
            100% { filter: drop_shadow(0 0 8px var(--abyss-biolum-purple)) drop-shadow(0 0 15px var(--abyss-biolum-green)); }
        }

        #login-midcol {
            background: var(--abyss-mid-blue) !important;
            padding: 1.5em !important;
            border-radius: 8px !important;
            box-shadow: var(--abyss-box-shadow);
            border: var(--abyss-border) !important;
            max-width: 300px !important;
        }
        #login-leftcol > div, #login-rightcol > div:not(.loginbox) { /* Ads/Other boxes */
            background: rgba(0,0,0,0.2) !important; /* More transparent */
            border-radius: 6px;
            padding: 10px;
            border: 1px solid var(--abyss-deep-green);
            color: var(--abyss-text-color) !important;
        }
        #login-leftcol > div img, #login-rightcol > div img {
            opacity: 0.7; /* Make images less prominent */
        }

        /* --- Forms (Inputs, Selects, Buttons) --- */
        input[type="text"], .custom-select {
            background-color: rgba(10, 18, 42, 0.7) !important; /* Darker, semi-transparent */
            color: var(--abyss-biolum-green) !important; /* Glowing text */
            border: 1px solid var(--abyss-deep-green) !important;
            border-radius: 4px !important;
            padding: 0.5em !important;
            box-shadow: inset 0 0 5px rgba(155, 225, 169, 0.2); /* Subtle green inner glow */
        }
        input[type="text"]::placeholder {
            color: rgba(155, 225, 169, 0.5) !important; /* Glowing placeholder text */
        }
        .input-group-text { /* Adjacent elements */
            background: transparent !important;
            border: none !important;
            color: var(--abyss-text-color) !important;
        }
         #avatarcontainer img {
             border: 2px solid var(--abyss-biolum-purple) !important;
             box-shadow: 0 0 10px var(--abyss-biolum-purple), 0 0 5px #fff inset; /* Purple glow, slight inner highlight */
             border-radius: 50% !important; /* Keep circular avatar */
             transition: transform 0.3s ease;
         }
         #avatarcontainer img:hover {
             transform: scale(1.05); /* Subtle hover effect */
         }

        .btn {
            color: #fff !important; /* White or light text */
            border-radius: 5px !important;
            text-shadow: 0 0 3px rgba(0,0,0,0.5); /* Subtle text shadow */
            transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
            position: relative;
            overflow: hidden;
            border: none !important; /* Remove default borders */
        }
        .btn:before { /* Underwater shimmer effect on hover */
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
             /* Aquatic shimmer gradient */
            background: linear-gradient(120deg, transparent, rgba(255,255,255,0.2), rgba(255,255,255,0.2), transparent);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); /* Smoother transition */
        }
        .btn:hover:before {
            left: 100%;
        }

        .btn-warning { /* 'Play' button */
            background-color: var(--abyss-biolum-green) !important;
            box-shadow: 0 0 8px var(--abyss-biolum-green), 0 0 15px rgba(155, 225, 169, 0.5);
        }
        .btn-warning:hover {
            background-color: #fff !important; /* Bright white on hover */
            color: var(--abyss-dark-blue) !important; /* Dark text on light background */
            text-shadow: none;
            box-shadow: 0 0 12px var(--abyss-biolum-green), 0 0 25px rgba(155, 225, 169, 0.8), 0 0 5px #fff;
            transform: translateY(-2px);
        }

        .btn-secondary, .btn-info, .btn-primary:not(#login-rightcol .loginbox .btn-primary) { /* 'Create Room', etc. */
            background-color: var(--abyss-light-blue) !important;
            box-shadow: 0 0 8px var(--abyss-light-blue), 0 0 15px rgba(75, 138, 138, 0.5);
        }
         .btn-secondary:hover, .btn-info:hover, .btn-primary:not(#login-rightcol .loginbox .btn-primary):hover {
            background-color: #fff !important;
            color: var(--abyss-dark-blue) !important;
             text-shadow: none;
            box-shadow: 0 0 12px var(--abyss-light-blue), 0 0 25px rgba(75, 138, 138, 0.8), 0 0 5px #fff;
            transform: translateY(-2px);
        }

        .btn-outline-info { /* 'Restore Drawing', etc. */
            color: var(--abyss-biolum-purple) !important;
            border: 1px solid var(--abyss-biolum-purple) !important;
            background: transparent !important;
            box-shadow: 0 0 5px rgba(93, 58, 111, 0.5);
        }
        .btn-outline-info:hover {
            background-color: var(--abyss-biolum-purple) !important;
            color: #fff !important;
            text-shadow: none;
            box-shadow: 0 0 10px var(--abyss-biolum-purple), 0 0 20px rgba(93, 58, 111, 0.8);
        }

        /* Links at the bottom of login-midcol */
        #login-midcol a {
            color: var(--abyss-biolum-green) !important;
            text-shadow: 0 0 3px var(--abyss-biolum-green);
            font-weight: bold;
        }
        #login-midcol a:hover {
            color: #fff !important;
            text-shadow: 0 0 5px var(--abyss-biolum-green), 0 0 10px var(--abyss-biolum-green);
        }

        /* --- Chat and Game Elements (examples) --- */
        #chatbox_messages {
            background-color: rgba(11, 18, 42, 0.6) !important; /* Darker, more transparent */
            border: 1px solid var(--abyss-deep-green);
            border-radius: 5px;
            padding: 5px;
        }
        .playerchatmessage {
            padding: 3px 5px;
            border-radius: 3px;
            margin-bottom: 3px;
             /* Subtle hover effect to highlight message */
            transition: background-color 0.2s ease;
        }
        .playerchatmessage:hover {
            background-color: rgba(75, 138, 138, 0.1);
        }
        .playerchatmessage-name {
            color: var(--abyss-biolum-purple) !important; /* Purple for others */
            font-weight: bold;
        }
        .playerchatmessage-selfname {
            color: var(--abyss-biolum-green) !important; /* Green for self */
             text-shadow: 0 0 3px var(--abyss-biolum-green); /* Self-name glows */
        }
        #chatbox_messages > div:nth-child(odd) {
            background: rgba(0,0,0,0.05) !important; /* Very subtle stripe */
        }

        .roomlist-item {
            background: var(--abyss-mid-blue) !important;
            border: 1px solid var(--abyss-deep-green) !important;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
            transition: box-shadow 0.3s ease;
        }
        .roomlist-item:hover {
            box-shadow: 0 0 10px rgba(0,0,0,0.8), 0 0 5px var(--abyss-biolum-purple);
        }
        .roomlist-preview {
            border-color: var(--abyss-light-blue) !important;
        }

        .wordchooser-row {
            background-color: var(--abyss-mid-blue) !important;
            color: var(--abyss-biolum-green) !important;
            border: 1px solid var(--abyss-deep-green);
            text-shadow: 0 0 3px var(--abyss-biolum-green);
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }
        .wordchooser-row:hover {
            background-color: var(--abyss-deep-green) !important;
            color: #fff !important;
             text-shadow: none;
            box-shadow: 0 0 10px var(--abyss-deep-green);
        }

        /* --- Footer --- */
        .footer, .footer a {
            color: var(--abyss-light-blue) !important;
            opacity: 0.7;
        }
        .footer a:hover {
            color: var(--abyss-biolum-green) !important;
            opacity: 1;
        }
        #discordprombox a, #discordprombox2 a { /* Discord Promos */
           border: 1px solid var(--abyss-biolum-purple) !important;
           padding: 0.5em !important;
           border-radius: 5px !important;
           background-color: rgba(93, 58, 111, 0.2) !important; /* Semi-transparent purple */
           box-shadow: 0 0 8px var(--abyss-biolum-purple);
           display: inline-block;
           color: var(--abyss-biolum-purple) !important; /* Ensure link color */
           transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }
         #discordprombox a:hover, #discordprombox2 a:hover {
            background-color: rgba(93, 58, 111, 0.4) !important;
            box-shadow: 0 0 15px var(--abyss-biolum-purple), 0 0 5px #fff inset;
         }
         #discordprombox img, #discordprombox2 img {
              /* subtle pulsating/breathing effect instead of spin */
             animation: discordPulse 5s ease-in-out infinite alternate;
             filter: drop-shadow(0 0 3px var(--abyss-biolum-purple));
         }
         @keyframes discordPulse {
             0% { transform: scale(1); opacity: 0.8; }
             100% { transform: scale(1.05); opacity: 1; }
         }


        /* --- Modal Styles --- */
        .modal-content {
            background-color: var(--abyss-mid-blue) !important; /* Panel background */
            border: 2px solid var(--abyss-biolum-purple) !important; /* Bioluminescent border */
            box-shadow: 0 0 20px rgba(0,0,0,0.8), 0 0 15px var(--abyss-biolum-purple), 0 0 10px var(--abyss-biolum-green) inset; /* Dark shadow with bioluminescent glow */
            color: var(--abyss-text-color) !important;
            border-radius: 10px !important;
        }
        .modal-header {
            border-bottom: 1px solid var(--abyss-biolum-green) !important; /* Green separation */
            color: var(--abyss-heading-color) !important;
        }
        .modal-header .close { /* Close button */
            color: var(--abyss-biolum-purple) !important;
            text-shadow: 0 0 5px var(--abyss-biolum-purple);
            opacity: 0.8;
            transition: opacity 0.3s ease;
        }
         .modal-header .close:hover {
             opacity: 1;
         }
        .modal-footer {
            border-top: 1px solid var(--abyss-biolum-green) !important; /* Green separation */
        }


        /* --- Scrollbars with Aquatic Style --- */
        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        ::-webkit-scrollbar-track {
            background: rgba(11, 18, 42, 0.8); /* Darker track */
            border-radius: 5px;
        }
        ::-webkit-scrollbar-thumb {
            background: var(--abyss-deep-green); /* Greenish thumb */
            border-radius: 5px;
            box-shadow: inset 0 0 3px rgba(75, 138, 138, 0.5); /* Subtle inner highlight */
        }
        ::-webkit-scrollbar-thumb:hover {
            background: var(--abyss-light-blue); /* Lighter blue on hover */
             box-shadow: 0 0 5px var(--abyss-light-blue), inset 0 0 5px #fff; /* Light glow */
        }
        ::-webkit-scrollbar-corner {
            background: transparent;
        }

        /* Add subtle bubble animation background (optional and complex) */
        /* This is a basic attempt; more advanced effects require more complex CSS/JS */
        /* You could also use a static background image with bubbles */
         body::before {
             content: '';
             position: fixed;
             top: 0;
             left: 0;
             width: 100%;
             height: 100%;
             pointer-events: none;
             z-index: -1; /* Behind everything */
             /* Example: subtle static bubble effect using pseudo-element */
             /* background-image: radial-gradient(circle at 20% 30%, rgba(75, 138, 138, 0.1) 1px, transparent 0),
                                 radial-gradient(circle at 80% 70%, rgba(93, 58, 111, 0.1) 1px, transparent 0),
                                 radial-gradient(circle at 50% 50%, rgba(155, 225, 169, 0.1) 1px, transparent 0);
             background-size: 50px 50px, 60px 60px, 70px 70px;
              */
             /* More complex animation requires multiple elements or libraries */
         }


    `;

    // Apply styles when the head is available
    function applyStylesWhenReady() {
        if (document.head) {
            GM_addStyle(aquaticStyles);
        } else {
            setTimeout(applyStylesWhenReady, 50); // Re-check frequently
        }
    }
    applyStylesWhenReady();

    // No complex JS needed for this theme, basic onload retained for structure
    window.onload = function() {
        // Optional: You could add JS here for more dynamic effects like moving bubbles
        // or water ripples, but it adds complexity. CSS animations are often enough.
    };

})();