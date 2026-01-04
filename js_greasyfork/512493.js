// ==UserScript==
// @name         координаты кнопки bitcoinker
// @namespace    http://tampermonkey.net/
// @version      2024-10-15
// @description  как получить координаты курсора мыши
// @author       Dank Odze
// @match        https://bitcoinker.com/
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitcoinker.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512493/%D0%BA%D0%BE%D0%BE%D1%80%D0%B4%D0%B8%D0%BD%D0%B0%D1%82%D1%8B%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20bitcoinker.user.js
// @updateURL https://update.greasyfork.org/scripts/512493/%D0%BA%D0%BE%D0%BE%D1%80%D0%B4%D0%B8%D0%BD%D0%B0%D1%82%D1%8B%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20bitcoinker.meta.js
// ==/UserScript==



    var CaptchaSolverStatus = document.createElement('div');
    document.body.appendChild(CaptchaSolverStatus);

    CaptchaSolverStatus.classList.add('captchasolver-status');
	document.body.appendChild(document.createElement('style')).textContent = (`
                .captchasolver-status {
                position: fixed;
                font-size: 20px !important;
                top: 140px !important;
                right: 20px;
                z-index: 9999;
                pointer-events: none;
                }
                `);

    function setCaptchaSolverStatus(html, color) {
        if (color === 'green') {
            CaptchaSolverStatus.style.color = 'green';
        } else if (color === 'red') {
            CaptchaSolverStatus.style.color = 'red';
        } else {
            CaptchaSolverStatus.style.color = 'black';
        }
        CaptchaSolverStatus.innerHTML = html;
    }

    setCaptchaSolverStatus('<p><b>Captcha Solver:</b> Activated.</p>', 'green');
setCaptchaSolverStatus('<p><b>Captcha Solver:</b> Wait for picture...</p>', 'green')
document.addEventListener('mousemove', event => {
    setCaptchaSolverStatus(event.clientX + ':' + event.clientY + '<br>' + event.screenX + ':' + event.screenY + '<br>' + event.pageX + ':' + event.pageY, 'green');
    console.log(event.clientX + ':' + event.clientY + '\r\n' + event.screenX + ':' + event.screenY + '\r\n' + event.pageX + ':' + event.pageY); // ЭТО должно сделать то, что вы хотите
})
/*
Horizontal mouse position relative to viewport:
click - клик левой кнопкой мыши по элементу, на сенсорных устройствах это касание;
contextmenu - клик на элемент правой кнопкой мыши - вызов контекстного меню;
mouseover / mouseout - наведение на элемент курсора мыши / курсор покидает элемент;
mousemove - движение мыши;

document.addEventListener('mousemove', event => {
    console.log(event.clientY) // THIS should do what you want
})
complete list of options are:

e.clientY/Y: положение относительно области просмотра
e.screenX/Y: положение относительно экрана
e.pageX/Y: положение относительно страницы (отличается от области просмотра, если страница прокручивается)
*/
