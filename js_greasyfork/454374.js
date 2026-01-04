// ==UserScript==
// @name        Image generation: fix small image on mobile, novelai.net
// @namespace   Violentmonkey Scripts
// @match       https://novelai.net/*
// @grant       none
// @version     1.3
// @author      zackline
// @description Improves the mobile layout with full screen UX
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454374/Image%20generation%3A%20fix%20small%20image%20on%20mobile%2C%20novelainet.user.js
// @updateURL https://update.greasyfork.org/scripts/454374/Image%20generation%3A%20fix%20small%20image%20on%20mobile%2C%20novelainet.meta.js
// ==/UserScript==

const PROMPT_INPUT_ID = "prompt-input-0";

function setNativeValue(element, value) {
  const valueSetter = Object.getOwnPropertyDescriptor(element, "value").set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(
    prototype,
    "value"
  ).set;

  if (valueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else {
    valueSetter.call(element, value);
  }

  element.dispatchEvent(new Event("input", { bubbles: true }));
}

function createNewInput() {
  const input = document.getElementById(PROMPT_INPUT_ID);
  const inputCopy = input.cloneNode(true);

  // On change of input copy, copy value to original input via change event
  inputCopy.onchange = function () {
    setNativeValue(input, inputCopy.value);
  };
  return inputCopy;
}

function createNewGenerateButton() {
  const generateButton = Array.from(
    document.getElementsByTagName("button")
  ).filter((button) => button.innerText.includes("Generate"))[0];
  const generateButtonCopy = generateButton.cloneNode(true);
  generateButtonCopy.id = "copied-generate-button";

  // On click trigger click on generate button
  generateButtonCopy.addEventListener("click", () => {
    // Replace text with loading spinner
    generateButtonCopy.children[0].innerText = "...";
    generateButton.click();
  });
  return generateButtonCopy;
}

function insertNewElements(originalImage) {
  // Check if there is no element with id 'copied-image'
  if (!document.getElementById("copied-image")) {
    const newImg = document.createElement("img");
    newImg.id = "copied-image";
    newImg.src = originalImage.src;
    newImg.alt = originalImage.alt;
    // 100vw minus scrollbar width to avoid horizontal scroll
    newImg.style.width = "calc(100vw - (100vw - 100%))";
    document.getElementById("__next").before(newImg);
    originalImage.style.display = "none";

    const inputCopy = createNewInput();
    inputCopy.style.margin = "4px";
    inputCopy.style.width = "calc(100vw - (100vw - 100%) - 8px)";
    newImg.after(inputCopy);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.display = "flex";
    buttonsContainer.style.gap = "8px";
    buttonsContainer.style.margin = "4px 4px 64px 4px";

    inputCopy.after(buttonsContainer);
    const generateButtonCopy = createNewGenerateButton();
    buttonsContainer.appendChild(generateButtonCopy);

    const seedButton =
      originalImage.nextElementSibling.nextElementSibling.children[0];
    seedButton.querySelector("button").id = "original-seed-button";
    const seedButtonCopy = seedButton.cloneNode(true);
    seedButtonCopy.addEventListener("click", () => {
      seedButton.querySelector("button").click();
    });
    seedButtonCopy.querySelector("button").id = "copied-seed-button";

    buttonsContainer.appendChild(seedButtonCopy);
    const saveButtonsContainer = seedButton.nextElementSibling;
    const saveButtonsContainerCopy = saveButtonsContainer.cloneNode(true);
    saveButtonsContainerCopy.id = "copied-save-buttons-container";
    buttonsContainer.appendChild(saveButtonsContainerCopy);
    // Fix save buttons click handlers
    const originalSaveButtons = Array.from(
      saveButtonsContainer.querySelectorAll("button")
    );
    document
      .getElementById("copied-save-buttons-container")
      .querySelectorAll("button")
      .forEach((button, i) => {
        // Click original button
        button.addEventListener("click", () => {
          originalSaveButtons[i].click();
        });
      });
  }
}

function findOriginalImage() {
  // Find img with src starting with 'blob'
  const imgs = Array.from(document.getElementsByTagName("img")).filter(
    (img) => img.src.startsWith("blob") && img.alt.length > 0
  );
  if (imgs.length > 0) {
    return imgs.length > 1 ? imgs[1] : imgs[0];
  }
}

let scriptInfoPlaced = false;

const placeScriptInfo = () => {
  // Find path that starts with 'M58'
  const paths = Array.from(document.getElementsByTagName("path")).filter(
    (path) => path.getAttribute("d").startsWith("M58")
  );
  if (paths.length > 0) {
    const placeholderImage = paths[0].parentElement;
    if (placeholderImage.tagName === "svg") {
      // Insert span with script info
      const scriptInfo = document.createElement("span");
      scriptInfo.innerText = `Size fix v${GM_info?.script?.version}`;
      placeholderImage.replaceWith(scriptInfo);
    }
  }
};

const interval = setInterval(function () {
  if (document.getElementById(PROMPT_INPUT_ID)) {
    if (!scriptInfoPlaced) {
      placeScriptInfo();
      scriptInfoPlaced = true;
    }

    const img = findOriginalImage();
    if (img) {
      if (!document.getElementById("copied-image")) {
        insertNewElements(img);
      } else {
        // Update new image with the latest original image source
        if (document.getElementById("copied-image").src !== img.src) {
          document.getElementById("copied-image").src = img.src;
          const copiedGenerateButton = document.getElementById(
            "copied-generate-button"
          );
          if (copiedGenerateButton) {
            copiedGenerateButton.children[0].innerText = "Generate";
          }

          // Update copied seed button value
          const copiedSeedButton =
            document.getElementById("copied-seed-button");
          if (copiedSeedButton) {
            copiedSeedButton.innerText = document.getElementById(
              "original-seed-button"
            ).innerText;
          }
        }
      }
    }
  }
}, 500);
