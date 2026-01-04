// ==UserScript==
// @name         Calm Code 2.0
// @namespace    http://tampermonkey.net/
// @version      2024-04-02.3.3
// @description  Calm Code Helper
// @author       xabdaziz
// @match        https://fcmenu-dub-regionalized.corp.amazon.com/CDG7/laborTrackingKiosk
// @match        https://fcmenu-dub-regionalized.corp.amazon.com/CDG7/calmCode
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @license      AzAbd
// @downloadURL https://update.greasyfork.org/scripts/531653/Calm%20Code%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/531653/Calm%20Code%2020.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .button-container {
            position: relative;
            display: flex;
            align-items: center;
            margin: 2px;
        }
        
        .code-button {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 6px 10px;
            margin: 0;
        }
        
        .code-text {
            color: #FFD700;
            font-weight: bold;
        }
        
        .code-label {
            margin-left: 10px;
            color: #98FB98;
            font-size: 11px;
        }

        .category-inbound .code-text,
        .category-training .code-text {
            color: #000000;
        }
        
        .category-inbound .code-label,
        .category-training .code-label {
            color: #FFFFFF;
        }
    `;
    document.head.appendChild(style);

    const categories = [
        {
            name: "Inbound",
            color: "#FF9900",
            codes: [
                { code: "ICQAPS", label: "Dock/JPE/Corral/Bras-KO" },
                { code: "ICQAPSR", label: "NPC/RCV/DCT/PREP" },
                { code: "ICQAPST", label: "MFI/TTO/TTF/TTH" },
                { code: "QARSH", label: "IOL/Authors" }
            ]
        },
        {
            name: "Outbound",
            color: "#01B0F1",
            codes: [
                { code: "ICQAPSO", label: "SORT" },
                { code: "PSRSPS", label: "UIS" },
                { code: "PSTOPS", label: "MP/RP" },
                { code: "PSRPPS", label: "JPW/ATAC" }
            ]
        },
        {
            name: "ICQA",
            color: "#146EB4",
            codes: [
                { code: "ICQDMP", label: "DMG Processing" },
                { code: "ICQADMP", label: "Recolte DMG" },
                { code: "ICQAQA", label: "AUDIT" },
                { code: "AUDITPC", label: "Pallet Defect Capture" }
            ]
        },
        {
            name: "Training",
            color: "#FF9900",
            codes: [
                { code: "ICQAIC", label: "ICQA Peer Trainer" },
                { code: "ICQATR", label: "ICQA Trainee" }
            ]
        },
        {
            name: "Other",
            color: "#37475A",
            codes: [
                { code: "FACJAN", label: "Facility Janitorial" },
                { code: "ICQA5S", label: "5S" },
                { code: "OPSEMPENG", label: "Engagement" },
                { code: "ICQALQA", label: "LEAD" }
            ]
        }
    ];

    function createButton(codeObj, color, categoryName) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = `button-container category-${categoryName.toLowerCase()}`;

        const button = document.createElement('button');
        button.className = 'code-button';
        button.style.cssText = `
            border: none;
            border-radius: 4px;
            background-color: ${color};
            cursor: pointer;
            font-size: 11px;
            transition: all 0.3s;
            width: 100%;
            text-align: left;
        `;

        const codeSpan = document.createElement('span');
        codeSpan.className = 'code-text';
        codeSpan.textContent = codeObj.code;
        
        const labelSpan = document.createElement('span');
        labelSpan.className = 'code-label';
        labelSpan.textContent = codeObj.label;

        button.appendChild(codeSpan);
        button.appendChild(labelSpan);

        button.addEventListener('mouseover', () => button.style.transform = 'scale(1.05)');
        button.addEventListener('mouseout', () => button.style.transform = 'scale(1)');
        button.addEventListener('click', () => {
            const input = document.querySelector('#calmCode');
            if (input) {
                input.value = codeObj.code;
                const form = input.closest('form');
                if (form) form.submit();
            }
        });

        buttonContainer.appendChild(button);
        return buttonContainer;
    }

    function toggleCategory(categoryDiv, buttonsDiv) {
        const isExpanded = buttonsDiv.style.display !== 'none';
        buttonsDiv.style.display = isExpanded ? 'none' : 'flex';
        categoryDiv.querySelector('.toggle-icon').textContent = isExpanded ? '+' : '-';
    }

    const container = document.createElement('div');
    container.style.cssText = `
        position: absolute;
        top: 50%;
        left: 20px;
        transform: translateY(-50%);
        background: #232F3E;
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0 0 15px rgba(0,0,0,0.3);
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 9999;
        font-family: Amazon Ember, Arial, sans-serif;
        font-size: 12px;
        min-width: 300px;
    `;

    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 6px;
        `;

        const categoryHeader = document.createElement('div');
        categoryHeader.style.cssText = `
            display: flex;
            align-items: center;
            cursor: pointer;
            user-select: none;
            padding: 4px 0;
            border-bottom: 2px solid #FF9900;
        `;

        const toggleIcon = document.createElement('span');
        toggleIcon.textContent = '+';
        toggleIcon.className = 'toggle-icon';
        toggleIcon.style.cssText = `
            color: #FFFFFF;
            margin-right: 8px;
            font-weight: bold;
            font-size: 16px;
            width: 15px;
        `;

        const categoryTitle = document.createElement('span');
        categoryTitle.textContent = category.name;
        categoryTitle.style.cssText = `
            font-weight: bold;
            color: #FFFFFF;
            font-size: 13px;
        `;

        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.cssText = `
            display: none;
            flex-direction: column;
            gap: 6px;
            margin-top: 6px;
        `;

        categoryHeader.appendChild(toggleIcon);
        categoryHeader.appendChild(categoryTitle);
        categoryDiv.appendChild(categoryHeader);

        category.codes.forEach(codeObj => {
            buttonsDiv.appendChild(createButton(codeObj, category.color, category.name));
        });

        categoryDiv.appendChild(buttonsDiv);

        categoryHeader.addEventListener('click', () => toggleCategory(categoryDiv, buttonsDiv));

        container.appendChild(categoryDiv);
    });

    document.body.appendChild(container);
})();
