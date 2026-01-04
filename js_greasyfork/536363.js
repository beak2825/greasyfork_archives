// ==UserScript==
// @name         Drawaria.online Floral Paradise
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A beautiful floral theme for Drawaria.online with flowers, vibrant colors, and natural elegance.
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
// @downloadURL https://update.greasyfork.org/scripts/536363/Drawariaonline%20Floral%20Paradise.user.js
// @updateURL https://update.greasyfork.org/scripts/536363/Drawariaonline%20Floral%20Paradise.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fetch and inject nature-friendly Google Fonts
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://fonts.googleapis.com/css2?family=Pacifico&family=Nunito:wght@400;700&display=swap", // Pacifico for headings, Nunito for body
        onload: function(response) {
            GM_addStyle(response.responseText);
        }
    });

    // --- Floral Paradise Theme Styles ---
    const floralStyles = `
        /* --- Floral Paradise Color Variables --- */
        :root {
            --floral-white: #f8f8ff;       /* Ghost White (Daisy petals) */
            --floral-yellow: #ffff00;      /* Yellow (Daisy centers, sunlight) */
            --floral-purple: #9400d3;      /* Dark Violet (Violets) */
            --floral-pink-light: #ffc0cb;  /* Pink (Light roses) */
            --floral-pink-mid: #ff69b4;    /* Hot Pink (Vibrant roses) */
            --floral-green-leaf: #556b2f;  /* Dark Olive Green (Leaves, stems) */
            --floral-blue-sky: #b0e0e6;    /* Powder Blue (Sky) */

            --floral-bg-light: #f5fffa; /* Mint Cream (Very light background) */
            --floral-bg-mid: #e6e6fa;   /* Lavender (Soft background) */
            --floral-text: var(--floral-green-leaf); /* Dark green text */
            --floral-link: var(--floral-purple);
            --floral-heading: var(--floral-pink-mid);

            --floral-text-shadow-petal: 0 0 5px rgba(255, 192, 203, 0.6); /* Soft pink glow */
            --floral-text-shadow-leaf: 0 0 5px rgba(85, 107, 47, 0.6); /* Soft green glow */

            --floral-box-shadow: 0 0 15px rgba(255, 192, 203, 0.8), /* Soft pink overall glow */
                                 0 0 8px rgba(148, 0, 211, 0.4) inset; /* Inner violet highlight */
            --floral-border: 2px solid var(--floral-pink-mid);
        }

        /* --- Global Styles --- */
        body, html {
            background: var(--floral-bg-light) !important;
            /* Gentle gradient simulating a bright floral background */
            background-image: linear-gradient(to bottom right, var(--floral-bg-light), var(--floral-bg-mid)) !important;
            color: var(--floral-text) !important;
            /* Use friendly, readable font */
            font-family: 'Nunito', sans-serif !important;
            height: 100%;
            overflow-x: hidden; /* Prevent horizontal scroll from effects */
        }

         /* Ensure the body background image is overridden */
        body {
             background-image: none !important; /* Remove any site background */
        }


        a {
            color: var(--floral-link) !important;
            text-decoration: none !important;
            transition: color 0.3s ease, text-shadow 0.3s ease;
            font-weight: bold;
        }
        a:hover {
            color: var(--floral-pink-mid) !important; /* Changes to a vibrant pink */
            text-shadow: var(--floral-text-shadow-petal);
        }

        h1, h2, h3, h4, h5, h6 {
            color: var(--floral-heading) !important;
            text-shadow: var(--floral-text-shadow-petal);
            font-family: 'Pacifico', cursive !important; /* Elegant script font for headings */
            font-weight: 400 !important; /* Pacifico looks best at normal weight */
        }

        /* --- Layout Principal and Panels --- */
        #main {
            background-color: transparent !important;
        }

        #leftbar, #rightbar {
            background: rgba(245, 255, 250, 0.9) !important; /* Semi-transparent Mint Cream */
            border-color: var(--floral-pink-light) !important;
            box-shadow: var(--floral-box-shadow);
            border-radius: 12px !important; /* Softly rounded, like petals */
            padding: 1.5em !important; /* More padding */
            transition: box-shadow 0.3s ease;
            width: 18% !important;
        }
        #leftbar:hover, #rightbar:hover {
             box-shadow: 0 0 25px rgba(255, 192, 203, 1),
                               0 0 12px rgba(148, 0, 211, 0.6) inset;
        }
        #leftbar { border-right: var(--floral-border) !important; }
        #rightbar { border-left: var(--floral-border) !important; }


        /* --- Login Area and Central Content --- */
        #login {
            padding-top: 5vh !important;
        }
        .sitelogo img {
            /* Adjust filter for floral look and petal glow */
            filter: drop-shadow(0 0 8px var(--floral-pink-mid)) drop-shadow(0 0 15px var(--floral-yellow));
            animation: floralBloom 3s infinite alternate ease-in-out; /* Gentle blooming pulse */
        }
        @keyframes floralBloom {
            0% { filter: drop_shadow(0 0 8px var(--floral-pink-mid)) drop-shadow(0 0 15px var(--floral-yellow)); transform: scale(1); }
            100% { filter: drop_shadow(0 0 12px var(--floral-purple)) drop-shadow(0 0 20px var(--floral-pink-light)); transform: scale(1.05); }
        }

        #login-midcol {
            background: rgba(245, 255, 250, 0.95) !important; /* More opaque Mint Cream */
            padding: 2em !important; /* More padding */
            border-radius: 12px !important;
            box-shadow: var(--floral-box-shadow);
            border: var(--floral-border) !important;
            max-width: 350px !important; /* Wider */
        }
        #login-leftcol > div, #login-rightcol > div:not(.loginbox) { /* Ads/Other boxes */
            background: rgba(176, 224, 230, 0.5) !important; /* Powder Blue semi-transparent */
            border-radius: 10px;
            padding: 12px;
            border: 1px solid var(--floral-blue-sky);
            color: var(--floral-text) !important;
             box-shadow: 0 0 6px rgba(176, 224, 230, 0.6);
        }
        #login-leftcol > div img, #login-rightcol > div img {
            opacity: 0.8;
        }

        /* --- Forms (Inputs, Selects, Botones) --- */
        input[type="text"], .custom-select {
            background-color: rgba(255, 192, 203, 0.4) !important; /* Light Pink semi-transparent */
            color: var(--floral-green-leaf) !important; /* Dark green text */
            border: 1px solid var(--floral-pink-mid) !important;
            border-radius: 8px !important;
            padding: 0.7em !important; /* More padding */
            box-shadow: inset 0 0 6px rgba(255, 105, 180, 0.3); /* Inner pink glow */
             font-family: 'Nunito', sans-serif !important;
        }
        input[type="text"]::placeholder {
            color: rgba(85, 107, 47, 0.7) !important; /* Dark green placeholder */
        }
        .input-group-text { /* Adjacent elements */
            background: transparent !important;
            border: none !important;
            color: var(--floral-text) !important;
             font-family: 'Nunito', sans-serif !important;
        }
         #avatarcontainer img {
             border: 3px solid var(--floral-yellow) !important;
             box-shadow: 0 0 15px var(--floral-yellow), 0 0 8px var(--floral-pink-mid) inset; /* Yellow glow, pink inner highlight */
             border-radius: 50% !important; /* Circular avatar */
             transition: transform 0.3s ease, box-shadow 0.3s ease;
         }
         #avatarcontainer img:hover {
             transform: scale(1.1);
             box-shadow: 0 0 20px var(--floral-yellow), 0 0 10px var(--floral-green-leaf) inset;
         }

        .btn {
            color: var(--floral-green-leaf) !important; /* Dark green text */
            border-radius: 10px !important; /* Rounded corners */
            text-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
            transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
            position: relative;
            overflow: hidden;
            border: none !important;
            font-weight: bold;
            letter-spacing: 0.5px;
             font-family: 'Nunito', sans-serif !important;
        }
        .btn:before { /* Pollen/Sunlight shimmer effect */
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
             /* Yellow/White shimmer */
            background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6), transparent);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn:hover:before {
            left: 100%;
        }

        .btn-warning { /* 'Play' button */
            background-color: var(--floral-pink-mid) !important; /* Hot Pink */
            box-shadow: 0 0 12px var(--floral-pink-mid), 0 0 25px rgba(255, 105, 180, 0.6);
        }
        .btn-warning:hover {
            background-color: var(--floral-pink-dark) !important; /* Darker pink */
            color: #fff !important; /* White text on dark pink */
            text-shadow: none;
            box-shadow: 0 0 18px var(--floral-pink-mid), 0 0 35px rgba(255, 105, 180, 0.9), 0 0 10px #fff inset;
            transform: scale(1.05);
        }

        .btn-secondary, .btn-info, .btn-primary:not(#login-rightcol .loginbox .btn-primary) { /* 'Create Room', etc. */
            background-color: var(--floral-purple) !important; /* Violet */
            box-shadow: 0 0 10px var(--floral-purple), 0 0 20px rgba(148, 0, 211, 0.6);
        }
         .btn-secondary:hover, .btn-info:hover, .btn-primary:not(#login-rightcol .loginbox .btn-primary):hover {
            background-color: var(--floral-link) !important; /* Same purple */
            color: #fff !important;
             box-shadow: 0 0 15px var(--floral-purple), 0 0 30px rgba(148, 0, 211, 0.9), 0 0 10px #fff inset;
            transform: scale(1.05);
        }

        .btn-outline-info { /* 'Restore Drawing', etc. */
            color: var(--floral-green-leaf) !important;
            border: 2px solid var(--floral-green-leaf) !important;
            background: transparent !important;
            box-shadow: 0 0 6px rgba(85, 107, 47, 0.5);
             font-family: 'Nunito', sans-serif !important;
        }
        .btn-outline-info:hover {
            background-color: var(--floral-green-leaf) !important;
            color: #fff !important;
            text-shadow: none;
            box-shadow: 0 0 12px var(--floral-green-leaf), 0 0 25px rgba(85, 107, 47, 0.8);
        }

        /* Links at the bottom of login-midcol */
        #login-midcol a {
            color: var(--floral-green-leaf) !important;
            text-shadow: var(--floral-text-shadow-leaf);
            font-weight: bold;
        }
        #login-midcol a:hover {
            color: var(--floral-yellow) !important;
            text-shadow: var(--floral-text-shadow-sun);
        }

        /* --- Chat and Game Elements (examples) --- */
        #chatbox_messages {
            background-color: rgba(176, 224, 230, 0.6) !important; /* Powder Blue semi-transparent */
            border: 1px solid var(--floral-blue-sky);
            border-radius: 8px;
            padding: 8px;
            color: var(--floral-text);
             font-family: 'Nunito', sans-serif !important;
        }
        .playerchatmessage {
            padding: 4px 6px;
            border-radius: 4px;
            margin-bottom: 4px;
            transition: background-color 0.2s ease;
        }
         .playerchatmessage:nth-child(odd) {
             background: rgba(255, 192, 203, 0.1) !important; /* Light pink stripe */
         }
        .playerchatmessage:hover {
            background-color: rgba(255, 192, 203, 0.3) !important; /* More pink on hover */
        }
        .playerchatmessage-name {
            color: var(--floral-pink-mid) !important; /* Hot pink for others */
            font-weight: bold;
        }
        .playerchatmessage-selfname {
            color: var(--floral-purple) !important; /* Violet for self */
            text-shadow: 0 0 3px var(--floral-purple);
        }

        .roomlist-item {
            background: rgba(245, 255, 250, 0.9) !important; /* Mint Cream */
            border: 1px solid var(--floral-pink-light) !important;
            box-shadow: 0 0 8px rgba(255, 192, 203, 0.5);
            border-radius: 8px;
            transition: box-shadow 0.3s ease;
             color: var(--floral-text) !important;
             font-family: 'Nunito', sans-serif !important;
        }
        .roomlist-item:hover {
            box-shadow: 0 0 15px rgba(255, 192, 203, 0.8), 0 0 6px rgba(148, 0, 211, 0.4) inset;
        }
        .roomlist-preview {
            border-color: var(--floral-green-leaf) !important; /* Leafy green border for preview */
        }

        .wordchooser-row {
            background-color: rgba(245, 255, 250, 0.95) !important; /* Mint Cream */
            color: var(--floral-green-leaf) !important;
            border: 1px solid var(--floral-pink-light);
            text-shadow: var(--floral-text-shadow-leaf);
            border-radius: 6px;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
             font-family: 'Nunito', sans-serif !important;
        }
        .wordchooser-row:hover {
            background-color: var(--floral-pink-light) !important; /* Light pink */
            color: var(--floral-green-leaf) !important;
            text-shadow: none;
            box-shadow: 0 0 10px var(--floral-pink-light);
        }

        /* --- Footer --- */
        .footer, .footer a {
            color: var(--floral-text) !important;
            opacity: 0.9;
             font-family: 'Nunito', sans-serif !important;
        }
        .footer a {
            color: var(--floral-link) !important;
            text-shadow: 0 0 2px var(--floral-link);
        }
        .footer a:hover {
            color: var(--floral-pink-mid) !important;
            opacity: 1;
             text-shadow: var(--floral-text-shadow-petal);
        }
        #discordprombox a, #discordprombox2 a { /* Discord Promos */
           border: 1px solid var(--floral-purple) !important;
           padding: 0.7em !important;
           border-radius: 10px !important; /* More rounded */
           background-color: rgba(148, 0, 211, 0.2) !important; /* Semi-transparent violet */
           box-shadow: 0 0 10px var(--floral-purple);
           display: inline-block;
           color: var(--floral-purple) !important; /* Ensure link color */
           font-weight: bold;
           transition: background-color 0.3s ease, box-shadow 0.3s ease;
            font-family: 'Nunito', sans-serif !important;
        }
         #discordprombox a:hover, #discordprombox2 a:hover {
            background-color: rgba(148, 0, 211, 0.4) !important;
             box-shadow: 0 0 18px var(--floral-purple), 0 0 8px #fff inset;
         }
         #discordprombox img, #discordprombox2 img {
              /* Gentle blooming pulse */
             animation: floralPulseSmall 3s ease-in-out infinite alternate;
             filter: drop-shadow(0 0 5px var(--floral-purple));
         }
         @keyframes floralPulseSmall {
             0% { transform: scale(1); opacity: 0.9; }
             100% { transform: scale(1.05); opacity: 1; filter: drop-shadow(0 0 8px var(--floral-pink-mid)); }
         }


        /* --- Modal Styles --- */
        .modal-content {
            background-color: var(--floral-bg-mid) !important; /* Lavender */
            border: 2px solid var(--floral-pink-mid) !important; /* Hot pink border */
            box-shadow: 0 0 20px rgba(255, 105, 180, 0.8), 0 0 12px rgba(148, 0, 211, 0.5) inset; /* Pink/Violet glow */
            color: var(--floral-text) !important;
            border-radius: 12px !important;
             font-family: 'Nunito', sans-serif !important;
        }
        .modal-header {
            border-bottom: 1px solid var(--floral-pink-mid) !important; /* Hot pink separation */
            color: var(--floral-heading) !important;
             font-family: 'Pacifico', cursive !important;
             text-shadow: var(--floral-text-shadow-petal);
        }
        .modal-header .close { /* Close button */
            color: var(--floral-green-leaf) !important;
            text-shadow: 0 0 5px var(--floral-green-leaf);
            opacity: 0.9;
            transition: opacity 0.3s ease;
        }
         .modal-header .close:hover {
             opacity: 1;
             color: var(--floral-pink-mid) !important;
              text-shadow: var(--floral-text-shadow-petal);
         }
        .modal-footer {
            border-top: 1px solid var(--floral-pink-mid) !important; /* Hot pink separation */
        }


        /* --- Scrollbars with Floral Style --- */
        ::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }
        ::-webkit-scrollbar-track {
            background: var(--floral-bg-mid); /* Lavender track */
            border-radius: 6px;
        }
        ::-webkit-scrollbar-thumb {
            background: var(--floral-pink-mid); /* Hot pink thumb */
            border-radius: 6px;
            box-shadow: inset 0 0 4px rgba(148, 0, 211, 0.5); /* Inner violet highlight */
        }
        ::-webkit-scrollbar-thumb:hover {
            background: var(--floral-purple); /* Violet on hover */
             box-shadow: 0 0 8px var(--floral-purple), inset 0 0 6px #fff;
        }
        ::-webkit-scrollbar-corner {
            background: transparent;
        }

         /* --- Floating Petals Effect (Basic CSS Animation) --- */
        /* NOTE: True dynamic particle effects require JavaScript for many random elements.
           This is a simple CSS animation using pseudo-elements. */
        body::before, body::after, .floral-petal-css1, .floral-petal-css2 {
            content: '🌸'; /* Default flower emoji */
            position: fixed;
            bottom: -50px; /* Start offscreen */
            pointer-events: none;
            z-index: -1; /* Behind everything */
            font-size: 25px; /* Size of the petals/flowers */
            opacity: 0.7;
             /* Text shadow to make emoji stand out slightly */
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
            animation: floatPetal 15s infinite linear; /* Linear for consistent float */
        }

        body::before {
            left: 15%;
            animation-duration: 12s; /* Different speed */
            animation-delay: 1s;    /* Different delay */
            opacity: 0.6;
            font-size: 20px;
             content: '🌼'; /* Daisy emoji */
             animation-name: floatPetalSway; /* Different animation */
             animation-duration: 18s;
             animation-delay: 2s;
        }

        body::after {
            left: 80%;
            animation-duration: 18s;
            animation-delay: 3s;
            opacity: 0.8;
            font-size: 30px;
             content: '🌺'; /* Hibiscus emoji */
             animation-name: floatPetalSlow; /* Different animation */
             animation-duration: 20s;
             animation-delay: 4s;
        }

         /* You can add more CSS classes and ::before/::after rules
            for a few more manually placed petals, e.g.: */
         .floral-petal-css1 { /* Example of a third petal */
             content: '🌷'; /* Tulip emoji */
             left: 45%;
             animation-duration: 14s;
             animation-delay: 5s;
             opacity: 0.7;
             font-size: 22px;
         }
          .floral-petal-css2 { /* Example of a fourth petal */
             content: '🌹'; /* Rose emoji */
             left: 60%;
             animation-duration: 16s;
             animation-delay: 0s;
             opacity: 0.6;
             font-size: 28px;
              animation-name: floatPetalSway; /* Use sway animation */
         }


        @keyframes floatPetal {
            0% { transform: translate(0, 0) rotate(0deg); }
            100% { transform: translate(0, -105vh) rotate(360deg); } /* Float straight up and spin */
        }
         @keyframes floatPetalSway {
             0% { transform: translate(0, 0) rotate(0deg); }
             25% { transform: translate(30px, -25vh) rotate(90deg); }
             50% { transform: translate(0, -50vh) rotate(180deg); }
             75% { transform: translate(-30px, -75vh) rotate(270deg); }
             100% { transform: translate(0, -105vh) rotate(360deg); } /* Float up with sway */
         }
          @keyframes floatPetalSlow {
              0% { transform: translate(0, 0) rotate(0deg); }
             100% { transform: translate(0, -105vh) rotate(180deg); } /* Float slower, less spin */
          }


         /* JS example for many particles is commented out in window.onload */
    `;

    // Add dummy elements for the CSS-only extra petals if they don't exist
    // This is a simple way to make .floral-petal-css1/.floral-petal-css2 work
    // if the page doesn't have elements you can attach them to.
    // A better approach is using pure JS or targeting existing elements if possible.
    // For this simple example, let's *not* add dummy elements as it might interfere.
    // Stick to body::before/after + maybe targeting specific divs if needed, or rely on JS for many.
    // Let's remove the floral-petal-cssX from the selector list to avoid errors if the elements aren't there.
    // We will rely on body::before/after and the commented out JS.

    const finalFloralStyles = floralStyles.replace(', .floral-petal-css1, .floral-petal-css2', ''); // Clean up selector


    // Apply styles when the head is available
    function applyStylesWhenReady() {
        if (document.head) {
            GM_addStyle(finalFloralStyles);
             // If you want more than 2-4 CSS-only petals, you'd need to
             // find other elements on the page to attach ::before/::after to,
             // or create elements with JS. The JS approach below is more flexible.
        } else {
            setTimeout(applyStylesWhenReady, 50); // Re-check frequently
        }
    }
    applyStylesWhenReady();


    // JS for more complex effects like many particles (commented out)
    window.onload = function() {
        // Example JavaScript to create many floating petals
        /*
        function createPetal() {
            const petal = document.createElement('span');
            const petalEmojis = ['🌸', '🌼', '🌺', '🌷', '🌹']; // More variety
            petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)]; // Random flower emoji
            // petal.classList.add('floating-petal'); // Optional class if needed

            // Set random properties for position, size, duration, delay, sway, spin
            const size = Math.random() * 25 + 15; // 15px to 40px
            const duration = Math.random() * 15 + 10; // 10s to 25s
            const delay = Math.random() * 5; // 0s to 5s
            const startLeft = Math.random() * 100; // 0vw to 100vw
            const swayAmount = Math.random() * 60 + 30; // How much it sways horizontally (30px to 90px)
            const spinDirection = Math.random() > 0.5 ? '360deg' : '-360deg'; // Spin clockwise or counter-clockwise
            const animationName = Math.random() > 0.5 ? 'floatPetalSwayDynamic' : 'floatPetalStraightDynamic'; // Use different animations

            // Define dynamic keyframes based on swayAmount if using floatPetalSwayDynamic
            // You would need to define these keyframes once in your CSS or dynamically create them
            // CSS example:
            // @keyframes floatPetalSwayDynamic {
            //     0% { transform: translate(0, 0) rotate(0deg); }
            //     25% { transform: translate(var(--sway, 30px), -25vh) rotate(calc(0.25 * var(--spin-amount, 360deg))); }
            //     50% { transform: translate(0, -50vh) rotate(calc(0.5 * var(--spin-amount, 360deg))); }
            //     75% { transform: translate(calc(-1 * var(--sway, 30px)), -75vh) rotate(calc(0.75 * var(--spin-amount, 360deg))); }
            //     100% { transform: translate(0, -105vh) rotate(var(--spin-amount, 360deg)); }
            // }
            // @keyframes floatPetalStraightDynamic {
            //      0% { transform: translate(0, 0) rotate(0deg); }
            //      100% { transform: translate(0, -105vh) rotate(var(--spin-amount, 360deg)); }
            // }

            document.body.appendChild(petal);

            // Remove petal after its animation duration
            // (This simplified approach assumes animation doesn't loop infinitely or handles removal internally)
             setTimeout(() => { petal.remove(); }, (duration + delay) * 1000 + 500); // Remove slightly after animation finishes
        }

         // Add the necessary keyframes to your main CSS string if you use the dynamic JS approach
         // (You'd need to add them before GM_addStyle)
         // For simplicity in this example, we'll stick to the basic CSS animations defined earlier.

         // Create particles periodically (e.g., every 400ms)
         // setInterval(createPetal, 400);

         // Create a burst of particles initially (e.g., 20-30 petals)
         // for(let i = 0; i < 25; i++) {
         //     createPetal();
         // }

        // NOTE: Too many animated particles can impact performance.
        // Use this JS code with caution or test thoroughly.
        */
    };

})();