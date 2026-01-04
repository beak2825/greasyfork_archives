// ==UserScript==
// @name         Drawaria.online Nature's Embrace
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A soothing nature and paradise theme for Drawaria.online with natural colors, fonts, and subtle effects.
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
// @downloadURL https://update.greasyfork.org/scripts/536165/Drawariaonline%20Nature%27s%20Embrace.user.js
// @updateURL https://update.greasyfork.org/scripts/536165/Drawariaonline%20Nature%27s%20Embrace.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fetch and inject nature-friendly Google Fonts
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&family=Nunito:wght@400;700&display=swap", // Quicksand & Nunito for friendly, rounded look
        onload: function(response) {
            GM_addStyle(response.responseText);
        }
    });

    // --- Nature's Embrace Theme Styles ---
    const natureStyles = `
        /* --- Nature's Embrace Color Variables --- */
        :root {
            --nature-green-dark: #2f4f4f;  /* Dark Slate Gray (forest floor) */
            --nature-green-mid: #6b8e23;   /* Olive Drab (leaves, moss) */
            --nature-green-light: #90ee90; /* Light Green (fresh sprouts) */
            --nature-blue-sky: #87ceeb;    /* Sky Blue (sky) */
            --nature-brown-earth: #a0522d; /* Sienna (soil, wood) */
            --nature-yellow-sun: #ffd700;  /* Gold (sunlight, flowers) */
            --nature-peach: #ffdab9;       /* Peach Puff (soft highlights) */


            --nature-bg-light: #f0fff0; /* Honeydew (very light green-white) */
            --nature-bg-dark: #e0ffff;  /* Light Cyan (light blue-white) */
            --nature-text: var(--nature-green-dark);
            --nature-link: var(--nature-brown-earth);
            --nature-heading: var(--nature-green-mid);

            --nature-text-shadow-leaf: 0 0 5px rgba(107, 142, 35, 0.5); /* Subtle leaf glow */
            --nature-text-shadow-sun: 0 0 5px rgba(255, 215, 0, 0.5); /* Subtle sunlight glow */

            --nature-box-shadow: 0 0 12px rgba(47, 79, 79, 0.3), /* Soft dark shadow */
                                 0 0 6px rgba(107, 142, 35, 0.4) inset; /* Soft inner green glow */
            --nature-border: 1px solid var(--nature-green-mid);
        }

        /* --- Global Styles --- */
        body, html {
            background: var(--nature-bg-light) !important;
            /* Subtle gradient simulating sky meeting earth/water */
            background-image: linear-gradient(to bottom, var(--nature-blue-sky) 0%, var(--nature-bg-dark) 50%, var(--nature-bg-light) 100%) !important;
            color: var(--nature-text) !important;
            /* Use friendly, rounded fonts */
            font-family: 'Quicksand', 'Nunito', sans-serif !important;
            height: 100%;
            overflow-x: hidden; /* Prevent horizontal scroll from effects */
        }

         /* Ensure the body background image is overridden */
        body {
             background-image: none !important; /* Remove any site background */
        }

        a {
            color: var(--nature-link) !important;
            text-decoration: none !important;
            transition: color 0.3s ease, text-shadow 0.3s ease;
            font-weight: bold;
        }
        a:hover {
            color: var(--nature-green-mid) !important; /* Changes to a leafy green */
            text-shadow: var(--nature-text-shadow-leaf);
        }

        h1, h2, h3, h4, h5, h6 {
            color: var(--nature-heading) !important;
            text-shadow: var(--nature-text-shadow-leaf);
            font-family: 'Quicksand', sans-serif !important; /* Consistent heading font */
            font-weight: 700 !important;
        }

        /* --- Layout Principal and Panels --- */
        #main {
            background-color: transparent !important;
        }

        #leftbar, #rightbar {
            background: rgba(240, 255, 240, 0.8) !important; /* Semi-transparent Honeydew */
            border-color: var(--nature-green-mid) !important;
            box-shadow: var(--nature-box-shadow);
            border-radius: 10px !important; /* Softly rounded */
            padding: 1.2em !important;
            transition: box-shadow 0.3s ease;
            width: 18% !important;
        }
        #leftbar:hover, #rightbar:hover {
             box-shadow: 0 0 20px rgba(47, 79, 79, 0.5),
                               0 0 10px rgba(107, 142, 35, 0.6) inset;
        }
        #leftbar { border-right: var(--nature-border) !important; }
        #rightbar { border-left: var(--nature-border) !important; }


        /* --- Login Area and Central Content --- */
        #login {
            padding-top: 4vh !important;
        }
        .sitelogo img {
            /* Adjust filter for nature look and sun/leaf glow */
            filter: drop-shadow(0 0 8px var(--nature-green-mid)) drop-shadow(0 0 15px var(--nature-yellow-sun));
            animation: naturePulse 4s infinite alternate ease-in-out; /* Gentle nature pulse */
        }
        @keyframes naturePulse {
            0% { filter: drop-shadow(0 0 8px var(--nature-green-mid)) drop-shadow(0 0 15px var(--nature-yellow-sun)); }
            100% { filter: drop-shadow(0 0 12px var(--nature-yellow-sun)) drop-shadow(0 0 20px var(--nature-green-light)); }
        }

        #login-midcol {
            background: rgba(240, 255, 240, 0.9) !important; /* More opaque Honeydew */
            padding: 1.8em !important;
            border-radius: 10px !important;
            box-shadow: var(--nature-box-shadow);
            border: var(--nature-border) !important;
            max-width: 320px !important;
        }
        #login-leftcol > div, #login-rightcol > div:not(.loginbox) { /* Ads/Other boxes */
            background: rgba(135, 206, 235, 0.3) !important; /* Sky blue semi-transparent */
            border-radius: 8px;
            padding: 10px;
            border: 1px solid var(--nature-blue-sky);
            color: var(--nature-text) !important;
             box-shadow: 0 0 5px rgba(135, 206, 235, 0.5);
        }
        #login-leftcol > div img, #login-rightcol > div img {
            opacity: 0.8;
        }

        /* --- Forms (Inputs, Selects, Botones) --- */
        input[type="text"], .custom-select {
            background-color: rgba(255, 218, 185, 0.6) !important; /* Peach Puff semi-transparent */
            color: var(--nature-green-dark) !important; /* Dark green text */
            border: 1px solid var(--nature-brown-earth) !important;
            border-radius: 6px !important;
            padding: 0.6em !important;
            box-shadow: inset 0 0 5px rgba(160, 82, 45, 0.3); /* Inner brown glow */
             font-family: 'Quicksand', sans-serif !important;
        }
        input[type="text"]::placeholder {
            color: rgba(47, 79, 79, 0.7) !important; /* Dark green placeholder */
        }
        .input-group-text { /* Adjacent elements */
            background: transparent !important;
            border: none !important;
            color: var(--nature-text) !important;
             font-family: 'Quicksand', sans-serif !important;
        }
         #avatarcontainer img {
             border: 3px solid var(--nature-green-mid) !important;
             box-shadow: 0 0 15px var(--nature-green-mid), 0 0 8px var(--nature-yellow-sun) inset; /* Leafy green glow, sun inner highlight */
             border-radius: 50% !important; /* Circular avatar */
             transition: transform 0.3s ease, box-shadow 0.3s ease;
         }
         #avatarcontainer img:hover {
             transform: scale(1.1);
             box-shadow: 0 0 20px var(--nature-green-light), 0 0 10px var(--nature-yellow-sun) inset;
         }

        .btn {
            color: var(--nature-green-dark) !important; /* Dark green text */
            border-radius: 8px !important;
            text-shadow: 0 0 3px rgba(255, 255, 255, 0.5); /* Subtle highlight */
            transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
            position: relative;
            overflow: hidden;
            border: none !important; /* Remove default borders */
            font-weight: bold;
            letter-spacing: 0.5px;
             font-family: 'Quicksand', sans-serif !important;
        }
        .btn:before { /* Sunlight shimmer effect */
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
             /* Golden/yellow shimmer */
            background: linear-gradient(120deg, transparent, rgba(255, 215, 0, 0.4), transparent);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn:hover:before {
            left: 100%;
        }

        .btn-warning { /* 'Play' button (Most prominent) */
            background-color: var(--nature-green-mid) !important; /* Olive green */
            box-shadow: 0 0 10px var(--nature-green-mid), 0 0 20px rgba(107, 142, 35, 0.5);
        }
        .btn-warning:hover {
            background-color: var(--nature-green-light) !important; /* Becomes brighter green */
            color: var(--nature-green-dark) !important;
            text-shadow: none;
            box-shadow: 0 0 15px var(--nature-green-light), 0 0 30px rgba(144, 238, 144, 0.8), 0 0 8px #fff inset;
            transform: scale(1.05);
        }

        .btn-secondary, .btn-info, .btn-primary:not(#login-rightcol .loginbox .btn-primary) { /* 'Create Room', etc. */
            background-color: var(--nature-brown-earth) !important; /* Earthy brown */
            box-shadow: 0 0 8px var(--nature-brown-earth), 0 0 15px rgba(160, 82, 45, 0.5);
        }
         .btn-secondary:hover, .btn-info:hover, .btn-primary:not(#login-rightcol .loginbox .btn-primary):hover {
            background-color: var(--nature-peach) !important; /* Becomes peachy */
            color: var(--nature-brown-earth) !important;
             box-shadow: 0 0 12px var(--nature-peach), 0 0 25px rgba(255, 218, 185, 0.8), 0 0 8px #fff inset;
            transform: scale(1.05);
        }

        .btn-outline-info { /* 'Restore Drawing', etc. */
            color: var(--nature-green-mid) !important;
            border: 2px solid var(--nature-green-mid) !important;
            background: transparent !important;
            box-shadow: 0 0 5px rgba(107, 142, 35, 0.5);
             font-family: 'Quicksand', sans-serif !important;
        }
        .btn-outline-info:hover {
            background-color: var(--nature-green-mid) !important;
            color: #fff !important;
            text-shadow: none;
            box-shadow: 0 0 10px var(--nature-green-mid), 0 0 20px rgba(107, 142, 35, 0.8);
        }

        /* Links at the bottom of login-midcol */
        #login-midcol a {
            color: var(--nature-green-mid) !important;
            text-shadow: 0 0 3px var(--nature-green-light);
            font-weight: bold;
        }
        #login-midcol a:hover {
            color: var(--nature-yellow-sun) !important;
            text-shadow: var(--nature-text-shadow-sun);
        }

        /* --- Chat and Game Elements (examples) --- */
        #chatbox_messages {
            background-color: rgba(135, 206, 235, 0.4) !important; /* Sky blue semi-transparent */
            border: 1px solid var(--nature-blue-sky);
            border-radius: 8px;
            padding: 8px;
            color: var(--nature-text);
             font-family: 'Quicksand', sans-serif !important;
        }
        .playerchatmessage {
            padding: 4px 6px;
            border-radius: 4px;
            margin-bottom: 4px;
            transition: background-color 0.2s ease;
        }
         .playerchatmessage:nth-child(odd) {
             background: rgba(160, 82, 45, 0.1) !important; /* Earth tone stripe */
         }
        .playerchatmessage:hover {
            background-color: rgba(160, 82, 45, 0.2) !important; /* Darker earth tone on hover */
        }
        .playerchatmessage-name {
            color: var(--nature-green-mid) !important; /* Olive green for others */
            font-weight: bold;
        }
        .playerchatmessage-selfname {
            color: var(--nature-brown-earth) !important; /* Earth brown for self */
            text-shadow: 0 0 3px var(--nature-link);
        }

        .roomlist-item {
            background: rgba(240, 255, 240, 0.8) !important; /* Honeydew */
            border: 1px solid var(--nature-green-mid) !important;
            box-shadow: 0 0 5px rgba(107, 142, 35, 0.3);
            border-radius: 8px;
            transition: box-shadow 0.3s ease;
             color: var(--nature-text) !important;
             font-family: 'Quicksand', sans-serif !important;
        }
        .roomlist-item:hover {
            box-shadow: 0 0 10px rgba(107, 142, 35, 0.6), 0 0 5px rgba(160, 82, 45, 0.4) inset;
        }
        .roomlist-preview {
            border-color: var(--nature-green-mid) !important; /* Leafy green border for preview */
        }

        .wordchooser-row {
            background-color: rgba(240, 255, 240, 0.9) !important; /* Honeydew */
            color: var(--nature-green-dark) !important;
            border: 1px solid var(--nature-green-mid);
            text-shadow: var(--nature-text-shadow-leaf);
            border-radius: 5px;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
             font-family: 'Quicksand', sans-serif !important;
        }
        .wordchooser-row:hover {
            background-color: var(--nature-green-light) !important; /* Becomes brighter green */
            color: var(--nature-green-dark) !important;
            text-shadow: none;
            box-shadow: 0 0 10px var(--nature-green-light);
        }

        /* --- Footer --- */
        .footer, .footer a {
            color: var(--nature-text) !important;
            opacity: 0.9;
             font-family: 'Quicksand', sans-serif !important;
        }
        .footer a {
            color: var(--nature-link) !important;
            text-shadow: 0 0 2px var(--nature-link);
        }
        .footer a:hover {
            color: var(--nature-green-mid) !important;
            opacity: 1;
             text-shadow: var(--nature-text-shadow-leaf);
        }
        #discordprombox a, #discordprombox2 a { /* Discord Promos */
           border: 1px solid var(--nature-green-mid) !important;
           padding: 0.6em !important;
           border-radius: 8px !important;
           background-color: rgba(107, 142, 35, 0.2) !important; /* Semi-transparent olive */
           box-shadow: 0 0 8px var(--nature-green-mid);
           display: inline-block;
           color: var(--nature-green-dark) !important; /* Ensure link color is readable */
           font-weight: bold;
           transition: background-color 0.3s ease, box-shadow 0.3s ease;
            font-family: 'Quicksand', sans-serif !important;
        }
         #discordprombox a:hover, #discordprombox2 a:hover {
            background-color: rgba(107, 142, 35, 0.4) !important;
             box-shadow: 0 0 15px var(--nature-green-mid), 0 0 5px #fff inset;
         }
         #discordprombox img, #discordprombox2 img {
              /* Gentle breathing pulse */
             animation: naturePulseSmall 3s ease-in-out infinite alternate;
             filter: drop-shadow(0 0 5px var(--nature-green-mid));
         }
         @keyframes naturePulseSmall {
             0% { transform: scale(1); opacity: 0.9; }
             100% { transform: scale(1.05); opacity: 1; filter: drop-shadow(0 0 8px var(--nature-green-light)); }
         }


        /* --- Modal Styles --- */
        .modal-content {
            background-color: var(--nature-bg-dark) !important; /* Light blue-white */
            border: 2px solid var(--nature-green-mid) !important; /* Leafy green border */
            box-shadow: 0 0 15px rgba(107, 142, 35, 0.6), 0 0 8px rgba(160, 82, 45, 0.4) inset; /* Green/brown glow */
            color: var(--nature-text) !important;
            border-radius: 10px !important;
             font-family: 'Quicksand', sans-serif !important;
        }
        .modal-header {
            border-bottom: 1px solid var(--nature-green-mid) !important; /* Green separation */
            color: var(--nature-heading) !important;
             font-family: 'Quicksand', sans-serif !important;
             text-shadow: var(--nature-text-shadow-leaf);
        }
        .modal-header .close { /* Close button */
            color: var(--nature-brown-earth) !important;
            text-shadow: 0 0 5px var(--nature-brown-earth);
            opacity: 0.9;
            transition: opacity 0.3s ease;
        }
         .modal-header .close:hover {
             opacity: 1;
             color: var(--nature-green-mid) !important;
              text-shadow: var(--nature-text-shadow-leaf);
         }
        .modal-footer {
            border-top: 1px solid var(--nature-green-mid) !important; /* Green separation */
        }


        /* --- Scrollbars with Nature Style --- */
        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        ::-webkit-scrollbar-track {
            background: var(--nature-bg-dark); /* Light blue track */
            border-radius: 5px;
        }
        ::-webkit-scrollbar-thumb {
            background: var(--nature-green-mid); /* Olive green thumb */
            border-radius: 5px;
            box-shadow: inset 0 0 3px rgba(47, 79, 79, 0.5); /* Inner dark green highlight */
        }
        ::-webkit-scrollbar-thumb:hover {
            background: var(--nature-brown-earth); /* Earth brown on hover */
             box-shadow: 0 0 5px var(--nature-brown-earth), inset 0 0 5px #fff;
        }
        ::-webkit-scrollbar-corner {
            background: transparent;
        }

         /* --- Floating Leaves/Particles Effect (Basic CSS Animation) --- */
        /* NOTE: True dynamic particle effects require JavaScript.
           This is a simple CSS animation using pseudo-elements. */
        body::before, body::after {
            content: '🍃'; /* Use leaf emoji */
            position: fixed;
            bottom: -50px; /* Start offscreen */
            pointer-events: none;
            z-index: -1; /* Behind everything */
            font-size: 25px; /* Size of the leaves */
            opacity: 0.6;
            color: var(--nature-green-light); /* Optional: color the emoji */
            animation: floatLeaf 15s infinite linear; /* Linear for consistent float */
        }

        body::before {
            left: 10%;
            animation-duration: 12s; /* Different speed */
            animation-delay: 1s;    /* Different delay */
            opacity: 0.5;
            font-size: 20px;
             content: '🍂'; /* Autumn leaf */
        }

        body::after {
            left: 85%;
            animation-duration: 18s;
            animation-delay: 3s;
            opacity: 0.7;
            font-size: 30px;
             content: '🍁'; /* Maple leaf */
        }

         /* Add more pseudo-elements or use JS for more leaves */

        @keyframes floatLeaf {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 0.6; }
            50% { transform: translate(20px, -50vh) rotate(180deg); opacity: 0.8; } /* Sway and rotate upwards */
            100% { transform: translate(0, -100vh) rotate(360deg); opacity: 0.6; } /* Float offscreen */
        }

         /* JS example for many particles is commented out in window.onload */
    `;

    // Apply styles when the head is available
    function applyStylesWhenReady() {
        if (document.head) {
            GM_addStyle(natureStyles);
        } else {
            setTimeout(applyStylesWhenReady, 50); // Re-check frequently
        }
    }
    applyStylesWhenReady();

    // JS for more complex effects like many particles (commented out)
    window.onload = function() {
        // Example JavaScript to create many floating leaves
        /*
        function createLeaf() {
            const leaf = document.createElement('span');
            const leafEmojis = ['🍃', '🍂', '🍁'];
            leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)]; // Random leaf emoji
            leaf.classList.add('floating-leaf'); // Define this class in CSS

            // Set random properties for position, size, duration, delay
            const size = Math.random() * 20 + 15; // 15px to 35px
            const duration = Math.random() * 15 + 10; // 10s to 25s
            const delay = Math.random() * 5; // 0s to 5s
            const startLeft = Math.random() * 100; // 0vw to 100vw
            const swayAmount = Math.random() * 50 + 20; // How much it sways horizontally (20px to 70px)

            document.body.appendChild(leaf);

            // Remove leaf after a long time or animation cycle
            setTimeout(() => { leaf.remove(); }, (duration + delay) * 1000 + 500); // Remove slightly after animation finishes
        }

         // Create leaves periodically (e.g., every 500ms)
         // setInterval(createLeaf, 500);

         // Create a burst of leaves initially (e.g., 15-20 leaves)
         // for(let i = 0; i < 15; i++) {
         //     createLeaf();
         // }

        // NOTE: Too many animated particles can impact performance.
        // Use this JS code with caution or test thoroughly.
        */
    };

})();