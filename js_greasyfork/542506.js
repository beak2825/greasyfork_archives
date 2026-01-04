// ==UserScript==
// @name         Outlook搜尋窗格中文輸入修正
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  修正 Outlook 搜尋窗格中文輸入時因組字處理失敗的問題
// @author       Shanlanshanlan(grok-4-fast-reasoning)
// @match        https://outlook.office.com/mail/*
// @match        https://outlook.office365.com/mail/*
// @icon         https://res.public.onecdn.static.microsoft/owamail/20250704003.06/resources/images/favicons/mail-seen.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542506/Outlook%E6%90%9C%E5%B0%8B%E7%AA%97%E6%A0%BC%E4%B8%AD%E6%96%87%E8%BC%B8%E5%85%A5%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/542506/Outlook%E6%90%9C%E5%B0%8B%E7%AA%97%E6%A0%BC%E4%B8%AD%E6%96%87%E8%BC%B8%E5%85%A5%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

(function() {
    "use strict";

    let c = false, i;
    const s = ".fui-SearchBox__input, .ms-SearchBox-field, input[type='search']";

    const bindEvents = e => {
        e.addEventListener("compositionstart", () => c = true);
        e.addEventListener("compositionend", () => {
            c = false;
            e.dispatchEvent(new Event("input", { bubbles: true }));
        });
        e.addEventListener("blur", () => !e.value && requestAnimationFrame(() => (e.focus(), e.select())), true);
    };

    const refocus = () => {
        const el = i || (i = document.querySelector(s));
        el && !el.value && document.activeElement !== el && (el.focus(), el.select());
    };

    (function poll() {
        const el = document.querySelector(s);
        el && el !== i && (i = el, !el.dataset.bound && (bindEvents(el), el.dataset.bound = "true"));
        requestAnimationFrame(poll);
    })();

    ["beforeinput", "keydown", "input"].forEach(t => document.addEventListener(t, e => i === e.target && c && (t === "beforeinput" ? e.preventDefault() : 0, e.stopImmediatePropagation()), true));

    document.addEventListener("mousedown", e => i && !i.value && i !== e.target && !i.contains(e.target) && (e.stopPropagation(), requestAnimationFrame(refocus)), true);
    document.addEventListener("focus", e => i && !i.value && e.target !== i && !i.contains(e.target) && requestAnimationFrame(refocus), true);

    new MutationObserver(m => m.forEach(({type, addedNodes}) => type === 'childList' && Array.from(addedNodes).some(n => n.nodeType === 1 && n.querySelector(s)) && setTimeout(refocus, 50))).observe(document.body, {childList: true, subtree: true});

    setTimeout(refocus, 500);
})();