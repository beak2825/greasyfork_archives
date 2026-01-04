// ==UserScript==
// @name         Partage d'objet chat
// @version      1.7.0
// @description  Permet de partager un objet dans le chat avec Alt + A, permet d'éditer le nom avant de copier, et corrige son icône.
// @author       Laïn
// @match        https://www.dreadcast.eu/Main
// @match        https://www.dreadcast.net/Main
// @match        https://dreadcast.net/Main*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1435460
// @downloadURL https://update.greasyfork.org/scripts/528245/Partage%20d%27objet%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/528245/Partage%20d%27objet%20chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastHoveredElement = null;

    document.addEventListener('mouseover', function(e) {
        if (e.target && e.target.tagName === 'IMG' && e.target.classList.contains('item')) {
            lastHoveredElement = e.target;
        }
    }, false);

    document.addEventListener('mouseout', function(e) {
        if (e.target === lastHoveredElement) {
            // lastHoveredElement = null;
        }
    }, false);


    function getObjectData(element) {
        if (!element) return null;
        const idAttr = element.id;
        if (!idAttr || !idAttr.includes('_')) {
             return null;
        }
        const objectId = idAttr.split('_')[0];
        const src = element.src;
        if (!src) {
            return null;
        }
        const filename = src.split('/').pop();
        if (!filename) {
             return null;
        }
        const objectName = filename.replace(/\.[^/.]+$/, "");
        return { objectId, objectName };
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            // Success
        }, function(err) {
            // Error
        });
    }

    function showEditModal(data) {
        let existingModal = document.getElementById('custom-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'custom-modal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#222';
        modal.style.color = '#fff';
        modal.style.padding = '15px';
        modal.style.borderRadius = '10px';
        modal.style.zIndex = '2147483648';
        modal.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        modal.style.width = '250px';
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';
        modal.style.alignItems = 'center';

        const title = document.createElement('p');
        title.innerText = "Donner un nom à l'objet :";
        title.style.fontSize = '16px';
        title.style.marginBottom = '15px';
        title.style.textAlign = 'center';
        modal.appendChild(title);

        const input = document.createElement('input');
        input.type = 'text';
        input.value = '';
        input.style.width = 'calc(100% - 18px)';
        input.style.height = '32px';
        input.style.padding = '8px';
        input.style.marginBottom = '15px';
        input.style.borderRadius = '4px';
        input.style.border = '1px solid #555';
        input.style.backgroundColor = '#333';
        input.style.color = '#fff';
        input.style.fontSize = '18px';
        input.style.textAlign = 'center';
        modal.appendChild(input);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.width = '100%';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';

        const confirmButton = document.createElement('button');
        confirmButton.innerText = 'Copier';
        confirmButton.style.backgroundColor = '#28a745';
        confirmButton.style.color = '#fff';
        confirmButton.style.border = 'none';
        confirmButton.style.padding = '8px 0';
        confirmButton.style.borderRadius = '4px';
        confirmButton.style.cursor = 'pointer';
        confirmButton.style.flex = '1';
        confirmButton.style.marginRight = '5px';
        confirmButton.onclick = function() {
            copyCommand();
        };

        const cancelButton = document.createElement('button');
        cancelButton.innerText = 'Annuler';
        cancelButton.style.backgroundColor = '#dc3545';
        cancelButton.style.color = '#fff';
        cancelButton.style.border = 'none';
        cancelButton.style.padding = '8px 0';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.style.flex = '1';
        cancelButton.style.marginLeft = '5px';
        cancelButton.onclick = function() {
            modal.remove();
        };

        function copyCommand() {
            const newName = input.value.trim();
            const finalName = newName === '' ? data.objectName : newName;
            const command = `[objet_${data.objectId}_${finalName}]`;
            copyToClipboard(command);
            showNotification('Commande copiée : ' + command);
            modal.remove();
        }

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                copyCommand();
            } else if (e.key === 'Escape') {
                 modal.remove();
            }
        });

        function escapeListener(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escapeListener);
            }
        }
        document.addEventListener('keydown', escapeListener);

        confirmButton.addEventListener('click', () => document.removeEventListener('keydown', escapeListener));
        cancelButton.addEventListener('click', () => document.removeEventListener('keydown', escapeListener));


        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(cancelButton);
        modal.appendChild(buttonContainer);

        document.body.appendChild(modal);

        setTimeout(() => {
            input.focus();
        }, 50);
    }

    function showNotification(message) {
        const notif = document.createElement('div');
        notif.innerText = message;
        notif.style.position = 'fixed';
        notif.style.top = '470px';
        notif.style.left = '50%';
        notif.style.transform = 'translateX(-50%)';
        notif.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        notif.style.color = '#fff';
        notif.style.padding = '10px 20px';
        notif.style.borderRadius = '5px';
        notif.style.fontSize = '14px';
        notif.style.zIndex = '2147483649';
        notif.style.whiteSpace = 'nowrap';
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.remove();
        }, 2000);
    }

    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key.toLowerCase() === 'a') {
            const activeElement = document.activeElement;
            const isInputFocused = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable);
            const isModalInputFocused = activeElement && activeElement.closest('#custom-modal');

             if (!isInputFocused || isModalInputFocused) {
                 e.preventDefault();

                 if (lastHoveredElement) {
                    const data = getObjectData(lastHoveredElement);
                    if (data) {
                        showEditModal(data);
                        const modalInput = document.querySelector('#custom-modal input[type="text"]');
                        if (modalInput) {
                             modalInput.value = data.objectName.replace(/_/g, ' ');
                             modalInput.select();
                        }
                    } else {
                         showNotification("Erreur: Données de l'objet introuvables.");
                    }
                } else {
                    // No action needed if no element is hovered
                }
            } else {
                 // Alt+A ignored because an input field has focus
            }
        }
    }, false);

    GM_addStyle(`
        #custom-modal input[type="text"] {
            box-sizing: border-box;
        }
        .infoBoxFixed .conteneur_image img {
            position: absolute !important;
            left: 1px !important;
            top: 1px !important;
            width: calc(100% - 2px) !important;
            height: calc(100% - 2px) !important;
            object-fit: contain;
        }
    `);

})();