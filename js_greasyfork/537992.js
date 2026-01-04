// ==UserScript==
// @name         Game Menu Icon Enlarger
// @namespace    http://tampermonkey.net/
// @version      0.9 // Incremented version
// @description  Adjust the size of action icons in the game menu for better mobile usability.
// @author       YourName
// @match        https://www.dreadcast.net/Main*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537992/Game%20Menu%20Icon%20Enlarger.user.js
// @updateURL https://update.greasyfork.org/scripts/537992/Game%20Menu%20Icon%20Enlarger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const newIconSize = "43px";
    const iconSpacing = "6px"; // This will be used for 'gap' in Flexbox, or as margin if not using gap.

    // --- CSS to inject ---
    let css = `
        /* Styles for the individual icons */
        .action_perso {
            width: ${newIconSize} !important;
            height: ${newIconSize} !important;
            box-sizing: border-box !important;
            
            /* Option 1: Let parent Flexbox handle spacing via 'gap' */
            margin: 0 !important; /* Set margin to 0 if using 'gap' on parent */
            
            /* Option 2: If not using 'gap' on parent, or if 'gap' isn't supported/working */
            /* margin: ${iconSpacing} !important; */ 

            /* Ensure icons are treated as distinct items for layout, not absolutely positioned by game CSS */
            position: relative !important; 
            top: auto !important; 
            left: auto !important; 
            right: auto !important; 
            bottom: auto !important;
            display: flex !important; /* Ensure it's a flex container for its own content */
            justify-content: center !important;
            align-items: center !important;
        }

        .action_perso .inset_action_perso,
        .action_perso .inset_action_perso svg {
            width: 100% !important;
            height: 100% !important;
        }

        /* --- Styles for the PARENT container: #menu_actions --- */
        /* This is the MOST LIKELY place to fix spacing issues. */
        #menu_actions {
            display: flex !important;         /* Use Flexbox for layout */
            flex-wrap: wrap !important;       /* Allow icons to wrap to the next line if they don't fit */
            
            /* Method 1: Using 'gap' for spacing (preferred) */
            gap: ${iconSpacing} !important;   /* Spacing between icons (rows and columns) */
            
            /* Method 2: Using justify-content for horizontal spacing (if 'gap' doesn't work or for different effects) */
            /* Remove 'gap' above if using this. Icons will need their own margin (see .action_perso Option 2) */
            /* justify-content: flex-start !important; /* Align to start */
            /* justify-content: center !important;   /* Center items on the line */
            /* justify-content: space-around !important; /* Distribute space around items */
            /* justify-content: space-between !important; /* Distribute space between items */

            align-items: center !important;   /* Vertically align items if they wrap to multiple lines */
            align-content: flex-start !important; /* How lines are packed if there's wrapping & extra space */

            /* Ensure the container can adjust its size */
            width: auto !important;           /* Let it adjust to content, or set a specific width like '90vw' or '300px' */
            min-width: ${newIconSize} !important; /* At least as wide as one icon */
            height: auto !important;          /* Let height adjust to content */
            
            /* Optional: Add padding inside the #menu_actions container itself */
            /* padding: 5px !important; */

            /* Override original absolute positioning if it causes issues with new layout.
               This might be necessary if the game positions #menu_actions itself in a way
               that conflicts with a dynamically sized flex container.
               If you uncomment these, you might need to re-position #menu_actions based on your needs.
            */
            /* position: relative !important; */ /* Or 'fixed' or 'static' depending on desired behavior */
            /* top: auto !important; */
            /* left: auto !important; */
            /* margin: 10px auto !important; */ /* Example: to center it if it becomes relative/static */
        }
    `;

    // --- To apply styles only on smaller screens (e.g., mobile) ---
    /*
    const mobileBreakpoint = "768px";
    css = `
        @media (max-width: ${mobileBreakpoint}) {
            .action_perso {
                width: ${newIconSize} !important;
                height: ${newIconSize} !important;
                box-sizing: border-box !important;
                margin: 0 !important; // Assuming parent uses gap
                position: relative !important; top: auto !important; left: auto !important; right: auto !important; bottom: auto !important;
                display: flex !important; justify-content: center !important; align-items: center !important;
            }

            .action_perso .inset_action_perso,
            .action_perso .inset_action__perso svg {
                width: 100% !important;
                height: 100% !important;
            }

            #menu_actions {
                display: flex !important;
                flex-wrap: wrap !important;
                gap: ${iconSpacing} !important;
                // justify-content: center !important; // Or space-around etc. if not using gap
                align-items: center !important;
                align-content: flex-start !important;
                width: auto !important;
                max-width: 95vw !important; // Good for mobile
                height: auto !important;
                padding: 5px !important;
                // Example to pin to bottom center on mobile:
                // position: fixed !important;
                // bottom: 10px !important;
                // left: 50% !important;
                // transform: translateX(-50%) !important;
                // margin: 0 !important;
            }
        }
    `;
    */

    // --- Inject the CSS ---
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
        console.log("Game Menu Icon Enlarger: Styles applied (v0.8 - Flexbox parent).");
    } else {
        console.error("Game Menu Icon Enlarger: GM_addStyle is not available.");
        const styleNode = document.createElement('style');
        styleNode.type = "text/css";
        styleNode.appendChild(document.createTextNode(css));
        (document.head || document.documentElement).appendChild(styleNode);
        console.log("Game Menu Icon Enlarger: Styles applied via fallback method (v0.8 - Flexbox parent).");
    }

})();