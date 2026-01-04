// ==UserScript==
// @name         seiya-saiga.com
// @version      0.0.1
// @name         -
// @description  -
// @include      https://seiya-saiga.com/game/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @namespace https://greasyfork.org/users/480818
// @downloadURL https://update.greasyfork.org/scripts/418191/seiya-saigacom.user.js
// @updateURL https://update.greasyfork.org/scripts/418191/seiya-saigacom.meta.js
// ==/UserScript==

const db = document.body,

    cb = db.querySelectorAll("[type=checkbox]"),

    n = /(?<=\/)\w+(?=\.html)/.exec(location.pathname)

let va = GM_getValue(""), vl

va ? (() => {
    va = JSON.parse(va)

    vl = va[n]

    vl && window.addEventListener("load", () => {
        cb.forEach((el, ei) => (el.checked = vl[ei]))
    })
})() : va = {}

window.addEventListener("click", event => {
    const ti = Array.from(cb).indexOf(event.target)

    ~ti && (() => {
        // initialize the list only when clicked
        vl || (vl = Array(cb.length).fill(0))

        vl[ti] = cb[ti].checked ? 1 : 0

        va[n] = vl

        GM_setValue("", JSON.stringify(va))
    })()
})

db.removeAttribute("oncontextmenu")
db.removeAttribute("onselectstart")

// print json
console.log(va)