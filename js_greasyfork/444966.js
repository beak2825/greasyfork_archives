// ==UserScript==
// @name         NanoHelper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ololo
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)(\.heroeswm\.ru|\.lordswm\.com)|178\.248\.235\.15)\/arts_for_monsters.+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/444966/NanoHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/444966/NanoHelper.meta.js
// ==/UserScript==

(function (window, undefined) {
    let w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    if (w.self !== w.top) {
        return;
    }

    Array.from(document.querySelectorAll('input[type="submit"]')).forEach(elem => {
        elem.addEventListener("click", (e) => {
            e.preventDefault()
            let form = e.target.parentElement
            let na_id = form.querySelector('input[name="na_id"]')
            let race = form.querySelector('input[name="race"]')
            let sign = form.querySelector('input[name="sign"]')

            let formData = new FormData()
            formData.append('na_id', na_id.value)
            formData.append('race', race.value)
            formData.append('sign', sign.value)

            const data = [...formData.entries()];
            let str = data
                .map(x => `${x[0]}=${x[1]}`)
                .join('&')

            let http = new XMLHttpRequest;
            http.open('POST', '/arts_for_monsters.php', !0)
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
            http.setRequestHeader('Content-Type', 'text/plain; charset=windows-1251')
            http.send(str);
            http.onload = () => {
                e.target.outerHTML = `<p style="color: green">Готово</p>`
            }
        })
    })

})(window);