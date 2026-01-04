// ==UserScript==
// @name         PSChina Server Translation朱紫dlc汉化脚本英文双语对照
// @namespace    http://tampermonkey.net/
// @license MIT  Northumberland
// @version      1.0.0
// @match        http://china.psim.us/*
// @match        https://china.psim.us/*
// @match        http://47.94.147.145.psim.us/*
// @match        http://replay.pokemonshowdown.com/*
// @match        https://replay.pokemonshowdown.com/*
// @match        https://play.pokemonshowdown.com/*
// @match        http://smogtours.psim.us/*
// @match        https://smogtours.psim.us/*
// @match        https://www.smogon.com/*
// @match        http://g410178v57.qicp.vip-80.psim.us/*
// @match        https://calc.pokemonshowdown.com/*
// @description  基于 Silver, Ceca3, Starmie 的 【PSChina Server Translation朱紫dlc汉化脚本】 的翻译实现 https://update.greasyfork.org/scripts/432623/PSChina%20Server%20Translation.user.jschrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/ask.html?aid=8f25fd0f-922c-43c2-b62a-3267cda201b2
// @author       WmlWss
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/496539/PSChina%20Server%20Translation%E6%9C%B1%E7%B4%ABdlc%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC%E8%8B%B1%E6%96%87%E5%8F%8C%E8%AF%AD%E5%AF%B9%E7%85%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/496539/PSChina%20Server%20Translation%E6%9C%B1%E7%B4%ABdlc%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC%E8%8B%B1%E6%96%87%E5%8F%8C%E8%AF%AD%E5%AF%B9%E7%85%A7.meta.js
// ==/UserScript==

// 此处使用了 Silver, Ceca3, Starmie 大神的字典

let init = () => {
    const style = document.createElement('style');
    var blocker = false;
    style.type = 'text/css';
    style.innerHTML = `
        .tooltip-psst {
            position: fixed;
            padding: 8px;
            background: white;
            color: black;
            border: 1px solid black;
            z-index: 1000;
            display: none;
        }
    `;
    document.head.appendChild(style);

    const shadowHost = document.createElement('div');
    document.body.appendChild(shadowHost);
    const shadowRoot = shadowHost.attachShadow({mode: 'closed'});

    const tooltip = document.createElement('ppst');
    tooltip.className = 'tooltip-psst';
    tooltip.textContent = '初始化中...';
    tooltip.style.position = 'fixed';
    tooltip.style.top = '0';
    tooltip.style.left = '0';
    tooltip.style.padding = '4px'
    tooltip.style.fontSize = '12px';
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    tooltip.style.color = 'white';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.userSelect = 'none';
    tooltip.style.borderRadius = '2px';
    tooltip.style.zIndex = '999'
    shadowRoot.appendChild(tooltip);

    const translations = unsafeWindow.__pokemon_showdown__translations
    const dict = unsafeWindow.__pokemon_showdown__back_dict

    // 添加事件监听器
    document.addEventListener('mouseenter', function(event) {
        if (blocker) return
        // 通过 event.target 获取悬停的 DOM 元素
        if (window.location.href.includes('www.smogon.com') || window.location.href.includes('calc.pokemonshowdown.com')) {
            const word = event.target.innerText;
            if (translations[word] && word) {
                tooltip.innerText = translations[word];
                tooltip.style.display = 'block';
            }
        } else{
            const word = event.target.innerText?.trim() || 'undefined';
            if (dict[word] && word) {
                tooltip.innerText = dict[word];
                tooltip.style.display = 'block';
            }
        }
    }, true);
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    document.addEventListener('mouseleave', function(event) {
        if (blocker) return
        tooltip.style.display = 'none';
    }, true);
    document.addEventListener('mousemove', function(event) {
        if (blocker) return
        tooltip.style.left = event.pageX + 'px';
        tooltip.style.top = - document.querySelector('html').scrollTop + event.pageY - 30 + 'px';
    },true);
    // 监听 mouseup 事件，以便处理文本选中
    document.addEventListener('mouseup', function(event) {
        const selection = capitalizeFirstLetter(window.getSelection().toString());
        if (selection && translations[selection]) {
            tooltip.textContent = translations[selection];
            tooltip.style.display = 'block';
            tooltip.style.left = event.pageX + 10 + 'px';
            tooltip.style.top = - document.querySelector('html').scrollTop + event.pageY + 10 + 'px';
            blocker = true;
        } else {
            tooltip.style.display = 'none';
            blocker = false;
        }
    });
}

(function() {
    'use strict';
    setTimeout(() => {
        if (unsafeWindow.__pokemon_showdown__back_dict) init()
    }, 1000)
})();