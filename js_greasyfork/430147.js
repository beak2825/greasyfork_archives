// ==UserScript==
// @name         Gather OwO~
// @namespace    https://蘿莉.com
// @version      0.1
// @description  Gather User Script
// @author       Meow! >W<
// @match        https://gather.town/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430147/Gather%20OwO~.user.js
// @updateURL https://update.greasyfork.org/scripts/430147/Gather%20OwO~.meta.js
// ==/UserScript==

'use strict';

let runGatherUserScript = () => {
    let menu = undefined

    updateMenu()

    function updateMenu() {
        if (menu) {
            document.body.removeChild(menu);
        }
        menu = document.createElement("div")

        menu.style.position = "fixed";
        menu.style.left = 0;
        menu.style.top = 0;
        menu.style.height = "100%";
        menu.style.overflow = "scroll";
        menu.style.backgroundColor = "#ccc";
        menu.style.opacity = .7
        menu.style.left = '70px'

        document.body.appendChild(menu)
        for (const userId in gameSpace.gameState) {
            const user = gameSpace.gameState[userId]

            const cell = document.createElement("div")

            /*
		// innerHTML is dangerous
		cell.innerHTML = `
			<input type="checkbox" data-userId="${userId}" name="${userId}">
			<label for="${userId}"> ${user.name} </label><br>
		*/
            const checkbox = document.createElement("input")
            checkbox.type = "checkbox";
            checkbox.dataset.userId = userId;
            checkbox.id = userId;
            checkbox.addEventListener("change", _0x342dfe)
            cell.appendChild(checkbox)

            const label = document.createElement("label")
            // label.for = userId
            label.dataset.userId = userId;
            label.textContent = user.name
            cell.appendChild(label)

            menu.appendChild(cell)

        }
    }


    function _0x342dfe (event) {
        const checkbox = event.target

        if (checkbox.checked) {
            const userId = checkbox.dataset.userId
            const whisperOwO = forceBubble(userId)

            checkbox.dataset.whisperOwO = whisperOwO
            console.log(userId)

        } else {
            const whisperOwO = checkbox.dataset.whisperOwO
            clearInterval(whisperOwO)
            console.log("test")
        }

    }

    function forceBubble (userId) {
        return setInterval((userId) => {
            gameSpace.whisper(userId, 0)
            gameSpace._moveToClosestWhisperPlayer = ()=>{}
        }, 500, userId)
    }


    gameSpace.addEventListener('clickInteraction', (e,t)=>{
        if(e.click.type === 1){
            gameSpace.teleport(e.click.coords.x, e.click.coords.y)
        }
    })
    // 但感覺要把 setMoveTo 改成沒有用
    gameSpace.setMoveTo = ()=>{}


    function fixPositionStart() {
        const userId = gameSpace.id;
        const map = gameSpace.gameState[userId].map
        const x = gameSpace.gameState[userId].x
        const y = gameSpace.gameState[userId].y

        return setInterval(fixPosition, 100, x, y)
    }

    function fixPosition(x, y, map) {
        gameSpace.teleport(x, y, map);
    }

};

let checkGameSpace = setInterval(() => {
    if(!gameSpace.hasRespawned) {
        return;
    }
    runGatherUserScript();
    clearInterval(checkGameSpace);
}, 1000);