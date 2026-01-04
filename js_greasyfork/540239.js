// ==UserScript==
// @name         Cat Errors
// @namespace caterrors
// @description Replace error messages with cat images. 
// @version      0.1
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540239/Cat%20Errors.user.js
// @updateURL https://update.greasyfork.org/scripts/540239/Cat%20Errors.meta.js
// ==/UserScript==

(function() {
  "use strict";

  const lang = navigator.language || navigator.userLanguage;
  const langStrings = [
    {
      lang: "en",
      tempDisableBtn: "View Original Page",
      permDisableBtn: "Disable cat errors",
      enableButton: "Enable cat errors",
    },
    {
      lang: "pt",
      tempDisableBtn: "Ver página original", 
      permDisableBtn: "Desativar",
      enableButton: "Ativar", 
    },
  ];

  const text = langStrings.find(l => l.lang === lang.substring(0, 2)) || langStrings[0];

  const errors = [
    {
      code: 400,
      message: "bad request",
    },
    {
      code: 401,
      message: "unauthorized",
    },
    {
      code: 403,
      message: "forbidden",
    },
    {
      code: 404,
      message: "not found",
    },
    {
      code: 500,
      message: "internal server error",
    },
    {
      code: 502,
      message: "bad gateway",
    },
    {
      code: 503,
      message: "service unavailable",
    },
    {
      code: 504,
      message: "gateway timeout",
    }
  ];

  const cats = [
    "😺",
    "😹",
    "😻",
    "😼",
    "😽",
    "🙀",
    "😿",
  ]

  const catEmoji = cats[Math.floor(Math.random() * cats.length)];

  const toggleButton = document.createElement("button");
  toggleButton.innerText = catEmoji;
  toggleButton.style.position = "fixed";
  toggleButton.style.bottom = "0px";
  toggleButton.style.right = "0px";
  toggleButton.style.zIndex = "9999";
  toggleButton.style.padding = "10px";
  toggleButton.style.borderTop = "1px solid #1a1a1a75";
  toggleButton.style.borderLeft = "1px solid #1a1a1a75";
  toggleButton.style.borderRadius = "20px 0 0 0";
  toggleButton.style.backgroundColor = "#1a1a1a50";
  toggleButton.style.backdropFilter = "blur(10px)";
  toggleButton.style.fontSize = "20px";
  toggleButton.style.cursor = "pointer";
  toggleButton.title = "Abrir popup";

  const isEnabled = localStorage.getItem("catErrorsDisabled") !== "true";

  // Cria o painel de popup
  const popup = document.createElement("div");
  popup.innerHTML = `
    <h2 style="margin: 0; font-size: 32px; font: bold;">${catEmoji}${catEmoji}${catEmoji}</h2>
    <div style="margin-top: 10px; font-size: 14px; line-height: 1.5;">
        <button id="toggle" style="margin-top: 10px; padding: 5px 10px; font-size: 14px; border-radius: 100px; background-color: #1a1a1a; border: 1px #2a2a2a solid; color: white; cursor: pointer;">${isEnabled ? text.permDisableBtn : text.enableButton}</button>
    </div>
  `;
  popup.style.position = "fixed";
  popup.style.bottom = "70px";
  popup.style.right = "0";
  popup.style.width = "250px";
  popup.style.display = "none"
  popup.style.padding = "15px";
  popup.style.backgroundColor = "#1a1a1a50";
  popup.style.backdropFilter = "blur(10px)";
  popup.style.color = "#fff";
  popup.style.border = "1px solid #1a1a1a75";
  popup.style.borderStartStartRadius = "8px";
  popup.style.borderEndStartRadius = "8px";

  toggleButton.addEventListener("click", () => {
    popup.style.display = popup.style.display === "none" ? "block" : "none";
  });

  document.addEventListener("click", (event) => {
    if (!popup.contains(event.target) && event.target !== toggleButton) {
      popup.style.display = "none";
    }
  });

  document.body.appendChild(toggleButton);
  document.body.appendChild(popup);

  function toggleCatErrors() {
    const isDisabled = localStorage.getItem("catErrorsDisabled") === "true";
    if (isDisabled) {
      localStorage.removeItem("catErrorsDisabled");
      popup.querySelector("button").innerText = text.permDisableBtn;
    } else {
      localStorage.setItem("catErrorsDisabled", "true");
      popup.querySelector("button").innerText = text.enableButton;
    }
  }
  
  popup.querySelector("#toggle").addEventListener("click", toggleCatErrors);

  const disabled = localStorage.getItem("catErrorsDisabled");
  if (disabled === "temp") {
    localStorage.removeItem("catErrorsDisabled");
    return;
  }
  if (disabled) return;


  function restorePage(){
    localStorage.setItem("catErrorsDisabled", "temp");
    location.reload();
  }

  function disableCatErrors() {
    localStorage.setItem("catErrorsDisabled", "true");
    location.reload();
  }


  errors.forEach(error => {
    console.log(`Cat Error: ${error.code} - ${error.message}`);
    if (document.title.toLowerCase().includes(error.code) || document.body.innerText.toLowerCase().includes(error.message)) {
      document.body.innerHTML = `
        <div style="display:flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: Arial, sans-serif;">
          <img src="https://http.cat/${error.code}" alt="Gato" style="max-width: 100%; height: auto; border-radius: 32px;">
          <div style="margin-top: 20px;">
            <button style="padding: 10px 20px; font-size: 16px; border-radius: 8px; background-color: #4CAF50; color: white; border: none; cursor: pointer;" id="restore">${text.tempDisableBtn}</button>
            <button style="padding: 10px 20px; font-size: 16px; border-radius: 8px; background-color: #f44336; color: white; border: none; cursor: pointer; margin-left: 10px;" id="disable">${text.permDisableBtn}</button>
          </div>
        </div>
      `;
      document.body.style.height = "100vh";
      
    }

    document.getElementById("restore")?.addEventListener("click", restorePage);
    document.getElementById("disable")?.addEventListener("click", disableCatErrors);
  });
})();