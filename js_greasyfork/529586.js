// ==UserScript==
// @name         ChatGPT Pin Chats
// @namespace    https://greasyfork.org/en/users/1444872-tlbstation
// @version      2.5.2
// @description  Add a pin button to each chat in ChatGPT's sidebar, making it easy to save important conversations. Pinned chats are displayed either in a separate section or integrated with history based on your settings.
// @icon         https://i.ibb.co/jZ3HpwPk/pngwing-com.png
// @author       TLBSTATION
// @match        https://chatgpt.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529586/ChatGPT%20Pin%20Chats.user.js
// @updateURL https://update.greasyfork.org/scripts/529586/ChatGPT%20Pin%20Chats.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'pinnedChatsGPT';

    function getPinnedChats() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    function savePinnedChats(chats) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    }

    // Creates the default pinned section (used for "Separate Section (default)" style)
    function createPinnedSection() {
        let pinnedContainer = document.querySelector('#pinned-chats');
        if (!pinnedContainer) {
            pinnedContainer = document.createElement('div');
            pinnedContainer.id = 'pinned-chats';
            pinnedContainer.style.padding = '10px';
            pinnedContainer.style.marginBottom = '0';
            pinnedContainer.style.borderBottom = '2px solid rgba(255, 255, 255, 0.2)';
            pinnedContainer.style.color = 'white';
            pinnedContainer.style.paddingLeft = '10px';
            pinnedContainer.style.marginLeft = '-11px';

            function insertPinnedSection() {
                const targetDiv = document.querySelector('.flex-col.flex-1.transition-opacity.duration-500.relative.pr-3.overflow-y-auto');
                if (targetDiv && targetDiv.parentElement) {
                    targetDiv.parentElement.insertBefore(pinnedContainer, targetDiv.nextSibling);
                    return true;
                }
                return false;
            }

            if (!insertPinnedSection()) {
                const observer = new MutationObserver(() => {
                    if (insertPinnedSection()) observer.disconnect();
                });
                observer.observe(document.body, { childList: true, subtree: true });
            }
        }
        return pinnedContainer;
    }

    // Renders the pinned chats section according to the saved style setting.
    function updatePinnedSection() {
        const styleOption = localStorage.getItem('pinnedChatsStyle') || 'Separate Section (default)';
        const pinnedChats = getPinnedChats();

        if (styleOption === 'Separate Section (default)') {
            // Remove the "With History" section if it exists
            const historySection = document.getElementById('pinned-chats-section');
            if (historySection) {
                historySection.remove();
            }
            // ----- Default style: separate section at the bottom of the sidebar -----
            const pinnedContainer = createPinnedSection();
            pinnedContainer.innerHTML = '';

            // Header with title and clear button
            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.alignItems = 'center';
            header.style.justifyContent = 'space-between';
            header.style.marginBottom = '10px';

            const title = document.createElement('h3');
            title.innerText = '📌 Pinned Chats';
            title.style.fontSize = '16px';
            title.style.fontWeight = 'bold';
            title.style.margin = '0';

            const clearButton = document.createElement('button');
            clearButton.innerHTML = `
      <svg width="25" height="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5555 4C10.099 4 9.70052 4.30906 9.58693 4.75114L9.29382 5.8919H14.715L14.4219 4.75114C14.3083 4.30906 13.9098 4 13.4533 4H10.5555ZM16.7799 5.8919L16.3589 4.25342C16.0182 2.92719 14.8226 2 13.4533 2H10.5555C9.18616 2 7.99062 2.92719 7.64985 4.25342L7.22886 5.8919H4C3.44772 5.8919 3 6.33961 3 6.8919C3 7.44418 3.44772 7.8919 4 7.8919H4.10069L5.31544 19.3172C5.47763 20.8427 6.76455 22 8.29863 22H15.7014C17.2354 22 18.5224 20.8427 18.6846 19.3172L19.8993 7.8919H20C20.5523 7.8919 21 7.44418 21 6.8919C21 6.33961 20.5523 5.8919 20 5.8919H16.7799ZM17.888 7.8919H6.11196L7.30423 19.1057C7.3583 19.6142 7.78727 20 8.29863 20H15.7014C16.2127 20 16.6417 19.6142 16.6958 19.1057L17.888 7.8919ZM10 10C10.5523 10 11 10.4477 11 11V16C11 16.5523 10.5523 17 10 17C9.44772 17 9 16.5523 9 16V11C9 10.4477 9.44772 10 10 10ZM14 10C14.5523 10 15 10.4477 15 11V16C15 16.5523 14.5523 17 14 17C13.4477 17 13 16.5523 13 16V11C13 10.4477 13.4477 10 14 10Z" fill="currentColor"></path>
      </svg>
    `;
            clearButton.style.padding = '4px 4px';
            clearButton.style.border = 'none';
            clearButton.style.cursor = 'pointer';
            clearButton.style.color = 'white';
            clearButton.style.transition = 'color 0.3s';

            clearButton.addEventListener('mouseenter', () => {
                clearButton.style.color = 'red';
            });
            clearButton.addEventListener('mouseleave', () => {
                clearButton.style.color = 'white';
            });

            clearButton.addEventListener('click', () => {
                localStorage.removeItem(STORAGE_KEY);
                updatePinnedSection();
                addPinToChats(); // refresh pin buttons
                document.querySelectorAll('.pin-button').forEach(button => {
                    button.style.opacity = '0.5';
                });
            });

            header.appendChild(title);
            header.appendChild(clearButton);
            pinnedContainer.appendChild(header);

            if (pinnedChats.length > 0) {
                clearButton.style.display = 'block';
                const list = document.createElement('ul');
                list.style.listStyle = 'none';
                list.style.padding = '0';
                list.style.margin = '0';
                list.style.maxHeight = '200px';
                list.style.overflowY = 'auto';
                list.style.paddingRight = '5px';

                pinnedChats.forEach(chat => {
                    const currentChatID = window.location.pathname.split("/c/")[1];
                    const chatItem = document.createElement('li');
                    chatItem.style.padding = '8px';
                    chatItem.style.marginBottom = '5px';
                    chatItem.style.cursor = 'pointer';
                    chatItem.style.borderRadius = '6px';
                    chatItem.style.background = 'rgba(255, 255, 255, 0.1)';
                    chatItem.style.transition = 'background 0.3s';
                    chatItem.style.display = 'flex';
                    chatItem.style.alignItems = 'center';
                    chatItem.style.border = `${
                        chat.id === currentChatID ? "2px solid" : "none"
                }`;;

                    chatItem.addEventListener('mouseenter', () => {
                        chatItem.style.background = 'rgba(255, 255, 255, 0.2)';
                    });
                    chatItem.addEventListener('mouseleave', () => {
                        chatItem.style.background = 'rgba(255, 255, 255, 0.1)';
                    });

                    const chatLink = document.createElement('a');
                    chatLink.href = `https://chatgpt.com/c/${chat.id}`;
                    chatLink.innerText = chat.title;
                    chatLink.style.color = 'white';
                    chatLink.style.textDecoration = 'none';
                    chatLink.style.flexGrow = '1';
                    chatLink.style.whiteSpace = 'nowrap';
                    chatLink.style.overflow = 'hidden';
                    chatLink.style.textOverflow = 'ellipsis';

                    const removeButton = document.createElement('span');
                    removeButton.innerText = '❌';
                    removeButton.style.cursor = 'pointer';
                    removeButton.style.marginLeft = '10px';
                    removeButton.style.fontSize = '14px';
                    removeButton.style.opacity = '0';
                    removeButton.style.transition = 'opacity 0.3s';

                    chatItem.addEventListener('mouseenter', () => {
                        removeButton.style.opacity = '1';
                    });
                    chatItem.addEventListener('mouseleave', () => {
                        removeButton.style.opacity = '0';
                    });

                    removeButton.addEventListener('click', (event) => {
                        event.stopPropagation();
                        let updatedChats = getPinnedChats().filter(c => c.id !== chat.id);
                        savePinnedChats(updatedChats);
                        updatePinnedSection();
                        document.querySelectorAll('.pin-button').forEach(button => {
                            const parentChatItem = button.closest('li[data-testid^="history-item-"]');
                            if (parentChatItem) {
                                const chatID = parentChatItem.querySelector('a')?.getAttribute('href')?.split('/c/')[1];
                                if (chatID === chat.id) {
                                    button.style.opacity = '0.5';
                                }
                            }
                        });
                    });

                    chatItem.appendChild(chatLink);
                    chatItem.appendChild(removeButton);
                    list.appendChild(chatItem);
                });

                pinnedContainer.appendChild(list);
            } else {
                clearButton.style.display = 'none';
                const emptyMessage = document.createElement('p');
                emptyMessage.innerText = 'No pinned chats';
                emptyMessage.style.color = 'rgba(255, 255, 255, 0.6)';
                emptyMessage.style.fontSize = '14px';
                pinnedContainer.appendChild(emptyMessage);
            }
        } else {
            // Find the container with the specified class
            const container = document.querySelector('.flex.flex-col.gap-2.text-token-text-primary.text-sm.mt-5.first\\:mt-0.false');

            // Check if the container exists
            if (container) {
                // Remove the default pinned container if it exists
                const defaultContainer = document.getElementById("pinned-chats");
                if (defaultContainer) {
                    defaultContainer.remove();
                }

                // Create the pinned section
                let pinnedSection = document.getElementById("pinned-chats-section");
                if (!pinnedSection) {
                    pinnedSection = document.createElement("div");
                    pinnedSection.id = "pinned-chats-section";
                    pinnedSection.className = "pinned-chats-section"; // Optional: Add custom class
                }

                // Clear any existing content in pinnedSection
                pinnedSection.innerHTML = "";

                const header = document.createElement("h3");
                header.className = "pb-2 pt-3 px-2 text-xs font-medium text-ellipsis overflow-hidden break-all text-token-text-primary";
                header.innerText = "Pinned";
                pinnedSection.appendChild(header);

                if (pinnedChats.length > 0) {
                    // Create pinned chat items (as per your example)
                    pinnedChats.forEach((chat) => {
                        const currentChatID = window.location.pathname.split("/c/")[1];
                        const chatItem = document.createElement("li");
                        chatItem.style.listStyle = "none";
                        chatItem.className = `group relative rounded-lg active:opacity-90 flex items-center ${
                        chat.id === currentChatID ? "bg-token-sidebar-surface-tertiary hover:bg-token-sidebar-surface-secondary" : "hover:bg-token-sidebar-surface-secondary"
                    }`;
                        chatItem.innerHTML = `
      <a href="/c/${chat.id}" class="flex items-center gap-2 p-2 w-full" style="mask-image: var(--sidebar-mask);" title="${chat.title}">
        <div class="relative grow overflow-hidden whitespace-nowrap">${chat.title}
          <div class="absolute bottom-0 right-0 top-0 bg-gradient-to-l to-transparent from-token-sidebar-surface-primary group-hover:from-token-sidebar-surface-secondary w-8 group-hover:w-20"></div>
        </div>
      </a>
    `;

                        // Create remove button with SVG
                        const removeButton = document.createElement("span");
                        removeButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5555 4C10.099 4 9.70052 4.30906 9.58693 4.75114L9.29382 5.8919H14.715L14.4219 4.75114C14.3083 4.30906 13.9098 4 13.4533 4H10.5555ZM16.7799 5.8919L16.3589 4.25342C16.0182 2.92719 14.8226 2 13.4533 2H10.5555C9.18616 2 7.99062 2.92719 7.64985 4.25342L7.22886 5.8919H4C3.44772 5.8919 3 6.33961 3 6.8919C3 7.44418 3.44772 7.8919 4 7.8919H4.10069L5.31544 19.3172C5.47763 20.8427 6.76455 22 8.29863 22H15.7014C17.2354 22 18.5224 20.8427 18.6846 19.3172L19.8993 7.8919H20C20.5523 7.8919 21 7.44418 21 6.8919C21 6.33961 20.5523 5.8919 20 5.8919H16.7799ZM17.888 7.8919H6.11196L7.30423 19.1057C7.3583 19.6142 7.78727 20 8.29863 20H15.7014C16.2127 20 16.6417 19.6142 16.6958 19.1057L17.888 7.8919ZM10 10C10.5523 10 11 10.4477 11 11V16C11 16.5523 10.5523 17 10 17C9.44772 17 9 16.5523 9 16V11C9 10.4477 9.44772 10 10 10ZM14 10C14.5523 10 15 10.4477 15 11V16C15 16.5523 14.5523 17 14 17C13.4477 17 13 16.5523 13 16V11C13 10.4477 13.4477 10 14 10Z" fill="currentColor"></path>
      </svg>
    `;
                        removeButton.style.userSelect= "none";
                        removeButton.classList.add("text-token-text-error");
                        removeButton.style.cursor = "pointer";
                        removeButton.style.position = "absolute"; // Position it absolutely within the container
                        removeButton.style.right = "10px"; // Align it to the right
                        removeButton.style.fontSize = "16px";
                        removeButton.style.opacity = "0"; // Initially hide the button
                        removeButton.style.transition = "opacity 0.3s";

                        // Show remove button on hover
                        chatItem.addEventListener("mouseenter", () => {
                            removeButton.style.opacity = ".7";
                        });
                        chatItem.addEventListener("mouseleave", () => {
                            removeButton.style.opacity = "0";
                        });
                        removeButton.addEventListener("mouseenter", () => {
                            removeButton.style.opacity = "1";
                        });
                        removeButton.addEventListener("mouseleave", () => {
                            removeButton.style.opacity = ".7";
                        });

                        // Remove pinned chat on click
                        removeButton.addEventListener("click", (event) => {
                            event.stopPropagation();
                            let updatedChats = getPinnedChats().filter(c => c.id !== chat.id);
                            savePinnedChats(updatedChats);
                            updatePinnedSection();
                            // Optionally update pin button opacity in chat history if needed
                            document.querySelectorAll(".pin-button").forEach(button => {
                                const parentChatItem = button.closest('li[data-testid^="history-item-"]');
                                if (parentChatItem) {
                                    const chatID = parentChatItem.querySelector("a")?.getAttribute("href")?.split("/c/")[1];
                                    if (chatID === chat.id) {
                                        button.style.opacity = "0.5";
                                    }
                                }
                            });
                        });

                        // Append the remove button to the chat item
                        chatItem.appendChild(removeButton);
                        pinnedSection.appendChild(chatItem);
                    });
                } else {
                    const emptyMessage = document.createElement('p');
                    emptyMessage.innerText = 'No pinned chats';
                    emptyMessage.style.color = 'rgba(255, 255, 255, 0.6)';
                    emptyMessage.style.fontSize = '14px';
                    emptyMessage.style.paddingLeft = '15px';
                    pinnedSection.appendChild(emptyMessage);
                }
                // Insert the pinnedSection as the first child of the container
                container.insertBefore(pinnedSection, container.firstChild);
            }


        }
    }

    // Add a pin button to each chat in the history sidebar.
    function addPinToChats() {
        document.querySelectorAll('li[data-testid^="history-item-"]').forEach(chatItem => {
            if (chatItem.querySelector('.pin-button')) return;

            const chatTitleElement = chatItem.querySelector('a div');
            if (!chatTitleElement) return;

            const chatTitle = chatTitleElement.innerText.trim();
            const chatID = chatItem.querySelector('a')?.getAttribute('href')?.split('/c/')[1];

            const pinButton = document.createElement('span');
            pinButton.className = 'pin-button';
            pinButton.innerHTML = `<svg width="18" height="19" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill="currentColor" d="M11 6.5v-5.5h1v-1h-8v1h1v5.5s-2 1.5-2 3.5c0 0.5 1.9 0.7 4 0.7v2.2c0 0.7 0.2 1.4 0.5 2.1l0.5 1 0.5-1c0.3-0.6 0.5-1.3 0.5-2.1v-2.2c2.1 0 4-0.3 4-0.7 0-2-2-3.5-2-3.5zM7 6.6s-0.5 0.3-1.6 1.4c-1 1-1.5 1.9-1.5 1.9s0.1-1 0.8-1.9c0.9-1.1 1.3-1.4 1.3-1.4v-5.6h1v5.6z"/>
</svg>
`;
            pinButton.style.cursor = 'pointer';
            pinButton.style.marginRight = '5px';
            pinButton.style.fontSize = '16px';
            pinButton.style.opacity = '0.5';
            pinButton.style.rotate = '45deg';

            let pinnedChats = getPinnedChats();
            if (pinnedChats.some(c => c.id === chatID)) {pinButton.style.opacity = '1'; pinButton.style.rotate = '0deg';};

            pinButton.addEventListener('click', (event) => {
                event.stopPropagation();
                event.preventDefault();

                let pinnedChats = getPinnedChats();

                if (pinnedChats.some(c => c.id === chatID)) {
                    pinnedChats = pinnedChats.filter(c => c.id !== chatID);
                    pinButton.style.opacity = '0.5';
                    pinButton.style.rotate = '45deg';
                } else {
                    pinnedChats.unshift({ title: chatTitle, id: chatID });
                    pinButton.style.opacity = '1';
                    pinButton.style.rotate = '0deg';
                }

                savePinnedChats(pinnedChats);
                updatePinnedSection();
            });

            chatTitleElement.parentElement.prepend(pinButton);
        });
    }


    function observeSidebar() {
        const observer = new MutationObserver(() => {
            addPinToChats();
            syncPinnedChats();
        });
        const sidebar = document.querySelector('nav');
        if (sidebar) observer.observe(sidebar, { childList: true, subtree: true });
    }
    // --- Sync Pinned Chats with Sidebar (for renaming & deletion) ---
    function syncPinnedChats() {
        let pinnedChats = getPinnedChats();
        let changed = false;
        document.querySelectorAll('li[data-testid^="history-item-"]').forEach(chatItem => {
            const chatLink = chatItem.querySelector('a');
            if (!chatLink) return;
            const chatID = chatLink.getAttribute('href').split('/c/')[1];
            const chatTitleElement = chatItem.querySelector('a div');
            if (!chatTitleElement) return;
            const currentTitle = chatTitleElement.innerText.trim();
            for (let i = 0; i < pinnedChats.length; i++) {
                if (pinnedChats[i].id === chatID) {
                    if (pinnedChats[i].title !== currentTitle) {
                        pinnedChats[i].title = currentTitle;
                        changed = true;
                    }
                    break;
                }
            }
        });
        // Remove pinned chats that no longer exist
        let filtered = pinnedChats.filter(chat => {
            return document.querySelector(`li[data-testid^="history-item-"] a[href*="/c/${chat.id}"]`) !== null;
        });
        if (filtered.length !== pinnedChats.length) {
            pinnedChats = filtered;
            changed = true;
        }
        if (changed) {
            savePinnedChats(pinnedChats);
            updatePinnedSection();
        }
    }

    function init() {
        addPinToChats();
        updatePinnedSection();
        observeSidebar();
    }

    // Monitor sidebar visibility changes
    function monitorSidebar() {
        const observer = new MutationObserver(() => {
            const sidebar = document.querySelector('nav');
            if (sidebar && !document.querySelector('#pinned-chats') && !document.querySelector('#pinned-chats-section')) {
                init();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector(selector)) {
                callback();
                obs.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    waitForElement(".relative.grow.overflow-hidden.whitespace-nowrap", () => {
        init();
        monitorSidebar();
    });

    /* ================= Settings Panel: Pinned Chats Style Option ================= */
    let observerSettings;

    function addPinnedChatsStyleOption() {
        const allSettingsContainers = document.querySelector('[id*="-content-General"]');

        if (!allSettingsContainers) {
            // Retry after a short delay
            setTimeout(addPinnedChatsStyleOption, 100);
            return;
        }

        const settingsContainer = allSettingsContainers.querySelector('.flex.flex-col.gap-3.px-4.pb-6.text-sm');
        if (!settingsContainer || document.getElementById('pinned-chats-style-setting')) return;

        const settingDiv = document.createElement('div');
        settingDiv.className = 'border-b border-token-border-light pb-3 last-of-type:border-b-0';
        settingDiv.id = 'pinned-chats-style-setting';

        const innerDiv = document.createElement('div');
        innerDiv.className = 'flex items-center justify-between';

        const labelDiv = document.createElement('div');
        labelDiv.textContent = 'Pinned Chats Location';

        const dropdownBtn = document.createElement('button');
        dropdownBtn.type = 'button';
        dropdownBtn.role = 'combobox';
        dropdownBtn.className = 'text-token-text-primary border border-token-border-light inline-flex h-9 items-center justify-between gap-1 rounded-lg bg-token-main-surface-primary px-3 text-sm leading-none outline-none cursor-pointer hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary';
        dropdownBtn.setAttribute('aria-expanded', 'false');

        const selectedOption = document.createElement('span');
        selectedOption.style.pointerEvents = 'none';

        const arrowIcon = document.createElement('span');
        arrowIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 9.29289C5.68342 8.90237 6.31658 8.90237 6.70711 9.29289L12 14.5858L17.2929 9.29289C17.6834 8.90237 18.3166 8.90237 18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071L12.7071 16.7071C12.5196 16.8946 12.2652 17 12 17C11.7348 17 11.4804 16.8946 11.2929 16.7071L5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289Z" fill="currentColor"></path>
        </svg>`;

        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'absolute z-50 mt-1 w-full bg-token-main-surface-primary border border-token-border-light rounded-lg shadow-lg hidden';
        dropdownMenu.style.width = '205px';
        dropdownMenu.style.right = '36px';

        const options = ['Separate Section (default)', 'With History'];
        options.forEach(optionText => {
            const option = document.createElement('div');
            option.className = 'px-3 py-2 cursor-pointer hover:bg-token-main-surface-secondary';
            option.textContent = optionText;
            option.addEventListener('click', function () {
                selectedOption.textContent = optionText;
                localStorage.setItem('pinnedChatsStyle', optionText);
                dropdownMenu.classList.add('hidden');
                dropdownBtn.setAttribute('aria-expanded', 'false');
                updatePinnedSection();
            });
            dropdownMenu.appendChild(option);
        });

        const savedStyle = localStorage.getItem('pinnedChatsStyle') || 'Separate Section (default)';
        selectedOption.textContent = savedStyle;

        dropdownBtn.addEventListener('click', function () {
            const isOpen = dropdownMenu.classList.contains('hidden');
            dropdownMenu.classList.toggle('hidden', !isOpen);
            dropdownBtn.setAttribute('aria-expanded', isOpen.toString());
        });

        document.addEventListener('click', function (event) {
            if (!dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.add('hidden');
                dropdownBtn.setAttribute('aria-expanded', 'false');
            }
        });

        dropdownBtn.appendChild(selectedOption);
        dropdownBtn.appendChild(arrowIcon);
        innerDiv.appendChild(labelDiv);
        innerDiv.appendChild(dropdownBtn);
        settingDiv.appendChild(innerDiv);
        settingDiv.appendChild(dropdownMenu);

        const firstSetting = settingsContainer.children[0];
        if (firstSetting) {
            settingsContainer.insertBefore(settingDiv, firstSetting.nextSibling);
        } else {
            settingsContainer.appendChild(settingDiv);
        }
    }

    function observeSettingsPanel() {
        if (observerSettings) observerSettings.disconnect();

        observerSettings = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    if (document.querySelector('.flex.flex-col.gap-3.px-4.pb-6.text-sm')) {
                        addPinnedChatsStyleOption();
                    }
                }
            }
        });

        observerSettings.observe(document.body, { childList: true, subtree: true });
    }
    // Observe URL changes to update active chat highlight
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            updatePinnedSection(); // Refresh pinned section when changing chats
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(addPinnedChatsStyleOption, 1000);
    observeSettingsPanel();

})();
