// ==UserScript==
// @name         Perplexity Remove Uploaded File Hotkey
// @namespace    https://blog.valley.town/@zeronox
// @version      0.1
// @description  첨부 파일 삭제 단축키 Alt+D로 지정.
// @author       zeronox
// @license      MIT
// @match        https://www.perplexity.ai/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=perplexity.ai
// @downloadURL https://update.greasyfork.org/scripts/547351/Perplexity%20Remove%20Uploaded%20File%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/547351/Perplexity%20Remove%20Uploaded%20File%20Hotkey.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key.toLowerCase() === 'd') {
            event.preventDefault();
            const removeButton = document.querySelector('button[data-testid="remove-uploaded-file"]');
            if (removeButton) {
                removeButton.click();
                console.log('단축키(Alt+D)로 파일 제거 버튼을 클릭했습니다.');
            } else {
                console.log('단축키를 눌렀지만 파일 제거 버튼을 찾을 수 없습니다.');
            }
        }
    });
})();