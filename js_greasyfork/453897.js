// ==UserScript==
// @name         autologin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Автологин
// @author       S30N1K
// @match        https://webinar-sdo.rzd.ru/?measure=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453897/autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/453897/autologin.meta.js
// ==/UserScript==

// Лишнее оставь пустым
const config = {
    plastname: "Фамилия",
    pfirstname: "Имя",
    psurname: "Отчество",
    personemail: "Еmail",
    personmobtel: "Телефон",
}

const init = () => {
    if (document.readyState === "complete" && document.location.search.match(/measure/)) {
        setTimeout(() => {
            for (const e of Object.keys(config)) {
                const el = document.querySelector(`input[name="${e}"]`)
                console.log(el)
                el.focus()
                document.execCommand("insertText", false, config[e])
            }

            document.querySelector(`button[color="success"]`).click()
        }, 1000)
    }
}

document.onreadystatechange = init
init()