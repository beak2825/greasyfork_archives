// ==UserScript==
// @name         YouTube Special Comment Sticker
// @namespace    http://tampermonkey.net/
// @version      20230320
// @description  Stickies YouTube moderator and owner comments above the comment box.
// @author       AsobiTaizen
// @match        https://www.youtube.com/live_chat*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420297/YouTube%20Special%20Comment%20Sticker.user.js
// @updateURL https://update.greasyfork.org/scripts/420297/YouTube%20Special%20Comment%20Sticker.meta.js
// ==/UserScript==
 
(() => {
    let IS_DARK = document.querySelector('html').hasAttribute('dark');
    let IS_POPOUT = document.location.href.indexOf('popout') > -1;
    let CHAT_ID = IS_POPOUT ? document.location.href.split('=')[2] : document.location.href.split('=')[1].slice(8, 120);

    let canScroll = true;
    let chat;
    let chatSettingsButton;
    let chatSettingsStickyButton;
    let historiesSelected;
    let history;
    let historyButton;
    let itemScroller;
    let menu;
    let menuButton;
    let notice;
    let scrollButton;
    let settings;
    let settingsButton;
    let settingsData;
    let sticky;
    let stickyItemObjects;
    let stickyItemObjectsMap;
    let stickyItems;
    let stickyItemsContainer;
    let toggleSticky;
    let toggleStickyText;
    let blacklist;
    let whitelist;
    let moderator;
    let owner;
    let cancel;
    let save;

    let showSticky = () => {
        if (sticky.style.display === 'none') {
            chat = document.querySelector('yt-live-chat-app');
            itemScroller = chat.querySelector('#item-scroller');
            sticky.style.display = 'inherit';
            chat.setAttribute('style', `max-height: ${chat.offsetHeight - sticky.offsetHeight}px;`);
            itemScroller.scrollTop = itemScroller.scrollHeight;
        }
    };

    let scrollSticky = (force) => {
        if (canScroll || force) {
            stickyItems.scrollTop = stickyItems.scrollHeight;
        }
    };

    let isSettingsListMatch = (list, text) => {
        let settingsList = settingsData[list];
        let match;
        if (settingsList.text.raw) {
            match =  !!new RegExp(settingsList.text.escaped).exec(text);
        } else if (settingsList.regex.raw) {
            match =  !!new RegExp(settingsList.regex.escaped, settingsList.regex.flags).exec(text);
        } else {
            return false;
        }

        return list === 'whitelist' ? !match : match;
    };

    let isSpecial = (author) => {
        let name = author.innerText || author.content.author.name;
        if (isSettingsListMatch('blacklist', name)) {
            return false;
        } else if (isSettingsListMatch('whitelist', name)) {
            return false;
        } else if (settingsData.moderator) {
            return author.classList ? (author.classList.contains('moderator') || author.classList.contains('owner')) : author.content.author.classes.indexOf('moderator') > -1;
        } else if (settingsData.owner) {
            return author.classList ? author.classList.contains('owner') : author.content.author.classes.indexOf('owner') > -1;
        }
        return true;
    };

    let isUnique = (node) => {
        return !stickyItemObjectsMap[`${node.querySelector('#timestamp').innerText}-${node.querySelector('#author-name').innerText}-${node.querySelector('#message').innerText}`];
    };

    let reachedLocalStorageWarningLimit = () => {
        return getLocalStorageUsage() / 5 >= 0.9;
    };

    let showSavedStickyNotice = (error) => {
        if (notice.style.display === 'none' && (!notice.touched || (notice.touched && error && notice.type === 'warn')) && (error || reachedLocalStorageWarningLimit())) {
            let tooltip = notice.querySelector('#tooltip');
            let text = notice.querySelector('#text');
            let detailsText = notice.querySelector('#details-text');
            if (error) {
                notice.type = 'error';
                tooltip.classList.add('error');
                text.innerText = 'Sticky history limit reached.';
                detailsText.innerText = 'Sticky messages will be tracked but not saved until space is available. Delete sticky histories to free up space and resume saving sticky messages.';
            } else {
                notice.type = 'warn';
                tooltip.classList.remove('error');
                text.innerText = 'Sticky history limit nearing.';
                detailsText.innerText = 'Sticky messages will be tracked but not saved upon reaching the limit. Delete sticky histories to free up space.';
            }
            notice.style.display = 'initial';
            notice.querySelector('tp-yt-iron-dropdown').style.display = 'initial';
        }
    };

    let saveStickyItem = (stickyItem) => {
        let stickyItemObject = {
            authorPhoto: {
                img: {
                    src: stickyItem.querySelector('#img').getAttribute('src')
                }
            },
            content: {
                timestamp: stickyItem.querySelector('.timestamp').innerText,
                author: {
                    classes: stickyItem.querySelector('.author-name').getAttribute('class').replace('author-name ', ''),
                    name: stickyItem.querySelector('.author-name').innerText
                },
                message: Array.from(stickyItem.querySelector('#message').childNodes).reduce((result, node) => {
                    if (node.nodeName === '#text') {
                        result.push({
                            type: 'text',
                            value: node.data
                        });
                    } else if (node.nodeName === 'IMG') {
                        result.push({
                            type: 'image',
                            value: {
                                alt: node.alt,
                                src: node.src
                            }
                        });
                    } else if (node.nodeName === 'A') {
                        result.push({
                            type: 'link',
                            value: {
                                href: node.href,
                                text: node.innerText
                            }
                        });
                    }
                    return result;
                }, [])
            }
        };
        stickyItemObjects.push(stickyItemObject);

        try {
            localStorage.setItem(`youtubespecialcommentsticker-sticky-items-${CHAT_ID}`, JSON.stringify(stickyItemObjects));
            showSavedStickyNotice();
        } catch (e) {
            showSavedStickyNotice(e);
        }
    };

    let stickItem = (node) => {
        let authorElement = node.querySelector('#author-name');
        if (authorElement && isSpecial(authorElement) && isUnique(node)) {
            let stickyItem = document.createElement('div');
            let authorPhoto = document.createElement('div');
            let content = document.createElement('div');
            let timestamp = document.createElement('span');
            let author = document.createElement('div');
            let authorName = document.createElement('span');
            content.id = 'content';
            stickyItem.classList.add('sticky-item');
            content.classList.add('style-scope', 'yt-live-chat-text-message-renderer');
            timestamp.classList.add('timestamp');
            author.classList.add('author');
            authorName.classList.add('author-name');
            authorElement.classList.contains('moderator') ? authorName.classList.add('moderator') : null;
            authorElement.classList.contains('owner') ? authorName.classList.add('moderator', 'owner') : null;
            authorPhoto.innerHTML = node.querySelector('#author-photo').outerHTML.replace(/(\<|\/)(yt\-img\-shadow)/g, '$1div');
            timestamp.innerText = node.querySelector('#timestamp').innerText;
            authorName.innerText = authorElement.innerText;
            author.append(authorName);
            content.append(timestamp);
            content.append(author);
            content.append(node.querySelector('#message').cloneNode(true));
            stickyItem.append(authorPhoto.firstChild);
            stickyItem.append(content);
            stickyItems.append(stickyItem);

            showSticky();
            scrollSticky();
            saveStickyItem(stickyItem);
        }
    };

    let monitor = () => {
        let chatItems = document.querySelector('#items.style-scope.yt-live-chat-item-list-renderer');
        let observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach(stickItem);
            });
        });
        chatItems.querySelectorAll('yt-live-chat-text-message-renderer').forEach(stickItem);
        observer.observe(chatItems, { childList: true });
    };

    let setUpCss = () => {
        let style = document.createElement('style');
        document.head.appendChild(style);
        style.sheet.insertRule('#sticky {position: relative;}');
        style.sheet.insertRule('#sticky #menu.sticky-panel #contentWrapper, #sticky #menu.sticky-panel #contentWrapper #items {outline: none;}');
        style.sheet.insertRule('#sticky #menu.sticky-panel #items ytd-menu-service-item-renderer {cursor: pointer;}');
        style.sheet.insertRule('#sticky #menu.sticky-panel #items ytd-menu-service-item-renderer tp-yt-paper-item:hover, #sticky #menu.sticky-panel #items ytd-menu-service-item-renderer tp-yt-paper-item:focus:before {background-color: var(--yt-spec-10-percent-layer);}');
        style.sheet.insertRule('#sticky #overflow, #sticky #history-button {position: absolute; top: 3px; visibility: visible; padding: 0; z-index: 1; height: 25px; width: 25px;}');
        style.sheet.insertRule('#sticky #overflow {right: 16px;}');
        style.sheet.insertRule('#sticky #history-button {right: 46px;}');
        style.sheet.insertRule('#sticky #history ytd-menu-popup-renderer #items {max-height: 526px; width: 384px; padding: 0px 0px 8px 0px; overflow: hidden auto; outline: none;}');
        style.sheet.insertRule('#sticky #history ytd-menu-popup-renderer #items #history-data {position: sticky; top: 0; z-index: 1; flex-direction: row; justify-content: space-between; align-items: center; padding-top: 8px; background-color: var(--yt-spec-brand-background-primary); outline: none;}');
        style.sheet.insertRule('#sticky #history ytd-menu-popup-renderer #items .history-item-header {display: flex; flex-direction: row;}');
        style.sheet.insertRule('#sticky #history ytd-menu-popup-renderer #items .history-item-header tp-yt-paper-item {padding: 0px 0px 0px 16px;}');
        style.sheet.insertRule('#sticky #history ytd-menu-popup-renderer #items .history-item-chat {border-top: #e0e0e0 solid 1px;}');
        style.sheet.insertRule('#sticky #history ytd-menu-popup-renderer #items .history-item-edit yt-live-chat-text-input-field-renderer {max-width: 66px}');
        style.sheet.insertRule('#sticky #history ytd-menu-popup-renderer #items .history-item-edit yt-live-chat-text-input-field-renderer #input {max-height: 18px; overflow-y: hidden;}');
        style.sheet.insertRule('#sticky #history ytd-menu-popup-renderer #items tp-yt-paper-button {line-height: initial; padding: 5px 11px 5px 11px;}');
        style.sheet.insertRule('#sticky #history ytd-menu-popup-renderer #items tp-yt-paper-button.history-control-button {padding: 0px; min-width: 26px;}');
        style.sheet.insertRule('#sticky #history ytd-menu-popup-renderer #items tp-yt-paper-button.history-affirmative-button yt-icon {padding: 1px;}');
        style.sheet.insertRule('#sticky .sticky-panel {outline: none; position: absolute; z-index: 1; right: 8px; top: 30px;}');
        style.sheet.insertRule('#sticky .sticky-panel #items {padding: 8px 0px;}');
        style.sheet.insertRule('#sticky .sticky-panel #items ytd-menu-service-item-renderer {cursor: default;}');
        style.sheet.insertRule('#sticky .sticky-panel tp-yt-paper-item.disabled {opacity: 0.5;}');
        style.sheet.insertRule('#sticky .sticky-panel tp-yt-paper-item.disabled yt-live-chat-text-input-field-renderer #input {visibility: hidden;}');
        style.sheet.insertRule('#sticky .sticky-panel tp-yt-paper-item {padding: 0px 16px;}');
        style.sheet.insertRule('#sticky .sticky-panel tp-yt-paper-item:hover, #sticky .sticky-panel tp-yt-paper-item:focus:before {background-color: transparent;}');
        style.sheet.insertRule('#sticky .sticky-panel tp-yt-paper-item yt-formatted-string {user-select: none; margin-right: inherit;}');
        style.sheet.insertRule('#sticky .sticky-panel tp-yt-paper-item yt-live-chat-text-input-field-renderer {width: 180px; color: var(--yt-live-chat-primary-text-color);}');
        style.sheet.insertRule('#sticky .sticky-panel #blacklist yt-formatted-string, #sticky .sticky-panel #whitelist yt-formatted-string {width: 60px;}');
        style.sheet.insertRule('#sticky .sticky-panel #types, #sticky .sticky-panel #controls {align-items: flex-end;}');
        style.sheet.insertRule('#sticky .sticky-panel #controls tp-yt-paper-button {line-height: initial; padding: 5px 11px 5px 11px;}');
        style.sheet.insertRule('#sticky .sticky-panel #controls #cancel tp-yt-paper-button {padding: 4px 11px 4px 11px;}');
        style.sheet.insertRule('#sticky .sticky-panel #toggle {display: flex; flex-direction: row; align-items: center; cursor: pointer;}');
        style.sheet.insertRule('#sticky .sticky-panel #toggle[checked]:not([disabled]) .toggle-bar.paper-toggle-button {opacity: 0.5; background-color: var(--paper-toggle-button-checked-bar-color, var(--primary-color));}');
        style.sheet.insertRule('#sticky .sticky-panel #toggle[checked]:not([disabled]) .toggle-button.paper-toggle-button {background-color: var(--paper-toggle-button-checked-button-color, var(--primary-color));}');
        style.sheet.insertRule('#sticky .sticky-panel #toggle[checked] .toggle-button.paper-toggle-button {transform: translate(16px, 0);}');
        style.sheet.insertRule('#sticky .sticky-panel #toggle .toggle-container.paper-toggle-button {display: inline-block; position: relative; width: 36px; height: 14px; margin: 4px 1px;}');
        style.sheet.insertRule('#sticky .sticky-panel #toggle .toggle-bar.paper-toggle-button {position: absolute; height: 100%; width: 100%; border-radius: 8px; pointer-events: none; opacity: 0.4; transition: background-color linear .08s; background-color: var(--paper-toggle-button-unchecked-bar-color, #000000);}');
        style.sheet.insertRule('#sticky .sticky-panel #toggle .toggle-button.paper-toggle-button {position: absolute; top: -3px; left: 0; right: auto; height: 20px; width: 20px; border-radius: 50%; box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.6); transition: transform linear .08s, background-color linear .08s; will-change: transform; background-color: var(--paper-toggle-button-unchecked-button-color, var(--paper-grey-50));}');
        style.sheet.insertRule('#sticky #settings.sticky-panel tp-yt-paper-item > *:not(:first-child):not(:nth-child(2)) {margin-left: 5px;}');
        style.sheet.insertRule('#sticky #show-hide-button {border-bottom: #e0e0e0 solid 1px; font-size: 11px;}');
        style.sheet.insertRule('#sticky #show-hide-button div {font-size: 11px;}');
        style.sheet.insertRule('#sticky #show-hide-button div a {color: #11111199; display: flex;}');
        style.sheet.insertRule('#sticky #show-hide-button div a:hover {color: #030303;}');
        style.sheet.insertRule('#sticky #show-hide-button div a #button {border-radius: 0; margin: 0; padding: 8px 24px; width: 100%;}');
        style.sheet.insertRule('#sticky #show-hide-button div a #button #text {font-weight: 500;}');
        style.sheet.insertRule('#sticky #chat-header {box-sizing: border-box; display: flex; border-bottom: #e0e0e0 solid 1px; background-color: #fffffffa; height: 150px; padding: 0 0 0 4px; transition: all .15s cubic-bezier(0.0, 0.0, 0.2, 1);}');
        style.sheet.insertRule('#sticky yt-icon-button {z-index: 0; transition: all .15s cubic-bezier(0.0, 0.0, 0.2, 1); visibility: hidden;}');
        style.sheet.insertRule('#sticky #primary-content {height: inherit; overflow-x: hidden;}');
        style.sheet.insertRule('#sticky #primary-content::-webkit-scrollbar, #sticky #history #items::-webkit-scrollbar {content: "";}');
        style.sheet.insertRule('#sticky #primary-content::-webkit-scrollbar-track, #sticky #history #items::-webkit-scrollbar-track {background-color: #f1f1f1;}');
        style.sheet.insertRule('#sticky #primary-content::-webkit-scrollbar-thumb, #sticky #history #items::-webkit-scrollbar-thumb {border: 2px solid #f1f1f1; min-height: 30px;}');
        style.sheet.insertRule('#sticky #primary-content .sticky-item {padding: 4px; font-size: 13px; display: flex;}');
        style.sheet.insertRule('#sticky #primary-content .sticky-item #author-photo {display: inline-table; align-self: center;}');
        style.sheet.insertRule('#sticky #primary-content .sticky-item #img {max-width: inherit;}');
        style.sheet.insertRule('#sticky #primary-content .timestamp {display: inline; color: #11111166; font-size: 11px; margin-right: 8px;}');
        style.sheet.insertRule('#sticky #primary-content .author {display: inline-flex; margin-right: 8px;}');
        style.sheet.insertRule('#sticky #primary-content .author .author-name {color: #11111199; font-weight: 500;}');
        style.sheet.insertRule('#sticky #primary-content .author .author-name.moderator {color: #5f84f1;}');
        style.sheet.insertRule('#sticky #primary-content .author .author-name.moderator.owner {color: #000000de; background-color: #ffd600; padding: 2px 4px; border-radius: 2px;}');
        style.sheet.insertRule('#sticky #primary-content #message {display: inline; line-height: 17px;}');
        style.sheet.insertRule('#sticky #notice yt-tooltip-renderer.error {color: #ffffff; background-color: var(--yt-spec-brand-button-background);}');
        style.sheet.insertRule('#sticky #notice yt-tooltip-renderer.error::before {border-color: transparent transparent var(--yt-spec-brand-button-background) transparent;}');
        style.sheet.insertRule('#sticky.dark #history ytd-menu-popup-renderer #items .history-item-chat {border-color: #303030;}');
        style.sheet.insertRule('#sticky.dark #show-hide-button {border-color: #303030; background-color: #181818;}');
        style.sheet.insertRule('#sticky.dark #show-hide-button div a {color: #ffffffb3;}');
        style.sheet.insertRule('#sticky.dark #show-hide-button div a:hover {color: #ffffff;}');
        style.sheet.insertRule('#sticky.dark #chat-header {border-color: #303030; background-color: #202020;}');
        style.sheet.insertRule('#sticky.dark #primary-content::-webkit-scrollbar-track, #sticky.dark #history #items::-webkit-scrollbar-track {background-color: #0f0f0f;}');
        style.sheet.insertRule('#sticky.dark #primary-content::-webkit-scrollbar-thumb, #sticky.dark #history #items::-webkit-scrollbar-thumb {background-color: hsla(0, 0%, 53.3%, .2); border-color: #0f0f0f;');
        style.sheet.insertRule('#sticky.dark #primary-content .timestamp {color: #ffffff8a;}');
        style.sheet.insertRule('#sticky.dark #primary-content .author .author-name {color: #ffffffb3;}');
        style.sheet.insertRule('#sticky.dark #primary-content .author .author-name.moderator {color: #5e84f1;}');
        style.sheet.insertRule('#sticky.dark #primary-content .author .author-name.moderator.owner {color: #111111;}');
        style.sheet.insertRule('#sticky.hide-timestamps #primary-content .timestamp {display: none;}');
    };

    let setUpMenu = () => {
        menu.querySelector('#contentWrapper').innerHTML = '<ytd-menu-popup-renderer slot="dropdown-content" class="style-scope yt-live-chat-app" tabindex="0" use-icons="" style="outline: none; box-sizing: border-box; max-width: 212.063px; max-height: 88px;"><tp-yt-paper-listbox id="items" class="style-scope ytd-menu-popup-renderer" role="listbox" tabindex="0"></tp-yt-paper-listbox></ytd-menu-popup-renderer>';
        let items = menu.querySelector('#items');
        items.innerHTML = `<ytd-menu-service-item-renderer id="menu-settings" class="style-scope ytd-menu-popup-renderer" role="menuitem" use-icons="" tabindex="0" aria-selected="false" data='{"text": {"runs": [{"text":"Settings"}]}, "icon": {"iconType": "TUNE"}, "serviceEndpoint": {}}'></ytd-menu-service-item-renderer>`;
        items.innerHTML += `<ytd-menu-service-item-renderer id="menu-history" class="style-scope ytd-menu-popup-renderer" role="menuitem" use-icons="" tabindex="0" aria-selected="false" data='{"text": {"runs": [{"text":"History"}]}, "icon": {"iconType": "CLARIFY"}, "serviceEndpoint": {}}'></ytd-menu-service-item-renderer>`;
        settingsButton = sticky.querySelector('#menu-settings');
        historyButton = sticky.querySelector('#menu-history');
    };

    let resetHistoryMenu = () => {
        history.querySelectorAll('ytd-menu-service-item-renderer').forEach(historyItem => historyItem.remove());
    };

    let selectAllHistories = () => {
        let selector = history.querySelector('#history-select-all').hasAttribute('checked') ? ':not([checked])' : '[checked]';
        history.querySelectorAll(`.history-item-checkbox${selector}`).forEach((checkbox) => checkbox.click());
    };

    let toggleDeleteHistoriesModal = (event) => {
        let historyDeleteModal = history.querySelector('#history-delete-confirm');
        let historyItems = history.querySelectorAll('.history-item');
        let historySelectAll = history.querySelector('#history-select-all');
        let historyDeleteButton = history.querySelector('#history-delete-button');
        let historyExportButton = history.querySelector('#history-export-button');
        let historyImport = history.querySelector('#history-import');
        let historyStorageUsage = history.querySelector('#history-storage-usage');
        let visible = Number(historyDeleteModal.style.opacity);
        historyDeleteModal.style.opacity = visible ? 0 : 1;
        historyDeleteModal.style.zIndex = visible ? -1 : 1;
        historyDeleteModal.style.pointerEvents = visible ? 'none' : 'initial';
        historySelectAll.style.display = visible ? 'initial' : 'none';
        historyDeleteButton.style.opacity = event && event.currentTarget.id === 'cancel' ? 1 : 0;
        historyDeleteButton.style.position = event && event.currentTarget.id === 'cancel' ? 'initial' : 'absolute';
        historyDeleteButton.style.pointerEvents = event && event.currentTarget.id === 'cancel' ? 'initial' : 'none';
        historyExportButton.style.opacity = event && event.currentTarget.id === 'cancel' ? 1 : 0;
        historyExportButton.style.position = event && event.currentTarget.id === 'cancel' ? 'initial' : 'absolute';
        historyExportButton.style.pointerEvents = event && event.currentTarget.id === 'cancel' ? 'initial' : 'none';
        historyImport.style.opacity = !event ? 1 : 0;
        historyImport.style.pointerEvents = !event ? 'inherit' : 'none';
        historyImport.style.position = !event ? 'relative' : 'absolute';
        historyStorageUsage.style.opacity = visible ? 1 : 0;
        historyItems.forEach(historyItem => historyItem.style.display = visible ? 'inherit' : 'none');
    };

    let exportHistoryItems = () => {
        let savedStickyIndex = getSavedStickyIndex();
        let historyItemsToExport = Object.keys(historiesSelected).map((key) => {
            let savedStickyIndexDetails = savedStickyIndex[key] || {
                author: 'Unknown',
                icon: 'https://yt3.ggpht.com/a/default-user=s32-c-k-c0x00ffffff-no-rj',
                id: null,
                title: 'Click here or visit the associated video with chat enabled to update history information.',
                valid: false
            };
            return { ...savedStickyIndexDetails, items: { id: key, messages: getHistory(key) } };
        });
        navigator.clipboard.writeText(JSON.stringify(historyItemsToExport, null, 2)).then(() => {
            let historyExportButtonIcon = history.querySelector('#history-export-button yt-icon');
            historyExportButtonIcon.setAttribute('icon', 'check');
            setTimeout(() => historyExportButtonIcon.setAttribute('icon', 'offline_download'), 1000);
        });
    };

    let handleNoHistories = () => {
        let histories = getHistories();
        if (!histories.length) {
            history.querySelector('#history-data').style.flexDirection = 'column-reverse';
            history.querySelector('#history-delete-controls').style.display = 'none';
            history.querySelector('#history-import').style.marginLeft = 'initial';
            history.querySelector('#history-import #input').style.width = '';
            history.querySelector('#history-data-container').style.display = 'none';
            history.querySelector('#history-delete-confirm').style.pointerEvents = 'none';
            history.querySelector('#history-none').style.display = 'flex';
        }
    };

    let handleHistoryNotice = () => {
        if (notice.touched && !reachedLocalStorageWarningLimit()) {
            notice.touched = false;
        }
    };

    let deleteHistories = () => {
        Object.keys(historiesSelected).forEach((key) => {
            localStorage.removeItem(`youtubespecialcommentsticker-sticky-items-${key}`);
            history.querySelector(`#${key}`).remove();
            delete historiesSelected[key];
        });
        history.querySelector('#history-storage-usage').innerText = getLocalStorageUsageText();
        toggleDeleteHistoriesModal();
        handleNoHistories();
        handleHistoryNotice();
    };

    let isValidHistoryItemImport = (historyItem) => {
        return ['author', 'icon', 'id', 'title', 'valid', 'items'].every((property) => property in historyItem);
    };

    let reportInvalidHistoryItemImport = () => {
        let historyImportButtonIcon = history.querySelector('#history-import yt-icon');
        let historyImportInput = history.querySelector('#history-import #input');
        historyImportButtonIcon.setAttribute('icon', 'close');
        setTimeout(() => historyImportButtonIcon.setAttribute('icon', 'upload'), 1000);
        if (Number(historyImportInput.style.opacity)) {
            hideShowHistoryImportControls();
        }
        history.removeAttribute('importing');
    };

    let importHistoryItem = (savedStickyIndex, historyItem) => {
        if (isValidHistoryItemImport(historyItem)) {
            let historyItemsId = `youtubespecialcommentsticker-sticky-items-${historyItem.items.id}`;
            savedStickyIndex[historyItem.items.id] = {
                author: historyItem.author,
                icon: historyItem.icon,
                id: historyItem.id,
                title: historyItem.title,
                valid: historyItem.valid
            };
            localStorage.setItem('youtubespecialcommentsticker-sticky-index', JSON.stringify(savedStickyIndex));
            if (!localStorage.getItem(historyItemsId)) {
                localStorage.setItem(historyItemsId, JSON.stringify(historyItem.items.messages));
            }
        } else {
            reportInvalidHistoryItemImport();
        }
    };

    let importHistoryItems = (text) => {
        try {
            let historyItems = JSON.parse(text);
            let savedStickyIndex = getSavedStickyIndex();
            if (Array.isArray(historyItems)) {
                historyItems.forEach(historyItem => importHistoryItem(savedStickyIndex, historyItem));
            } else {
                importHistoryItem(savedStickyIndex, historyItems);
            }
            refreshHistory();
            history.removeAttribute('importing');
            history.focus();
        } catch (error) {
            reportInvalidHistoryItemImport();
        }
    };

    let hideShowHistoryImportControls = () => {
        let historyImportButton = history.querySelector('#history-import #history-import-button');
        let historyImportInput = history.querySelector('#history-import yt-live-chat-text-input-field-renderer');
        let historyImportInputButton = history.querySelector('#history-import #cancel');
        let historyOtherHistoryHeaderItems = history.querySelectorAll('#history-data tp-yt-paper-item:not(#history-import):not(#history-none)');
        let historyHistoryItems = history.querySelectorAll('.history-item');
        let visible = historyImportButton.style.opacity === '' || Number(historyImportButton.style.opacity);
        historyImportButton.style.opacity = visible ? 0 : 1;
        historyImportButton.style.pointerEvents = visible ? 'none' : 'inherit';
        historyImportButton.style.position = visible ? 'absolute' : 'initial';
        historyImportInput.style.opacity = visible ? 1 : 0;
        historyImportInput.style.pointerEvents = visible ? 'inherit' : 'none';
        historyImportInput.style.position = visible ? 'inherit' : 'absolute';
        historyImportInputButton.style.opacity = visible ? 1 : 0;
        historyImportInputButton.style.pointerEvents = visible ? 'inherit' : 'none';
        historyImportInputButton.style.position = visible ? 'inherit' : 'absolute';
        if (visible) {
            historyImportInput.removeAttribute('has-text');
            historyImportInput.querySelector('#input').innerText = '';
        }
        [...historyOtherHistoryHeaderItems, ...historyHistoryItems].forEach((element) => {
            element.style.opacity = visible ? 0.5 : 1;
            element.style.pointerEvents = visible ? 'none' : 'initial';
        });
    };

    let handleHistoryItemsImport = () => {
        history.setAttribute('importing', '');
        if (navigator.clipboard.readText) {
            navigator.clipboard.readText().then(importHistoryItems, reportInvalidHistoryItemImport);
        } else {
            hideShowHistoryImportControls();
        }
    };

    let handleHistoryImportInputPaste = (event) => {
        handlePaste(event.currentTarget);
        importHistoryItems(event.currentTarget.innerText);
    };

    let handleHistoryImportInputKeyUp = (event) => {
        if (event.currentTarget.innerText) {
            event.currentTarget.parentElement.setAttribute('has-text', '');
        } else {
            event.currentTarget.parentElement.removeAttribute('has-text');
        }
    };

    let handleHistoryImportInputButton = () => {
        hideShowHistoryImportControls();
        history.removeAttribute('importing');
    };

    let getObjectSize = (data) => {
        return new Blob(data).size / 1024 / 1024;
    };

    let getLocalStorageUsage = () => {
        return getObjectSize(Object.values(localStorage));
    };

    let getLocalStorageUsageText = () => {
        return `${(getLocalStorageUsage()).toFixed(2)} MB / 5 MB`;
    };

    let setUpHistoryHeader = () => {
        let histories = getHistories();
        let items = history.querySelector('#items');
        let itemsTemp = document.createElement('div');
        items.parentNode.insertBefore(itemsTemp, items);

        itemsTemp.innerHTML = `<ytd-menu-service-item-renderer id="history-data" class="style-scope ytd-menu-popup-renderer" role="menuitem" tabindex="-1" aria-selected="false" data='{"serviceEndpoint": {}}'></ytd-menu-service-item-renderer>`;
        let historyItem = itemsTemp.querySelector('#history-data');
        historyItem.querySelector('tp-yt-paper-item').remove();

        let historyDeleteControls = document.createElement('tp-yt-paper-item');
        historyItem.appendChild(historyDeleteControls);
        historyDeleteControls.id = 'history-delete-controls';
        historyDeleteControls.innerHTML = '<ytd-button-renderer id="history-delete-button" class="style-scope ytd-video-secondary-info-renderer style-destructive size-default" style="opacity: 0; pointer-events: none; position: absolute; margin-right: 16px;" button-renderer="" use-keyboard-focused="" is-paper-button-with-icon="" is-paper-button=""></ytd-button-renderer>';
        let historyDeleteButton = historyDeleteControls.querySelector('#history-delete-button');
        historyDeleteButton.innerHTML = '<tp-yt-paper-button id="button" class="style-scope ytd-button-renderer style-suggestive size-small history-control-button history-affirmative-button" role="button" tabindex="0" animated="" elevation="0" aria-disabled="false" aria-label="Sign in" title="Delete"><yt-icon icon="delete" class="style-scope yt-live-chat-header-renderer"></yt-icon></tp-yt-paper-button>';
        historyDeleteButton.onclick = toggleDeleteHistoriesModal;

        let historyExportButton = historyDeleteButton.cloneNode(true);
        historyDeleteControls.appendChild(historyExportButton);
        historyExportButton.id = 'history-export-button';
        historyExportButton.style.margin = 0;
        historyExportButton.innerHTML = '<tp-yt-paper-button id="button" class="style-scope ytd-button-renderer style-suggestive size-small history-control-button history-affirmative-button" role="button" tabindex="0" animated="" elevation="0" aria-disabled="false" aria-label="Sign in" title="Export"><yt-icon icon="offline_download" class="style-scope yt-live-chat-header-renderer"></yt-icon></tp-yt-paper-button>';
        historyExportButton.onclick = exportHistoryItems;

        let historySelectAll = document.createElement('tp-yt-paper-checkbox');
        historyDeleteControls.insertBefore(historySelectAll, historyDeleteButton);
        historySelectAll.id = 'history-select-all';
        historySelectAll.style.setProperty('--paper-checkbox-ink-size', '32px');
        historySelectAll.style.paddingRight = '16px';
        historySelectAll.onclick = selectAllHistories;
        let historySelectAllLabel = historySelectAll.querySelector('#checkboxLabel');
        historySelectAllLabel.style.setProperty('font-size', 'var(--ytd-user-comment_-_font-size)');
        historySelectAllLabel.style.userSelect = 'none';
        historySelectAllLabel.innerText = 'Select All';

        let historyImportContainer = document.createElement('tp-yt-paper-item');
        historyItem.appendChild(historyImportContainer);
        historyImportContainer.id = 'history-import';
        historyImportContainer.style.padding = 0;
        historyImportContainer.style.marginLeft = 'auto';
        historyImportContainer.innerHTML = '<ytd-button-renderer id="history-import-button" class="style-scope ytd-video-secondary-info-renderer style-destructive size-default" button-renderer="" use-keyboard-focused="" is-paper-button-with-icon="" is-paper-button=""></ytd-button-renderer>';
        historyImportContainer.innerHTML += `<yt-live-chat-text-input-field-renderer id="input" class="style-scope yt-live-chat-message-input-renderer" disabled="" emoji-manager='{"emojiShortcutMap": {}}' title="Paste history data." style="width: 85px;"></yt-live-chat-text-input-field-renderer>`;
        historyImportContainer.innerHTML += '<ytd-button-renderer id="cancel" class="style-scope ytd-masthead style-suggestive size-small" button-renderer="" use-keyboard-focused="" is-paper-button-with-icon="" is-paper-button="" style="padding-left: 4px;"></ytd-button-renderer>';
        let historyImportButton = historyImportContainer.querySelector('#history-import-button');
        historyImportButton.innerHTML = '<tp-yt-paper-button id="button" class="style-scope ytd-button-renderer style-suggestive size-small history-control-button history-affirmative-button" role="button" tabindex="0" animated="" elevation="0" aria-disabled="false" aria-label="Sign in" title="Import"><yt-icon icon="upload" class="style-scope yt-live-chat-header-renderer"></yt-icon></tp-yt-paper-button>';
        historyImportButton.onclick = handleHistoryItemsImport;
        let historyImportInput = historyImportContainer.querySelector('yt-live-chat-text-input-field-renderer');
        historyImportInput.style.opacity = 0;
        historyImportInput.style.pointerEvents = 'none';
        historyImportInput.style.position = 'absolute';
        historyImportInput.style.userSelect = 'none';
        let historyImportInputLabel = historyImportInput.querySelector('#label');
        historyImportInputLabel.style.overflowX = 'hidden';
        historyImportInputLabel.style.textOverflow = 'ellipsis';
        historyImportInputLabel.style.width = 'inherit';
        historyImportInputLabel.innerText = historyImportInput.title;
        let historyImportInputInput = historyImportInput.querySelector('#input');
        historyImportInputInput.style.maxHeight = '24px';
        historyImportInputInput.onpaste = handleHistoryImportInputPaste;
        historyImportInputInput.onkeyup = handleHistoryImportInputKeyUp;
        let historyImportInputButton = historyImportContainer.querySelector('#cancel');
        historyImportInputButton.style.opacity = 0;
        historyImportInputButton.style.pointerEvents = 'none';
        historyImportInputButton.style.position = 'absolute';
        historyImportInputButton.innerHTML = '<tp-yt-paper-button id="button" class="style-scope ytd-button-renderer style-suggestive size-small history-control-button" role="button" tabindex="0" animated="" elevation="0" aria-disabled="false" aria-label="Sign in" title="Cancel"><yt-icon icon="close" class="style-scope yt-live-chat-header-renderer"></yt-icon></tp-yt-paper-button>';
        historyImportInputButton.onclick = handleHistoryImportInputButton;

        let historyData = document.createElement('tp-yt-paper-item');
        historyItem.appendChild(historyData);
        historyData.id = 'history-data-container';
        historyData.innerHTML = '<yt-formatted-string id="history-storage-usage" class="style-scope ytd-menu-service-item-renderer" title="Local Storage Space Used/Capacity"></yt-formatted-string>';
        historyData.querySelector('yt-formatted-string').innerText = getLocalStorageUsageText();
        historyData.querySelector('yt-formatted-string').removeAttribute('is-empty');
        historyItem.appendChild(historyData);
        historyItem.remove();
        items.appendChild(historyItem);

        itemsTemp.innerHTML = `<ytd-menu-service-item-renderer id="history-delete-confirm" class="style-scope ytd-menu-popup-renderer" role="menuitem" tabindex="-1" aria-selected="false" data='{"serviceEndpoint": {}}'></ytd-menu-service-item-renderer>`;
        let historyDeleteModal = itemsTemp.querySelector('#history-delete-confirm');
        historyDeleteModal.style.opacity = 0;
        historyDeleteModal.style.position = 'absolute';
        historyDeleteModal.style.zIndex = -1;
        historyDeleteModal.style.width = '384px';
        historyDeleteModal.style.pointerEvents = 'none';
        let historyDeleteModalContainer = historyDeleteModal.querySelector('tp-yt-paper-item');
        historyDeleteModalContainer.querySelector('yt-icon').remove()
        historyDeleteModalContainer.querySelector('yt-formatted-string').remove()
        historyDeleteModalContainer.style.alignItems = 'center';
        historyDeleteModalContainer.style.justifyContent = 'space-evenly';
        historyDeleteModalContainer.innerHTML += '<ytd-button-renderer id="cancel" class="style-scope ytd-masthead style-suggestive size-small" button-renderer="" use-keyboard-focused="" is-paper-button-with-icon="" is-paper-button=""></ytd-button-renderer>';
        historyDeleteModalContainer.innerHTML += '<ytd-button-renderer id="delete" class="style-scope ytd-video-secondary-info-renderer style-destructive size-default" button-renderer="" use-keyboard-focused="" is-paper-button-with-icon="" is-paper-button=""></ytd-button-renderer>';
        let historyDeleteModalCancel = historyDeleteModalContainer.querySelector('#cancel');
        let historyDeleteModalDelete = historyDeleteModalContainer.querySelector('#delete');
        historyDeleteModalCancel.onclick = toggleDeleteHistoriesModal;
        historyDeleteModalDelete.onclick = deleteHistories;
        historyDeleteModalCancel.innerHTML = '<tp-yt-paper-button id="button" class="style-scope ytd-button-renderer style-suggestive size-small" role="button" tabindex="0" animated="" elevation="0" aria-disabled="false" aria-label="Sign in"><yt-formatted-string id="text" class="style-scope ytd-button-renderer style-suggestive size-small"></yt-formatted-string></tp-yt-paper-button>';
        historyDeleteModalDelete.innerHTML = '<tp-yt-paper-button id="button" class="style-scope ytd-button-renderer style-destructive size-default" role="button" tabindex="0" animated="" elevation="0" aria-disabled="false" aria-label="Subscribe"><yt-formatted-string id="text" class="style-scope ytd-button-renderer style-destructive size-default"></yt-formatted-string></tp-yt-paper-button>';
        historyDeleteModalCancel.querySelector('yt-formatted-string').innerText = 'Cancel';
        historyDeleteModalCancel.querySelector('yt-formatted-string').removeAttribute('is-empty');
        historyDeleteModalDelete.querySelector('yt-formatted-string').innerText = 'Delete';
        historyDeleteModalDelete.querySelector('yt-formatted-string').removeAttribute('is-empty');
        historyDeleteModalCancel.querySelector('tp-yt-paper-button').style.padding = '4px 11px';
        historyDeleteModal.remove();
        historyItem.insertBefore(historyDeleteModal, historyDeleteControls);

        let historyNone = document.createElement('tp-yt-paper-item');
        historyItem.appendChild(historyNone);
        historyNone.id = 'history-none';
        historyNone.style.display = 'none';
        historyNone.innerHTML = '<yt-formatted-string class="style-scope ytd-menu-service-item-renderer"></yt-formatted-string>';
        historyNone.querySelector('yt-formatted-string').innerText = 'No Histories';
        historyNone.querySelector('yt-formatted-string').removeAttribute('is-empty');

        if (!histories.length) {
            historyItem.style.flexDirection = 'column-reverse';
            historyDeleteControls.style.display = 'none';
            historyDeleteModal.style.display = 'none';
            historyImportContainer.style.marginLeft = 'initial';
            historyImportInput.style.width = '';
            historyData.style.display = 'none';
            historyNone.style.display = 'flex';
        }

        itemsTemp.remove();
    };

    let getHistoryRaw = (id) => {
        return localStorage.getItem(`youtubespecialcommentsticker-sticky-items-${id}`);
    };

    let getHistory = (id) => {
        return JSON.parse(getHistoryRaw(id));
    };

    let getHistories = () => {
        return Object.keys(localStorage).filter(key => key.indexOf('youtubespecialcommentsticker-sticky-items-') > -1);
    };

    let getDetailedHistories = () => {
        let index = getSavedStickyIndex();
        let histories = getHistories();
        return histories.map((history) => {
            let id = history.substr(42);
            return {
                id: id,
                details: index[id] || {},
                size: {
                    text: getHistorySizeText(id),
                    title: getHistorySizeTextTitle(id)
                }
            }
        }).sort((history, otherHistory) => {
            if (history.details.author === otherHistory.details.author) {
                return history.size.title < otherHistory.size.title ? 1 : -1;
            } else if (!history.details.author || !otherHistory.details.author) {
                return !history.details.author && !otherHistory.details.author ? 0 : (!history.details.author ? 1 : -1);
            }
            return history.details.author < otherHistory.details.author ? -1 : 1;
        });
    };

    let selectHistory = (event) => {
        let histories = getHistories();
        if (event.currentTarget.hasAttribute('checked')) {
            historiesSelected[event.currentTarget.dataset.id] = true;
        } else {
            delete historiesSelected[event.currentTarget.dataset.id];
        }

        let selectedCount = Object.keys(historiesSelected).length;
        let historyDeleteButton = history.querySelector('#history-delete-button');
        let historyExportButton = history.querySelector('#history-export-button');
        let historyImport = history.querySelector('#history-import');
        historyDeleteButton.style.opacity = selectedCount ? 1 : 0;
        historyDeleteButton.style.pointerEvents = selectedCount ? 'inherit' : 'none';
        historyDeleteButton.style.position = selectedCount ? 'initial' : 'absolute';
        historyExportButton.style.opacity = selectedCount ? 1 : 0;
        historyExportButton.style.pointerEvents = selectedCount ? 'inherit' : 'none';
        historyExportButton.style.position = selectedCount ? 'initial' : 'absolute';
        historyImport.style.opacity = selectedCount ? 0 : 1;
        historyImport.style.pointerEvents = selectedCount ? 'none' : 'inherit';
        historyImport.style.position = selectedCount ? 'absolute' : 'relative';
        if (selectedCount === histories.length) {
            history.querySelector('#history-select-all').setAttribute('active', '');
        } else {
            history.querySelector('#history-select-all').removeAttribute('active');
        }
    };

    let toggleEditHistoryModal = (event) => {
        let historyId = event.currentTarget.dataset.id;
        let historyData = history.querySelectorAll('#history-data > tp-yt-paper-item');
        let historyItem = history.querySelector(`#items #${historyId}`);
        let historyItemEdit = historyItem.querySelector('.history-item-edit');
        let historyItemHeader = historyItem.querySelector('.history-item-header');
        let historyItemHeaderShowHideButton = historyItemHeader.querySelector('yt-icon[icon="collapse"]');
        let historyOtherHistoryItems = history.querySelectorAll(`.history-item:not(#${historyId})`);
        let visible = Number(historyItemEdit.style.opacity);
        if (visible) {
            historyItemEdit.querySelectorAll('yt-live-chat-text-input-field-renderer').forEach((input) => {
                input.removeAttribute('has-text');
                input.querySelector('#input').innerText = '';
            });
            historyItem.removeAttribute('style');
            history.removeAttribute('editing');
        } else {
            history.setAttribute('editing', '');
        }
        if (historyItemHeaderShowHideButton) {
            historyItemHeaderShowHideButton.click();
        }
        [...historyData, ...historyOtherHistoryItems].forEach((element) => {
            if (element.style.opacity !== '0') {
                element.style.opacity = visible ? 1 : 0.5;
                element.style.pointerEvents = visible ? 'initial' : 'none';
            }
        });
        historyItemEdit.style.opacity = visible ? 0 : 1;
        historyItemEdit.style.zIndex = visible ? -1 : 1;
        historyItemEdit.style.position = visible ? 'absolute' : 'initial';
        historyItemHeader.style.height = visible ? 'initial' : '0px';
        historyItemHeader.style.overflow = visible ? 'initial' : 'hidden';
    };

    let refreshHistory = () => {
        history.setAttribute('refreshing', '');
        setUpHistory();
        history.focus();
        history.removeAttribute('refreshing');
    };

    let updateHistoryItem = (event) => {
        let savedStickyIndex = getSavedStickyIndex();
        let historyId = event.currentTarget.dataset.id;
        let historyItem = history.querySelector(`#items #${historyId}`);
        let historyItemEdit = historyItem.querySelector('.history-item-edit');
        let historyItemEditAuthor = historyItemEdit.querySelector('yt-live-chat-text-input-field-renderer.author');
        let historyItemEditIcon = historyItemEdit.querySelector('yt-live-chat-text-input-field-renderer.icon');
        let historyItemEditID = historyItemEdit.querySelector('yt-live-chat-text-input-field-renderer.id');
        let historyItemEditTitle = historyItemEdit.querySelector('yt-live-chat-text-input-field-renderer.title');
        if (savedStickyIndex[historyId]) {
            savedStickyIndex[historyId] = {
                author: historyItemEditAuthor.innerText,
                icon: historyItemEditIcon.innerText.replace(/=s\d+-/, '=s32-'),
                id: historyItemEditID.innerText,
                title: historyItemEditTitle.innerText,
                valid: true
            };
            localStorage.setItem('youtubespecialcommentsticker-sticky-index', JSON.stringify(savedStickyIndex));
        }
        toggleEditHistoryModal(event);
        refreshHistory();
    };

    let handleHistoryEditModalInputPaste = (event) => {
        handlePaste(event.currentTarget);
    };

    let handleHistoryEditModalInputHasText = (event) => {
        if (event.currentTarget.innerText) {
            event.currentTarget.parentElement.setAttribute('has-text', '');
        } else {
            event.currentTarget.parentElement.removeAttribute('has-text');
        }
    };

    let isEditModalInputValid = (input) => {
        let field = input.parentElement.classList[2];
        let required = (input) => !!input.innerText;
        let isIconFormat = (input) => /https:\/\/[a-zA-Z\d]+\.[a-zA-Z\d]+\.com\/[a-zA-Z\d]+\/.+=s\d+-.+/.test(input.innerText);
        let isIdFormat = (input) => /[a-zA-Z0-9_-]{11}/.test(input.innerText);
        return {
            author: [required],
            icon: [required, isIconFormat],
            id: [required, isIdFormat],
            title: [required]
        }[field].every((validation) => validation(input));
    };

    let validateEditModalInput = (event) => {
        let input = event.currentTarget;
        let parent = input.parentElement;
        if (isEditModalInputValid(input)) {
            parent.setAttribute('valid', '');
        } else {
            parent.removeAttribute('valid');
        }
    };

    let validateEditModalForm = (event) => {
        let form = event.currentTarget.parentElement.parentElement;
        let submit = form.querySelector('#submit');
        let valid = [...form.querySelectorAll('yt-live-chat-text-input-field-renderer')].every(input => input.hasAttribute('valid'));
        valid ? submit.removeAttribute('disabled') : submit.setAttribute('disabled', '');
        submit.style.pointerEvents = valid ? 'initial' : 'none';
    };

    let handleHistoryEditModalInputKeyUp = (event) => {
        handleHistoryEditModalInputHasText(event);
        validateEditModalInput(event);
        validateEditModalForm(event);
    };

    let getHistorySizeText = (id) => {
        let historySize = getObjectSize(Object.values(getHistoryRaw(id)));
        return historySize >= 0.01 ? `${historySize.toFixed(2)} MB` : '< 10 KB';
    };

    let getHistorySizeTextTitle = (id) => {
        return `${getObjectSize(Object.values(getHistoryRaw(id))).toFixed(10)} MB`;
    };

    let updateHistorySizeText = (id) => {
        let historySizeText = history.querySelector(`#items #${id} .history-size #${id}`);
        historySizeText.innerText = getHistorySizeText(id);
        historySizeText.title = getHistorySizeTextTitle(id);
    };

    let setHistoryItemsScroll = (historyItemChat) => {
        if (historyItemChat.offsetHeight === 151) {
            let historyItems = history.querySelector('#items');
            let historyItemsRect = historyItems.getBoundingClientRect();
            let historyItemRect = historyItemChat.getBoundingClientRect();
            if (historyItemRect.bottom > historyItemsRect.bottom) {
                historyItems.scrollTop += historyItemRect.bottom - historyItemsRect.bottom + 8;
            }
        } else {
            setTimeout(() => setHistoryItemsScroll(historyItemChat));
        }
    };

    let showHideHistoryItem = (event) => {
        let historyItem = event.currentTarget;
        let historyItemId = historyItem.dataset.id;
        let historyItemIcon = historyItem.querySelector('yt-icon');
        let historyItemChat = history.querySelector(`#${historyItemId} .history-item-chat`);
        let historyItemChatHeader = historyItemChat.querySelector('#chat-header');
        let historyItemChatItems = historyItemChatHeader.querySelector('#primary-content');
        if (!historyItemChat.offsetHeight) {
            let historyItems = getHistory(historyItemId);
            historyItems.forEach((item) => historyItemChatItems.appendChild(getStickyItem(item)));
            historyItemIcon.setAttribute('icon', 'collapse');
            historyItemChat.removeAttribute('style');
            historyItemChatHeader.removeAttribute('style');
            historyItemChatItems.style.height = 'initial';
            setHistoryItemsScroll(historyItemChat);
        } else {
            historyItemChatItems.querySelectorAll('.sticky-item').forEach(historyItemChatItem => historyItemChatItem.remove());
            historyItemIcon.setAttribute('icon', 'expand');
            historyItemChat.style.border = 'none';
            historyItemChatHeader.style.height = '0px';
            historyItemChatHeader.style.border = 'none';
            historyItemChatItems.style.height = '0px';
        }
        updateHistorySizeText(historyItemId);
    };

    let setHistoryItem = (histories, items, itemsTemp) => {
        if (histories.length) {
            let history = histories[0];
            let historyId = history.id;
            let historyDetails = history.details;

            itemsTemp.innerHTML = `<ytd-menu-service-item-renderer id="${historyId}" class="style-scope ytd-menu-popup-renderer history-item" role="menuitem" tabindex="-1" aria-selected="false" data='{"serviceEndpoint": {}}'></ytd-menu-service-item-renderer>`;
            let historyItem = itemsTemp.querySelector(`#${historyId}`);
            historyItem.remove();

            let historyItemHeader = document.createElement('div');
            historyItemHeader.classList.add('history-item-header');
            let historyDelete = document.createElement('tp-yt-paper-item');
            itemsTemp.appendChild(historyDelete);
            historyDelete.remove();

            let historyCheckbox = document.createElement('tp-yt-paper-checkbox');
            historyDelete.append(historyCheckbox);
            historyCheckbox.classList.add('history-item-checkbox');
            historyCheckbox.style.setProperty('--paper-checkbox-ink-size', '32px');
            historyCheckbox.style.width = '20px';
            historyCheckbox.dataset.id = historyId;
            historyCheckbox.onclick = selectHistory;

            let historyIcon = document.createElement('tp-yt-paper-item');
            itemsTemp.appendChild(historyIcon);
            let thumbnail = JSON.stringify({"thumbnails": [{"url": historyDetails.icon || 'https://yt3.ggpht.com/a/default-user=s32-c-k-c0x00ffffff-no-rj', "width": 48, "height": 48}]});
            historyIcon.innerHTML = `<yt-img-shadow id="avatar" class="style-scope ytd-video-owner-renderer no-transition" style="border-radius: 50%; overflow: hidden; width: 32px; user-select: none;" loaded="" thumbnail='${thumbnail}'></yt-img-shadow>`;
            historyIcon.querySelector('img').title = historyDetails.author || 'Unknown';
            historyIcon.remove();

            let historyName = historyItem.querySelector('tp-yt-paper-item');
            historyName.style.overflow = 'hidden';
            let historyNameText = historyName.querySelector('yt-formatted-string');
            historyNameText.style.overflow = 'hidden';
            historyNameText.removeAttribute('is-empty');
            if (historyDetails.valid) {
                let historyNameLink = document.createElement('a');
                historyNameLink.className = 'yt-simple-endpoint style-scope yt-formatted-string';
                historyNameLink.href = `https://www.youtube.com/watch?v=${historyDetails.id}`;
                historyNameLink.innerText = historyDetails.title;
                historyNameLink.style.display = 'block';
                historyNameLink.style.overflow = 'hidden';
                historyNameLink.style.textOverflow = 'ellipsis';
                historyNameText.title = historyNameLink.innerText;
                historyNameText.appendChild(historyNameLink);
            } else {
                historyNameText.innerText = historyDetails.title || 'Click here or visit the associated video with chat enabled to update history information.';
                historyNameText.title = historyNameText.innerText;
                historyNameText.style.textOverflow = 'ellipsis';
                historyNameText.style.cursor = 'pointer';
                historyNameText.dataset.id = historyId;
                historyNameText.onclick = toggleEditHistoryModal;
            }
            historyName.remove();

            let historySize = document.createElement('tp-yt-paper-item');
            itemsTemp.appendChild(historySize);
            historySize.className = 'style-scope ytd-menu-service-item-renderer history-size';
            historySize.style.marginLeft = 'auto';
            let historySizeText = document.createElement('yt-formatted-string');
            historySize.appendChild(historySizeText);
            historySizeText.className = 'style-scope ytd-menu-service-item-renderer';
            historySizeText.id = historyId
            historySizeText.innerText = history.size.text;
            historySizeText.title = history.size.title;
            historySizeText.removeAttribute('is-empty');
            historySize.remove();

            let historyItemShowHide = document.createElement('tp-yt-paper-item');
            historyItemShowHide.style.paddingRight = '16px';
            historyItemShowHide.innerHTML += `<yt-icon-button class="style-scope yt-live-chat-header-renderer" style="visibility: inherit;" data-id="${historyId}"><button id="button" class="style-scope yt-icon-button"><yt-icon icon="expand" class="style-scope yt-live-chat-header-renderer"></yt-icon></button><paper-ripple class="style-scope yt-icon-button circle"><div id="background" class="style-scope paper-ripple"></div><div id="waves" class="style-scope paper-ripple"></div></paper-ripple></button></yt-icon-button>`;
            let historyItemShowHideButton = historyItemShowHide.querySelector('yt-icon-button');
            historyItemShowHideButton.classList.add('history-item-show-hide-button');
            historyItemShowHideButton.onclick = showHideHistoryItem;

            historyItemHeader.appendChild(historyDelete);
            historyItemHeader.appendChild(historyIcon);
            historyItemHeader.appendChild(historyName);
            historyItemHeader.appendChild(historySize);
            historyItemHeader.appendChild(historyItemShowHide);

            if (!historyDetails.valid) {
                let historyEditModal = document.createElement('tp-yt-paper-item');
                historyEditModal.style.opacity = 0;
                historyEditModal.style.justifyContent = 'space-between';
                historyEditModal.style.position = 'absolute';
                historyEditModal.style.zIndex = -1;
                historyEditModal.style.userSelect = 'none';
                historyEditModal.classList.add('history-item-edit');
                itemsTemp.appendChild(historyEditModal);

                [{ id: 'author', title: 'The channel name.' }, { id: 'icon', title: 'The channel icon: Right-Click Channel Icon > Copy Image Address.' }, { id: 'id', title: 'The video ID: https://www.youtube.com/watch?v=<ID>.' }, { id: 'title', title: 'The video title.' }].forEach((input) => {
                    historyEditModal.innerHTML += `<yt-live-chat-text-input-field-renderer id="input" class="style-scope yt-live-chat-message-input-renderer ${input.id}" disabled="" emoji-manager='{"emojiShortcutMap": {}}' title="${input.title}"></yt-live-chat-text-input-field-renderer>`;
                });
                historyEditModal.innerHTML += `<ytd-button-renderer id="cancel" class="style-scope ytd-masthead style-suggestive size-small" button-renderer="" use-keyboard-focused="" is-paper-button-with-icon="" is-paper-button="" data-id="${historyId}"></ytd-button-renderer>`;
                historyEditModal.innerHTML += `<ytd-button-renderer id="submit" class="style-scope ytd-video-secondary-info-renderer style-destructive size-default" button-renderer="" use-keyboard-focused="" is-paper-button-with-icon="" is-paper-button="" data-id="${historyId}" disabled style="pointer-events: none;"></ytd-button-renderer>`;
                let historyEditModalCancel = historyEditModal.querySelector('#cancel');
                let historyEditModalSubmit = historyEditModal.querySelector('#submit');
                historyEditModalCancel.onclick = toggleEditHistoryModal;
                historyEditModalSubmit.onclick = updateHistoryItem;
                historyEditModalCancel.innerHTML = '<tp-yt-paper-button id="button" class="style-scope ytd-button-renderer style-suggestive size-small history-control-button" role="button" tabindex="0" animated="" elevation="0" aria-disabled="false" aria-label="Sign in" title="Cancel"><yt-icon icon="close" class="style-scope yt-live-chat-header-renderer"></yt-icon></tp-yt-paper-button>';
                historyEditModalSubmit.innerHTML = '<tp-yt-paper-button id="button" class="style-scope ytd-button-renderer style-destructive size-default history-control-button history-affirmative-button" role="button" tabindex="0" animated="" elevation="0" aria-disabled="false" aria-label="Subscribe" title="Submit"><yt-icon icon="check" class="style-scope yt-live-chat-header-renderer"></yt-icon></tp-yt-paper-button>';

                let historyEditModalAuthor = historyEditModal.querySelector('.author');
                let historyEditModalIcon = historyEditModal.querySelector('.icon');
                let historyEditModalId = historyEditModal.querySelector('.id');
                let historyEditModalTitle = historyEditModal.querySelector('.title');
                historyEditModalAuthor.querySelector('#label').innerText = 'Author';
                historyEditModalIcon.querySelector('#label').innerText = 'Icon';
                historyEditModalId.querySelector('#label').innerText = 'ID';
                historyEditModalTitle.querySelector('#label').innerText = 'Title';
                historyEditModalAuthor.querySelector('#input').onpaste = handleHistoryEditModalInputPaste;
                historyEditModalIcon.querySelector('#input').onpaste = handleHistoryEditModalInputPaste;
                historyEditModalId.querySelector('#input').onpaste = handleHistoryEditModalInputPaste;
                historyEditModalTitle.querySelector('#input').onpaste = handleHistoryEditModalInputPaste;
                historyEditModalAuthor.querySelector('#input').onkeyup = handleHistoryEditModalInputKeyUp;
                historyEditModalIcon.querySelector('#input').onkeyup = handleHistoryEditModalInputKeyUp;
                historyEditModalId.querySelector('#input').onkeyup = handleHistoryEditModalInputKeyUp;
                historyEditModalTitle.querySelector('#input').onkeyup = handleHistoryEditModalInputKeyUp;
                historyEditModal.remove();

                historyItem.appendChild(historyEditModal);
            }

            let historyItemChat = document.createElement('div');
            historyItemChat.style.border = 'none';
            historyItemChat.classList.add('history-item-chat');
            historyItemChat.innerHTML = '<div id="chat-header" role="heading" class="style-scope yt-live-chat-renderer" style="height: 0px; border: none;"><div id="primary-content" class="style-scope yt-live-chat-header-renderer"></div></div>';
            itemsTemp.appendChild(historyItemChat);

            historyItem.appendChild(historyItemHeader);
            historyItem.appendChild(historyItemChat);
            items.appendChild(historyItem);

            setTimeout(() => setHistoryItem(histories.slice(1), items, itemsTemp));
        } else {
            itemsTemp.remove();
            historiesSelected = {};
            toggleHistoryItems();
        }
    };

    let toggleHistoryItems = () => {
        let items = history.querySelector('#items');
        if (Number(items.style.opacity)) {
            items.removeAttribute('style');
        } else {
            items.style.opacity = 0.5;
            items.style.pointerEvents = 'none';
        }
    };

    let setUpHistoryItems = () => {
        let histories = getDetailedHistories();
        let items = history.querySelector('#items');
        let itemsTemp = document.createElement('div');
        itemsTemp.style.position = 'absolute';
        items.parentNode.insertBefore(itemsTemp, items);
        toggleHistoryItems();

        setTimeout(() => setHistoryItem(histories, items, itemsTemp));
    };

    let setUpHistory = () => {
        resetHistoryMenu();
        setUpHistoryHeader();
        setUpHistoryItems();
    };

    let isSettingsListSet = (list) => {
        return settingsData[list].text.raw || settingsData[list].regex.raw;
    };

    let setUpSettingsItemsStates = (open) => {
        if ((!open && isSettingsListSet('blacklist')) || blacklist.querySelector('#input > div').innerText.trim()) {
            whitelist.classList.add('disabled');
        } else {
            whitelist.classList.remove('disabled');
        }
        if ((!open && isSettingsListSet('whitelist')) || whitelist.querySelector('#input > div').innerText.trim()) {
            blacklist.classList.add('disabled');
        } else {
            blacklist.classList.remove('disabled');
        }
    };

    let getEscapedTextRegex = (text) => {
        return text ? `(${text.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').split(',').filter(Boolean).join('|')})` : text;
    };

    let setSettingsList = (element, name, visible) => {
        if (visible) {
            element.querySelector('#input > div').innerText = settingsData[name].text.raw || settingsData[name].regex.raw;
        } else {
            let innerText = element.querySelector('#input > div').innerText.trim();
            let match = innerText.match(/^\/(.+?)\/([igmsuy]{0,6}?)$/);
            if (match) {
                settingsData[name].text = { raw: null, escaped: null };
                settingsData[name].regex = { raw: match[0], escaped: match[1], flags: match[2] };
            } else {
                settingsData[name].regex = { raw: null, escaped: null, flags: null };
                settingsData[name].text = { raw: innerText, escaped: getEscapedTextRegex(innerText) };
            }
        }
    };

    let getChatSettingsButton = () => {
      let iconButton = document.querySelector('#chat-messages #overflow');
      let liveChatButton = document.querySelector('#chat-messages #live-chat-header-context-menu');
      return (!iconButton || iconButton.hidden) ? liveChatButton : iconButton;
    };

    let setUpSettingsItems = () => {
        let items = settings.querySelector('#items');
        let types;
        let controls;

        chatSettingsButton = getChatSettingsButton();

        ['blacklist', 'whitelist', 'types', 'controls'].forEach((id) => {
            items.innerHTML += `<ytd-menu-service-item-renderer id="${id}" class="style-scope ytd-menu-popup-renderer" role="menuitem" tabindex="-1" aria-selected="false" data='{"serviceEndpoint": {}}'></ytd-menu-service-item-renderer>`;
        });

        blacklist = items.querySelector('#blacklist tp-yt-paper-item');
        blacklist.innerHTML += `<yt-live-chat-text-input-field-renderer id="input" class="style-scope yt-live-chat-message-input-renderer" disabled="" emoji-manager='{"emojiShortcutMap": {}}'></yt-live-chat-text-input-field-renderer>`;
        blacklist.querySelector('yt-formatted-string').innerText = 'Blacklist';
        blacklist.querySelector('yt-formatted-string').removeAttribute('is-empty');
        setSettingsList(blacklist, 'blacklist', true);

        whitelist = items.querySelector('#whitelist tp-yt-paper-item');
        whitelist.innerHTML += '<yt-live-chat-text-input-field-renderer id="input" class="style-scope yt-live-chat-message-input-renderer" disabled=""></yt-live-chat-text-input-field-renderer>';
        whitelist.querySelector('yt-formatted-string').innerText = 'Whitelist';
        whitelist.querySelector('yt-formatted-string').removeAttribute('is-empty');
        setSettingsList(whitelist, 'whitelist', true);

        types = items.querySelector('#types tp-yt-paper-item');
        types.innerHTML += '<div id="toggle" class="style-scope ytd-compact-autoplay-renderer" role="button" checked=""><div class="toggle-container style-scope paper-toggle-button"><div id="toggleBar" class="toggle-bar style-scope paper-toggle-button"></div><div id="toggleButton" class="toggle-button style-scope paper-toggle-button"></div></div></div>';
        types.append(types.querySelector('yt-formatted-string').cloneNode());
        types.innerHTML += '<div id="toggle" class="style-scope ytd-compact-autoplay-renderer" role="button" checked=""><div class="toggle-container style-scope paper-toggle-button"><div id="toggleBar" class="toggle-bar style-scope paper-toggle-button"></div><div id="toggleButton" class="toggle-button style-scope paper-toggle-button"></div></div></div>';
        types.querySelector('yt-formatted-string').innerText = 'Moderators';
        types.querySelector('yt-formatted-string').removeAttribute('is-empty');
        types.querySelector('yt-formatted-string:nth-of-type(2)').innerText = 'Owner';
        types.querySelector('yt-formatted-string:nth-of-type(2)').removeAttribute('is-empty');
        moderator = types.querySelector('#toggle');
        owner = types.querySelector('#toggle:nth-of-type(2)');
        settingsData.moderator ? moderator.setAttribute('checked', '') : moderator.removeAttribute('checked');
        settingsData.owner ? owner.setAttribute('checked', '') : owner.removeAttribute('checked');

        controls = items.querySelector('#controls tp-yt-paper-item');
        controls.innerHTML += '<ytd-button-renderer id="cancel" class="style-scope ytd-masthead style-suggestive size-small" button-renderer="" use-keyboard-focused="" is-paper-button-with-icon="" is-paper-button=""></ytd-button-renderer>';
        controls.innerHTML += '<ytd-button-renderer id="save" class="style-scope ytd-video-secondary-info-renderer style-destructive size-default" button-renderer="" use-keyboard-focused="" is-paper-button-with-icon="" is-paper-button=""></ytd-button-renderer>';
        cancel = controls.querySelector('#cancel');
        save = controls.querySelector('#save');
        cancel.innerHTML = '<tp-yt-paper-button id="button" class="style-scope ytd-button-renderer style-suggestive size-small" role="button" tabindex="0" animated="" elevation="0" aria-disabled="false" aria-label="Sign in"><yt-formatted-string id="text" class="style-scope ytd-button-renderer style-suggestive size-small"></yt-formatted-string></tp-yt-paper-button>';
        save.innerHTML = '<tp-yt-paper-button id="button" class="style-scope ytd-button-renderer style-destructive size-default" role="button" tabindex="0" animated="" elevation="0" aria-disabled="false" aria-label="Subscribe"><yt-formatted-string id="text" class="style-scope ytd-button-renderer style-destructive size-default"></yt-formatted-string></tp-yt-paper-button>';
        cancel.querySelector('yt-formatted-string').innerText = 'Cancel';
        cancel.querySelector('yt-formatted-string').removeAttribute('is-empty');
        save.querySelector('yt-formatted-string').innerText = 'Save';
        save.querySelector('yt-formatted-string').removeAttribute('is-empty');

        setUpSettingsItemsStates();
    };

    let setUpSettingsData = () => {
        let savedSettingsData = localStorage.getItem('youtubespecialcommentsticker-settings');
        if (savedSettingsData) {
            settingsData = JSON.parse(savedSettingsData);
        }

        if (!settingsData || typeof settingsData.blacklist === 'string' || typeof settingsData.whitelist === 'string') {
            let blacklistText = settingsData ? settingsData.blacklist : null;
            let whitelistText = settingsData ? settingsData.whitelist : null;
            settingsData = {
                blacklist: {
                    text: { raw: blacklistText, escaped: getEscapedTextRegex(blacklistText) },
                    regex: { raw: null, escaped: null }
                },
                whitelist: {
                    text: { raw: whitelistText, escaped: getEscapedTextRegex(whitelistText) },
                    regex: { raw: null, escaped: null }
                },
                moderator: true,
                owner: true
            };
            localStorage.setItem('youtubespecialcommentsticker-settings', JSON.stringify(settingsData));
        }
    };

    let setUpSettings = () => {
        setUpSettingsData();
        setUpSettingsItems();
    };

    let setUpGlobalSavedStickyIndex = () => {
        let savedStickyIndex = getSavedStickyIndex();
        if (!Object.keys(savedStickyIndex).length) {
            let histories = getHistories();

            histories.forEach((history) => {
                let id = history.substr(42);
                if (!savedStickyIndex[id]) {
                    savedStickyIndex[id] = {
                        author: 'Unknown',
                        icon: 'https://yt3.ggpht.com/a/default-user=s32-c-k-c0x00ffffff-no-rj',
                        id: id.length > 11 ? null : id,
                        title: 'Click here or visit the associated video with chat enabled to update history information.',
                        valid: false
                    };
                }
            });

            localStorage.setItem('youtubespecialcommentsticker-sticky-index', JSON.stringify(savedStickyIndex));
        }
    };

    let getSavedStickyIndex = () => {
        let savedStickyIndex = localStorage.getItem('youtubespecialcommentsticker-sticky-index');
        return savedStickyIndex ? JSON.parse(savedStickyIndex) : {};
    };

    let getYtInitialData = () => {
        let ytInitialDataScript = [...window.top.document.querySelectorAll('script')].find(script => script.text.indexOf('["ytInitialData"]') > -1);
        return JSON.parse(ytInitialDataScript.text.substr(26, ytInitialDataScript.text.length - 27));
    };

    let getMicroFormatPlayerData = () => {
        let microFormatScript = window.top.document.querySelector('#microformat script');
        return JSON.parse(microFormatScript.text);
    };

    let getSavedStickyIndexDetails = (savedStickyIndex) => {
        if (IS_POPOUT) {
            let stickyIndexDetails = Object.values(savedStickyIndex).find(stickyIndex => stickyIndex.id === CHAT_ID);
            if (stickyIndexDetails) {
                return stickyIndexDetails;
            }
            let ytInitialData = getYtInitialData();
            return {
                author: ytInitialData.contents.liveChatRenderer.participantsList.liveChatParticipantsListRenderer.participants[0].liveChatParticipantRenderer.authorName.simpleText,
                icon: ytInitialData.contents.liveChatRenderer.participantsList.liveChatParticipantsListRenderer.participants[0].liveChatParticipantRenderer.authorPhoto.thumbnails[0].url,
                id: CHAT_ID,
                title: `https://www.youtube.com/watch?v=${CHAT_ID}`,
                valid: true
            };
        }
        let videoId = window.top.document.location.href.split('=')[1];
        let microFormatPlayerData = getMicroFormatPlayerData();
        let existingStickyIndexDetails = savedStickyIndex[CHAT_ID];
        if (microFormatPlayerData.embedUrl.substr(-11) !== videoId || (existingStickyIndexDetails && existingStickyIndexDetails.id && existingStickyIndexDetails.id !== videoId)) {
            throw new Error('Incorrect CHAT_ID.');
        }
        return {
            author: microFormatPlayerData.author || 'Unknown',
            icon: window.top.document.querySelector('#avatar img[src*="http"]').src.replace('=s48', '=s32') || 'https://yt3.ggpht.com/a/default-user=s32-c-k-c0x00ffffff-no-rj',
            id: videoId,
            title: microFormatPlayerData.name || 'Unknown',
            valid: true
        };
    };

    let setUpLocalSavedStickyIndex = () => {
        try {
            let savedStickyIndex = getSavedStickyIndex();
            savedStickyIndex[CHAT_ID] = getSavedStickyIndexDetails(savedStickyIndex);

            if (!IS_POPOUT && savedStickyIndex[savedStickyIndex[CHAT_ID].id]) {
                savedStickyIndex[savedStickyIndex[CHAT_ID].id] = savedStickyIndex[CHAT_ID];
            }

            localStorage.setItem('youtubespecialcommentsticker-sticky-index', JSON.stringify(savedStickyIndex));
        } catch (e) {
            if (e.message !== 'Incorrect CHAT_ID.') {
                setTimeout(setUpLocalSavedStickyIndex);
            }
        }
    };

    let setUpSavedStickyIndex = () => {
        setUpGlobalSavedStickyIndex();
        setUpLocalSavedStickyIndex();
    };

    let getStickyItem = (savedItem) => {
        let stickyItem = document.createElement('div');
        let message = savedItem.content.message.reduce((result, node) => {
            if (node.type === 'text') {
                result += node.value;
            } else if (node.type === 'image') {
                result += `<img class="emoji style-scope yt-live-chat-text-message-renderer" src="${node.value.src}" alt="${node.value.alt}">`;
            } else {
                result += `<a class="yt-simple-endpoint style-scope yt-live-chat-text-message-renderer" href="${node.value.href}" rel="nofollow" target="_blank">${node.value.text}</a>`;
            }
            return result;
        }, '');
        stickyItem.classList.add('sticky-item');
        stickyItem.innerHTML = `<div id="author-photo" class="no-transition style-scope yt-live-chat-text-message-renderer" height="24" width="24" style="background-color: transparent;"><img id="img" class="style-scope yt-img-shadow" alt="" height="24" width="24" src="${savedItem.authorPhoto.img.src}"></div>`;
        stickyItem.innerHTML += `<div id="content" class="style-scope yt-live-chat-text-message-renderer"><span class="timestamp">${savedItem.content.timestamp}</span><div class="author"><span class="author-name ${savedItem.content.author.classes}">${savedItem.content.author.name}</span></div><span id="message" dir="auto" class="style-scope yt-live-chat-text-message-renderer">${message}</span></div>`;
        return stickyItem;
    };

    let stickSavedItem = (savedItem) => {
        if (isSpecial(savedItem)) {
            let stickyItem = getStickyItem(savedItem);
            stickyItems.append(stickyItem);
            stickyItemObjectsMap[`${savedItem.content.timestamp}-${savedItem.content.author.name}-${stickyItem.querySelector('#message').innerText}`] = true;
            showSticky();
            scrollSticky();
        }
    };

    let setUpSavedStickyItems = () => {
        let savedStickyItems = localStorage.getItem(`youtubespecialcommentsticker-sticky-items-${CHAT_ID}`);
        stickyItemObjectsMap = {};
        stickyItemObjects = savedStickyItems ? JSON.parse(savedStickyItems) : [];
        stickyItemObjects.forEach(stickSavedItem);
    };

    let setUpSticky = () => {
        let hideTimestamp = document.querySelector('yt-live-chat-renderer').hasAttribute('hide-timestamps');
        let stickyAnchor = document.querySelector('yt-live-chat-app');
        sticky = document.createElement('div');

        sticky.id = 'sticky';
        sticky.setAttribute('class', `style-scope ytd-watch-flexy ${IS_DARK ? 'dark' : ''} ${hideTimestamp ? 'hide-timestamps': ''}`);
        sticky.style.display = 'none';
        sticky.innerHTML = '<tp-yt-iron-dropdown id="menu" horizontal-align="auto" vertical-align="top" aria-disabled="false" class="style-scope yt-live-chat-app sticky-panel" prevent-autonav="true" aria-hidden="true" tabindex="0"><div id="contentWrapper" class="style-scope tp-yt-iron-dropdown"></div></tp-yt-iron-dropdown>';
        sticky.innerHTML += '<yt-icon-button id="overflow" class="style-scope yt-live-chat-header-renderer"><button id="button" class="style-scope yt-icon-button"><yt-icon icon="more_vert" class="style-scope yt-live-chat-header-renderer"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" class="style-scope yt-icon"></path></g></svg></yt-icon></button><paper-ripple class="style-scope yt-icon-button circle"><div id="background" class="style-scope paper-ripple" style="opacity: 0;"></div><div id="waves" class="style-scope paper-ripple"></div></paper-ripple></yt-icon-button>';
        sticky.innerHTML += '<div id="history" horizontal-align="auto" vertical-align="top" aria-disabled="false" class="style-scope yt-live-chat-app sticky-panel" prevent-autonav="true" style="display: none;" aria-hidden="true" tabindex="0"><div id="contentWrapper" class="style-scope iron-dropdown"><ytd-menu-popup-renderer slot="dropdown-content" class="style-scope yt-live-chat-app" tabindex="-1" use-icons_=""></ytd-menu-popup-renderer></div></div>';
        sticky.innerHTML += '<div id="settings" horizontal-align="auto" vertical-align="top" aria-disabled="false" class="style-scope yt-live-chat-app sticky-panel" prevent-autonav="true" style="display: none;" aria-hidden="true" tabindex="0"><div id="contentWrapper" class="style-scope iron-dropdown"><ytd-menu-popup-renderer slot="dropdown-content" class="style-scope yt-live-chat-app" tabindex="-1" use-icons_=""></ytd-menu-popup-renderer></div></div>';
        sticky.innerHTML += '<div id="show-hide-button" class="style-scope ytd-live-chat-frame"><div class="style-scope ytd-live-chat-frame" use-keyboard-focused="" is-paper-button="" button-renderer="true"><a class="yt-simple-endpoint style-scope ytd-toggle-button-renderer" tabindex="-1"><tp-yt-paper-button id="button" class="style-scope ytd-toggle-button-renderer" role="button" tabindex="0" animated="" elevation="0" aria-disabled="false"><yt-formatted-string id="text" class="style-scope ytd-toggle-button-renderer"></yt-formatted-string><paper-ripple class="style-scope tp-yt-paper-button"><div id="background" class="style-scope paper-ripple"></div><div id="waves" class="style-scope paper-ripple"></div></paper-ripple></tp-yt-paper-button></a></div></div>'
        sticky.innerHTML += '<div id="chat-header" role="heading" class="style-scope yt-live-chat-renderer"><div id="primary-content" class="style-scope yt-live-chat-header-renderer"></div>';
        sticky.innerHTML += '<yt-icon-button id="show-more" class="style-scope yt-live-chat-item-list-renderer" style="transform: translateY(42px);"><button id="button" class="style-scope yt-icon-button"><button id="button" class="style-scope yt-icon-button" aria-label="More comments below"><yt-icon icon="down_arrow" class="style-scope yt-live-chat-item-list-renderer"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon"><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" class="style-scope yt-icon"></path></g></svg></yt-icon></button></button><paper-ripple class="style-scope yt-icon-button circle"><div id="background" class="style-scope paper-ripple" style="opacity: 0.006272;"></div><div id="waves" class="style-scope paper-ripple"></div></paper-ripple></yt-icon-button>'
        sticky.innerHTML += '<ytd-popup-container id="notice" class="style-scope ytd-app" style="display: none;"><tp-yt-iron-dropdown horizontal-align="right" vertical-align="top" aria-disabled="false" class="style-scope ytd-popup-container" force-close-on-outside-click="true" style="outline: none; position: fixed; left: 101px; top: 44px; z-index: 2202;"></tp-yt-iron-dropdown></ytd-popup-container>';
        menu = sticky.querySelector('#menu');
        menuButton = sticky.querySelector('#overflow');
        history = sticky.querySelector('#history');
        settings = sticky.querySelector('#settings');
        stickyItemsContainer = sticky.querySelector('#chat-header');
        toggleSticky = sticky.querySelector('#show-hide-button');
        toggleStickyText = toggleSticky.querySelector('#text');
        scrollButton = sticky.querySelector('#show-more');
        scrollButton.querySelector('#button').style.height = 'auto';
        notice = sticky.querySelector('#notice');

        stickyAnchor.parentNode.insertBefore(sticky, stickyAnchor);
        stickyAnchor.style.position = 'relative';
        toggleStickyText.innerText = 'Hide Sticky';
        toggleStickyText.removeAttribute('is-empty');

        sticky.querySelectorAll('#title, #view-selector, #action-buttons, #items, #footer').forEach(element => element.parentNode.removeChild(element));
        stickyItems = sticky.querySelector('#primary-content');
        history.querySelector('ytd-menu-popup-renderer').innerHTML = '<div id="items" class="style-scope ytd-menu-popup-renderer" role="listbox" tabindex="0"></div>';
        settings.querySelector('ytd-menu-popup-renderer').innerHTML = '<div id="items" class="style-scope ytd-menu-popup-renderer" role="listbox" tabindex="0"></div>';
        notice.querySelector('#contentWrapper').innerHTML = '<yt-tooltip-renderer id="tooltip" slot="dropdown-content" class="style-scope ytd-popup-container" tabindex="-1" has-buttons_="" style="outline: none; box-sizing: border-box; max-width: 294.406px; max-height: 120px;" position-type="OPEN_POPUP_POSITION_BOTTOMLEFT"></yt-tooltip-renderer>';

        setUpMenu();
        setUpSettings();
        setUpSavedStickyIndex();
        setUpSavedStickyItems();
    };

    let monitorDarkTheme = () => {
        let observer = new MutationObserver(() => {
            sticky.classList.toggle('dark');
        });
        observer.observe(document.querySelector('html'), {
            attributes: true,
            attributeFilter: ['dark']
        });
    };

    let monitorTimestampToggle = () => {
        let observer = new MutationObserver(() => {
            sticky.classList.toggle('hide-timestamps');
            scrollSticky();
        });
        observer.observe(document.querySelector('yt-live-chat-renderer'), {
            attributes: true,
            attributeFilter: ['hide-timestamps']
        });
    };

    let monitorSettings = () => {
        let config = {
            characterData: true,
            subtree: true
        };
        let blacklistObserver = new MutationObserver((mutations) => {
            if (mutations[0].target.data) {
                whitelist.classList.add('disabled');
            } else {
                whitelist.classList.remove('disabled');
            }
        });
        let whitelistObserver = new MutationObserver((mutations) => {
            if (mutations[0].target.data) {
                blacklist.classList.add('disabled');
            } else {
                blacklist.classList.remove('disabled');
            }
        });
        blacklistObserver.observe(blacklist, config);
        whitelistObserver.observe(whitelist, config);
    };

    let restoreSettingsData = () => {
        setSettingsList(blacklist, 'blacklist', true);
        setSettingsList(whitelist, 'whitelist', true);
        settingsData.moderator ? moderator.setAttribute('checked', '') : moderator.removeAttribute('checked');
        settingsData.owner ? owner.setAttribute('checked', '') : owner.removeAttribute('checked');
        settings.style.display = 'none';
    };

    let handlePaste = (element) => {
        let paste = event.clipboardData.getData('Text');
        let selection = window.getSelection();
        let position = selection.anchorOffset;
        element.innerText = `${element.innerText.slice(0, position)}${paste}${element.innerText.slice(position)}`;
        try {
            selection.collapse(element.lastChild, position + paste.length);
        } catch (error) {
            selection.collapse(element.lastChild, 0);
        }
    };

    let filterStickyItems = () => {
        Array.from(stickyItems.children).forEach((stickyItem) => {
            if (!isSpecial(stickyItem.querySelector('.author-name'))){
                stickyItem.setAttribute('style', 'display: none;');
            } else {
                stickyItem.removeAttribute('style');
            }
        });
    };

    let setUpEvents = () => {
        stickyItems.addEventListener('scroll', () => {
            setTimeout(() => {
                canScroll = stickyItems.scrollHeight - stickyItems.scrollTop === stickyItems.clientHeight;
                scrollButton.style.transform = `translateY(${canScroll ? 42 : 0}px)`;
                scrollButton.style.visibility = canScroll ? 'hidden' : 'visible';
            });
        });
        scrollButton.addEventListener('click', () => {
            canScroll = true;
            scrollSticky();
        });
        toggleSticky.addEventListener('click', () => {
            if (stickyItemsContainer.offsetHeight > 0) {
                chat.setAttribute('style', `max-height: ${chat.offsetHeight + 150}px;`);
                toggleStickyText.innerText = 'Show Sticky';
                stickyItemsContainer.setAttribute('style', 'border: none;');
                stickyItemsContainer.style.height = '0px';
                scrollSticky(true);
            } else {
                chat.setAttribute('style', `max-height: ${chat.offsetHeight - 150}px;`);
                itemScroller.scrollTop += 150;
                toggleStickyText.innerText = 'Hide Sticky';
                stickyItemsContainer.setAttribute('style', '');
                stickyItemsContainer.style.height = '150px';
            }
        });
        chatSettingsButton.addEventListener('click', () => {
            if (sticky.style.display === 'none') {
                let chatSettings = document.querySelector('yt-live-chat-app > tp-yt-iron-dropdown #items');
                if (!chatSettings.querySelector('#chatSettingsStickyButton')) {
                    chatSettingsStickyButton = document.createElement('div');
                    chatSettingsStickyButton.innerHTML = `<ytd-menu-service-item-renderer id="chatSettingsStickyButton" class="style-scope ytd-menu-popup-renderer" role="menuitem" use-icons="" tabindex="-1" aria-selected="false" data='{"text": {"runs": [{"text":"Show Sticky"}]}, "icon": {"iconType": "PLAYLIST_ADD_CHECK"}, "serviceEndpoint": {}}'></ytd-menu-service-item-renderer>`;
                    chatSettingsStickyButton = chatSettingsStickyButton.firstChild;
                    chatSettings.append(chatSettingsStickyButton);
                    chatSettingsStickyButton.addEventListener('click', () => {
                        chatSettingsButton.click();
                        showSticky();
                        chatSettingsStickyButton.style.display = 'none';
                    });
                }
            }
        });
        menuButton.addEventListener('click', () => {
            menu.style.display = menu.style.display === 'none' ? 'initial' : 'none';
            if (menu.style.display === 'initial') {
                menu.focus();
            }
        });
        menu.addEventListener('focusout', (event) => {
            if (!menu.contains(event.relatedTarget) && !menuButton.contains(event.relatedTarget)) {
                menu.style.display = 'none';
            }
        });
        historyButton.addEventListener('click', () => {
            setUpHistory();
            history.style.display = history.style.display === 'none' ? 'initial' : 'none';
            if (history.style.display === 'initial') {
                history.focus();
            }
        });
        history.addEventListener('focusout', (event) => {
            if (!history.contains(event.relatedTarget) && !history.hasAttribute('editing') && !history.hasAttribute('refreshing') && !history.hasAttribute('importing')) {
                history.style.display = 'none';
            }
        });
        settingsButton.addEventListener('click', () => {
            settings.style.display = settings.style.display === 'none' ? 'initial' : 'none';
            if (settings.style.display === 'initial') {
                settings.focus();
            }
        });
        settings.addEventListener('focusout', (event) => {
            if (!settings.contains(event.relatedTarget)) {
                restoreSettingsData();
                setUpSettingsItemsStates();
            }
        });
        blacklist.querySelector('#input > div').addEventListener('paste', () => {
            handlePaste(blacklist.querySelector('#input > div'));
            setUpSettingsItemsStates(true);
        });
        whitelist.querySelector('#input > div').addEventListener('paste', () => {
            handlePaste(whitelist.querySelector('#input > div'));
            setUpSettingsItemsStates(true);
        });
        settings.querySelectorAll('#toggle').forEach((toggle) => {
            toggle.addEventListener('click', (event) => {
                if (event.currentTarget.hasAttribute('checked')) {
                    event.currentTarget.removeAttribute('checked');
                } else {
                    event.currentTarget.setAttribute('checked', '');
                }
            });
        });
        cancel.addEventListener('click', () => {
            restoreSettingsData();
            setUpSettingsItemsStates();
        });
        save.addEventListener('click', () => {
            setSettingsList(blacklist, 'blacklist');
            setSettingsList(whitelist, 'whitelist');
            settingsData.moderator = moderator.hasAttribute('checked');
            settingsData.owner = owner.hasAttribute('checked');
            localStorage.setItem('youtubespecialcommentsticker-settings', JSON.stringify(settingsData));
            settings.style.display = 'none';
            filterStickyItems();
        });
        notice.addEventListener('mouseleave', () => {
            notice.touched = true;
            notice.style.display = 'none';
        });
        window.addEventListener('beforeunload', () => {
            let savedSticky = getHistory(CHAT_ID);
            if (!savedSticky) {
                let savedStickyIndex = getSavedStickyIndex();
                if (savedStickyIndex[CHAT_ID]) {
                    delete savedStickyIndex[CHAT_ID];
                    localStorage.setItem('youtubespecialcommentsticker-sticky-index', JSON.stringify(savedStickyIndex));
                }
            }
        }, false);
    };

    let initMonitoring = () => {
        setUpCss();
        setUpSticky();
        monitor();
        monitorDarkTheme();
        monitorTimestampToggle();
        monitorSettings();
        setUpEvents();
    };

    let init = () => {
        if (window.top.document.readyState === 'complete') {
            initMonitoring();
        } else {
            window.top.addEventListener('load', initMonitoring);
        }
    };

    init();
})();