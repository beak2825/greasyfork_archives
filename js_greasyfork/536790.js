// ==UserScript==
// @name         4PDA Link Checker
// @author       brant34
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Проверка ссылок + нарушений 3.9 (с обработкой скрытых/удалённых постов, с переходом к ним)
// @match        https://4pda.to/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/536790/4PDA%20Link%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/536790/4PDA%20Link%20Checker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
    #link-checker-panel {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        background: #0055A4;
        color: #fff;
        padding: 10px;
        font-size: 14px;
        border-bottom: 1px solid #004080;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        border-radius: 0 0 6px 6px;
        max-height: 200px;
        overflow-y: auto;
        transition: max-height 0.3s ease;
    }

    #link-checker-panel.collapsed {
        max-height: 28px !important;
        overflow: hidden !important;
    }
    #link-checker-panel.collapsed #link-checker-list,
    #link-checker-panel.collapsed #link-checker-menu {
        display: none !important;
    }

    #link-checker-menu {
        margin-top: 8px;
        display: none;
    }
    #link-checker-menu button {
        margin-right: 8px;
        margin-bottom: 4px;
        background: #ffffff22;
        color: #fff;
        border: 1px solid #fff;
        border-radius: 4px;
        padding: 3px 6px;
        cursor: pointer;
    }
    #link-checker-header {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .link-checker-entry[data-keyword] {
        background-color: #fff3e0;
        border-left: 3px solid orange;
        padding: 2px;
        margin-bottom: 2px;
    }

    .link-checker-entry a {
        color: #ffe;
    }

    #ignore-domains-modal {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        z-index: 10000;
        color: #000;
    }

    #ignore-domains-modal.show {
        display: block;
    }

    #modal-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
    }

    #modal-overlay.show {
        display: block;
    }

    #domain-list li {
        cursor: pointer;
        padding: 5px;
        margin-bottom: 5px;
        border-radius: 3px;
    }

    #domain-list li:hover {
        background-color: #f0f0f0;
    }
    `;
    document.head.appendChild(style);

    const links = document.querySelectorAll('a[href*="4pda.to/stat/go?u="]');
    let pendingRequests = links.length;
    let brokenLinksCount = 0;

    const rule39Exceptions = [
        'https://vk.com/4pdaru',
        'http://vk.com/4pdaru',
        'https://t.me/real4pda'
    ];

    const rule39Hosts = [
        'boosty.to',
        'gofile.io',
        'hyp.sh',
        'halabtech.com',
        'needrom.com',
        't.me',
        'tx.me',
        'telegram.org',
        'terabox.com',
        'vk.com'
    ];

    const skipHosts = [
        'https://invisioncommunity.com',
        'https://twitter.com/4pdaru',
        'http://www.invisionboard.com',
        'http://www.invisionpower.com'
    ];

    const skipUrls = [
        'http://twitter.com/4pdaru',
        'https://twitter.com/4pdaru'
    ];

    // Базовый список проблемных хостов
    const defaultKnownFalse403Hosts = [
        't.me',
        'tx.me',
        'telegram.org',
        'vk.com',
        'samsung.com',
        'kfhost.net',
        'samsung-up.com'
    ];

    // Получение или инициализация списка игнорируемых доменов
    let ignoredDomains = GM_getValue('ignoredDomains', [...defaultKnownFalse403Hosts]);

    const panel = document.createElement('div');
    panel.id = 'link-checker-panel';

    const header = document.createElement('div');
    header.id = 'link-checker-header';

    const gear = document.createElement('span');
    gear.innerHTML = '⚙️';
    gear.style.cursor = 'pointer';
    gear.title = 'Меню';
    header.appendChild(gear);

    const title = document.createElement('span');
    title.innerHTML = `<b>Проверка ссылок... (${pendingRequests} осталось)</b>`;
    title.id = 'link-checker-title';
    header.appendChild(title);

    panel.appendChild(header);

    const menu = document.createElement('div');
    menu.id = 'link-checker-menu';
    menu.innerHTML = `
        <button id="manual-check">🔄 Ручной поиск</button>
        <button id="remove-broken">🗑 Скрыть битые ссылки</button>
        <button id="ignore-domains">⚠️ Настроить игнорируемые домены</button>
    `;
    panel.appendChild(menu);

    const container = document.createElement('div');
    container.id = 'link-checker-list';
    panel.appendChild(container);

    document.body.appendChild(panel);

    const panelEntries = new Map();

    // Рекурсивная проверка текста
    function getAllTextContent(element) {
        let text = '';
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            text += node.textContent.trim();
        }
        return text;
    }

    // Проверка видимости поста
    function isPostVisible(post) {
        if (!post) return false;
        const table = post.closest('table[data-post]');
        const isInDOM = document.contains(post);
        const hasOffsetParent = post.offsetParent !== null;
        const style = table ? window.getComputedStyle(table) : window.getComputedStyle(post);
        const isHiddenByClass = table && (table.classList.contains('hidepin') || table.classList.contains('deletedpost'));
        const isHiddenByStyle = style.display === 'none' || style.visibility === 'hidden';
        const content = getAllTextContent(post);
        const isHiddenByText = content.includes('[HIDE]');
        const isDeletedByText = content.includes('[DELETE]');
        console.log(`Проверка видимости: ${post.id}, inDOM: ${isInDOM}, offsetParent: ${hasOffsetParent}, hiddenByClass: ${isHiddenByClass}, hiddenByStyle: ${isHiddenByStyle}, hiddenByText: ${isHiddenByText}, deletedByText: ${isDeletedByText}, content: "${content}"`);
        return isInDOM && hasOffsetParent && !isHiddenByClass && !isHiddenByStyle && !isHiddenByText && !isDeletedByText;
    }

    // Поиск слов VPN, ВПН, КВН
    const keywordRegex = /(^|[^а-яa-z0-9])(VPN|ВПН|КВН)(?![а-яa-z0-9])/gi;
    const posts = document.querySelectorAll('.post_body');

    for (const post of posts) {
        const postContainer = post.closest('div.postcolor[id^="post-"]');
        if (!postContainer) continue;
        if (keywordRegex.test(post.textContent)) {
            const matched = post.textContent.match(keywordRegex).join(', ');
            const postId = postContainer.id;
            const isVisible = isPostVisible(postContainer);
            const entry = document.createElement('div');
            entry.className = 'link-checker-entry';
            entry.setAttribute('data-keyword', 'true');
            entry.setAttribute('data-post-id', postId);
            const entryHTML = `🟠 Найдено слово: <b>${matched}</b> (пост: ${postId})`;
            entry.setAttribute('data-original-html', entryHTML);
            entry.innerHTML = isVisible ? entryHTML : `${entryHTML} <i>(скрыт/удалён)</i>`;
            entry.style.cursor = 'pointer';
            entry.onclick = () => handleEntryClick(postContainer, postId);
            document.getElementById('link-checker-list').appendChild(entry);
            panelEntries.set(postId + '-keyword', { entry, postId });
            if (isVisible) {
                post.style.backgroundColor = '#fff3e0';
                post.style.border = '2px solid orange';
            }
        }
    }

    // Проверка всех ссылок на нарушение правила 3.9
    const allLinks = document.querySelectorAll('a[href]');
    for (const a of allLinks) {
        const href = a.href;
        try {
            const url = new URL(href);
            if (rule39Hosts.some(host => url.hostname.includes(host))) {
                const linkText = a.innerText || 'Без текста';
                addRule39Link(href, linkText, a);
            }
        } catch (e) {
            // ignore malformed URLs
        }
    }

    gear.addEventListener('click', () => {
        menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
    });

    document.getElementById('manual-check')?.addEventListener('click', () => location.reload());

    document.getElementById('remove-broken')?.addEventListener('click', () => {
        document.querySelectorAll('[data-broken-link="true"]').forEach(e => e.remove());
        container.innerHTML = '';
        title.innerHTML = `<b>🛠 Битые ссылки скрыты.</b>`;
        menu.style.display = 'none';
    });

    // Модальное окно для настройки доменов
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'modal-overlay';
    document.body.appendChild(modalOverlay);

    const modal = document.createElement('div');
    modal.id = 'ignore-domains-modal';
    modal.innerHTML = `
        <h3>Игнорируемые домены</h3>
        <p>Введите домен (например, example.com) и нажмите "Добавить". Кликните на домен, чтобы удалить его.</p>
        <input type="text" id="domain-input" placeholder="Домен" style="width: 200px; padding: 5px; margin-right: 10px;">
        <button id="add-domain">Добавить</button>
        <ul id="domain-list" style="list-style-type: none; padding: 0; margin-top: 10px;"></ul>
        <button id="close-modal" style="margin-top: 10px;">Закрыть</button>
    `;
    document.body.appendChild(modal);

    function updateDomainList() {
        const list = document.getElementById('domain-list');
        list.innerHTML = '';
        ignoredDomains.forEach(domain => {
            const li = document.createElement('li');
            li.textContent = domain;
            li.addEventListener('click', () => {
                const index = ignoredDomains.indexOf(domain);
                if (index !== -1) {
                    ignoredDomains.splice(index, 1);
                    updateDomainList();
                    showNotification(`Домен ${domain} удалён из списка игнорируемых.`);
                }
            });
            list.appendChild(li);
        });
        GM_setValue('ignoredDomains', ignoredDomains);
    }

    document.getElementById('ignore-domains')?.addEventListener('click', () => {
        modal.classList.add('show');
        modalOverlay.classList.add('show');
        updateDomainList();
    });

    document.getElementById('close-modal')?.addEventListener('click', () => {
        modal.classList.remove('show');
        modalOverlay.classList.remove('show');
    });

    document.getElementById('add-domain')?.addEventListener('click', () => {
        const input = document.getElementById('domain-input');
        const domain = input.value.trim();
        if (domain && !ignoredDomains.includes(domain)) {
            ignoredDomains.push(domain);
            updateDomainList();
            showNotification(`Домен ${domain} добавлен в список игнорируемых.`);
        }
        input.value = '';
    });

    modalOverlay.addEventListener('click', () => {
        modal.classList.remove('show');
        modalOverlay.classList.remove('show');
    });

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #ff4444; color: white; padding: 10px; border-radius: 4px; z-index: 10000;';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    function addRule39Link(href, linkText, originalLink) {
        if (rule39Exceptions.includes(href)) return;

        const post = originalLink.closest('div.postcolor[id^="post-"]');
        const postId = post ? post.id : 'unknown';
        const isVisible = post ? isPostVisible(post) : false;

        const entry = document.createElement('div');
        entry.className = 'link-checker-entry';
        entry.setAttribute('data-post-id', postId);
        const entryHTML = `🚫 Нарушение п. 3.9: <a href="${href}" target="_blank">${href}</a> (текст: ${linkText}, пост: ${postId})`;
        entry.setAttribute('data-original-html', entryHTML);
        entry.innerHTML = isVisible ? entryHTML : `${entryHTML} <i>(скрыт/удалён)</i>`;
        entry.style.cursor = 'pointer';
        entry.onclick = () => handleEntryClick(post, postId);
        document.getElementById('link-checker-list').appendChild(entry);
        panelEntries.set(postId + '-rule39-' + href, { entry, postId });

        if (isVisible) {
            originalLink.style.border = '2px solid green';
            originalLink.style.backgroundColor = '#e8f5e9';
            originalLink.style.padding = '2px';
            originalLink.title = 'Нарушение правила 3.9 (запрещённый ресурс)';
            originalLink.setAttribute('data-rule-39', 'true');
        }
    }

    function addBrokenLink(realUrl, status, linkText, originalLink) {
        brokenLinksCount++;
        const post = originalLink.closest('div.postcolor[id^="post-"]');
        const postId = post ? post.id : 'unknown';
        const isVisible = post ? isPostVisible(post) : false;

        const entry = document.createElement('div');
        entry.className = 'link-checker-entry';
        entry.setAttribute('data-post-id', postId);
        const entryHTML = `❌ <a href="${realUrl}" target="_blank">${realUrl}</a> (статус: ${status}, текст: ${linkText}, пост: ${postId})`;
        entry.setAttribute('data-original-html', entryHTML);
        entry.innerHTML = isVisible ? entryHTML : `${entryHTML} <i>(скрыт/удалён)</i>`;
        entry.style.cursor = 'pointer';
        entry.onclick = () => handleEntryClick(post, postId);
        document.getElementById('link-checker-list').appendChild(entry);
        panelEntries.set(postId + '-broken-' + realUrl, { entry, postId });

        if (isVisible) {
            originalLink.style.border = '2px solid red';
            originalLink.style.backgroundColor = '#ffebee';
            originalLink.style.padding = '2px';
            originalLink.title = 'Битая ссылка (статус: ' + status + ')';
            originalLink.setAttribute('data-broken-link', 'true');
        }
    }

    function handleEntryClick(post, postId) {
        if (!post) {
            showNotification(`Пост ${postId} не найден в DOM.`);
            return;
        }

        const table = post.closest('table[data-post]');
        const isInDOM = document.contains(post);
        const hasOffsetParent = post.offsetParent !== null;
        const style = table ? window.getComputedStyle(table) : window.getComputedStyle(post);
        const isHiddenByClass = table && (table.classList.contains('hidepin') || table.classList.contains('deletedpost'));
        const isHiddenByStyle = style.display === 'none' || style.visibility === 'hidden';
        const content = getAllTextContent(post);
        const isHiddenByText = content.includes('[HIDE]');
        const isDeletedByText = content.includes('[DELETE]');

        // Прокрутка непосредственно к целевому посту
        post.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Уведомление о статусе поста
        if (!isInDOM) {
            showNotification(`Пост ${postId} отсутствует в DOM.`);
        } else if (!hasOffsetParent) {
            showNotification(`Пост ${postId} не отображается (нет offsetParent).`);
        } else if (isHiddenByClass) {
            showNotification(`Пост ${postId} скрыт/удалён (класс ${table.classList.contains('hidepin') ? 'hidepin' : 'deletedpost'}).`);
        } else if (isHiddenByStyle) {
            showNotification(`Пост ${postId} скрыт стилями (display: ${style.display}, visibility: ${style.visibility}).`);
        } else if (isHiddenByText) {
            showNotification(`Пост ${postId} скрыт текстом [HIDE].`);
        } else if (isDeletedByText) {
            showNotification(`Пост ${postId} удалён текстом [DELETE].`);
        } else {
            showNotification(`Пост ${postId} отображен.`);
        }
    }

    function updatePanel() {
        title.innerHTML = `<b>Проверка ссылок... (${pendingRequests} осталось)</b>`;
        if (pendingRequests === 0) {
            title.innerHTML = `<b>Все ссылки проверены. Найдено ${brokenLinksCount} битых ссылок.</b>`;
        }
    }

    function checkLink(realUrl, linkText, originalLink, method = 'HEAD', attempt = 1) {
        const urlObj = new URL(realUrl);
        const isIgnoredHost = ignoredDomains.some(host => urlObj.hostname.includes(host));

        GM_xmlhttpRequest({
            method: method,
            url: realUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000,
            onload: function (response) {
                console.log(`Ссылка: ${realUrl}, Метод: ${method}, Статус: ${response.status}, Final URL: ${response.finalUrl || 'N/A'}, Response Headers: ${response.responseHeaders || 'N/A'}`);

                // Обработка редиректов
                if ([301, 302, 303, 307, 308].includes(response.status) && response.finalUrl && attempt < 3) {
                    console.log(`Редирект: ${realUrl} -> ${response.finalUrl}`);
                    checkLink(response.finalUrl, linkText, originalLink, method, attempt + 1);
                    return;
                }

                // Пропускаем 403 для игнорируемых хостов
                if (response.status === 403 && isIgnoredHost) {
                    console.log(`Игнорируем 403 для ${realUrl} (игнорируемый хост)`);
                    pendingRequests--;
                    updatePanel();
                    return;
                }

                // Пробуем GET для проблемных хостов при 403
                if (response.status === 403 && !isIgnoredHost && method === 'HEAD' && attempt < 3) {
                    console.log(`Статус 403 для проблемного хоста ${urlObj.hostname}, пробуем GET`);
                    checkLink(realUrl, linkText, originalLink, 'GET', attempt + 1);
                    return;
                }

                // Проверяем другие коды ошибок
                if ([404, 410].includes(response.status)) {
                    addBrokenLink(realUrl, response.status, linkText, originalLink);
                } else if (response.status >= 200 && response.status < 300) {
                    console.log(`Ссылка ${realUrl} рабочая (статус: ${response.status})`);
                } else {
                    console.warn(`Неопределённый статус для ${realUrl}: ${response.status}`);
                }

                pendingRequests--;
                updatePanel();
            },
            onerror: function () {
                console.log(`Ошибка проверки ссылки: ${realUrl}`);
                addBrokenLink(realUrl, 'Ошибка', linkText, originalLink);
                pendingRequests--;
                updatePanel();
            },
            ontimeout: function () {
                console.log(`Таймаут проверки ссылки: ${realUrl}`);
                if (!isIgnoredHost && method === 'HEAD' && attempt < 3) {
                    console.log(`Таймаут для проблемного хоста ${urlObj.hostname}, пробуем GET`);
                    checkLink(realUrl, linkText, originalLink, 'GET', attempt + 1);
                } else {
                    addBrokenLink(realUrl, 'Таймаут', linkText, originalLink);
                    pendingRequests--;
                    updatePanel();
                }
            }
        });
    }

    links.forEach((a, i) => {
        const urlParams = new URLSearchParams(a.href.split('?')[1]);
        const realUrl = decodeURIComponent(urlParams.get('u') || '');
        const linkText = a.innerText || 'Без текста';

        if (!realUrl) {
            console.warn('Пустой URL найден для ссылки:', a.href);
            pendingRequests--;
            updatePanel();
            return;
        }

        if (skipUrls.includes(realUrl) || skipHosts.some(host => realUrl.startsWith(host))) {
            console.log(`⏩ Пропущена ссылка: ${realUrl}`);
            pendingRequests--;
            updatePanel();
            return;
        }

        if (rule39Hosts.some(host => realUrl.includes(host))) {
            addRule39Link(realUrl, linkText, a);
        }

        setTimeout(() => {
            checkLink(realUrl, linkText, a);
        }, i * 100);
    });

    if (links.length === 0) {
        title.innerHTML = `<b>Ссылок для проверки не найдено.</b>`;
    }

    function getVisibleText(element) {
        const clone = element.cloneNode(true);
        clone.querySelectorAll('script, style').forEach(el => el.remove());
        let text = '';
        const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT, null, false);
        while (walker.nextNode()) {
            text += walker.currentNode.nodeValue + ' ';
        }
        const links = clone.querySelectorAll('a[href]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href) text += ' ' + href;
            const linkText = link.textContent.trim();
            if (linkText) text += ' ' + linkText;
        });
        text = text.replace(/\[.\]/g, '.').replace(/[-_]/g, '.');
        return text.replace(/[\n\r\s]+/g, ' ').toLowerCase().trim();
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            const posts = document.querySelectorAll('div.postcolor[id^="post-"]');
            for (const post of posts) {
                const postId = post.id;
                const text = getVisibleText(post);
                console.log("VPN-тест: пост", post.id, "| текст:", text);
                if (text.includes('vpn') || text.includes('квн') || text.includes('впн')) {
                    const isVisible = isPostVisible(post);
                    const entry = document.createElement('div');
                    entry.className = 'link-checker-entry';
                    entry.setAttribute('data-post-id', postId);
                    const entryHTML = `⚠️ Обсуждение VPN (пост: ${postId})`;
                    entry.setAttribute('data-original-html', entryHTML);
                    entry.innerHTML = isVisible ? entryHTML : `${entryHTML} <i>(скрыт/удалён)</i>`;
                    entry.style.cursor = 'pointer';
                    entry.onclick = () => handleEntryClick(post, postId);
                    document.getElementById('link-checker-list').appendChild(entry);
                    panelEntries.set(postId + '-vpn', { entry, postId });
                    if (isVisible) {
                        post.style.backgroundColor = '#fff3e0';
                        post.style.border = '2px solid orange';
                        post.title = 'Обсуждение VPN';
                        post.setAttribute('data-rule-39', 'true');
                    }
                }
            }
        }, 1000);
    });

    const postContainer = document.querySelector('.ipsForum_topic') || document.body;
    const observer = new MutationObserver((mutations) => {
        let needsUpdate = false;
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const node of mutation.removedNodes) {
                    const post = node.querySelector('div.postcolor[id^="post-"]') || node.closest('div.postcolor[id^="post-"]');
                    if (post) {
                        needsUpdate = true;
                        console.log(`Обнаружено удаление поста: ${post.id}`);
                        break;
                    }
                }
                for (const node of mutation.addedNodes) {
                    const post = node.querySelector('div.postcolor[id^="post-"]') || node.closest('div.postcolor[id^="post-"]');
                    if (post) {
                        needsUpdate = true;
                        console.log(`Обнаружено добавление поста: ${post.id}`);
                    }
                }
            } else if (mutation.type === 'characterData') {
                const post = mutation.target.parentNode.closest('div.postcolor[id^="post-"]');
                if (post) {
                    needsUpdate = true;
                    console.log(`Изменение текста в посте: ${post.id}`);
                }
            } else if (mutation.type === 'attributes') {
                const post = mutation.target.closest('div.postcolor[id^="post-"]');
                if (post || mutation.target.classList.contains('hidepin') || mutation.target.classList.contains('deletedpost')) {
                    needsUpdate = true;
                    console.log(`Изменение атрибутов или классов (hidepin/deletedpost): ${post ? post.id : 'неизвестно'}`);
                }
            }
        }
        if (needsUpdate) {
            setTimeout(() => {
                panelEntries.forEach(({ entry, postId }) => {
                    const post = document.querySelector(`div.postcolor[id="${postId}"]`);
                    const isVisible = post ? isPostVisible(post) : false;
                    const originalHTML = entry.getAttribute('data-original-html');
                    entry.innerHTML = isVisible ? originalHTML : `${originalHTML} <i>(скрыт/удалён)</i>`;
                    console.log(`Обновление статуса поста: ${postId}, visible: ${isVisible}`);
                });
            }, 500);
        }
    });

    observer.observe(postContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'hidden'],
        characterData: true
    });

    setInterval(() => {
        let needsUpdate = false;
        panelEntries.forEach(({ entry, postId }) => {
            const post = document.querySelector(`div.postcolor[id="${postId}"]`);
            const isVisible = post ? isPostVisible(post) : false;
            const originalHTML = entry.getAttribute('data-original-html');
            const currentHTML = entry.innerHTML;
            const expectedHTML = isVisible ? originalHTML : `${originalHTML} <i>(скрыт/удалён)</i>`;
            if (currentHTML !== expectedHTML) {
                entry.innerHTML = expectedHTML;
                console.log(`Периодическое обновление статуса поста: ${postId}, visible: ${isVisible}`);
                needsUpdate = true;
            }
        });
        if (needsUpdate) {
            console.log('Периодическая проверка: обновлены статусы постов');
        }
    }, 2000);
})();
