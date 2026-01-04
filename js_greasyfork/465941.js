// ==UserScript==
// @name        Master
// @description Digitação Produtividade
// @author      murielguedes@pm.me
// @namespace   https://github.com/muriel-guedes/digitacao-produtividade
// @copyright   2023, murielguedes (https://openuserjs.org/users/murielguedes)
// @license     MIT
// @version     1.0
// @run-at      document-end
// @grant       none
// @match       https://plataforma-vendas.bancomaster.com.br/saque/saque-cadastro
// @downloadURL https://update.greasyfork.org/scripts/465941/Master.user.js
// @updateURL https://update.greasyfork.org/scripts/465941/Master.meta.js
// ==/UserScript==

document.body.addEventListener('keydown', e => {
  if (e.altKey && (e.key == "w" || e.key == "W"))
    for(let i of document.getElementsByClassName("mat-checkbox-input"))
      i.click()
})










