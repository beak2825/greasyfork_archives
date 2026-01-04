// ==UserScript==
// @name         Auto Regis Vietin
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Auto-fill form and handle captcha for VietinBank Gold Registration
// @author       MrD4rk9x
// @match        https://dangkymuavang.vietinbankgold.vn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vietinbankgold.vn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501531/Auto%20Regis%20Vietin.user.js
// @updateURL https://update.greasyfork.org/scripts/501531/Auto%20Regis%20Vietin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let controllers = [];

    function getFormValues() {
        const formValues = {};
        const elements = document.querySelectorAll('form [name]');
        elements.forEach(element => {
            formValues[element.name] = element.value;
        });
        return formValues;
    }

    function handleSuccess(f) {
        // Hủy bỏ tất cả các request đang pending
        controllers.forEach(controller => controller.abort());
        controllers = [];

        $('.tgh,.gh').hide();
        $('.tgh').find('input, select').prop('disabled', true);
        $('.xndh,.dh').show();
        $('.xndh').find('input').prop('disabled', false);
    }

    function sendFormData(retryCount = 0) {
        let f = document.querySelector('form');
        const formValues = getFormValues();
        formValues.k = "gh";
        formValues.mxn = document.querySelector('input[name="mxn"]').value;
        delete formValues.dh;

        const formData = new FormData();
        Object.keys(formValues).forEach(key => formData.append(key, formValues[key]));

        const controller = new AbortController();
        const signal = controller.signal;
        controllers.push(controller);

        fetch(window.location.href, {
			method: 'POST',
			body: formData,
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			},
			signal
		})
		.then(response => {
			if (!response.ok) {
				if (response.status === 502) {
					sendFormData(retryCount + 1); // Thử lại ngay lập tức nếu nhận được 502
					throw new Error('502 Bad Gateway');
				} else {
					throw new Error('Network response was not ok');
				}
			}
			return response.text();
		})
		.then(responseText => {
            if (responseText.includes('"s":true,"t":"0"')) {
                alert('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.');
                handleSuccess(f);
            } else {
                console.error('Error response from server:', responseText);
                if (responseText.includes('"s":false,"t":"26"')) {
                    alert('Đã đăng ký thành công mail này. Mỗi mail chỉ được 1 lần.');
                } else if (responseText.includes('"s":false,"t":"404"')) {
                    alert('Bạn thao tác quá nhanh, thử lại sau 60s');
                    setTimeout(() => sendFormData(retryCount + 1), 60000); // Thử lại sau 60s
                } else if (responseText.includes('"s":false,"t":"1"')) {
                    alert('Sai mã captcha rồi');
                } else if (responseText.includes('"s":false')) {
                    console.log('Retrying due to failed registration...');
                    setTimeout(() => sendFormData(retryCount + 1), 1);
                } else {
                    console.log(`Đăng ký thất bại! Mã lỗi: ${responseText}`);
                    $('.gh').prop('disabled', false);
                    setTimeout(() => sendFormData(retryCount + 1), 1);
                }
            }
        })
		.catch(error => {
			if (error.message !== '502 Bad Gateway') {
				console.error('Fetch error:', error);
				console.log('Đã xảy ra lỗi! Vui lòng thử lại.');
				setTimeout(() => sendFormData(retryCount + 1), 10);
			}
		});
    }

    function sendConfirmationCode(retryCount = 0) {
        const confirmationCode = document.querySelector('input[name="dh"]').value;
        if (!confirmationCode) {
            alert('Vui lòng nhập mã xác nhận.');
            return;
        }

        const formData = new FormData();
        formData.append('k', 'dh');
        formData.append('dh', confirmationCode);

        fetch(window.location.href, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 502) {
                    throw new Error('502 Bad Gateway');
                } else {
                    throw new Error('Network response was not ok');
                }
            }
            return response.json();
        })
        .then(data => {
            if (data.s) {
                alert('Đã đăng ký mua vàng thành công, hãy chờ mail xác nhận!');
                document.querySelector('form').reset();
                location.reload();
            } else {
                console.error('Error response from server:', data);
                alert(`Xác nhận thất bại! Mã lỗi: ${data.t}`);
                $('.dh').prop('disabled', false);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            console.log('Đã xảy ra lỗi! Vui lòng thử lại.');
            setTimeout(() => sendConfirmationCode(retryCount + 1), 10); // Thử lại sau 0.01s
        });
    }

    window.addEventListener('load', () => {
        const captchaInput = document.querySelector('input[name="mxn"]');
        captchaInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendFormData();
            }
        });

        const confirmationInput = document.querySelector('input[name="dh"]');
        confirmationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendConfirmationCode();
            }
        });
    });
})();