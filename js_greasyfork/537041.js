// ==UserScript==
// @name         Drawaria.online - Theme Selector
// @namespace    http://tampermonkey.net/
// @version      2025-05-23
// @description  Select and apply various themes for Drawaria.online!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/test
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        GM_addStyle
// @grant GM_xmlhttpRequest
// @grant GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537041/Drawariaonline%20-%20Theme%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/537041/Drawariaonline%20-%20Theme%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- THEME CODES (PLACEHOLDER - YOU MUST PASTE THE ACTUAL CODE HERE) ---

    const themes = {
        'floralParadise': {
            name: 'Floral Paradise',
            color: 'linear-gradient(to right, #FFC0CB, #FF69B4, #8A2BE2)', // Pink, Hot Pink, Blue Violet
            activate: () => {
                console.log('Activating Floral Paradise theme...');
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
            },
            deactivate: () => {
                console.log('Deactivating Floral Paradise theme...');
                // ADD CODE TO REMOVE OR UNDO THEME CHANGES
                // For GM_addStyle, you might need to add/remove classes or disable styles.
                // For DOM manipulations, revert changes or remove added elements.
                // (This part might be tricky if original scripts don't have deactivation logic)
                // A common approach is to add a specific class to the body/elements
                // and use CSS to override, then remove that class to deactivate.
                // For simplicity, for CSS, you might just rely on overwriting or
                // ensuring only one theme's styles are active at a time.
            }
        },
        'aquaticAbyss': {
            name: 'Aquatic Abyss',
            color: 'linear-gradient(to right, #00FFFF, #00BFFF, #1E90FF)', // Cyan, Deep Sky Blue, Dodger Blue
            activate: () => {
                console.log('Activating Aquatic Abyss theme...');
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

            },
            deactivate: () => {
                console.log('Deactivating Aquatic Abyss theme...');
                // ADD CODE TO REMOVE OR UNDO THEME CHANGES
            }
        },
        'naturesEmbrace': {
            name: "Nature's Embrace",
            color: 'linear-gradient(to right, #90EE90, #3CB371, #228B22)', // Light Green, Medium Sea Green, Forest Green
            activate: () => {
                console.log('Activating Nature\'s Embrace theme...');
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

            },
            deactivate: () => {
                console.log('Deactivating Nature\'s Embrace theme...');
                // ADD CODE TO REMOVE OR UNDO THEME CHANGES
            }
        },
        'valentinesVibe': {
            name: "Valentine's Vibe",
            color: 'linear-gradient(to right, #FFDAB9, #FF6347, #DC143C)', // PeachPuff, Tomato, Crimson
            activate: () => {
                console.log('Activating Valentine\'s Vibe theme...');
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

            },
            deactivate: () => {
                console.log('Deactivating Valentine\'s Vibe theme...');
                // ADD CODE TO REMOVE OR UNDO THEME CHANGES
            }
        },
        'neon': {
            name: 'Neon',
            color: 'linear-gradient(to right, #00FFFF, #FF00FF, #FFFF00)', // Cyan, Magenta, Yellow
            activate: () => {
                console.log('Activating Neon theme...');
                    // Fetch and inject Google Font
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap",
        onload: function(response) {
            GM_addStyle(response.responseText);
        }
    });

    const neonStyles = `
        /* --- Variables de Color Neón --- */
        :root {
            --neon-cyan: #00ffff;
            --neon-magenta: #ff00ff;
            --neon-pink: #ff33cc;
            --neon-blue: #3366ff;
            --neon-green: #39ff14;
            --dark-bg: #0f0c29; /* Fondo principal oscuro */
            --dark-bg-alt: #1a123f; /* Fondo alternativo para paneles */
            --glow-text-shadow: 0 0 5px var(--neon-cyan),
                                0 0 10px var(--neon-cyan),
                                0 0 15px var(--neon-cyan),
                                0 0 20px var(--neon-blue);
            --glow-box-shadow: 0 0 8px var(--neon-magenta),
                               0 0 15px var(--neon-magenta),
                               0 0 20px var(--neon-pink);
            --glow-border: 2px solid var(--neon-cyan);
        }

        /* --- Estilos Globales --- */
        body, html {
            background: var(--dark-bg) !important;
            background-image: linear-gradient(to right top, #0f0c29, #120e30, #151037, #18123e, #1b1445) !important;
            color: var(--neon-cyan) !important;
            font-family: 'Orbitron', sans-serif !important;
            height: 100%;
            overflow-x: hidden; /* Evitar scroll horizontal por glows */
        }

        /* Eliminar el patrón de fondo original */
        body {
            background-image: none !important;
        }


        a {
            color: var(--neon-pink) !important;
            text-decoration: none !important;
            transition: color 0.3s ease, text-shadow 0.3s ease;
        }
        a:hover {
            color: var(--neon-cyan) !important;
            text-shadow: var(--glow-text-shadow);
        }

        h1, h2, h3, h4, h5, h6 {
            color: var(--neon-magenta) !important;
            text-shadow: 0 0 5px var(--neon-magenta), 0 0 10px var(--neon-pink);
        }

        /* --- Layout Principal y Paneles --- */
        #main {
            background-color: transparent !important;
        }

        #leftbar, #rightbar {
            background: var(--dark-bg-alt) !important;
            border-color: var(--neon-blue) !important;
            box-shadow: var(--glow-box-shadow), inset 0 0 10px rgba(51, 102, 255, 0.3);
            border-radius: 10px !important;
            padding: 1em !important;
            transition: box-shadow 0.3s ease;
            width: 18% !important; /* Un poco más de ancho */
        }
        #leftbar:hover, #rightbar:hover {
             box-shadow: 0 0 15px var(--neon-blue),
                               0 0 30px var(--neon-blue),
                               0 0 40px var(--neon-pink),
                               inset 0 0 15px rgba(51, 102, 255, 0.5);
        }
        #leftbar { border-right: var(--glow-border) !important; }
        #rightbar { border-left: var(--glow-border) !important; }


        /* --- Área de Login y Central --- */
        #login {
            padding-top: 2vh !important; /* Menos padding arriba */
        }
        .sitelogo img {
            filter: drop-shadow(0 0 8px var(--neon-cyan)) drop-shadow(0 0 15px var(--neon-blue));
            animation: logoPulse 3s infinite alternate;
        }
        @keyframes logoPulse {
            0% { filter: drop-shadow(0 0 8px var(--neon-cyan)) drop-shadow(0 0 15px var(--neon-blue)); }
            100% { filter: drop-shadow(0 0 12px var(--neon-pink)) drop-shadow(0 0 25px var(--neon-magenta)); }
        }

        #login-midcol {
            background: var(--dark-bg-alt) !important;
            padding: 1.5em !important;
            border-radius: 10px !important;
            box-shadow: var(--glow-box-shadow);
            border: var(--glow-border) !important;
            max-width: 300px !important;
        }
        #login-leftcol > div, #login-rightcol > div:not(.loginbox) { /* Anuncios */
            background: rgba(0,0,0,0.3) !important;
            border-radius: 8px;
            padding: 10px;
            border: 1px solid var(--neon-blue);
        }
        #login-leftcol > div img, #login-rightcol > div img {
            opacity: 0.8;
        }

        /* --- Formularios (Inputs, Selects, Botones) --- */
        input[type="text"], .custom-select {
            background-color: rgba(10, 5, 30, 0.8) !important;
            color: var(--neon-cyan) !important;
            border: 1px solid var(--neon-blue) !important;
            border-radius: 5px !important;
            padding: 0.5em !important;
            box-shadow: inset 0 0 5px rgba(0, 255, 255, 0.3);
        }
        input[type="text"]::placeholder {
            color: rgba(0, 255, 255, 0.5) !important;
        }
        .input-group-text { /* Para el   junto al nombre de usuario */
            background: transparent !important;
            border: none !important;
        }
        #avatarcontainer img {
             border: 2px solid var(--neon-magenta) !important;
             box-shadow: 0 0 10px var(--neon-magenta);
             border-radius: 50% !important; /* Hacer avatar circular */
        }


        .btn {
            color: #fff !important;
            border-radius: 5px !important;
            text-shadow: 0 0 5px #000;
            transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
            position: relative; /* Para pseudo-elementos si se necesitan */
            overflow: hidden;
        }
        .btn:before { /* Efecto de línea brillante en hover */
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent);
            transition: all 0.5s;
        }
        .btn:hover:before {
            left: 100%;
        }

        .btn-warning { /* Jugar */
            background-color: var(--neon-pink) !important;
            border: 1px solid var(--neon-magenta) !important;
            box-shadow: 0 0 8px var(--neon-magenta), 0 0 15px var(--neon-pink);
        }
        .btn-warning:hover {
            background-color: var(--neon-magenta) !important;
            box-shadow: 0 0 12px var(--neon-magenta), 0 0 25px var(--neon-pink), 0 0 5px #fff;
            transform: translateY(-2px);
        }

        .btn-secondary, .btn-info, .btn-primary:not(#login-rightcol .loginbox .btn-primary) { /* Crear Espacio, etc. */
            background-color: var(--neon-blue) !important;
            border: 1px solid var(--neon-cyan) !important;
            box-shadow: 0 0 8px var(--neon-cyan), 0 0 15px var(--neon-blue);
        }
         .btn-secondary:hover, .btn-info:hover, .btn-primary:not(#login-rightcol .loginbox .btn-primary):hover {
            background-color: var(--neon-cyan) !important;
            color: var(--dark-bg) !important;
            text-shadow: none;
            box-shadow: 0 0 12px var(--neon-cyan), 0 0 25px var(--neon-blue), 0 0 5px #fff;
            transform: translateY(-2px);
        }

        .btn-outline-info { /* Restaurar dibujo, etc. */
            color: var(--neon-cyan) !important;
            border-color: var(--neon-cyan) !important;
        }
        .btn-outline-info:hover {
            background-color: var(--neon-cyan) !important;
            color: var(--dark-bg) !important;
            text-shadow: none;
        }

        /* Enlaces en la parte inferior de login-midcol */
        #login-midcol a {
            color: var(--neon-green) !important;
            text-shadow: 0 0 3px var(--neon-green);
            font-weight: bold;
        }
        #login-midcol a:hover {
            color: #fff !important;
            text-shadow: 0 0 5px var(--neon-green), 0 0 10px var(--neon-green);
        }

        /* --- Chat y elementos del juego (ejemplos) --- */
        #chatbox_messages {
            background-color: rgba(10, 5, 30, 0.5) !important;
            border: 1px solid var(--neon-blue);
            border-radius: 5px;
            padding: 5px;
        }
        .playerchatmessage {
            padding: 3px 5px;
            border-radius: 3px;
            margin-bottom: 3px;
        }
        .playerchatmessage-name {
            color: var(--neon-magenta) !important;
            font-weight: bold;
        }
        .playerchatmessage-selfname {
            color: var(--neon-green) !important;
        }
        #chatbox_messages > div:nth-child(odd) {
            background: rgba(0,0,0,0.1) !important;
        }

        .roomlist-item {
            background: var(--dark-bg-alt) !important;
            border: 1px solid var(--neon-blue) !important;
            box-shadow: 0 0 5px var(--neon-blue);
        }
        .roomlist-preview {
            border-color: var(--neon-cyan) !important;
        }

        .wordchooser-row {
            background-color: var(--dark-bg-alt) !important;
            color: var(--neon-cyan);
            border: 1px solid var(--neon-blue);
        }
        .wordchooser-row:hover {
            background-color: var(--neon-blue) !important;
            color: #fff !important;
            box-shadow: 0 0 10px var(--neon-blue);
        }

        /* --- Footer --- */
        .footer, .footer a {
            color: var(--neon-cyan) !important;
            opacity: 0.8;
        }
        .footer a:hover {
            color: var(--neon-pink) !important;
            opacity: 1;
        }
        #discordprombox a, #discordprombox2 a { /* Discord Promos */
           border: 1px solid var(--neon-magenta) !important;
           padding: 0.5em !important;
           border-radius: 5px !important;
           background-color: rgba(255,0,255,0.1) !important;
           box-shadow: 0 0 8px var(--neon-magenta);
           display: inline-block;
        }
         #discordprombox a:hover, #discordprombox2 a:hover {
            background-color: rgba(255,0,255,0.3) !important;
            box-shadow: 0 0 15px var(--neon-magenta);
         }
         #discordprombox img, #discordprombox2 img {
             animation: discordSpin 5s linear infinite;
         }
         @keyframes discordSpin {
             from { transform: rotate(0deg); }
             to { transform: rotate(360deg); }
         }

        /* --- Estilos para Modales --- */
        .modal-content {
            background-color: var(--dark-bg) !important;
            border: 2px solid var(--neon-magenta) !important;
            box-shadow: 0 0 20px var(--neon-magenta), 0 0 30px var(--neon-pink);
            color: var(--neon-cyan) !important;
        }
        .modal-header {
            border-bottom: 1px solid var(--neon-pink) !important;
        }
        .modal-header .close { /* Botón X para cerrar modal */
            color: var(--neon-pink) !important;
            text-shadow: 0 0 5px var(--neon-pink);
        }
        .modal-footer {
            border-top: 1px solid var(--neon-pink) !important;
        }

        /* Scrollbars con estilo neón */
        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        ::-webkit-scrollbar-track {
            background: var(--dark-bg-alt);
            border-radius: 5px;
        }
        ::-webkit-scrollbar-thumb {
            background: var(--neon-blue);
            border-radius: 5px;
            box-shadow: inset 0 0 3px var(--neon-cyan);
        }
        ::-webkit-scrollbar-thumb:hover {
            background: var(--neon-cyan);
            box-shadow: 0 0 5px var(--neon-cyan);
        }
        ::-webkit-scrollbar-corner {
            background: transparent;
        }
    `;

    // Aplicar estilos cuando el DOM esté listo para evitar FOUC (Flash Of Unstyled Content)
    // Usamos document-start y esperamos a que head exista.
    function applyStylesWhenReady() {
        if (document.head) {
            GM_addStyle(neonStyles);
        } else {
            setTimeout(applyStylesWhenReady, 50); // Reintentar pronto
        }
    }
    applyStylesWhenReady();

    // Pequeños ajustes de JS si son necesarios después de que la página cargue completamente
    window.onload = function() {
        // Ejemplo: cambiar texto si es necesario, aunque CSS es preferible
        // const loginButton = document.getElementById('quickplay');
        // if (loginButton) {
        //     // loginButton.innerHTML = ">>> ENTER NEON ZONE <<<";
        // }

        // Forzar que el área de login (midcol) sea visible si otros elementos lo ocultan
        // Esto es un hack, idealmente se maneja con CSS o entendiendo la lógica del sitio
        const midCol = document.getElementById('login-midcol');
        if (midCol && midCol.style.display === 'none') {
            // midCol.style.display = 'block'; // O el display que use
        }
    };

            },
            deactivate: () => {
                console.log('Deactivating Neon theme...');
                // ADD CODE TO REMOVE OR UNDO THEME CHANGES
            }
        },
        'volcanicInferno': {
            name: 'Volcanic Inferno',
            color: 'linear-gradient(to right, #FF4500, #FF0000, #8B0000)', // OrangeRed, Red, DarkRed
            activate: () => {
                console.log('Activating Volcanic Inferno theme...');
                // Fetch and inject a strong, potentially fiery Google Font
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700&family=Orbitron:wght@400;700&display=swap", // Added Exo 2, kept Orbitron as alternative
        onload: function(response) {
            GM_addStyle(response.responseText);
        }
    });

    // --- Volcanic Inferno Theme Styles ---
    const volcanicStyles = `
        /* --- Volcanic Inferno Color Variables --- */
        :root {
            --volcano-black: #1a0505;     /* Very dark, almost black rock */
            --volcano-dark-red: #4d0c0c;  /* Dark, cooled lava red */
            --volcano-lava-red: #b31c1c;  /* Bright, hot lava red */
            --volcano-lava-orange: #ff4500; /* Orange-red, even hotter */
            --volcano-ember-yellow: #ffc300; /* Yellow for glowing embers */
            --volcano-ash-grey: #cccccc;  /* Light grey for ash/cooled text */

            --volcano-text: var(--volcano-ash-grey);
            --volcano-heading: var(--volcano-lava-red);
            --volcano-link: var(--volcano-ember-yellow);

            --volcano-glow-red: 0 0 8px var(--volcano-lava-red),
                                0 0 15px rgba(179, 28, 28, 0.6);
            --volcano-glow-orange: 0 0 8px var(--volcano-lava-orange),
                                   0 0 15px rgba(255, 69, 0, 0.6);
            --volcano-glow-yellow: 0 0 8px var(--volcano-ember-yellow),
                                   0 0 15px rgba(255, 195, 0, 0.6);

            --volcano-box-shadow: 0 0 15px rgba(0,0,0,0.8), /* Dark shadow */
                                  0 0 10px var(--volcano-dark-red), /* Cooled edge glow */
                                  0 0 5px var(--volcano-lava-red) inset; /* Inner heat */
            --volcano-border: 2px solid var(--volcano-dark-red);
        }

        /* --- Global Styles --- */
        body, html {
            background: var(--volcano-black) !important;
            /* Fiery gradient simulating looking into the volcano */
            background-image: radial-gradient(circle at center top, var(--volcano-dark-red) 0%, var(--volcano-black) 80%) !important;
            color: var(--volcano-text) !important;
            font-family: 'Exo 2', 'Orbitron', sans-serif !important; /* Use Exo 2 primarily */
            height: 100%;
            overflow-x: hidden; /* Prevent horizontal scroll from effects */
        }

         /* Ensure the body background image is overridden */
        body {
             background-image: none !important; /* Remove any site background */
        }

        a {
            color: var(--volcano-link) !important;
            text-decoration: none !important;
            transition: color 0.3s ease, text-shadow 0.3s ease;
            font-weight: bold;
            text-shadow: 0 0 3px var(--volcano-link); /* Subtle ember glow */
        }
        a:hover {
            color: #fff !important; /* White-hot on hover */
            text-shadow: var(--volcano-glow-yellow);
        }

        h1, h2, h3, h4, h5, h6 {
            color: var(--volcano-heading) !important;
            text-shadow: var(--volcano-glow-red);
            font-family: 'Exo 2', sans-serif !important; /* Use Exo 2 for headings */
            font-weight: 700 !important;
        }

        /* --- Layout Principal and Panels --- */
        #main {
            background-color: transparent !important;
        }

        #leftbar, #rightbar {
            background: rgba(10, 2, 2, 0.9) !important; /* Semi-transparent dark rock */
            border-color: var(--volcano-dark-red) !important;
            box-shadow: var(--volcano-box-shadow);
            border-radius: 8px !important; /* Like cooled rock chunks */
            padding: 1.2em !important; /* More padding */
            transition: box-shadow 0.3s ease;
            width: 18% !important;
        }
        #leftbar:hover, #rightbar:hover {
             box-shadow: 0 0 25px rgba(0,0,0,1),
                               0 0 15px var(--volcano-dark-red),
                               0 0 10px var(--volcano-lava-red) inset;
        }
        #leftbar { border-right: var(--volcano-border) !important; }
        #rightbar { border-left: var(--volcano-border) !important; }


        /* --- Login Area and Central Content --- */
        #login {
            padding-top: 4vh !important;
        }
        .sitelogo img {
            /* Adjust filter for fire look and lava glow */
            filter: drop-shadow(0 0 8px var(--volcano-lava-red)) drop-shadow(0 0 15px var(--volcano-lava-orange));
            animation: lavaPulse 3s infinite alternate ease-in-out; /* Pulsating lava glow */
        }
        @keyframes lavaPulse {
            0% { filter: drop-shadow(0 0 8px var(--volcano-lava-red)) drop-shadow(0 0 15px var(--volcano-lava-orange)); }
            100% { filter: drop-shadow(0 0 12px var(--volcano-lava-orange)) drop-shadow(0 0 20px var(--volcano-ember-yellow)); }
        }

        #login-midcol {
            background: rgba(10, 2, 2, 0.9) !important; /* Semi-transparent dark rock */
            padding: 1.8em !important; /* More padding */
            border-radius: 8px !important;
            box-shadow: var(--volcano-box-shadow);
            border: var(--volcano-border) !important;
            max-width: 320px !important; /* Slightly wider */
        }
        #login-leftcol > div, #login-rightcol > div:not(.loginbox) { /* Ads/Other boxes */
            background: rgba(0,0,0,0.4) !important; /* More transparent black */
            border-radius: 6px;
            padding: 10px;
            border: 1px solid var(--volcano-dark-red);
            color: var(--volcano-text) !important;
             box-shadow: 0 0 5px rgba(77, 12, 12, 0.5);
        }
        #login-leftcol > div img, #login-rightcol > div img {
            opacity: 0.7; /* Make images less prominent */
        }

        /* --- Forms (Inputs, Selects, Botones) --- */
        input[type="text"], .custom-select {
            background-color: rgba(20, 5, 5, 0.7) !important; /* Dark semi-transparent */
            color: var(--volcano-ember-yellow) !important; /* Ember text */
            border: 1px solid var(--volcano-lava-red) !important;
            border-radius: 5px !important;
            padding: 0.6em !important; /* More padding */
            box-shadow: inset 0 0 5px rgba(255, 69, 0, 0.3); /* Inner orange glow */
             font-family: 'Exo 2', sans-serif !important;
        }
        input[type="text"]::placeholder {
            color: rgba(255, 195, 0, 0.6) !important; /* Ember placeholder */
        }
        .input-group-text { /* Adjacent elements */
            background: transparent !important;
            border: none !important;
            color: var(--volcano-ash-grey) !important;
             font-family: 'Exo 2', sans-serif !important;
        }
         #avatarcontainer img {
             border: 3px solid var(--volcano-lava-red) !important;
             box-shadow: 0 0 15px var(--volcano-lava-red), 0 0 8px var(--volcano-ember-yellow) inset; /* Red glow, yellow inner highlight */
             border-radius: 50% !important; /* Circular avatar */
             transition: transform 0.3s ease, box-shadow 0.3s ease;
         }
         #avatarcontainer img:hover {
             transform: scale(1.1);
             box-shadow: 0 0 20px var(--volcano-lava-orange), 0 0 10px var(--volcano-ember-yellow) inset;
         }

        .btn {
            color: #fff !important; /* White text */
            border-radius: 6px !important;
            text-shadow: 0 0 5px rgba(0,0,0,0.5); /* Dark shadow */
            transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
            position: relative;
            overflow: hidden;
            border: none !important; /* Remove default borders */
            font-weight: bold;
            letter-spacing: 1px;
             font-family: 'Exo 2', sans-serif !important;
        }
        .btn:before { /* Heat shimmer effect */
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
             /* White-hot shimmer */
            background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.5), transparent);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn:hover:before {
            left: 100%;
        }

        .btn-warning { /* 'Play' button (Most prominent) */
            background-color: var(--volcano-lava-orange) !important;
            box-shadow: var(--volcano-glow-orange);
        }
        .btn-warning:hover {
            background-color: var(--volcano-ember-yellow) !important; /* Becomes brighter yellow */
            color: var(--volcano-black) !important; /* Dark text on hot button */
            text-shadow: none;
            box-shadow: 0 0 15px var(--volcano-ember-yellow), 0 0 30px rgba(255, 195, 0, 0.8), 0 0 8px #fff inset;
            transform: scale(1.05);
        }

        .btn-secondary, .btn-info, .btn-primary:not(#login-rightcol .loginbox .btn-primary) { /* 'Create Room', etc. */
            background-color: var(--volcano-lava-red) !important;
            box-shadow: var(--volcano-glow-red);
        }
         .btn-secondary:hover, .btn-info:hover, .btn-primary:not(#login-rightcol .loginbox .btn-primary):hover {
            background-color: var(--volcano-lava-orange) !important; /* Becomes hotter */
             box-shadow: var(--volcano-glow-orange), 0 0 8px #fff inset;
            transform: scale(1.05);
        }

        .btn-outline-info { /* 'Restore Drawing', etc. */
            color: var(--volcano-ember-yellow) !important;
            border: 2px solid var(--volcano-ember-yellow) !important;
            background: transparent !important;
            box-shadow: 0 0 5px rgba(255, 195, 0, 0.5);
             font-family: 'Exo 2', sans-serif !important;
        }
        .btn-outline-info:hover {
            background-color: var(--volcano-ember-yellow) !important;
            color: var(--volcano-black) !important;
            text-shadow: none;
            box-shadow: 0 0 10px var(--volcano-ember-yellow), 0 0 20px rgba(255, 195, 0, 0.8);
        }

        /* Links at the bottom of login-midcol */
        #login-midcol a {
            color: var(--volcano-ember-yellow) !important;
            text-shadow: 0 0 3px var(--volcano-ember-yellow);
            font-weight: bold;
        }
        #login-midcol a:hover {
            color: #fff !important;
            text-shadow: var(--volcano-glow-yellow);
        }

        /* --- Chat and Game Elements (examples) --- */
        #chatbox_messages {
            background-color: rgba(0,0,0,0.5) !important; /* Black semi-transparent */
            border: 1px solid var(--volcano-dark-red);
            border-radius: 6px;
            padding: 8px; /* More padding */
            color: var(--volcano-ash-grey); /* Ash grey text */
             font-family: 'Exo 2', sans-serif !important;
        }
        .playerchatmessage {
            padding: 4px 6px;
            border-radius: 4px;
            margin-bottom: 4px;
            transition: background-color 0.2s ease;
        }
         .playerchatmessage:nth-child(odd) {
             background: rgba(77, 12, 12, 0.2) !important; /* Dark red stripe */
         }
        .playerchatmessage:hover {
            background-color: rgba(77, 12, 12, 0.4) !important; /* Darker red on hover */
        }
        .playerchatmessage-name {
            color: var(--volcano-lava-red) !important; /* Lava red for others */
            font-weight: bold;
        }
        .playerchatmessage-selfname {
            color: var(--volcano-ember-yellow) !important; /* Ember yellow for self */
            text-shadow: 0 0 3px var(--volcano-ember-yellow);
        }

        .roomlist-item {
            background: rgba(10, 2, 2, 0.9) !important; /* Dark rock */
            border: 1px solid var(--volcano-dark-red) !important;
            box-shadow: 0 0 5px rgba(77, 12, 12, 0.5);
            border-radius: 8px;
            transition: box-shadow 0.3s ease;
             color: var(--volcano-ash-grey) !important;
             font-family: 'Exo 2', sans-serif !important;
        }
        .roomlist-item:hover {
            box-shadow: 0 0 10px rgba(77, 12, 12, 0.8), 0 0 5px rgba(179, 28, 28, 0.4) inset;
        }
        .roomlist-preview {
            border-color: var(--volcano-lava-red) !important; /* Lava red border for preview */
        }

        .wordchooser-row {
            background-color: rgba(10, 2, 2, 0.9) !important; /* Dark rock */
            color: var(--volcano-ember-yellow) !important;
            border: 1px solid var(--volcano-lava-red);
            text-shadow: 0 0 3px var(--volcano-ember-yellow);
            border-radius: 5px;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
             font-family: 'Exo 2', sans-serif !important;
        }
        .wordchooser-row:hover {
            background-color: var(--volcano-dark-red) !important; /* Becomes darker red */
            color: #fff !important;
            text-shadow: none;
            box-shadow: 0 0 10px var(--volcano-dark-red);
        }

        /* --- Footer --- */
        .footer, .footer a {
            color: var(--volcano-ash-grey) !important;
            opacity: 0.8;
             font-family: 'Exo 2', sans-serif !important;
        }
        .footer a {
            color: var(--volcano-ember-yellow) !important;
            text-shadow: 0 0 2px var(--volcano-ember-yellow);
        }
        .footer a:hover {
            color: #fff !important;
            opacity: 1;
             text-shadow: var(--volcano-glow-yellow);
        }
        #discordprombox a, #discordprombox2 a { /* Discord Promos */
           border: 1px solid var(--volcano-lava-orange) !important;
           padding: 0.6em !important;
           border-radius: 6px !important;
           background-color: rgba(255, 69, 0, 0.2) !important; /* Semi-transparent orange */
           box-shadow: var(--volcano-glow-orange);
           display: inline-block;
           color: var(--volcano-ember-yellow) !important; /* Ensure link color */
           font-weight: bold;
           transition: background-color 0.3s ease, box-shadow 0.3s ease;
            font-family: 'Exo 2', sans-serif !important;
        }
         #discordprombox a:hover, #discordprombox2 a:hover {
            background-color: rgba(255, 69, 0, 0.4) !important;
             box-shadow: var(--volcano-glow-yellow), 0 0 5px #fff inset;
         }
         #discordprombox img, #discordprombox2 img {
              /* Subtle ember pulse */
             animation: emberPulse 3s ease-in-out infinite alternate;
             filter: drop-shadow(0 0 5px var(--volcano-ember-yellow));
         }
         @keyframes emberPulse {
             0% { transform: scale(1); opacity: 0.9; }
             100% { transform: scale(1.05); opacity: 1; filter: drop-shadow(0 0 8px var(--volcano-ember-yellow)) drop-shadow(0 0 12px var(--volcano-lava-orange)); }
         }


        /* --- Modal Styles --- */
        .modal-content {
            background-color: rgba(20, 5, 5, 0.95) !important; /* Dark, almost opaque */
            border: 2px solid var(--volcano-lava-red) !important; /* Lava red border */
            box-shadow: 0 0 20px rgba(0,0,0,1), 0 0 15px var(--volcano-lava-red), 0 0 10px var(--volcano-lava-orange) inset; /* Dark shadow with lava glow */
            color: var(--volcano-ash-grey) !important;
            border-radius: 10px !important;
             font-family: 'Exo 2', sans-serif !important;
        }
        .modal-header {
            border-bottom: 1px solid var(--volcano-lava-orange) !important; /* Orange separation */
            color: var(--volcano-heading) !important;
             font-family: 'Exo 2', sans-serif !important;
             text-shadow: var(--volcano-glow-red);
        }
        .modal-header .close { /* Close button */
            color: var(--volcano-ember-yellow) !important;
            text-shadow: 0 0 5px var(--volcano-ember-yellow);
            opacity: 0.9;
            transition: opacity 0.3s ease;
        }
         .modal-header .close:hover {
             opacity: 1;
             color: #fff !important;
              text-shadow: var(--volcano-glow-yellow);
         }
        .modal-footer {
            border-top: 1px solid var(--volcano-lava-orange) !important; /* Orange separation */
        }


        /* --- Scrollbars with Volcanic Style --- */
        ::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }
        ::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.5); /* Dark transparent track */
            border-radius: 6px;
        }
        ::-webkit-scrollbar-thumb {
            background: var(--volcano-lava-red); /* Lava red thumb */
            border-radius: 6px;
            box-shadow: inset 0 0 4px rgba(255, 69, 0, 0.5); /* Inner orange highlight */
        }
        ::-webkit-scrollbar-thumb:hover {
            background: var(--volcano-lava-orange); /* Hotter orange on hover */
             box-shadow: 0 0 8px var(--volcano-lava-orange), inset 0 0 6px #fff;
        }
        ::-webkit-scrollbar-corner {
            background: transparent;
        }

         /* --- Floating Embers/Sparks Effect (Basic CSS Animation) --- */
        /* NOTE: True particle effects require JavaScript.
           This is a simple CSS animation using pseudo-elements. */
        body::before, body::after {
            content: '✨'; /* Use sparkle emoji as content */
            position: fixed;
            pointer-events: none;
            z-index: -1; /* Behind everything */
            font-size: 20px; /* Size of the sparks */
            opacity: 0.6;
            text-shadow: 0 0 5px var(--volcano-ember-yellow); /* Ember glow */
            animation: floatSpark 10s infinite ease-in-out;
        }

        body::before {
            top: 90%;
            left: 10%;
            animation-duration: 8s; /* Different speed */
            animation-delay: 1s;    /* Different delay */
            opacity: 0.5;
            font-size: 15px;
        }

        body::after {
            top: 85%;
            left: 85%;
            animation-duration: 12s;
            animation-delay: 3s;
            opacity: 0.7;
            font-size: 25px;
        }

         /* Add more pseudo-elements or use JS for more embers */

        @keyframes floatSpark {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 0.6; }
            25% { transform: translate(15px, -30px) rotate(5deg); opacity: 0.7; }
            50% { transform: translate(0, -60px) rotate(0deg); opacity: 0.8; }
            75% { transform: translate(-15px, -90px) rotate(-5deg); opacity: 0.7; }
            100% { transform: translate(0, -120px) rotate(0deg); opacity: 0.6; } /* Float upwards */
        }

         /* JS example for more particles is commented out in window.onload */
    `;

    // Apply styles when the head is available
    function applyStylesWhenReady() {
        if (document.head) {
            GM_addStyle(volcanicStyles);
        } else {
            setTimeout(applyStylesWhenReady, 50); // Re-check frequently
        }
    }
    applyStylesWhenReady();

    // JS for more complex effects like many particles (commented out)
    window.onload = function() {
        // Example JavaScript to create many floating particles
        /*
        function createParticle() {
            const particle = document.createElement('span');
            particle.textContent = '✨'; // Or a dot '•' or just an empty span with background/border
            particle.classList.add('floating-particle'); // Define this class in CSS

            // Set random properties for position, size, duration, delay
            const size = Math.random() * 15 + 10; // 10px to 25px
            const duration = Math.random() * 10 + 8; // 8s to 18s
            const delay = Math.random() * 5; // 0s to 5s
            const startLeft = Math.random() * 100; // 0vw to 100vw

            particle.style.cssText = `
                position: fixed;
                bottom: -${size}px; /* Start below screen */
             // Define @keyframes floatUp { 0% { transform: translateY(0); } 100% { transform: translateY(-105vh); } } in your CSS


            document.body.appendChild(particle);

            // Optional: Remove particle after a long time or animation cycle
            // particle.addEventListener('animationiteration', () => {
            //     // Reset position instead of removing/creating constantly
            //      particle.style.left = Math.random() * 100 + 'vw';
            //      particle.style.animationDuration = Math.random() * 10 + 8 + 's';
            //      particle.style.animationDelay = Math.random() * 5 + 's';
            // });
             // Or simply remove after a fixed time if infinite iteration isn't used
             setTimeout(() => { particle.remove(); }, (duration + delay) * 1000 + 500); // Remove slightly after animation finishes

        }

         // Create particles periodically (e.g., every 300ms)
         // setInterval(createParticle, 300);

         // Create a burst of particles initially (e.g., 20 particles)
         // for(let i = 0; i < 20; i++) {
         //     createParticle();
         // }

        // NOTE: Too many animated particles can impact performance.
        // Use this JS code with caution or test thoroughly.

            },
            deactivate: () => {
                console.log('Deactivating Volcanic Inferno theme...');
                // ADD CODE TO REMOVE OR UNDO THEME CHANGES
            }
        }
    };

    let activeTheme = null; // Stores the key of the currently active theme

    function activateTheme(themeKey) {
        if (activeTheme === themeKey) {
            console.log(`Theme "${themes[themeKey].name}" is already active.`);
            return;
        }

        // Deactivate current theme if any
        if (activeTheme && themes[activeTheme].deactivate) {
            themes[activeTheme].deactivate();
        }

        // Activate the new theme
        if (themes[themeKey] && themes[themeKey].activate) {
            themes[themeKey].activate();
            activeTheme = themeKey;
            console.log(`Theme "${themes[themeKey].name}" activated.`);
            localStorage.setItem('drawariaActiveTheme', themeKey); // Save active theme
        } else {
            console.error(`Theme "${themeKey}" not found or activate function missing.`);
        }
    }

    function deactivateAllThemes() {
         document.querySelectorAll('[data-drawaria-theme-style]').forEach(style => style.remove());
         document.querySelectorAll('[data-drawaria-theme-element]').forEach(element => element.remove());

         console.log('All themes deactivated for cleanup.');
    }


    // --- UI MENU CREATION ---

    const menuId = 'drawaria-theme-selector-menu';
    let menu = document.getElementById(menuId);

    if (!menu) {
        menu = document.createElement('div');
        menu.id = menuId;
        document.body.appendChild(menu);
    }

    GM_addStyle(`
        #${menuId} {
            position: fixed;
            top: 20px;
            left: 20px;
            background: linear-gradient(135deg, #FFD700, #FFA500, #FF4500); /* Gold, Orange, OrangeRed */
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            cursor: grab;
            font-family: 'Arial', sans-serif;
            color: white;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            transition: background 0.3s ease;
        }

        #${menuId}:active {
            cursor: grabbing;
        }

        #${menuId} h3 {
            margin-top: 0;
            margin-bottom: 15px;
            text-align: center;
            font-size: 1.2em;
        }

        #${menuId} button {
            display: block;
            width: 100%;
            padding: 10px 15px;
            margin-bottom: 10px;
            border: none;
            border-radius: 5px;
            font-size: 1em;
            color: white;
            cursor: pointer;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            transition: transform 0.2s, box-shadow 0.2s;
            background-size: 200% auto; /* For gradient animation */
        }

        #${menuId} button:last-child {
            margin-bottom: 0;
        }

        #${menuId} button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
        }

        #${menuId} button:active {
            transform: translateY(0);
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        }

        #${menuId} .deactivate-button {
            background: linear-gradient(to right, #e74c3c, #c0392b); /* Red */
            color: white;
            margin-top: 15px;
        }
    `);

    const title = document.createElement('h3');
    title.textContent = 'Select Drawaria Theme';
    menu.appendChild(title);

    // Create theme buttons
    for (const key in themes) {
        const theme = themes[key];
        const button = document.createElement('button');
        button.textContent = theme.name;
        button.style.background = theme.color; // Set button background to theme color
        button.addEventListener('click', () => activateTheme(key));
        menu.appendChild(button);
    }


    // --- DRAGGABLE FUNCTIONALITY ---

    let isDragging = false;
    let offsetX, offsetY;

    menu.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - menu.getBoundingClientRect().left;
        offsetY = e.clientY - menu.getBoundingClientRect().top;
        menu.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        menu.style.left = `${e.clientX - offsetX}px`;
        menu.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        menu.style.cursor = 'grab';
    });



// Crear el botón
var resetButton = document.createElement('button');
resetButton.id = 'resetThemeButton';
resetButton.style.padding = '10px';
resetButton.style.backgroundColor = 'RED';
resetButton.style.color = 'white';
resetButton.style.border = 'none';
resetButton.style.borderRadius = '5px';
resetButton.style.cursor = 'pointer';
resetButton.textContent = 'Reset to Original Theme';

// Añadir el evento de clic al botón
resetButton.addEventListener('click', function() {
    // Eliminar todas las hojas de estilo personalizadas
    var stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(function(sheet) {
        if (sheet.href.includes('custom-theme')) { // Ajusta este criterio según sea necesario
            sheet.parentNode.removeChild(sheet);
        }
    });

    // Opcionalmente, recargar la página para asegurar que todos los estilos se restablezcan
    location.reload();
});

// Añadir el botón al menú existente
// Asegúrate de reemplazar '#menuContainer' con el selector correcto para tu menú
var menuContainer = document.querySelector('#drawaria-theme-selector-menu');
if (menuContainer) {
    menuContainer.appendChild(resetButton);
} else {
    console.error('No se encontró el contenedor del menú.');
}
    // --- LOAD LAST ACTIVE THEME ON STARTUP ---
    const savedTheme = localStorage.getItem('drawariaActiveTheme');
    if (savedTheme && themes[savedTheme]) {
        // Deactivate all first to ensure clean state before applying.
        // This is important if themes modify different elements or styles.
        deactivateAllThemes();
        activateTheme(savedTheme);
    } else {
        deactivateAllThemes(); // Ensure no themes are active if none saved
    }

    // IMPORTANT: The way the original scripts apply themes (e.g., using GM_addStyle,
    // directly injecting CSS, or manipulating DOM elements) will dictate how
    // the `activate` and `deactivate` functions should be implemented.
    //
    // For `activate` functions:
    // - If a theme uses `GM_addStyle`, you can paste the `GM_addStyle` call directly.
    //   Consider adding a `data-drawaria-theme-id="THEME_KEY"` attribute to the style
    //   element so it can be easily removed by `deactivateAllThemes`.
    // - If it injects CSS directly into <style> tags or modifies elements,
    //   paste that code. Ensure it's self-contained.
    //
    // For `deactivate` functions:
    // - This is the most challenging part. If the original scripts don't have
    //   deactivation logic, you'll need to infer it.
    // - For CSS: If styles are added via `GM_addStyle`, the easiest way to
    //   "deactivate" is to remove the previously added `<style>` element.
    //   The `deactivateAllThemes` function is designed to help with this,
    //   but the `activate` function must ensure the style elements are tagged.
    //   Example in `activate`:
    //   `const styleEl = GM_addStyle('...'); styleEl.setAttribute('data-drawaria-theme-style', 'true');`
    // - For DOM manipulations (e.g., changing background images, adding elements):
    //   The `deactivate` function for each theme should revert those specific changes.
    //   This might involve resetting styles, removing added elements, etc.
    //   You can tag added elements with `data-drawaria-theme-element="true"` for `deactivateAllThemes` to clean up.
    //
    // A simpler but less ideal solution for CSS-heavy themes:
    // For `deactivateAllThemes`, simply remove all previously added `<style>` tags
    // that might have been added by any theme. This assumes themes primarily add CSS.
    // The provided `deactivateAllThemes` already attempts to remove elements with `data-drawaria-theme-style` and `data-drawaria-theme-element`.
    // You should ensure that your pasted theme code *tags* the elements/styles it adds.

})();