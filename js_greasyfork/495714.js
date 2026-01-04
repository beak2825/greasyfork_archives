// ==UserScript==
// @name        MyStat Timesetter
// @namespace   Violentmonkey Scripts
// @match       https://mystat.itstep.org/*
// @grant       none
// @version     1.0.1
// @author      regularuser548
// @description Скрипт который автоматически ставит время в окне загрузки дз в Майстате
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/495714/MyStat%20Timesetter.user.js
// @updateURL https://update.greasyfork.org/scripts/495714/MyStat%20Timesetter.meta.js
// ==/UserScript==


const hours = '01';
const mins = '00';

document.addEventListener('click', checkForDialog);

function checkForDialog(event) {
    if (event.target.parentElement.classList.contains("upload-file") || event.target.classList.contains("upload-file"))
        if (document.getElementsByClassName('text-homework-time-spent-wrap'))
            setDefaultTime();
}

function setDefaultTime() {
    let timeInputs = document.getElementsByClassName('text-homework-time-spent-wrap')[0].querySelectorAll('input[type="text"]');
    timeInputs[0].value = hours;
    timeInputs[1].value = mins;

    timeInputs[0].focus();
    timeInputs[1].focus();
    timeInputs[1].blur();

}
