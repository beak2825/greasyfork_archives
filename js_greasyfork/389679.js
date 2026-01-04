// ==UserScript==
// @name         YouTube Live - Word mute
// @namespace    https://twitter.com/4chouyou
// @version      0.1.2
// @description  YouTubeのチャット欄にワードミュート機能を追加します
// @author       mufuuuu
// @match        https://www.youtube.com/live_chat*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/389679/YouTube%20Live%20-%20Word%20mute.user.js
// @updateURL https://update.greasyfork.org/scripts/389679/YouTube%20Live%20-%20Word%20mute.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(() => {
    const TIMEOUT = 10000;
    const STRINGS = {
        ja:{
            enterMuteWord: '"/"で括ると正規表現',
            inputButton: '追加',
            toggleMuteWordsList: 'ミュートワードリストの表示/非表示',
            excludeOwner: 'チャンネル所有者を除く',
            excludePaidMessage: 'スーパーチャットを除く',
            showMuteWordOnHover: 'ホバー時にミュートワードを表示',
            showMutedContentOnHover: 'ツールチップで本文を表示',
            selectionEnabled: '選択ポップアップを有効化',
            hideChatCompletely: 'ミュートしたチャットを非表示'
        },
        en:{
            enterMuteWord: 'Use "/" for RegExp.',
            inputButton: 'Add',
            toggleMuteWordsList: 'Show/Hide mute word list',
            excludeOwner: 'Exclude channel owner',
            excludePaidMessage: 'Exclude Super Chat',
            showMuteWordOnHover: 'Show mute word on hover',
            showMutedContentOnHover: 'Show content tooltip on hover',
            selectionEnabled: 'Enable selection popup',
            hideChatCompletely: 'Hide muted chat completely'
        }
    };
    var YTChatWordMute = {};
    (YTChatWordMute => {
        class Main {
            constructor() {
                this.muteWords = [];
                this.strings = {};
                this.config = {
                    excludeOwner: true,
                    excludePaidMessage: false,
                    showMuteWordOnHover: true,
                    showMutedContentOnHover: true,
                    hideChatCompletely: false,
                    selectionEnabled: false,
                    reverseList: true,
                    openList: true
                };
            }
            load() {
                let language = ((window.navigator.languages && window.navigator.languages[0]) || window.navigator.language || window.navigator.userLanguage || window.navigator.browserLanguage).substring(0, 2);
                if(Object.keys(STRINGS).indexOf(language) != -1) {
                    this.strings = STRINGS[language];
                }else {
                    this.strings = STRINGS.en;
                }

                this.muteWords = JSON.parse(GM_getValue('muteWords', false)) || JSON.parse(localStorage.getItem('muteWord')) || [];
                this.config = JSON.parse(GM_getValue('config', false)) || this.config;

                let promise = new Promise(resolve => {
                    let intervalid = window.setInterval(() => {
                        if(document.querySelector('#chat #items')) {
                            window.clearTimeout(timeoutid);
                            window.clearInterval(intervalid);
                            resolve(true);
                        }
                    }, 100);
                    let timeoutid = window.setTimeout(() => {
                        window.clearInterval(intervalid);
                    }, TIMEOUT);
                });
                promise.then(() => {
                    YTChatWordMute.wordMute.load();
                    YTChatWordMute.selection.load();
                    YTChatWordMute.popup.load();
                });
            }
            save() {
                GM_setValue('muteWords', JSON.stringify(this.muteWords));
                GM_setValue('config', JSON.stringify(this.config));
            }
        }
        class WordMute {
            refreshStylesheet() {
                let style = document.getElementById('styleWordMute');
                if(!style) {
                    style = document.createElement('style');
                    style.id = 'styleWordMute';
                    style.type = 'text/css';
                    document.head.appendChild(style);
                }
                const CSS = [
                    '.muted #message, .muted #author-name, .muted #chat-badges { display: none; }',
                    '.muted yt-live-chat-author-chip.yt-live-chat-text-message-renderer { margin-right: 0px !important; }',
                    '.muted #author-photo { visibility: collapse; }',
                    '.muted #content::after { content: "[Muted]"; display:inline-block; opacity: .25; width: 100%; line-height: 1em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
                    '.muted:hover #content::after { content: "[Muted] "attr(muteword); }'
                ];
                if(YTChatWordMute.main.config.hideChatCompletely) {
                    style.innerHTML = CSS.join('\n') + '\n.muted { display: none; }';
                }else {
                    style.innerHTML = CSS.join('\n');
                }
            }
            load() {
                this.refreshStylesheet();
                this.applyMuteAll();

                let observer = new MutationObserver((mutations) => {
                    let chatItems;
                    if(mutations.length == 1) {
                        chatItems = Array.from(mutations[0].addedNodes);
                    }else {
                        chatItems = Array.from(document.querySelectorAll('#chat #items > .yt-live-chat-item-list-renderer'));
                    }
                    this.applyMute(chatItems);
                });
                let chat = document.querySelector('#chat #items');
                observer.observe(chat, {childList: true});
            }
            addMuteWord(muteWord) {
                YTChatWordMute.main.muteWords.push(muteWord);
                YTChatWordMute.main.save();
            }
            removeMuteWord(muteWord) {
                if(YTChatWordMute.main.muteWords.indexOf(muteWord) >= 0) {
                    YTChatWordMute.main.muteWords.splice(YTChatWordMute.main.muteWords.indexOf(muteWord), 1);
                }
                YTChatWordMute.main.save();
            }
            applyMuteAll() {
                let chatItems = Array.from(document.querySelectorAll('#chat #items > .yt-live-chat-item-list-renderer'));
                this.applyMute(chatItems);
            }
            applyMute(chatItems) {
                chatItems = chatItems.filter(node => node.tagName == 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER' || node.tagName == 'YT-LIVE-CHAT-PAID-MESSAGE-RENDERER');
                chatItems.forEach(node => {
                    let content = node.querySelector('#content');
                    content.removeAttribute('muteword');
                    content.removeAttribute('title');
                    node.classList.remove('muted');
                });

                if(YTChatWordMute.main.config.excludePaidMessage) {
                     chatItems = chatItems.filter(node => node.tagName != 'YT-LIVE-CHAT-PAID-MESSAGE-RENDERER');
                }
                if(YTChatWordMute.main.config.excludeOwner) {
                     chatItems = chatItems.filter(node => !node.hasAttribute('author-is-owner'));
                }
                chatItems.forEach(node => {
                    let content = node.querySelector('#content');
                    let message = node.querySelector('#message');
                    /*console.log('message.innerHTML: "' + message.innerHTML + '"');*/
                    let text = message.innerHTML.replace(/\r?\n/g, '').replace(/<paper-tooltip.*\/paper-tooltip>/g, '').replace(/<[^<]*alt=\"([^"]+)\"[^>]*>/g, '$1');
                    /*console.log('text: "' + text + '"');*/
                    for(let i = 0; i < YTChatWordMute.main.muteWords.length; i++) {
                        let muteWord = YTChatWordMute.main.muteWords[i];
                        if(muteWord.substring(0, 1) == '/' && muteWord.substring(muteWord.length - 1) == '/') {
                            muteWord = muteWord.substring(1, muteWord.length - 1);
                        }else {
                            muteWord = muteWord.replace(/[-.*+^|[\]()?${}\\]/g, '\\$&');
                        }
                        let regex = new RegExp(muteWord, 'u');
                        if(regex.test(text)) {
                            /*console.log('match: "' + YTChatWordMute.main.muteWords[i] + '", text: "' + text + '"');*/
                            if(YTChatWordMute.main.config.showMuteWordOnHover) {
                                content.setAttribute('muteword', YTChatWordMute.main.muteWords[i]);
                            }
                            if(YTChatWordMute.main.config.showMutedContentOnHover) {
                                content.setAttribute('title', text);
                            }
                            node.classList.add('muted');
                            break;
                        }
                    }
                });
            }
        }
        class Selection {
            refreshStylesheet() {
                let style = document.getElementById('styleSelection');
                if(!style) {
                    style = document.createElement('style');
                    style.id = 'styleSelection';
                    style.type = 'text/css';
                    document.head.appendChild(style);
                }
                const CSS = [
                    '#selectionPopup {position: absolute; padding: 8px; background-color: var(--yt-spec-general-background-a); color: var(--yt-live-chat-primary-text-color, var(--yt-primary-text-color)); font-size: 1.2em; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2); border-radius: 4px; cursor: pointer;}',
                    '#selectionPopup:hover { background-color: var(--yt-spec-general-background-b); }'
                ];
                style.innerHTML = CSS.join('\n');
            }
            load() {
                this.refreshStylesheet();
                this.addEventListener();
            }
            addEventListener() {
                document.documentElement.addEventListener('click', onClick, false);
                function onClick(e) {
                    if(YTChatWordMute.main.config.selectionEnabled) {
                        if(e.target.id == 'selectionPopup') {
                            let selectionPopup = e.target;
                            let selectionText = selectionPopup.getAttribute('muteWord');
                            selectionPopup.remove();
                            YTChatWordMute.popup.addMuteWord(selectionText);
                        }else if(e.target.classList.contains('yt-live-chat-text-message-renderer') || e.target.classList.contains('yt-live-chat-paid-message-renderer') || e.target.classList.contains('yt-live-chat-item-list-renderer')) {
                            let selectionPopup = document.getElementById('selectionPopup');
                            if(selectionPopup) selectionPopup.remove();
                            if(document.getSelection() && !document.getSelection().isCollapsed) {
                                let selectionText = document.getSelection().toString();
                                selectionPopup = document.createElement('div');
                                selectionPopup.id = 'selectionPopup';
                                selectionPopup.style.top = e.pageY + 'px';
                                selectionPopup.style.left = e.pageX + 'px';
                                selectionPopup.textContent = 'Mute "' + selectionText + '"';
                                selectionPopup.setAttribute('muteWord', selectionText);
                                document.body.appendChild(selectionPopup);
                            }
                        }
                    }else {
                        document.documentElement.removeEventListener('click', onClick, false);
                    }
                }
            }
        }
        class Popup {
            refreshStylesheet() {
                let style = document.getElementById('stylePopup');
                if(!style) {
                    style = document.createElement('style');
                    style.id = 'stylePopup';
                    style.type = 'text/css';
                    document.head.appendChild(style);
                }
                const CSS = [
                    '#muteMenu { display: inline-block; position: relative; width: 40px; height: 40px; text-align: center; line-height: 40px; font-size: 0.9em; color: var(--yt-spec-icon-inactive); cursor: pointer; }',
                    '#muteMenu:hover, #muteMenu[active="true"] { color: var(--yt-spec-icon-active-other); }',
                    '#muteMenu::after { content: ""; display: block; position: absolute; width: 0px; height: 0px; left: 20px; top: 20px; border-radius: 50%; background-color: var(--yt-spec-icon-active-other); opacity: .25; transition-duration: .2s; }',
                    '#muteMenu[active="true"]::after { width: 40px; height: 40px; left: 0px; top: 0px; }',
                    '#mutePopupContainer { position: fixed; width: 220px; top: 44px; right: 14px; padding: 12px; background-color: var(--yt-spec-brand-background-solid); color: var(--paper-listbox-color, #212121); box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2); border-radius: 4px; }',
                    '#muteWordInput { width: 100%; border: none; outline: none; background-color: transparent; color: var(--yt-live-chat-primary-text-color); }',
                    '#muteWordInput::placeholder { color: var(--yt-live-chat-text-input-field-placeholder-color, hsla(0, 0%, 6.7%, 0.6)); }',
                    '#muteWordInput + #underline { position: relative; height: 2px; }',
                    '#muteWordInput + #underline #unfocused { position: absolute; top: 0; left: 0; right: 0; height: 1px; background-color: var(--yt-live-chat-text-input-field-inactive-underline-color, #b8b8b8); }',
                    '#muteWordInput + #underline #focused { position: absolute; top: 0; left: 0; right: 0; height: 2px; background-color: var(--yt-live-chat-text-input-field-active-underline-color, #2793e6); transform-origin: center center; transform: scale3d(0,1,1); transition: transform; transition-duration: 0.25s; }',
                    '#muteWordInput:focus + #underline #focused { transform: none; }',
                    '#muteWordAdd { display: block; margin: 8px 0 0 auto; padding: 8px; border: none; background-color: transparent; outline: none; font-size: 1.4rem; font-weight: 500; letter-spacing: .007px; color: var(--yt-spec-call-to-action); cursor: pointer; }',
                    '.openButton { margin-top: 8px; padding: 4px; background-color: var(--yt-spec-general-background-a); border-radius: 4px; text-align: center; cursor: pointer; }',
                    '.openButton:hover {background-color: var(--yt-spec-general-background-b); }',
                    '.listContainer { padding: 0; margin: 0; max-height: 270px; overflow: auto; }',
                    '.listContainer:not([empty="true"]) { margin-top: 12px; }',
                    '#muteWordListContainer .listContainer:not([open]) { display: none; }',
                    '.listItem { display: flex; font-size: 1.2em; line-height: 18px; }',
                    '.listItem:nth-child(even) { background-color: var(--yt-spec-general-background-a); }',
                    '.title { flex: 1; padding-left: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }',
                    '.removeButton { width: 16px; cursor: pointer }',
                    '.removeButton:hover { text-decoration: underline; }'
                ];
                style.innerHTML = CSS.join('\n');
            }
            load() {
                this.refreshStylesheet();

                let menu = document.querySelector('#overflow');
                let muteMenu = document.createElement('a');
                muteMenu.id = 'muteMenu';
                muteMenu.innerText = 'Mute';
                menu.parentNode.insertBefore(muteMenu, menu);
                muteMenu.addEventListener('click', () => {
                    this.toggle();
                }, false);

                let mutePopupContainer = document.createElement('div');
                mutePopupContainer.id = 'mutePopupContainer';
                mutePopupContainer.className = 'hidden';
                let addMuteWordContainer = document.createElement('div');
                addMuteWordContainer.id = 'addMuteWordContainer';
                let inputText = document.createElement('input');
                inputText.id = 'muteWordInput';
                inputText.type = 'text';
                inputText.setAttribute('autocomplete', 'off');
                inputText.placeholder = YTChatWordMute.main.strings.enterMuteWord;
                addMuteWordContainer.appendChild(inputText);
                inputText.addEventListener('keypress', (e) => {
                    if(e.keyCode == '13') {
                        this.addMuteWord();
                    }
                }, false);
                let underline = document.createElement('div');
                underline.id = 'underline';
                let unfocused = document.createElement('div');
                unfocused.id = 'unfocused';
                underline.appendChild(unfocused);
                let focused = document.createElement('div');
                focused.id = 'focused';
                underline.appendChild(focused);
                addMuteWordContainer.appendChild(underline);
                let inputButton = document.createElement('input');
                inputButton.id = 'muteWordAdd';
                inputButton.type = 'button';
                inputButton.value = YTChatWordMute.main.strings.inputButton;
                addMuteWordContainer.appendChild(inputButton);
                inputButton.addEventListener('click', () => {
                    this.addMuteWord();
                }, false);

                let muteWordListContainer = document.createElement('div');
                muteWordListContainer.id = 'muteWordListContainer';
                let muteWordList = document.createElement('ul');
                muteWordList.id = 'muteWordList';
                muteWordList.className = 'listContainer';
                muteWordList.setAttribute('empty', 'true');
                if(YTChatWordMute.main.config.openList) {
                    muteWordList.setAttribute('open', 'true');
                }else {
                    muteWordList.removeAttribute('open');
                }
                let openButton = document.createElement('div');
                openButton.className = 'openButton';
                openButton.textContent = YTChatWordMute.main.strings.toggleMuteWordsList;
                muteWordListContainer.appendChild(openButton);
                openButton.addEventListener('click', () => {
                    YTChatWordMute.main.config.openList = !YTChatWordMute.main.config.openList;
                    YTChatWordMute.main.save();
                    if(YTChatWordMute.main.config.openList) {
                        muteWordList.setAttribute('open', 'true');
                    }else {
                        muteWordList.removeAttribute('open');
                    }
                }, false);
                muteWordListContainer.appendChild(muteWordList);

                let SettingContainer = document.createElement('div');
                SettingContainer.id = 'SettingContainer';
                let SettingList = document.createElement('ul');
                SettingList.id = 'SettingList';
                SettingList.className = 'listContainer';
                SettingList.setAttribute('empty', 'false');
                SettingContainer.appendChild(SettingList);

                let listItem, title, checkBox;
                listItem = document.createElement('li');
                listItem.className = 'listItem';
                title = document.createElement('span');
                title.className = 'title';
                title.textContent = YTChatWordMute.main.strings.excludeOwner;
                checkBox = document.createElement('input');
                checkBox.type = 'checkbox';
                checkBox.checked = YTChatWordMute.main.config.excludeOwner;
                listItem.appendChild(title);
                listItem.appendChild(checkBox);
                SettingList.appendChild(listItem);
                checkBox.addEventListener('click', (e) => {
                    YTChatWordMute.main.config.excludeOwner = e.target.checked;
                    YTChatWordMute.main.save();
                    YTChatWordMute.wordMute.applyMuteAll();
                }, false);

                listItem = document.createElement('li');
                listItem.className = 'listItem';
                title = document.createElement('span');
                title.className = 'title';
                title.textContent = YTChatWordMute.main.strings.excludePaidMessage;
                checkBox = document.createElement('input');
                checkBox.type = 'checkbox';
                checkBox.checked = YTChatWordMute.main.config.excludePaidMessage;
                listItem.appendChild(title);
                listItem.appendChild(checkBox);
                SettingList.appendChild(listItem);
                checkBox.addEventListener('click', (e) => {
                    YTChatWordMute.main.config.excludePaidMessage = e.target.checked;
                    YTChatWordMute.main.save();
                    YTChatWordMute.wordMute.applyMuteAll();
                }, false);

                listItem = document.createElement('li');
                listItem.className = 'listItem';
                title = document.createElement('span');
                title.className = 'title';
                title.textContent = YTChatWordMute.main.strings.showMuteWordOnHover;
                checkBox = document.createElement('input');
                checkBox.type = 'checkbox';
                checkBox.checked = YTChatWordMute.main.config.showMuteWordOnHover;
                listItem.appendChild(title);
                listItem.appendChild(checkBox);
                SettingList.appendChild(listItem);
                checkBox.addEventListener('click', (e) => {
                    YTChatWordMute.main.config.showMuteWordOnHover = e.target.checked;
                    YTChatWordMute.main.save();
                    YTChatWordMute.wordMute.applyMuteAll();
                }, false);

                listItem = document.createElement('li');
                listItem.className = 'listItem';
                title = document.createElement('span');
                title.className = 'title';
                title.textContent = YTChatWordMute.main.strings.showMutedContentOnHover;
                checkBox = document.createElement('input');
                checkBox.type = 'checkbox';
                checkBox.checked = YTChatWordMute.main.config.showMutedContentOnHover;
                listItem.appendChild(title);
                listItem.appendChild(checkBox);
                SettingList.appendChild(listItem);
                checkBox.addEventListener('click', (e) => {
                    YTChatWordMute.main.config.showMutedContentOnHover = e.target.checked;
                    YTChatWordMute.main.save();
                    YTChatWordMute.wordMute.applyMuteAll();
                }, false);

                listItem = document.createElement('li');
                listItem.className = 'listItem';
                title = document.createElement('span');
                title.className = 'title';
                title.textContent = YTChatWordMute.main.strings.selectionEnabled;
                checkBox = document.createElement('input');
                checkBox.type = 'checkbox';
                checkBox.checked = YTChatWordMute.main.config.selectionEnabled;
                listItem.appendChild(title);
                listItem.appendChild(checkBox);
                SettingList.appendChild(listItem);
                checkBox.addEventListener('click', (e) => {
                    YTChatWordMute.main.config.selectionEnabled = e.target.checked;
                    YTChatWordMute.main.save();
                    YTChatWordMute.selection.addEventListener();
                }, false);

                listItem = document.createElement('li');
                listItem.className = 'listItem';
                title = document.createElement('span');
                title.className = 'title';
                title.textContent = YTChatWordMute.main.strings.hideChatCompletely;
                checkBox = document.createElement('input');
                checkBox.type = 'checkbox';
                checkBox.checked = YTChatWordMute.main.config.hideChatCompletely;
                listItem.appendChild(title);
                listItem.appendChild(checkBox);
                SettingList.appendChild(listItem);
                checkBox.addEventListener('click', (e) => {
                    YTChatWordMute.main.config.hideChatCompletely = e.target.checked;
                    YTChatWordMute.main.save();
                    YTChatWordMute.wordMute.refreshStylesheet();
                }, false);

                mutePopupContainer.appendChild(addMuteWordContainer);
                mutePopupContainer.appendChild(muteWordListContainer);
                mutePopupContainer.appendChild(SettingContainer);
                document.body.appendChild(mutePopupContainer);

                YTChatWordMute.main.muteWords.forEach(muteWord => {
                    this.addListItem(muteWord);
                });

                document.body.addEventListener('click', (e) => {
                    let mutePopupContainer = document.querySelector('#mutePopupContainer');
                    let muteMenu = document.querySelector('#muteMenu');
                    let target = e.target;
                    if(!mutePopupContainer.classList.contains('hidden') && target != muteMenu && target.className != 'removeButton') {
                        while (target && (target != document.body)) {
                            if (target == mutePopupContainer) return;
                            target = target.parentNode;
                        }
                        this.toggle();
                    }
                }, false);
            }
            addMuteWord(muteWord) {
                let inputText = document.querySelector('#muteWordInput');
                if(!muteWord) muteWord = inputText.value;
                if(muteWord !== '' && YTChatWordMute.main.muteWords.indexOf(muteWord) == -1) {
                    YTChatWordMute.wordMute.addMuteWord(muteWord);
                    this.addListItem(muteWord);
                    inputText.value = '';
                    YTChatWordMute.wordMute.applyMuteAll();
                }
            }
            toggle() {
                let mutePopupContainer = document.querySelector('#mutePopupContainer');
                let muteMenu = document.querySelector('#muteMenu');
                if(mutePopupContainer.classList.contains('hidden')) {
                    mutePopupContainer.classList.remove('hidden');
                    let inputText = document.querySelector('#muteWordInput');
                    inputText.focus();
                    muteMenu.setAttribute('active', 'true');
                }else {
                    mutePopupContainer.classList.add('hidden');
                    muteMenu.removeAttribute('active');
                }
            }
            addListItem(muteWord) {
                let parent = document.querySelector('#muteWordList');
                let listItem = document.createElement('li');
                listItem.setAttribute('muteword', muteWord);
                listItem.className = 'listItem';
                let title = document.createElement('span');
                title.className = 'title';
                title.title = muteWord;
                title.textContent = muteWord;
                let removeButton = document.createElement('a');
                removeButton.setAttribute('muteword', muteWord);
                removeButton.className = 'removeButton';
                removeButton.textContent = '[x]';
                listItem.appendChild(title);
                listItem.appendChild(removeButton);
                if(YTChatWordMute.main.config.reverseList) {
                    parent.insertBefore(listItem, parent.firstChild);
                }else {
                    parent.appendChild(listItem);
                }

                removeButton.addEventListener('click', (e) => {
                    YTChatWordMute.wordMute.removeMuteWord(muteWord);
                    this.removeListItems(e.target.getAttribute('muteword'));
                    YTChatWordMute.wordMute.applyMuteAll();
                }, false);
                parent.setAttribute('empty', 'false');
            }
            removeListItems(muteWord) {
                let listItems = Array.from(document.querySelectorAll('.listItem'));
                listItems.forEach(item => {
                    if(muteWord == item.getAttribute('muteword')) {
                        item.remove();
                    }
                });
                if(listItems.length == 1) {
                    let parent = document.querySelector('#muteWordList');
                    parent.setAttribute('empty', 'true');
                }
            }
        }
        YTChatWordMute.main = new Main();
        YTChatWordMute.wordMute = new WordMute();
        YTChatWordMute.selection = new Selection();
        YTChatWordMute.popup = new Popup();
    })(YTChatWordMute);

    YTChatWordMute.main.load();
})();