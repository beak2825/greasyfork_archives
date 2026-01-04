// ==UserScript==
// @name         Mercado Livre: Clique em Cupons Automaticamente
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Clique nos botões de cupom
// @author       Github @marco-jardim
// @match        https://www.mercadolivre.com.br/cupons/*
// @grant        GM_addStyle
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/474678/Mercado%20Livre%3A%20Clique%20em%20Cupons%20Automaticamente.user.js
// @updateURL https://update.greasyfork.org/scripts/474678/Mercado%20Livre%3A%20Clique%20em%20Cupons%20Automaticamente.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Estilos CSS
    GM_addStyle(`
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
            right: 10px;
            top: 10px;
            z-index: 10000;
            background: #2C3E50;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
        }
        #controls label {
            color: #ECF0F1;
            margin-left: 10px;
        }
        #startButton {
            display: block;
            margin-top: 10px;
            padding: 5px 15px;
            background-color: #3498DB;
            color: #ECF0F1;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        #startButton:hover {
            background-color: #2980B9;
        }
    `);

    var i = 0;
    var tot = 0;

    function clickkkk() {
        i++;
        var button = document.querySelector(".coupon-card .andes-button.andes-button--small.andes-button--loud");
        if (button) {
            button.click();
            button.classList.add("click-" + i);
            document.getElementById("ckp").innerHTML += '<br>- Cupom clicado ' + i + '/' + tot;
            console.log("botão clicado " + i + '/' + tot);
            setTimeout(clickkkk, 700);
        } else {
            document.getElementById("ckp").innerHTML += '<br><b>Página finalizada<b>';
        }
    }

    function startClicking() {
        var buttons = document.querySelectorAll(".coupon-card .andes-button.andes-button--small.andes-button--loud");
        tot = buttons.length;
        if (tot > 0) {
            var div = document.createElement("div");
            div.id = "ckp";
            div.innerHTML = '<b>Clicando nos cupons (' + tot + '):</b>';
            document.body.appendChild(div);
            clickkkk();
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
        toggle.addEventListener("change", function() {
            localStorage.setItem("autoStartToggle", toggle.checked);
        });
        controlDiv.appendChild(toggle);

        var label = document.createElement("label");
        label.htmlFor = "autoStartToggle";
        label.innerText = " Iniciar Automaticamente";
        controlDiv.appendChild(label);

        var startButton = document.createElement("button");
        startButton.id = "startButton";
        startButton.innerText = "Começar a Clicar";
        startButton.addEventListener("click", startClicking);
        controlDiv.appendChild(startButton);

        document.body.appendChild(controlDiv);
    }

    addControls();

    setTimeout(function() {
        if (document.getElementById("autoStartToggle").checked) {
            startClicking();
        }
    }, 700);

})();
