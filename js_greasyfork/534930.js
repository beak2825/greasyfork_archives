// ==UserScript==
// @name         Upador Otimizado Tribal Wars
// @namespace    https://seusite.com/
// @version      1.1
// @description  Automatiza evolução de recursos no Tribal Wars com fluidez, alternando vilas e priorizando madeira, argila e ferro de forma inteligente.
// @author       SeuNome
// @match        https://*.tribalwars.com.br/*screen=main*
// @icon         https://dsbr.innogamescdn.com/asset/b39ce940/graphic/userimage/405447_large
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534930/Upador%20Otimizado%20Tribal%20Wars.user.js
// @updateURL https://update.greasyfork.org/scripts/534930/Upador%20Otimizado%20Tribal%20Wars.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const Construção_Edificios_Ordem = true;

    function getConstrução_Edifcios_Serie() {
        var Sequência_Construção = [];

        const madeiraAtual = parseInt($('#wood').text().replace(/\./g, ''));
        const argilaAtual = parseInt($('#stone').text().replace(/\./g, ''));
        const ferroAtual = parseInt($('#iron').text().replace(/\./g, ''));
        const armazemCapacidade = parseInt($('#storage').text().replace(/\./g, ''));
        const populacaoUsada = parseInt($('#pop_current_label').text().replace(/\./g, ''));
        const populacaoTotal = parseInt($('#pop_max_label').text().replace(/\./g, ''));

        const armazemCheio = (
            madeiraAtual >= armazemCapacidade * 0.9 ||
            argilaAtual >= armazemCapacidade * 0.9 ||
            ferroAtual >= armazemCapacidade * 0.9
        );
        const fazendaCheia = populacaoUsada >= populacaoTotal * 0.9;

        const recursosOrdenados = [
            { tipo: 'wood', valor: madeiraAtual },
            { tipo: 'stone', valor: argilaAtual },
            { tipo: 'iron', valor: ferroAtual }
        ].sort((a, b) => a.valor - b.valor);

        for (let i = 1; i <= 30; i++) {
            recursosOrdenados.forEach(recurso => {
                Sequência_Construção.push(`main_buildlink_${recurso.tipo}_${i}`);
            });
        }

        for (let i = 2; i <= 5; i++) {
            Sequência_Construção.push(`main_buildlink_main_${i}`);
        }

        if (armazemCheio) {
            for (let i = 2; i <= 5; i++) {
                Sequência_Construção.push(`main_buildlink_storage_${i}`);
            }
        }

        if (fazendaCheia) {
            for (let i = 2; i <= 5; i++) {
                Sequência_Construção.push(`main_buildlink_farm_${i}`);
            }
        }

        return Sequência_Construção;
    }

    function getConstrução_proximo_edificio() {
        const elementos = Array.from(document.querySelectorAll(".btn-build"));
        for (const el of elementos) {
            if (el.offsetParent !== null && !el.classList.contains("disabled")) {
                return el;
            }
        }
        return undefined;
    }

    function Proxima_Construção() {
        let botao = getConstrução_proximo_edificio();
        if (botao) {
            botao.click();
            console.log("Clique efetuado em:", botao);
        }
    }

    setInterval(function () {
        let tempoFila = $('#buildqueue').find('tr').eq(1).find('td').eq(1).text().trim();

        if (tempoFila) {
            let timeSplit = tempoFila.split(':');
            let segundosRestantes = (+timeSplit[0]) * 3600 + (+timeSplit[1]) * 60 + (+timeSplit[2]);

            if (segundosRestantes < 180) {
                console.log("Completar Grátis");
                $('#buildqueue').find('tr').eq(1).find('td').eq(2).find('a').eq(2).click();
            }
        }

        $('[class="btn btn-confirm-yes"]').click();

        Proxima_Construção();

        setTimeout(function () {
            const proximaVila = document.querySelector('#village_switch_right');
            if (proximaVila) {
                console.log("Alternando para próxima vila...");
                proximaVila.click();
            }
        }, 1000);

    }, 500);

})();
