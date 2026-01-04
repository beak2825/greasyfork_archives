// ==UserScript==
// @name         Более информативный значок кураторки
// @namespace    https://github.com/QIYANA/curator-badge-enhanced
// @version      1
// @description  Более информативный значок кураторки. При клике на значок куратора автоматически переходит на страницу кураторов и подсвечивает нужного пользователя
// @author       QIYANA
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://lzt.market/*
// @match        https://zelenka.market/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520730/%D0%91%D0%BE%D0%BB%D0%B5%D0%B5%20%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82%D0%B8%D0%B2%D0%BD%D1%8B%D0%B9%20%D0%B7%D0%BD%D0%B0%D1%87%D0%BE%D0%BA%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/520730/%D0%91%D0%BE%D0%BB%D0%B5%D0%B5%20%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82%D0%B8%D0%B2%D0%BD%D1%8B%D0%B9%20%D0%B7%D0%BD%D0%B0%D1%87%D0%BE%D0%BA%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BA%D0%B8.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function handleCuratorBadges() {
        const currentDomain = window.location.hostname;
        const curatorBadges = document.querySelectorAll('.avatarUserBadge.curator');

        curatorBadges.forEach(badge => {
            if (!badge.hasAttribute('curator-redirect-applied')) {
                badge.setAttribute('curator-redirect-applied', 'true');
                badge.style.cursor = 'pointer';
                badge.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    const userElement = badge.closest('.memberCard, .message, .profilePage')
                        ?.querySelector('.username');

                    if (userElement) {
                        const username = userElement.textContent.trim();
                        GM_setValue('searchUsername', username);
                    }

                    window.location.href = `https://${currentDomain}/members/?type=curators`;
                };
            }
        });
    }

    function findUserInList() {
        const username = GM_getValue('searchUsername');
        if (username && window.location.href.includes('/members/?type=curators')) {
            const memberList = document.querySelector('.memberList');
            if (memberList) {
                const userLinks = memberList.querySelectorAll('.username span');
                for (let link of userLinks) {
                    if (link.textContent.trim().toLowerCase() === username.toLowerCase()) {
                        link.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        link.style.outline = '2px solid #ffeb3b';
                        link.style.outlineOffset = '2px';
                        setTimeout(() => {
                            link.style.outline = '';
                            link.style.outlineOffset = '';
                        }, 5000);
                        GM_setValue('searchUsername', '');
                        break;
                    }
                }
            }
        }
    }

    const observer = new MutationObserver(() => {
        handleCuratorBadges();
        findUserInList();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });

    document.addEventListener('DOMContentLoaded', () => {
        handleCuratorBadges();
        findUserInList();
    });

    window.addEventListener('load', () => {
        handleCuratorBadges();
        findUserInList();
    });
})();
