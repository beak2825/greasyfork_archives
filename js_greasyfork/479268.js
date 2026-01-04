// ==UserScript==
// @name         Neopets - Daily Quest Helper (Updated November 2025)
// @namespace    neopets
// @author       blast me snowdaddy
// @description  Adds a link to daily quests if available
// @match         *://*.neopets.com/questlog/
// @grant        none
// @version 3.0
// @downloadURL https://update.greasyfork.org/scripts/479268/Neopets%20-%20Daily%20Quest%20Helper%20%28Updated%20November%202025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/479268/Neopets%20-%20Daily%20Quest%20Helper%20%28Updated%20November%202025%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a link
    function createLink(url, name = 'Link') {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.style.marginLeft = '5px';
        link.style.textDecoration = 'underline';
        link.style.color = '#0066cc';
        link.textContent = `[${name}]`;
        return link;
    }

    function addQuestLinks() {
        const questDescriptions = document.querySelectorAll('.ql-quest-description');

        let linksAdded = 0;

        questDescriptions.forEach(desc => {
            if (desc.dataset.linksAdded) return;

            const text = desc.textContent;

            if (text.includes("Customise one of your Neopets")) {
                const link = createLink('https://www.neopets.com/customise/', 'Customise');
                desc.appendChild(link);
                linksAdded++;
                // If you want to add more links to a quest, do what I did below here
            } else if (text.includes("Play any Game or Classic Game in the Games Room")) {
                const link = createLink('https://www.neopets.com/games/h5game.phtml?game_id=1310', 'Quick Game');
                desc.appendChild(link);
                linksAdded++;
            } else if (text.includes("Purchase item(s) from any Neopian Shop")) {
                const link = createLink('https://www.neopets.com/generalstore.phtml', "General Store");
                const link2 = createLink('https://www.neopets.com/faerieland/springs.phtml', 'Healing Springs');
                desc.appendChild(link);
                desc.appendChild(link2);
                linksAdded++;
            } else if (text.includes("Wheel of Mediocrity")) {
                const link = createLink('https://www.neopets.com/prehistoric/mediocrity.phtml', 'Mediocrity');
                desc.appendChild(link);
                linksAdded++;
            } else if (text.includes("Wheel of Excitement")) {
                const link = createLink('https://www.neopets.com/faerieland/wheel.phtml', 'Excitement');
                desc.appendChild(link);
                linksAdded++;
            } else if (text.includes("Wheel of Knowledge")) {
                const link = createLink('https://www.neopets.com/medieval/knowledge.phtml', 'Knowledge');
                desc.appendChild(link);
                linksAdded++;
            } else if (text.includes("Wheel of Misfortune")) {
                const link = createLink('https://www.neopets.com/halloween/wheel/index.phtml', 'Misfortune');
                desc.appendChild(link);
                linksAdded++;
            } else if (text.includes("Groom one of your Neopets with any grooming item")) {
                const link = createLink('https://www.neopets.com/inventory.phtml', 'Inventory');
                const link2 = createLink('https://www.neopets.com/safetydeposit.phtml?obj_name=&category=10', 'SDB');
                desc.appendChild(link);
                desc.appendChild(link2);
                linksAdded++;
            } else if (text.includes("Feed any food item to one of your Neopets")) {
                const link = createLink('https://www.neopets.com/inventory.phtml', 'Inventory');
                const link2 = createLink('https://www.neopets.com/safetydeposit.phtml?obj_name=&category=18', 'SDB');
                desc.appendChild(link);
                desc.appendChild(link2);
                linksAdded++;
            } else if (text.includes("Read a book to one of your Neopets")) {
                const link = createLink('https://www.neopets.com/inventory.phtml', 'Inventory');
                const link2 = createLink('https://www.neopets.com/safetydeposit.phtml?obj_name=&category=6', 'SDB');
                desc.appendChild(link);
                desc.appendChild(link2);
                linksAdded++;
            } else if (text.includes("Fight in a 1-player or VS Battledome match")) {
                const link = createLink('https://www.neopets.com/dome/fight.phtml', 'BD');
                const link2 = createLink('https://www.neopets.com/faerieland/springs.phtml', 'Healing Springs');
                desc.appendChild(link);
                desc.appendChild(link2);
                linksAdded++;
            }
            else if (text.includes("Play with any toy item with one of your Neopets")) {
                const link = createLink('https://www.neopets.com/inventory.phtml', 'Inventory');
                const link2 = createLink('https://www.neopets.com/safetydeposit.phtml?obj_name=&category=5', 'SDB');
                desc.appendChild(link);
                desc.appendChild(link2);
                linksAdded++;
            }

            if (linksAdded > 0) {
                desc.dataset.linksAdded = 'true';
            }
        });

        return linksAdded;
    }

    // wait for the quest content to load and periodically check for new content
    function waitForQuestContent() {
        let attempts = 0;
        const maxAttempts = 50; // try for about 10 seconds

        const checkInterval = setInterval(() => {
            attempts++;

            const loader = document.getElementById('QuestLogLoader');
            const questContent = document.getElementById('QuestLogContent');

            const isLoading = loader && loader.style.display !== 'none';
            const hasContent = questContent && questContent.children.length > 0;

            if (!isLoading || hasContent || attempts >= maxAttempts) {
                const linksAdded = addQuestLinks();

                if (linksAdded > 0 || attempts >= maxAttempts) {
                    clearInterval(checkInterval);

                    if (questContent) {
                        const observer = new MutationObserver(() => {
                            addQuestLinks();
                        });

                        observer.observe(questContent, {
                            childList: true,
                            subtree: true
                        });
                    }
                }
            }
        }, 200);
    }

    // Start monitoring when the page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForQuestContent);
    } else {
        waitForQuestContent();
    }
})();