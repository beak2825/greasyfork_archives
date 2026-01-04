// ==UserScript==
// @name         asmr.one字幕调整
// @version      0.2.3
// @description  放大asmr.one的字幕大小，可固定高亮字幕在可见区域
// @author       SchneeHertz
// @license      MIT
// @match        https://www.asmr.one/*
// @match        https://asmr-100.com/*
// @match        https://asmr-200.com/*
// @match        https://asmr-300.com/*
// @grant        GM_addStyle
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/501981/asmrone%E5%AD%97%E5%B9%95%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/501981/asmrone%E5%AD%97%E5%B9%95%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==


GM_addStyle(`
    #lyric {
        font-size: 2rem;
        line-height: 3rem;
    }
`)

function insertCheckbox () {
    const checkboxLabel = document.createElement('label')
    checkboxLabel.textContent = '固定高亮字幕'
    checkboxLabel.style.display = 'inline-flex'
    checkboxLabel.style.alignItems = 'center'
    checkboxLabel.style.gap = '5px'
    checkboxLabel.style.margin = '0 18px 6px'
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.id = 'fix-subtitle'

    checkboxLabel.insertBefore(checkbox, checkboxLabel.firstChild)
    const targetElement = document.querySelector('#lyric-layout .scroll header')

    if (targetElement) targetElement.appendChild(checkboxLabel)
}

function scrollToHighlight() {
    const container = document.querySelector('#lyric-layout .scroll')
    const highlighted = document.querySelector('#currentLyricEl')

    if (highlighted) container.scrollTop = highlighted.offsetTop - container.clientHeight / 5
}

setInterval(() => {
   const container = document.querySelector('#lyric-layout .scroll')
   if (container) {
       if (!document.getElementById('fix-subtitle')) insertCheckbox()
       const checkbox = document.getElementById('fix-subtitle')
       if (checkbox.checked) scrollToHighlight()
   }
}, 100)