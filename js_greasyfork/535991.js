// ==UserScript==
// @name         GeoGuessr Return Old Team Duels UI
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  This script returns the old GeoGuessr Team Duels UI during matches. You need to press "Get old UI" after opponents were found.
// @author       AaronThug
// @match        https://www.geoguessr.com/*
// @icon         https://www.geoguessr.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fteam-duels.52be0df6.webp&w=64&q=75
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535991/GeoGuessr%20Return%20Old%20Team%20Duels%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/535991/GeoGuessr%20Return%20Old%20Team%20Duels%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const popupShown = localStorage.getItem('returnOldTeamDuelsUI_popupShown');
    
    if (!popupShown) {
        localStorage.setItem('returnOldTeamDuelsUI_popupShown', 'true');
        
        setTimeout(() => {
            createGeoGuessrModal();
        }, 1000);
    }

    function createGeoGuessrModal() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Nunito', sans-serif;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: linear-gradient(135deg, #2a2d47 0%, #1e1f3a 100%);
            border-radius: 16px;
            border: 2px solid #3d4264;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
            padding: 32px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            position: relative;
        `;

        const header = document.createElement('h2');
        header.textContent = 'This is a message from the "Return Old Team Duels UI" script';
        header.style.cssText = `
            color: #ffffff;
            font-size: 18px;
            font-weight: 700;
            margin: 0 0 24px 0;
            line-height: 1.4;
        `;

        const message = document.createElement('div');
        message.innerHTML = `
            <p style="color: #b8bcc8; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                Hello dear "Return Old Team Duels UI" user. Unfortunately, I have to inform you that GeoGuessr has removed all callbacks to the old Team Duels UI.
            </p>
            <p style="color: #b8bcc8; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                So, I don't see any way to use the old UI at the moment.
            </p>
            <p style="color: #b8bcc8; font-size: 14px; line-height: 1.6; margin: 0;">
                If you find something, feel free to contact me via DC <strong style="color: #ffffff;">@aaronthug</strong>
            </p>
        `;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'OK';
        closeButton.style.cssText = `
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            border: none;
            border-radius: 8px;
            color: white;
            padding: 12px 32px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 24px;
            transition: all 0.2s ease;
            font-family: 'Nunito', sans-serif;
        `;

        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.transform = 'translateY(-2px)';
            closeButton.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.4)';
        });

        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.transform = 'translateY(0)';
            closeButton.style.boxShadow = 'none';
        });

        closeButton.addEventListener('click', () => {
            overlay.remove();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        });

        modal.appendChild(header);
        modal.appendChild(message);
        modal.appendChild(closeButton);
        overlay.appendChild(modal);

        document.body.appendChild(overlay);

        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.8) translateY(-20px)';
        
        requestAnimationFrame(() => {
            overlay.style.transition = 'opacity 0.3s ease';
            modal.style.transition = 'transform 0.3s ease';
            overlay.style.opacity = '1';
            modal.style.transform = 'scale(1) translateY(0)';
        });
    }
})();