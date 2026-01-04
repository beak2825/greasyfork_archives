// ==UserScript==
// @name     Мессенджер => Сообщения
// @version  2
// @grant    none
// @match    https://vk.com/*
// @description:ru Меняет упоминания "Мессенджера" обратно на "Сообщения" в ВК.
// @namespace https://greasyfork.org/users/216552
// @description Меняет упоминания "Мессенджера" обратно на "Сообщения" в ВК.
// @downloadURL https://update.greasyfork.org/scripts/412649/%D0%9C%D0%B5%D1%81%D1%81%D0%B5%D0%BD%D0%B4%D0%B6%D0%B5%D1%80%20%3D%3E%20%D0%A1%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/412649/%D0%9C%D0%B5%D1%81%D1%81%D0%B5%D0%BD%D0%B4%D0%B6%D0%B5%D1%80%20%3D%3E%20%D0%A1%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

const msgEl = document.querySelector("#l_msg")
msgEl.children[0].children[1].innerText = "Сообщения"

if (document.title == "Мессенджер") document.title = "Сообщения"

const title = document.querySelector('title')
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (document.title == "Мессенджер") document.title = "Сообщения"
    })
})
const config = {
    childList: true,
}
observer.observe(title, config)