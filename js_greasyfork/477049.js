// ==UserScript==
// @name        Elivros Auto PDF Download
// @version       0.3
// @description  Baixa automaticamente qualquer PDF do Elivros.love.
// @author        Bard
// @match        https://elivros.love/livro/
// @namespace https://greasyfork.org/users/1171795
// @downloadURL https://update.greasyfork.org/scripts/477049/Elivros%20Auto%20PDF%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/477049/Elivros%20Auto%20PDF%20Download.meta.js
// ==/UserScript==

(function() {
  // Encontra o link de download direto.
  const downloadLink = document.querySelector(".pdf");

  // Faz o download do PDF.
  window.open(downloadLink.href, "_blank");
})();
