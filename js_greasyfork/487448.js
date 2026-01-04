// ==UserScript==
// @name         Great Fork - Xem nguồn trang web
// @version      0.3
// @description  Hiển thị mã nguồn của trang web hiện tại và cho phép đóng cửa sổ mã nguồn
// @author       TieuThanhNhi
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/1177795
// @downloadURL https://update.greasyfork.org/scripts/487448/Great%20Fork%20-%20Xem%20ngu%E1%BB%93n%20trang%20web.user.js
// @updateURL https://update.greasyfork.org/scripts/487448/Great%20Fork%20-%20Xem%20ngu%E1%BB%93n%20trang%20web.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Tạo một button để mở mã nguồn của trang web
    var btn = document.createElement("button");
    btn.textContent = "Xem mã nguồn";
    btn.style.position = "fixed";
    btn.style.top = "10px";
    btn.style.left = "10px";
    btn.style.zIndex = "9999";
    btn.addEventListener("click", function() {
        // Mở một cửa sổ mới hiển thị mã nguồn
        var sourceWindow = window.open("about:blank", "_blank", "noopener,noreferrer");
        sourceWindow.document.write("<pre>" + escapeHTML(document.documentElement.outerHTML) + "</pre>");
        
        // Thêm nút thoát để đóng cửa sổ
        var exitButton = sourceWindow.document.createElement("button");
        exitButton.textContent = "Thoát";
        exitButton.style.position = "fixed";
        exitButton.style.top = "10px";
        exitButton.style.left = "10px";
        exitButton.style.zIndex = "9999";
        exitButton.addEventListener("click", function() {
            sourceWindow.close();
        });
        sourceWindow.document.body.appendChild(exitButton);
    });
    
    document.body.appendChild(btn);

    // Hàm để chuyển đổi các ký tự đặc biệt sang HTML entities
    function escapeHTML(text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
})();
