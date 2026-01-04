// ==UserScript==
// @author       Noah Cool Boy
// @name         Brick Hill Forum link button
// @description  Allows you to link a forum post directly
// @version      1.4
// @match        https://www.brick-hill.com/forum/thread/*
// @namespace    https://greasyfork.org/users/725966
// @icon         https://www.google.com/s2/favicons?domain=www.brick-hill.com
// @downloadURL https://update.greasyfork.org/scripts/419988/Brick%20Hill%20Forum%20link%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/419988/Brick%20Hill%20Forum%20link%20button.meta.js
// ==/UserScript==

let options = document.querySelectorAll(".forum-options")
for(let x = 1; x < options.length; x++) {
    let option = options[x]
    option.lastElementChild.classList.add("mr4")
    let button = document.createElement("a")
    button.innerText = "LINK"
    button.classList.add("forum-quote")
    button.style.cursor = "pointer"
    option.appendChild(button)
    button.addEventListener("click",()=>{
        try {
            navigator.clipboard.writeText(document.location.href.replace(/#post\d+/,"")+"#"+option.parentElement.id)
        } catch(err) {
            navigator.permissions.query({name: "clipboard-write"}).then(result => {
                if (result.state == "granted" || result.state == "prompt") {
                    navigator.clipboard.writeText(document.location.href.replace(/#post\d+/,"")+"#"+option.parentElement.id)
                }
            });
        }
    })
}