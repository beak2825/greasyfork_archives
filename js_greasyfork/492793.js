// ==UserScript==
// @name         Khan Respostas 1.4
// @version      1.4
// @description  Respostas Khan 
// @author       Emerson
// @match        https://pt.khanacademy.org/*
// @grant        none
// @namespace https://greasyfork.org/pt-BR/users/305931-emerson-bardusco
// @downloadURL https://update.greasyfork.org/scripts/492793/Khan%20Respostas%2014.user.js
// @updateURL https://update.greasyfork.org/scripts/492793/Khan%20Respostas%2014.meta.js
// ==/UserScript==
 
(function () {
  if (typeof khanRespostasCarregado !== 'boolean' || !khanRespostasCarregado) {
    khanRespostasCarregado = true;

    const overlayHTML = `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
      <div id="box">
        <button class="main" id="accordian">=</button>
        <div class="main" id="box2">
          <center>
            <p class="pdark" id="pdark"> KHAN </p>
          </center>
          <button onclick="location.reload()" class="inputans">Resetar</button>
          <br>
          <center>
            <section><label id="ansHead">--</label></section>
          </center>
          <center id="mainCen">
            <section><label id="ansBreak">&nbsp;</label></section>
          </center>
          <section><label>&nbsp;</label></section>
          <section class="toggleclass"><label>M para esconder Menu</label></section>
        </div>
      </div>
    `;

    function get(x) {
      return document.getElementById(x);
    }

    const overlay = document.createElement("div");
    overlay.innerHTML = overlayHTML;
    document.body.appendChild(overlay);

    const acc = get("accordian"),
      darkToggle = get("darkToggle"),
      ansbutton = get("inputans");

    acc.onclick = function () {
      const panel = get("box2");
      panel.style.display = panel.style.display === "grid" ? "none" : "grid";
    };

    document.addEventListener("keydown", (event) => {
      if (event.key === "m" || event.key === "M") {
        const panel = get("box2");
        panel.style.display = panel.style.display === "grid" ? "none" : "grid";
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'M') {
        let panel = get("box2");
        if (panel.style.display == "grid") panel.style.display = "none";
        else { panel.style.display = "grid"; }
      }
    });

    'use strict';
    window.loaded = false;

    class Answer {
      constructor(answer, type) {
        this.body = answer;
        this.type = type;
      }

      get isMultiChoice() {
        return this.type == "multiple_choice";
      }

      get isFreeResponse() {
        return this.type == "free-response";
      }

      get isExpression() {
        return this.type == "expression";
      }

      get isDropdown() {
        return this.type == "dropdown";
      }

      log() {
        const answer = this.body;

        answer.map(ans => {
          if (typeof ans == "string") {
            if (ans.includes("web+graphie")) {
              this.body[this.body.indexOf(ans)] = "";
              this.printImage(ans);
            } else {              answer[answer.indexOf(ans)] = ans.replaceAll("$", "");
            }
          }
        });
      }
    }

    const originalFetch = window.fetch;
    window.fetch = function () {
      return originalFetch.apply(this, arguments).then(async (res) => {
        if (res.url.includes("/getAssessmentItem")) {
          const clone = res.clone();
          const json = await clone.json();
          let item, question;

          item = json.data.assessmentItem.item;
          question = item.itemData.questions[0];

          if (question.presentation.widgets[0].type === "multiple_choice") {
            const answer = question.presentation.widgets[0].choices.filter(
              (choice) => choice.correct
            );

            new Answer([answer[0].id], "multiple_choice").log();
          } else if (question.presentation.widgets[0].type === "free-response") {
            new Answer([question.response.value], "free-response").log();
          } else if (question.presentation.widgets[0].type === "expression") {
            new Answer([question.response.value], "expression").log();
          } else if (question.presentation.widgets[0].type === "dropdown") {
            const answer = question.presentation.widgets[0].choices.filter(
              (choice) => choice.correct
            );

            new Answer([answer[0].id], "dropdown").log();
          }
        }

        return res;
      });
    };
  }
})();