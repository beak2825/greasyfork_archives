// ==UserScript==
// @name         Copy mail outlook
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Кнопка копирования email в outlook
// @author       You
// @match        https://outlook.live.com/mail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=live.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477628/Copy%20mail%20outlook.user.js
// @updateURL https://update.greasyfork.org/scripts/477628/Copy%20mail%20outlook.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function copypast(copy) {
        // copy
        var copyTextareaBtn = document.querySelector('.mail-textareacopybtn')
        copyTextareaBtn.addEventListener('click', function (event) {

            navigator.clipboard
                .writeText(copy)
                .then(() => {
                // Получилось!
            })
                .catch(err => {
                console.log('Something went wrong', err)
            })
        })
    }


    function createMail(email) {
        // STYLES
        document.getElementById('owaSearchBox').insertAdjacentHTML(
            'afterbegin',
            `<style>
            a.mail-textareacopybtn {
                display: inline;
                cursor: pointer;
                border-radius: 7px;
                margin: 0px 8px;
                font-weight: 600;
                color: rgb(205,216,228);
                text-decoration: none;
                padding: .7em .8em;
                outline: none;
                border-right: 1px solid rgba(13,20,27,.5);
                border-top: 1px solid rgba(270,278,287,.01);
                background-color: rgb(64,73,82);
                background-image:
                radial-gradient(1px 60% at 0% 50%, rgba(255,255,255,.3), transparent),
                radial-gradient(1px 60% at 100% 50%, rgba(104, 104, 104, 0.3), transparent),
                linear-gradient(rgb(64,73,82), rgb(72,81,90));
            }
            a.mail-textareacopybtn:hover {
                background-image:
                radial-gradient(1px 60% at 0% 50%, rgba(255,255,255,.3), transparent),
                radial-gradient(1px 60% at 100% 50%, rgba(104, 104, 104, 0.3), transparent),
                linear-gradient(rgb(51,60,67), rgb(58,65,72));
            }
            a.mail-textareacopybtn:focus {
                color: rgb(245,247,250);
                border-top: 1px solid rgb(67,111,136);
                background-image:
                linear-gradient(rgb(46,95,122), rgb(36,68,92));
            }
            a.mail-textareacopybtn:active {
                border-top: 1px solid rgb(49,87,107);
                background-image:
                linear-gradient(rgb(33,77,98), rgb(29,57,77));
            }
            .tooltip {
                position: relative;
                }

            .tooltip:hover .tooltip-text {
                visibility: visible;
                }

            .tooltip-text {
                visibility: hidden;
                position: absolute;
                z-index: 1000;
                top: 100%;
                left: 0;
                background-color: #f9f9f9;
                padding: 0 5px;
                border-radius: 4px;
                box-shadow: 0 2px 11px rgb(0 0 0 / 43%);
                white-space: nowrap;
                }
        </style>
    `
        )
        document.getElementById('owaSearchBox').insertAdjacentHTML(
            'afterEnd',
            `
                        <div class="qwe tooltip">
                            <a aria-label="Копировать Email" class="mail-textareacopybtn">${email}</a>
                            <div class="tooltip-text">Копировать Email</div>
                        </div>`
        )
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(tooltip => {
            tooltip.addEventListener('mousemove', e => {
                const tooltipText = tooltip.querySelector('.tooltip-text');
                tooltipText.style.left = e.clientX / 8 - 50 + 'px';
            });
        });
        copypast(email)
    }

    // Интервальная проверка наличия объекта owaSearchBox
    const intervalId = setInterval(() => {
        const owaSearchBox = document.getElementById('owaMeetNowButton');
        if (owaSearchBox) {
            const dictionary = JSON.parse(localStorage.getItem('olk-BootDiagnostics'))
            const email = dictionary.upn
            clearInterval(intervalId)
            createMail(email)
        }
    }, 700);

})();