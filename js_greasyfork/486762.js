// ==UserScript==
// @name         Mercado Livre: Clique em Cupons Automaticamente Enhanced
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Clique nos botões de cupom
// @author       Github @marco-jardim Edit By NiceATC
// @match        https://www.mercadolivre.com.br/cupons/*
// @grant        GM_addStyle
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/486762/Mercado%20Livre%3A%20Clique%20em%20Cupons%20Automaticamente%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/486762/Mercado%20Livre%3A%20Clique%20em%20Cupons%20Automaticamente%20Enhanced.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
    #ckp, #controls {
      position: fixed;
      z-index: 10000;
    }
    #ckp {
      position: fixed;
      right: 10px;
      bottom: 15px;
      z-index: 10000;
      font-size: 12px;
      line-height: 1.2;
      padding: 10px;
      background: #fff;
      color: #000;
      border-radius: 4px;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
    }
    #controls {
      position: fixed;
      right: 84%;
      top: 72%;
      z-index: 10000;
      background: #727272;
      padding: 15px;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
    }
    #controls label {
      color: #ECF0F1;
      margin-left: 10px;
      display: inline-block;
      margin-bottom: 5px;
    }
    #controls label2 {
      color: #ECF0F1;
      margin-left: 10px;
      display: block;
      margin-bottom: 5px;
    }
    #startButton, #saveButton {
      display: inline-block;
      margin-top: 10px;
      padding: 5px 15px;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    #startButton {
      background-color: #3498DB;
      color: #ECF0F1;
      border: none;
      display: block; /* Nova adição para movê-lo para uma nova linha */
      margin-top: 10px; /* Adaptação de acordo com o display: block */
    }
    #startButton:hover {
      background-color: #2980B9;
    }
    #saveButton {
      background-color: #27AE60;
      color: #ECF0F1;
      border: none;
      margin-left: 10px;
    }
    #saveButton:hover {
      background-color: #219350;
    }
  `);

  var clickCount = 0;
  var totalButtons = 0;
  var clickInterval = 1000; // Valor padrão em milissegundos

  function clickCoupon(buttons) {
  if (clickCount < buttons.length) {
    var button = buttons[clickCount];
    button.click();
    button.classList.add("click-" + (clickCount + 1));
    document.getElementById("ckp").innerText = `- Cupom clicado ${clickCount + 1}/${totalButtons}`;
    console.log(`Botão clicado ${clickCount + 1}/${totalButtons}`);
    clickCount++;
    updatePageTitle(); // Atualiza o título da página após cada clique
    setTimeout(() => clickCoupon(buttons), clickInterval);
  } else {
    document.getElementById("ckp").innerText += '\nPágina finalizada';
    location.reload(); // Recarrega a página quando todos os cupons forem clicados
  }
}

  function startClicking() {
    var buttons = document.querySelectorAll(".coupon-card .andes-button.andes-button--small.andes-button--loud");
    totalButtons = buttons.length;
    clickCount = 0;

    if (totalButtons > 0) {
      var div = document.createElement("div");
      div.id = "ckp";
      div.innerText = `Clicando nos cupons (${totalButtons}):`;
      document.body.appendChild(div);
      clickCoupon(buttons);
    }
  }

  function updateClickInterval() {
    var intervalInput = document.getElementById("clickIntervalInput");
    clickInterval = parseInt(intervalInput.value, 10);
  }

  function saveClickInterval() {
    document.cookie = `clickInterval=${clickInterval}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
  }

  function loadSavedClickInterval() {
    var intervalCookie = document.cookie.replace(/(?:(?:^|.*;\s*)clickInterval\s*=\s*([^;]*).*$)|^.*$/, "$1");
    if (intervalCookie) {
      clickInterval = parseInt(intervalCookie, 10);
      document.getElementById("clickIntervalInput").value = clickInterval;
    }
  }

  function addControls() {
    var controlDiv = document.createElement("div");
    controlDiv.id = "controls";

    var toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.id = "autoStartToggle";
    if (localStorage.getItem("autoStartToggle") === "true") {
      toggle.checked = true;
    }
    toggle.addEventListener("change", function () {
      localStorage.setItem("autoStartToggle", toggle.checked);
    });
    controlDiv.appendChild(toggle);

    var autoStartLabel = document.createElement("label");
    autoStartLabel.htmlFor = "autoStartToggle";
    autoStartLabel.innerText = " Iniciar Automaticamente";
    controlDiv.appendChild(autoStartLabel);

    var intervalLabel = document.createElement("label2");
    intervalLabel.htmlFor = "clickIntervalInput";
    intervalLabel.innerText = " Intervalo de Clique (ms):";
    controlDiv.appendChild(intervalLabel);

    var intervalInput = document.createElement("input");
    intervalInput.type = "number";
    intervalInput.id = "clickIntervalInput";
    intervalInput.value = clickInterval;
    intervalInput.style.width = "80px";
    intervalInput.addEventListener("change", updateClickInterval);
    controlDiv.appendChild(intervalInput);

    var saveButton = document.createElement("button");
    saveButton.id = "saveButton";
    saveButton.innerText = "Salvar";
    saveButton.addEventListener("click", function () {
      saveClickInterval();
      saveButton.innerText = "Salvo";
      setTimeout(() => {
        saveButton.innerText = "Salvar";
      }, 2000);
    });
    controlDiv.appendChild(saveButton);

    var startButton = document.createElement("button");
    startButton.id = "startButton";
    startButton.innerText = "Começar a Clicar";
    startButton.addEventListener("click", startClicking);
    controlDiv.appendChild(startButton);

    document.body.appendChild(controlDiv);
    loadSavedClickInterval();
  }

  function updatePageTitle() {
    document.title = `(${clickCount}/${totalButtons}) Cupons Ativados!`;
  }

  addControls();

  setTimeout(function () {
    if (document.getElementById("autoStartToggle").checked) {
      startClicking();
      updatePageTitle();
    }
  }, 700);

  // Web Worker para continuar a execução em segundo plano
  if (window.Worker) {
    var worker = new Worker("data:application/javascript," + encodeURIComponent(`
      setInterval(() => {
        if (document.getElementById("autoStartToggle").checked) {
          startClicking();
          updatePageTitle();
        }
      }, 700);
    `));
  }
})();
