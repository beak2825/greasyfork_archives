// ==UserScript==
// @name         a, s, e shortcut in dcinside
// @namespace    http://tampermonkey.net/
// @version      2024
// @description  a키를 누르면 다음 개념글, s 키를 누르면 이전 념글, e 키를 누르면 개념글로 이동하고, 또 e키를 누르면 첫 번째 개념글을 선택합니다.
// @author       You
// @match        https://gall.dcinside.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520212/a%2C%20s%2C%20e%20shortcut%20in%20dcinside.user.js
// @updateURL https://update.greasyfork.org/scripts/520212/a%2C%20s%2C%20e%20shortcut%20in%20dcinside.meta.js
// ==/UserScript==

document.addEventListener('keydown', function (keyInput) {
    if (keyInput.key === 'a') {
        let elementNodeListOf = document.querySelectorAll('.gall_tit.ub-word');
        for (let a = 0; a < elementNodeListOf.length; a++) {
            if (document.URL === elementNodeListOf[a].querySelector('a').href) {
                elementNodeListOf[a + 1].querySelector('a').click();
            }
        }
    }
    if (keyInput.key === 's') {
        let elementNodeListOf = document.querySelectorAll('.gall_tit.ub-word');
        for (let a = 0; a < elementNodeListOf.length; a++) {
            if (document.URL === elementNodeListOf[a].querySelector('a').href) {
                elementNodeListOf[a - 1].querySelector('a').click();
            }
        }
    }

    if (keyInput.key === 'e') {
        let main = document.querySelector('.array_tab.left_box').querySelectorAll('button')[1];
        if (main.textContent === '개념글' && main.getAttribute('class') !== 'on') {
            document.querySelector('.array_tab.left_box').querySelectorAll('button')[1].onclick();
        } else {
            document.querySelector('tr[data-type="icon_recomimg"]').querySelector('.gall_tit.ub-word').querySelector('a').click();

        }
    }
});

// css title
document.querySelector('.title.ub-word').style.fontSize = 'xxx-large';
