// ==UserScript==
// @name         磁链直接播！【磁链嗅探识别 + 在线播放（磁力云播）（电磁高手）】
// @name:zh-CN   磁链直接播！【磁链嗅探识别 + 在线播放（磁力云播）（电磁高手）】
// @name:zh-TW   磁链直接播！【磁鏈嗅探識別 + 在線播放（磁力雲播）（電磁高手）】
// @name:en      Magnetic Link Directly Play! [ Auto Detect + Video Play Online (WatchMags) ]
// @namespace    healthylife
// @version      0.0.2
// @description  自动嗅探识别页面磁力链接，到电磁高手中自动添加播放视频。识别后，会在相应位置添加直接播按钮，点击即可跳转到电磁高手并自动添加。
// @description:zh-CN  自动嗅探识别页面磁力链接，到电磁高手中自动添加播放视频。识别后，会在相应位置添加直接播按钮，点击即可跳转到电磁高手并自动添加。
// @description:zh-TW  自動嗅探識別頁面磁力鏈接，到電磁高手中自動添加播放視頻。識別後，會在相應位置添加直接播按鈕，點擊即可跳轉到電磁高手並自動添加。
// @description:en  Automatically detect the magnetic link of the page, and automatically add and play videos in diancigaoshou.com
// @author       healthylife
// @match        *://*/*
// @exclude      *://www.diancigaoshou.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/454869/%E7%A3%81%E9%93%BE%E7%9B%B4%E6%8E%A5%E6%92%AD%EF%BC%81%E3%80%90%E7%A3%81%E9%93%BE%E5%97%85%E6%8E%A2%E8%AF%86%E5%88%AB%20%2B%20%E5%9C%A8%E7%BA%BF%E6%92%AD%E6%94%BE%EF%BC%88%E7%A3%81%E5%8A%9B%E4%BA%91%E6%92%AD%EF%BC%89%EF%BC%88%E7%94%B5%E7%A3%81%E9%AB%98%E6%89%8B%EF%BC%89%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/454869/%E7%A3%81%E9%93%BE%E7%9B%B4%E6%8E%A5%E6%92%AD%EF%BC%81%E3%80%90%E7%A3%81%E9%93%BE%E5%97%85%E6%8E%A2%E8%AF%86%E5%88%AB%20%2B%20%E5%9C%A8%E7%BA%BF%E6%92%AD%E6%94%BE%EF%BC%88%E7%A3%81%E5%8A%9B%E4%BA%91%E6%92%AD%EF%BC%89%EF%BC%88%E7%94%B5%E7%A3%81%E9%AB%98%E6%89%8B%EF%BC%89%E3%80%91.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    const reg = /magnet:\?xt=urn:btih:\w{10,}([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
 
    let l = navigator.language || "en";
    if (l.startsWith("en-")) l = "en";
    else if (l.startsWith("zh-")) l = "zh-CN";
    else l = "en";
 
    const T = {
        "en": {
            play: "Play"
        },
        "zh-CN": {
            play: '直接播'
        }
    }[l];
 
    whenDOMReady(() => {
        addStyle(`
            button[data-wtmzjk-mag-url]{
                all: initial;
                border: none;
                outline: none;
                background: none;
                background: #f7d308;
                background: #08a6f7;
                margin: 2px 8px;
                border-radius: 3px;
                color: white;
                cursor: pointer;
                display: inline-flex;
                height: 1.6em;
                padding: 0 .8em;
                align-items: center;
                justify-content: center;
                transition: background .15s;
                text-decoration: none;
            }
            button[data-wtmzjk-mag-url]>svg{
                height: 60%;
                fill: white;
                pointer-events: none;
            }
            button[data-wtmzjk-mag-url]:hover{
                background: #fae157;
                background: #39b9f9;
            }
            button[data-wtmzjk-mag-url]:active{
                background: #dfbe07;
                background: #0797df;
            }
            button[data-wtmzjk-mag-url]>span{
                pointer-events: none;
                font-size: small;margin-right: .5em;font-weight:bold;color:white !important;
            }
        `);
        window.addEventListener("click", onEvents, true);
        window.addEventListener("mousedown", onEvents, true);
        window.addEventListener("mouseup", onEvents, true);
 
        watchBodyChange(work);
    });
 
    function onEvents(e) {
        if (e.target.hasAttribute('data-wtmzjk-mag-url')) {
            e.preventDefault();
            e.stopPropagation();
            if (e.type == "click") {
                let a = document.createElement('a');
                a.href = 'https://www.diancigaoshou.com/#' + new URLSearchParams({ url: e.target.getAttribute('data-wtmzjk-mag-url') });
                a.target = "_blank";
                a.click();
            }
        }
    }
 
 
 
    function createWatchButton(url, isForPlain = false) {
        let button = document.createElement("button");
        button.setAttribute('data-wtmzjk-mag-url', url);
        if (isForPlain) button.setAttribute('data-wtmzjk-button-for-plain', '');
        button.innerHTML = `<span>${T.play}</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>`;
        return button;
    }
 
    function hasPlainMagUrlThatNotHandled() {
        let m = document.body.textContent.match(new RegExp(reg, 'g'));
        return document.querySelectorAll(`[data-wtmzjk-button-for-plain]`).length != (m ? m.length : 0);
    }
 
    function work() {
        console.log('work');
        if (!document.body) return;
        if (hasPlainMagUrlThatNotHandled()) {
            console.log("hasPlainMagUrlThatNotHandled");
            for (let node of getAllTextNodes(document.body)) {
                if (node.nextSibling && node.nextSibling.hasAttribute && node.nextSibling.hasAttribute('data-wtmzjk-mag-url')) continue;
                let text = node.nodeValue;
                if (!reg.test(text)) continue;
                let match = text.match(reg);
                if (match) {
                    let url = match[0];
                    let p = node.parentNode;
                    p.insertBefore(document.createTextNode(text.slice(0, match.index + url.length)), node);
                    p.insertBefore(createWatchButton(url, true), node);
                    p.insertBefore(document.createTextNode(text.slice(match.index + url.length)), node);
                    p.removeChild(node);
                }
            }
        }
        for (let a of Array.from(document.querySelectorAll(
            ['href', 'value', 'data-clipboard-text', 'data-value', 'title', 'alt', 'data-url', 'data-magnet', 'data-copy'].map(n => `[${n}*="magnet:?xt=urn:btih:"]`).join(',')
        ))) {
            if (a.nextSibling && a.nextSibling.hasAttribute && a.nextSibling.hasAttribute('data-wtmzjk-mag-url')) continue; // 已经添加
            if (reg.test(a.textContent)) continue;
            for (let attr of a.getAttributeNames()) {
                let val = a.getAttribute(attr);
                if (!reg.test(val)) continue;
                let url = val.match(reg)[0];
                a.parentNode.insertBefore(createWatchButton(url), a.nextSibling);
            }
        }
    }
 
 
    function watchBodyChange(onchange) {
        let timeout;
        let observer = new MutationObserver(() => {
            if (!timeout) {
                timeout = setTimeout(() => {
                    timeout = null;
                    onchange();
                }, 200);
            }
        });
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });
 
    }
 
    function getAllTextNodes(parent) {
        var re = [];
        if (["STYLE", "SCRIPT", "BASE", "COMMAND", "LINK", "META", "TITLE", "XTRANS-TXT", "XTRANS-TXT-GROUP", "XTRANS-POPUP"].includes(parent.tagName)) return re;
        for (let node of parent.childNodes) {
            if (node.childNodes.length) re = re.concat(getAllTextNodes(node));
            else if (Text.prototype.isPrototypeOf(node) && (!node.nodeValue.match(/^\s*$/))) re.push(node);
        }
        return re;
    }
 
    function whenDOMReady(f) {
        if (document.body) f();
        else window.addEventListener("DOMContentLoaded", f);
    }
 
    function addStyle(s) {
        let style = document.createElement("style");
        style.innerHTML = s;
        document.documentElement.appendChild(style);
    }
 
})();