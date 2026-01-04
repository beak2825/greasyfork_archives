// ==UserScript==
// @name         ChatGPT GPT-4o Switch
// @namespace    ChatGPT_4o_switch_force
// @version      4.5
// @description  Force switch to GPT-4o on homepage load only
// @match        https://chatgpt.com/
// @match        https://chatgpt.com/?openai*
// @match        https://chatgpt.com/?model=gpt-5
// @icon         https://cdn.oaistatic.com/assets/favicon-eex17e9e.ico
// @license      CC0-1.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545263/ChatGPT%20GPT-4o%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/545263/ChatGPT%20GPT-4o%20Switch.meta.js
// ==/UserScript==

// match        https://chatgpt.com/?model=gpt-4o

(async function () {
    'use strict';
    
    //CSS hide
    const style = document.createElement('style');
    style.id = 'gpt4o-hide-style';
    style.innerHTML = `
      [role="menu"] {
        user-select: none !important;
        opacity: 0 !important;      /* rend invisible */
      }
    `;
    document.head.appendChild(style);


    // Simule un clic humain
    const humanClick = async (el) => {
      const rect = el.getBoundingClientRect();
      const opts = {
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      };
      ['pointerover', 'mouseover', 'pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click']
        .forEach(event => el.dispatchEvent(new MouseEvent(event, opts)));
    };

    const fonctWaitTimeout = (ms) => new Promise(r => setTimeout(r, ms));
    //Attente initiale 
    await fonctWaitTimeout(1000);


    //BOUTON CHOIX
    const btn = document.querySelector('[data-testid="model-switcher-dropdown-button"], [data-testid="model-switcher-button"]');
    if (!btn) return console.warn("[AutoSwitch] Bouton modèle introuvable.");
    await humanClick(btn);
    await fonctWaitTimeout(300);

    //BOUTON MODELE
    const legacyBtn = Array.from(document.querySelectorAll('[role="menuitem"]'))
      .find(el => ["models", "modèles"].some(k => el.textContent.toLowerCase().includes(k.toLowerCase())));
    if (!legacyBtn) return console.warn("[AutoSwitch] Menu Legacy introuvable.");
    await humanClick(legacyBtn);
    await fonctWaitTimeout(300);

    //BOUTON 4O
    const gpt4oBtn = Array.from(document.querySelectorAll('[role="menuitem"]'))
      .find(el => el.textContent.includes("GPT-4o"));
    if (!gpt4oBtn) return console.warn("[AutoSwitch] Option GPT-4o introuvable.");
    await humanClick(gpt4oBtn);


    console.log("[AutoSwitch] ✅ GPT-4o sélectionné.");
    document.getElementById('gpt4o-hide-style')?.remove();

})();

//Supprime la feuille si jamais la fonction a foiré
setTimeout(() => document.getElementById('gpt4o-hide-style')?.remove(), 4000);


/*
location.replace("https://chatgpt.com/?model=gpt-4o");


history.pushState = new Proxy(history.pushState, {
  apply(target, thisArg, argArray) {
    const result = Reflect.apply(target, thisArg, argArray);
    if (location.href === "https://chatgpt.com/") {
      location.replace("https://chatgpt.com/?model=gpt-4o");
    }
  }
});
*/