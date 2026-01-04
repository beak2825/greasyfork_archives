// ==UserScript==
// @name         yandex music big bubble
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  меняет размер и цвет иконки, которая отображает прослушиваемый трек
// @author       Roman Novotochin
// @match        https://music.yandex.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eis24.me
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450430/yandex%20music%20big%20bubble.user.js
// @updateURL https://update.greasyfork.org/scripts/450430/yandex%20music%20big%20bubble.meta.js
// ==/UserScript==

let timerId = setInterval(() => check(), 700);

function check() {
    let button = $(`div.d-track__bubble`)
    button.css('width','36px')
    button.css('height','36px')
    button.css('background-color','#51cf66')
    button.css('border-radius','18px')
    button.css('z-index','2')
    button.css('top','15px')
    button.css('left','15px')
    button.css('animation','bubble_out 2.6s ease-in-out infinite both')
}
