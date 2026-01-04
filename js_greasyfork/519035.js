// ==UserScript==
// @name         Kraland User Block
// @namespace    http://kraland.org/
// @version      1.2
// @description  Ajoute la fonctionnalité de blocage d'utilisateurs sur Kraland
// @author       Eligios
// @match        http://kraland.org/*
// @match        http://www.kraland.org/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519035/Kraland%20User%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/519035/Kraland%20User%20Block.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fonction pour récupérer la liste des utilisateurs bloqués
    function getBlockedUsers() {
        return GM_getValue('blockedUsers', []);
    }

    // Fonction pour sauvegarder la liste des utilisateurs bloqués
    function saveBlockedUsers(users) {
        GM_setValue('blockedUsers', users);
    }

    // Fonction pour bloquer un utilisateur
    function blockUser(userId, username) {
        const blockedUsers = getBlockedUsers();
        if (!blockedUsers.some(user => user.id === userId)) {
            blockedUsers.push({ id: userId, name: username });
            saveBlockedUsers(blockedUsers);
            hideBlockedUserContent();
        }
    }

    // Fonction pour débloquer un utilisateur
    function unblockUser(userId) {
        const blockedUsers = getBlockedUsers();
        const index = blockedUsers.findIndex(user => user.id === userId);
        if (index !== -1) {
            blockedUsers.splice(index, 1);
            saveBlockedUsers(blockedUsers);
            showBlockedUserContent(userId);
            if (window.location.href.includes('main.php?p=8_4_4')) {
                window.location.reload();
            }
        }
    }

    // Fonction pour ajouter les boutons de blocage
    function addBlockButtons() {
        const userPosts = document.querySelectorAll('.forum-cartouche');
        userPosts.forEach(post => {
            const userLink = post.querySelector('a[href^="main.php?p=8_1&p0=1&p7="]');
            if (!userLink) return;

            const userId = userLink.href.match(/p7=(\d+)/)[1];
            const username = userLink.textContent;

            if (!post.querySelector('.block-button')) {
                const blockButton = document.createElement('p');
                blockButton.className = 'block-button';
                blockButton.style.cursor = 'pointer';
                blockButton.style.color = '#FF0000';

                const isBlocked = getBlockedUsers().some(user => user.id === userId);
                blockButton.textContent = isBlocked ? '✓ Bloqué' : 'BLOQUER';

                blockButton.addEventListener('click', () => {
                    if (!isBlocked) {
                        if (confirm(`Voulez-vous vraiment bloquer ${username} ?`)) {
                            blockUser(userId, username);
                            blockButton.textContent = '✓ Bloqué';
                        }
                    }
                });

                post.appendChild(blockButton);
            }
        });
    }

    // Fonction pour cacher le contenu des utilisateurs bloqués
    function hideBlockedUserContent() {
        const blockedUsers = getBlockedUsers();
        const userPosts = document.querySelectorAll('.forum-cartouche');

        userPosts.forEach(post => {
            const userLink = post.querySelector('a[href^="main.php?p=8_1&p0=1&p7="]');
            if (!userLink) return;

            const userId = userLink.href.match(/p7=(\d+)/)[1];
            if (blockedUsers.some(user => user.id === userId)) {
                const messageRow = post.parentElement;
                const footerRow = messageRow.nextElementSibling;
                messageRow.style.display = 'none';
                if (footerRow && footerRow.classList.contains('forum-footer')) {
                    footerRow.style.display = 'none';
                }
            }
        });
    }

    // Fonction pour afficher le contenu d'un utilisateur débloqué
    function showBlockedUserContent(userId) {
        const userPosts = document.querySelectorAll('.forum-cartouche');
        userPosts.forEach(post => {
            const userLink = post.querySelector(`a[href*="p7=${userId}"]`);
            if (userLink) {
                const messageRow = post.parentElement;
                const footerRow = messageRow.nextElementSibling;
                messageRow.style.display = '';
                if (footerRow && footerRow.classList.contains('forum-footer')) {
                    footerRow.style.display = '';
                }
            }
        });
    }

    // Fonction pour créer la page des utilisateurs bloqués
    function createBlockedUsersPage() {
        const centralText = document.getElementById('central-text');
        if (centralText) {
            const blockedUsers = getBlockedUsers();
            let content = '<h2>Utilisateurs Bloqués</h2><div class="rbx"><table class="t">';

            if (blockedUsers.length === 0) {
                content += '<tr><td>Aucun utilisateur bloqué</td></tr>';
            } else {
                blockedUsers.forEach(user => {
                    content += `
                        <tr>
                            <td>${user.name}</td>
                            <td>
                                <a href="#" class="unblock-button" data-userid="${user.id}" style="color: #FF0000; cursor: pointer;">DÉBLOQUER</a>
                            </td>
                        </tr>
                    `;
                });
            }

            content += '</table></div>';
            centralText.innerHTML = content;

            document.querySelectorAll('.unblock-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const userId = button.getAttribute('data-userid');
                    const userName = button.parentElement.previousElementSibling.textContent;
                    if (confirm(`Voulez-vous vraiment débloquer ${userName} ?`)) {
                        unblockUser(userId);
                    }
                });
            });
        }
    }

    // Fonction pour ajouter le menu des utilisateurs bloqués
    function addBlockedUsersMenu() {
        if (window.location.href.includes('main.php?p=8_4')) {
            const submenu = document.querySelector('.submenu ul');
            if (submenu && !submenu.querySelector('a[href="main.php?p=8_4_4"]')) {
                const blockedUsersItem = document.createElement('li');
                blockedUsersItem.innerHTML = '<a href="main.php?p=8_4_4">Utilisateurs Bloqués</a>';
                submenu.appendChild(blockedUsersItem);
            }
        }

        if (window.location.href.includes('main.php?p=8_4_4')) {
            createBlockedUsersPage();
        }
    }

    // Fonction d'initialisation
    function init() {
        addBlockButtons();
        hideBlockedUserContent();
        addBlockedUsersMenu();
    }

    // Lance le script
    init();

    // Ajoute un observateur pour le chargement dynamique du contenu
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                init();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();