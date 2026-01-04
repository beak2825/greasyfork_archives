// ==UserScript==
// @name         Doobies Button Bypass+
// @namespace    http://tampermonkey.net/DoobiesButtonBypass+
// @version      1.0
// @description  Enables attack button when user is in hospital on profile page and mini attack buttons. It also Duplicates the "start fight" button and puts it on each of your weapons slots, It also has a redirect button to Items/Armory when you get the "cannot do this in hospital" error
// @match        https://www.torn.com/profiles.php*
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/loader.php*sid=attack*
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/547155/Doobies%20Button%20Bypass%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/547155/Doobies%20Button%20Bypass%2B.meta.js
// ==/UserScript==

/*
================================================================================
 NOTE TO TORN ADMINS / SCRIPT REVIEWERS / Consumers of this Script
--------------------------------------------------------------------------------
 This userscript is designed as a Quality-of-Life (QoL) enhancement ONLY.

 - It does not perform any automated actions or background requests.
 - It does not auto-click or simulate user activity without explicit input.
 - All navigation and actions (e.g., attacks, redirections) still require
   a real user click.
 - No Torn API abuse, scraping, or data harvesting is performed.
 - MutationObserver is only used to re-apply UI elements on dynamically
   loaded pages.

 ⚠️ Important:
 The most controversial feature of this script re-enables the disabled
 attack buttons when the user is in hospital.

 This is intended only as a convenience for users. It DOES NOT provide
 any meaningful advantage, since the script does not auto-refresh or
 verify whether a fight is available — users still need to manually
 refresh and initiate attacks themselves. And Being on the attack screen,
 Users who use this script lose out on the In-game Hospital timer to know
 when the users get out of hospital. Meaning loading into the attack screen
 using this script could be considered a DISADVATAGE when you factor you
 lose out on seeing the hospital timer and are essentually gambling on when
 the users hospital timer will end.

 If Torn staff consider this feature non-compliant, please contact me
 in-game with your concerns. I will be happy to adjust or remove it.

 Important context:
- Any user can already access an attack screen by manually appending a
  target’s ID to the standard attack URL.
- This script does not automate that process, it simply removes the
  inconvenience of having to do so manually.

Because of this, I believe the script remains within the spirit of Torn’s
scripting rules. However, I acknowledge this is a gray area, and I’m
open to correction or clarification if staff view it differently.

All that being said, This Script was made with love by Doobiesuckin [3255641]
This script will not get you in trouble (See reasons above) however, like any script
using this script is your choice and the consequences of your actions are yours alone.
This script, Along with all of my other scripts, Are free, If you'd like to support me
Throw me a Xanax or two! Enjoy!
================================================================================
*/


(function() {
    'use strict';
    function updateAttackButton(button) {
        if (button && button.classList.contains('disabled')) {
            button.classList.remove('disabled');
            button.classList.add('active');
            button.style.pointerEvents = 'auto';
            button.style.opacity = '1';

            let svgIcon = button.querySelector('svg');
            if (svgIcon) {
                svgIcon.style.filter = 'none';
                svgIcon.style.fill = '#cf3b13';
            }

            button.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = button.getAttribute('href');
            });
        }
    }

    function enableAttackButtons() {

        const profileAttackButton = document.querySelector('.profile-button-attack.disabled');
        if (profileAttackButton) updateAttackButton(profileAttackButton);

        const miniAttackButtons = document.querySelectorAll('a.profile-button-attack.disabled');
        miniAttackButtons.forEach(button => updateAttackButton(button));
    }

    function addWeaponButtons() {
        if (!window.location.href.includes('sid=attack')) return;

        if (!document.getElementById('weapon-btn-css')) {
            const style = document.createElement('style');
            style.id = 'weapon-btn-css';
            style.textContent = `
                .weapon-fight-btn {
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    background: rgba(207, 59, 19, 0.1) !important;
                    color: white !important;
                    border: none !important;
                    font-size: 16px !important;
                    font-weight: bold !important;
                    cursor: pointer !important;
                    z-index: 10 !important;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9) !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    border-radius: 4px !important;
                    transition: background 0.2s ease !important;
                }
                .weapon-fight-btn:hover {
                    background: rgba(207, 59, 19, 0.2) !important;
                }
                .weapon-fight-btn:active {
                    background: rgba(207, 59, 19, 0.3) !important;
                }
            `;
            document.head.appendChild(style);
        }

        const attackerWeapons = document.querySelectorAll('[id^="weapon_"]:not(.defender___jWmeI):not(.has-fight-btn)');
        attackerWeapons.forEach(weapon => {
            weapon.classList.add('has-fight-btn');
            weapon.style.position = 'relative';

            const button = document.createElement('button');
            button.className = 'weapon-fight-btn';
            button.textContent = 'START FIGHT';

            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                if (!weapon.classList.contains('selected')) {
                    weapon.click();
                    setTimeout(() => startFight(), 200);
                } else {
                    startFight();
                }

                function startFight() {
                    const fightBtn = document.querySelector('.dialog___Q0GdI button[type="submit"]');
                    if (fightBtn && !fightBtn.disabled) {
                        fightBtn.click();
                    }
                }
            });

            weapon.appendChild(button);
        });

        const stockFightBtn = document.querySelector('.dialog___Q0GdI button[type="submit"]');
        if (!stockFightBtn) {
            document.querySelectorAll('.weapon-fight-btn').forEach(btn => btn.remove());
        }
    }


    function replaceHospitalMessage() {
        const msgElements = document.querySelectorAll('.msg, .message');

        msgElements.forEach(element => {
            if (element.textContent.includes("unavailable while you're in hospital") ||
                element.textContent.includes("You are currently in the Hospital")) {

                if (element.querySelector('.hospital-links')) return;

                if (!document.getElementById('hospital-css')) {
                    const style = document.createElement('style');
                    style.id = 'hospital-css';
                    style.textContent = `
                        .hospital-link {
                            color: #cf3b13 !important;
                            text-decoration: underline !important;
                            cursor: pointer !important;
                        }
                        .hospital-link:hover {
                            color: #a02f0f !important;
                        }
                    `;
                    document.head.appendChild(style);
                }

                element.innerHTML = `
                    <span class="hospital-links">
                        You are currently in the Hospital.
                        <span class="hospital-link" data-url="/item.php">Go to Items</span> |
                        <span class="hospital-link" data-url="/factions.php?step=your#/tab=armoury&start=0&sub=medical">Go to Faction Medical</span>
                    </span>
                `;

                element.querySelectorAll('.hospital-link').forEach(link => {
                    link.addEventListener('click', function() {
                        window.location.href = 'https://www.torn.com' + this.getAttribute('data-url');
                    });
                });
            }
        });
    }

    // SIMPLE OBSERVER (watches for new content)
    const observer = new MutationObserver(function() {
        enableAttackButtons();
        addWeaponButtons();
        replaceHospitalMessage();
    });

    // INITIALIZATION
    function init() {
        enableAttackButtons();
        addWeaponButtons();
        replaceHospitalMessage();
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Start when page loads
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }

})();

// Made with Love by DoobieSuckin [3255641]