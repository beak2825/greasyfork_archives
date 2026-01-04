// ==UserScript==
// @name         Emanon
// @version      2.6.3
// @description  Improves user experience on mangalib.me
// @author       abara
// @match        https://mangalib.me/*
// @match        https://yaoilib.me/*
// @match        https://ranobelib.me/*
// @match        https://hentailib.me/*
// @match        https://lib.social/*
// @match        https://animelib.me/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @connect      coub.com
// @connect      catbox.moe
// @icon         https://mangalib.me/uploads/users/57692/5N9wWaulef.jpg
// @namespace    https://greasyfork.org/users/209098
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/371740/Emanon.user.js
// @updateURL https://update.greasyfork.org/scripts/371740/Emanon.meta.js
// ==/UserScript==

/**
 * Need refactoring. 
 * Also, feel free to fork.
 */
(function () {
    'use strict';
    const YT_LINK_REGEX = /(?:https?:\/\/)?(?:m\.)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?/;
    const YT_API_KEY = 'AIzaSyAszkTb5uTRo7wbkPmyxD2t1a6K7hR7sVA';
    const IMG_LINK_REGEX = /(?:https?:\/\/)i\.imgur\.com\/(\w+)\.([a-z0-9]{3})/;
    const IMG_CLIENT_ID = '23bfce77f9619b6';
    const COUB_LINK_REGEX = /(?:https?:\/\/)coub\.com\/view\/(\w+)/;
    const CATBOX_LINK_REGEX = /https:\/\/files\.catbox\.moe\/(\w+)\.(webm|mp4)/;
    const _store = {};
    // Bad..
    const _default_config = {
        volume: 50,
    };

    class Api {
        constructor() {
            this.nodeMutatons = [];
            this.messageMutations = [];
        }

        // ex. unsafeWindow.emanon.addNodeMutation(node => {//do something});
        addNodeMutation(callback) {
            if (!callback) throw new Error('Invalid node mutaion!');
            this.nodeMutatons.push(callback);
        }

        // ex. unsafeWindow.emanon.addMessageMutation(message => {//do something});
        addMessageMutation(callback) {
            if (!callback) throw new Error('Invalid message mutaion!');
            this.messageMutations.push(callback);
        }
    }

    const emanonApi = new Api();
    // Insec..
    unsafeWindow.emanon = emanonApi;

    class CacheItem {
        /**
         * @param {string} id 
         * @param {string} title 
         * @param {number} createdAt 
         */
        constructor(id, title, createdAt) {
            this.id = id;
            this.title = title;
            this.createdAt = createdAt;
        }
    }

    class Cache {
        /**
         * @param {string} id 
         * @returns {CacheItem}
         */
        static getItem(id) {
            const cache = Storage.getItem('cache');
            if (cache.length) return cache.find(item => item.id == id);
        }

        /**
         * @param {string} id 
         * @param {string} title 
         */
        static setItem(id, title) {
            const cache = Storage.getItem('cache');
            cache.push(new CacheItem(id, title, Date.now()));
            Storage.setItem('cache', cache);
        }

        static truncateOld() {
            const cache = Storage.getItem('cache');
            const truncated = cache.filter(item => item.createdAt >= (Date.now() - 60 * 1000 * 30)); // 30min
            Storage.setItem('cache', truncated);
        }
    }

    class User {
        /**
         * @param {string} id 
         * @param {string} note 
         * @param {boolean} blocked 
         */
        constructor(id, note, blocked) {
            this.id = id;
            this.note = note;
            this.blocked = blocked;
        }
    }

    class MessageCounter {
        constructor() {
            this.counter = 0;
        }

        incrementCounter() {
            this.counter += 1;
        }

        resetCounter() {
            this.counter = 0;
        }
    }

    class TitleCounter extends MessageCounter {
        constructor() {
            super();
            this.title = document.title;
        }

        incrementCounter() {
            super.incrementCounter();
            document.title = `(+${this.counter}) ${this.title}`;
        }

        resetCounter() {
            super.resetCounter();
            document.title = this.title;
        }
    }

    class ChatMessageCounter extends MessageCounter {
        constructor() {
            super();
            this.el = makeEl('span');
        }

        incrementCounter() {
            super.incrementCounter();
            this.el.innerText = `(+${this.counter})`;
        }

        resetCounter() {
            super.resetCounter();
            this.el.innerText = '';
        }

        get counterEl() {
            return this.el;
        }
    }

    class Storage {
        static fill() {
            for (let k of ['users', 'cache', 'config']) {
                _store[k] = Storage.getItem(k);
            }
        }

        static getItem(key) {
            if (_store[key]) return _store[key];
            return JSON.parse(localStorage.getItem(`emanon.${key}`)) || [];
        }

        static setItem(key, val) {
            _store[key] = val;
            localStorage.setItem(`emanon.${key}`, JSON.stringify(_store[key] || []));
        }
    }

    // Shortcuts
    const q = (sel, el) => (el || document).querySelector(sel);
    const qAll = (sel, el) => (el || document).querySelectorAll(sel);

    /**
     * @param {string} name 
     * @returns {HTMLElement}
     */
    const makeEl = name => document.createElement(name);

    /**
     * https://stackoverflow.com/a/7557433
     * @param {Element} el 
     * @returns {boolean}
     */
    const isElementInViewport = function (el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * @param {string} url 
     */
    const createViewBox = function (url) {
        const view = makeEl('div');
        view.classList.add('_emanon-viewbox');

        let mediaEl = null;
        if (/\.(mp4|webm|gifv)/i.test(url)) {
            mediaEl = makeEl('video');
            mediaEl.autoplay = true;
            mediaEl.loop = true;
            mediaEl.controls = true;

            mediaEl.addEventListener("volumechange", e => {
                const volume = Math.round(100 * e.target.volume);
                const configArr = Storage.getItem('config');
                if (configArr[0]) {
                    configArr[0].volume = volume;
                }
                else {
                    _default_config.volume = volume;
                    configArr.push(_default_config);
                }
                Storage.setItem('config', configArr);
            });

            const configArr = Storage.getItem('config');
            if (configArr[0]) {
                const config = configArr[0];
                mediaEl.volume = 0 == config.volume ? 0 : config.volume / 100;
            }
        }
        else {
            mediaEl = makeEl('img');
        }

        mediaEl.src = url.includes(".gifv") ? url.replace(".gifv", ".mp4") : url;

        view.addEventListener('click', _ => {
            if (mediaEl.tagName == 'VIDEO') {
                mediaEl.pause();
                mediaEl.src = '';
            }
            view.remove();
        });

        view.appendChild(mediaEl);
        q('body').appendChild(view);
    }

    /** 
     * Ported from 4chan-x (MIT). 
     * Thx, Kagami <3
     */
    const getMatroskaTitle = function (body) {
        const data = new Uint8Array(body);
        let i = 0,
            element = 0,
            size = 0,
            title = '';

        const readInt = function () {
            let n = data[i++];
            let len = 0;
            while (n < (0x80 >> len)) len++;
            n ^= (0x80 >> len);
            while (len-- && i < data.length) {
                n = (n << 8) ^ data[i++];
            }
            return n;
        }

        while (i < data.length) {
            element = readInt();
            size = readInt();
            if (size < 0) break;
            // Title
            if (element === 0x3BA9) {
                while (size-- && i < data.length) {
                    title += String.fromCharCode(data[i++]);
                }
                return decodeURIComponent(escape(title)); // UTF-8 decoding
            }
            else if (element !== 0x8538067 &&   // Segment
                element !== 0x549A966) {        // Info
                i += size;
            }
        }
        return '';
    }

    /**
     * @param {string} userId 
     * @returns {User}
     */
    const getUserById = userId => Storage.getItem('users').find(u => u.id == userId);

    /**
     * @param {string} userId 
     * @returns {boolean}
     */
    const checkIfBlocked = function (userId) {
        const user = getUserById(userId);
        return user && user.blocked;
    }

    /**
     * @param {string} userId 
     * @returns {string}
     */
    const getNoteByUserId = function (userId) {
        const user = getUserById(userId);
        if (user && user.note.length) return user.note;
        return null;
    }

    const getChatWrap = () => _CHAT_INSTANCE.$children[0];

    const getChatInstance = function () {
        const chatWrap = getChatWrap();
        return chatWrap.$children[1] ?
            chatWrap.$children[1] :
            chatWrap.$children[0];
    }

    /**
     * @param {Element} message 
     * @returns {void}
     */
    const mutateMessage = function (message) {
        // Guard against null
        if (message == null) throw new Error('Message cannot be a null!');

        const userName = getChatInstance().store.auth.username;
        // Get all refs from message
        qAll('span[title]', message).forEach(ref => {
            if (ref.innerText.replace('@', '') == userName) {
                message.classList.add('_emanon-ref');
            }
        });

        const exceedThumbLimit = () => qAll('a._emanon-image-thumbnail', message).length > 3

        qAll('a', message).forEach(link => {
            let match;

            switch (link.hostname) {
                case 'i.imgur.com':
                    match = link.href.match(IMG_LINK_REGEX);
                    if (match) {
                        if (exceedThumbLimit()) break;
                        
                        link.classList.add('_emanon-image-thumbnail');

                        link.innerHTML = `<img src="https://i.imgur.com/${match[1]}t.${match[2]}" />`;
                    }
                    break;

                case 'files.catbox.moe':
                    match = link.href.match(CATBOX_LINK_REGEX);
                    if (match) {
                        if (exceedThumbLimit()) break;

                        const [_, id, ext] = match;

                        link.classList.add('_emanon-image-thumbnail');
                        link.innerHTML = `<video src="${link.href}" preload="metadata"></video>`

                        // Make play button
                        const play = makeEl('i');
                        play.classList.add('fa', 'fa-play-circle', 'play');
                        link.appendChild(play);

                        // Make video overlay
                        const overlay = makeEl('div');
                        overlay.classList.add('play-overlay');
                        link.appendChild(overlay);

                        // Load webm title
                        if (ext == 'webm') {
                            const item = Cache.getItem(id);
                            if (item) {
                                link.setAttribute('title', item.title);
                                return;
                            }

                            // Not fancy, but ok
                            GM.xmlHttpRequest({
                                method: 'GET',
                                url: link.href,
                                responseType: 'arraybuffer',
                                headers: {
                                    Range: 'bytes=0-1023',
                                },
                                onload: res => {
                                    if (res.status >= 200 && res.status < 400) {
                                        const title = getMatroskaTitle(res.response);
                                        if (title) {
                                            Cache.setItem(id, title);
                                            link.setAttribute('title', title);
                                        }
                                    }
                                },
                                onerror: res => console.error(res.responseText)
                            });
                        }
                    }
                    break;

                case 'm.youtube.com':
                case 'youtu.be':
                case 'youtube.com':
                case 'www.youtu.be':
                case 'www.youtube.com':
                    match = link.href.match(YT_LINK_REGEX);
                    if (match) {
                        const id = match[1];
                        const linkTmp = title => `<i class="fa fa-youtube"></i> Youtube: ${title}`;
                        
                        const item = Cache.getItem(id);
                        if (item) {
                            link.innerHTML = linkTmp(item.title);
                            return;
                        }

                        fetch(`https://www.googleapis.com/youtube/v3/videos?key=${YT_API_KEY}&part=snippet&id=${id}`)
                            .then(res => res.json())
                            .then(body => {
                                if (body.items.length) {
                                    const title = body.items[0].snippet.title;
                                    Cache.setItem(id, title);
                                    link.innerHTML = linkTmp(title);
                                }
                            })
                            .catch(err => console.error(err));
                    }
                    break;

                case 'coub.com':
                case 'www.coub.com':
                    match = link.href.match(COUB_LINK_REGEX);
                    if (match) {
                        const id = match[1];
                        const linkTmp = title => `<i class="fa fa-play-circle"></i> Coub: ${title}`;

                        const item = Cache.getItem(id);
                        if (item) {
                            link.innerHTML = linkTmp(item.title);
                            return;
                        }
                        
                        GM.xmlHttpRequest({
                            method: 'GET',
                            url: `https://coub.com/api/v2/coubs/${id}`,
                            onload: res => {
                                if (res.status == 200) {
                                    const body = JSON.parse(res.responseText);
                                    Cache.setItem(id, body.title);
                                    link.innerHTML = linkTmp(body.title);
                                }
                            },
                            onerror: res => console.error(res.responseText)
                        });
                    }
                    break;
            }
        });

        // Apply mutations
        emanonApi.messageMutations.forEach(m => m(message));
    }

    const mutateNode = function (node) {
        console.log("New node added!");
        const avaWrap = q('.chat-item__ava-wrap', node);
        const userId = q('.chat-item__avatar', avaWrap)
            .getAttribute('src').split('/')[3];

        const userNameEl = q('.chat-item__username', node);
        userNameEl.setAttribute('title', userNameEl.innerText);

        // Wrap username
        const userNameWrap = makeEl('div');
        userNameWrap.classList.add("_emanon-username-wrap");
        userNameWrap.appendChild(userNameEl.cloneNode(true));
        userNameEl.remove();
        q('.chat-item__header-content', node).prepend(userNameWrap);

        // Add hide icon
        const dateEl = q('.chat-item__date', node);
        const hideEl = makeEl('span');
        hideEl.classList.add('fa', 'fa-eye-slash', 'tooltip', '_emanon-hide-button');
        hideEl.setAttribute('aria-label', 'Скрывать сообщения от этого пользователя');
        hideEl.setAttribute('data-place', 'bottom-end');
        hideEl.addEventListener('click', _ => toogleHidden());
        dateEl.parentNode.insertBefore(hideEl, dateEl);

        if (checkIfBlocked(userId)) {
            node.prepend(makeHiddenBlock());
        }

        function makeHiddenBlock() {
            const aHiddenLink = makeEl('div');
            aHiddenLink.innerText = 'Сообщение скрыто. Раскрыть>>';
            aHiddenLink.classList.add('_emanon-hidden-info');
            aHiddenLink.addEventListener('click', _ => toogleHidden());
            return aHiddenLink;
        }

        function toogleHidden() {
            const hiddenLink = q('._emanon-hidden-info', node);
            const blocked = hiddenLink != null;
            if (blocked) {
                hiddenLink.remove();
            }
            else {
                node.prepend(makeHiddenBlock());
            }

            const users = Storage.getItem('users');
            const index = users.findIndex(u => u.id == userId);
            // Save to storage
            if (index != -1) users[index].blocked = !blocked;
            else users.push(new User(userId, '', !blocked));
            Storage.setItem('users', users);
        }

        // Add note tooltip
        const note = getNoteByUserId(userId);
        if (note) {
            avaWrap.setAttribute('aria-label', note);
            avaWrap.setAttribute('data-place', 'bottom-start');
            avaWrap.classList.add('tooltip', '_emanon-note-tooltip');
        }

        // Apply mutations
        emanonApi.nodeMutatons.forEach(m => m(node));

        mutateMessage(q('.chat-item__message', node));
    }

    // Let's play
    GM_addStyle("[contentEditable=true]:empty:not(:focus):before{ content:attr(data-placeholder); color: #999; }");
    GM_addStyle("._emanon-file-input { position: absolute; left: 0; top: 0; width: 40px; height: 40px; opacity: 0; overflow: hidden; z-index: 1; }");
    GM_addStyle("._emanon-icon_container { position: absolute; left: 0; top: 0; width: 40px; height: 40px; text-align: center; font-size: 20px; color: #818181; border: 0; background: none; }");
    GM_addStyle("._emanon-image-thumbnail { display: inline-flex; justify-content: center; align-items: center; vertical-align: top; border: 1px solid #b1b1b1 !important; margin: 1px; line-height: 0; font-size: 0; position: relative; text-decoration: none; }");
    GM_addStyle("._emanon-image-thumbnail:first-child { margin-left: 0; }");
    GM_addStyle("._emanon-image-thumbnail:last-child:not(:only-child) { margin-right: 0; }");
    GM_addStyle("._emanon-image-thumbnail > img, ._emanon-image-thumbnail > video { max-height: 160px; max-width: 160px; }");
    GM_addStyle("._emanon-image-thumbnail .play { position: absolute; font-size: 30px; color: #f77519; z-index: 1; }");
    GM_addStyle("._emanon-image-thumbnail .play-overlay { position: absolute; width: 100%; height: 100%; background: #00000096; z-index: 0; }");
    GM_addStyle("._emanon-viewbox { position: fixed; background: rgba(0,0,0,0.9); z-index: 9999; width: 100%; height: 100%; top: 0; left: 0; display: flex; justify-content: center; align-items: center; }");
    GM_addStyle("._emanon-viewbox > * { width: auto; height: auto; max-width: 99%; max-height: 99%; padding: 0; margin: 0; }");
    GM_addStyle("._emanon-note-tooltip:after { width: 240px; white-space: normal; word-wrap: break-word; padding: 8px; height: initial; z-index: 1; }");
    GM_addStyle("._emanon-hidden-info { text-align: center; color: #cacaca; font-size: 12px; cursor: pointer; }");
    GM_addStyle("._emanon-hidden-info ~ * { display: none; }");
    GM_addStyle("._emanon-hide-button { position: absolute; right: 0; color: #ccc; cursor: pointer; }");
    GM_addStyle("._emanon-hide-button:hover { color: #868e96; }");
    GM_addStyle("._emanon-unread-item { background: #ffecec; }");
    GM_addStyle(".chat-item__header { position: relative; }"); // Fix for hide button
    GM_addStyle(".chat-send > .comment-reply__editor { background: initial !important; min-height: initial; border: none !important; }");
    GM_addStyle("._emanon-username-wrap { width: 90%; display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }") // Fix long nicknames
    GM_addStyle("._emanon-rotate { transform: rotate(+180deg); transition-duration: 0.5s; }");
    GM_addStyle("._emanon-ref { color: #ff4db6 !important; }");

    // Init storage
    Storage.fill();
    Cache.truncateOld();

    // Append users notes block
    const profileInfo = q('.profile-info');
    if (profileInfo) {
        const userId = window.location.pathname.match(/\d+/)[0];

        const panel = makeEl('div');
        panel.classList.add('aside__panel', 'paper');

        const title = makeEl('h3');
        title.classList.add('aside__title');
        const titleText = makeEl('span');
        titleText.classList.add('aside__title-inner');
        titleText.innerText = 'Заметки о пользователе';
        title.appendChild(titleText);

        const panelBody = makeEl('div');
        panelBody.classList.add('aside__content');
        panelBody.contentEditable = true;
        panelBody.setAttribute('data-placeholder', 'Здесь можно оставить комментарий о пользователе..');

        // Get note from storage
        const note = getNoteByUserId(userId);
        if (note) panelBody.innerText = note;

        panelBody.addEventListener('input', e => {
            const target = e.target;
            const users = Storage.getItem('users');
            const index = users.findIndex(u => u.id == userId);
            // Update note
            if (index != -1) {
                users[index].note = target.innerText
            }
            // Add new user
            else {
                users.push(new User(userId, target.innerText, false));
            }
            Storage.setItem('users', users);
        });

        panel.appendChild(title);
        panel.appendChild(panelBody);
        profileInfo.appendChild(panel);
    }

    // Ugly hack
    const chatInitInterval = setInterval(() => {
        console.log('Try to init chat');
        if (_CHAT_INSTANCE && _CHAT_INSTANCE._isMounted) {
            clearInterval(chatInitInterval);
            console.log('Chat init');

            // Присасывамся ( ͡° ͜ʖ ͡°)
            const CHAT_WRAP = getChatWrap();
            const CHAT_INSTANCE = getChatInstance();

            const chat = q('.chat');

            // Add File uploading
            const sendEl = q('.chat-send', chat);
            const fileInput = makeEl('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*,video/webm,video/mp4';
            fileInput.classList.add('_emanon-file-input');

            const iconCont = makeEl('button');
            iconCont.classList.add('_emanon-icon_container');
            const uploadIcon = makeEl('i');
            uploadIcon.classList.add('fa', 'fa-upload');

            fileInput.addEventListener('change', e => {
                const files = e.target.files;
                if (files.length > 0) {
                    const file = files[0];
                    const sendBtn = q('.chat-send__button', sendEl);

                    // Change icon
                    uploadIcon.classList.remove('fa-upload');
                    uploadIcon.classList.add('fa-spinner', 'fa-spin');
                    sendBtn.disabled = true;
                    fileInput.disabled = true;

                    const resetUpload = function () {
                        uploadIcon.classList.add('fa-upload');
                        uploadIcon.classList.remove('fa-spinner', 'fa-spin');
                        sendBtn.disabled = false;
                        fileInput.value = "";
                        fileInput.disabled = false;
                    }

                    const appendLink = function (link) {
                        let text = CHAT_INSTANCE.store.text;
                        if (text) text = text + '\r\n';
                        CHAT_INSTANCE.store.text = text + link;
                        console.log(`Image link ${link}`);
                    }

                    if (file.type.includes('video')) {
                        const formData = new FormData();
                        formData.append('reqtype', 'fileupload');
                        formData.append('userhash', '');
                        formData.append('fileToUpload', file);

                        GM.xmlHttpRequest({
                            method: "POST",
                            url: 'https://catbox.moe/user/api.php',
                            data: formData,
                            onload: res => {
                                if (res.status == 200) {
                                    appendLink(res.responseText);
                                }
                            },
                            onerror: res => console.error(res.responseText),
                            onreadystatechange: xhr => {
                                if (xhr.readyState === XMLHttpRequest.DONE) {
                                    resetUpload();
                                }
                            }
                        });
                    }
                    else {
                        const formData = new FormData();
                        formData.append('image', file);
                        const headers = new Headers();
                        headers.append('Authorization', `Client-ID ${IMG_CLIENT_ID}`);

                        fetch('https://api.imgur.com/3/image', {
                            method: 'POST',
                            body: formData,
                            headers: headers,
                        })
                            .then(res => res.json())
                            .then(body => {
                                if (body.success) {
                                    appendLink(body.data.link);
                                }
                            })
                            .catch(err => console.error(err))
                            .finally(() => resetUpload());
                    }
                }
            });

            iconCont.appendChild(uploadIcon);
            iconCont.appendChild(fileInput);
            // Fix padding
            const textArea = q('.chat-send__area', sendEl);
            textArea.style.paddingLeft = '45px';

            sendEl.prepend(iconCont);

            // Add check messages action
            if (CHAT_WRAP.settings.inWindow) {
                const checkButton = makeEl('i');
                checkButton.classList.add('fa', 'fa-fw', 'fa-refresh');
                checkButton.addEventListener('click', () => {
                    checkButton.classList.remove('_emanon-rotate');
                    setTimeout(() => checkButton.classList.add('_emanon-rotate'), 0);
                    CHAT_INSTANCE.checkMessages();
                });
                const actionWrap = makeEl('div');
                actionWrap.classList.add('chat-wrap__action');
                actionWrap.appendChild(checkButton);
                q('.chat-wrap__actions').prepend(actionWrap);
            }

            // Working with chat items
            const chatItems = q('.chat__items', chat);
            // Mutate chat items
            qAll('.chat-item', chatItems).forEach(item => mutateNode(item));

            chatItems.addEventListener('click', e => {
                // Add viewbox
                const target = e.target;
                if (target.closest('._emanon-image-thumbnail')) {
                    e.preventDefault();
                    createViewBox(target.parentElement.href);
                }
                // Remove unread mark
                qAll('._emanon-unread-item', chatItems)
                    .forEach(item => item.classList.remove('_emanon-unread-item'));
            });

            // Add counters
            const titleCounter = new TitleCounter();
            const resetTitle = function () {
                if (isElementInViewport(chatItems)) {
                    titleCounter.resetCounter();
                }
            }

            addEventListener('click', _ => resetTitle());
            addEventListener('focus', _ => resetTitle());
            addEventListener('scroll', _ => resetTitle());

            const chatCounter = new ChatMessageCounter();
            const chatWrap = q('.chat-wrap__title');
            if (chatWrap) {
                chatWrap.appendChild(chatCounter.counterEl);
                // Yep, use timeout
                chatWrap.addEventListener('click', _ => setTimeout(() => {
                    if (CHAT_WRAP.isOpen) {
                        chatCounter.resetCounter();
                    }
                }, 100));
            }

            let initCounters = true; // HAHAHAH
            // Add chat observer
            const chatObserver = new MutationObserver(mutationsList => {
                mutationsList.forEach(mutation =>
                    mutation.addedNodes.forEach(node => {
                        if (node.tagName == 'DIV' &&
                            node.classList.contains('chat-item')) {
                            // Increment counters
                            if (!initCounters) {
                                if (document.hidden) titleCounter.incrementCounter();
                                if (!CHAT_WRAP.isOpen) chatCounter.incrementCounter();
                                // Mark as unread
                                if (document.hidden || chatWrap && !CHAT_WRAP.isOpen) {
                                    node.classList.add('_emanon-unread-item');
                                }
                            }
                            mutateNode(node);
                        }
                    })
                )
                initCounters = false;
            });
            chatObserver.observe(chatItems, { childList: true, subtree: false, attributes: false });

            // Add message preview observer
            const previewObserver = new MutationObserver(mutationsList =>
                mutationsList.forEach(mutation =>
                    mutation.addedNodes.forEach(node => {
                        if (node.classList.contains('tippy-popper') &&
                            // Not already mutated
                            !node.classList.contains('_emanon-mutated')) {
                            const chatPvInterval = setInterval(() => {
                                if (node.getAttribute('data-init') == 'true') {
                                    clearInterval(chatPvInterval);
                                    node.classList.add('_emanon-mutated');
                                    mutateMessage(q('.message-preview__content', node));
                                }
                            }, 50);
                        }
                    }
                    )
                ));
            previewObserver.observe(q('body'), { childList: true, subtree: false, attributes: false });
        }
    }, 50);
})();
