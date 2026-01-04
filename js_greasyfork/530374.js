// ==UserScript==
// @name         Mostrar Senha Dealernet
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adiciona um botão que enquanto pressionado, mostra a senha digitada.
// @match        http*://*.dealernetworkflow.com.br/LoginAux.aspx*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530374/Mostrar%20Senha%20Dealernet.user.js
// @updateURL https://update.greasyfork.org/scripts/530374/Mostrar%20Senha%20Dealernet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para adicionar o botão de alternância
    function adicionarAlternadorSenha() {
        // Encontra o campo de senha específico
        let campoSenha = document.getElementById('vUSUARIOSENHA_SENHA');

        // Se o campo não existir nesta página, saia
        if (!campoSenha) return;

        // Criar o ícone do olho usando SVG
        const iconeOlho = document.createElement('span');
        iconeOlho.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="18" height="18">
            <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
        </svg>`;
        iconeOlho.style.cssText = `
            position: absolute;
            right: 10px;
            top: 52%;
            transform: translateY(-50%);
            cursor: pointer;
            user-select: none;
            z-index: 1000;
            display: flex;
            align-items: center;
        `;

        // Obter o elemento TD pai
        const tdPai = campoSenha.parentElement;

        // Definir o TD para posicionamento relativo
        tdPai.style.position = 'relative';

        // Adicionar o ícone do olho ao TD
        tdPai.appendChild(iconeOlho);

        // Armazenar estado original
        let tipoOriginal = campoSenha.type;
        let classesOriginais = campoSenha.className;

        // Rastrear estado de visibilidade
        let estaVisivel = false;

        // Função para mostrar a senha
        function mostrarSenha() {
            if (estaVisivel) return;
            estaVisivel = true;

            // Armazenar valor atual
            const valorAtual = campoSenha.value;

            // Armazenar propriedades do campo
            const propriedadesCampo = {
                id: campoSenha.id,
                nome: campoSenha.name,
                tamanho: campoSenha.size,
                comprimentoMaximo: campoSenha.maxLength,
                estilo: campoSenha.style.cssText,
                aoFocar: campoSenha.onfocus,
                aoDesfocar: campoSenha.onblur,
                aoMudar: campoSenha.onchange
            };

            // Remover campo antigo
            campoSenha.remove();

            // Criar novo campo
            const novoCampo = document.createElement('input');
            novoCampo.type = 'text';
            novoCampo.id = propriedadesCampo.id;
            novoCampo.name = propriedadesCampo.nome;
            novoCampo.value = valorAtual;
            novoCampo.size = propriedadesCampo.tamanho;
            novoCampo.maxLength = propriedadesCampo.comprimentoMaximo;
            novoCampo.className = classesOriginais.replace('InputPassword', 'InputText');
            novoCampo.style.cssText = propriedadesCampo.estilo;
            novoCampo.onfocus = propriedadesCampo.aoFocar;
            novoCampo.onblur = propriedadesCampo.aoDesfocar;
            novoCampo.onchange = propriedadesCampo.aoMudar;

            // Inserir novo campo
            tdPai.insertBefore(novoCampo, iconeOlho);

            // Atualizar referência
            campoSenha = novoCampo;

            // Estilizar o ícone do olho
            iconeOlho.style.opacity = '0.7';
            iconeOlho.title = 'Solte para esconder a senha';

            // Reaplicar atributo autocomplete="off"
            if (typeof gx !== 'undefined' && gx.dom) {
                gx.dom.setAttribute(campoSenha.id, "autocomplete", "off");
            }
        }

        // Função para esconder a senha
        function esconderSenha() {
            if (!estaVisivel) return;
            estaVisivel = false;

            // Armazenar valor atual
            const valorAtual = campoSenha.value;

            // Armazenar propriedades do campo
            const propriedadesCampo = {
                id: campoSenha.id,
                nome: campoSenha.name,
                tamanho: campoSenha.size,
                comprimentoMaximo: campoSenha.maxLength,
                estilo: campoSenha.style.cssText,
                aoFocar: campoSenha.onfocus,
                aoDesfocar: campoSenha.onblur,
                aoMudar: campoSenha.onchange
            };

            // Remover campo antigo
            campoSenha.remove();

            // Criar novo campo
            const novoCampo = document.createElement('input');
            novoCampo.type = 'password';
            novoCampo.id = propriedadesCampo.id;
            novoCampo.name = propriedadesCampo.nome;
            novoCampo.value = valorAtual;
            novoCampo.size = propriedadesCampo.tamanho;
            novoCampo.maxLength = propriedadesCampo.comprimentoMaximo;
            novoCampo.className = classesOriginais;
            novoCampo.style.cssText = propriedadesCampo.estilo;
            novoCampo.onfocus = propriedadesCampo.aoFocar;
            novoCampo.onblur = propriedadesCampo.aoDesfocar;
            novoCampo.onchange = propriedadesCampo.aoMudar;

            // Inserir novo campo
            tdPai.insertBefore(novoCampo, iconeOlho);

            // Atualizar referência
            campoSenha = novoCampo;

            // Estilizar o ícone do olho
            iconeOlho.style.opacity = '1';
            iconeOlho.title = 'Mantenha pressionado para ver a senha';

            // Reaplicar atributo autocomplete="off"
            if (typeof gx !== 'undefined' && gx.dom) {
                gx.dom.setAttribute(campoSenha.id, "autocomplete", "off");
            }
        }

        // Adicionar event listeners de mousedown e mouseup ao ícone do olho
        iconeOlho.addEventListener('mousedown', function(e) {
            e.preventDefault(); // Prevenir seleção de texto
            mostrarSenha();
        });

        iconeOlho.addEventListener('mouseup', esconderSenha);
        iconeOlho.addEventListener('mouseleave', esconderSenha);

        // Para dispositivos touch
        iconeOlho.addEventListener('touchstart', function(e) {
            e.preventDefault();
            mostrarSenha();
        });

        iconeOlho.addEventListener('touchend', esconderSenha);
        iconeOlho.addEventListener('touchcancel', esconderSenha);

        // Definir título inicial
        iconeOlho.title = 'Mantenha pressionado para ver a senha';
    }

    // Função para verificar e adicionar o alternador repetidamente
    function verificarEAdicionarAlternador() {
        const campoSenha = document.getElementById('vUSUARIOSENHA_SENHA');
        if (campoSenha) {
            // Verificar se já adicionamos o ícone do olho
            const tdPai = campoSenha.parentElement;
            if (tdPai && !tdPai.querySelector('span[title="Mantenha pressionado para ver a senha"]') &&
                !tdPai.querySelector('span[title="Solte para esconder a senha"]')) {
                adicionarAlternadorSenha();
            }
        }
    }

    // Executar o script após a página ser carregada
    window.addEventListener('load', verificarEAdicionarAlternador);

    // Também tentar executá-lo quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', verificarEAdicionarAlternador);

    // Para páginas que carregam conteúdo dinamicamente, verificar periodicamente
    setInterval(verificarEAdicionarAlternador, 1000);
})();