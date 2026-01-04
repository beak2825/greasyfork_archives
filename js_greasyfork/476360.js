// ==UserScript==
// @name         Resize Boxspaces do site e-desk
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Resize Boxspaces
// @author       MaxwGPT
// @match        https://nebrasil.e-desk.com.br/Portal/Solicitacao.aspx*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476360/Resize%20Boxspaces%20do%20site%20e-desk.user.js
// @updateURL https://update.greasyfork.org/scripts/476360/Resize%20Boxspaces%20do%20site%20e-desk.meta.js
// ==/UserScript==

function swapClasses() {
  const classesToSwap = [
    { old: 'AnexoDireita', new: 'AnexoEsquerda' },
    { old: 'ComentarioDireita', new: 'ComentarioEsquerda' },
  ];

  classesToSwap.forEach(classPair => {
    document.querySelectorAll(`.${classPair.old}`).forEach(element => {
      element.classList.remove(classPair.old);
      element.classList.add(classPair.new);
    });
  });
}

// Executando o script a cada segundo para lidar com conteúdo carregado dinamicamente
setInterval(swapClasses, 1000);
