// ==UserScript==
// @name         Payment Screenshot
// @namespace    https://lzt.market/
// @version      0.7
// @description  Делаем скрин перевода
// @author       Hash
// @match        https://lzt.market/user/payments
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/511011/Payment%20Screenshot.user.js
// @updateURL https://update.greasyfork.org/scripts/511011/Payment%20Screenshot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const faStylesheet = document.createElement('link');
    faStylesheet.rel = 'stylesheet';
    faStylesheet.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(faStylesheet);

    window.addEventListener('load', function() {
        const mainContainer = document.querySelector('.marketMainContainer');
        if (!mainContainer) {
            console.error('Main container not found!');
            return;
        }

        const paymentContainer = mainContainer.querySelector('.marketIndex--itemsContainer.MarketItems.marketMyPayments');
        if (!paymentContainer) {
            console.error('Payment container not found!');
            return;
        }

        const paymentItems = paymentContainer.querySelectorAll('.wrapper .item');

        paymentItems.forEach(item => {
            // Create a screenshot button
            const screenshotBtn = document.createElement('button');
            screenshotBtn.innerHTML = '<i class="fa fa-exclamation-triangle"></i> Скриншот';
            screenshotBtn.style.background = 'rgb(52, 43, 28)';
            screenshotBtn.style.color = 'rgb(230, 191, 74)';
            screenshotBtn.style.display = 'flex';
            screenshotBtn.style.alignItems = 'center';
            screenshotBtn.style.margin = '8px';
            screenshotBtn.style.cursor = 'pointer';
            screenshotBtn.style.border = 'none';
            screenshotBtn.style.padding = '5px';
            screenshotBtn.style.borderRadius = '4px';
            screenshotBtn.style.fontSize = '12px';

            item.appendChild(screenshotBtn);

            screenshotBtn.addEventListener('click', function() {
                screenshotBtn.style.display = 'none';
                html2canvas(item, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#272727'
                }).then(canvas => {
                    canvas.toBlob(blob => {
                        const clipboardItem = new ClipboardItem({ 'image/png': blob });

                        navigator.clipboard.write([clipboardItem]).then(() => {
                            XenForo.alert('Скриншот сделан', '', 5000);


                        }).catch(err => {
                            console.error('Ошибка сохранения в буфер обмена:', err);
                            alert('Ошибка при сохранении скриншота в буфер обмена.');
                        });

                        screenshotBtn.style.display = '';
                    });
                });
            });
        });

    }, false);
})();
