// ==UserScript==
// @name         Always Start With 1000 Resources
// @author       EmersonxD
// @description  Start with 1000 resources in moomoo.io
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @grant        none
// @run-at       document-start
// @version      0.0.3
// @namespace    https://greasyfork.org/pt-BR/users/305931-emerson-bardusco
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465597/Always%20Start%20With%201000%20Resources.user.js
// @updateURL https://update.greasyfork.org/scripts/465597/Always%20Start%20With%201000%20Resources.meta.js
// ==/UserScript==

// Verificar se o armazenamento local está disponível
if (typeof(Storage) !== "undefined") {
  // Verificar se a versão do código é a mais recente
  if (localStorage.getItem("version") !== "0.0.3") {
    // Definir a versão do código no armazenamento local
    localStorage.setItem("version", "0.0.3");
  }

  // Definir o valor de "res" no armazenamento local
  localStorage.setItem("res", 1000);
} else {
  // Exibir uma mensagem de erro se o armazenamento local não estiver disponível
  alert("O armazenamento local não está disponível neste navegador.");
}