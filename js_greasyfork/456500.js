// ==UserScript==
// @name        Auto-Translate Messages
// @namespace   AutoTranslateMessagesForBetaCharacterAI
// @description Adds a auto-translate messages for character messages in the chat for beta.character.ai
// @version     3.1.2
// @author      CriDos
// @icon        https://www.google.com/s2/favicons?sz=64&domain=beta.character.ai
// @match       https://beta.character.ai/chat?char=*
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/456500/Auto-Translate%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/456500/Auto-Translate%20Messages.meta.js
// ==/UserScript==

'use strict';

console.log(`Auto-Translate Messages initializing...`);

let debug = false;
let sourceLanguage = "ru";

setInterval(() => {
    try {
        addAutoTranslate();
    } catch (error) {
        console.error(error);
    }

    try {
        //findAndHookTextareaElement();
    } catch (error) {
        console.error(error);
    }
}, 100);

async function addAutoTranslate() {
    var charMessages = document.getElementsByClassName("char-msg");
    for (var i = 0; i < charMessages.length; i++) {
        const node = charMessages[i].querySelector(".markdown-wrapper");

        if (node == null) {
            continue;
        }

        const parentNode = node.parentElement;
        if (parentNode.isAutoTranslate) {
            continue;
        }
        parentNode.isAutoTranslate = true;

        setInterval(async () => {
            await translateNode(node);
        }, 500);
    }

    //var userMessages = document.getElementsByClassName("user-msg");
    //for (var i = 0; i < userMessages.length; i++) {
    //    const node = userMessages[i].querySelector(".markdown-wrapper");

    //    if (node == null) {
    //        continue;
    //    }

    //    const parentNode = node.parentElement;
    //    if (parentNode.isAutoTranslate) {
    //        continue;
    //    }
    //    parentNode.isAutoTranslate = true;

    //    translateNode(node, true);
    //}
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

        const translatedText = await translate(request, sourceLanguage, "en", "text");

        targetElement.focus();
        document.execCommand('insertText', false, translatedText);
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

async function translateNode(node, replace = false) {
    const translateClassName = "translate";
    const parentNode = node.parentElement;
    const nodeContent = $(node).html();

    if (node.storeContent == nodeContent) {
        return;
    }
    node.storeContent = nodeContent;

    var translateContent = await translate(nodeContent, "en", navigator.language);

    if (replace) {
        $(node).html(translateContent);
        return;
    }

    var translateNode = parentNode.querySelector(`.${translateClassName}`);
    if (translateNode == null) {
        translateNode = node.cloneNode(true);
        translateNode.classList.add(translateClassName);
        parentNode.insertBefore(translateNode, parentNode.firstChild);
    }

    translateContent = translateContent.replace(/<\/div>$/, '');
    $(translateNode).html(translateContent + `<p>.......... end_translate ..........</p></div>`);
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

        if (cache[text]) {
            return cache[text];
        }

        const result = await new Promise((resolve, reject) => {
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

        cache[text] = result;

        if (debug) {
            console.log(`postTranslate: ${result}`);
        }

        return result;
    } catch (error) {
        console.error(error);
    }
}