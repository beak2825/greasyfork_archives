// ==UserScript==
// @name         Lolzteam Multiaccount Finder
// @version      2.2.2
// @description  Your assistant in finding scammers on the forum
// @author       vuchaev2015
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant GM_setValue
// @grant GM_getValue
// @grant GM.setValue
// @grant GM.getValue
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/478029/Lolzteam%20Multiaccount%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/478029/Lolzteam%20Multiaccount%20Finder.meta.js
// ==/UserScript==

// ВНИМАНИЕ ДАННЫЙ СКРИПТ СОДЕРЖИТ БОЛЬШОЕ КОЛИЧЕСТВО ГАВНОКОДА
// ПОЖАЛУЙСТА, НЕ БЕЙТЕ. ГЛАВНОЕ, ЧТО ВСЁ РАБОТАЕТ!.

let domain = 'zelenka.guru';
let keys = ["autocheck-mini-profile", "autocheck-profile", "autocheck-banned-users-mporp", "addbutton-profile", "addbutton-threads", "autocheck-online-registered", "show-blocked-percentage", "show-unblocked-percentage", "show-total-users-ip", "show-blocked-this-month-percentage", "autocheck-newmembers", "autocheck-only-parameters", "autocheck-only-parameters-sympathies", "autocheck-only-parameters-messages", "addbutton-chat", "addbutton-alerts", "addbutton-conversations", "retry-after-error", "fast-switch-with-button", "fast-switch-with-button-key", "switch-page-automatically", "checked-list", "send-scammer-to-telegram", "telegram-bot-token", "telegram-user-id", 'delay-before-switching', 'delay-before-switching-1', 'delay-before-switching-2', 'CircularNavigation', 'ContinueAfterScammerDetected', 'UnmarkBaseUnblocked'];
let values = ["false","false","false","true","true","false","true","true","true","true","false","false","20","50","true","true","true","true","false",'F2',false,[],false,"","","false","1","5",false,false, "true"];
let items = keys.map((key, i) => ({key, value: values[i]}));

async function addItem(item) {
    let currentValue = await checkKeyValue(item.key);
    if (currentValue === undefined) {
        GM_setValue(item.key, item.value);
    }
}

function changeItemValue(key, value) {
    //console.log(key, value)
    GM_setValue(key, value);
}

function addItems(items) {
    items.forEach(item => addItem(item));
}

function checkKeyValue(key) {
    return Promise.resolve(GM_getValue(key));
}

addItems(items);

let accountMenu = document.getElementById("AccountMenu");
let linksList = accountMenu.querySelector(".blockLinksList");
let buttonId = `lmfsettings`;

linksList.insertAdjacentHTML('beforeend', `<li><a href="javascript:void(0)" id="${buttonId}">Multiaccount Finder</a></li>`);

document.getElementById(buttonId).addEventListener("click", function (event) {
    event.preventDefault();
    openSettings();
});

let hrefSearchUsers = document.querySelector('a[href^="/search/search?users="]').href.split('?users=')[1].split('&')[0];
let profileLink = document.querySelector("#AccountMenu > ul > li:nth-child(1) > a").getAttribute("href").split(`${domain}`)[1];

const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const date = new Date();
const month = months[date.getMonth()];

async function isEmptyOrWhitespaces(value) {
    const stringValue = String(value);
    return stringValue.trim() !== '';
}

async function sendTelegramMessage(botToken, chatId, text) {
    try {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`;
        const response = await fetch(url, {method: 'GET'});

        if (response.ok) {
            logWithPrefix('Сообщение в Telegram отправлено');
        } else {
            console.error(`Ошибка: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Ошибка: ${error.message}`);
    }
}

async function waitWithRandomDelay() {
    const useDelay = await checkKeyValue('delay-before-switching');
    if (useDelay) {
        const minDelaySec = parseInt(await checkKeyValue('delay-before-switching-1'), 10);
        const maxDelaySec = parseInt(await checkKeyValue('delay-before-switching-2'), 10);
        const delaySeconds = Math.floor(Math.random() * (maxDelaySec - minDelaySec + 1)) + minDelaySec;
        logWithPrefix(`Спим ${delaySeconds} секунд...`);
        await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
    }
}

async function sendMessageIfConditionsMet(text) {
    const sendToTelegram = await checkKeyValue("send-scammer-to-telegram");
    const botToken = await checkKeyValue("telegram-bot-token");
    const userId = await checkKeyValue("telegram-user-id");

    if (sendToTelegram && await isEmptyOrWhitespaces(botToken) && await isEmptyOrWhitespaces(userId)) {
        await sendTelegramMessage(botToken, userId, text);
    }
}

async function renderCheckboxes(checkboxes, page, lastId) {
    const numCheckboxes = checkboxes.length;
    const checkboxesPerPage = 10;
    const numPages = Math.ceil(numCheckboxes / checkboxesPerPage);
    const startIndex = (page - 1) * checkboxesPerPage;
    const endIndex = page * checkboxesPerPage;
    filteredCheckboxes = checkboxes.slice(startIndex, endIndex);
    let nextPage = page + 1;
    let prevPage = page - 1;
    let content = "";
    const promises = filteredCheckboxes.map(async (checkbox) => {
        let isChecked = await checkKeyValue(checkbox.id) === "true";
        const disabled = checkbox.dependent && !checkbox.dependent.every(async function (dep) {
            return await checkKeyValue(dep) === "true";
        });
        return '<div> <input type="checkbox" id="' + checkbox.id + '-' + lastId + '" name="' + checkbox.id + '-' + lastId + '" ' + (isChecked ? 'checked="checked" ' : '') + (disabled ? 'disabled ' : '') + 'value="1"> ' + checkbox.label + '</div>';
    });
    const results = await Promise.all(promises);
    content = results.join('<br>');

    function renderPage(content) {
        function addPreviousPageButton() {
            if (prevPage >= 1) {
                content += '<br>';
                content += (nextPage <= numPages) ? '<div style="margin-right: 10px; display: inline-block;"><button type="button" name="prev" value="Предыдущая страница" accesskey="s" class="button primary" id="prev-page-' + lastId + '">Предыдущая страница</button></div>' : '<button type="button" name="prev" value="Предыдущая страница" accesskey="s" class="button primary" id="prev-page-' + lastId + '">Предыдущая страница</button>';
            }
        }

        function addNextPageButton() {
            if (nextPage <= numPages) {
                content += (prevPage >= 1) ? '<button type="button" name="next" value="Следующая страница" accesskey="s" class="button primary" id="next-page-' + lastId + '">Следующая страница</button>' : '<br><button type="button" name="next" value="Следующая страница" accesskey="s" class="button primary" id="next-page-' + lastId + '">Следующая страница</button>';
            }
        }

        function addPageNumber() {
            content += '<span style="margin-left: 10px;">Страница: ' + page + ' из ' + numPages + '</span>';
        }
        addPreviousPageButton();
        addNextPageButton();
        addPageNumber()
        return content
    }
    content = await renderPage(content);
    return content
}

let filteredCheckboxes

async function openSettings(page = 1) {
    document.querySelectorAll('div.modal.fade').forEach(el => el.remove());
    const modalBackdrops = document.querySelectorAll('div.modal-backdrop');
    if (modalBackdrops.length > 0) {
        modalBackdrops[modalBackdrops.length - 1].remove();
    }

    const lastId = generateRandomString(10);
    const [telegramBotToken, telegramUserID] = await Promise.all([checkKeyValue('telegram-bot-token'), checkKeyValue('telegram-user-id')]);

    const isEmptyOrWhitespaces = str => {
        const inputStr = String(str);
        return inputStr === null || inputStr.match(/^ *$/) !== null;
    };

    const generateSpanContent = (id, value, isToken) => {
        const spanClass = isToken ? "telegram-bot-token" : "telegram-user-id";
        return !isEmptyOrWhitespaces(value)
            ? `<span id="set-${spanClass}-${id}">${value}</span>`
        : `<span class="prompt-${spanClass}-${id}">не указан</span>`;
    };

    const [telegramBotTokenText, telegramUserIDText] = [generateSpanContent(lastId, telegramBotToken, true), generateSpanContent(lastId, telegramUserID, false)];

    let checkboxes = [
        { id: 'autocheck-profile', label: 'Автоматическая проверка в профиле' },
        { id: 'autocheck-mini-profile', label: 'Автоматическая проверка в мини-профиле' },
        { id: 'autocheck-banned-users-mporp', label: 'Автоматическая проверка для заблокированных', dependent: ['autocheck-profile', 'autocheck-mini-profile'] },
        { id: 'autocheck-newmembers', label: 'Автоматическая проверка новых пользователей в разделе /members' },
        { id: 'autocheck-online-registered', label: 'Автоматическая проверка в разделе /online/?type=registered' },
        { id: 'autocheck-only-parameters', label: `Автоматическая проверка только по параметрам (<span id="sympCount-${lastId}">${await checkKeyValue('autocheck-only-parameters-sympathies')}</span> симпатий и <span id="msgCount-${lastId}">${await checkKeyValue('autocheck-only-parameters-messages')}</span> сообщений)` },
        { id: 'addbutton-threads', label: 'Кнопка на посты и комментарии в теме (три точки)' },
        { id: 'addbutton-chat', label: 'Кнопка на сообщения в чате (три точки)' },
        { id: 'addbutton-profile', label: 'Кнопка на посты и комментарии в профиле (три точки)' },
        { id: 'addbutton-alerts', label: 'Кнопка на уведомления (три точки)' },
        { id: 'addbutton-conversations', label: 'Кнопка на диалоги в личных сообщениях (три точки)' },
        { id: 'show-blocked-percentage', label: 'Отображать в подробной информации % заблокированных' },
        { id: 'show-unblocked-percentage', label: 'Отображать в подробной информации % не заблокированных' },
        { id: 'show-total-users-ip', label: 'Отображать в подробной информации общее количество пользователей в общих IP' },
        { id: 'show-blocked-this-month-percentage', label: 'Отображать в подробной информации % от заблокированных в этом месяце' },
        { id: 'fast-switch-with-button', label: `Быстрое переключение на следующую страницу кнопкой <span id="buttonkey-${lastId}">${await checkKeyValue('fast-switch-with-button-key')}</span>` },
        { id: 'retry-after-error', label: 'Повторная проверка после ошибки Name not found (15000 ms)' },
        { id: 'switch-page-automatically', label: 'Переключать на следующую страницу автоматически (пока не найдет мошенника)' },
        { id: 'delay-before-switching', label: `Задержка перед переключением страницы, в секундах (от <span id="delay-before-switching-1-${lastId}">${await checkKeyValue('delay-before-switching-1')}</span> до <span id="delay-before-switching-2-${lastId}">${await checkKeyValue('delay-before-switching-2')}</span>)` },
        { id: 'not-to-check-previously-checked', label: `Не выполнять повторную проверку если пользователь ранее проверялся (<span id="clear-database-${lastId}">Нажмите здесь, чтобы очистить базу данных</span>)` },
        { id: 'send-scammer-to-telegram', label: `Отправлять найденных мошенников в Telegram (токен: ${telegramBotTokenText}, ID пользователя: ${telegramUserIDText})` },
        { id: 'CircularNavigation', label: `При достижении последней страницы начинать с самого начала` },
        { id: 'ContinueAfterScammerDetected', label: `Продолжать работу даже после обнаружения мошенника`},
        { id: 'UnmarkBaseUnblocked', label: `Не помечать аккаунт в общих IP заблокированным, если основной аккаунт разблокирован`}
    ]

    let content = await renderCheckboxes(checkboxes, page, lastId);
    XenForo.alert(content, 'Lolzteam Multiaccount Finder');

    filteredCheckboxes.forEach(checkbox => {
        const id = `${checkbox.id}-${lastId}`;
        const checkboxEl = document.getElementById(id);
        if (checkboxEl) {
            checkboxEl.onclick = () => {
                changeItemValue(checkbox.id, `${checkboxEl.checked}`);
                logWithPrefix(`Значение ${checkbox.id} установлено как ${checkboxEl.checked}`);
            }
        }
    });

    const prevButton = document.getElementById(`prev-page-${lastId}`);
    const nextButton = document.getElementById(`next-page-${lastId}`);

    if (prevButton) prevButton.addEventListener("click", () => openSettings(page - 1));
    if (nextButton) nextButton.addEventListener("click", () => openSettings(page + 1));

    function updateElementWithNotSpecified(selector, value) {
        const el = document.querySelector(selector);
        if (el) {
            el.textContent = isEmptyOrWhitespaces(value) ? 'не указан' : value;
        }
    }

    const addClickListener = (selector, handler, message, key, updateEl, allowEmpty, filter = true) => {
        document.querySelector(selector)?.addEventListener('click', async () => {
            let finalValue;

            if (key === 'clear-database') {
                if (confirm("Вы уверены, что хотите очистить базу данных?")) {
                    changeItemValue("checked-list", []);
                    alert('База данных очищена');
                }
                return
            } else {
                const input = prompt(message);
                if (input === null) return;
                if (input.trim() === '' && (key === 'telegram-bot-token' || key === 'telegram-user-id')) {
                    updateElementWithNotSpecified(selector, input.trim());
                    return;
                }
                if (input === '' && !allowEmpty) return;

                finalValue = input.trim();
                if (filter && key === 'telegram-user-id') {
                    finalValue = parseInt(finalValue.replace(/[^\d]/g, ''));
                }

                if ((isNaN(finalValue) || finalValue === '') && !allowEmpty) return;
            }

            if (key.startsWith('delay-before-switching')) {
                const [val1, val2] = await Promise.all([
                    checkKeyValue('delay-before-switching-1'),
                    checkKeyValue('delay-before-switching-2')
                ]).then(([v1, v2]) => [parseInt(v1), parseInt(v2)]);

                if (key.endsWith('1')) {
                    finalValue = Math.max(1, finalValue);
                    if (finalValue >= val2) {
                        changeItemValue('delay-before-switching-2', finalValue + 1);
                        (updateEl || (el => (el.textContent = finalValue + 1)))(document.querySelector(`#delay-before-switching-2-${lastId}`));
                    }
                } else if (key.endsWith('2')) {
                    finalValue = Math.max(2, finalValue);
                    if (finalValue <= val1 + 1) {
                        changeItemValue('delay-before-switching-1', finalValue - 1);
                        (updateEl || (el => (el.textContent = finalValue - 1)))(document.querySelector(`#delay-before-switching-1-${lastId}`));
                    }
                }
            }

            changeItemValue(key, finalValue);
            (updateEl || (el => (el.textContent = finalValue)))(document.querySelector(selector));
        });
    };
    addClickListener('#clear-database-' + lastId, null, null, 'clear-database');


    const elements = [
        {selector: telegramBotToken ? '#set-telegram-bot-token-' + lastId : '.prompt-telegram-bot-token-' + lastId, message: "Введите токен Telegram бота:", key: "telegram-bot-token", allowEmpty: true, filter: false},
        {selector: telegramUserID ? '#set-telegram-user-id-' + lastId : '.prompt-telegram-user-id-' + lastId, message: "Введите ID пользователя Telegram:", key: "telegram-user-id", allowEmpty: true, filter: false},
        {selector: '#delay-before-switching-1-' + lastId, message: "Введите новое значение для задержки:", key: "delay-before-switching-1"},
        {selector: '#delay-before-switching-2-' + lastId, message: "Введите новое значение для задержки:", key: "delay-before-switching-2"},
        {selector: '#sympCount-' + lastId, message: "Введите новое значение счетчика симпатий:", key: "autocheck-only-parameters-sympathies"},
        {selector: '#msgCount-' + lastId, message: "Введите новое значение счетчика сообщений:", key: "autocheck-only-parameters-messages"}
    ];

    elements.forEach(el => {
        addClickListener(el.selector, null, el.message, el.key, el.func, el.allowEmpty || false);
    });

    const buttonKey = document.querySelector('#buttonkey-' + lastId);
    if (buttonKey) {
        buttonKey.addEventListener('click', () => {
            buttonKey.style.color = 'red';
            let keydownListener;
            const toggleKeydownListener = () => {
                if (keydownListener) {
                    document.removeEventListener('keydown', keydownListener);
                    buttonKey.style.color = '';
                    keydownListener = null;
                } else {
                    const currentKey = checkKeyValue('fast-switch-with-button-key');
                    keydownListener = (event) => {
                        if (event.key !== currentKey) {
                            changeItemValue('fast-switch-with-button-key', event.key);
                            buttonKey.textContent = event.key;
                            buttonKey.style.color = '';
                            document.removeEventListener('keydown', keydownListener);
                            keydownListener = null;
                        }
                    };
                    document.addEventListener('keydown', keydownListener);
                }
            };
            toggleKeydownListener();
        });
    }
}

async function checkMenuItems() {
    const sharedItems = document.querySelectorAll('.Menu a[href*="/shared-ips"]');
    for (let i = 0; i < sharedItems.length; i++) {
        const item = sharedItems[i];
        const menu = item.parentNode.parentNode;
        if (menu.hasAttribute("data-multiaccount-finder")) continue;
        menu.setAttribute("data-multiaccount-finder", "added");
        const buttonId = `multiaccountFinderButton-${generateRandomString(10)}`;
        const currentUrl = item.getAttribute('href');
        menu.appendChild(createButtonElement(buttonId, currentUrl));
        const makeClaimLink = menu.querySelector('a[href*="/make-claim"]');
        if (makeClaimLink) {
            if (await checkKeyValue("autocheck-mini-profile") !== 'true') continue;
            const bannedModule = document.querySelectorAll('.usernameAndStatus');
            for (let j = 0; j < bannedModule.length; j++) {
                const module = bannedModule[j];
                const bannedcheck = module.parentNode.parentNode;
                if (bannedcheck.hasAttribute("data-multiaccount-finder")) continue;
                bannedcheck.setAttribute("data-multiaccount-finder", "added");
                const gifId = `gif-profile-${generateRandomString(10)}`;
                const countsModule = document.querySelectorAll('.userStatCounters');
                let lastElement = countsModule[countsModule.length - 1]
                const miniprofileMenu = lastElement.parentNode.parentNode;
                if (miniprofileMenu.hasAttribute("data-multiaccount-finder")) continue;
                miniprofileMenu.setAttribute("data-multiaccount-finder", "added");
                let sympathies = lastElement.querySelector('a:nth-child(1) > span.count').textContent.replace(/ /g, "");
                let messages = lastElement.querySelector('a:nth-child(3) > span.count').textContent.replace(/ /g, "");
                if (sympathies || messages) {
                    if (await checkKeyValue("autocheck-only-parameters") === 'true' && (sympathies >= parseInt(await checkKeyValue("autocheck-only-parameters-sympathies")) && messages >= parseInt(await checkKeyValue("autocheck-only-parameters-messages")))) continue;
                }
                lastElement.appendChild(createGifElement(gifId, 'https://i.imgur.com/I5VH0zp.gif', 24, 24));
                if (await checkKeyValue("autocheck-banned-users-mporp") === 'false' && bannedcheck.querySelector('.banInfo.muted.Tooltip') || bannedcheck.querySelector('div.errorPanel')) {
                    const element = document.getElementById(gifId);
                    if (element) element.remove();
                    continue;
                }
                const element = document.getElementById(buttonId);
                if (element) element.remove();
                checkUser(currentUrl, undefined, gifId).then();
            }
        } else {
            if (await checkKeyValue("autocheck-profile") !== 'true') return;
            let sympathies = document.querySelector("#content > div > div > div.profilePage > div.mainProfileColumn > div > div.counts_module > a.page_counter.Tooltip > div.count").textContent.replace(/ /g, "");
            let messages = document.querySelector("#content > div > div > div.profilePage > div.mainProfileColumn > div > div.counts_module > a:nth-child(3) > div.count").textContent.replace(/ /g, "");
            if (await checkKeyValue("autocheck-only-parameters") === 'true' && document.querySelector("#content > div > div > div.profilePage > div.mainProfileColumn > div > div.counts_module > a.page_counter.Tooltip > div.count") && document.querySelector("#content > div > div > div.profilePage > div.mainProfileColumn > div > div.counts_module > a:nth-child(3) > div.count") && (sympathies >= parseInt(await checkKeyValue("autocheck-only-parameters-sympathies")) && messages >= parseInt(await checkKeyValue("autocheck-only-parameters-messages")))) return;
            const bannedModule = document.querySelectorAll('div.mainProfileColumn');
            for (let i = 0; i < bannedModule.length; i++) {
                const bannedcheck = bannedModule[i].parentNode.parentNode;
                if (bannedcheck.hasAttribute("data-multiaccount-finder")) continue;
                bannedcheck.setAttribute("data-multiaccount-finder", "added");
                const gifId = `gif-profile`;
                const countsModule = document.querySelectorAll('.counts_module');
                for (let j = 0; j < countsModule.length; j++) {
                    const profilecounter = countsModule[j].parentNode.parentNode;
                    if (profilecounter.hasAttribute("data-multiaccount-finder")) continue;
                    profilecounter.setAttribute("data-multiaccount-finder", "added");
                    if (sympathies || !messages) {
                        if (await checkKeyValue("autocheck-only-parameters") === 'true' && (sympathies >= parseInt(await checkKeyValue("autocheck-only-parameters-sympathies")) && messages >= parseInt(await checkKeyValue("autocheck-only-parameters-messages")))) return;
                    }
                    countsModule[j].appendChild(createGifElement(gifId, 'https://i.imgur.com/I5VH0zp.gif', 32, 32));
                    if (await checkKeyValue("autocheck-banned-users-mporp") === 'false' && bannedcheck.querySelector('div.errorPanel')) {
                        const element = document.getElementById(gifId);
                        if (element) element.remove();
                        return;
                    }
                    const element = document.getElementById(buttonId);
                    if (element) element.remove();
                    checkUser(currentUrl, undefined, gifId).then();
                }}}}}

function createButtonElement(buttonId, currentUrl) {
    const multiaccountFinderItem = document.createElement("li");
    const button = document.createElement("a");
    button.setAttribute("href", "javascript:void(0)");
    button.setAttribute("id", buttonId);
    button.textContent = "Multiaccount Finder";
    button.addEventListener("click", function(event) {
        event.preventDefault();
        checkUser(`https://${domain}/${currentUrl}/shared-ips/`).then();
    });
    multiaccountFinderItem.appendChild(button);
    return multiaccountFinderItem;
}

function createGifElement(gifId, src, width, height) {
    const gifElement = document.createElement('img');
    gifElement.id = gifId;
    gifElement.src = src;
    gifElement.width = width;
    gifElement.height = height;
    return gifElement;
}

function generateRandomString(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function checkThreadItems() {
    if (await checkKeyValue("addbutton-threads") === 'true') {
        const linksLists = [...document.querySelectorAll('.secondaryContent.blockLinksList')]
        .filter(list => !list.querySelector('li[id^="multiaccountFinderButton-"]'));

        linksLists.forEach((linksList) => {
            const links = linksList.querySelectorAll("a");

            links.forEach((link) => {
                if (link.href.startsWith(`https://${domain}/posts/`)) {
                    let postId;
                    let newLink;
                    let postElement;

                    if (link.href.includes('posts/comments/')) {
                        postId = link.href.split('posts/comments/')[1].split('/')[0];
                        newLink = `post-comment-${postId}`
                    } else {
                        postId = link.href.split('posts/')[1].split('/')[0];
                        newLink = `post-${postId}`
                    }

                    postElement = document.querySelector(`#${newLink}.${link.href.includes('posts/comments/') ? 'comment' : 'message'}`);

                    if (postElement && !postElement.hasAttribute("data-multiaccount-finder")) {
                        postElement.setAttribute("data-multiaccount-finder", "added");

                        const menus = [...document.querySelectorAll('div.Menu')]
                        .filter(menu => [...menu.querySelectorAll('a')].some(link => link.href.includes(`${postId}`)));

                        const author = postElement.querySelector('.username').textContent;
                        if (author !== hrefSearchUsers) {
                            const buttonId = `multiaccountFinderButton-${generateRandomString(10)}`;

                            const usernameLink = postElement.querySelector('a');
                            const currentUrl = usernameLink.getAttribute('href');

                            menus[menus.length - 1].querySelector('.secondaryContent').appendChild(createButtonElement(buttonId, currentUrl));
                        }
                    }
                }
            });
        });
    }
}

async function checkProfileItems() {
    const profilePostList = document.querySelector('ol#ProfilePostList');
    if (((await checkKeyValue("addbutton-profile")) === 'true') && profilePostList) {
        const linksLists = [...profilePostList.querySelectorAll(':not(li[id^="multiaccountFinderButton-"])')];
        linksLists.forEach((linksList) => {
            const links = linksList.querySelectorAll("a");
            links.forEach((link) => {
                if (link.href.startsWith(`https://${domain}/profile-posts/`)) {
                    let postId;
                    let newLink;
                    let postElement;
                    if (link.href.includes('profile-posts/comments')) {
                        postId = link.href.split('posts/comments/')[1].split('/')[0];
                        newLink = `profile-post-comment-${postId}`
                        postElement = document.querySelector(`#${newLink}.comment`);
                    } else if (!link.href.includes('profile-posts/comments/')) {
                        postId = link.href.split('profile-posts/')[1].split('/')[0];
                        newLink = `profile-post-${postId}`
                        postElement = document.querySelector(`#${newLink}.messageSimple`);
                    }
                    if (postElement && !postElement.hasAttribute("data-multiaccount-finder")) {
                        postElement.setAttribute("data-multiaccount-finder", "added");
                        const menus = [...document.querySelectorAll('div.Menu')].filter(menu => [...menu.querySelectorAll('a')].some(link => link.href.includes(`${postId}`)));
                        let author = postElement.querySelector('a.username.poster')
                        if (author.textContent !== hrefSearchUsers) {
                            document.createElement("li");
                            let buttonId = `multiaccountFinderButton-${generateRandomString(10)}`;
                            let currentUrl = author.getAttribute('href')
                            if (menus.length > 0) {
                                menus[menus.length - 1].querySelector('.secondaryContent').appendChild(createButtonElement(buttonId, currentUrl));
                            }
                        }
                    }
                }
            })
        })
    }
}

async function checkAlertItems() {
    if ((await checkKeyValue("addbutton-alerts")) === 'true') {
        const alertElements = document.querySelectorAll('li.Alert');
        alertElements.forEach((alertElement) => {
            if (alertElement.querySelector('a[rel="menu"].PopupControl.dottesStyle.PopupContainerControl.PopupOpen')) {
                if (alertElement && !alertElement.hasAttribute("data-multiaccount-finder")) {
                    const username = alertElement.querySelector('a.username')
                    let menus = document.querySelectorAll('.Menu.MenuOpened');
                    if (!username && !menus) return;
                    const usernameLink = username.getAttribute('href');
                    const lastMenu = menus[menus.length - 1];
                    let buttonId = `multiaccountFinderButton-${generateRandomString(10)}`;
                    lastMenu.querySelector('ul.secondaryContent.blockLinksList').appendChild(createButtonElement(buttonId, usernameLink));
                    alertElement.setAttribute("data-multiaccount-finder", "added");
                }
            }
        })
    }
}

async function checkConversationItems() {
    if ((await checkKeyValue("addbutton-conversations")) === 'true') {
        if (!window.location.href.startsWith(`https://${domain}/conversations/`)) return
        const username = document.querySelector('div.ImDialogHeader a.username');
        if (!username) return
        const usernameLink = username.getAttribute('href');
        const menuElements = Array.from(document.querySelectorAll('div.Menu')).filter(menuElement => menuElement.querySelector('.blockLinksList a[href^="conversations/"]'));
        const targetElement = menuElements[menuElements.length - 1];
        if (targetElement && !targetElement.hasAttribute("data-multiaccount-finder")) {
            document.createElement("li");
            let buttonId = `multiaccountFinderButton-${generateRandomString(10)}`;
            targetElement.querySelector('.blockLinksList').appendChild(createButtonElement(buttonId, usernameLink));
            targetElement.setAttribute("data-multiaccount-finder", "added");
        }
    }
}

function update() {
    checkMenuItems();
    checkThreadItems();
    checkProfileItems();
    checkChatItems();
    checkAlertItems();
    checkConversationItems();

    requestAnimationFrame(update);
}

requestAnimationFrame(update);

function checkChatItems() {
    if (localStorage.getItem("addbutton-chat") !== 'true') return;
    const elements = document.querySelectorAll('div[class^="chat2-message-block "]');
    elements.forEach((message, index) => {
        let usernameLink;
        const lztui = document.querySelectorAll('div[class^="lztui-Popup lztng-"]');
        const lastElement = lztui[lztui.length - 1];
        const popupElement = message.querySelector('div[class^="PopupControl PopupOpen"]');
        if (!popupElement) return;

        if (message) {
            usernameLink = message.querySelector('.username[href]');
            usernameLink = usernameLink && usernameLink.href.includes(profileLink) ? null : usernameLink;
            if (!usernameLink) {
                let prevIndex = index - 1;
                while (prevIndex >= 0 && !usernameLink) {
                    const prevMessage = elements[prevIndex];
                    usernameLink = prevMessage.querySelector('.username[href]');
                    prevIndex--;
                }
            }
            const ulElement = lastElement.querySelector('ul.secondaryContent.blockLinksList');
            if (!ulElement || ulElement.hasAttribute("data-multiaccount-finder")) return;

            ulElement.setAttribute("data-multiaccount-finder", "added");
            const username = usernameLink.textContent
            const buttonId = `multiaccountFinderButton-${generateRandomString(10)}`;
            if (username !== hrefSearchUsers) {
                ulElement.appendChild(createButtonElement(buttonId, usernameLink.href.replace(`https://${domain}`, '')));
            }
        }
    });
}

async function OnlineChangeTable(classname, num) {
    const findelement = document.querySelector(`${classname}`);
    const remainedElement = document.querySelector('.remained dd');
    if (findelement) {
        const ddElement = findelement.querySelector('dd');
        if (ddElement) {
            const currentValue = parseInt(ddElement.textContent);
            ddElement.textContent = currentValue + num;
            if (findelement.classList.contains('scammers')) {
                ddElement.style.color = 'red';
            }
        }
    }
    const shouldDecrementRemainedElement = !(classname === 'dl.errors' && await checkKeyValue('retry-after-error') === 'true');
    if (remainedElement && shouldDecrementRemainedElement) {
        const currentValueRemained = parseInt(remainedElement.textContent);
        remainedElement.textContent = currentValueRemained - 1;
    }
}

async function AutoCheckOnlineRegistered() {
    if ((await checkKeyValue("autocheck-online-registered")) === 'true') {
        if (window.location.href.indexOf(`https://${domain}/online/?type=registered`) === 0) {
            const currentPageElement = document.querySelector('.currentPage');
            const maxPageElement = document.querySelector("#content > div > div > div > div > div > div > nav > a:nth-child(5)");
            const ulElement = document.querySelector('#content > div > div > div.mainContainer > div > ul');

            if (!currentPageElement && !maxPageElement) {
                if (await checkKeyValue("CircularNavigation") === 'true') {
                    await waitWithRandomDelay();
                    window.location.href = `https://${domain}/online/?type=registered`;}} else {
                        const currentPage = parseInt(currentPageElement.innerText.trim());
                        const maxPage = parseInt(maxPageElement.innerText.trim());

                        if (await checkKeyValue("fast-switch-with-button") === 'true') {
                            let fastswitchwithbuttonkey = await checkKeyValue("fast-switch-with-button-key");
                            document.addEventListener('keydown', function(event) {
                                if (event.key === fastswitchwithbuttonkey && currentPage < maxPage) {
                                    window.location.href = `https://${domain}/online/?type=registered&page=${currentPage + 1}`;
                                }
                            });
                        }

                        const visitorCountDl = document.querySelector('dl.visitorCount');
                        const members = document.querySelectorAll('.member');
                        if (visitorCountDl && !visitorCountDl.querySelector('dl.clean')) {
                            const newFootnoteDiv = document.createElement('div');
                            newFootnoteDiv.className = 'footnote';
                            newFootnoteDiv.innerHTML = `<h3>Lolzteam Multiaccount Finder</h3><dl class="clean"><dt>Не заподозрены:</dt><dd>0</dd></dl><dl class="vpn"><dt>VPN:</dt><dd>0</dd></dl><dl class="scammers"><dt>Мошенники:</dt><dd>0</dd></dl><dl class="errors"><dt>Ошибки:</dt><dd>0</dd>${await checkKeyValue("autocheck-only-parameters") === "true" ? `<dl class="skipped"><dt>Не подошли под указанные параметры:</dt><dd>0</dd></dl>` : ''}${await checkKeyValue("not-to-check-previously-checked") === "true" ? `<dl class="checked"><dt>Ранее проверялись:</dt><dd>0</dd></dl>` : ''}<dl class="remained"><dt>Осталось проверить:</dt><dd>${members.length}</dd></dl>`;
                            visitorCountDl.appendChild(newFootnoteDiv);
                        }

                        let index = 0;
                        const checkNextMember = async () => {
                            if (index >= members.length) {
                                const scammersCount = parseInt(document.querySelector("dl.scammers dd").innerText);
                                const continueAfterScammerDetected = await checkKeyValue("ContinueAfterScammerDetected") === 'true';
                                const switchPageAutomatically = await checkKeyValue("switch-page-automatically") === 'true';
                                const circularNavigation = await checkKeyValue("CircularNavigation") === 'true';

                                if (switchPageAutomatically && currentPage < maxPage && scammersCount < 1) {
                                    await waitWithRandomDelay();
                                    window.location.href = `https://${domain}/online/?type=registered&page=${currentPage + 1}`;
                                } else if (scammersCount > 0 && continueAfterScammerDetected && switchPageAutomatically) {
                                    if (currentPage < maxPage) {
                                        await waitWithRandomDelay();
                                        window.location.href = `https://${domain}/online/?type=registered&page=${currentPage + 1}`;
                                    } else if (circularNavigation) {
                                        await waitWithRandomDelay();
                                        window.location.href = `https://${domain}/online/?type=registered`;
                                    }
                                } else if (scammersCount > 0 && !continueAfterScammerDetected) {
                                    document.title = 'Обнаружен мошенник';
                                } else if (circularNavigation && !(currentPage < maxPage) && !(scammersCount > 0)) {
                                    window.location.href = `https://${domain}/online/?type=registered`;
                                }
                                return;
                            }

                            const member = members[index];
                            const usernameLink = member.querySelector('a.username');
                            const usernameHref = usernameLink.getAttribute('href');
                            const userStatCounters = member.querySelector('.userStatCounters');

                            const gifId = `gif-${index}`;

                            if (usernameLink.textContent !== hrefSearchUsers) {
                                const sympathies = member.querySelector("div.userStatCounters > div:nth-child(1) > span.count").textContent.replace(/ /g, "")
                                const messages = member.querySelector("div.userStatCounters > div:nth-child(2) > span.count").textContent.replace(/ /g, "")

                                if (await checkKeyValue("autocheck-only-parameters") === "true") {
                                    if ((sympathies < parseInt(await checkKeyValue("autocheck-only-parameters-sympathies")) && messages < parseInt(await checkKeyValue("autocheck-only-parameters-messages")))
                                        || (sympathies >= parseInt(await checkKeyValue("autocheck-only-parameters-sympathies")) && messages < parseInt(await checkKeyValue("autocheck-only-parameters-messages")))
                                        || (sympathies < parseInt(await checkKeyValue("autocheck-only-parameters-sympathies")) && messages >= parseInt(await checkKeyValue("autocheck-only-parameters-messages")))) {
                                        userStatCounters.appendChild(createGifElement(gifId, 'https://i.imgur.com/I5VH0zp.gif', 24,24));
                                        await checkUser(`https://${domain}/${usernameHref}/shared-ips`, 'registered', gifId);
                                    } else {
                                        OnlineChangeTable('dl.skipped', 1)
                                    }
                                } else {
                                    userStatCounters.appendChild(createGifElement(gifId, 'https://i.imgur.com/I5VH0zp.gif', 24,24));
                                    await checkUser(`https://${domain}/${usernameHref}/shared-ips`, 'registered', gifId);
                                }
                            } else {
                                OnlineChangeTable('dl.skipped', 0)
                            }
                            index++;
                            await checkNextMember();
                        }
                        checkNextMember().then();
                    }
        }
    }
}

AutoCheckOnlineRegistered()

async function AutoCheckNewMembers() {
    if ((await checkKeyValue("autocheck-newmembers")) === 'true') {
        if (window.location.href.indexOf(`https://zelenka.guru/members`) === 0) {
            const visitorCountDl = document.querySelector('dl.memberCount')
            const members = document.querySelectorAll('.secondaryContent.avatarHeap.avatarList li')

            if (visitorCountDl && !visitorCountDl.querySelector('dl.clean')) {
                const newFootnoteDiv = document.createElement('div')
                newFootnoteDiv.className = 'footnote'
                newFootnoteDiv.innerHTML = `<h3>Lolzteam Multiaccount Finder</h3><dl class="clean"><dt>Не заподозрены:</dt><dd>0</dd></dl><dl class="vpn"><dt>VPN:</dt><dd>0</dd></dl><dl class="scammers"><dt>Мошенники:</dt><dd>0</dd></dl><dl class="errors"><dt>Ошибки:</dt><dd>0</dd>${await checkKeyValue("not-to-check-previously-checked") === "true" ? `<dl class="checked"><dt>Ранее проверялись:</dt><dd>0</dd></dl>` : ''}<dl class="remained"><dt>Осталось проверить:</dt><dd>${members.length}</dd></dl>`;
                visitorCountDl.appendChild(newFootnoteDiv)
            }

            let index = 0
            const checkNextMember = async () => {
                if (index >= members.length) {
                    return
                }

                const member = members[index]
                const usernameLink = member.querySelector('a.username')
                const usernameHref = usernameLink.getAttribute('href')
                const userStatCounters = member.querySelector('div.memberInfo')
                const gifId = `gif-${index}`

                userStatCounters.appendChild(createGifElement(gifId, 'https://i.imgur.com/I5VH0zp.gif', 24, 24))
                await checkUser(`https://${domain}/${usernameHref}/shared-ips`, 'members', gifId)

                index++
                await checkNextMember()
            }

            checkNextMember().then()
        }
    }}

AutoCheckNewMembers()

async function fetchWithRetry(url, retries = 3, delay = 5000) {
    try {
        const response = await fetch(url);
        return response;
    } catch (error) {
        if (retries > 0) {
            console.error('Ошибка при получении данных:', error);
            logWithPrefix(`Повторим через ${delay}ms...`);

            return await new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        const resp = await fetchWithRetry(url, retries - 1, delay);
                        resolve(resp);
                    } catch (err) {
                        reject(err);
                    }
                }, delay);
            });
        } else {
            throw error;
        }
    }
}

function xenforoLogAndAlert(text, title) {
    logWithPrefix(text)
    XenForo.alert(`${text}`, `${title}`)
}

function encodeOutput(output) {
    const text = output.toString();
    return encodeURIComponent(text).replace("\n", "/%0A/g");
}

function cleanURL(domain, link) {
    let sharedIpsPresent = link.includes('shared-ips');

    if (!link.startsWith('https://')) {
        link = 'https://' + domain + '/' + link;
    }

    let url;
    try {
        url = new URL(link);
        //console.log(url);
    } catch (error) {
        console.error("Provided link is not a valid URL.");
        return;
    }

    let pathnames = url.pathname.split('/').filter(p => p.trim() !== '' && p.trim() !== 'shared-ips');

    if (sharedIpsPresent) {
        pathnames.push('shared-ips');
    }

    url.pathname = pathnames.join('/');

    if (!url.href.endsWith('/')) {
        url.href += '/';
    }

    return url.href;
}

function logWithPrefix(text) {
    console.log(`[Lolzteam Multiaccount Finder] ${text}`)
}

async function checkUser(link, source, gifId) {
    link = cleanURL(domain, link)
    logWithPrefix(`${link}`)

    const notToCheckPreviouslyChecked = await checkKeyValue('not-to-check-previously-checked') === "true";
    const checkedList = (await checkKeyValue("checked-list")) || [];
    const checkedItem = checkedList.find(item => item.link === link.replace('/shared-ips', ''));
    //console.log(checkedItem)
    if (notToCheckPreviouslyChecked && checkedItem) {
        const { date, output: prevOutput } = checkedItem;
        const output = prevOutput + `\nРезультат проверки был сохранен ${date}`;
        const gifElement = document.getElementById(gifId);

        if (gifElement) {
            gifElement.src = prevOutput.includes("мошенник") ? 'https://i.imgur.com/g5GxNHD.png' :
            prevOutput.includes("VPN") ? 'https://i.imgur.com/o5qNA1o.png' :
            'https://i.imgur.com/i4OlWJk.png';
            if (source === 'members' || source === 'registered') OnlineChangeTable('dl.checked', 1);
            gifElement.title = `${output}`;

            gifElement.addEventListener('click', async function onClick() {
                gifElement.removeEventListener('click', onClick);
                const index = checkedList.indexOf(checkedItem);
                if (index > -1) {
                    checkedList.splice(index, 1);
                    await changeItemValue("checked-list", checkedList);
                }
                gifElement.src = 'https://i.imgur.com/I5VH0zp.gif';
                checkUser(link, undefined, gifId);
            });
        } else {
            xenforoLogAndAlert(`${output}`, `Lolzteam Multiaccount Finder`);
        }
        return;
    }

    const response = await fetchWithRetry(link);
    const data = await response.text();
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(data, "text/html");
    const userLogs = htmlDocument.getElementsByClassName("userLog");
    const numUserLogs = userLogs.length;
    let [bannedUsersCount, nonBannedUsersCount, bannedThisMonthCount] = [0, 0, 0];
    const nameEl = htmlDocument.querySelector(`a.crumb[href^="https://${domain}/"] span`);
    const name = nameEl ? nameEl.textContent.trim() : "";
    //console.log(name);
    const gifElement = document.getElementById(gifId);

    if (!name) {
        if (gifElement) {
            gifElement.src = 'https://i.imgur.com/wqXWudH.png';
        }
        OnlineChangeTable('dl.errors', 1);

        if (await checkKeyValue('retry-after-error') === "true") {
            return new Promise((resolve) => {
                setTimeout(() => {
                    logWithPrefix("Повторная проверка для пользователя:", link);
                    resolve(checkUser(link, source, gifId));
                }, 15000);
            });
        } else {
            throw new Error("Name not found");
        }
    }

    for (const log of userLogs) {
        const spans = log.getElementsByTagName("span");
        const bannedSpan = Array.from(spans).find(span => span.classList.contains("banned"));
        const isBanned = !!bannedSpan;

        if (isBanned) {
            const boldElements = log.getElementsByTagName("b");
            const anchorElements = Array.from(boldElements).flatMap(b => Array.from(b.getElementsByTagName("a")));
            const hasBannedClass = anchorElements.some(a => !!a.querySelector("span.banned"));

            if (!boldElements.length || hasBannedClass) {
                bannedUsersCount++;
                const li = log.querySelector('li.ipLog');
                if (li) {
                    const abbr = li.querySelector('abbr.DateTime');
                    const span = li.querySelector('span.DateTime');
                    const title = abbr ? abbr.getAttribute("data-datestring") : span.getAttribute("title");
                    if (title.includes(month) || title.includes('Сегодня') || title.includes('Вчера')) {
                        bannedThisMonthCount++;
                    }
                }
            } else {
                nonBannedUsersCount++;
            }
        } else {
            nonBannedUsersCount++;
        }
    }


    const totalUsers = bannedUsersCount + nonBannedUsersCount;
    const [bannedPercent, nonBannedPercent] = [bannedUsersCount, nonBannedUsersCount].map(x => totalUsers ? (x / totalUsers * 100).toFixed(2) : 0);
    const bannedThisMonthPercent = bannedUsersCount ? (bannedThisMonthCount / bannedUsersCount * 100).toFixed(2) : 0;

    const [showBlockedPercentage, showUnblockedPercentage, showTotalUsersIp, showBlockedThisMonthPercentage] = await Promise.all(
        ["show-blocked-percentage", "show-unblocked-percentage", "show-total-users-ip", "show-blocked-this-month-percentage"].map(
            key => checkKeyValue(key).then(value => value === "true")));

    let output = `${showBlockedPercentage ? `\n% заблокированных: ${bannedPercent} (${bannedUsersCount})` : ''}${showUnblockedPercentage ? `\n% не заблокированных: ${nonBannedPercent} (${nonBannedUsersCount})` : ''}${showTotalUsersIp ? `\nОбщее количество пользователей в общих IP: ${numUserLogs}` : ''}${showBlockedThisMonthPercentage ? `\n% от заблокированных в этом месяце: ${bannedThisMonthPercent} (${bannedThisMonthCount})` : ''}`;

    function template(description) {
        let title = encodeOutput(`Жалоба на пользователя ${name}`)
        let message = encodeOutput(`[CLUB]1. Никнейм нарушителя и ссылка на профиль: ${link.replace('/shared-ips', '')}\n2. Краткое описание жалобы: ${description}\n3. Доказательства: ${link}[/CLUB]`)
        const template = `https://${domain}/forums/801/create-thread?prefix_id=92&title=${title}&message=${message}`;
        window.open(`${template}`, '_blank');
    }

    function updateGifElement(gifElement, src, title, cursor = null) {
        if (gifElement) {
            gifElement.src = src;
            gifElement.title = title;
            if (cursor) gifElement.style.cursor = cursor;
        }
    }

    function xenforoLogAndAlertWrapper(output) {
        if (!gifElement) {
            xenforoLogAndAlert(output, "Lolzteam Multiaccount Finder");
        }
    }

    function updateOutputAndTable(condition, source, imgSrc, outputPrefix, tableSuffix, sendMessage = false) {
        if (condition) {
            if (outputPrefix.includes('пользователей по заданным параметрам не найдено')) {
                output = `${name} - ${outputPrefix}`;
            } else {
                output = output ? `${name} - ${outputPrefix} ${output}` : `${name} - ${outputPrefix}`;
            }

            updateGifElement(gifElement, imgSrc, output);
            xenforoLogAndAlertWrapper(output);
            if (source === "members" || source === "registered") {
                OnlineChangeTable(`dl.${tableSuffix}`, 1);
                if (sendMessage) {
                    if (outputPrefix == 'мошенник') {
                        sendMessageIfConditionsMet(`❗️ Обнаружен мошенник -  ${link.replace("/shared-ips", "")} \n\n${output}`);
                    } else if (outputPrefix == 'возможно мошенник') {
                        sendMessageIfConditionsMet(`❗️ Возможно мошенник -  ${link.replace("/shared-ips", "")} \n\n${output}`);
                    }
                }
            }
        }
    }

    if (htmlDocument.body.textContent.includes("Пользователей по заданным параметрам не найдено.") || htmlDocument.body.textContent.includes("No matching users were found.")) {
        updateOutputAndTable(true, source, "https://i.imgur.com/i4OlWJk.png", "пользователей по заданным параметрам не найдено.", "clean");
    } else {
        const cases = [
            {
                condition: bannedUsersCount >= nonBannedUsersCount && bannedUsersCount !== 0,
                imgSrc: "https://i.imgur.com/g5GxNHD.png",
                outputPrefix: "мошенник",
                tableSuffix: "scammers",
                sendMessage: true,
            },
            {
                condition: nonBannedUsersCount > 15 && bannedUsersCount < nonBannedUsersCount / 3,
                imgSrc: "https://i.imgur.com/o5qNA1o.png",
                outputPrefix: "использует VPN",
                tableSuffix: "vpn"
            },
            {
                condition: nonBannedUsersCount > 6 && nonBannedUsersCount <= 15 && bannedUsersCount < nonBannedUsersCount / 2,
                imgSrc: "https://i.imgur.com/o5qNA1o.png",
                outputPrefix: "возможно использует VPN",
                tableSuffix: "vpn"
            },
            {
                condition: bannedUsersCount > nonBannedUsersCount / 2,
                imgSrc: "https://i.imgur.com/g5GxNHD.png",
                outputPrefix: "возможно мошенник",
                tableSuffix: "scammers",
                sendMessage: true,
                isPossibleScammer: true,
            }
        ];

        let caseFound = false;

        function createClickListener(templateFunc, output) {
            return function () {
                templateFunc(output);
            };
        }

        for (const currentCase of cases) {
            updateOutputAndTable(currentCase.condition && !caseFound, source, currentCase.imgSrc, currentCase.outputPrefix, currentCase.tableSuffix, currentCase.sendMessage);
            if (currentCase.condition) {
                caseFound = true;
                if (currentCase.isPossibleScammer && gifElement) {
                    const eventListener = createClickListener(template, output);
                    gifElement.style.cursor = 'pointer';
                    gifElement.addEventListener("click", eventListener);
                }
            }
        }

        if (!caseFound) {
            updateOutputAndTable(true, source, "https://i.imgur.com/i4OlWJk.png", "мультиаккаунт", "clean");
        }
    }

    if (notToCheckPreviouslyChecked) {
        checkedList.push({ link: link.replace('/shared-ips', ''), output: output, date: date.toLocaleString() });
        //console.log(checkedList)
        await changeItemValue("checked-list", checkedList);
    }
}