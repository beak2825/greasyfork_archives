// ==UserScript==
// @name         Drawaria.online Valentine's Vibe
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A lovely Valentine's Day theme for Drawaria.online with hearts, soft colors, and romantic effects.
// @author       ouTubeDrawaria
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
// @downloadURL https://update.greasyfork.org/scripts/536148/Drawariaonline%20Valentine%27s%20Vibe.user.js
// @updateURL https://update.greasyfork.org/scripts/536148/Drawariaonline%20Valentine%27s%20Vibe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fetch and inject a romantic Google Font
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Love+Ya+Like+A+Sister&display=swap", // Added Dancing Script and Love Ya Like A Sister
        onload: function(response) {
            GM_addStyle(response.responseText);
        }
    });

    // --- Valentine's Vibe Theme Styles ---
    const valentineStyles = `
        /* --- Valentine's Color Variables --- */
        :root {
            --valentine-pink-light: #ffb6c1; /* Light Pink */
            --valentine-pink-mid: #ff69b4;   /* Hot Pink */
            --valentine-pink-dark: #c71585;  /* Medium Violet Red */
            --valentine-red: #ff0000;      /* Bright Red */
            --valentine-gold: #ffd700;     /* Gold for accents */
            --valentine-bg-light: #fff0f5; /* Lavender Blush (very light background) */
            --valentine-bg-dark: #ffe4e1;  /* Misty Rose (slightly darker background) */
            --valentine-text: #444;        /* Dark text for readability */
            --valentine-link: var(--valentine-pink-dark);

            --valentine-text-shadow: 0 0 5px var(--valentine-pink-light),
                                     0 0 10px var(--valentine-pink-mid);
            --valentine-box-shadow: 0 0 10px rgba(255, 182, 193, 0.8), /* Soft pink glow */
                                    0 0 5px rgba(255, 105, 180, 0.5) inset; /* Inner pink highlight */
            --valentine-border: 1px solid var(--valentine-pink-mid);
        }

        /* --- Global Styles --- */
        body, html {
            background: var(--valentine-bg-light) !important;
            /* Subtle gradient or heart pattern background */
            background-image: linear-gradient(to bottom right, var(--valentine-bg-light), var(--valentine-bg-dark)) !important;
            color: var(--valentine-text) !important;
            /* Use a lovely font, fallback to a sans-serif */
            font-family: 'Love Ya Like A Sister', cursive !important;
            height: 100%;
            overflow-x: hidden; /* Prevent horizontal scroll from effects */
        }

         /* Ensure the body background image is overridden */
        body {
             background-image: none !important; /* Remove any site background */
        }


        a {
            color: var(--valentine-link) !important;
            text-decoration: none !important;
            transition: color 0.3s ease, text-shadow 0.3s ease;
            font-weight: bold;
        }
        a:hover {
            color: var(--valentine-pink-mid) !important;
            text-shadow: 0 0 5px var(--valentine-pink-mid);
        }

        h1, h2, h3, h4, h5, h6 {
            color: var(--valentine-pink-dark) !important;
            text-shadow: var(--valentine-text-shadow);
            font-family: 'Dancing Script', cursive !important; /* More elegant font for headings */
        }

        /* --- Layout Principal and Panels --- */
        #main {
            background-color: transparent !important;
        }

        #leftbar, #rightbar {
            background: var(--valentine-bg-dark) !important;
            border-color: var(--valentine-pink-mid) !important;
            box-shadow: var(--valentine-box-shadow);
            border-radius: 15px !important; /* Very rounded corners like gift boxes */
            padding: 1em !important;
            transition: box-shadow 0.3s ease;
            width: 18% !important;
        }
        #leftbar:hover, #rightbar:hover {
             box-shadow: 0 0 20px rgba(255, 182, 193, 1),
                               0 0 10px rgba(255, 105, 180, 0.8) inset;
        }
        #leftbar { border-right: var(--valentine-border) !important; }
        #rightbar { border-left: var(--valentine-border) !important; }


        /* --- Login Area and Central Content --- */
        #login {
            padding-top: 5vh !important;
        }
        .sitelogo img {
            /* Adjust filter for love look and heart glow */
            filter: drop-shadow(0 0 8px var(--valentine-pink-mid)) drop-shadow(0 0 15px var(--valentine-red));
            animation: heartBeat 2s infinite alternate ease-in-out; /* Pulsating heart beat */
        }
        @keyframes heartBeat {
            0% { filter: drop-shadow(0 0 8px var(--valentine-pink-mid)) drop-shadow(0 0 15px var(--valentine-red)); transform: scale(1); }
            100% { filter: drop-shadow(0 0 12px var(--valentine-red)) drop-shadow(0 0 20px var(--valentine-pink-dark)); transform: scale(1.05); }
        }

        #login-midcol {
            background: var(--valentine-bg-dark) !important;
            padding: 1.5em !important;
            border-radius: 15px !important;
            box-shadow: var(--valentine-box-shadow);
            border: var(--valentine-border) !important;
            max-width: 300px !important;
        }
        #login-leftcol > div, #login-rightcol > div:not(.loginbox) { /* Ads/Other boxes */
            background: rgba(255, 228, 225, 0.7) !important; /* Misty Rose semi-transparent */
            border-radius: 10px;
            padding: 10px;
            border: 1px solid var(--valentine-pink-mid);
            color: var(--valentine-text) !important;
             box-shadow: 0 0 5px rgba(255, 105, 180, 0.5);
        }
        #login-leftcol > div img, #login-rightcol > div img {
            opacity: 0.8; /* Make images softer */
        }

        /* --- Forms (Inputs, Selects, Buttons) --- */
        input[type="text"], .custom-select {
            background-color: rgba(255, 182, 193, 0.5) !important; /* Light pink semi-transparent */
            color: var(--valentine-pink-dark) !important; /* Dark pink text */
            border: 1px solid var(--valentine-pink-mid) !important;
            border-radius: 8px !important;
            padding: 0.5em !important;
            box-shadow: inset 0 0 5px rgba(255, 105, 180, 0.3); /* Inner pink glow */
        }
        input[type="text"]::placeholder {
            color: rgba(199, 21, 133, 0.7) !important; /* Dark pink placeholder */
        }
        .input-group-text { /* Adjacent elements */
            background: transparent !important;
            border: none !important;
            color: var(--valentine-text) !important;
        }
         #avatarcontainer img {
             border: 3px solid var(--valentine-red) !important;
             box-shadow: 0 0 15px var(--valentine-red), 0 0 8px var(--valentine-gold) inset; /* Red glow, gold inner highlight */
             border-radius: 50% !important; /* Circular avatar */
             transition: transform 0.3s ease;
         }
         #avatarcontainer img:hover {
             transform: scale(1.1); /* More prominent hover */
             box-shadow: 0 0 20px var(--valentine-red), 0 0 10px var(--valentine-gold) inset;
         }

        .btn {
            color: #fff !important; /* White text */
            border-radius: 8px !important;
            text-shadow: 0 0 3px rgba(0,0,0,0.3);
            transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
            position: relative;
            overflow: hidden;
            border: none !important; /* Remove default borders */
            font-weight: bold;
            letter-spacing: 0.5px;
        }
        .btn:before { /* Shimmer effect */
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
             /* Golden shimmer */
            background: linear-gradient(120deg, transparent, rgba(255, 215, 0, 0.4), transparent);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn:hover:before {
            left: 100%;
        }

        .btn-warning { /* 'Play' button */
            background-color: var(--valentine-red) !important;
            box-shadow: 0 0 10px var(--valentine-red), 0 0 20px rgba(255, 0, 0, 0.5);
        }
        .btn-warning:hover {
            background-color: var(--valentine-pink-dark) !important;
            box-shadow: 0 0 15px var(--valentine-red), 0 0 30px rgba(255, 0, 0, 0.8), 0 0 8px #fff inset;
            transform: scale(1.05); /* Scale up slightly */
        }

        .btn-secondary, .btn-info, .btn-primary:not(#login-rightcol .loginbox .btn-primary) { /* 'Create Room', etc. */
            background-color: var(--valentine-pink-mid) !important;
            box-shadow: 0 0 8px var(--valentine-pink-mid), 0 0 15px rgba(255, 105, 180, 0.5);
        }
         .btn-secondary:hover, .btn-info:hover, .btn-primary:not(#login-rightcol .loginbox .btn-primary):hover {
            background-color: var(--valentine-pink-dark) !important;
            box-shadow: 0 0 12px var(--valentine-pink-mid), 0 0 25px rgba(255, 105, 180, 0.8), 0 0 8px #fff inset;
            transform: scale(1.05);
        }

        .btn-outline-info { /* 'Restore Drawing', etc. */
            color: var(--valentine-pink-dark) !important;
            border: 2px solid var(--valentine-pink-dark) !important;
            background: transparent !important;
            box-shadow: 0 0 5px rgba(199, 21, 133, 0.5);
        }
        .btn-outline-info:hover {
            background-color: var(--valentine-pink-dark) !important;
            color: #fff !important;
            text-shadow: none;
            box-shadow: 0 0 10px var(--valentine-pink-dark), 0 0 20px rgba(199, 21, 133, 0.8);
        }

        /* Links at the bottom of login-midcol */
        #login-midcol a {
            color: var(--valentine-pink-dark) !important;
            text-shadow: 0 0 3px var(--valentine-pink-mid);
            font-weight: bold;
             font-family: 'Love Ya Like A Sister', cursive !important;
        }
        #login-midcol a:hover {
            color: var(--valentine-red) !important;
            text-shadow: 0 0 5px var(--valentine-red), 0 0 10px var(--valentine-pink-mid);
        }

        /* --- Chat and Game Elements (examples) --- */
        #chatbox_messages {
            background-color: rgba(255, 228, 225, 0.6) !important; /* Misty Rose semi-transparent */
            border: 1px solid var(--valentine-pink-mid);
            border-radius: 8px;
            padding: 5px;
            color: var(--valentine-text); /* Ensure text is dark */
        }
        .playerchatmessage {
            padding: 3px 5px;
            border-radius: 5px;
            margin-bottom: 3px;
            transition: background-color 0.2s ease;
        }
         .playerchatmessage:nth-child(odd) {
             background: rgba(255, 182, 193, 0.2) !important; /* Light pink stripe */
         }
        .playerchatmessage:hover {
            background-color: rgba(255, 182, 193, 0.4) !important; /* More pink on hover */
        }
        .playerchatmessage-name {
            color: var(--valentine-red) !important; /* Red for others */
            font-weight: bold;
        }
        .playerchatmessage-selfname {
            color: var(--valentine-pink-dark) !important; /* Dark pink for self */
            text-shadow: 0 0 3px var(--valentine-pink-mid);
        }

        .roomlist-item {
            background: var(--valentine-bg-dark) !important;
            border: 1px solid var(--valentine-pink-mid) !important;
            box-shadow: 0 0 5px rgba(255, 105, 180, 0.3);
            border-radius: 8px;
            transition: box-shadow 0.3s ease;
        }
        .roomlist-item:hover {
            box-shadow: 0 0 10px rgba(255, 105, 180, 0.6), 0 0 5px rgba(255, 0, 0, 0.4) inset;
        }
        .roomlist-preview {
            border-color: var(--valentine-red) !important; /* Red border for preview */
        }

        .wordchooser-row {
            background-color: var(--valentine-bg-dark) !important;
            color: var(--valentine-pink-dark) !important;
            border: 1px solid var(--valentine-pink-mid);
            text-shadow: 0 0 2px var(--valentine-pink-mid);
            border-radius: 5px;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }
        .wordchooser-row:hover {
            background-color: var(--valentine-pink-mid) !important;
            color: #fff !important;
            text-shadow: none;
            box-shadow: 0 0 10px var(--valentine-pink-mid);
        }

        /* --- Footer --- */
        .footer, .footer a {
            color: var(--valentine-pink-dark) !important;
            opacity: 0.9;
             font-family: 'Love Ya Like A Sister', cursive !important;
        }
        .footer a:hover {
            color: var(--valentine-red) !important;
            opacity: 1;
        }
        #discordprombox a, #discordprombox2 a { /* Discord Promos */
           border: 1px solid var(--valentine-red) !important;
           padding: 0.5em !important;
           border-radius: 8px !important;
           background-color: rgba(255, 0, 0, 0.2) !important; /* Semi-transparent red */
           box-shadow: 0 0 8px var(--valentine-red);
           display: inline-block;
           color: var(--valentine-red) !important; /* Ensure link color */
           font-weight: bold;
           transition: background-color 0.3s ease, box-shadow 0.3s ease;
            font-family: 'Love Ya Like A Sister', cursive !important;
        }
         #discordprombox a:hover, #discordprombox2 a:hover {
            background-color: rgba(255, 0, 0, 0.4) !important;
            box-shadow: 0 0 15px var(--valentine-red), 0 0 5px #fff inset;
         }
         #discordprombox img, #discordprombox2 img {
              /* Heartbeat pulse */
             animation: heartBeatSmall 2s ease-in-out infinite alternate;
             filter: drop-shadow(0 0 3px var(--valentine-red));
         }
         @keyframes heartBeatSmall {
             0% { transform: scale(1); opacity: 0.9; }
             100% { transform: scale(1.1); opacity: 1; }
         }


        /* --- Modal Styles --- */
        .modal-content {
            background-color: var(--valentine-bg-dark) !important; /* Panel background */
            border: 2px solid var(--valentine-pink-mid) !important; /* Pink border */
            box-shadow: 0 0 20px rgba(255, 105, 180, 0.8), 0 0 10px rgba(255, 0, 0, 0.5) inset; /* Pink/Red glow */
            color: var(--valentine-text) !important;
            border-radius: 15px !important;
             font-family: 'Love Ya Like A Sister', cursive !important;
        }
        .modal-header {
            border-bottom: 1px solid var(--valentine-red) !important; /* Red separation */
            color: var(--valentine-pink-dark) !important;
             font-family: 'Dancing Script', cursive !important;
             text-shadow: var(--valentine-text-shadow);
        }
        .modal-header .close { /* Close button */
            color: var(--valentine-red) !important;
            text-shadow: 0 0 5px var(--valentine-red);
            opacity: 0.9;
            transition: opacity 0.3s ease;
        }
         .modal-header .close:hover {
             opacity: 1;
         }
        .modal-footer {
            border-top: 1px solid var(--valentine-red) !important; /* Red separation */
        }


        /* --- Scrollbars with Valentine Style --- */
        ::-webkit-scrollbar {
            width: 12px; /* A bit wider */
            height: 12px;
        }
        ::-webkit-scrollbar-track {
            background: var(--valentine-bg-dark);
            border-radius: 6px;
        }
        ::-webkit-scrollbar-thumb {
            background: var(--valentine-pink-mid);
            border-radius: 6px;
            box-shadow: inset 0 0 4px rgba(199, 21, 133, 0.5); /* Inner dark pink highlight */
        }
        ::-webkit-scrollbar-thumb:hover {
            background: var(--valentine-red);
             box-shadow: 0 0 8px var(--valentine-red), inset 0 0 6px #fff;
        }
        ::-webkit-scrollbar-corner {
            background: transparent;
        }

        /* --- Floating Hearts Effect (Basic CSS Animation) --- */
        /* NOTE: True particle effects are complex and usually require JavaScript.
           This is a simple CSS animation using pseudo-elements. */
        body::before, body::after {
            content: '❤️'; /* Use heart emoji as content */
            position: fixed;
            pointer-events: none;
            z-index: -1; /* Behind everything */
            font-size: 30px; /* Size of the hearts */
            opacity: 0.5;
            animation: floatHeart 15s infinite ease-in-out;
        }

        body::before {
            top: 10%;
            left: 5%;
            animation-duration: 12s; /* Different speed */
            animation-delay: 1s;    /* Different delay */
            opacity: 0.4;
            font-size: 25px;
        }

        body::after {
            top: 80%;
            left: 90%;
            animation-duration: 18s;
            animation-delay: 3s;
            opacity: 0.6;
            font-size: 35px;
        }

         /* Add more pseudo-elements for more hearts if needed,
            e.g., create span elements with JS and add classes to style/animate them */


        @keyframes floatHeart {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 0.5; }
            25% { transform: translate(20px, -50px) rotate(5deg); opacity: 0.6; }
            50% { transform: translate(0, -100px) rotate(0deg); opacity: 0.7; }
            75% { transform: translate(-20px, -150px) rotate(-5deg); opacity: 0.6; }
            100% { transform: translate(0, -200px) rotate(0deg); opacity: 0.5; }
        }

        /* You would need JavaScript to create many hearts randomly */
        /* Example of a class you could add to JS-created hearts: */
        /*
        .floating-heart {
            position: fixed;
            content: '❤️';
            font-size: var(--size); // Set --size with JS
            opacity: var(--opacity); // Set --opacity with JS
            left: var(--left);     // Set --left with JS
            bottom: -50px;         // Start offscreen
            animation: floatUp var(--duration) infinite ease-in-out; // Set --duration with JS
            pointer-events: none;
            z-index: -1;
        }
        @keyframes floatUp {
            0% { transform: translateY(0) rotate(0deg); }
            100% { transform: translateY(-100vh) rotate(360deg); } // Float up the whole screen
        }
        */


    `;

    // Apply styles when the head is available
    function applyStylesWhenReady() {
        if (document.head) {
            GM_addStyle(valentineStyles);
        } else {
            setTimeout(applyStylesWhenReady, 50); // Re-check frequently
        }
    }
    applyStylesWhenReady();

    // No complex JS needed for this theme, basic onload retained for structure
    window.onload = function() {
        // You could add JavaScript here to create dynamic floating hearts
        // or other love-themed effects if the basic CSS animation isn't enough.
        // Example:
        /*
        function createHeart() {
            const heart = document.createElement('span');
            heart.textContent = '❤️';
            heart.classList.add('floating-heart');
            // Set random CSS variables for size, duration, position, etc.
            heart.style.setProperty('--size', Math.random() * 20 + 20 + 'px');
            heart.style.setProperty('--duration', Math.random() * 10 + 10 + 's');
            heart.style.setProperty('--left', Math.random() * 100 + 'vw');
            heart.style.setProperty('--opacity', Math.random() * 0.5 + 0.3);
            document.body.appendChild(heart);

            // Remove heart after animation finishes
            heart.addEventListener('animationend', () => {
                heart.remove();
            });
        }

        // Create a few hearts initially
        // for (let i = 0; i < 10; i++) {
        //     createHeart();
        // }

        // Create hearts periodically
        // setInterval(createHeart, 500); // Creates a new heart every 0.5 seconds
        */
    };

})();