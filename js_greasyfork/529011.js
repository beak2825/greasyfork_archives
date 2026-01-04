// ==UserScript==
// @name         UserScript Đăng Script
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Đưa nút đăng script ra phía tay phải
// @author       Bạn
// @match        https://greasyfork.org/vi/scripts/*/versions/new
// @match        https://greasyfork.org/vi/scripts/*/versions
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/529011/UserScript%20%C4%90%C4%83ng%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/529011/UserScript%20%C4%90%C4%83ng%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Thêm CSS để căn chỉnh nút
    GM_addStyle(`
        #submitButtonContainer {
            position: fixed;
            top: 150px; /* Điều chỉnh vị trí theo nhu cầu */
            right: 20px; /* Căn phải */
            z-index: 9999;
        }
        #submitButton {
            background-color: #0076ff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        #submitButton:hover {
            background-color: #005bb5;
        }
    `);

    // Tạo nút "Đăng Script"
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'submitButtonContainer';
    const submitButton = document.createElement('button');
    submitButton.id = 'submitButton';
    submitButton.textContent = 'Đăng Script';

    // Thêm sự kiện click vào nút
    submitButton.addEventListener('click', () => {
        const form = document.querySelector('form.new_script_version');
        if (form) {
            form.submit(); // Gửi form khi nhấn nút
        } else {
            alert('Không tìm thấy form để đăng script.');
        }
    });

    buttonContainer.appendChild(submitButton);
    document.body.appendChild(buttonContainer);
})();