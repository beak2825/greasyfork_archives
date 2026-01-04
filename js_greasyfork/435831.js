// ==UserScript==
// @name         Change page size or font size with keyboard shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Make page narrower/wider or change the font size with keyboard shortcuts
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @author       https://greasyfork.org/en/users/728793-keyboard-shortcuts
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435831/Change%20page%20size%20or%20font%20size%20with%20keyboard%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/435831/Change%20page%20size%20or%20font%20size%20with%20keyboard%20shortcuts.meta.js
// ==/UserScript==

/*jshint esversion: 9 */
(function() {
    'use strict';

    /* change the values below ⬇⬇⬇⬇ to configure the script */
    const INITIAL_WIDTH_PIXELS = 800; // how many pixels to make the document body when the initial shortcut is pressed
    const INITIAL_FONT_SIZE = 18; // what font size (in 'pt') to set when the initial shortcut is pressed
    const CHANGE_WIDTH_BY_PIXELS = 100; // how much to increase/decrease the width by when "wider" and "narrower" shortcuts are used.

    const ARROW_MODIFIERS = navigator.platform.startsWith('Mac') ?
        { // on mac, arrow modifiers are Alt + Shift
            needsModifierAlt: true,
            needsModifierShift: true,
        } :
        { // on windows, arrow modifiers are Ctrl + Shift
            needsModifierCtrl: true,
            needsModifierShift: true,
        };

    const SHORTCUT_CONFIGS = {
        /*
        for each shortcut, you can use an entry under "letter" and modifiers like "needsModifierAlt", "needsModifierShift", "needsModifierCtrl", and "needsModifierMeta".
        ("needsModifierMeta" is the Windows key on Windows and the Command key on macOS).

        The "Arrow modifiers" are defined above, they are Alt + Shift on macOS and Ctrl + Shift everywhere else.
        e.g. to make the page wider press "Ctrl + Shift + Right Arrow" on Windows and "Alt + Shift + Right Arrow" on macOS.

        For non-letter shortcuts such as the arrow keys, you can use the JavaScript keyCode under "code".
        */
        initial: { // add style block and make the body narrow when Alt + N is pressed:
            letter: 'n',
            needsModifierAlt: true,
        },
        wider: { // after the style block has been added, make the body wider when arrow modifiers + Right Arrow is pressed:
            code: 'ArrowRight',
            ... ARROW_MODIFIERS
        },
        narrower: { // after the style block has been added, make the body narrower when arrow modifiers + Left Arrow is pressed:
            code: 'ArrowLeft',
            ... ARROW_MODIFIERS
        },
        larger_font: { // after the style block has been added, make the font larger when arrow modifiers + Up Arrow is pressed:
            code: 'ArrowUp',
            ... ARROW_MODIFIERS
        },
        smaller_font: { // after the style block has been added, make the font smaller when arrow modifiers + Down Arrow is pressed:
            code: 'ArrowDown',
            ... ARROW_MODIFIERS
        },
    };
    /* change the values above ⬆⬆⬆⬆ to configure the script */


    const STYLE_BLOCK_ID = '__narrow_body_style';

    function getStyleBody(width, fontSize) {
        return 'body {width: ' + width + 'px; font-size: ' + fontSize + 'pt; margin-left: auto; margin-right: auto }';
    }

    function matchesShortcut(e, shortcut) {
        const expectedCode = 'code' in shortcut ? shortcut.code : 'Key' + shortcut.letter.toUpperCase();
        return e.code === expectedCode &&
            e.altKey === (shortcut.needsModifierAlt === true) &&
            e.shiftKey === (shortcut.needsModifierShift === true) &&
            e.ctrlKey === (shortcut.needsModifierCtrl === true) &&
            e.metaKey === (shortcut.needsModifierMeta === true);
    }

    function updateWidthAndFontSize(styleBlock, newWidth, newFontSize) {
        window.__custom_width = newWidth;
        window.__custom_font_size = newFontSize;
        styleBlock.innerHTML = getStyleBody('' + window.__custom_width, '' + window.__custom_font_size);
    }

    function createStyleBlockIfNeeded() {
        const currentStyleBlock = document.getElementById(STYLE_BLOCK_ID);
        if (currentStyleBlock) {
            return currentStyleBlock;
        }
        const newStyleBlock = document.createElement('style');
        newStyleBlock.setAttribute('id', STYLE_BLOCK_ID);
        document.body.appendChild(newStyleBlock);
        return newStyleBlock;
    }

    function isTextField(target) {
        return target.type && (target.type === 'textarea' || target.type === 'input');
    }

    function handleEvent(e) {
        if(e.target.getAttribute("contenteditable") == "true" || isTextField(e.target)) {
            return;
        }

        if (matchesShortcut(e, SHORTCUT_CONFIGS.initial)) {
            const styleBlock = createStyleBlockIfNeeded();
            updateWidthAndFontSize(styleBlock, INITIAL_WIDTH_PIXELS, INITIAL_FONT_SIZE);
        } else {
            const styleBlock = document.getElementById(STYLE_BLOCK_ID);
            const currentWidth = window.__custom_width;
            const currentFontSize = window.__custom_font_size;
            if (!styleBlock || currentWidth === undefined) {
                return;
            }
            if (matchesShortcut(e, SHORTCUT_CONFIGS.wider)) {
                updateWidthAndFontSize(styleBlock, currentWidth + CHANGE_WIDTH_BY_PIXELS, currentFontSize);
            } else if (matchesShortcut(e, SHORTCUT_CONFIGS.narrower)) {
                updateWidthAndFontSize(styleBlock, Math.max(currentWidth - CHANGE_WIDTH_BY_PIXELS, 0), currentFontSize);
            } else if (matchesShortcut(e, SHORTCUT_CONFIGS.larger_font)) {
                updateWidthAndFontSize(styleBlock, currentWidth, currentFontSize + 1);
            } else if (matchesShortcut(e, SHORTCUT_CONFIGS.smaller_font)) {
                updateWidthAndFontSize(styleBlock, currentWidth, Math.max(1, currentFontSize - 1));
            }
            e.stopPropagation();
        }
    }
    addEventListener("keypress", handleEvent);
    addEventListener("keydown", handleEvent);
})();
