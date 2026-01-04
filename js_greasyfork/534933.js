// ==UserScript==
// @name                Tribal Wars Auto Edifícios
// @namespace           Scripts Villanova
// @version             1.0
// @description         Automatiza a construção de edifícios de recursos (madeira, argila e ferro), priorizando o recurso com menor estoque. Alterna automaticamente entre vilas e evita repetições na fila de construção. Armazém e fazenda são construídos somente se atingirem 90% da capacidade. Compatível com GreasyFork.
// @author             Kronos
// @icon               https://dsbr.innogamescdn.com/asset/b39ce940/graphic/userimage/405447_large
// @include            https://*.tribalwars.com.*/game.php?*&screen=main*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/534933/Tribal%20Wars%20Auto%20Edif%C3%ADcios.user.js
// @updateURL https://update.greasyfork.org/scripts/534933/Tribal%20Wars%20Auto%20Edif%C3%ADcios.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const intervalo = 500;

    function getEstoqueRecursos() {
        return ['wood', 'stone', 'iron'].map(id => parseInt(document.getElementById(`res_${id}`).textContent.replace(/\D/g, '')));
    }

    function getCapacidadeArmazem() {
        return parseInt(document.getElementById('storage').textContent.replace(/\D/g, ''));
    }

    function getCapacidadePovoacao() {
        const [usados, total] = document.querySelector('#pop_bar .box-content').textContent.match(/\d+/g).map(Number);
        return { usados, total };
    }

    function filaConstrucoes() {
        return Array.from(document.querySelectorAll('#buildqueue a'))
            .map(a => a.href.match(/id=(\w+)/))
            .filter(Boolean)
            .map(m => m[1]);
    }

    function getNivelAtual(id) {
        const el = document.querySelector(`#${id} .level`);
        return el ? parseInt(el.textContent.replace(/\D/g, '')) : 0;
    }

    function getConstrução_proximo_edificio() {
        const fila = filaConstrucoes();
        const recursos = getEstoqueRecursos();
        const menor = ['wood', 'stone', 'iron'][recursos.indexOf(Math.min(...recursos))];

        const predios = [
            { id: menor, max: 30 },
            { id: 'main', max: 5 },
            { id: 'storage', cond: () => getEstoqueRecursos().some(r => r >= 0.9 * getCapacidadeArmazem()) },
            { id: 'farm', cond: () => getCapacidadePovoacao().usados >= 0.9 * getCapacidadePovoacao().total }
        ];

        for (let p of predios) {
            if (fila.includes(p.id)) continue;
            if (p.max && getNivelAtual(p.id) >= p.max) continue;
            if (p.cond && !p.cond()) continue;

            const botao = document.querySelector(`#${p.id} .btn-build`);
            if (botao && botao.offsetParent !== null && !botao.disabled) {
                return botao;
            }
        }
        return null;
    }

    function proximaVila() {
        const el = document.querySelector('#village_switch_right a');
        if (el) el.click();
    }

    function tentarConstruir() {
        const botao = getConstrução_proximo_edificio();
        if (botao) botao.click();
        else proximaVila();
    }

    setInterval(tentarConstruir, intervalo);
})();
