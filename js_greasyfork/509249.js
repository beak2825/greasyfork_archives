// ==UserScript==
// @name         AutoHideLZT + Enter
// @namespace    http://tampermonkey.net/
// @version      5.88
// @description  Автоматически добавляет хайд при создании тем и отправке сообщений на сайтах zelenka и lolz, так же отправляет хайд по Enter.
// @author       eretly & Timka241 & Toil & llimonix
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @match        https://lolz.live/*
// @match        https://lzt.market/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6P-us9TBOHABul4NCBuCWU6_W-b1DA_8YmA&s
// @grant        none
// @license      BSD-3-Clause
// @downloadURL https://update.greasyfork.org/scripts/509249/AutoHideLZT%20%2B%20Enter.user.js
// @updateURL https://update.greasyfork.org/scripts/509249/AutoHideLZT%20%2B%20Enter.meta.js
// ==/UserScript==

/* eslint-env browser */
/* eslint-disable no-undef */

/*
 * Copyright 2025 eretly
 * Licensed under the BSD 3-Clause License.
 */

;(() => {
    // Объявляем глобальные переменные
    const XenForo = window.XenForo || {}
    const $ = window.$ || window.jQuery || (() => ({ chosen: () => {}, trigger: () => {}, val: () => {} }))
    const GM_getValue = window.GM_getValue || ((key, defaultValue) => localStorage.getItem(key) || defaultValue)
    const GM_setValue =
          window.GM_setValue ||
          ((key, value) => {
              localStorage.setItem(key, value)
          })

    // Флаги и переменные
    let isSending = false
    let isCreatingTheme = false
    let exceptIds = ""
    let userIds = ""
    let likesCount = ""
    let likes2Count = ""
    let daysCount = ""
    let hideType = "except"
    let yourWords = ""
    let wordsPosition = "none"
    let addWordsOnCreate = false
    const storageKey = "eretlyHIDEnew" // Ключ для localStorage
    const availableWordsPositions = ["none", "left", "right", "both"]
    const wordsPositionPhrases = {
        none: "Отключено",
        left: "Слева",
        right: "Справа",
        both: "С обеих сторон",
    }
    const usableWordsPositions = availableWordsPositions.filter((pos) => pos !== "none")
    let hideOnButton = true
    let hideOnEnter = true
    let hideOnCreate = true
    let ignoreHideList = false
    let capitalizeFirstLetter = false
    // Переменные для сохранения исходных значений при открытии настроек
    let originalCapitalizeFirstLetter = false
    let originalHideType = "except"
    let originalUserIdValue = ""
    // Переменные для управления обработчиками капитализации
    let capitalizationHandlersAttached = false
    let capitalizationObserver = null

    const availableHideTypes = ["except", "users", "likes", "likes2", "days"]
    const hideTypePhrases = {
        except: "Хайд от юзеров",
        users: "Хайд для юзеров",
        likes: "Хайд по симпатиям",
        likes2: "Хайд по лайкам",
        days: "Хайд по дням регистрации",
    }
    const hideTypePlaceholders = {
        except: "Введите юзернеймы через запятую",
        users: "Введите юзернеймы через запятую",
        likes: "Введите необходимое количество симпатий",
        likes2: "Введите необходимое количество лайков",
        days: "Введите необходимое количество дней",
    }
    const hideTypeDataPhrases = {
        except: "Пользователи, которые не смогут увидеть",
        users: "Пользователи, которые смогут увидеть",
        likes: "Необходимое количество симпатий для просмотра",
        likes2: "Необходимое количество лайков для просмотра",
        days: "Необходимое количество дней с момента регистрации для просмотра",
    }

    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem(storageKey) || "{}")
        exceptIds = settings.exceptIds || ""
        userIds = settings.userIds || ""
        likesCount = settings.likesCount || ""
        likes2Count = settings.likes2Count || ""
        daysCount = settings.daysCount || ""
        hideType = settings.hideType || "except"
        hideOnEnter = settings.hideOnEnter !== undefined ? settings.hideOnEnter : true
        hideOnButton = settings.hideOnButton !== undefined ? settings.hideOnButton : true
        hideOnCreate = settings.hideOnCreate !== undefined ? settings.hideOnCreate : true
        ignoreHideList = settings.ignoreHideList !== undefined ? settings.ignoreHideList : false
        addWordsOnCreate = settings.addWordsOnCreate !== undefined ? settings.addWordsOnCreate : false
        capitalizeFirstLetter = settings.capitalizeFirstLetter !== undefined ? settings.capitalizeFirstLetter : false
        wordsPosition = settings.wordsPosition || "none"
        yourWords = settings.yourWords || ""
    }

    loadSettings()

    // Функция для отображения предупреждений
    function xfAlert(text) {
        if (typeof window.XenForo !== "undefined" && window.XenForo.alert) {
            window.XenForo.alert(text, "", 3000)
            return
        }

        alert(text)
    }

    function magicChosen($select) {
        if (typeof $select.chosen === "function") {
            $select.chosen({
                width: "auto",
                search_contains: false,
                inherit_select_classes: true,
                disable_search: 1,
            })
            $select.trigger("chosen:updated")
        }
    }

    function hasWordsPosition(initiator = "") {
        if (initiator === "theme" && !addWordsOnCreate) {
            return false
        }

        return yourWords && usableWordsPositions.includes(wordsPosition)
    }

    function hasExceptIds(initiator = "") {
        if (ignoreHideList) return false
        if (initiator === "theme" && !hideOnCreate) return false

        if (hideType === "users" && userIds.trim()) {
            return true
        } else if (hideType === "except" && exceptIds.trim()) {
            return true
        } else if (hideType === "likes" && likesCount.trim()) {
            return true
        } else if (hideType === "likes2" && likes2Count.trim()) {
            return true
        } else if (hideType === "days" && daysCount.trim()) {
            return true
        }
        return false
    }

    const canModify = (el, initiator = "") => el && (hasExceptIds(initiator) || hasWordsPosition(initiator))

    const isInvalidAction = (el) =>
    el.classList.contains("chat2-input") ||
          window.location.href.match(/conversations\//) ||
          window.location.href.match(/create-thread/)

    function checkContainsByInsertRegex(regex, words, message) {
        // Добавляем текст "test" перед последним "/"
        const regexStr = regex.toString()
        const clearWords = words.replace("$&", "").replace(/[-[\]{}()*+?.,\\^$|]/g, "\\$&")
        const newRegexStr = words.startsWith("$&")
        ? regexStr.replace(/\/$/, `${clearWords}/`)
        : regexStr.replace(/^\//, `/${clearWords}`)

        // Преобразуем обратно в объект RegExp
        const newRegex = new RegExp(newRegexStr.slice(1, -1))

        return newRegex.exec(message)
    }

    function messageContainsYourWords(message) {
        if (!yourWords.trim()) return false

        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = message
        const textContent = tempDiv.textContent || tempDiv.innerText || ""

        // Проверяем, содержится ли yourWords в тексте
        const escapedWords = yourWords.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
        const regex = new RegExp(escapedWords, "i")

        return regex.test(textContent)
    }

    function insertWordToMessage(message) {
        if (!yourWords.trim()) return message

        if (messageContainsYourWords(message)) {
            return message
        }

        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = message

        const nodes = Array.from(tempDiv.childNodes)

        const isIgnorableBlockquote = (node) =>
        node.nodeType === Node.ELEMENT_NODE && node.tagName === "BLOCKQUOTE" && !node.classList.length

        if (wordsPosition === "both") {
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i]
                if (!isIgnorableBlockquote(node)) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.textContent = yourWords + " " + node.textContent
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        const firstTextNode = node.firstChild
                        if (firstTextNode && firstTextNode.nodeType === Node.TEXT_NODE) {
                            firstTextNode.textContent = yourWords + " " + firstTextNode.textContent
                        } else {
                            const textNode = document.createTextNode(yourWords + " ")
                            node.insertBefore(textNode, node.firstChild)
                        }
                    }
                    break
                }
            }

            for (let i = nodes.length - 1; i >= 0; i--) {
                const node = nodes[i]
                if (!isIgnorableBlockquote(node)) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.textContent = node.textContent + " " + yourWords
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        const lastTextNode = node.lastChild
                        if (lastTextNode && lastTextNode.nodeType === Node.TEXT_NODE) {
                            lastTextNode.textContent = lastTextNode.textContent + " " + yourWords
                        } else {
                            const textNode = document.createTextNode(" " + yourWords)
                            node.appendChild(textNode)
                        }
                    }
                    break
                }
            }

            return tempDiv.innerHTML
        }

        if (wordsPosition === "left") {
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i]
                if (!isIgnorableBlockquote(node)) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.textContent = yourWords + " " + node.textContent
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        const firstTextNode = node.firstChild
                        if (firstTextNode && firstTextNode.nodeType === Node.TEXT_NODE) {
                            firstTextNode.textContent = yourWords + " " + firstTextNode.textContent
                        } else {
                            const textNode = document.createTextNode(yourWords + " ")
                            node.insertBefore(textNode, node.firstChild)
                        }
                    }
                    return tempDiv.innerHTML
                }
            }

            tempDiv.insertAdjacentHTML("afterbegin", yourWords + " ")
        }

        if (wordsPosition === "right") {
            for (let i = nodes.length - 1; i >= 0; i--) {
                const node = nodes[i]
                if (!isIgnorableBlockquote(node)) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.textContent = node.textContent + " " + yourWords
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        const lastTextNode = node.lastChild
                        if (lastTextNode && lastTextNode.nodeType === Node.TEXT_NODE) {
                            lastTextNode.textContent = lastTextNode.textContent + " " + yourWords
                        } else {
                            const textNode = document.createTextNode(" " + yourWords)
                            node.appendChild(textNode)
                        }
                    }
                    return tempDiv.innerHTML
                }
            }

            tempDiv.insertAdjacentHTML("beforeend", " " + yourWords)
        }

        return tempDiv.innerHTML
    }

    // Капитализация
    function getTextBeforeCaret(element) {
        const selection = window.getSelection()
        if (!selection.rangeCount) return ""
        const range = selection.getRangeAt(0)
        const preCaretRange = range.cloneRange()
        preCaretRange.selectNodeContents(element)
        preCaretRange.setEnd(range.startContainer, range.startOffset)
        return preCaretRange.toString()
    }

    function shouldCapitalize(textBefore) {
        if (!textBefore) return true
        if (/^\s*@[a-zA-Z0-9_.-]+[,\s]\s*$/.test(textBefore)) return true
        if (/[.!?]\s+$/.test(textBefore)) return true
        if (/^\s*$/.test(textBefore)) return true
        return false
    }

    function insertCapitalizedChar(char) {
        const selection = window.getSelection()
        if (!selection.rangeCount) return false

        const range = selection.getRangeAt(0)
        const upperChar = char.toUpperCase()

        const blockquote =
              range.startContainer.closest?.("blockquote") || range.startContainer.parentNode?.closest?.("blockquote")

        if (blockquote) {
            const textNode = range.startContainer
            if (textNode.nodeType === Node.TEXT_NODE) {
                const offset = range.startOffset
                const textContent = textNode.textContent
                const newContent = textContent.substring(0, offset) + upperChar + textContent.substring(offset)
                textNode.textContent = newContent

                range.setStart(textNode, offset + 1)
                range.collapse(true)
                selection.removeAllRanges()
                selection.addRange(range)
                return true
            }
        }

        range.deleteContents()
        const textNode = document.createTextNode(upperChar)
        range.insertNode(textNode)
        range.setStartAfter(textNode)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
        return true
    }

    function handleContentEditableInput(event) {
        if (!capitalizeFirstLetter) return
        const element = event.target
        if (!element.isContentEditable) return

        if (event.inputType === "insertFromPaste" || event.inputType === "insertCompositionText") {
            return
        }

        if (event.inputType === "insertText" && event.data) {
            const char = event.data
            if (!/[a-zA-Zа-яёА-ЯЁ]/.test(char)) return

            if (char.length > 1) {
                return
            }

            const textBefore = getTextBeforeCaret(element)
            if (shouldCapitalize(textBefore)) {
                const selection = window.getSelection()
                const range = selection.getRangeAt(0)

                const blockquote =
                      range.startContainer.closest?.("blockquote") ||
                      range.startContainer.parentNode?.closest?.("blockquote") ||
                      element.closest("blockquote")

                if (blockquote) {
                    setTimeout(() => {
                        const newSelection = window.getSelection()
                        if (newSelection.rangeCount) {
                            const newRange = newSelection.getRangeAt(0)
                            const textNode = newRange.startContainer
                            if (textNode.nodeType === Node.TEXT_NODE && newRange.startOffset > 0) {
                                const offset = newRange.startOffset - 1
                                const textContent = textNode.textContent
                                if (textContent[offset] && /[a-zA-Zа-яёА-ЯЁ]/.test(textContent[offset])) {
                                    const newContent =
                                          textContent.substring(0, offset) +
                                          textContent[offset].toUpperCase() +
                                          textContent.substring(offset + 1)
                                    textNode.textContent = newContent

                                    newRange.setStart(textNode, offset + 1)
                                    newRange.collapse(true)
                                    newSelection.removeAllRanges()
                                    newSelection.addRange(newRange)
                                }
                            }
                        }
                    }, 0)
                    return
                }

                event.preventDefault()
                insertCapitalizedChar(char)
            }
        }
    }

    function handleTextAreaInput(event) {
        if (!capitalizeFirstLetter) return
        const element = event.target

        if (
            !(
                element.tagName === "TEXTAREA" ||
                (element.tagName === "INPUT" && (element.type === "text" || element.type === "search"))
            )
        )
            return

        const value = element.value
        const selectionStart = element.selectionStart
        const selectionEnd = element.selectionEnd

        if (selectionStart === selectionEnd && selectionStart > 0) {
            const lastChar = value[selectionStart - 1]
            if (/[a-zA-Zа-яёА-ЯЁ]/.test(lastChar)) {
                const textBefore = value.substring(0, selectionStart - 1)
                if (shouldCapitalize(textBefore)) {
                    const newValue =
                          value.substring(0, selectionStart - 1) + lastChar.toUpperCase() + value.substring(selectionStart)
                    element.value = newValue
                    element.setSelectionRange(selectionStart, selectionStart)
                }
            }
        }
    }

    function placeCursorAtEnd(el) {
        const range = document.createRange()
        const sel = window.getSelection()
        range.selectNodeContents(el)
        range.collapse(false)
        sel.removeAllRanges()
        sel.addRange(range)
    }

    function enableCapitalization() {
        if (capitalizationHandlersAttached) return

        document.addEventListener("beforeinput", handleContentEditableInput, true)
        document.addEventListener("input", handleTextAreaInput, false)

        capitalizationObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "childList" || mutation.type === "characterData") {
                    const target = mutation.target

                    let container = target.closest?.('[contenteditable="true"]') || target.parentNode

                    if (!container || !container.isContentEditable) {
                        let current = target.parentNode
                        while (current && current !== document.body) {
                            if (current.isContentEditable) {
                                container = current
                                break
                            }
                            const editableInside = current.querySelector?.('[contenteditable="true"]')
                            if (editableInside) {
                                container = editableInside
                                break
                            }
                            current = current.parentNode
                        }
                    }

                    if (!container || !capitalizeFirstLetter) continue

                    if (container.querySelector("blockquote") || container.closest("blockquote")) {
                        continue
                    }

                    const text = container.innerText || container.textContent
                    const lastChar = text.trim().slice(-1)
                    if (/[a-zа-яё]/.test(lastChar)) {
                        const before = text.trim().slice(0, -1)
                        if (shouldCapitalize(before)) {
                            const capitalized = before + lastChar.toUpperCase()
                            container.innerText = capitalized
                            placeCursorAtEnd(container)
                        }
                    }
                }
            }
        })

        const observeElement = (element) => {
            if (capitalizationObserver) {
                capitalizationObserver.observe(element, {
                    characterData: true,
                    childList: true,
                    subtree: true,
                })
            }
        }

        document.querySelectorAll('[contenteditable="true"]').forEach(observeElement)

        document.querySelectorAll('blockquote [contenteditable="true"]').forEach(observeElement)

        if (capitalizationObserver) {
            capitalizationObserver.observe(document.body, {
                characterData: true,
                childList: true,
                subtree: true,
            })
        }

        document
            .querySelectorAll('[contenteditable="true"], textarea, input[type="text"], input[type="search"]')
            .forEach((el) => {
            attachAutoCapitalize(el)
        })

        document
            .querySelectorAll(
            'blockquote [contenteditable="true"], blockquote textarea, blockquote input[type="text"], blockquote input[type="search"]',
        )
            .forEach((el) => {
            attachAutoCapitalize(el)
        })

        capitalizationHandlersAttached = true
    }

    function disableCapitalization() {
        if (!capitalizationHandlersAttached) return

        document.removeEventListener("beforeinput", handleContentEditableInput, true)
        document.removeEventListener("input", handleTextAreaInput, false)

        if (capitalizationObserver) {
            capitalizationObserver.disconnect()
            capitalizationObserver = null
        }

        document
            .querySelectorAll('[contenteditable="true"], textarea, input[type="text"], input[type="search"]')
            .forEach((el) => {
            if (el._autoCapAttached) {
                el._autoCapAttached = false
            }
        })

        capitalizationHandlersAttached = false
    }

    function toggleCapitalization(enabled) {
        if (enabled) {
            enableCapitalization()
        } else {
            disableCapitalization()
        }
    }

    function smartCapitalize(text) {
        if (!capitalizeFirstLetter) return text

        return text.replace(/(^|[.!?]\s+|^\s*@[\w.-]+[,\s]\s*)([a-zа-яё])/giu, (match, prefix, char) => {
            return prefix + char.toUpperCase()
        })
    }

    function traverseAndSmartCapitalize(root) {
        if (!root || !capitalizeFirstLetter) return

        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false)
        let node
        while ((node = walker.nextNode())) {
            if (node.nodeValue && /[a-zа-яё]/i.test(node.nodeValue)) {
                const newText = smartCapitalize(node.nodeValue)
                if (newText !== node.nodeValue) {
                    node.nodeValue = newText
                }
            }
        }
    }

    function attachAutoCapitalize(el, type = "auto") {
        if (!el || el._autoCapAttached) return
        el._autoCapAttached = true

        if (el.isContentEditable) {
            el.addEventListener("beforeinput", (e) => {
                if (!capitalizeFirstLetter) return

                if (e.inputType === "insertFromPaste" || e.inputType === "insertCompositionText") {
                    return
                }

                if (e.inputType === "insertText" && e.data) {
                    if (e.data.length > 1) {
                        return
                    }

                    const selection = window.getSelection()
                    if (!selection.rangeCount) return

                    const range = selection.getRangeAt(0)
                    const preCaretRange = range.cloneRange()
                    preCaretRange.selectNodeContents(el)
                    preCaretRange.setEnd(range.startContainer, range.startOffset)
                    const textBefore = preCaretRange.toString()

                    if (shouldCapitalize(textBefore)) {
                        const blockquote =
                              range.startContainer.closest?.("blockquote") ||
                              range.startContainer.parentNode?.closest?.("blockquote") ||
                              el.closest("blockquote")

                        if (blockquote) {
                            setTimeout(() => {
                                const newSelection = window.getSelection()
                                if (newSelection.rangeCount) {
                                    const newRange = newSelection.getRangeAt(0)
                                    const textNode = newRange.startContainer
                                    if (textNode.nodeType === Node.TEXT_NODE && newRange.startOffset > 0) {
                                        const offset = newRange.startOffset - 1
                                        const textContent = textNode.textContent
                                        if (textContent[offset] && /[a-zA-Zа-яёА-ЯЁ]/.test(textContent[offset])) {
                                            const newContent =
                                                  textContent.substring(0, offset) +
                                                  textContent[offset].toUpperCase() +
                                                  textContent.substring(offset + 1)
                                            textNode.textContent = newContent

                                            newRange.setStart(textNode, offset + 1)
                                            newRange.collapse(true)
                                            newSelection.removeAllRanges()
                                            newSelection.addRange(newRange)
                                        }
                                    }
                                }
                            }, 0)
                            return
                        }

                        e.preventDefault()
                        const upperChar = e.data.toUpperCase()
                        const textNode = document.createTextNode(upperChar)
                        range.deleteContents()
                        range.insertNode(textNode)
                        range.setStartAfter(textNode)
                        range.collapse(true)
                        selection.removeAllRanges()
                        selection.addRange(range)
                    }
                }
            })
        } else if (el.tagName === "TEXTAREA" || (el.tagName === "INPUT" && (el.type === "text" || el.type === "search"))) {
            el.addEventListener("input", () => {
                if (!capitalizeFirstLetter) return

                const value = el.value
                const selectionStart = el.selectionStart
                const selectionEnd = el.selectionEnd

                if (selectionStart === selectionEnd && selectionStart > 0) {
                    const lastChar = value[selectionStart - 1]
                    if (/[a-zA-Zа-яёА-ЯЁ]/.test(lastChar)) {
                        const textBefore = value.substring(0, selectionStart - 1)
                        if (shouldCapitalize(textBefore)) {
                            const newValue =
                                  value.substring(0, selectionStart - 1) + lastChar.toUpperCase() + value.substring(selectionStart)
                            el.value = newValue
                            el.setSelectionRange(selectionStart, selectionStart)
                        }
                    }
                }
            })
        }
    }

    function observeFields() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue

                    if (node.matches('[contenteditable="true"], textarea, input[type="text"], input[type="search"]')) {
                        if (capitalizeFirstLetter) {
                            attachAutoCapitalize(node)
                            if (capitalizationObserver && node.matches('[contenteditable="true"]')) {
                                capitalizationObserver.observe(node, {
                                    characterData: true,
                                    childList: true,
                                    subtree: true,
                                })
                            }
                        }
                    }

                    const nestedElements = node.querySelectorAll?.(
                        '[contenteditable="true"], textarea, input[type="text"], input[type="search"]',
                    )
                    nestedElements?.forEach((el) => {
                        if (capitalizeFirstLetter) {
                            attachAutoCapitalize(el)
                            if (capitalizationObserver && el.matches('[contenteditable="true"]')) {
                                capitalizationObserver.observe(el, {
                                    characterData: true,
                                    childList: true,
                                    subtree: true,
                                })
                            }
                        }
                    })

                    if (node.tagName === "BLOCKQUOTE" || node.querySelector("blockquote")) {
                        const blockquoteElements = node.querySelectorAll?.(
                            'blockquote [contenteditable="true"], blockquote textarea, blockquote input[type="text"], blockquote input[type="search"]',
                        )
                        blockquoteElements?.forEach((el) => {
                            if (capitalizeFirstLetter) {
                                attachAutoCapitalize(el)
                                if (capitalizationObserver && el.matches('[contenteditable="true"]')) {
                                    capitalizationObserver.observe(el, {
                                        characterData: true,
                                        childList: true,
                                        subtree: true,
                                    })
                                }
                            }
                        })
                    }
                }
            }
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        })
    }

    function updateHtmlContent(el, initiator = "") {
        if (!canModify(el, initiator)) {
            return
        }

        // Сохраняем оригинальный HTML
        let currentHTML = el.innerHTML.trim()

        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = currentHTML

        currentHTML = tempDiv.innerHTML

        // Вставка своих слов (если нужно)
        if (hasWordsPosition(initiator)) {
            currentHTML = insertWordToMessage(currentHTML)
        }
        const existingHideBlock = el.querySelector(
            'blockquote.wysiwygHide[data-tag="users"], blockquote.wysiwygHide[data-tag="except"], blockquote.wysiwygHide[data-tag="likes"], blockquote.wysiwygHide[data-tag="likes2"], blockquote.wysiwygHide[data-tag="days"]',
        )
        if (hasExceptIds(initiator) && !existingHideBlock) {
            let hideOpenTag, hideCloseTag

            const dataTag = hideType
            const dataPhrase = hideTypeDataPhrases[hideType]
            let hideOptionValue = ""

            switch (hideType) {
                case "except":
                    hideOptionValue = exceptIds
                    break
                case "users":
                    hideOptionValue = userIds
                    break
                case "likes":
                    hideOptionValue = likesCount
                    break
                case "likes2":
                    hideOptionValue = likes2Count
                    break
                case "days":
                    hideOptionValue = daysCount
                    break
            }

            hideOpenTag = `<blockquote class="wysiwygHide needOption" data-tag="${dataTag}" data-phrase="${dataPhrase}" data-align="left" data-option="${hideOptionValue}">`
            hideCloseTag = `</blockquote>`
            currentHTML = `${hideOpenTag} ${currentHTML} ${hideCloseTag}`
        }

        el.innerHTML = currentHTML
    }

    function handleSendMessage(inputElement) {
        if (isSending) {
            return // Если уже отправляется сообщение, выходим
        }

        isSending = true // Устанавливаем флаг отправки

        const editorBoxElement = inputElement.closest(".defEditor")
        if (!editorBoxElement) {
            isSending = false
            return
        }

        const sendButton = editorBoxElement.querySelector(
            ".lzt-fe-se-sendMessageButton, .button.primary.mbottom, .submitUnit .button.primary",
        )
        if (!sendButton) {
            isSending = false
            return
        }

        console.log("Отправка сообщения...")
        sendButton.click()
        sendButton.disabled = true // Отключаем кнопку отправки

        // Задержка перед отправкой
        setTimeout(() => {
            // sendButton.click(); // Симулируем клик по кнопке отправки
            inputElement.innerHTML = "" // Очищаем поле ввода после отправки
            isSending = false // Сбрасываем флаг после задержки
            sendButton.disabled = false // Включаем кнопку отправки снова
        }, 100)
    }

    // Функция для обработки нажатия на кнопку отправки сообщения
    async function handleSendMessageButtonClick(event) {
        // Проверяем состояние чекбокса Хайд по кнопке
        if (!hideOnButton) {
            console.log("Галочка не включена. Отправка сообщения отменена.") // Лог для отладки
            return
        }

        // Попытка найти родительский элемент с классом '.defEditor' или '#ProfilePoster'
        const defEditorElement = event.target.closest(".defEditor")
        const profilePosterElement = event.target.closest("#ProfilePoster")
        const parentEl = defEditorElement ?? profilePosterElement

        const inputElement = parentEl?.querySelector('.fr-element.fr-view[contenteditable="true"]')
        if (!inputElement) {
            return
        }

        if (isInvalidAction(inputElement)) {
            return
        }

        updateHtmlContent(inputElement)
        handleSendMessage(inputElement)
    }

    // Функция для обработки нажатия клавиши Enter
    function handleEnterKey(event) {
        // Проверяем состояние hideOnEnter
        if (!hideOnEnter) {
            // Если галочка не включена, просто предотвращаем действие Enter
            return
        }

        const inputSearchElement = document.querySelector('input[name="keywords"]')
        if (event.target === inputSearchElement && event.key === "Enter") {
            console.log("Поиск выполнен: ", inputSearchElement.value)
            return
        }

        // Проверка, находимся ли мы в одной из форм, где нужно заблокировать Enter
        const formElement = event.target.closest(
            'form[action="conversations/insert"], ' +
            'form[action^="posts/"][action$="/save-inline"], ' +
            'form[action^="profile-posts/comments/"][action$="/edit"]',
        )

        if (formElement) {
            return // Если фокус на одной из форм, просто выходим
        }

        // Проверяем, это клавиша Enter без зажатого Shift
        if (!(event.key === "Enter" || event.keyCode === 13) || event.shiftKey) {
            return // Если это не Enter или зажат Shift, выходим
        }

        // Определяем, это ли редактор или чат
        const inputElement = document.querySelector('.fr-element.fr-view[contenteditable="true"]:focus')
        if (!inputElement) {
            return
        }

        if (isInvalidAction(inputElement)) {
            return
        }

        event.preventDefault() // Предотвращаем стандартное поведение
        event.stopPropagation() // Останавливаем дальнейшую обработку события

        updateHtmlContent(inputElement)
        handleSendMessage(inputElement)
    }

    // Добавляем обработчик события клика на кнопку отправки сообщения
    document.addEventListener("mousedown", (event) => {
        const sendButton = event.target.closest(
            ".lzt-fe-se-sendMessageButton, .button.primary.mbottom, .submitUnit .button.primary",
        )
        if (!sendButton) {
            return
        }

        handleSendMessageButtonClick(event)
    })

    // Добавляем обработчик нажатия клавиши Enter только в редакторе и чате
    document.addEventListener("keydown", handleEnterKey, true)

    // Обработчик для кнопки "Создать тему"
    document.addEventListener("click", (event) => {
        const button = event.target
        // Проверяем, если это кнопка "Создать тему"
        if (!(button.type === "submit" && button.value === "Создать тему")) {
            return
        }

        if (isCreatingTheme) {
            return
        }

        isCreatingTheme = true

        setTimeout(() => {
            isCreatingTheme = false
        }, 300)

        const inputElement = document.querySelector('.fr-element.fr-view[contenteditable="true"]')
        if (!inputElement) {
            return
        }

        updateHtmlContent(inputElement, "theme")
    })

    // Создаем кнопки для обеих версий (ПК и мобильная)
    function createFooterButtons() {
        createDesktopFooterButton()
        createMobileFooterButton()
    }

    // Кнопка для ПК версии
    function createDesktopFooterButton() {
        const footerBlock = document.querySelector(".footerBlock")
        if (!footerBlock) return

        if (document.getElementById("AutoHideSettingsButtonDesktop")) return

        const settingsButton = footerBlock.querySelector('a[href="account/personal-details"]')
        if (!settingsButton) return

        const autoHideButton = document.createElement("a")
        autoHideButton.id = "AutoHideSettingsButtonDesktop"
        autoHideButton.className = "footerItem button"
        autoHideButton.href = "#"

        autoHideButton.innerHTML = `
        <div class="SvgIcon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
        </div>
        <span>AutoHide</span>
    `

        autoHideButton.style.cssText = `
        display: flex !important;
        align-items: center !important;
        justify-content: flex-start !important;
        padding-left: 12px !important;
        argin-left: -10px !important;
    `

        settingsButton.insertAdjacentElement("afterend", autoHideButton)
        addClickHandler(autoHideButton)
    }

    // Кнопка для мобильной версии
    function createMobileFooterButton() {
        const footerBlock = document.querySelector(".footer-block")
        if (!footerBlock) return

        if (document.getElementById("AutoHideSettingsButtonMobile")) return

        const settingsButton = footerBlock.querySelector('a[href="account/personal-details"]')
        if (!settingsButton) return

        const autoHideButton = document.createElement("a")
        autoHideButton.id = "AutoHideSettingsButtonMobile"
        autoHideButton.className = "footer-item button"
        autoHideButton.href = "#"

        autoHideButton.innerHTML = `
        <div class="SvgIcon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
        </div>
        <span>AutoHide</span>
    `

        autoHideButton.style.cssText = `
        display: flex !important;
        align-items: center !important;
        justify-content: flex-start !important;
        padding-left: 12px !important;
        margin-left: -40px !important;
    `

        settingsButton.insertAdjacentElement("afterend", autoHideButton)
        addClickHandler(autoHideButton)
    }

    // Общий обработчик клика для обеих кнопок
    function addClickHandler(button) {
        button.addEventListener("click", (event) => {
            event.preventDefault()
            event.stopPropagation()

            originalCapitalizeFirstLetter = capitalizeFirstLetter
            originalHideType = hideType
            originalUserIdValue = userIdInput.value

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

    function observeFooterChanges() {
        const observer = new MutationObserver(() => {
            if (
                !document.getElementById("AutoHideSettingsButtonDesktop") ||
                !document.getElementById("AutoHideSettingsButtonMobile")
            ) {
                setTimeout(createFooterButtons, 100)
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
    settingsMenu.style.height = "326px"
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

    function saveSettings() {
        const settings = {
            exceptIds,
            userIds,
            likesCount,
            likes2Count,
            daysCount,
            hideType,
            hideOnEnter,
            hideOnButton,
            hideOnCreate,
            ignoreHideList,
            capitalizeFirstLetter,
            addWordsOnCreate,
            wordsPosition,
            yourWords,
        }
        localStorage.setItem(storageKey, JSON.stringify(settings))
    }

    function initialize() {
        createSettingsMenu()
        createFooterButtons()
        observeFooterChanges()
        observeFields()

        if (capitalizeFirstLetter) {
            toggleCapitalization(true)
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize)
    } else {
        initialize()
    }

    // Заголовок меню
    const settingsTitle = document.createElement("h3")
    settingsTitle.textContent = "Настройки AutoHideLZT"
    settingsTitle.style.margin = "0"
    settingsTitle.style.color = "white"
    settingsTitle.style.position = "relative"
    settingsTitle.style.top = "-5px"
    settingsTitle.style.display = "inline-block"
    settingsTitle.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Open Sans', HelveticaNeue, sans-serif"
    settingsTitle.style.fontWeight = "bold"
    settingsMenu.appendChild(settingsTitle)

    // Кнопка закрытия меню
    const closeButton = document.createElement("button")
    closeButton.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'>
    <line x1='6' y1='6' x2='18' y2='18' stroke='currentColor' stroke-width='2'/>
    <line x1='18' y1='6' x2='6' y2='18' stroke='currentColor' stroke-width='2'/></svg>`
    closeButton.style.color = "white"
    closeButton.style.backgroundColor = "transparent"
    closeButton.style.border = "none"
    closeButton.style.cursor = "pointer"
    closeButton.style.width = "30px"
    closeButton.style.height = "30px"
    closeButton.style.position = "absolute"
    closeButton.style.top = "0px"
    closeButton.style.right = "0px"
    closeButton.onclick = () => {
        loadSettings()
        hideType = originalHideType
        hideTypeSelect.value = originalHideType
        userIdInput.value = originalUserIdValue
        userIdInput.placeholder = hideTypePlaceholders[originalHideType]
        hideOnEnterCheckbox.checked = hideOnEnter
        hideOnButtonCheckbox.checked = hideOnButton
        hideOnCreateCheckbox.checked = hideOnCreate
        addWordsOnCreateCheckbox.checked = addWordsOnCreate
        ignoreHideListCheckbox.checked = ignoreHideList
        capitalizeFirstLetterCheckbox.checked = originalCapitalizeFirstLetter
        wordsPositionSelect.value = wordsPosition
        yourWordsInput.value = yourWords
        magicChosen($(wordsPositionSelect))
        magicChosen($(hideTypeSelect))
        closeSettingsMenu()
    }
    settingsMenu.appendChild(closeButton)

    // Поле для ввода User ID
    const userIdInput = document.createElement("input")
    userIdInput.classList.add("textCtrl")
    userIdInput.placeholder = hideTypePlaceholders[hideType]
    userIdInput.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Open Sans', HelveticaNeue, sans-serif"
    userIdInput.style.width = "100%"
    userIdInput.style.marginBottom = "5px"
    switch (hideType) {
        case "except":
            userIdInput.value = exceptIds
            break
        case "users":
            userIdInput.value = userIds
            break
        case "likes":
            userIdInput.value = likesCount
            break
        case "likes2":
            userIdInput.value = likes2Count
            break
        case "days":
            userIdInput.value = daysCount
            break
    }

    // Создаем контейнер для кнопок
    const buttonsContainer = document.createElement("div")
    buttonsContainer.style.display = "flex"
    buttonsContainer.style.justifyContent = "flex-start"
    buttonsContainer.style.marginTop = "0px"

    // Создаем контейнер для your words
    const wordsPositionContainer = document.createElement("div")
    wordsPositionContainer.style.display = "flex"
    wordsPositionContainer.style.flexDirection = "column"
    wordsPositionContainer.style.margin = "10px 0 2px"

    // Кнопка сохранения
    const saveButton = document.createElement("button")
    saveButton.classList.add("button", "primary")
    saveButton.textContent = "Сохранить"
    saveButton.style.marginRight = "5px"
    saveButton.style.marginTop = "3px"
    saveButton.style.padding = "0px 5px"
    saveButton.style.fontSize = "12px"
    saveButton.style.height = "26px"
    saveButton.style.lineHeight = "26px"
    saveButton.addEventListener("click", () => {
        const currentHideType = hideTypeSelect.value
        const currentValue = userIdInput.value.trim()

        switch (currentHideType) {
            case "except":
                exceptIds = currentValue
                break
            case "users":
                userIds = currentValue
                break
            case "likes":
                likesCount = currentValue
                break
            case "likes2":
                likes2Count = currentValue
                break
            case "days":
                daysCount = currentValue
                break
        }

        hideType = currentHideType
        hideOnEnter = hideOnEnterCheckbox.checked
        hideOnButton = hideOnButtonCheckbox.checked
        hideOnCreate = hideOnCreateCheckbox.checked
        ignoreHideList = ignoreHideListCheckbox.checked
        capitalizeFirstLetter = capitalizeFirstLetterCheckbox.checked
        addWordsOnCreate = addWordsOnCreateCheckbox.checked
        wordsPosition = wordsPositionSelect.value
        yourWords = yourWordsInput.value.trim()

        saveSettings()
        xfAlert("Настройки сохранены")
        closeSettingsMenu()
    })

    // Кнопка отмены
    const cancelButton = document.createElement("button")
    cancelButton.classList.add("button", "primary", "small-button")
    cancelButton.textContent = "Отмена"
    cancelButton.style.marginTop = "3px"
    cancelButton.style.padding = "0px 5px"
    cancelButton.style.fontSize = "12px"
    cancelButton.style.height = "26px"
    cancelButton.style.lineHeight = "26px"
    cancelButton.addEventListener("click", () => {
        loadSettings()
        hideType = originalHideType
        hideTypeSelect.value = originalHideType
        userIdInput.value = originalUserIdValue
        userIdInput.placeholder = hideTypePlaceholders[originalHideType]
        hideOnEnterCheckbox.checked = hideOnEnter
        hideOnButtonCheckbox.checked = hideOnButton
        hideOnCreateCheckbox.checked = hideOnCreate
        addWordsOnCreateCheckbox.checked = addWordsOnCreate
        ignoreHideListCheckbox.checked = ignoreHideList
        capitalizeFirstLetterCheckbox.checked = capitalizeFirstLetter
        wordsPositionSelect.value = wordsPosition
        yourWordsInput.value = yourWords
        magicChosen($(wordsPositionSelect))
        magicChosen($(hideTypeSelect))
        closeSettingsMenu()
    })

    // Чекбокс для включения/выключения хайда по Enter
    const hideOnEnterCheckbox = document.createElement("input")
    hideOnEnterCheckbox.type = "checkbox"
    hideOnEnterCheckbox.checked = hideOnEnter
    hideOnEnterCheckbox.id = "hideOnEnterCheckbox"

    const hideOnEnterLabel = document.createElement("label")
    hideOnEnterLabel.textContent = "Добавлять хайд / yourWords по Enter"
    hideOnEnterLabel.setAttribute("for", "hideOnEnterCheckbox")
    hideOnEnterLabel.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Open Sans', HelveticaNeue, sans-serif"
    hideOnEnterLabel.style.fontSize = "12px"
    hideOnEnterLabel.style.marginLeft = "-2px"

    // Чекбокс для включения/выключения хайда по кнопке отправки
    const hideOnButtonCheckbox = document.createElement("input")
    hideOnButtonCheckbox.type = "checkbox"
    hideOnButtonCheckbox.checked = hideOnButton
    hideOnButtonCheckbox.id = "hideOnButtonCheckbox"
    hideOnButtonCheckbox.style.marginTop = "2px"

    const hideOnButtonLabel = document.createElement("label")
    hideOnButtonLabel.textContent = "Добавлять хайд / yourWords по кнопке отправки"
    hideOnButtonLabel.setAttribute("for", "hideOnButtonCheckbox")
    hideOnButtonLabel.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Open Sans', HelveticaNeue, sans-serif"
    hideOnButtonLabel.style.fontSize = "12px"
    hideOnButtonLabel.style.marginLeft = "-2px"

    // Чекбокс для включения/выключения хайда при создании темы
    const hideOnCreateCheckbox = document.createElement("input")
    hideOnCreateCheckbox.type = "checkbox"
    hideOnCreateCheckbox.checked = hideOnCreate
    hideOnCreateCheckbox.id = "hideOnCreateCheckbox"
    hideOnCreateCheckbox.style.marginTop = "2px"

    const hideOnCreateLabel = document.createElement("label")
    hideOnCreateLabel.textContent = "Добавлять хайд при создании темы"
    hideOnCreateLabel.setAttribute("for", "hideOnCreateCheckbox")
    hideOnCreateLabel.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Open Sans', HelveticaNeue, sans-serif"
    hideOnCreateLabel.style.fontSize = "12px"
    hideOnCreateLabel.style.marginLeft = "-2px"

    // Чекбокс для добавления yourWords при создании темы
    const addWordsOnCreateCheckbox = document.createElement("input")
    addWordsOnCreateCheckbox.type = "checkbox"
    addWordsOnCreateCheckbox.checked = addWordsOnCreate
    addWordsOnCreateCheckbox.id = "addWordsOnCreateCheckbox"
    addWordsOnCreateCheckbox.style.marginTop = "2px"

    const addWordsOnCreateLabel = document.createElement("label")
    addWordsOnCreateLabel.textContent = "Добавлять yourWords при создании темы"
    addWordsOnCreateLabel.setAttribute("for", "addWordsOnCreateCheckbox")
    addWordsOnCreateLabel.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Open Sans', HelveticaNeue, sans-serif"
    addWordsOnCreateLabel.style.fontSize = "12px"
    addWordsOnCreateLabel.style.marginLeft = "-2px"

    const yourWordsHeader = document.createElement("h3")
    yourWordsHeader.textContent = "Настройки yourWords"
    yourWordsHeader.style.margin = "0"
    yourWordsHeader.style.color = "white"
    yourWordsHeader.style.position = "relative"
    yourWordsHeader.style.top = "-5px"
    yourWordsHeader.style.display = "inline-block"
    yourWordsHeader.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Open Sans', HelveticaNeue, sans-serif"
    yourWordsHeader.style.fontWeight = "bold"

    // Чекбокс "Игнорировать список хайда"
    const ignoreHideListCheckbox = document.createElement("input")
    ignoreHideListCheckbox.type = "checkbox"
    ignoreHideListCheckbox.checked = ignoreHideList
    ignoreHideListCheckbox.id = "ignoreHideListCheckbox"
    ignoreHideListCheckbox.style.marginTop = "2px"

    const ignoreHideListLabel = document.createElement("label")
    ignoreHideListLabel.textContent = "Игнорировать список хайда (вставлять только yourWords без хайда)"
    ignoreHideListLabel.setAttribute("for", "ignoreHideListCheckbox")
    ignoreHideListLabel.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Open Sans', HelveticaNeue, sans-serif"
    ignoreHideListLabel.style.fontSize = "12px"
    ignoreHideListLabel.style.marginLeft = "-2px"
    ignoreHideListLabel.style.position = "relative"
    ignoreHideListLabel.style.top = "0px"

    // Поле для ввода "yourwords"
    const yourWordsInput = document.createElement("input")
    yourWordsInput.classList.add("textCtrl")
    yourWordsInput.placeholder = "Ваши слова, перенос через <br>"
    yourWordsInput.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Open Sans', HelveticaNeue, sans-serif"
    yourWordsInput.style.width = "100%"
    yourWordsInput.style.marginBottom = "5px"
    yourWordsInput.value = yourWords

    // Чекбокс для капитализации первой буквы
    const capitalizeFirstLetterCheckbox = document.createElement("input")
    capitalizeFirstLetterCheckbox.type = "checkbox"
    capitalizeFirstLetterCheckbox.checked = capitalizeFirstLetter
    capitalizeFirstLetterCheckbox.id = "capitalizeFirstLetterCheckbox"
    capitalizeFirstLetterCheckbox.style.marginTop = "2px"

    capitalizeFirstLetterCheckbox.addEventListener("change", () => {
        const isEnabled = capitalizeFirstLetterCheckbox.checked
        toggleCapitalization(isEnabled)
    })

    const capitalizeFirstLetterLabel = document.createElement("label")
    capitalizeFirstLetterLabel.textContent = "Авто-заглавная буква (работает отдельно)"
    capitalizeFirstLetterLabel.setAttribute("for", "capitalizeFirstLetterCheckbox")
    capitalizeFirstLetterLabel.style.fontFamily =
        "-apple-system, BlinkMacSystemFont, 'Open Sans', HelveticaNeue, sans-serif"
    capitalizeFirstLetterLabel.style.fontSize = "12px"
    capitalizeFirstLetterLabel.style.marginLeft = "-2px"
    capitalizeFirstLetterLabel.style.position = "relative"
    capitalizeFirstLetterLabel.style.top = "1px"

    // Выбор положения yourWords
    const wordsPositionSelect = document.createElement("select")
    wordsPositionSelect.classList.add("textCtrl", "Lzt-PrettySelect")
    wordsPositionSelect.id = "wordsPositionSelect"
    wordsPositionSelect.style.marginBottom = "0px"

    const wordsPositionOptions = availableWordsPositions.map((wordsPositionItem) => {
        const option = document.createElement("option")
        option.value = wordsPositionItem
        option.textContent = wordsPositionPhrases[wordsPositionItem]
        option.selected = wordsPositionItem === wordsPosition
        return option
    })

    const wordsPositionGroup = document.createElement("optgroup")
    wordsPositionGroup.label = "Положение слов"
    wordsPositionGroup.append(...wordsPositionOptions)
    wordsPositionSelect.append(wordsPositionGroup)
    wordsPositionContainer.append(yourWordsHeader, yourWordsInput, wordsPositionSelect)

    const hideTypeSelect = document.createElement("select")
    hideTypeSelect.classList.add("textCtrl", "Lzt-PrettySelect")
    hideTypeSelect.id = "hideTypeSelect"
    hideTypeSelect.style.marginBottom = "10px"

    const hideTypeOptions = availableHideTypes.map((hideTypeItem) => {
        const option = document.createElement("option")
        option.value = hideTypeItem
        option.textContent = hideTypePhrases[hideTypeItem]
        option.selected = hideTypeItem === hideType
        return option
    })

    const hideTypeGroup = document.createElement("optgroup")
    hideTypeGroup.label = "Тип хайда"
    hideTypeGroup.append(...hideTypeOptions)
    hideTypeSelect.append(hideTypeGroup)

    function updateUserIdInput() {
        const currentHideType = hideTypeSelect.value
        const currentValue = userIdInput.value.trim()

        userIdInput.placeholder = hideTypePlaceholders[currentHideType]

        switch (hideType) {
            case "except":
                exceptIds = currentValue
                break
            case "users":
                userIds = currentValue
                break
            case "likes":
                likesCount = currentValue
                break
            case "likes2":
                likes2Count = currentValue
                break
            case "days":
                daysCount = currentValue
                break
        }

        // hideType = currentHideType

        switch (currentHideType) {
            case "except":
                userIdInput.value = exceptIds
                break
            case "users":
                userIdInput.value = userIds
                break
            case "likes":
                userIdInput.value = likesCount
                break
            case "likes2":
                userIdInput.value = likes2Count
                break
            case "days":
                userIdInput.value = daysCount
                break
        }
    }

    hideTypeSelect.addEventListener("change", updateUserIdInput)

    const userIdContainer = document.createElement("div")
    userIdContainer.style.display = "flex"
    userIdContainer.style.flexDirection = "column"
    userIdContainer.style.margin = "0px 0 -12px"

    userIdContainer.append(userIdInput, hideTypeSelect)

    // Добавляем чекбоксы и кнопки в меню настроек
    settingsMenu.appendChild(userIdContainer)
    settingsMenu.appendChild(document.createElement("br"))
    settingsMenu.appendChild(hideOnEnterCheckbox)
    settingsMenu.appendChild(hideOnEnterLabel)
    settingsMenu.appendChild(document.createElement("br"))
    settingsMenu.appendChild(hideOnButtonCheckbox)
    settingsMenu.appendChild(hideOnButtonLabel)
    settingsMenu.appendChild(document.createElement("br"))
    settingsMenu.appendChild(hideOnCreateCheckbox)
    settingsMenu.appendChild(hideOnCreateLabel)
    settingsMenu.appendChild(document.createElement("br"))
    settingsMenu.appendChild(capitalizeFirstLetterCheckbox)
    settingsMenu.appendChild(capitalizeFirstLetterLabel)
    settingsMenu.appendChild(document.createElement("br"))
    settingsMenu.appendChild(wordsPositionContainer)
    settingsMenu.appendChild(addWordsOnCreateCheckbox)
    settingsMenu.appendChild(addWordsOnCreateLabel)
    settingsMenu.appendChild(document.createElement("br"))
    settingsMenu.appendChild(ignoreHideListCheckbox)
    settingsMenu.appendChild(ignoreHideListLabel)
    settingsMenu.appendChild(document.createElement("br"))
    settingsMenu.appendChild(buttonsContainer)

    // Добавляем кнопки в контейнер
    buttonsContainer.appendChild(saveButton)
    buttonsContainer.appendChild(cancelButton)

    document.body.appendChild(settingsMenu)

    const $wordsPositionSelect = $(wordsPositionSelect)
    magicChosen($wordsPositionSelect)

    const $hideTypeSelect = $(hideTypeSelect)
    magicChosen($hideTypeSelect)

    function closeSettingsMenu() {
        settingsMenu.style.opacity = 0
        settingsMenu.style.transform = "translateY(-10px)"
        setTimeout(() => {
            settingsMenu.style.visibility = "hidden"
        }, 300)
    }

    // Автор копирования айди по кнопке в профиле https://lolz.live/el9in/
    const followContainer =
          document.querySelector("div.followContainer") ||
          document.querySelector("a.button.full.followContainer.OverlayTrigger")

    if (followContainer) {
        const idContainer = document.createElement("div")
        idContainer.className = "idContainer"
        const idButton = document.createElement("a")
        idButton.className = "idButton button block OverlayTrigger"
        idButton.setAttribute("title", "")
        idButton.setAttribute("id", "")
        idButton.setAttribute("data-cacheoverlay", "false")
        idButton.textContent = "Скопировать ID"
        idContainer.appendChild(idButton)
        followContainer.insertAdjacentElement("afterend", idContainer)
        idButton.addEventListener("click", () => {
            const userContentLinks = document.querySelector("div.userContentLinks")
            const firstLink = userContentLinks.querySelector("a.button:nth-child(2)")
            const href = firstLink.getAttribute("href")
            const hrefText = href.match(/\/(\d+)\//)[1]
            if ((hrefText | 0) != 0) {
                const userId = hrefText | 0
                navigator.clipboard
                    .writeText(userId)
                    .then(() => {
                    xfAlert("ID успешно скопирован: " + userId)
                })
                    .catch((err) => {
                    console.error("Ошибка копирования: ", err)
                    xfAlert("Ошибка копирования ID. Попробуйте еще раз.")
                })
            }
        })
    }

    function createHide(selectedText) {
        const currentHideType = hideType
        let hideValue = ""
        const dataTag = currentHideType
        const dataPhrase = hideTypeDataPhrases[currentHideType]

        switch (currentHideType) {
            case "except":
                hideValue = exceptIds
                break
            case "users":
                hideValue = userIds
                break
            case "likes":
                hideValue = likesCount
                break
            case "likes2":
                hideValue = likes2Count
                break
            case "days":
                hideValue = daysCount
                break
        }

        if (!hideValue.trim()) {
            return selectedText
        }

        const alignValue = wordsPosition !== "none" ? wordsPosition : "left"

        return `<blockquote class="wysiwygHide needOption" data-tag="${dataTag}" data-phrase="${dataPhrase}" data-align="${alignValue}" data-option="${hideValue.trim()}">${selectedText}</blockquote>`
    }

    updateUserIdInput()
})()
