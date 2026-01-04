// ==UserScript==
// @name         Zeta Rapid Logs
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://zeta.int.autoheim.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autoheim.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473557/Zeta%20Rapid%20Logs.user.js
// @updateURL https://update.greasyfork.org/scripts/473557/Zeta%20Rapid%20Logs.meta.js
// ==/UserScript==


const hack = () => {
    const table = document.getElementsByClassName("v-data-table__wrapper")[0]

    const header = table.getElementsByTagName("thead")[0].getElementsByTagName("tr")[0]
    const body = table.getElementsByTagName("tbody")[0]

    if (body.hasAttribute("hacked")) { return }

    if (!window.location.href.startsWith("https://zeta.int.autoheim.net/jobs/")) { return }
    const job = +window.location.href.split("/").at(-1)

    let th = header.firstChild.cloneNode()
    header.insertBefore(th, header.firstChild)


    for (const tr of body.getElementsByTagName("tr")) {
        if (tr.children.length <= 1) { return }
        const task = +tr.children[2].textContent
        const td = document.createElement("td")
        const a = document.createElement("a")
        a.textContent = "logs🔗"
        a.href = `https://vm000403.int.autoheim.net/logs/production/jobs/${job}/tasks/${task}/rapid_logs.html`
        a.target="_blank"
        td.appendChild(a)
        td.classList.add("text-start")
        tr.insertBefore(td, tr.firstChild)
    }

    body.setAttribute("hacked", "")

}

(async function() {
    'use strict';

    await new Promise(r => setTimeout(r, 100));

    while (true) {
        try {
            hack()
        } catch(e) {
            console.log("failed to hack", e)
        }
        await new Promise(r => setTimeout(r, 500));
    }
})();