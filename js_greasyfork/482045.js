// ==UserScript==
// @name         Copiar Scripts
// @namespace    http://tampermonkey.net/
// @copyright    Kenite-Kelve (Ken-devs) 2023
// @version      0.5
// @description  Adiciona um botão de cópia bonito abaixo da borda direita da tela (feito Por kenite-kelve)
// @author       Kenite-Kelve
// @match        https://greasyfork.org/*/scripts/*/code
// @license      Todos os direitos reservados
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/482045/Copiar%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/482045/Copiar%20Scripts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para criar e estilizar o botão
    function createCopyButton() {
        const copyButton = document.createElement('button');
        copyButton.innerHTML = 'Copy';
        copyButton.style.position = 'fixed';
        copyButton.style.padding = '5px 10px'; // Maior altura e largura do botão
        copyButton.style.backgroundColor = '#4CAF50'; // Cor verde (pode ser ajustada)
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '8px'; // Borda mais arredondada
        copyButton.style.cursor = 'pointer';
        copyButton.style.zIndex = '9999';
        copyButton.style.transition = 'all 0.3s ease';

        // Adicione estilos personalizados ao botão (opcional)
        GM_addStyle(`
            /* Adicione estilos adicionais aqui */
        `);

        // Adicione o botão ao corpo do documento
        document.body.appendChild(copyButton);

        return copyButton;
    }

    // Função para mover o botão para a posição desejada
    function moveButton(button, direction, offset) {
        switch (direction) {
            case 'top':
                button.style.top = offset + 'px';
                break;
            case 'bottom':
                button.style.bottom = offset + 'px';
                break;
            case 'left':
                button.style.left = offset + 'px';
                break;
            case 'right':
                button.style.right = offset + 'px';
                break;
        }
    }

    const copyButton = createCopyButton();

    // Adicione um evento de clique ao botão
    copyButton.addEventListener('click', function() {
        // Encontre o elemento com a classe "code-container"
        const codeContainer = document.querySelector('.code-container');

        // Verifique se o elemento existe
        if (codeContainer) {
            // Crie um intervalo para selecionar e copiar o texto
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(codeContainer);
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');
            selection.removeAllRanges();

            // Você pode adicionar uma mensagem ou efeito visual para indicar que o texto foi copiado
            alert('Texto copiado com sucesso!');
        } else {
            alert('Scripts não encontrado!.');
        }
    });

    // Configure a posição inicial do botão (você pode ajustar isso)
    moveButton(copyButton, 'bottom', 304);
   moveButton(copyButton, 'right', 110);

})();
