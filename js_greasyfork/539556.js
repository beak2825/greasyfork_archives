// ==UserScript==
// @name         Ticket Radius Extender
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Após VOCÊ clicar em "Usar minha localização", este script define o raio para 9999 (limite e valor) e adiciona um botão.
// @author       luascfl
// @match        https://*.ticket.com.br/portal-usuario/rede-credenciada*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfbWrBAuYADiR9X6QPkRvBv7-Dqd9VQ5SO3Q&s
// @license      MIT
// @home         https://github.com/luascfl/ticket-radius-extender
// @supportURL   https://github.com/luascfl/ticket-radius-extender/issues
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539556/Ticket%20Radius%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/539556/Ticket%20Radius%20Extender.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log(`%cTampermonkey (Ticket Radius Extender v3.2) iniciado às ${new Date().toLocaleTimeString()}`, 'color: #8A2BE2; font-weight: bold; background-color: black;');
    console.log('Aguardando a página ser alterada (ex: após clique em "Usar minha localização")...');

    const NOVO_VALOR = '9999';
    const VALOR_MAXIMO_ORIGINAL = '150';
    const ID_BOTAO_RECARREGAR = 'btn-forcar-att-gemini';

    function executarModificacoes() {
        console.log('%c--- Função executarModificacoes() chamada ---', 'color: #BA55D3');

        // --- Lógica para criar e injetar o botão de atualização ---
        if (!document.getElementById(ID_BOTAO_RECARREGAR)) {
            const anexoDoBotao = document.querySelector('.custom-pagination');
            if (anexoDoBotao) {
                const btnRecarregar = document.createElement('button');
                btnRecarregar.id = ID_BOTAO_RECARREGAR;
                btnRecarregar.textContent = 'Forçar Atualização Visual';
                btnRecarregar.style.cssText = 'padding: 8px 12px; margin-left: 15px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; align-self: center;';
                btnRecarregar.addEventListener('click', executarModificacoes);
                anexoDoBotao.appendChild(btnRecarregar);
                console.log('%cBotão de recarga injetado com sucesso!', 'color: green');
            }
        }

        // --- Lógica para manter os valores do filtro para 9999 ---
        const sliderHandle = document.querySelector('.ngx-slider-pointer-min');
        const sliderBubble = document.querySelector('.ngx-slider-bubble.ngx-slider-model-value');
        const maxDropdownOption = document.querySelector(`select option[value="${VALOR_MAXIMO_ORIGINAL}"], select option[value="${NOVO_VALOR}"]`);

        // Modifica todos os atributos relevantes do slider
        if (sliderHandle) {
            const attrs = ['aria-valuemax', 'aria-valuenow', 'aria-valuetext'];
            attrs.forEach(attr => {
                if (sliderHandle.getAttribute(attr) !== NOVO_VALOR) {
                    sliderHandle.setAttribute(attr, NOVO_VALOR);
                    console.log(`%c-- Slider: Atributo '${attr}' alterado para ${NOVO_VALOR}!`, 'color: green');
                }
            });
        }

        // Modifica a "bolha" de texto que mostra o valor
        if (sliderBubble && sliderBubble.textContent !== NOVO_VALOR) {
            sliderBubble.textContent = NOVO_VALOR;
            console.log(`%c-- Bolha do Slider: Texto alterado para ${NOVO_VALOR}!`, 'color: green');
        }

        // Modifica a opção do dropdown e seleciona o novo valor
        if (maxDropdownOption) {
            // Altera a opção em si
            if (maxDropdownOption.value !== NOVO_VALOR) {
                maxDropdownOption.value = NOVO_VALOR;
                maxDropdownOption.textContent = `${NOVO_VALOR} km`;
                console.log(`%c-- Dropdown: Opção alterada para ${NOVO_VALOR}!`, 'color: green');
            }
            // Garante que o valor está selecionado no <select>
            const parentSelect = maxDropdownOption.closest('select');
            if (parentSelect && parentSelect.value !== NOVO_VALOR) {
                parentSelect.value = NOVO_VALOR;
                parentSelect.dispatchEvent(new Event('change', { bubbles: true }));
                console.log(`%c-- Dropdown: Valor selecionado definido para ${NOVO_VALOR}!`, 'color: green');
            }
        }
    }

    // O MutationObserver fica "escutando" a página.
    let debounceTimer;
    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            console.log(`%cDOM alterado. Verificando a necessidade de modificações...`, 'color: orange');
            executarModificacoes();
        }, 250);
    });

    // Inicia a observação de toda a página.
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
