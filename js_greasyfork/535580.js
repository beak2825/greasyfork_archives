// ==UserScript==
// @name         NimoTV Chat Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Tùy chỉnh phòng chat NimoTV: gán màu ngẫu nhiên cho tên người dùng (lưu trong localStorage), thêm nút trả lời, sửa lỗi từ bị chặn và lỗi trùng video.
// @author       You
// @match        https://*.nimo.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535580/NimoTV%20Chat%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/535580/NimoTV%20Chat%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hàm lấy cookie
    function getCookie(cname) {
        let name = cname + '=';
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

    // Khôi phục hoặc khởi tạo danh sách màu người dùng từ localStorage
    let users = JSON.parse(localStorage.getItem('usersColors') || '{}');

    // Theo dõi thay đổi DOM
    new MutationObserver((mutations, observer) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    // Tùy chỉnh tin nhắn chat
                    if (node && node.classList && node.classList.contains('nimo-room__chatroom__message-item')) {
                        const chatMessage = node;

                        // Lấy tên người dùng và tên người dùng hiện tại
                        const username = chatMessage.querySelector('.nm-message-nickname').innerHTML;
                        const currentUserName = getCookie('userName');

                        // Gán màu cho người dùng nếu chưa có
                        if (!users[username]) {
                            users[username] = `hsl(${Math.ceil(365 * Math.random())}, ${Math.ceil(Math.random() * 50 + 50)}%, 65%)`;
                            localStorage.setItem('usersColors', JSON.stringify(users));
                        }

                        // Áp dụng màu
                        const colon = chatMessage.querySelector('.nimo-room__chatroom__message-item__info-colon');
                        if (colon) {
                            colon.style.color = users[username];
                        }
                        chatMessage.querySelector('.nm-message-nickname').style.color = users[username];

                        // Thêm nút trả lời
                        const btn = document.createElement('span');
                        btn.classList.add('n-as-vtm');
                        btn.innerHTML = ' <img src="https://img.icons8.com/office/32/paper-plane.png" width="16" height="16" style="vertical-align:middle;"/>';
                        btn.addEventListener('click', () => {
                            const [chatbox] = document.getElementsByClassName('nimo-chat-box__input');
                            chatbox.value = `@${username} `;
                            chatbox.focus();
                        });
                        chatMessage.append(btn);

                        // Sửa lỗi từ bị chặn
                        if (currentUserName === username) {
                            const [chatbox] = document.getElementsByClassName('nimo-chat-box__input');
                            if (chatbox.value.length > 2) {
                                chatMessage.classList.add('message-filtered');
                            }
                        }
                    }

                    // Sửa lỗi trùng video
                    if (node && node.nodeName && node.nodeName.toLowerCase() === 'video') {
                        const videoContainer = node.parentElement;
                        if (videoContainer && videoContainer.classList && videoContainer.classList.contains('video-player')) {
                            const videos = videoContainer.querySelectorAll('video');
                            if (videos && videos.length > 1) {
                                videos[0].remove();
                            }
                        }
                    }
                }
            }
        }
    }).observe(document.body, {
        attributes: false,
        childList: true,
        subtree: true
    });
})();