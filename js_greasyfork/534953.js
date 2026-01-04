// ==UserScript==
// @name         Upador 5
// @namespace    https://seusite.com/
// @version      3.0
// @description  Evolui construções iniciais fixas. Depois, prioriza o recurso com menor nível de evolução e constrói armazém/fazenda quando cheios. Alterna automaticamente entre vilas no Tribal Wars.
// @author       José Carlos
// @match        https://*.tribalwars.com.br/*screen=main*
// @icon         https://dsbr.innogamescdn.com/asset/b39ce940/graphic/userimage/405447_large
// @grant        none
// @license      MIT
// @locale       pt-BR
// @downloadURL https://update.greasyfork.org/scripts/534953/Upador%205.user.js
// @updateURL https://update.greasyfork.org/scripts/534953/Upador%205.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sequenciaInicial = [
        "main_buildlink_wood_1", "main_buildlink_stone_1", "main_buildlink_iron_1",
        "main_buildlink_wood_2", "main_buildlink_stone_2", "main_buildlink_main_2",
        "main_buildlink_main_3", "main_buildlink_barracks_1", "main_buildlink_wood_3",
        "main_buildlink_stone_3", "main_buildlink_barracks_2", "main_buildlink_storage_2",
        "main_buildlink_iron_2", "main_buildlink_storage_3", "main_buildlink_barracks_3",
        "main_buildlink_statue_1", "main_buildlink_farm_2", "main_buildlink_iron_3",
        "main_buildlink_main_4", "main_buildlink_main_5", "main_buildlink_smith_1",
        "main_buildlink_wood_4", "main_buildlink_stone_4", "main_buildlink_wall_1",
        "main_buildlink_hide_2", "main_buildlink_hide_3", "main_buildlink_wood_5",
        "main_buildlink_stone_5", "main_buildlink_market_1", "main_buildlink_wood_6",
        "main_buildlink_stone_6", "main_buildlink_wood_7", "main_buildlink_stone_7",
        "main_buildlink_iron_4", "main_buildlink_iron_5", "main_buildlink_iron_6",
        "main_buildlink_wood_8", "main_buildlink_stone_8", "main_buildlink_iron_7",
        "main_buildlink_wood_9", "main_buildlink_stone_9", "main_buildlink_wood_10",
        "main_buildlink_stone_10"
    ];

    const requisitos = {
        main: 5, barracks: 3, storage: 3, smith: 1, market: 1, statue: 1,
        wall: 1, hide: 3, farm: 2, wood: 10, stone: 10, iron: 7
    };

    function nivelPredio(predio) {
        const el = document.querySelector(`#buildings tr[data-building='${predio}'] span.level`);
        if (!el) return 0;
        const match = el.textContent.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    }

    function inicialConcluida() {
        return sequenciaInicial.every(id => {
            const tipo = id.split('_')[2];
            const nivel = parseInt(id.split('_')[3]);
            return nivelPredio(tipo) >= nivel;
        });
    }

    function armazemCheio() {
        const cap = parseInt($('#storage').text().replace(/\./g, ''));
        return [$('#wood'), $('#stone'), $('#iron')].some(r => parseInt(r.text().replace(/\./g, '')) >= cap * 0.7);
    }

    function fazendaCheia() {
        const atual = parseInt($('#pop_current_label').text().replace(/\./g, ''));
        const total = parseInt($('#pop_max_label').text().replace(/\./g, ''));
        return atual >= total * 0.7;
    }

    function filaOcupada(id) {
        return Array.from(document.querySelectorAll('#buildqueue .lit-item'))
            .some(el => id.includes(el.getAttribute('data-building')));
    }

    function proximoDaFila() {
        if (!inicialConcluida()) {
            for (let id of sequenciaInicial) {
                if (filaOcupada(id)) continue;
                const el = document.getElementById(id);
                if (el && el.offsetParent !== null) return el;
            }
            return null;
        }

        const recursos = [
            { tipo: 'wood', nivel: nivelPredio('wood') },
            { tipo: 'stone', nivel: nivelPredio('stone') },
            { tipo: 'iron', nivel: nivelPredio('iron') }
        ].sort((a, b) => a.nivel - b.nivel);

        for (let r of recursos) {
            const prox = r.nivel + 1;
            const id = `main_buildlink_${r.tipo}_${prox}`;
            if (requisitos[r.tipo] && prox > requisitos[r.tipo]) continue;
            if (filaOcupada(id)) continue;
            const el = document.getElementById(id);
            if (el && el.offsetParent !== null) return el;
        }

        if (armazemCheio()) {
            for (let i = 4; i <= 5; i++) {
                const id = `main_buildlink_storage_${i}`;
                const el = document.getElementById(id);
                if (el && el.offsetParent !== null && !filaOcupada(id)) return el;
            }
        }

        if (fazendaCheia()) {
            for (let i = 3; i <= 4; i++) {
                const id = `main_buildlink_farm_${i}`;
                const el = document.getElementById(id);
                if (el && el.offsetParent !== null && !filaOcupada(id)) return el;
            }
        }

        return null;
    }

    function tentarConstruir() {
        const botao = proximoDaFila();
        if (botao) botao.click();
    }

    setInterval(() => {
        try {
            const tr = document.querySelector('#buildqueue tr:nth-child(2)');
            if (tr) {
                const tempo = tr.querySelector('td:nth-child(2)')?.textContent.trim();
                if (tempo) {
                    const [h, m, s] = tempo.split(':').map(Number);
                    if ((h * 3600 + m * 60 + s) < 180) {
                        tr.querySelector('td:nth-child(3) a:nth-child(3)')?.click();
                    }
                }
            }
            document.querySelector('.btn.btn-confirm-yes')?.click();
            tentarConstruir();
            setTimeout(() => document.querySelector('#village_switch_right a')?.click(), 1000);
        } catch (e) {
            console.error('Erro no script:', e);
        }
    }, 500);
})();
