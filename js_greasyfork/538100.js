// ==UserScript==
// @name         MineFunREG Chat Translator
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Simple script to auto translate all chat messages in MineFun into Portuguese :)
// @author       November2246
// @match        https://minefun.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=minefun.io
// @run-at       document-start
// @license      ISC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538100/MineFunREG%20Chat%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/538100/MineFunREG%20Chat%20Translator.meta.js
// ==/UserScript==
 
// Rip data attribute for messages
let messageDataAttribute;
document.addEventListener('DOMContentLoaded', async () => {
    const messageDataInterval = setInterval(() => {
        try {
            let css = [...document.styleSheets].find(x => x?.href && x?.href.includes('assets/Game-'));
            if (!css) return;
 
            let match = [...css.cssRules].find(x => x?.selectorText && x?.selectorText.includes('.messages[data-v-'))?.selectorText;
            if (!match) return;
 
            messageDataAttribute = match.slice(10, -1);
            clearInterval(messageDataInterval);
        } catch {}
    }, 250);
});
 
// Hook setAttribute on div elements to handle message divs
const _createElement = document.createElement;
document.createElement = function createElement() {
    const el = _createElement.apply(this, arguments);
    if (el.tagName !== 'DIV') return el;
 
    const _setAttribute = el.setAttribute;
    el.setAttribute = function setAttribute() {
        if (messageDataAttribute && arguments[0] === messageDataAttribute) handleMessage(this);
        return _setAttribute.apply(this, arguments);
    }
 
    return el;
}
 
// Handle message translation, adding [language] prefix and translated content
function handleMessage(el) {
    if (!el || el?.children?.length !== 2) return;
    const userEl = el.children[0];
    const textEl = el.children[1];
 
    if (!textEl.innerText) return;
    console.log(`Attempting to auto-translate message: "${textEl.innerText}"`);
 
 
    translateMessage(textEl.innerText).then(translated => {
        if (!textEl?.innerText) return;
        textEl.innerText = `[${translated[0]}]: ${translated[1]}`;
    }).catch(err => {
        console.warn('Tranlation error...', e);
    });
}
 
// Message cache to prevent duplicate requests to Google's API
const messageCache = {};
 
// Abuse google translate API to auto translate message text
async function translateMessage(text) {
    if (messageCache[text]) return messageCache[text];
 
    const res = await fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=PT&dt=t&q=" + encodeURIComponent(text));
    const data = await res.json();
    const result = [data[2], data[0].map(x => x[0]).join('')];
    messageCache[text] = result;
 
    return result;
}