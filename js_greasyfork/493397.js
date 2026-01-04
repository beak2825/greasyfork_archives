// ==UserScript==
// @name         Selective Icon Placement - Hide and Seek
// @version      1.5
// @description  Add icons next to specific members based on their IDs on both faction and profile pages, and dynamically on profile previews
// @author       Misty
// @match        https://www.torn.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1292729
// @downloadURL https://update.greasyfork.org/scripts/493397/Selective%20Icon%20Placement%20-%20Hide%20and%20Seek.user.js
// @updateURL https://update.greasyfork.org/scripts/493397/Selective%20Icon%20Placement%20-%20Hide%20and%20Seek.meta.js
// ==/UserScript==


(function() {
    'use strict';

    console.log("Starting selective icon placement based on member IDs");

    const includedMemberIDs = ["2899992","2699572","3150819","3244373","3238530","3073688","3245300","3229203","2661810","3240093","3252707","3244532","3246452","3237772","3246191","3240878","3235191","3254007","3251329","3261295","2921950","3244531","3251035","3245504","3267325","3246251","2894144","3184580","3240058","3241181","3246030","3242948","3241598","3243109","3253734","3245014","3247580","3258188","3269484","3204367","2894144","3269484"];
    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="#d5e710" d="M12,2A10,10,0,1,0,22,12,10.013,10.013,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,12,20Zm0-14a6,6,0,1,0,6,6A6.007,6.007,0,0,0,12,6Zm0,10a4,4,0,1,1,4-4A4.005,4.005,0,0,1,12,16Zm0-6a2,2,0,1,0,2,2A2.002,2.002,0,0,0,12,10Z"/>
                        <rect x="11" y="1" width="2" height="4" fill="#d5e710"/>
                        <rect x="11" y="19" width="2" height="4" fill="#d5e710"/>
                        <rect x="1" y="11" width="4" height="2" fill="#d5e710"/>
                        <rect x="19" y="11" width="4" height="2" fill="#d5e710"/>
                    </svg>`;

    function extractMemberId(href) {
        const memberIdMatch = href.match(/XID=(\d+)/);
        return memberIdMatch ? memberIdMatch[1] : null;
    }

    function addIconToMiniProfile(wrapperNode) {
        const profileLink = wrapperNode.querySelector('a[href*="profiles.php?XID="]');
        if (!profileLink) {
            console.log(`Profile link not found within mini profile.`);
            return;
        }
        const href = profileLink.getAttribute('href');
        const memberId = extractMemberId(href);

        if (memberId && includedMemberIDs.includes(memberId)) {
            const iconContainer = wrapperNode.querySelector('.icons ul');
            if (iconContainer && !iconContainer.querySelector('.iconShow')) {
                const icon = document.createElement('li');
                icon.classList.add('iconShow');
                icon.innerHTML = svgIcon;
                icon.style.cssText = 'display: inline-block; vertical-align: middle; margin-top: -22px;';
                iconContainer.appendChild(icon);
                console.log(`SVG Icon appended for member ID: ${memberId} on mini profile card.`);
            }
        }
    }

    function appendIconsFactionPage() {
        const rows = document.querySelectorAll('.f-war-list .table-body .table-row');
        console.log("Rows found on faction page:", rows.length);

        rows.forEach((row, index) => {
            const profileLink = row.querySelector('a[href*="profiles.php?XID="]');
            if (!profileLink) {
                console.log(`Profile link not found in row ${index}`);
                return;
            }
            const href = profileLink.getAttribute('href');
            const memberId = extractMemberId(href);

            if (memberId && includedMemberIDs.includes(memberId)) {
                const iconContainer = row.querySelector('.member-icons.icons ul.big.svg');
                if (!iconContainer) {
                    console.log(`Icon tray not found for member ID: ${memberId}`);
                    return;
                }
                const icon = document.createElement('li');
                icon.classList.add('iconShow');
                icon.innerHTML = svgIcon;
                icon.style.cssText = 'display: inline-block; vertical-align: middle; margin-top: -10px;';
                iconContainer.appendChild(icon);
                console.log(`SVG Icon appended for member ID: ${memberId}`);
            }
        });
    }

    function appendIconsProfilePage() {
        if (!window.location.search.includes("XID=")) return;
        const memberId = extractMemberId(window.location.href);

        if (!includedMemberIDs.includes(memberId)) return;

        const iconContainer = document.querySelector('.profile-container .icons ul.row.basic-info.big.svg');
        if (iconContainer && !iconContainer.querySelector('.iconShow')) {
            const icon = document.createElement('li');
            icon.classList.add('iconShow');
            icon.innerHTML = svgIcon;
            icon.style.cssText = 'display: inline-block; vertical-align: middle; margin-top: -17px;';
            iconContainer.appendChild(icon);
            console.log(`SVG Icon appended for member ID: ${memberId} on profile page`);
        }
    }

    function observeProfilePreviews() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList) {
                        // Check if the added node matches the criteria
                        if (node.classList.value.startsWith('profile-mini-_userProfileWrapper')) {
                            console.log("Profile mini wrapper detected:", node);
                            addIconToMiniProfile(node);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }


    function main() {
        if (window.location.pathname.includes("/factions.php")) {
            appendIconsFactionPage();
        } else if (window.location.pathname.includes("/profiles.php")) {
            appendIconsProfilePage();
        }
        observeProfilePreviews();
    }

    setTimeout(main, 2000); // Delay to ensure DOM is fully loaded
})();
