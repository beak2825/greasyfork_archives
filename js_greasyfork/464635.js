// ==UserScript==
// @name         Grundo's Cafe Dynamic Guide Links
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Adds a dropdown with quick access to guides and resources relevant to the current page (such as training links for battledome, game-specific guides, and more). Compatible with both Firefox and Chrome.
// @author       Thornruler
// @match        https://grundos.cafe/*
// @match        https://www.grundos.cafe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464635/Grundo%27s%20Cafe%20Dynamic%20Guide%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/464635/Grundo%27s%20Cafe%20Dynamic%20Guide%20Links.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Toggle for info question mark. Set to false to remove it.
    const showQuestionMark = true;

    // Define the mapping between the website and the corresponding link with custom text
    const linkMapping = [
        //----------------Page url guides
        // Overall Links
        { pattern: '^/$', url: 'https://www.grundos.cafe/~Bawk/', text: 'Overall Guide' },
        { pattern: '/explore/', url: 'https://www.grundos.cafe/~Bawk/', text: 'Overall Guide' },

        // Shop Links
        { pattern: '/viewshop/*', url: 'https://www.grundos.cafe/~Bawk/#Market', text: 'Shops/Restocking' },
        { pattern: '/viewshop/\\?shop_id=32', url: 'https://www.grundos.cafe/~toadstool/', text: 'Mushroom Effects' },
        { pattern: '/viewshop/\\?shop_id=12', url: 'https://www.grundos.cafe/~Plant/', text: 'Gardening' },
        { pattern: '/viewshop/\\?shop_id=14', url: 'https://www.grundos.cafe/~Birdy', text: 'Gourmet Foods' },
        { pattern: '/viewshop/\\?shop_id=16', url: 'https://www.grundos.cafe/~Birdy', text: 'Gourmet Foods' },

        // Battle Dome and Training links
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

        // Games and dailies
        { pattern: '/games/*', url: 'https://www.grundos.cafe/~Mitya/', text: 'Game Rewards' },
        { pattern: '/games/cliffhanger/*', url: 'https://www.jellyneo.net/\\?go=cliffhanger', text: 'Cliffhanger' },
        { pattern: '/games/cliffhanger/*', url: 'https://cliffsolver.tiiny.site/', text: 'Cliffhanger Solver' },
        { pattern: '/games/invasionofmeridell/*', url: 'https://docs.google.com/document/d/e/2PACX-1vQOm_faNyIRAPWZ4VUb-lvzCqSm7QHzu0Ltz00FIlM8n7kD_mbBzKsea5tYE9WwKGJlytvRjhnpb23K/pub', text: 'Invasion of Meridell' },
        { pattern: '/medieval/turmaculus/*', url: 'https://docs.google.com/spreadsheets/d/1Ij3I_YYl3z0SW_8bca_-bcpfGjhrvDa_1bku-52pGcI/edit#gid=336283101', text: 'Turmy Tracking' },
        { pattern: '/games/defenders/*', url: 'https://www.grundos.cafe/~B/', text: 'Challenger Unlocks' },

        // Misc Links
        { pattern: '/winter/neggery/*', url: 'https://www.grundos.cafe/~Jack/', text: 'Negg Effects' },
        { pattern: '/space/warehouse/*', url: 'https://www.grundos.cafe/~Rune/', text: 'Relics' },
        { pattern: '/games/avatar_stats/*', url: 'https://www.grundos.cafe/~Milk/', text: 'Avatar Collection' },
        { pattern: '/island/cookingpot/*', url: 'https://www.grundos.cafe/~Mix/', text: 'Potion Mixing' },
        { pattern: '/island/cookingpot/*', url: 'https://greasyfork.org/en/scripts/468004-grundo-s-cafe-cooking-pot-enhancer', text: 'Ingredient Display Script' },
        { pattern: '/island/tradingpost/*', url: 'https://www.grundos.cafe/~Bawk/#TradingPost', text: 'Trading Post' },
        { pattern: '/halloween/*', url: 'https://www.grundos.cafe/~Luigi', text: 'Spooky Toilet' },
        { pattern: '/help/siteprefs/*', url: 'https://www.grundos.cafe/~Brand/', text: 'Site Themes' },

        //----------------Item scan guides
        { pattern: '/inventory/*', condition: () => Array.from(document.querySelectorAll('.item-info > span')).some(span => span.textContent.includes('shroom')), url: 'https://www.grundos.cafe/~toadstool/', text: 'Mushroom Effects'},
        { pattern: '/inventory/*', condition: () => Array.from(document.querySelectorAll('.item-info > span')).some(span => span.textContent.includes('Negg')), url: 'https://www.grundos.cafe/~Jack/', text: 'Negg Effects'},
        { pattern: '/market/*', condition: () => Array.from(document.querySelectorAll('strong')).some(strong => strong.textContent.includes('shroom')), url: 'https://www.grundos.cafe/~toadstool/', text: 'Mushroom Effects'},
        { pattern: '/market/*', condition: () => Array.from(document.querySelectorAll('strong')).some(strong => strong.textContent.includes('Negg')), url: 'https://www.grundos.cafe/~Jack/', text: 'Negg Effects'},
        { pattern: '/safetydeposit*', condition: () => Array.from(document.querySelectorAll('strong')).some(strong => strong.textContent.includes('shroom')), url: 'https://www.grundos.cafe/~toadstool/', text: 'Mushroom Effects'},
        { pattern: '/safetydeposit*', condition: () => Array.from(document.querySelectorAll('strong')).some(strong => strong.textContent.includes('Negg')), url: 'https://www.grundos.cafe/~Jack/', text: 'Negg Effects'},

    ];

    // Ensure consistent domain (www or non-www) for grundos.cafe links. This prevents having to log in again.
    function prependWWWIfNeeded(url) {
        const grundosPattern = /https?:\/\/(www\.)?grundos\.cafe/;
        const isGrundosLink = grundosPattern.test(url);

        if (!isGrundosLink) return url;

        const isOnWWW = window.location.hostname.startsWith('www.');
        const hasWWW = url.startsWith('https://www.');

        if (isOnWWW && !hasWWW) {
            return url.replace('https://', 'https://www.');
        } else if (!isOnWWW && hasWWW) {
            return url.replace('https://www.', 'https://');
        }

        return url;
    }

    function createModalContent(links) {
        const uniqueLinks = links.reduce((accumulator, link) => {
            const fullUrl = prependWWWIfNeeded(link.url);
            const existingLink = accumulator.find(item => item.url === fullUrl && item.text === link.text);

            if (!existingLink) {
                accumulator.push({ url: fullUrl, text: link.text });
            }

            return accumulator;
        }, []);

        const container = document.createElement('div');

        const list = document.createElement('ul');
        list.style.listStyleType = 'none';
        list.style.padding = '0';

        for (const link of uniqueLinks) {
            const listItem = document.createElement('li');
            const anchor = document.createElement('a');
            anchor.href = link.url;
            anchor.target = '_blank';
            anchor.textContent = link.text;
            listItem.appendChild(anchor);
            list.appendChild(listItem);
        }

        container.appendChild(list);

        // Create expandable section
        const aboutSection = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = 'About this script';
        aboutSection.appendChild(summary);

        const alertText = document.createElement('p');
        alertText.textContent = "If you have suggestions for more links to add or have bugs to report, send me a Neomail:\nhttps://www.grundos.cafe/userlookup/?user=Thornruler\n\nThank you!";
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

        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.remove();
            }
        });


        document.body.appendChild(modal);
    }


    // Get the current URL
    const currentURL = window.location.pathname + window.location.search;

    // Find the associated links for the current URL
    const matchingLinks = linkMapping.filter((entry) => {
        const regex = new RegExp(entry.pattern);
        const urlMatch = regex.test(currentURL);
        if (!urlMatch) {
            return false;
        }
        if (entry.hasOwnProperty('condition')) {
            return entry.condition();
        }
        return true;
    });


    if (!matchingLinks.length) {
        return;
    }

    // Find the userinfo element
    const topBarInfo = document.querySelector('#top-bar-info');

    // Find the moon element
    const moonElement = topBarInfo.querySelector('#howlatthe');

    // Find the moon element parent
    const moonParent = moonElement.parentNode;

    // Insert a dropdown menu
    const dropdown = document.createElement('select');
    dropdown.id = 'custom-link-dropdown';
    dropdown.style.marginRight = '5px';

    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = `${matchingLinks.length} ${matchingLinks.length === 1 ? 'Guide' : 'Guides'}`;
    defaultOption.selected = true;
    defaultOption.disabled = true;
    defaultOption.hidden = true;
    defaultOption.setAttribute('style', 'display: none;');
    dropdown.appendChild(defaultOption);



    // Add an option for each link
    for (const linkData of matchingLinks) {
        const option = document.createElement('option');
        option.value = prependWWWIfNeeded(linkData.url);
        option.textContent = linkData.text;
        dropdown.appendChild(option);
    }

    // Add an event listener to navigate to the selected link
    dropdown.addEventListener('change', (event) => {
        if (event.target.value) {
            window.open(event.target.value, '_blank');
            event.target.selectedIndex = 0;
        }
    });

    // Insert the dropdown before the moon parent
    topBarInfo.insertBefore(dropdown, moonParent);

    // Add a separator (|) after the new link or dropdown
    const separator = document.createTextNode(' | ');
    topBarInfo.insertBefore(separator, moonParent);

    // Add custom CSS for the question mark icon
    const customStyle = `
    .question-mark {
        cursor: help;
        margin-right: 5px;
        position: relative;
        display: inline-block;
    }
`;

    // Add the custom style
    const style = document.createElement('style');
    style.textContent = customStyle;
    document.head.appendChild(style);

    // Create the question mark icon
    const questionMark = document.createElement('span');
    questionMark.classList.add('question-mark');
    questionMark.textContent = '?';

    // Add an event listener to trigger an alert box with an explanation when clicked
    questionMark.addEventListener('click', () => {
        showModal(linkMapping);
    });



    // Insert the question mark icon before the dropdown
    if (showQuestionMark) {
        topBarInfo.insertBefore(questionMark, dropdown);
    }

})();