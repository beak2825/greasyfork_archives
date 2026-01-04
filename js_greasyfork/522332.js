// ==UserScript==
// @name         wiTECH Métrico
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Define automaticamente o site do wiTECH para unidade de medida métrica, língua portuguesa, tema escuro e insere o código da concessionária automaticamente (configurável pelo usuário diretamente no script).
// @author       Igor Lima
// @match        https://app.l.fcawitech.com/wt2/auth/login.html
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522332/wiTECH%20M%C3%A9trico.user.js
// @updateURL https://update.greasyfork.org/scripts/522332/wiTECH%20M%C3%A9trico.meta.js
// ==/UserScript==
/* eslint-disable no-multi-spaces */

/*
    Este código foi gerado por um modelo de IA. Embora tenha sido projetado para ser funcional,
    pode ser necessário realizar uma revisão, testes ou modificações para atender às suas necessidades específicas.
    Verifique o código quanto à correção e adequação antes de utilizá-lo em ambientes de produção.
*/

// CONFIGURAÇÕES DO USUÁRIO
const CONFIG = {
    // Código da concessionária - Altere para o seu código
    dealerCode: '123456789',

    // Sistema de unidades a ser utilizado (1 = Imperial, 2 = Métrico)
    units: 2,

    // Idioma (pt-BR = Português Brasil)
    locale: 'pt-BR',

    // Tema (0 = Modo claro, 1 = Modo escuro)
    cssTheme: 1,

    // Ativar mudança automática para Link-E-Entry-Prod (true = sim, false = não)
    enableEnvironmentChange: true
};

(function() {
    'use strict';

    // Função para obter valor de um cookie
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Função para definir cookies com domínio específico
    function setCookie(name, value) {
        document.cookie = `${name}=${value}; path=/; domain=.app.l.fcawitech.com`;
    }

    // Função para verificar se os cookies precisam ser atualizados
    function verificarCookies() {
        const cookiesAtuais = {
            units: getCookie('units'),
            locale: getCookie('locale'),
            cssTheme: getCookie('cssTheme')
        };

        let precisaAtualizar = false;

        // Verificar cada cookie
        if (cookiesAtuais.units !== CONFIG.units.toString()) {
            setCookie('units', CONFIG.units);
            precisaAtualizar = true;
            console.log('Cookie units atualizado');
        }
        if (cookiesAtuais.locale !== CONFIG.locale) {
            setCookie('locale', CONFIG.locale);
            precisaAtualizar = true;
            console.log('Cookie locale atualizado');
        }
        if (cookiesAtuais.cssTheme !== CONFIG.cssTheme.toString()) {
            setCookie('cssTheme', CONFIG.cssTheme);
            precisaAtualizar = true;
            console.log('Cookie cssTheme atualizado');
        }

        return precisaAtualizar;
    }

    // Função para verificar se as opções do ambiente estão carregadas
    function verificarOpcoesAmbiente(campoAmbiente) {
        const opcoes = Array.from(campoAmbiente.options);
        const opcaoAlvo = opcoes.find(opcao => opcao.text === 'Link-E-Entry-Prod');
        return opcaoAlvo !== undefined;
    }

    // Função para tentar configurar o ambiente
    function configurarAmbiente(campoAmbiente, tentativas = 0, maxTentativas = 20) {
        if (tentativas >= maxTentativas) {
            console.log('Tempo limite excedido ao tentar configurar o ambiente');
            return;
        }

        if (verificarOpcoesAmbiente(campoAmbiente)) {
            const opcoes = Array.from(campoAmbiente.options);
            const opcaoAlvo = opcoes.find(opcao => opcao.text === 'Link-E-Entry-Prod');
            campoAmbiente.value = opcaoAlvo.value;
            campoAmbiente.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('Ambiente configurado com sucesso');
        } else {
            console.log(`Tentativa ${tentativas + 1}: Opções do ambiente ainda não carregadas...`);
            setTimeout(() => configurarAmbiente(campoAmbiente, tentativas + 1, maxTentativas), 500);
        }
    }

    // Função para preencher os campos do formulário
    function preencherFormulario() {
        // Aguardar elementos estarem disponíveis
        const verificarElementos = setInterval(() => {
            const campoCodigo = document.getElementById('dealerCodeInput');
            const campoAmbiente = document.getElementById('env');

            if (campoCodigo && campoAmbiente) {
                clearInterval(verificarElementos);

                // Preencher código do revendedor
                campoCodigo.value = CONFIG.dealerCode;
                // Disparar eventos de mudança
                campoCodigo.dispatchEvent(new Event('input', { bubbles: true }));
                campoCodigo.dispatchEvent(new Event('change', { bubbles: true }));

                // Configurar ambiente se habilitado
                if (CONFIG.enableEnvironmentChange) {
                    configurarAmbiente(campoAmbiente);
                }
            }
        }, 300); // Verificar a cada 300ms
    }

    // Execução principal
    const cookiesAtualizados = verificarCookies();

    if (cookiesAtualizados) {
        console.log('Cookies foram atualizados, recarregando página...');
        window.location.reload();
    } else {
        console.log('Cookies já estão corretos, preenchendo formulário...');
        preencherFormulario();
    }
})();