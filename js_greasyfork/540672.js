// ==UserScript==
// @name         Standard Notes - ブラウザの「戻る」で前画面に戻れるようにする ⏪
// @name:ja      Standard Notes - ブラウザの「戻る」で前画面に戻れるようにする ⏪
// @name:en      Standard Notes - Enable Browser Back to Previous View ⏪
// @name:zh-CN   Standard Notes - 浏览器返回操作返回前一个视图 ⏪
// @name:zh-TW   Standard Notes - 使用瀏覽器返回鍵回到前一畫面 ⏪
// @name:ko      Standard Notes - 브라우저 뒤로가기 시 이전 화면으로 이동 ⏪
// @name:fr      Standard Notes - Revenir à l’écran précédent avec le bouton retour ⏪
// @name:es      Standard Notes - Volver a la vista anterior con el botón del navegador ⏪
// @name:de      Standard Notes - Mit dem Zurück-Button zur vorherigen Ansicht ⏪
// @name:pt-BR   Standard Notes - Voltar para a tela anterior com o botão do navegador ⏪
// @name:ru      Standard Notes - Переход к предыдущему экрану по кнопке Назад ⏪
// @version      1.2.0
// @description         Makes the browser back button return to the previous screen inside Standard Notes (e.g. notes, tags, settings), instead of closing the tab.
// @description:ja      Standard Notesのウェブ版で、ブラウザの「戻る」操作によりノート一覧・タグ・検索・設定などの前画面に戻れるようにします。タブが閉じることなく、自然なナビゲーションを実現します。
// @description:en      Makes the browser back button return to the previous screen inside Standard Notes (e.g. notes, tags, settings), instead of closing the tab.
// @description:zh-CN   让 Standard Notes 中的浏览器返回操作跳转到前一个页面（如笔记、标签、设置），而不是关闭标签页。
// @description:zh-TW   讓 Standard Notes 中的瀏覽器返回操作回到前一頁（如筆記、標籤、設定），而非關閉分頁。
// @description:ko      Standard Notes 웹에서 브라우저 뒤로가기를 누르면 이전 화면(노트, 태그, 설정 등)으로 돌아가며, 탭이 닫히지 않습니다。
// @description:fr      Permet au bouton retour du navigateur de revenir à l’écran précédent dans Standard Notes (notes, tags, paramètres), au lieu de fermer l’onglet.
// @description:es      Hace que el botón de retroceso del navegador vuelva a la pantalla anterior en Standard Notes (notas, etiquetas, configuración), en lugar de cerrar la pestaña.
// @description:de      Lässt den Browser-Zurück-Button in Standard Notes zur vorherigen Ansicht zurückkehren (z. B. Notizen, Tags, Einstellungen), ohne den Tab zu schließen.
// @description:pt-BR   Faz o botão de voltar do navegador retornar à tela anterior no Standard Notes (notas, tags, configurações), sem fechar a aba.
// @description:ru      Делает кнопку «Назад» в браузере работающей в Standard Notes — возвращает к предыдущему экрану (заметки, теги, настройки) вместо закрытия вкладки.
// @namespace    https://github.com/koyasi777/standardnotes-mobile-back-fix
// @author       koyasi777
// @match        https://app.standardnotes.com/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @homepageURL  https://github.com/koyasi777/standardnotes-mobile-back-fix
// @supportURL   https://github.com/koyasi777/standardnotes-mobile-back-fix/issues
// @icon         https://app.standardnotes.com/favicon/favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/540672/Standard%20Notes%20-%20%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%81%AE%E3%80%8C%E6%88%BB%E3%82%8B%E3%80%8D%E3%81%A7%E5%89%8D%E7%94%BB%E9%9D%A2%E3%81%AB%E6%88%BB%E3%82%8C%E3%82%8B%E3%82%88%E3%81%86%E3%81%AB%E3%81%99%E3%82%8B%20%E2%8F%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/540672/Standard%20Notes%20-%20%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%81%AE%E3%80%8C%E6%88%BB%E3%82%8B%E3%80%8D%E3%81%A7%E5%89%8D%E7%94%BB%E9%9D%A2%E3%81%AB%E6%88%BB%E3%82%8C%E3%82%8B%E3%82%88%E3%81%86%E3%81%AB%E3%81%99%E3%82%8B%20%E2%8F%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    // The selector for ANY "back to list" button.
    // Both the header and footer buttons share this stable aria-label identifier.
    const backButtonSelector = 'button[aria-label="Go to items list"]';

    // A flag to prevent duplicate history pushes
    let isHistoryStatePushed = false;

    console.log('Standard Notes Back-Fix script loaded (v1.2).');

    /**
     * This function checks if a "Go to items list" button is visible anywhere on the page.
     * If so, it pushes a state to the browser history. This allows us to intercept the 'popstate'
     * event (the back button action) without the browser actually leaving the page.
     * This logic is more robust as it doesn't depend on a specific container like a title bar.
     */
    const addHistoryStateIfNavigableBack = () => {
        const backButton = document.querySelector(backButtonSelector);

        if (backButton && !isHistoryStatePushed) {
            // A back button is visible, which means we are in a view we can navigate back from.
            // Push a new state to the history stack.
            history.pushState({ snBackFix: true }, '');
            isHistoryStatePushed = true;
            console.log('Back-navigable view detected, history state pushed.');
        } else if (!backButton && isHistoryStatePushed) {
            // No back button is found, so we are likely on the main list view. Reset the flag.
            // This happens when the user navigates back to the list.
            isHistoryStatePushed = false;
            console.log('Main view detected, history state reset.');
        }
    };

    /**
     * This is the handler for the 'popstate' event, which fires when the user
     * navigates through their session history (e.g., using the back/forward button).
     * @param {PopStateEvent} event - The popstate event object.
     */
    const handleBackButton = (event) => {
        // We only care about this event if our custom state was just popped.
        if (!isHistoryStatePushed) {
            return;
        }

        console.log('popstate event detected.');
        const backButton = document.querySelector(backButtonSelector);

        // If the back button exists, it means we can programmatically navigate back.
        if (backButton) {
            console.log('Back button found. Simulating click.');
            // Simulate a click on the app's own back button.
            // This triggers the app's native navigation logic.
            backButton.click();
            // Reset the flag immediately after handling it.
            isHistoryStatePushed = false;
        }
    };

    // Listen for the popstate event.
    window.addEventListener('popstate', handleBackButton);

    // Because Standard Notes is a Single Page Application (SPA), the content
    // is loaded dynamically. We need to monitor the DOM for changes to detect
    // when a back button appears or disappears.
    const observer = new MutationObserver(addHistoryStateIfNavigableBack);

    // Start observing the entire document for additions/removals of elements.
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
