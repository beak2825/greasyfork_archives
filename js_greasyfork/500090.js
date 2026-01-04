// ==UserScript==
// @name         Сортировка промокодов в Тильде
// @namespace    https://bocmanbarada.ru/codes
// @version      1.0
// @description  Скрипт сортирует колонки по алфавиту, числам или дате. 
// @author       bocmanbarada
// @match        https://tilda.ru/projects/payments/promocodes/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACiklEQVR4nO2ZP2gUQRSHR4KCivEuKWwStYlCQBsRxUIQSWWhoFYBSSGWamMaC62CkFZQES0EUUglFqIiGCv/xByIihAhwUKsRAtRFP1k9B33MuTOndnZOKv7wZBjb2fm9zGZvbs3xvwvAMPAEWmbTRkBNgI/aHHblBFgnPl8B9aZMgEsBd6JwJySOWXKBLBPhR8BXsrrN0CXKQvADQn+GVgNnFZiQ6YMAGuArxJ6Qm38JtdNGQBOqND71fVpufYF6F2EHJPAkzwDNPfDR2C5uj6qBI/GCtwhxy9CO++gxSXnvX71ufIsVuCiRC4qkQNA3WmP1ftbo6ePIQKslH+nrJzznmSRREbw4wOwIkWRSRXyILClTdP3HUpKBBhQG3nGY+Xu5w0cW2Qs6/cpYBXwSe618gN5Q0cRAbrkO1STDRn6XFP3j+UNHUtkE3BX2uWMfXapPlfyBI6+2VODSiQxqFYkMahWJDGoViQxqFYkMcjxe2Q3cMGzDacochx/gn7u2sKGlJf6QkWAPuAFcC+GyHigyE3pP9NOhg4iImH7Wu74Tr4EuKokXgG1QBFbhn0o48wC67OKOBJPbXXHd/KTSsJWWwZDJLLKsIDIAhI9vpPulfMR5O+ePBJZZHBEYkgMOvWu0RgSjswjV0aLOBLTIRK9wGslMWH3SkyRdjK0yC2xzKlhTemidgEydZmj+TTDeT3lvbFl4PNqMHsM11+Iwfw5a059uUkj6CjDHhuoQeyhz85CkmeTaYRKDAHf1ECHC0ncOUOPPJn8n06qdPpeSZwtJGn2lamFdOwGniuJB3bDmzLB77LpLSXxVlan/ofWbVIC2EYYDZMSwPZ/RWQtcCagHfvb2StMgvwEXznT7KY/VwsAAAAASUVORK5CYII=
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500090/%D0%A1%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D0%BF%D1%80%D0%BE%D0%BC%D0%BE%D0%BA%D0%BE%D0%B4%D0%BE%D0%B2%20%D0%B2%20%D0%A2%D0%B8%D0%BB%D1%8C%D0%B4%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/500090/%D0%A1%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D0%BF%D1%80%D0%BE%D0%BC%D0%BE%D0%BA%D0%BE%D0%B4%D0%BE%D0%B2%20%D0%B2%20%D0%A2%D0%B8%D0%BB%D1%8C%D0%B4%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let thClass = 'asc';

    function addSortPromocode() {
        setTimeout(function() {
            const getCellValue = (tr, idx) => tr.children[idx].innerText.replace('%', '') || tr.children[idx].textContent.replace('%', '');
            
            const comparer = (idx, asc) => (a, b) => ((v1, v2) => v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2))(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
            
            document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
                const table = th.closest('table');
                Array.from(table.querySelectorAll('tbody tr'))
                    .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
                    .forEach(tr => table.querySelector('tbody').appendChild(tr));
            })));
            
            let tableHeading = document.querySelectorAll('.promocode-list th');
            
            tableHeading.forEach(function(th) {
                th.addEventListener('click', function() {
                    console.log(th);
                    if (thClass === 'asc') {
                        tableHeading.forEach(function(elem) {
                            elem.removeAttribute('class');
                        });
                        th.classList.add(thClass);
                        thClass = 'desc';
                    } else {
                        tableHeading.forEach(function(elem) {
                            elem.removeAttribute('class');
                        });
                        th.classList.add(thClass);
                        thClass = 'asc';
                    }
                });
            });
        }, 1000);
    }

    // Настройка MutationObserver
    const observerPromocodeTable = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Проверяем каждый добавленный узел
                for (let node of mutation.addedNodes) {
                    if (node instanceof HTMLElement) {
                        // Проверяем, является ли добавленный узел элементом, которого вы ищете
                        if (node.classList.contains('promocode-inner')) {
                        // Вызываем функцию при появлении элемента
                            addSortPromocode();
                            console.log('Функция addSortPromocode() запущена');
                        }
                    }
                }
            }
        }
    });

    const targetPromocodeTable = document.body;
    const config = { childList: true, subtree: true };
    observerPromocodeTable.observe(targetPromocodeTable, config);

    $('head').append(`'
    <style>
    .promocode-list thead th {
        cursor: pointer;
    }
    .promocode-list th:after {
        content: '';
        /* font-size: 14px; */
        width: 1em;
        display: inline-block;
        min-height: 1em;
        background-size: contain;
        margin-left: 4px;
        vertical-align: text-bottom;
    }
    .promocode-list th.asc:after {
        /* content: ' (А → Я)'; */
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABP0lEQVR4nO2VMUvEQBCFP71GsDbYWfsTlEM4EeysLO0FLaxFuMJWRAQRFSz1D1iJnY0o2niClZV6erViJUQW3sIQjmyit3JweTBkmZ03H5vsbqDSIGsPSBXbJb3XwNVvoMNA24CfgaESfu8rrYaMZ8CrxtP/Ad6XcRk41ngnNrgGvMs4ASxq3NYniAZuyPQFHAKnplE9JvjAGLOxGwtcAzoyzZv8pnJvquk5eE6GT2DE5KdMs5kY4F6pAvc3eCPnOK3GBK8ATyb8LeZiISbYyl2R52pyQnH9GdxUgwdgNKfuErgFki7gRHOF/8+zwDfwAUwGam8EagnkwYlyqWqCGtf16AxLBeotwD/tuGXeRu53vZDhiOIaA+67nIRHLSSoNWN6yezw9YA30X5Iy6zUayvnHLu5kBzoLrPZKg2gfgA/l47PnaHu8gAAAABJRU5ErkJggg==);
    }
    .promocode-list th.desc:after {
        /* content: ' (Я → А)'; */
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABOklEQVR4nO2VvUrEQBSFP2Mh2BttfAHfQBFRLOxs7K1FC2sRLGwXEQtFBUt9ARuxtBFFG1ewsvK/FythZeAEL0syTkY3IJsDQ4bJPeeDm8kM1OpGrQKtgrEUmHEBnJcFLwL3Zrwa8GxgRlYfrQQ4UchhCd+vwWsKuAX6qwJPAp/AOzBS0hsNHgSeZZ6P8EeBE+BUxv0IaDR42Rgf23b4SifBDc9/3Ogk+C9Ug/8HeNsEbFQFTswB4sYD0FMFeErGY+BJ87EqwDsyLgAHmm966s+AKyDNAad69+P93Gvu4GFgzrTbfYI8XaqmKVAGTrXWUk1Qmz+APeDIBI0XeCwge9p503SjULueI3PL4xsAbnI8d8BQSJvfZJgx6+tae1FNKDwI6jQtg7v8+/jWqAmbwC/X0uu2zVarC/UFLdiOyXJGbl4AAAAASUVORK5CYII=);
    }
    </style>'`);
})();