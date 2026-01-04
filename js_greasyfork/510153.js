// ==UserScript==
// @name         DTUTOOL
// @namespace    https://mydtu.duytan.edu.vn/
// @version      0.1
// @description  Xem điểm học phần Duy Tân & Giải Captcha
// @author       David Hua
// @match        *://mydtu.duytan.edu.vn/sites/index.aspx?p=home_grading_public_grade*
// @match        *://mydtu.duytan.edu.vn/Signin.aspx
// @grant        none
// @icon         https://mydtu.duytan.edu.vn/images/DTU.ICO
// @downloadURL https://update.greasyfork.org/scripts/510153/DTUTOOL.user.js
// @updateURL https://update.greasyfork.org/scripts/510153/DTUTOOL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastCaptchaUrl = ''; // Biến lưu trữ URL CAPTCHA cuối cùng

    function getCaptchaUrl() {
        const captchaImage = document.querySelector('.floatbox img');
        if (captchaImage) {
            console.log("Captcha URL:", captchaImage.src);  // Kiểm tra URL ảnh CAPTCHA
            return captchaImage.src;
        } else {
            console.error("Không tìm thấy ảnh CAPTCHA.");
            return null;
        }
    }

    async function getCaptchaImage() {
        const captchaUrl = getCaptchaUrl();
        if (!captchaUrl) return null;

        // Đợi 2 giây trước khi kiểm tra URL CAPTCHA
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Kiểm tra nếu URL CAPTCHA đã thay đổi
        if (captchaUrl !== lastCaptchaUrl) {
            lastCaptchaUrl = captchaUrl; // Cập nhật URL CAPTCHA
            const response = await fetch(captchaUrl);
            if (!response.ok) {
                console.error("Không thể tải ảnh CAPTCHA:", response.statusText);
                return null;
            }

            const blob = await response.blob();
            console.log("CAPTCHA Blob Size:", blob.size);  // Log kích thước ảnh CAPTCHA

            return blob; // Trả về blob để gửi đi
        }

        console.log("URL CAPTCHA không thay đổi.");
        return null; // Không làm gì nếu URL không thay đổi
    }

    async function uploadCaptchaImage(blob) {
        const formData = new FormData();
        formData.append('file', blob, 'captcha.jpg'); // Gửi blob dưới dạng file

        const response = await fetch('https://tpminer107.pythonanywhere.com/', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            console.error("Upload response error:", response.statusText);
            throw new Error("Upload CAPTCHA không thành công.");
        }

        const result = await response.json();
        console.log("Upload response:", result);  // Log phản hồi từ API upload
        return result.result || result.error;  // Trả về kết quả
    }

    async function handleCaptcha() {
        try {
            const captchaImageBlob = await getCaptchaImage();
            if (!captchaImageBlob) {
                console.error('Không thể lấy ảnh CAPTCHA.');
                return;
            }

            const captchaResult = await uploadCaptchaImage(captchaImageBlob);
            if (!captchaResult) {
                console.error('Giải CAPTCHA không thành công.');
                return;
            }

            console.log('Kết quả CAPTCHA:', captchaResult);

            // Tự động điền kết quả CAPTCHA vào ô nhập
            const captchaInput = document.getElementById('txtCaptcha');
            if (captchaInput) {
                captchaInput.value = captchaResult;  // Điền kết quả CAPTCHA vào ô
            }
        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
        }
    }

    // Gọi hàm để giải CAPTCHA lần đầu tiên
    if (window.location.href === 'https://mydtu.duytan.edu.vn/Signin.aspx') {
        handleCaptcha();

        // Thêm sự kiện cho nút btnLogin1
        const loginButton = document.getElementById('btnLogin1');
        if (loginButton) {
            loginButton.addEventListener('click', function() {
                setTimeout(handleCaptcha, 2000); // Đợi 2 giây rồi gọi handleCaptcha
            });
        }

        // Thêm sự kiện cho phím Enter
        document.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                setTimeout(handleCaptcha, 2000); // Đợi 2 giây rồi gọi handleCaptcha
            }
        });
    }

    if (window.location.href.includes('mydtu.duytan.edu.vn/sites/index.aspx?p=home_grading_public_grade')) {

        const csvUrl = 'https://docs.google.com/spreadsheets/d/1RL30B0GkoiJcSYeABZCtUvIoWduxegF0/export?format=csv';

        async function fetchCsvData(url) {
            const response = await fetch(url);
            const text = await response.text();
            return text.split('\n').map(row => row.split(','));
        }

        async function updateTable() {
            const csvData = await fetchCsvData(csvUrl);
            const dataMap = {};

            csvData.forEach(row => {
                const [key, value] = row;
                dataMap[key.trim()] = value.trim();
            });

            const table = document.getElementById('frmNhapDiem');
            if (!table) return;

            const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

            for (let row of rows) {
                const cells = row.getElementsByTagName('td');
                if (cells.length > 2) {
                    const id = cells[1].innerText.trim();
                    if (dataMap[id]) {
                        cells[2].innerText = dataMap[id];
                    }
                }
            }
        }

        updateTable();
    }
})();
