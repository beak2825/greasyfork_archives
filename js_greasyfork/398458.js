// ==UserScript==
// @name         OS体验优化
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Improve the teriminal.
// @description  Disable the autocomplete of capche input.
// @author       BearHuchao
// @match        http://course.educg.net/
// @match        http://course.educg.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398458/OS%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/398458/OS%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

// ==UserScript==
// @name         OS体验优化
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Improve the teriminal.
// @description  Disable the autocomplete of captcha input.
// @description  Allow to click on captcha pic to reload captcha.
// @author       BearHuchao
// @match        http://course.educg.net/
// @match        http://course.educg.net/*
// @grant        none
// ==/UserScript==

function actionFunction () {
    'use strict';
    var terminal = document.getElementById("terminado-container");
    if(terminal !== null) {
        terminal.style.width="100%";
    }
    var captcha = document.getElementById("captchaCode");
    if(captcha !== null) {
        captcha.autocomplete="off";
    }
    var captchaPic = document.getElementById("stuloginCaptcha_HelpLink");
    if(captchaPic !== null) {
        captchaPic.href="#";
        captchaPic.target="_self";
        captchaPic.addEventListener('click', () => {
            document.getElementById("stuloginCaptcha_ReloadLink").click();
        });
    }
}

actionFunction();