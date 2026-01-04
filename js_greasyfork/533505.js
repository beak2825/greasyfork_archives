// ==UserScript==
// @name         Open Link Under Mouse - Ctrl+Shift+Z
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Mở liên kết tại vị trí con trỏ chuột hiện tại trong thẻ mới bằng Ctrl + Shift + Z
// @author       Bạn
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533505/Open%20Link%20Under%20Mouse%20-%20Ctrl%2BShift%2BZ.user.js
// @updateURL https://update.greasyfork.org/scripts/533505/Open%20Link%20Under%20Mouse%20-%20Ctrl%2BShift%2BZ.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentElement = null;

    // Cập nhật phần tử dưới chuột
    document.addEventListener('mousemove', function (e) {
        currentElement = document.elementFromPoint(e.clientX, e.clientY);
    });

    // Lắng nghe tổ hợp phím Ctrl + Shift + Z
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyZ') {
            if (!currentElement) return;

            // Tìm phần tử là link gần nhất từ vị trí chuột
            let el = currentElement;
            while (el && el !== document.body) {
                if (el.tagName === 'A' && el.href) {
                    window.open(el.href, '_blank');
                    break;
                }
                el = el.parentElement;
            }
        }
    });
})();
