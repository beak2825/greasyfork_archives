// ==UserScript==
// @name        4PDA Удаление редиректов
// @description Удаляет редиректы из ссылок на форуме 4PDA
// @namespace   Neur0toxine
// @match       https://4pda.to/forum/index.php*
// @grant       none
// @version     1.0
// @license     MIT
// @author      NeoCortex
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/527674/4PDA%20%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%B4%D0%B8%D1%80%D0%B5%D0%BA%D1%82%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/527674/4PDA%20%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%B4%D0%B8%D1%80%D0%B5%D0%BA%D1%82%D0%BE%D0%B2.meta.js
// ==/UserScript==
document.querySelectorAll('a[href^="//4pda.to/stat/go?u=').forEach((el) => {
    const url = new URL(el.href)
    const realUrl = url.searchParams.get('u')

    if (null == realUrl) {
        return
    }

    el.href = realUrl
})