// ==UserScript==
// @name         쉬프트 오토파이어
// @version      0.1
// @description  스크립트는 적절한 설명을 포함해야 하고, 난독화나 최소화될 수 없고, 반드시 저작권을 지켜야 합니다. 또한 외부 코드 사용에 제약이 있어요
// @author       Kateal
// @match        https://*diep.io/*
// @namespace https://greasyfork.org/users/1234345
// @downloadURL https://update.greasyfork.org/scripts/469969/%EC%89%AC%ED%94%84%ED%8A%B8%20%EC%98%A4%ED%86%A0%ED%8C%8C%EC%9D%B4%EC%96%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/469969/%EC%89%AC%ED%94%84%ED%8A%B8%20%EC%98%A4%ED%86%A0%ED%8C%8C%EC%9D%B4%EC%96%B4.meta.js
// ==/UserScript==
window.addEventListener("keyup", function(e) {
    if(e.code === "ShiftRight") {
        input.key_down(69);
        input.key_up(69);
    }
});
