// ==UserScript==
// @name QRespostas++
// @namespace https://github.com/sirmonteiro
// @license MIT
// @description This script add the functionality to Qmágico(formally Eduqo) to view answers and to watch vídeo automatitlly.
// @description:pt-BR Esse script adiciona a funcionalidade para o Qmágico(formalmente Eduqo) de ver respostas e assistir vídeos automaticamente.
// @version 0.1.3
// @icon https://i.imgur.com/9IV3lZq.png
// @match https://*.qmagico.com.br/cadernos/caderno/*
// @match https://*.qmagico.com.br/atividades/resolver/*
// @grant unsafeWindow
// @grant GM.getValue
// @grant GM.setValue
// @grant GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/422741/QRespostas%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/422741/QRespostas%2B%2B.meta.js
// ==/UserScript==

(function (open) {
  let answerLetters = ["A", "B", "C", "D", "E"];
  unsafeWindow.XMLHttpRequest.prototype.open = function () {
    this.addEventListener(
      "readystatechange",
      async function () {
        if (this.readyState == "4" && this.status == 200) {
          let response = JSON.parse(this.response);

          if (this.responseURL.includes("api/get_token_data")) {
            let userID = response.user_id;
            GM.setValue("userID", userID);
          }

          if (
            this.responseURL.includes(
              "rest_api/qplano_rest_api/api/load_caderno"
            )
          ) {
            let cadernoID = response.caderno.id.toString();
            GM.setValue("cadernoID", cadernoID);
          }

          if (this.responseURL.includes("api/get_content")) {
            let exerciselistID = response.id.toString();
            let exerciseKind = response.kind;
            if (exerciseKind == "EXERCISELIST") {
              let exercicesIDs = [];
              response.data.contents.forEach((exercise) => {
                exercicesIDs.push(exercise.id);
              });

              GM.setValue("exercicesIDs", exercicesIDs);
            }
            GM.setValue("exerciselistID", exerciselistID);
            GM.setValue("exerciseKind", exerciseKind);
          }

          if (
            this.responseURL.includes(
              "rest_api/resolver_atividades_rest_api/api/save_state"
            )
          ) {
            if (
              !document.getElementById("scriptbtndiv") &&
              document.getElementsByClassName("exam-card-body")[0]
            ) {
              let exerciseBoxDiv = document.createElement("div");
              exerciseBoxDiv.id = "scriptbtndiv";
              exerciseBoxDiv.style.display = "flex";
              exerciseBoxDiv.style.justifyContent = "center";
              exerciseBoxDiv.style.marginBottom = "16px";
              exerciseBoxDiv.innerHTML = `
                <button class='btn btn-large' id='pausebtn'>Pausar atividade</button>        
              `;
              document
                .getElementsByClassName("exam-card-body")[0]
                .appendChild(exerciseBoxDiv);
              let pausebtn = document.getElementById("pausebtn");
              pausebtn.addEventListener("click", async () => {
                alert(
                  "Atividade pausada, o tempo que você ficou fora da aba não será contado!"
                );
              });
            }
          }

          if (this.responseURL.includes("rest_api/metrics_rest_api/api/save")) {
            if (
              !document.getElementById("scriptbtndiv") &&
              document.getElementsByClassName("emg-exercise-box-padding")[0]
            ) {
              let exerciseBoxDiv = document.createElement("div");
              exerciseBoxDiv.style.display = "inline";
              exerciseBoxDiv.id = "scriptbtndiv";
              exerciseBoxDiv.innerHTML = `
              <button class='btn btn-large' id='answerbtn'>Ver resposta</button>
              `;

              document
                .getElementsByClassName("emg-exercise-box-padding")[0]
                .appendChild(exerciseBoxDiv);
              let answerbtn = document.getElementById("answerbtn");
              answerbtn.addEventListener("click", async () => {
                answerbtn.classList.add("btn-progress");
                answerbtn.classList.add("btn-progress-diagonal");

                let actualExercise = Number(
                  document
                    .getElementsByClassName("box-title")[0]
                    .innerText.split(" ")[1]
                );

                let userID = await GM.getValue("userID");
                let cadernoID = await GM.getValue("cadernoID");
                let exerciselistID = await GM.getValue("exerciselistID");
                let exercicesIDs = await GM.getValue("exercicesIDs");

                let bodyManipulado = `metrics=[{"action":"ContentAccessLog","content_id":"","creation":1000000000000.0,"time_spent_milis":13304,"context":{"page":"VISUALIZAR_CURSO+-+MAIN","course_id":""},"last_update":1000000000000.0,"closed":true},{"action":"ContentAccessLog","user_id":"${userID}","content_id":"${
                  exercicesIDs[actualExercise - 1]
                }","creation":1000000000000,"time_spent_milis":0,"exerciselist":{"id":${exerciselistID},"kind":"EXERCISELIST","metadata":{},"data":{"content_ids":[]}},"context":{"page":"VISUALIZAR_CURSO+-+MAIN","course_id":"${cadernoID}"}}]`;

                await fetch(
                  "https://integradaeducativa.qmagico.com.br/rest_api/metrics_rest_api/api/save",
                  {
                    credentials: "include",
                    headers: {
                      "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0",
                      Accept: "application/json, text/plain, */*",
                      "Accept-Language": "pt-BR,en-US;q=0.7,en;q=0.3",
                      "Content-Type":
                        "application/x-www-form-urlencoded;charset=utf-8",
                      "X-Requested-With": "XMLHttpRequest",
                    },
                    body: bodyManipulado,
                    method: "POST",
                    mode: "cors",
                  }
                )
                  .then(async (res) => {
                    let data = await res.json();
                    if (res.ok) {
                      // let exercise = (data[0].log.question_index) + 1
                      // let alternative = answerLetters[data[0].content.data.answers.correct_answer]
                      let correctAnswerIndex =
                        data[0].content.data.answers.correct_answer;
                      let answerdiv = document.createElement("div");
                      if (
                        !data[0].content.data.answers.correct_answer.toString()
                      ) {
                        let answerComment =
                          data[0].content.data.answers.comment;
                        if (!answerComment) {
                          answerComment =
                            "<h3>Infelizmente o professor não colocou comentário da resposta :(</h3>";
                        }
                        answerdiv.innerHTML = `
                  <div class="divisor-line divisor-line-darker" />
                  <div class='emg-exercise-gabarito'>
                    <div class='emg-exercise-gabarito-comentario p-margin-2'>
                      <strong class='emg-exercise-gabarito-comentario-title'>Comentário da resposta</strong>
                      <span style='font-size: 12pt'>
                      ${answerComment}
                      </span>
                    </div>
                  </div>
                  `;
                      } else {
                        answerdiv.innerHTML = `
                  <div class="divisor-line divisor-line-emboss" />
                  <div class='emg-exercise-gabarito'>
                    <p class='emg-exercise-gabarito-label'>
                      <strong>
                        Resposta correta:
                        <span class="badge badge-circle badge-small badge-success">
                        ${answerLetters[correctAnswerIndex]}
                        </span>
                      </strong>
                    </p>
                  </div>
                  `;
                        document
                          .getElementsByClassName(
                            "emg-exercise-multiple-choice-answer-item"
                          )
                          [correctAnswerIndex].click();
                      }
                      document
                        .getElementsByClassName("emg-exercise-footer")[0]
                        .appendChild(answerdiv);
                      answerbtn.classList.remove("btn-progress");
                      answerbtn.classList.remove("btn-progress-diagonal");
                      answerbtn.disabled = "disabled";
                      GM.deleteValue(exerciselistID);
                      GM.deleteValue(exercicesIDs);
                      // alert(exercise + ':' + alternative)
                    } else {
                      console.log("erro", res.status);
                    }
                  })
                  .catch((err) => {
                    throw err;
                  });
              });
            }
          }

          if (
            this.responseURL.includes(
              "rest_api/listing_rest_api/home/list_my_interactions"
            )
          ) {
            if (
              (await GM.getValue("exerciseKind", false)) == "VIDEO" &&
              !document.getElementById("scriptbtndiv")
            ) {
              let scriptbtndiv = document.createElement("div");
              scriptbtndiv.id = "scriptbtndiv";
              scriptbtndiv.innerHTML = `
              <button class='btn btn-large' id='videobtn'>Assistir Vídeo</button>
              `;
              document
                .getElementsByClassName("qm-content-toolbar-actions-wrapper")[0]
                .insertAdjacentElement("afterbegin", scriptbtndiv);

              let videobtn = document.getElementById("videobtn");
              videobtn.addEventListener("click", async () => {
                videobtn.classList.add("btn-progress");
                videobtn.classList.add("btn-progress-diagonal");

                let userID = await GM.getValue("userID");
                let cadernoID = await GM.getValue("cadernoID");
                let videoID = await GM.getValue("exerciselistID");

                let videoBody = `metrics=[{"action":"ContentInteraction","kind":"VIDEO","user_id":"${userID}","content_id":"${videoID}","creation":1000000000000,"last_update":1000000000000,"accesses":0,"context":{"page":"VISUALIZAR_CURSO+-+MAIN","course_id":"${cadernoID}"},"key":"","stop":20000}]`;

                await fetch(
                  "https://integradaeducativa.qmagico.com.br/rest_api/metrics_rest_api/api/save",
                  {
                    credentials: "include",
                    headers: {
                      "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0",
                      Accept: "application/json, text/plain, */*",
                      "Accept-Language": "pt-BR,en-US;q=0.7,en;q=0.3",
                      "Content-Type":
                        "application/x-www-form-urlencoded;charset=utf-8",
                      "X-Requested-With": "XMLHttpRequest",
                    },
                    body: videoBody,
                    method: "POST",
                    mode: "cors",
                  }
                )
                  .then((res) => {
                    if (res.ok && res.status == 200) {
                      videobtn.classList.remove("btn-progress");
                      videobtn.classList.remove("btn-progress-diagonal");
                      videobtn.disabled = "disabled";
                      GM.deleteValue(videoID);
                      location.reload();
                    } else {
                      console.log("erro", res.status);
                    }
                  })
                  .catch((err) => {
                    throw err;
                  });
              });
            }
          }
        }
      },
      false
    );
    open.apply(this, arguments);
  };
})(unsafeWindow.XMLHttpRequest.prototype.open);
