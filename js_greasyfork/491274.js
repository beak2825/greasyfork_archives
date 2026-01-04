// ==UserScript==
// @name         Word Blocker with Menu & Smart Images
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Block specific words and their associated images on webpages
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @author       Edu Altamirano
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491274/Word%20Blocker%20with%20Menu%20%20Smart%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/491274/Word%20Blocker%20with%20Menu%20%20Smart%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. CONFIGURATION & MENU ---

    // Default list (used if no custom list is saved)
    const defaultWords = [
        'boluarte', 'milei', 'salinas', 'xochitl', 'netanyahu', 'israel',
        'ecuador', 'noboa', 'piqué', 'sunak', 'chupaprecios', 'CHUPAPRECIOS',
        'flow', 'FLOW', 'trump'
    ];

    // Load words from storage
    var blockedWords = GM_getValue('userBlockedWords', defaultWords);

    // Function to open the input box
    function editBlockedWords() {
        var currentList = blockedWords.join(', ');
        var input = prompt("Edit blocked words (comma separated):", currentList);

        if (input !== null) {
            var newList = input.split(',').map(s => s.trim()).filter(s => s !== "");
            GM_setValue('userBlockedWords', newList);
            alert("List saved! Reloading page...");
            location.reload();
        }
    }

    // Add button to Tampermonkey menu
    GM_registerMenuCommand("🚫 Edit Blocked Words", editBlockedWords);


    // --- 2. FILTERING LOGIC ---

    function containsBlockedWord(element) {
        if (!element || !element.textContent) return false;
        var text = element.textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        for (var i = 0; i < blockedWords.length; i++) {
            var word = blockedWords[i].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            if (word && text.includes(word)) return true;
        }
        return false;
    }

    // Helper to animate and hide an element
    function blurAndHide(el) {
        if (!el || el.dataset.blocked === "true") return; // Prevent double hiding
        el.dataset.blocked = "true"; // Mark as processed

        setTimeout(function() {
            el.style.transition = 'all 0.5s';
            el.style.filter = 'blur(10px)';
            el.style.opacity = '0.5';
            setTimeout(function() {
                el.style.display = 'none';
            }, 500);
        }, 500);
    }

    function hideBlockedElements() {
        // Target common text containers
        var elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, span, li, article');

        elements.forEach(function(element) {
            if (containsBlockedWord(element)) {

                // 1. Redact the specific text
                var regex = new RegExp(blockedWords.join("|"), "gi");
                // Only replace if it's a leaf node to avoid breaking HTML structure
                if(element.children.length === 0) {
                     element.innerHTML = element.innerHTML.replace(regex, match => 
                        '<span style="color: red; text-decoration: line-through;">' + match + '</span>'
                     );
                }

                // 2. Hide the element itself
                blurAndHide(element);

                // 3. Smart Parent Hiding (Hide the card/wrapper)
                var parent = element.parentElement;
                // Go up a few levels to find the main container (like a generic div or article)
                var attempts = 0;
                while (parent && attempts < 3) {
                    if (['div', 'article', 'li', 'figure'].includes(parent.tagName.toLowerCase())) {
                        blurAndHide(parent);

                        // 4. NEW: Check Siblings of the Parent for Images
                        // This catches: <div class="img-block">...</div> <div class="text-block">BLOCKED</div>
                        var sibling = parent.previousElementSibling;
                        while (sibling) {
                            // Hide sibling if it IS an image or CONTAINS an image
                            if (sibling.tagName.toLowerCase() === 'img' || sibling.querySelector('img')) {
                                blurAndHide(sibling);
                            }
                            sibling = sibling.previousElementSibling;
                        }
                        break; // Stop after hiding the closest container
                    }
                    parent = parent.parentElement;
                    attempts++;
                }
            }
        });

        // 5. Cleanup standalone images with bad alt text
        document.querySelectorAll('img').forEach(function(img) {
            var altText = (img.alt || "").toLowerCase();
            if (blockedWords.some(word => altText.includes(word))) {
                blurAndHide(img);
            }
        });
    }

    // --- 3. EXECUTION ---

    // Run on load
    window.addEventListener('load', hideBlockedElements, false);

    // Run periodically to catch Lazy Loaded images and Infinite Scroll
    setInterval(hideBlockedElements, 2000);

})();