// ==UserScript==
// @name           Nome Guia
// @description    Altera o nome da guia
// @namespace      CowanGUIA
// @license        GPL-3.0
// @version        2.0
// @author         Cowanbas
// @match          https://web.whatsapp.com/*
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/523981/Nome%20Guia.user.js
// @updateURL https://update.greasyfork.org/scripts/523981/Nome%20Guia.meta.js
// ==/UserScript==
 
// Mude ou adicione no @match o site que deseja alterar o nome da guia
 
(function () {
  'use strict';
 
  // Altere o nome da guia aqui
  const NomeGuia = "MUDE AQUI";
 
  // Alterar o nome da guia para o valor de "NomeGuia"   
  const Wpp = () => {
    if (document.title !== NomeGuia) {
      document.title = NomeGuia;
    }
  };
 
  Wpp();
  const observer = new MutationObserver(() => {
    Wpp();
  });
 
  // Observar mudanças no título da guia
  const config = { subtree: true, childList: true, characterData: true };
  observer.observe(document.querySelector('head'), config);
 
})();