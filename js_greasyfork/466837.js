// ==UserScript==
// @name         Lolzteam Multiaccount Finder
// @version      1.7.1
// @description  Your assistant in finding scammers on the forum
// @author       vuchaev2015
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/466837/Lolzteam%20Multiaccount%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/466837/Lolzteam%20Multiaccount%20Finder.meta.js
// ==/UserScript==

// ВНИМАНИЕ ДАННЫЙ СКРИПТ СОДЕРЖИТ БОЛЬШОЕ КОЛИЧЕСТВО ГАВНОКОДА
// ПОЖАЛУЙСТА, НЕ БЕЙТЕ. ГЛАВНОЕ, ЧТО ВСЁ РАБОТАЕТ!.

let domain = 'zelenka.guru';
let items = [
    {key: "autocheck-mini-profile", value: "false"},
    {key: "autocheck-profile", value: "false"},
    {key: "autocheck-banned-users-mporp", value: "false"},
    {key: "addbutton-profile", value: "true"},
    {key: "addbutton-threads", value: "true"},
    {key: "autocheck-online-registered", value: "false"},
    {key: "show-blocked-percentage", value: "true"},
    {key: "show-unblocked-percentage", value: "true"},
    {key: "show-total-users-ip", value: "true"},
    {key: "show-blocked-this-month-percentage", value: "true"},
    {key: "autocheck-newmembers", value: "false"},
    {key: "autocheck-only-parameters", value: "false"},
    {key: "autocheck-only-parameters-sympathies", value: "20"},
    {key: "autocheck-only-parameters-messages", value: "50"},
    {key: "addbutton-chat", value: "true"},
    {key: "addbutton-alerts", value: "true"},
    {key: "addbutton-conversations", value: "true"},
    {key: "retry-after-error", value: "true"},
    {key: "fast-switch-with-button", value: "false"},
    {key: "fast-switch-with-button-key", value: "F2"},
    {key: "switch-page-automatically", value: "false"}
];

const dbName = 'lmf';
const storeName = 'settings';

let db;

function initDb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onerror = function(event) {
            console.error("Database error:", event.target.errorCode);
            reject();
        };

        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            db.createObjectStore(storeName, { keyPath: "key" });
        };

        request.onsuccess = function(event) {
            //console.log('Database opened successfully');
            db = event.target.result;
            resolve();
        };
    });
}

function addItem(item) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);
        const getRequest = objectStore.get(item.key);

        getRequest.onerror = function(event) {
            console.error("Error getting item:", event.target.errorCode);
            reject();
        };

        getRequest.onsuccess = function(event) {
            if (!event.target.result) {
                const addRequest = objectStore.add({ key: item.key, value: item.value });
                addRequest.onerror = function(event) {
                    console.error("Error adding item:", event.target.errorCode);
                    reject();
                };
                addRequest.onsuccess = function(event) {
                    console.log("Item added:", item.key);
                    resolve();
                };
            } else {
                // item already exists, resolve immediately
                resolve();
            }
        };
    });
}

function changeItemValue(key, value) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);
        const getRequest = objectStore.get(key);

        getRequest.onerror = function(event) {
            console.error("Error getting value:", event.target.errorCode);
            reject();
        };

        getRequest.onsuccess = function(event) {
            if (event.target.result) {
                const putRequest = objectStore.put({ key: key, value: value });
                putRequest.onerror = function(event) {
                    console.error("Error putting value:", event.target.errorCode);
                    reject();
                };
                putRequest.onsuccess = function(event) {
                    console.log("Value changed:", key);
                    resolve();
                };
            } else {
                // item does not exist, reject immediately
                reject();
            }
        };
    });
}

function addItems(items) {
    let promiseChain = Promise.resolve();

    items.forEach(function(item) {
        promiseChain = promiseChain.then(() => addItem(item));
    });

    return promiseChain;
}

function checkKeyValue(key) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);
        const getRequest = objectStore.get(key);

        getRequest.onerror = function(event) {
            console.error("Error getting value:", event.target.errorCode);
            reject();
        };

        getRequest.onsuccess = function(event) {
            resolve(event.target.result ? event.target.result.value : null);
        };
    });
}

initDb().then(() => addItems(items)).catch(console.error);

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

async function renderCheckboxes(checkboxes, page, lastId) {
    await ensureDbInitialized()

    const numCheckboxes = checkboxes.length;
    const checkboxesPerPage = 10;
    const numPages = Math.ceil(numCheckboxes / checkboxesPerPage);

    const startIndex = (page - 1) * checkboxesPerPage;
    const endIndex = page * checkboxesPerPage;
    filteredCheckboxes = checkboxes.slice((page - 1) * 10, page * 10);
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
                content += (nextPage <= numPages) ?
                    '<div style="margin-right: 10px; display: inline-block;"><button type="button" name="prev" value="Предыдущая страница" accesskey="s" class="button primary" id="prev-page-' + lastId + '">Предыдущая страница</button></div>' :
                '<button type="button" name="prev" value="Предыдущая страница" accesskey="s" class="button primary" id="prev-page-' + lastId + '">Предыдущая страница</button>';
            }
        }

        function addNextPageButton() {
            if (nextPage <= numPages) {
                content += (prevPage >= 1) ?
                    '<button type="button" name="next" value="Следующая страница" accesskey="s" class="button primary" id="next-page-' + lastId + '">Следующая страница</button>' :
                '<br><button type="button" name="next" value="Следующая страница" accesskey="s" class="button primary" id="next-page-' + lastId + '">Следующая страница</button>';
            }
        }

        function addPageNumber() {
            content += '<span style="margin-left: 10px;">Страница: ' + page + ' из ' + numPages + '</span>';
        }

        addPreviousPageButton(); addNextPageButton(); addPageNumber()
        return content
    }

    content = await renderPage(content);

    return content
}

let filteredCheckboxes

// ***вроде оптимизирован более-менее***
async function openSettings(page = 1) {
    await ensureDbInitialized();
    let modal = document.querySelector("div.modal.fade");
    if (modal && modal.querySelector('[id^="addbutton-"]')) {
        modal.remove();
    }
    document.querySelectorAll("div.modal-backdrop.fade").forEach((modalBackdrop) => modalBackdrop.remove());
    const lastId = generateRandomString(10);
    let checkboxes = [{ id: "autocheck-profile", label: "Автоматическая проверка в профиле" },
                      { id: 'autocheck-mini-profile', label: 'Автоматическая проверка в мини-профиле' },
                      { id: 'autocheck-banned-users-mporp', label: 'Автоматическая проверка для заблокированных', dependent: ['autocheck-profile', 'autocheck-mini-profile'] },
                      { id: 'autocheck-newmembers', label: 'Автоматическая проверка новых пользователей в разделе /members' },
                      { id: 'autocheck-online-registered', label: 'Автоматическая проверка в разделе /online/?type=registered' },
                      { id: 'autocheck-only-parameters', label: `Автоматическая проверка только по параметрам (<span id="sympCount-${lastId}">${await checkKeyValue('autocheck-only-parameters-sympathies')}</span> симпатий и <span id="msgCount-${lastId}">${await checkKeyValue('autocheck-only-parameters-messages')}</span> сообщений)` },
                      { id: 'addbutton-threads', label: 'Кнопка на посты и комментарии в теме (три точки)' },
                      { id: 'addbutton-chat', label: 'Кнопка на сообщения в чате (три точки)' },
                      { id: 'addbutton-profile', label: 'Кнопка на посты и комментарии в профиле (три точки)' },
                      { id: 'addbutton-alerts', label: 'Кнопка на уведомления (три точки)' },
                      { id: 'addbutton-conversations', label: 'Кнопка на диалоги в личных сообщения (три точки)' },
                      { id: 'show-blocked-percentage', label: 'Отображать в подробной информации % заблокированных' },
                      { id: 'show-unblocked-percentage', label: 'Отображать в подробной информации % не заблокированных' },
                      { id: 'show-total-users-ip', label: 'Отображать в подробной информации общее количество пользователей в общих IP' },
                      { id: 'show-blocked-this-month-percentage', label: 'Отображать в подробной информации % от заблокированных в этом месяце' },
                      { id: 'fast-switch-with-button', label: `Быстрое переключение на следующую страницу кнопкой <span id="buttonkey-${lastId}">${await checkKeyValue('fast-switch-with-button-key')}</span>` },
                      { id: 'retry-after-error', label: 'Повторная проверка после ошибки Name not found (15000 ms)' },
                      { id: 'switch-page-automatically', label: 'Переключать на следующую страницу автоматически (пока не найдет мошенника)' }];

    let content = await renderCheckboxes(checkboxes, page, lastId);
    XenForo.alert(content, "Lolzteam Multiaccount Finder");
    filteredCheckboxes.forEach(function (checkbox, index) {
        const id = checkbox.id + "-" + lastId;
        const checkboxEl = document.getElementById(id);
        if (checkboxEl) {
            checkboxEl.onclick = function () {
                changeItemValue(checkbox.id, `${this.checked}`);
                console.log(`Checkbox ${checkbox.id} is now ${this.checked}`);
            };
        }
    });
    const prevButton = document.getElementById("prev-page-" + lastId);
    const nextButton = document.getElementById("next-page-" + lastId);
    if (prevButton) {
        prevButton?.addEventListener("click", openSettings.bind(null, page - 1));
    }
    if (nextButton) {
        nextButton?.addEventListener("click", openSettings.bind(null, page + 1));
    }
    const addClickListener = (selector, promptMessage, localStorageKey) => {
        const el = document.querySelector(selector);
        if (el) {
            el.addEventListener("click", () => {
                const newValue = prompt(promptMessage);
                if (newValue !== null && !isNaN(parseInt(newValue)) && newValue.trim() !== "") {
                    changeItemValue(localStorageKey, newValue);
                    el.textContent = newValue;
                }
            });
        }
    };
    addClickListener(`#sympCount-${lastId}`, "Введите новое значение счетчика симпатий:", "autocheck-only-parameters-sympathies");
    addClickListener(`#msgCount-${lastId}`, "Введите новое значение счетчика сообщений:", "autocheck-only-parameters-messages");
    const buttonKey = document.querySelector(`#buttonkey-${lastId}`);
    if (buttonKey) {
        let keydownListener;
        buttonKey.addEventListener("click", () => {
            buttonKey.style.color = "red";
            const toggleKeydownListener = () => {
                if (keydownListener) {
                    document.removeEventListener("keydown", keydownListener);
                    buttonKey.style.color = "";
                    keydownListener = null;
                } else {
                    const currentKey = checkKeyValue("fast-switch-with-button-key");
                    keydownListener = (event) => {
                        if (event.key !== currentKey) {
                            changeItemValue("fast-switch-with-button-key", event.key);
                            buttonKey.textContent = event.key;
                            buttonKey.style.color = "";
                            document.removeEventListener("keydown", keydownListener);
                            keydownListener = null;
                        }
                    };
                    document.addEventListener("keydown", keydownListener);
                }
            };
            toggleKeydownListener();
        });
    }
}


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


async function ensureDbInitialized() {
    if (!db) {
        await initDb();
    }
}

async function checkAlertItems() {
    await ensureDbInitialized()
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
    await ensureDbInitialized()

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


async function OnlineChangeTable(classname, num) {
    await ensureDbInitialized()

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

// Проверяем, начинается ли текущий URL с "https://${domain}/online/?type=registered/"
async function AutoCheckOnlineRegistered() {
    await ensureDbInitialized()

    if ((await checkKeyValue("autocheck-online-registered")) === 'true') {
        if (window.location.href.indexOf(`https://${domain}/online/?type=registered`) === 0) {
            const currentPage = parseInt(document.querySelector('.currentPage').innerText.trim());
            const maxPage = parseInt(document.querySelector("#content > div > div > div > div > div > div > nav > a:nth-child(5)").innerText.trim());

            if (await checkKeyValue("fast-switch-with-button") === 'true') {
                let fastswitchwithbuttonkey = await checkKeyValue("fast-switch-with-button-key");
                document.addEventListener('keydown', function(event) {
                    if (event.key === fastswitchwithbuttonkey && currentPage < maxPage) {
                        console.log(1);
                        //window.location.href = `https://${domain}/online/?type=registered&page=${currentPage + 1}`;
                    }
                });
            }

            const visitorCountDl = document.querySelector('dl.visitorCount');
            const members = document.querySelectorAll('.member');
            if (visitorCountDl && !visitorCountDl.querySelector('dl.clean')) {
                // create new div element with class 'footnote'
                const newFootnoteDiv = document.createElement('div');
                newFootnoteDiv.className = 'footnote';
                // set innerHTML of new div element to provided HTML
                if (await checkKeyValue("autocheck-only-parameters") === "true") {
                    newFootnoteDiv.innerHTML = `<h3>Lolzteam Multiaccount Finder</h3><dl class="clean"><dt>Не заподозрены:</dt><dd>0</dd></dl><dl class="vpn"><dt>VPN:</dt><dd>0</dd></dl><dl class="scammers"><dt>Мошенники:</dt><dd>0</dd></dl><dl class="errors"><dt>Ошибки:</dt><dd>0</dd><dl class="skipped"><dt>Не подошли под указанные параметры:</dt><dd>0</dd></dl><dl class="remained"><dt>Осталось проверить:</dt><dd>${members.length}</dd></dl>`;
                } else {
                    newFootnoteDiv.innerHTML = `<h3>Lolzteam Multiaccount Finder</h3><dl class="clean"><dt>Не заподозрены:</dt><dd>0</dd></dl><dl class="vpn"><dt>VPN:</dt><dd>0</dd></dl><dl class="scammers"><dt>Мошенники:</dt><dd>0</dd></dl><dl class="errors"><dt>Ошибки:</dt><dd>0</dd><dl class="remained"><dt>Осталось проверить:</dt><dd>${members.length}</dd></dl>`;

                }
                // append new div element to visitorCountDl
                visitorCountDl.appendChild(newFootnoteDiv);
            }

            let index = 0;
            const checkNextMember = async () => {
                if (index >= members.length) {
                    const scammersCount = parseInt(document.querySelector("dl.scammers dd").innerText);
                    if (await checkKeyValue("switch-page-automatically") === 'true' && currentPage < maxPage && scammersCount < 1) {
                        window.location.href = `https://${domain}/online/?type=registered&page=${currentPage + 1}`;
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
                            await checkUser(`https://${domain}/${usernameHref}shared-ips`, 'registered', gifId);
                        } else {
                            OnlineChangeTable('dl.skipped', 1)
                        }
                    } else {
                        userStatCounters.appendChild(createGifElement(gifId, 'https://i.imgur.com/I5VH0zp.gif', 24,24));
                        await checkUser(`https://${domain}/${usernameHref}shared-ips`, 'registered', gifId);
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

AutoCheckOnlineRegistered()

async function AutoCheckNewMembers() {
    await ensureDbInitialized()

    if ((await checkKeyValue("autocheck-newmembers")) === 'true') {
        if (window.location.href.indexOf(`https://zelenka.guru/members`) === 0) {
            const visitorCountDl = document.querySelector('dl.memberCount')
            const members = document.querySelectorAll('.secondaryContent.avatarHeap.avatarList li')

            if (visitorCountDl && !visitorCountDl.querySelector('dl.clean')) {
                const newFootnoteDiv = document.createElement('div')
                newFootnoteDiv.className = 'footnote'
                newFootnoteDiv.innerHTML = `<h3>Lolzteam Multiaccount Finder</h3><dl class="clean"><dt>Не заподозрены:</dt><dd>0</dd></dl><dl class="vpn"><dt>VPN:</dt><dd>0</dd></dl><dl class="scammers"><dt>Мошенники:</dt><dd>0</dd></dl><dl class="errors"><dt>Ошибки:</dt><dd>0</dd></dl><dl class="remained"><dt>Осталось проверить:</dt><dd>${members.length}</dd></dl>`
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
                await checkUser(`https://${domain}/${usernameHref}shared-ips`, 'members', gifId)

                index++
                await checkNextMember()
            }

            checkNextMember().then()
        }
    }}

AutoCheckNewMembers()

function xenforoLogAndAlert(text, title) {
    console.log(text)
    XenForo.alert(`${text}`, `${title}`)
}

function encodeOutput(output) {
    const text = output.toString();
    return encodeURIComponent(text).replace("\n", "/%0A/g");
}

// ***уже оптимизирован***
async function checkUser(link, source, gifId) {
    await ensureDbInitialized()

    console.log(gifId)
    console.log(`${link.replace(/(https:\/\/.*?)\/\//g, '$1/').replace(/\/shared-ips/gi, "/shared-ips").replace(/(\/shared-ips)+/gi, "/shared-ips")}`)
    const response = await fetch(`${link.replace(/(https:\/\/.*?)\/\//g, '$1/').replace(/\/shared-ips/gi, "/shared-ips").replace(/(\/shared-ips)+/gi, "/shared-ips")}`)
    const data = await response.text()
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(data, "text/html");
    const userLogs = htmlDocument.getElementsByClassName("userLog");
    let bannedUsersCount = 0;
    let nonBannedUsersCount = 0;
    let bannedThisMonthCount = 0;
    const numUserLogs = userLogs.length;
    //console.log(userLogs)
    //console.log(numUserLogs);
    const nameEl = htmlDocument.querySelector(`a.crumb[href^="https://${domain}/"] span`);
    const name = nameEl ? nameEl.textContent.trim() : "";
    console.log(name)
    const gifElement = document.getElementById(gifId);
    if (!name) {
        //console.log("Name not found. Skipping further checks.");
        if (gifElement) {
            gifElement.src = 'https://i.imgur.com/wqXWudH.png'; // подгружаем иконку ошибки с imgur
        }
        OnlineChangeTable('dl.errors', 1);

        // Задержка в 15 секунд и повторная проверка

        if (await checkKeyValue('retry-after-error') === "true") {
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log("Retrying check for user:", link);
                    resolve(checkUser(link, source, gifId));
                }, 15000);
            });
        } else {
            throw new Error("Name not found");
        }
    }

    for (let i = 0; i < userLogs.length; i++) {
        const spans = userLogs[i].getElementsByTagName("span");
        let isBanned = false;
        for (let j = 0; j < spans.length; j++) {
            if (spans[j].classList.contains("banned")) {
                bannedUsersCount++;
                isBanned = true;
                const li = userLogs[i].querySelector('li.ipLog');
                if (li) {
                    const abbr = li.querySelector('abbr.DateTime');
                    const span = li.querySelector('span.DateTime');
                    if (abbr || span) {
                        const title = abbr ? abbr.getAttribute("data-datestring") : span.getAttribute("title");
                        if (title.includes(month) || title.includes('Сегодня') || title.includes('Вчера')) {
                            //console.log(title);
                            bannedThisMonthCount++;
                        }
                    }
                }
                break;
            }
        }
        if (!isBanned) {
            nonBannedUsersCount++;
        }
    }

    if (!link.replace('/shared-ips', '').includes(domain)) {
        link = `https://${domain}/${link.replace('/shared-ips', '')}`;
    }

    const totalUsers = bannedUsersCount + nonBannedUsersCount;
    const bannedPercent = totalUsers ? ((bannedUsersCount / totalUsers) * 100).toFixed(2) : 0;
    const nonBannedPercent = totalUsers ? ((nonBannedUsersCount / totalUsers) * 100).toFixed(2) : 0;
    const bannedThisMonthPercent = bannedUsersCount ? ((bannedThisMonthCount / bannedUsersCount) * 100).toFixed(2) : 0; // вычисляем процент заблокированных в текущем месяце

    const showBlockedPercentage = await checkKeyValue("show-blocked-percentage") === "true";
    const showUnblockedPercentage = await checkKeyValue("show-unblocked-percentage") === "true";
    const showTotalUsersIp = await checkKeyValue("show-total-users-ip") === "true";
    const showBlockedThisMonthPercentage = await checkKeyValue("show-blocked-this-month-percentage") === "true";

    let output = "";
    output += (showBlockedPercentage) ? `\n% заблокированных: ${bannedPercent} (${bannedUsersCount})` : '';
    output += (showUnblockedPercentage) ? `\n% не заблокированных: ${nonBannedPercent} (${nonBannedUsersCount})` : '';
    output += (showTotalUsersIp) ? `\nОбщее количество пользователей в общих IP: ${numUserLogs}` : '';
    output += (showBlockedThisMonthPercentage) ? `\n% от заблокированных в этом месяце: ${bannedThisMonthPercent} (${bannedThisMonthCount})` : '';

    function template(description) {
        let title = encodeOutput(`Жалоба на пользователя ${name}`)
        let message = encodeOutput(`[CLUB]1. Никнейм нарушителя и ссылка на профиль: ${link.replace(`/shared-ips`,``)}/\n2. Краткое описание жалобы: ${description}\n3. Доказательства: ${link.replace(`/shared-ips`,``)}/shared-ips[/CLUB]`)
        const template = `https://${domain}/forums/801/create-thread?prefix_id=92&title=${title}&message=${message}`;
        window.open(`${template}`, '_blank');
    }

    if (htmlDocument.body.textContent.includes("Пользователей по заданным параметрам не найдено.") ||
        htmlDocument.body.textContent.includes("No matching users were found.")) {
        gifElement && (gifElement.src = 'https://i.imgur.com/i4OlWJk.png');
        output = `${name} - пользователей по заданным параметрам не найдено.`
        gifElement && (gifElement.title = `${output}`);
        !gifElement && xenforoLogAndAlert(`${output}`, `Lolzteam Multiaccount Finder`);
        if (source === 'members' || source === 'registered') OnlineChangeTable('dl.clean', 1);

    } else if (bannedUsersCount >= nonBannedUsersCount && bannedUsersCount !== 0) {
        output = output ? `${name} - мошенник ${output}` : `${name} - мошенник`;
        if (gifElement) {
            gifElement.src = 'https://i.imgur.com/g5GxNHD.png';
            gifElement.style.cursor = 'pointer';
            gifElement.title = `${output}`
            if (source === 'members' || source === 'registered') OnlineChangeTable('dl.scammers', 1);
        } else {
            xenforoLogAndAlert(`${output}`, `Lolzteam Multiaccount Finder`);
        }

    } else if (nonBannedUsersCount > 15 && bannedUsersCount < nonBannedUsersCount / 3) {
        gifElement && (gifElement.src = 'https://i.imgur.com/o5qNA1o.png');
        output = output ? `${name} - использует VPN ${output}` : `${name} - использует VPN`;
        gifElement && (gifElement.title = `${output}`);
        !gifElement && xenforoLogAndAlert(`${output}`, `Lolzteam Multiaccount Finder`);
        if (source === 'members' || source === 'registered') OnlineChangeTable('dl.vpn', 1);

    } else if (nonBannedUsersCount > 6 && nonBannedUsersCount <= 15 && bannedUsersCount < nonBannedUsersCount / 2) {
        gifElement && (gifElement.src = 'https://i.imgur.com/o5qNA1o.png');
        output = output ? `${name} - возможно использует VPN ${output}` : `${name} - возможно использует VPN`;
        gifElement && (gifElement.title = `${output}`);
        !gifElement && xenforoLogAndAlert(`${output}`, `Lolzteam Multiaccount Finder`);
        if (source === 'members' || source === 'registered') OnlineChangeTable('dl.vpn', 1);

    } else if (bannedUsersCount > nonBannedUsersCount / 2) {
        output = output ? `${name} - возможно мошенник ${output}` : `${name} - возможно мошенник`;
        if (gifElement) {
            gifElement.src = 'https://i.imgur.com/g5GxNHD.png';
            gifElement.style.cursor = 'pointer';
            gifElement.title = `${output}`
            if (source === 'members' || source === 'registered') OnlineChangeTable('dl.scammers', 1);
        } else {
            xenforoLogAndAlert(`${output}`, `Lolzteam Multiaccount Finder`);
        }
    } else {
        gifElement && (gifElement.src = 'https://i.imgur.com/i4OlWJk.png');
        output = output ? `${name} - мультиаккаунт ${output}` : `${name} - мультиаккаунт`;
        gifElement && (gifElement.title = `${output}`);
        !gifElement && xenforoLogAndAlert(`${output}`, `Lolzteam Multiaccount Finder`);
        if (source === 'members' || source === 'registered') OnlineChangeTable('dl.clean', 1);
    }
    if (gifElement && output.includes("мошенник")) {
        gifElement.addEventListener('click', function () {
            // при нажатии на красный треугольник доступ к быстрому созданию темы
            template(output);
        });
    }}