// ==UserScript==
// @name         kick.com emote and pause remover
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  fixes kick for now (17th june 2023)
// @author       You
// @match        https://kick.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468836/kickcom%20emote%20and%20pause%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/468836/kickcom%20emote%20and%20pause%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer=new MutationObserver(mutations=>{mutations.forEach(mutation=>{if(mutation.addedNodes.length>0){let elements=document.querySelectorAll('div[data-chat-entry]');elements.forEach(element=>{if(element.querySelector('[data-emote-name="emojiAngry"]')){element.remove();}});}});});observer.observe(document.body,{childList:true,subtree:true});
    const targetClass='absolute inset-x-0 bottom-2 z-50 flex flex-row justify-center rounded text-sm';const observer2=new MutationObserver(mutations=>{mutations.forEach(mutation=>{if(mutation.addedNodes.length){mutation.addedNodes.forEach(node=>{if(node.nodeType===Node.ELEMENT_NODE&&node.matches(`div.${targetClass.split(' ').join('.')}`)){node.click();}});}});});observer2.observe(document.body,{childList:true,subtree:true});
})();