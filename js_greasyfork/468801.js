// ==UserScript==
// @name         Bloquear anunciantes do Twitter
// @namespace    http://djprmf.com
// @version      1.1
// @description  A tarefa é simples: bloqueia anunciantes conforme se faz scroll pelo Twitter
// @author       @DJ_PRMF
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468801/Bloquear%20anunciantes%20do%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/468801/Bloquear%20anunciantes%20do%20Twitter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let blockedCount = 0;

  function blockAdvertiser() {
    const spans = document.querySelectorAll("span");
    let btn = null;

    //Vamos procurar pelos termos de conteúdos promovidos
    for (let span of spans) {
      if (
        span.textContent === "Promoted" ||  span.textContent.includes("Promoted by") || span.textContent === "Promovido" || span.textContent.includes("Promovido por")
      ) {
        // Are we sure it's not just a tweet that says "Promoted"??
        // Let's try to be more sure. Check for svg promoted icon.
        const divPromoted = span.parentNode.parentNode;
        const svgPromoted = divPromoted.querySelector(
          'svg[viewBox="0 0 24 24"]'
        );
        if (!svgPromoted) continue;

        const svgShape = divPromoted.querySelector(
          '[d="M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v13c0 1.38 1.119 2.5 2.5 2.5h15c1.381 0 2.5-1.12 2.5-2.5v-13c0-1.38-1.119-2.5-2.5-2.5zm-3.502 12h-2v-3.59l-5.293 5.3-1.414-1.42L12.581 10H8.996V8h7v7z"]'
        );
        if (!svgShape) continue;

        btn = span;
        break;
      }
    }

    if (!btn) return;
    
    //Agora vamos para a parte do bloqueuio
    //Primeiro simular a abertura do menu da pub
    const pnt = btn.closest("article");
    if (!pnt) return;

    //e pressionar o botão do menu
    const more = pnt.querySelector('[role="button"]');
    more.click();
    
    //Vamos ao bloqueio?
    const block = document.querySelector('[data-testid="block"]');
    block.click();

    //Se apenas for para dar feedback negativo da pub, remover o comentário do código em baixo.
    //Colocar o código anterior do bloqueio em comentario!
    //Apenas dar feedback negativo
    //const block = document.querySelector('[role="menuitem"]:first-of-type');
    //block.click();

    //Confirmação da janela de bloqueio da conta
    const confirm = document.querySelector(
      '[data-testid="confirmationSheetConfirm"]'
    );
    confirm.click();

    //Uma contagem para o log do navegador
    blockedCount++;
    console.log("Anunciantes bloqueados:", blockedCount);
  }

  setInterval(() => {
    blockAdvertiser();
  }, 1000);
})();