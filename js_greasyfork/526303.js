// ==UserScript==
// @name         New Dynamic Guide Links Testing
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Desktop: normal dropdown in top bar. Mobile: big "Neopets-style" ribbon with slightly transparent background. Question mark on right.
// @author       ...
// @match        https://grundos.cafe/*
// @match        https://www.grundos.cafe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526303/New%20Dynamic%20Guide%20Links%20Testing.user.js
// @updateURL https://update.greasyfork.org/scripts/526303/New%20Dynamic%20Guide%20Links%20Testing.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Decide if we show question mark on desktop
    const showQuestionMarkOnDesktop = true;

    // Basic breakpoint for "mobile"
    const isMobile = window.matchMedia('(max-width: 990px)').matches;

    // --------------------------------------------------
    // 1) Link Mappings
    // --------------------------------------------------
    const linkMapping = [
        // Overall Links
        { pattern: '^/$', url: 'https://www.grundos.cafe/~Bawk/', text: 'Overall Guide' },
        { pattern: '/explore/', url: 'https://www.grundos.cafe/~Bawk/', text: 'Overall Guide' },

        // Shop Links
        { pattern: '/viewshop/*', url: 'https://www.grundos.cafe/~Bawk/#Market', text: 'Shops/Restocking' },
        { pattern: '/viewshop/\\?shop_id=32', url: 'https://www.grundos.cafe/~toadstool/', text: 'Mushroom Effects' },
        { pattern: '/viewshop/\\?shop_id=12', url: 'https://www.grundos.cafe/~Plant/', text: 'Gardening' },
        { pattern: '/viewshop/\\?shop_id=14', url: 'https://www.grundos.cafe/~Birdy', text: 'Gourmet Foods' },
        { pattern: '/viewshop/\\?shop_id=16', url: 'https://www.grundos.cafe/~Birdy', text: 'Gourmet Foods' },

        // Battle Dome and Training
        { pattern: '/dome/*', url: 'https://www.grundos.cafe/~Bawk/#Training', text: 'Training' },
        { pattern: '/dome/*', url: 'https://www.grundos.cafe/~B/', text: 'Challenger Unlocks' },
        { pattern: '/dome/*', url: 'https://www.grundos.cafe/~Speaker/', text: 'Challenger Drops' },
        { pattern: '/dome/*', url: 'https://www.grundos.cafe/~toadstool/', text: 'Mushroom Effects' },
        { pattern: '/dome/*', url: 'https://www.grundos.cafe/~Jack/', text: 'Negg Effects' },
        { pattern: '/island/training/*', url: 'https://www.grundos.cafe/~Bawk/#Training', text: 'Training' },
        { pattern: '/pirates/academy/*', url: 'https://www.grundos.cafe/~Bawk/#Training', text: 'Training' },

        // Guild
        { pattern: '/guilds/*', url: 'https://www.grundos.cafe/~Anemone/', text: 'Guild Directory' },
        { pattern: '/guilds/guild/.*/garden/*', url: 'https://www.grundos.cafe/~Plant/', text: 'Gardening' },

        // Neoschool
        { pattern: '/neoschool/*', url: 'https://www.grundos.cafe/~Nerd/', text: 'NeoSchool' },

        // Games & Dailies
        { pattern: '/games/*', url: 'https://www.grundos.cafe/~Mitya/', text: 'Game Rewards' },
        { pattern: '/games/cliffhanger/*', url: 'https://www.jellyneo.net/?go=cliffhanger', text: 'Cliffhanger' },
        { pattern: '/games/cliffhanger/*', url: 'https://cliffsolver.tiiny.site/', text: 'Cliffhanger Solver' },
        { pattern: '/games/invasionofmeridell/*', url: 'https://docs.google.com/document/d/e/2PACX-1vQOm_faNyIRAPWZ4VUb-lvzCqSm7QHzu0Ltz00FIlM8n7kD_mbBzKsea5tYE9WwKGJlytvRjhnpb23K/pub', text: 'Invasion of Meridell' },
        { pattern: '/medieval/turmaculus/*', url: 'https://docs.google.com/spreadsheets/d/1Ij3I_YYl3z0SW_8bca_-bcpfGjhrvDa_1bku-52pGcI/edit#gid=336283101', text: 'Turmy Tracking' },
        { pattern: '/games/defenders/*', url: 'https://www.grundos.cafe/~B/', text: 'Challenger Unlocks' },

        // Misc
        { pattern: '/winter/neggery/*', url: 'https://www.grundos.cafe/~Jack/', text: 'Negg Effects' },
        { pattern: '/space/warehouse/*', url: 'https://www.grundos.cafe/~Rune/', text: 'Relics' },
        { pattern: '/games/avatar_stats/*', url: 'https://www.grundos.cafe/~Milk/', text: 'Avatar Collection' },
        { pattern: '/island/cookingpot/*', url: 'https://www.grundos.cafe/~Mix/', text: 'Potion Mixing' },
        { pattern: '/island/cookingpot/*', url: 'https://greasyfork.org/en/scripts/468004-grundo-s-cafe-cooking-pot-enhancer', text: 'Ingredient Display Script' },
        { pattern: '/island/tradingpost/*', url: 'https://www.grundos.cafe/~Bawk/#TradingPost', text: 'Trading Post' },
        { pattern: '/halloween/*', url: 'https://www.grundos.cafe/~Luigi', text: 'Spooky Toilet' },
        { pattern: '/help/siteprefs/*', url: 'https://www.grundos.cafe/~Brand/', text: 'Site Themes' },

        // Item scanning
        {
            pattern: '/inventory/*',
            condition: () => Array.from(document.querySelectorAll('.item-info > span'))
                                 .some(span => span.textContent.includes('shroom')),
            url: 'https://www.grundos.cafe/~toadstool/',
            text: 'Mushroom Effects'
        },
        {
            pattern: '/inventory/*',
            condition: () => Array.from(document.querySelectorAll('.item-info > span'))
                                 .some(span => span.textContent.includes('Negg')),
            url: 'https://www.grundos.cafe/~Jack/',
            text: 'Negg Effects'
        },
        {
            pattern: '/market/*',
            condition: () => Array.from(document.querySelectorAll('strong'))
                                 .some(strong => strong.textContent.includes('shroom')),
            url: 'https://www.grundos.cafe/~toadstool/',
            text: 'Mushroom Effects'
        },
        {
            pattern: '/market/*',
            condition: () => Array.from(document.querySelectorAll('strong'))
                                 .some(strong => strong.textContent.includes('Negg')),
            url: 'https://www.grundos.cafe/~Jack/',
            text: 'Negg Effects'
        },
        {
            pattern: '/safetydeposit*',
            condition: () => Array.from(document.querySelectorAll('strong'))
                                 .some(strong => strong.textContent.includes('shroom')),
            url: 'https://www.grundos.cafe/~toadstool/',
            text: 'Mushroom Effects'
        },
        {
            pattern: '/safetydeposit*',
            condition: () => Array.from(document.querySelectorAll('strong'))
                                 .some(strong => strong.textContent.includes('Negg')),
            url: 'https://www.grundos.cafe/~Jack/',
            text: 'Negg Effects'
        },
    ];

    // --------------------------------------------------
    // (2) Helper: Ensure consistent domain for grundos.cafe
    // --------------------------------------------------
    function prependWWWIfNeeded(url) {
        const grundosPattern = /https?:\/\/(www\.)?grundos\.cafe/;
        if (!grundosPattern.test(url)) return url;

        const isOnWWW = window.location.hostname.startsWith('www.');
        const hasWWW = url.startsWith('https://www.');

        if (isOnWWW && !hasWWW) {
            return url.replace('https://', 'https://www.');
        } else if (!isOnWWW && hasWWW) {
            return url.replace('https://www.', 'https://');
        }
        return url;
    }

    // --------------------------------------------------
    // (3) Modal that shows full script links
    // --------------------------------------------------
    function createModalContent(links) {
        const uniqueLinks = [];
        for (const link of links) {
            const fullUrl = prependWWWIfNeeded(link.url);
            if (!uniqueLinks.some(item => item.url === fullUrl && item.text === link.text)) {
                uniqueLinks.push({ url: fullUrl, text: link.text });
            }
        }

        const container = document.createElement('div');
        const list = document.createElement('ul');
        list.style.listStyleType = 'none';
        list.style.padding = '0';

        uniqueLinks.forEach(link => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = link.url;
            a.target = '_blank';
            a.textContent = link.text;
            li.appendChild(a);
            list.appendChild(li);
        });

        container.appendChild(list);

        // "About this script"
        const aboutSection = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = 'About this script';
        aboutSection.appendChild(summary);

        const alertText = document.createElement('p');
        alertText.textContent = `If you have suggestions for more links or bugs to report, send me a Neomail:
https://www.grundos.cafe/userlookup/?user=Thornruler

Thank you!`;
        alertText.style.whiteSpace = 'pre-wrap';
        aboutSection.appendChild(alertText);

        container.appendChild(aboutSection);
        return container;
    }

    function showModal(links) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.left = '0';
        modal.style.top = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';

        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '5px';
        modalContent.style.maxWidth = '80%';
        modalContent.style.maxHeight = '80%';
        modalContent.style.overflowY = 'auto';

        modalContent.appendChild(createModalContent(links));
        modal.appendChild(modalContent);

        // Close if clicking outside
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.remove();
            }
        });

        document.body.appendChild(modal);
    }

    // --------------------------------------------------
    // (4) Find matching links for this page
    // --------------------------------------------------
    const currentURL = window.location.pathname + window.location.search;
    const matchingLinks = linkMapping.filter(entry => {
        const regex = new RegExp(entry.pattern);
        if (!regex.test(currentURL)) return false;
        if (entry.condition && !entry.condition()) return false;
        return true;
    });

    if (!matchingLinks.length) return; // no relevant links => do nothing

    // --------------------------------------------------
    // (5) Desktop: normal dropdown + optional ? icon
    // --------------------------------------------------
    if (!isMobile) {
        // Optional question mark
        let questionMark = null;
        if (showQuestionMarkOnDesktop) {
            questionMark = document.createElement('span');
            questionMark.textContent = '?';
            questionMark.title = 'Click for info about this script';
            questionMark.style.cursor = 'pointer';
            questionMark.style.fontWeight = 'bold';
            questionMark.style.marginLeft = '8px';
            questionMark.style.verticalAlign = 'middle';
            questionMark.addEventListener('click', () => {
                showModal(linkMapping);
            });
        }

        // Insert the dropdown
        const topBarInfo = document.querySelector('#top-bar-info');
        if (!topBarInfo) return;

        const moonElement = topBarInfo.querySelector('#howlatthe');
        if (!moonElement) return;

        const moonParent = moonElement.parentNode;

        const dropdown = document.createElement('select');
        dropdown.id = 'custom-link-dropdown';
        dropdown.style.marginRight = '5px';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = `${matchingLinks.length} ${matchingLinks.length === 1 ? 'Guide' : 'Guides'}`;
        defaultOption.selected = true;
        defaultOption.disabled = true;
        defaultOption.hidden = true;
        dropdown.appendChild(defaultOption);

        matchingLinks.forEach(linkData => {
            const option = document.createElement('option');
            option.value = prependWWWIfNeeded(linkData.url);
            option.textContent = linkData.text;
            dropdown.appendChild(option);
        });

        dropdown.addEventListener('change', (e) => {
            const url = e.target.value;
            if (url) {
                window.open(url, '_blank');
                e.target.selectedIndex = 0;
            }
        });

        // Insert question mark, dropdown, and a separator
        if (questionMark) {
            topBarInfo.insertBefore(questionMark, moonParent);
        }
        topBarInfo.insertBefore(dropdown, moonParent);

        const separator = document.createTextNode(' | ');
        topBarInfo.insertBefore(separator, moonParent);

        // Done for desktop
        return;
    }

    // --------------------------------------------------
    // (6) Mobile: center the middle text & absolutely place the button+toggle on right
    // --------------------------------------------------

    // 6a) Target the bottom bar container
    const bottomBar = document.querySelector('#sb_bottom .bottom-bar-items.user-info');
    if (!bottomBar) return;

    // 6b) Make the bottomBar position: relative so we can absolutely-position our new container
    bottomBar.style.position = 'relative';

    // 6c) Center the text in .lower-info
    const lowerInfo = bottomBar.querySelector('.lower-info');
    if (lowerInfo) {
        // Force it to be block-level, full width, text centered
        lowerInfo.style.display = 'block';
        lowerInfo.style.width = '100%';
        lowerInfo.style.textAlign = 'center';
    }

    // 6d) Locate the mobile toggle link
    const mobileToggle = bottomBar.querySelector('.mobile-toggle');

    // We'll remove the toggle from the DOM so we can place it in a new container
    if (mobileToggle) {
        bottomBar.removeChild(mobileToggle);
    }

    // 6e) Create a container for the big ribbon button + toggle
    const rightContainer = document.createElement('div');
    rightContainer.style.position = 'absolute';
    // Move it to the right side
    rightContainer.style.right = '10px';
    // Center it vertically if you want, or just top:0
    // We'll do a vertical center approach:
    rightContainer.style.top = '50%';
    rightContainer.style.transform = 'translateY(-50%)';

    // For horizontal spacing, you can also do a little margin or a gap
    rightContainer.style.display = 'flex';
    rightContainer.style.alignItems = 'center';
    rightContainer.style.gap = '25px';

    // 6f) Build the hidden <select> with matching links
    const mobileSelect = document.createElement('select');
    mobileSelect.style.position = 'absolute';
    mobileSelect.style.top = '0';
    mobileSelect.style.left = '0';
    mobileSelect.style.width = '100%';
    mobileSelect.style.height = '100%';
    mobileSelect.style.opacity = '0';
    mobileSelect.style.zIndex = '999';
    mobileSelect.style.cursor = 'pointer';

    const defaultMobileOption = document.createElement('option');
    defaultMobileOption.value = '';
    defaultMobileOption.textContent =
        matchingLinks.length === 1 ? 'Open this guide' : 'Select a guide...';
    defaultMobileOption.selected = true;
    defaultMobileOption.disabled = true;
    mobileSelect.appendChild(defaultMobileOption);

    matchingLinks.forEach(linkData => {
        const opt = document.createElement('option');
        opt.value = prependWWWIfNeeded(linkData.url);
        opt.textContent = linkData.text;
        mobileSelect.appendChild(opt);
    });

    mobileSelect.addEventListener('change', () => {
        const url = mobileSelect.value;
        if (url) {
            window.open(url, '_blank');
            mobileSelect.selectedIndex = 0;
        }
    });

    // 6g) Create the "Neopets-inspired" ribbon button
    const guideBtn = document.createElement('button');
    guideBtn.type = 'button';

    if (matchingLinks.length === 1) {
        guideBtn.innerHTML = '1<br>Guide';
    } else {
        guideBtn.innerHTML = `${matchingLinks.length}<br>Guides`;
    }

    guideBtn.style.position = 'relative';
    guideBtn.style.display = 'inline-block';
    guideBtn.style.background = 'linear-gradient(to bottom, rgba(255, 238, 144, 0.9), rgba(227, 177, 63, 0.9))';
    guideBtn.style.border = '2px solid #B58A2E';
    guideBtn.style.borderRadius = '6px';
    guideBtn.style.padding = '10px 12px';
    guideBtn.style.fontSize = '15px';
    guideBtn.style.lineHeight = '1.2';
    guideBtn.style.textAlign = 'center';
    guideBtn.style.fontWeight = 'bold';
    guideBtn.style.cursor = 'pointer';
    guideBtn.style.overflow = 'hidden';
    guideBtn.style.color = '#5A3D0E';
    guideBtn.style.textShadow = '0 1px 0 #FFF4C2';
    guideBtn.style.boxShadow = '0 3px 0 rgba(0,0,0,0.2)';
    guideBtn.style.whiteSpace = 'nowrap';
    // Adjust min width if you like
    guideBtn.style.minWidth = '0px';

    guideBtn.classList.add('mobile-ribbon');
    guideBtn.appendChild(mobileSelect);

    // A bit of CSS for the ribbon tail
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .mobile-ribbon {
            position: relative;
        }
        .mobile-ribbon::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            border: 8px solid transparent;
            border-top-color: rgba(227, 177, 63, 0.9);
        }
    `;
    document.head.appendChild(styleEl);

    // 6h) Put the button + toggle inside `rightContainer`
    rightContainer.appendChild(guideBtn);
    if (mobileToggle) {
        rightContainer.appendChild(mobileToggle);
    }

    // 6i) Finally, append `rightContainer` into bottomBar
    bottomBar.appendChild(rightContainer);

    // The result:
    // - .lower-info is a block taking full width, text centered => middle text is truly centered
    // - rightContainer is absolutely positioned at right:10px; top:50% => the button + toggle on the right
})();