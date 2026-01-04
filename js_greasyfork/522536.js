// ==UserScript==
// @name         Persistent Custom GPTs List with Names & Dates
// @namespace    ChatGPT Tools by Vishanka
// @version      1.7
// @description  Stores conversation URLs (url/storedAt/name), sorts newest-first, allows rename, auto-updates last-access time on click, plus a remove button. Now with hoverable buttons for titles & items, and truncated GPT titles with full title on hover. Highlights the current conversation.
// @match        https://chatgpt.com/*
// @author       Vishanka
// @license      Proprietary
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522536/Persistent%20Custom%20GPTs%20List%20with%20Names%20%20Dates.user.js
// @updateURL https://update.greasyfork.org/scripts/522536/Persistent%20Custom%20GPTs%20List%20with%20Names%20%20Dates.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /***********************************************************************
     * GLOBAL: Inject a <style> for our hoverable buttons
     ***********************************************************************/
function injectHoverButtonStyle() {
    if (document.getElementById('customGPTListHoverStyle')) return; // only once

    const styleEl = document.createElement('style');
    styleEl.id = 'customGPTListHoverStyle';
    styleEl.textContent = `
        .myHoverButton {
            background-color: transparent;
            border: none;
            cursor: pointer;
            color: #e8e8e8;
            text-align: left;
            width: 100%;
            padding: 4px 8px;
            font-family: inherit;
            position: relative; /* So we can position child elements absolutely if needed */
        }
        .myHoverButton:hover {
            background-color: #212121;
        }
        .myHoverButton.active {
            background-color: #2F2F2F;
        }

        /* By default, hide these elements */
        .myHoverButton .titleButtonIcon,
        .myHoverButton .editButton,
        .myHoverButton .removeButton {
            visibility: hidden;
        }

        /* Show them on hover */
        .myHoverButton:hover .titleButtonIcon,
        .myHoverButton:hover .editButton,
        .myHoverButton:hover .removeButton {
            visibility: visible;
        }
    `;
    document.head.appendChild(styleEl);
}

    /***********************************************************************
     * 1. STORAGE LOGIC: storeConversationUrlIfNeeded
     *    Called from your page detection or polling logic.
     ***********************************************************************/
function storeConversationUrlIfNeeded() {
    console.log('[storeConversationUrlIfNeeded] Checking URL:', window.location.href);

    // Must match https://chatgpt.com/.../c/...
    const match = window.location.href.match(/^https:\/\/chatgpt\.com\/(.+?)\/c\//);
    if (!match) {
        console.log('[storeConversationUrlIfNeeded] => Not a conversation URL. Skipping.');
        return;
    }

    const foundHref = match[1];
    console.log('[storeConversationUrlIfNeeded] => foundHref:', foundHref);

    // Load 'sidebarLinks' from localStorage
    const sidebarLinksString = localStorage.getItem('sidebarLinks');
    if (!sidebarLinksString) {
        console.log('[storeConversationUrlIfNeeded] => No sidebarLinks found. Possibly not extracted yet.');
        return;
    }

    let sidebarLinks = [];
    try {
        sidebarLinks = JSON.parse(sidebarLinksString);
    } catch (err) {
        console.error('[storeConversationUrlIfNeeded] => Error parsing sidebarLinks JSON:', err);
        return;
    }

    // Find link with matching href
    const matchingLink = sidebarLinks.find(link => link.href === foundHref);
    if (!matchingLink) {
        console.log('[storeConversationUrlIfNeeded] => No matching link for href:', foundHref);
        return;
    }

    const gptTitle = matchingLink.title;
    console.log('[storeConversationUrlIfNeeded] => GPT title:', gptTitle);

    // Load or init 'CustomGPTs'
    let customGPTs = {};
    const customGPTsString = localStorage.getItem('CustomGPTs');
    if (customGPTsString) {
        try {
            customGPTs = JSON.parse(customGPTsString);
        } catch (err) {
            console.error('[storeConversationUrlIfNeeded] => Error parsing CustomGPTs:', err);
        }
    }

    if (!customGPTs[gptTitle]) {
        customGPTs[gptTitle] = [];
    }

    // Check if this exact URL object exists already
    const existingItem = customGPTs[gptTitle].find(item => item.url === window.location.href);
    if (existingItem) {
        console.log('[storeConversationUrlIfNeeded] => This URL already stored. Current name:', existingItem.name);
        // Update storedAt to now (optional)
        existingItem.storedAt = new Date().toISOString();
    } else {
        // Insert a new record
        const newItem = {
            url: window.location.href,
            storedAt: new Date().toISOString(),
            name: null  // user can rename later
        };
        customGPTs[gptTitle].push(newItem);
        console.log('[storeConversationUrlIfNeeded] => Added new conversation object:', newItem);
    }

    // Save back
    localStorage.setItem('CustomGPTs', JSON.stringify(customGPTs));
}

/***********************************************************************
 * 2. RENDERING LOGIC: Insert a container into the sidebar
 *    after .group/sidebar > div:nth-child(1) > div:nth-child(1)
 ***********************************************************************/
function renderCustomGPTList() {
    // Ensure our hover-button style is injected
    injectHoverButtonStyle();

    const referenceEl = document.querySelector('.group\\/sidebar > div:nth-child(1) > div:nth-child(1)');
    if (!referenceEl) {
        console.log('[renderCustomGPTList] => Reference element not found. Skipping render.');
        return;
    }

    // Remove previously rendered container
    const oldContainer = document.getElementById('myCustomGPTListContainer');
    if (oldContainer) oldContainer.remove();

function checkboxDivider() {
const checkboxDivider = document.createElement('div');
checkboxDivider.style.height = '1px';
checkboxDivider.style.backgroundColor = '#212121';
checkboxDivider.style.margin = '20px 20px 20px 20px';
    return checkboxDivider;
}

    // Create container
    const container = document.createElement('div');
    container.id = 'myCustomGPTListContainer';
    container.style.marginTop = '16px';
    container.style.padding = '0px';
    container.style.backgroundColor = 'transparent';

    // Load CustomGPTs
    const customGPTsString = localStorage.getItem('CustomGPTs');
    if (!customGPTsString) {
        container.textContent = 'No CustomGPTs found in localStorage.';
        referenceEl.insertAdjacentElement('afterend', container);
        return;
    }

    let customGPTs;
    try {
        customGPTs = JSON.parse(customGPTsString);
    } catch (err) {
        container.textContent = 'Error parsing CustomGPTs data.';
        referenceEl.insertAdjacentElement('afterend', container);
        console.error('[renderCustomGPTList] => Error:', err);
        return;
    }

    const gptTitles = Object.keys(customGPTs);
    if (gptTitles.length === 0) {
        container.textContent = 'No GPT Titles found in CustomGPTs.';
        referenceEl.insertAdjacentElement('afterend', container);
        return;
    }

    // Define the SVG icon that will be placed on each conversation item (ALWAYS visible)
    const svgIconHTML = `
        <svg width="19px" height="19px" viewBox="0 0 24 24" fill="none"
             xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path d="M13.0867 21.3877L13.7321 21.7697L13.0867 21.3877ZM13.6288 20.4718L12.9833 20.0898L13.6288 20.4718ZM10.3712 20.4718L9.72579 20.8539H9.72579L10.3712
                         20.4718ZM10.9133 21.3877L11.5587 21.0057L10.9133 21.3877ZM2.3806 15.9134L3.07351 15.6264V15.6264L2.3806 15.9134ZM7.78958 18.9915L7.77666 19.7413L7.78958
                         18.9915ZM5.08658 18.6194L4.79957 19.3123H4.79957L5.08658 18.6194ZM21.6194 15.9134L22.3123 16.2004V16.2004L21.6194 15.9134ZM16.2104 18.9915L16.1975
                         18.2416L16.2104 18.9915ZM18.9134 18.6194L19.2004 19.3123H19.2004L18.9134 18.6194ZM19.6125 2.7368L19.2206 3.37628L19.6125 2.7368ZM21.2632 4.38751L21.9027
                         3.99563V3.99563L21.2632 4.38751ZM4.38751 2.7368L3.99563 2.09732V2.09732L4.38751 2.7368ZM2.7368 4.38751L2.09732 3.99563H2.09732L2.7368 4.38751ZM9.40279
                         19.2098L9.77986 18.5615L9.77986 18.5615L9.40279 19.2098ZM13.7321 21.7697L14.2742 20.8539L12.9833 20.0898L12.4412 21.0057L13.7321 21.7697ZM9.72579
                         20.8539L10.2679 21.7697L11.5587 21.0057L11.0166 20.0898L9.72579 20.8539ZM12.4412 21.0057C12.2485 21.3313 11.7515 21.3313 11.5587 21.0057L10.2679
                         21.7697C11.0415 23.0767 12.9585 23.0767 13.7321 21.7697L12.4412 21.0057ZM10.5 2.75H13.5V1.25H10.5V2.75ZM21.25 10.5V11.5H22.75V10.5H21.25ZM2.75
                         11.5V10.5H1.25V11.5H2.75ZM1.25 11.5C1.25 12.6546 1.24959 13.5581 1.29931 14.2868C1.3495 15.0223 1.45323 15.6344 1.68769 16.2004L3.07351 15.6264C2.92737
                         15.2736 2.84081 14.8438 2.79584 14.1847C2.75041 13.5189 2.75 12.6751 2.75 11.5H1.25ZM7.8025 18.2416C6.54706 18.2199 5.88923 18.1401 5.37359 17.9265L4.79957
                         19.3123C5.60454 19.6457 6.52138 19.7197 7.77666 19.7413L7.8025 18.2416ZM1.68769 16.2004C2.27128 17.6093 3.39066 18.7287 4.79957 19.3123L5.3736 17.9265C4.33223
                         17.4951 3.50486 16.6678 3.07351 15.6264L1.68769 16.2004ZM21.25 11.5C21.25 12.6751 21.2496 13.5189 21.2042 14.1847C21.1592 14.8438 21.0726 15.2736 20.9265
                         15.6264L22.3123 16.2004C22.5468 15.6344 22.6505 15.0223 22.7007 14.2868C22.7504 13.5581 22.75 12.6546 22.75 11.5H21.25ZM16.2233 19.7413C17.4786 19.7197 18.3955
                         19.6457 19.2004 19.3123L18.6264 17.9265C18.1108 18.1401 17.4529 18.2199 16.1975 18.2416L16.2233 19.7413ZM20.9265 15.6264C20.4951 16.6678 19.6678 17.4951 18.6264
                         17.9265L19.2004 19.3123C20.6093 18.7287 21.7287 17.6093 22.3123 16.2004L20.9265 15.6264ZM13.5 2.75C15.1512 2.75 16.337 2.75079 17.2619 2.83873C18.1757 2.92561
                         18.7571 3.09223 19.2206 3.37628L20.0044 2.09732C19.2655 1.64457 18.4274 1.44279 17.4039 1.34547C16.3915 1.24921 15.1222 1.25 13.5 1.25V2.75ZM22.75 10.5C22.75
                         8.87781 22.7508 7.6085 22.6545 6.59611C22.5572 5.57256 22.3554 4.73445 21.9027 3.99563L20.6237 4.77938C20.9078 5.24291 21.0744 5.82434 21.1613 6.73809C21.2492
                         7.663 21.25 8.84876 21.25 10.5H22.75ZM19.2206 3.37628C19.7925 3.72672 20.2733 4.20752 20.6237 4.77938L21.9027 3.99563C21.4286 3.22194 20.7781 2.57144 20.0044
                         2.09732L19.2206 3.37628ZM10.5 1.25C8.87781 1.25 7.6085 1.24921 6.59611 1.34547C5.57256 1.44279 4.73445 1.64457 3.99563 2.09732L4.77938 3.37628C5.24291 3.09223
                         5.82434 2.92561 6.73809 2.83873C7.663 2.75079 8.84876 2.75 10.5 2.75V1.25ZM2.75 10.5C2.75 8.84876 2.75079 7.663 2.83873 6.73809C2.92561 5.82434 3.09223 5.24291
                         3.37628 4.77938L2.09732 3.99563C1.64457 4.73445 1.44279 5.57256 1.34547 6.59611C1.24921 7.6085 1.25 8.87781 1.25 10.5H2.75ZM3.99563 2.09732C3.22194 2.57144 2.57144
                         3.22194 2.09732 3.99563L3.37628 4.77938C3.72672 4.20752 4.20752 3.72672 4.77938 3.37628L3.99563 2.09732ZM11.0166 20.0898C10.8136 19.7468 10.6354 19.4441 10.4621
                         19.2063C10.2795 18.9559 10.0702 18.7304 9.77986 18.5615L9.02572 19.8582C9.07313 19.8857 9.13772 19.936 9.24985 20.0898C9.37122 20.2564 9.50835 20.4865 9.72579
                         20.8539L11.0166 20.0898ZM7.77666 19.7413C8.21575 19.7489 8.49387 19.7545 8.70588 19.7779C8.90399 19.7999 8.98078 19.832 9.02572 19.8582L9.77986 18.5615C9.4871
                         18.3912 9.18246 18.3215 8.87097 18.287C8.57339 18.2541 8.21375 18.2487 7.8025 18.2416L7.77666 19.7413ZM14.2742 20.8539C14.4916 20.4865 14.6287 20.2564 14.7501
                         20.0898C14.8622 19.936 14.9268 19.8857 14.9742 19.8582L14.2201 18.5615C13.9298 18.7304 13.7204 18.9559 13.5379 19.2063C13.3646 19.4441 13.1864 19.7468 12.9833
                         20.0898L14.2742 20.8539ZM16.1975 18.2416C15.7862 18.2487 15.4266 18.2541 15.129 18.287C14.8175 18.3215 14.5129 18.3912 14.2201 18.5615L14.9742 19.8582C15.0192
                         19.832 15.096 19.7999 15.2941 19.7779C15.5061 19.7545 15.7842 19.7489 16.2233 19.7413L16.1975 18.2416Z" fill="#b0b0b0"></path>
                <path opacity="0.5" d="M8 9H16" stroke="#b0b0b0" stroke-width="1.5" stroke-linecap="round"></path>
                <path opacity="0.5" d="M8 12.5H13.5" stroke="#b0b0b0" stroke-width="1.5" stroke-linecap="round"></path>
            </g>
        </svg>
    `;

    // Build the clickable list of GPT titles
    gptTitles.forEach(title => {
        const titleButton = document.createElement('button');
        const truncatedTitle = title.length > 24 ? title.substring(0, 24) + '...' : title;
        titleButton.textContent = truncatedTitle;
        titleButton.title = title; // Full title for tooltip
        titleButton.classList.add('myHoverButton');
        titleButton.style.marginBottom = '8px';
        titleButton.style.fontSize = '.875rem';
        titleButton.style.padding = '6px';
        titleButton.style.borderRadius = '7px';

        // Make the button a flex container to align items horizontally
        titleButton.style.display = 'flex';
        titleButton.style.alignItems = 'center';
        titleButton.style.justifyContent = 'space-between';

        // Create the GPT Title icon (HIDDEN by default, only on hover)
        const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgIcon.classList.add('titleButtonIcon'); // so we can hide/show on hover
        svgIcon.setAttribute('viewBox', '0 0 24 24');
        svgIcon.setAttribute('fill', '#b0b0b0');
        svgIcon.style.width = '19px';
        svgIcon.style.height = '19px';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M15.6729 3.91287C16.8918 2.69392 18.8682 2.69392 20.0871 3.91287C21.3061 5.13182 21.3061 7.10813 20.0871 8.32708L14.1499 14.2643C13.3849 15.0293 12.3925 15.5255 11.3215 15.6785L9.14142 15.9899C8.82983 16.0344 8.51546 15.9297 8.29289 15.7071C8.07033 15.4845 7.96554 15.1701 8.01005 14.8586L8.32149 12.6785C8.47449 11.6075 8.97072 10.615 9.7357 9.85006L15.6729 3.91287ZM18.6729 5.32708C18.235 4.88918 17.525 4.88918 17.0871 5.32708L11.1499 11.2643C10.6909 11.7233 10.3932 12.3187 10.3014 12.9613L10.1785 13.8215L11.0386 13.6986C11.6812 13.6068 12.2767 13.3091 12.7357 12.8501L18.6729 6.91287C19.1108 6.47497 19.1108 5.76499 18.6729 5.32708ZM11 3.99929C11.0004 4.55157 10.5531 4.99963 10.0008 5.00007C9.00227 5.00084 8.29769 5.00827 7.74651 5.06064C7.20685 5.11191 6.88488 5.20117 6.63803 5.32695C6.07354 5.61457 5.6146 6.07351 5.32698 6.63799C5.19279 6.90135 5.10062 7.24904 5.05118 7.8542C5.00078 8.47105 5 9.26336 5 10.4V13.6C5 14.7366 5.00078 15.5289 5.05118 16.1457C5.10062 16.7509 5.19279 17.0986 5.32698 17.3619C5.6146 17.9264 6.07354 18.3854 6.63803 18.673C6.90138 18.8072 7.24907 18.8993 7.85424 18.9488C8.47108 18.9992 9.26339 19 10.4 19H13.6C14.7366 19 15.5289 18.9992 16.1458 18.9488C16.7509 18.8993 17.0986 18.8072 17.362 18.673C17.9265 18.3854 18.3854 17.9264 18.673 17.3619C18.7988 17.1151 18.8881 16.7931 18.9393 16.2535C18.9917 15.7023 18.9991 14.9977 18.9999 13.9992C19.0003 13.4469 19.4484 12.9995 20.0007 13C20.553 13.0004 21.0003 13.4485 20.9999 14.0007C20.9991 14.9789 20.9932 15.7808 20.9304 16.4426C20.8664 17.116 20.7385 17.7136 20.455 18.2699C19.9757 19.2107 19.2108 19.9756 18.27 20.455C17.6777 20.7568 17.0375 20.8826 16.3086 20.9421C15.6008 21 14.7266 21 13.6428 21H10.3572C9.27339 21 8.39925 21 7.69138 20.9421C6.96253 20.8826 6.32234 20.7568 5.73005 20.455C4.78924 19.9756 4.02433 19.2107 3.54497 18.2699C3.24318 17.6776 3.11737 17.0374 3.05782 16.3086C2.99998 15.6007 2.99999 14.7266 3 13.6428V10.3572C2.99999 9.27337 2.99998 8.39922 3.05782 7.69134C3.11737 6.96249 3.24318 6.3223 3.54497 5.73001C4.02433 4.7892 4.78924 4.0243 5.73005 3.54493C6.28633 3.26149 6.88399 3.13358 7.55735 3.06961C8.21919 3.00673 9.02103 3.00083 9.99922 3.00007C10.5515 2.99964 10.9996 3.447 11 3.99929Z');
        svgIcon.appendChild(path);

        titleButton.appendChild(svgIcon);
container.appendChild(checkboxDivider());
        container.appendChild(titleButton);


// 1) Load sidebarLinks so we can get the "href" that belongs to this GPT title
const sidebarLinksString = localStorage.getItem('sidebarLinks');
let sidebarLinks = [];
if (sidebarLinksString) {
    try {
        sidebarLinks = JSON.parse(sidebarLinksString);
    } catch (err) {
        console.error('[renderCustomGPTList] => Error parsing sidebarLinks:', err);
    }
}

// 2) Find the actual object that matches this `title` in your sidebarLinks
const matchingEntry = sidebarLinks.find(link => link.title === title);
if (matchingEntry) {
    // 3) If we have a match, the user can click to navigate
    titleButton.addEventListener('click', () => {
        // This opens https://chatgpt.com/[href] in the **same** tab
        window.location.href = `https://chatgpt.com/${matchingEntry.href}`;
    });
}



        // UL for the items
        const ul = document.createElement('ul');
        ul.style.marginBottom = '16px';
        ul.style.listStyle = 'none';
        ul.style.paddingLeft = '0';
        container.appendChild(ul);

        // Sort items by newest first
        const items = customGPTs[title].slice().sort((a, b) => {
            return new Date(b.storedAt).getTime() - new Date(a.storedAt).getTime();
        });

        items.forEach(item => {
            // Entire list item is a button
            const listItemButton = document.createElement('button');
            listItemButton.classList.add('myHoverButton');
            listItemButton.style.display = 'flex';
            listItemButton.style.alignItems = 'center';
            listItemButton.style.justifyContent = 'space-between';
            listItemButton.style.width = '100%';
            listItemButton.style.marginBottom = '0px';
            listItemButton.style.padding = '6px';
            listItemButton.style.fontSize = '.875rem';
            listItemButton.style.borderRadius = '7px';

            listItemButton.addEventListener('click', () => {
                updateLastAccess(title, item.url);
                window.location.href = item.url;
            });

            // Left container for the doc icon + text
            const leftContent = document.createElement('div');
            leftContent.style.display = 'flex';
            leftContent.style.alignItems = 'center';

            // This doc icon is ALWAYS visible
            const svgContainer = document.createElement('span');
            svgContainer.innerHTML = svgIconHTML;  // Always shown
            svgContainer.style.marginRight = '8px';
            // Optional: give this a class if you want, but do NOT hide it via CSS
            // svgContainer.classList.add('conversationItemIcon');

            leftContent.appendChild(svgContainer);

            // Display either the custom name or date
            const dateOnly = new Date(item.storedAt).toLocaleDateString();
            const displayText = item.name || dateOnly;
            const textSpan = document.createElement('span');
            textSpan.style.flexGrow = '1';
            textSpan.textContent = displayText;
            leftContent.appendChild(textSpan);

            listItemButton.appendChild(leftContent);

            // Buttons container (Edit, Remove) - hidden by default, visible on hover
            const btnsContainer = document.createElement('div');
            btnsContainer.style.display = 'flex';
            btnsContainer.style.gap = '6px';

            // The "Edit" button
            const editButton = document.createElement('button');
            editButton.classList.add('editButton'); // so we can hide/show on hover
            editButton.style.fontSize = '0.8em';
            editButton.style.cursor = 'pointer';
            editButton.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M13.2929 4.29291C15.0641 2.52167 17.9359 2.52167 19.7071 4.2929C21.4784 6.06414 21.4784 8.93588
                             19.7071 10.7071L18.7073 11.7069L11.6135 18.8007C10.8766 19.5376 9.92793 20.0258 8.89999 20.1971L4.16441
                             20.9864C3.84585 21.0395 3.52127 20.9355 3.29291 20.7071C3.06454 20.4788 2.96053 20.1542 3.01362 19.8356L3.80288
                             15.1C3.9742 14.0721 4.46243 13.1234 5.19932 12.3865L13.2929 4.29291ZM13 7.41422L6.61353 13.8007C6.1714 14.2428
                             5.87846 14.8121 5.77567 15.4288L5.21656 18.7835L8.57119 18.2244C9.18795 18.1216 9.75719 17.8286 10.1993
                             17.3865L16.5858 11L13 7.41422ZM18 9.5858L14.4142 6.00001L14.7071 5.70712C15.6973 4.71693 17.3027 4.71693
                             18.2929 5.70712C19.2831 6.69731 19.2831 8.30272 18.2929 9.29291L18 9.5858Z"
                          fill="#B4B4B4">
                    </path>
                </svg>
            `;
            editButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const newName = prompt('Enter a custom name for this conversation:', item.name || '');
                if (newName !== null) {
                    saveCustomName(title, item.url, newName);
                }
            });

            // The "Remove" button
            const removeButton = document.createElement('button');
            removeButton.classList.add('removeButton'); // so we can hide/show on hover
            removeButton.textContent = '✕';
            removeButton.style.color = '#B4B4B4';
            removeButton.style.fontWeight = '550';
            removeButton.style.fontSize = '0.8em';
            removeButton.style.cursor = 'pointer';
            removeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                removeConversation(title, item.url);
            });

            btnsContainer.appendChild(editButton);
            btnsContainer.appendChild(removeButton);

            // Align these to the right edge
            btnsContainer.style.marginLeft = 'auto';

            listItemButton.appendChild(btnsContainer);

            // Highlight current conversation
            if (window.location.href === item.url) {
                listItemButton.classList.add('active');
            }

            ul.appendChild(listItemButton);
        });
    });
container.appendChild(checkboxDivider());
    // Insert the container after the reference element
    referenceEl.insertAdjacentElement('afterend', container);
}


    /**
     * 2.1) Helper: saveCustomName
     * Finds the item in localStorage with matching (title & url),
     * updates its .name property, saves to localStorage, then re-renders the list.
     */
    function saveCustomName(gptTitle, url, newName) {
        const customGPTsString = localStorage.getItem('CustomGPTs');
        if (!customGPTsString) return;

        let customGPTs;
        try {
            customGPTs = JSON.parse(customGPTsString);
        } catch (err) {
            console.error('[saveCustomName] => Error parsing CustomGPTs:', err);
            return;
        }

        if (!customGPTs[gptTitle]) return;

        // Find the item by url
        const item = customGPTs[gptTitle].find(obj => obj.url === url);
        if (item) {
            item.name = newName.trim() || null; // if user erases, revert to null
        }

        localStorage.setItem('CustomGPTs', JSON.stringify(customGPTs));
        // Re-render
        renderCustomGPTList();
    }

    /**
     * 2.2) Helper: updateLastAccess
     * Updates the 'storedAt' to "now" for sorting. Then re-renders.
     */
    function updateLastAccess(gptTitle, url) {
        const customGPTsString = localStorage.getItem('CustomGPTs');
        if (!customGPTsString) return;

        let customGPTs;
        try {
            customGPTs = JSON.parse(customGPTsString);
        } catch (err) {
            console.error('[updateLastAccess] => Error parsing CustomGPTs:', err);
            return;
        }

        if (!customGPTs[gptTitle]) return;

        // Find the item
        const item = customGPTs[gptTitle].find(obj => obj.url === url);
        if (item) {
            item.storedAt = new Date().toISOString();
            localStorage.setItem('CustomGPTs', JSON.stringify(customGPTs));
            // Re-render
            renderCustomGPTList();
        }
    }

    /**
     * 2.3) Helper: removeConversation
     * Removes the item from localStorage, if array ends up empty => remove the GPT Title key
     */
    function removeConversation(gptTitle, url) {
        const customGPTsString = localStorage.getItem('CustomGPTs');
        if (!customGPTsString) return;

        let customGPTs;
        try {
            customGPTs = JSON.parse(customGPTsString);
        } catch (err) {
            console.error('[removeConversation] => Error parsing CustomGPTs:', err);
            return;
        }

        // Does the GPT title exist?
        if (!customGPTs[gptTitle]) return;

        // Filter out the URL we no longer want
        customGPTs[gptTitle] = customGPTs[gptTitle].filter(obj => obj.url !== url);

        // If that leaves it empty, remove the title from dictionary
        if (customGPTs[gptTitle].length === 0) {
            delete customGPTs[gptTitle];
        }

        localStorage.setItem('CustomGPTs', JSON.stringify(customGPTs));
        // Re-render
        renderCustomGPTList();
    }

    /***********************************************************************
     * 3. OBSERVER: Re-render list if the sidebar re-renders
     ***********************************************************************/
    function startSidebarObserver() {
        const sidebarParent = document.querySelector('.group\\/sidebar > div:nth-child(1)');
        if (!sidebarParent) {
            console.warn('[startSidebarObserver] => Sidebar parent not found. We cannot observe changes.');
            return;
        }

        const observer = new MutationObserver(() => {
            renderCustomGPTList();
        });

        observer.observe(sidebarParent, {
            childList: true,
            subtree: true
        });

        console.log('[startSidebarObserver] => Watching for sidebar changes...');
    }

    /***********************************************************************
     * 4. PERIODIC REFRESH: So new conversations are captured automatically
     ***********************************************************************/
    function startPeriodicRefresh(intervalMs) {
        setInterval(() => {
            storeConversationUrlIfNeeded();
            renderCustomGPTList();
        }, intervalMs);
        console.log(`[startPeriodicRefresh] => Refresh every ${intervalMs}ms.`);
    }

    /***********************************************************************
     * 5. INIT: tie it all together
     ***********************************************************************/
    function init() {
        console.log('[Persistent Custom GPTs w/ Names & Dates] Init...');

        // Check/store conversation on load
        storeConversationUrlIfNeeded();

        // Observe sidebar changes
        startSidebarObserver();

        // Render once now
        renderCustomGPTList();

        // Periodically refresh
        startPeriodicRefresh(5000); // 10s refresh
    }

    init();

})();