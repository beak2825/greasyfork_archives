

    // ==UserScript==
    // @name         IMVU Badge Footer
    // @namespace    https://www.imvu.com/
    // @version      1.1
    // @description  Adds a compact, styled footer with user profile links and tooltips on IMVU badge pages.
    // @match        *://userimages*.imvu.com/userdata/*/badge_*
    // @author       heapsofjoy
    // @grant        none
    // @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527594/IMVU%20Badge%20Footer.user.js
// @updateURL https://update.greasyfork.org/scripts/527594/IMVU%20Badge%20Footer.meta.js
    // ==/UserScript==
     
    (function () {
        'use strict';
     
        // Extract CID from the badge URL
        const urlParts = window.location.pathname.split('/');
        if (urlParts.length < 3) return;
        const userCID = urlParts[2];
     
        // Inject CSS styles
        const style = document.createElement('style');
        style.textContent = `
            footer {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                background: rgba(0, 0, 0, 0.5);
                color: rgba(255, 255, 255, 0.8);
                text-align: center;
                padding: 4px 0;
                font-size: 0.95em;
                font-family: Arial, sans-serif;
                z-index: 4;
            }
            footer a {
                color: rgba(100, 165, 165, 0.8);
                text-decoration: none;
            }
            footer a:hover {
                text-decoration: underline;
            }
            .tooltip {
                position: relative;
                cursor: pointer;
            }
            .tooltip-text {
                visibility: hidden;
                background-color: rgba(0, 0, 0, 0.75);
                color: #fff;
                text-align: center;
                border-radius: 4px;
                padding: 5px;
                position: absolute;
                z-index: 10;
                bottom: 125%;
                left: 50%;
                transform: translateX(-50%);
                opacity: 0;
                transition: opacity 0.3s;
                width: 220px;
                font-size: 0.85em;
            }
            .tooltip:hover .tooltip-text {
                visibility: visible;
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
     
        // Create footer element
        const footer = document.createElement("footer");
        footer.innerHTML = `<span>Fetching badge owner...</span>`;
        document.body.appendChild(footer);
     
        // Fetch username and update footer
        async function fetchIMVUProfile(cid) {
            let username = "User Not Found";
            let tooltipText = "This user may be disabled or deleted. Click the shop icon to check.";
     
            try {
                const response = await fetch(`https://api.imvu.com/user/user-${cid}`);
                const data = await response.json();
                const userData = data.denormalized[`https://api.imvu.com/user/user-${cid}`];
     
                if (userData && userData.data.username) {
                    username = userData.data.username;
                    tooltipText = ""; // No tooltip if user exists
                }
            } catch (error) {
                console.warn("Failed to fetch IMVU profile, defaulting to 'User Not Found'.", error);
            }
     
            // Profile and shop links
            const homepageUrl = `https://www.imvu.com/catalog/web_mypage.php?user=${cid}`;
            const shopUrl = `https://www.imvu.com/shop/web_search.php?manufacturers_id=${cid}`;
     
            // Update footer with available data
            footer.innerHTML = `
                <span>Badge owned by:
                    <span class="tooltip"><strong>${username}</strong>
                        ${tooltipText ? `<span class="tooltip-text">${tooltipText}</span>` : ""}
                    </span>
                </span> |
                <a href="${homepageUrl}" target="_blank">🏠 Profile</a> |
                <a href="${shopUrl}" target="_blank">🛍️ Shop</a>
            `;
        }
     
        // Call function to get profile data
        fetchIMVUProfile(userCID);
    })();

