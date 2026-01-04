// ==UserScript==
// @name         kiddyearner
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Autologin + Autoshorts!
// @author       Keno Venas
// @match        https://kiddyearner.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kiddyearner.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494344/kiddyearner.user.js
// @updateURL https://update.greasyfork.org/scripts/494344/kiddyearner.meta.js
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
    function clicarBotaoComDelay() {
        setTimeout(function() {
            var botao = document.querySelector('button.btn');
            if (botao) {
                botao.click();
            } else {
                console.log('Botão não encontrado.');
            }
        }, 12000);
    }
    function clicarClaimBtnComDelay() {
        setTimeout(function() {
            var claimBtn = document.querySelector('a[class="claim-btn text-white w-100"]');
            if (claimBtn) {
                claimBtn.click();
            } else {
                console.log('Botão de claim não encontrado.');
            }
        }, 5000);
    }
    function clicarNosBotoes() {
        var botoesParaClicar = ['button.btn-submit'];
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
            clicarNosBotoes();
        }
    }, 1000);
    clicarBotaoComDelay();
    clicarClaimBtnComDelay();

    // Redireciona para a página de login e para a página de links
    if (window.location.href === "https://kiddyearner.com/") {
        window.location.href = "https://kiddyearner.com/login";
    }

    if (window.location.href === "https://kiddyearner.com/dashboard") {
        window.location.href = "http://linksfly.link/kiddyearner-liks";
    }
    function preencherCampos() {
        var emailCampo = 'input#email';
        var senhaCampo = 'input#password';
        var email = 'seuemail@gmail.com';
        var senha = 'senha';
        setTimeout(function() {
            $(emailCampo).val(email);
        }, 3000);

        setTimeout(function() {
            $(senhaCampo).val(senha);
        }, 3000);
    }
    function removerCartoes() {
        var cartoes = document.querySelectorAll('div[class="col-lg-6"]');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (
                textoCartao.includes("Rs short") ||
                textoCartao.includes("clk") ||
                textoCartao.includes("Shrinkearn") ||
                textoCartao.includes("Shrinkme") ||
                textoCartao.includes("Coinfays") ||
                textoCartao.includes("FC LC") ||
                textoCartao.includes("CTR") ||
                textoCartao.includes("Clks"))
            {
                cartao.remove();
            }
        });
    }
    preencherCampos();
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
