// ==UserScript==
// @name         Doobie's Button Bypass
// @namespace    http://tampermonkey.net/DoobiesButtonBypass
// @version      2.1
// @description  Enables attack button when user is in hospital on profile page and mini attack buttons (when holding left click on username) Mail me if you have issues
// @match        https://www.torn.com/profiles.php*
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517188/Doobie%27s%20Button%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/517188/Doobie%27s%20Button%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateAttackButton(button) {
        if (button && button.classList.contains('disabled')) {
            button.classList.remove('disabled');
            button.classList.add('active');
            button.style.pointerEvents = 'auto';
            button.style.opacity = '1';
            button.setAttribute('aria-label', 'Attack (Bypass Hospital Restriction)');

            if (window.location.href.includes('profiles.php')) {
                let svgIcon = button.querySelector('svg');
                if (svgIcon) {
                    svgIcon.style.filter = 'none';
                    svgIcon.style.fill = '#cf3b13';
                }
            }

            if (button.querySelector('svg')) {
                let svgIcon = button.querySelector('svg');
                if (svgIcon) {
                    svgIcon.style.filter = 'none';
                    svgIcon.style.fill = '#cf3b13';
                }
            }

            button.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = button.getAttribute('href');
            });
        }
    }

    function enableProfileAttackButtons() {
        const profileAttackButton = document.querySelector('.profile-button-attack.disabled');
        if (profileAttackButton) updateAttackButton(profileAttackButton);

        const miniAttackButtons = document.querySelectorAll('a.profile-button-attack.disabled');
        miniAttackButtons.forEach(button => updateAttackButton(button));
    }

    function enableFactionWarAttackButtons() {
        const miniAttackButtonsOnWar = document.querySelectorAll('a.profile-button-attack.disabled');
        miniAttackButtonsOnWar.forEach(button => updateAttackButton(button));
    }

    function initializeObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            if (window.location.href.includes('profiles.php')) {
                                enableProfileAttackButtons();
                            } else if (window.location.href.includes('factions.php')) {
                                enableFactionWarAttackButtons();
                            }
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.onload = function() {
        if (window.location.href.includes('profiles.php')) {
            enableProfileAttackButtons();
        } else if (window.location.href.includes('factions.php')) {
            enableFactionWarAttackButtons();
        }
        initializeObserver();
    };

})();

// Made with Love by DoobieSuckin [3255641]