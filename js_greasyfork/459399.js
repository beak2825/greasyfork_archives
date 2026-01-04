// ==UserScript==
// @name         QA Copier
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Цей скрипт створює текстовий файл з питаннями та відповідями, і надає можливість скачати його.
// @author       anonymous
// @match        https://b.optima-osvita.org/mod/quiz/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://unpkg.com/tesseract.js@4.0.2/dist/tesseract.min.js
// @downloadURL https://update.greasyfork.org/scripts/459399/QA%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/459399/QA%20Copier.meta.js
// ==/UserScript==

(function () {
  "use strict";

  setTimeout(() => {
    const block = document.querySelector("#block-region-side-pre");
    const testName = document.querySelector(
      "#page-navbar > nav > ol > li:nth-child(5) > a"
    ).textContent;
    const questions2 = document.querySelectorAll(".que");

    const imagesURL = []; // Адреса картинок для виконання серверних запитів.
    const qImages = [];
    const qText = [];

    let fileIsReady = false;

    block.insertAdjacentHTML(
      "beforeend",
      `<section id="mod_quiz_navblock" class="block block_fake card moodle-block mb-3" role="navigation" data-block="_fake" aria-labelledby="instance-0-header"> <div class="card-body"> <h5 id="instance-0-header" class="card-title d-inline"> <span id="mod_quiz_navblock_title">Відповіді для діскорду</span> </h5> <div id="questions" style="display: flex;height: 100px;align-items: center;justify-content: center;"><p><img width="40" height="40" src="https://thumbs.gfycat.com/CandidBarrenHamster-size_restricted.gif">Завантаження файлу з текстом..</p> </div> <div> <a id="download-test" href="#" style="width: 100%" class="btn btn-primary">Скачати файл</a> </div> </div></section>`
    );

    const downloadTest = document.querySelector("#download-test");

    downloadTest.addEventListener("click", () => {
      if (fileIsReady) {
        const type = "data:application/octet-stream;base64, ";
        const text = window.getQAText();
        const base = btoa(unescape(encodeURIComponent(text)));
        const res = type + base;

        downloadTest.download = testName + ".txt";
        downloadTest.href = res;
      } else {
        alert("Файл не готовий.");
      }
    });

    // Наповнюємо масиви для html елементів.
    for (let i = 0; i < questions2.length; i++) {
      const que = questions2[i];
      if (que.classList.contains("essay")) continue;
      const qImage = que.querySelectorAll("img");

      if (qImage !== null && qImage.length === 1) {
        imagesURL.push(qImage[0].src);
        qImages.push(qImage[0]);
      } else {
        qText.push(que.querySelector(".qtext"));
      }
    }

    qImages.forEach((image) => {
      image.insertAdjacentHTML(
        "afterend",
        `<p id="q-image-text"><img width="40" height="40" src="https://thumbs.gfycat.com/CandidBarrenHamster-size_restricted.gif">Завантаження..</p>`
      );
    });

    // Створюємо масив запитів на текст з картинок.
    const requests = imagesURL.map((url) => {
      return Tesseract.recognize(url, "ukr");
    });

    // Чекаємо виконання запитів, і виконуємо код.
    Promise.all(requests)
      .then((response) => {
        qImages.forEach((image, i) => {
          const text = response[i].data.text;
          image.closest("p").querySelector("#q-image-text").innerHTML = text;
        });

        return response;
      })
      .then((response) => {
        const table = document.querySelector(".generaltable");
        const questionsBlock = document.querySelector("#questions > p");

        if (table !== null) {
          const questions = [];
          const elements = [...qImages, ...qText];

          // Формуємо об.єкт з питаннями та відповідями.
          elements.forEach((element, i) => {
            const aTextSpan = element
              .closest(".que")
              .querySelector(".rightanswer > span");
            const aText = element.closest(".que").querySelector(".rightanswer");
            const aImageURL = element
              .closest(".que")
              .querySelector(".rightanswer > img");

            const rightAnswers = { aTextSpan, aImageURL };
            let rightAnswer = null;

            for (const key in rightAnswers) {
              if (rightAnswers[key] !== null) {
                rightAnswer =
                  rightAnswers[key].nodeName === "IMG"
                    ? rightAnswers[key].src
                    : rightAnswers[key].textContent;
              }
            }

            if (rightAnswer === null) rightAnswer = aText.textContent;

            if (element.nodeName === "IMG") {
              const qImageText = response[i].data.text;

              questions.push({
                question: qImageText,
                answer: rightAnswer,
              });
            } else {
              const qText = element.textContent;

              questions.push({
                question: qText,
                answer: rightAnswer,
              });
            }
          });

          function getQAText() {
            let QAText = "";

            for (let i = 0; i < questions.length; i++) {
              const question = questions[i].question;
              const answer = questions[i].answer;

              QAText += `------------\n${question}\nВідповідь: ${answer}\n\n`;
            }

            return QAText;
          }

          window.getQAText = getQAText;
          fileIsReady = true;
          questionsBlock.innerHTML = "Готово до скачування.";
        } else {
          questionsBlock.innerHTML = "Це не пройдений тест.";
        }
      });
  }, 1000);
})();
