// ==UserScript==
// @name         Delete Mobile App Messages
// @namespace    neopets
// @version      2024.12.26.0
// @description  Selects and deletes Mobile App reward messages from neomail inbox
// @match        *://*.neopets.com/neomessages.phtml*
// @downloadURL https://update.greasyfork.org/scripts/504315/Delete%20Mobile%20App%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/504315/Delete%20Mobile%20App%20Messages.meta.js
// ==/UserScript==

function addDeleteDacardiaButton() {
    const button = document.createElement('input');
    button.type = 'submit';
    button.value = 'Delete app messages'
    button.style = 'margin-left:4px;'
    button.onclick = () => deleteDacardiaMessages();

    document.querySelector('form[name="messages"] input[type="submit"][value="Go!"]')?.insertAdjacentElement('afterend', button)
}

function deleteDacardiaMessages() {
    const form = document.querySelector('form[name="messages"]')
    const allMessages = form.querySelectorAll('table tr');
    allMessages.forEach(row => {
      const isDacardiaReward = [...row.querySelectorAll('td > a')].some(node => node.innerText === 'Special Reward Unlocked!' || node.innerText === 'Faerie Fragments Reward Unlocked!');
      const tntSender = row.querySelector('a[href="/userlookup.phtml?user=theneopetsteam"]');
      const checkbox = row.querySelector('input[type="checkbox"]');

      if (isDacardiaReward && tntSender != null && checkbox != null) {
          checkbox.checked = true;
      }
  });

    const actionInput = form.querySelector('select[name="action"]');
    actionInput.value = 'Delete Messages';
}

(() => {
    'use strict';

    let list = document.querySelectorAll(`.content > div[align="center"]`);
    const isInbox = [...list].some(node => node.innerText?.includes('Viewing: Inbox'))
    if (isInbox) {
        addDeleteDacardiaButton();
    }
})();