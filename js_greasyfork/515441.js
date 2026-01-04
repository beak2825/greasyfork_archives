// ==UserScript==
// @name         Nitro Type Theme Customizer
// @namespace    https://greasyfork.org/users/1331131-tensorflow-dvorak
// @version      1.16
// @author       TensorFlow - Dvorak
// @description  Theme Customizer
// @match        *://www.nitrotype.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  "use strict";

  const defaultBgColor = "#060516";
  const defaultTextColor = "#a6a4f7";
  const defaultCursorColor = "#0075ff";
  const defaultButtonColor = "#5a67d8";
  const defaultTypedTextColor = "#23223b";
  const defaultCardColor = "#1a1a2e";
  const defaultTypingAreaColor = "#0605163d";
  const defaultFont = '"Arial", sans-serif';

  const fonts = [
    "Arial, sans-serif",
    "Verdana, sans-serif",
    "Courier New, monospace",
    "Georgia, serif",
    "Times New Roman, serif",
    "Comic Sans MS, cursive",
    "Trebuchet MS, sans-serif",
    '"Montserrat", sans-serif',
    '"Roboto Mono", monospace',
    '"Courier New", Courier, monospace',
    '"Lucida Sans Typewriter", "Lucida Typewriter", monospace',
  ];

  GM_addStyle(`
    #theme-icon {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 45px;
        height: 45px;
        background-color: #5a67d8;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        cursor: pointer;
        font-size: 24px;
        z-index: 10000;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
        transition: transform 0.2s ease-in-out;
    }

    #theme-icon:hover {
        transform: scale(1.1);
    }

    #theme-modal {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 360px;
        background-color: #1a202c;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
        z-index: 10001;
        color: #e2e8f0;
        font-family: Arial, sans-serif;
        display: grid;
        width: fit-content;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
    }

    #theme-modal h2 {
        grid-column: span 2;
        margin-top: 0;
        color: #e2e8f0;
        font-size: 20px;
        font-weight: 600;
        text-align: center;
        padding-bottom: 10px;
        border-bottom: 1px solid #2d3748;
    }

    .input-field {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .input-field label {
        font-weight: 500;
        color: #a0aec0;
        flex: 1;
    }

    .input-field input[type="text"],
    .input-field input[type="color"] {
        height: 35px;
        border: none;
        border-radius: 6px;
        padding: 0 8px;
        background-color: #2d3748;
        color: #e2e8f0;
        font-size: 14px;
        outline: none;
        transition: transform 0.2s ease;
    }

    #apply-theme, #reset-theme {
        grid-column: span 2;
        display: block;
        width: 100%;
        padding: 12px;
        background-color: var(--button-color, #5a67d8);
        color: #fff;
        border: none;
        cursor: pointer;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        text-align: center;
        transition: background-color 0.2s ease;
        margin-top: 15px;
    }

    #apply-theme:hover, #reset-theme:hover {
        background-color: #434190;
    }

    #font-select {
        width: 100%;
        padding: 8px;
        border: 1px solid #4a5568;
        border-radius: 6px;
        background-color: #2d3748;
        color: #e2e8f0;
        font-size: 14px;
        cursor: pointer;
        outline: none;
        transition: transform 0.2s ease, background-color 0.2s ease;
    }

    #font-select:hover {
        transform: scale(1.02);
        background-color: #3b475a;
    }
  `);

  const themeIcon = document.createElement("div");
  themeIcon.id = "theme-icon";
  themeIcon.innerText = "🎨";
  document.body.appendChild(themeIcon);

  const themeModal = document.createElement("div");
  themeModal.style.display = "none";
  themeModal.id = "theme-modal";
  themeModal.innerHTML = `
    <h2>Customize Theme</h2>
    <div class="input-field">
        <label for="bg-color">Background Color</label>
        <input type="color" id="bg-color-picker" value="${defaultBgColor}">
        <input type="text" id="bg-color" value="${defaultBgColor}">
    </div>
    <div class="input-field">
        <label for="bg-image">Background Image URL</label>
        <input type="text" id="bg-image" placeholder="Image URL">
    </div>
    <div class="input-field">
        <label for="text-color">Text Color</label>
        <input type="color" id="text-color-picker" value="${defaultTextColor}">
        <input type="text" id="text-color" value="${defaultTextColor}">
    </div>
    <div class="input-field">
        <label for="cursor-color">Caret Color</label>
        <input type="color" id="cursor-color-picker" value="${defaultCursorColor}">
        <input type="text" id="cursor-color" value="${defaultCursorColor}">
    </div>
    <div class="input-field">
        <label for="button-color">Button Color</label>
        <input type="color" id="button-color-picker" value="${defaultButtonColor}">
        <input type="text" id="button-color" value="${defaultButtonColor}">
    </div>
    <div class="input-field">
        <label for="typed-text-color">Typed Text Color</label>
        <input type="color" id="typed-text-color-picker" value="${defaultTypedTextColor}">
        <input type="text" id="typed-text-color" value="${defaultTypedTextColor}">
    </div>
    <div class="input-field">
        <label for="card-color">Card Color</label>
        <input type="color" id="card-color-picker" value="${defaultCardColor}">
        <input type="text" id="card-color" value="${defaultCardColor}">
    </div>
    <div class="input-field">
        <label for="typing-area-color">Typing Area Color</label>
        <input type="color" id="typing-area-color-picker" value="${defaultTypingAreaColor}">
        <input type="text" id="typing-area-color" value="${defaultTypingAreaColor}">
    </div>
    <div class="input-field">
        <label for="typing-area-image">Typing Area Image URL</label>
        <input type="text" id="typing-area-image" placeholder="Image URL">
    </div>
    <div class="input-field">
        <label for="font-select">Font</label>
        <select id="font-select">
            ${fonts
              .map(
                (font) =>
                  `<option value="${font}">${font
                    .split(",")[0]
                    .replace(/"/g, "")}</option>`
              )
              .join("")}
        </select>
    </div>
    <button id="apply-theme">Apply Theme</button>
    <button id="reset-theme">Reset to Default</button>
  `;

  document.body.appendChild(themeModal);
  themeModal.style.display = "none";

  function syncColorInputs(pickerId, textId) {
    const picker = document.getElementById(pickerId);
    const textInput = document.getElementById(textId);

    picker.addEventListener("input", () => {
      textInput.value = picker.value;
    });

    textInput.addEventListener("input", () => {
      const colorValue = textInput.value;
      if (/^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6})$/.test(colorValue)) {
        picker.value = colorValue.slice(0, 7);
      }
    });
  }

  syncColorInputs("bg-color-picker", "bg-color");
  syncColorInputs("text-color-picker", "text-color");
  syncColorInputs("cursor-color-picker", "cursor-color");
  syncColorInputs("button-color-picker", "button-color");
  syncColorInputs("typed-text-color-picker", "typed-text-color");
  syncColorInputs("card-color-picker", "card-color");
  syncColorInputs("typing-area-color-picker", "typing-area-color");

  function loadTheme() {
    document.getElementById("bg-color").value =
      localStorage.getItem("nt_bgColor") || defaultBgColor;
    document.getElementById("bg-image").value =
      localStorage.getItem("nt_bgImage") || "";
    document.getElementById("text-color").value =
      localStorage.getItem("nt_textColor") || defaultTextColor;
    document.getElementById("cursor-color").value =
      localStorage.getItem("nt_cursorColor") || defaultCursorColor;
    document.getElementById("button-color").value =
      localStorage.getItem("nt_buttonColor") || defaultButtonColor;
    document.getElementById("typed-text-color").value =
      localStorage.getItem("nt_typedTextColor") || defaultTypedTextColor;
    document.getElementById("card-color").value =
      localStorage.getItem("nt_cardColor") || defaultCardColor;
    document.getElementById("typing-area-color").value =
      localStorage.getItem("nt_typingAreaColor") || defaultTypingAreaColor;
    document.getElementById("typing-area-image").value =
      localStorage.getItem("nt_typingAreaImage") || "";
    document.getElementById("font-select").value =
      localStorage.getItem("nt_font") || defaultFont;
  }

  themeIcon.addEventListener("click", () => {
    loadTheme();
    themeModal.style.display =
      themeModal.style.display === "none" ? "grid" : "none";
  });

  function applyTheme() {
    const bgColor = document.getElementById("bg-color").value;
    const bgImage = document.getElementById("bg-image").value;
    const textColor = document.getElementById("text-color").value;
    const cursorColor = document.getElementById("cursor-color").value;
    const buttonColor = document.getElementById("button-color").value;
    const typedTextColor = document.getElementById("typed-text-color").value;
    const cardColor = document.getElementById("card-color").value;
    const typingAreaColor = document.getElementById("typing-area-color").value;
    const typingAreaImage = document.getElementById("typing-area-image").value;
    const font = document.getElementById("font-select").value;

    document.body.style.backgroundColor = bgColor;
    document.body.style.background = bgImage ? `url(${bgImage})` : "";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.color = textColor;

    GM_addStyle(`
      .custom-cursor { color: ${cursorColor}; }
      .typed-text { color: ${typedTextColor}; }
      .card { background-color: ${cardColor}; }
      .typing-area {
          background-color: ${typingAreaColor};
          background: ${
            typingAreaImage ? `url(${typingAreaImage})` : "none"
          };
          background-size: cover;
          background-position: center;
      }
      :root { --button-color: ${buttonColor}; }
    `);

    localStorage.setItem("nt_bgColor", bgColor);
    localStorage.setItem("nt_bgImage", bgImage);
    localStorage.setItem("nt_textColor", textColor);
    localStorage.setItem("nt_cursorColor", cursorColor);
    localStorage.setItem("nt_buttonColor", buttonColor);
    localStorage.setItem("nt_typedTextColor", typedTextColor);
    localStorage.setItem("nt_cardColor", cardColor);
    localStorage.setItem("nt_typingAreaColor", typingAreaColor);
    localStorage.setItem("nt_typingAreaImage", typingAreaImage);
    localStorage.setItem("nt_font", font);

    themeModal.style.display = "none";
  }

  window.addEventListener("load", () => {
    loadTheme();
    applyTheme();
  });

  function clearLocalStorageValues() {
    const keys = [
      "nt_bgColor",
      "nt_bgImage",
      "nt_textColor",
      "nt_cursorColor",
      "nt_buttonColor",
      "nt_typedTextColor",
      "nt_cardColor",
      "nt_typingAreaColor",
      "nt_typingAreaImage",
      "nt_font",
    ];

    keys.forEach((key) => localStorage.removeItem(key));
  }

  function resetTheme() {
    clearLocalStorageValues();
    document.body.style.backgroundColor = defaultBgColor;
    document.body.style.backgroundImage = "";
    document.body.style.color = defaultTextColor;
    themeModal.style.display = "none";
  }

  document.getElementById("apply-theme").addEventListener("click", applyTheme);
  document.getElementById("reset-theme").addEventListener("click", resetTheme);
})();
