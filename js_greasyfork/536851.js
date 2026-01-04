// ==UserScript==
// @name         Компактное игровое поле
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Компактный интерфейс: чат и инвентарь в левой части.
// @author       Шумелка (347). ВК - https://vk.com/oleg_rennege
// @match        https://patron.kinwoods.com/game
// @grant        none
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/536851/%D0%9A%D0%BE%D0%BC%D0%BF%D0%B0%D0%BA%D1%82%D0%BD%D0%BE%D0%B5%20%D0%B8%D0%B3%D1%80%D0%BE%D0%B2%D0%BE%D0%B5%20%D0%BF%D0%BE%D0%BB%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/536851/%D0%9A%D0%BE%D0%BC%D0%BF%D0%B0%D0%BA%D1%82%D0%BD%D0%BE%D0%B5%20%D0%B8%D0%B3%D1%80%D0%BE%D0%B2%D0%BE%D0%B5%20%D0%BF%D0%BE%D0%BB%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        leftWidth: '700px',
        chatHeight: '440px',
        chatInputHeight: '70px',
        actionsHeight: '100px', // Увеличена высота блока действий
        parametersHeight: '120px',
        skillsHeight: '120px',
        gapBetween: '5px',
        panelPadding: '5px',
        actionsHorizontal: true,
        actionsLeftOffset: '100px',
        chatWidth: 'calc(100% - 0px)',
        panelPositions: {
            'chat': 0,
            'actions': 250,
            'parameters': 365,
            'skills': 465,
            'items': 600
        },
        buttonSize: '80px',    // Новый размер кнопок
        iconSize: '70px'       // Новый размер иконок
    };

    window.addEventListener('load', function() {
        setTimeout(function() {
            createCompactLayout();
            fixActionButtons();
        }, 2000);
    });

    function fixActionButtons() {
    // Сначала находим контейнер для кнопок действий
    const actionsContainer = document.querySelector('.actions-buttons.svelte-nqamr4');
    if (actionsContainer) {
        actionsContainer.style.cssText = `
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
            height: ${CONFIG.actionsHeight} !important;
            gap: 0px !important;
            padding: 5px !important;
            position: relative !important;
            z-index: 100 !important;
        `;
    }

    // Затем обрабатываем каждую кнопку
    document.querySelectorAll('.action.svelte-5ea9xh').forEach(button => {
        button.style.cssText = `
            width: ${CONFIG.buttonSize} !important;
            height: ${CONFIG.buttonSize} !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            background: none !important;
            cursor: pointer !important;
            position: relative !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            z-index: 100 !important;
        `;

        const img = button.querySelector('.action-img.svelte-5ea9xh');
        if (img) {
            img.style.cssText = `
                width: ${CONFIG.iconSize} !important;
                height: ${CONFIG.iconSize} !important;
                display: block !important;
                margin: 0 !important;
                transition: transform 0.2s ease !important;
                pointer-events: none !important;
            `;

            button.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.1)';
            });
            button.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
            });
        }

        // Убираем возможные перекрытия tooltip
        const tooltip = button.closest('.tooltip-anchor.svelte-1my6515');
        if (tooltip) {
            tooltip.style.cssText = `
                position: relative !important;
                width: ${CONFIG.buttonSize} !important;
                height: ${CONFIG.buttonSize} !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                z-index: 1 !important;
            `;

            const tooltipPanel = tooltip.querySelector('.cell-tooltip.svelte-1my6515');
            if (tooltipPanel) {
                tooltipPanel.style.cssText = `
                    position: absolute !important;
                    top: 100% !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    z-index: 1000 !important;
                    pointer-events: none !important;
                `;
            }
        }
    });
}

    // Остальная часть скрипта остается БЕЗ ИЗМЕНЕНИЙ
    function createCompactLayout() {
        const gameLeft = document.querySelector('.game-left');
        const gameRight = document.querySelector('.game-right');
        const gameContainer = document.querySelector('.game-container');
        const gamechat = document.querySelector('#gamechat');

        if (!gameLeft || !gameRight || !gameContainer || !gamechat) return;

        document.querySelector('.game.svelte-15im41r').style.cssText = `
            display: flex !important;
            flex-wrap: nowrap !important;
            height: 100vh !important;
            overflow: hidden !important;
        `;

        gameLeft.style.cssText = `
            width: ${CONFIG.leftWidth} !important;
            min-width: ${CONFIG.leftWidth} !important;
            max-width: ${CONFIG.leftWidth} !important;
            display: flex !important;
            flex-direction: column !important;
            padding: 5px !important;
            overflow-y: auto !important;
            gap: ${CONFIG.gapBetween} !important;
            position: relative;
        `;

        gameRight.style.cssText = `
            width: auto !important;
            min-width: 100px !important;
            display: flex !important;
            flex-direction: column !important;
            padding: 5px !important;
            overflow-y: auto !important;
        `;

        gameContainer.style.cssText = `
            flex: 1 !important;
            min-width: 0 !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
        `;

        const panelsContainer = document.createElement('div');
        panelsContainer.style.cssText = `
            position: relative;
            flex-grow: 1;
            min-height: calc(100vh - 50px);
        `;
        gameLeft.appendChild(panelsContainer);

        const panels = {
            'chat': {
                element: gamechat,
                height: CONFIG.chatHeight,
                width: CONFIG.chatWidth,
                position: CONFIG.panelPositions.chat
            },
            'actions': {
                element: gameLeft.querySelector('.actions-desktop'),
                height: CONFIG.actionsHeight,
                position: CONFIG.panelPositions.actions,
                left: CONFIG.actionsLeftOffset
            },
            'parameters': {
                element: gameLeft.querySelector('.parameters.desktop'),
                height: CONFIG.parametersHeight,
                position: CONFIG.panelPositions.parameters
            },
            'skills': {
                element: gameLeft.querySelector('.skills-desktop'),
                height: CONFIG.skillsHeight,
                position: CONFIG.panelPositions.skills
            }
        };

        Object.entries(panels).forEach(([type, panel]) => {
            if (!panel.element) return;

            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                position: absolute;
                top: ${panel.position}px;
                left: ${panel.left || '0'};
                right: 0;
                height: ${panel.height};
                ${panel.width ? `width: ${panel.width};` : ''}
                margin: 0;
                padding: ${CONFIG.panelPadding};
                background: transparent;
            `;

            if (type === 'actions' && CONFIG.actionsHorizontal) {
                const actionsButtons = panel.element.querySelector('.actions-buttons');
                if (actionsButtons) {
                    actionsButtons.style.cssText = `
                        display: flex !important;
                        flex-direction: row !important;
                        justify-content: space-around !important;
                        align-items: center !important;
                        height: 100% !important;
                        margin-left: ${CONFIG.actionsLeftOffset} !important;
                        gap: 8px !important;
                    `;
                }
            }

            wrapper.appendChild(panel.element);
            panelsContainer.appendChild(wrapper);
        });

        const itemsPanel = document.querySelector('.items-panel');
        if (itemsPanel) {
            const itemsWrapper = document.createElement('div');
            itemsWrapper.style.cssText = `
                position: absolute;
                top: ${CONFIG.panelPositions.items}px;
                left: 0;
                right: 0;
                padding: ${CONFIG.panelPadding};
                background: transparent;
            `;

            itemsWrapper.appendChild(itemsPanel);
            panelsContainer.appendChild(itemsWrapper);

            itemsPanel.style.cssText = `
                position: relative !important;
                bottom: auto !important;
                left: auto !important;
                width: auto !important;
                max-width: 50% !important;
                height: auto !important;
                z-index: 1000 !important;
                border-radius: 5px !important;
                padding: 5px !important;
            `;
        }

        const style = document.createElement('style');
        style.textContent = `
            body {
                overflow: hidden !important;
            }

            #gamechat {
                width: ${CONFIG.chatWidth} !important;
            }

            .actions-buttons.svelte-nqamr4 {
                display: flex !important;
                justify-content: space-around !important;
                align-items: center !important;
                height: ${CONFIG.actionsHeight} !important;
                gap: 8px !important;
            }

            .tooltip-anchor.svelte-1my6515 {
                position: relative !important;
                width: 100% !important;
                height: 100% !important;
            }

            .action.svelte-5ea9xh {
                width: ${CONFIG.buttonSize} !important;
                height: ${CONFIG.buttonSize} !important;
                padding: 0 !important;
                margin: 0 8px !important;
                border: none !important;
                background: none !important;
                cursor: pointer !important;
                position: relative !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
            }

            .action-img.svelte-5ea9xh {
                width: ${CONFIG.iconSize} !important;
                height: ${CONFIG.iconSize} !important;
                display: block !important;
                margin: 0 !important;
                transition: transform 0.2s ease !important;
            }

            .action.svelte-5ea9xh:hover .action-img.svelte-5ea9xh {
                transform: scale(1.1);
            }

            .parameter.svelte-v5xjc1 {
                margin: 2px 0 !important;
            }

            .skill.flex-row {
                margin: 2px 0 !important;
            }
        `;
        document.head.appendChild(style);
    }
})();