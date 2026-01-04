// ==UserScript==
// @name         Mass Delete - Claude
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      1
// @description  Permanently delete conversations on claude.ai
// @author       hacker09
// @match        https://claude.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claude.ai
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/499832/Mass%20Delete%20-%20Claude.user.js
// @updateURL https://update.greasyfork.org/scripts/499832/Mass%20Delete%20-%20Claude.meta.js
// ==/UserScript==

(() => {
  const getCookieValue = (name) => (
    document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1] ?? undefined
  );

  const org = getCookieValue('lastActiveOrg');
  if (!org) {
    console.error("Cannot get current organization ID");
    return;
  }

  let checkboxesVisible = false;
  let chats = [];

  const fetchAndAddCheckboxes = async () => {
    try {
      const response = await fetch(`https://claude.ai/api/organizations/${org}/chat_conversations`, {
        method: "GET",
        credentials: "include",
      });
      chats = await response.json();

      chats.forEach(chat => {
        const chatElement = document.querySelector(`a[href="/chat/${chat.uuid}"]`);
        if (chatElement && !chatElement.parentNode.nextElementSibling?.querySelector('input[type="checkbox"]')) {
          const checkboxContainer = document.createElement('div');
          checkboxContainer.style.marginTop = '5px';
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.dataset.chatId = chat.uuid;
          checkboxContainer.appendChild(checkbox);
          chatElement.parentNode.parentNode.insertBefore(checkboxContainer, chatElement.parentNode.nextSibling);
        }
      });

      if (!document.getElementById('selectAllCheckbox')) {
        const selectAllContainer = document.createElement('div');
        selectAllContainer.style.marginBottom = '10px';
        const selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.style.marginRight = '5px';
        selectAllCheckbox.id = 'selectAllCheckbox';
        selectAllCheckbox.addEventListener('change', () => {
          const checkboxes = document.querySelectorAll('input[type="checkbox"]');
          checkboxes.forEach(checkbox => {
            if (checkbox.id !== 'selectAllCheckbox') {
              checkbox.checked = selectAllCheckbox.checked;
            }
          });
        });

        const selectAllLabel = document.createElement('label');
        selectAllLabel.textContent = 'Select All';
        selectAllContainer.appendChild(selectAllCheckbox);
        selectAllContainer.appendChild(selectAllLabel);

        const previousChatsHeader = document.querySelector('h3.text-sm.text-center.text-text-400');
        if (previousChatsHeader) {
          previousChatsHeader.parentNode.insertBefore(selectAllContainer, previousChatsHeader);
        }
      }

      checkboxesVisible = true;
    } catch (error) {
      console.error("Failed to fetch chat conversations:", error);
    }
  };

  const deleteChats = async (chatIds) => {
    try {
      await Promise.all(
        chatIds.map(id => fetch(`https://claude.ai/api/organizations/${org}/chat_conversations/${id}`, {
          method: "DELETE",
          credentials: "include",
        }))
      );
      window.location.reload();
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  unsafeWindow.clearHistory = async () => {
    if (!checkboxesVisible) {
      await fetchAndAddCheckboxes();
    } else {
      const selectedChats = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
      .filter(checkbox => checkbox.id !== 'selectAllCheckbox')
      .map(checkbox => checkbox.dataset.chatId);

      if (selectedChats.length > 0) {
        const confirmMessage = `Are you sure you want to delete the selected ${selectedChats.length} conversation(s)?`;

              if (confirm(confirmMessage)) {
                deleteChats(selectedChats);
              }
            } else if (selectedChats.length === 0) {
              const checkboxes = document.querySelectorAll('input[type="checkbox"]');
              checkboxes.forEach(checkbox => {
                if (checkbox.id !== 'selectAllCheckbox') {
                  checkbox.parentNode.remove();
                }
              });
              const selectAllCheckbox = document.getElementById('selectAllCheckbox');
              if (selectAllCheckbox) {
                selectAllCheckbox.parentNode.remove();
              }
              checkboxesVisible = false;
            }
        }
    };

  const createButton = () => {
    const button = document.createElement("button");
    button.textContent = 'Delete Conversations';
    button.style.position = 'fixed';
    button.style.right = '20px';
    button.style.bottom = '60px'; // 改為從底部往上 60px
    button.style.zIndex = 1000;
    button.classList.add("block", "p-4");
    button.addEventListener("click", () => {
      unsafeWindow.clearHistory();
    });
    document.body.appendChild(button);
  };

  createButton();
})();