// ==UserScript==
// @name         Empréstimo em lote no Koha rápido e fácil
// @namespace    https://greasyfork.org/pt-BR/users/1076289-marx-medeiros/
// @version      1.0
// @description  Adiciona o empréstimo em lote na página inicial de empréstimo no Koha e permite uso de leitor de código de barras e RFID.
// @author       Marx Medeiros - IFPB Campus João Pessoa
// @match        https://biblioteca-adm.ifpb.edu.br/cgi-bin/koha/circ/circulation.pl*
// @icon         https://biblioteca-adm.ifpb.edu.br/intranet-tmpl/prog/img/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465882/Empr%C3%A9stimo%20em%20lote%20no%20Koha%20r%C3%A1pido%20e%20f%C3%A1cil.user.js
// @updateURL https://update.greasyfork.org/scripts/465882/Empr%C3%A9stimo%20em%20lote%20no%20Koha%20r%C3%A1pido%20e%20f%C3%A1cil.meta.js
// ==/UserScript==

(function() {
    'use strict';

  // Utilitário: aguarda até que o seletor exista no DOM
  function waitForElement(selector, callback) {
    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(interval);
        callback(element);
      }
    }, 50);
  }

  // Dados dinâmicos carregados do próprio Koha
  const csrf = document.querySelector('input[name="csrf_token"]')?.value || '';
  const borrowernumber = document.querySelector('input[name="borrowernumber"]')?.value || '';
  const branchcode = document.querySelector('input[name="branch"]')?.value || '';

  // Formulário de empréstimo em lote
  const newForm = `
    <form method="post" enctype="multipart/form-data" action="/cgi-bin/koha/circ/circulation.pl">
      <input type="hidden" name="csrf_token" value="${csrf}">
      <fieldset id="circ_circulation_issue">
        <legend>Ou listar códigos de barras para Empréstimo em Lote</legend>
        <textarea style="overflow:hidden; font-style:italic; height:5ch; width:35.8ch" id="barcodelistcirc" name="barcodelist" placeholder="Listar um código de barras por linha"></textarea>
        <label for="password" class="hint">Senha para empréstimo:</label>
        <input type="password" id="password" name="password">&emsp;
        <button type="submit" class="btn btn-primary">Empréstimo</button>
        <input type="hidden" name="borrowernumber" id="borrowernumber" value="${borrowernumber}">
        <input type="hidden" name="branch" value="${branchcode}">
        <input type="hidden" name="batch" value="1">
        <input type="hidden" name="op" value="cud-checkout">
      </fieldset>
    </form>
  `;

  // Insere o novo formulário abaixo do existente
    const mainForm = document.getElementById("mainform");
    const circBatch = document.createElement('div');
    circBatch.innerHTML = newForm;
    mainForm.insertAdjacentElement('beforeend', circBatch);

  // Redimensiona o textarea automaticamente ao digitar
  waitForElement('#barcodelistcirc', (textarea) => {
    textarea.style.height = textarea.scrollHeight + 'px';
    textarea.addEventListener('input', () => {
      textarea.style.height = textarea.scrollHeight + 'px';
    });
  });

  // Diminue o tamanho do campo de senha
  const inputs = document.querySelectorAll('input[type="password"]');
  inputs.forEach((input) => {
    input.style.width = '14ch';
  });

  // Simula TAB entre campo de código de barras e de senha
  waitForElement('#barcode', (barcodeInput) => {
    waitForElement('#password', (passwordInput) => {
      barcodeInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
        if (barcodeInput.value.trim() === '') {
          event.preventDefault(); // Não faz nada se estiver vazio
        } else {
          event.preventDefault();
          passwordInput.focus(); // Avança para senha
        }
      }
      });

  // Impede envio com Enter se o campo de senha estivere vazio
  waitForElement('#password', () => {
    const passwordInputs = document.querySelectorAll('#password');
    passwordInputs.forEach((input) => {
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && input.value.trim() === '') {
          event.preventDefault();
        }
      });
    });
  });
    });
  });

  // Desativa o formulário de empréstimo se houver empréstimo atrasado
  waitForElement('.odues.blocker', () => {
    const mainForm = document.getElementById('mainform');
    if (mainForm) {
      const elements = mainForm.querySelectorAll('input, button, select, textarea');
      elements.forEach((el) => {
        el.disabled = true;
      });
      mainForm.style.opacity = 0.3;
    }
  });

  // Destaca mensagem de empréstimo atrasado em negrito piscante
  waitForElement('.odues.blocker', (oduesBlocker) => {
    function toggleBold() {
      oduesBlocker.style.fontWeight =
        oduesBlocker.style.fontWeight === 'bold' ? 'normal' : 'bold';
    }
    setInterval(toggleBold, 300);
  });

  // Destaca mensagem de reserva aguardando retirada em negrito piscante
  waitForElement('.waitinghere, .waitingsince', () => {
    const blinkingElements = document.querySelectorAll('.waitinghere, .waitingsince');
    blinkingElements.forEach((el) => {
      setInterval(() => {
        el.style.fontWeight = el.style.fontWeight === 'bold' ? 'normal' : 'bold';
      }, 300);
    });
  });
})();