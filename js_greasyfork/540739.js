// ==UserScript==
// @name         MedCof - Liberar Teclado e Botão Direito nas Aulas
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Reativa os atalhos de teclado (setas) e o menu de contexto (botão direito) no player de vídeo de aulas.medcof.com.br. Não afeta outros sites da MedCof.
// @author       Seu Nome (ou deixe como está)
// @match        https://aulas.medcof.com.br/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/540739/MedCof%20-%20Liberar%20Teclado%20e%20Bot%C3%A3o%20Direito%20nas%20Aulas.user.js
// @updateURL https://update.greasyfork.org/scripts/540739/MedCof%20-%20Liberar%20Teclado%20e%20Bot%C3%A3o%20Direito%20nas%20Aulas.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Lista de eventos que o site bloqueia e que queremos liberar.
    const eventosBloqueados = [
        'keydown',      // Pressionar tecla
        'keyup',        // Soltar tecla
        'contextmenu'   // Menu do botão direito
    ];

    console.log('[MedCof Liberador] Script ativado para aulas.medcof.com.br');

    // Adicionamos um ouvinte para cada evento problemático.
    // Usamos 'true' para capturar o evento antes que o script da página o faça.
    eventosBloqueados.forEach(nomeEvento => {
        window.addEventListener(nomeEvento, function(event) {
            // event.stopImmediatePropagation() é a função "mágica".
            // Ela impede que outros ouvintes para o mesmo evento (como o do site) sejam executados.
            event.stopImmediatePropagation();
            console.log(`[MedCof Liberador] Evento '${nomeEvento}' foi liberado.`);
        }, true); // O 'true' aqui é crucial, ele ativa o modo de captura.
    });
})();