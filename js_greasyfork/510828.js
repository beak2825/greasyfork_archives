// ==UserScript==
// @name         AutoAlura
// @namespace    http://tampermonkey.net/
// @version      13
// @description  Ninguem aguenta mais o alura 😃
// @author       Alfinhoz
// @match        https://cursos.alura.com.br/*
// @license GNU GPLv3
// @icon https://imgs.search.brave.com/q-X8zxRbD9z64iH9Hr2d2LpfwG1L1kDsjKs1SUzyjNI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hdHRh/Y2htZW50cy5ndXB5/LmlvL3Byb2R1Y3Rp/b24vY29tcGFuaWVz/Lzg4ODEvY2FyZWVy/LzIwNjAyL2ltYWdl/cy8yMDI0LTA3LTEy/XzE1LTEzX2NvbXBh/bnlMb2dvVXJsLmpw/Zw
// @downloadURL https://update.greasyfork.org/scripts/510828/AutoAlura.user.js
// @updateURL https://update.greasyfork.org/scripts/510828/AutoAlura.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let isScriptActive = JSON.parse(localStorage.getItem("scriptAtivo"));
  if (isScriptActive === null) {
    isScriptActive === true;

    localStorage.setItem("scriptAtivo", JSON.stringify(isScriptActive));
  }
  let blockClickDelay = 1000;

  function createLogContainer() {
    let logContainer = document.getElementById("autoAluraLogContainer");
    if (!logContainer) {
      logContainer = document.createElement("div");
      logContainer.id = "autoAluraLogContainer";
      logContainer.style.position = "fixed";
      logContainer.style.bottom = "10px";
      logContainer.style.right = "10px";
      logContainer.style.maxHeight = "200px";
      logContainer.style.width = "300px";
      logContainer.style.overflow = "hidden";
      logContainer.style.padding = "10px";
      logContainer.style.zIndex = "999";
      logContainer.style.display = "flex";
      logContainer.style.flexDirection = "column-reverse";

      document.body.appendChild(logContainer);
    }
    return logContainer;
  }

  function logToScreen(message) {
    const logContainer = createLogContainer();
    const logMessage = document.createElement("div");

    logMessage.textContent = message;
    logMessage.style.background = "rgba(0, 0, 0, 0.7)";
    logMessage.style.color = "#fff";
    logMessage.style.padding = "8px";
    logMessage.style.margin = "5px 0";
    logMessage.style.borderRadius = "5px";
    logMessage.style.fontSize = "14px";
    logMessage.style.opacity = "1";
    logMessage.style.transition =
      "opacity .5s ease-out, transform .5s ease-out";

    logContainer.appendChild(logMessage);

    setTimeout(() => {
      logMessage.style.opacity = "1";
      logMessage.style.transform = "translateY(0)";
    }, 10);

    setTimeout(() => {
      logMessage.style.opacity = "0";
      logMessage.style.transform = "translateY(-15px)";
      setTimeout(() => logMessage.remove(), 500);
    }, 3000);
  }
  const water_mark = document.querySelector(".formattedText");
  if (water_mark) {
    water_mark.innerHTML = "É o Alfinhoz ✯";
  }

  async function autoPlayVideo() {
    const video = document.querySelector("video");
    if (video && video.paused) {
      logToScreen("Vídeo encontrado, iniciando...");
      video.play();
      await new Promise((resolve) => {
        video.onplay = resolve;
      });
      logToScreen("Vídeo reproduzido.");
      return true;
    }
    return false;
  }

  function clickCorrectAlternative() {
    let correctAlternatives = document.querySelectorAll(
      'ul.alternativeList li[data-correct="true"]'
    );
    if (correctAlternatives.length > 0) {
      correctAlternatives.forEach((li) => {
        const radioInput = li.querySelector('input[type="radio"]');
        if (radioInput && !li.classList.contains("clicked")) {
          radioInput.click();
          logToScreen("Clicando na alternativa correta: " + li.innerText);
          const event = new Event("change", {
            bubbles: true,
            cancelable: true,
          });
          radioInput.dispatchEvent(event);
          li.classList.add("clicked");
        }
      });
      return true;
    }
    return false;
  }

  async function clickMultitaskAlternatives() {
    const multitaskSections = document.querySelectorAll(
      "section.task.class-page-for-MULTIPLE_CHOICE"
    );
    let alternativesClicked = false;

    logToScreen("Verificando as seções MULTIPLE_CHOICE.");

    for (let section of multitaskSections) {
      const taskBody = section.querySelector(".task-body");
      if (taskBody) {
        const taskWrapper = taskBody.querySelector(".task-body__wrapper");
        if (taskWrapper) {
          const mainContainer = taskWrapper.querySelector(
            ".task-body-main.container"
          );
          if (mainContainer) {
            const multipleChoiceSection = mainContainer.querySelector(
              ".multipleChoice#task-content"
            );
            if (multipleChoiceSection) {
              const container =
                multipleChoiceSection.querySelector("div.container");
              if (container) {
                const alternativeList =
                  container.querySelector("ul.alternativeList");
                if (alternativeList) {
                  const form = alternativeList.querySelector("form");
                  if (form) {
                    const correctAlternatives = form.querySelectorAll(
                      'li[data-correct="true"]'
                    );

                    if (correctAlternatives.length > 0) {
                      logToScreen("Alternativas corretas encontradas.");
                      correctAlternatives.forEach((li) => {
                        const checkboxInput = li.querySelector(
                          'input[type="checkbox"]'
                        );
                        if (checkboxInput) {
                          if (!li.classList.contains("clicked")) {
                            checkboxInput.click();
                            logToScreen(
                              "Clicando na alternativa correta (checkbox): " +
                                li.querySelector(
                                  ".alternativeList-item-alternative"
                                ).textContent
                            );
                            const event = new Event("change", {
                              bubbles: true,
                              cancelable: true,
                            });
                            checkboxInput.dispatchEvent(event);
                            li.classList.add("clicked");
                            alternativesClicked = true;
                          }
                        }
                      });
                    } else {
                      logToScreen("Nenhuma alternativa correta encontrada.");
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return alternativesClicked;
  }

  function decodeBase64(encoded) {
    const decoded = atob(encoded);
    return decoded;
  }

  async function clickBlocksInOrder() {
    logToScreen("Iniciando a função clickBlocksInOrder.");
    const blocksContainer = document.querySelector(".blocks");
    if (blocksContainer) {
      const correctOrder = blocksContainer.dataset.correctOrder;
      const firstDecoding = decodeBase64(correctOrder);
      const secondDecoding = decodeBase64(firstDecoding);
      let decodedTexts = decodeURIComponent(escape(secondDecoding))
        .split(",")
        .map((text) => text.trim());
      logToScreen("Textos decodificados:", decodedTexts);
      let blockButtons = Array.from(blocksContainer.querySelectorAll(".block")); // Alterado para let
      logToScreen("Total de botões disponíveis:", blockButtons.length);

      for (const text of decodedTexts) {
        let blockButton;
        let attempts = 0;

        while (attempts < 5) {
          blockButton = blockButtons.find(
            (button) => button.textContent.trim() === text
          );
          if (blockButton && !blockButton.classList.contains("clicked")) {
            try {
              blockButton.click();
              logToScreen("Clicando no bloco: " + text);
              blockButton.classList.add("clicked");
              await new Promise((resolve) =>
                setTimeout(resolve, blockClickDelay)
              );
              break;
            } catch (error) {
              console.error("Erro ao clicar no bloco: ", error);
            }
          } else {
            logToScreen(
              "Tentativa " +
                (attempts + 1) +
                ": Botão não encontrado ou já clicado para o texto: " +
                text
            );
          }
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        blockButtons = blockButtons.filter(
          (button) => !button.classList.contains("clicked")
        );
      }

      await submitAnswer();

      await new Promise((resolve) => setTimeout(resolve, 3000));

      let nextButton = document.querySelector(
        "button.next, " +
          "a.next, " +
          'input[type="submit"].next, ' +
          ".task-actions-button .task-body-actions-button .task-actions-button-next, " +
          ".bootcamp-next-button, " +
          ".bootcamp-primary-button-theme"
      );
      if (nextButton) {
        nextButton.click();
        logToScreen("Avançando para a próxima página após clicar nos blocos.");
      }
    } else {
      logToScreen("Container de blocos não encontrado.");
    }
  }

  function submitAnswer() {
    let submitButton = document.querySelector("#submitBlocks");
    if (submitButton) {
      submitButton.click();
      logToScreen("Clicando em 'Submeter resposta'.");
    }
  }

  async function handlePageActivity() {
    logToScreen("Verificando atividade na página.");

    const videoPlayed = await autoPlayVideo();
    if (videoPlayed) {
      logToScreen("Avançando para a próxima página após o vídeo.");
      let nextButton = document.querySelector(
        "button.next, " +
          "a.next, " +
          'input[type="submit"].next, ' +
          ".task-actions-button .task-body-actions-button .task-actions-button-next, " +
          ".bootcamp-next-button, " +
          ".bootcamp-primary-button-theme"
      );
      if (nextButton) {
        nextButton.click();
        return;
      }
    }

    // Verificando uma escolha
    const alternativesClicked = clickCorrectAlternative();
    if (alternativesClicked) {
      let nextButton = document.querySelector(
        "button.next, " +
          "a.next, " +
          'input[type="submit"].next, ' +
          ".task-actions-button .task-body-actions-button .task-actions-button-next, " +
          ".bootcamp-next-button, " +
          ".bootcamp-primary-button-theme"
      );
      if (nextButton) {
        nextButton.click();
        logToScreen(
          "Avançando para a próxima página após clicar na alternativa correta."
        );
      }
      return;
    }

    // Verificando multitask
    const multitaskClicked = await clickMultitaskAlternatives();
    if (multitaskClicked) {
      let nextButton = document.querySelector(
        "button.next, " +
          "a.next, " +
          'input[type="submit"].next, ' +
          ".task-actions-button .task-body-actions-button .task-actions-button-next, " +
          ".bootcamp-next-button, " +
          ".bootcamp-primary-button-theme"
      );
      if (nextButton) {
        nextButton.click();
        logToScreen(
          "Avançando para a próxima página após clicar na alternativa multitask."
        );
      }
      return;
    }

    await clickBlocksInOrder();

    let nextButton = document.querySelector(
      "button.next, " +
        "a.next, " +
        'input[type="submit"].next, ' +
        ".task-actions-button .task-body-actions-button .task-actions-button-next, " +
        ".bootcamp-next-button, " +
        ".bootcamp-primary-button-theme"
    );
    if (nextButton) {
      nextButton.click();
      logToScreen("Avançando para a próxima página.");
    }
  }

  function monitorPage() {
    let interval = setInterval(async () => {
      if (!isScriptActive) return;

      await handlePageActivity();
    }, 3000);
  }

  function init() {
    monitorPage();
  }

  const controlButton = document.createElement("button");
  controlButton.textContent = isScriptActive
    ? "Desativar Script"
    : "Ativar Script";
  controlButton.style.position = "fixed";
  controlButton.style.top = "10px";
  controlButton.style.right = "10px";
  controlButton.style.padding = "10px";
  controlButton.style.zIndex = "999";
  controlButton.style.backgroundColor = "#00ff1f";
  controlButton.style.color = "white";
  controlButton.style.border = "none";
  controlButton.style.borderRadius = "5px";
  controlButton.style.cursor = "pointer";
  document.body.appendChild(controlButton);

  controlButton.addEventListener("click", () => {
    isScriptActive = !isScriptActive;
    localStorage.setItem("scriptAtivo", JSON.stringify("isScriptActive"));
    controlButton.innerText = isScriptActive
      ? "Desativar Script"
      : "Ativar Script";
    controlButton.style.backgroundColor = isScriptActive
      ? "#ff0000"
      : "#00ff1f";
    logToScreen(isScriptActive ? "Script Ativado" : "Script Desativado");
  });

  init();
})();
