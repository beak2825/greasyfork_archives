// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Возвращает кнопку игнора навсегда
// @author       You
// @match        https://pikabu.ru/@*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikabu.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466081/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/466081/New%20Userscript.meta.js
// ==/UserScript==

(() => {
    setTimeout(() => {
        const profileId = document.querySelector(".profile").getAttribute("data-user-id")
        
        const btn = document.createElement("span")
        btn.setAttribute("class", "button")
        btn.setAttribute("style", "margin-right: 10px;")
        btn.addEventListener("click", async () => {
            const a = await fetch("https://pikabu.ru/ajax/ignore_actions.php", {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "x-requested-with": "XMLHttpRequest"
                },
                "body": `authors=${profileId}&communities=&tags=&keywords=&story_id=0&period=forever&action=add_rule`,
                "method": "POST",
            });
            alert((await a.json()).message || "Успешно!")
        })
        btn.innerText = "Скрыть посты навсегда"

        document.querySelector(".profile__user-button").prepend(btn)
    }, 1000)
})()