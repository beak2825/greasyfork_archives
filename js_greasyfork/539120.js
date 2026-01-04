// ==UserScript==
// @name         kone user note
// @namespace    http://tampermonkey.net/
// @version      0.8.1
// @license      MIT
// @description  For Script User Blocking and Memo
// @author       onanymous
// @match        https://kone.gg/s/*
// @exclude      https://kone.gg/s/*/write
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kone.gg
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      api.kone.gg
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539120/kone%20user%20note.user.js
// @updateURL https://update.greasyfork.org/scripts/539120/kone%20user%20note.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ARTICLE_SELECTOR = 'div.overflow-hidden .flex.items-end a.hover\\:underline span';
    const DB_NAME = 'koneUserNoteDB';
    const STORE_NAME = 'users';
    let isHidden = true;

    const USER_BLOCK_MENU_STYLE = {
        position: 'absolute',
        background: '#222',
        color: '#fff',
        padding: '10px 18px',
        borderRadius: '8px',
        fontSize: '14px',
        zIndex: 999999,
        boxShadow: '0 2px 8px rgba(0,0,0,0.16)'
    };
    const USER_BLOCK_USER_LABEL_STYLE = {
        fontWeight: "bold",
        marginBottom: "2px",
        pointerEvents: "none"
    };
    const USER_BLOCK_NOTE_LABEL_STYLE = {
        color: "#ffeb3b",
        marginBottom: "6px",
        fontSize: "13px",
        pointerEvents: "none"
    };
    const USER_BLOCK_BTN_WRAP_STYLE = {
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    };

    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'handle' });
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async function getBlockUsers() {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.getAll();
            request.onsuccess = () => resolve(
                request.result.filter(u => u.block === true).flatMap(u => u.handle)
            );
            request.onerror = () => reject(request.error);
        });
    }

    async function getAllUser() {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.getAll();
            request.onsuccess = () => resolve(
                request.result.map(u => ({ handle: u.handle, block: u.block, username: u.username, note: u.note }))
            );
            request.onerror = () => reject(request.error);
        });
    }

    async function getUser(handle) {
        const db = await openDB();
        handle = handle.toLowerCase();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const req = tx.objectStore(STORE_NAME).get(handle);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async function getNote(handle) {
        const db = await openDB();
        handle = handle.toLowerCase();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const req = tx.objectStore(STORE_NAME).get(handle);
            req.onsuccess = () => resolve(req.result && req.result.note ? req.result.note : '');
            req.onerror = () => reject(req.error);
        });
    }

    async function addBlockUser(handle, username) {
        const db = await openDB();
        handle = handle.toLowerCase();
        username = username.toLowerCase();

        let user = await getUser(handle);
        let usernameArr = [];
        if (user) {
            const set = new Set(user.username.slice());
            set.add(username);
            usernameArr = Array.from(set);
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).put({ handle, block: true, username: usernameArr, note: user.note || "" });
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
            });
        } else {
            usernameArr = [username];
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).put({ handle, block: true, username: usernameArr });
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
            });
        }
    }

    async function addNote(handle, username, note, overwrite = false) {
        const db = await openDB();
        handle = handle.toLowerCase();
        username = username.toLowerCase();

        let user = await getUser(handle);
        let usernameArr = [];

        if (user) {
            const set = new Set(user.username.slice());
            set.add(username);
            usernameArr = Array.from(set);
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).put({
                    handle,
                    block: user.block,
                    username: usernameArr,
                    note: overwrite ? note : (user.note ? (user.note + "\n" + note) : note)
                });
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
            });
        } else {
            usernameArr = [username];
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).put({ handle, block: false, username: usernameArr, note: note });
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
            });
        }
    }


    async function removeUser(handle) {
        const db = await openDB();
        handle = handle.toLowerCase();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).delete(handle);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async function removeAllBlockUser() {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);

            const request = store.getAll();
            request.onsuccess = () => {
                const blocked = request.result.filter(u => u.block === true);
                blocked.forEach(u => store.delete(u.handle));
            };

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    function getHandleFromRow(el) {
        const writerDiv = el.querySelector('a div.text-xs div.text-ellipsis');
        return writerDiv ? writerDiv.dataset.handle : '';
    }

    function targetList(articles) {
        const targets = [
            ...document.querySelectorAll('div.group\\/post-wrapper'),
            ...document.querySelectorAll('div.grow.flex div.flex-col div.grid > div.contents')
        ];
        targets.forEach(row => {
            const titleSpan = row.querySelector('span.overflow-hidden.text-nowrap.text-ellipsis');
            if (!titleSpan) return;
            const title = titleSpan.textContent.trim();
            const article = articles.find(a => a.title.trim() === title);
            if (!article) return;
            const writerDiv = row.querySelector('.overflow-hidden.text-center.whitespace-nowrap.text-ellipsis');
            writerDiv.setAttribute('data-handle', article.writer.handle);
        });
    }

    function targetArticle(article, comments) {
        const nodeList = document.querySelectorAll(ARTICLE_SELECTOR);
        const [articleAuthor, ...rest] = Array.from(nodeList);
        articleAuthor.setAttribute('data-handle', article.writer.handle)
        comments.forEach(c => {
            const commentSpan = document.querySelector(`#c_${c.id}`).parentElement.parentElement.querySelector(ARTICLE_SELECTOR);
            commentSpan.setAttribute('data-handle', c.handle)
        });
    }

    function flattenComments(arr, result = []) {
        arr.forEach(item => {
            result.push({
                id: item.id,
                content: item.content,
                handle: item.writer.handle,
                display_name: item.writer.display_name
            });
            if (Array.isArray(item.children) && item.children.length > 0) {
                flattenComments(item.children, result);
            }
        });
        return result;
    }

    function getLimitFromPage(defaultLimit = 50) {
        const exact = document.querySelector('div.m-auto[bis_skin_checked]');
        const take = (el) => (el?.textContent || '').trim().replace(/,/g, '');

        let text = take(exact);
        if (/^\d+$/.test(text)) {
            const n = parseInt(text, 10);
            if (Number.isFinite(n) && n > 0) return n;
        }

        for (const el of document.querySelectorAll('div.m-auto')) {
            text = take(el);
            if (/^\d+$/.test(text)) {
                const n = parseInt(text, 10);
                if (Number.isFinite(n) && n > 0) return n;
            }
        }

        return defaultLimit;
    }


    function fetchArticleList({ limit = 50 } = {}, onSuccess, onError) {
        const parts = location.pathname.split('/');
        const subname = parts[2] || '';
        if (!subname) {
            onError && onError(new Error('subname 추출 실패'));
            return;
        }

        const page = parseInt(new URLSearchParams(location.search).get('p') || '1', 10);
        const url = `https://api.kone.gg/v0/article/list/${subname}`;
        const payload = { limit, page };

        GM_xmlhttpRequest({
            method: 'POST',
            url,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            data: JSON.stringify(payload),
            responseType: 'json',
            timeout: 15000,
            onload: (res) => {
                if (res.status >= 200 && res.status < 300) {
                    try {
                        const data = res.response ?? JSON.parse(res.responseText);
                        if (!Array.isArray(data)) throw new Error('응답이 배열이 아님');
                        onSuccess && onSuccess(data);
                    } catch (e) {
                        onError && onError(new Error('JSON 파싱 실패: ' + e.message));
                    }
                } else {
                    onError && onError(new Error(`HTTP ${res.status}: ${res.responseText || ''}`));
                }
            },
            onerror: (err) => onError && onError(new Error('요청 실패: ' + (err.error || 'network error'))),
            ontimeout: () => onError && onError(new Error('요청 타임아웃'))
        });
    }


    function extractData() {
        const raw = (unsafeWindow.__next_f || []).map(x => x[1]).join('');
        if (!raw) return null;
        let anchor = raw.indexOf('10:[');
        if (anchor === -1) {
            anchor = raw.indexOf('e:[');
            if (anchor === -1) return null;
        }
        const start = raw.indexOf('[', anchor);
        if (start === -1) return null;
        let depth = 0, inStr = false, esc = false, end = -1;
        for (let i = start; i < raw.length; i++) {
            const ch = raw[i];

            if (inStr) {
                if (esc) { esc = false; }
                else if (ch === '\\') { esc = true; }
                else if (ch === '"') { inStr = false; }
                continue;
            }
            if (ch === '"') inStr = true;
            else if (ch === '[') depth++;
            else if (ch === ']') {
                depth--;
                if (depth === 0) { end = i + 1; break; }
            }
        }
        if (end === -1) return null;
        const jsonSlice = raw.slice(start, end);
        try {
            const arr = JSON.parse(jsonSlice);
            return arr && arr[3];
        } catch (e) {
            console.error('JSON.parse 실패', e, { jsonSlice });
            return null;
        }
    }

    function loadData() {
        const raw = extractData();
        unsafeWindow.rawData = raw;
        if (!raw) return;

        const limit = getLimitFromPage(50);
        if (!Array.isArray(raw.Articles) || raw.Articles.length === 0) {
            fetchArticleList(
                { limit },
                (list) => {
                    raw.Articles = list;
                    targetList(raw.Articles);
                    if (raw.Article) {
                        targetArticle(raw.Article, flattenComments(raw.Comments));
                    }
                },
                (err) => {
                    console.error(err);
                    if (raw.Articles) targetList(raw.Articles);
                    if (raw.Article) targetArticle(raw.Article, flattenComments(raw.Comments));
                }
            );
            return;
        }

        targetList(raw.Articles);
        if (raw.Article) {
            targetArticle(raw.Article, flattenComments(raw.Comments));
        }
    }


    async function hide() {
        const hiddenUsers = (await getBlockUsers()).map(u => u.toLowerCase());
        if (hiddenUsers.length === 0) return;
        const targets = [
            ...document.querySelectorAll('div.group\\/post-wrapper'),
            ...document.querySelectorAll('div.grow.flex div.flex-col div.grid > div.contents')
        ];
        targets.forEach(el => {
            const username = getHandleFromRow(el);
            if (username && hiddenUsers.includes(username.toLowerCase())) {
                el.style.display = 'none';
                el.dataset.toggled = true;
            }
        });
        document.querySelectorAll(`div.group\\/comment a.hover\\:underline span`).forEach(c => {
            if (c.dataset.toggled === "true") return;
            if (c.dataset.handle && hiddenUsers.includes(c.dataset.handle)) {
                c.dataset.hiddenUserName = c.textContent;
                c.textContent = '[숨김처리 된 유저]';
                c.dataset.toggled = true;
                const profile = c.closest('div.group\\/comment').querySelector('img');
                profile.dataset.hiddenSrc = profile.src;
                profile.src = '/images/profile.png';
                profile.dataset.toggled = true;
                const comment = c.closest('div.group\\/comment').querySelector('p');
                comment.dataset.hiddenContent = comment.textContent;
                comment.textContent = '숨김처리 된 코멘트입니다.';
                comment.classList.add('opacity-50');
                comment.dataset.toggled = true;
            }
        });
    }

    async function show() {
        const hiddenUsers = (await getBlockUsers()).map(u => u.toLowerCase());
        if (hiddenUsers.length === 0) return;
        const targets = [
            ...document.querySelectorAll('div.group\\/post-wrapper'),
            ...document.querySelectorAll('div.grow.flex div.flex-col div.grid > div.contents')
        ];
        targets.forEach(el => {
            if (el.dataset.toggled === "true") {
                el.style.display = '';
                delete el.dataset.toggled;
            }
        });
        document.querySelectorAll('div.group\\/comment a.hover\\:underline span').forEach(c => {
            if (c.dataset.toggled === "true") {
                if (c.dataset.hiddenUserName) {
                    c.textContent = c.dataset.hiddenUserName;
                    delete c.dataset.hiddenUserName;
                }
                delete c.dataset.toggled;
                const commentDiv = c.closest('div.group\\/comment');
                const profile = commentDiv.querySelector('img');
                if (profile && profile.dataset.toggled === "true") {
                    if (profile.dataset.hiddenSrc) {
                        profile.src = profile.dataset.hiddenSrc;
                        delete profile.dataset.hiddenSrc;
                    }
                    delete profile.dataset.toggled;
                }
                const comment = commentDiv.querySelector('p');
                if (comment && comment.dataset.toggled === "true") {
                    if (comment.dataset.hiddenContent) {
                        comment.textContent = comment.dataset.hiddenContent;
                        delete comment.dataset.hiddenContent;
                    }
                    comment.classList.remove('opacity-50');
                    delete comment.dataset.toggled;
                }
            }
        });
    }

    async function displayNote() {
        const userDict = Object.fromEntries((await getAllUser()).map(n => [n.handle, n]));
        document.querySelectorAll(ARTICLE_SELECTOR).forEach(s => {
            const user = userDict[s.dataset.handle];
            if (!user) return;
            const anchor = s.closest('a');
            if (!anchor) return;
            let wrapper = anchor.nextSibling;
            if (wrapper && wrapper.classList && wrapper.classList.contains('note-span-wrapper')) {
                wrapper.querySelector('span').textContent = user.note;
                return;
            }
            wrapper = document.createElement('div');
            wrapper.className = 'note-span-wrapper flex';
            const span = document.createElement('span');
            span.className = 'text-xs';
            span.textContent = user.note;
            wrapper.appendChild(span);
            anchor.parentNode.insertBefore(wrapper, anchor.nextSibling);
        });
    }

    function createDiv(text, styleObj) {
        const div = document.createElement('div');
        div.textContent = text;
        if (styleObj) Object.assign(div.style, styleObj);
        return div;
    }

    function createBlockBtn(el, menu) {
        const btn = createDiv('사용자 차단', { padding: '4px 0', cursor: 'pointer' });
        btn.addEventListener('click', async () => {
            const handle = el.dataset.handle || el.textContent.trim();
            const username = el.textContent.trim();
            await addBlockUser(handle, username);
            alert(`[${el.textContent.trim()}(${el.dataset.handle})] 차단 리스트에 추가됨`);
            menu.remove();
            hide();
        });
        return btn;
    }

    function createNoteBtn(el, menu) {
        const btn = createDiv('메모 수정/추가', { padding: '4px 0', cursor: 'pointer' });
        btn.addEventListener('click', async () => {
            const handle = el.dataset.handle || el.textContent.trim();
            const username = el.textContent.trim();
            const oldNote = await getNote(handle);

            const note = prompt(
                `[${username}(${handle})]에게 남길 메모를 입력:`,
                oldNote || ""
            );

            if (note !== null) {
                await addNote(handle, username, note.trim(), true);
                alert('메모 저장됨');
                await updateAll();
            }
            menu.remove();
        });
        return btn;
    }


    async function showUserBlockMenu(el) {
        if (!el.dataset.handle) return;
        if (window.currentUserBlockMenu) window.currentUserBlockMenu.remove();

        const menu = document.createElement('div');
        const rect = el.getBoundingClientRect();
        Object.assign(menu.style, USER_BLOCK_MENU_STYLE, {
            left: (rect.right + window.scrollX + 8) + 'px',
            top: (rect.top + window.scrollY - 2) + 'px'
        });
        menu.className = 'username-block-menu';

        const userLabel = createDiv(
            `${el.textContent.trim()}(${el.dataset.handle})`,
            USER_BLOCK_USER_LABEL_STYLE
        );

        const note = await getNote(el.dataset.handle);
        let noteLabel = null;
        if (note) noteLabel = createDiv(note, USER_BLOCK_NOTE_LABEL_STYLE);

        const btnWrap = document.createElement('div');
        Object.assign(btnWrap.style, USER_BLOCK_BTN_WRAP_STYLE);
        btnWrap.appendChild(createBlockBtn(el, menu));
        btnWrap.appendChild(createNoteBtn(el, menu));

        menu.appendChild(userLabel);
        if (noteLabel) menu.appendChild(noteLabel);
        menu.appendChild(btnWrap);

        menu.addEventListener('mouseleave', () => menu.remove());
        document.body.appendChild(menu);
        window.currentUserBlockMenu = menu;
    }

    function setupUsernameHoverMenu() {
        let hoverTimer = null;
        function bindMenuToUsernames() {
            const targets = [
                ...document.querySelectorAll('div.group\\/post-wrapper a div.text-xs div.text-ellipsis'),
                ...document.querySelectorAll('div.grow.flex div.flex-col div.grid > div.contents a div.text-xs div.text-ellipsis'),
                ...document.querySelectorAll(ARTICLE_SELECTOR)
            ];
            targets.forEach(el => {
                if (el.dataset.menuBound) return;
                el.dataset.menuBound = "1";
                el.addEventListener('mouseenter', function handler(e) {
                    hoverTimer = setTimeout(() => {
                        showUserBlockMenu(el);
                    }, 100);
                });
                el.addEventListener('mouseleave', () => {
                    clearTimeout(hoverTimer);
                    setTimeout(() => {
                        if (window.currentUserBlockMenu) window.currentUserBlockMenu.remove();
                    }, 3000);
                });
            });
        }
        const mo = new MutationObserver(bindMenuToUsernames);
        mo.observe(document.body, { childList: true, subtree: true });
        bindMenuToUsernames();
    }

    function showButton() {
        const targets = [
            ...document.querySelectorAll('div.group\\/post-wrapper[style*="display: none"]'),
            ...document.querySelectorAll('div.grow.flex div.flex-col div.grid > div.contents[style*="display: none"]')
        ];
        const hidden = targets.length;
        const table = document.querySelector('div.h-full.flex');
        if (!table) return;

        let oldRow = table.querySelector('.hidden-post-counter');
        if (oldRow) oldRow.remove();

        const newRow = document.createElement('div');
        newRow.classList.add('hidden-post-counter', 'ml-auto');
        const innerSpan1 = document.createElement('span');
        innerSpan1.textContent = '숨김처리 된 게시물 : ' + hidden;
        innerSpan1.classList.add('text-[13px]', 'text-center', 'pt-0.5', 'text-nowrap');
        newRow.appendChild(innerSpan1);

        newRow.style.cursor = 'pointer';
        newRow.addEventListener('click', async () => {
            isHidden = !isHidden;
            await updateAll();
        });

        table.insertBefore(newRow, table.firstChild);
    }

    // ====== Tampermonkey 메뉴 등록 ======
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('차단 유저 추가', async () => {
            const handle = prompt('차단할 유저 handle 입력');
            if (!handle) return;
            const users = (await getBlockUsers()).map(u => u.toLowerCase());
            if (!users.includes(handle.toLowerCase())) {
                await addBlockUser(handle, '');
                alert(`[${handle}] 차단 리스트에 추가됨`);
                hide();
            } else {
                alert('이미 추가된 유저임');
            }
        });

        GM_registerMenuCommand('차단 유저 삭제', async () => {
            const users = (await getBlockUsers()).map(u => u.toLowerCase());
            if (users.length === 0) {
                alert('차단 유저 없음');
                return;
            }
            const toRemove = prompt('삭제할 유저 handle 입력 (현재 차단 유저: ' + users.join(', ') + ')');
            if (!toRemove) return;
            if (users.includes(toRemove.toLowerCase())) {
                await removeUser(toRemove);
                alert(`[${toRemove}] 차단 해제됨`);
                hide();
            } else {
                alert(`[${toRemove}]은 차단 리스트에 없음`);
            }
        });

        GM_registerMenuCommand('차단 유저 모두 삭제', async () => {
            await removeAllBlockUser();
            alert('차단 유저 모두 삭제됨');
        });

        GM_registerMenuCommand('차단 유저 목록 보기', async () => {
            const users = await getAllUser();
            const list = users.filter(u => u.block === true).map(u => `${u.username.join(', ')} (${u.handle})`).join('\n');
            alert(users.length > 0 ? list : '차단 유저 없음');
        });

        GM_registerMenuCommand('메모 전체 목록 보기', async () => {
            const notes = (await getAllUser()).filter(u => u.note && u.note.trim() !== '');
            if (notes.length === 0) {
                alert('작성된 메모 없음');
                return;
            }
            alert(notes.map(n => `${n.note} - ${n.username}(${n.handle})`).join('\n'));
        });
    }

    setupUsernameHoverMenu();

    (function removeRouter() {
        history.pushState = function () { };
        history.replaceState = function () { };
        document.addEventListener('click', function (e) {
            const a = e.target.closest('a');
            if (a && a.href && a.target !== '_blank') {
                e.preventDefault();
                window.location.href = a.href;
            }
        }, true);
    })();

    (async () => {
        async function updateAll() {
            loadData();
            if (isHidden) await hide();
            else await show();
            await displayNote();
            showButton();
        }
        window.updateAll = updateAll;
        await updateAll();

        const observer = new MutationObserver(async (mutations) => {
            const onlyMenuChange = mutations.every(mutation =>
                                                   Array.from(mutation.addedNodes).concat(Array.from(mutation.removedNodes))
                                                   .every(node =>
                                                          node.nodeType === 1 &&
                                                          node.classList &&
                                                          node.classList.contains('username-block-menu')
                                                         )
                                                  );
            if (onlyMenuChange) return;
            observer.disconnect();
            await updateAll();
            observer.observe(document.body, { childList: true, subtree: true });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    })();

})();