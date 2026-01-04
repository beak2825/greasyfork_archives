// ==UserScript==
// @name         Drawaria.online Volcanic Inferno
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A fiery theme for Drawaria.online ambiented inside a volcano with lava, fire, and burning effects.
// @author       YouTubeDrawaria
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @match        https://drawaria.online/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_addStyle
// @license      MIT
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @connect      fonts.googleapis.com
// @connect      fonts.gstatic.com
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536153/Drawariaonline%20Volcanic%20Inferno.user.js
// @updateURL https://update.greasyfork.org/scripts/536153/Drawariaonline%20Volcanic%20Inferno.meta.js
// ==/UserScript==

(function() {
    'use strict';

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
    

})();