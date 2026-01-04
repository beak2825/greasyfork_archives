// ==UserScript==
// @name         Torn Property Give Auto-Fill
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-fill last used User ID when giving property on Torn
// @author       GFOUR
// @match        https://www.torn.com/properties.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537653/Torn%20Property%20Give%20Auto-Fill.user.js
// @updateURL https://update.greasyfork.org/scripts/537653/Torn%20Property%20Give%20Auto-Fill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'torn_property_give_last_userid';

    let hasBeenFilled = false;

    function handleFormSubmit(event) {
        const form = event.target.closest('form');
        if (!form || form.method !== 'post') return;

        // Check if this is the initial give form (has text input)
        const userIdInput = form.querySelector('input[name="userID"][type="text"]');

        if (userIdInput) {
            // This is the initial form with text input
            const currentValue = userIdInput.value.trim();

            if (currentValue === '' && !hasBeenFilled) {
                // Input is empty and hasn't been auto-filled yet
                const lastUserId = localStorage.getItem(STORAGE_KEY);
                if (lastUserId) {
                    event.preventDefault();
                    userIdInput.value = lastUserId;
                    hasBeenFilled = true;
                    console.log('Restored last User ID:', lastUserId, '- Click CONTINUE again to proceed');
                    return false;
                }
            } else if (currentValue !== '') {
                // Input has a value, save it and allow normal submission
                localStorage.setItem(STORAGE_KEY, currentValue);
                hasBeenFilled = false; // Reset for next time
                console.log('Saved User ID to localStorage:', currentValue);
            } else if (hasBeenFilled) {
                // Second click after auto-fill, allow submission
                hasBeenFilled = false; // Reset for next time
                console.log('Second click - proceeding with submission');
            }
        } else {
            // Check if this is the confirmation form (has hidden userID input)
            const hiddenUserIdInput = form.querySelector('input[name="userID"][type="hidden"]');
            if (hiddenUserIdInput) {
                // This is the confirmation form - let it proceed normally
                console.log('Confirmation form submitted');
            }
        }
    }

    function stylePropertyIcons() {
        // Style all property option icons with different colors
        const iconStyles = [
            { selector: 'a[title="Move into this property"]', icon: '.property-option-move', color: '#3498db', name: 'Move' },
            { selector: 'a[title="Customize this property"]', icon: '.property-option-customize', color: '#9b59b6', name: 'Customize' },
            { selector: 'a[title="Sell this property"]', icon: '.property-option-sell', color: '#e74c3c', name: 'Sell' },
            { selector: 'a[title="Lease this property"]', icon: '.property-option-lease', color: '#f39c12', name: 'Lease' },
            { selector: 'a[title="Give this property to someone"]', icon: '.property-option-give', color: '#27ae60', name: 'Give' },
            { selector: 'a[title="Pay upkeep"]', icon: '.property-option-upkeep', color: '#e67e22', name: 'Upkeep' }
        ];

        iconStyles.forEach(style => {
            const link = document.querySelector(style.selector);
            if (link) {
                const icon = link.querySelector(style.icon);
                if (icon) {
                    // Add colored overlay effect
                    icon.style.filter = `drop-shadow(0 0 3px ${style.color}) brightness(1.1) saturate(1.3)`;

                    // Add subtle background color
                    link.style.backgroundColor = `${style.color}15`; // 15 is hex for ~8% opacity
                    link.style.borderRadius = '4px';
                    link.style.transition = 'all 0.2s ease';

                    // Add hover effect
                    link.addEventListener('mouseenter', function() {
                        this.style.backgroundColor = `${style.color}25`; // Slightly more opaque on hover
                        icon.style.filter = `drop-shadow(0 0 6px ${style.color}) brightness(1.2) saturate(1.5)`;
                    });

                    link.addEventListener('mouseleave', function() {
                        this.style.backgroundColor = `${style.color}15`;
                        icon.style.filter = `drop-shadow(0 0 3px ${style.color}) brightness(1.1) saturate(1.3)`;
                    });
                }
            }
        });
    }

    function initializeScript() {
        // Add event listener to handle form submissions
        document.addEventListener('click', function(event) {
            // Check if clicked element is the CONTINUE button
            if (event.target.classList.contains('torn-btn') &&
                event.target.value === 'CONTINUE' &&
                event.target.type === 'submit') {

                handleFormSubmit(event);
            }
        }, true); // Use capture phase to ensure we get the event first

        // Style all property icons to make them colorful and distinctive
        stylePropertyIcons();

        console.log('Torn Property Give Auto-Fill script initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }

    // Also initialize when navigating within the SPA (if Torn uses hash routing)
    window.addEventListener('hashchange', function() {
        // Small delay to allow DOM updates
        setTimeout(initializeScript, 100);
    });

})();