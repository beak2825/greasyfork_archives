// ==UserScript==
// @name         auto petal remover
// @name:ja      自動ペタル外し
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  press Y to remove your primary petals.
// @description:ja Yキーを押してマウスを動かすと一段目のペタルを外すことができます。
// @author       AstRatJP
// @match        https://hornex.pro/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475215/auto%20petal%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/475215/auto%20petal%20remover.meta.js
// ==/UserScript==



const input = document.querySelector('.chat-input');
const inputName = document.querySelector('.grid .nickname');
let chatFocus = false;
let nameFocus = false;
let mouseMoved = false;

input.addEventListener('focus', () => {
    chatFocus = true;
});
inputName.addEventListener('focus', () => {
    nameFocus = true;
});
input.addEventListener('blur', () => {
    chatFocus = false;
})
inputName.addEventListener('blur', () => {
    nameFocus = false;
});
document.addEventListener('mousemove', () => {
    mouseMoved = true;
});

document.addEventListener('keydown', (event) => {
    if (chatFocus === false && nameFocus === false) {
        if (event.key === 't') {
            const petalEmptyElements = document.getElementsByClassName("petal empty");
            for (let i = 0; i < petalEmptyElements.length / 2; i++) {
                petalEmptyElements[i].innerHTML = "";
            }
        }
        if (event.key === 'y') {
            removePrimaryPetals();
        }
    }
});

async function removePrimaryPetals() {
    const elements = Array.from(document.querySelectorAll(".petals:not(.small) .petal.empty .petal"));
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const slot = document.querySelector(".petal-rows");
        const longPressEvent = new MouseEvent("mousedown", {
            bubbles: true,
            cancelable: true,
            view: window,
            buttons: 1,
            button: 0,
        });
        const mouseUpEvent = new MouseEvent("mouseup", {
            bubbles: true,
            cancelable: true,
            view: window,
            buttons: 0,
        });
        element.dispatchEvent(longPressEvent);
        const top = element.style.top;
        const left = element.style.left;


        const endTime = Date.now() + 500;
        mouseMoved = false;
        while (Date.now() < endTime) {
            if (mouseMoved) {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 1));
        }



        let slotTop = slot.style.top;
        slot.style.top = "0%";
        element.dispatchEvent(mouseUpEvent);
        slot.style.top = slotTop;
    }
}
