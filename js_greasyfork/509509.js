// ==UserScript==
// @name         AutoHideLZT + Enter
// @namespace    http://tampermonkey.net/
// @version      4.6-stable
// @description  Автоматически добавляет хайд при создании тем и отправке сообщений на сайтах zelenka и lolz, так же отправляет хайд по Enter.
// @author       eretly & Timka241 & Toil & llimonix
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @match        https://lolz.live/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6P-us9TBOHABul4NCBuCWU6_W-b1DA_8YmA&s
// @grant        none
// @license      BSD-3-Clause
// @downloadURL https://update.greasyfork.org/scripts/509509/AutoHideLZT%20%2B%20Enter.user.js
// @updateURL https://update.greasyfork.org/scripts/509509/AutoHideLZT%20%2B%20Enter.meta.js
// ==/UserScript==

/*
 * Copyright 2024 eretly
 * Licensed under the BSD 3-Clause License.
 */

(function () {
    "use strict";

    // Флаги и переменные
    let isSending = false;
    let exceptIds = "";
    let yourWords = "";
    let wordsPosition = "none";
    const storageKey = "eretlyHIDE"; // Ключ для localStorage
    const availableWordsPositions = ["none", "left", "right"];
    const wordsPositionPhrases = {
        none: "Отключено",
        left: "Слева",
        right: "Справа",
    };
    const usableWordsPositions = availableWordsPositions.filter((pos) => pos !== "none");
    let hideOnButton = true;
    let hideOnEnter = true;
    let hideOnCreate = true;
    let ignoreHideList = false;
    let capitalizeFirstLetter = false;

    function loadSettings() {
        const savedSettings = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
        return savedSettings || {};
    }

    // Загрузка данных из localStorage при инициализации
    const savedSettings = loadSettings();
    if (savedSettings) {
        exceptIds = savedSettings.exceptIds || "";
        yourWords = savedSettings.yourWords || "";
        wordsPosition = savedSettings.wordsPosition || "none";
        hideOnButton = savedSettings.hideOnButton || false;
        hideOnEnter = savedSettings.hideOnEnter || false;
        hideOnCreate = savedSettings.hideOnCreate || false;
        ignoreHideList = savedSettings.ignoreHideList || false;
        capitalizeFirstLetter = savedSettings.capitalizeFirstLetter ?? false;
    }

    // Функция для отображения предупреждений
    function xfAlert(text) {
        if (typeof XenForo !== "undefined" && XenForo.alert) {
            XenForo.alert(text, "", 3000);
            return;
        }

        alert(text);
    }

    function magicChosen($select) {
        $select.chosen({
            width: "auto",
            search_contains: false,
            inherit_select_classes: true,
            disable_search: 1,
        });
        $select.trigger("chosen:updated");
    }

    function hasWordsPosition(initiator = "") {
        if (initiator === "theme" && !addWordsOnCreate) {
            return false;
        }

        return yourWords && usableWordsPositions.includes(wordsPosition);
    }

    function hasExceptIds(initiator = "") {
        if (ignoreHideList) return false;
        if (initiator === "theme" && !hideOnCreate) return false;
        return exceptIds && exceptIds.trim() !== "";
    }


    const canModify = (el, initiator = "") =>
    el && (hasExceptIds(initiator) || hasWordsPosition(initiator));

    const isInvalidAction = (el) =>
    el.classList.contains("chat2-input") ||
          window.location.href.match(/conversations\//) ||
          window.location.href.match(/create-thread/);

    function checkContainsByInsertRegex(regex, words, message) {
        // Добавляем текст "test" перед последним "/"
        const regexStr = regex.toString();
        const clearWords = words.replace("$&", "").replace(/[-[\]{}()*+?.,\\^$|]/g, "\\$&");
        let newRegexStr = words.startsWith("$&")
        ? regexStr.replace(/\/$/, `${clearWords}/`)
        : regexStr.replace(/^\//, `/${clearWords}`);

        // Преобразуем обратно в объект RegExp
        let newRegex = new RegExp(newRegexStr.slice(1, -1));

        return newRegex.exec(message);
    }

    function insertWordToMessage(message) {
        if (!yourWords.trim()) return message;

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = message;

        const nodes = Array.from(tempDiv.childNodes);

        const isIgnorableBlockquote = (node) =>
        node.nodeType === Node.ELEMENT_NODE &&
              node.tagName === "BLOCKQUOTE" &&
              !node.classList.length;

        if (wordsPosition === "left") {
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                if (!isIgnorableBlockquote(node)) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.textContent = yourWords + node.textContent;
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        node.innerHTML = yourWords + node.innerHTML;
                    }
                    return tempDiv.innerHTML;
                }
            }

            tempDiv.insertAdjacentHTML("afterbegin", yourWords);
        }

        if (wordsPosition === "right") {
            for (let i = nodes.length - 1; i >= 0; i--) {
                const node = nodes[i];
                if (!isIgnorableBlockquote(node)) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.textContent = node.textContent + yourWords;
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        node.innerHTML = node.innerHTML + yourWords;
                    }
                    return tempDiv.innerHTML;
                }
            }

            tempDiv.insertAdjacentHTML("beforeend", yourWords);
        }

        return tempDiv.innerHTML;
    }


    function smartCapitalize(text) {
        if (!capitalizeFirstLetter) return text;
        text = text.replace(/^\s*([a-zA-Zа-яёЁ])/u, (m, ch) => ch.toUpperCase());
        text = text.replace(/([.!?])(\s*)([a-zA-Zа-яёЁ])/gu, (m, sep, space, ch) => sep + space + ch.toUpperCase());
        return text;
    }

    function traverseAndSmartCapitalize(root) {
        if (!capitalizeFirstLetter) return;

        let lastChar = ".";
        function process(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                let text = node.nodeValue;
                let result = "";
                let capitalizeNext = /[.!?]/.test(lastChar) || result.length === 0;

                for (let i = 0; i < text.length; i++) {
                    let ch = text[i];
                    if (capitalizeNext && /[a-zA-Zа-яёЁ]/i.test(ch)) {
                        ch = ch.toUpperCase();
                        capitalizeNext = false;
                    }
                    result += ch;
                    if (/[.!?]/.test(ch)) capitalizeNext = true;
                }

                node.nodeValue = result;
                lastChar = result[result.length - 1] || lastChar;

            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'BR' || node.tagName === 'IMG') return;
                for (let child of node.childNodes) {
                    process(child);
                }
            }
        }

        process(root);
    }

    function insertBreakAtCursor() {
        const sel = window.getSelection();
        if (!sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        range.deleteContents();

        const br = document.createElement("br");
        range.insertNode(br);

        const spacer = document.createTextNode("\u200B"); // zero-width space
        range.insertNode(spacer);

        range.setStartAfter(spacer);
        range.collapse(true);

        sel.removeAllRanges();
        sel.addRange(range);
    }

    function attachAutoCapitalize(el) {
        if (!el || el._autoCapitalizeAttached) return;
        el._autoCapitalizeAttached = true;

        if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
            el.form && el.form.addEventListener('submit', function () {
                el.value = smartCapitalize(el.value);
            }, true);

            el.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
                    setTimeout(() => {
                        el.value = smartCapitalize(el.value);
                    }, 0);
                }
            }, true);
        } else if (el.isContentEditable) {
            el.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
                    e.preventDefault(); // отключаем дефолтный перенос

                    insertBreakAtCursor();

                    setTimeout(() => {
                        traverseAndSmartCapitalize(el);
                    }, 0);
                }
            }, true);

            el.closest('form') && el.closest('form').addEventListener('submit', function () {
                traverseAndSmartCapitalize(el);
            }, true);

            el.addEventListener('blur', function () {
                traverseAndSmartCapitalize(el);
            }, true);
        }
    }

    function observeFields() {
        const selector = 'textarea:not([data-acap]),input[type="text"]:not([data-acap]),div[contenteditable="true"]:not([data-acap])';

        const processAll = () => {
            document.querySelectorAll(selector).forEach(el => {
                el.setAttribute('data-acap', '1');
                attachAutoCapitalize(el);
            });
        };

        const observer = new MutationObserver(processAll);
        observer.observe(document.body, { childList: true, subtree: true });
        processAll();
    }

    document.addEventListener('click', function (e) {
        if (
            e.target.closest('.lzt-fe-se-sendMessageButton') ||
            e.target.closest('.button--primary') ||
            e.target.closest('.postThreadButton') ||
            e.target.closest('.profilePostButton') ||
            e.target.closest('.fr-command[data-cmd="send"]')
        ) {
            document.querySelectorAll('textarea[data-acap],input[type="text"][data-acap]').forEach(el => {
                el.value = smartCapitalize(el.value);
            });
            document.querySelectorAll('div[contenteditable="true"][data-acap]').forEach(div => {
                traverseAndSmartCapitalize(div);
            });
        }
    }, true);

    observeFields();


    function updateHtmlContent(el, initiator = "") {
        if (!canModify(el, initiator)) {
            return;
        }

        // Сохраняем оригинальный HTML
        let currentHTML = el.innerHTML.trim();

        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = currentHTML;

        currentHTML = tempDiv.innerHTML;

        // Вставка своих слов (если нужно)
        if (hasWordsPosition(initiator)) {
            currentHTML = insertWordToMessage(currentHTML);
        }
        const existingHideBlock = el.querySelector(
            'blockquote.wysiwygHide[data-tag="users"], blockquote.wysiwygHide[data-tag="exceptids"], blockquote.wysiwygHide[data-tag="except"]'
        );
        if (hasExceptIds(initiator) && !existingHideBlock) {
            const hideOpenTag = `<blockquote class="wysiwygHide needOption" data-tag="exceptids" data-phrase="Никнеймы пользователей, которые не смогут увидеть" data-align="left" data-option="${exceptIds}">`;
            const hideCloseTag = `</blockquote>`;
            currentHTML = `${hideOpenTag} ${currentHTML} ${hideCloseTag}`;
        }

        el.innerHTML = currentHTML;
    }

    function handleSendMessage(inputElement) {
        if (isSending) {
            return; // Если уже отправляется сообщение, выходим
        }

        isSending = true; // Устанавливаем флаг отправки

        const editorBoxElement = inputElement.closest(".defEditor");
        if (!editorBoxElement) {
            isSending = false;
            return;
        }

        const sendButton = editorBoxElement.querySelector(
            ".lzt-fe-se-sendMessageButton, .button.primary.mbottom, .submitUnit .button.primary",
        );
        if (!sendButton) {
            isSending = false;
            return;
        }

        console.log("Отправка сообщения...");
        sendButton.click();
        sendButton.disabled = true; // Отключаем кнопку отправки

        // Задержка перед отправкой
        setTimeout(() => {
            // sendButton.click(); // Симулируем клик по кнопке отправки
            inputElement.innerHTML = ""; // Очищаем поле ввода после отправки
            isSending = false; // Сбрасываем флаг после задержки
            sendButton.disabled = false; // Включаем кнопку отправки снова
        }, 100);
    }

    // Функция для обработки нажатия на кнопку отправки сообщения
    async function handleSendMessageButtonClick(event) {
        // Проверяем состояние чекбокса Хайд по кнопке
        if (!hideOnButton) {
            console.log("Галочка не включена. Отправка сообщения отменена."); // Лог для отладки
            return;
        }

        // Попытка найти родительский элемент с классом '.defEditor' или '#ProfilePoster'
        const defEditorElement = event.target.closest(".defEditor");
        const profilePosterElement = event.target.closest("#ProfilePoster");
        const parentEl = defEditorElement ?? profilePosterElement;

        const inputElement = parentEl?.querySelector('.fr-element.fr-view[contenteditable="true"]');
        if (!inputElement) {
            return;
        }

        if (isInvalidAction(inputElement)) {
            return;
        }

        updateHtmlContent(inputElement);
        handleSendMessage(inputElement);
    }

    // Функция для обработки нажатия клавиши Enter
    function handleEnterKey(event) {
        // Проверяем состояние hideOnEnter
        if (!hideOnEnter) {
            // Если галочка не включена, просто предотвращаем действие Enter
            return;
        }

        const inputSearchElement = document.querySelector('input[name="keywords"]');
        if (event.target === inputSearchElement && event.key === "Enter") {
            console.log("Поиск выполнен: ", inputSearchElement.value);
            return;
        }

        // Проверка, находимся ли мы в одной из форм, где нужно заблокировать Enter
        const formElement = event.target.closest(
            'form[action="conversations/insert"], ' +
            'form[action^="posts/"][action$="/save-inline"], ' +
            'form[action^="profile-posts/comments/"][action$="/edit"]',
        );

        if (formElement) {
            return; // Если фокус на одной из форм, просто выходим
        }

        // Проверяем, это клавиша Enter без зажатого Shift
        if (!(event.key === "Enter" || event.keyCode === 13) || event.shiftKey) {
            return; // Если это не Enter или зажат Shift, выходим
        }

        // Определяем, это ли редактор или чат
        const inputElement = document.querySelector(
            '.fr-element.fr-view[contenteditable="true"]:focus',
        );
        if (!inputElement) {
            return;
        }

        if (isInvalidAction(inputElement)) {
            return;
        }

        event.preventDefault(); // Предотвращаем стандартное поведение
        event.stopPropagation(); // Останавливаем дальнейшую обработку события

        updateHtmlContent(inputElement);
        handleSendMessage(inputElement);
    }

    // Добавляем обработчик события клика на кнопку отправки сообщения
    document.addEventListener("mousedown", (event) => {
        const sendButton = event.target.closest(
            ".lzt-fe-se-sendMessageButton, .button.primary.mbottom, .submitUnit .button.primary",
        );
        if (!sendButton) {
            return;
        }

        handleSendMessageButtonClick(event);
    });

    // Добавляем обработчик нажатия клавиши Enter только в редакторе и чате
    document.addEventListener("keydown", handleEnterKey, true);

    let settings = JSON.parse(localStorage.getItem(storageKey)) || {};
    let addWordsOnCreate = settings.addWordsOnCreate || false;

    // Обработчик для кнопки "Создать тему"
    document.addEventListener("click", function (event) {
        const button = event.target;
        // Проверяем, если это кнопка "Создать тему"
        if (!(button.type === "submit" && button.value === "Создать тему")) {
            return;
        }

        console.log("Кнопка 'Создать тему' нажата");
        const inputElement = document.querySelector('.fr-element.fr-view[contenteditable="true"]');
        if (!inputElement) {
            return;
        }

        updateHtmlContent(inputElement, "theme");
    });


    // Кнопки и все такое
    function createGearButton() {
        // Создаем обе кнопки сразу
        createDesktopButton()
        createMobileButton()
    }

    function createDesktopButton() {
        const gearButton = document.createElement("button")
        gearButton.id = "SettingsSwitcherHide"
        gearButton.classList.add("PopupControl", "Tooltip")
        gearButton.style.position = "absolute"
        gearButton.style.right = "12px"
        gearButton.style.top = "48%"
        gearButton.style.transform = "translateY(-50%)"
        gearButton.style.width = "22px"
        gearButton.style.height = "22px"
        gearButton.style.color = "#b3b3b3"
        gearButton.style.background = "none"
        gearButton.style.border = "none"
        gearButton.style.cursor = "pointer"
        gearButton.style.fontSize = "22px"
        gearButton.style.display = "inline-flex"
        gearButton.style.alignItems = "center"
        gearButton.style.justifyContent = "center"
        gearButton.style.padding = "0"
        gearButton.style.lineHeight = "25px"
        gearButton.setAttribute("title", "Настройки AutoHideLZT")
        gearButton.setAttribute("data-cachedtitle", "Настройки AutoHideLZT")

        const style = document.createElement("style")
        style.textContent = `
    #SettingsSwitcherHide::before {
        width: 22px;
        height: 22px;
        content: '';
        display: inline-block;
        background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 width=%2720%27 height=%2720%27 stroke=%27rgb(140,140,140)%27 stroke-width=%272%27 fill=%27none%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 class=%27css-i6dzq1%27%3E%3Cpath d=%27M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065%27/%3E%3Cpath d=%27M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0%27/%3E%3C/svg%3E');
        background-size: 22px 22px;
    }
    #SettingsSwitcherHide:hover::before {
        background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 width=%2720%27 height=%2720%27 stroke=%27rgb(58, 169, 119)%27 stroke-width=%272%27 fill=%27none%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 class=%27css-i6dzq1%27%3E%3Cpath d=%27M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065%27/%3E%3Cpath d=%27M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0%27/%3E%3C/svg%3E');
    }
`
        document.head.appendChild(style)

        const profileListItem = document.querySelector("#AccountMenu > ul > li:nth-child(1)")
        if (profileListItem) {
            profileListItem.style.position = "relative"
            profileListItem.appendChild(gearButton)

            setTimeout(() => {
                if (typeof window.XenForo !== "undefined" && window.XenForo.Tooltip) {
                    window.XenForo.Tooltip(gearButton)
                }
            }, 200)

            gearButton.addEventListener("pointerdown", (event) => {
                event.stopPropagation()
                toggleSettingsMenu()
                setTimeout(() => {
                    const menu = document.getElementById("settingsMenu")
                    if (menu) {
                        menu.style.visibility = "visible"
                        menu.style.opacity = 1
                        menu.style.transform = "translateY(0)"
                    }
                }, 50)
            })
        }
    }

    function createMobileButton() {
        function createMobileGearButton() {
            const profileButtons = Array.from(document.querySelectorAll("a.button")).filter((btn) => {
                const text = btn.textContent.trim()
                return text === "Перейти в профиль" || text.includes("профиль") || (btn.href && btn.href.includes("/members/"))
            })

            for (const profileButton of profileButtons) {
                const parentBlock =
                      profileButton.closest(".profile-block") ||
                      profileButton.closest(".memberHeader") ||
                      profileButton.closest(".userInfo")

                if (!parentBlock) {
                    console.warn("Не найден допустимый контейнер для шестерёнки")
                    return
                }

                if (parentBlock.querySelector("#SettingsSwitcherMobile")) return

                if (!parentBlock.contains(profileButton)) {
                    console.warn("Кнопка вне ожидаемого контейнера, вставка отменена")
                    return
                }

                let wrapper = profileButton.parentElement
                if (!wrapper || wrapper === parentBlock) {
                    wrapper = document.createElement("div")
                    wrapper.style.display = "inline-flex"
                    wrapper.style.alignItems = "center"
                    wrapper.style.gap = "8px"
                    profileButton.parentNode.insertBefore(wrapper, profileButton)
                    wrapper.appendChild(profileButton)
                } else {
                    wrapper.style.display = "inline-flex"
                    wrapper.style.alignItems = "center"
                    wrapper.style.gap = "8px"
                }

                const gearButton = document.createElement("button")
                gearButton.id = "SettingsSwitcherMobile"
                gearButton.classList.add("PopupControl", "Tooltip")
                gearButton.setAttribute("title", "Настройки AutoHideLZT")
                gearButton.setAttribute("data-cachedtitle", "Настройки AutoHideLZT")

                Object.assign(gearButton.style, {
                    width: "24px",
                    height: "24px",
                    background: "none",
                    border: "none",
                    padding: "0",
                    cursor: "pointer",
                    zIndex: "10",
                    flexShrink: "0",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#b3b3b3",
                })

                gearButton.innerHTML = `
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='22' height='22' fill='none' stroke='#b3b3b3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
            <path d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065'/>
            <path d='M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0'/>
        </svg>
    `

                wrapper.appendChild(gearButton)

                setTimeout(() => {
                    if (typeof window.XenForo !== "undefined" && window.XenForo.Tooltip) {
                        window.XenForo.Tooltip(gearButton)
                    }
                }, 200)

                gearButton.addEventListener("click", (event) => {
                    event.stopPropagation()
                    toggleSettingsMenu()
                    setTimeout(() => {
                        const menu = document.getElementById("settingsMenu")
                        if (menu) {
                            menu.style.visibility = "visible"
                            menu.style.opacity = 1
                            menu.style.transform = "translateY(0)"
                        }
                    }, 50)
                })

                return
            }
        }

        createMobileGearButton()

        const observer = new MutationObserver(() => {
            if (!document.querySelector("#SettingsSwitcherMobile")) {
                setTimeout(createMobileGearButton, 100)
            }
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        })
    }

    const settingsMenu = document.createElement("div")
    settingsMenu.id = "settingsMenu"
    settingsMenu.style.position = "fixed"
    settingsMenu.style.backgroundColor = "#272727"
    settingsMenu.style.color = "white"
    settingsMenu.style.padding = "10px"
    settingsMenu.style.borderRadius = "6px"
    settingsMenu.style.visibility = "hidden"
    settingsMenu.style.opacity = 0
    settingsMenu.style.transform = "translateY(-10px)"
    settingsMenu.style.zIndex = "9999"
    settingsMenu.style.right = "0px"
    settingsMenu.style.top = "0px"
    settingsMenu.style.height = "297px"
    settingsMenu.style.width = "350px"
    settingsMenu.style.transition = "opacity 100ms linear, transform 100ms linear, visibility 100ms linear"
    settingsMenu.style.outline = "1px solid #363636"

    function createSettingsMenu() {
        if (document.getElementById("settingsMenu")) {
            return
        }
        document.body.appendChild(settingsMenu)
    }

    function toggleSettingsMenu() {
        const settingsMenu = document.getElementById("settingsMenu")
        if (!settingsMenu) {
            createSettingsMenu()
            return
        }

        if (settingsMenu.style.visibility === "visible") {
            settingsMenu.style.visibility = "hidden"
            settingsMenu.style.opacity = 0
            settingsMenu.style.transform = "translateY(-100%)"
        } else {
            settingsMenu.style.visibility = "visible"
            settingsMenu.style.opacity = 1
            settingsMenu.style.transform = "translateY(0)"
        }
    }

    function initialize() {
        createSettingsMenu()
        createGearButton()
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize)
    } else {
        initialize()
    }

    // Заголовок меню
    const settingsTitle = document.createElement("h3");
    settingsTitle.textContent = "Настройки AutoHideLZT";
    settingsTitle.style.margin = "0";
    settingsTitle.style.color = "white";
    settingsTitle.style.position = "relative";
    settingsTitle.style.top = "-5px";
    settingsTitle.style.display = "inline-block";
    settingsTitle.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Open Sans', HelveticaNeue, sans-serif";
    settingsTitle.style.fontWeight = "bold";
    settingsMenu.appendChild(settingsTitle);

    // Кнопка закрытия меню
    const closeButton = document.createElement("button");
    closeButton.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'>
    <line x1='6' y1='6' x2='18' y2='18' stroke='currentColor' stroke-width='2'/>
    <line x1='18' y1='6' x2='6' y2='18' stroke='currentColor' stroke-width='2'/></svg>`;
    closeButton.style.color = "white";
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.border = "none";
    closeButton.style.cursor = "pointer";
    closeButton.style.width = "30px";
    closeButton.style.height = "30px";
    closeButton.style.position = "absolute";
    closeButton.style.top = "0px";
    closeButton.style.right = "0px";
    closeButton.onclick = () => {
        closeSettingsMenu();
    };
    settingsMenu.appendChild(closeButton);

    // Поле для ввода User ID
    const userIdInput = document.createElement("input");
    userIdInput.classList.add("textCtrl");
    userIdInput.placeholder = "Введите User ID через запятую";
    userIdInput.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Open Sans', HelveticaNeue, sans-serif";
    userIdInput.style.width = "100%";
    userIdInput.style.marginBottom = "5px";
    userIdInput.value = exceptIds;

    // Создаем контейнер для кнопок
    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.display = "flex";
    buttonsContainer.style.justifyContent = "flex-start";
    buttonsContainer.style.marginTop = "0px";

    // Создаем контейнер для your words
    const wordsPositionContainer = document.createElement("div");
    wordsPositionContainer.style.display = "flex";
    wordsPositionContainer.style.flexDirection = "column";
    wordsPositionContainer.style.margin = "10px 0 2px";

    // Кнопка сохранения
    const saveButton = document.createElement("button");
    saveButton.classList.add("button", "primary");
    saveButton.textContent = "Сохранить";
    saveButton.style.marginRight = "5px";
    saveButton.style.marginTop = "3px";
    saveButton.style.padding = "0px 5px";
    saveButton.style.fontSize = "12px";
    saveButton.style.height = "26px";
    saveButton.style.lineHeight = "26px";
    saveButton.onclick = () => {
        exceptIds = userIdInput.value;
        yourWords = yourWordsInput.value;
        wordsPosition = $(wordsPositionSelect).val();
        hideOnButton = hideOnButtonCheckbox.checked;
        addWordsOnCreate = addWordsOnCreateCheckbox.checked;
        hideOnCreate = hideOnCreateCheckbox.checked;
        hideOnEnter = hideOnEnterCheckbox.checked;
        ignoreHideList = ignoreHideListCheckbox.checked;
        capitalizeFirstLetter = capitalizeFirstLetterCheckbox.checked;

        localStorage.setItem(
            storageKey,
            JSON.stringify({
                exceptIds,
                hideOnButton,
                yourWords,
                wordsPosition,
                addWordsOnCreate,
                hideOnCreate,
                hideOnEnter,
                ignoreHideList,
                capitalizeFirstLetter: capitalizeFirstLetterCheckbox.checked
            }),
        );
        xfAlert("Настройки сохранены");
        closeSettingsMenu();
    };

    // Кнопка отмены
    const cancelButton = document.createElement("button");
    cancelButton.classList.add("button", "primary", "small-button");
    cancelButton.textContent = "Отмена";
    cancelButton.style.marginTop = "3px";
    cancelButton.style.padding = "0px 5px";
    cancelButton.style.fontSize = "12px";
    cancelButton.style.height = "26px";
    cancelButton.style.lineHeight = "26px";
    cancelButton.onclick = () => {
        userIdInput.value = exceptIds;
        yourWordsInput.value = yourWords;
        $(wordsPositionSelect).val(wordsPosition).trigger("chosen:updated");
        hideOnButtonCheckbox.checked = hideOnButton;
        addWordsOnCreateCheckbox.checked = addWordsOnCreate;
        hideOnCreateCheckbox.checked = hideOnCreate;
        hideOnEnterCheckbox.checked = hideOnEnter;
        ignoreHideListCheckbox.checked = ignoreHideList;
        capitalizeFirstLetterCheckbox.checked = capitalizeFirstLetter;
        closeSettingsMenu();
    };

    // Чекбокс для включения/выключения хайда по Enter
    const hideOnEnterCheckbox = document.createElement("input");
    hideOnEnterCheckbox.type = "checkbox";
    hideOnEnterCheckbox.checked = hideOnEnter;
    hideOnEnterCheckbox.id = "hideOnEnterCheckbox";

    const hideOnEnterLabel = document.createElement("label");
    hideOnEnterLabel.textContent = "Добавлять хайд / yourWords по Enter";
    hideOnEnterLabel.setAttribute("for", "hideOnEnterCheckbox");
    hideOnEnterLabel.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Open Sans', HelveticaNeue, sans-serif";
    hideOnEnterLabel.style.fontSize = "12px";
    hideOnEnterLabel.style.marginLeft = "-2px";

    // Чекбокс для включения/выключения хайда по кнопке отправки
    const hideOnButtonCheckbox = document.createElement("input");
    hideOnButtonCheckbox.type = "checkbox";
    hideOnButtonCheckbox.checked = hideOnButton;
    hideOnButtonCheckbox.id = "hideOnButtonCheckbox";
    hideOnButtonCheckbox.style.marginTop = "2px";

    const hideOnButtonLabel = document.createElement("label");
    hideOnButtonLabel.textContent = "Добавлять хайд / yourWords по кнопке отправки";
    hideOnButtonLabel.setAttribute("for", "hideOnButtonCheckbox");
    hideOnButtonLabel.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Open Sans', HelveticaNeue, sans-serif";
    hideOnButtonLabel.style.fontSize = "12px";
    hideOnButtonLabel.style.marginLeft = "-2px";

    // Чекбокс для включения/выключения хайда при создании темы
    const hideOnCreateCheckbox = document.createElement("input");
    hideOnCreateCheckbox.type = "checkbox";
    hideOnCreateCheckbox.checked = hideOnCreate;
    hideOnCreateCheckbox.id = "hideOnCreateCheckbox";
    hideOnCreateCheckbox.style.marginTop = "2px";

    const hideOnCreateLabel = document.createElement("label");
    hideOnCreateLabel.textContent = "Добавлять хайд / yourWords при создании темы";
    hideOnCreateLabel.setAttribute("for", "hideOnCreateCheckbox");
    hideOnCreateLabel.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Open Sans', HelveticaNeue, sans-serif";
    hideOnCreateLabel.style.fontSize = "12px";
    hideOnCreateLabel.style.marginLeft = "-2px";

    // Чекбокс для добавления yourWords при создании темы
    const addWordsOnCreateCheckbox = document.createElement("input");
    addWordsOnCreateCheckbox.type = "checkbox";
    addWordsOnCreateCheckbox.checked = addWordsOnCreate;
    addWordsOnCreateCheckbox.id = "addWordsOnCreateCheckbox";
    addWordsOnCreateCheckbox.style.marginTop = "6px";

    const addWordsOnCreateLabel = document.createElement("label");
    addWordsOnCreateLabel.textContent = "Добавлять yourWords при создании темы";
    addWordsOnCreateLabel.setAttribute("for", "addWordsOnCreateCheckbox");
    addWordsOnCreateLabel.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Open Sans', HelveticaNeue, sans-serif";
    addWordsOnCreateLabel.style.fontSize = "12px";
    addWordsOnCreateLabel.style.marginLeft = "-2px";
    addWordsOnCreateLabel.style.marginTop = "6px";

    const addWordsContainer = document.createElement("div");
    addWordsContainer.style.display = "flex";
    addWordsContainer.append(addWordsOnCreateCheckbox, addWordsOnCreateLabel);

    const yourWordsHeader = document.createElement("h3");
    yourWordsHeader.textContent = "Настройки yourWords";
    yourWordsHeader.style.margin = "0";
    yourWordsHeader.style.color = "white";
    yourWordsHeader.style.position = "relative";
    yourWordsHeader.style.top = "-5px";
    yourWordsHeader.style.display = "inline-block";
    yourWordsHeader.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Open Sans', HelveticaNeue, sans-serif";
    yourWordsHeader.style.fontWeight = "bold";

    // Чекбокс "Игнорировать список хайда"
    const ignoreHideListCheckbox = document.createElement("input");
    ignoreHideListCheckbox.type = "checkbox";
    ignoreHideListCheckbox.checked = ignoreHideList;
    ignoreHideListCheckbox.id = "ignoreHideListCheckbox";
    ignoreHideListCheckbox.style.marginTop = "2px";

    const ignoreHideListLabel = document.createElement("label");
    ignoreHideListLabel.textContent = "Игнорировать список хайда (вставка yourWords без хайда)";
    ignoreHideListLabel.setAttribute("for", "ignoreHideListCheckbox");
    ignoreHideListLabel.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Open Sans', HelveticaNeue, sans-serif";
    ignoreHideListLabel.style.fontSize = "12px";
    ignoreHideListLabel.style.marginLeft = "-2px";

    // Поле для ввода "yourwords"
    const yourWordsInput = document.createElement("input");
    yourWordsInput.classList.add("textCtrl");
    yourWordsInput.placeholder = "Ваши слова, перенос через <br>";
    yourWordsInput.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Open Sans', HelveticaNeue, sans-serif";
    yourWordsInput.style.width = "100%";
    yourWordsInput.style.marginBottom = "5px";
    yourWordsInput.value = yourWords;

    // Чекбокс для капитализации первой буквы
    const capitalizeFirstLetterCheckbox = document.createElement("input");
    capitalizeFirstLetterCheckbox.type = "checkbox";
    capitalizeFirstLetterCheckbox.checked = capitalizeFirstLetter;
    capitalizeFirstLetterCheckbox.id = "capitalizeFirstLetterCheckbox";
    capitalizeFirstLetterCheckbox.style.marginTop = "2px";

    const capitalizeFirstLetterLabel = document.createElement("label");
    capitalizeFirstLetterLabel.textContent = "Первая буква заглавная (без чекбоксов отправки)";
    capitalizeFirstLetterLabel.setAttribute("for", "capitalizeFirstLetterCheckbox");
    capitalizeFirstLetterLabel.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Open Sans', HelveticaNeue, sans-serif";
    capitalizeFirstLetterLabel.style.fontSize = "12px";
    capitalizeFirstLetterLabel.style.marginLeft = "-2px";

    // Выбор положения yourWords
    const wordsPositionSelect = document.createElement("select");
    wordsPositionSelect.classList.add("textCtrl", "Lzt-PrettySelect");
    wordsPositionSelect.id = "wordsPositionSelect";
    wordsPositionSelect.style.marginBottom = "0px";

    const wordsPositionOptions = availableWordsPositions.map((wordsPositionItem) => {
        const option = document.createElement("option");
        option.value = wordsPositionItem;
        option.textContent = wordsPositionPhrases[wordsPositionItem];
        option.selected = wordsPositionItem === wordsPosition;
        return option;
    });

    const wordsPositionGroup = document.createElement("optgroup");
    wordsPositionGroup.label = "Положение слов";
    wordsPositionGroup.append(...wordsPositionOptions);
    wordsPositionSelect.append(wordsPositionGroup);
    wordsPositionContainer.append(
        yourWordsHeader,
        yourWordsInput,
        wordsPositionSelect,
        addWordsContainer
    );

    // Добавляем чекбоксы и кнопки в меню настроек
    settingsMenu.appendChild(userIdInput);
    settingsMenu.appendChild(document.createElement("br"));
    settingsMenu.appendChild(hideOnEnterCheckbox);
    settingsMenu.appendChild(hideOnEnterLabel);
    settingsMenu.appendChild(document.createElement("br"));
    settingsMenu.appendChild(hideOnButtonCheckbox);
    settingsMenu.appendChild(hideOnButtonLabel);
    settingsMenu.appendChild(document.createElement("br"));
    settingsMenu.appendChild(hideOnCreateCheckbox);
    settingsMenu.appendChild(hideOnCreateLabel);
    settingsMenu.appendChild(document.createElement("br"));
    settingsMenu.appendChild(capitalizeFirstLetterCheckbox);
    settingsMenu.appendChild(capitalizeFirstLetterLabel);
    settingsMenu.appendChild(document.createElement("br"));
    settingsMenu.appendChild(wordsPositionContainer);
    settingsMenu.appendChild(ignoreHideListCheckbox);
    settingsMenu.appendChild(ignoreHideListLabel);
    settingsMenu.appendChild(document.createElement("br"));
    settingsMenu.appendChild(buttonsContainer);

    // Добавляем кнопки в контейнер
    buttonsContainer.appendChild(saveButton);
    buttonsContainer.appendChild(cancelButton);

    document.body.appendChild(settingsMenu);

    const $wordsPositionSelect = $(wordsPositionSelect);
    magicChosen($wordsPositionSelect);

    function closeSettingsMenu() {
        settingsMenu.style.opacity = 0;
        settingsMenu.style.transform = "translateY(-10px)";
        setTimeout(() => {
            settingsMenu.style.visibility = "hidden";
        }, 300);
    }

    // Автор копирования айди по кнопке в профиле https://lolz.live/el9in/
    const followContainer =
          document.querySelector("div.followContainer") ||
          document.querySelector("a.button.full.followContainer.OverlayTrigger");

    if (followContainer) {
        const idContainer = document.createElement("div");
        idContainer.className = "idContainer";
        const idButton = document.createElement("a");
        idButton.className = "idButton button block OverlayTrigger";
        idButton.setAttribute("title", "");
        idButton.setAttribute("id", "");
        idButton.setAttribute("data-cacheoverlay", "false");
        idButton.textContent = "Скопировать ID";
        idContainer.appendChild(idButton);
        followContainer.insertAdjacentElement("afterend", idContainer);
        idButton.addEventListener("click", function () {
            const userContentLinks = document.querySelector("div.userContentLinks");
            const firstLink = userContentLinks.querySelector("a.button:nth-child(2)");
            const href = firstLink.getAttribute("href");
            const hrefText = href.match(/\/(\d+)\//)[1];
            if ((hrefText | 0) != 0) {
                const userId = hrefText | 0;
                navigator.clipboard
                    .writeText(userId)
                    .then(() => {
                    // Уведомление об успешном копировании
                    xfAlert("ID успешно скопирован: " + userId);
                })
                    .catch((err) => {
                    // Обработка ошибок копирования
                    console.error("Ошибка копирования: ", err);
                    xfAlert("Ошибка копирования ID. Попробуйте еще раз.");
                });
            }
        });
    }
})();
