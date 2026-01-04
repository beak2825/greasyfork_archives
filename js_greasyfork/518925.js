// ==UserScript==
// @name:ko         구글북스 복사 활성화
// @name            Google Books Allow copy
// @namespace       https://ndaesik.tistory.com/
// @version         1
// @description:ko  -
// @description     -
// @match           *://play.google.com/books/*
// @match           *://books.googleusercontent.com/books/reader/frame*
// @icon            https://www.gstatic.com/images/branding/product/2x/play_books_96dp.png
// @grant           GM_setClipboard
// @run-at          document-idle
// @downloadURL https://update.greasyfork.org/scripts/518925/Google%20Books%20Allow%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/518925/Google%20Books%20Allow%20copy.meta.js
// ==/UserScript==

(function() {
    const isIframe = window.location.href.includes('books.googleusercontent.com/books/reader/frame');

    if (isIframe) {
        const style = document.createElement('style');
        style.textContent = `* {user-select: text !important} .overlay, .selection-overlay, .page-overlay {display: none !important}`;
        document.head.appendChild(style);

        document.addEventListener('copy', e => e.stopPropagation(), true);
        document.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                e.preventDefault();
                const text = window.getSelection().toString().trim();
                if (text) window.parent.postMessage({ type: 'COPY_TEXT', text }, '*');
            }
        }, true);
    } else {
        window.addEventListener('message', e => {
            if (e.data?.type === 'COPY_TEXT' && e.data.text) {
                GM_setClipboard(e.data.text);
            }
        });
    }
})();