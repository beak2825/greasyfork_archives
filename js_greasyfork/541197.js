// ==UserScript==
// @name         Item labels
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Ustawienie własnego opisu na okienku przedmiotu.
// @author       Varyn, Boowhat
// @match        https://*.margonem.pl/
// @match        http*://*.margonem.pl/
// @exclude      http*://margonem.*/*
// @exclude      http*://www.margonem.*/*
// @exclude      http*://new.margonem.*/*
// @exclude      http*://forum.margonem.*/*
// @exclude      http*://commons.margonem.*/*
// @exclude      http*://dev-commons.margonem.*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541197/Item%20labels.user.js
// @updateURL https://update.greasyfork.org/scripts/541197/Item%20labels.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const RETRY_INTERVAL_MS = 500;

    const init = () => {
        try {
            if (typeof Engine === 'undefined' || typeof Engine.communication === 'undefined') {
                setTimeout(init, RETRY_INTERVAL_MS);
                return;
            }

            if (typeof __build !== "object" && typeof __bootNI === "undefined") {
                setTimeout(init, RETRY_INTERVAL_MS);
                return;
            }

            const equipmentBag = document.querySelector('.interface-element-equipment-with-additional-bag.equipment-wrapper.ui-droppable');
            const inventoryGrid = document.querySelector('.inventory-grid.ui-droppable');

            if (!equipmentBag && !inventoryGrid) {
                setTimeout(init, RETRY_INTERVAL_MS);
                return;
            }

            initCSS();
            initialDrawLabels();
            setupContextMenuInterceptor();

        } catch (error) {
            setTimeout(init, RETRY_INTERVAL_MS);
        }
    };

    const initCSS = () => {
        const modalHTML = `
            <div class="custom-modal-bg">
                <div class="custom-modal">
                    <input type="text" id="custom-item-name-input" autocomplete="off" />
                    <div class="buttons">
                        <button class="cancel">Anuluj</button>
                        <button class="clear">Usuń</button>
                        <button class="ok">Zmień</button>
                    </div>
                </div>
            </div>
        `;

        const styleCSS = `
            <style id="item-labels-style">
            .item-label {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                max-width: 32px;
                padding: 2px;
                box-sizing: border-box;
                display: flex;
                align-items: flex-start;
                justify-content: center;
                text-align: center;
                color: white;
                word-break: auto-phrase;
                overflow-wrap: break-word;
                white-space: normal;
                overflow: hidden;
                background: linear-gradient(to bottom, rgb(0 0 0 / 0%), rgb(0 0 0));
                text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 1px 1px 1px black;
                pointer-events: none;
                z-index: 10;
            }
            .inventory-item.has-item-label .item-label {
                font-size: 8px;
                line-height: 8px;
                max-height: 13px;
            }
            .inventory-item.has-item-label.lines-2 .item-label {
                font-size: 7px;
                line-height: 8px;
                max-height: 20px;
            }
            .inventory-item.has-item-label.lines-3-plus .item-label {
                font-size: 7px;
                line-height: 7px;
                max-height: 24px;
            }
            .item .amount {
                font-size: 10px;
                color: white;
                text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 1px 1px 1px black;
                z-index: 5;
                position: absolute;
                bottom: 0;
                right: 0;
                top: auto;
                left: auto;
            }
            .inventory-item.has-item-label .amount {
                bottom: 20px;
            }
            .cooldown{
            text-shadow: -2px 0 2px black, 0 2px 2px black, 2px 0 2px black, 1px 1px 2px black;
            }
            .inventory-item.has-item-label.lines-1 .cooldown {
                position: absolute;
                line-height: 11px;
                right: auto;
                left: auto;
                color: #fff;
                white-space: nowrap;
                z-index: 5;
                text-shadow: -2px 0 2px black, 0 2px 2px black, 2px 0 2px black, 1px 1px 2px black;
                pointer-events: none;
                top: 7px;
            }
            .inventory-item.has-item-label.lines-2 .cooldown {
                position: absolute;
                line-height: 16px;
                right: auto;
                left: auto;
                color: #fff;
                white-space: nowrap;
                z-index: 5;
                text-shadow: -2px 0 2px black, 0 2px 2px black, 2px 0 2px black, 1px 1px 2px black;
                pointer-events: none;
                top: 0px;
                font-size: 10px;
            }
            .inventory-item.has-item-label.lines-3-plus .cooldown {
                position: absolute;
                line-height: 12px;
                right: auto;
                left: auto;
                color: #fff;
                white-space: nowrap;
                z-index: 5;
                text-shadow: -2px 0 2px black, 0 2px 2px black, 2px 0 2px black, 1px 1px 2px black;
                pointer-events: none;
                top: 0px;
                font-size: 9px;
            }
            .custom-modal-bg {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 99999;
            }
            .custom-modal {
                background: #00000080;
                padding: 15px;
                border-radius: 8px;
                color: white;
                width: 200px;
                max-width: 90%;
                box-shadow: 0 0 15px black;
                font-family: Arial, sans-serif;
                text-align: center;
            }
            .custom-modal input[type="text"] {
                width: 100%;
                padding: 6px;
                margin-bottom: 10px;
                border-radius: 4px;
                border: none;
                font-size: 13px;
                box-sizing: border-box;
                background: #bfbfbf;
                color: #333;
            }
            .custom-modal .buttons {
                display: flex;
                justify-content: space-between;
                gap: 8px;
            }
            .custom-modal button {
                flex: 1;
                padding: 5px 10px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                font-weight: normal;
                user-select: none;
                transition: background-color 0.2s ease;
            }
            .custom-modal button.ok {
                background-color: #007504;
                color: white;
            }
            .custom-modal button.ok:hover {
                background-color: #00b306;
            }
            .custom-modal button.cancel {
                background-color: #990a00;
                color: white;
            }
            .custom-modal button.cancel:hover {
                background-color: #cc0e00;
            }
            .custom-modal button.clear {
                background-color: #595959;
                color: white;
            }
            .custom-modal button.clear:hover {
                background-color: #737373;
            }
            </style>
        `;

        if (!$('style#item-labels-style').length) {
            $('head').append(styleCSS);
        }
        if (!$('.custom-modal-bg').length) {
            $('body').append(modalHTML);
        }
    };

    function showRenameModal(defaultValue = '') {
        return new Promise(resolve => {
            const $modalBg = $('.custom-modal-bg');
            const $input = $('#custom-item-name-input');
            const $ok = $modalBg.find('button.ok');
            const $clear = $modalBg.find('button.clear');
            const $cancel = $modalBg.find('button.cancel');

            $input.val(defaultValue);
            $modalBg.css({ display: 'flex', opacity: 0 }).animate({ opacity: 1 }, 150);
            $input.focus();

            const cleanUp = () => {
                $ok.off('click');
                $clear.off('click');
                $cancel.off('click');
                $input.off('keydown');
                $modalBg.off('click');
                $modalBg.fadeOut(150, () => {
                    $modalBg.css('display', 'none');
                });
            };

            $ok.on('click', () => { cleanUp(); resolve($input.val()); });
            $clear.on('click', () => { cleanUp(); resolve(''); });
            $cancel.on('click', () => { cleanUp(); resolve(null); });

            $input.on('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); $ok.trigger('click'); }
                else if (e.key === 'Escape') { e.preventDefault(); $cancel.trigger('click'); }
            });

            $modalBg.on('click', (e) => {
                if (e.target === $modalBg[0]) { cleanUp(); resolve(null); }
            });
        });
    }

    const updateItemOverlays = () => {
        requestAnimationFrame(() => {
            $('.inventory-item').each(function () {
                const $item = $(this);
                const $label = $item.find('.item-label');
                const hasLabel = $label.length > 0;
                const $cooldown = $item.find('.cooldown');
                const hasCooldownText = $cooldown.length > 0 && $cooldown.text().trim() !== '';

                $item.removeClass('has-item-label lines-1 lines-2 lines-3-plus has-wrapped-label has-visible-cooldown');

                if (hasLabel) {
                    const labelElement = $label[0];
                    const labelText = labelElement.textContent.trim();

                    const $tempLabel = $('<div></div>')
                        .css({
                            position: 'absolute', left: '-9999px', top: '-9999px', visibility: 'hidden',
                            'white-space': 'normal', 'word-break': 'break-word', 'max-width': '32px',
                            'font-size': '8px', 'line-height': '8px', 'padding': '2px', 'box-sizing': 'border-box',
                            'overflow': 'visible', 'max-height': 'none'
                        })
                        .text(labelText)
                        .appendTo('body');

                    const baseLineHeight = 8;
                    const computedTempHeight = $tempLabel[0].offsetHeight;
                    const contentHeight = computedTempHeight - (2 * 2);
                    let lineCount = 0;
                    if (contentHeight > 0) {
                        lineCount = Math.ceil(contentHeight / baseLineHeight);
                    } else {
                        lineCount = 1;
                    }
                    $tempLabel.remove();

                    if (lineCount <= 1) {
                        $item.addClass('lines-1');
                    } else if (lineCount === 2) {
                        $item.addClass('lines-2');
                    } else {
                        $item.addClass('lines-3-plus');
                    }

                    const isLabelWrapped = lineCount > 1;
                    $item.addClass('has-item-label');
                    $item.toggleClass('has-wrapped-label', isLabelWrapped);
                }
                $item.toggleClass('has-visible-cooldown', hasCooldownText);
            });
        });
    };

    const intercept = (obj, key, cb) => {
        const originalMethod = obj[key];
        obj[key] = (...args) => {
            cb(...args);
            return originalMethod.apply(obj, args);
        };
    };

    const drawLabels = () => {
        const itemNames = GM_getValue('itemnames', {});
        if (typeof Engine.items === 'undefined' || typeof Engine.items.fetchLocationItems !== 'function') {
            return false;
        }

        const items = Engine.items.fetchLocationItems("g");
        const hasAnyItems = items && items.length > 0;
        const hasAnyDomItems = $('.inventory-item').length > 0;

        if (Object.keys(itemNames).length > 0 && !hasAnyItems && !hasAnyDomItems) {
            return false;
        }

        $('.item-label').remove();
        $('.inventory-item').removeClass('has-item-label lines-1 lines-2 lines-3-plus has-wrapped-label');

        if (!hasAnyItems) {
            return true;
        }

        items.forEach(item => {
            const name = itemNames[item.id.toString()];
            if (!name) return;

            const $itemDiv = $(`.item-id-${item.id}`);
            if (!$itemDiv.length) {
                return;
            }

            const label = $(`<div class="item-label">${name}</div>`);
            $itemDiv.append(label);
        });

        updateItemOverlays();
        return true;
    };

    const initialDrawLabels = () => {
        if (!drawLabels()) {
            setTimeout(initialDrawLabels, RETRY_INTERVAL_MS);
        }
    };

    const setupContextMenuInterceptor = () => {
        intercept(Engine.interface, 'showPopupMenu', (options, event) => {
            const id = event.target?.className?.match(/item-id-(\d+)/)?.[1];
            if (!id) return;

            const item = Engine.items.getItemById(id);
            if (!item) return;

            options.push(['Zmień nazwę', async () => {
                const itemNames = GM_getValue('itemnames', {});
                const currentName = itemNames[item.id] || '';
                const newName = await showRenameModal(currentName);

                if (newName === null) {
                    drawLabels();
                    return;
                }

                if (newName.trim() === '') {
                    delete itemNames[item.id];
                } else {
                    itemNames[item.id] = newName.trim();
                }
                GM_setValue('itemnames', itemNames);
                drawLabels();
                $('.popup-menu').removeClass('show');
            }, { button: { cls: 'menu-item' } }]);

            queueMicrotask(() => {
                const $popup = $('.popup-menu.show');
                const $destroy = $popup.find('.menu-item--red');
                const $rename = $popup.find('.menu-item').filter((_, el) => $(el).text() === 'Zmień nazwę');
                if ($rename.length && $destroy.length) {
                    $rename.insertBefore($destroy);
                }
            });
        });
    };

    init();

})();