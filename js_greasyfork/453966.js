// ==UserScript==
// @name         KichangKim/DeepDanbooru 태그 추출
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  태그 추출 버튼을 페이지에 추가해줍니다.
// @author       fact-0
// @match        https://hysts-deepdanbooru.hf.space/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hf.space
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453966/KichangKimDeepDanbooru%20%ED%83%9C%EA%B7%B8%20%EC%B6%94%EC%B6%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/453966/KichangKimDeepDanbooru%20%ED%83%9C%EA%B7%B8%20%EC%B6%94%EC%B6%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function gradioApp(){
        return document.getElementsByTagName('gradio-app')[0].shadowRoot;
    }
    window.onload = ()=>{
        const component = gradioApp().querySelector('div#component-14');

        component.innerHTML += `<textarea id='result-prompt'></textarea><br>`;
        component.innerHTML += `<button id='result-button' class="gr-button gr-button-lg gr-button-primary">태그 추출</button>`;
        gradioApp().querySelector('#result-button').addEventListener('click', ()=>{
            const result = [...gradioApp().querySelectorAll('div.leading-snug')].map(div=>div.textContent).join(', ');
            console.log(result);
            gradioApp().querySelector('textarea#result-prompt').innerHTML = result;
        });
    }
})();