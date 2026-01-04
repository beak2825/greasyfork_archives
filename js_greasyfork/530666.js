// ==UserScript==
// @name         Mistral AI - Delete All Chats
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  Adds a native-looking "Delete All Chats" button to Mistral AI interface with multi-language support
// @author       Ognisty321
// @match        https://chat.mistral.ai/*
// @license MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/530666/Mistral%20AI%20-%20Delete%20All%20Chats.user.js
// @updateURL https://update.greasyfork.org/scripts/530666/Mistral%20AI%20-%20Delete%20All%20Chats.meta.js
// ==/UserScript==

(function() {
    'use strict';

      const translations = {
          en: {
              deleteAllChats: "Delete All Chats",
              confirmDeleteAll: "Are you sure you want to delete ALL chats? This action cannot be undone!",
              modalTitle: "Deleting Chats",
              modalClose: "Close",
              startingDeletion: "Starting deletion process...",
              fetchingChats: "Fetching chats...",
              foundChats: "Found {0} chats to delete.",
              noMoreChats: "No more chats to delete!",
              deletionComplete: "✅ Deletion complete! Successfully deleted {0} chats in total.",
              startingBatch: "Starting batch #{0}...",
              completedBatch: "Completed batch #{0}: Deleted {1} chats",
              deletedChat: "Deleted chat: {0} ({1}...)",
              failedChat: "Failed to delete chat {0}: {1}",
              errorFetchingChats: "Error fetching chats: {0}",
              buttonAdded: "\"Delete All Chats\" button added successfully",
              confirmButtonLog: "Attempting to add native delete button..."
          },
          fr: {
              deleteAllChats: "Supprimer tous les chats",
              confirmDeleteAll: "Êtes-vous sûr de vouloir supprimer TOUS les chats ? Cette action est irréversible !",
              modalTitle: "Suppression des chats",
              modalClose: "Fermer",
              startingDeletion: "Début du processus de suppression...",
              fetchingChats: "Récupération des chats...",
              foundChats: "{0} chats trouvés à supprimer.",
              noMoreChats: "Aucun autre chat à supprimer !",
              deletionComplete: "✅ Suppression terminée ! {0} chats supprimés au total.",
              startingBatch: "Lancement du lot #{0}...",
              completedBatch: "Lot #{0} terminé : {1} chats supprimés",
              deletedChat: "Chat supprimé : {0} ({1}...)",
              failedChat: "Échec de la suppression du chat {0} : {1}",
              errorFetchingChats: "Erreur lors de la récupération des chats : {0}",
              buttonAdded: "Bouton « Supprimer tous les chats » ajouté avec succès",
              confirmButtonLog: "Tentative d’ajout du bouton natif de suppression..."
          },
          de: {
              deleteAllChats: "Alle Chats löschen",
              confirmDeleteAll: "Sind Sie sicher, dass Sie ALLE Chats löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden!",
              modalTitle: "Chats löschen",
              modalClose: "Schließen",
              startingDeletion: "Löschvorgang wird gestartet...",
              fetchingChats: "Chats werden geladen...",
              foundChats: "{0} Chats zum Löschen gefunden.",
              noMoreChats: "Keine weiteren Chats zum Löschen!",
              deletionComplete: "✅ Löschvorgang abgeschlossen! Insgesamt wurden {0} Chats erfolgreich gelöscht.",
              startingBatch: "Batch #{0} wird gestartet...",
              completedBatch: "Batch #{0} abgeschlossen: {1} Chats gelöscht",
              deletedChat: "Chat gelöscht: {0} ({1}...)",
              failedChat: "Chat {0} konnte nicht gelöscht werden: {1}",
              errorFetchingChats: "Fehler beim Laden der Chats: {0}",
              buttonAdded: "Button „Alle Chats löschen“ erfolgreich hinzugefügt",
              confirmButtonLog: "Versuche, nativen Lösch-Button hinzuzufügen..."
          },
          es: {
              deleteAllChats: "Eliminar todos los chats",
              confirmDeleteAll: "¿Seguro que quieres eliminar TODOS los chats? ¡Esta acción no se puede deshacer!",
              modalTitle: "Eliminando chats",
              modalClose: "Cerrar",
              startingDeletion: "Iniciando el proceso de eliminación...",
              fetchingChats: "Obteniendo los chats...",
              foundChats: "{0} chats encontrados para eliminar.",
              noMoreChats: "¡No quedan más chats para eliminar!",
              deletionComplete: "✅ ¡Eliminación completada! Se eliminaron correctamente {0} chats en total.",
              startingBatch: "Iniciando lote #{0}...",
              completedBatch: "Lote #{0} completado: {1} chats eliminados",
              deletedChat: "Chat eliminado: {0} ({1}...)",
              failedChat: "No se pudo eliminar el chat {0}: {1}",
              errorFetchingChats: "Error al obtener los chats: {0}",
              buttonAdded: "Botón «Eliminar todos los chats» agregado correctamente",
              confirmButtonLog: "Intentando añadir botón nativo de eliminación..."
          },
          pl: {
              deleteAllChats: "Usuń wszystkie czaty",
              confirmDeleteAll: "Czy na pewno chcesz usunąć WSZYSTKIE czaty? Tej operacji nie można cofnąć!",
              modalTitle: "Usuwanie czatów",
              modalClose: "Zamknij",
              startingDeletion: "Rozpoczynanie procesu usuwania...",
              fetchingChats: "Pobieranie czatów...",
              foundChats: "Znaleziono {0} czatów do usunięcia.",
              noMoreChats: "Brak kolejnych czatów do usunięcia!",
              deletionComplete: "✅ Usuwanie zakończone! Łącznie usunięto {0} czatów.",
              startingBatch: "Rozpoczynanie partii nr {0}...",
              completedBatch: "Zakończono partię nr {0}: usunięto {1} czatów",
              deletedChat: "Usunięto czat: {0} ({1}...)",
              failedChat: "Nie udało się usunąć czatu {0}: {1}",
              errorFetchingChats: "Błąd podczas pobierania czatów: {0}",
              buttonAdded: "Przycisk „Usuń wszystkie czaty” został dodany pomyślnie",
              confirmButtonLog: "Próba dodania natywnego przycisku usuwania..."
          },
          it: {
              deleteAllChats: "Elimina tutte le chat",
              confirmDeleteAll: "Sei sicuro di voler eliminare TUTTE le chat? Questa azione non può essere annullata!",
              modalTitle: "Eliminazione chat",
              modalClose: "Chiudi",
              startingDeletion: "Avvio del processo di eliminazione...",
              fetchingChats: "Recupero delle chat...",
              foundChats: "Trovate {0} chat da eliminare.",
              noMoreChats: "Non ci sono più chat da eliminare!",
              deletionComplete: "✅ Eliminazione completata! {0} chat eliminate con successo.",
              startingBatch: "Avvio batch #{0}...",
              completedBatch: "Batch #{0} completato: {1} chat eliminate",
              deletedChat: "Chat eliminata: {0} ({1}...)",
              failedChat: "Impossibile eliminare la chat {0}: {1}",
              errorFetchingChats: "Errore nel recupero delle chat: {0}",
              buttonAdded: "Pulsante «Elimina tutte le chat» aggiunto con successo",
              confirmButtonLog: "Tentativo di aggiungere il pulsante nativo di eliminazione..."
          },
          pt: {
              deleteAllChats: "Excluir todas as conversas",
              confirmDeleteAll: "Tem certeza de que deseja excluir TODAS as conversas? Esta ação não pode ser desfeita!",
              modalTitle: "Excluindo conversas",
              modalClose: "Fechar",
              startingDeletion: "Iniciando o processo de exclusão...",
              fetchingChats: "Obtendo conversas...",
              foundChats: "{0} conversas encontradas para exclusão.",
              noMoreChats: "Não há mais conversas para excluir!",
              deletionComplete: "✅ Exclusão concluída! {0} conversas excluídas com sucesso.",
              startingBatch: "Iniciando lote #{0}...",
              completedBatch: "Lote #{0} concluído: {1} conversas excluídas",
              deletedChat: "Conversa excluída: {0} ({1}...)",
              failedChat: "Falha ao excluir a conversa {0}: {1}",
              errorFetchingChats: "Erro ao obter conversas: {0}",
              buttonAdded: "Botão «Excluir todas as conversas» adicionado com sucesso",
              confirmButtonLog: "Tentando adicionar botão nativo de exclusão..."
          },
          ar: {
              deleteAllChats: "حذف كل المحادثات",
              confirmDeleteAll: "هل أنت متأكد أنك تريد حذف كل المحادثات؟ لا يمكن التراجع عن هذا الإجراء!",
              modalTitle: "جارٍ حذف المحادثات",
              modalClose: "إغلاق",
              startingDeletion: "بدء عملية الحذف...",
              fetchingChats: "جارٍ جلب المحادثات...",
              foundChats: "تم العثور على {0} محادثة للحذف.",
              noMoreChats: "لا توجد محادثات أخرى للحذف!",
              deletionComplete: "✅ اكتملت عملية الحذف! تم حذف {0} محادثة بنجاح.",
              startingBatch: "بدء الدفعة رقم {0}...",
              completedBatch: "اكتملت الدفعة رقم {0}: تم حذف {1} محادثة",
              deletedChat: "تم حذف المحادثة: {0} ({1}...)",
              failedChat: "فشل حذف المحادثة {0}: {1}",
              errorFetchingChats: "حدث خطأ أثناء جلب المحادثات: {0}",
              buttonAdded: "تمت إضافة زر «حذف كل المحادثات» بنجاح",
              confirmButtonLog: "جارٍ محاولة إضافة زر الحذف الأصلي..."
          }
      };

    function formatString(template, ...args) {
        return template.replace(/\{(\d+)\}/g, (match, index) => {
            return typeof args[index] !== 'undefined' ? args[index] : match;
        });
    }

    // Function to get cookie value by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return undefined;
    }

    // Get language from cookie first, then fall back to browser language if no cookie found
    const cookieLang = getCookie('lang');
    const userLang = (cookieLang || navigator.language || navigator.userLanguage || 'en').slice(0, 2);
    const i18n = translations[userLang] || translations.en;

    function addNativeDeleteButton() {
        console.log(i18n.confirmButtonLog);
        const sidebarMenu = document.querySelector('ul[data-sidebar="menu"]');
        if (!sidebarMenu) {
            console.log('Sidebar menu not found, retrying in 1 second...');
            setTimeout(addNativeDeleteButton, 1000);
            return;
        }
        if (document.getElementById('delete-all-chats-button')) {
            console.log('Delete button already exists');
            return;
        }
        const menuItem = document.createElement('li');
        menuItem.setAttribute('data-sidebar', 'menu-item');
        menuItem.className = 'group/menu-item relative';
        const button = document.createElement('button');
        button.id = 'delete-all-chats-button';
        button.setAttribute('data-sidebar', 'menu-button');
        button.setAttribute('data-size', 'default');
        button.setAttribute('data-active', 'false');
        button.className = 'peer/menu-button ring-default active:bg-muted active:text-default data-[active=true]:bg-muted data-[active=true]:text-default data-[state=open]:hover:bg-muted data-[state=open]:hover:text-default outline-hidden group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left transition-colors focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-muted hover:text-default h-8 text-sm text-red-600';
        button.type = 'button';
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"></path>
            <path d="M8 6V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2"></path>
            <path d="M19 6l-1 14c-.1 1-1 2-2 2H8c-1 0-1.9-1-2-2L5 6"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          <span>${i18n.deleteAllChats}</span>
        `;
        button.addEventListener('click', () => {
            confirmAndDeleteAllChats();
        });
        menuItem.appendChild(button);
        sidebarMenu.appendChild(menuItem);
        console.log(i18n.buttonAdded);
        createStatusModal();
    }

    function createStatusModal() {
        if (document.getElementById('delete-status-modal')) {
            return;
        }
        const modal = document.createElement('div');
        modal.id = 'delete-status-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.right = '0';
        modal.style.bottom = '0';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        modal.style.zIndex = '9999';
        modal.style.display = 'none';
        modal.style.overflow = 'auto';
        modal.style.alignItems = 'flex-start';
        modal.style.justifyContent = 'center';
        modal.style.paddingTop = '50px';
        modal.style.paddingBottom = '50px';
        const modalContent = document.createElement('div');
        modalContent.className = 'relative w-full max-w-md rounded-lg bg-gray-900 shadow-lg text-gray-100';
        modalContent.style.margin = '0 auto';
        modalContent.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
        modalContent.style.display = 'flex';
        modalContent.style.flexDirection = 'column';
        modalContent.style.maxHeight = '80vh';
        const modalHeader = document.createElement('div');
        modalHeader.className = 'flex items-center justify-between border-b border-gray-700 pb-3 px-4 pt-4';
        modalHeader.style.position = 'sticky';
        modalHeader.style.top = '0';
        modalHeader.style.backgroundColor = 'rgb(17,24,39)';
        modalHeader.style.zIndex = '1';
        modalHeader.style.borderTopLeftRadius = '0.5rem';
        modalHeader.style.borderTopRightRadius = '0.5rem';
        modalHeader.innerHTML = `
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M15 9l-6 6"></path>
              <path d="M9 9l6 6"></path>
            </svg>
            <h3 class="text-lg font-semibold">${i18n.modalTitle}</h3>
          </div>
          <button id="close-status-modal" class="rounded-full p-1.5 hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        `;
        const statusContainer = document.createElement('div');
        statusContainer.id = 'delete-status';
        statusContainer.className = 'overflow-y-auto px-4 py-3 space-y-2.5';
        statusContainer.style.flex = '1';
        statusContainer.style.overflowY = 'auto';
        statusContainer.style.minHeight = '100px';
        statusContainer.style.maxHeight = 'calc(80vh - 120px)';
        const modalFooter = document.createElement('div');
        modalFooter.className = 'border-t border-gray-700 px-4 py-3';
        modalFooter.style.position = 'sticky';
        modalFooter.style.bottom = '0';
        modalFooter.style.backgroundColor = 'rgb(17,24,39)';
        modalFooter.style.borderBottomLeftRadius = '0.5rem';
        modalFooter.style.borderBottomRightRadius = '0.5rem';
        const closeButton = document.createElement('button');
        closeButton.id = 'close-status-button';
        closeButton.className = 'px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm font-medium transition-colors text-gray-100';
        closeButton.textContent = i18n.modalClose;
        modalFooter.appendChild(closeButton);
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(statusContainer);
        modalContent.appendChild(modalFooter);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        document.getElementById('close-status-modal').addEventListener('click', hideModal);
        document.getElementById('close-status-button').addEventListener('click', hideModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal();
            }
        });
        function hideModal() {
            document.getElementById('delete-status-modal').style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    function addStatus(message, type = 'info') {
        const statusContainer = document.getElementById('delete-status');
        if (!statusContainer) return;
        const statusItem = document.createElement('div');
        statusItem.className = `mb-2 p-3 rounded-md text-sm border`;
        if (type === 'success') {
          statusItem.innerHTML = `<div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
            ${message}
          </div>`;
        } else if (type === 'error') {
          statusItem.innerHTML = `<div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            ${message}
          </div>`;
        } else {
          statusItem.innerHTML = `<div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            ${message}
          </div>`;
        }
        statusContainer.appendChild(statusItem);
        statusContainer.scrollTop = statusContainer.scrollHeight;
    }

    function showStatusModal() {
        const modal = document.getElementById('delete-status-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function confirmAndDeleteAllChats() {
        if (confirm(i18n.confirmDeleteAll)) {
            const statusContainer = document.getElementById('delete-status');
            if (statusContainer) {
                statusContainer.innerHTML = '';
            }
            showStatusModal();
            addStatus(i18n.startingDeletion, 'info');
            deleteAllChats();
        }
    }

    async function fetchChats() {
        try {
            addStatus(i18n.fetchingChats, 'info');
            const url = "https://chat.mistral.ai/api/trpc/chat.last";
            const params = {
                "batch": "1",
                "input": JSON.stringify({
                    "0": {
                        "json": {
                            "chatVisibility": "private",
                            "chatPermission": "write",
                            "direction": "forward",
                            "limit": 20
                        }
                    }
                })
            };
            const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
                method: 'GET',
                headers: {
                    'accept': '*/*',
                    'content-type': 'application/json',
                    'trpc-accept': 'application/jsonl',
                    'x-trpc-source': 'nextjs-react'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch chats: ${response.status}`);
            }
            const text = await response.text();
            const chatIds = [];
            const lines = text.trim().split('\n');
            for (const line of lines) {
                try {
                    const data = JSON.parse(line);
                    if (data.json && Array.isArray(data.json)) {
                        if (data.json[2]?.[0]?.[0]?.items) {
                            for (const chat of data.json[2][0][0].items) {
                                if (chat.id) {
                                    chatIds.push({
                                        id: chat.id,
                                        title: chat.title || 'No title'
                                    });
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error('Error parsing JSON line:', e);
                }
            }
            addStatus(formatString(i18n.foundChats, chatIds.length), 'info');
            return chatIds;
        } catch (error) {
            addStatus(formatString(i18n.errorFetchingChats, error.message), 'error');
            console.error('Error fetching chats:', error);
            return [];
        }
    }

    async function deleteChat(chatId, title) {
        try {
            const url = "https://chat.mistral.ai/api/trpc/chat.delete";
            const params = {"batch": "1"};
            const payload = {"0": {"json": {"id": chatId}}};
            const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'content-type': 'application/json',
                    'trpc-accept': 'application/jsonl',
                    'x-trpc-source': 'nextjs-react'
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`Failed to delete chat: ${response.status}`);
            }
            addStatus(formatString(i18n.deletedChat, title, chatId.substring(0, 8)), 'success');
            return true;
        } catch (error) {
            addStatus(formatString(i18n.failedChat, chatId, error.message), 'error');
            console.error('Error deleting chat:', error);
            return false;
        }
    }

    async function deleteAllChats() {
        let batchNumber = 1;
        let totalDeleted = 0;
        while (true) {
            addStatus(formatString(i18n.startingBatch, batchNumber), 'info');
            const chats = await fetchChats();
            if (chats.length === 0) {
                addStatus(i18n.noMoreChats, 'success');
                break;
            }
            let batchDeleted = 0;
            for (const chat of chats) {
                await deleteChat(chat.id, chat.title);
                batchDeleted++;
                totalDeleted++;
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            addStatus(formatString(i18n.completedBatch, batchNumber, batchDeleted), 'info');
            batchNumber++;
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        addStatus(formatString(i18n.deletionComplete, totalDeleted), 'success');
    }

    setTimeout(addNativeDeleteButton, 2000);
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        if (lastUrl !== location.href) {
            lastUrl = location.href;
            setTimeout(addNativeDeleteButton, 2000);
        }
        if (!document.getElementById('delete-all-chats-button')) {
            addNativeDeleteButton();
        }
    });
    observer.observe(document, {subtree: true, childList: true});
    setTimeout(addNativeDeleteButton, 5000);
    console.log('Mistral AI - Delete All Chats script (multi-language) loaded!');
})();