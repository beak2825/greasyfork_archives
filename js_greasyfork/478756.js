// ==UserScript==
// @name         malitanyo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto Faucet
// @author       White
// @match        https://malitanyo.website/faucet.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=malitanyo.website
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478756/malitanyo.user.js
// @updateURL https://update.greasyfork.org/scripts/478756/malitanyo.meta.js
// ==/UserScript==

(function() {
    const email = 'email';

    const inputType = 'email';
    let intervalId;
    let delayId;
    let yesOrNo = localStorage.getItem('yesOrNo') || 'no';

    function preencherCampo() {
        const campoEmail = document.querySelector(`input[type="${inputType}"]`);

        if (campoEmail && campoEmail.value === '') {
            campoEmail.value = email;
            delayId = setTimeout(clicarBotao, 5000);
        } else if (campoEmail) {
            delayId = setTimeout(clicarBotao, 5000);
        } else {
            console.log('Campo de e-mail não encontrado.');
        }
    }

    function clicarBotao() {
        const botao = document.querySelector('input[type="submit"].sskkaa[value="Claime Now »"]');
        if (botao) {
            botao.click();
            yesOrNo = 'yes';
            localStorage.setItem('yesOrNo', yesOrNo);
        } else {
            console.log('Botão não encontrado.');
        }
    }

    function redirecionar() {
        if (yesOrNo === 'yes') {
            yesOrNo = 'no';
            localStorage.setItem('yesOrNo', yesOrNo);
            window.location.href = 'https://malitanyo.website/faucet.php';
        }
    }

    intervalId = setInterval(preencherCampo, 5000);
    setTimeout(redirecionar, 4000);
})();
