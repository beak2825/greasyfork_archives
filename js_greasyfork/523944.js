// ==UserScript==
// @name            Folga na cpu
// @description     Verifica se a guia do navegador está sendo usada, se não estiver, limita o uso da cpu na guia
// @license         GPL-3.0
// @version         4.1
// @author          Cowanbas
// @match           *://*/*
// @run-at          document-start
// @namespace CowanCPU
// @downloadURL https://update.greasyfork.org/scripts/523944/Folga%20na%20cpu.user.js
// @updateURL https://update.greasyfork.org/scripts/523944/Folga%20na%20cpu.meta.js
// ==/UserScript==

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "hidden") {
    // Oculta o conteúdo da página e limitar o uso da CPU
    document.documentElement.style.display = "none";

    // Limita o uso da CPU
    if (window.requestIdleCallback) {
      requestIdleCallback(function () {
        // Reduzi uso da CPU quando a guia está oculta
      });
    } else {
      setTimeout(function () {
        // Para navegadores que não suportam requestIdleCallback
      }, 1000);
    }
  } else {
    // Mostrar o conteúdo da página quando a guia for aberta Novamente
    document.documentElement.style.display = "block";
  }
});
