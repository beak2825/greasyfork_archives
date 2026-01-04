// ==UserScript==
// @name         Upador Otimizado Tribal Wars [Personalizado]
// @namespace    https://seusite.com/
// @version      1.2
// @description  Upa construções iniciais e prioriza recursos com menor estoque. Constrói armazém ou fazenda ao atingir 70% de capacidade. Alternância automática entre vilas no Tribal Wars.
// @author       José Carlos
// @match        https://*.tribalwars.com.br/*screen=main*
// @icon         https://dsbr.innogamescdn.com/asset/b39ce940/graphic/userimage/405447_large
// @grant        none
// @license      MIT
// @locale       pt-BR
// @downloadURL https://update.greasyfork.org/scripts/534948/Upador%20Otimizado%20Tribal%20Wars%20%5BPersonalizado%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/534948/Upador%20Otimizado%20Tribal%20Wars%20%5BPersonalizado%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const Sequência_Construção = [
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

    function getMenorRecurso() {
        const recursos = [
            { tipo: 'wood', valor: parseInt($('#wood').text().replace(/\./g, '')) },
            { tipo: 'stone', valor: parseInt($('#stone').text().replace(/\./g, '')) },
            { tipo: 'iron', valor: parseInt($('#iron').text().replace(/\./g, '')) }
        ];
        return recursos.sort((a, b) => a.valor - b.valor)[0].tipo;
    }

    function armazemCheio() {
        const capacidade = parseInt($('#storage').text().replace(/\./g, ''));
        const madeira = parseInt($('#wood').text().replace(/\./g, ''));
        const argila = parseInt($('#stone').text().replace(/\./g, ''));
        const ferro = parseInt($('#iron').text().replace(/\./g, ''));
        return madeira >= capacidade * 0.7 || argila >= capacidade * 0.7 || ferro >= capacidade * 0.7;
    }

    function fazendaCheia() {
        const usados = parseInt($('#pop_current_label').text().replace(/\./g, ''));
        const total = parseInt($('#pop_max_label').text().replace(/\./g, ''));
        return usados >= total * 0.7;
    }

    function getConstrução_proximo_edificio() {
        const idsNaFila = Array.from(document.querySelectorAll('#buildqueue .lit-item'))
            .map(el => el.getAttribute('data-building'));

        const prioridade = getMenorRecurso();
        const tentativa = [...Sequência_Construção];

        for (let i = 2; i <= 5; i++) tentativa.push(`main_buildlink_${prioridade}_${i}`);
        if (armazemCheio()) tentativa.push('main_buildlink_storage_4', 'main_buildlink_storage_5');
        if (fazendaCheia()) tentativa.push('main_buildlink_farm_3', 'main_buildlink_farm_4');

        for (let id of tentativa) {
            const tipo = id.split('_')[2];
            if (idsNaFila.includes(tipo)) continue;
            const el = document.getElementById(id);
            if (el && el.offsetParent !== null) return el;
        }
        return null;
    }

    function Proxima_Construção() {
        const botao = getConstrução_proximo_edificio();
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
            Proxima_Construção();
            setTimeout(() => {
                document.querySelector('#village_switch_right a')?.click();
            }, 1000);
        } catch (e) {
            console.error('Erro no script:', e);
        }
    }, 500);
})();