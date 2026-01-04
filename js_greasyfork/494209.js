// ==UserScript==
// @name         faucetcrypto.net
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Faucet claim
// @author       Gysof
// @match        https://faucetcrypto.net/*
// @icon         https://faucetcrypto.net/assets/images/logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494209/faucetcryptonet.user.js
// @updateURL https://update.greasyfork.org/scripts/494209/faucetcryptonet.meta.js
// ==/UserScript==

// Register here - https://faucetcrypto.net/?r=26109
// You will need hcaptcha solver - https://chromewebstore.google.com/detail/captcha-solver-auto-hcapt/hlifkpholllijblknnmbfagnkjneagid
// You will need AB Links Solver - I recommend mbsolver
// Editar email e pass linha 23 - 24

(async function() {
    'use strict';

    // Editar o email e a senha
    const email = 'Email@Aqui'; // Substitua com seu email
    const senha = 'SenhaAqui'; // Substitua com sua senha

    const redirecionarPagina = () => {
        const url = window.location.href;

        if (url === 'https://faucetcrypto.net/' || url === 'https://faucetcrypto.net/#hero') {
            window.location.href = 'https://faucetcrypto.net/login';
        } else if (url === 'https://faucetcrypto.net/dashboard') {
            window.location.href = 'https://faucetcrypto.net/faucet';
        }
    };

    function esperarPaginaCarregar(callback) {
        if (document.readyState === 'complete') {
            callback();
        } else {
            window.addEventListener('load', callback);
        }
    }

    const esperarElemento = async (seletor) => {
        while (!document.querySelector(seletor)) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
        return document.querySelector(seletor);
    };

    const esperarConclusaoHcaptcha = async () => {
        while (!(grecaptcha && grecaptcha.getResponse().length > 0)) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    const verificarHcaptcha = async () => {
        while (!(grecaptcha && grecaptcha.getResponse().length > 0)) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.log("hcaptcha concluído.");
    };

    const verificarAntibotlinks = () => {
        const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
        return valorAntibotlinks.length === 12;
    };

    const clicarBotaoReivindicar = () => {
        const botaoReivindicar = document.querySelector('button.btn.btn-primary.btn-lg.claim-button');
        if (botaoReivindicar) {
            botaoReivindicar.click();
            console.log("Botão 'claim' clicado.");
        } else {
            console.log("Botão 'claim' não encontrado.");
        }
    };

    const clicarBotaoUnlock = () => {
        const botaoUnlock = document.querySelector('.btn.btn-primary.w-md');
        if (botaoUnlock) {
            botaoUnlock.click();
            console.log("Botão 'unlock' clicado.");
        } else {
            console.log("Botão 'unlock' não encontrado.");
        }
    };

    const lidarPaginaFaucet = async () => {

        await new Promise(resolve => setTimeout(resolve, 3000));

        await verificarHcaptcha();

        const intervaloVerificacao = 1000;
        setInterval(async function() {
            if (verificarAntibotlinks()) {
                clicarBotaoReivindicar();
            } else {
                console.log("Aguardando a conclusão do hcaptcha para reivindicar.");
                await verificarHcaptcha();
            }
        }, intervaloVerificacao);
    };

    const esperarBotaoLogin = async () => {
        let tentativas = 0;
        const maxTentativas = 30;
        const intervalo = 1000;

        const detectarBotao = async () => {
            const botaoLogin = document.querySelector('button.btn.btn-primary.btn-block.waves-effect.waves-light');
            if (botaoLogin) {
                botaoLogin.click();
                console.log("Botão de login encontrado e clicado.");
            } else {
                tentativas++;
                if (tentativas < maxTentativas) {
                    console.log("Tentativa " + tentativas + ": Botão de login não encontrado. Tentando novamente em " + intervalo + "ms...");
                    setTimeout(detectarBotao, intervalo);
                } else {
                    console.log("Limite de tentativas excedido. O botão de login não pôde ser encontrado.");
                }
            }
        };

        await detectarBotao();
    };

    const preencherCampos = async () => {
        const [campoEmail, campoSenha] = await Promise.all([esperarElemento('#email'), esperarElemento('#password')]);

        if (campoEmail && campoSenha) {
            campoEmail.value = email;
            campoSenha.value = senha;

            await esperarConclusaoHcaptcha();

            await esperarBotaoLogin();
        }
    };

    const lidarPaginaFirewall = async () => {
        const intervaloVerificacao = 1000;
        setInterval(async function() {
            const hcaptchaConcluido = await verificarConclusaoCaptcha();
            if (hcaptchaConcluido) {
                clicarBotaoUnlock();
            }
        }, intervaloVerificacao);
    };

    const verificarConclusaoCaptcha = async () => {
        while (true) {
            if (document.querySelector('.g-recaptcha') && window.grecaptcha.getResponse().length > 0) {
                return true;
            } else if (document.querySelector('.h-captcha') && document.querySelector('.h-captcha').getAttribute('data-hcaptcha-response')) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    };

    const executarScript = async () => {
        redirecionarPagina();

        if (window.location.href.includes('https://faucetcrypto.net/login')) {
            await preencherCampos();
        } else if (window.location.href.includes('https://faucetcrypto.net/faucet')) {
            await lidarPaginaFaucet();
        } else if (window.location.href.includes('https://faucetcrypto.net/firewall')) {
            await lidarPaginaFirewall();
        }
    };

    esperarPaginaCarregar(async function() {
        await executarScript();
    });

    setInterval(function() {
        location.reload();
    }, 600000);

})();
