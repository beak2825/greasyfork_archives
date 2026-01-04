// ==UserScript==
// @name         claude头像替换
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  replace claude avatar!
// @author       You
// @match        https://app.slack.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slack.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466432/claude%E5%A4%B4%E5%83%8F%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/466432/claude%E5%A4%B4%E5%83%8F%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const COMPLETE_STATUS = 'COMPLETE_STATUS';
    const SATORAGE_KEY = 'claude_avatar_extensino_img';

    var observer = new MutationObserver(throttle(async () => {
        addButton();
        replaceAvatar();
    }, 600));

    // Observe all changes to the DOM tree
    observer.observe(document.body, { childList: true, subtree: true });

    function addButton() {
        const sidebarChannel = Array.from(document.querySelectorAll('.p-channel_sidebar__close_container')).find(el => el.innerText === 'Claude');

        // 添加按钮
        if (sidebarChannel && !sidebarChannel[COMPLETE_STATUS]) {
            console.warn(sidebarChannel[COMPLETE_STATUS]);
            sidebarChannel[COMPLETE_STATUS] = true;

            const button = document.createElement('div');
            button.innerText = '上传头像';
            button.style.position = 'absolute';
            button.style.right = '45px';
            button.style.lineHeight = '28px';
            sidebarChannel.prepend(button);

            button.addEventListener('click', () => {
                var input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';

                input.addEventListener('change', function() {
                    if (input.files && input.files[0]) {
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            var newImage = e.target.result;

                            localStorage.setItem(SATORAGE_KEY, newImage);
                            Array.from(document.querySelectorAll('[data-qa=message_sender_name]')).filter(el => el.innerText === 'Claude')
                                .map(el => el.closest('.c-message_kit__gutter').querySelector('.c-base_icon'))
                                .forEach((el) => {
                                    el.setAttribute(COMPLETE_STATUS, 'false');
                                });;
                            replaceAvatar();
                        }
                        reader.readAsDataURL(input.files[0]);
                    }
                });

                input.click();
            });
        }
    }

    function replaceAvatar() {
        // 修改头像
        const avatars = Array.from(document.querySelectorAll('[data-qa=message_sender_name]')).filter(el => el.innerText === 'Claude')
        .map(el => el.closest('.c-message_kit__gutter').querySelector('.c-base_icon'));

        if (avatars.length) {
            const source = localStorage.getItem(SATORAGE_KEY);

            if (source) {
                avatars.forEach((avatar) => {
                    if (avatar.getAttribute(COMPLETE_STATUS) !== 'true') {
                        avatar.setAttribute(COMPLETE_STATUS, 'true');
                        avatar.src = source;
                        avatar.setAttribute('srcset', source);
                    }
                });
            }
        }
    }

    /**
     * 节流函数
     * @param {function} func
     * @param {number} delay 延迟
     * @returns
     */
    function throttle(fn, delay) {
        let lastTimestamp = 0;
        let timer = null;

        return function (...args) {
            const now = Date.now();

            if (now - lastTimestamp >= delay) {
                lastTimestamp = now;
                fn.apply(this, args);
            } else {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    lastTimestamp = now;
                    fn.apply(this, args);
                }, delay - (now - lastTimestamp));
            }
        };
    }
})();