// ==UserScript==
// @name         Dò Đáp Án LMS 360 (UPDATE VER)
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Dò đáp án đúng...
// @author       V Quan Người đã test: H Nam, K Ngoc, ...
// @match        https://lms360.edu.vn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512575/D%C3%B2%20%C4%90%C3%A1p%20%C3%81n%20LMS%20360%20%28UPDATE%20VER%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512575/D%C3%B2%20%C4%90%C3%A1p%20%C3%81n%20LMS%20360%20%28UPDATE%20VER%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hasCopied = false; // Biến kiểm tra xem đã dò đáp án chưa
    let currentQuestion = ""; // Biến để lưu câu hỏi hiện tại
    let isPanelOpen = true; // Biến kiểm soát mở/đóng bảng
    let autoCheckEnabled = false; // Biến kiểm soát tự động dò đáp án

    // Hàm tạo tên ngẫu nhiên với tối đa 10 ký tự
    function generateRandomName() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let name = '';
        for (let i = 0; i < 10; i++) {
            name += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return name;
    }

    // Lấy tên ngẫu nhiên
    const nameText = generateRandomName();

    // Tạo bảng thông báo
    const infoBox = document.createElement('div');
    infoBox.style.position = 'fixed';
    infoBox.style.top = '50px';
    infoBox.style.right = '10px';
    infoBox.style.padding = '10px';
    infoBox.style.backgroundColor = 'white';
    infoBox.style.border = '1px solid #ccc';
    infoBox.style.zIndex = '9999';
    infoBox.style.cursor = 'move'; // Để có thể di chuyển bảng
    infoBox.style.width = '250px'; // Đặt kích thước cố định cho bảng
    infoBox.style.transition = 'max-height 0.5s ease-in-out, opacity 0.5s ease-in-out'; // Hiệu ứng đóng mở mượt mà cho cả chiều cao và độ mờ
    infoBox.style.maxHeight = '500px'; // Mở rộng khi hiển thị
    infoBox.style.overflow = 'hidden'; // Ẩn nội dung khi đóng
    infoBox.style.opacity = '1'; // Đảm bảo bảng được hiển thị ban đầu

    // Tạo tiêu đề cho bảng với tên người dùng
    const titleBar = document.createElement('div');
    titleBar.style.fontWeight = 'bold';
    titleBar.style.marginBottom = '10px';
    titleBar.innerHTML = `Dò Đáp Án (<span style="color: black; font-weight: bold;">${nameText}</span>)`; // Chèn tên ngẫu nhiên màu đen vào

    // Tạo nút Dò và hiển thị đáp án cạnh nhau
    const checkButtonContainer = document.createElement('div');
    checkButtonContainer.style.display = 'flex'; // Bố trí theo hàng ngang

    const checkButton = document.createElement('button');
    checkButton.innerText = 'Dò';
    checkButton.style.marginTop = '10px';
    checkButton.style.padding = '5px 10px';
    checkButton.style.cursor = 'pointer';

    const answerDisplay = document.createElement('div');
    answerDisplay.style.marginLeft = '10px'; // Khoảng cách giữa nút Dò và đáp án
    answerDisplay.style.fontWeight = 'bold';
    answerDisplay.style.color = 'green';

    checkButtonContainer.appendChild(checkButton);
    checkButtonContainer.appendChild(answerDisplay);

    // Tạo nút mở/đóng nằm bên ngoài bảng
    const externalToggleButton = document.createElement('button');
    externalToggleButton.innerText = 'Mở/Đóng Dò Đáp Án';
    externalToggleButton.style.position = 'fixed';
    externalToggleButton.style.top = '10px';
    externalToggleButton.style.right = '10px';
    externalToggleButton.style.padding = '5px 10px';
    externalToggleButton.style.cursor = 'pointer';
    externalToggleButton.style.zIndex = '10000';

    // Tạo checkbox tùy chọn tự động dò đáp án
    const autoCheckLabel = document.createElement('label');
    autoCheckLabel.style.display = 'block';
    autoCheckLabel.style.marginTop = '10px';
    autoCheckLabel.innerHTML = 'Tự động dò đáp án + AUTO'; // Thêm " + AUTO"

    const autoCheckBox = document.createElement('input');
    autoCheckBox.type = 'checkbox';
    autoCheckBox.style.marginLeft = '5px';

    autoCheckLabel.appendChild(autoCheckBox);

    // Hàm kiểm tra câu hỏi hiện tại để reset khi thay đổi
    function checkCurrentQuestion(iframeDoc) {
        const questionElement = iframeDoc.querySelector(".h5p-question-content");
        if (questionElement) {
            const newQuestion = questionElement.innerText || ""; // Lấy nội dung câu hỏi hiện tại
            if (newQuestion !== currentQuestion) {
                currentQuestion = newQuestion;
                hasCopied = false; // Reset biến khi câu hỏi thay đổi
                answerDisplay.innerHTML = ""; // Xóa nội dung hiển thị đáp án
            }
        }
    }

    // Hàm dò đáp án
    function findCorrectAnswer() {
        const iframe = document.querySelector('iframe'); // Chọn iframe đầu tiên
        if (!iframe) {
            answerDisplay.innerHTML = 'Không tìm thấy iframe.';
            return;
        }

        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document; // Truy cập tài liệu của iframe

        checkCurrentQuestion(iframeDoc); // Kiểm tra nếu câu hỏi đã thay đổi

        if (hasCopied) return; // Ngăn việc dò lại nếu đã dò rồi

        // Hàm dò định kỳ (cho trường hợp DOM không tải ngay lập tức)
        function periodicCheck() {
            // Sử dụng JS path cố định để tìm câu trả lời đúng (JS path cũ)
            let correctAnswer = iframeDoc.querySelector("body > div > div > div.h5p-question-content > div > div.h5p-sc-set.h5p-sc-animate > div.h5p-sc-slide.h5p-sc.h5p-sc-current-slide > ul > li.h5p-sc-alternative.h5p-sc-is-correct");

            if (!correctAnswer) {
                // Nếu không tìm thấy đáp án đúng theo JS path cũ, thử với JS path mới
                correctAnswer = iframeDoc.querySelector("body > div > div > div.h5p-video-wrapper.h5p-video.hardware-accelerated > div > div > div > div > div.h5p-question-content > div > div.h5p-sc-set.h5p-sc-animate > div.h5p-sc-slide.h5p-sc.h5p-sc-current-slide > ul > li.h5p-sc-alternative.h5p-sc-is-correct");
            }

            if (correctAnswer) {
                const answerText = correctAnswer.querySelector('.h5p-sc-label p').innerText; // Lấy nội dung đáp án đúng

                if (autoCheckEnabled) {
                    correctAnswer.click(); // Tự động chọn đáp án đúng nếu đã bật tùy chọn tự động
                }

                // Kiểm tra xem có hình ảnh không
                const imgElement = correctAnswer.querySelector('img');
                if (imgElement) {
                    const imgSrc = imgElement.src;

                    if (imgSrc.startsWith('data:image/svg+xml')) {
                        const svgImage = document.createElement('img');
                        svgImage.src = imgSrc;
                        svgImage.style.maxWidth = '50px'; // Điều chỉnh kích thước tối đa của ảnh
                        svgImage.style.marginLeft = '10px'; // Khoảng cách giữa chữ và hình ảnh

                        const textNode = document.createTextNode(`Đáp án: ${answerText} - Hình ảnh: `);
                        answerDisplay.appendChild(textNode);
                        answerDisplay.appendChild(svgImage);
                    } else {
                        answerDisplay.innerHTML = `Đáp án: ${answerText} - Ảnh không phải SVG.`;
                    }
                } else {
                    answerDisplay.innerHTML = `Đáp án: ${answerText}`; // Hiển thị đáp án nếu không có hình ảnh
                }
                hasCopied = true; // Đánh dấu là đã tìm thấy đáp án
            } else {
                answerDisplay.innerHTML = 'Không tìm thấy đáp án. Tiếp tục dò...';
                setTimeout(periodicCheck, 1000); // Thử lại sau 1 giây nếu chưa tìm thấy
            }
        }

        // Khởi động dò đáp án định kỳ
        periodicCheck();
    }

    // Khi nhấn nút Dò, thực hiện tìm kiếm đáp án
    checkButton.onclick = findCorrectAnswer;

    // Khi nhấn nút mở/đóng bảng
    externalToggleButton.onclick = function() {
        isPanelOpen = !isPanelOpen;
        if (isPanelOpen) {
            infoBox.style.maxHeight = '500px'; // Mở bảng
            infoBox.style.opacity = '1';
        } else {
            infoBox.style.maxHeight = '0'; // Đóng bảng
            infoBox.style.opacity = '0';
        }
    };

    // Khi nhấn checkbox tự động dò đáp án
    autoCheckBox.onchange = function() {
        autoCheckEnabled = autoCheckBox.checked; // Cập nhật trạng thái tự động dò
        if (autoCheckEnabled) {
            findCorrectAnswer(); // Tự động dò nếu tùy chọn được bật
        }
    };

    // Cho phép di chuyển bảng bằng chuột
    let offsetX = 0, offsetY = 0, isDragging = false;

    titleBar.onmousedown = function(e) {
        isDragging = true;
        offsetX = e.clientX - infoBox.getBoundingClientRect().left;
        offsetY = e.clientY - infoBox.getBoundingClientRect().top;
    };

    document.onmousemove = function(e) {
        if (isDragging) {
            infoBox.style.left = `${e.clientX - offsetX}px`;
            infoBox.style.top = `${e.clientY - offsetY}px`;
        }
    };

    document.onmouseup = function() {
        isDragging = false;
    };

    // Thêm các phần tử vào trang
    infoBox.appendChild(titleBar);
    infoBox.appendChild(checkButtonContainer);
    infoBox.appendChild(autoCheckLabel);
    document.body.appendChild(infoBox);
    document.body.appendChild(externalToggleButton);
})();
