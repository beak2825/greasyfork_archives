"use strict";
// ==UserScript==
// @name         文本标注辅助
// @namespace    http://tampermonkey.net/
// @version      0.0.10
// @description  文本标注辅助, 同时标注/删除
// @author       You
// @match        https://torbjorn.xcbiaozhu.saicsdv.com/*
// @match        https://ai.xinhua-news.cn/ai2tag/public/*
// @match        https://*.startask.net/*
// @icon         https://www.google.com/s2/favicons?domain=startask.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441684/%E6%96%87%E6%9C%AC%E6%A0%87%E6%B3%A8%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/441684/%E6%96%87%E6%9C%AC%E6%A0%87%E6%B3%A8%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
const targetOperators = [
    "text-[3872d]",
    "text-[8b1cd]",
    "text-[76e00]",
    "text-[5eec4]",
    "text-[26981]",
    "text-[77ddc]",
];
const sleep = (duration) => new Promise((res) => setTimeout(res, duration));
function findAllMatches(input, target) {
    let matches = [];
    let i = 0;
    while (true) {
        let match = input.indexOf(target, i);
        if (match === -1) {
            break;
        }
        matches.push(match);
        i = match + 1;
    }
    return matches;
}
const listener = (fun) => (event) => {
    if (document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLInputElement) {
        return;
    }
    if (["Backspace", "Delete"].includes(event.key) && event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        fun?.();
    }
};
function setup(store) {
    const article = store.subStore().info.article;
    const oldAdd = store.annotation.addSlotAtPath.bind(store.annotation);
    store.annotation.addSlotAtPath = (...args) => {
        const path = args[1];
        const operator = store.utils.operatorAt(path);
        if (!targetOperators.includes(operator.key)) {
            return oldAdd(...args);
        }
        const slot = args[0];
        for (const index of findAllMatches(article, slot.text)) {
            oldAdd({
                ...slot,
                start: index,
                id: index === slot.start ? slot.id : store.newNodeId(),
            }, path);
        }
    };
    const oldDelete = store.annotation.deleteSelectedInstance.bind(store.annotation);
    store.annotation.deleteSelectedInstance = (...args) => {
        const toRemove = [];
        for (const instance of store.annotation.mode.slotInstances) {
            if (!targetOperators.includes(instance.operator.key) ||
                store.keyboard.holdingShift) {
                continue;
            }
            const similar = store.instances.slots.filter((si) => window._.isEqual(si.path, instance.path) &&
                si.slot.text === instance.slot.text);
            toRemove.push(...similar);
        }
        const filtered = toRemove.filter((a) => !store.annotation.mode.slotInstances.includes(a));
        store.annotation.mode.slotInstances.push(...filtered);
        return oldDelete(...args);
    };
}
(async function () {
    "use strict";
    let storeId;
    setInterval(() => {
        if (window._annotationStore?.subStore() == null) {
            return;
        }
        const store = window._annotationStore;
        if (store.storeId !== storeId) {
            storeId = store.storeId;
            setup(store);
        }
    }, 1000);
    document.addEventListener("keyup", listener(() => {
        window._annotationStore.annotation.deleteSelectedInstanceOrRemoveKeyframe();
    }));
})();
