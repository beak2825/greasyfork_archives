// ==UserScript==
// @name         Cryptoearns
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto Shorts
// @author       Keno Venas
// @match        https://cryptoearns.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryptoearns.com
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/494345/Cryptoearns.user.js
// @updateURL https://update.greasyfork.org/scripts/494345/Cryptoearns.meta.js
// ==/UserScript==


(function() {
    'use strict';
    function isSecureConnectionMessageVisible() {
        return document.body.textContent.includes('Verificando se você é humano. Isso pode levar alguns segundos.');
    }
    function suaFuncaoPrincipal() {

    if (window.location.href === "https://cryptoearns.com/") {
        window.location.href = "https://cryptoearns.com/login";
    }

    if (window.location.href === "https://cryptoearns.com/dashboard") {
        window.location.href = "https://cryptoearns.com/links";
    }
    function clicarComDelay(classeBotao, delay) {
        var botao = $(classeBotao + ':visible').eq(0);
        if (botao.length > 0) {
            setTimeout(function() {
                botao.click();
            }, delay);
        }
    }
    $(document).ready(function() {
    clicarComDelay('button.btn-primary.w-100.btn-block.claim-button', 5000);
    clicarComDelay('button.btn-submit', 8000);
    clicarComDelay('button.btn-one', 12000);

    setTimeout(function() {
        var xpath = "/html/body/div[1]/div[3]/div[3]/div/div[5]/div[1]/div/a";
        var resultadoXPath = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        var botaoVisit = resultadoXPath.singleNodeValue;
        if (botaoVisit) {
            botaoVisit.click();
        }
    }, 10000);

    setTimeout(function() {
        var botaoContinue = document.evaluate('/html/body/div[1]/div[3]/div[3]/div/div[2]/div/div/button/i', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (botaoContinue) {
            botaoContinue.click();
        }
    }, 20000);
});
    var email = "email@gmail.com"; //SEU EMAIL
    var senha = "senha"; // SUA SENHA
    function preencherCampos() {
        var emailInput = document.querySelector('input[class="form-control"]');
        var senhaInput = document.querySelector('input[class="form-control mb-3"]');
        if(emailInput && senhaInput) {
            emailInput.value = email;
            senhaInput.value = senha;
        }
    }
    window.onload = preencherCampos;
    if (window.location.href === "https://cryptoearns.com/") {
        window.location.href = "https://cryptoearns.com/login";
    }
    if (window.location.href === "https://cryptoearns.com/dashboard") {
        window.location.href = "http://linksfly.link/cryptoearns-links";
    }
    function removerCartoes() {
        var cartoes = document.querySelectorAll('div[class="col-lg-6"]');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (
                textoCartao.includes("Rs Short") ||
                textoCartao.includes("Clks") ||
                textoCartao.includes("Clk") ||
                textoCartao.includes("CTR") ||
                textoCartao.includes("Cuty") ||
                textoCartao.includes("FC LC") ||
                textoCartao.includes("Shrinkearn") ||
                textoCartao.includes("Shrinkme") ||
                textoCartao.includes("Coinfays"))
            {
                cartao.remove();
            }
        });
    }
    removerCartoes();
    removerCartoes();
        console.log('Executando sua função principal...');
    }
    const observerConfig = { childList: true, subtree: true };
    function handleDomChanges(mutationsList, observer) {
        if (!isSecureConnectionMessageVisible()) {
            suaFuncaoPrincipal();
            observer.disconnect();
        }
    }
    const observer = new MutationObserver(handleDomChanges);
    observer.observe(document.body, observerConfig);
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


