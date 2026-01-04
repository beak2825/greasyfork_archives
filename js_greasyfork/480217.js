// ==UserScript==
// @name         Conversor de Sites para Wireframe
// @namespace   tampermonkey.org
// @version      1.0
// @description  Converte qualquer site em um wireframe de alta fidelidade para visualização e validação de design.
// @author       Seu Nome
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480217/Conversor%20de%20Sites%20para%20Wireframe.user.js
// @updateURL https://update.greasyfork.org/scripts/480217/Conversor%20de%20Sites%20para%20Wireframe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS para criar o estilo do wireframe
    const wireframeStyle = `
        body {
            background-color: #fff;
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        
        h1 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        p {
            font-size: 16px;
            margin-bottom: 20px;
        }
        
        /* Estilo para remover bordas, cores e outros estilos visuais */
        * {
            border: none !important;
            box-shadow: none !important;
            background-color: transparent !important;
            color: #000 !important;
            font-weight: normal !important;
            text-decoration: none !important;
            outline: none !important;
            cursor: default !important;
        }
        
        /* Estilo para exibir elementos como blocos de texto */
        a, span, div, p, h1, h2, h3, h4, h5, h6, li, ul, ol, dl, dt, dd, table, tr, td, th, tbody, thead, tfoot {
            display: block !important;
        }
        
        /* Estilo para destacar links */
        a {
            background-color: #f1f1f1 !important;
            padding: 5px !important;
            margin-bottom: 10px !important;
        }
        
        /* Estilo para destacar imagens */
        img {
            border: 1px solid #ddd !important;
            padding: 10px !important;
            margin-bottom: 10px !important;
        }
    `;

    // Função para converter o site em wireframe de alta fidelidade
    function converterParaWireframe() {
        // Cria um elemento <style> para aplicar o CSS de wireframe
        const styleElement = document.createElement('style');
        styleElement.innerHTML = wireframeStyle;
        document.head.appendChild(styleElement);

        // Converte todos os elementos da página para wireframe
        const elements = document.body.getElementsByTagName('*');
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            element.removeAttribute('class');
            element.removeAttribute('id');
        }
    }

    // Adicionar um botão para iniciar a conversão
    function adicionarBotaoConverter() {
        const botao = document.createElement('button');
        botao.innerText = 'Converter para Wireframe';
        botao.style.position = 'fixed';
        botao.style.bottom = '20px';
        botao.style.right = '20px';
        botao.style.zIndex = '9999';
        botao.addEventListener('click', converterParaWireframe);
        document.body.appendChild(botao);
    }

    // Aguarda o carregamento completo da página antes de adicionar o botão
    window.addEventListener('load', adicionarBotaoConverter);
})();