// ==UserScript==
// @name         tw2plusflow (loader)
// @description  Carrega o script principal a partir do seu servidor protegido por API-Key
// @version      2.2.2
// @grant        unsafeWindow
// @run-at       document-start
// @include      https://*.tribalwars2.com/game.php*
// @license      MIT
// @namespace relaxeaza/userscripts
// @downloadURL https://update.greasyfork.org/scripts/541485/tw2plusflow%20%28loader%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541485/tw2plusflow%20%28loader%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const SCRIPT_URL = "https://plusflow.application-well.com.br/tw2overflow.user.js";

  /** Utilitário de log */
  const log = (...args) =>
    console.log("%c[tw2overflow-loader]", "color: purple; font-weight: bold", ...args);

  /** Solicita a API-Key ao usuário (não persiste em lugar nenhum) */
  function askApiKey() {
    const key = prompt("Digite sua API-Key:", "")?.trim();
    if (!key) {
      alert("API-Key é obrigatória. Abortando o carregamento do script.");
      throw new Error("API-Key não informada");
    }
    return key;
  }

  /** Faz o download e executa o script principal */
  async function loadScript() {
    try {
      const apiKey = askApiKey();

      const resp = await fetch(SCRIPT_URL, {
        headers: { "X-Api-Key": apiKey },
        cache: "no-cache",
        mode: "cors",
      });

      if (!resp.ok) {
        alert(`Falha ao baixar o script: HTTP ${resp.status}`);
        throw new Error(`HTTP ${resp.status}`);
      }

      const code = (await resp.text()).trim();
      if (!code) {
        alert("Script recebido está vazio.");
        throw new Error("Empty script");
      }

      log("Script carregado; executando…");
      unsafeWindow.eval(code);   // executa no contexto da página
      log("Script executado com sucesso");
    } catch (err) {
      log("Erro:", err);
    }
  }

  // Execução imediata
  loadScript();
})();
