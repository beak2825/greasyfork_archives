// ==UserScript==
// @name         WhatsApp tam ekran yapma zımbırtısı
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  WhatsApp Web kenar çubuğunu gizleyip göstermeye yarayan eklenti
// @author       dursunator
// @match        https://web.whatsapp.com/*
// @grant        none
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQucUojyTZm7MPuSX25uDTOgo_pxe_wWeNeAg&s
// @downloadURL https://update.greasyfork.org/scripts/533755/WhatsApp%20tam%20ekran%20yapma%20z%C4%B1mb%C4%B1rt%C4%B1s%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/533755/WhatsApp%20tam%20ekran%20yapma%20z%C4%B1mb%C4%B1rt%C4%B1s%C4%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        .sidebar-hidden {
            display: none !important;
        }

        .toggle-button {
            position: fixed;
            top: 10px;
            right: 100px;
            z-index: 9999;
            background-color: #00a884;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .toggle-button:hover {
            background-color: #008f72;
        }
    `;
    document.head.appendChild(style);

    function initialize() {
        const button = document.createElement('button');
        button.className = 'toggle-button';
        button.innerHTML = '≡';
        button.title = 'Kenar çubuğunu aç/kapat (Alt+S)';
        document.body.appendChild(button);

        let isHidden = false;

        function toggleSidebar() {
            const elements = document.querySelectorAll('._aigw, .x1m6msm.xd32934.xryxfnj.x1plvlek.xa1v5g2.xdt5ytf.x78zum5.x1w8yi2h.x2ipvbc.x1i1dayz.x17dzmu4.x5yr21d.x1n2onr6.x9f619');

            if (elements.length === 0) {
                console.log('Hedef element bulunamadı');
                return;
            }

            isHidden = !isHidden;

            elements.forEach(element => {
                if (isHidden) {
                    element.classList.add('sidebar-hidden');
                    button.innerHTML = '☰';
                } else {
                    element.classList.remove('sidebar-hidden');
                    button.innerHTML = '≡';
                }
            });
        }

        button.addEventListener('click', toggleSidebar);

        document.addEventListener('keydown', function(e) {
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                toggleSidebar();
            }
        });

        const observer = new MutationObserver(function(mutations) {
            const whatsappLoaded = document.querySelector('._aigw, .x1m6msm.xd32934.xryxfnj.x1plvlek.xa1v5g2.xdt5ytf.x78zum5.x1w8yi2h.x2ipvbc.x1i1dayz.x17dzmu4.x5yr21d.x1n2onr6.x9f619');

            if (whatsappLoaded) {

                button.style.right = '100px';
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initialize, 3000);
    } else {
        window.addEventListener('DOMContentLoaded', function() {
            setTimeout(initialize, 3000);
        });
    }
})();