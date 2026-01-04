// ==UserScript==
// @name         Hitbox Room List Search
// @namespace    http://tampermonkey.net/
// @version      v1.00
// @description  A Mod for room list filters.
// @author       iNeonz
// @match        https://heav.io/game.html
// @match        https://hitbox.io/game.html
// @match        https://heav.io/game2.html
// @match        https://hitbox.io/game2.html
// @match        https://hitbox.io/game-beta.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heav.io
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/493569/Hitbox%20Room%20List%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/493569/Hitbox%20Room%20List%20Search.meta.js
// ==/UserScript==

const roomListTop = document.querySelector("#appContainer > div.roomListContainer > div.flexPaddingCenter > div.roomList");
const div = document.createElement('span');
div.classList.add("title");
div.classList.add("row");
roomListTop.appendChild(div);
div.innerHTML = `Includes<input style="background: #303030; border: 1px solid #222222; font-family: 'Bai Jamjuree'; outline: none; color: #ebebeb; padding: 4px;" class="nameField" maxlength="50">`;
div.style.right = '20px';
div.style.position = 'absolute';
div.style.top = '15.5px';
let mustInclude = '';

div.children[0].addEventListener('keyup',() => {
    if (mustInclude != div.children[0].value) {
        mustInclude = div.children[0].value;
        document.querySelector("#appContainer > div.roomListContainer > div.flexPaddingCenter > div.bottomButton.middle").click();
    }
})

new Promise((r) => {
    let setId = setInterval(() => {
        let roomList = document.querySelector("#appContainer > div.roomListContainer > div.flexPaddingCenter > div.roomList > div.scrollBox > table > tbody");
        if (roomList && roomList.children[0]) {
            console.log("found list")
            console.log(roomList);
            roomList.addEventListener("DOMNodeInserted", function(event){
                // newElem is the newly injected element
                let newElem = event.srcElement;
                if (newElem && newElem.parentNode.classList && newElem.parentNode.classList.contains("HOVERUNSELECTED")){
                    setTimeout(() => {

                   if(!newElem.parentNode.children[0].textContent.includes(mustInclude)) {
                       newElem.parentNode.remove();
                   }
                    },0)
                }
            });
            r();
            clearInterval(setId);
        }
    },10);
})

