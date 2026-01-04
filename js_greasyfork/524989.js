// ==UserScript==
// @name         Willhaben Dark Mode
// @namespace    http://tampermonkey.net/
// @version      2025-01-31
// @description  Makes willhaben.at in Dark Mode (can be toggled on and off) and removes the ad on top completely!
// @author       Mario Dittrich
// @match        https://www.willhaben.at/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=willhaben.at
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/524989/Willhaben%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/524989/Willhaben%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observeDOM = (targetSelector, callback) => {
        const observer = new MutationObserver((mutations) => {
            if (document.querySelector(targetSelector)) {
                callback();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };




    // Apply dark mode styles immediately when the script is loaded
    const applyDarkMode = () => {
        if (document.getElementById('dark-mode-styles')) return; // Prevent duplicate styles

        const style = document.createElement('style');
        style.id = 'dark-mode-styles';
        style.textContent = `
    body, html {
        background-color: #121212 !important;
        color: #e0e0e0 !important;
    }
    a, button {
        color: #87cefa !important;
    }
    input, textarea, select {
        background-color: #222 !important;
        color: #e0e0e0 !important;
        border: 1px solid #444 !important;
    }
    * {
        background-color: inherit !important;
        color: inherit !important;
        border-color: #444 !important;
    }
    img {
        display: block !important;
        background-color: transparent !important;
        filter: none !important;
    }
    /* Carousel fixes */
    [data-testid*="carousel-cell-image"] {
        background-color: transparent !important;
    }
    [data-testid*="carousel-cell-image"] img {
        opacity: 1 !important;
        visibility: visible !important;
    }
    /* Background image elements */
    [data-testid*="background-image-"],
    .sc-e72c1335-3, .Aamvx {
        background-image: none !important;
        background-color: transparent !important;
    }
    /* Thumbnail fixes */
    [data-testid="gallery-thumbnail-wrapper"] {
        background: transparent !important;
    }
    [data-testid*="thumbnail-"] {
        opacity: 1 !important;
        visibility: visible !important;
        background: transparent !important;
    }
    .thumbnail-cell {
        background: transparent !important;
    }
    /* Nuclear option for nested elements */
div, section, article, li, span {
    background-color: transparent !important;
    background-image: none !important;
}
/* Fix search dropdown menu */
#keyword-menu[data-testid="suchbegriff-menu"],
#keyword-menu[data-testid="suchbegriff-menu"] li {
    background-color: #333 !important;
    color: #fff !important;
    border: 1px solid #444 !important;
}

#keyword-menu[data-testid="suchbegriff-menu"] button:hover,
#keyword-menu[data-testid="suchbegriff-menu"] li:hover {
    background-color: #444 !important;
}

#keyword-menu[data-testid="suchbegriff-menu"] [aria-selected="true"] {
    background-color: #2a2a2a !important;
    color: #87cefa !important;
}
/* User dropdown menu styling */
.wh-vertical-menu {
    background-color: #333 !important;
    border: 1px solid #444 !important;
}

.wh-vertical-menu--header,
.wh-vertical-menu--footer {
    border-color: #444 !important;
}

.wh-vertical-menu--item,
.wh-vertical-menu--subitem {
    background-color: #333 !important;
    color: #fff !important;
}

.wh-vertical-menu--item:hover,
.wh-vertical-menu--subitem:hover {
    background-color: #444 !important;
}

.wh-vertical-menu--item-text-title,
.Text-sc-10o2fdq-0 {
    color: #e0e0e0 !important;
}

.cugiGx { /* Count numbers */
    color: #87cefa !important;
}

.wh-vertical-menu--subitem .Text-sc-10o2fdq-0 {
    color: #ccc !important;
}

/* Icons */
.wh-vertical-menu svg path {
    fill: #87cefa !important;
}

/* Logout button */
.gTDUoW {
    color: #87cefa !important;
}

/* Filter/Modal dialogs */
.ReactModal__Content,
.BaseModal__StyledReactModal-sc-nhdif2-0,
.Modal__StyledModal-sc-gg9gle-0 {
    background-color: #333 !important;
    border: 1px solid #444 !important;
    color: #e0e0e0 !important;
}

/* Header */
.bnkluR, /* Price/Zustand header */
.etyoCS /* Description text */ {
    background-color: #2a2a2a !important;
    border-bottom: 1px solid #444 !important;
}

/* Form elements */
.sc-8f7a440c-0, /* Input container */
.fta-dLR, /* Select dropdown */
.cFsCdc /* Input field */ {
    background-color: #222 !important;
    color: #e0e0e0 !important;
    border-color: #444 !important;
}

/* Checkboxes */
.fzgLaY label, /* Checkbox labels */
.cWyFGE /* Checkbox text */ {
    color: #e0e0e0 !important;
}

/* Buttons */
.WhLro, /* Cancel button */
.fPWujB /* Submit button */ {
    background-color: #444 !important;
    color: #fff !important;
}

.fPWujB:hover {
    background-color: #555 !important;
}

/* Count numbers */
.iHQBoc {
    color: #87cefa !important;
}

/* Footer */
.eYszKy {
    border-top: 1px solid #444 !important;
    background-color: #2a2a2a !important;
}

/* Add these glow effects inside your dark mode style block */

/* Glowing headers */
.wh-vertical-menu--item-text-title,
.bnkluR,
.etyoCS {
    text-shadow: 0 0 10px #87cefa88 !important;
}

/* Glowing buttons */
button:not(.flickity-button),
.fPWujB,
.WhLro {
    box-shadow: 0 0 8px #87cefa66 !important;
    transition: all 0.3s ease !important;
}

button:hover:not(.flickity-button),
.fPWujB:hover {
    box-shadow: 0 0 15px #87cefa !important;
    transform: scale(1.05) !important;
}


/* Cyberpunk-style price display */
[data-testid="price-information"] {
    text-shadow: 0 0 20px #87cefa !important;
    color: #87cefa !important;
    font-weight: bold !important;
    transform: skewX(-5deg) !important;
}

/* Glowing form focus */
input:focus, textarea:focus, select:focus {
    box-shadow: 0 0 15px #87cefa66 !important;
    border-color: #87cefa !important;
}

/* Pulse animation for main carousel image */
[data-testid*="carousel-cell-image"] img {
    animation: pulse-glow 4s infinite !important;
}

@keyframes pulse-glow {
    0% { box-shadow: 0 0 5px #87cefa33; }
    50% { box-shadow: 0 0 20px #87cefa66; }
    100% { box-shadow: 0 0 5px #87cefa33; }
}


`;
        document.head.appendChild(style);
    };

    // Function to remove dark mode styles
    const removeDarkMode = () => {
        const style = document.getElementById('dark-mode-styles');
        if (style) style.remove();
    };

    // Function to toggle dark mode
    const toggleDarkMode = () => {
        if (document.getElementById('dark-mode-styles')) {
            removeDarkMode();
            localStorage.setItem('darkModeEnabled', 'false');
        } else {
            applyDarkMode();
            localStorage.setItem('darkModeEnabled', 'true');
        }
    };

    // Add the Toggle Dark Mode button
    const addToggleButton = () => {
        if (document.querySelector('[data-testid="dark-mode-toggle"]')) return;

        const targetElement = document.querySelector('[aria-label="Meine Nachrichten"]');
        if (!targetElement) return;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.marginRight = '10px';

        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Dark Mode';
        toggleButton.style.backgroundColor = '#444';
        toggleButton.style.color = '#fff';
        toggleButton.style.border = 'none';
        toggleButton.style.padding = '5px 10px';
        toggleButton.style.borderRadius = '5px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.marginRight = '10px';

        toggleButton.addEventListener('click', toggleDarkMode);

        buttonContainer.appendChild(toggleButton);

        // Insert the button to the left of the target element
        targetElement.parentNode.insertBefore(buttonContainer, targetElement);
        toggleButton.dataset.testid = "dark-mode-toggle";
    };

    // Apply dark mode on initial page load, immediately
    const darkModeEnabled = localStorage.getItem('darkModeEnabled');
    if (darkModeEnabled === 'true') {
        applyDarkMode();
    }

    const adStyles = `
    /* Hide specific ad containers */
    .Box-sc-wfmb7k-0.Grid__GridArea-sc-dtcl2s-1.bQgLzl.ergxBG,
    #apn-large-leaderboard,
    #apn-medium-leaderboard {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        width: 0 !important;
        opacity: 0 !important;
        pointer-events: none !important;
    }
`;


    // Add keyboard navigation for carousel
    const addCarouselHotkeys = () => {
        const handleKeyDown = (e) => {
            // Only handle events when not in an input field
            if (document.activeElement.tagName === 'INPUT') return;

            switch(e.key) {
                case 'ArrowRight': {
                    const nextButton = document.querySelector('.flickity-prev-next-button.next:not(:disabled)');
                    if (nextButton) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        nextButton.click();
                    }
                    break;
                }
                case 'ArrowLeft': {
                    const prevButton = document.querySelector('.flickity-prev-next-button.previous:not(:disabled)');
                    if (prevButton) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        prevButton.click();
                    }
                    break;
                }
            }
        };

        // Use capture phase to intercept events before Flickity
        document.removeEventListener('keydown', handleKeyDown, true);
        document.addEventListener('keydown', handleKeyDown, true);
    };

   const addMapsButton = () => {
    // Find the main container
    const outerContainer = document.querySelector('.Box-sc-wfmb7k-0.bmpCof');
    // Find address box in any type of ad
    const addressBox = document.querySelector('[data-testid="top-contact-box-address-box"]');

    if (!outerContainer || !addressBox) return;

    // Get address parts
    const addressParts = Array.from(addressBox.querySelectorAll('span.Text-sc-10o2fdq-0.eoAJht'))
        .map(span => span.textContent.trim())
        .filter(text => text.length > 0);
    if (addressParts.length === 0) return;

    // Check if button already exists
    if (outerContainer.querySelector('[data-testid="wh-maps-button"]')) return;

    // Create maps button
    const mapsButton = document.createElement('button');
    mapsButton.dataset.testid = "wh-maps-button";
    mapsButton.className = 'Button__ButtonContainer-sc-3uaafx-0 jwEQZe sc-c2a3d8b3-0 bKRmFV';
    mapsButton.type = 'button';
    mapsButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
             class="createSvgIcon__SvgIcon-sc-1vebdtk-0 fVhrnv" pointer-events="none">
            <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
        </svg>
        Auf Karte anzeigen
    `;

    // Add click handler
    mapsButton.addEventListener('click', () => {
        const encodedAddress = encodeURIComponent(addressParts.join(', '));
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    });

    const buttonWrapper = document.createElement('div');
    buttonWrapper.style.display = 'flex';
    buttonWrapper.style.justifyContent = 'center';
    buttonWrapper.style.width = '100%';
    buttonWrapper.style.padding = '10px 0'; // Add some vertical spacing
    buttonWrapper.appendChild(mapsButton);

    // Insert as LAST element in the outer container
    outerContainer.appendChild(buttonWrapper);
};

    const initialize = () => {
        // Run immediately
        addToggleButton();
        addMapsButton();

        // Set up permanent observer
        observeDOM('[data-testid="menu-vertical-id-1"]', () => {
            addToggleButton();
            addMapsButton();
        });


        // Existing ad removal and carousel code
        const adStyleTag = document.createElement('style');
        adStyleTag.textContent = adStyles;
        document.head.appendChild(adStyleTag);
        addCarouselHotkeys();
    };

    // Update your window load listener
    window.addEventListener('load', () => {
        initialize();
        // Apply dark mode preference on initial load
        if (localStorage.getItem('darkModeEnabled') === 'true') {
            applyDarkMode();
        }
    });


})();