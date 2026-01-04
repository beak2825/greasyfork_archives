// ==UserScript==
// @name         WK Read that if you can
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Change font and font sizing for wanikani reviews
// @author       Gorbit99
// @include      /^https:\/\/(preview\.|www\.)wanikani.com\/(review|extra_study|lesson)\/session.*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// @require      https://greasyfork.org/scripts/441792-cidwwa/code/CIDWWA.js?version=1031511
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/442373/WK%20Read%20that%20if%20you%20can.user.js
// @updateURL https://update.greasyfork.org/scripts/442373/WK%20Read%20that%20if%20you%20can.meta.js
// ==/UserScript==
"use strict";

(function() {
  const googleApiLink = document.createElement("link");
  googleApiLink.rel = "preconnect";
  googleApiLink.href = "https://fonts.googleapis.com";
  const gstaticLink = document.createElement("link");
  gstaticLink.rel = "preconnect";
  gstaticLink.href = "https://fonts.gstatic.com";
  gstaticLink.crossOrigin = true;
  document.head.append(googleApiLink);
  document.head.append(gstaticLink);

  function addFontToSite(font) {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css?family=" +
      font.family.replace(/ /g, "+") +
      "&subset=japanese";
    link.rel = "stylesheet";
    document.head.append(link);
  }

  let settings = {
    googleFonts: {},
    fontMin: 15,
    fontMax: 60,
  };

  const loadedSettings = window.localStorage.getItem("read-that.settings");

  const fontCache = JSON.parse(
    window.localStorage.getItem("read-that.cache") ?? "{}"
  );

  for (let key in fontCache) {
    addFontToSite(fontCache[key]);
  }

  if (loadedSettings) {
    settings = JSON.parse(loadedSettings);
  }

  function saveSettings() {
    window.localStorage.setItem("read-that.settings", JSON.stringify(settings));
  }

  const modal = window.createModal({
    title: "Read That Settings",
  });

  function populateModal() {
    const containerStyle = `
      max-height:60vh;
      overflow-y:auto;
      width:1000px;
    `;

    const googleFontsStyle = `
      overflow-y:auto;
      border:1px solid grey;
      max-height:20em;
      min-height:10em;
      padding:0.5rem;
    `;

    const fontSizeStyle = `
      display:flex;
      justify-content:center;
      gap:2em;
      align-items:end;
    `;

    const onlineFontsStyle = `
      overflow-y:auto;
      border:1px solid grey;
      max-height:20em;
      min-height:10em;
      padding:0.5rem;
    `;

    modal.setContent(`
      <div class="read-that-settings" style="${containerStyle}">
        <h3>Font Size</h3>
        <div style="${fontSizeStyle}">
          <input type="number" class="read-that-font-min" 
            value="${settings.fontMin}" style="width:5ch"/>
          <span class="read-that-font-min-example" 
            style="font-size:${settings.fontMin}px">小</span>
          <span class="read-that-font-max-example" 
            style="font-size:${settings.fontMax}px">大</span>
          <input type="number" class="read-that-font-max" 
            value="${settings.fontMax}" style="width:5ch"/>
        </div>
        <h3>Google Fonts</h3>
        <div class="read-that-google-fonts" style="${googleFontsStyle}"></div>
      </div>
    `);

    loadGoogleFonts().then();

    const fontMin = document.querySelector(".read-that-font-min");
    const fontMax = document.querySelector(".read-that-font-max");

    modal.onClose(() => {
      [...document.querySelectorAll(".read-that-google-selector")]
        .forEach((selector) => {
          settings.googleFonts[selector.name] = selector.checked;
        });
      settings.fontMin = parseInt(fontMin.value);
      settings.fontMax = parseInt(fontMax.value);
      saveSettings();
      modal.close();
    });

    const fontMinExample =
      document.querySelector(".read-that-font-min-example");
    const fontMaxExample =
      document.querySelector(".read-that-font-max-example");

    fontMin.addEventListener("keydown", (e) => {
      e.stopPropagation();
    });

    fontMax.addEventListener("keydown", (e) => {
      e.stopPropagation();
    });

    fontMin.addEventListener("mouseup", (e) => {
      e.stopPropagation();
    });

    fontMax.addEventListener("mouseup", (e) => {
      e.stopPropagation();
    });

    fontMin.addEventListener("change", () => {
      let minVal = parseInt(fontMin.value);
      let maxVal = parseInt(fontMax.value);

      if (minVal > 300) {
        fontMin.value = 300;
        minVal = 300;
      }
      if (minVal < 10) {
        fontMin.value = 10;
        minVal = 10;
      }
      if (maxVal < minVal) {
        fontMax.value = minVal;
        fontMaxExample.style.fontSize = `${fontMax.value}px`;
      }
      fontMinExample.style.fontSize = `${fontMin.value}px`;
    });

    fontMax.addEventListener("change", () => {
      let minVal = parseInt(fontMin.value);
      let maxVal = parseInt(fontMax.value);

      if (maxVal > 300) {
        fontMax.value = 300;
        maxVal = 300;
      }
      if (maxVal < 10) {
        fontMax.value = 10;
        maxVal = 10;
      }
      if (maxVal < minVal) {
        fontMin.value = maxVal;
        fontMinExample.style.fontSize = `${fontMin.value}px`;
      }
      fontMaxExample.style.fontSize = `${fontMax.value}px`;
    });
  }

  async function loadGoogleFonts() {
    const fonts = (await (
      await fetch(
        window.atob("aHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy"
          + "5jb20vd2ViZm9udHMvdjEvd2ViZm9udHM/a2V5PQ==") + stylingString)
    ).json())
      .items
      .filter((font) => font.subsets.includes("japanese"));

    const googleFontsContainer =
      document.querySelector(".read-that-google-fonts");

    fonts.forEach((font) => {
      if (fontCache[font.family] === undefined) {
        fontCache[font.family] = font;
        addFontToSite(font);
      }
    });

    window.localStorage.setItem("read-that.cache", JSON.stringify(fontCache));

    const formContainerStyle = `
      display:flex;
      flex-direction:row;
      align-items:center;
    `;

    const fontExampleStyle = `
      text-overflow:ellipsis;
      white-space:nowrap;
      overflow:hidden;
    `;

    googleFontsContainer.innerHTML = fonts.map((font, i) => `
        <div class="control-group flag"
          style="
            ${formContainerStyle}background:${i % 2 == 0 ? " #fff" : "#eee"};
          ">
        <div style="${fontExampleStyle}">
          <label class="flag__item" style="display:block;">
            ${font.family}
          </label>
          <span style="font-family:'${font.family}'; font-size:2em;">
            ${exampleSentence}
          </span>
        </div>
        <div
          style="
        flex-grow:1; display:flex; justify-content:center; width:5em;
      ">
          <input
            type="checkbox"
            ${settings.googleFonts[font.family] ? "checked" : ""}
            class="read-that-google-selector"
            name="${font.family}"
            style="width:20px; height:20px;" />
        </div>
      </div>
    `).join("");
  }

  const exampleSentence =
    "政治家のキャリア40年にしてようやく総理大臣にまで登りつめました。";

  function addSettingsButton() {
    const buttonContainer = document.querySelector("#summary-button");
    const newButton = document.createElement("a");
    buttonContainer.append(newButton);
    newButton.innerHTML = `
      <i class="fa fa-font"></i>
    `;
    newButton.style.cursor = "pointer";
    newButton.title = "Open font settings";
    newButton.addEventListener("click", () => modal.toggle());
  }

  const stylingString = "AIzaSyAhd-3ke-7i5MBSJGF4HdLffjqhGvggJvo&sort=alpha";
  function setUpChanger() {
    const styleElem = document.createElement("style");
    document.head.append(styleElem);

    const callback = () => {
      const loadedFonts = Object.entries(settings.googleFonts)
        .filter((font) => font[1]).map((font) => font[0]);
      const randomFont =
        loadedFonts[Math.floor(Math.random() * loadedFonts.length)];

      const deltaSize = settings.fontMax - settings.fontMin + 1;
      const offset = Math.floor(Math.random() * deltaSize);
      const fontSize = settings.fontMin + offset;
      styleElem.innerHTML = `
        #character {
          display: flex;
          justify-content: center;
          align-items: center;
          height: ${Math.max(settings.fontMax * 1.5, 330)}px;
        }
        
        #character:not(:hover) span:not(.shown) {
          font-family:${randomFont};
          font-size:${fontSize}px;
        }

        #character span {
          white-space: nowrap;
        }
      `;

      const textElem = document.querySelector("#character span");
      const scaleRatio =
        Math.min(document.body.clientWidth / textElem.scrollWidth, 0.95);
      textElem.style.transform = `scale(${scaleRatio})`;
    };

    callback();

    window.$.jStorage.listenKeyChange("currentItem", callback);

    window.addEventListener("keydown", (e) => {
      if (e.key !== "Alt") {
        return;
      }
      document.querySelector("#character span").classList.add("shown");
    });

    window.addEventListener("keyup", (e) => {
      if (e.key !== "Alt") {
        return;
      }
      document.querySelector("#character span").classList.remove("shown");
    });
  }

  function wireUpOnlineFonts() {
    const onlineFontsContainer =
      document.querySelector(".read-that-online-fonts");

    const onlineFontsStyleElem = document.createElement("style");
    onlineFontsStyleElem.innerHTML = `
      .read-that-of-container.read-that-of-state {
      padding:1rem;
      border-radius:50 %;
      position:relative;
      height:0;
    }

    .read-that-of-container.read-that-of-state:before {
      font-weight:900;
      font-size:1em;
      font-family:FontAwesome;
      position:absolute;
      top:50 %;
      left:50 %;
      transform:translate(-50 %, -50 %);
    }

    .read-that-of-container.empty.read-that-of-state {
      background:lightgrey;
    }

    .read-that-of-container.empty.read-that-of-state:before {
      content:"\\3f";
    }

    @keyframes rotation {
      from {
        transform:rotate(0deg) translate(-50 %, -50 %);
      }
      to {
        transform:rotate(360deg) translate(-50 %, -50 %);
      }
    }

    .read-that-of-container.loading.read-that-of-state {
      background:yellow;
    }

    .read-that-of-container.loading.read-that-of-state:before {
      content:"\\f110";
      animation:rotation 1s steps(8) infinite;
      transform-origin:0 % 0 %;
    }

    .read-that-of-container.correct.read-that-of-state {
      background:darkgreen;
    }

    .read-that-of-container.correct.read-that-of-state:before {
      content:"\\f00c";
      color:white;
    }

    .read-that-of-container.incorrect.read-that-of-state {
      background:red;
    }

    .read-that-of-container.incorrect.read-that-of-state:before {
      content:"\\f071";
      color:white;
    }
    `;

    document.head.append(onlineFontsStyleElem);

    let nextElement;

    const addField = () => {
      const fieldContainer = document.createElement("div");

      onlineFontsContainer.append(fieldContainer);

      fieldContainer.innerHTML = `
        <input class="read-that-of-input" style="width:90%; padding:0.5em;">
        <span class="read-that-of-state"></span>
    `;

      fieldContainer.classList.add("read-that-of-container");
      fieldContainer.classList.add("empty");
      fieldContainer.style.display = "flex";
      fieldContainer.style.flexDirection = "row";
      fieldContainer.style.justifyContent = "space-between";
      fieldContainer.style.margin = "0.25em";
      fieldContainer.style.alignItems = "center";

      const inputField = fieldContainer.querySelector(".read-that-of-input");

      const checkFont = async () => {
        fieldContainer.classList.replace("empty", "loading");

        const font = new FontFace("test", `url(${inputField.value}`);
        font.load().then(() => {
          fieldContainer.classList.replace("loading", "correct");
        }).catch((e) => {
          fieldContainer.classList.replace("loading", "incorrect");
        });
      };

      inputField.addEventListener("blur", () => {
        if (inputField.value.length !== 0) {
          checkFont();
          return;
        }
        if (onlineFontsContainer.childElementCount !== 1) {
          fieldContainer.remove();
        }
      });

      inputField.addEventListener("focus", () => {
        if (nextElement.container === fieldContainer) {
          addField();
        }
      });

      inputField.addEventListener("keydown", (e) => {
        e.stopPropagation();
      });

      nextElement = {
        input: inputField,
        container: fieldContainer,
      };
    };

    addField();
  }

  populateModal();
  addSettingsButton();
  setUpChanger();
})();
