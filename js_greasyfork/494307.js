// ==UserScript==
// @name         99faucet
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Autologin e Auto shorts!
// @author       Keno venas
// @match        https://99faucet.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=99faucet.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494307/99faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/494307/99faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var messageDiv = document.createElement('div');
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.left = '20px';
    messageDiv.style.padding = '10px';
    messageDiv.style.backgroundColor = 'blue';
    messageDiv.style.color = 'black';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.zIndex = '9999';
    messageDiv.textContent = 'Criado por Keno Venas !!!';
    document.body.appendChild(messageDiv);
    var botoesParaClicar = ['button.btn-submit'];
    function clicarNosBotoesComAtraso() {
        setTimeout(function() {
            clicarNosBotoes();
        }, 5000);
    }
    function clicarNosBotoes() {
        for (var i = 0; i < botoesParaClicar.length; i++) {
            var botao = document.querySelector(botoesParaClicar[i]);
            if (botao) {
                botao.click();
            }
        }
    }
    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse();
    }
    var verificarCaptchaInterval = setInterval(function() {
        if (isCaptchaChecked()) {
            clearInterval(verificarCaptchaInterval);
            clicarNosBotoesComAtraso();
        }
    }, 1000);
    // Insira seu email e senha aqui
    var email = "seuemail@gmail.com";
    var senha = "suasenha";
    function preencherCampos() {
        var emailInput = document.querySelector('input[type="email"]');
        var senhaInput = document.querySelector('input[type="password"]');

        if (emailInput && senhaInput) {
            emailInput.value = email;
            senhaInput.value = senha;
        }
    }
    window.addEventListener('load', preencherCampos);
    if (window.location.href === "https://99faucet.com/") {
        window.location.href = "https://99faucet.com/login";
    }

    if (window.location.href === "https://99faucet.com/dashboard") {
        window.location.href = "http://linksfly.link/8Mjvyug";
    }
    function clicarBotaoComDelay(selector, delay) {
        setTimeout(function() {
            var botao = document.querySelector(selector);
            if (botao) {
                botao.click();
            }
        }, delay);
    }
    window.addEventListener('load', function() {
        clicarBotaoComDelay('.col-lg-6:nth-child(1) .claim-btn', 5000);
        clicarBotaoComDelay('button[class="btn btn-success btn-lg text-white"]', 15000);
    });
    function removerCartoes() {
        var cartoes = document.querySelectorAll('div[class="col-lg-6"]');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (textoCartao.includes("Rsshort") ||
                textoCartao.includes("Clks") ||
                textoCartao.includes("CTR") ||
                textoCartao.includes("Shrinkme") ||
                textoCartao.includes("Shrinkearn") ||
                textoCartao.includes("Coinfays") ||
                textoCartao.includes("Clk Sh") ||
                textoCartao.includes("FC LC")) {
                cartao.remove();
            }
        });
    }
    removerCartoes();
     if(document.querySelector('#gpcaptcha')){
        const captchaImgs = document.querySelectorAll('#gpcaptcha .svg-padding');
        const hashes = [
            {"Key": "M512 176.001C512 273.203"},
            {"Flag": "M349.565 98.783C295.978"},
            {"Heart": "M414.9 24C361.8 24 312"},
            {"Car": "M499.991 168h-54.815l-7.854-20"},
            {"Plane": "M472 200H360.211L256.013"},
            {"House" :"M488 312.7V456c0 13.3-10.7"},
            {"Cup":"M192 384h192c53 0 96-43"},
            {"Tree" : "M377.33 375.429L293.906"},
            {"Star" : "M259.3 17.8L194 150.2 47.9"},
            {"Truck":"M624 352h-16V243.9c0-12.7-5"}
        ]

        const selectedText = document.querySelector('#gpcaptcha p .text-capitalize').innerText.toLowerCase();
        const checkHash = hashes.find(hash => Object.keys(hash)[0].toLowerCase() === selectedText);
        const flagValue = checkHash ? Object.values(checkHash)[0] : null;
        console.log(selectedText, flagValue)

        function checkImages() {
            Array.from(captchaImgs).forEach((img, i) => {
                const svg = img.querySelector('svg path').getAttribute('d');
                if (svg.startsWith(flagValue)) {
                    img.click()
                    console.log('Matched');
                }else{
                    console.log('Doesnt match');
                }
            });
        }

        setInterval(function(){
            checkImages();
        },10000)
    }
})();