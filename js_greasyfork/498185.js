// ==UserScript==
// @name            Timepad: кол-во доступных билетов
// @namespace       github.com/a2kolbasov
// @version         0.5-snapshot
// @description     Скрипт для отображения числа доступных билетов
// @author          Aleksandr Kolbasov
// @match           https://*.timepad.ru/event/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/498185/Timepad%3A%20%D0%BA%D0%BE%D0%BB-%D0%B2%D0%BE%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%D0%BD%D1%8B%D1%85%20%D0%B1%D0%B8%D0%BB%D0%B5%D1%82%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/498185/Timepad%3A%20%D0%BA%D0%BE%D0%BB-%D0%B2%D0%BE%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%D0%BD%D1%8B%D1%85%20%D0%B1%D0%B8%D0%BB%D0%B5%D1%82%D0%BE%D0%B2.meta.js
// ==/UserScript==

/**
 * @copyright 2024 Aleksandr Kolbasov
 * @file Скрипт для отображения числа доступных билетов
 */

// @ts-check

(() => {
    'use strict';

    let eventModel = document.getElementById('evModel');
    if (!eventModel) return; // если скрипт сработал в iframe с выбором билетов, а не на первичном документе
    let eventObj = window.eval(eventModel.textContent);

    // iframe с выбором билетов генерируется позже window.onload; отслеживаем его добавление и прогрузку
    new MutationObserver((mutations, observer) => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node instanceof HTMLIFrameElement) {
                    observer.disconnect();
                    node.contentWindow.addEventListener('load', e => {
                        addTicketsLeftDisplay(node);
                    });
                }
            }
        }
    }).observe(eventModel.parentElement, { childList: true, subtree: true });

    /** @param {HTMLIFrameElement} iframe */
    function addTicketsLeftDisplay(iframe) {
        let iframeDocument = iframe.contentDocument;

        let ticketsLeftDisplayStyle = document.createElement('style');
        // white-space: pre; `\a | \n`
        ticketsLeftDisplayStyle.textContent = `\
            .js-plusminus_display {
                width: auto;
            }
            .js-plusminus_display[data-tickets-left]::after {
                white-space: pre;
                opacity: 0.5;
                content: " / " attr(data-tickets-left); "\atest-a\ntest-b"
            }
        `;
        iframeDocument.body.append(ticketsLeftDisplayStyle);

        for (let ticket of eventObj.tickets) {
            let selectedTicketsElement = iframeDocument.querySelector(`[data-reid="${ticket.id}"]`); // скрытый input с выбираемыми билетами
            let selectedTicketsDisplayElement = selectedTicketsElement?.closest('.js-plusminus')?.querySelector('.js-plusminus_display');
            selectedTicketsDisplayElement?.setAttribute('data-tickets-left', ticketsNumberToString(ticket.tickets_left, ticket.available));
            /*
            let ticketsLimit = ticket.limit || Infinity; // Всего в продаже
            let ticketsMaxPerUnit = ticket.max || Infinity; // Максимум за 1 заказ
            */
        }
    }

    /**
     * Если число билетов не ограничено, то оно обозначается как `null` или `0`, при этом `available === true`.
     * Эта функция проверяет, задано ли точное число билетов и возвращает его или символ `∞`.
     * @param {number | null | undefined} num
     * @param {boolean} ticketAvailable
     * @returns {string}
     */
    function ticketsNumberToString(num, ticketAvailable = true) {
        if (!ticketAvailable) return '0';
        if (!Number.isFinite(num) || num === 0) return '\u8734'; // ∞
        return String(num);
    }
})();
