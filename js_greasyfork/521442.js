// ==UserScript==
// @name         DTUTOOL
// @namespace    https://mydtu.duytan.edu.vn/
// @version      0.6
// @description  Xem điểm học phần Duy Tân & Giải Captcha & Tự động đánh giá & Giải Captcha Đăng Ký & Khai Báo Ngoại Trú
// @author       David Hua
// @match        *://mydtu.duytan.edu.vn/sites/index.aspx?p=home_grading_public_grade*
// @match        *://mydtu.duytan.edu.vn/Signin.aspx
// @match        *://mydtu.duytan.edu.vn/sites/index.aspx?p=home_ratingform*
// @match        *://mydtu.duytan.edu.vn/sites/index.aspx?p=home_registeredall*
// @match        *://khaibaongoaitru.duytan.edu.vn/KhaiBaoNgoaiTru/Index*
// @match        *://mydtu.duytan.edu.vn/sites/index.aspx?p=home_sar_studentaffairrating*
// @grant        GM_addStyle
// @icon         https://mydtu.duytan.edu.vn/images/DTU.ICO
// @downloadURL https://update.greasyfork.org/scripts/521442/DTUTOOL.user.js
// @updateURL https://update.greasyfork.org/scripts/521442/DTUTOOL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        #txtCaptcha.solving,
        #ctl00_PlaceHolderContentArea_ctl00_ctl01_txtCaptcha.solving,
        input.txt.txt-vn.solving,
        #captchaText.solving,
        #CodeNumberTextBox.solving {
            background-image: url("https://mydtu.duytan.edu.vn/images/ajax-loader1.gif") !important;
            background-position: right 5px center !important;
            background-repeat: no-repeat !important;
            background-size: 16px 16px !important;
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    let lastCaptchaUrl = '';

    async function getCaptchaImageAsBlob(url) {
        const response = await fetch(url);
        if (!response.ok) return null;
        return await response.blob();
    }

    async function getBase64FromImage(imgElement) {
        const canvas = document.createElement('canvas');
        canvas.width = imgElement.naturalWidth;
        canvas.height = imgElement.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imgElement, 0, 0);

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg');
        });
    }

    async function getCaptchaImage() {
        if (window.location.href.includes('khaibaongoaitru.duytan.edu.vn')) {
            const imgElement = document.querySelector('.box_col_6.col_box img');
            if (imgElement) {
                return await getBase64FromImage(imgElement);
            }
            return null;
        } else if (window.location.href.includes('home_sar_studentaffairrating')) {
            const imgElement = document.getElementById('captchaImg');
            if (imgElement) {
                return await getBase64FromImage(imgElement);
            }
            return null;
        }

        const captchaUrl = getCaptchaUrl();
        if (!captchaUrl) return null;

        if (captchaUrl !== lastCaptchaUrl) {
            lastCaptchaUrl = captchaUrl;
            return await getCaptchaImageAsBlob(captchaUrl);
        }
        return null;
    }

    function getCaptchaUrl() {
        let captchaImage = document.querySelector('#imgCapt');
        if (captchaImage) {
            return captchaImage.src;
        }

        captchaImage = document.querySelector('.floatbox img');
        if (captchaImage) {
            return captchaImage.src;
        }
        return null;
    }

    async function uploadCaptchaImage(blob, inputElement) {
        if (inputElement) {
            inputElement.classList.add('solving');
            inputElement.value = '';
        }

        try {
            const formData = new FormData();
            formData.append('file', blob, 'captcha.jpg');

            const response = await fetch('https://tpminer107.pythonanywhere.com/', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error("Upload CAPTCHA không thành công.");
            }

            const result = await response.json();
            return result.result || result.error;
        } finally {
            if (inputElement) {
                inputElement.classList.remove('solving');
            }
        }
    }

    async function handleCaptcha(inputId) {
        try {
            const captchaInput = document.getElementById(inputId);
            const captchaImageBlob = await getCaptchaImage();
            if (!captchaImageBlob) {
                return;
            }

            const captchaResult = await uploadCaptchaImage(captchaImageBlob, captchaInput);
            if (!captchaResult) {
                return;
            }

            if (captchaInput) {
                captchaInput.value = captchaResult;
            }
        } catch (error) {
        }
    }

    // Override F5Captcha function if it exists
    if (typeof F5Captcha === 'function') {
        const originalF5Captcha = F5Captcha;
        F5Captcha = function() {
            originalF5Captcha.apply(this, arguments);
            setTimeout(() => {
                handleCaptcha('CodeNumberTextBox');
            }, 500);
        };
    }

    if (typeof LoadCaptcha === 'function') {
        const originalLoadCaptcha = LoadCaptcha;
        LoadCaptcha = function() {
            originalLoadCaptcha.apply(this, arguments);

            const captchaInputId = 'ctl00_PlaceHolderContentArea_ctl00_ctl01_txtCaptchar';
            const captchaImageSelector = '#imgCapt';
            const loadCheckInterval = setInterval(() => {
                const captchaImage = document.querySelector(captchaImageSelector);
                if (captchaImage && captchaImage.src) {
                    clearInterval(loadCheckInterval);
                    handleCaptcha(captchaInputId);
                }
            }, 500);
        };
    }

    function checkOption(radioId) {
        const radio = document.getElementById(radioId);
        if (radio) {
            radio.checked = true;
        }
    }

    function autoFillRatingForm() {
        for (let i = 48; i <= 51; i++) {
            const element = document.getElementById("R" + i);
            if (element) {
                element.value += "Không có ý kiến";
            }
        }

        for (let i = 0; i <= 47; i++) {
            checkOption("R" + i + "A");
        }

        window.scrollTo(0, document.body.scrollHeight);
        handleCaptcha('ctl00_PlaceHolderContentArea_ctl00_ctl01_txtCaptcha');
    }

    if (window.location.href.includes('home_sar_studentaffairrating')) {
        const sarCaptchaInterval = setInterval(() => {
            const captchaImage = document.getElementById('captchaImg');
            if (captchaImage && captchaImage.complete) {
                clearInterval(sarCaptchaInterval);
                handleCaptcha('CodeNumberTextBox');
            }
        }, 500);
    } else if (window.location.href.includes('khaibaongoaitru.duytan.edu.vn/KhaiBaoNgoaiTru/Index')) {
        const captchaCheckInterval = setInterval(() => {
            const captchaImage = document.querySelector('.box_col_6.col_box img');
            if (captchaImage && captchaImage.complete) {
                clearInterval(captchaCheckInterval);
                handleCaptcha('captchaText');
            }
        }, 500);
    } else if (window.location.href === 'https://mydtu.duytan.edu.vn/Signin.aspx') {
        handleCaptcha('txtCaptcha');

        const loginButton = document.getElementById('btnLogin1');
        if (loginButton) {
            loginButton.addEventListener('click', function() {
                const loginCheckInterval = setInterval(() => {
                    const captchaImage = document.querySelector('.floatbox img');
                    if (captchaImage && captchaImage.src) {
                        clearInterval(loginCheckInterval);
                        handleCaptcha('txtCaptcha');
                    }
                }, 500);
            });
        }

        document.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                const enterCheckInterval = setInterval(() => {
                    const captchaImage = document.querySelector('.floatbox img');
                    if (captchaImage && captchaImage.src) {
                        clearInterval(enterCheckInterval);
                        handleCaptcha('txtCaptcha');
                    }
                }, 500);
            }
        });
    } else if (window.location.href.includes('mydtu.duytan.edu.vn/sites/index.aspx?p=home_ratingform')) {
        autoFillRatingForm();
    } else if (window.location.href.includes('mydtu.duytan.edu.vn/sites/index.aspx?p=home_grading_public_grade')) {
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
    } else if (window.location.href.includes('mydtu.duytan.edu.vn/sites/index.aspx?p=home_registeredall')) {
        const captchaInputId = 'ctl00_PlaceHolderContentArea_ctl00_ctl01_txtCaptchar';
        const captchaImageSelector = '#imgCapt';
        const initialCheckInterval = setInterval(() => {
            const captchaImage = document.querySelector(captchaImageSelector);
            if (captchaImage && captchaImage.src) {
                clearInterval(initialCheckInterval);
                handleCaptcha(captchaInputId);
            }
        }, 500);
    }
})();