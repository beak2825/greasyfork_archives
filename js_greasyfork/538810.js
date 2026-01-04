// ==UserScript==
// @name         Browser - Mouse Enchancer
// @version      1.2
// @description  Avança/volta página ao arrastar com botão direito. Direita->Avançar, Esquerda->Voltar. Sem menu de contexto após arrastar.
// @author       Rocymar Júnior & Gemini
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1464973
// @downloadURL https://update.greasyfork.org/scripts/538810/Browser%20-%20Mouse%20Enchancer.user.js
// @updateURL https://update.greasyfork.org/scripts/538810/Browser%20-%20Mouse%20Enchancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRightMouseDown = false;
    let startX = 0;
    const DRAG_THRESHOLD = 50; // Distância mínima em pixels para considerar um arrasto de navegação
    const MOUSEMOVE_THRESHOLD_FOR_DRAG_DETECTION = 10; // Distância mínima para considerar que um "arrasto" começou

    // Flag para indicar se o mouse foi arrastado (mesmo que um pouco)
    // desde que o botão direito foi pressionado.
    let hasDraggedSinceMouseDown = false;

    // Listener para o evento 'contextmenu'
    window.addEventListener('contextmenu', function(event) {
        // Se 'hasDraggedSinceMouseDown' for true, significa que o usuário
        // moveu o mouse com o botão direito pressionado.
        // Nesse caso, prevenimos o menu de contexto.
        // Isso cobre tanto o caso de um arrasto que resultou em navegação
        // quanto um arrasto curto que não resultou em navegação.
        if (hasDraggedSinceMouseDown) {
            event.preventDefault();
        }
        // Se 'hasDraggedSinceMouseDown' for false, foi um clique simples com o botão direito,
        // então o menu de contexto padrão poderá aparecer.
    }, true); // Use capturing phase

    // Listener para o evento 'mousedown'
    window.addEventListener('mousedown', function(event) {
        // Botão direito do mouse (event.button === 2)
        if (event.button === 2) {
            isRightMouseDown = true;
            startX = event.clientX;
            hasDraggedSinceMouseDown = false; // Reseta a flag no início de cada interação
        }
    }, true); // Use capturing phase

    // Listener para o evento 'mousemove'
    window.addEventListener('mousemove', function(event) {
        if (isRightMouseDown) {
            // Se o botão direito está pressionado e o mouse se moveu o suficiente,
            // marca que um arrasto ocorreu.
            if (!hasDraggedSinceMouseDown && Math.abs(event.clientX - startX) > MOUSEMOVE_THRESHOLD_FOR_DRAG_DETECTION) {
                hasDraggedSinceMouseDown = true;
            }

            // Se um arrasto está ocorrendo, previne a seleção de texto.
            if (hasDraggedSinceMouseDown) {
                event.preventDefault();
            }
        }
    }, true); // Use capturing phase

    // Listener para o evento 'mouseup'
    window.addEventListener('mouseup', function(event) {
        if (event.button === 2 && isRightMouseDown) {
            const endX = event.clientX;
            const deltaX = endX - startX;

            // Importante: Reseta o estado de 'isRightMouseDown'
            // independentemente de ter havido navegação ou não.
            isRightMouseDown = false;

            // Verifica se o arrasto foi longo o suficiente para acionar a navegação
            if (Math.abs(deltaX) > DRAG_THRESHOLD) {
                // Se um gesto de navegação foi realizado, 'hasDraggedSinceMouseDown' já será true.
                // O listener 'contextmenu' usará essa flag para prevenir o menu.
                // Além disso, chamamos preventDefault() aqui no mouseup para garantir
                // que o menu de contexto disparado por este mouseup seja cancelado.
                event.preventDefault(); // Essencial para suprimir o menu após um arrasto de navegação

                if (deltaX > DRAG_THRESHOLD) {
                    // Arrastou para a direita
                    console.log('Gesture: Forward');
                    window.history.forward();
                } else if (deltaX < -DRAG_THRESHOLD) {
                    // Arrastou para a esquerda
                    console.log('Gesture: Back');
                    window.history.back();
                }
            }
            // Se o arrasto não foi longo o suficiente para navegação (deltaX <= DRAG_THRESHOLD):
            // - Se 'hasDraggedSinceMouseDown' for true (houve um pequeno arrasto),
            //   o listener 'contextmenu' vai prevenir o menu.
            // - Se 'hasDraggedSinceMouseDown' for false (foi um clique sem movimento),
            //   o listener 'contextmenu' não vai prevenir, e o menu aparecerá.

            // 'hasDraggedSinceMouseDown' mantém seu valor (true se arrastou, false se apenas clicou)
            // para ser usado pelo listener 'contextmenu'. Ele será resetado no próximo 'mousedown'.
        }
    }, true); // Use capturing phase

    // Listener para o evento 'mouseleave' (quando o mouse sai da janela)
    window.addEventListener('mouseleave', function(event) {
        if (isRightMouseDown) {
            // Se o mouse sair da janela com o botão direito pressionado,
            // reseta o estado para evitar comportamento inesperado.
            isRightMouseDown = false;
            // 'hasDraggedSinceMouseDown' manterá seu valor. Se o usuário arrastou para fora,
            // e o 'contextmenu' disparar por algum motivo (improvável), ele será prevenido.
        }
    }, true); // Use capturing phase

})();