// ==UserScript==
// @name             Standard Notes UI Cleaner
// @name:ja          Standard Notes UI クリーナー
// @name:en          Standard Notes UI Cleaner
// @name:zh-CN       Standard Notes 界面清理器
// @name:zh-TW       Standard Notes 介面清理器
// @name:ko          Standard Notes UI 클리너
// @name:fr          Nettoyeur d'interface Standard Notes
// @name:es          Limpiador de interfaz de Standard Notes
// @name:de          Standard Notes UI-Reiniger
// @name:pt-BR       Limpador de UI do Standard Notes
// @name:ru          Очистка интерфейса Standard Notes
// @version          1.5.5
// @description      A userscript to hide premium prompts and other clutter from the Standard Notes web UI for free users.
// @description:ja   Standard NotesのWeb UIから、無料ユーザーには不要なプレミアム案内やボタンを非表示にして、すっきりとした画面に整えます。
// @description:zh-CN  一个用户脚本，用于隐藏 Standard Notes 网页界面中对免费用户无用的高级功能提示。
// @description:zh-TW  用於隱藏 Standard Notes 網頁介面中針對免費用戶的進階功能提示的使用者腳本。
// @description:ko     무료 사용자를 위해 Standard Notes 웹 UI에서 프리미엄 메시지와 기타 요소를 숨깁니다。
// @description:fr     Script utilisateur pour masquer les messages premium et autres éléments gênants dans l'interface web de Standard Notes pour les utilisateurs gratuits.
// @description:es     Script de usuario para ocultar mensajes premium y otros elementos en la interfaz web de Standard Notes para usuarios gratuitos.
// @description:de     Userscript zum Ausblenden von Premium-Hinweisen und anderen UI-Elementen für kostenlose Nutzer in Standard Notes.
// @description:pt-BR  Um userscript para ocultar avisos premium e outros elementos da interface web do Standard Notes para usuários gratuitos.
// @description:ru     Скрипт для скрытия премиум-уведомлений и лишних элементов интерфейса Standard Notes для бесплатных пользователей.
// @namespace        https://github.com/koyasi777/standardnotes-ui-cleaner
// @author           koyasi777
// @match            https://app.standardnotes.com/*
// @grant            none
// @run-at           document-idle
// @license          MIT
// @homepageURL      https://github.com/koyasi777/standardnotes-ui-cleaner
// @supportURL       https://github.com/koyasi777/standardnotes-ui-cleaner/issues
// @icon             https://app.standardnotes.com/favicon/favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/540666/Standard%20Notes%20UI%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/540666/Standard%20Notes%20UI%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Finds and hides the targeted UI elements based on user's request.
     * It uses specific, language-independent selectors and element properties to avoid accidentally hiding wrong elements.
     * Instead of removing elements, it sets their display style to 'none', which is safer for single-page applications.
     */
    function cleanupUI() {

        // --- 1. Hide "Unlock features" buttons ---
        try {
            const unlockButtons = Array.from(document.querySelectorAll('button'));
            unlockButtons.forEach(button => {
                if (button.textContent.trim() === 'Unlock features' || button.textContent.trim() === 'Upgrade Features') {
                    // Hide the parent container, or the button itself if it has no specific parent.
                    const parentToHide = button.closest('.grid.p-4') || button.parentElement;
                    if (parentToHide && parentToHide.style.display !== 'none') {
                        parentToHide.style.display = 'none';
                    }
                }
            });
        } catch (e) {
            console.error("SN Cleaner: Failed to hide 'Unlock/Upgrade features' button.", e);
        }


        // --- 2. Hide "Folders" label and "Files" view ---
        try {
            document.querySelectorAll('.section-title-bar-header .title').forEach(titleDiv => {
                const boldSpan = titleDiv.querySelector('span.font-bold');
                const label = titleDiv.querySelector('label');
                if (boldSpan && label && label.style.display !== 'none') {
                    label.style.display = 'none';
                }
            });

            const filesView = document.querySelector('#react-tag-files');
            if (filesView) {
                const buttonContainer = filesView.closest('button');
                if (buttonContainer && buttonContainer.style.display !== 'none') {
                    buttonContainer.style.display = 'none';
                }
            }
        } catch (e) {
            console.error("SN Cleaner: Failed to hide 'Folder/Files' elements.", e);
        }


        // --- 3. Hide "Change note type" button in the editor header ---
        try {
            const changeTypeButton = document.querySelector('button[aria-label*="(Ctrl+Shift+/)"]');
            if (changeTypeButton) {
                const parentDiv = changeTypeButton.parentElement;
                if (parentDiv && parentDiv.style.display !== 'none') {
                    parentDiv.style.display = 'none';
                }
            }
        } catch (e) {
            console.error("SN Cleaner: Failed to hide 'Change note type' button.", e);
        }

        // --- 4. Hide "Notes" button in the sort/filter popover menu ---
        // This logic is now handled by the more robust logic in section 5.

        // --- 5. In popovers, hide non-Global targets and force "Global" selection ---
        try {
            // Find the header for the preferences section using a language-agnostic regex.
            const prefHeader = Array.from(document.querySelectorAll('div.my-1.px-3.text-base.font-semibold'))
                .find(div => /Preferences for|次の設定対象/.test(div.textContent.trim()));

            if (prefHeader) {
                const buttonContainer = prefHeader.nextElementSibling;
                if (buttonContainer && buttonContainer.classList.contains('justify-between')) {

                    let globalButton = null;
                    let aTagButtonWasSelected = false;

                    const buttons = buttonContainer.querySelectorAll('button');

                    buttons.forEach(button => {
                        const isTagButton = button.querySelector('svg') !== null;
                        const isResetButton = button.textContent.trim() === 'Reset';
                        // Identify the "Global" button using a regex to be language-agnostic.
                        const isGlobalButton = /Global|グローバル/.test(button.textContent.trim());

                        if (isGlobalButton) {
                            globalButton = button; // Remember the Global button element.
                        }

                        // Logic for buttons to be hidden (Tags and Reset).
                        if (isTagButton || isResetButton) {
                            // Best Practice: Before hiding, check if this tag button was the selected one.
                            // The 'bg-info' class is a reliable indicator for the selected state.
                            if (isTagButton && button.classList.contains('bg-info')) {
                                aTagButtonWasSelected = true;
                            }
                            // Hide the button.
                            if (button.style.display !== 'none') {
                                button.style.display = 'none';
                            }
                        }
                    });

                    // After inspecting all buttons, if a (now hidden) tag button was selected,
                    // we must programmatically switch the application's state to "Global".
                    if (globalButton && aTagButtonWasSelected) {
                        // The most robust way to change app state is to simulate a user click.
                        // This ensures all of the app's internal event listeners fire correctly.
                        // We also check that the global button isn't already selected to avoid redundant actions.
                        if (!globalButton.classList.contains('bg-info')) {
                            globalButton.click();
                        }
                    }
                }
            }
        } catch (e) {
            console.error("SN Cleaner: Failed to handle popover preference buttons.", e);
        }

        // --- 6. Hide "Create smart view" button ("スマートビューを作成") ---
        try {
            const plusIconPath = 'M13.6 8a.8.8 0 0 1-.8.8h-4v4a.8.8 0 1 1-1.6 0v-4h-4a.8.8 0 1 1 0-1.6h4v-4a.8.8 0 0 1 1.6 0v4h4a.8.8 0 0 1 .8.8Z';
            const plusIconSelector = `path[d="${plusIconPath}"]`;

            document.querySelectorAll('.section-title-bar-header').forEach(header => {
                const plusIcon = header.querySelector(plusIconSelector);
                if (plusIcon) {
                    const buttonToHide = plusIcon.closest('button');
                    if (buttonToHide && buttonToHide.style.display !== 'none') {
                        // 正規表現を使用して 'tag' または 'タグ' を含まないことを確認
                        const label = buttonToHide.getAttribute('aria-label') || '';
                        if (!/tag|タグ/i.test(label)) {
                            buttonToHide.style.display = 'none';
                        }
                    }
                }
            });
        } catch (e) {
            console.error("SN Cleaner: Failed to hide 'Create smart view' button.", e);
        }

        // --- 7. Hide premium theme options in popovers ---
        try {
            // This path data specifically identifies the star-shaped "premium" icon.
            // Using this is more robust than relying on class names.
            const premiumIconPath = 'M8.55 3h2.9l-.573 5.537 4.674-3.248L17 7.711 11.754 10 17 12.289l-1.45 2.422-4.673-3.248.572 5.537H8.551l.572-5.537-4.674 3.248L3 12.289 8.246 10 3 7.711l1.45-2.422 4.673 3.248L8.551 3Z';
            const premiumIconSelector = `svg path[d="${premiumIconPath}"]`;

            document.querySelectorAll(premiumIconSelector).forEach(iconPath => {
                // Find the closest parent <li> element to hide the entire menu item.
                const listItemToHide = iconPath.closest('li');
                if (listItemToHide && listItemToHide.style.display !== 'none') {
                    listItemToHide.style.display = 'none';
                }

                // Also check for the "Dynamic panels" button which uses the same icon
                const buttonToHide = iconPath.closest('button[role="menuitemcheckbox"]');
                 if (buttonToHide && buttonToHide.style.display !== 'none') {
                    // This button is not inside an `li`, so we hide the button itself.
                    buttonToHide.style.display = 'none';
                }
            });
        } catch (e) {
            console.error("SN Cleaner: Failed to hide premium theme options.", e);
        }

        // --- 8. Hide "Change note type" in popover menu (and its container) ---
        try {
            // This path data uniquely identifies the "Change note type" icon.
            const noteTypeIconPath = 'M15.833 4.167v1.666H12.5V4.167h3.333Zm-8.333 0v5H4.167v-5H7.5Zm8.333 6.666v5H12.5v-5h3.333ZM7.5 14.167v1.666H4.167v-1.666H7.5ZM17.5 2.5h-6.667v5H17.5v-5Zm-8.333 0H2.5v8.333h6.667V2.5ZM17.5 9.167h-6.667V17.5H17.5V9.167ZM9.167 12.5H2.5v5h6.667v-5Z';

            // Best Practice: Use the :has() pseudo-class to select the parent section wrapper directly.
            // This selector finds a 'div' that has the 'my-4' class AND contains the specific SVG icon path.
            // This is more robust than multi-step traversal (e.g., find icon -> closest parent).
            // Note: The colon in a class name like 'md:my-2' must be escaped with '\\' in querySelector.
            const sectionSelector = `.my-4.md\\:my-2:has(svg path[d="${noteTypeIconPath}"])`;

            document.querySelectorAll(sectionSelector).forEach(sectionToHide => {
                if (sectionToHide.style.display !== 'none') {
                    sectionToHide.style.display = 'none';
                }
            });
        } catch (e) {
            console.error("SN Cleaner: Failed to hide 'Change note type' menu section.", e);
        }
    }

    // A MutationObserver re-runs the cleanup function whenever the page content changes.
    const observer = new MutationObserver(() => {
        cleanupUI();
    });

    // Start observing the entire document body for structural changes.
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Run once on initial load.
    cleanupUI();

})();
