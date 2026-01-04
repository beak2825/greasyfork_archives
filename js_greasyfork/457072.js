// ==UserScript==
// @name         ChatGPT Translator
// @description  This script automatically translates chat messages to the user's local language and also translates user messages before sending them in English.
// @namespace    ChatGPTTranslator
// @version      1.8.1
// @author       CriDos
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chat.openai.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457072/ChatGPT%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/457072/ChatGPT%20Translator.meta.js
// ==/UserScript==

'use strict';

console.log(`ChatGPT Translator initializing...`);

let debug = false;

setInterval(() => {
    try {
        addAutoTranslate();
    } catch (error) {
        console.error(error);
    }

    try {
        findAndHookTextareaElement();
    } catch (error) {
        console.error(error);
    }
}, 100);

function addAutoTranslate() {
    var messages = document.querySelectorAll(".markdown.prose");

    for (var i = 0; i < messages.length; i++) {
        const msgMarkdownNode = messages[i];
        const parentMsgMarkdown = msgMarkdownNode.parentElement;

        if (parentMsgMarkdown.isAutoTranslate) {
            continue;
        }
        parentMsgMarkdown.isAutoTranslate = true;

        setInterval(async () => {
            await translateNode(msgMarkdownNode);
        }, 500);
    }
}

function findAndHookTextareaElement() {
    const targetElement = document.querySelector("textarea");
    if (targetElement === null) {
        return;
    }

    if (targetElement.isAddHookKeydownEvent === true) {
        return;
    }

    targetElement.isAddHookKeydownEvent = true;

    console.log(`Textarea element found. Adding keydown event listener.`);
    targetElement.addEventListener("keydown", async event => await handleSubmit(event, targetElement), true);
}

async function handleSubmit(event, targetElement) {
    console.log(`Keydown event detected: type - ${event.type}, key - ${event.key}`);

    if (event.shiftKey && event.key === "Enter") {
        return;
    }

    if (window.isActiveOnSubmit === true) {
        return;
    }

    if (event.key === "Enter") {
        window.isActiveOnSubmit = true;
        event.stopImmediatePropagation();

        const request = targetElement.value;
        targetElement.value = "";

        const translatedText = await translate(request, navigator.language, "en", "text");

        targetElement.focus();
        targetElement.value = translatedText;
        const enterEvent = new KeyboardEvent("keydown", {
            bubbles: true,
            cancelable: true,
            key: "Enter",
            code: "Enter"
        });
        targetElement.dispatchEvent(enterEvent);

        window.isActiveOnSubmit = false;
    }
}

async function translateNode(node) {
    const translateClassName = "translate-markdown";
    const parentNode = node.parentElement;
    const nodeContent = $(node).html();

    if (node.storeContent == nodeContent) {
        return;
    }
    node.storeContent = nodeContent;

    var translateNode = parentNode.querySelector(`.${translateClassName}`);
    if (translateNode == null) {
        translateNode = node.cloneNode(true);
        translateNode.classList.add(translateClassName);
        parentNode.insertBefore(translateNode, parentNode.firstChild);
    }

    var translatedContent = await translateHTML(nodeContent, "auto", navigator.language)
    translatedContent = translatedContent.replace(/<\/div>$/, '');

    const endOfTranslationText = await translate("end of translation", "en", navigator.language, "text");

    $(translateNode).html(translatedContent + `<p>.......... ${endOfTranslationText} ..........</p></div>`);
}

async function translateHTML(html, sLang, tLang) {
    const excludeTagRegex = /<(pre|code)[^>]*>([\s\S]*?)<\/(pre|code)>/g;
    const excludeTags = [];
    const excludePlaceholder = 'e0x1c';

    let htmlContent = html;

    let excludeTagsMatch;
    while (excludeTagsMatch = excludeTagRegex.exec(html)) {
        excludeTags.push(excludeTagsMatch[0]);
        htmlContent = htmlContent.replace(excludeTagsMatch[0], `<${excludePlaceholder}${excludeTags.length - 1}>`);
    }

    if (debug) {
        console.log(`preTranslateHTML: ${html}`);
    }

    htmlContent = await translate(htmlContent, sLang, tLang);

    for (let i = 0; i < excludeTags.length; i++) {
        htmlContent = htmlContent.replace(`<${excludePlaceholder}${i}>`, excludeTags[i]);
    }

    if (debug) {
        console.log(`postTranslateHTML: ${htmlContent}`);
    }

    return htmlContent;
}

const cache = {};

async function translate(text, sLang, tLang, format, key) {
    try {
        if (debug) {
            console.log(`preTranslate: ${text}`);
        }

        if (format == null) {
            format = "html";
        }

        if (key == null) {
            key = "AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw";
        }

        const cacheKey = text + '_' + format;

        if (cache[cacheKey]) {
            return cache[cacheKey];
        }

        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: `https://translate.googleapis.com/translate_a/t?client=gtx&format=${format}&sl=${sLang}&tl=${tLang}&key=${key}`,
                data: `q=${encodeURIComponent(text)}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: response => {
                    const json = JSON.parse(response.responseText);
                    if (Array.isArray(json[0])) {
                        resolve(json[0][0]);
                    } else {
                        resolve(json[0]);
                    }
                },
                onerror: response => {
                    reject(response.statusText);
                }
            });
        });

        cache[cacheKey] = response;

        if (debug) {
            console.log(`postTranslate: ${response}`);
        }

        return response;
    } catch (error) {
        console.error(error);
    }
}