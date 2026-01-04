// ==UserScript==
// @name         Dublanet Lastpost (Tema DublaNOVO)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Transforma últimos posts em hyperlinks
// @author       Brenda
// @match        https://www.dublanet.com.br/comunidade/forumdisplay.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537676/Dublanet%20Lastpost%20%28Tema%20DublaNOVO%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537676/Dublanet%20Lastpost%20%28Tema%20DublaNOVO%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Selecionar todos os tópicos
    document.querySelectorAll('.card').forEach(card => {
        // Achar o tid
        const threadLink = card.querySelector('a[href*="showthread.php?tid="]');
        if (!threadLink) return;

        const tidMatch = threadLink.href.match(/tid=(\d+)/);
        if (!tidMatch) return;

        const tid = tidMatch[1];
        const lastpostUrl = `showthread.php?tid=${tid}&action=lastpost`;

        // Achar os elementos pra linkar
        const dateSpans = card.querySelectorAll('span.small.text-muted, span[title*="horas"], span[title*="Ontem"]');

        dateSpans.forEach(span => {
            // Não duplicar links
            if (span.closest('a')) return;

            const link = document.createElement('a');
            link.href = lastpostUrl;
            link.style.textDecoration = 'underline dotted';
            link.title = 'Ir para a última mensagem';
            link.appendChild(span.cloneNode(true));
            span.replaceWith(link);
        });
    });
})();
