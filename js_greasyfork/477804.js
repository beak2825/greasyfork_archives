// ==UserScript==
// @name Crunchyroll More Filters
// @name:pt-BR Mais Filtros Crunchyroll
// @namespace http://tampermonkey.net/
// @author Trapstar
// @description Adds more filters to Crunchyroll's anime list page
// @description:pt-BR Adiciona mais filtros na página de lista de animes do Crunchyroll
// @match https://www.crunchyroll.com/*/videos/*
// @match http://www.crunchyroll.com/*/videos/*
// @icon https://www.crunchyroll.com/favicons/favicon-32x32.png
// @version 1.0.2
// @license MIT
// @copyright 2023
// @downloadURL https://update.greasyfork.org/scripts/477804/Crunchyroll%20More%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/477804/Crunchyroll%20More%20Filters.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let added = false;
    let selectedMethod = 0
    let animeCardArray = []

    function getRatingCount(element) {
        const text = element.textContent;
        const match = text.match(/\((\d+(\.\d+)?)k\)/);
        if (match) {
            return parseFloat(match[1]) * 1000;
        }
        return 0;
    }

    function ordenarPorAvaliacao() {
        console.log("[Crunchyroll More Filters] Reordenando por Mais Avaliados]")
        selectedMethod = 1
        const animeCards = document.querySelectorAll('.erc-browse-cards-collection .browse-card');
        animeCardArray = Array.from(animeCards);
        animeCardArray.sort((a, b) => {
            const ratingCountA = getRatingCount(a.querySelector('.star-rating-short-static__votes-count--h9Sun'));
            const ratingCountB = getRatingCount(b.querySelector('.star-rating-short-static__votes-count--h9Sun'));
            return ratingCountB - ratingCountA;
        });
        const cardCollection = document.querySelector('.erc-browse-cards-collection');
        cardCollection.innerHTML = '';
        animeCardArray.forEach((card) => {

            cardCollection.appendChild(card);
        });
    }

    function ordernarPorEstrelas() {
        console.log("[Crunchyroll More Filters] Reordenando por Mais Estrelas]")
        selectedMethod = 2
        const animeCards = document.querySelectorAll('.erc-browse-cards-collection .browse-card');
        animeCardArray = Array.from(animeCards);

        animeCardArray.sort((a, b) => {
            const ratingCountA = parseFloat(a.querySelector('.star-rating-short-static__rating--bdAfR').textContent);
            const ratingCountB = parseFloat(b.querySelector('.star-rating-short-static__rating--bdAfR').textContent);

            return ratingCountB - ratingCountA;
        });

        const cardCollection = document.querySelector('.erc-browse-cards-collection');
        cardCollection.innerHTML = '';

        animeCardArray.forEach((card) => {
            cardCollection.appendChild(card);
        });
    }

    function ordenarPorAvaliacaoProporcional() {
        console.log("[Crunchyroll More Filters] Reordenando por Mais Avaliados Proporcionalmente]")
        selectedMethod = 3
        const animeCards = document.querySelectorAll('.erc-browse-cards-collection .browse-card');
        animeCardArray = Array.from(animeCards);

        animeCardArray.sort((a, b) => {
            const ratingCountA = getRatingCount(a.querySelector('.star-rating-short-static__votes-count--h9Sun'));
            const ratingCountB = getRatingCount(b.querySelector('.star-rating-short-static__votes-count--h9Sun'));

            const ratingA = parseFloat(a.querySelector('.star-rating-short-static__rating--bdAfR').textContent);
            const ratingB = parseFloat(b.querySelector('.star-rating-short-static__rating--bdAfR').textContent);

            const pesoAvaliacao = 0.7;
            const pesoEstrelas = 0.3;

            const pontuacaoA = (ratingCountA * pesoAvaliacao) + (ratingA * pesoEstrelas);
            const pontuacaoB = (ratingCountB * pesoAvaliacao) + (ratingB * pesoEstrelas);

            return pontuacaoB - pontuacaoA;
        });

        const cardCollection = document.querySelector('.erc-browse-cards-collection');
        cardCollection.innerHTML = '';

        animeCardArray.forEach((card) => {
            cardCollection.appendChild(card);
        });
    }

    function adicionarBotao(texto, funcao) {
        const button = document.createElement('div');
        button.id = 'btn' + texto;
        button.className = 'select-content__option--gq8Uo';
        button.tabIndex = 0;
        button.innerHTML = `
          <span class="text--gq6o- text--is-m--pqiL- middle-truncation--x7S4D">
            <span class="middle-truncation__text--xv72L">${texto}</span>
            <span aria-hidden="true" class="middle-truncation__truncated-text--rur5E middle-truncation__truncated-text--is-hidden--LRE6O">
              <span class="middle-truncation__text-start--3XiZ9">${texto}</span>
              <span class="middle-truncation__dots--Ywbi7">...</span>
              <span class="middle-truncation__text-end--Vl77q">${texto}</span>
            </span>
          </span>
        `;
        button.addEventListener('click', function () {
            funcao();
        });

        const targetElement = document.querySelector('.dropdown-content__children--HW28H');
        if (targetElement) {
            targetElement.appendChild(button);
        }
    }

    function observarDOM() {
        const targetElement = document.querySelector('.dropdown-content__children--HW28H');

        if (selectedMethod !== 0) {
            const animeCards = document.querySelectorAll('.erc-browse-cards-collection .browse-card');
            const animeCardArray2 = Array.from(animeCards);
            if (animeCardArray.length !== animeCardArray2.length) {
                switch (selectedMethod) {
                    case 1:
                        ordenarPorAvaliacao();
                        break;
                    case 2:
                        ordernarPorEstrelas();
                        break;
                    case 3:
                        ordenarPorAvaliacaoProporcional();
                        break;
                }
            }
        }

        if (targetElement) {
            if (added) {
                return;
            }
            added = true;
            setTimeout(() => {
                console.log("[Crunchyroll More Filters] Adding buttons]")
                adicionarBotao('Most Proportionally Rated', ordenarPorAvaliacaoProporcional);
                adicionarBotao('Most Rated', ordenarPorAvaliacao);
                adicionarBotao('Most Stars', ordernarPorEstrelas);
            }, 1);
        } else {
            added = false;
        }
    }

    observarDOM()
    const observer = new MutationObserver(observarDOM);
    observer.observe(document.body, { childList: true, subtree: true });
})();