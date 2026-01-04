// ==UserScript==
// @license MIT
// @name         FunPay Tools [Cancel orders]
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Автоотмена последнего заказа в чате
// @author       ETHERNITY
// @match        https://funpay.com/chat/*
// @grant        GM_openInTab
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=funpay.com
// @downloadURL https://update.greasyfork.org/scripts/528778/FunPay%20Tools%20%5BCancel%20orders%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/528778/FunPay%20Tools%20%5BCancel%20orders%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        checkInterval: 3000,
        cancelDelay: 5000,
        buttonStyle: {
            position: 'fixed',
            bottom: '30px',
            left: '30px',
            zIndex: '99999',
            padding: '15px 25px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease',
            display: 'none'
        }
    };

    let currentOrderId = null;
    let cancelButton = null;
    let processingTab = null;

    function debug(message) {
        console.log('[FP Cancel]', message);
    }

    function createButton() {
        if ($('#fpqc-button').length) return;

        cancelButton = $('<button id="fpqc-button">🚫 Отмена последнего</button>')
            .css(config.buttonStyle)
            .hover(
                () => cancelButton.css('transform', 'scale(1.05)'),
                () => cancelButton.css('transform', 'scale(1)')
            );

        $('body').append(cancelButton);
        debug('Кнопка создана');
    }

    function getLastOrderId() {
        const orderElements = $('a[href*="/orders/"], .order-id, .order-link, .chat-message')
            .filter((i, el) => {
                const href = $(el).attr('href') || '';
                return href.includes('/orders/') || $(el).hasClass('order-id');
            })
            .toArray()
            .reverse();

        for (let el of orderElements) {
            const match = $(el).attr('href')?.match(/orders\/([A-Z0-9]+)/)
                        || $(el).text().match(/([A-Z0-9]{8,})/);
            if (match) {
                debug(`Найден заказ: ${match[1]}`);
                return match[1];
            }
        }
        return null;
    }

    function handleTab() {
        if (!processingTab || processingTab.closed) return;

        try {
            processingTab.document.documentElement.scrollTop = 800;

            const cancelBtn = processingTab.document.querySelector(
                'button[data-target=".modal-refund"], .cancel-btn'
            );

            if (cancelBtn) {
                cancelBtn.click();
                debug('Найдена кнопка отмены');

                setTimeout(() => {
                    const confirmBtn = processingTab.document.querySelector(
                        '.modal-refund .btn-danger, .confirm-cancel'
                    );
                    if (confirmBtn) {
                        confirmBtn.click();
                        debug('Подтверждение отмены');
                        setTimeout(() => processingTab.close(), 2000);
                    }
                }, 1000);
            }
        } catch(e) {
            debug('Ошибка: ' + e.message);
        }
    }

    function initCancelProcess(orderId) {
        processingTab = window.open(
            `https://funpay.com/orders/${orderId}/`,
            '_blank',
            'width=1200,height=800'
        );

        setTimeout(() => handleTab(), config.cancelDelay);

        const checkInterval = setInterval(() => {
            if (processingTab.closed) {
                clearInterval(checkInterval);
                return;
            }
            handleTab();
        }, 1000);
    }

    function updateButtonVisibility() {
        const orderId = getLastOrderId();
        if (orderId && orderId !== currentOrderId) {
            currentOrderId = orderId;
            cancelButton.css('display', 'block').fadeTo(300, 1);
        } else if (!orderId) {
            currentOrderId = null;
            cancelButton.fadeTo(300, 0);
        }
    }

    function init() {
        createButton();
        new MutationObserver(updateButtonVisibility)
            .observe(document.body, { childList: true, subtree: true });

        setInterval(updateButtonVisibility, config.checkInterval);
        updateButtonVisibility();

        $('#fpqc-button').click(() => {
            if (currentOrderId) initCancelProcess(currentOrderId);
        });
    }

    GM_addStyle(`
        #fpqc-button {
            display: block !important;
            opacity: 1 !important;
            font-family: Arial, sans-serif !important;
        }
        #fpqc-button:hover {
            background: #c82333 !important;
        }
        .modal-refund {
            z-index: 10000 !important;
        }
    `);

    $(document).ready(init);
})();