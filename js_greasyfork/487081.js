// ==UserScript==
// @name         Смена Никиты на Альтушку
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change username and avatar
// @author       Lapsa
// @match       https://vk.com/* 
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487081/%D0%A1%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%9D%D0%B8%D0%BA%D0%B8%D1%82%D1%8B%20%D0%BD%D0%B0%20%D0%90%D0%BB%D1%8C%D1%82%D1%83%D1%88%D0%BA%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/487081/%D0%A1%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%9D%D0%B8%D0%BA%D0%B8%D1%82%D1%8B%20%D0%BD%D0%B0%20%D0%90%D0%BB%D1%8C%D1%82%D1%83%D1%88%D0%BA%D1%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeUserInfo() {
        var elements = document.querySelectorAll('[data-peer="301320556"]');
        elements.forEach(function(element) {
            // change chat
            var nameElement = element.querySelector('.im-mess-stack--pname .im-mess-stack--lnk');
            var avatarElement = element.querySelector('.im-mess-stack--photo img');
            if (nameElement) {
                nameElement.textContent = 'Альтушка💟';
            }
            if (avatarElement) {
                avatarElement.src = 'https://sun66-2.userapi.com/s/v1/ig2/3v80CUEtQIxAMFOBELIDQFVz4VzxdwIXnKhtjMhzja4DxNB0qZDjf1iP2o459DQq6Xx7X4uUcYU98YgCI1FJh07S.jpg?size=100x100&quality=95&crop=185,146,691,691&ava=1';
            }
            //change block chats
            var avatarBlock = element.querySelector('.nim-dialog--photo img');
            var nameBlock = element.querySelector('._im_dialog_link');
            if (nameBlock) {
                nameBlock.textContent = 'Альтушка💟';
            }
            if (avatarBlock) {
                avatarBlock.src = 'https://sun66-2.userapi.com/s/v1/ig2/3v80CUEtQIxAMFOBELIDQFVz4VzxdwIXnKhtjMhzja4DxNB0qZDjf1iP2o459DQq6Xx7X4uUcYU98YgCI1FJh07S.jpg?size=100x100&quality=95&crop=185,146,691,691&ava=1';
            }
        });
    }

    changeUserInfo();
    var observer = new MutationObserver(changeUserInfo);
    observer.observe(document.body, { subtree: true, childList: true });
})();
