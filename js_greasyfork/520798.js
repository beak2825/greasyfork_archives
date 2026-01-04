// ==UserScript==
// @name         Auto K12 Online Lite Version
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto K12 Online Is Eazy Now . Hacking K12 Online Is Eazy !
// @author       Bao Neyako
// @match        *://*.k12online.vn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520798/Auto%20K12%20Online%20Lite%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/520798/Auto%20K12%20Online%20Lite%20Version.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Phiên bản mặc định là Lite (Không có tính năng nâng cấp Pro)
    const isLiteVersion = true; // Mặc định là Lite Version
    let startTime = localStorage.getItem('videoStartTime') ? new Date(localStorage.getItem('videoStartTime')) : null;

    // HTML Panel Auto (vị trí: bên trái dưới màn hình, luôn luôn hiển thị)
    const autoPanelHTML = `
        <div id="autoPanel" style="
            position: fixed;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: 300px;
            background: rgba(52, 152, 219, 0.7);
            color: white;
            font-family: 'Comic Sans MS', cursive, sans-serif;
            font-size: 14px;
            padding: 20px;
            border-radius: 20px; /* Bo tròn bảng menu */
            box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.5);
            z-index: 9999;
            backdrop-filter: blur(10px); /* Hiệu ứng mờ cho nền */
        ">
            <h3 style="margin: 0; font-size: 20px; text-align: center;">Auto Tool</h3>
            <p style="font-size: 12px; text-align: center;">Type: ${isLiteVersion ? 'Auto K12 Online Lite Version' : 'Auto K12 Online Pro Version'}</p>
            <button id="btnAutoLogin" style="padding: 12px; background: #1abc9c; border: none; border-radius: 15px; margin: 10px 0; width: 100%; cursor: pointer; transition: background-color 0.3s ease-in-out;">Auto Đăng Nhập</button>
            <button id="btnAutoSolve" style="padding: 12px; background: #2980b9; border: none; border-radius: 15px; margin: 10px 0; width: 100%; cursor: pointer; transition: background-color 0.3s ease-in-out;" ${isLiteVersion ? 'disabled' : ''}>Auto Làm Bài</button>
            <button id="btnAutoPlayVideo" style="padding: 12px; background: #8e44ad; border: none; border-radius: 15px; margin: 10px 0; width: 100%; cursor: pointer; transition: background-color 0.3s ease-in-out; ${isLiteVersion ? '' : 'opacity: 0.5; pointer-events: none;'}">Auto Treo Video</button>
            <button id="btnAutoCompleteCourses" style="padding: 12px; background: #e74c3c; border: none; border-radius: 15px; margin: 10px 0; width: 100%; cursor: pointer; transition: background-color 0.3s ease-in-out;" ${isLiteVersion ? 'disabled' : ''}>Auto Làm Hết Khóa Học</button>
            <!-- Nút cập nhật -->
            <button id="btnUpdate" style="padding: 12px; background: #f39c12; border: none; border-radius: 15px; margin: 10px 0; width: 100%; cursor: pointer; transition: background-color 0.3s ease-in-out;">Cập nhật</button>
        </div>
    `;

    // Thêm HTML vào trang
    document.body.insertAdjacentHTML('beforeend', autoPanelHTML);

    // Lấy tất cả các nút trong panel
    const allButtons = document.querySelectorAll('#autoPanel button');

    // Lặp qua tất cả các nút và vô hiệu hóa chúng, trừ 3 nút: Auto Đăng Nhập, Auto Treo Video và Cập nhật
    allButtons.forEach(button => {
        if (button.id !== 'btnAutoLogin' && button.id !== 'btnAutoPlayVideo' && button.id !== 'btnUpdate') {
            button.disabled = true;
            button.style.opacity = 0.5;  // Làm mờ nút
            button.style.pointerEvents = 'none';  // Vô hiệu hóa sự kiện nhấn
        }
    });

    // Nút Auto Login
    document.getElementById('btnAutoLogin').addEventListener('click', function () {
        autoLogin();
    });

    // Hàm Auto Login
    function autoLogin() {
        const savedUsername = localStorage.getItem('username');
        const savedPassword = localStorage.getItem('password');

        if (savedUsername && savedPassword) {
            const usernameInput = document.querySelector('input[name="fields[username]"]');
            const passwordInput = document.querySelector('input[name="fields[password]"]');
            const loginButton = document.querySelector('button[type="submit"]');

            if (usernameInput && passwordInput && loginButton) {
                usernameInput.value = savedUsername;
                passwordInput.value = savedPassword;
                loginButton.click();
                console.log("Đang đăng nhập...");
            } else {
                alert("Không tìm thấy trường đăng nhập hoặc nút đăng nhập.");
            }
        } else {
            showLoginDialog();
        }
    }

    // Hiển thị hộp thoại nhập thông tin đăng nhập
    function showLoginDialog() {
        const dialogHTML = `
            <div id="loginDialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.5); z-index: 10000; width: 300px;">
                <h4 style="text-align: center;">Nhập Thông Tin Đăng Nhập</h4>
                <input id="usernameInput" type="text" placeholder="Tên đăng nhập" style="width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 5px;"/>
                <input id="passwordInput" type="password" placeholder="Mật khẩu" style="width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 5px;"/>
                <button id="btnLoginSubmit" style="width: 100%; padding: 12px; background: #1abc9c; border: none; border-radius: 15px; cursor: pointer;">Đăng nhập</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', dialogHTML);

        // Lắng nghe sự kiện submit form đăng nhập
        document.getElementById('btnLoginSubmit').addEventListener('click', function () {
            const username = document.getElementById('usernameInput').value;
            const password = document.getElementById('passwordInput').value;

            if (username && password) {
                localStorage.setItem('username', username);
                localStorage.setItem('password', password);
                document.getElementById('loginDialog').remove();
                autoLogin();
            } else {
                alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
            }
        });
    }

    // Nút Auto Treo Video
    document.getElementById('btnAutoPlayVideo').addEventListener('click', function () {
        autoPlayVideo();
    });

    // Hàm Auto Treo Video
    function autoPlayVideo() {
        console.log("Auto Treo Video Đang được kích hoạt...");

        // Kiểm tra các video trong trang
        const videoElements = document.querySelectorAll('video');
        videoElements.forEach(video => {
            // Nếu video chưa chạy thì start video
            if (video.paused || video.ended) {
                video.play();
                console.log("Video đang được phát tự động.");
            }

            // Tiến hành treo video bằng cách kích hoạt lại video sau một khoảng thời gian
            setInterval(() => {
                if (video.paused || video.ended) {
                    video.play();
                    console.log("Video treo lại.");
                }
            }, 1000); // Kiểm tra mỗi giây
        });
    }

    // Nút Cập nhật
    document.getElementById('btnUpdate').addEventListener('click', function () {
        showUpdateDialog();
    });

    // Hiển thị thông báo Cập nhật
    function showUpdateDialog() {
        const updateDialogHTML = `
            <div id="updateDialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.5); z-index: 10000; width: 300px;">
                <h4 style="text-align: center;">Cập nhật Phiên Bản</h4>
                <p style="text-align: center;">Phiên bản hiện tại của bạn là Lite. Cập nhật lên phiên bản Pro để sử dụng đầy đủ tính năng.</p>
                <button id="btnGoToPro" style="width: 100%; padding: 12px; background: #f39c12; border: none; border-radius: 15px; cursor: pointer;">Cập nhật ngay</button>
                <button id="btnCloseUpdate" style="width: 100%; padding: 12px; background: #e74c3c; border: none; border-radius: 15px; cursor: pointer;">Đóng</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', updateDialogHTML);

        // Lắng nghe sự kiện đóng hộp thoại
        document.getElementById('btnCloseUpdate').addEventListener('click', function () {
            document.getElementById('updateDialog').remove();
        });

        // Lắng nghe sự kiện cập nhật
        document.getElementById('btnGoToPro').addEventListener('click', function () {
            window.open('https://yourwebsite.com/pro-version', '_blank');
        });
    }

})();
