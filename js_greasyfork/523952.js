// ==UserScript==
// @version 1
// @license MIT
// @name        Hide/show deleted messages
// @description Hides/shows deleted messages
// @namespace   zalupa
// @match       *://*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/523952/Hideshow%20deleted%20messages.user.js
// @updateURL https://update.greasyfork.org/scripts/523952/Hideshow%20deleted%20messages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Проверяем наличие нужного элемента
    const targetElement = document.querySelector('div.userBlurb.current_text.Editable.Tooltip[data-phrase="Изменить статус"]');
    if (!targetElement) {
        return; // Если элемента нет, выходим из скрипта
    }

    let deletedMessageCount = 0;
    let counterElement;
    let toggleButton;
    let hiddenMessages = true;
    let buttonContainer;

    function updateCounter() {
        if (!counterElement) {
            counterElement = document.createElement('div');
            counterElement.style.cssText = 'position: fixed; top: 10px; right: 10px; background-color: rgba(0, 0, 0, 0.7); color: white; padding: 5px; border-radius: 5px; z-index: 9999; display: flex; align-items: center;';
            document.body.appendChild(counterElement);

            buttonContainer = document.createElement('div');
            buttonContainer.style.marginLeft = '10px';
            counterElement.appendChild(buttonContainer);

            toggleButton = document.createElement('button');
            toggleButton.textContent = hiddenMessages ? 'Показать' : 'Скрыть';
            toggleButton.style.cssText = 'background-color: #555; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;';
            toggleButton.addEventListener('click', toggleMessages);
            buttonContainer.appendChild(toggleButton);

            const counterSpan = document.createElement('span');
            counterSpan.textContent = 'Скрыто сообщений: ' + deletedMessageCount;
            counterElement.insertBefore(counterSpan, buttonContainer);
        }
        counterElement.firstChild.textContent = 'Скрыто сообщений: ' + deletedMessageCount;
    }

    function toggleMessages() {
      hiddenMessages = !hiddenMessages;
        const deletedMessages = document.querySelectorAll('li.messageSimple.deleted');
        deletedMessages.forEach(message => {
            message.style.display = hiddenMessages ? 'none' : 'block';
        });
        toggleButton.textContent = hiddenMessages ? 'Показать' : 'Скрыть';
    }

  function hideDeletedMessages() {
      const deletedMessages = document.querySelectorAll('li.messageSimple.deleted');
      let newDeletedCount = 0;
      deletedMessages.forEach(message => {
          if (message.style.display !== 'none' && hiddenMessages) {
              message.style.display = 'none';
              newDeletedCount++;
          }
      });
       deletedMessageCount += newDeletedCount;
       updateCounter(); // Вызываем обновление счетчика
  }


  hideDeletedMessages(); // Инициализация счетчика при загрузке

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if(mutation.addedNodes.length) {
               hideDeletedMessages()
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();